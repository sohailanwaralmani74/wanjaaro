document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInputHtml");
  const convertBtn = document.getElementById("convertBtnHtml");
  const csvPreview = document.getElementById("csvPreviewHtml");
  const htmlPreview = document.getElementById("htmlPreview");
  const toast = document.getElementById("toastHtml");
  const copyBtn = document.getElementById("copyHtmlBtn");
  const exportBtn = document.getElementById("exportHtmlBtn");
  const htmlPanel = document.getElementById("htmlPanel");

  let parsedArray = null;

  // --- CSV Parsing ---
  function parseCSV(text) {
    const rows = [];
    let cur = '';
    let row = [];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];
      if (ch === '"') {
        if (inQuotes && next === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        row.push(cur);
        cur = '';
      } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
        if (ch === '\r' && next === '\n') i++;
        row.push(cur);
        rows.push(row);
        cur = '';
        row = [];
      } else {
        cur += ch;
      }
    }
    if (cur !== '' || row.length > 0) {
      row.push(cur);
      rows.push(row);
    }
    return rows;
  }

  // --- Create table element from array ---
  function createTableFromArray(array) {
    const table = document.createElement('table');
    table.className = 'sheet';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const header = document.createElement('tr');
    array[0].forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      header.appendChild(th);
    });
    thead.appendChild(header);

    for (let r = 1; r < array.length; r++) {
      const tr = document.createElement('tr');
      array[r].forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  }

  // --- File Upload ---
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target.result;
      parsedArray = parseCSV(text);
      renderCsvPreview(parsedArray);
      convertBtn.disabled = false;
    };
    reader.readAsText(file);
  });

  function renderCsvPreview(array) {
    csvPreview.innerHTML = '';
    if (!array || !array.length) {
      csvPreview.innerHTML = '<div class="small">CSV empty or failed to parse.</div>';
      return;
    }
    const table = createTableFromArray(array);
    table.contentEditable = true; // allow inline edits
    csvPreview.appendChild(table);
  }

// --- Convert CSV to HTML ---
convertBtn.addEventListener('click', () => {
    const table = csvPreview.querySelector('table');
    if (!table) return;

    // read current table content
    const array = Array.from(table.rows).map(row =>
        Array.from(row.cells).map(cell => cell.textContent)
    );

    let htmlOutput = '<table border="1" cellspacing="0" cellpadding="5" style="border-collapse:collapse;width:100%;">\n';
    array.forEach(row => {
        htmlOutput += '  <tr>';
        row.forEach(cell => {
            htmlOutput += `<td>${cell.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`;
        });
        htmlOutput += '</tr>\n';
    });
    htmlOutput += '</table>';
    htmlOutput = htmlOutput
        .replace(/></g, ">\n<")
        .replace(/\n{2,}/g, "\n");

    htmlPreview.textContent = htmlOutput;
    toast.classList.add('show');
    htmlPanel.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('show');
        htmlPanel.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
});


  // --- Copy HTML ---
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(htmlPreview.innerText).then(() => {
      copyBtn.textContent = "✅ Copied!";
      setTimeout(() => (copyBtn.textContent = "📋 Copy HTML"), 1500);
    });
  });

  // --- Export HTML file ---
  exportBtn.addEventListener('click', () => {
  const htmlContent = htmlPreview.textContent.trim();
  if (!htmlContent) {
    alert("Nothing to export — please convert CSV first!");
    return;
  }

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "converted.html";
  a.click();

  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});
});
