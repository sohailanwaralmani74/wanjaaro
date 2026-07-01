// ============================================================
// XML TO JSON CONVERTER
// ============================================================

(function() {
  'use strict';

  // ── DOM refs ──
  var inputTextarea = document.getElementById('xmlInput');
  var outputTextarea = document.getElementById('jsonOutput');
  var inputEditorEl = document.getElementById('inputEditor');
  var outputEditorEl = document.getElementById('outputEditor');
  var convertBtn = document.getElementById('convertBtn');
  var copyBtn = document.getElementById('copyBtn');
  var downloadBtn = document.getElementById('downloadBtn');
  var fileInput = document.getElementById('xmlFileUpload');
  var attrOption = document.getElementById('attrOption');
  var indentSelect = document.getElementById('indentSelect');
  var toastEl = document.getElementById('toast');
  var statLines = document.getElementById('statLines');
  var statChars = document.getElementById('statChars');
  var statCursor = document.getElementById('statCursor');
  var statMsg = document.getElementById('statMsg');

  // ── CodeMirror instances ──
  var inputEditor, outputEditor;

  // ── Sample XML ──
  var sampleXML = '<bookstore>\n' +
                  '  <book category="fiction">\n' +
                  '    <title lang="en">The Great Gatsby</title>\n' +
                  '    <author>F. Scott Fitzgerald</author>\n' +
                  '    <year>1925</year>\n' +
                  '    <price>12.99</price>\n' +
                  '  </book>\n' +
                  '  <book category="nonfiction">\n' +
                  '    <title lang="en">Sapiens</title>\n' +
                  '    <author>Yuval Noah Harari</author>\n' +
                  '    <year>2011</year>\n' +
                  '    <price>18.99</price>\n' +
                  '  </book>\n' +
                  '</bookstore>';

  // ── Toast helper ──
  function showToast(msg, isError) {
    toastEl.textContent = msg;
    toastEl.className = 'converter-toast show' + (isError ? ' error' : '');
    clearTimeout(toastEl._timeout);
    toastEl._timeout = setTimeout(function() {
      toastEl.classList.remove('show');
    }, 3000);
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

  // ── Initialize editors ──
  function initEditors() {
    // Input editor (XML mode, editable) — pre‑loaded with sample
    inputEditor = CodeMirror(document.getElementById('inputEditor'), {
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

    // Output editor (JavaScript/JSON mode, read‑only)
    outputEditor = CodeMirror(document.getElementById('outputEditor'), {
      value: '// JSON output will appear here',
      mode: 'javascript',
      theme: 'dracula',
      lineNumbers: true,
      matchBrackets: true,
      readOnly: true,
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: false
    });

    // Update status on input changes
    inputEditor.on('change', function() {
      updateStatus(inputEditor);
      statMsg.textContent = 'Editing…';
    });
    inputEditor.on('cursorActivity', function() {
      updateStatus(inputEditor);
    });

    // Initial status
    updateStatus(inputEditor);
    statMsg.textContent = 'Ready';

    // Auto-convert on load (so sample shows JSON)
    setTimeout(function() {
      convert();
    }, 300);
  }

  // ── XML to JSON conversion logic ──
  function xmlToJson(xmlString, attrMode) {
    // Parse XML
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

    // Recursive XML node to JSON object
    function nodeToJson(node, attrMode) {
      var obj = {};

      // Handle text content
      var hasText = false;
      var textContent = '';

      // Process child nodes
      var childElements = [];
      var childTextNodes = [];

      for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          childElements.push(child);
        } else if (child.nodeType === Node.TEXT_NODE) {
          var trimmed = child.textContent.trim();
          if (trimmed.length > 0) {
            childTextNodes.push(trimmed);
          }
        }
      }

      // If there are text nodes, combine them
      if (childTextNodes.length > 0) {
        textContent = childTextNodes.join('').trim();
        hasText = textContent.length > 0;
      }

      // Process child elements
      if (childElements.length > 0) {
        // Group by element name to detect arrays
        var elementGroups = {};
        childElements.forEach(function(el) {
          var tag = el.tagName;
          if (!elementGroups[tag]) {
            elementGroups[tag] = [];
          }
          elementGroups[tag].push(el);
        });

        // Convert each group
        for (var tagName in elementGroups) {
          var group = elementGroups[tagName];
          if (group.length === 1) {
            // Single element -> nested object
            obj[tagName] = nodeToJson(group[0], attrMode);
          } else {
            // Multiple elements -> array
            obj[tagName] = group.map(function(el) {
              return nodeToJson(el, attrMode);
            });
          }
        }
      }

      // Handle attributes
      if (node.attributes.length > 0) {
        var attrs = {};
        for (var j = 0; j < node.attributes.length; j++) {
          var attr = node.attributes[j];
          if (attrMode === 'prefix') {
            obj['@' + attr.name] = attr.value;
          } else {
            attrs[attr.name] = attr.value;
          }
        }
        if (attrMode === 'nest' && Object.keys(attrs).length > 0) {
          obj['_attributes'] = attrs;
        }
      }

      // If no child elements and has text, return the text value
      if (childElements.length === 0 && hasText) {
        return textContent;
      }

      // If no child elements and no text, return empty string
      if (childElements.length === 0 && !hasText) {
        return '';
      }

      // If there is text content and also child elements, add a special _text property
      if (hasText && childElements.length > 0) {
        obj['_text'] = textContent;
      }

      return obj;
    }

    // Build JSON object from root
    var jsonObj = {};
    jsonObj[root.tagName] = nodeToJson(root, attrMode);

    return jsonObj;
  }

  // ── Convert action ──
  function convert() {
    var xml = inputEditor.getValue();
    if (!xml.trim()) {
      showToast('Please enter some XML', true);
      return;
    }

    var attrMode = attrOption.value;
    var indent = parseInt(indentSelect.value) || 4;
    if (indentSelect.value === 'tab') indent = '\t';

    statMsg.textContent = 'Converting…';

    var jsonObj = xmlToJson(xml, attrMode);
    if (jsonObj) {
      var jsonString = JSON.stringify(jsonObj, null, indent);
      outputEditor.setValue(jsonString);
      statMsg.textContent = 'Conversion successful';
      showToast('JSON generated successfully');
    } else {
      statMsg.textContent = 'Conversion failed';
    }
  }

  // ── Copy output ──
  function copyOutput() {
    var text = outputEditor.getValue();
    if (!text || text === '// JSON output will appear here') {
      showToast('Nothing to copy – convert XML first', true);
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        showToast('Copied to clipboard');
      }).catch(function() {
        showToast('Failed to copy', true);
      });
    } else {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Copied to clipboard');
    }
  }

  // ── Download JSON ──
  function downloadJson() {
    var text = outputEditor.getValue();
    if (!text || text === '// JSON output will appear here') {
      showToast('Nothing to download – convert XML first', true);
      return;
    }
    var blob = new Blob([text], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Download started');
  }

  // ── File upload ──
  function handleFileUpload(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var content = e.target.result;
      inputEditor.setValue(content);
      showToast('File loaded: ' + file.name);
      statMsg.textContent = 'File uploaded';
    };
    reader.onerror = function() {
      showToast('Failed to read file', true);
    };
    reader.readAsText(file);
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function() {
    initEditors();

    // Event listeners
    convertBtn.addEventListener('click', convert);
    copyBtn.addEventListener('click', copyOutput);
    downloadBtn.addEventListener('click', downloadJson);

    // Options change
    attrOption.addEventListener('change', convert);
    indentSelect.addEventListener('change', convert);

    // File upload
    fileInput.addEventListener('change', function(e) {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
      fileInput.value = '';
    });

    // Keyboard shortcut (Ctrl+Enter)
    inputEditor.addKeyMap({
      'Ctrl-Enter': convert
    });

    // Expose for debugging
    window.convert = convert;
  });

})();