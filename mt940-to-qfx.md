---
layout: main
title: "MT940 to QFX Converter – Free, Secure & Browser‑Based | DataFrog"
description: "Convert MT940 bank statements to QFX (OFX) format instantly. No upload, no sign‑up. Fully client‑side. Download as .qfx."
keywords: "mt940 to qfx, convert mt940 to qfx, mt940 qfx converter, bank statement to qfx, ofx, quicken qfx, mt940 parser"
category: mt940Finance
---

<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/mt940-to-qfx#webapp",
    "name": "MT940 to QFX Converter",
    "url": "https://datafrog.tools/mt940-to-qfx",
    "description": "Convert SWIFT MT940 bank statement files to QFX (OFX) format for Quicken. All processing stays in your browser.",
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
      "Outputs QFX (OFX) – ready for import into Quicken, Money, etc.",
      "Preview QFX text before downloading",
      "Copy QFX to clipboard or download .qfx file",
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
    "@id": "https://datafrog.tools/mt940-to-qfx#faq",
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
        "name": "What is QFX?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "QFX (also known as OFX) is a financial data exchange format used by Quicken, Microsoft Money, and other personal finance software."
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
    "@id": "https://datafrog.tools/mt940-to-qfx#howto",
    "name": "How to Convert MT940 to QFX",
    "description": "Step‑by‑step guide to convert your MT940 bank statement to QFX format.",
    "tool": {
      "@type": "HowToTool",
      "name": "MT940 to QFX Converter"
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
        "text": "The tool parses the file and generates QFX (OFX) XML."
      },
      {
        "@type": "HowToStep",
        "name": "Export or Copy",
        "text": "Preview the QFX, then download the .qfx file or copy the XML to clipboard."
      }
    ],
    "totalTime": "PT2M"
  }
]
</script>

<!-- ===== HERO ===== -->
<div id="mt940-hero" class="home-hero" >
  <h1>MT940 to QFX Converter – Import Bank Statements into Quicken &amp; More</h1>
  <p>
    Convert SWIFT MT940 bank statement files to QFX (OFX) format instantly.
    No upload, no sign‑up – 100% browser‑based. Perfect for Quicken, Microsoft Money, and OFX‑compatible software.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .mt940, .sta, .txt</span>
    <span class="badge amber">✓ QFX (OFX) Output</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- ===== TOOL ===== -->
<section aria-label="MT940 to QFX Converter" style="display:flex;justify-content:center">
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
        <div class="panel-title"><i class="ti ti-settings" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i>Convert to QFX</div>
        <div class="panel-sub">Your MT940 file is ready – click Convert to generate QFX</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn primary" id="btn-convert">🔄 Convert to QFX</button>
      </div>
    </div>
    <div style="padding:8px 16px;font-size:11px;color:#6a9955;" id="file-summary">No file loaded</div>
  </div>

  <!-- Output Panel (hidden initially) -->
  <div class="panel-card" id="output-panel" style="display:none;">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-file-export" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#6fcf97"></i>QFX Output</div>
        <div class="panel-sub" id="output-format-label">Preview QFX (OFX XML) – copy or download</div>
      </div>
      <div class="btn-row">
        <button class="excel-btn green" id="btn-copy"><i class="ti ti-copy" aria-hidden="true"></i> Copy QFX</button>
        <button class="excel-btn amber" id="btn-export"><i class="ti ti-download" aria-hidden="true"></i> Export .qfx</button>
      </div>
    </div>
    <div id="output-content" class="output-preview" style="white-space:pre;font-family:var(--font-mono,monospace);font-size:12px;padding:12px;background:#1b1b1b;border:1px solid #2d2d2d;border-radius:5px;margin:10px 16px 16px;max-height:400px;overflow:auto;color:#d4d4d4;">
      <div style="color:#4a4a4a;text-align:center;padding:20px;">No output yet</div>
    </div>
  </div>

</div>
</section>

<!-- ===== CONTENT ===== -->
<article class="onpage-content">
 <div class="blog-post-meta">
     <a href="sohail-anwar" style="display:flex; gap: 10px;" class="link">
      <img src="assets/img/sohail-anwar.png" alt="Sohail Anwar" class="author-img">
      <span class="author-name">Sohail Anwar</span>
      </a>
      <span class="post-date">December 01, 2025</span>
  </div>
  <section id="why-convert">
    <h2>Why convert MT940 to QFX?</h2>
    <ul>
      <li>Import bank transactions into Quicken, Microsoft Money, or any OFX‑compatible software.</li>
      <li>Quickly transfer statement data for reconciliation and analysis.</li>
      <li>QFX is a widely supported standard for financial data exchange.</li>
    </ul>
  </section>

  <section id="how-it-works">
    <h2>How to convert – 3 simple steps</h2>
    <ul>
      <li><strong>Upload</strong> – drag &amp; drop your .mt940 file.</li>
      <li><strong>Convert</strong> – click “Convert to QFX”.</li>
      <li><strong>Export or Copy</strong> – preview the QFX, then download the .qfx file or copy the XML.</li>
    </ul>
  </section>

  <section id="features">
    <h2>Features</h2>
    <ul>
      <li>✅ <strong>Privacy first</strong> – everything stays in your browser.</li>
      <li>✅ <strong>Accurate parsing</strong> – extracts account, statement number, balances, and every transaction.</li>
      <li>✅ <strong>Clean QFX (OFX) output</strong> – valid XML with all transaction details.</li>
      <li>✅ <strong>Copy QFX XML to clipboard</strong> – for quick pasting.</li>
      <li>✅ <strong>Download .qfx</strong> – ready to import into Quicken or other OFX‑compatible software.</li>
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

    <h3>What is QFX?</h3>
    <p>QFX is the file extension for OFX (Open Financial Exchange) files used by Quicken, Microsoft Money, and other personal finance software. It is an XML‑based format.</p>

    <h3>Will the QFX work in Quicken?</h3>
    <p>Yes, the generated QFX follows the OFX specification and should import into Quicken and other OFX‑compatible applications.</p>

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
  var outputQFX = '';

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

  // ----- Generate QFX (OFX XML) -----
  function generateQFX(data) {
    // Build a simple OFX XML document
    var now = new Date();
    var dtNow = now.getFullYear() + now.getMonth().toString().padStart(2,'0') + now.getDate().toString().padStart(2,'0') +
                now.getHours().toString().padStart(2,'0') + now.getMinutes().toString().padStart(2,'0') + now.getSeconds().toString().padStart(2,'0');
    var dtStart = data.transactions.length > 0 ? data.transactions[0].date.replace(/-/g,'') : dtNow;
    var dtEnd = data.transactions.length > 0 ? data.transactions[data.transactions.length-1].date.replace(/-/g,'') : dtNow;

    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<?OFX OFXHEADER="200" VERSION="203" SECURITY="NONE" OLDFILEUID="NONE" NEWFILEUID="NONE"?>\n';
    xml += '<OFX>\n';
    xml += '  <SIGNONMSGSRSV1>\n';
    xml += '    <SONRS>\n';
    xml += '      <STATUS>\n';
    xml += '        <CODE>0</CODE>\n';
    xml += '        <SEVERITY>INFO</SEVERITY>\n';
    xml += '      </STATUS>\n';
    xml += '      <DTSERVER>' + dtNow + '</DTSERVER>\n';
    xml += '      <LANGUAGE>ENG</LANGUAGE>\n';
    xml += '    </SONRS>\n';
    xml += '  </SIGNONMSGSRSV1>\n';
    xml += '  <BANKMSGSRSV1>\n';
    xml += '    <STMTTRNRS>\n';
    xml += '      <TRNUID>1</TRNUID>\n';
    xml += '      <STATUS>\n';
    xml += '        <CODE>0</CODE>\n';
    xml += '        <SEVERITY>INFO</SEVERITY>\n';
    xml += '      </STATUS>\n';
    xml += '      <STMTRS>\n';
    xml += '        <CURDEF>' + (data.transactions[0]?.currency || 'USD') + '</CURDEF>\n';
    xml += '        <BANKACCTFROM>\n';
    xml += '          <BANKID>0</BANKID>\n';
    xml += '          <ACCTID>' + (data.account || 'Unknown') + '</ACCTID>\n';
    xml += '          <ACCTTYPE>CHECKING</ACCTTYPE>\n';
    xml += '        </BANKACCTFROM>\n';
    xml += '        <BANKTRANLIST>\n';
    xml += '          <DTSTART>' + dtStart + '</DTSTART>\n';
    xml += '          <DTEND>' + dtEnd + '</DTEND>\n';
    // Transactions
    data.transactions.forEach(function(tx) {
      var dt = tx.date.replace(/-/g,'');
      var amount = tx.type === 'Credit' ? tx.amount : -tx.amount;
      var memo = tx.reference ? (tx.description + ' ' + tx.reference) : tx.description;
      xml += '          <STMTTRN>\n';
      xml += '            <TRNTYPE>' + (tx.type === 'Credit' ? 'CREDIT' : 'DEBIT') + '</TRNTYPE>\n';
      xml += '            <DTPOSTED>' + dt + '000000</DTPOSTED>\n';
      xml += '            <TRNAMT>' + amount.toFixed(2) + '</TRNAMT>\n';
      xml += '            <FITID>' + (tx.reference || '') + '</FITID>\n';
      xml += '            <NAME>' + (memo || '') + '</NAME>\n';
      xml += '            <MEMO>' + (memo || '') + '</MEMO>\n';
      xml += '          </STMTTRN>\n';
    });
    xml += '        </BANKTRANLIST>\n';
    // Balance (optional)
    if (data.closingBalance) {
      var bal = parseFloat(data.closingBalance.replace(',','.')) || 0;
      xml += '        <LEDGERBAL>\n';
      xml += '          <BALAMT>' + bal.toFixed(2) + '</BALAMT>\n';
      xml += '          <DTASOF>' + dtEnd + '000000</DTASOF>\n';
      xml += '        </LEDGERBAL>\n';
    }
    xml += '      </STMTRS>\n';
    xml += '    </STMTTRNRS>\n';
    xml += '  </BANKMSGSRSV1>\n';
    xml += '</OFX>\n';
    return xml;
  }

  // ----- Render preview (plain text) -----
  function renderQFXPreview(qfxText) {
    return qfxText || 'No QFX data generated.';
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
        outputQFX = generateQFX(parsed);

        outputPanel.style.display = 'block';
        outputContent.textContent = outputQFX;
        if (outputLabel) outputLabel.textContent = 'QFX – ' + parsed.transactions.length + ' transactions';

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
    outputQFX = '';
    convertPanel.style.display = 'none';
    outputPanel.style.display = 'none';
    loadingContainer.style.display = 'none';
    showToast('Cleared', 'success');
  });

  btnCopy.addEventListener('click', function() {
    if (!outputQFX) {
      showToast('No data to copy.', 'error');
      return;
    }
    navigator.clipboard.writeText(outputQFX).then(function() {
      showToast('QFX copied!', 'success');
    }).catch(function() {
      var ta = document.createElement('textarea');
      ta.value = outputQFX;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied!', 'success');
    });
  });

  btnExport.addEventListener('click', function() {
    if (!outputQFX) {
      showToast('No data to export.', 'error');
      return;
    }
    var blob = new Blob([outputQFX], { type: 'application/x-ofx;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'converted_mt940.qfx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('QFX downloaded!', 'success');
  });

})();
</script>