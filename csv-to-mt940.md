---
layout: main
title: "CSV to MT940 Converter – Free, Secure & Browser‑Based | DataFrog"
description: "Convert CSV files to SWIFT MT940 format instantly. No upload, no sign‑up. Fully client‑side. Download as .mt940."
keywords: "csv to mt940, convert csv to mt940, csv mt940 converter, spreadsheet to swift mt940, csv to mt940 online"
category: csvFinance
---

<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/csv-to-mt940#webapp",
    "name": "CSV to MT940 Converter",
    "url": "https://datafrog.tools/csv-to-mt940",
    "description": "Convert CSV files to SWIFT MT940 format. All processing stays in your browser.",
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
      "Outputs MT940 – compatible with banking systems",
      "Preview MT940 before downloading",
      "Copy MT940 to clipboard or download .mt940 file",
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
    "@id": "https://datafrog.tools/csv-to-mt940#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What CSV format is supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Any CSV with a header row. The tool auto‑detects columns for Date, Amount, Payee, Memo, and Check#. You can also manually map columns."
        }
      },
      {
        "@type": "Question",
        "name": "What is MT940?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MT940 is a SWIFT standard for bank statement reporting, used by many financial systems for electronic statements."
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
    "@id": "https://datafrog.tools/csv-to-mt940#howto",
    "name": "How to Convert CSV to MT940",
    "description": "Step‑by‑step guide to convert your CSV file to MT940.",
    "tool": {
      "@type": "HowToTool",
      "name": "CSV to MT940 Converter"
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
        "text": "The tool generates MT940 text."
      },
      {
        "@type": "HowToStep",
        "name": "Export or Copy",
        "text": "Download the .mt940 file or copy the text to clipboard."
      }
    ],
    "totalTime": "PT2M"
  }
]
</script>

<!-- HERO -->
<div class="home-hero" >
  <h1>CSV to MT940 Converter – Turn Spreadsheets into Bank‑Ready Statements</h1>
  <p>
    Convert CSV files to SWIFT MT940 format instantly.
    No upload, no sign‑up – 100% browser‑based. Perfect for banks and financial systems that expect MT940 statements.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .csv</span>
    <span class="badge amber">✓ MT940 Output</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- TOOL -->
<section aria-label="CSV to MT940 Converter" style="display:flex;justify-content:center">
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
        <div class="panel-sub">Map CSV columns to MT940 fields (auto‑detected, adjust if needed)</div>
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
        <div class="panel-title"><i class="ti ti-settings" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i> Convert to MT940</div>
        <div class="panel-sub">Your CSV file is ready – click Convert to generate MT940</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn primary" id="btn-convert">🔄 Convert to MT940</button>
      </div>
    </div>
    <div style="padding:8px 16px;font-size:11px;color:#6a9955;" id="file-summary">No file loaded</div>
  </div>

  <!-- Output Panel -->
  <div class="panel-card" id="output-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-file-export" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#6fcf97"></i> MT940 Output</div>
        <div class="panel-sub" id="output-format-label">Preview MT940 text – copy or download</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn green" id="btn-copy"><i class="ti ti-copy" aria-hidden="true"></i> Copy MT940</button>
        <button class="excel-btn amber" id="btn-export"><i class="ti ti-download" aria-hidden="true"></i> Export .mt940</button>
      </div>
    </div>
    <div id="output-content" class="output-preview" style="white-space:pre;font-family:var(--font-mono,monospace);font-size:12px;padding:12px;background:#1b1b1b;border:1px solid #2d2d2d;border-radius:5px;margin:10px 16px 16px;max-height:400px;overflow:auto;color:#d4d4d4;">
      <div style="color:#4a4a4a;text-align:center;padding:20px;">No output yet</div>
    </div>
  </div>

</div>
</section>

<!-- Content -->
<article class="onpage-content">
 <div class="blog-post-meta">
     <a href="sohail-anwar" style="display:flex; gap: 10px;" class="link">
      <img src="assets/img/sohail-anwar.png" alt="Sohail Anwar" class="author-img">
      <span class="author-name">Sohail Anwar</span>
      </a>
      <span class="post-date">December 01, 2025</span>
  </div>
  <section id="why-convert"><h2>Why convert CSV to MT940?</h2><ul><li>Import spreadsheet‑based bank transactions into banking systems</li><li>Comply with SWIFT standards for electronic statements</li><li>Use with treasury management, ERP, or custom financial applications</li></ul></section>
  <section id="how-it-works"><h2>How to convert – 3 simple steps</h2><ul><li>Upload your .csv file</li><li>Map columns (auto‑detected, adjust if needed)</li><li>Click Convert, then copy or download the .mt940</li></ul></section>
  <section id="features"><h2>Features</h2><ul><li>✅ Privacy first – everything stays local</li><li>✅ Auto‑detects date, amount, payee, memo, check# columns</li><li>✅ Manual column mapping if needed</li><li>✅ Free forever</li></ul></section>
  <section id="privacy"><h2>Privacy &amp; Security</h2><ul><li>🔒 All processing is local – no files uploaded</li><li>🚫 No tracking, no logs</li><li>💼 Safe for sensitive financial data</li></ul></section>
  <section id="faq"><h2>Frequently Asked Questions</h2><h3>What CSV format is expected?</h3><p>The tool expects a header row with column names like "Date", "Amount", "Payee", etc. If auto‑detection fails, you can manually map columns.</p><h3>What is MT940?</h3><p>MT940 is a SWIFT standard for bank statement reporting, used by many financial systems.</p><h3>Will the MT940 be valid?</h3><p>The generated MT940 includes standard tags: :25: (account), :28C: (statement), :60F: (opening balance), :61: (transactions), :86: (descriptions), :62F: (closing balance). It should be accepted by most systems.</p></section>
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
  var parsedCSV = null;
  var columnMap = {};
  var outputMT940 = '';

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
    var lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length === 0) return null;
    var first = lines[0];
    var delim = ',';
    if (first.includes('\t')) delim = '\t';
    else if (first.includes(';')) delim = ';';

    var rows = lines.map(function(line) {
      if (delim === ',') {
        var regex = /(".*?"|[^,]+)(?=\s*,|\s*$)/g;
        var matches = line.match(regex);
        if (matches) return matches.map(function(m) { return m.replace(/^"|"$/g, '').trim(); });
      }
      return line.split(delim).map(function(s) { return s.trim(); });
    });

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

    // Account, currency optional
    var accountIdx = lowerHeaders.findIndex(h => /account|iban|acct|acc/i.test(h));
    if (accountIdx >= 0) map.account = headers[accountIdx];

    var currencyIdx = lowerHeaders.findIndex(h => /currency|ccy|cur/i.test(h));
    if (currencyIdx >= 0) map.currency = headers[currencyIdx];

    return map;
  }

  // ---- Generate MT940 ----
  function generateMT940(rows, map) {
    if (rows.length === 0) return '';

    var account = map.account ? rows[0][map.account] || 'Unknown' : 'Unknown';
    var statement = '001';
    var currency = map.currency ? rows[0][map.currency] || 'USD' : 'USD';

    // Compute total sum of amounts to get closing balance
    var total = rows.reduce(function(sum, r) {
      var amt = parseFloat(r[map.amount]) || 0;
      return sum + amt;
    }, 0);

    var openingBalance = 0; // assume 0, but we could optionally set from a separate column
    var closingBalance = total;

    var lines = [];
    lines.push(':25:' + account);
    lines.push(':28C:' + statement);

    // Opening balance (assume 0)
    var obSign = openingBalance >= 0 ? 'C' : 'D';
    var obAbs = Math.abs(openingBalance);
    lines.push(':60F:' + obSign + obAbs.toFixed(2) + currency);

    rows.forEach(function(row) {
      var dateStr = row[map.date] || '';
      var d = new Date(dateStr);
      if (isNaN(d)) d = new Date(); // fallback
      var yymmdd = String(d.getFullYear()).slice(2) +
                   String(d.getMonth()+1).padStart(2, '0') +
                   String(d.getDate()).padStart(2, '0');

      var amount = parseFloat(row[map.amount]) || 0;
      var sign = amount >= 0 ? 'C' : 'D';
      var absAmt = Math.abs(amount);
      var amtStr = absAmt.toFixed(2).replace('.', ',');
      var ref = row[map.checkNum] || row[map.memo] || 'NONREF';
      // Limit ref to 16 chars
      var refPart = ref.substring(0, 16);

      var line61 = ':61:' + yymmdd + sign + amtStr + 'N' + refPart;
      lines.push(line61);

      var desc = row[map.payee] || row[map.memo] || '';
      if (desc) {
        lines.push(':86:' + desc);
      } else {
        lines.push(':86:');
      }
    });

    // Closing balance
    var cbSign = closingBalance >= 0 ? 'C' : 'D';
    var cbAbs = Math.abs(closingBalance);
    lines.push(':62F:' + cbSign + cbAbs.toFixed(2) + currency);
    lines.push('-');

    return lines.join('\n');
  }

  // ---- Conversion with mapping ----
  function convertWithMapping(map) {
    if (!parsedCSV) {
      showToast('No CSV data.', 'error');
      return;
    }
    if (!map.date || !map.amount || !map.payee) {
      showToast('Please map Date, Amount, and Payee columns at minimum.', 'error');
      return;
    }

    outputMT940 = generateMT940(parsedCSV.rows, map);
    outputPanel.style.display = 'block';
    outputContent.textContent = outputMT940;
    if (outputLabel) outputLabel.textContent = 'MT940 – ' + parsedCSV.rows.length + ' transactions';
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
      var map = autoDetectColumns(parsed.headers);
      columnMap = map;

      var required = ['date', 'amount', 'payee'];
      var missing = required.filter(f => !map[f]);

      if (missing.length > 0) {
        mappingPanel.style.display = 'block';
        var html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
        var fields = [
          { key: 'date', label: 'Date' },
          { key: 'amount', label: 'Amount' },
          { key: 'payee', label: 'Payee' },
          { key: 'memo', label: 'Memo (optional)' },
          { key: 'checkNum', label: 'Check # (optional)' },
          { key: 'account', label: 'Account (optional)' },
          { key: 'currency', label: 'Currency (optional)' }
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

        mappingContainer.querySelectorAll('select').forEach(function(sel) {
          sel.addEventListener('change', function() {
            var field = this.dataset.field;
            columnMap[field] = this.value || '';
          });
        });

        btnMapConfirm.style.display = 'inline-block';
        btnConvert.style.display = 'none';
        showToast('Please map the missing columns and click Confirm.', 'info');
      } else {
        mappingPanel.style.display = 'none';
        btnConvert.style.display = 'inline-block';
        btnMapConfirm.style.display = 'none';
        showToast('CSV loaded – click Convert to MT940', 'success');
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
    currentContent = null;
    parsedCSV = null;
    columnMap = {};
    outputMT940 = '';
    convertPanel.style.display = 'none';
    mappingPanel.style.display = 'none';
    outputPanel.style.display = 'none';
    loadingContainer.style.display = 'none';
    showToast('Cleared', 'success');
  });

  btnCopy.addEventListener('click', function() {
    if (!outputMT940) {
      showToast('No data to copy.', 'error');
      return;
    }
    navigator.clipboard.writeText(outputMT940).then(function() {
      showToast('MT940 copied!', 'success');
    }).catch(function() {
      var ta = document.createElement('textarea');
      ta.value = outputMT940;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied!', 'success');
    });
  });

  btnExport.addEventListener('click', function() {
    if (!outputMT940) {
      showToast('No data to export.', 'error');
      return;
    }
    var blob = new Blob([outputMT940], { type: 'text/plain;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'converted.mt940';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('MT940 downloaded!', 'success');
  });

})();
</script>