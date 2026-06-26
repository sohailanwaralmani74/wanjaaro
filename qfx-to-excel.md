---
layout: main
title: "QFX to Excel Converter – Free, Secure & Browser‑Based | DataFrog"
description: "Convert QFX (OFX) files to Excel (.xlsx) instantly. No upload, no sign‑up. Fully client‑side. Download as .xlsx."
keywords: "qfx to excel, convert qfx to excel, qfx excel converter, ofx to excel, quicken to excel, qfx to xlsx"
category: qfxFinance
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/qfx-to-excel#webapp",
    "name": "QFX to Excel Converter",
    "url": "https://datafrog.tools/qfx-to-excel",
    "description": "Convert QFX (OFX) files to Excel format. All processing stays in your browser.",
    "applicationCategory": "FinanceConverter",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "100% client‑side – no file upload",
      "Parses OFX XML (QFX) files",
      "Extracts transactions: date, amount, type, payee, memo, reference",
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
    "@id": "https://datafrog.tools/qfx-to-excel#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is QFX?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "QFX is the file extension for OFX (Open Financial Exchange) files used by Quicken, Microsoft Money, and other personal finance software. It is an XML‑based format."
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
    "@id": "https://datafrog.tools/qfx-to-excel#howto",
    "name": "How to Convert QFX to Excel",
    "description": "Step‑by‑step guide to convert your QFX file to Excel.",
    "tool": {
      "@type": "HowToTool",
      "name": "QFX to Excel Converter"
    },
    "supply": {
      "@type": "HowToSupply",
      "name": "QFX file (.qfx)"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload your QFX file",
        "text": "Drag and drop or click to select your .qfx file."
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
<div id="qfx-hero" style="display:flex;flex-direction:column;justify-content:center;margin:1rem;">
  <h1>QFX to Excel Converter – Turn OFX Data into Spreadsheets</h1>
  <p>
    Convert QFX (OFX) files to Excel (.xlsx) format instantly.
    No upload, no sign‑up – 100% browser‑based. Perfect for analysing Quicken, bank, or investment transactions in Excel, Google Sheets, or any spreadsheet software.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .qfx</span>
    <span class="badge amber">✓ Excel Output</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- TOOL -->
<section aria-label="QFX to Excel Converter" style="display:flex;justify-content:center">
<div class="excel-wrap">

  <!-- Upload Panel -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-upload" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#e2c08d"></i> Upload QFX File</div>
        <div class="panel-sub">Drag &amp; drop or click to choose a .qfx file</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn" id="btn-clear-file"><i class="ti ti-trash" aria-hidden="true"></i> Clear</button>
      </div>
    </div>
    <div class="drop-zone" id="drop-zone" role="button" tabindex="0">
      <div class="drop-zone-icon"><i class="ti ti-file-text" aria-hidden="true"></i></div>
      <div class="drop-zone-text"><strong>Drop your QFX file here</strong> or click to browse</div>
      <div class="drop-zone-sub">Supports .qfx files</div>
      <div class="drop-zone-file" id="file-name"></div>
      <input type="file" id="file-input" accept=".qfx" style="display:none;">
    </div>
    <div id="loading-container" style="display:none;">
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text">Parsing QFX...</span>
      </div>
    </div>
  </div>

  <!-- Convert Panel -->
  <div class="panel-card" id="convert-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-settings" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i> Convert to Excel</div>
        <div class="panel-sub">Your QFX file is ready – click Convert to generate Excel</div>
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
<article style="max-width:90%;margin:40px auto;padding:10px 20px;line-height:1.7;font-family:Arial,sans-serif;">
  <section id="why-convert"><h2>Why convert QFX to Excel?</h2><ul><li>Analyse Quicken/bank transactions with pivot tables, charts, and filters</li><li>Combine with other data sources</li><li>Share with team members who don't have Quicken</li></ul></section>
  <section id="how-it-works"><h2>How to convert – 3 simple steps</h2><ol><li>Upload your .qfx file</li><li>Click Convert</li><li>Preview the table and download .xlsx</li></ol></section>
  <section id="features"><h2>Features</h2><ul><li>✅ Privacy first – everything stays local</li><li>✅ Parses OFX XML accurately</li><li>✅ Clean Excel output with formatting</li><li>✅ Free forever</li></ul></section>
  <section id="privacy"><h2>Privacy &amp; Security</h2><ul><li>🔒 All processing is local – no files uploaded</li><li>🚫 No tracking, no logs</li><li>💼 Safe for sensitive financial data</li></ul></section>
  <section id="faq"><h2>Frequently Asked Questions</h2><h3>What is QFX?</h3><p>QFX is the OFX XML format used by Quicken, Money, and many banks.</p><h3>What data is extracted?</h3><p>Transaction date, amount, type (credit/debit), payee name, memo, and reference (FITID).</p><h3>Will it handle investment transactions?</h3><p>Yes, the parser extracts standard OFX tags, including investment‑specific ones if present.</p></section>
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
  var parsedTransactions = null;
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

  // ---- Parse QFX (OFX XML) ----
  function parseQFX(xmlText) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    var transactions = [];

    var parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid XML: ' + parseError.textContent);
    }

    var stmttrns = xmlDoc.getElementsByTagName('STMTTRN');
    if (stmttrns.length === 0) stmttrns = xmlDoc.getElementsByTagName('INVSTMTTRN');
    if (stmttrns.length === 0) stmttrns = xmlDoc.getElementsByTagName('CCSTMTTRN');

    if (stmttrns.length === 0) {
      var blocks = xmlText.match(/<STMTTRN>([\s\S]*?)<\/STMTTRN>/g);
      if (blocks) {
        blocks.forEach(function(block) {
          var tx = {};
          var date = block.match(/<DTPOSTED>([^<]*)<\/DTPOSTED>/);
          if (date) tx.date = date[1].substring(0,8);
          var amt = block.match(/<TRNAMT>([^<]*)<\/TRNAMT>/);
          if (amt) tx.amount = parseFloat(amt[1]) || 0;
          var type = block.match(/<TRNTYPE>([^<]*)<\/TRNTYPE>/);
          if (type) tx.type = type[1];
          var name = block.match(/<NAME>([^<]*)<\/NAME>/);
          if (name) tx.payee = name[1];
          var memo = block.match(/<MEMO>([^<]*)<\/MEMO>/);
          if (memo) tx.memo = memo[1];
          var fitid = block.match(/<FITID>([^<]*)<\/FITID>/);
          if (fitid) tx.reference = fitid[1];
          if (!tx.payee) {
            var desc = block.match(/<DESC>([^<]*)<\/DESC>/);
            if (desc) tx.payee = desc[1];
          }
          if (tx.amount) tx.sign = tx.amount >= 0 ? 'C' : 'D';
          transactions.push(tx);
        });
        return transactions;
      }
    }

    for (var i = 0; i < stmttrns.length; i++) {
      var node = stmttrns[i];
      var tx = {};
      var dateNode = node.getElementsByTagName('DTPOSTED')[0];
      if (dateNode) {
        var dateStr = dateNode.textContent.trim();
        if (dateStr.length >= 8) {
          var y = dateStr.substring(0,4);
          var m = dateStr.substring(4,6);
          var d = dateStr.substring(6,8);
          tx.date = y + '-' + m + '-' + d;
        } else {
          tx.date = dateStr;
        }
      } else {
        var settleNode = node.getElementsByTagName('DTSETTLEMENT')[0];
        if (settleNode) {
          var dateStr = settleNode.textContent.trim();
          if (dateStr.length >= 8) {
            var y = dateStr.substring(0,4);
            var m = dateStr.substring(4,6);
            var d = dateStr.substring(6,8);
            tx.date = y + '-' + m + '-' + d;
          }
        }
      }
      var amtNode = node.getElementsByTagName('TRNAMT')[0];
      if (amtNode) {
        tx.amount = parseFloat(amtNode.textContent) || 0;
        tx.sign = tx.amount >= 0 ? 'C' : 'D';
      }
      var typeNode = node.getElementsByTagName('TRNTYPE')[0];
      if (typeNode) tx.type = typeNode.textContent.trim();
      var payeeNode = node.getElementsByTagName('NAME')[0];
      if (payeeNode) {
        tx.payee = payeeNode.textContent.trim();
      } else {
        var descNode = node.getElementsByTagName('DESC')[0];
        if (descNode) tx.payee = descNode.textContent.trim();
      }
      var memoNode = node.getElementsByTagName('MEMO')[0];
      if (memoNode) tx.memo = memoNode.textContent.trim();
      var refNode = node.getElementsByTagName('FITID')[0];
      if (refNode) tx.reference = refNode.textContent.trim();
      var checkNode = node.getElementsByTagName('CHECKNUM')[0];
      if (checkNode && !tx.reference) tx.reference = checkNode.textContent.trim();
      transactions.push(tx);
    }
    return transactions;
  }

  // ---- Generate CSV (for copy) ----
  function generateCSV(transactions) {
    if (!transactions || transactions.length === 0) return '';
    var header = ['Date', 'Amount', 'Type', 'Payee', 'Memo', 'Reference'];
    var rows = transactions.map(function(tx) {
      return [
        tx.date || '',
        (tx.amount || 0).toFixed(2),
        tx.type || '',
        tx.payee || '',
        tx.memo || '',
        tx.reference || ''
      ].join(',');
    });
    return header.join(',') + '\n' + rows.join('\n');
  }

  // ---- Generate Excel ----
  function generateExcel(transactions) {
    var wsData = [
      ['Date', 'Amount', 'Type', 'Payee', 'Memo', 'Reference']
    ];
    transactions.forEach(function(tx) {
      wsData.push([
        tx.date || '',
        tx.amount || 0,
        tx.type || '',
        tx.payee || '',
        tx.memo || '',
        tx.reference || ''
      ]);
    });
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  }

  // ---- Render preview table ----
  function renderPreview(transactions) {
    if (!transactions || transactions.length === 0) {
      return '<div style="color:#4a4a4a;text-align:center;padding:20px;">No transactions found.</div>';
    }
    var html = '<table class="csv-table"><thead><tr>';
    var headers = ['Date', 'Amount', 'Type', 'Payee', 'Memo', 'Reference'];
    headers.forEach(function(h) { html += '<th>' + h + '</th>'; });
    html += '</tr></thead><tbody>';
    transactions.forEach(function(tx) {
      html += '<tr>';
      html += '<td>' + (tx.date || '') + '</td>';
      html += '<td>' + (tx.amount || 0).toFixed(2) + '</td>';
      html += '<td>' + (tx.type || '') + '</td>';
      html += '<td>' + (tx.payee || '') + '</td>';
      html += '<td>' + (tx.memo || '') + '</td>';
      html += '<td>' + (tx.reference || '') + '</td>';
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
        var transactions = parseQFX(currentContent);
        if (!transactions || transactions.length === 0) {
          showToast('No transactions found in the QFX file.', 'error');
          loadingContainer.style.display = 'none';
          return;
        }
        parsedTransactions = transactions;
        outputCSV = generateCSV(transactions);
        outputExcelBuffer = generateExcel(transactions);

        outputPanel.style.display = 'block';
        outputContent.innerHTML = renderPreview(transactions);
        if (outputLabel) outputLabel.textContent = 'Excel preview – ' + transactions.length + ' transactions';

        loadingContainer.style.display = 'none';
        showToast('Conversion successful!', 'success');
      } catch (e) {
        loadingContainer.style.display = 'none';
        showToast('Error parsing QFX: ' + e.message, 'error');
        console.error(e);
      }
    }, 50);
  }

  // ---- File handling ----
  function processFile(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'qfx' && ext !== 'ofx') {
      showToast('Please upload a valid .qfx or .ofx file.', 'error');
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
    parsedTransactions = null;
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
    a.download = 'converted_qfx.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Excel downloaded!', 'success');
  });

})();
</script>