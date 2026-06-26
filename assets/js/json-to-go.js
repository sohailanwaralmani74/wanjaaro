(function() {
  const inputEditor = ace.edit("input-editor");
  inputEditor.setTheme("ace/theme/tomorrow_night");
  inputEditor.session.setMode("ace/mode/json");
  inputEditor.setOptions({ fontSize: "13px", fontFamily: "Fira Code, monospace", wrap: true });

  const outputEditor = ace.edit("output-editor");
  outputEditor.setTheme("ace/theme/tomorrow_night");
  outputEditor.session.setMode("ace/mode/golang");
  outputEditor.setOptions({ fontSize: "13px", fontFamily: "Fira Code, monospace", wrap: true, readOnly: false });
  outputEditor.setValue("// Go structs will appear here after conversion");

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

  function toPascalCase(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '').replace(/^[a-z]/, (m) => m.toUpperCase());
  }

  function getStructName(keyHint) {
    let name = keyHint ? toPascalCase(keyHint) : "Root";
    if (name === "") name = "Item";
    if (/^[0-9]/.test(name)) name = "T" + name;
    return name;
  }

  function goType(value, isPointer) {
    if (value === null) {
      return isPointer ? "interface{}" : "interface{}";
    }
    switch (typeof value) {
      case "string": return "string";
      case "number": return Number.isInteger(value) ? "int" : "float64";
      case "boolean": return "bool";
      default: return "interface{}";
    }
  }

  function generateGoStruct(obj, structName, generatedStructs, options) {
    const { omitempty, stringTag, pointerNullable } = options;
    let structCode = "";
    structCode += `type ${structName} struct {\n`;

    const fields = [];
    const nestedStructs = [];

    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toPascalCase(key);
      let fieldType = "";
      let isSlice = false;
      let sliceItemType = "";
      let isPointer = false;

      if (value === null) {
        fieldType = pointerNullable ? "*interface{}" : "interface{}";
        isPointer = pointerNullable && value === null;
      } else if (Array.isArray(value)) {
        isSlice = true;
        if (value.length === 0) {
          sliceItemType = "interface{}";
        } else {
          const first = value[0];
          if (typeof first === "object" && first !== null) {
            const nestedName = getStructName(fieldName + "Item");
            if (!generatedStructs.has(nestedName)) {
              generatedStructs.add(nestedName);
              nestedStructs.push({ obj: first, name: nestedName });
            }
            sliceItemType = nestedName;
          } else {
            sliceItemType = goType(first, pointerNullable);
            if (pointerNullable && sliceItemType !== "string" && sliceItemType !== "bool" && !sliceItemType.startsWith("*")) {
              // For numbers, we might want pointer? But slices of pointers are unusual, keep simple.
            }
          }
        }
        fieldType = "[]" + sliceItemType;
      } else if (typeof value === "object" && value !== null) {
        const nestedName = getStructName(fieldName);
        if (!generatedStructs.has(nestedName)) {
          generatedStructs.add(nestedName);
          nestedStructs.push({ obj: value, name: nestedName });
        }
        fieldType = nestedName;
        if (pointerNullable) {
          fieldType = "*" + fieldType;
          isPointer = true;
        }
      } else {
        let baseType = goType(value, pointerNullable);
        if (pointerNullable && (value === null || baseType !== "string" && baseType !== "bool")) {
          fieldType = "*" + baseType;
          isPointer = true;
        } else {
          fieldType = baseType;
        }
      }

      // Build json tag
      let tag = key;
      if (omitempty) tag += ",omitempty";
      if (stringTag && (typeof value === "number" || (Array.isArray(value) && value.length && typeof value[0] === "number"))) {
        tag += ",string";
      }
      const jsonTag = `json:"${tag}"`;

      fields.push(`\t${fieldName} ${fieldType} \`${jsonTag}\``);
    }

    structCode += fields.join("\n");
    structCode += "\n}\n";

    // Recursively generate nested structs
    let nestedCode = "";
    for (const nested of nestedStructs) {
      nestedCode += generateGoStruct(nested.obj, nested.name, generatedStructs, options) + "\n";
    }
    return nestedCode + structCode;
  }

  function convertToGo() {
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
        omitempty: document.getElementById('omitempty-checkbox').checked,
        stringTag: document.getElementById('string-tag-checkbox').checked,
        pointerNullable: document.getElementById('pointer-nullable-checkbox').checked,
      };
      const packageName = document.getElementById('package-name').value.trim() || "main";

      const generatedStructs = new Set();
      const rootName = getStructName("Root");
      generatedStructs.add(rootName);
      let goCode = generateGoStruct(obj, rootName, generatedStructs, options);

      const finalCode = `package ${packageName}\n\n` + goCode;
      outputEditor.setValue(finalCode, -1);
      showToast("Go structs generated successfully", false);
    } catch (err) {
      showToast(err.message, true);
    }
  }

  async function exportAsZip() {
    const goCode = outputEditor.getValue();
    if (!goCode.trim() || goCode.includes("// Go structs will appear here after conversion")) {
      showToast("No Go code to export. Convert JSON first.", true);
      return;
    }
    const structBlocks = goCode.split(/(?=^type\s+\w+\s+struct\s+{)/gm);
    const zip = new JSZip();
    const modelsFolder = zip.folder("models");
    let fileCount = 0;
    for (let block of structBlocks) {
      if (!block.trim()) continue;
      const match = block.match(/type\s+(\w+)\s+struct/);
      if (match) {
        const structName = match[1];
        modelsFolder.file(`${structName}.go`, block.trim());
        fileCount++;
      }
    }
    if (fileCount === 0) modelsFolder.file("models.go", goCode);
    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "models.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${fileCount || 1} Go file(s) to models.zip`, false);
  }

  function copyOutput() {
    const code = outputEditor.getValue();
    if (!code.trim() || code.includes("// Go structs will appear here after conversion")) {
      showToast("Nothing to copy", true);
      return;
    }
    navigator.clipboard.writeText(code).then(() => showToast("Go code copied", false))
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

  document.getElementById('convert-btn').addEventListener('click', convertToGo);
  document.getElementById('clear-all').addEventListener('click', clearBothPanes);
  document.getElementById('copy-output').addEventListener('click', copyOutput);
  document.getElementById('export-zip-btn').addEventListener('click', exportAsZip);
  const fileInput = document.getElementById('upload-json');
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
    e.target.value = '';
  });

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