// Elements
const jsonInputEditor = document.getElementById("jsonInputEditor");
const jsonPreviewArea = $("#jsonPreviewArea");
const convertBtnJson = document.getElementById("convertBtnJson");
const toastJson = document.getElementById("toastJson");
const fileInputJson = document.getElementById("fileInputJson");
const outputArea = document.getElementById("outputArea");
const copyOutputBtn = document.getElementById("copyOutputBtn");
const exportBtn = document.getElementById("exportOutputBtn");

let parsedJson = null;

// ========== JSON Validation & Live Preview ==========
function updateJsonPreview() {
  const text = jsonInputEditor.value.trim();
  if (!text) {
    jsonPreviewArea.JSONView({});
    convertBtnJson.disabled = true;
    parsedJson = null;
    return;
  }
  try {
    parsedJson = JSON.parse(text);
    jsonPreviewArea.JSONView(parsedJson, { collapsed: false });
    convertBtnJson.disabled = false;
  } catch (e) {
    jsonPreviewArea.html('<div class="jsonx-error">❌ Invalid JSON</div>');
    convertBtnJson.disabled = true;
    parsedJson = null;
  }
}
jsonInputEditor.addEventListener("input", updateJsonPreview);

// ========== Upload JSON File ==========
fileInputJson.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  jsonPreviewArea.html('<div class="jsonx-placeholder">Preview will appear here after conversion...</div>');
  const reader = new FileReader();

  reader.onload = function (event) {
    jsonInputEditor.value = event.target.result;
    updateJsonPreview(); // ✅ triggers preview update
  };
  reader.readAsText(file);
});

// ========== Convert Button ==========
convertBtnJson.addEventListener("click", () => {
  if (!parsedJson) return;
  const xmlOutput = jsonToXml(parsedJson);
  const formattedXml = formatXml(xmlOutput);

  outputArea.value = formattedXml;
  showToast("✅ Conversion Successful!");
  document.getElementById("convertedFile").scrollIntoView({ behavior: "smooth" });
});

// ========== JSON → XML Conversion ==========
function jsonToXml(obj, nodeName = "root") {
  let xml = "";
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      xml += jsonToXml(item, nodeName);
    });
  } else if (typeof obj === "object" && obj !== null) {
    xml += `<${nodeName}>`;
    Object.keys(obj).forEach((key) => {
      xml += jsonToXml(obj[key], key);
    });
    xml += `</${nodeName}>`;
  } else {
    xml += `<${nodeName}>${escapeXml(String(obj))}</${nodeName}>`;
  }
  return xml;
}

// ========== Escape Special XML Characters ==========
function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ========== XML Formatter (Fixed) ==========
function formatXml(xml) {
  const PADDING = "  ";
  const reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, "$1\n$2$3");
  let formatted = "";
  let pad = 0;

  xml.split("\n").forEach((node) => {
    if (node.match(/^<\/\w/)) pad = Math.max(pad - 1, 0);
    formatted += PADDING.repeat(pad) + node + "\n";
    if (node.match(/^<\w[^>]*[^\/]>$/) && !node.startsWith("<?")) pad++;
  });

  return formatted.trim();
}

// ========== Copy Output ==========
copyOutputBtn.addEventListener("click", () => {
  outputArea.select();
  document.execCommand("copy");
  showToast("📋 Copied to clipboard!");
});

// ========== Export File ==========
exportBtn.addEventListener("click", () => {
  const blob = new Blob([outputArea.value], { type: "application/xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "converted.xml";
  link.click();
});

// ========== Toast ==========
function showToast(message) {
  toastJson.textContent = message;
  toastJson.classList.add("show");
  setTimeout(() => toastJson.classList.remove("show"), 2000);
}

updateJsonPreview();
