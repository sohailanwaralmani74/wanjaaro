// ------------------ Complete Excel To Text Method ------------------

// ------------------ Utility: Parse Excel File ------------------
// Requires XLSX library (SheetJS)
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

// ------------------ Utility: Create Table from Array for Preview ------------------
function createTableFromArray(array) {
  if (!array || array.length === 0) return null;
  const table = document.createElement('table');
  table.className = 'sheet';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const headerRow = document.createElement('tr');
  const headerCells = array[0];
  for (let c = 0; c < headerCells.length; c++) {
    const th = document.createElement('th');
    th.textContent = headerCells[c] || ('Column ' + (c + 1));
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);

  for (let r = 1; r < array.length; r++) {
    const tr = document.createElement('tr');
    const row = array[r];
    for (let c = 0; c < headerCells.length; c++) {
      const td = document.createElement('td');
      td.textContent = (row && row[c] !== undefined) ? row[c] : '';
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

// ------------------ DOM Elements ------------------
const fileInputText = document.getElementById('fileInputText');
const uploadBtnText = document.getElementById('uploadBtnText');
const convertBtnText = document.getElementById('convertBtnText');
const csvPreviewText = document.getElementById('csvPreviewText');
const textPanel = document.getElementById('textPanel');
const textPreview = document.getElementById('textPreview');
const copyTextBtn = document.getElementById('copyTextBtn');
const exportTextBtn = document.getElementById('exportTextBtn');
const toastText = document.getElementById('toastText');

let parsedArrayText = null;

// ------------------ Excel Upload ------------------
fileInputText.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  parseExcel(file, (array) => {
    parsedArrayText = array;
    renderExcelPreview(parsedArrayText);
    convertBtnText.disabled = false;
    textPanel.classList.remove('visible'); // hide previous output
  });
});

// ------------------ Render Excel Preview ------------------
function renderExcelPreview(array) {
  csvPreviewText.innerHTML = '';
  if (!array || array.length === 0) {
    csvPreviewText.innerHTML = '<div class="small">Excel sheet is empty or failed to parse.</div>';
    return;
  }
  const table = createTableFromArray(array);
  csvPreviewText.appendChild(table);
  csvPreviewText.scrollTop = 0;
}

// ------------------ Convert Excel to Aligned Text with | ------------------
convertBtnText.addEventListener('click', () => {
  const table = csvPreviewText.querySelector('table');
  if (!table) return;

  // Extract table values (editable Excel preview included)
  const array = Array.from(table.rows).map(row =>
    Array.from(row.cells).map(cell => cell.textContent)
  );

  parsedArrayText = array;

  // Calculate max width for each column
  const colWidths = [];
  array.forEach(row => {
    row.forEach((cell, i) => {
      const len = cell.length;
      colWidths[i] = Math.max(colWidths[i] || 0, len);
    });
  });

  // Build aligned text with vertical bars
  const textOutput = array.map(row => {
    return row.map((cell, i) => cell.padEnd(colWidths[i], ' ')).join(' | ') + ';';
  }).join('\n');

  // Update textarea
  textPreview.value = textOutput;
  textPreview.style.fontFamily = 'monospace';
  textPreview.style.fontSize = '14px';
  textPanel.classList.add('visible');

  // Toast + scroll
  toastText.textContent = '✅ Conversion Successful!';
  toastText.classList.add('show');
  setTimeout(() => {
    toastText.classList.remove('show');
    textPanel.scrollIntoView({ behavior: 'smooth' });
  }, 2000);
});

// ------------------ Copy to Clipboard ------------------
copyTextBtn.addEventListener('click', () => {
  textPreview.select();
  document.execCommand('copy');
  toastText.textContent = '✅ Text copied to clipboard!';
  toastText.classList.add('show');
  setTimeout(() => toastText.classList.remove('show'), 2000);
});

// ------------------ Export as .txt ------------------
exportTextBtn.addEventListener('click', () => {
  const blob = new Blob([textPreview.value], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'converted.txt';
  a.click();
  URL.revokeObjectURL(a.href);
});
