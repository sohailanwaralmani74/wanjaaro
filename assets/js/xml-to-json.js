/**********************************************************************
 * XML to JSON Converter Script
 * Developers: Sohail Anwar, Saeed Ahmed
 * Description:
 * This script handles XML → JSON conversion for the browser-based
 * converter tool. It supports file upload, pasted XML, validation,
 * formatted JSON output, copy/export functionality, and toast messages.
 **********************************************************************/

/* ========================== Element References ========================== */
const xmlInputEditor = document.getElementById("xmlInputEditor");   // Top XML editor textarea
const convertBtnXml = document.getElementById("convertBtnXml");     // Convert button
const toastXml = document.getElementById("toastXml");               // Toast notification div
const fileInputXml = document.getElementById("fileInputXml");       // File upload input
const outputAreaJson = document.getElementById("outputAreaJson");   // Bottom JSON output textarea
const copyOutputBtnJson = document.getElementById("copyOutputBtnJson"); // Copy button
const exportOutputBtnJson = document.getElementById("exportOutputBtnJson"); // Export button

/* ========================== Utility Function: Show Toast ========================== */
/**
 * Display a toast message for 2 seconds.
 * @param {string} message - Message text to display in the toast.
 * Developers: Sohail Anwar, Saeed Ahmed
 */
function showToast(message) {
  toastXml.textContent = message;
  toastXml.classList.add("show");
  setTimeout(() => toastXml.classList.remove("show"), 2000);
}

/* ========================== Utility Function: Enable/Disable Convert Button ========================== */
/**
 * Enable the convert button if the XML editor has content,
 * otherwise disable it.
 * Developers: Sohail Anwar, Saeed Ahmed
 */
function updateConvertButton() {
  convertBtnXml.disabled = !xmlInputEditor.value.trim();
}

/* ========================== Event Listener: Editor Input ========================== */
/**
 * Triggered when the user types in the XML editor.
 * Updates the convert button state dynamically.
 * Developers: Sohail Anwar, Saeed Ahmed
 */
xmlInputEditor.addEventListener("input", updateConvertButton);

/* ========================== Event Listener: File Upload ========================== */
/**
 * Handles file upload and populates the XML editor.
 * After reading, updates the convert button state.
 * Developers: Sohail Anwar, Saeed Ahmed
 */
fileInputXml.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    xmlInputEditor.value = event.target.result;
    updateConvertButton(); // Enable convert button if content exists
  };
  reader.readAsText(file);
});

/* ========================== Function: Convert XML String to JSON Object ========================== */
/**
 * Converts a well-formed XML string into a nested JSON object.
 * Handles arrays when multiple sibling nodes have the same tag.
 * Returns null if XML is malformed.
 * @param {string} xml - XML string to convert
 * @returns {object|null} - JSON object or null if invalid XML
 * Developers: Sohail Anwar, Saeed Ahmed
 */
function xmlToJson(xml) {
  const obj = {};
  try {
    if (!xml) return null;

    // Parse XML string into DOM
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");

    // Check for parse errors
    if (xmlDoc.getElementsByTagName("parsererror").length) {
      return null;
    }

    /**
     * Recursive function to traverse XML nodes and convert to JSON.
     * @param {Node} node - Current XML node
     * @returns {object|string|null} - JSON representation
     */
    function traverse(node) {
      let result = {};
      const children = Array.from(node.children);

      if (children.length > 0) {
        // Iterate child nodes
        children.forEach((child) => {
          const key = child.nodeName;
          const value = traverse(child);

          // If multiple nodes have same key → convert to array
          if (result[key]) {
            if (!Array.isArray(result[key])) {
              result[key] = [result[key]];
            }
            result[key].push(value);
          } else {
            result[key] = value;
          }
        });
      } else {
        // Leaf node → text content
        const text = node.textContent.trim();
        if (text === "") return null;
        result = text;
      }
      return result;
    }

    const rootNode = xmlDoc.documentElement;
    obj[rootNode.nodeName] = traverse(rootNode);
    return obj;
  } catch (e) {
    return null;
  }
}

/* ========================== Event Listener: Convert Button Click ========================== */
/**
 * Triggered when the user clicks "Convert to JSON".
 * Converts the XML in the editor to formatted JSON.
 * Scrolls to the convertedFile div on success.
 * Shows error toast if XML is invalid.
 * Developers: Sohail Anwar, Saeed Ahmed
 */
convertBtnXml.addEventListener("click", () => {
  const xmlText = xmlInputEditor.value.trim();
  if (!xmlText) return;

  const jsonResult = xmlToJson(xmlText);

  if (!jsonResult) {
    showToast("❌ Invalid XML or invalid keys!");
    outputAreaJson.value = "";
    return;
  }

  outputAreaJson.value = JSON.stringify(jsonResult, null, 2);
  showToast("✅ Conversion Successful!");
  document.getElementById("convertedFile").scrollIntoView({ behavior: "smooth" });
});

/* ========================== Event Listener: Copy Output ========================== */
/**
 * Copies the contents of the JSON output textarea to the clipboard.
 * Developers: Sohail Anwar, Saeed Ahmed
 */
copyOutputBtnJson.addEventListener("click", () => {
  outputAreaJson.select();
  document.execCommand("copy");
  showToast("📋 Copied to clipboard!");
});

/* ========================== Event Listener: Export Output ========================== */
/**
 * Exports the JSON output as a downloadable .json file.
 * Developers: Sohail Anwar, Saeed Ahmed
 */
exportOutputBtnJson.addEventListener("click", () => {
  const blob = new Blob([outputAreaJson.value], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "converted.json";
  link.click();
});
