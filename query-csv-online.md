---
layout: main
title: "Query CSV Online – Filter & Explore CSV Files"
description: "Upload and query CSV files online. Browse columns, preview data, filter rows with simple WHERE conditions, export results. 100% client‑side, no data upload."
keywords: "query csv online, csv query tool, filter csv online, csv explorer, csv data viewer, csv to filtered csv"
category: queryTools
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>

<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/query-csv-online#webapp",
    "name": "Query CSV Online – Filter & Explore CSV Files",
    "url": "https://datafrog.tools/query-csv-online",
    "description": "Upload CSV files and filter rows using simple WHERE conditions. Browse columns, preview data, export filtered results as CSV or Excel. 100% client‑side, no data upload.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "100% client‑side – no file upload",
      "Supports .csv files",
      "Column list in scrollable left pane with types",
      "Data tab shows preview (first 100 rows)",
      "Query tab – filter rows using WHERE conditions",
      "Export filtered results as CSV or Excel (.xlsx)",
      "Copy results to clipboard",
      "Free, no signup, no watermarks"
    ],
    "softwareRequirements": "Modern web browser",
    "softwareVersion": "1.0",
    "datePublished": "2026-01-05",
    "dateModified": "2026-01-05"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://datafrog.tools/query-csv-online#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What CSV formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Any comma-separated, tab-separated, or semicolon-separated CSV. The tool uses PapaParse to auto-detect delimiters."
        }
      },
      {
        "@type": "Question",
        "name": "How do I filter data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Switch to the Query tab and write a WHERE condition like 'age > 30 AND name LIKE \"A%\"'. Click Run to see filtered results."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data uploaded to a server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, all processing is done locally in your browser. Your data never leaves your device."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://datafrog.tools/query-csv-online#howto",
    "name": "How to Query CSV Online",
    "description": "Step‑by‑step guide to upload and filter a CSV file.",
    "tool": {
      "@type": "HowToTool",
      "name": "Query CSV Online"
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
        "name": "Browse columns",
        "text": "The left pane shows all columns with their data types and sample values."
      },
      {
        "@type": "HowToStep",
        "name": "Preview data",
        "text": "The Data tab shows the first 100 rows."
      },
      {
        "@type": "HowToStep",
        "name": "Filter with queries",
        "text": "Switch to the Query tab, write a WHERE condition, and click Run."
      },
      {
        "@type": "HowToStep",
        "name": "Export results",
        "text": "Copy results as CSV, or download them as CSV or Excel (.xlsx)."
      }
    ],
    "totalTime": "PT2M"
  }
]
</script>

<!-- HERO -->
<div class="home-hero" >
  <h1>Query CSV Online – Filter &amp; Explore CSV Files</h1>
  <p>
    Upload your CSV file and browse columns, preview data, or filter rows with simple WHERE conditions. No upload – 100% client‑side, private, and free.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .csv</span>
    <span class="badge amber">✓ Filter &amp; Export</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- TOOL -->
<section aria-label="Query CSV Online Tool" style="display:flex;justify-content:center">
<div class="excel-wrap">

  <!-- Upload Panel -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-upload" aria-hidden="true" style="font-size:12px;margin-right:6px;color:#e2c08d"></i> Upload CSV File -> <span class="panel-sub">Drag &amp; drop or click to choose a .csv file</span></div>
      </div>
      <div class="btn-row">
        <button class="excel-btn" id="btn-clear-file"><i class="ti ti-trash" aria-hidden="true"></i> Clear</button>
      </div>
    </div>
    <div class="drop-zone" id="drop-zone" role="button" tabindex="0">
      <div class="drop-zone-icon"><i class="ti ti-file-spreadsheet" aria-hidden="true"></i></div>
      <div class="drop-zone-text"><strong>Drop your CSV file here</strong> or click to browse</div>
      <div class="drop-zone-sub">Supports .csv files (auto‑detects delimiter)</div>
      <div class="drop-zone-file" id="file-name"></div>
      <input type="file" id="file-input" accept=".csv" style="display:none;">
    </div>
    <div id="loading-container" style="display:none;">
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text" id="loading-text">Parsing CSV...</span>
      </div>
    </div>
  </div>

  <!-- CSV Panels (hidden until loaded) -->
  <div id="csv-panels" style="display:none;">
    <div class="panel-card">
      <div class="panel-header">
        <div>
          <div class="panel-title"><i class="ti ti-file-spreadsheet" aria-hidden="true" style="font-size:12px;margin-right:6px;color:#79b8ff"></i> CSV Browser -> <span class="panel-sub" id="csv-summary">No file loaded</span> </div>     
        </div>
        <div class="btn-row">
          <button class="excel-btn" id="btn-refresh"><i class="ti ti-refresh" aria-hidden="true"></i> Refresh</button>
        </div>
      </div>
      <!-- Two-column layout -->
      <div class="sqlite-layout" style="padding:12px;">
        <!-- Left Pane: Column List -->
        <div class="sqlite-left-pane" id="column-list-container">
          <div style="color:#4a4a4a;text-align:center;padding:20px;font-size:13px;">No columns found</div>
        </div>
        <!-- Right Pane: Tabs -->
        <div class="sqlite-right-pane">
          <!-- Tab Headers -->
          <div class="sqlite-tabs">
            <button class="sqlite-tab active" data-tab="data-tab">📊 Data</button>
            <button class="sqlite-tab" data-tab="query-tab">📝 Query &amp; Results</button>
          </div>
          <!-- Data Tab – Preview -->
          <div class="tab-content active" id="data-tab">
            <div id="data-container">
              <div style="color:#4a4a4a;text-align:center;padding:40px;font-size:14px;">
                Upload a CSV file to preview its data
              </div>
            </div>
          </div>
          <!-- Query & Results Tab -->
          <div class="tab-content" id="query-tab">
            <div class="query-editor-wrap">
              <div class="editor-header">
                <span style="font-size:12px;color:#7a7a7a;text-transform:uppercase;letter-spacing:0.5px;">WHERE Condition</span>
                <button class="excel-btn primary" id="btn-run-query" style="padding:4px 12px;font-size:12px;">▶ Run</button>
              </div>
              <textarea id="query-editor" style="width:100%;background:#1b1b1b;color:#d4d4d4;border:none;padding:10px 12px;font-family:var(--font-mono,monospace);font-size:13px;min-height:50px; max-height:50px; resize:none;outline:none;" placeholder="e.g., age > 30 AND name LIKE 'A%'"></textarea>
            </div>
            <div id="query-results-container" class="query-results">
              <div style="color:#4a4a4a;text-align:center;padding:20px;">Write a WHERE condition and click Run</div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
              <button class="excel-btn green" id="btn-copy-csv" style="padding:4px 14px;font-size:12px;"><i class="ti ti-copy" aria-hidden="true"></i> Copy</button>
              <button class="excel-btn amber" id="btn-export-csv" style="padding:4px 14px;font-size:12px;"><i class="ti ti-file-spreadsheet" aria-hidden="true"></i> CSV</button>
              <button class="excel-btn blue" id="btn-export-excel" style="padding:4px 14px;font-size:12px;background:#0e639c;border-color:#0e639c;color:#fff;"><i class="ti ti-file-code" aria-hidden="true"></i> Excel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</section>

<!-- Content -->
<article class="onpage-content">
 <div class="blog-post-meta">
     <a href="saeed-ahmed" style="display:flex; gap: 10px;" class="link">
      <img src="assets/img/saeed-ahmed.jpg" alt="Saeed Ahmed" class="author-img">
      <span class="author-name">Saeed Ahmed</span>
      </a>
      <span class="post-date">jan 10, 2026</span>
  </div>
  <section id="why-use"><h2>Why use this CSV Query Tool?</h2><ul><li>Quickly browse and filter CSV data without Excel or database software</li><li>Write simple WHERE conditions to find exactly what you need</li><li>Export filtered results to CSV or Excel</li><li>No upload – your data stays secure</li></ul></section>
  <section id="how-it-works"><h2>How to use – 3 simple steps</h2><ul><li>Upload your .csv file</li><li>Browse columns and preview data in the Data tab</li><li>Switch to the Query tab, write a WHERE condition, and click Run</li></ul></section>
  <section id="features"><h2>Features</h2><ul><li>✅ 100% client‑side – no data leaves your device</li><li>✅ Auto‑detects CSV delimiters (comma, tab, semicolon)</li><li>✅ Column list with data types and sample values</li><li>✅ Data tab shows preview (first 100 rows)</li><li>✅ Query tab – filter rows with WHERE conditions</li><li>✅ Export results to CSV and Excel</li><li>✅ Free forever</li></ul></section>
  <section id="privacy"><h2>Privacy &amp; Security</h2><ul><li>🔒 All processing is local – no files uploaded</li><li>🚫 No tracking, no logs</li><li>💼 Safe for sensitive data</li></ul></section>
  <section id="faq"><h2>Frequently Asked Questions</h2><h3>What CSV formats are supported?</h3><p>Any CSV (comma, tab, or semicolon separated). PapaParse auto‑detects.</p>
  <h3>What query syntax can I use?</h3><p>Simple WHERE conditions: <code>column_name > 100</code>, <code>name LIKE 'A%'</code>, <code>age BETWEEN 18 AND 30</code>, etc.</p>
  <h3>How do I see all data?</h3><p>The Data tab shows a preview. To see the full dataset, you can run a query without conditions (just leave the WHERE field blank).</p></section>
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
  var fileSummary = document.getElementById('csv-summary');
  var columnListContainer = document.getElementById('column-list-container');
  var queryEditor = document.getElementById('query-editor');
  var queryResultsContainer = document.getElementById('query-results-container');
  var dataContainer = document.getElementById('data-container');
  var loadingContainer = document.getElementById('loading-container');
  var loadingText = document.getElementById('loading-text');
  var btnRunQuery = document.getElementById('btn-run-query');
  var btnRefresh = document.getElementById('btn-refresh');
  var btnClear = document.getElementById('btn-clear-file');
  var btnCopyCSV = document.getElementById('btn-copy-csv');
  var btnExportCSV = document.getElementById('btn-export-csv');
  var btnExportExcel = document.getElementById('btn-export-excel');

  // Tab elements
  var tabButtons = document.querySelectorAll('.sqlite-tab');
  var tabContents = document.querySelectorAll('.tab-content');

  var currentFile = null;
  var parsedData = null;        // { headers: [], rows: [], data: [] }
  var currentResults = null;    // filtered rows
  var currentHeaders = [];
  var fullData = [];

  // ---- Tab switching ----
  tabButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = this.dataset.tab;
      tabButtons.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      tabContents.forEach(function(c) { c.classList.remove('active'); });
      document.getElementById(target).classList.add('active');
    });
  });

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

  // ---- Auto-detect column type ----
  function detectColumnType(values) {
    var numCount = 0;
    var dateCount = 0;
    var total = values.length;
    values.forEach(function(v) {
      var val = (v !== undefined && v !== null && v !== '') ? String(v).trim() : '';
      if (!val) return;
      if (!isNaN(parseFloat(val)) && isFinite(val)) { numCount++; return; }
      if (val.match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/) || val.match(/^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/)) { dateCount++; }
    });
    if (numCount / total > 0.7) return 'number';
    if (dateCount / total > 0.7) return 'date';
    return 'string';
  }

  // ---- Get sample values ----
  function getSampleValues(values, count) {
    var samples = [];
    var v = values.filter(function(x) { return x !== undefined && x !== null && x !== ''; });
    for (var i = 0; i < Math.min(count, v.length); i++) {
      samples.push(String(v[i]).substring(0, 30));
    }
    return samples.join(', ');
  }

  // ---- Render column list (left pane) ----
  function renderColumns(headers, rows) {
    if (!headers || headers.length === 0) {
      columnListContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:20px;font-size:13px;">No columns found</div>';
      return;
    }
    var html = '';
    headers.forEach(function(col, idx) {
      var colValues = rows.map(function(r) { return r[idx]; });
      var type = detectColumnType(colValues);
      var sample = getSampleValues(colValues, 5);
      var icon = type === 'number' ? '🔢' : (type === 'date' ? '📅' : '📝');
      html += '<a href="#" class="sqlite-table-item" data-col="' + idx + '">';
      html += '<span class="table-icon">' + icon + '</span>' + col + ' <span style="color:#6a9955;font-size:10px;">' + type + '</span>';
      html += '<div style="font-size:10px;color:#6a6a6a;padding-left:22px;">' + sample + '</div>';
      html += '</a>';
    });
    columnListContainer.innerHTML = html;

    // Click on column -> filter? For now just highlight
    columnListContainer.querySelectorAll('.sqlite-table-item').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        columnListContainer.querySelectorAll('.sqlite-table-item').forEach(function(item) {
          item.classList.remove('active');
        });
        this.classList.add('active');
        // Auto-fill query with column name
        var colName = this.dataset.col;
        var headerName = headers[parseInt(colName)];
        queryEditor.value = headerName + ' LIKE ' + '"%"';
        // Switch to Query tab
        document.querySelector('.sqlite-tab[data-tab="query-tab"]').click();
      });
    });
  }

  // ---- Render data preview (Data tab) ----
  function renderDataPreview(headers, rows) {
    if (!headers || headers.length === 0 || rows.length === 0) {
      dataContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:40px;font-size:14px;">No data to preview</div>';
      return;
    }
    var limit = Math.min(100, rows.length);
    var html = '<div class="section-label">📊 Data Preview <span class="count-badge">' + rows.length + ' rows</span></div>';
    html += '<div class="data-grid-wrapper"><table class="data-grid"><thead><tr>';
    headers.forEach(function(h) { html += '<th>' + h + '</th>'; });
    html += '</tr></thead><tbody>';
    for (var i = 0; i < limit; i++) {
      var row = rows[i];
      html += '<tr>';
      row.forEach(function(cell) {
        var val = (cell === null || cell === undefined || cell === '') ? 'NULL' : String(cell);
        var cls = '';
        if (!isNaN(parseFloat(val)) && isFinite(val)) cls = 'numeric';
        if (val.match(/^\d{4}-\d{2}-\d{2}/) || val.match(/^\d{4}\/\d{2}\/\d{2}/)) cls = 'date';
        if (val === 'NULL') cls += ' null-value';
        html += '<td class="' + cls.trim() + '">' + val + '</td>';
      });
      html += '</tr>';
    }
    html += '</tbody></table></div>';
    if (rows.length > limit) {
      html += '<div style="color:#6a6a6a;padding:8px;text-align:center;font-size:12px;">Showing first ' + limit + ' rows</div>';
    }
    dataContainer.innerHTML = html;
  }

  // ---- Parse CSV ----
  function loadCSV(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'csv') {
      showToast('Please upload a valid .csv file.', 'error');
      return;
    }

    currentFile = file;
    fileNameDisplay.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
    fileSummary.textContent = file.name + ' — loading...';
    loadingContainer.style.display = 'block';
    loadingText.textContent = 'Parsing CSV...';
    document.getElementById('csv-panels').style.display = 'none';

    var reader = new FileReader();
    reader.onload = function(e) {
      var csvText = e.target.result;
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        trimHeaders: true,
        dynamicTyping: false,
        complete: function(results) {
          if (results.errors && results.errors.length > 0) {
            loadingContainer.style.display = 'none';
            showToast('Error parsing CSV: ' + results.errors[0].message, 'error');
            return;
          }
          var headers = results.meta.fields;
          var data = results.data;
          var rows = data.map(function(row) {
            return headers.map(function(h) { return row[h]; });
          });

          parsedData = { headers: headers, rows: rows, data: data };
          fullData = rows;
          currentHeaders = headers;

          document.getElementById('csv-panels').style.display = 'block';
          loadingContainer.style.display = 'none';

          renderColumns(headers, rows);
          renderDataPreview(headers, rows);
          fileSummary.textContent = file.name + ' — ' + rows.length + ' rows, ' + headers.length + ' columns';
          showToast('CSV loaded successfully!', 'success');

          // Clear previous query results
          queryResultsContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:20px;">Write a WHERE condition and click Run</div>';
          currentResults = null;
          queryEditor.value = '';
        },
        error: function(err) {
          loadingContainer.style.display = 'none';
          showToast('Error parsing CSV: ' + err.message, 'error');
        }
      });
    };
    reader.onerror = function() {
      loadingContainer.style.display = 'none';
      showToast('Error reading file', 'error');
    };
    reader.readAsText(file);
  }

  // ---- Build filter function from WHERE condition ----
  function buildFilter(condition, headers) {
    if (!condition || condition.trim() === '') {
      return function(row) { return true; };
    }

    // Build a safe filter function
    var lower = condition.toLowerCase();
    var parts = lower.split(/\s+(?:and|or)\s+/);
    var ops = condition.match(/\s+(and|or)\s+/gi) || [];
    var operators = ops.map(function(o) { return o.trim().toLowerCase(); });

    // Parse each condition
    var conditions = parts.map(function(p) {
      p = p.trim();
      // Try to parse: column operator value
      var match = p.match(/^(.+?)\s*(=|!=|<>|>|>=|<|<=|like|between)\s*(.+?)$/i);
      if (!match) {
        return null;
      }
      var col = match[1].trim();
      var op = match[2].trim().toLowerCase();
      var val = match[3].trim();

      // Find column index
      var colIdx = -1;
      for (var i = 0; i < headers.length; i++) {
        if (headers[i].toLowerCase() === col) {
          colIdx = i;
          break;
        }
      }
      if (colIdx === -1) return null;

      // Clean value
      var cleanVal = val.replace(/^["']|["']$/g, '').trim();
      var isNumeric = !isNaN(parseFloat(cleanVal)) && isFinite(cleanVal);
      var numVal = isNumeric ? parseFloat(cleanVal) : null;

      return { colIdx: colIdx, op: op, val: cleanVal, numVal: numVal, isNumeric: isNumeric };
    });

    // Build filter function
    return function(row) {
      var results = [];
      for (var i = 0; i < conditions.length; i++) {
        var cond = conditions[i];
        if (!cond) { results.push(true); continue; }
        var cell = row[cond.colIdx];
        var cellStr = (cell !== undefined && cell !== null) ? String(cell).trim() : '';
        var cellNum = (!isNaN(parseFloat(cellStr)) && isFinite(cellStr)) ? parseFloat(cellStr) : null;

        var result = false;
        switch (cond.op) {
          case '=':
            result = cellStr === cond.val;
            break;
          case '!=':
          case '<>':
            result = cellStr !== cond.val;
            break;
          case '>':
            result = cellNum !== null && cond.numVal !== null && cellNum > cond.numVal;
            break;
          case '>=':
            result = cellNum !== null && cond.numVal !== null && cellNum >= cond.numVal;
            break;
          case '<':
            result = cellNum !== null && cond.numVal !== null && cellNum < cond.numVal;
            break;
          case '<=':
            result = cellNum !== null && cond.numVal !== null && cellNum <= cond.numVal;
            break;
          case 'like':
            var pattern = cond.val.replace(/%/g, '.*');
            result = new RegExp('^' + pattern + '$', 'i').test(cellStr);
            break;
          case 'between':
            // Simplified: val should be "x and y"
            var range = cond.val.split(/\s+and\s+/i);
            if (range.length === 2) {
              var low = parseFloat(range[0]);
              var high = parseFloat(range[1]);
              result = cellNum !== null && !isNaN(low) && !isNaN(high) && cellNum >= low && cellNum <= high;
            }
            break;
        }
        results.push(result);
      }

      // Combine with operators
      var finalResult = results[0] || false;
      for (var j = 0; j < operators.length; j++) {
        var op = operators[j];
        if (op === 'and') {
          finalResult = finalResult && (results[j+1] || false);
        } else if (op === 'or') {
          finalResult = finalResult || (results[j+1] || false);
        }
      }
      return finalResult;
    };
  }

  // ---- Run query ----
  function runQuery() {
    if (!parsedData) {
      showToast('No CSV loaded.', 'error');
      return;
    }

    var condition = queryEditor.value.trim();
    var filterFn = buildFilter(condition, currentHeaders);
    var filteredRows = fullData.filter(filterFn);

    currentResults = filteredRows;

    if (filteredRows.length === 0) {
      queryResultsContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:20px;">Query returned 0 rows</div>';
      return;
    }

    // Render results
    var html = '<div class="section-label">📊 Query Results <span class="count-badge">' + filteredRows.length + ' rows</span></div>';
    html += '<div class="data-grid-wrapper"><table class="data-grid"><thead><tr>';
    currentHeaders.forEach(function(h) { html += '<th>' + h + '</th>'; });
    html += '</tr></thead><tbody>';
    var limit = Math.min(500, filteredRows.length);
    for (var i = 0; i < limit; i++) {
      var row = filteredRows[i];
      html += '<tr>';
      row.forEach(function(cell) {
        var val = (cell === null || cell === undefined || cell === '') ? 'NULL' : String(cell);
        var cls = '';
        if (!isNaN(parseFloat(val)) && isFinite(val)) cls = 'numeric';
        if (val.match(/^\d{4}-\d{2}-\d{2}/) || val.match(/^\d{4}\/\d{2}\/\d{2}/)) cls = 'date';
        if (val === 'NULL') cls += ' null-value';
        html += '<td class="' + cls.trim() + '">' + val + '</td>';
      });
      html += '</tr>';
    }
    html += '</tbody></table></div>';
    if (filteredRows.length > limit) {
      html += '<div style="color:#6a6a6a;padding:8px;text-align:center;font-size:12px;">Showing first ' + limit + ' of ' + filteredRows.length + ' rows</div>';
    }
    queryResultsContainer.innerHTML = html;
    showToast('Query executed successfully', 'success');
  }

  // ---- Refresh ----
  function refreshAll() {
    if (parsedData) {
      renderColumns(parsedData.headers, parsedData.rows);
      renderDataPreview(parsedData.headers, parsedData.rows);
    }
  }

  // ---- Export functions ----
  function getCSV() {
    if (!currentResults || currentResults.length === 0) {
      showToast('No results to export.', 'error');
      return null;
    }
    var rows = currentResults.map(function(row) {
      return row.map(function(cell) {
        var val = (cell === null || cell === undefined) ? '' : String(cell);
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      }).join(',');
    });
    return currentHeaders.join(',') + '\n' + rows.join('\n');
  }

  function getExcelData() {
    if (!currentResults || currentResults.length === 0) return null;
    var wsData = [currentHeaders];
    currentResults.forEach(function(row) {
      wsData.push(row.map(function(cell) {
        return (cell === null || cell === undefined) ? '' : cell;
      }));
    });
    return wsData;
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
    if (e.dataTransfer.files.length > 0) loadCSV(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function() {
    if (this.files.length > 0) loadCSV(this.files[0]);
  });

  btnRunQuery.addEventListener('click', runQuery);

  btnRefresh.addEventListener('click', function() {
    if (parsedData) refreshAll();
  });

  btnClear.addEventListener('click', function() {
    fileInput.value = '';
    fileNameDisplay.textContent = '';
    fileSummary.textContent = '';
    document.getElementById('csv-panels').style.display = 'none';
    loadingContainer.style.display = 'none';
    parsedData = null;
    currentResults = null;
    currentHeaders = [];
    fullData = [];
    queryResultsContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:20px;">Write a WHERE condition and click Run</div>';
    dataContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:40px;font-size:14px;">Upload a CSV file to preview its data</div>';
    columnListContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:20px;font-size:13px;">No columns found</div>';
    showToast('Cleared', 'success');
  });

  btnCopyCSV.addEventListener('click', function() {
    var csv = getCSV();
    if (!csv) return;
    navigator.clipboard.writeText(csv).then(function() {
      showToast('CSV copied!', 'success');
    }).catch(function() {
      var ta = document.createElement('textarea');
      ta.value = csv;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied!', 'success');
    });
  });

  btnExportCSV.addEventListener('click', function() {
    var csv = getCSV();
    if (!csv) return;
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('CSV downloaded!', 'success');
  });

  btnExportExcel.addEventListener('click', function() {
    var data = getExcelData();
    if (!data) return;
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    var buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    var blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_results.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Excel downloaded!', 'success');
  });

  // Ctrl+Enter to run query
  queryEditor.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runQuery();
    }
  });

})();
</script>