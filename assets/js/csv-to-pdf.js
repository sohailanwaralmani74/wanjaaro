const fileInputPdf = document.getElementById('fileInputPdf');
const convertBtnPdf = document.getElementById('convertBtnPdf');
const csvPreviewPdf = document.getElementById('csvPreviewPdf');
const toastPdf = document.getElementById('toastPdf');
const pdfPanel = document.getElementById('pdfPanel');
const pdfPreview = document.getElementById('pdfPreview');

let parsedArrayPdf = null;
let generatedPdf = null;

// ------------------ CSV Upload ------------------
fileInputPdf.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const text = ev.target.result;
    parsedArrayPdf = parseCSV(text);
    renderCsvPreview(parsedArrayPdf);
    convertBtnPdf.disabled = false;
  };
  reader.readAsText(file);
});

function renderCsvPreview(array) {
  csvPreviewPdf.innerHTML = '';
  if (!array || array.length === 0) {
    csvPreviewPdf.innerHTML = '<div class="small">CSV empty or failed to parse.</div>';
    return;
  }
  const table = createTableFromArray(array);
  csvPreviewPdf.appendChild(table);
}

// ------------------ Convert CSV to PDF ------------------
convertBtnPdf.addEventListener('click', () => {
  const table = csvPreviewPdf.querySelector('table');
  if (!table) return;

  const array = Array.from(table.rows).map(row =>
    Array.from(row.cells).map(cell => cell.textContent)
  );

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.autoTable({ head: [array[0]], body: array.slice(1) });

  // create Blob for preview
  const pdfBlob = doc.output('blob');
  const url = URL.createObjectURL(pdfBlob);

  // show iframe preview inside panel
  pdfPreview.innerHTML = `<iframe src="${url}" style="width:100%;height:300px;border:none;border-radius:8px;"></iframe>`;

  // store generated PDF for download
  generatedPdf = doc;

  pdfPanel.classList.add('visible');
  toastPdf.classList.add('show');
  setTimeout(() => {
    toastPdf.classList.remove('show');
    pdfPanel.scrollIntoView({ behavior: 'smooth' });
  }, 2000);
});

// ------------------ Reuse helpers ------------------
function parseCSV(text) {
  const rows = [];
  let cur = '', row = [], inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') { cur += '"'; i++; } else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) { row.push(cur); cur = ''; }
    else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i++;
      row.push(cur); cur = '';
      rows.push(row); row = [];
    } else { cur += ch; }
  }
  if (cur !== '' || inQuotes || row.length > 0) { row.push(cur); rows.push(row); }
  return rows;
}

function createTableFromArray(array) {
  const table = document.createElement('table');
  table.className = 'sheet';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const headerRow = document.createElement('tr');
  array[0].forEach(cell => {
    const th = document.createElement('th'); th.textContent = cell || '';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  array.slice(1).forEach(rowArr => {
    const tr = document.createElement('tr');
    array[0].forEach((_, i) => {
      const td = document.createElement('td'); td.textContent = rowArr[i] || '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}
