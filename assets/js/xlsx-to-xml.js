// ------------------ Excel To XML Tool (Standalone) ------------------

// DOM references
const fileInputXml = document.getElementById('fileInputXml');
const convertBtnXml = document.getElementById('convertBtnXml');
const csvPreviewXml = document.getElementById('csvPreviewXml');
const xmlPreview = document.getElementById('xmlPreview');
const xmlPanel = document.getElementById('xmlPanel');
const toastXml = document.getElementById('toastXml');
const copyXmlBtn = document.getElementById('copyXmlBtn');
const exportXmlBtn = document.getElementById('exportXmlBtn');

let parsedArrayXml = null;

// ------------------ Excel Parser ------------------
function parseExcel(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    callback(jsonData);
  };
  reader.readAsArrayBuffer(file);
}

// ------------------ Table Renderer ------------------
function createTableFromArray(array) {
  if (!array || array.length === 0) return null;
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.fontSize = '13px';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Header
  const headerRow = document.createElement('tr');
  array[0].forEach(cellText => {
    const th = document.createElement('th');
    th.textContent = cellText || '';
    th.style.border = '1px solid #444';
    th.style.padding = '6px';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Body
  for (let r = 1; r < array.length; r++) {
    const tr = document.createElement('tr');
    array[r].forEach(cellText => {
      const td = document.createElement('td');
      td.textContent = cellText || '';
      td.contentEditable = 'true';
      td.style.border = '1px solid #444';
      td.style.padding = '6px';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

// ------------------ Excel Upload ------------------
fileInputXml.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  parseExcel(file, (array) => {
    parsedArrayXml = array;
    renderExcelPreview(parsedArrayXml);
    convertBtnXml.disabled = false;
    xmlPanel.classList.remove('visible');
  });
});

// ------------------ Render Excel Preview ------------------
function renderExcelPreview(array) {
  csvPreviewXml.innerHTML = '';
  if (!array || array.length === 0) {
    csvPreviewXml.innerHTML = '<div class="small">Excel sheet is empty or failed to parse.</div>';
    return;
  }
  const table = createTableFromArray(array);
  csvPreviewXml.appendChild(table);
}

// ------------------ Convert Excel To XML ------------------
convertBtnXml.addEventListener('click', () => {
  const table = csvPreviewXml.querySelector('table');
  if (!table) return;

  // Read updated table data
  const array = Array.from(table.rows).map(row =>
    Array.from(row.cells).map(cell => cell.textContent)
  );

  parsedArrayXml = array;

  const headers = array[0];
  const rows = array.slice(1);

  let xmlOutput = '<root>\n';
  rows.forEach(row => {
    xmlOutput += '  <row>\n';
    row.forEach((cell, i) => {
      const tag = headers[i] ? headers[i].replace(/\s+/g, '_') : `column${i + 1}`;
      xmlOutput += `    <${tag}>${cell.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</${tag}>\n`;
    });
    xmlOutput += '  </row>\n';
  });
  xmlOutput += '</root>';

  xmlPreview.value = xmlOutput;
  xmlPreview.style.fontFamily = 'monospace';
  xmlPreview.style.fontSize = '14px';
  xmlPanel.classList.add('visible');

  toastXml.textContent = '✅ Conversion Successful!';
  toastXml.classList.add('show');
  setTimeout(() => {
    toastXml.classList.remove('show');
    xmlPanel.scrollIntoView({ behavior: 'smooth' });
  }, 2000);
});

// ------------------ Copy XML ------------------
copyXmlBtn.addEventListener('click', () => {
  xmlPreview.select();
  document.execCommand('copy');
  toastXml.textContent = '✅ XML Copied to Clipboard!';
  toastXml.classList.add('show');
  setTimeout(() => toastXml.classList.remove('show'), 2000);
});

// ------------------ Export XML ------------------
exportXmlBtn.addEventListener('click', () => {
  const blob = new Blob([xmlPreview.value], { type: "text/xml" });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'converted.xml';
  a.click();
  URL.revokeObjectURL(a.href);
});
