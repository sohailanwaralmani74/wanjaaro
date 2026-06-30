---
layout: main
title: "CSV to QIF Converter – Free, Secure & Browser‑Based | DataFrog"
description: "Convert CSV files to QIF (Quicken Interchange Format) instantly. No upload, no sign‑up. Fully client‑side. Download as .qif."
keywords: "csv to qif, convert csv to qif, csv qif converter, spreadsheet to quicken, csv to qif online"
category: csvFinance
---

<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/csv-to-qif#webapp",
    "name": "CSV to QIF Converter",
    "url": "https://datafrog.tools/csv-to-qif",
    "description": "Convert CSV files to QIF format. All processing stays in your browser.",
    "applicationCategory": "FinanceConverter",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "100% client‑side – no file upload",
      "Parses CSV with auto‑detected headers (date, amount, payee, memo, check#)",
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
    "@id": "https://datafrog.tools/csv-to-qif#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What CSV format is supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Any CSV with a header row. The tool tries to auto‑detect columns for Date, Amount, Payee, Memo, and Check#. You can also manually map columns."
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
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://datafrog.tools/csv-to-qif#howto",
    "name": "How to Convert CSV to QIF",
    "description": "Step‑by‑step guide to convert your CSV file to QIF.",
    "tool": {
      "@type": "HowToTool",
      "name": "CSV to QIF Converter"
    },
    "supply": {
      "@type": "HowToSupply",
      "name": "CSV file (.csv)"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload your CSV file",
        "text": "Drag and drop or click to select your .csv file."
      },
      {
        "@type": "HowToStep",
        "name": "Map columns (optional)",
        "text": "If auto‑detection fails, you can map which columns are Date, Amount, Payee, etc."
      },
      {
        "@type": "HowToStep",
        "name": "Click Convert",
        "text": "The tool generates QIF text."
      },
      {
        "@type": "HowToStep",
        "name": "Export or Copy",
        "text": "Download the .qif file or copy the text to clipboard."
      }
    ],
    "totalTime": "PT2M"
  }
]
</script>

<!-- HERO -->
<div class="home-hero" >
  <h1>CSV to QIF Converter – Turn Spreadsheets into Quicken‑Ready Data</h1>
  <p>
    Convert CSV files to QIF (Quicken Interchange Format) instantly.
    No upload, no sign‑up – 100% browser‑based. Perfect for importing bank transactions into Quicken, GnuCash, or any QIF‑compatible software.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .csv</span>
    <span class="badge amber">✓ QIF Output</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- TOOL -->
<section aria-label="CSV to QIF Converter" style="display:flex;justify-content:center">
<div class="excel-wrap">

  <!-- Upload Panel -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-upload" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#e2c08d"></i> Upload CSV File</div>
        <div class="panel-sub">Drag &amp; drop or click to choose a .csv file</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn" id="btn-clear-file"><i class="ti ti-trash" aria-hidden="true"></i> Clear</button>
      </div>
    </div>
    <div class="drop-zone" id="drop-zone" role="button" tabindex="0">
      <div class="drop-zone-icon"><i class="ti ti-file-spreadsheet" aria-hidden="true"></i></div>
      <div class="drop-zone-text"><strong>Drop your CSV file here</strong> or click to browse</div>
      <div class="drop-zone-sub">Supports .csv files (comma, tab, or semicolon delimited)</div>
      <div class="drop-zone-file" id="file-name"></div>
      <input type="file" id="file-input" accept=".csv" style="display:none;">
    </div>
    <div id="loading-container" style="display:none;">
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text">Parsing CSV...</span>
      </div>
    </div>
  </div>

  <!-- Column Mapping (if needed) -->
  <div class="panel-card" id="mapping-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-settings" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i> Column Mapping</div>
        <div class="panel-sub">Map CSV columns to QIF fields (auto‑detected, adjust if needed)</div>
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
        <div class="panel-sub">Your CSV file is ready – click Convert to generate QIF</div>
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

<!-- Content (shortened for brevity) -->
<article class="onpage-content">
 <div class="blog-post-meta">
     <a href="sohail-anwar" style="display:flex; gap: 10px;" class="link">
      <img src="assets/img/saeed-ahmed.jpg" alt="Sohail Anwar" class="author-img">
      <span class="author-name">Sohail Anwar</span>
      </a>
      <span class="post-date">December 01, 2025</span>
  </div>
  <section id="why-convert"><h2>Why convert CSV to QIF?</h2><ul><li>Import spreadsheet‑based bank transactions into Quicken</li><li>Use QIF with GnuCash, Money, or other personal finance tools</li><li>Easily migrate data from any CSV‑exporting system</li></ul></section>
  <section id="how-it-works"><h2>How to convert – 3 simple steps</h2><ul><li>Upload your .csv file</li><li>Map columns (auto‑detected, adjust if needed)</li><li>Click Convert, then copy or download the .qif</li></ul></section>
  <section id="features"><h2>Features</h2><ul><li>✅ Privacy first – everything stays local</li><li>✅ Auto‑detects date, amount, payee, memo, check# columns</li><li>✅ Manual column mapping if needed</li><li>✅ Free forever</li></ul></section>
  <section id="privacy"><h2>Privacy &amp; Security</h2><ul><li>🔒 All processing is local – no files uploaded</li><li>🚫 No tracking, no logs</li><li>💼 Safe for sensitive financial data</li></ul></section>
  <section id="faq"><h2>Frequently Asked Questions</h2><h3>What CSV format is expected?</h3><p>The tool expects a header row with column names like "Date", "Amount", "Payee", etc. If auto‑detection fails, you can manually map columns.</p><h3>What if my CSV uses semicolons?</h3><p>The tool tries to detect the delimiter (comma, semicolon, or tab) automatically.</p><h3>Will it work with Excel‑saved CSV?</h3><p>Yes, any standard CSV will work.</p></section>
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
  var mappingPanel = document.getElementById('mapping-panel');
  var mappingContainer = document.getElementById('mapping-container');
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
  var currentContent = null;
  var parsedCSV = null; // array of objects
  var columnMap = {}; // { date: 'colName', amount: 'colName', payee: 'colName', ... }
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

  // ---- Parse CSV ----
  function parseCSV(text) {
    // Detect delimiter
    var lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length === 0) return null;
    var first = lines[0];
    var delim = ',';
    if (first.includes('\t')) delim = '\t';
    else if (first.includes(';')) delim = ';';
    // Parse all rows
    var rows = lines.map(function(line) {
      // Simple split – could be improved with quote handling, but this works for most
      if (delim === ',') {
        // Handle quoted fields
        var regex = /(".*?"|[^,]+)(?=\s*,|\s*$)/g;
        var matches = line.match(regex);
        if (matches) return matches.map(function(m) { return m.replace(/^"|"$/g, '').trim(); });
      }
      return line.split(delim).map(function(s) { return s.trim(); });
    });
    // Ensure all rows have same length
    var maxLen = Math.max.apply(null, rows.map(r => r.length));
    rows = rows.map(function(r) {
      while (r.length < maxLen) r.push('');
      return r;
    });
    var headers = rows[0];
    var dataRows = rows.slice(1);
    var objects = dataRows.map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) {
        obj[h] = row[i] || '';
      });
      return obj;
    });
    return { headers: headers, rows: objects };
  }

  // ---- Auto‑detect column mapping ----
  function autoDetectColumns(headers) {
    var map = {};
    var lowerHeaders = headers.map(h => h.toLowerCase());
    // Date
    var dateIdx = lowerHeaders.findIndex(h => /date/i.test(h) || /trans/i.test(h) && /date/i.test(h));
    if (dateIdx >= 0) map.date = headers[dateIdx];
    // Amount
    var amtIdx = lowerHeaders.findIndex(h => /amount|amt|value|total/i.test(h));
    if (amtIdx >= 0) map.amount = headers[amtIdx];
    // Payee
    var payIdx = lowerHeaders.findIndex(h => /payee|pay|description|desc|name|beneficiary|party/i.test(h));
    if (payIdx >= 0) map.payee = headers[payIdx];
    // Memo
    var memoIdx = lowerHeaders.findIndex(h => /memo|notes|comment|detail|reference|ref/i.test(h));
    if (memoIdx >= 0) map.memo = headers[memoIdx];
    // Check number
    var checkIdx = lowerHeaders.findIndex(h => /check|cheque|num|#/i.test(h));
    if (checkIdx >= 0) map.checkNum = headers[checkIdx];
    // Category (optional)
    var catIdx = lowerHeaders.findIndex(h => /category|cat|type|class/i.test(h));
    if (catIdx >= 0) map.category = headers[catIdx];
    return map;
  }

  // ---- Generate QIF ----
  function generateQIF(rows, map) {
    var lines = ['!Type:Bank'];
    rows.forEach(function(row) {
      var date = row[map.date] || '';
      // try to parse date to MM/DD/YYYY
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

  // ---- Conversion (with mapping) ----
  function convertWithMapping(map) {
    if (!parsedCSV) {
      showToast('No CSV data.', 'error');
      return;
    }
    // Validate that required fields are mapped
    if (!map.date || !map.amount || !map.payee) {
      showToast('Please map Date, Amount, and Payee columns at minimum.', 'error');
      return;
    }
    outputQIF = generateQIF(parsedCSV.rows, map);
    outputPanel.style.display = 'block';
    outputContent.textContent = outputQIF;
    if (outputLabel) outputLabel.textContent = 'QIF – ' + parsedCSV.rows.length + ' transactions';
    showToast('Conversion successful!', 'success');
  }

  // ---- File handling ----
  function processFile(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'csv') {
      showToast('Please upload a valid .csv file.', 'error');
      return;
    }

    currentFile = file;
    fileNameDisplay.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
    fileSummary.textContent = file.name + ' — ready to convert';
    convertPanel.style.display = 'block';
    outputPanel.style.display = 'none';
    mappingPanel.style.display = 'none';

    var reader = new FileReader();
    reader.onload = function(e) {
      currentContent = e.target.result;
      var parsed = parseCSV(currentContent);
      if (!parsed || parsed.rows.length === 0) {
        showToast('No data found in CSV.', 'error');
        return;
      }
      parsedCSV = parsed;
      // Auto‑detect mapping
      var map = autoDetectColumns(parsed.headers);
      columnMap = map;
      // Check if we have all required fields
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
          parsed.headers.forEach(function(h) {
            var sel = (h === selected) ? ' selected' : '';
            html += '<option value="' + h + '"' + sel + '>' + h + '</option>';
          });
          html += '</select></div>';
        });
        html += '</div>';
        mappingContainer.innerHTML = html;
        // Store mapping on change
        mappingContainer.querySelectorAll('select').forEach(function(sel) {
          sel.addEventListener('change', function() {
            var field = this.dataset.field;
            columnMap[field] = this.value || '';
          });
        });
        // Pre‑fill selected values
        // already done
        btnMapConfirm.style.display = 'inline-block';
        btnConvert.style.display = 'none';
        showToast('Please map the missing columns and click Confirm.', 'info');
      } else {
        // All required found – show direct convert button
        mappingPanel.style.display = 'none';
        btnConvert.style.display = 'inline-block';
        btnMapConfirm.style.display = 'none';
        showToast('CSV loaded – click Convert to QIF', 'success');
      }
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

  btnConvert.addEventListener('click', function() {
    convertWithMapping(columnMap);
  });

  btnMapConfirm.addEventListener('click', function() {
    // Gather current mapping
    var selects = mappingContainer.querySelectorAll('select');
    selects.forEach(function(sel) {
      columnMap[sel.dataset.field] = sel.value;
    });
    // Check required
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
    currentContent = null;
    parsedCSV = null;
    columnMap = {};
    outputQIF = '';
    convertPanel.style.display = 'none';
    mappingPanel.style.display = 'none';
    outputPanel.style.display = 'none';
    loadingContainer.style.display = 'none';
    showToast('Cleared', 'success');
  });

  btnCopy.addEventListener('click', function() {
    if (!outputQIF) {
      showToast('No data to copy.', 'error');
      return;
    }
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
    if (!outputQIF) {
      showToast('No data to export.', 'error');
      return;
    }
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