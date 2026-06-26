// =============================
// JSON → CSV Converter (FIXED)
// =============================

// DOM Elements
const jsonInputEditor = document.getElementById("jsonInputEditor");
const jsonPreviewArea = document.getElementById("jsonPreviewArea");
const convertBtnJson = document.getElementById("convertBtnJson");
const outputArea = document.getElementById("outputArea");
const copyOutputBtn = document.getElementById("copyOutputBtn");
const exportOutputBtn = document.getElementById("exportOutputBtn");
const toastJson = document.getElementById("toastJson");
const fileInputJson = document.getElementById("fileInputJson");
const flattenToggle = document.getElementById("flattenToggle"); // optional checkbox

let parsedJson = null;

// ========== Toast ==========
function showToast(message) {
  toastJson.textContent = message;
  toastJson.classList.add("show");
  clearTimeout(toastJson._timer);
  toastJson._timer = setTimeout(() => toastJson.classList.remove("show"), 2500);
}

// ========== JSON Preview (fallback if JSONView not loaded) ==========
function renderJsonPreview(json) {
  if (typeof jsonPreviewArea.JSONView === "function") {
    jsonPreviewArea.JSONView(json, { collapsed: false });
    return;
  }
  // Fallback: pretty‑print with syntax highlighting (simple)
  try {
    const html = `<pre style="color:#d4d4d4;background:#1b1b1b;padding:10px;border-radius:4px;overflow:auto;max-height:400px;">${JSON.stringify(json, null, 2)}</pre>`;
    jsonPreviewArea.innerHTML = html;
  } catch (e) {
    jsonPreviewArea.innerHTML = '<div class="jsonx-error">❌ Invalid JSON</div>';
  }
}

// ========== Update Preview ==========
function updateJsonPreview() {
  const text = jsonInputEditor.value.trim();

  if (!text) {
    renderJsonPreview({});
    convertBtnJson.disabled = true;
    parsedJson = null;
    return;
  }

  try {
    parsedJson = JSON.parse(text);
    renderJsonPreview(parsedJson);
    convertBtnJson.disabled = false;
  } catch (e) {
    jsonPreviewArea.innerHTML = '<div class="jsonx-error">❌ Invalid JSON</div>';
    convertBtnJson.disabled = true;
    parsedJson = null;
  }
}

// Live typing
jsonInputEditor.addEventListener("input", updateJsonPreview);

// ========== File Upload ==========
fileInputJson.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    jsonInputEditor.value = ev.target.result;
    updateJsonPreview();
  };
  reader.readAsText(file);
});

// ========== JSON → CSV Converter (Improved & Fixed) ==========
function jsonToCsv(jsonInput, options = {}) {
  // options.flattenObjects: true = flatten nested objects into parent row
  //                         false = extract them as separate tables
  const flattenObjects = options.flattenObjects !== undefined ? options.flattenObjects : true;

  let data;
  try {
    data = typeof jsonInput === "string" ? JSON.parse(jsonInput) : jsonInput;
  } catch (e) {
    return "Invalid JSON";
  }
  if (!data) return "Empty JSON";

  const tables = {};
  const visited = new WeakSet(); // circular reference detection
  let globalRowId = 0;

  // Generate a unique table name from the path
  function getTableName(path) {
    if (!path) return "root";
    // Replace non‑alphanumeric with underscore, but keep dot? Use underscore.
    return path.replace(/[^a-zA-Z0-9]/g, '_');
  }

  // Recursive processing
  function processNode(node, path = '', parentTable = null, parentRowId = null) {
    // Handle primitive values (should not happen at top level)
    if (typeof node !== 'object' || node === null) {
      return;
    }

    // Circular reference guard
    if (visited.has(node)) return;
    visited.add(node);

    // ---- ARRAY ----
    if (Array.isArray(node)) {
      if (node.length === 0) return;

      // Check if array contains only primitives (including null)
      const isPrimitiveArray = node.every(item => typeof item !== 'object' || item === null);
      if (isPrimitiveArray) {
        // Create a single‑column table with header "value"
        const tableName = getTableName(path) || 'array';
        if (!tables[tableName]) tables[tableName] = [];

        for (let val of node) {
          const row = { value: val };
          row._rowId = ++globalRowId;
          if (parentTable && parentRowId !== null) {
            row[parentTable + '_id'] = parentRowId;
          }
          tables[tableName].push(row);
        }
        return;
      }

      // Array of objects → this is a table
      const tableName = getTableName(path) || 'root';
      if (!tables[tableName]) tables[tableName] = [];

      node.forEach((item) => {
        if (typeof item !== 'object' || item === null) return;
        const row = {};
        row._rowId = ++globalRowId;
        if (parentTable && parentRowId !== null) {
          row[parentTable + '_id'] = parentRowId;
        }

        Object.keys(item).forEach(key => {
          const value = item[key];
          if (Array.isArray(value)) {
            // Nested array – process as child table, store stringified version in parent
            const childPath = path ? path + '.' + key : key;
            processNode(value, childPath, tableName, row._rowId);
            row[key] = JSON.stringify(value);
          } else if (value && typeof value === 'object') {
            // Nested object – flatten or extract
            if (flattenObjects) {
              // Flatten: merge keys into current row with prefix
              Object.keys(value).forEach(subKey => {
                row[key + '_' + subKey] = value[subKey];
              });
            } else {
              // Extract as separate table (single row)
              const childPath = path ? path + '.' + key : key;
              processNode([value], childPath, tableName, row._rowId);
              row[key] = '[object]';
            }
          } else {
            // Primitive value
            row[key] = value;
          }
        });

        tables[tableName].push(row);
      });
      return;
    }

    // ---- SINGLE OBJECT (not array) ----
    // This handles the root object or nested objects not in arrays.
    const tableName = getTableName(path) || 'root';
    if (!tables[tableName]) tables[tableName] = [];

    const row = {};
    row._rowId = ++globalRowId;
    if (parentTable && parentRowId !== null) {
      row[parentTable + '_id'] = parentRowId;
    }

    Object.keys(node).forEach(key => {
      const value = node[key];
      if (Array.isArray(value)) {
        const childPath = path ? path + '.' + key : key;
        processNode(value, childPath, tableName, row._rowId);
        row[key] = JSON.stringify(value);
      } else if (value && typeof value === 'object') {
        if (flattenObjects) {
          Object.keys(value).forEach(subKey => {
            row[key + '_' + subKey] = value[subKey];
          });
        } else {
          const childPath = path ? path + '.' + key : key;
          processNode([value], childPath, tableName, row._rowId);
          row[key] = '[object]';
        }
      } else {
        row[key] = value;
      }
    });

    tables[tableName].push(row);
  }

  // ---- Start processing ----
  processNode(data);

  // ---- Convert each table to CSV ----
  function toCsv(rows) {
    if (!rows || rows.length === 0) return '';
    // Collect all unique headers from all rows (assuming rows are objects)
    const headerSet = new Set();
    rows.forEach(r => {
      if (typeof r === 'object' && r !== null && !Array.isArray(r)) {
        Object.keys(r).forEach(k => headerSet.add(k));
      } else {
        // Fallback: if a row is an array (should not happen after fix), treat as object with numeric keys
        // This is a safety net.
        if (Array.isArray(r)) {
          r.forEach((_, idx) => headerSet.add(String(idx)));
        }
      }
    });

    let headers = Array.from(headerSet);
    // Optional sorting: put _rowId first, then parent id columns, then alphabetically
    headers.sort((a, b) => {
      if (a === '_rowId') return -1;
      if (b === '_rowId') return 1;
      if (a.endsWith('_id')) return -1;
      if (b.endsWith('_id')) return 1;
      return a.localeCompare(b);
    });

    const csvLines = [
      headers.join(','),
      ...rows.map(row => {
        // If row is an array (safety), convert to object with numeric keys
        let obj = row;
        if (Array.isArray(row)) {
          obj = {};
          row.forEach((val, idx) => { obj[String(idx)] = val; });
        }
        return headers.map(h => {
          const val = obj[h];
          if (val === undefined || val === null) return '';
          const str = String(val);
          // Escape double quotes and wrap in quotes if needed
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return '"' + str.replace(/"/g, '""') + '"';
          }
          return str;
        }).join(',');
      })
    ];
    return csvLines.join('\n');
  }

  // Build final output with table headers
  let result = '';
  for (const [tableName, rows] of Object.entries(tables)) {
    if (rows.length === 0) continue;
    result += `\n\n=== ${tableName.toUpperCase()} TABLE ===\n`;
    result += toCsv(rows);
  }

  return result.trim() || 'No data to convert';
}

// ========== Convert Button ==========
convertBtnJson.addEventListener("click", () => {
  if (!parsedJson) {
    showToast("❌ Please enter valid JSON first.");
    return;
  }

  const flatten = flattenToggle ? flattenToggle.checked : true;
  const csv = jsonToCsv(parsedJson, { flattenObjects: flatten });

  outputArea.readOnly = false;
  outputArea.value = csv;
  outputArea.readOnly = true;

  showToast("✅ Conversion Successful!");
  document.getElementById("convertedFile").scrollIntoView({ behavior: "smooth" });
});

// ========== Copy ==========
copyOutputBtn.addEventListener("click", () => {
  if (!outputArea.value) {
    showToast("❌ Nothing to copy. Convert first.");
    return;
  }
  navigator.clipboard.writeText(outputArea.value)
    .then(() => showToast("📋 Copied to Clipboard!"))
    .catch(() => {
      outputArea.select();
      document.execCommand("copy");
      showToast("📋 Copied!");
    });
});

// ========== Export ==========
exportOutputBtn.addEventListener("click", () => {
  if (!outputArea.value) {
    showToast("❌ Nothing to export. Convert first.");
    return;
  }
  const blob = new Blob([outputArea.value], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "converted.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  showToast("📥 CSV exported!");
});

// ========== Keyboard shortcut: Ctrl+Enter ==========
jsonInputEditor.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    convertBtnJson.click();
  }
});
// ========== Initialize ==========
updateJsonPreview();