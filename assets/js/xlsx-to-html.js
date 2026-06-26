document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInputHtml");
  const convertBtn = document.getElementById("convertBtnHtml");
  const excelPreview = document.getElementById("csvPreviewHtml"); // keep same ID
  const htmlPreview = document.getElementById("htmlPreview");
  const toast = document.getElementById("toastHtml");
  const copyBtn = document.getElementById("copyHtmlBtn");
  const exportBtn = document.getElementById("exportHtmlBtn");
  const htmlPanel = document.getElementById("htmlPanel");

  let parsedArray = null;

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

  // --- File Upload (Excel) ---
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const data = new Uint8Array(ev.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      parsedArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      renderExcelPreview(parsedArray);
      convertBtn.disabled = false;
    };
    reader.readAsArrayBuffer(file);
  });

  function renderExcelPreview(array) {
    excelPreview.innerHTML = '';
    if (!array || !array.length) {
      excelPreview.innerHTML = '<div class="small">Excel file empty or failed to parse.</div>';
      return;
    }
    const table = createTableFromArray(array);
    table.contentEditable = true; // allow inline edits
    excelPreview.appendChild(table);
  }

  // --- Convert Excel to HTML ---
  convertBtn.addEventListener('click', () => {
    const table = excelPreview.querySelector('table');
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
      alert("Nothing to export — please convert Excel first!");
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
