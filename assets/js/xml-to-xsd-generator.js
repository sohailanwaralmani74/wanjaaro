// ============================================================
// XML to XSD Generator
// ============================================================

(function() {
  'use strict';

  // ── DOM refs ──
  var inputTextarea = document.getElementById('xmlInput');
  var outputTextarea = document.getElementById('xsdOutput');
  var inputEditorEl = document.getElementById('inputEditor');
  var outputEditorEl = document.getElementById('outputEditor');
  var convertBtn = document.getElementById('convertBtn');
  var copyBtn = document.getElementById('copyBtn');
  var downloadBtn = document.getElementById('downloadBtn');
  var fileInput = document.getElementById('xmlFileUpload');
  var toastEl = document.getElementById('toast');
  var statLines = document.getElementById('statLines');
  var statChars = document.getElementById('statChars');
  var statCursor = document.getElementById('statCursor');
  var statMsg = document.getElementById('statMsg');

  // ── CodeMirror instances ──
  var inputEditor, outputEditor;

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
    // Input editor (XML mode, editable)
    inputEditor = CodeMirror(document.getElementById('inputEditor'), {
      value: '<root>\n  <item id="1">\n    <name>Example</name>\n    <price>19.99</price>\n  </item>\n</root>',
      mode: 'xml',
      theme: 'dracula',
      lineNumbers: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      styleActiveLine: true,
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: false,
      extraKeys: {
        'Ctrl-Space': 'autocomplete'
      }
    });

    // Output editor (XML mode, read‑only)
    outputEditor = CodeMirror(document.getElementById('outputEditor'), {
      value: '// Generated XSD will appear here',
      mode: 'xml',
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
  }

  // ── XML to XSD conversion logic ──
  function xmlToXsd(xmlString) {
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

    // Helper: infer XSD type from value
    function inferType(value) {
      if (value === undefined || value === null) return 'xs:string';
      // Try boolean
      if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
        return 'xs:boolean';
      }
      // Try number
      var num = parseFloat(value);
      if (!isNaN(num) && isFinite(num)) {
        // Check if it's an integer
        if (Number.isInteger(num)) {
          return 'xs:integer';
        } else {
          return 'xs:decimal';
        }
      }
      // Try date
      if (!isNaN(Date.parse(value))) {
        return 'xs:dateTime';
      }
      return 'xs:string';
    }

    // Recursively build XSD structure
    function buildSchema(node, targetNamespace) {
      var nsPrefix = targetNamespace ? 'tns' : '';
      var nsAttr = targetNamespace ? ' xmlns:tns="' + targetNamespace + '"' : '';
      var targetAttr = targetNamespace ? ' targetNamespace="' + targetNamespace + '"' : '';
      var elementFormDefault = ' elementFormDefault="qualified"';

      var xsd = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xsd += '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"' + nsAttr + targetAttr + elementFormDefault + '>\n';

      // Recursively process node
      function processElement(el, parentName) {
        var tag = el.tagName;
        var hasChildren = false;
        var childElements = [];
        var attributes = [];
        var textContent = '';

        // Check if element has children
        for (var i = 0; i < el.childNodes.length; i++) {
          var child = el.childNodes[i];
          if (child.nodeType === Node.ELEMENT_NODE) {
            hasChildren = true;
            childElements.push(child);
          } else if (child.nodeType === Node.TEXT_NODE) {
            textContent += child.textContent.trim();
          }
        }

        // Attributes
        for (var j = 0; j < el.attributes.length; j++) {
          var attr = el.attributes[j];
          attributes.push({ name: attr.name, value: attr.value });
        }

        // Determine type
        var type = 'xs:string';
        if (!hasChildren && textContent !== '') {
          type = inferType(textContent);
        } else if (!hasChildren) {
          type = 'xs:string';
        }

        // Build element declaration
        var elementDef = '';
        if (hasChildren) {
          // Complex type with sequence
          elementDef = '  <xs:element name="' + tag + '">\n';
          elementDef += '    <xs:complexType>\n';
          if (attributes.length > 0) {
            elementDef += '      <xs:sequence>\n';
            // Recursively process children
            childElements.forEach(function(child) {
              elementDef += processElement(child, tag);
            });
            elementDef += '      </xs:sequence>\n';
            // Attributes
            attributes.forEach(function(attr) {
              var attrType = inferType(attr.value);
              elementDef += '      <xs:attribute name="' + attr.name + '" type="' + attrType + '" />\n';
            });
          } else {
            // No attributes, just sequence
            elementDef += '      <xs:sequence>\n';
            childElements.forEach(function(child) {
              elementDef += processElement(child, tag);
            });
            elementDef += '      </xs:sequence>\n';
          }
          elementDef += '    </xs:complexType>\n';
          elementDef += '  </xs:element>\n';
        } else {
          // Simple type
          elementDef = '  <xs:element name="' + tag + '" type="' + type + '" />\n';
        }
        return elementDef;
      }

      // Process root element
      xsd += processElement(node, '');

      xsd += '</xs:schema>';
      return xsd;
    }

    // Build XSD
    var xsdString = buildSchema(root, '');
    return xsdString;
  }

  // ── Convert action ──
  function convert() {
    var xml = inputEditor.getValue();
    if (!xml.trim()) {
      showToast('Please enter some XML', true);
      return;
    }
    statMsg.textContent = 'Converting…';
    var xsd = xmlToXsd(xml);
    if (xsd) {
      outputEditor.setValue(xsd);
      statMsg.textContent = 'Conversion successful';
      showToast('XSD generated successfully');
    } else {
      statMsg.textContent = 'Conversion failed';
    }
  }

  // ── Copy output ──
  function copyOutput() {
    var text = outputEditor.getValue();
    if (!text || text === '// Generated XSD will appear here') {
      showToast('Nothing to copy – generate XSD first', true);
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        showToast('Copied to clipboard');
      }).catch(function() {
        showToast('Failed to copy', true);
      });
    } else {
      // Fallback
      var textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Copied to clipboard');
    }
  }

  // ── Download XSD ──
  function downloadXsd() {
    var text = outputEditor.getValue();
    if (!text || text === '// Generated XSD will appear here') {
      showToast('Nothing to download – generate XSD first', true);
      return;
    }
    var blob = new Blob([text], { type: 'application/xml' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'schema.xsd';
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

  // ── Load sample XML ──
  function loadSample() {
    var sample = '<bookstore>\n' +
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
    inputEditor.setValue(sample);
    showToast('Sample XML loaded');
    statMsg.textContent = 'Sample loaded';
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function() {
    initEditors();

    // Event listeners
    convertBtn.addEventListener('click', convert);

    copyBtn.addEventListener('click', copyOutput);

    downloadBtn.addEventListener('click', downloadXsd);

    fileInput.addEventListener('change', function(e) {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
      // Reset input so same file can be re-uploaded
      fileInput.value = '';
    });

    // Optional: Keyboard shortcut for convert (Ctrl+Enter)
    inputEditor.addKeyMap({
      'Ctrl-Enter': convert
    });

    // Expose for debugging
    window.convert = convert;
  });

})();