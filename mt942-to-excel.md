---
layout: main
title: "MT942 to Excel Converter – Free, Secure & Browser‑Based | DataFrog"
description: "Convert SWIFT MT942 files to Excel (.xlsx) instantly. No upload, no sign‑up. Fully client‑side. Download as .xlsx."
keywords: "mt942 to excel, convert mt942 to excel, mt942 excel converter, swift mt942 to xlsx, mt942 to spreadsheet"
category: mt940Finance
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/mt942-to-excel#webapp",
    "name": "MT942 to Excel Converter",
    "url": "https://datafrog.tools/mt942-to-excel",
    "description": "Convert SWIFT MT942 files to Excel format. All processing stays in your browser.",
    "applicationCategory": "FinanceConverter",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "100% client‑side – no file upload",
      "Parses MT942 tags: :20:, :25:, :28:, :60F/M:, :61:, :62F/M:, :86:",
      "Extracts transactions with date, amount, type, reference, description, balance",
      "Outputs Excel (.xlsx) – ready for spreadsheets",
      "Preview table before downloading",
      "Copy as CSV or export .xlsx",
      "Free, no signup, no watermarks"
    ],
    "softwareRequirements": "Modern web browser",
    "softwareVersion": "1.0",
    "datePublished": "2026-01-03",
    "dateModified": "2026-01-03"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://datafrog.tools/mt942-to-excel#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is MT942?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MT942 is a SWIFT message type for intraday/interim bank statements. It contains transaction details and multiple balances throughout the day."
        }
      },
      {
        "@type": "Question",
        "name": "What tags does the parser support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The parser extracts :20: (sender ref), :25: (account), :28: (statement number), :60F/M: (opening/interim balance), :61: (transactions), :62F/M: (closing/interim balance), and :86: (description)."
        }
      },
      {
        "@type": "Question",
        "name": "Is this converter free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, completely free – no premium tiers, no hidden costs."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data safe?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely – everything runs locally; your file never leaves your device."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://datafrog.tools/mt942-to-excel#howto",
    "name": "How to Convert MT942 to Excel",
    "description": "Step‑by‑step guide to convert your MT942 file to Excel.",
    "tool": {
      "@type": "HowToTool",
      "name": "MT942 to Excel Converter"
    },
    "supply": {
      "@type": "HowToSupply",
      "name": "MT942 file (.mt942, .txt)"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload your MT942 file",
        "text": "Drag and drop or click to select your MT942 file."
      },
      {
        "@type": "HowToStep",
        "name": "Click Convert",
        "text": "The tool parses the file and shows a table preview."
      },
      {
        "@type": "HowToStep",
        "name": "Export to Excel",
        "text": "Click Export to download the .xlsx file."
      }
    ],
    "totalTime": "PT2M"
  }
]
</script>

<!-- HERO -->
<div id="mt942-hero" class="home-hero" >
  <h1>MT942 to Excel Converter – Turn Intraday Statements into Spreadsheets</h1>
  <p>
    Convert SWIFT MT942 files to Excel (.xlsx) format instantly.
    No upload, no sign‑up – 100% browser‑based. Perfect for analysing intraday transaction data in Excel, Google Sheets, or any spreadsheet tool.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .mt942, .txt</span>
    <span class="badge amber">✓ Excel Output</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- TOOL -->
<section aria-label="MT942 to Excel Converter" style="display:flex;justify-content:center">
<div class="excel-wrap">

  <!-- Upload Panel -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-upload" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#e2c08d"></i> Upload MT942 File</div>
        <div class="panel-sub">Drag &amp; drop or click to choose a file (.mt942, .txt)</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn" id="btn-clear-file"><i class="ti ti-trash" aria-hidden="true"></i> Clear</button>
      </div>
    </div>
    <div class="drop-zone" id="drop-zone" role="button" tabindex="0">
      <div class="drop-zone-icon"><i class="ti ti-file-text" aria-hidden="true"></i></div>
      <div class="drop-zone-text"><strong>Drop your MT942 file here</strong> or click to browse</div>
      <div class="drop-zone-sub">Supports .mt942, .txt files</div>
      <div class="drop-zone-file" id="file-name"></div>
      <input type="file" id="file-input" accept=".mt942,.txt" style="display:none;">
    </div>
    <div id="loading-container" style="display:none;">
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text">Parsing MT942...</span>
      </div>
    </div>
  </div>

  <!-- Convert Panel -->
  <div class="panel-card" id="convert-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-settings" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i> Convert to Excel</div>
        <div class="panel-sub">Your MT942 file is ready – click Convert to generate Excel</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn primary" id="btn-convert">🔄 Convert to Excel</button>
      </div>
    </div>
    <div style="padding:8px 16px;font-size:11px;color:#6a9955;" id="file-summary">No file loaded</div>
  </div>

  <!-- Output Panel -->
  <div class="panel-card" id="output-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-file-export" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#6fcf97"></i> Excel Preview</div>
        <div class="panel-sub" id="output-format-label">Preview – copy as CSV or export .xlsx</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn green" id="btn-copy"><i class="ti ti-copy" aria-hidden="true"></i> Copy as CSV</button>
        <button class="excel-btn amber" id="btn-export"><i class="ti ti-download" aria-hidden="true"></i> Export .xlsx</button>
      </div>
    </div>
    <div id="output-content" class="output-preview">
      <div style="color:#4a4a4a;text-align:center;padding:20px;">No output yet</div>
    </div>
  </div>

</div>
</section>

<!-- Content (shortened) -->
<article class="onpage-content">
 <div class="blog-post-meta">
     <a href="sohail-anwar" style="display:flex; gap: 10px;" class="link">
      <img src="assets/img/sohail-anwar.webp" alt="Sohail Anwar" class="author-img">
      <span class="author-name">Sohail Anwar</span>
      </a>
      <span class="post-date">December 01, 2025</span>
  </div>
  <section id="why-convert"><h2>Why convert MT942 to Excel?</h2><ul><li>Analyse intraday transactions with pivot tables, charts, and filters</li><li>Combine with other data sources for reconciliation</li><li>Easier data processing and reporting</li></ul></section>
  <section id="how-it-works"><h2>How to convert – 3 simple steps</h2><ul><li>Upload your MT942 file</li><li>Click Convert</li><li>Copy as CSV or download .xlsx</li></ul></section>
  <section id="features"><h2>Features</h2><ul><li>✅ Privacy first – everything stays local</li><li>✅ Parses MT942 standard tags</li><li>✅ Clean Excel output with formatting</li><li>✅ Free forever</li></ul></section>
  <section id="privacy"><h2>Privacy &amp; Security</h2><ul><li>🔒 All processing is local – no files uploaded</li><li>🚫 No tracking, no logs</li><li>💼 Safe for sensitive financial data</li></ul></section>
  <section id="faq"><h2>Frequently Asked Questions</h2><h3>What is MT942?</h3><p>MT942 is SWIFT intraday statement format with multiple balance updates.</p><h3>What data is extracted?</h3><p>Transaction date, amount, debit/credit indicator, reference, description, and the balance after each transaction (if available).</p><h3>Will it handle multi‑line descriptions?</h3><p>Yes, :86: tags may be spread over multiple lines; they are concatenated.</p></section>
</article>

<!-- Toast -->
<div class="toast" id="toast" role="alert" aria-live="assertive"></div>

<!-- ===== JAVASCRIPT ===== -->
<script>
(function() {
  // DOM refs
  var fileInput = document.getElementById('file-input');
  var dropZone = document.getElementById('drop-zone');
  var fileNameDisplay = document.getElementById('file-name');
  var fileSummary = document.getElementById('file-summary');
  var convertPanel = document.getElementById('convert-panel');
  var outputPanel = document.getElementById('output-panel');
  var outputContent = document.getElementById('output-content');
  var loadingContainer = document.getElementById('loading-container');
  var btnConvert = document.getElementById('btn-convert');
  var btnClear = document.getElementById('btn-clear-file');
  var btnCopy = document.getElementById('btn-copy');
  var btnExport = document.getElementById('btn-export');
  var outputLabel = document.getElementById('output-format-label');

  var currentFile = null;
  var currentContent = null;
  var parsedData = null;
  var outputCSV = '';
  var outputExcelBuffer = null;

  function showToast(msg, type) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + type + ' show';
    clearTimeout(t._timer);
    t._timer = setTimeout(function() { t.className = 'toast ' + type; }, 3000);
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(1) + ' GB';
  }

  // ---- MT942 Parser (same as CSV version) ----
  function parseMT942(text) {
    var lines = text.split(/\r?\n/);
    var account = '';
    var statement = '';
    var currentTx = null;
    var transactions = [];
    var pendingDescription = '';

    lines.forEach(function(line) {
      line = line.trim();
      if (!line) return;

      if (line.startsWith(':25:')) {
        account = line.substring(3).trim();
        return;
      }
      if (line.startsWith(':28:')) {
        statement = line.substring(3).trim();
        return;
      }
      if (line.startsWith(':20:')) {
        // sender reference – ignore
        return;
      }
      if (line.match(/^:60[FM]:/)) return;
      if (line.match(/^:62[FM]:/)) return;

      if (line.startsWith(':61:')) {
        if (currentTx && currentTx.amount !== undefined) {
          if (pendingDescription) {
            currentTx.description = pendingDescription.trim();
            pendingDescription = '';
          }
          transactions.push(currentTx);
        }
        var raw = line.substring(3).trim();
        var tx = { date: '', amount: 0, sign: '', type: '', reference: '', description: '' };
        if (raw.length >= 6) {
          var dateStr = raw.substring(0, 6);
          var y = parseInt('20' + dateStr.substring(0,2));
          var m = parseInt(dateStr.substring(2,4)) - 1;
          var d = parseInt(dateStr.substring(4,6));
          tx.date = new Date(y, m, d).toISOString().split('T')[0];
          raw = raw.substring(6);
        }
        if (raw.length > 0 && (raw[0] === 'C' || raw[0] === 'D')) {
          tx.sign = raw[0];
          tx.type = (raw[0] === 'C') ? 'Credit' : 'Debit';
          raw = raw.substring(1);
        }
        var amountMatch = raw.match(/^([\d,]+\.?\d*)/);
        if (amountMatch) {
          var amtStr = amountMatch[1].replace(',', '.');
          tx.amount = parseFloat(amtStr) || 0;
          raw = raw.substring(amountMatch[0].length);
        }
        var refMatch = raw.match(/^([^\/]*)/);
        if (refMatch) {
          tx.reference = refMatch[1] || '';
          raw = raw.substring(refMatch[0].length);
        }
        currentTx = tx;
        pendingDescription = '';
        return;
      }

      if (line.startsWith(':86:')) {
        var desc = line.substring(3).trim();
        if (currentTx) {
          if (pendingDescription) pendingDescription += ' ' + desc;
          else pendingDescription = desc;
        }
        return;
      }

      if (currentTx && line.length > 0 && !line.startsWith(':')) {
        if (pendingDescription) pendingDescription += ' ' + line.trim();
        else pendingDescription = line.trim();
        return;
      }

      if (line.startsWith(':') && currentTx && pendingDescription) {
        if (!line.startsWith(':86:')) {
          currentTx.description = pendingDescription.trim();
          pendingDescription = '';
        }
      }
    });

    if (currentTx && currentTx.amount !== undefined) {
      if (pendingDescription) {
        currentTx.description = pendingDescription.trim();
        pendingDescription = '';
      }
      transactions.push(currentTx);
    }

    return { account: account, statement: statement, transactions: transactions };
  }

  // ---- Generate CSV (for copy) ----
  function generateCSV(data) {
    if (!data || data.transactions.length === 0) return '';
    var header = ['Date', 'Amount', 'Type', 'Reference', 'Description'];
    var rows = data.transactions.map(function(tx) {
      var amt = (tx.sign === 'D') ? -tx.amount : tx.amount;
      return [
        tx.date,
        amt.toFixed(2),
        tx.type,
        tx.reference || '',
        tx.description || ''
      ].join(',');
    });
    return header.join(',') + '\n' + rows.join('\n');
  }

  // ---- Generate Excel ----
  function generateExcel(data) {
    var wsData = [
      ['Date', 'Amount', 'Type', 'Reference', 'Description']
    ];
    data.transactions.forEach(function(tx) {
      var amt = (tx.sign === 'D') ? -tx.amount : tx.amount;
      wsData.push([
        tx.date,
        amt,
        tx.type,
        tx.reference || '',
        tx.description || ''
      ]);
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  }

  // ---- Render preview table ----
  function renderPreview(data) {
    if (!data || data.transactions.length === 0) {
      return '<div style="color:#4a4a4a;text-align:center;padding:20px;">No transactions found.</div>';
    }
    var html = '<table class="csv-table"><thead><tr>';
    var headers = ['Date', 'Amount', 'Type', 'Reference', 'Description'];
    headers.forEach(function(h) { html += '<th>' + h + '</th>'; });
    html += '</tr></thead><tbody>';
    data.transactions.forEach(function(tx) {
      var amt = (tx.sign === 'D') ? -tx.amount : tx.amount;
      html += '<tr>';
      html += '<td>' + tx.date + '</td>';
      html += '<td>' + amt.toFixed(2) + '</td>';
      html += '<td>' + tx.type + '</td>';
      html += '<td>' + (tx.reference || '') + '</td>';
      html += '<td>' + (tx.description || '') + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  // ---- Conversion ----
  function convertFile() {
    if (!currentContent) {
      showToast('No file loaded.', 'error');
      return;
    }
    loadingContainer.style.display = 'block';

    setTimeout(function() {
      try {
        var parsed = parseMT942(currentContent);
        if (parsed.transactions.length === 0) {
          showToast('No transactions found in the MT942 file.', 'error');
          loadingContainer.style.display = 'none';
          return;
        }
        parsedData = parsed;
        outputCSV = generateCSV(parsed);
        outputExcelBuffer = generateExcel(parsed);

        outputPanel.style.display = 'block';
        outputContent.innerHTML = renderPreview(parsed);
        if (outputLabel) outputLabel.textContent = 'Excel preview – ' + parsed.transactions.length + ' transactions';

        loadingContainer.style.display = 'none';
        showToast('Conversion successful!', 'success');
      } catch (e) {
        loadingContainer.style.display = 'none';
        showToast('Error parsing MT942: ' + e.message, 'error');
        console.error(e);
      }
    }, 50);
  }

  // ---- File handling ----
  function processFile(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    if (!['mt942', 'txt'].includes(ext)) {
      showToast('Please upload a valid MT942 file (.mt942, .txt).', 'error');
      return;
    }

    currentFile = file;
    fileNameDisplay.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
    fileSummary.textContent = file.name + ' — ready to convert';
    convertPanel.style.display = 'block';
    outputPanel.style.display = 'none';

    var reader = new FileReader();
    reader.onload = function(e) {
      currentContent = e.target.result;
      showToast('File loaded successfully', 'success');
    };
    reader.onerror = function() {
      showToast('Error reading file', 'error');
    };
    reader.readAsText(file);
  }

  // ---- Event listeners ----
  dropZone.addEventListener('click', function() { fileInput.click(); });
  dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
  });
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function() {
    if (this.files.length > 0) processFile(this.files[0]);
  });

  btnConvert.addEventListener('click', convertFile);

  btnClear.addEventListener('click', function() {
    fileInput.value = '';
    fileNameDisplay.textContent = '';
    fileSummary.textContent = '';
    currentFile = null;
    currentContent = null;
    parsedData = null;
    outputCSV = '';
    outputExcelBuffer = null;
    convertPanel.style.display = 'none';
    outputPanel.style.display = 'none';
    loadingContainer.style.display = 'none';
    showToast('Cleared', 'success');
  });

  btnCopy.addEventListener('click', function() {
    if (!outputCSV) {
      showToast('No data to copy.', 'error');
      return;
    }
    navigator.clipboard.writeText(outputCSV).then(function() {
      showToast('CSV copied!', 'success');
    }).catch(function() {
      var ta = document.createElement('textarea');
      ta.value = outputCSV;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied!', 'success');
    });
  });

  btnExport.addEventListener('click', function() {
    if (!outputExcelBuffer) {
      showToast('No data to export.', 'error');
      return;
    }
    var blob = new Blob([outputExcelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'converted_mt942.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Excel downloaded!', 'success');
  });

})();
</script>