// ------------------ XML To XSD Tool (Smart Type Inference + Standard Formatting) ------------------

// DOM references
const fileInputXsd = document.getElementById('fileInputXsd');
const generateBtnXsd = document.getElementById('generateBtnXsd');
const xmlPreviewPanel = document.getElementById('xmlPreviewPanel');
const xsdPreview = document.getElementById('xsdPreview');
const xsdPanel = document.getElementById('xsdPanel');
const toastXsd = document.getElementById('toastXsd');
const copyXsdBtn = document.getElementById('copyXsdBtn');
const exportXsdBtn = document.getElementById('exportXsdBtn');

let uploadedXmlDoc = null;

// ------------------ XML Parser ------------------

function parseXml(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const xmlText = e.target.result;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      const parseError = xmlDoc.getElementsByTagName("parsererror")[0];

      if (parseError) {
        // Try to extract error message and position info
        let errorMessage = parseError.textContent || "Invalid XML structure.";
        let lineMatch = errorMessage.match(/Line\s*(\d+)/i);
        let colMatch = errorMessage.match(/Column\s*(\d+)/i);
        let lineNum = lineMatch ? parseInt(lineMatch[1], 10) : null;
        let colNum = colMatch ? parseInt(colMatch[1], 10) : null;

        // Prepare error display
        let highlightedXml = xmlText
          .split("\n")
          .map((line, i) => {
            if (lineNum && i + 1 === lineNum) {
              return `<div class="error-line"><span class="line-num">${i + 1}:</span> ${line}</div>`;
            } else {
              return `<div><span class="line-num">${i + 1}:</span> ${line}</div>`;
            }
          })
          .join("");

        xmlPreviewPanel.innerHTML = `
          <div class="xml-error">
            <div class="small red">⚠️ Error parsing XML:</div>
            <div class="small">${errorMessage}</div>
            ${
              lineNum
                ? `<div class="small gray">Line: ${lineNum}${
                    colNum ? ", Column: " + colNum : ""
                  }</div>`
                : ""
            }
            <pre class="xml-preview">${highlightedXml}</pre>
          </div>
        `;

        return; // Stop here
      }

      // If no error, proceed normally
      callback(xmlDoc);
    } catch (err) {
      xmlPreviewPanel.innerHTML = `<div class="small red">Error parsing XML: ${err.message}</div>`;
    }
  };

  reader.readAsText(file);
}


// ------------------ XML Upload ------------------
fileInputXsd.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  parseXml(file, (xmlDoc) => {
    uploadedXmlDoc = xmlDoc;
    renderXmlPreview(uploadedXmlDoc);
    generateBtnXsd.disabled = false;
    xsdPanel.classList.remove('visible');
  });
});

// ------------------ Render XML Preview ------------------
function renderXmlPreview(xmlDoc) {
  xmlPreviewPanel.innerHTML = '';
  const serializer = new XMLSerializer();
  let xmlString = serializer.serializeToString(xmlDoc);
  xmlString = formatXml(xmlString);
  const pre = document.createElement('pre');
  pre.textContent = xmlString;
  pre.style.whiteSpace = 'pre-wrap';
  pre.style.wordBreak = 'break-word';
  xmlPreviewPanel.appendChild(pre);
}

// ------------------ XML Pretty Formatter ------------------
function formatXml(xml) {
  const PADDING = '  ';
  const reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\r\n$2$3');
  let pad = 0;
  return xml
    .split('\r\n')
    .map((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) indent = 0;
      else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w([^>]*[^/])?>.*$/)) indent = 1;
      const line = PADDING.repeat(pad) + node;
      pad += indent;
      return line;
    })
    .join('\r\n')
    .trim();
}

// ------------------ Smart Type Inference Helper ------------------
function inferType(value) {
  if (value === null || value === undefined) return "xs:string";
  const trimmed = value.trim();
  if (/^-?\d+$/.test(trimmed)) return "xs:integer";
  if (/^-?\d+\.\d+$/.test(trimmed)) return "xs:decimal";
  if (/^(true|false|1|0)$/i.test(trimmed)) return "xs:boolean";
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return "xs:date";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?/.test(trimmed)) return "xs:dateTime";
  if (/^[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) return "xs:string";
  return "xs:string";
}

// ------------------ XSD Builder (Recursive) ------------------
function generateXsd(node, nodeName = "root", indent = 2) {
  if (node.nodeType !== 1) return "";
  const pad = " ".repeat(indent);
  const children = Array.from(node.children);
  const hasChildren = children.length > 0;
  const hasAttributes = node.attributes && node.attributes.length > 0;
  const textValue = node.textContent?.trim() || "";

  let xsd = `${pad}<xs:element name="${nodeName}"`;

  if (!hasChildren && !hasAttributes) {
    const detectedType = textValue ? inferType(textValue) : "xs:string";
    xsd += ` type="${detectedType}"/>\n`;
    return xsd;
  }

  xsd += `>\n${pad}  <xs:complexType`;
  if (hasChildren && textValue) xsd += ` mixed="true"`;
  xsd += `>\n`;

  // Children
  if (hasChildren) {
    xsd += `${pad}    <xs:sequence>\n`;
    const childNames = [...new Set(children.map(c => c.nodeName))];

    childNames.forEach(childName => {
      const sameChildren = children.filter(c => c.nodeName === childName);
      const maxOccurs = sameChildren.length > 1 ? ` maxOccurs="unbounded"` : "";
      const minOccurs = ` minOccurs="0"`;
      let childXsd = generateXsd(sameChildren[0], childName, indent + 6);
      childXsd = childXsd.replace(
        /<xs:element name="([^"]+)"/,
        `<xs:element name="$1"${minOccurs}${maxOccurs}`
      );
      xsd += childXsd;
    });

    xsd += `${pad}    </xs:sequence>\n`;
  }

  // Attributes
  if (hasAttributes) {
    Array.from(node.attributes).forEach(attr => {
      const type = inferType(attr.value);
      xsd += `${pad}    <xs:attribute name="${attr.name}" type="${type}"/>\n`;
    });
  }

  xsd += `${pad}  </xs:complexType>\n${pad}</xs:element>\n`;
  return xsd;
}

// ------------------ Generate XSD ------------------
generateBtnXsd.addEventListener('click', () => {
  if (!uploadedXmlDoc) return;

  let xsdOutput = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xsdOutput += '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">\n';
  Array.from(uploadedXmlDoc.children).forEach(child => {
    xsdOutput += generateXsd(child, child.nodeName, 2);
  });
  xsdOutput += '</xs:schema>';

  xsdPreview.value = formatXml(xsdOutput);
  xsdPreview.style.fontFamily = 'monospace';
  xsdPreview.style.fontSize = '14px';
  xsdPanel.classList.add('visible');

  toastXsd.textContent = '✅ XSD Generation Successful!';
  toastXsd.classList.add('show');
  setTimeout(() => {
    toastXsd.classList.remove('show');
    xsdPanel.scrollIntoView({ behavior: 'smooth' });
  }, 2000);
});

// ------------------ Copy XSD ------------------
copyXsdBtn.addEventListener('click', () => {
  xsdPreview.select();
  document.execCommand('copy');
  toastXsd.textContent = '✅ XSD Copied to Clipboard!';
  toastXsd.classList.add('show');
  setTimeout(() => toastXsd.classList.remove('show'), 2000);
});

// ------------------ Export XSD ------------------
exportXsdBtn.addEventListener('click', () => {
  const blob = new Blob([xsdPreview.value], { type: "text/xml" });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'schema.xsd';
  a.click();
  URL.revokeObjectURL(a.href);
});
