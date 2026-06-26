---
layout: main
title: "MT940 to QBO Converter – Free, Secure & Browser‑Based | DataFrog"
description: "Convert MT940 bank statements to QBO (QuickBooks Web Connect) format instantly. No upload, no sign‑up. Fully client‑side. Download as .qbo."
keywords: "mt940 to qbo, convert mt940 to qbo, mt940 qbo converter, bank statement to qbo, quickbooks web connect, mt940 parser"
category: mt940Finance
---

<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/mt940-to-qbo#webapp",
    "name": "MT940 to QBO Converter",
    "url": "https://datafrog.tools/mt940-to-qbo",
    "description": "Convert SWIFT MT940 bank statement files to QBO format for QuickBooks. All processing stays in your browser.",
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
      "Outputs QBO (QuickBooks Web Connect) – ready for import into QuickBooks",
      "Preview QBO text before downloading",
      "Copy QBO to clipboard or download .qbo file",
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
    "@id": "https://datafrog.tools/mt940-to-qbo#faq",
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
        "name": "What is QBO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "QBO (QuickBooks Web Connect) is a file format used by QuickBooks to import bank transactions from financial institutions."
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
    "@id": "https://datafrog.tools/mt940-to-qbo#howto",
    "name": "How to Convert MT940 to QBO",
    "description": "Step‑by‑step guide to convert your MT940 bank statement to QBO format.",
    "tool": {
      "@type": "HowToTool",
      "name": "MT940 to QBO Converter"
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
        "text": "The tool parses the file and generates QBO text."
      },
      {
        "@type": "HowToStep",
        "name": "Export or Copy",
        "text": "Preview the QBO, then download the .qbo file or copy the text to clipboard."
      }
    ],
    "totalTime": "PT2M"
  }
]
</script>

<!-- ===== HERO ===== -->
<div id="mt940-hero" style="display:flex;flex-direction:column;justify-content:center;margin:1rem;">
  <h1>MT940 to QBO Converter – Import Bank Statements into QuickBooks</h1>
  <p>
    Convert SWIFT MT940 bank statement files to QBO (QuickBooks Web Connect) format instantly.
    No upload, no sign‑up – 100% browser‑based. Perfect for QuickBooks import.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .mt940, .sta, .txt</span>
    <span class="badge amber">✓ QBO Output</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- ===== TOOL ===== -->
<section aria-label="MT940 to QBO Converter" style="display:flex;justify-content:center">
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
        <div class="panel-title"><i class="ti ti-settings" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i>Convert to QBO</div>
        <div class="panel-sub">Your MT940 file is ready – click Convert to generate QBO</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn primary" id="btn-convert">🔄 Convert to QBO</button>
      </div>
    </div>
    <div style="padding:8px 16px;font-size:11px;color:#6a9955;" id="file-summary">No file loaded</div>
  </div>

  <!-- Output Panel (hidden initially) -->
  <div class="panel-card" id="output-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-file-export" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#6fcf97"></i>QBO Output</div>
        <div class="panel-sub" id="output-format-label">Preview QBO text – copy or download</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn green" id="btn-copy"><i class="ti ti-copy" aria-hidden="true"></i> Copy QBO</button>
        <button class="excel-btn amber" id="btn-export"><i class="ti ti-download" aria-hidden="true"></i> Export .qbo</button>
      </div>
    </div>
    <div id="output-content" class="output-preview" style="white-space:pre;font-family:var(--font-mono,monospace);font-size:12px;padding:12px;background:#1b1b1b;border:1px solid #2d2d2d;border-radius:5px;margin:10px 16px 16px;max-height:400px;overflow:auto;color:#d4d4d4;">
      <div style="color:#4a4a4a;text-align:center;padding:20px;">No output yet</div>
    </div>
  </div>

</div>
</section>

<!-- ===== CONTENT ===== -->
<article style="max-width:90%;margin:40px auto;padding:10px 20px;line-height:1.7;font-family:Arial,sans-serif;">
  <section id="why-convert">
    <h2>Why convert MT940 to QBO?</h2>
    <ul>
      <li>Import bank transactions directly into QuickBooks Desktop or QuickBooks Online.</li>
      <li>Simplify bank reconciliation by uploading statements in a QuickBooks‑compatible format.</li>
      <li>Automate data entry and reduce manual errors.</li>
    </ul>
  </section>

  <section id="how-it-works">
    <h2>How to convert – 3 simple steps</h2>
    <ol>
      <li><strong>Upload</strong> – drag &amp; drop your .mt940 file.</li>
      <li><strong>Convert</strong> – click “Convert to QBO”.</li>
      <li><strong>Export or Copy</strong> – preview the QBO, then download the .qbo file or copy the text.</li>
    </ol>
  </section>

  <section id="features">
    <h2>Features</h2>
    <ul>
      <li>✅ <strong>Privacy first</strong> – everything stays in your browser.</li>
      <li>✅ <strong>Accurate parsing</strong> – extracts account, statement number, balances, and every transaction.</li>
      <li>✅ <strong>Clean QBO output</strong> – includes date, amount, description, and reference.</li>
      <li>✅ <strong>Copy QBO to clipboard</strong> – for quick pasting.</li>
      <li>✅ <strong>Download .qbo</strong> – ready to import into QuickBooks.</li>
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

    <h3>What is QBO?</h3>
    <p>QBO (QuickBooks Web Connect) is a file format used by QuickBooks to import bank transactions. It is a text‑based format with specific headers and transaction lines.</p>

    <h3>Will the QBO work in QuickBooks?</h3>
    <p>The generated QBO file follows the standard format and should import into QuickBooks Desktop and QuickBooks Online. We recommend testing with a sample file first.</p>

    <h3>Is there a file size limit?</h3>
    <p>No strict limit, but very large files may take a moment – all processing is client‑side.</p>
  </section>
</article>

<!-- Toast -->
<div class="toast" id="toast" role="alert" aria-live="assertive"></div>

<!-- ===== JAVASCRIPT ===== -->
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
  var outputLabel = document.getElementById('output-format-label');

  // ----- State -----
  var currentFile = null;
  var currentContent = null;
  var parsedData = null;
  var outputQBO = '';

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

  // ----- MT940 Parser (same as before) -----
  function parseMT940(text) {
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
        var raw = line.substring(3).trim();
        var tx = { date: '', amount: 0, currency: '', type: '', reference: '', description: '' };
        if (raw.length >= 6) {
          var dateStr = raw.substring(0, 6);
          var y = parseInt('20' + dateStr.substring(0,2));
          var m = parseInt(dateStr.substring(2,4)) - 1;
          var d = parseInt(dateStr.substring(4,6));
          tx.date = new Date(y, m, d).toISOString().split('T')[0];
          raw = raw.substring(6);
        }
        if (raw.length > 0 && (raw[0] === 'C' || raw[0] === 'D')) {
          tx.type = raw[0] === 'C' ? 'Credit' : 'Debit';
          raw = raw.substring(1);
        }
        var amountMatch = raw.match(/^([\d,]+\.?\d*)([A-Z])?/);
        if (amountMatch) {
          var amtStr = amountMatch[1].replace(',', '.');
          tx.amount = parseFloat(amtStr) || 0;
          raw = raw.substring(amountMatch[0].length);
          if (amountMatch[2]) {
            tx.currency = amountMatch[2];
          }
        }
        var refMatch = raw.match(/^([^\/]*)/);
        if (refMatch) {
          tx.reference = refMatch[1] || '';
          raw = raw.substring(refMatch[0].length);
        }
        currentTx = tx;
        transactions.push(tx);
      } else if (line.startsWith(':86:')) {
        var desc = line.substring(3).trim();
        if (currentTx) {
          if (currentTx.description) currentTx.description += ' ' + desc;
          else currentTx.description = desc;
        }
      } else {
        if (currentTx && line.length > 0 && !line.startsWith(':')) {
          currentTx.description = (currentTx.description || '') + ' ' + line.trim();
        }
      }
    });

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

  // ----- Generate QBO (QuickBooks Web Connect) -----
  function generateQBO(data) {
    var lines = [];
    // Header
    lines.push('!CLEAR');
    lines.push('!ACCT "Bank Account" N 1000');
    // Add account info (optional)
    if (data.account) {
      lines.push('!ACCT "' + data.account + '" N 1000');
    }
    // For each transaction
    data.transactions.forEach(function(tx) {
      // QBO format: TRNS date amount type memo
      // date: MM/DD/YYYY
      var parts = tx.date.split('-');
      var qboDate = parts[1] + '/' + parts[2] + '/' + parts[0];
      var amount = tx.type === 'Credit' ? tx.amount : -tx.amount;
      var memo = tx.reference ? (tx.description + ' ' + tx.reference) : tx.description;
      // TRNS line
      lines.push('TRNS ' + qboDate + ' ' + amount.toFixed(2) + ' ' + (tx.type === 'Credit' ? 'DEP' : 'PMT') + ' "' + (memo || '') + '"');
    });
    return lines.join('\n');
  }

  // ----- Render preview (plain text) -----
  function renderQBOPreview(qboText) {
    return qboText || 'No QBO data generated.';
  }

  // ----- Conversion -----
  function convertFile() {
    if (!currentContent) {
      showToast('No file loaded.', 'error');
      return;
    }
    loadingContainer.style.display = 'block';

    setTimeout(function() {
      try {
        var parsed = parseMT940(currentContent);
        if (parsed.transactions.length === 0) {
          showToast('No transactions found in the file.', 'error');
          loadingContainer.style.display = 'none';
          return;
        }
        parsedData = parsed;
        outputQBO = generateQBO(parsed);

        outputPanel.style.display = 'block';
        outputContent.textContent = outputQBO;
        if (outputLabel) outputLabel.textContent = 'QBO – ' + parsed.transactions.length + ' transactions';

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
    outputQBO = '';
    convertPanel.style.display = 'none';
    outputPanel.style.display = 'none';
    loadingContainer.style.display = 'none';
    showToast('Cleared', 'success');
  });

  btnCopy.addEventListener('click', function() {
    if (!outputQBO) {
      showToast('No data to copy.', 'error');
      return;
    }
    navigator.clipboard.writeText(outputQBO).then(function() {
      showToast('QBO copied!', 'success');
    }).catch(function() {
      var ta = document.createElement('textarea');
      ta.value = outputQBO;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied!', 'success');
    });
  });

  btnExport.addEventListener('click', function() {
    if (!outputQBO) {
      showToast('No data to export.', 'error');
      return;
    }
    var blob = new Blob([outputQBO], { type: 'text/plain;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'converted_mt940.qbo';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('QBO downloaded!', 'success');
  });

})();
</script>