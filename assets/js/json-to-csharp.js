(function() {
  // ---------- Ace Editors ----------
  const inputEditor = ace.edit("input-editor");
  inputEditor.setTheme("ace/theme/tomorrow_night");
  inputEditor.session.setMode("ace/mode/json");
  inputEditor.setOptions({ fontSize: "13px", fontFamily: "Fira Code, monospace", wrap: true });

  const outputEditor = ace.edit("output-editor");
  outputEditor.setTheme("ace/theme/tomorrow_night");
  outputEditor.session.setMode("ace/mode/csharp");
  outputEditor.setOptions({ fontSize: "13px", fontFamily: "Fira Code, monospace", wrap: true, readOnly: false });
  outputEditor.setValue("// C# code will appear here after conversion");

  // ---------- Toast ----------
  function showToast(msg, isError = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    toast.style.borderLeftColor = isError ? '#f97316' : '#2dd4bf';
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // ---------- JSON helpers ----------
  function prettifyJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      throw new Error("Invalid JSON: " + e.message);
    }
  }

  inputEditor.on('blur', () => {
    const raw = inputEditor.getValue();
    if (!raw.trim()) return;
    try {
      const pretty = prettifyJSON(raw);
      if (pretty !== raw) {
        const cursor = inputEditor.getCursorPosition();
        inputEditor.setValue(pretty, -1);
        inputEditor.moveCursorToPosition(cursor);
      }
    } catch (err) { /* silent */ }
  });

  // ---------- C# Type Mapping ----------
  function mapCSharpType(value) {
    if (value === null) return "object";
    if (typeof value === "string") return "string";
    if (typeof value === "number") return Number.isInteger(value) ? "int" : "double";
    if (typeof value === "boolean") return "bool";
    if (Array.isArray(value)) return "List";
    if (typeof value === "object") return null;
    return "object";
  }

  function toPascalCase(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '').replace(/^[a-z]/, (m) => m.toUpperCase());
  }

  function getUniqueClassName(keyHint) {
    let name = keyHint ? toPascalCase(keyHint) : "Root";
    if (name === "") name = "Item";
    if (/^[0-9]/.test(name)) name = "C" + name;
    return name;
  }

  // Generate C# class/record code
  function generateCSharpClass(obj, className, generatedClasses, options) {
    const { useSystemTextJson, useNewtonsoft, useRecord, useNullable } = options;
    const typeKeyword = useRecord ? "record" : "class";
    let classCode = "";
    classCode += `public ${typeKeyword} ${className}\n`;
    classCode += "{\n";

    const fields = [];
    const nestedClasses = [];

    for (const [key, value] of Object.entries(obj)) {
      let propertyType = "";
      let additionalAnnotation = "";
      const propertyName = toPascalCase(key);
      let isList = false;
      let listType = null;

      if (Array.isArray(value)) {
        isList = true;
        if (value.length === 0) {
          propertyType = "List<object>";
        } else {
          const firstItem = value[0];
          if (typeof firstItem === "object" && firstItem !== null) {
            const nestedName = getUniqueClassName(propertyName + "Item");
            if (!generatedClasses.has(nestedName)) {
              generatedClasses.add(nestedName);
              nestedClasses.push({ obj: firstItem, name: nestedName });
            }
            listType = nestedName;
          } else {
            listType = mapCSharpType(firstItem);
          }
          propertyType = `List<${listType}>`;
        }
      } else if (typeof value === "object" && value !== null) {
        const nestedName = getUniqueClassName(propertyName);
        if (!generatedClasses.has(nestedName)) {
          generatedClasses.add(nestedName);
          nestedClasses.push({ obj: value, name: nestedName });
        }
        propertyType = nestedName;
      } else {
        propertyType = mapCSharpType(value);
      }

      // Apply nullable reference types
      if (useNullable && propertyType === "string") {
        propertyType += "?";
      }

      // Json annotations
      if (useSystemTextJson) {
        additionalAnnotation += `    [JsonPropertyName("${key}")]\n`;
      }
      if (useNewtonsoft) {
        additionalAnnotation += `    [JsonProperty("${key}")]\n`;
      }

      // Auto-property
      fields.push(`${additionalAnnotation}    public ${propertyType} ${propertyName} { get; set; }\n`);
    }

    fields.forEach(f => classCode += f);
    classCode += "}\n";

    // Recursively generate nested classes
    let nestedCode = "";
    for (const nested of nestedClasses) {
      nestedCode += generateCSharpClass(nested.obj, nested.name, generatedClasses, options) + "\n";
    }
    return nestedCode + classCode;
  }

  // Main conversion
  function convertToCSharp() {
    const rawJson = inputEditor.getValue();
    if (!rawJson.trim()) {
      showToast("Please enter JSON data", true);
      return;
    }
    try {
      const prettified = prettifyJSON(rawJson);
      if (prettified !== rawJson) inputEditor.setValue(prettified, -1);
      const obj = JSON.parse(prettified);

      const options = {
        useSystemTextJson: document.getElementById('use-system-text-json').checked,
        useNewtonsoft: document.getElementById('use-newtonsoft').checked,
        useRecord: document.getElementById('use-record').checked,
        useNullable: document.getElementById('use-nullable').checked,
      };

      const generatedClasses = new Set();
      const rootName = getUniqueClassName("Root");
      generatedClasses.add(rootName);
      let csharpCode = generateCSharpClass(obj, rootName, generatedClasses, options);

      // Add using directives
      const usings = new Set();
      if (options.useSystemTextJson) usings.add("using System.Text.Json.Serialization;");
      if (options.useNewtonsoft) usings.add("using Newtonsoft.Json;");
      if (csharpCode.includes("List<")) usings.add("using System.Collections.Generic;");

      let usingBlock = "";
      if (usings.size > 0) {
        usingBlock = Array.from(usings).sort().join("\n") + "\n\n";
      }

      const finalCode = usingBlock + csharpCode;
      outputEditor.setValue(finalCode, -1);
      showToast("C# classes generated successfully", false);
    } catch (err) {
      showToast(err.message, true);
    }
  }

  // ZIP Export
  async function exportAsZip() {
    const csharpCode = outputEditor.getValue();
    if (!csharpCode.trim() || csharpCode.includes("// C# code will appear here after conversion")) {
      showToast("No C# code to export. Convert JSON first.", true);
      return;
    }
    const classBlocks = csharpCode.split(/(?=^public\s+(class|record)\s+)/gm);
    const zip = new JSZip();
    const modelFolder = zip.folder("model");
    let fileCount = 0;
    for (let block of classBlocks) {
      if (!block.trim()) continue;
      const match = block.match(/public\s+(class|record)\s+(\w+)/);
      if (match) {
        const className = match[2];
        modelFolder.file(`${className}.cs`, block.trim());
        fileCount++;
      }
    }
    if (fileCount === 0) modelFolder.file("Root.cs", csharpCode);
    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "model.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${fileCount || 1} C# file(s) to model.zip`, false);
  }

  function copyOutput() {
    const code = outputEditor.getValue();
    if (!code.trim() || code.includes("// C# code will appear here after conversion")) {
      showToast("Nothing to copy", true);
      return;
    }
    navigator.clipboard.writeText(code).then(() => showToast("C# code copied", false))
      .catch(() => showToast("Copy failed", true));
  }

  function clearBothPanes() {
    inputEditor.setValue("", -1);
    outputEditor.setValue("", -1);
    showToast("Both panes cleared", false);
  }

  function handleFileUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const pretty = prettifyJSON(e.target.result);
        inputEditor.setValue(pretty, -1);
        showToast(`Loaded ${file.name}`, false);
      } catch (err) {
        showToast(err.message, true);
      }
    };
    reader.onerror = () => showToast("File read error", true);
    reader.readAsText(file, "UTF-8");
  }

  // Event listeners
  document.getElementById('convert-btn').addEventListener('click', convertToCSharp);
  document.getElementById('clear-all').addEventListener('click', clearBothPanes);
  document.getElementById('copy-output').addEventListener('click', copyOutput);
  document.getElementById('export-zip-btn').addEventListener('click', exportAsZip);
  const fileInput = document.getElementById('upload-json');
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
    e.target.value = '';
  });

  // Initial sample
  const sample = {
    "id": 101,
    "name": "DataFrog",
    "active": true,
    "tags": ["converter", "generator"],
    "metadata": {
      "version": "2.0",
      "author": "DevTeam"
    }
  };
  inputEditor.setValue(JSON.stringify(sample, null, 2), -1);
})();