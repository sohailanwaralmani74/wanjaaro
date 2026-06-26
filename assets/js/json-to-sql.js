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
let currentSqlContent = null;

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
  generateSqlFromJson(parsedJson);
  showToast("✅ Conversion Successful!");
});

// ========== Generate SQL from JSON ==========
function generateSqlFromJson(jsonData) {
  let sqlContent = "";
  const tables = new Map();
  
  // Helper function to convert value to SQL format
  function toSqlValue(value) {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
    if (Array.isArray(value)) return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
    if (typeof value === "object") return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
    return `'${String(value).replace(/'/g, "''")}'`;
  }

  // Helper function to sanitize table/column names
  function sanitizeName(name) {
    return name.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
  }

  // Check if data has nested objects/arrays
  function hasNestedStructures(data) {
    if (Array.isArray(data)) {
      return data.some(item => 
        typeof item === 'object' && 
        item !== null && 
        Object.values(item).some(val => 
          Array.isArray(val) || (typeof val === 'object' && val !== null)
        )
      );
    }
    if (typeof data === 'object' && data !== null) {
      return Object.values(data).some(val => 
        Array.isArray(val) || (typeof val === 'object' && val !== null)
      );
    }
    return false;
  }

  // Analyze JSON structure and create table definitions for complex data
  function analyzeComplexStructure(data, parentTable = null, parentName = "main", depth = 0) {
    const tableName = sanitizeName(`${parentName}_table`);
    const columns = new Set(['id SERIAL PRIMARY KEY']);
    const relationships = [];
    
    if (parentTable && depth > 0) {
      columns.add(`${parentTable}_id INTEGER`);
      relationships.push(`FOREIGN KEY (${parentTable}_id) REFERENCES ${parentTable}(id)`);
    }

    const dataArray = Array.isArray(data) ? data : [data];
    
    if (dataArray.length > 0) {
      const sampleItem = dataArray[0];
      
      if (typeof sampleItem === 'object' && sampleItem !== null) {
        Object.keys(sampleItem).forEach(key => {
          const value = sampleItem[key];
          
          if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // Nested object - create separate table
            const nestedTableName = analyzeComplexStructure(value, tableName, key, depth + 1);
            relationships.push(`-- Related table: ${nestedTableName}`);
          } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
            // Array of objects - create separate table
            const arrayTableName = analyzeComplexStructure(value, tableName, key, depth + 1);
            relationships.push(`-- Related table: ${arrayTableName} (one-to-many)`);
          } else {
            // Simple value - add as column
            const sqlType = getSqlType(value);
            columns.add(`${sanitizeName(key)} ${sqlType}`);
          }
        });
      }
    }

    const tableInfo = {
      tableName,
      columns: Array.from(columns),
      relationships,
      data: dataArray,
      parentTable,
      depth
    };
    
    tables.set(tableName, tableInfo);
    return tableName;
  }

  // Generate table structure for flat data
  function generateFlatTable(data, tableName = "data") {
    const columns = new Set(['id SERIAL PRIMARY KEY']);
    
    // Extract all columns from all objects
    const allObjects = Array.isArray(data) ? data : [data];
    allObjects.forEach(obj => {
      if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
          const sqlType = getSqlType(obj[key]);
          columns.add(`${sanitizeName(key)} ${sqlType}`);
        });
      }
    });
    
    return {
      tableName,
      columns: Array.from(columns),
      data: allObjects,
      isFlat: true
    };
  }

  // Determine SQL type from JavaScript value
  function getSqlType(value) {
    if (value === null) return "TEXT";
    if (typeof value === "string") {
      if (value.length > 255) return "TEXT";
      return "VARCHAR(255)";
    }
    if (typeof value === "number") {
      if (Number.isInteger(value)) return "INTEGER";
      return "DECIMAL(10,2)";
    }
    if (typeof value === "boolean") return "BOOLEAN";
    if (Array.isArray(value)) return "JSONB";
    if (typeof value === "object") return "JSONB";
    return "TEXT";
  }

  // Generate CREATE TABLE statements
  function generateCreateTables() {
    let sql = "";
    tables.forEach(tableInfo => {
      sql += `-- Table: ${tableInfo.tableName}\n`;
      sql += `CREATE TABLE ${tableInfo.tableName} (\n`;
      
      tableInfo.columns.forEach((column, index) => {
        sql += `  ${column}`;
        if (index < tableInfo.columns.length - 1) {
          sql += ",";
        }
        sql += "\n";
      });

      sql += ");\n\n";
    });
    return sql;
  }

  // Generate INSERT statements for flat data
  function generateFlatInsertStatements(tableInfo) {
    let sql = "";
    
    if (tableInfo.data && tableInfo.data.length > 0) {
      sql += `-- Insert data into ${tableInfo.tableName}\n`;
      
      // Get column names (excluding id)
      const columnNames = tableInfo.columns
        .map(col => col.split(' ')[0])
        .filter(col => col !== 'id');
      
      tableInfo.data.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          const values = columnNames.map(col => {
            // Handle case variations in column names
            const exactKey = Object.keys(item).find(key => 
              sanitizeName(key) === col
            ) || col;
            return toSqlValue(item[exactKey]);
          });
          
          sql += `INSERT INTO ${tableInfo.tableName} (${columnNames.join(', ')}) \n`;
          sql += `VALUES (${values.join(', ')});\n`;
        }
      });
      sql += "\n";
    }
    
    return sql;
  }

  // Generate INSERT statements for complex data
  function generateComplexInsertStatements() {
    let sql = "";
    const mainTable = Array.from(tables.values()).find(table => table.depth === 0);
    
    if (!mainTable) return sql;

    // Insert main table data
    sql += `-- Insert data into ${mainTable.tableName}\n`;
    const mainColumnNames = mainTable.columns
      .map(col => col.split(' ')[0])
      .filter(col => col !== 'id' && !col.endsWith('_id'));

    mainTable.data.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        const values = mainColumnNames.map(col => {
          const exactKey = Object.keys(item).find(key => 
            sanitizeName(key) === col
          ) || col;
          return toSqlValue(item[exactKey]);
        });
        
        sql += `INSERT INTO ${mainTable.tableName} (${mainColumnNames.join(', ')}) \n`;
        sql += `VALUES (${values.join(', ')});\n`;
        sql += `-- Main record ID: ${index + 1}\n\n`;
      }
    });

    // Insert related table data
    tables.forEach(tableInfo => {
      if (tableInfo.depth > 0 && tableInfo.parentTable) {
        sql += `-- Insert data into ${tableInfo.tableName}\n`;
        
        const columnNames = tableInfo.columns
          .map(col => col.split(' ')[0])
          .filter(col => col !== 'id');

        mainTable.data.forEach((mainItem, mainIndex) => {
          if (typeof mainItem === 'object' && mainItem !== null) {
            const nestedKey = Object.keys(mainItem).find(key => 
              sanitizeName(key) === tableInfo.tableName.replace('_table', '')
            );
            
            if (nestedKey && mainItem[nestedKey]) {
              const nestedData = Array.isArray(mainItem[nestedKey]) ? 
                mainItem[nestedKey] : [mainItem[nestedKey]];
              
              nestedData.forEach((nestedItem, nestedIndex) => {
                if (typeof nestedItem === 'object' && nestedItem !== null) {
                  const values = [];
                  values.push(mainIndex + 1); // Foreign key reference
                  
                  columnNames.forEach(col => {
                    if (col !== `${tableInfo.parentTable}_id`) {
                      const exactKey = Object.keys(nestedItem).find(key => 
                        sanitizeName(key) === col
                      ) || col;
                      values.push(toSqlValue(nestedItem[exactKey]));
                    }
                  });
                  
                  const insertColumns = columnNames.filter(col => col !== 'id');
                  sql += `INSERT INTO ${tableInfo.tableName} (${insertColumns.join(', ')}) \n`;
                  sql += `VALUES (${values.join(', ')});\n`;
                }
              });
            }
          }
        });
        sql += "\n";
      }
    });
    
    return sql;
  }

  // Main conversion logic
  try {
    // Check if data has nested structures
    if (hasNestedStructures(jsonData)) {
      sqlContent += "-- JSON to Normalized SQL Conversion\n";
      sqlContent += "-- Complex nested structure detected - multiple tables with relationships\n\n";
      
      // Analyze complex structure and create tables
      analyzeComplexStructure(jsonData);
      sqlContent += generateCreateTables();
      sqlContent += generateComplexInsertStatements();
      
    } else {
      sqlContent += "-- JSON to SQL Conversion\n";
      sqlContent += "-- Flat data structure detected - single table created\n\n";
      
      // Generate flat table structure
      const tableName = Array.isArray(jsonData) && jsonData.length > 0 ? "organizations" : "data";
      const tableInfo = generateFlatTable(jsonData, tableName);
      tables.set(tableInfo.tableName, tableInfo);
      
      // Generate SQL
      sqlContent += generateCreateTables();
      sqlContent += generateFlatInsertStatements(tableInfo);
    }
    
    // Update output area
    outputArea.value = sqlContent;
    currentSqlContent = sqlContent;
    
    // Scroll to output section
    document.getElementById("convertedFile").scrollIntoView({ behavior: "smooth" });
    
  } catch (error) {
    outputArea.value = `-- Error generating SQL:\n-- ${error.message}`;
    currentSqlContent = null;
    console.error("SQL Generation Error:", error);
  }
}

// ========== Copy SQL to Clipboard ==========
copyOutputBtn.addEventListener("click", () => {
  if (!currentSqlContent) {
    showToast("⚠️ No SQL content to copy!");
    return;
  }
  
  outputArea.select();
  document.execCommand("copy");
  showToast("✅ SQL copied to clipboard!");
});

// ========== Export SQL File ==========
exportOutputBtn.addEventListener("click", () => {
  if (!currentSqlContent) {
    showToast("⚠️ No SQL generated yet!");
    return;
  }
  
  const blob = new Blob([currentSqlContent], { type: "text/sql" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "converted_data.sql";
  link.click();
  showToast("✅ SQL file downloaded!");
});

// ========== Toast ==========
function showToast(message) {
  toastJson.textContent = message;
  toastJson.classList.add("show");
  setTimeout(() => toastJson.classList.remove("show"), 2000);
}

// Initialize
updateJsonPreview();