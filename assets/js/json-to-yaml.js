// Elements
const jsonInputEditor = document.getElementById("jsonInputEditor");
const jsonPreviewArea = $("#jsonPreviewArea");
const convertBtnJson = document.getElementById("convertBtnJson");
const toastJson = document.getElementById("toastJson");
const fileInputJson = document.getElementById("fileInputJson");
const outputArea = document.getElementById("outputArea");
const copyOutputBtn = document.getElementById("copyOutputBtn");
const exportOutputBtn = document.getElementById("exportOutputBtn");

let parsedJson = null;
let currentYamlContent = null;

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
  generateYamlFromJson(parsedJson);
  showToast("✅ Conversion Successful!");
});

// ========== Generate YAML from JSON ==========
function generateYamlFromJson(jsonData) {
  try {
    // Use js-yaml library to convert JSON to YAML
    const yamlContent = jsyaml.dump(jsonData, {
      indent: 2,
      lineWidth: -1, // No line wrapping
      noRefs: true, // Prevent anchor references
      noCompatMode: true // Use YAML 1.2
    });

    // Update output area
    outputArea.value = yamlContent;
    currentYamlContent = yamlContent;
    
    // Scroll to output section
    document.getElementById("convertedFile").scrollIntoView({ behavior: "smooth" });
    
  } catch (error) {
    outputArea.value = `# Error generating YAML:\n# ${error.message}`;
    currentYamlContent = null;
    console.error("YAML Generation Error:", error);
  }
}

// ========== Copy YAML to Clipboard ==========
copyOutputBtn.addEventListener("click", () => {
  if (!currentYamlContent) {
    showToast("⚠️ No YAML content to copy!");
    return;
  }
  
  outputArea.select();
  document.execCommand("copy");
  showToast("✅ YAML copied to clipboard!");
});

// ========== Export YAML File ==========
exportOutputBtn.addEventListener("click", () => {
  if (!currentYamlContent) {
    showToast("⚠️ No YAML generated yet!");
    return;
  }
  
  const blob = new Blob([currentYamlContent], { type: "text/yaml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "converted_data.yaml";
  link.click();
  showToast("✅ YAML file downloaded!");
});

// ========== Toast ==========
function showToast(message) {
  toastJson.textContent = message;
  toastJson.classList.add("show");
  setTimeout(() => toastJson.classList.remove("show"), 2000);
}

// Initialize
updateJsonPreview();