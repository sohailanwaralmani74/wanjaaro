  (function() {
    // ---------- Ace Editors (same as before, no changes) ----------
    const inputEditor = ace.edit("input-editor");
    inputEditor.setTheme("ace/theme/tomorrow_night");
    inputEditor.session.setMode("ace/mode/json");
    inputEditor.setOptions({ fontSize: "13px", fontFamily: "Fira Code, monospace", wrap: true });

    const outputEditor = ace.edit("output-editor");
    outputEditor.setTheme("ace/theme/tomorrow_night");
    outputEditor.session.setMode("ace/mode/java");
    outputEditor.setOptions({ fontSize: "13px", fontFamily: "Fira Code, monospace", wrap: true, readOnly: false });
    outputEditor.setValue("// Java code will appear here after conversion");

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

    function mapJsonType(value) {
      if (value === null) return "Object";
      if (typeof value === "string") return "String";
      if (typeof value === "number") return Number.isInteger(value) ? "Integer" : "Double";
      if (typeof value === "boolean") return "Boolean";
      if (Array.isArray(value)) return "List";
      if (typeof value === "object") return null;
      return "Object";
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

    function generateJavaClass(obj, className, generatedClasses, options) {
      const { useLombok, useBuilder, useJackson, useValidation } = options;
      let classCode = "";
      if (useJackson) classCode += `@JsonIgnoreProperties(ignoreUnknown = true)\n`;
      if (useLombok && useBuilder) classCode += `@Builder\n`;
      if (useLombok) {
        classCode += `@Data\n`;
        if (!useBuilder) classCode += `@NoArgsConstructor\n@AllArgsConstructor\n`;
      }
      classCode += `public class ${className} {\n\n`;

      const fields = [];
      const nestedClasses = [];

      for (const [key, value] of Object.entries(obj)) {
        let fieldType = "";
        let additionalAnnotation = "";
        const fieldName = key;

        if (Array.isArray(value)) {
          if (value.length === 0) {
            fieldType = "List<Object>";
          } else {
            const firstItem = value[0];
            if (typeof firstItem === "object" && firstItem !== null) {
              const nestedName = getUniqueClassName(fieldName + "Item");
              if (!generatedClasses.has(nestedName)) {
                generatedClasses.add(nestedName);
                nestedClasses.push({ obj: firstItem, name: nestedName });
              }
              fieldType = `List<${nestedName}>`;
            } else {
              fieldType = `List<${mapJsonType(firstItem)}>`;
            }
          }
        } else if (typeof value === "object" && value !== null) {
          const nestedName = getUniqueClassName(fieldName);
          if (!generatedClasses.has(nestedName)) {
            generatedClasses.add(nestedName);
            nestedClasses.push({ obj: value, name: nestedName });
          }
          fieldType = nestedName;
        } else {
          fieldType = mapJsonType(value);
        }

        if (useJackson) additionalAnnotation += `  @JsonProperty("${key}")\n`;
        if (useValidation) {
          if (fieldType === "String") additionalAnnotation += `  @NotBlank\n`;
          else if (fieldType === "Integer" || fieldType === "Double") additionalAnnotation += `  @NotNull\n`;
        }
        fields.push(`  ${additionalAnnotation}  private ${fieldType} ${fieldName};\n`);
      }

      fields.forEach(f => classCode += f);
      classCode += `\n`;

      if (!useLombok) {
        for (const [key, value] of Object.entries(obj)) {
          let fieldType = "";
          const fieldName = key;
          if (Array.isArray(value)) {
            if (value.length === 0) fieldType = "List<Object>";
            else {
              const first = value[0];
              if (typeof first === "object" && first !== null) {
                const nestedName = getUniqueClassName(key + "Item");
                fieldType = `List<${nestedName}>`;
              } else {
                fieldType = `List<${mapJsonType(first)}>`;
              }
            }
          } else if (typeof value === "object" && value !== null) {
            fieldType = getUniqueClassName(key);
          } else {
            fieldType = mapJsonType(value);
          }
          const capName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
          classCode += `  public ${fieldType} get${capName}() { return ${fieldName}; }\n`;
          classCode += `  public void set${capName}(${fieldType} ${fieldName}) { this.${fieldName} = ${fieldName}; }\n\n`;
        }
      }

      classCode += `}`;
      let nestedCode = "";
      for (const nested of nestedClasses) {
        nestedCode += generateJavaClass(nested.obj, nested.name, generatedClasses, options) + "\n\n";
      }
      return nestedCode + classCode;
    }

    function convertToJava() {
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
          useLombok: document.getElementById('lombok-checkbox').checked,
          useBuilder: document.getElementById('builder-checkbox').checked,
          useJackson: document.getElementById('jackson-checkbox').checked,
          useValidation: document.getElementById('validation-checkbox').checked,
        };

        const generatedClasses = new Set();
        const rootName = getUniqueClassName("Root");
        generatedClasses.add(rootName);
        let javaCode = generateJavaClass(obj, rootName, generatedClasses, options);

        const imports = new Set();
        if (options.useLombok) {
          imports.add("import lombok.Data;");
          if (options.useBuilder) imports.add("import lombok.Builder;");
          if (!options.useBuilder) {
            imports.add("import lombok.NoArgsConstructor;");
            imports.add("import lombok.AllArgsConstructor;");
          }
        }
        if (options.useJackson) {
          imports.add("import com.fasterxml.jackson.annotation.JsonIgnoreProperties;");
          imports.add("import com.fasterxml.jackson.annotation.JsonProperty;");
        }
        if (options.useValidation) {
          imports.add("import jakarta.validation.constraints.NotBlank;");
          imports.add("import jakarta.validation.constraints.NotNull;");
        }
        if (javaCode.includes("List<")) imports.add("import java.util.List;");

        const importBlock = Array.from(imports).sort().join("\n");
        const finalCode = importBlock ? importBlock + "\n\n" + javaCode : javaCode;
        outputEditor.setValue(finalCode, -1);
        showToast("Java classes generated successfully", false);
      } catch (err) {
        showToast(err.message, true);
      }
    }

    async function exportAsZip() {
      const javaCode = outputEditor.getValue();
      if (!javaCode.trim() || javaCode.includes("// Java code will appear here after conversion")) {
        showToast("No Java code to export. Convert JSON first.", true);
        return;
      }
      const classBlocks = javaCode.split(/(?=^public\s+(class|interface)\s+)/gm);
      const zip = new JSZip();
      const modelFolder = zip.folder("model");
      let fileCount = 0;
      for (let block of classBlocks) {
        if (!block.trim()) continue;
        const match = block.match(/public\s+(class|interface)\s+(\w+)/);
        if (match) {
          modelFolder.file(`${match[2]}.java`, block.trim());
          fileCount++;
        }
      }
      if (fileCount === 0) modelFolder.file("Root.java", javaCode);
      const blob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "model.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Exported ${fileCount || 1} Java file(s) to model.zip`, false);
    }

    function copyOutput() {
      const code = outputEditor.getValue();
      if (!code.trim() || code.includes("// Java code will appear here after conversion")) {
        showToast("Nothing to copy", true);
        return;
      }
      navigator.clipboard.writeText(code).then(() => showToast("Java code copied", false))
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

    document.getElementById('convert-btn').addEventListener('click', convertToJava);
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