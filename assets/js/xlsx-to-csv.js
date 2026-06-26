// ------------------ Excel to CSV ------------------
let parsedExcelArray = null;

// ------------------ Upload Excel ------------------
const fileInputExcelCsv = document.getElementById('fileInputExcelCsv');
const uploadBtnExcelCsv = document.getElementById('uploadBtnExcelCsv');
const convertBtnExcelCsv = document.getElementById('convertBtnExcelCsv');
const excelPreviewCsv = document.getElementById('excelPreviewCsv');
const toastExcelCsv = document.getElementById('toastExcelCsv');
const csvOutputPreview = document.getElementById('csvOutputPreview');
const csvPanelOutput = document.getElementById('csvPanelOutput');
const copyCsvBtn = document.getElementById('copyCsvBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');

fileInputExcelCsv.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const data = new Uint8Array(ev.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    parsedExcelArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    renderExcelPreview(parsedExcelArray);
    convertBtnExcelCsv.disabled = false;
  };
  reader.readAsArrayBuffer(file);
});

function renderExcelPreview(array){
  excelPreviewCsv.innerHTML = '';
  if (!array || array.length === 0){
    excelPreviewCsv.innerHTML = '<div class="small">Excel is empty or failed to parse.</div>';
    return;
  }
  const table = document.createElement('table');
  table.className = 'sheet';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // header row
  const headerRow = document.createElement('tr');
  array[0].forEach(cell => {
    const th = document.createElement('th');
    th.textContent = cell || '';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // body rows
  for(let r = 1; r < array.length; r++){
    const tr = document.createElement('tr');
    array[r].forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell || '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  excelPreviewCsv.appendChild(table);
}

// ------------------ Convert to CSV ------------------
convertBtnExcelCsv.addEventListener('click', ()=>{
  const table = excelPreviewCsv.querySelector('table');
  if (!table) return;

  const array = Array.from(table.rows).map(row =>
    Array.from(row.cells).map(cell => cell.textContent)
  );

  const csvText = array.map(row => row.join(',')).join('\n');
  csvOutputPreview.value = csvText;

  csvPanelOutput.classList.add('visible');
  toastExcelCsv.classList.add('show');

  setTimeout(() => {
    toastExcelCsv.classList.remove('show');
    csvOutputPreview.scrollIntoView({ behavior: 'smooth' });
  }, 2000);
});

// ------------------ Copy CSV ------------------
copyCsvBtn.addEventListener('click', ()=>{
  csvOutputPreview.select();
  document.execCommand('copy');
});

// ------------------ Export CSV ------------------
exportCsvBtn.addEventListener('click', ()=>{
  const blob = new Blob([csvOutputPreview.value], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'converted.csv';
  a.click();
  URL.revokeObjectURL(a.href);
});
