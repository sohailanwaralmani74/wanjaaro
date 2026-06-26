// ------------------ Utilities ------------------
function createTableFromArray(array) {
  if (!array || array.length === 0) return null;
  const table = document.createElement('table');
  table.className = 'sheet';
  const thead = document.createElement('thead'), tbody = document.createElement('tbody');

  const headerRow = document.createElement('tr');
  array[0].forEach((h, i) => {
    const th = document.createElement('th');
    th.textContent = h || 'Column ' + (i + 1);
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  for (let r = 1; r < array.length; r++) {
    const tr = document.createElement('tr');
    array[r].forEach((cell, c) => {
      const td = document.createElement('td');
      td.textContent = cell || '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

function buildJsonFromArray(array) {
  if (!array || array.length < 2) return [];
  const headers = array[0];
  const jsonArr = [];
  for (let r = 1; r < array.length; r++) {
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = array[r][c] || "";
    }
    jsonArr.push(obj);
  }
  return jsonArr;
}

// ------------------ DOM + Logic ------------------
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const convertBtn = document.getElementById('convertBtn');
const csvPreview = document.getElementById('csvPreview'); // keep same id for compatibility
const jsonPanel = document.getElementById('jsonPanel');
const jsonPreview = document.getElementById('jsonPreview');
const copyJsonBtn = document.getElementById('copyJsonBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const toast = document.getElementById('toast');

let parsedArray = null;

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    const data = new Uint8Array(ev.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    parsedArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    csvPreview.innerHTML = '';
    const table = createTableFromArray(parsedArray);
    if (table) csvPreview.appendChild(table);
    convertBtn.disabled = false;
    jsonPanel.classList.remove('visible');
  };
  reader.readAsArrayBuffer(file);
});

convertBtn.addEventListener('click', () => {
  // read current Excel table (even after edits)
  const table = csvPreview.querySelector('table');
  if (!table) return;

  const rows = Array.from(table.rows);
  const array = rows.map(row => Array.from(row.cells).map(cell => cell.textContent));

  parsedArray = array; // update global
  const jsonObj = buildJsonFromArray(parsedArray);

  jsonPreview.value = JSON.stringify(jsonObj, null, 2); // formatted JSON
  jsonPanel.classList.add('visible');

  showToast('✅ Conversion Successful!');
});

copyJsonBtn.addEventListener('click', () => {
  jsonPreview.select();
  document.execCommand('copy');
  showToast('📋 JSON Copied!');
});

exportJsonBtn.addEventListener('click', () => {
  const blob = new Blob([jsonPreview.value], { type: "application/json" });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "converted.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    jsonPanel.scrollIntoView({ behavior: 'smooth' });
  }, 2000);
}
