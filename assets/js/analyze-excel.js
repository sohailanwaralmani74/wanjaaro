
(function(){
  var fileInput = document.getElementById('file-input');
  var dropZone = document.getElementById('drop-zone');
  var fileNameDisplay = document.getElementById('file-name');
  var analysisData = null;
  var currentWorkbook = null;
  var currentSheetName = null;
  var rawData = null;

  // Keyboard accessibility for drop zone
  dropZone.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  // ===== Toast =====
  function showToast(msg, type){
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + type + ' show';
    clearTimeout(t._timer);
    t._timer = setTimeout(function(){ t.className = 'toast ' + type; }, 3000);
  }

  // ===== Utilities =====
  function formatFileSize(bytes){
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    return (bytes / 1073741824).toFixed(1) + ' GB';
  }

  function formatNumber(n){
    if (n === undefined || n === null || isNaN(n)) return '—';
    if (typeof n === 'number' && !Number.isInteger(n)) return n.toFixed(2);
    return n;
  }

  function setStat(id, value){
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // ===== Type Detection =====
  function detectType(values){
    var numCount = 0, dateCount = 0, boolCount = 0, stringCount = 0;
    var total = 0;
    values.forEach(function(v){
      if (v === undefined || v === null || v === '') return;
      total++;
      if (typeof v === 'number') { numCount++; return; }
      if (typeof v === 'boolean') { boolCount++; return; }
      if (typeof v === 'string') {
        var trimmed = v.trim();
        if (trimmed === '') return;
        if (!isNaN(Date.parse(trimmed)) && trimmed.match(/[a-zA-Z]/)) { dateCount++; return; }
        if (!isNaN(parseFloat(trimmed)) && isFinite(trimmed)) { numCount++; return; }
        stringCount++;
        return;
      }
      stringCount++;
    });
    if (total === 0) return 'empty';
    var pct = function(c) { return (c / total) * 100; };
    if (pct(numCount) >= 70) return 'number';
    if (pct(dateCount) >= 70) return 'date';
    if (pct(boolCount) >= 70) return 'boolean';
    return 'string';
  }

  // ===== Outlier Detection =====
  function detectOutliers(values){
    var nums = values.filter(function(v){ return typeof v === 'number' && !isNaN(v); });
    if (nums.length < 4) return [];
    var sorted = nums.slice().sort(function(a,b){ return a - b; });
    var q1 = sorted[Math.floor(sorted.length * 0.25)];
    var q3 = sorted[Math.floor(sorted.length * 0.75)];
    var iqr = q3 - q1;
    var lower = q1 - 1.5 * iqr;
    var upper = q3 + 1.5 * iqr;
    var outliers = [];
    nums.forEach(function(v){
      if (v < lower || v > upper) outliers.push(v);
    });
    return outliers;
  }

  // ===== Main Analysis =====
  function analyzeExcel(data, fileName, fileSize){
    if (!data || data.length === 0) {
      showToast('No data found in the file', 'error');
      return;
    }

    var headers = data[0];
    var rows = data.slice(1);
    var rowCount = rows.length;
    var colCount = headers.length;

    // Build column data
    var cols = headers.map(function(h, idx){
      var values = rows.map(function(r){ return r[idx]; });
      var type = detectType(values);
      var missing = values.filter(function(v){ return v === undefined || v === null || v === ''; }).length;
      var unique = new Set(values.filter(function(v){ return v !== undefined && v !== null && v !== ''; })).size;
      var numericVals = values.filter(function(v){ return typeof v === 'number' && !isNaN(v); });
      var numericCount = numericVals.length;
      var sum = numericVals.reduce(function(a,b){ return a + b; }, 0);
      var mean = numericCount > 0 ? sum / numericCount : null;
      var sorted = numericVals.slice().sort(function(a,b){ return a - b; });
      var min = sorted.length > 0 ? sorted[0] : null;
      var max = sorted.length > 0 ? sorted[sorted.length - 1] : null;
      var median = null;
      if (sorted.length > 0) {
        var mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
          median = (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
          median = sorted[mid];
        }
      }
      var variance = numericVals.reduce(function(s, v){ return s + Math.pow(v - mean, 2); }, 0) / (numericCount || 1);
      var stdDev = numericCount > 0 ? Math.sqrt(variance) : null;

      // Quartiles
      var q1 = null, q3 = null, iqr = null;
      if (sorted.length >= 4) {
        q1 = sorted[Math.floor(sorted.length * 0.25)];
        q3 = sorted[Math.floor(sorted.length * 0.75)];
        iqr = q3 - q1;
      }

      // Outliers
      var outliers = detectOutliers(values);

      // Top N for categorical
      var topN = [];
      if (type === 'string') {
        var freq = {};
        values.forEach(function(v){
          if (v !== undefined && v !== null && v !== '') {
            var key = String(v);
            freq[key] = (freq[key] || 0) + 1;
          }
        });
        var sortedFreq = Object.entries(freq).sort(function(a,b){ return b[1] - a[1]; });
        topN = sortedFreq.slice(0, 5);
      }

      // Quality flags
      var flags = [];
      if (unique === 1) flags.push('constant');
      if (unique === rowCount && rowCount > 0) flags.push('all-unique');
      if (type === 'string' && unique > 50) flags.push('high-cardinality');
      if (type === 'string' && numericCount > 0 && numericCount / rowCount > 0.1) flags.push('mixed-type');

      return {
        name: h || 'Column ' + (idx + 1),
        type: type,
        missing: missing,
        unique: unique,
        count: rowCount - missing,
        numericCount: numericCount,
        min: min,
        max: max,
        mean: mean,
        median: median,
        stdDev: stdDev,
        q1: q1,
        q3: q3,
        iqr: iqr,
        outliers: outliers,
        topN: topN,
        flags: flags
      };
    });

    // Count duplicate rows
    var seen = new Set();
    var duplicates = 0;
    rows.forEach(function(r){
      var key = r.map(function(v){ return v !== undefined && v !== null ? v : ''; }).join('|||');
      if (seen.has(key)) duplicates++;
      else seen.add(key);
    });

    // Quality Score
    var totalCells = rowCount * colCount;
    var missingPct = totalCells > 0 ? (cols.reduce(function(s, c){ return s + c.missing; }, 0) / totalCells) * 100 : 0;
    var dupPct = rowCount > 0 ? (duplicates / rowCount) * 100 : 0;
    var mixedCols = cols.filter(function(c){ return c.flags.includes('mixed-type'); }).length;

    var score = 100;
    score -= Math.min(missingPct * 0.5, 30);
    score -= Math.min(dupPct * 1.5, 30);
    score -= Math.min(mixedCols * 2, 20);
    score = Math.max(0, Math.round(score));

    // Store data
    analysisData = {
      fileName: fileName,
      fileSize: fileSize,
      rowCount: rowCount,
      columnCount: colCount,
      sheetCount: currentWorkbook ? currentWorkbook.SheetNames.length : 1,
      duplicateCount: duplicates,
      missingTotal: cols.reduce(function(s, c){ return s + c.missing; }, 0),
      qualityScore: score,
      columns: cols,
      headers: headers,
      rawRows: rows
    };

    // Show panels
    document.getElementById('stats-panel').style.display = 'block';
    document.getElementById('cols-panel').style.display = 'block';
    document.getElementById('preview-panel').style.display = 'block';
    document.getElementById('loading-container').style.display = 'none';

    // Update stats
    setStat('stat-rows', rowCount.toLocaleString());
    setStat('stat-columns', colCount);
    setStat('stat-missing', analysisData.missingTotal.toLocaleString());
    setStat('stat-duplicates', duplicates.toLocaleString());
    setStat('stat-filesize', formatFileSize(fileSize));
    setStat('stat-sheets', analysisData.sheetCount);
    document.getElementById('file-summary').textContent = fileName + ' — ' + rowCount.toLocaleString() + ' rows, ' + colCount + ' columns';

    // Quality Score
    var scoreEl = document.getElementById('quality-number');
    var fillEl = document.getElementById('quality-fill');
    var labelEl = document.getElementById('quality-label');
    scoreEl.textContent = score;
    var cls = score >= 80 ? 'good' : (score >= 50 ? 'ok' : 'bad');
    scoreEl.className = 'quality-number ' + cls;
    fillEl.className = 'quality-fill ' + cls;
    fillEl.style.width = score + '%';
    labelEl.textContent = score >= 80 ? 'Good Quality' : (score >= 50 ? 'Fair Quality' : 'Poor Quality');

    // Next Step: Remove Duplicates
    var nextContainer = document.getElementById('next-step-container');
    nextContainer.innerHTML = '';
    if (duplicates > 0) {
      nextContainer.innerHTML = '<a href="/remove-excel-duplicates" class="next-step"><span class="arrow">➜</span> Remove duplicates from this file with our Deduplicator tool</a>';
    }

    // Render column stats
    renderColumnStats(cols);

    // Render Top N
    renderTopN(cols);

    // Render data preview
    renderDataPreview(headers, rows);
  }

  // ===== Render Column Stats =====
  function renderColumnStats(cols){
    var el = document.getElementById('col-stats');
    var html = '<table class="col-stats-table">';
    html += '<thead><tr><th>Column</th><th>Type</th><th>Count</th><th>Missing</th><th>Unique</th><th>Min</th><th>Max</th><th>Mean</th><th>Median</th><th>Std Dev</th><th>Flags</th></tr></thead>';
    html += '<tbody>';
    cols.forEach(function(c){
      var flagHtml = c.flags.map(function(f){
        var cls = f === 'constant' ? 'danger' : (f === 'mixed-type' ? 'warning' : 'success');
        return '<span class="col-flag ' + cls + '">' + f.replace('-', ' ') + '</span>';
      }).join(' ');
      html += '<tr>';
      html += '<td class="col-name">' + c.name + '</td>';
      html += '<td class="col-type">' + c.type + '</td>';
      html += '<td>' + c.count.toLocaleString() + '</td>';
      html += '<td class="col-missing">' + c.missing.toLocaleString() + '</td>';
      html += '<td class="col-unique">' + c.unique.toLocaleString() + '</td>';
      html += '<td>' + formatNumber(c.min) + '</td>';
      html += '<td>' + formatNumber(c.max) + '</td>';
      html += '<td>' + formatNumber(c.mean) + '</td>';
      html += '<td>' + formatNumber(c.median) + '</td>';
      html += '<td>' + formatNumber(c.stdDev) + '</td>';
      html += '<td>' + flagHtml + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    el.innerHTML = html;
  }

  // ===== Render Top N =====
  function renderTopN(cols){
    var container = document.getElementById('top-n-container');
    var content = document.getElementById('top-n-content');
    var hasCategorical = cols.some(function(c){ return c.type === 'string' && c.topN.length > 0; });
    if (!hasCategorical) {
      container.style.display = 'none';
      return;
    }
    container.style.display = 'block';
    var html = '';
    cols.forEach(function(c){
      if (c.type === 'string' && c.topN.length > 0) {
        var maxCount = c.topN[0][1];
        html += '<div style="font-size:12px;color:#7a7a7a;padding:6px 0 2px;font-weight:500;">' + c.name + '</div>';
        c.topN.forEach(function(item){
          var pct = maxCount > 0 ? (item[1] / maxCount * 100) : 0;
          html += '<div class="top-n-item">';
          html += '<span class="top-n-value">' + item[0] + '</span>';
          html += '<span class="top-n-count">' + item[1] + '</span>';
          html += '<div class="top-n-bar"><div class="top-n-fill" style="width:' + pct + '%"></div></div>';
          html += '</div>';
        });
      }
    });
    content.innerHTML = html;
  }

  // ===== Render Data Preview =====
  var previewRows = [];
  var previewSort = { col: null, dir: 'asc' };
  var previewSearch = '';

  function renderDataPreview(headers, rows){
    previewRows = rows.slice(0, 100);
    previewHeaders = headers;
    applyPreviewFilters();
  }

  var previewHeaders = [];
  var currentSortCol = null;
  var currentSortDir = 'asc';

  function applyPreviewFilters(){
    var filtered = previewRows;
    var search = document.getElementById('preview-search').value.toLowerCase();
    if (search) {
      filtered = filtered.filter(function(row){
        return row.some(function(cell){
          return cell !== undefined && cell !== null && String(cell).toLowerCase().includes(search);
        });
      });
    }
    // Sort
    if (currentSortCol !== null) {
      filtered = filtered.slice().sort(function(a, b){
        var va = a[currentSortCol] !== undefined && a[currentSortCol] !== null ? a[currentSortCol] : '';
        var vb = b[currentSortCol] !== undefined && b[currentSortCol] !== null ? b[currentSortCol] : '';
        if (typeof va === 'number' && typeof vb === 'number') {
          return currentSortDir === 'asc' ? va - vb : vb - va;
        }
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
        return currentSortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }

    document.getElementById('search-count').textContent = 'Showing ' + filtered.length + ' of ' + previewRows.length + ' rows';

    var el = document.getElementById('data-preview');
    if (filtered.length === 0) {
      el.innerHTML = '<div style="padding:20px;text-align:center;color:#4a4a4a;font-style:italic;">No matching rows found</div>';
      return;
    }
    var html = '<table class="data-preview-table">';
    html += '<thead><tr><th>#</th>';
    previewHeaders.forEach(function(h, idx){
      var sortClass = currentSortCol === idx ? 'sorted' : '';
      var sortIcon = currentSortCol === idx ? (currentSortDir === 'asc' ? '▲' : '▼') : '↕';
      html += '<th class="' + sortClass + '" data-col="' + idx + '">' + (h || '') + ' <span class="sort-icon">' + sortIcon + '</span></th>';
    });
    html += '</tr></thead><tbody>';
    filtered.forEach(function(row, i){
      html += '<tr><td class="row-num">' + (i + 1) + '</td>';
      previewHeaders.forEach(function(h, idx){
        var val = row[idx];
        if (val === undefined || val === null || val === '') {
          html += '<td class="null-val">null</td>';
        } else if (typeof val === 'string' && val.length > 100) {
          html += '<td title="' + val + '">' + val.substring(0, 100) + '…</td>';
        } else {
          html += '<td>' + val + '</td>';
        }
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    el.innerHTML = html;

    // Sort click handlers
    el.querySelectorAll('th[data-col]').forEach(function(th){
      th.addEventListener('click', function(){
        var colIdx = parseInt(this.dataset.col);
        if (currentSortCol === colIdx) {
          currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
        } else {
          currentSortCol = colIdx;
          currentSortDir = 'asc';
        }
        applyPreviewFilters();
      });
    });
  }

  // ===== Search input =====
  document.getElementById('preview-search').addEventListener('input', function(){
    applyPreviewFilters();
  });

  // ===== File Handling =====
  function processFile(file){
    var ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      showToast('Please upload a valid Excel or CSV file', 'error');
      return;
    }

    // File size guardrail (150MB)
    var MAX_SIZE = 150 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showToast('File exceeds 150MB limit. Please compress or split your file.', 'error');
      return;
    }

    fileNameDisplay.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
    document.getElementById('loading-container').style.display = 'block';

    var reader = new FileReader();
    reader.onload = function(e){
      try {
        var data = new Uint8Array(e.target.result);
        currentWorkbook = XLSX.read(data, { type: 'array' });
        var sheetNames = currentWorkbook.SheetNames;

        // Show sheet selector if multiple sheets
        var sheetSelector = document.getElementById('sheet-selector');
        var sheetDropdown = document.getElementById('sheet-dropdown');
        if (sheetNames.length > 1) {
          sheetSelector.style.display = 'flex';
          sheetDropdown.innerHTML = '';
          sheetNames.forEach(function(name){
            var opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            sheetDropdown.appendChild(opt);
          });
          document.getElementById('sheet-count').textContent = sheetNames.length + ' sheets';
        } else {
          sheetSelector.style.display = 'none';
        }

        // Load first sheet
        loadSheet(sheetNames[0], file.name, file.size);
      } catch(err) {
        showToast('Error reading file: ' + err.message, 'error');
        console.error(err);
        document.getElementById('loading-container').style.display = 'none';
      }
    };
    reader.onerror = function(){
      showToast('Error reading file', 'error');
      document.getElementById('loading-container').style.display = 'none';
    };
    reader.readAsArrayBuffer(file);
  }

  function loadSheet(sheetName, fileName, fileSize){
    currentSheetName = sheetName;
    var sheet = currentWorkbook.Sheets[sheetName];
    var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    if (jsonData.length === 0) {
      showToast('No data found in sheet: ' + sheetName, 'error');
      document.getElementById('loading-container').style.display = 'none';
      return;
    }
    rawData = jsonData;
    analyzeExcel(jsonData, fileName, fileSize);
  }

  // ===== Sheet selector change =====
  document.getElementById('sheet-dropdown').addEventListener('change', function(){
    if (currentWorkbook && analysisData) {
      document.getElementById('loading-container').style.display = 'block';
      loadSheet(this.value, analysisData.fileName, analysisData.fileSize);
    }
  });

  // ===== Drop Zone Events =====
  dropZone.addEventListener('click', function(){
    fileInput.click();
  });

  dropZone.addEventListener('dragover', function(e){
    e.preventDefault();
    this.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', function(e){
    e.preventDefault();
    this.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', function(e){
    e.preventDefault();
    this.classList.remove('dragover');
    var files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  });

  fileInput.addEventListener('change', function(){
    if (this.files.length > 0) {
      processFile(this.files[0]);
    }
  });

  // ===== Clear =====
  document.getElementById('btn-clear-file').addEventListener('click', function(){
    fileInput.value = '';
    fileNameDisplay.textContent = '';
    document.getElementById('stats-panel').style.display = 'none';
    document.getElementById('cols-panel').style.display = 'none';
    document.getElementById('preview-panel').style.display = 'none';
    document.getElementById('sheet-selector').style.display = 'none';
    document.getElementById('loading-container').style.display = 'none';
    document.getElementById('next-step-container').innerHTML = '';
    analysisData = null;
    currentWorkbook = null;
    rawData = null;
    showToast('Cleared', 'success');
  });

  // ===== Export Functions =====
  function getExportData(){
    if (!analysisData) {
      showToast('No data to export. Load an Excel file first.', 'error');
      return null;
    }
    return analysisData;
  }

  function buildExportText(data){
    var text = 'Excel File Analysis Results\n';
    text += '='.repeat(50) + '\n\n';
    text += 'Exported: ' + new Date().toLocaleString() + '\n\n';
    text += 'File Name:       ' + data.fileName + '\n';
    text += 'File Size:       ' + formatFileSize(data.fileSize) + '\n';
    text += 'Rows:            ' + data.rowCount.toLocaleString() + '\n';
    text += 'Columns:         ' + data.columnCount + '\n';
    text += 'Sheets:          ' + data.sheetCount + '\n';
    text += 'Missing Values:  ' + data.missingTotal.toLocaleString() + '\n';
    text += 'Duplicate Rows:  ' + data.duplicateCount.toLocaleString() + '\n';
    text += 'Quality Score:   ' + data.qualityScore + '/100\n\n';
    text += 'Column Statistics:\n';
    text += '-'.repeat(50) + '\n';
    data.columns.forEach(function(c){
      text += '\n' + c.name + ' (type: ' + c.type + ')\n';
      text += '  Count:   ' + c.count.toLocaleString() + '\n';
      text += '  Missing: ' + c.missing.toLocaleString() + '\n';
      text += '  Unique:  ' + c.unique.toLocaleString() + '\n';
      if (c.type === 'number' || c.type === 'date') {
        text += '  Min:     ' + formatNumber(c.min) + '\n';
        text += '  Max:     ' + formatNumber(c.max) + '\n';
        text += '  Mean:    ' + formatNumber(c.mean) + '\n';
        text += '  Median:  ' + formatNumber(c.median) + '\n';
        text += '  Std Dev: ' + formatNumber(c.stdDev) + '\n';
        if (c.q1 !== null) {
          text += '  Q1:      ' + formatNumber(c.q1) + '\n';
          text += '  Q3:      ' + formatNumber(c.q3) + '\n';
          text += '  IQR:     ' + formatNumber(c.iqr) + '\n';
        }
        if (c.outliers && c.outliers.length > 0) {
          text += '  Outliers: ' + c.outliers.length + ' detected\n';
        }
      }
      if (c.flags.length > 0) {
        text += '  Flags:   ' + c.flags.join(', ') + '\n';
      }
    });
    return text;
  }

  document.getElementById('btn-export-csv').addEventListener('click', function(){
    var data = getExportData();
    if (!data) return;
    var rows = [
      ['Metric', 'Value'],
      ['File Name', data.fileName],
      ['File Size', formatFileSize(data.fileSize)],
      ['Rows', data.rowCount],
      ['Columns', data.columnCount],
      ['Sheets', data.sheetCount],
      ['Missing Values', data.missingTotal],
      ['Duplicate Rows', data.duplicateCount],
      ['Quality Score', data.qualityScore],
      []
    ];
    rows.push(['Column', 'Type', 'Count', 'Missing', 'Unique', 'Min', 'Max', 'Mean', 'Median', 'Std Dev', 'Q1', 'Q3', 'IQR', 'Flags']);
    data.columns.forEach(function(c){
      rows.push([
        c.name,
        c.type,
        c.count,
        c.missing,
        c.unique,
        formatNumber(c.min),
        formatNumber(c.max),
        formatNumber(c.mean),
        formatNumber(c.median),
        formatNumber(c.stdDev),
        formatNumber(c.q1),
        formatNumber(c.q3),
        formatNumber(c.iqr),
        c.flags.join(';')
      ]);
    });
    var csv = rows.map(function(r){ return r.join(','); }).join('\n');
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'excel-analysis-results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully!', 'success');
  });

  document.getElementById('btn-export-txt').addEventListener('click', function(){
    var data = getExportData();
    if (!data) return;
    var text = buildExportText(data);
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'excel-analysis-results.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('TXT exported successfully!', 'success');
  });

  document.getElementById('btn-export-json').addEventListener('click', function(){
    var data = getExportData();
    if (!data) return;
    var json = JSON.stringify({
      exported: new Date().toISOString(),
      tool: 'Analyse Excel',
      fileName: data.fileName,
      fileSize: data.fileSize,
      rowCount: data.rowCount,
      columnCount: data.columnCount,
      sheetCount: data.sheetCount,
      missingTotal: data.missingTotal,
      duplicateCount: data.duplicateCount,
      qualityScore: data.qualityScore,
      columnDetails: data.columns
    }, null, 2);
    var blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'excel-analysis-results.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('JSON exported successfully!', 'success');
  });

})();
