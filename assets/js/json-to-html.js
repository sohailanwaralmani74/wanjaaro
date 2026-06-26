// =============================
// JSON → HTML Converter Logic
// =============================

// Elements
const jsonInputEditor = document.getElementById("jsonInputEditor");
const jsonPreviewArea = $("#jsonPreviewArea");
const convertBtnJson = document.getElementById("convertBtnJson");
const outputArea = document.getElementById("outputArea");
const copyOutputBtn = document.getElementById("copyOutputBtn");
const exportOutputBtn = document.getElementById("exportOutputBtn");
const showHtmlBtn = document.getElementById("showHtmlBtn");
const toastJson = document.getElementById("toastJson");
const fileInputJson = document.getElementById("fileInputJson");

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

  // Reset previous data
  jsonInputEditor.value = "";
  outputArea.value = "";
  jsonPreviewArea.html('<div class="jsonx-placeholder">Preview will appear here after conversion...</div>');

  const reader = new FileReader();
  reader.onload = function (event) {
    jsonInputEditor.value = event.target.result;
    updateJsonPreview();
  };
  reader.readAsText(file);
});

// ========== Convert JSON → HTML ==========
convertBtnJson.addEventListener("click", () => {
  if (!parsedJson) return;

  const htmlOutput = jsonToHtml(parsedJson);

  outputArea.readOnly = false;
  outputArea.value = htmlOutput;
  outputArea.readOnly = true;

  showToast("✅ Conversion Successful!");
  document.getElementById("convertedFile").scrollIntoView({ behavior: "smooth" });
});

// ========== Copy Output ==========
copyOutputBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(outputArea.value);
  showToast("📋 Copied to Clipboard!");
});

// ========== Export as .html ==========
exportOutputBtn.addEventListener("click", () => {
  const blob = new Blob([outputArea.value], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "converted.html";
  a.click();
  URL.revokeObjectURL(a.href);
});

// ========== Show Rendered HTML in Popup ==========
showHtmlBtn.addEventListener("click", () => {
  const htmlContent = outputArea.value.trim();
  if (!htmlContent) {
    showToast("⚠️ Nothing to preview!");
    return;
  }

  const popup = window.open("", "_blank");
  popup.document.open();
  popup.document.write(htmlContent);
  popup.document.close();
});

// ========== Helper: Show Toast ==========
function showToast(message) {
  toastJson.textContent = message;
  toastJson.classList.add("show");
  setTimeout(() => toastJson.classList.remove("show"), 2000);
}

// ========== Core Converter: JSON → HTML ==========
function jsonToHtml(jsonInput) {
  let data;
  try {
    data = typeof jsonInput === "string" ? JSON.parse(jsonInput) : jsonInput;
  } catch {
    return "<p>Invalid JSON</p>";
  }

  const style = `
  <style>
    .record-box { border: 1px solid #ccc; border-radius: 6px; padding: 10px 14px; margin-bottom: 15px; background: #fafafa; }
    table { border-collapse: collapse; width: fit-content; margin-top: 6px; }
    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; vertical-align: top; font-size: 0.9rem; }
    th { background: #f4f4f4; font-weight: 600; }
    .nested-object, .nested-array { border: 1px solid #ddd; padding: 6px; margin-top: 4px; background: #fff; }
    .nested-array strong { display: block; margin-bottom: 4px; }
    h2 { font-size: 1.2rem; color: #333; border-bottom: 2px solid #eee; padding-bottom: 6px; }
  </style>`;

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Data HTML File</title>
    ${style}
  </head>
  <body>
    ${renderHtml(data)}
  </body>
  </html>`;

  return htmlContent.trim();
}

// ========== Recursive Renderer ==========
function renderHtml(obj) {
  if (Array.isArray(obj)) {
    if (obj.every(item => typeof item === "object" && !Array.isArray(item))) {
      // Array of objects → table
      const headers = [...new Set(obj.flatMap(item => Object.keys(item)))];
      const rows = obj.map(item => {
        return "<tr>" + headers.map(h => `<td>${renderValue(item[h])}</td>`).join("") + "</tr>";
      }).join("");

      return `
      <div class="record-box">
        <table>
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    } else {
      // Array of primitives or nested arrays
      return `<div class="nested-array"><table>${obj.map(v => `<tr><td>${renderValue(v)}</td></tr>`).join("")}</table></div>`;
    }
  } else if (typeof obj === "object" && obj !== null) {
    // Object → key-value table
    return `
    <div class="nested-object">
      <table>
        ${Object.entries(obj)
          .map(([key, value]) => `<tr><th>${key}</th><td>${renderValue(value)}</td></tr>`)
          .join("")}
      </table>
    </div>`;
  } else {
    // Primitive
    return escapeHtml(String(obj ?? ""));
  }
}

// ========== Render Nested Values ==========
function renderValue(value) {
  if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
    return renderHtml(value);
  }
  return escapeHtml(String(value ?? ""));
}

// ========== Escape HTML ==========
function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));
}

// Initialize empty preview
updateJsonPreview();
