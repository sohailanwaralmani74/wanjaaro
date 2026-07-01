---
layout: main
title: "Excel to QIF Converter – Free, Secure & Browser‑Based | DataFrog"
description: "Convert Excel files (.xlsx, .xls) to QIF (Quicken Interchange Format) instantly. No upload, no sign‑up. Fully client‑side. Download as .qif."
keywords: "excel to qif, convert excel to qif, xlsx to qif, spreadsheet to quicken, excel to qif online"
category: excelFinance
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/excel-to-qif#webapp",
    "name": "Excel to QIF Converter",
    "url": "https://datafrog.tools/excel-to-qif",
    "description": "Convert Excel files to QIF format. All processing stays in your browser.",
    "applicationCategory": "FinanceConverter",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "100% client‑side – no file upload",
      "Parses Excel files (.xlsx, .xls) with SheetJS",
      "Auto‑detects columns: Date, Amount, Payee, Memo, Check#",
      "Outputs QIF – ready for Quicken, GnuCash, etc.",
      "Preview QIF before downloading",
      "Copy QIF to clipboard or download .qif file",
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
    "@id": "https://datafrog.tools/excel-to-qif#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What Excel formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": ".xlsx, .xls, and .csv files are supported. The tool uses SheetJS for parsing."
        }
      },
      {
        "@type": "Question",
        "name": "Does it support multiple sheets?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the tool detects all sheets and provides a dropdown to select which sheet to convert."
        }
      },
      {
        "@type": "Question",
        "name": "What is QIF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "QIF (Quicken Interchange Format) is a text format used by Quicken and other personal finance software."
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
    "@id": "https://datafrog.tools/excel-to-qif#howto",
    "name": "How to Convert Excel to QIF",
    "description": "Step‑by‑step guide to convert your Excel file to QIF.",
    "tool": {
      "@type": "HowToTool",
      "name": "Excel to QIF Converter"
    },
    "supply": {
      "@type": "HowToSupply",
      "name": "Excel file (.xlsx, .xls, .csv)"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload your Excel file",
        "text": "Drag and drop or click to select your file."
      },
      {
        "@type": "HowToStep",
        "name": "Select a sheet (if multiple)",
        "text": "Choose the worksheet you want to convert."
      },
      {
        "@type": "HowToStep",
        "name": "Map columns (optional)",
        "text": "If auto‑detection fails, adjust column mapping."
      },
      {
        "@type": "HowToStep",
        "name": "Convert and Export",
        "text": "Click Convert, then copy or download the .qif file."
      }
    ],
    "totalTime": "PT2M"
  }
]
</script>

<!-- HERO -->
<div id="excel-hero" class="home-hero" >
  <h1>Excel to QIF Converter – Turn Spreadsheets into Quicken‑Ready Data</h1>
  <p>
    Convert Excel files (.xlsx, .xls) to QIF (Quicken Interchange Format) instantly.
    No upload, no sign‑up – 100% browser‑based. Perfect for importing bank transactions into Quicken, GnuCash, or any QIF‑compatible software.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .xlsx, .xls, .csv</span>
    <span class="badge amber">✓ QIF Output</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- TOOL -->
<section aria-label="Excel to QIF Converter" style="display:flex;justify-content:center">
<div class="excel-wrap">

  <!-- Upload Panel -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-upload" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#e2c08d"></i> Upload Excel File</div>
        <div class="panel-sub">Drag &amp; drop or click to choose a file (.xlsx, .xls, .csv)</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn" id="btn-clear-file"><i class="ti ti-trash" aria-hidden="true"></i> Clear</button>
      </div>
    </div>
    <div class="drop-zone" id="drop-zone" role="button" tabindex="0">
      <div class="drop-zone-icon"><i class="ti ti-file-spreadsheet" aria-hidden="true"></i></div>
      <div class="drop-zone-text"><strong>Drop your Excel file here</strong> or click to browse</div>
      <div class="drop-zone-sub">Supports .xlsx, .xls, .csv files</div>
      <div class="drop-zone-file" id="file-name"></div>
      <input type="file" id="file-input" accept=".xlsx,.xls,.csv" style="display:none;">
    </div>
    <div id="loading-container" style="display:none;">
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text">Parsing Excel...</span>
      </div>
    </div>
  </div>

  <!-- Sheet Selector (if multiple sheets) -->
  <div class="panel-card" id="sheet-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-layers" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i> Select Sheet</div>
        <div class="panel-sub">Choose the worksheet to convert</div>
      </div>
      <div class="btn-row">
        <select id="sheet-select" class="excel-btn" style="background:#252526;color:#d4d4d4;border:1px solid #3c3c3c;padding:6px 14px;border-radius:4px;"></select>
        <button class="excel-btn primary" id="btn-load-sheet">Load Sheet</button>
      </div>
    </div>
  </div>

  <!-- Column Mapping (if needed) -->
  <div class="panel-card" id="mapping-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-settings" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i> Column Mapping</div>
        <div class="panel-sub">Map columns to QIF fields (auto‑detected, adjust if needed)</div>
      </div>
    </div>
    <div style="padding:12px 16px;" id="mapping-container"></div>
    <div class="btn-row" style="padding:0 16px 12px;">
      <button class="excel-btn primary" id="btn-map-confirm">✓ Confirm Mapping & Convert</button>
    </div>
  </div>

  <!-- Convert Panel (if no mapping needed) -->
  <div class="panel-card" id="convert-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-settings" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i> Convert to QIF</div>
        <div class="panel-sub">Your Excel data is ready – click Convert to generate QIF</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn primary" id="btn-convert">🔄 Convert to QIF</button>
      </div>
    </div>
    <div style="padding:8px 16px;font-size:11px;color:#6a9955;" id="file-summary">No file loaded</div>
  </div>

  <!-- Output Panel -->
  <div class="panel-card" id="output-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-file-export" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#6fcf97"></i> QIF Output</div>
        <div class="panel-sub" id="output-format-label">Preview QIF text – copy or download</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn green" id="btn-copy"><i class="ti ti-copy" aria-hidden="true"></i> Copy QIF</button>
        <button class="excel-btn amber" id="btn-export"><i class="ti ti-download" aria-hidden="true"></i> Export .qif</button>
      </div>
    </div>
    <div id="output-content" class="output-preview" style="white-space:pre;font-family:var(--font-mono,monospace);font-size:12px;padding:12px;background:#1b1b1b;border:1px solid #2d2d2d;border-radius:5px;margin:10px 16px 16px;max-height:400px;overflow:auto;color:#d4d4d4;">
      <div style="color:#4a4a4a;text-align:center;padding:20px;">No output yet</div>
    </div>
  </div>

</div>
</section>

<!-- Content (shortened) -->
<article class="onpage-content">
 <div class="blog-post-meta">
     <a href="sohail-anwar" style="display:flex; gap: 10px;" class="link">
      <img src="assets/img/sohail-anwar.png" alt="Sohail Anwar" class="author-img">
      <span class="author-name">Sohail Anwar</span>
      </a>
      <span class="post-date">December 01, 2025</span>
  </div>
  <section id="why-convert"><h2>Why convert Excel to QIF?</h2><ul><li>Import spreadsheet‑based transactions into Quicken</li><li>Use with GnuCash, Money, or other QIF‑compatible tools</li><li>Easy migration from any Excel‑exporting system</li></ul></section>
  <section id="how-it-works"><h2>How to convert – 3 simple steps</h2><ul><li>Upload your Excel file</li><li>Select a sheet (if multiple)</li><li>Map columns if needed, then convert and download .qif</li></ul></section>
  <section id="features"><h2>Features</h2><ul><li>✅ Privacy first – everything stays local</li><li>✅ Uses SheetJS for robust Excel parsing</li><li>✅ Auto‑detects columns with manual mapping option</li><li>✅ Free forever</li></ul></section>
  <section id="privacy"><h2>Privacy &amp; Security</h2><ul><li>🔒 All processing is local – no files uploaded</li><li>🚫 No tracking, no logs</li><li>💼 Safe for sensitive financial data</li></ul></section>
  <section id="faq"><h2>Frequently Asked Questions</h2><h3>What Excel formats are supported?</h3><p>.xlsx, .xls, and .csv files are supported.</p><h3>Does it handle multiple sheets?</h3><p>Yes, a dropdown lets you choose which sheet to convert.</p><h3>Will the QIF work in Quicken?</h3><p>Yes, the generated QIF follows standard format and imports into Quicken and similar apps.</p></section>
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
  var sheetPanel = document.getElementById('sheet-panel');
  var sheetSelect = document.getElementById('sheet-select');
  var btnLoadSheet = document.getElementById('btn-load-sheet');
  var mappingPanel = document.getElementById('mapping-panel');
  var mappingContainer = document.getElementById('mapping-container');
  var convertPanel = document.getElementById('convert-panel');
  var outputPanel = document.getElementById('output-panel');
  var outputContent = document.getElementById('output-content');
  var loadingContainer = document.getElementById('loading-container');
  var btnConvert = document.getElementById('btn-convert');
  var btnMapConfirm = document.getElementById('btn-map-confirm');
  var btnClear = document.getElementById('btn-clear-file');
  var btnCopy = document.getElementById('btn-copy');
  var btnExport = document.getElementById('btn-export');
  var outputLabel = document.getElementById('output-format-label');

  var currentFile = null;
  var workbook = null;
  var currentSheetData = null; // array of row arrays (first row headers)
  var parsedRows = null; // array of objects after applying mapping
  var columnMap = {};
  var outputQIF = '';

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

  // ---- Auto‑detect column mapping from headers ----
  function autoDetectColumns(headers) {
    var map = {};
    var lowerHeaders = headers.map(h => h.toLowerCase());

    var dateIdx = lowerHeaders.findIndex(h => /date/i.test(h) || /trans/i.test(h) && /date/i.test(h));
    if (dateIdx >= 0) map.date = headers[dateIdx];

    var amtIdx = lowerHeaders.findIndex(h => /amount|amt|value|total/i.test(h));
    if (amtIdx >= 0) map.amount = headers[amtIdx];

    var payIdx = lowerHeaders.findIndex(h => /payee|pay|description|desc|name|beneficiary|party/i.test(h));
    if (payIdx >= 0) map.payee = headers[payIdx];

    var memoIdx = lowerHeaders.findIndex(h => /memo|notes|comment|detail|reference|ref/i.test(h));
    if (memoIdx >= 0) map.memo = headers[memoIdx];

    var checkIdx = lowerHeaders.findIndex(h => /check|cheque|num|#/i.test(h));
    if (checkIdx >= 0) map.checkNum = headers[checkIdx];

    var catIdx = lowerHeaders.findIndex(h => /category|cat|type|class/i.test(h));
    if (catIdx >= 0) map.category = headers[catIdx];

    return map;
  }

  // ---- Generate QIF from row objects ----
  function generateQIF(rows, map) {
    var lines = ['!Type:Bank'];
    rows.forEach(function(row) {
      var date = row[map.date] || '';
      var d = new Date(date);
      var dateStr = (!isNaN(d)) ? (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear() : date;
      var amount = parseFloat(row[map.amount]) || 0;
      var payee = row[map.payee] || '';
      var memo = row[map.memo] || '';
      var check = row[map.checkNum] || '';
      var category = row[map.category] || '';
      lines.push('D' + dateStr);
      lines.push('T' + amount.toFixed(2));
      if (payee) lines.push('P' + payee);
      if (memo) lines.push('M' + memo);
      if (check) lines.push('N' + check);
      if (category) lines.push('L' + category);
      lines.push('^');
    });
    return lines.join('\n');
  }

  // ---- Load a specific sheet from workbook ----
  function loadSheet(sheetName) {
    if (!workbook) return;
    var sheet = workbook.Sheets[sheetName];
    if (!sheet) { showToast('Sheet not found.', 'error'); return; }
    var data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (!data || data.length < 2) {
      showToast('Sheet is empty or has only headers.', 'error');
      return;
    }
    currentSheetData = data;
    var headers = data[0];
    var rows = data.slice(1).map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) {
        obj[h] = row[i] || '';
      });
      return obj;
    });
    parsedRows = rows;
    var map = autoDetectColumns(headers);
    columnMap = map;

    // Check required fields
    var required = ['date', 'amount', 'payee'];
    var missing = required.filter(f => !map[f]);

    if (missing.length > 0) {
      // Show mapping panel
      mappingPanel.style.display = 'block';
      var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
      var fields = [
        { key: 'date', label: 'Date' },
        { key: 'amount', label: 'Amount' },
        { key: 'payee', label: 'Payee' },
        { key: 'memo', label: 'Memo (optional)' },
        { key: 'checkNum', label: 'Check # (optional)' },
        { key: 'category', label: 'Category (optional)' }
      ];
      fields.forEach(function(f) {
        var selected = map[f.key] || '';
        html += '<div style="font-size:12px;color:#7a7a7a;">' + f.label + '</div>';
        html += '<div><select class="excel-btn" style="width:100%;" data-field="' + f.key + '">';
        html += '<option value="">— none —</option>';
        headers.forEach(function(h) {
          var sel = (h === selected) ? ' selected' : '';
          html += '<option value="' + h + '"' + sel + '>' + h + '</option>';
        });
        html += '</select></div>';
      });
      html += '</div>';
      mappingContainer.innerHTML = html;

      mappingContainer.querySelectorAll('select').forEach(function(sel) {
        sel.addEventListener('change', function() {
          var field = this.dataset.field;
          columnMap[field] = this.value || '';
        });
      });

      btnMapConfirm.style.display = 'inline-block';
      btnConvert.style.display = 'none';
      convertPanel.style.display = 'block';
      showToast('Please map the missing columns and click Confirm.', 'info');
    } else {
      // All required found – show direct convert button
      mappingPanel.style.display = 'none';
      btnConvert.style.display = 'inline-block';
      btnMapConfirm.style.display = 'none';
      convertPanel.style.display = 'block';
      fileSummary.textContent = sheetName + ' — ' + rows.length + ' rows ready';
      showToast('Sheet loaded – click Convert to QIF', 'success');
    }
  }

  // ---- Handle file upload ----
  function processFile(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      showToast('Please upload an Excel or CSV file.', 'error');
      return;
    }

    currentFile = file;
    fileNameDisplay.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
    fileSummary.textContent = file.name + ' — processing...';
    convertPanel.style.display = 'none';
    outputPanel.style.display = 'none';
    mappingPanel.style.display = 'none';
    sheetPanel.style.display = 'none';
    loadingContainer.style.display = 'block';

    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = new Uint8Array(e.target.result);
        workbook = XLSX.read(data, { type: 'array' });
        var sheetNames = workbook.SheetNames;
        if (sheetNames.length === 0) {
          showToast('No sheets found in the file.', 'error');
          loadingContainer.style.display = 'none';
          return;
        }
        // Populate sheet dropdown
        sheetSelect.innerHTML = '';
        sheetNames.forEach(function(name) {
          var opt = document.createElement('option');
          opt.value = name;
          opt.textContent = name;
          sheetSelect.appendChild(opt);
        });
        if (sheetNames.length > 1) {
          sheetPanel.style.display = 'block';
          // Load first sheet automatically
          loadSheet(sheetNames[0]);
        } else {
          sheetPanel.style.display = 'none';
          loadSheet(sheetNames[0]);
        }
        loadingContainer.style.display = 'none';
        showToast('File loaded successfully', 'success');
      } catch (err) {
        loadingContainer.style.display = 'none';
        showToast('Error parsing file: ' + err.message, 'error');
        console.error(err);
      }
    };
    reader.onerror = function() {
      loadingContainer.style.display = 'none';
      showToast('Error reading file', 'error');
    };
    reader.readAsArrayBuffer(file);
  }

  // ---- Conversion with mapping ----
  function convertWithMapping(map) {
    if (!parsedRows || parsedRows.length === 0) {
      showToast('No data to convert.', 'error');
      return;
    }
    if (!map.date || !map.amount || !map.payee) {
      showToast('Please map Date, Amount, and Payee columns at minimum.', 'error');
      return;
    }
    outputQIF = generateQIF(parsedRows, map);
    outputPanel.style.display = 'block';
    outputContent.textContent = outputQIF;
    if (outputLabel) outputLabel.textContent = 'QIF – ' + parsedRows.length + ' transactions';
    showToast('Conversion successful!', 'success');
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

  btnLoadSheet.addEventListener('click', function() {
    var name = sheetSelect.value;
    if (name) loadSheet(name);
  });

  btnConvert.addEventListener('click', function() {
    convertWithMapping(columnMap);
  });

  btnMapConfirm.addEventListener('click', function() {
    var selects = mappingContainer.querySelectorAll('select');
    selects.forEach(function(sel) {
      columnMap[sel.dataset.field] = sel.value;
    });
    if (!columnMap.date || !columnMap.amount || !columnMap.payee) {
      showToast('Please map Date, Amount, and Payee columns.', 'error');
      return;
    }
    convertWithMapping(columnMap);
  });

  btnClear.addEventListener('click', function() {
    fileInput.value = '';
    fileNameDisplay.textContent = '';
    fileSummary.textContent = '';
    currentFile = null;
    workbook = null;
    currentSheetData = null;
    parsedRows = null;
    columnMap = {};
    outputQIF = '';
    convertPanel.style.display = 'none';
    sheetPanel.style.display = 'none';
    mappingPanel.style.display = 'none';
    outputPanel.style.display = 'none';
    loadingContainer.style.display = 'none';
    showToast('Cleared', 'success');
  });

  btnCopy.addEventListener('click', function() {
    if (!outputQIF) { showToast('No data to copy.', 'error'); return; }
    navigator.clipboard.writeText(outputQIF).then(function() {
      showToast('QIF copied!', 'success');
    }).catch(function() {
      var ta = document.createElement('textarea');
      ta.value = outputQIF;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied!', 'success');
    });
  });

  btnExport.addEventListener('click', function() {
    if (!outputQIF) { showToast('No data to export.', 'error'); return; }
    var blob = new Blob([outputQIF], { type: 'text/plain;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'converted.qif';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('QIF downloaded!', 'success');
  });

})();
</script>