const { jsPDF } = window.jspdf;

// Elements
const jsonInputEditor = document.getElementById("jsonInputEditor");
const jsonPreviewArea = $("#jsonPreviewArea");
const convertBtnJson = document.getElementById("convertBtnJson");
const toastJson = document.getElementById("toastJson");
const fileInputJson = document.getElementById("fileInputJson");
const pdfPreview = document.getElementById("pdfPreview");
const exportBtn = document.getElementById("exportOutputBtn");

let parsedJson = null;
let currentPdfBlob = null;

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

  jsonInputEditor.value = "";
  jsonPreviewArea.html('<div class="jsonx-placeholder">Preview will appear here after conversion...</div>');

  const reader = new FileReader();
  reader.onload = function (event) {
    jsonInputEditor.value = event.target.result;
    updateJsonPreview();
  };
  reader.readAsText(file);
});

// ========== Convert Button ==========
convertBtnJson.addEventListener("click", () => {
  if (!parsedJson) return;
  generatePdfFromJson(parsedJson);
  showToast("✅ Conversion Successful!");
});

// ========== Generate PDF from JSON ==========
function generatePdfFromJson(jsonData) {
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  let startY = 20;

  function renderParent(obj, level = 0) {
    const indent = 20 + level * 10;
    const parentFontSize = 10;
    const nestedFontSize = 8;

    // Handle arrays first
    if (Array.isArray(obj)) {
      // Check if this is an array of plain objects (no nested structures)
      const isPlainObjectArray = obj.length > 0 && 
        obj.every(item => {
          if (item === null || typeof item !== "object" || Array.isArray(item)) {
            return false;
          }
          // Check if object has any nested objects/arrays
          return !Object.values(item).some(val => 
            Array.isArray(val) || (typeof val === "object" && val !== null)
          );
        });

      if (isPlainObjectArray) {
        // Render as single table
        const headers = [...new Set(obj.flatMap(item => Object.keys(item)))];
        const body = obj.map(item => headers.map(h => String(item[h] ?? "")));

        doc.autoTable({
          startY,
          head: [headers],
          body,
          theme: "grid",
          styles: { fontSize: parentFontSize, cellPadding: 3 },
          margin: { left: indent, right: 20 }
        });

        startY = doc.lastAutoTable.finalY + 10;
        return;
      } else {
        // Array has nested structures, process each item
        obj.forEach((item, index) => {
          if (typeof item === "object" && item !== null && !Array.isArray(item)) {
            // Check if this individual item has nested structures
            const hasNested = Object.values(item).some(val => 
              Array.isArray(val) || (typeof val === "object" && val !== null)
            );
            
            if (hasNested) {
              doc.setFontSize(nestedFontSize);
              startY += 5;
              doc.text(`Item ${index + 1}:`, indent + 10, startY);
              startY += 5;
            }
          }
          renderParent(item, level + 1);
        });
        return;
      }
    }

    // If we get here, we're processing a single object (not array)
    
    // Separate scalar fields from nested fields
    const scalarKeys = Object.keys(obj).filter(
      k => !(Array.isArray(obj[k]) || (typeof obj[k] === "object" && obj[k] !== null))
    );

    const nestedKeys = Object.keys(obj).filter(
      k => Array.isArray(obj[k]) || (typeof obj[k] === "object" && obj[k] !== null)
    );

    // Render scalar fields as table if they exist
    if (scalarKeys.length > 0) {
      const row = scalarKeys.map(k => String(obj[k] ?? ""));
      doc.autoTable({
        startY,
        head: [scalarKeys],
        body: [row],
        theme: "grid",
        styles: { fontSize: parentFontSize, cellPadding: 3 },
        margin: { left: indent, right: 20 }
      });
      startY = doc.lastAutoTable.finalY + 10;
    }

    // Render nested objects/arrays
    nestedKeys.forEach(k => {
      const val = obj[k];

      doc.setFontSize(nestedFontSize);
      startY += 5;
      doc.text(`${k}:`, indent + 10, startY);
      startY += 5;
      renderParent(val, level + 1);
    });

    // Underline after parent + nested content only at level 0
    if (level === 0) {
      doc.setLineWidth(0.3);
      doc.line(20, startY + 2, doc.internal.pageSize.getWidth() - 20, startY + 2);
      startY += 8;
    }
  }

  // FIXED: Always call renderParent with the complete jsonData
  // Let the renderParent function handle arrays properly
  if (jsonData !== null && (typeof jsonData === "object" || Array.isArray(jsonData))) {
    renderParent(jsonData, 0);
  }

  // Store blob and show in iframe
  const blob = doc.output("blob");
  currentPdfBlob = blob;
  const pdfUrl = URL.createObjectURL(blob);
  pdfPreview.innerHTML = `<iframe src="${pdfUrl}" style="width:100%;height:25rem;border:1px solid #ccc;"></iframe>`;

  document.getElementById("convertedFile").scrollIntoView({ behavior: "smooth" });
}

// ========== Download PDF ==========
exportBtn.addEventListener("click", () => {
  if (!currentPdfBlob) {
    alert("⚠️ No PDF generated yet!");
    return;
  }
  const link = document.createElement("a");
  link.href = URL.createObjectURL(currentPdfBlob);
  link.download = "converted.json.pdf";
  link.click();
});

// ========== Toast ==========
function showToast(message) {
  toastJson.textContent = message;
  toastJson.classList.add("show");
  setTimeout(() => toastJson.classList.remove("show"), 2000);
}

updateJsonPreview();