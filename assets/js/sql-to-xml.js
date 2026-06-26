/* =========================
   ENHANCED SQL → XML ENGINE (configurable)
========================= */

class SqlToXmlEngine {
  constructor(options = {}) {
    this.options = {
      rootTag: 'database',
      tableTag: 'table',
      rowTag: 'row',
      tableNameAttr: 'name',
      includeXmlDecl: true,
      indent: true,
      namespace: null,
      xmlStyle: 'elements',
      omitEmptyColumns: false,
      ...options,
    };
  }

  convert(sql) {
    if (!sql || typeof sql !== 'string') throw new Error('SQL input required');
    const tables = this._parseSql(sql);
    return this._buildXml(tables);
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

  _buildXml(tables) {
    const parts = [];
    if (this.options.includeXmlDecl) parts.push('<?xml version="1.0" encoding="UTF-8"?>');
    const ns = this.options.namespace;
    const rootOpen = ns
      ? `<${ns.prefix ? ns.prefix + ':' : ''}${this.options.rootTag} xmlns${ns.prefix ? ':' + ns.prefix : ''}="${ns.uri}">`
      : `<${this.options.rootTag}>`;
    parts.push(rootOpen);

    for (const [tableName, rows] of Object.entries(tables)) {
      const tableOpen = this._indent(1) + `<${this.options.tableTag} ${this.options.tableNameAttr}="${this._escapeXml(tableName)}">`;
      parts.push(tableOpen);

      if (this.options.xmlStyle === 'attributes') {
        for (const row of rows) {
          const attrs = [];
          for (const [col, val] of Object.entries(row)) {
            if (this.options.omitEmptyColumns && (val === '' || val === null)) continue;
            attrs.push(`${this._escapeXml(col)}="${this._escapeXml(String(val))}"`);
          }
          parts.push(this._indent(2) + `<${this.options.rowTag} ${attrs.join(' ')} />`);
        }
      } else if (this.options.xmlStyle === 'flat') {
        for (const row of rows) {
          for (const [col, val] of Object.entries(row)) {
            if (this.options.omitEmptyColumns && (val === '' || val === null)) continue;
            parts.push(this._indent(2) + `<${this._escapeXml(col)}>${this._escapeXml(String(val))}</${this._escapeXml(col)}>`);
          }
        }
      } else { // elements
        for (const row of rows) {
          parts.push(this._indent(2) + `<${this.options.rowTag}>`);
          for (const [col, val] of Object.entries(row)) {
            if (this.options.omitEmptyColumns && (val === '' || val === null)) continue;
            parts.push(this._indent(3) + `<${this._escapeXml(col)}>${this._escapeXml(String(val))}</${this._escapeXml(col)}>`);
          }
          parts.push(this._indent(2) + `</${this.options.rowTag}>`);
        }
      }
      parts.push(this._indent(1) + `</${this.options.tableTag}>`);
    }
    parts.push(`</${this.options.rootTag}>`);
    let xml = parts.join('\n');
    if (this.options.indent) xml = this._formatXml(xml);
    return xml;
  }

  _indent(level) { return this.options.indent ? '  '.repeat(level) : ''; }
  _escapeXml(str) { return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); }
  _formatXml(xml) {
    let formatted = '', indent = 0;
    const lines = xml.split(/\r?\n/);
    for (let line of lines) {
      line = line.trim();
      if (line.match(/^<\/[^>]+>/)) indent--;
      formatted += '  '.repeat(indent) + line + '\n';
      if (line.match(/^<[^!?/][^>]*[^/]>$/)) indent++;
    }
    return formatted.trim();
  }
}

/* =========================
   UI ELEMENTS (original IDs)
========================= */

let generatedXML = "";

const sqlXmlInput = document.getElementById("sqlXmlInputPreview");
const sqlXmlFileInput = document.getElementById("sqlXmlFileInput");
const sqlXmlConvertBtn = document.getElementById("sqlXmlConvertBtn");
const sqlXmlOutputPanel = document.getElementById("sqlXmlOutputPanel");
const sqlXmlPreview = document.getElementById("sqlXmlPreview");
const downloadXmlBtn = document.getElementById("downloadXmlBtn");
const copyXmlBtn = document.getElementById("copyXmlBtn");
const sqlXmlToast = document.getElementById("sql-xml-toast");

/* =========================
   TOAST
========================= */
function showToast(message) {
  sqlXmlToast.textContent = message;
  sqlXmlToast.classList.add("show");
  setTimeout(() => sqlXmlToast.classList.remove("show"), 2500);
}

/* =========================
   ENABLE BUTTON
========================= */
function updateConvertButton() {
  const text = sqlXmlInput.innerText.trim();
  sqlXmlConvertBtn.disabled = !text;
}
sqlXmlInput.addEventListener("input", updateConvertButton);
sqlXmlInput.addEventListener("paste", () => setTimeout(updateConvertButton, 50));
sqlXmlInput.addEventListener("keyup", updateConvertButton);

/* =========================
   FILE UPLOAD
========================= */
sqlXmlFileInput.addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(event) {
    sqlXmlInput.innerText = event.target.result;
    updateConvertButton();
    showToast("SQL file loaded");
  };
  reader.readAsText(file);
});

/* =========================
   CONVERT (reads config from UI)
========================= */
sqlXmlConvertBtn.addEventListener("click", function() {
  const sql = sqlXmlInput.innerText.trim();
  if (!sql) {
    showToast("Empty SQL input");
    return;
  }
  try {
    const xmlStyle = document.getElementById('xmlStyleSelect').value;
    const rootTag = document.getElementById('rootTagInput').value.trim() || 'database';
    const tableTag = document.getElementById('tableTagInput').value.trim() || 'table';
    const rowTag = document.getElementById('rowTagInput').value.trim() || 'row';
    const namespaceUri = document.getElementById('namespaceInput').value.trim();
    const namespacePrefix = document.getElementById('namespacePrefixInput').value.trim();
    let namespace = null;
    if (namespaceUri) {
      namespace = { uri: namespaceUri, prefix: namespacePrefix || '' };
    }
    const engine = new SqlToXmlEngine({
      rootTag, tableTag, rowTag,
      tableNameAttr: 'name',
      includeXmlDecl: true,
      indent: true,
      namespace,
      xmlStyle,
      omitEmptyColumns: false,
    });
    generatedXML = engine.convert(sql);
    sqlXmlPreview.textContent = generatedXML;
    sqlXmlOutputPanel.style.display = "block";
    sqlXmlOutputPanel.scrollIntoView({ behavior: "smooth" });
    showToast("XML generated");
  } catch (err) {
    console.error(err);
    showToast("Invalid SQL: " + err.message);
  }
});

/* =========================
   COPY XML
========================= */
copyXmlBtn.addEventListener("click", () => {
  if (!generatedXML) {
    showToast("Nothing to copy");
    return;
  }
  navigator.clipboard.writeText(generatedXML);
  showToast("XML copied");
});

/* =========================
   DOWNLOAD XML
========================= */
downloadXmlBtn.addEventListener("click", () => {
  if (!generatedXML) {
    showToast("Nothing to download");
    return;
  }
  const blob = new Blob([generatedXML], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.xml";
  a.click();
  URL.revokeObjectURL(url);
  showToast("XML downloaded");
});