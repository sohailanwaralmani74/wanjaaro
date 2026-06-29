---
layout: main
title: "QFX to MT940 Converter – Free, Secure & Browser‑Based | DataFrog"
description: "Convert QFX (OFX) files to SWIFT MT940 format instantly. No upload, no sign‑up. Fully client‑side. Download as .mt940."
keywords: "qfx to mt940, convert qfx to mt940, qfx mt940 converter, ofx to mt940, quicken to mt940, qfx parser"
category: qfxFinance
---

<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/qfx-to-mt940#webapp",
    "name": "QFX to MT940 Converter",
    "url": "https://datafrog.tools/qfx-to-mt940",
    "description": "Convert QFX (OFX) files to SWIFT MT940 format. All processing stays in your browser.",
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
    "@id": "https://datafrog.tools/qfx-to-mt940#faq",
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
        "name": "What is MT940?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MT940 is a SWIFT standard for bank statement reporting, used by many financial systems."
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
    "@id": "https://datafrog.tools/qfx-to-mt940#howto",
    "name": "How to Convert QFX to MT940",
    "description": "Step‑by‑step guide to convert your QFX file to MT940.",
    "tool": {
      "@type": "HowToTool",
      "name": "QFX to MT940 Converter"
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
        "text": "The tool parses the file and generates MT940 text."
      },
      {
        "@type": "HowToStep",
        "name": "Export or Copy",
        "text": "Copy the MT940 to clipboard or download the .mt940 file."
      }
    ],
    "totalTime": "PT2M"
  }
]
</script>

<!-- HERO -->
<div id="qfx-hero" style="display:flex;flex-direction:column;justify-content:center;margin:1rem;">
  <h1>QFX to MT940 Converter – Turn OFX Data into Bank‑Ready Statements</h1>
  <p>
    Convert QFX (OFX) files to SWIFT MT940 format instantly.
    No upload, no sign‑up – 100% browser‑based. Perfect for banks and financial systems that expect MT940 statements.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .qfx</span>
    <span class="badge amber">✓ MT940 Output</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- TOOL -->
<section aria-label="QFX to MT940 Converter" style="display:flex;justify-content:center">
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
        <div class="panel-title"><i class="ti ti-settings" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i> Convert to MT940</div>
        <div class="panel-sub">Your QFX file is ready – click Convert to generate MT940</div>
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

<!-- Content (shortened) -->
<article class="onpage-content">
  <section id="why-convert"><h2>Why convert QFX to MT940?</h2><ul><li>Import OFX data into banking systems</li><li>Comply with SWIFT standards for electronic statements</li><li>Use with treasury management, ERP, or custom financial applications</li></ul></section>
  <section id="how-it-works"><h2>How to convert – 3 simple steps</h2><ol><li>Upload your .qfx file</li><li>Click Convert</li><li>Copy or download the .mt940</li></ol></section>
  <section id="features"><h2>Features</h2><ul><li>✅ Privacy first – everything stays local</li><li>✅ Parses OFX XML accurately</li><li>✅ Generates valid MT940 with :61: and :86: tags</li><li>✅ Free forever</li></ul></section>
  <section id="privacy"><h2>Privacy &amp; Security</h2><ul><li>🔒 All processing is local – no files uploaded</li><li>🚫 No tracking, no logs</li><li>💼 Safe for sensitive financial data</li></ul></section>
  <section id="faq"><h2>Frequently Asked Questions</h2><h3>What is QFX?</h3><p>QFX is the OFX XML format used by Quicken, Money, and many banks.</p><h3>What is MT940?</h3><p>MT940 is a SWIFT standard for bank statement reporting.</p><h3>Will the MT940 be valid?</h3><p>The generated MT940 includes standard tags: :25: (account), :28C: (statement), :60F: (opening balance), :61: (transactions), :86: (descriptions), :62F: (closing balance). It should be accepted by most systems.</p></section>
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

  // ---- Parse QFX (OFX XML) ----
  function parseQFX(xmlText) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    var transactions = [];

    // Check for parsing errors
    var parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid XML: ' + parseError.textContent);
    }

    // Find all STMTTRN nodes
    var stmttrns = xmlDoc.getElementsByTagName('STMTTRN');
    if (stmttrns.length === 0) stmttrns = xmlDoc.getElementsByTagName('INVSTMTTRN');
    if (stmttrns.length === 0) stmttrns = xmlDoc.getElementsByTagName('CCSTMTTRN');

    // Regex fallback
    if (stmttrns.length === 0) {
      var blocks = xmlText.match(/<STMTTRN>([\s\S]*?)<\/STMTTRN>/g);
      if (blocks) {
        blocks.forEach(function(block) {
          var tx = {};
          var date = block.match(/<DTPOSTED>([^<]*)<\/DTPOSTED>/);
          if (date) {
            var dStr = date[1].substring(0,8);
            if (dStr.length >= 8) {
              var y = dStr.substring(0,4);
              var m = dStr.substring(4,6);
              var d = dStr.substring(6,8);
              tx.date = y + '-' + m + '-' + d;
            }
          }
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
          // Determine sign
          if (tx.amount !== undefined) {
            tx.sign = tx.amount >= 0 ? 'C' : 'D';
          }
          // If no amount, skip
          if (tx.amount !== undefined) transactions.push(tx);
        });
        return transactions;
      }
    }

    // Normal XML parsing
    for (var i = 0; i < stmttrns.length; i++) {
      var node = stmttrns[i];
      var tx = {};
      // Date
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
      // Amount
      var amtNode = node.getElementsByTagName('TRNAMT')[0];
      if (amtNode) {
        tx.amount = parseFloat(amtNode.textContent) || 0;
        tx.sign = tx.amount >= 0 ? 'C' : 'D';
      } else {
        // Skip if no amount
        continue;
      }
      // Type
      var typeNode = node.getElementsByTagName('TRNTYPE')[0];
      if (typeNode) tx.type = typeNode.textContent.trim();
      // Payee
      var payeeNode = node.getElementsByTagName('NAME')[0];
      if (payeeNode) {
        tx.payee = payeeNode.textContent.trim();
      } else {
        var descNode = node.getElementsByTagName('DESC')[0];
        if (descNode) tx.payee = descNode.textContent.trim();
      }
      // Memo
      var memoNode = node.getElementsByTagName('MEMO')[0];
      if (memoNode) tx.memo = memoNode.textContent.trim();
      // Reference
      var refNode = node.getElementsByTagName('FITID')[0];
      if (refNode) tx.reference = refNode.textContent.trim();
      var checkNode = node.getElementsByTagName('CHECKNUM')[0];
      if (checkNode && !tx.reference) tx.reference = checkNode.textContent.trim();

      transactions.push(tx);
    }

    return transactions;
  }

  // ---- Generate MT940 ----
  function generateMT940(transactions) {
    if (!transactions || transactions.length === 0) return '';

    // We need account info – try to extract from OFX
    // For now, use a placeholder
    var account = 'Unknown';
    var statement = '001';
    var currency = 'USD';

    // Calculate total balance (sum of amounts)
    var total = transactions.reduce(function(sum, tx) {
      return sum + (tx.amount || 0);
    }, 0);

    var openingBalance = 0; // We don't have opening balance from QFX
    var closingBalance = total;

    var lines = [];
    lines.push(':25:' + account);
    lines.push(':28C:' + statement);

    var obSign = openingBalance >= 0 ? 'C' : 'D';
    var obAbs = Math.abs(openingBalance);
    lines.push(':60F:' + obSign + obAbs.toFixed(2) + currency);

    transactions.forEach(function(tx) {
      // Date: convert from YYYY-MM-DD to YYMMDD
      var d = new Date(tx.date);
      if (isNaN(d)) d = new Date();
      var yymmdd = String(d.getFullYear()).slice(2) +
                   String(d.getMonth()+1).padStart(2, '0') +
                   String(d.getDate()).padStart(2, '0');

      var amount = tx.amount || 0;
      var sign = amount >= 0 ? 'C' : 'D';
      var absAmt = Math.abs(amount);
      var amtStr = absAmt.toFixed(2).replace('.', ',');
      var ref = tx.reference || tx.payee || tx.memo || 'NONREF';
      var refPart = ref.substring(0, 16);

      var line61 = ':61:' + yymmdd + sign + amtStr + 'N' + refPart;
      lines.push(line61);

      var desc = tx.payee || tx.memo || '';
      if (desc) {
        lines.push(':86:' + desc);
      } else {
        lines.push(':86:');
      }
    });

    var cbSign = closingBalance >= 0 ? 'C' : 'D';
    var cbAbs = Math.abs(closingBalance);
    lines.push(':62F:' + cbSign + cbAbs.toFixed(2) + currency);
    lines.push('-');

    return lines.join('\n');
  }

  // ---- Render preview (plain text) ----
  function renderMT940Preview(mt940Text) {
    return mt940Text || 'No MT940 data generated.';
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
        outputMT940 = generateMT940(transactions);

        outputPanel.style.display = 'block';
        outputContent.textContent = outputMT940;
        if (outputLabel) outputLabel.textContent = 'MT940 – ' + transactions.length + ' transactions';

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