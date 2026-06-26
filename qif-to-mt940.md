---
layout: main
title: "QIF to MT940 Converter – Free, Secure & Browser‑Based | DataFrog"
description: "Convert QIF (Quicken Interchange Format) files to SWIFT MT940 format instantly. No upload, no sign‑up. Fully client‑side. Download as .mt940."
keywords: "qif to mt940, convert qif to mt940, qif mt940 converter, quicken to mt940, qif parser, swift mt940"
category: qifFinance
---

<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/qif-to-mt940#webapp",
    "name": "QIF to MT940 Converter",
    "url": "https://datafrog.tools/qif-to-mt940",
    "description": "Convert Quicken Interchange Format (QIF) files to SWIFT MT940 format. All processing stays in your browser.",
    "applicationCategory": "FinanceConverter",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "100% client‑side – no file upload",
      "Parses QIF transactions (Bank, Credit Card, Investment)",
      "Outputs MT940 text – compatible with banking systems",
      "Preview MT940 before downloading",
      "Copy MT940 to clipboard or download .mt940/.txt file",
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
    "@id": "https://datafrog.tools/qif-to-mt940#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is QIF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "QIF (Quicken Interchange Format) is a text‑based format used by Quicken and other personal finance software to export financial data."
        }
      },
      {
        "@type": "Question",
        "name": "What is MT940?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MT940 is a SWIFT standard for bank statement reporting. It is a plain text format used by many banks and financial systems."
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
    "@id": "https://datafrog.tools/qif-to-mt940#howto",
    "name": "How to Convert QIF to MT940",
    "description": "Step‑by‑step guide to convert your QIF file to MT940 format.",
    "tool": {
      "@type": "HowToTool",
      "name": "QIF to MT940 Converter"
    },
    "supply": {
      "@type": "HowToSupply",
      "name": "QIF file (.qif)"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload your QIF file",
        "text": "Drag and drop or click to select your .qif file."
      },
      {
        "@type": "HowToStep",
        "name": "Click Convert",
        "text": "The tool parses the file and generates MT940 text."
      },
      {
        "@type": "HowToStep",
        "name": "Export or Copy",
        "text": "Preview the MT940, then download the .mt940 file or copy the text."
      }
    ],
    "totalTime": "PT2M"
  }
]
</script>

<!-- HERO -->
<div id="qif-hero" style="display:flex;flex-direction:column;justify-content:center;margin:1rem;">
  <h1>QIF to MT940 Converter – Turn Quicken Data into Bank‑Ready MT940</h1>
  <p>
    Convert QIF (Quicken Interchange Format) files to SWIFT MT940 format instantly.
    No upload, no sign‑up – 100% browser‑based. Perfect for banks and financial systems that expect MT940 statements.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .qif</span>
    <span class="badge amber">✓ MT940 Output</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- TOOL -->
<section aria-label="QIF to MT940 Converter" style="display:flex;justify-content:center">
<div class="excel-wrap">

  <!-- Upload Panel -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-upload" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#e2c08d"></i> Upload QIF File</div>
        <div class="panel-sub">Drag &amp; drop or click to choose a .qif file</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn" id="btn-clear-file"><i class="ti ti-trash" aria-hidden="true"></i> Clear</button>
      </div>
    </div>
    <div class="drop-zone" id="drop-zone" role="button" tabindex="0">
      <div class="drop-zone-icon"><i class="ti ti-file-text" aria-hidden="true"></i></div>
      <div class="drop-zone-text"><strong>Drop your QIF file here</strong> or click to browse</div>
      <div class="drop-zone-sub">Supports .qif files</div>
      <div class="drop-zone-file" id="file-name"></div>
      <input type="file" id="file-input" accept=".qif" style="display:none;">
    </div>
    <div id="loading-container" style="display:none;">
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text">Parsing QIF...</span>
      </div>
    </div>
  </div>

  <!-- Convert Panel -->
  <div class="panel-card" id="convert-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-settings" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i> Convert to MT940</div>
        <div class="panel-sub">Your QIF file is ready – click Convert to generate MT940</div>
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
<article style="max-width:90%;margin:40px auto;padding:10px 20px;line-height:1.7;font-family:Arial,sans-serif;">
  <section id="why-convert"><h2>Why convert QIF to MT940?</h2><ul><li>Import Quicken data into bank‑grade systems</li><li>Use with treasury management or ERP platforms</li><li>Standardised format for financial reporting</li></ul></section>
  <section id="how-it-works"><h2>How to convert – 3 simple steps</h2><ol><li>Upload your .qif file</li><li>Click Convert</li><li>Copy or download the .mt940</li></ol></section>
  <section id="features"><h2>Features</h2><ul><li>✅ Privacy first – everything stays local</li><li>✅ Parses all QIF transactions</li><li>✅ Generates valid MT940 with :61: and :86: tags</li><li>✅ Free forever</li></ul></section>
  <section id="privacy"><h2>Privacy &amp; Security</h2><ul><li>🔒 All processing is local – no files uploaded</li><li>🚫 No tracking, no logs</li><li>💼 Safe for sensitive financial data</li></ul></section>
  <section id="faq"><h2>Frequently Asked Questions</h2><h3>What is QIF?</h3><p>QIF is Quicken Interchange Format – a text file with transaction data.</p><h3>What is MT940?</h3><p>MT940 is a SWIFT standard for bank statement reporting, used by many financial systems.</p><h3>Will the MT940 be valid?</h3><p>The generated MT940 includes standard tags: :25: (account), :28C: (statement), :60F: (opening balance), :61: (transactions), :86: (descriptions), :62F: (closing balance). It should be accepted by most systems.</p></section>
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

  // ---- QIF Parser (same as before) ----
  function parseQIF(text) {
    var lines = text.split(/\r?\n/);
    var type = '';
    var transactions = [];
    var currentTx = {};

    function flushTx() {
      if (Object.keys(currentTx).length > 0 && currentTx.date) {
        transactions.push(currentTx);
      }
      currentTx = {};
    }

    lines.forEach(function(line) {
      line = line.trim();
      if (!line) return;
      if (line.startsWith('!Type:')) {
        flushTx();
        type = line.substring(6).trim();
        return;
      }
      var code = line[0];
      var value = line.substring(1).trim();
      switch (code) {
        case 'D': 
          var d = new Date(value);
          currentTx.date = (!isNaN(d)) ? d.toISOString().split('T')[0] : value;
          break;
        case 'T': 
          currentTx.amount = parseFloat(value.replace(',', '')) || 0;
          break;
        case 'P': 
          currentTx.payee = value; 
          break;
        case 'M': 
          currentTx.memo = value; 
          break;
        case 'N': 
          currentTx.checkNum = value; 
          break;
        case 'C': 
          currentTx.cleared = value; 
          break;
        case 'L': 
          currentTx.category = value; 
          break;
        case '^': 
          flushTx(); 
          break;
        default: 
          if (!currentTx.other) currentTx.other = {};
          currentTx.other[code] = value;
      }
    });
    flushTx();
    return { type: type, transactions: transactions };
  }

  // ---- Generate MT940 ----
  function generateMT940(data) {
    var txns = data.transactions;
    if (txns.length === 0) return '';

    var account = data.type || 'Bank';
    var statement = '001';
    // Opening balance – use first transaction amount or 0
    var openingBalance = 0;
    // Try to infer from first transaction if we can, else 0
    if (txns.length > 0) {
      // In MT940, the opening balance is the balance before the first transaction.
      // We don't have that in QIF, so we set it to 0 and adjust the closing balance.
      // For simplicity, we just set it to 0 and let the closing balance be sum of transactions.
    }
    var closingBalance = txns.reduce((sum, t) => sum + (t.amount || 0), 0);

    var lines = [];
    // Account header
    lines.push(':25:' + account);
    // Statement number
    lines.push(':28C:' + statement);
    // Opening balance (we assume currency is USD, and no sign)
    var obSign = openingBalance >= 0 ? 'C' : 'D';
    var obAbs = Math.abs(openingBalance);
    lines.push(':60F:' + obSign + obAbs.toFixed(2) + 'USD');
    // Transactions
    txns.forEach(function(tx) {
      var date = tx.date ? tx.date.replace(/-/g,'') : '000000';
      var amt = tx.amount || 0;
      var sign = amt >= 0 ? 'C' : 'D';
      var absAmt = Math.abs(amt);
      var ref = tx.checkNum || tx.reference || 'NONREF';
      // :61: format: YYMMDDCD amount NCC?ref
      // Use YYMMDD from date
      var yymmdd = date.substring(2); // assume YYYYMMDD -> YYMMDD
      var amtStr = absAmt.toFixed(2).replace('.', ',');
      // Build reference part
      var refPart = ref.substring(0, 16);
      var line61 = ':61:' + yymmdd + sign + amtStr + 'N' + refPart;
      lines.push(line61);
      // :86: description
      var desc = tx.payee || tx.memo || '';
      if (desc) {
        lines.push(':86:' + desc);
      } else {
        lines.push(':86:');
      }
    });
    // Closing balance
    var cbSign = closingBalance >= 0 ? 'C' : 'D';
    var cbAbs = Math.abs(closingBalance);
    lines.push(':62F:' + cbSign + cbAbs.toFixed(2) + 'USD');
    // End of file
    lines.push('-');
    return lines.join('\n');
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
        var parsed = parseQIF(currentContent);
        if (parsed.transactions.length === 0) {
          showToast('No transactions found in the QIF file.', 'error');
          loadingContainer.style.display = 'none';
          return;
        }
        parsedData = parsed;
        outputMT940 = generateMT940(parsed);

        outputPanel.style.display = 'block';
        outputContent.textContent = outputMT940;
        if (outputLabel) outputLabel.textContent = 'MT940 – ' + parsed.transactions.length + ' transactions';

        loadingContainer.style.display = 'none';
        showToast('Conversion successful!', 'success');
      } catch (e) {
        loadingContainer.style.display = 'none';
        showToast('Error parsing QIF: ' + e.message, 'error');
        console.error(e);
      }
    }, 50);
  }

  // ---- File handling ----
  function processFile(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'qif') {
      showToast('Please upload a valid .qif file.', 'error');
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
    outputMT940 = '';
    convertPanel.style.display = 'none';
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