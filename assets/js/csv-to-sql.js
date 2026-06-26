// ------------------ CSV To SQL Tool (Standalone) ------------------

// DOM references
const fileInputSql = document.getElementById('fileInputSql');
const convertBtnSql = document.getElementById('convertBtnSql');
const csvPreviewSql = document.getElementById('csvPreviewSql');
const sqlPreview = document.getElementById('sqlPreview');
const sqlPanel = document.getElementById('sqlPanel');
const toastSql = document.getElementById('toastSql');
const copySqlBtn = document.getElementById('copySqlBtn');
const exportSqlBtn = document.getElementById('exportSqlBtn');

let parsedArraySql = null;

// ------------------ CSV Parser ------------------
function parseCSV(text){
  const rows = [];
  let cur = '';
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++){
    const ch = text[i];
    const next = text[i+1];

    if (ch === '"'){
      if (inQuotes && next === '"'){
        cur += '"'; i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes){
      row.push(cur); cur = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes){
      if (ch === '\r' && next === '\n') i++;
      row.push(cur); cur = '';
      rows.push(row);
      row = [];
    } else {
      cur += ch;
    }
  }
  if (cur !== '' || row.length > 0){
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

// ------------------ Table Renderer ------------------
function createTableFromArray(array){
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
  for (let r = 1; r < array.length; r++){
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

// ------------------ CSV Upload ------------------
fileInputSql.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(ev){
    const text = ev.target.result;
    parsedArraySql = parseCSV(text);
    renderCsvPreview(parsedArraySql);
    convertBtnSql.disabled = false;
    sqlPanel.classList.remove('visible');
  };
  reader.readAsText(file);
});

// ------------------ Render CSV Preview ------------------
function renderCsvPreview(array){
  csvPreviewSql.innerHTML = '';
  if (!array || array.length === 0){
    csvPreviewSql.innerHTML = '<div class="small">CSV empty or failed to parse.</div>';
    return;
  }
  const table = createTableFromArray(array);
  csvPreviewSql.appendChild(table);
}

// ------------------ Convert CSV To SQL ------------------
convertBtnSql.addEventListener('click', ()=>{
  const table = csvPreviewSql.querySelector('table');
  if (!table) return;

  const array = Array.from(table.rows).map(row =>
    Array.from(row.cells).map(cell => cell.textContent)
  );

  parsedArraySql = array;

  const headers = array[0];
  const rows = array.slice(1);
  let sqlOutput = '';

  rows.forEach(row=>{
    const values = row.map(cell => `'${cell.replace(/'/g,"''")}'`).join(', ');
    sqlOutput += `INSERT INTO table_name (${headers.join(', ')}) VALUES (${values});\n`;
  });

  sqlPreview.value = sqlOutput;
  sqlPreview.style.fontFamily = 'monospace';
  sqlPreview.style.fontSize = '14px';
  sqlPanel.classList.add('visible');

  toastSql.textContent = '✅ Conversion Successful!';
  toastSql.classList.add('show');
  setTimeout(()=>{
    toastSql.classList.remove('show');
    sqlPanel.scrollIntoView({behavior:'smooth'});
  },2000);
});

// ------------------ Copy SQL ------------------
copySqlBtn.addEventListener('click', ()=>{
  sqlPreview.select();
  document.execCommand('copy');
  toastSql.textContent = '✅ SQL Copied to Clipboard!';
  toastSql.classList.add('show');
  setTimeout(()=>toastSql.classList.remove('show'),2000);
});

// ------------------ Export SQL ------------------
exportSqlBtn.addEventListener('click', ()=>{
  const blob = new Blob([sqlPreview.value], {type:"text/sql"});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'converted.sql';
  a.click();
  URL.revokeObjectURL(a.href);
});
