// =============================
// Dynamic XML → CSV Converter (Clean & Robust)
// =============================

// DOM References
const fileInputCsv = document.getElementById("fileInputCsv01");
const generateBtnCsv = document.getElementById("generateBtnCsv01");
const xmlPreviewPanel = document.getElementById("xmlPreviewPanelCsv01");
const csvPreview = document.getElementById("csvPreview01");
const toast = document.getElementById("toastJson");
const copyCsvBtn = document.getElementById("copyCsvBtn01");
const exportCsvBtn = document.getElementById("exportCsvBtn01");

let uploadedXmlDoc = null;

// ------------------ XML Parsing ------------------
function parseXml(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
      const parseError = xmlDoc.getElementsByTagName("parsererror")[0];
      if (parseError) throw new Error(parseError.textContent);
      callback(xmlDoc);
    } catch (err) {
      xmlPreviewPanel.innerHTML = `<div class="small red">Error parsing XML: ${err.message}</div>`;
    }
  };
  reader.readAsText(file);
}

// ------------------ Render XML Preview ------------------
function renderXmlPreview(xmlDoc) {
  xmlPreviewPanel.innerHTML = "";
  const serializer = new XMLSerializer();
  const xmlString = formatXml(serializer.serializeToString(xmlDoc));
  const pre = document.createElement("pre");
  pre.textContent = xmlString;
  pre.style.whiteSpace = "pre-wrap";
  pre.style.wordBreak = "break-word";
  xmlPreviewPanel.appendChild(pre);
}

// ------------------ Pretty Formatter ------------------
function formatXml(xml) {
  const PADDING = "  ";
  const reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, "$1\r\n$2$3");
  let pad = 0;
  return xml
    .split("\r\n")
    .map((node) => {
      let indent = 0;
      if (node.match(/^<\/\w/)) pad = Math.max(pad - 1, 0);
      else if (node.match(/^<\w([^>]*[^/])?>.*$/)) indent = 1;
      const line = PADDING.repeat(pad) + node;
      pad += indent;
      return line;
    })
    .join("\r\n")
    .trim();
}

// ------------------ Convert Nested XML to Clean CSV ------------------


function convertNestedXmlToCsv(xmlDoc) {
  const tables = new Map();
  const nodeIdMap = new WeakMap(); // Track unique node IDs
  const idCounters = new Map();

  function generateId(tableName) {
    if (!idCounters.has(tableName)) idCounters.set(tableName, 1);
    const id = idCounters.get(tableName);
    idCounters.set(tableName, id + 1);
    return id;
  }

  function processNode(node, parentTable = null, parentId = null) {
    if (!node || typeof node !== "object" || !node.tagName) return;

    // Avoid processing the same node multiple times
    if (nodeIdMap.has(node)) return;
    
    const tableName = node.tagName.toLowerCase();
    if (!tables.has(tableName)) {
      tables.set(tableName, { headers: new Set(), rows: [] });
    }
    const table = tables.get(tableName);

    // Generate or reuse node ID
    let rowId = node.getAttribute("id") || generateId(tableName);
    nodeIdMap.set(node, rowId);

    const row = { id: rowId };
    table.headers.add("id");

    // Parent reference
    if (parentTable && parentId) {
      const parentKey = `${parentTable}_id`;
      row[parentKey] = parentId;
      table.headers.add(parentKey);
    }

    // Add attributes
    for (const attr of node.attributes) {
      row[attr.name] = attr.value;
      table.headers.add(attr.name);
    }

    // Simple children as columns
    const simpleChildren = Array.from(node.children).filter(c => c.children.length === 0 && c.textContent.trim());
    simpleChildren.forEach(c => {
      row[c.tagName.toLowerCase()] = c.textContent.trim();
      table.headers.add(c.tagName.toLowerCase());
    });

    table.rows.push(row);

    // Nested children (repeating or single)
    const nestedChildren = Array.from(node.children).filter(c => c.children.length > 0);
    nestedChildren.forEach(child => processNode(child, tableName, rowId));
  }

  processNode(xmlDoc.documentElement);

  // Convert tables to CSV
  let result = "";
  for (const [tableName, table] of tables) {
    if (!table.rows.length) continue;
    const headers = Array.from(table.headers);
    const csvRows = [headers.join(",")];
    table.rows.forEach(row => {
      const values = headers.map(h => {
        const val = row[h] !== undefined ? row[h] : "";
        const escaped = String(val).replace(/"/g, '""');
        return escaped.includes(",") || escaped.includes('"') || escaped.includes("\n") ? `"${escaped}"` : escaped;
      });
      csvRows.push(values.join(","));
    });
    result += `=== ${tableName}.csv ===\n${csvRows.join("\n")}\n\n`;
  }
  return result.trim();
}


// ------------------ File Upload ------------------
fileInputCsv.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  parseXml(file, (xmlDoc) => {
    uploadedXmlDoc = xmlDoc;
    renderXmlPreview(uploadedXmlDoc);
    generateBtnCsv.disabled = false;
  });
});

// ------------------ Generate CSV ------------------
generateBtnCsv.addEventListener("click", () => {
  if (!uploadedXmlDoc) return;

  try {
    const csv = convertNestedXmlToCsv(uploadedXmlDoc);
    csvPreview.value = csv;
    csvPreview.closest(".csvx-excel-panel").classList.add("visible");
    csvPreview.scrollIntoView({ behavior: "smooth" });
    showToast("✅ Conversion Successful!");
  } catch (err) {
    showToast("❌ Error converting XML to CSV: " + err.message);
    console.error(err);
  }
});

// ------------------ Copy CSV ------------------
copyCsvBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(csvPreview.value);
  showToast("📋 Copied to Clipboard!");
});

// ------------------ Export CSV ------------------
exportCsvBtn.addEventListener("click", () => {
  const blob = new Blob([csvPreview.value], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "converted_data.csv";
  a.click();
  URL.revokeObjectURL(a.href);
});

// ------------------ Show Toast ------------------
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
