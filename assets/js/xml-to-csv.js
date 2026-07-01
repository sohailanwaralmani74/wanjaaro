// ============================================================
// XML TO CSV CONVERTER
// ============================================================
// Nested XML objects are auto-detected and split into separate CSV
// tables (rather than one flat file), each linked to its parent via
// a `parent_<tag>` id column — since CSV itself can't represent
// hierarchy. Tables can be downloaded individually or bundled
// together as a ZIP of CSV files (via JSZip).

(function() {
  'use strict';

  // ── DOM refs ──
  var inputEditor = document.getElementById('inputEditor');
  var convertBtn = document.getElementById('convertBtn');
  var loadSampleBtn = document.getElementById('loadSampleBtn');
  var fileInput = document.getElementById('xmlFileUpload');
  var csvOutput = document.getElementById('csvOutput');
  var sheetSelector = document.getElementById('sheetSelector');
  var previewHead = document.getElementById('previewHead');
  var previewBody = document.getElementById('previewBody');
  var rowCount = document.getElementById('rowCount');
  var downloadCsvBtn = document.getElementById('downloadCsvBtn');
  var downloadAllZipBtn = document.getElementById('downloadAllZipBtn');
  var toastEl = document.getElementById('toast');
  var statLines = document.getElementById('statLines');
  var statChars = document.getElementById('statChars');
  var statCursor = document.getElementById('statCursor');
  var statMsg = document.getElementById('statMsg');

  // ── CodeMirror instance ──
  var cm;

  // ── Data storage ──
  // workbookData: tagName -> array of row objects. Every XML element that
  // contains at least one child element (i.e. is a "nested object", not
  // just a value) becomes its own table, named after its tag. All
  // occurrences of that tag anywhere in the document become rows in that
  // one table, linked back to their parent row via a `parent_<parentTag>`
  // id column.
  var workbookData = {};
  var sheetNames = [];

  // ── Sample XML ──
  var sampleXML = '<company>\n' +
                  '  <department name="Engineering">\n' +
                  '    <employee id="101">\n' +
                  '      <name>John Doe</name>\n' +
                  '      <role>Senior Developer</role>\n' +
                  '    </employee>\n' +
                  '    <employee id="102">\n' +
                  '      <name>Jane Smith</name>\n' +
                  '      <role>Team Lead</role>\n' +
                  '    </employee>\n' +
                  '  </department>\n' +
                  '  <department name="Sales">\n' +
                  '    <employee id="201">\n' +
                  '      <name>Bob Johnson</name>\n' +
                  '      <role>Account Manager</role>\n' +
                  '    </employee>\n' +
                  '  </department>\n' +
                  '</company>';

  // ── Toast helper ──
  function showToast(msg, isError) {
    toastEl.textContent = msg;
    toastEl.className = 'converter-toast show' + (isError ? ' error' : '');
    clearTimeout(toastEl._timeout);
    toastEl._timeout = setTimeout(function() {
      toastEl.classList.remove('show');
    }, 2000);
  }

  // ── Update status bar ──
  function updateStatus(editor) {
    var doc = editor.getDoc();
    var cursor = doc.getCursor();
    var text = doc.getValue();
    var lines = text.split('\n').length;
    var chars = text.length;
    statLines.textContent = lines;
    statChars.textContent = chars;
    statCursor.textContent = (cursor.line + 1) + ':' + (cursor.ch + 1);
  }

  // ── Initialize editor ──
  function initEditor() {
    cm = CodeMirror(document.getElementById('inputEditor'), {
      value: sampleXML,
      mode: 'xml',
      theme: 'dracula',
      lineNumbers: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      styleActiveLine: true,
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: false
    });

    cm.on('change', function() {
      updateStatus(cm);
      statMsg.textContent = 'Editing…';
    });
    cm.on('cursorActivity', function() {
      updateStatus(cm);
    });

    updateStatus(cm);
    statMsg.textContent = 'Ready';
  }

  // ── Inject a spreadsheet-like look for the CSV preview table (once) ──
  function injectPreviewStyles() {
    if (document.getElementById('csvPreviewStyles')) return;
    var style = document.createElement('style');
    style.id = 'csvPreviewStyles';
    style.textContent = [
      '.xlsx-scroll{overflow:auto;max-height:520px;border:1px solid #b7b7b7;',
        'background:#fff;font-family:Calibri,"Segoe UI",Arial,sans-serif;font-size:13px;}',
      '.xlsx-table{border-collapse:collapse;table-layout:fixed;min-width:100%;}',
      '.xlsx-table td,.xlsx-table th{border:1px solid #d4d4d4;padding:4px 8px;',
        'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;height:22px;box-sizing:border-box;}',
      '.xlsx-collabels th{position:sticky;top:0;z-index:3;background:#f3f3f3;color:#616161;',
        'font-weight:400;text-align:center;border-bottom:1px solid #b7b7b7;min-width:110px;}',
      '.xlsx-collabels th.xlsx-corner{position:sticky;left:0;top:0;z-index:4;background:#f3f3f3;min-width:44px;}',
      '.xlsx-headerrow th{position:sticky;top:23px;z-index:3;background:#e8f0e3;color:#1b1b1b;',
        'font-weight:600;text-align:left;border-bottom:2px solid #9fc48a;min-width:110px;}',
      '.xlsx-headerrow th.xlsx-rownum{position:sticky;left:0;top:23px;z-index:4;background:#f3f3f3;',
        'color:#616161;text-align:center;font-weight:400;min-width:44px;}',
      '.xlsx-table tbody td.xlsx-rownum{position:sticky;left:0;z-index:2;background:#f3f3f3;',
        'color:#616161;text-align:center;min-width:44px;}',
      '.xlsx-table tbody tr:nth-child(even){background:#f8faf7;}',
      '.xlsx-table tbody tr:hover td{background:#eaf3ff;}',
      '.xlsx-table tbody tr:hover td.xlsx-rownum{background:#cfe3fb;}',
      '.xlsx-table tbody td{color:#1b1b1b;text-align:left;}'
    ].join('');
    document.head.appendChild(style);
  }

  // ── Column letters like a spreadsheet: A, B, ... Z, AA, AB, ... ──
  function colLetter(index) {
    var letters = '';
    index = index + 1;
    while (index > 0) {
      var rem = (index - 1) % 26;
      letters = String.fromCharCode(65 + rem) + letters;
      index = Math.floor((index - 1) / 26);
    }
    return letters;
  }

  // ── Helper: escape text for safe HTML preview rendering ──
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ── Helper: get attributes as a plain object ──
  function getAttributes(el) {
    var attrs = {};
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      attrs[attr.name] = attr.value;
    }
    return attrs;
  }

  // ── Helper: get direct text content of an element ──
  function getTextContent(el) {
    var text = '';
    for (var i = 0; i < el.childNodes.length; i++) {
      var child = el.childNodes[i];
      if (child.nodeType === Node.TEXT_NODE) {
        var t = child.textContent.trim();
        if (t) text += (text ? ' ' : '') + t;
      }
    }
    return text;
  }

  // ── Helper: is this element a plain value (leaf) rather than a nested object? ──
  // A leaf has no child ELEMENT nodes — attributes/text only. Anything with
  // at least one child element is a "nested object" and earns its own table.
  function isLeafElement(el) {
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === Node.ELEMENT_NODE) return false;
    }
    return true;
  }

  // ── Helper: set a cell, gracefully collecting repeated same-name leaf tags ──
  function setCell(row, key, value) {
    if (!row.hasOwnProperty(key) || row[key] === undefined || row[key] === '') {
      row[key] = value;
      return;
    }
    if (Array.isArray(row[key])) {
      row[key].push(value);
    } else {
      row[key] = [row[key], value];
    }
  }

  // ── Helper: stringify a cell value for preview/export ──
  function stringifyCell(val) {
    if (Array.isArray(val)) return val.join('; ');
    return (val === undefined || val === null) ? '' : String(val);
  }

  // ── Helper: escape a value for CSV (RFC 4180-ish) ──
  function csvEscape(val) {
    var str = stringifyCell(val);
    if (/[",\n\r]/.test(str)) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  // ── Helper: build a CSV string from rows + column keys ──
  function rowsToCsv(rows, colKeys) {
    var lines = [];
    lines.push(colKeys.map(csvEscape).join(','));
    rows.forEach(function(row) {
      lines.push(colKeys.map(function(col) { return csvEscape(row[col]); }).join(','));
    });
    return lines.join('\r\n');
  }

  // ── Helper: safe filename from a table/tag name ──
  function sanitizeFilename(name) {
    return String(name).replace(/[\/\\?%*:|"<>\s]+/g, '_');
  }

  // ── Per-tag auto-increment ids, used to link parent/child rows across tables ──
  var rowIdCounters = {};
  function nextRowId(tag) {
    rowIdCounters[tag] = (rowIdCounters[tag] || 0) + 1;
    return rowIdCounters[tag];
  }

  // ── Recursively process one element into its tag-named table ──
  function processElement(el, parentInfo, sheets) {
    var tag = el.tagName;
    var row = { _id: nextRowId(tag) };

    if (parentInfo) {
      row['parent_' + parentInfo.tag] = parentInfo.id;
    }

    var attrs = getAttributes(el);
    for (var key in attrs) {
      if (attrs.hasOwnProperty(key)) row[key] = attrs[key];
    }

    // Reserve the row (and the table) now, in document order, then fill it
    // in as we walk the children below. Object mutation means later edits
    // to `row` are still reflected once pushed.
    if (!sheets[tag]) sheets[tag] = [];
    sheets[tag].push(row);

    var directText = '';

    for (var i = 0; i < el.childNodes.length; i++) {
      var child = el.childNodes[i];

      if (child.nodeType === Node.TEXT_NODE) {
        var t = child.textContent.trim();
        if (t) directText += (directText ? ' ' : '') + t;
        continue;
      }

      if (child.nodeType !== Node.ELEMENT_NODE) continue;

      if (isLeafElement(child)) {
        // Simple key/value — merge into the current row as columns.
        var childAttrs = getAttributes(child);
        for (var ckey in childAttrs) {
          if (childAttrs.hasOwnProperty(ckey)) {
            setCell(row, child.tagName + '_' + ckey, childAttrs[ckey]);
          }
        }
        var childText = getTextContent(child);
        if (childText.length > 0) {
          setCell(row, child.tagName, childText);
        }
      } else {
        // Nested object — recurse; it becomes a row in its own tag-named
        // table, linked back to this row via parent_<tag>.
        processElement(child, { tag: tag, id: row._id }, sheets);
      }
    }

    if (directText.length > 0) {
      row['_text'] = directText;
    }
  }

  // ── Main conversion: XML string -> { tagName: [rows] } ──
  function xmlToSheets(xmlString) {
    var parser = new DOMParser();
    var xmlDoc;
    try {
      xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      var parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        throw new Error(parseError[0].textContent);
      }
    } catch (e) {
      showToast('Invalid XML: ' + e.message, true);
      return null;
    }

    var root = xmlDoc.documentElement;
    if (!root) {
      showToast('No root element found', true);
      return null;
    }

    rowIdCounters = {};
    var sheets = {};
    processElement(root, null, sheets);
    return sheets;
  }

  // ── Convert action ──
  function convert() {
    var xml = cm.getValue();
    if (!xml.trim()) {
      showToast('Please enter some XML', true);
      return;
    }

    statMsg.textContent = 'Converting…';

    var sheets = xmlToSheets(xml);
    if (!sheets) {
      statMsg.textContent = 'Conversion failed';
      return;
    }

    if (Object.keys(sheets).length === 0) {
      showToast('No data found in XML', true);
      statMsg.textContent = 'No data found';
      return;
    }

    workbookData = sheets;
    sheetNames = Object.keys(sheets);

    // Show output div
    csvOutput.style.display = 'block';

    // Populate table selector — table (tag) names only
    sheetSelector.innerHTML = '';
    sheetNames.forEach(function(name) {
      var option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      sheetSelector.appendChild(option);
    });

    // Render first table
    renderSheet(sheetNames[0]);

    // Scroll to output
    csvOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });

    statMsg.textContent = 'Conversion successful';
    showToast('XML converted to CSV successfully (' + sheetNames.length + ' table' + (sheetNames.length === 1 ? '' : 's') + ')');
  }

  // ── Render a specific table as a spreadsheet-style grid ──
  function renderSheet(sheetName) {
    injectPreviewStyles();

    var rows = workbookData[sheetName] || [];

    // Ensure the surrounding markup is the scrollable grid wrapper.
    var table = previewHead.closest ? previewHead.closest('table') : previewHead.parentNode;
    if (table && table.parentNode && !table.parentNode.classList.contains('xlsx-scroll')) {
      var wrapper = document.createElement('div');
      wrapper.className = 'xlsx-scroll';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
    if (table) table.className = 'xlsx-table';

    if (rows.length === 0) {
      previewHead.innerHTML =
        '<tr class="xlsx-collabels"><th class="xlsx-corner"></th><th>A</th></tr>' +
        '<tr class="xlsx-headerrow"><th class="xlsx-rownum">1</th><th>(empty)</th></tr>';
      previewBody.innerHTML =
        '<tr><td class="xlsx-rownum">2</td><td style="color:#8a8a8a;">No data in this table</td></tr>';
      rowCount.textContent = '0 rows';
      return;
    }

    // Column keys, unioned across all rows (rows may have differing shapes)
    var columns = {};
    rows.forEach(function(row) {
      for (var key in row) {
        if (row.hasOwnProperty(key)) columns[key] = true;
      }
    });
    var colKeys = Object.keys(columns);

    // Row 1: column letters (A, B, C…) — first cell is the blank corner
    var collabels = '<tr class="xlsx-collabels"><th class="xlsx-corner"></th>';
    colKeys.forEach(function(col, i) {
      collabels += '<th>' + colLetter(i) + '</th>';
    });
    collabels += '</tr>';

    // Row 2: actual field names, with a "1" row-number cell
    var headerrow = '<tr class="xlsx-headerrow"><th class="xlsx-rownum">1</th>';
    colKeys.forEach(function(col) {
      headerrow += '<th title="' + escapeHtml(col) + '">' + escapeHtml(col) + '</th>';
    });
    headerrow += '</tr>';

    previewHead.innerHTML = collabels + headerrow;

    // Data rows, numbered starting at 2 (row 1 is the header)
    var tbody = '';
    rows.forEach(function(row, idx) {
      tbody += '<tr><td class="xlsx-rownum">' + (idx + 2) + '</td>';
      colKeys.forEach(function(col) {
        var val = stringifyCell(row[col]);
        tbody += '<td title="' + escapeHtml(val) + '">' + escapeHtml(val) + '</td>';
      });
      tbody += '</tr>';
    });
    previewBody.innerHTML = tbody;

    rowCount.textContent = rows.length + ' rows';
  }

  // ── Table selector change ──
  sheetSelector.addEventListener('change', function() {
    var sheet = this.value;
    if (sheet && workbookData[sheet]) {
      renderSheet(sheet);
    }
  });

  // ── Column keys for a given table ──
  function columnsFor(rows) {
    var cols = {};
    rows.forEach(function(row) {
      for (var key in row) {
        if (row.hasOwnProperty(key)) cols[key] = true;
      }
    });
    return Object.keys(cols);
  }

  // ── Download the currently selected table as a single .csv file ──
  function downloadCsv(sheetName) {
    if (!sheetName || !workbookData[sheetName]) {
      showToast('No table selected', true);
      return;
    }
    try {
      var rows = workbookData[sheetName];
      if (rows.length === 0) {
        showToast('This table has no data', true);
        return;
      }
      var colKeys = columnsFor(rows);
      var csv = '\uFEFF' + rowsToCsv(rows, colKeys); // BOM helps Excel read UTF-8 correctly

      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = sanitizeFilename(sheetName) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Downloaded ' + sanitizeFilename(sheetName) + '.csv');
    } catch (e) {
      showToast('Download failed: ' + e.message, true);
    }
  }

  // ── Download every table at once as a .zip of .csv files ──
  function downloadAllZip() {
    if (!workbookData || Object.keys(workbookData).length === 0) {
      showToast('No data to download — convert XML first', true);
      return;
    }
    if (typeof JSZip === 'undefined') {
      showToast('ZIP library failed to load — check your connection', true);
      return;
    }

    try {
      var zip = new JSZip();
      var usedNames = {};
      var fileCount = 0;

      for (var sheetName in workbookData) {
        if (!workbookData.hasOwnProperty(sheetName)) continue;
        var rows = workbookData[sheetName];
        if (rows.length === 0) continue;

        var colKeys = columnsFor(rows);
        var csv = '\uFEFF' + rowsToCsv(rows, colKeys);

        var baseName = sanitizeFilename(sheetName);
        var finalName = baseName;
        var suffix = 1;
        while (usedNames[finalName]) {
          suffix++;
          finalName = baseName + '_' + suffix;
        }
        usedNames[finalName] = true;

        zip.file(finalName + '.csv', csv);
        fileCount++;
      }

      if (fileCount === 0) {
        showToast('No data to export', true);
        return;
      }

      zip.generateAsync({ type: 'blob' }).then(function(blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'xml-tables.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Downloaded ZIP with ' + fileCount + ' CSV file' + (fileCount === 1 ? '' : 's'));
      }).catch(function(e) {
        showToast('ZIP generation failed: ' + e.message, true);
      });
    } catch (e) {
      showToast('Download failed: ' + e.message, true);
    }
  }

  downloadCsvBtn.addEventListener('click', function() { downloadCsv(sheetSelector.value); });
  downloadAllZipBtn.addEventListener('click', downloadAllZip);

  // ── File upload ──
  function handleFileUpload(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var content = e.target.result;
      cm.setValue(content);
      showToast('File loaded: ' + file.name);
      statMsg.textContent = 'File uploaded';
    };
    reader.onerror = function() {
      showToast('Failed to read file', true);
    };
    reader.readAsText(file);
  }

  fileInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
    fileInput.value = '';
  });

  // ── Keyboard shortcut ──
  function initKeyMap() {
    cm.addKeyMap({
      'Ctrl-Enter': convert
    });
  }

  // ── Load sample XML into the editor (lets users get back to the demo
  //    after pasting/uploading their own XML) ──
  function loadSample() {
    cm.setValue(sampleXML);
    cm.focus();
    showToast('Sample XML loaded');
    statMsg.textContent = 'Sample loaded';
  }

  // ── Init ──
  function init() {
    initEditor();
    initKeyMap();
    convertBtn.addEventListener('click', convert);
    if (loadSampleBtn) {
      loadSampleBtn.addEventListener('click', loadSample);
    }
    window.convert = convert;

    // Guards against a blank editor when #inputEditor is created while its
    // container has zero size (e.g. still animating/hidden layout), and
    // when this script runs after layout/paint has already settled.
    setTimeout(function() {
      if (cm) cm.refresh();
    }, 0);

    // Auto-convert the preloaded sample XML so the preview isn't empty
    // on first load.
    convert();
  }

  // If this script executes after DOMContentLoaded has already fired
  // (e.g. injected by a client-side router/layout rather than a plain
  // page load), the event will never come — so run immediately in that
  // case instead of waiting forever.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();