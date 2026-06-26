const fileInputPdf = document.getElementById('fileInputPdf');
const convertBtnPdf = document.getElementById('convertBtnPdf');
const csvPreviewPdf = document.getElementById('csvPreviewPdf'); // keep same id for compatibility
const toastPdf = document.getElementById('toastPdf');
const pdfPanel = document.getElementById('pdfPanel');
const pdfPreview = document.getElementById('pdfPreview');

let parsedArrayPdf = null;
let generatedPdf = null;

// ------------------ Excel Upload ------------------
fileInputPdf.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    const data = new Uint8Array(ev.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    parsedArrayPdf = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    renderExcelPreview(parsedArrayPdf);
    convertBtnPdf.disabled = false;
  };
  reader.readAsArrayBuffer(file);
});

function renderExcelPreview(array) {
  csvPreviewPdf.innerHTML = '';
  if (!array || array.length === 0) {
    csvPreviewPdf.innerHTML = '<div class="small">Excel file empty or failed to parse.</div>';
    return;
  }
  const table = createTableFromArray(array);
  csvPreviewPdf.appendChild(table);
}

// ------------------ Convert Excel to PDF ------------------
convertBtnPdf.addEventListener('click', () => {
  const table = csvPreviewPdf.querySelector('table');
  if (!table) return;

  const array = Array.from(table.rows).map(row =>
    Array.from(row.cells).map(cell => cell.textContent)
  );

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Generate PDF Table
  doc.autoTable({
    head: [array[0]],
    body: array.slice(1),
    styles: { fontSize: 9, cellPadding: 2 },
  });

  // Create Blob for Preview
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);

  // Show iframe preview inside panel
  pdfPreview.innerHTML = `<iframe src="${url}" style="width:100%;height:300px;border:none;border-radius:8px;"></iframe>`;

  // Store generated PDF for download
  generatedPdf = doc;

  pdfPanel.classList.add('visible');
  toastPdf.classList.add('show');
  setTimeout(() => {
    toastPdf.classList.remove('show');
    pdfPanel.scrollIntoView({ behavior: 'smooth' });
  }, 2000);
});

// ------------------ Reuse Helpers ------------------
function createTableFromArray(array) {
  const table = document.createElement('table');
  table.className = 'sheet';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const headerRow = document.createElement('tr');
  array[0].forEach(cell => {
    const th = document.createElement('th');
    th.textContent = cell || '';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  array.slice(1).forEach(rowArr => {
    const tr = document.createElement('tr');
    array[0].forEach((_, i) => {
      const td = document.createElement('td');
      td.textContent = rowArr[i] || '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}
