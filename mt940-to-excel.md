---
layout: main
title: "MT940 to Excel Converter – Free, Secure & Browser‑Based"
description: "Convert MT940 bank statements to Excel (.xlsx) instantly. No upload, no sign‑up. Fully client‑side. Preview and convert MT940"
keywords: "mt940 to excel, convert mt940 to excel, mt940 excel converter, mt940 to xlsx, bank statement to excel"
category: mt940Finance
---

<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/mt940-to-excel#webapp",
    "name": "MT940 to Excel Converter",
    "url": "https://datafrog.tools/mt940-to-excel",
    "description": "Convert SWIFT MT940 bank statement files to Excel format. All processing stays in your browser.",
    "applicationCategory": "FinanceConverter",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "100% client‑side – no file upload",
      "Parses account, statement number, balances, transactions",
      "Outputs Excel (.xlsx) with a clean table",
      "Preview converted data before download",
      "Copy as CSV or download .xlsx",
      "Free, no signup, no watermarks"
    ],
    "softwareRequirements": "Modern web browser",
    "softwareVersion": "1.0",
    "datePublished": "2025-12-18",
    "dateModified": "2025-12-18"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://datafrog.tools/mt940-to-excel#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is MT940?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MT940 is a SWIFT standard for bank statement reporting. It contains transaction details, balances, and account information in a plain text format."
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
          "text": "Absolutely. Everything runs locally – your file never leaves your device."
        }
      },
      {
        "@type": "Question",
        "name": "How do I use the converted Excel file?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The exported .xlsx file can be opened in Microsoft Excel, Google Sheets, LibreOffice, or any spreadsheet software."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://datafrog.tools/mt940-to-excel#howto",
    "name": "How to Convert MT940 to Excel",
    "description": "Step‑by‑step guide to convert your MT940 bank statement to Excel.",
    "tool": {
      "@type": "HowToTool",
      "name": "MT940 to Excel Converter"
    },
    "supply": {
      "@type": "HowToSupply",
      "name": "MT940 file (.mt940, .sta, .txt)"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload your MT940 file",
        "text": "Drag and drop or click to select your .mt940, .sta, or .txt file."
      },
      {
        "@type": "HowToStep",
        "name": "Click Convert",
        "text": "The tool parses the file and shows a preview of the transactions."
      },
      {
        "@type": "HowToStep",
        "name": "Export to Excel",
        "text": "Click the Export button to download the .xlsx file."
      }
    ],
    "totalTime": "PT2M"
  }
]
</script>



<!-- ===== HERO ===== -->
<div id="mt940-hero" class="home-hero" class="home-hero">
  <h1>MT940 to Excel Converter – Turn Bank Statements into Spreadsheets</h1>
  <p>
    Convert SWIFT MT940 bank statement files to Excel (.xlsx) instantly.
    No upload, no sign‑up – 100% browser‑based. Parses all transactions, balances, and account details.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .mt940, .sta, .txt</span>
    <span class="badge amber">✓ Excel Output</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- ===== TOOL ===== -->
<section aria-label="MT940 to Excel Converter" style="display:flex;justify-content:center">
<div class="excel-wrap">

  <!-- Upload Panel -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-upload" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#e2c08d"></i>Upload MT940 File</div>
        <div class="panel-sub">Drag &amp; drop or click to choose a file (.mt940, .sta, .txt)</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn" id="btn-clear-file"><i class="ti ti-trash" aria-hidden="true"></i> Clear</button>
      </div>
    </div>
    <div class="drop-zone" id="drop-zone" role="button" tabindex="0">
      <div class="drop-zone-icon"><i class="ti ti-file-text" aria-hidden="true"></i></div>
      <div class="drop-zone-text"><strong>Drop your MT940 file here</strong> or click to browse</div>
      <div class="drop-zone-sub">Supports .mt940, .sta, .txt files</div>
      <div class="drop-zone-file" id="file-name"></div>
      <input type="file" id="file-input" accept=".mt940,.sta,.txt,.text" style="display:none;">
    </div>
    <div id="loading-container" style="display:none;">
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text">Parsing MT940...</span>
      </div>
    </div>
  </div>

  <!-- Convert Panel -->
  <div class="panel-card" id="convert-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-settings" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i>Convert to Excel</div>
        <div class="panel-sub">Your MT940 file is ready – click Convert to generate the Excel file</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn primary" id="btn-convert">🔄 Convert to Excel</button>
      </div>
    </div>
    <div style="padding:8px 16px;font-size:11px;color:#6a9955;" id="file-summary">No file loaded</div>
  </div>

  <!-- Output Panel (hidden initially) -->
  <div class="panel-card" id="output-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-file-export" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#6fcf97"></i>Excel Preview</div>
        <div class="panel-sub">Preview the converted data – copy as CSV or export .xlsx</div>
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

<!-- ===== CONTENT ===== -->
<article class="onpage-content">
 <div class="blog-post-meta">
     <a href="sohail-anwar" style="display:flex; gap: 10px;" class="link">
      <img src="assets/img/saeed-ahmed.jpg" alt="Sohail Anwar" class="author-img">
      <span class="author-name">Sohail Anwar</span>
      </a>
      <span class="post-date">December 01, 2025</span>
  </div>
  <section id="why-convert">
    <h2>Why convert MT940 to Excel?</h2>
    <ul>
      <li>Analyse bank transactions in spreadsheets with filters, pivot tables, and charts.</li>
      <li>Prepare data for accounting software (QuickBooks, Xero, etc.).</li>
      <li>Combine multiple statements into one workbook.</li>
      <li>Simplify tax preparation by structuring your financial data.</li>
    </ul>
  </section>

  <section id="how-it-works">
    <h2>How to convert – 3 simple steps</h2>
    <ul>
      <li><strong>Upload</strong> – drag &amp; drop your .mt940 file.</li>
      <li><strong>Convert</strong> – click “Convert to Excel”.</li>
      <li><strong>Export</strong> – preview the data and download the .xlsx file.</li>
    </ul>
  </section>

  <section id="features">
    <h2>Features</h2>
    <ul>
      <li>✅ <strong>Privacy first</strong> – everything stays in your browser.</li>
      <li>✅ <strong>Accurate parsing</strong> – extracts account, statement number, balances, and every transaction.</li>
      <li>✅ <strong>Clean Excel output</strong> – properly formatted table with headers.</li>
      <li>✅ <strong>Copy as CSV</strong> – for quick pasting into other tools.</li>
      <li>✅ <strong>No sign‑up</strong> – free forever.</li>
    </ul>
  </section>

  <section id="privacy">
    <h2>Privacy &amp; Security</h2>
    <ul>
      <li>🔒 All processing is local – no files are uploaded.</li>
      <li>🚫 No tracking, no logs.</li>
      <li>💼 Safe for sensitive financial statements.</li>
    </ul>
  </section>

  <section id="faq">
    <h2>Frequently Asked Questions</h2>
    <h3>What is MT940?</h3>
    <p>MT940 is the SWIFT standard for bank statement reporting. It is a plain text file containing transaction details, balances, and account information.</p>

    <h3>Will the Excel file include all transactions?</h3>
    <p>Yes, the tool parses every transaction and includes all relevant fields: date, amount, currency, description, reference, and transaction type.</p>

    <h3>Is there a file size limit?</h3>
    <p>No strict limit, but very large files may take a moment – all processing is client‑side.</p>

    <h3>Can I open the Excel file in Google Sheets?</h3>
    <p>Absolutely. The .xlsx format is compatible with Google Sheets, LibreOffice, and all major spreadsheet applications.</p>
  </section>
</article>

<!-- Toast -->
<div class="toast" id="toast" role="alert" aria-live="assertive"></div>

<!-- ===== JAVASCRIPT ===== -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script>
(function() {
  // ----- DOM references -----
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

  // ----- State -----
  var currentFile = null;          // File object
  var currentContent = null;       // raw text content
  var parsedData = null;          // array of transaction objects
  var outputCSV = '';             // CSV string (for copy)
  var outputExcelBuffer = null;   // ArrayBuffer for Excel

  // ----- Toast -----
  function showToast(msg, type) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + type + ' show';
    clearTimeout(t._timer);
    t._timer = setTimeout(function() { t.className = 'toast ' + type; }, 3000);
  }

  // ----- Format helpers -----
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(1) + ' GB';
  }

  // ----- MT940 Parser -----
  function parseMT940(text) {
    // Simple line‑based parser – extracts key fields
    var lines = text.split(/\r?\n/);
    var account = '', statement = '', openingBalance = '', closingBalance = '';
    var transactions = [];
    var currentTx = null;

    lines.forEach(function(line) {
      line = line.trim();
      if (line.startsWith(':25:')) {
        account = line.substring(3).trim();
      } else if (line.startsWith(':28C:')) {
        statement = line.substring(4).trim();
      } else if (line.startsWith(':60F:')) {
        openingBalance = line.substring(4).trim();
      } else if (line.startsWith(':62F:')) {
        closingBalance = line.substring(4).trim();
      } else if (line.startsWith(':61:')) {
        // Start a new transaction
        // Format: :61:YYMMDD[CD][amount]N[TRNREF][//REV?]
        // Example: :61:241211C1234,50N123456789
        var raw = line.substring(3).trim();
        var tx = { date: '', amount: '', currency: '', type: '', reference: '', description: '' };
        // Extract date (first 6 chars)
        if (raw.length >= 6) {
          var dateStr = raw.substring(0, 6);
          // Convert YYMMDD to YYYY-MM-DD
          var y = parseInt('20' + dateStr.substring(0,2));
          var m = parseInt(dateStr.substring(2,4)) - 1;
          var d = parseInt(dateStr.substring(4,6));
          tx.date = new Date(y, m, d).toISOString().split('T')[0];
          raw = raw.substring(6);
        }
        // Determine credit/debit (next char C or D)
        if (raw.length > 0 && (raw[0] === 'C' || raw[0] === 'D')) {
          tx.type = raw[0] === 'C' ? 'Credit' : 'Debit';
          raw = raw.substring(1);
        }
        // Extract amount (up to N or letter)
        var amountMatch = raw.match(/^([\d,]+\.?\d*)([A-Z])?/);
        if (amountMatch) {
          var amtStr = amountMatch[1].replace(',', '.');
          tx.amount = parseFloat(amtStr) || 0;
          raw = raw.substring(amountMatch[0].length);
          if (amountMatch[2]) {
            tx.currency = amountMatch[2];
          }
        }
        // Reference (may be up to next '//' or end)
        var refMatch = raw.match(/^([^\/]*)/);
        if (refMatch) {
          tx.reference = refMatch[1] || '';
          raw = raw.substring(refMatch[0].length);
        }
        // Description (often in following :86:)
        currentTx = tx;
        transactions.push(tx);
      } else if (line.startsWith(':86:')) {
        // Description line
        var desc = line.substring(3).trim();
        if (currentTx) {
          if (currentTx.description) currentTx.description += ' ' + desc;
          else currentTx.description = desc;
        }
      } else {
        // If we have a currentTx and line is not empty, append to description (continuation)
        if (currentTx && line.length > 0 && !line.startsWith(':')) {
          currentTx.description = (currentTx.description || '') + ' ' + line.trim();
        }
      }
    });

    // Cleanup descriptions
    transactions.forEach(function(tx) {
      if (tx.description) tx.description = tx.description.replace(/\s+/g, ' ').trim();
    });

    return {
      account: account,
      statement: statement,
      openingBalance: openingBalance,
      closingBalance: closingBalance,
      transactions: transactions
    };
  }

  // ----- Generate CSV from parsed data -----
  function generateCSV(data) {
    var header = ['Date','Amount','Type','Currency','Reference','Description'];
    var rows = data.transactions.map(function(tx) {
      return [
        tx.date,
        tx.amount.toFixed(2),
        tx.type,
        tx.currency || '',
        tx.reference || '',
        tx.description || ''
      ].join(',');
    });
    return header.join(',') + '\n' + rows.join('\n');
  }

  // ----- Generate Excel workbook from parsed data -----
  function generateExcel(data) {
    var wsData = [
      ['Date', 'Amount', 'Type', 'Currency', 'Reference', 'Description']
    ];
    data.transactions.forEach(function(tx) {
      wsData.push([
        tx.date,
        tx.amount,
        tx.type,
        tx.currency || '',
        tx.reference || '',
        tx.description || ''
      ]);
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  }

  // ----- Render preview table -----
  function renderPreview(data) {
    var html = '<table class="csv-table"><thead><tr>';
    var headers = ['Date','Amount','Type','Currency','Reference','Description'];
    headers.forEach(function(h) { html += '<th>' + h + '</th>'; });
    html += '</tr></thead><tbody>';
    data.transactions.forEach(function(tx) {
      html += '<tr>';
      html += '<td>' + tx.date + '</td>';
      html += '<td>' + tx.amount.toFixed(2) + '</td>';
      html += '<td>' + tx.type + '</td>';
      html += '<td>' + (tx.currency || '') + '</td>';
      html += '<td>' + (tx.reference || '') + '</td>';
      html += '<td>' + (tx.description || '') + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  // ----- Core conversion -----
  function convertFile() {
    if (!currentContent) {
      showToast('No file loaded.', 'error');
      return;
    }
    // Show loading
    loadingContainer.style.display = 'block';

    // Use setTimeout to allow UI update
    setTimeout(function() {
      try {
        var parsed = parseMT940(currentContent);
        if (parsed.transactions.length === 0) {
          showToast('No transactions found in the file.', 'error');
          loadingContainer.style.display = 'none';
          return;
        }
        parsedData = parsed;

        // Generate CSV and Excel
        outputCSV = generateCSV(parsed);
        outputExcelBuffer = generateExcel(parsed);

        // Show output panel
        outputPanel.style.display = 'block';
        outputContent.innerHTML = renderPreview(parsed);
        document.getElementById('output-format-label') && (document.getElementById('output-format-label').textContent = 'Excel preview – ' + parsed.transactions.length + ' transactions');

        loadingContainer.style.display = 'none';
        showToast('Conversion successful!', 'success');
      } catch (e) {
        loadingContainer.style.display = 'none';
        showToast('Error parsing file: ' + e.message, 'error');
        console.error(e);
      }
    }, 50);
  }

  // ----- File handling -----
  function processFile(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    if (!['mt940', 'sta', 'txt', 'text'].includes(ext)) {
      showToast('Please upload a valid MT940 file (.mt940, .sta, .txt)', 'error');
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

  // ----- Event listeners -----
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
    var files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
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
      showToast('Copied as CSV!', 'success');
    }).catch(function() {
      // Fallback
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
    // Download .xlsx
    var blob = new Blob([outputExcelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'converted_mt940.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Excel file downloaded!', 'success');
  });

})();
</script>