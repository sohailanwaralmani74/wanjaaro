$(document).ready(function () {
  const editor = $("#json-editor");
  const viewer = $("#json-tree-viewer");

  // Helpers
  function parseJSON(jsonStr) {
    try { return JSON.parse(jsonStr); }
    catch (e) { viewer.html(`<span style="color:red">Invalid JSON: ${e.message}</span>`); return null; }
  }

  function capitalize(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function singularize(word) {
    if (!word) return word;
    if (word.endsWith("ies")) return word.slice(0, -3) + "y";
    if (word.endsWith("ses")) return word.slice(0, -2); // e.g., "statuses" -> "status"
    if (word.endsWith("s") && word.length > 1) return word.slice(0, -1);
    return word;
  }

  function sanitizeIdentifier(key) {
    // keep field name close to original but valid as a Dart identifier
    let k = String(key).replace(/[^a-zA-Z0-9_]/g, "_");
    if (/^\d/.test(k)) k = "_" + k;
    return k;
  }

  function primitiveTypeFromValue(v) {
    if (v === null) return "dynamic";
    if (Array.isArray(v)) return "List<dynamic>";
    switch (typeof v) {
      case "string": return "String";
      case "number": return Number.isInteger(v) ? "int" : "double";
      case "boolean": return "bool";
      case "object": return "Map<String, dynamic>";
      default: return "dynamic";
    }
  }

  // Main: creates a map of className => schema, and returns ordered class definitions
  function buildClassDefinitions(rootObj, rootName, options) {
    const processed = {}; // className -> schema object
    const order = []; // preserve generation order (nested first)

    function visit(obj, className) {
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) return;
      if (processed[className]) return;

      // record placeholder to avoid recursion loops
      processed[className] = { fields: {}, raw: obj };
      // For each key in object, analyze type; if nested object/array-of-object, visit recursively
      for (const origKey in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, origKey)) continue;
        const value = obj[origKey];
        let fieldInfo = { origKey, sanitized: sanitizeIdentifier(origKey), type: "dynamic", isList: false, itemClass: null, sample: value };

        if (value === null) {
          fieldInfo.type = "dynamic";
        } else if (Array.isArray(value)) {
          fieldInfo.isList = true;
          if (value.length === 0) {
            fieldInfo.type = "List<dynamic>";
          } else {
            const first = value.find(v => v !== undefined);
            if (first === undefined || first === null) {
              fieldInfo.type = "List<dynamic>";
            } else if (typeof first === "object") {
              const childName = capitalize(singularize(origKey));
              fieldInfo.type = `List<${childName}>`;
              fieldInfo.itemClass = childName;
              // visit child
              visit(first, childName);
            } else {
              // primitive list
              const prim = primitiveTypeFromValue(first);
              fieldInfo.type = `List<${prim.replace("Map<String, dynamic>", "dynamic")}>`;
            }
          }
        } else if (typeof value === "object") {
          const childName = capitalize(origKey);
          fieldInfo.type = childName;
          fieldInfo.itemClass = childName;
          visit(value, childName);
        } else {
          fieldInfo.type = primitiveTypeFromValue(value);
        }

        processed[className].fields[origKey] = fieldInfo;
      }

      // after processing nested visits, push this className to order
      order.push(className);
    }

    // start traversal: if root is array use first element as sample
    const sample = Array.isArray(rootObj) ? (rootObj[0] || {}) : rootObj || {};
    visit(sample, rootName);

    // build class code in reverse order so nested classes appear before parents
    const classDefs = [];
    for (let i = 0; i < order.length; i++) {
      const className = order[i];
      const schema = processed[className];
      if (!schema) continue;

      // generate fields string
      const fieldsArr = [];
      for (const origKey in schema.fields) {
        const f = schema.fields[origKey];
        fieldsArr.push(f);
      }

      classDefs.push({ name: className, fields: fieldsArr });
    }

    // order nested-first: reverse order array so children classes come first
    return classDefs.reverse();
  }

  function generateDartFromDefs(classDefs, options) {
    const { nullSafety, privateFields, requiredFields, defaultValues } = options;
    let output = "";

    for (const cls of classDefs) {
      const className = cls.name;
      // fields declarations
      let fieldsCode = "";
      for (const f of cls.fields) {
        const suffix = (nullSafety && f.sample === null) ? "?" : "";
        const fieldName = privateFields ? `_${f.sanitized}` : f.sanitized;
        // default values are shown only for primitives (keep simple)
        const defVal = (defaultValues && f.sample != null && (typeof f.sample !== "object")) ? ` = ${JSON.stringify(f.sample)}` : "";
        fieldsCode += `  ${f.type}${suffix} ${fieldName};${defVal}\n`;
      }

      // constructor
      let ctor = `  ${className}({\n`;
      for (const f of cls.fields) {
        const fieldName = privateFields ? `_${f.sanitized}` : f.sanitized;
        ctor += `    ${requiredFields ? "required " : ""}this.${fieldName},\n`;
      }
      ctor += "  });\n\n";

      // fromJson
      let fromJson = `  factory ${className}.fromJson(Map<String, dynamic> json) => ${className}(\n`;
      for (const f of cls.fields) {
        const fieldName = privateFields ? `_${f.sanitized}` : f.sanitized;
        const key = f.origKey;
        if (f.isList) {
          if (f.itemClass) {
            // list of objects
            fromJson += `    ${fieldName}: (json['${key}'] as List).map((e) => ${f.itemClass}.fromJson(e as Map<String,dynamic>)).toList(),\n`;
          } else {
            // primitive list
            // attempt to infer primitive type
            const sample = f.sample && Array.isArray(f.sample) ? f.sample.find(v => v !== undefined && v !== null) : undefined;
            const prim = primitiveTypeFromValue(sample) || "dynamic";
            fromJson += `    ${fieldName}: List<${prim}>.from(json['${key}']),\n`;
          }
        } else if (f.itemClass && !f.isList && typeof f.sample === "object") {
          fromJson += `    ${fieldName}: ${f.itemClass}.fromJson(json['${key}'] as Map<String,dynamic>),\n`;
        } else {
          // primitive
          const prim = primitiveTypeFromValue(f.sample) || "String";
          fromJson += `    ${fieldName}: json['${key}'] as ${prim},\n`;
        }
      }
      fromJson += "  );\n\n";

      // toJson
      let toJson = `  Map<String, dynamic> toJson() => {\n`;
      for (const f of cls.fields) {
        const fieldName = privateFields ? `_${f.sanitized}` : f.sanitized;
        const key = f.origKey;
        if (f.isList && f.itemClass) {
          toJson += `    '${key}': ${fieldName}.map((e) => e.toJson()).toList(),\n`;
        } else if (!f.isList && f.itemClass && typeof f.sample === "object") {
          toJson += `    '${key}': ${fieldName}.toJson(),\n`;
        } else {
          toJson += `    '${key}': ${fieldName},\n`;
        }
      }
      toJson += "  };\n";

      output += `class ${className} {\n${fieldsCode}\n${ctor}${fromJson}${toJson}\n}\n\n`;
    }

    return output;
  }

  // Render function tying it all together
  function renderDart() {
    const jsonStr = editor.val().trim();
    if (!jsonStr) { viewer.html(""); return; }

    const parsed = parseJSON(jsonStr);
    if (!parsed && parsed !== null) return;

    const sampleRoot = Array.isArray(parsed) ? (parsed[0] || {}) : parsed || {};
    const options = {
      nullSafety: $("#null-safety").is(":checked"),
      privateFields: $("#private-fields").is(":checked"),
      requiredFields: $("#required-fields").is(":checked"),
      defaultValues: $("#default-values").is(":checked")
    };

    const defs = buildClassDefinitions(sampleRoot, "Root", options);
    const dartCode = generateDartFromDefs(defs, options);

    // show formatted code
    viewer.html(`<pre style="white-space: pre-wrap; font-family: monospace;">${escapeHtml(dartCode)}</pre>`);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // events
  editor.on("input", renderDart);
  $("#null-safety,#private-fields,#required-fields,#default-values").on("change", renderDart);

  // copy / download (keep same function names used by your HTML)
  window.copyJson = function() {
    const text = viewer.text();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      $("#copied-popup").css("opacity", 1);
      setTimeout(() => $("#copied-popup").css("opacity", 0), 1000);
    });
  };

  window.downloadJson = function() {
    const text = viewer.text();
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "model.dart";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
});