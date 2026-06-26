(function() {
    // ========== ACE EDITORS ==========
    const inputEditor = ace.edit("input-editor");
    inputEditor.setTheme("ace/theme/tomorrow_night");
    inputEditor.session.setMode("ace/mode/json");
    inputEditor.setOptions({ fontSize: "13px", fontFamily: "Fira Code, monospace", wrap: true });

    const outputEditor = ace.edit("output-editor");
    outputEditor.setTheme("ace/theme/tomorrow_night");
    outputEditor.session.setMode("ace/mode/typescript");
    outputEditor.setOptions({ fontSize: "13px", fontFamily: "Fira Code, monospace", wrap: true, readOnly: false });
    outputEditor.setValue("// TypeScript code will appear here after conversion");

    // ========== Helper: Toast ==========
    function showToast(msg, isError = false) {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
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

    // ========== Auto‑prettify JSON ==========
    function prettifyJSON(jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        throw new Error("Invalid JSON: " + e.message);
      }
    }

    // Auto‑prettify when user pastes into input editor
    inputEditor.session.on('change', (delta) => {
      // Only auto‑prettify if the change is likely a paste or large insertion? 
      // To avoid cursor jumps, we'll defer and only prettify on blur or explicit action.
      // Instead we prettify on upload, on convert, and on demand via sample (if any). 
      // But per instruction: "json pasted or uploaded will be auto prettified" – we'll prettify on blur.
    });
    // Prettify on blur (when user clicks outside editor)
    inputEditor.on('blur', () => {
      const raw = inputEditor.getValue();
      if (!raw.trim()) return;
      try {
        const pretty = prettifyJSON(raw);
        if (pretty !== raw) {
          const cursor = inputEditor.getCursorPosition();
          inputEditor.setValue(pretty, -1);
          inputEditor.moveCursorToPosition(cursor);
          showToast("JSON prettified automatically", false);
        }
      } catch (err) {
        // silent fail, don't show error every time
      }
    });

    // ========== TypeScript Generator (no duplicate types) ==========
    function toPascalCase(str) {
      return str.replace(/[^a-zA-Z0-9]/g, '').replace(/^[a-z]/, (m) => m.toUpperCase());
    }

    function getTypeNameFromValue(value, keyHint) {
      let base = keyHint ? toPascalCase(keyHint) : 'Root';
      if (base === "") base = "Item";
      if (base === "Object" || base === "Array" || base === "String" || base === "Number" || base === "Boolean") base = "Data" + base;
      return base;
    }

    function generateTypeScript(obj, typeName, useInterface, generatedSet) {
      const output = [];
      const properties = [];

      for (const [key, value] of Object.entries(obj)) {
        let tsType = "";
        const propName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

        if (value === null) {
          tsType = "any";
        } else if (typeof value === "string") {
          tsType = "string";
        } else if (typeof value === "number") {
          tsType = "number";
        } else if (typeof value === "boolean") {
          tsType = "boolean";
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            tsType = "any[]";
          } else {
            const firstItem = value[0];
            if (typeof firstItem === "object" && firstItem !== null) {
              const arrayTypeName = getTypeNameFromValue(firstItem, key + "Item");
              if (!generatedSet.has(arrayTypeName)) {
                generatedSet.add(arrayTypeName);
                const nested = generateTypeScript(firstItem, arrayTypeName, useInterface, generatedSet);
                output.push(...nested.split('\n').filter(l => l.trim()));
              }
              tsType = `${arrayTypeName}[]`;
            } else {
              tsType = `${typeof firstItem}[]`;
            }
          }
        } else if (typeof value === "object") {
          const nestedTypeName = getTypeNameFromValue(value, key);
          if (!generatedSet.has(nestedTypeName)) {
            generatedSet.add(nestedTypeName);
            const nested = generateTypeScript(value, nestedTypeName, useInterface, generatedSet);
            output.push(...nested.split('\n').filter(l => l.trim()));
          }
          tsType = nestedTypeName;
        } else {
          tsType = "any";
        }
        properties.push(`  ${propName}: ${tsType};`);
      }

      let typeBlock = "";
      if (useInterface) {
        typeBlock = `export interface ${typeName} {\n${properties.join('\n')}\n}`;
      } else {
        typeBlock = `export class ${typeName} {\n${properties.map(p => `  ${p}`).join('\n')}\n}`;
      }
      output.unshift(typeBlock);
      return output.join('\n');
    }

    function convertJSONToTypeScript(jsonString, useInterface) {
      const obj = JSON.parse(jsonString);
      const rootTypeName = "Root";
      const generatedSet = new Set([rootTypeName]);
      let tsCode = generateTypeScript(obj, rootTypeName, useInterface, generatedSet);
      return tsCode;
    }

    // ========== Main Conversion ==========
    function convertToTypeScript() {
      const rawJson = inputEditor.getValue();
      if (!rawJson.trim()) {
        showToast("Please enter JSON data", true);
        return;
      }
      try {
        // Prettify input (ensures valid JSON)
        const prettified = prettifyJSON(rawJson);
        if (prettified !== rawJson) {
          inputEditor.setValue(prettified, -1);
        }
        const useInterface = document.getElementById('use-interface-checkbox').checked;
        const tsCode = convertJSONToTypeScript(prettified, useInterface);
        outputEditor.setValue(tsCode, -1);
        showToast("TypeScript generated successfully", false);
      } catch (err) {
        showToast(err.message, true);
      }
    }

    // ========== ZIP Export (model folder) ==========
    async function exportAsZip() {
      const tsCode = outputEditor.getValue();
      if (!tsCode.trim() || tsCode.includes("// TypeScript code will appear here after conversion")) {
        showToast("No TypeScript code to export. Convert JSON first.", true);
        return;
      }
      const lines = tsCode.split('\n');
      let currentType = null;
      let currentContent = [];
      const files = new Map();

      for (let line of lines) {
        if (line.trim().startsWith("export interface ") || line.trim().startsWith("export class ")) {
          if (currentType && currentContent.length) {
            files.set(`${currentType}.ts`, currentContent.join('\n'));
          }
          const match = line.match(/export (interface|class) (\w+)/);
          if (match) {
            currentType = match[2];
            currentContent = [line];
          } else {
            currentContent.push(line);
          }
        } else {
          if (currentType) currentContent.push(line);
        }
      }
      if (currentType && currentContent.length) {
        files.set(`${currentType}.ts`, currentContent.join('\n'));
      }
      if (files.size === 0) {
        files.set("Root.ts", tsCode);
      }

      const zip = new JSZip();
      const modelFolder = zip.folder("model");
      for (const [filename, content] of files.entries()) {
        modelFolder.file(filename, content);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "model.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Exported ${files.size} type(s) to model.zip`, false);
    }

    // ========== Copy Output ==========
    function copyOutput() {
      const code = outputEditor.getValue();
      if (!code.trim() || code.includes("// TypeScript code will appear here after conversion")) {
        showToast("Nothing to copy", true);
        return;
      }
      navigator.clipboard.writeText(code).then(() => {
        showToast("TypeScript code copied", false);
      }).catch(() => showToast("Copy failed", true));
    }

    // ========== Clear Input ==========
    function clearInput() {
      inputEditor.setValue("", -1);
      showToast("Input cleared", false);
    }

    // ========== Upload JSON File ==========
    function handleFileUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        try {
          const prettified = prettifyJSON(content);
          inputEditor.setValue(prettified, -1);
          showToast(`Loaded ${file.name} (prettified)`, false);
        } catch (err) {
          showToast(err.message, true);
        }
      };
      reader.onerror = () => showToast("File read error", true);
      reader.readAsText(file, "UTF-8");
    }

    // ========== Event Listeners ==========
    document.getElementById('convert-btn').addEventListener('click', convertToTypeScript);
    document.getElementById('clear-input').addEventListener('click', clearInput);
    document.getElementById('copy-output').addEventListener('click', copyOutput);
    document.getElementById('export-zip-btn').addEventListener('click', exportAsZip);
    const fileInput = document.getElementById('upload-json');
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileUpload(e.target.files[0]);
      }
      e.target.value = '';
    });

    // Initial sample: load a default prettified JSON
    const defaultSample = {
      "company": "DataFrog",
      "founded": 2024,
      "isActive": true,
      "tags": ["converter", "cleaner", "generator"],
      "address": {
        "street": "123 Dev Lane",
        "city": "Tech Valley",
        "coordinates": { "lat": 37.7749, "lng": -122.4194 }
      }
    };
    inputEditor.setValue(JSON.stringify(defaultSample, null, 2), -1);
  })();