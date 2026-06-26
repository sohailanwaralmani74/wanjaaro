// ------------------ CSV To XML Tool (Standalone) ------------------

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
fileInputXml.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(ev){
    const text = ev.target.result;
    parsedArrayXml = parseCSV(text);
    renderCsvPreview(parsedArrayXml);
    convertBtnXml.disabled = false;
    xmlPanel.classList.remove('visible');
  };
  reader.readAsText(file);
});

// ------------------ Render CSV Preview ------------------
function renderCsvPreview(array){
  csvPreviewXml.innerHTML = '';
  if (!array || array.length === 0){
    csvPreviewXml.innerHTML = '<div class="small">CSV empty or failed to parse.</div>';
    return;
  }
  const table = createTableFromArray(array);
  csvPreviewXml.appendChild(table);
}

// ------------------ Convert CSV To XML ------------------
convertBtnXml.addEventListener('click', ()=>{
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
    row.forEach((cell, i)=>{
      const tag = headers[i] ? headers[i].replace(/\s+/g,'_') : `column${i+1}`;
      xmlOutput += `    <${tag}>${cell.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</${tag}>\n`;
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
  setTimeout(()=>{
    toastXml.classList.remove('show');
    xmlPanel.scrollIntoView({behavior:'smooth'});
  },2000);
});

// ------------------ Copy XML ------------------
copyXmlBtn.addEventListener('click', ()=>{
  xmlPreview.select();
  document.execCommand('copy');
  toastXml.textContent = '✅ XML Copied to Clipboard!';
  toastXml.classList.add('show');
  setTimeout(()=>toastXml.classList.remove('show'),2000);
});

// ------------------ Export XML ------------------
exportXmlBtn.addEventListener('click', ()=>{
  const blob = new Blob([xmlPreview.value], {type:"text/xml"});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'converted.xml';
  a.click();
  URL.revokeObjectURL(a.href);
});
