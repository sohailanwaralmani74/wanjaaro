/* ===================================================================
   SQL to Multi‑Sheet Excel Engine (Advanced)
   =================================================================== */

class SqlToExcelEngine {
  parse(sql) {
    return this._parseSql(sql);
  }

  toWorkbook(tables) {
    const workbook = { Sheets: {}, SheetNames: [] };
    for (const [tableName, rows] of Object.entries(tables)) {
      if (rows.length === 0) continue;
      const sheetName = this._sanitizeSheetName(tableName);
      const ws = this._rowsToWorksheet(rows);
      workbook.Sheets[sheetName] = ws;
      workbook.SheetNames.push(sheetName);
    }
    return workbook;
  }

  download(sql, filename = 'data.xlsx', bookType = 'xlsx') {
    const tables = this.parse(sql);
    const workbook = this.toWorkbook(tables);
    if (workbook.SheetNames.length === 0) throw new Error('No data to export');
    const wbout = XLSX.write(workbook, { bookType, type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  _parseSql(sql) {
    const tables = {};
    const statements = this._splitStatements(sql);
    for (const stmt of statements) {
      if (!stmt.toUpperCase().startsWith('INSERT')) continue;
      const insert = this._parseInsertStatement(stmt);
      if (!insert) continue;
      const { tableName, columns, rows } = insert;
      if (!tables[tableName]) tables[tableName] = [];
      for (const row of rows) {
        const rowObj = {};
        for (let i = 0; i < columns.length; i++) {
          const rawValue = row[i] !== undefined ? row[i] : null;
          rowObj[columns[i]] = this._cleanValue(rawValue);
        }
        tables[tableName].push(rowObj);
      }
    }
    return tables;
  }

  _splitStatements(sql) {
    const statements = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';
    for (let i = 0; i < sql.length; i++) {
      const ch = sql[i];
      if (!inQuote && (ch === "'" || ch === '"')) {
        inQuote = true;
        quoteChar = ch;
        current += ch;
      } else if (inQuote && ch === quoteChar && sql[i-1] !== '\\') {
        inQuote = false;
        current += ch;
      } else if (!inQuote && ch === ';') {
        if (current.trim()) statements.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim()) statements.push(current.trim());
    return statements;
  }

  _parseInsertStatement(stmt) {
    let clean = stmt.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    const insertMatch = clean.match(/INSERT\s+INTO\s+([^\s(;]+)/i);
    if (!insertMatch) return null;
    let tableName = insertMatch[1].replace(/[`"[\]]/g, '');
    let columns = [];
    let afterTable = clean.slice(insertMatch.index + insertMatch[0].length).trim();
    if (afterTable.startsWith('(')) {
      const colMatch = afterTable.match(/^\(([^)]+)\)/);
      if (colMatch) {
        columns = colMatch[1].split(',').map(c => c.trim().replace(/[`"[\]]/g, ''));
        afterTable = afterTable.slice(colMatch[0].length).trim();
      }
    }
    const valuesIdx = afterTable.toUpperCase().indexOf('VALUES');
    if (valuesIdx === -1) return null;
    let valuesPart = afterTable.slice(valuesIdx + 6).trim();
    const rows = [];
    let depth = 0;
    let start = -1;
    for (let i = 0; i < valuesPart.length; i++) {
      const ch = valuesPart[i];
      if (ch === '(') {
        if (depth === 0) start = i;
        depth++;
      } else if (ch === ')') {
        depth--;
        if (depth === 0 && start !== -1) {
          const rowContent = valuesPart.substring(start + 1, i);
          const values = this._splitValuesRow(rowContent);
          rows.push(values);
          start = -1;
        }
      }
    }
    if (!rows.length) return null;
    if (columns.length === 0) {
      columns = rows[0].map((_, idx) => `column_${idx+1}`);
    }
    return { tableName, columns, rows };
  }

  _splitValuesRow(rowStr) {
    const values = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';
    let parenDepth = 0;
    for (let i = 0; i < rowStr.length; i++) {
      const ch = rowStr[i];
      if (!inQuote && (ch === "'" || ch === '"')) {
        inQuote = true;
        quoteChar = ch;
        current += ch;
      } else if (inQuote && ch === quoteChar && rowStr[i-1] !== '\\') {
        inQuote = false;
        current += ch;
      } else if (!inQuote && ch === ',' && parenDepth === 0) {
        values.push(current.trim());
        current = '';
      } else {
        if (ch === '(') parenDepth++;
        if (ch === ')') parenDepth--;
        current += ch;
      }
    }
    if (current.trim()) values.push(current.trim());
    return values;
  }

  _cleanValue(value) {
    if (!value) return '';
    const upper = value.toUpperCase();
    if (upper === 'NULL') return '';
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      return value.slice(1, -1).replace(/''/g, "'").replace(/\\\\/g, '\\');
    }
    return value;
  }

  _rowsToWorksheet(rows) {
    if (!rows.length) return XLSX.utils.aoa_to_sheet([]);
    const headers = Object.keys(rows[0]);
    const data = [headers, ...rows.map(row => headers.map(h => row[h] !== undefined ? row[h] : ''))];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = headers.map(() => ({ wch: 20 }));
    return ws;
  }

  _sanitizeSheetName(name) {
    let sanitized = name.replace(/[\\/:*?\[\]]/g, '_');
    if (sanitized.length > 31) sanitized = sanitized.substring(0, 31);
    return sanitized;
  }
}

/* ================= GLOBAL STATE ================= */
let parsedTables = {};
let currentTableName = '';

/* ================= DOM ELEMENTS ================= */
const sqlInputPreview = document.getElementById("sqlInputPreview");
const sqlFileInput = document.getElementById("sqlFileInput");
const sqlConvertBtn = document.getElementById("sqlConvertBtn");
const sqlExcelPanel = document.getElementById("sqlExcelPanel");
const sqlExcelPreview = document.getElementById("sqlExcelPreview");
const exportXlsBtn = document.getElementById("exportXlsBtn");
const exportXlsxBtn = document.getElementById("exportXlsxBtn");
const downloadAllBtn = document.getElementById("downloadAllBtn");
const tableSelector = document.getElementById("tableSelector");
const globalToast = document.getElementById("sql-excel-toast");

/* ================= TOAST ================= */
function showToast(msg) {
  if (!globalToast) return;
  globalToast.innerText = msg;
  globalToast.classList.add("show");
  setTimeout(() => globalToast.classList.remove("show"), 2500);
}

/* ================= BUTTON STATE ================= */
function updateButtonState() {
  const text = sqlInputPreview.innerText.trim();
  sqlConvertBtn.disabled = text.length === 0;
}
sqlInputPreview.addEventListener("input", updateButtonState);
sqlInputPreview.addEventListener("keyup", updateButtonState);
sqlInputPreview.addEventListener("paste", () => setTimeout(updateButtonState, 50));

/* ================= FILE UPLOAD ================= */
sqlFileInput.addEventListener("change", handleFile);
function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    sqlInputPreview.innerText = evt.target.result;
    updateButtonState();
    showToast("SQL file loaded");
  };
  reader.readAsText(file);
}

/* ================= CONVERT ================= */
sqlConvertBtn.addEventListener("click", convertSQL);

function convertSQL() {
  const sql = sqlInputPreview.innerText.trim();
  if (!sql) {
    showToast("Empty SQL input");
    return;
  }
  try {
    const engine = new SqlToExcelEngine();
    parsedTables = engine.parse(sql);
    const tableNames = Object.keys(parsedTables);
    if (tableNames.length === 0) {
      showToast("No INSERT statements found");
      tableSelector.innerHTML = '<option value="">-- No tables --</option>';
      sqlExcelPreview.innerHTML = "";
      return;
    }

    // Populate dropdown
    tableSelector.innerHTML = tableNames.map(tn => `<option value="${tn}">${tn}</option>`).join('');
    currentTableName = tableNames[0];
    tableSelector.value = currentTableName;
    renderGridForTable(currentTableName);

    sqlExcelPanel.style.display = "block";
    sqlExcelPanel.scrollIntoView({ behavior: "smooth" });
    showToast(`Loaded ${tableNames.length} table(s). Preview: ${currentTableName}`);
  } catch (err) {
    console.error(err);
    showToast("Conversion failed: " + err.message);
  }
}

/* ================= TABLE SELECTOR CHANGE ================= */
tableSelector.addEventListener("change", (e) => {
  currentTableName = e.target.value;
  if (currentTableName && parsedTables[currentTableName]) {
    renderGridForTable(currentTableName);
  } else {
    sqlExcelPreview.innerHTML = "<div style='color:#aaa; padding:1rem;'>No data to preview</div>";
  }
});

/* ================= RENDER GRID ================= */
function renderGridForTable(tableName) {
  const rows = parsedTables[tableName];
  if (!rows || !rows.length) {
    sqlExcelPreview.innerHTML = "<div style='color:#aaa; padding:1rem;'>No data to preview</div>";
    return;
  }
  const columns = Object.keys(rows[0]);
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `overflow:auto; max-height:350px; border:1px solid #222; border-radius:6px;`;
  const table = document.createElement("table");
  table.style.cssText = `border-collapse:collapse; width:max-content; min-width:100%; font-family:sans-serif;`;

  // Header
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  columns.forEach(col => {
    const th = document.createElement("th");
    th.innerText = col;
    th.style.cssText = `position:sticky; top:0; background:#000; color:#fff; border:1px solid #333; padding:8px; white-space:nowrap; z-index:10;`;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement("tbody");
  rows.forEach((row, i) => {
    const tr = document.createElement("tr");
    columns.forEach(col => {
      const td = document.createElement("td");
      td.innerText = row[col] !== undefined ? row[col] : "";
      td.style.cssText = `border:1px solid #2a2a2a; padding:8px; white-space:nowrap; background:${i % 2 === 0 ? "#111" : "#0d0d0d"}; color:#ddd;`;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrapper.appendChild(table);
  sqlExcelPreview.innerHTML = "";
  sqlExcelPreview.appendChild(wrapper);
}

/* ================= EXPORT FUNCTIONS ================= */
function exportExcel(type, exportAll = false) {
  const sql = sqlInputPreview.innerText.trim();
  if (!sql) {
    showToast("Nothing to export – convert SQL first");
    return;
  }
  if (Object.keys(parsedTables).length === 0) {
    showToast("No data – please convert SQL first");
    return;
  }
  try {
    const engine = new SqlToExcelEngine();
    const bookType = type === 'xls' ? 'xls' : 'xlsx';

    let tablesToExport;
    let baseName;
    if (exportAll) {
      tablesToExport = parsedTables;
      const tableNames = Object.keys(tablesToExport);
      if (tableNames.length === 1) {
        baseName = tableNames[0];
      } else {
        baseName = tableNames.slice(0, 3).join('_');
        if (tableNames.length > 3) baseName += '_and_more';
      }
    } else {
      // Export only the selected table
      if (!currentTableName || !parsedTables[currentTableName]) {
        showToast("No table selected");
        return;
      }
      tablesToExport = { [currentTableName]: parsedTables[currentTableName] };
      baseName = currentTableName;
    }

    const workbook = engine.toWorkbook(tablesToExport);
    if (workbook.SheetNames.length === 0) throw new Error('No data to export');
    const wbout = XLSX.write(workbook, { bookType, type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${baseName}.${bookType}`;
    link.click();
    URL.revokeObjectURL(url);

    const sheetCount = workbook.SheetNames.length;
    showToast(`Downloaded ${sheetCount} sheet(s) as ${baseName}.${bookType}`);
  } catch (err) {
    console.error(err);
    showToast("Export failed: " + err.message);
  }
}

exportXlsBtn.addEventListener("click", () => exportExcel("xls", false));      // single selected table
exportXlsxBtn.addEventListener("click", () => exportExcel("xlsx", false));   // single selected table
downloadAllBtn.addEventListener("click", () => exportExcel("xlsx", true));   // all tables