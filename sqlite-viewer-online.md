---
layout: main
title: "SQLite Viewer – Online Database Browser & Query Tool | DataFrog"
description: "View and query SQLite databases online. Upload .db, .sqlite, .sqlite3 files – browse tables. View schema and run SQL queries in Query tab."
keywords: "sqlite viewer, sqlite browser, sqlite query tool, online sqlite viewer, sqlite database viewer, sqlite to csv, sqlite to excel"
category: queryTools
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js"></script>

<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/sqlite-viewer-online#webapp",
    "name": "SQLite Viewer – Online Database Browser & Query Tool",
    "url": "https://datafrog.tools/sqlite-viewer-online",
    "description": "Browse and query SQLite databases in your browser. Upload .db, .sqlite, .sqlite3 files, view table schemas in the Table Data tab, run custom SQL queries in the Query tab. No data auto‑fetch – only schema on click. No data upload.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "100% client‑side – no file upload",
      "Supports .db, .sqlite, .sqlite3 files",
      "Table list in scrollable left pane (white text)",
      "Table Data tab shows schema only – no auto data",
      "Query & Results tab – run custom SQL to see data",
      "Export query results as CSV or Excel (.xlsx)",
      "Copy results to clipboard",
      "Free, no signup, no watermarks"
    ],
    "softwareRequirements": "Modern web browser",
    "softwareVersion": "1.0",
    "datePublished": "2026-01-04",
    "dateModified": "2026-01-04"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://datafrog.tools/sqlite-viewer-online#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What SQLite file formats are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": ".db, .sqlite, .sqlite3 are supported. The tool uses sql.js (WebAssembly) to read the database entirely in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "Does it auto‑fetch table data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The Table Data tab only shows the table schema. To see data, switch to the Query tab and run a SELECT query."
        }
      },
      {
        "@type": "Question",
        "name": "Can I run custom SQL queries?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can write and execute any SELECT query in the Query & Results tab. Results are displayed in a table and can be exported."
        }
      },
      {
        "@type": "Question",
        "name": "Is my database uploaded to a server?",
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
    "@id": "https://datafrog.tools/sqlite-viewer-online#howto",
    "name": "How to Use the SQLite Viewer",
    "description": "Step‑by‑step guide to view and query a SQLite database online.",
    "tool": {
      "@type": "HowToTool",
      "name": "SQLite Viewer"
    },
    "supply": {
      "@type": "HowToSupply",
      "name": "SQLite database file (.db, .sqlite, .sqlite3)"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload your SQLite file",
        "text": "Drag and drop or click to select your .db, .sqlite, or .sqlite3 file."
      },
      {
        "@type": "HowToStep",
        "name": "View table schemas",
        "text": "Click a table name in the left pane – its schema appears in the Table Data tab."
      },
      {
        "@type": "HowToStep",
        "name": "Run queries",
        "text": "Switch to the Query & Results tab, write a SELECT query, and click Run."
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
  <h1>SQLite Viewer – Browse Schemas &amp; Query Data Online</h1>
  <p>
    Upload your SQLite database file (.db, .sqlite, .sqlite3) and view table schemas in the Table Data tab, or run custom SQL queries in the Query tab. No auto‑fetch – you control what data you see. 100% private, no upload.
  </p>
  <div class="hero-badges">
    <span class="badge green">✓ 100% Client‑Side</span>
    <span class="badge blue">✓ .db, .sqlite, .sqlite3</span>
    <span class="badge amber">✓ Schema + Query</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<!-- TOOL -->
<section aria-label="SQLite Viewer Tool" style="display:flex;justify-content:center">
<div class="excel-wrap">

  <!-- Upload Panel -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-upload" aria-hidden="true" style="font-size:12px;margin-right:6px;color:#e2c08d"></i> Upload SQLite Database -> <span class="panel-sub">Drag &amp; drop or click to choose a .db, .sqlite, or .sqlite3 file</span></div>
      </div>
      <div class="btn-row">
        <button class="excel-btn" id="btn-clear-file"><i class="ti ti-trash" aria-hidden="true"></i> Clear</button>
      </div>
    </div>
    <div class="drop-zone" id="drop-zone" role="button" tabindex="0">
      <div class="drop-zone-icon"><i class="ti ti-database" aria-hidden="true"></i></div>
      <div class="drop-zone-text"><strong>Drop your SQLite file here</strong> or click to browse</div>
      <div class="drop-zone-sub">Supports .db, .sqlite, .sqlite3 files</div>
      <div class="drop-zone-file" id="file-name"></div>
      <input type="file" id="file-input" accept=".db,.sqlite,.sqlite3" style="display:none;">
    </div>
    <div id="loading-container" style="display:none;">
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text" id="loading-text">Loading database...</span>
      </div>
    </div>
  </div>

  <!-- Database Panels (hidden until loaded) -->
  <div id="db-panels" style="display:none;">
    <div class="panel-card">
      <div class="panel-header">
        <div>
          <div class="panel-title"><i class="ti ti-database" aria-hidden="true" style="font-size:12px;margin-right:6px;color:#79b8ff"></i> Database Browser -> <span class="panel-sub" id="db-summary">No database loaded</span> </div>     
        </div>
        <div class="btn-row">
          <button class="excel-btn" id="btn-refresh-tables"><i class="ti ti-refresh" aria-hidden="true"></i> Refresh</button>
        </div>
      </div>
      <!-- Two-column layout -->
      <div class="sqlite-layout" style="padding:12px;">
        <!-- Left Pane: Table List -->
        <div class="sqlite-left-pane" id="table-list-container">
          <div style="color:#4a4a4a;text-align:center;padding:20px;font-size:13px;">No tables found</div>
        </div>
        <!-- Right Pane: Tabs -->
        <div class="sqlite-right-pane">
          <!-- Tab Headers -->
          <div class="sqlite-tabs">
            <button class="sqlite-tab active" data-tab="data-tab">📊 Table Data</button>
            <button class="sqlite-tab" data-tab="query-tab">📝 Query &amp; Results</button>
          </div>
          <!-- Table Data Tab – Schema Only -->
          <div class="tab-content active" id="data-tab">
            <div id="table-data-container">
              <div style="color:#4a4a4a;text-align:center;padding:40px;font-size:14px;">
                Click a table name in the left pane to view its schema
              </div>
            </div>
          </div>
          <!-- Query & Results Tab -->
          <div class="tab-content" id="query-tab">
            <div class="query-editor-wrap">
              <div class="editor-header">
                <span style="font-size:12px;color:#7a7a7a;text-transform:uppercase;letter-spacing:0.5px;">SQL Query</span>
                <button class="excel-btn primary" id="btn-run-query" style="padding:4px 12px;font-size:12px;">▶ Run</button>
              </div>
              <textarea id="query-editor" style="width:100%;background:#1b1b1b;color:#d4d4d4;border:none;padding:10px 12px;font-family:var(--font-mono,monospace);font-size:13px;min-height:50px; max-height:50px; resize:none;outline:none;" placeholder="SELECT * FROM table_name LIMIT 100">SELECT * FROM sqlite_master WHERE type='table'</textarea>
            </div>
            <div id="query-results-container" class="query-results">
              <div style="color:#4a4a4a;text-align:center;padding:20px;">Run a query to see results</div>
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
  <section id="why-use"><h2>Why use this SQLite Viewer?</h2><ul><li>Quickly inspect SQLite database schemas without installing software</li><li>Run ad‑hoc queries to fetch exactly the data you need</li><li>Export query results to CSV or Excel for further analysis</li><li>No upload – your data stays secure</li></ul></section>
  <section id="how-it-works"><h2>How to use – 3 simple steps</h2><ul><li>Upload your .db / .sqlite / .sqlite3 file</li><li>Click a table in the left pane – its schema appears in the Table Data tab</li><li>Switch to the Query tab, write a SELECT query, and click Run</li></ul></section>
  <section id="features"><h2>Features</h2><ul><li>✅ 100% client‑side – no data leaves your device</li><li>✅ Supports all SQLite databases (sql.js backend)</li><li>✅ Table browser in scrollable left pane with white text</li><li>✅ Table Data tab shows schema only (columns, types, keys)</li><li>✅ Query & Results tab for custom SQL queries</li><li>✅ Export results to CSV and Excel</li><li>✅ Free forever</li></ul></section>
  <section id="privacy"><h2>Privacy &amp; Security</h2><ul><li>🔒 All processing is local – no files uploaded</li><li>🚫 No tracking, no logs</li><li>💼 Safe for sensitive databases</li></ul></section>
  <section id="faq"><h2>Frequently Asked Questions</h2><h3>What file formats are supported?</h3><p>.db, .sqlite, .sqlite3. The tool uses sql.js (WebAssembly).</p>
  <h3>Can I run UPDATE or DELETE queries?</h3><p>Only SELECT queries are allowed for safety.</p>
  <h3>How do I view a table's schema?</h3><p>Click the table name in the left pane – it loads in the Table Data tab.</p>
  <h3>How do I see table data?</h3><p>Switch to the Query & Results tab and run a SELECT query.</p></section>
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
  var fileSummary = document.getElementById('db-summary');
  var tableListContainer = document.getElementById('table-list-container');
  var queryEditor = document.getElementById('query-editor');
  var queryResultsContainer = document.getElementById('query-results-container');
  var tableDataContainer = document.getElementById('table-data-container');
  var loadingContainer = document.getElementById('loading-container');
  var loadingText = document.getElementById('loading-text');
  var btnRunQuery = document.getElementById('btn-run-query');
  var btnRefreshTables = document.getElementById('btn-refresh-tables');
  var btnClear = document.getElementById('btn-clear-file');
  var btnCopyCSV = document.getElementById('btn-copy-csv');
  var btnExportCSV = document.getElementById('btn-export-csv');
  var btnExportExcel = document.getElementById('btn-export-excel');

  // Tab elements
  var tabButtons = document.querySelectorAll('.sqlite-tab');
  var tabContents = document.querySelectorAll('.tab-content');

  var db = null;
  var currentFile = null;
  var currentResults = null;
  var currentHeaders = [];
  var sqlReady = false;
  var SQL = null;
  var currentTable = null;

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

  // ---- Initialize sql.js ----
  function initSqlJsLibrary() {
    if (typeof initSqlJs !== 'function') {
      showToast('sql.js library failed to load. Please refresh.', 'error');
      return;
    }
    var libLoading = document.createElement('div');
    libLoading.className = 'loading-overlay';
    libLoading.innerHTML = '<div class="loading-spinner"></div><span class="loading-text">Loading SQL engine...</span>';
    document.querySelector('.excel-wrap').prepend(libLoading);

    initSqlJs({
      locateFile: function(filename) {
        return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/' + filename;
      }
    }).then(function(SQLModule) {
      SQL = SQLModule;
      sqlReady = true;
      libLoading.remove();
      showToast('SQL engine loaded successfully!', 'success');
    }).catch(function(err) {
      libLoading.remove();
      showToast('Failed to load SQL engine: ' + err.message, 'error');
      console.error(err);
    });
  }

  // ---- Get table schema ----
  function getTableSchema(tableName) {
    if (!db) return [];
    try {
      var result = db.exec('PRAGMA table_info("' + tableName + '")');
      if (result && result.length > 0) {
        return result[0].values.map(function(row) {
          return { cid: row[0], name: row[1], type: row[2], notnull: row[3], dflt_value: row[4], pk: row[5] };
        });
      }
    } catch(e) { console.error(e); }
    return [];
  }

  function getForeignKeys(tableName) {
    if (!db) return [];
    try {
      var result = db.exec('PRAGMA foreign_key_list("' + tableName + '")');
      if (result && result.length > 0) {
        return result[0].values.map(function(row) {
          return { id: row[0], seq: row[1], table: row[2], from: row[3], to: row[4] };
        });
      }
    } catch(e) { console.error(e); }
    return [];
  }

  // ---- Render schema (Table Data tab) ----
  function renderSchema(tableName) {
    if (!db || !tableName) {
      tableDataContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:40px;font-size:14px;">Click a table name in the left pane to view its schema</div>';
      return;
    }
    var cols = getTableSchema(tableName);
    var fks = getForeignKeys(tableName);
    var fkMap = {};
    fks.forEach(function(fk) { fkMap[fk.from] = fk.table; });

    if (cols.length === 0) {
      tableDataContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:20px;">No schema information available for this table</div>';
      return;
    }

    var html = '<div class="section-label">📐 Schema: ' + tableName + ' <span class="count-badge">' + cols.length + ' columns</span></div>';
    html += '<table class="schema-table"><thead><tr>';
    html += '<th>Column</th><th>Type</th><th>Key</th><th>Not Null</th><th>Default</th>';
    html += '</tr></thead><tbody>';
    cols.forEach(function(col) {
      var isPk = col.pk > 0;
      var isFk = fkMap[col.name] !== undefined;
      var key = '';
      if (isPk) key = '<span class="pk-badge">PK</span>';
      if (isFk) key += (key ? ' ' : '') + '<span class="fk-badge">FK → ' + fkMap[col.name] + '</span>';
      var notnull = col.notnull ? '<span class="notnull-badge">✓</span>' : '<span class="null-badge">✗</span>';
      var dflt = col.dflt_value !== null ? '<span class="default-value">' + col.dflt_value + '</span>' : '—';
      html += '<tr>';
      html += '<td>' + col.name + '</td>';
      html += '<td>' + (col.type || '') + '</td>';
      html += '<td>' + key + '</td>';
      html += '<td>' + notnull + '</td>';
      html += '<td>' + dflt + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    tableDataContainer.innerHTML = html;
  }

  // ---- Get table list ----
  function getTables() {
    if (!db) return [];
    try {
      var result = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
      if (result && result.length > 0) {
        return result[0].values.map(function(row) { return row[0]; });
      }
    } catch(e) { console.error(e); }
    return [];
  }

  // ---- Render table list in left pane ----
  function renderTableList(tables) {
    if (!tables || tables.length === 0) {
      tableListContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:20px;font-size:13px;">No tables found</div>';
      return;
    }
    var html = '';
    tables.forEach(function(name) {
      html += '<a href="#" class="sqlite-table-item" data-table="' + name + '">';
      html += '<span class="table-icon">📊</span>' + name;
      html += '</a>';
    });
    tableListContainer.innerHTML = html;

    tableListContainer.querySelectorAll('.sqlite-table-item').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        var tableName = this.dataset.table;
        loadTableSchema(tableName);
      });
    });
  }

  // ---- Load table schema (click from left pane) ----
  function loadTableSchema(tableName) {
    if (!tableName) return;
    currentTable = tableName;
    // Highlight in left pane
    tableListContainer.querySelectorAll('.sqlite-table-item').forEach(function(item) {
      item.classList.remove('active');
      if (item.dataset.table === tableName) item.classList.add('active');
    });
    // Switch to Table Data tab
    document.querySelector('.sqlite-tab[data-tab="data-tab"]').click();
    // Render schema
    renderSchema(tableName);
  }

  // ---- Run query (for Query tab) ----
  function runQuery() {
    if (!db) {
      showToast('No database loaded.', 'error');
      return;
    }
    if (!sqlReady) {
      showToast('SQL engine not ready yet. Please wait.', 'error');
      return;
    }
    var sql = queryEditor.value.trim();
    if (!sql) {
      showToast('Please enter a SQL query.', 'error');
      return;
    }

    try {
      var result = db.exec(sql);
      if (!result || result.length === 0) {
        queryResultsContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding-left:20px;">Query returned 0 rows</div>';
        currentResults = null;
        currentHeaders = [];
        return;
      }
      var data = result[0];
      var headers = data.columns;
      var rows = data.values;
      currentHeaders = headers;
      currentResults = rows;

      // Render result grid
      var html = '<div class="data-grid-wrapper"><table class="data-grid"><thead><tr>';
      headers.forEach(function(h) { html += '<th>' + h + '</th>'; });
      html += '</tr></thead><tbody>';
      rows.forEach(function(row) {
        html += '<tr>';
        row.forEach(function(cell) {
          var val = (cell === null || cell === undefined) ? 'NULL' : String(cell);
          var cls = '';
          if (!isNaN(parseFloat(val)) && isFinite(val)) cls = 'numeric';
          if (val.match(/^\d{4}-\d{2}-\d{2}/) || val.match(/^\d{4}\/\d{2}\/\d{2}/)) cls = 'date';
          if (val === 'NULL') cls += ' null-value';
          html += '<td class="' + cls.trim() + '">' + val + '</td>';
        });
        html += '</tr>';
      });
      html += '</tbody></table></div>';
      queryResultsContainer.innerHTML = html;
      showToast('Query executed successfully', 'success');
    } catch(e) {
      queryResultsContainer.innerHTML = '<div style="color:#f97583;padding:15px;">SQL Error: ' + e.message + '</div>';
      showToast('SQL Error: ' + e.message, 'error');
      console.error(e);
    }
  }

  // ---- Load database ----
  function loadDatabase(file) {
    if (!sqlReady) {
      showToast('SQL engine is still loading. Please wait a moment.', 'error');
      return;
    }
    var ext = file.name.split('.').pop().toLowerCase();
    if (!['db', 'sqlite', 'sqlite3'].includes(ext)) {
      showToast('Please upload a valid SQLite file (.db, .sqlite, .sqlite3).', 'error');
      return;
    }

    currentFile = file;
    fileNameDisplay.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
    fileSummary.textContent = file.name + ' — loading...';
    loadingContainer.style.display = 'block';
    loadingText.textContent = 'Loading database...';
    document.getElementById('db-panels').style.display = 'none';

    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = new Uint8Array(e.target.result);
        db = new SQL.Database(data);
        // Test connection
        db.exec("SELECT 1");
        document.getElementById('db-panels').style.display = 'block';
        loadingContainer.style.display = 'none';
        refreshTables();
        // Default query
        queryEditor.value = 'SELECT * FROM sqlite_master WHERE type=\'table\'';
        showToast('Database loaded successfully!', 'success');
        // Clear query results
        queryResultsContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:20px;">Run a query to see results</div>';
        tableDataContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:40px;font-size:14px;">Click a table name in the left pane to view its schema</div>';
      } catch(err) {
        loadingContainer.style.display = 'none';
        showToast('Error loading database: ' + err.message, 'error');
        console.error('Full error:', err);
      }
    };
    reader.onerror = function() {
      loadingContainer.style.display = 'none';
      showToast('Error reading file', 'error');
    };
    reader.readAsArrayBuffer(file);
  }

  // ---- Refresh tables ----
  function refreshTables() {
    if (!db) return;
    var tables = getTables();
    renderTableList(tables);
    if (tables.length > 0) {
      fileSummary.textContent = currentFile.name + ' — ' + tables.length + ' tables';
    } else {
      fileSummary.textContent = currentFile.name + ' — no tables found';
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
    if (e.dataTransfer.files.length > 0) loadDatabase(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function() {
    if (this.files.length > 0) loadDatabase(this.files[0]);
  });

  btnRunQuery.addEventListener('click', runQuery);

  btnRefreshTables.addEventListener('click', function() {
    if (db) refreshTables();
  });

  btnClear.addEventListener('click', function() {
    fileInput.value = '';
    fileNameDisplay.textContent = '';
    fileSummary.textContent = '';
    document.getElementById('db-panels').style.display = 'none';
    loadingContainer.style.display = 'none';
    db = null;
    currentResults = null;
    currentHeaders = [];
    currentTable = null;
    queryResultsContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:20px;">Run a query to see results</div>';
    tableDataContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:40px;font-size:14px;">Click a table name in the left pane to view its schema</div>';
    tableListContainer.innerHTML = '<div style="color:#4a4a4a;text-align:center;padding:20px;font-size:13px;">No tables found</div>';
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
    a.download = 'query_results.csv';
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
    a.download = 'query_results.xlsx';
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

  // ---- Initialize ----
  initSqlJsLibrary();

})();
</script>