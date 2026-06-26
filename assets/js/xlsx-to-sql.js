// ------------------ Excel To SQL Tool (Standalone) ------------------

// DOM references
const fileInputSql = document.getElementById('fileInputSql');
const convertBtnSql = document.getElementById('convertBtnSql');
const csvPreviewSql = document.getElementById('csvPreviewSql'); // keep same id
const sqlPreview = document.getElementById('sqlPreview');
const sqlPanel = document.getElementById('sqlPanel');
const toastSql = document.getElementById('toastSql');
const copySqlBtn = document.getElementById('copySqlBtn');
const exportSqlBtn = document.getElementById('exportSqlBtn');

let parsedArraySql = null;

// ------------------ Excel Parser ------------------
function parseExcel(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
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
  array[0].forEach((cellText) => {
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
    array[r].forEach((cellText) => {
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
fileInputSql.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  parseExcel(file, (array) => {
    parsedArraySql = array;
    renderCsvPreview(parsedArraySql); // keep function name same
    convertBtnSql.disabled = false;
    sqlPanel.classList.remove('visible');
  });
});

// ------------------ Render Excel Preview ------------------
function renderCsvPreview(array) {
  csvPreviewSql.innerHTML = '';
  if (!array || array.length === 0) {
    csvPreviewSql.innerHTML = '<div class="small">Excel file empty or failed to parse.</div>';
    return;
  }
  const table = createTableFromArray(array);
  csvPreviewSql.appendChild(table);
}

// ------------------ Convert Excel To SQL ------------------
convertBtnSql.addEventListener('click', () => {
  const table = csvPreviewSql.querySelector('table');
  if (!table) return;

  const array = Array.from(table.rows).map((row) =>
    Array.from(row.cells).map((cell) => cell.textContent)
  );

  parsedArraySql = array;
  const headers = array[0];
  const rows = array.slice(1);
  let sqlOutput = '';

  rows.forEach((row) => {
    const values = row.map((cell) => `'${cell.replace(/'/g, "''")}'`).join(', ');
    sqlOutput += `INSERT INTO table_name (${headers.join(', ')}) VALUES (${values});\n`;
  });

  sqlPreview.value = sqlOutput;
  sqlPreview.style.fontFamily = 'monospace';
  sqlPreview.style.fontSize = '14px';
  sqlPanel.classList.add('visible');

  toastSql.textContent = '✅ Conversion Successful!';
  toastSql.classList.add('show');
  setTimeout(() => {
    toastSql.classList.remove('show');
    sqlPanel.scrollIntoView({ behavior: 'smooth' });
  }, 2000);
});

// ------------------ Copy SQL ------------------
copySqlBtn.addEventListener('click', () => {
  sqlPreview.select();
  document.execCommand('copy');
  toastSql.textContent = '✅ SQL Copied to Clipboard!';
  toastSql.classList.add('show');
  setTimeout(() => toastSql.classList.remove('show'), 2000);
});

// ------------------ Export SQL ------------------
exportSqlBtn.addEventListener('click', () => {
  const blob = new Blob([sqlPreview.value], { type: 'text/sql' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'converted.sql';
  a.click();
  URL.revokeObjectURL(a.href);
});
