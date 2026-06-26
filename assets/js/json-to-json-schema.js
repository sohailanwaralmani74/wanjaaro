// ===============================
// JSON → JSON Schema Converter
// ===============================
$(document).ready(function () {
  const fileInput = $("#fileInputJson");
  const jsonEditor = $("#json-editor");
  const jsonViewer = $("#json-tree-viewer");
  const popup = $("#copied-popup");

  // --------------------------------------
  // 📂 Handle JSON File Upload
  // --------------------------------------
  fileInput.on("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      jsonEditor.val(event.target.result);
      jsonEditor.trigger("input"); // auto-generate schema
    };
    reader.readAsText(file);
  });

  // --------------------------------------
  // 🔄 Convert JSON → JSON Schema (auto on input)
  // --------------------------------------
  jsonEditor.on("input", function () {
    const jsonText = $(this).val().trim();

    if (!jsonText) {
      jsonViewer.html(`<div style="color:#aaa;">Paste your JSON to generate schema...</div>`);
      return;
    }

    try {
      const json = JSON.parse(jsonText);
      const schema = generateSchema(json);

      // Add Draft-07 metadata
      const draftSchema = {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "Generated JSON Schema",
        type: Array.isArray(json) ? "array" : typeof json === "object" ? "object" : typeof json,
        ...schema
      };

      const formatted = JSON.stringify(draftSchema, null, 2);
      jsonViewer.JSONView(JSON.parse(formatted), { collapsed: false });
      jsonViewer.data("schema", formatted); // store formatted schema for copy/download
    } catch (err) {
      jsonViewer.html(`<div style="color:#f88;">❌ Invalid JSON format</div>`);
    }
  });

  // --------------------------------------
  // 🧩 Schema Generation Logic
  // --------------------------------------
  function generateSchema(obj) {
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return { type: "array", items: {} };
      }
      return {
        type: "array",
        items: generateSchema(obj[0])
      };
    }

    if (typeof obj === "object" && obj !== null) {
      const properties = {};
      const required = [];

      for (const key in obj) {
        properties[key] = generateSchema(obj[key]);
        required.push(key);
      }

      return {
        type: "object",
        properties,
        required
      };
    }

    // Primitive types
    const type = typeof obj;
    switch (type) {
      case "string":
      case "number":
      case "boolean":
        return { type };
      default:
        return { type: "null" };
    }
  }

  // --------------------------------------
  // 📋 Copy Formatted Schema to Clipboard
  // --------------------------------------
  window.copyJson = function () {
    const schemaView = jsonViewer.data("schema");
    if (!schemaView) return;

    navigator.clipboard.writeText(schemaView).then(() => {
      popup.css("opacity", "1");
      setTimeout(() => popup.css("opacity", "0"), 1000);
    });
  };

  // --------------------------------------
  // 💾 Download Formatted Schema
  // --------------------------------------
  window.downloadJson = function () {
    const schemaView = jsonViewer.data("schema");
    if (!schemaView) return;

    const blob = new Blob([schemaView], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "json-schema.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --------------------------------------
  // 🎯 Initial placeholder
  // --------------------------------------
  jsonViewer.html(`<div style="color:#aaa;">Paste your JSON to generate schema...</div>`);
});
