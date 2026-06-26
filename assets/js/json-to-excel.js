// ---------- Elements ----------
const jsonInputEditor = document.getElementById("jsonInputEditor");
const fileInputJson = document.getElementById("fileInputJson");
const jsonPreviewArea = $("#jsonPreviewArea");
const convertBtnJson = document.getElementById("convertBtnJson");
const exportXlsxBtn = document.getElementById("exportXlsxBtn");
const exportXlsBtn = document.getElementById("exportXlsBtn");
const toastJson = document.getElementById("toastJson");
const sheetTabs = document.getElementById("sheetTabs");
const convertedFileAnchor = document.getElementById("convertedFile");

const MAX_SHEET_NAME = 31;
let parsedJson = null;
let workbook = null;
let sheetNames = [];
let tables = {};

// ---------- JSON Preview ----------
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

// ---------- Upload JSON File ----------
fileInputJson.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
        jsonInputEditor.value = event.target.result;
        updateJsonPreview();
    };
    reader.readAsText(file);
});

// ---------- Helpers ----------
function sanitizeSheetName(name, existing = []) {
    let n = String(name || "Sheet").replace(/[:\/\\\?\*\[\]]/g, "_");
    if (n.length > MAX_SHEET_NAME) n = n.slice(0, MAX_SHEET_NAME - 3) + '...';
    let unique = n, idx = 1;
    while (existing.includes(unique)) {
        const suffix = `_${idx}`;
        const base = unique.slice(0, MAX_SHEET_NAME - suffix.length);
        unique = base + suffix;
        idx++;
    }
    existing.push(unique);
    return unique;
}

async function buildSheets(node, name = "Root", parentKey = null, parentId = null) {
    const localTables = {};
    const registry = [];

    async function processNode(n, tableName, parentKey = null, parentId = null) {
        const items = Array.isArray(n) ? n : [n];
        const sheetName = sanitizeSheetName(tableName, registry);
        if (!localTables[sheetName]) localTables[sheetName] = [];

        for (let i = 0; i < items.length; i++) {
            const row = {};
            const obj = items[i];
            if (obj && typeof obj === "object") {
                for (const [k, v] of Object.entries(obj)) {
                    if (Array.isArray(v)) {
                        await processNode(v, k, `${sheetName}_id`, localTables[sheetName].length + 1);
                    } else if (v && typeof v === "object") {
                        await processNode([v], k, `${sheetName}_id`, localTables[sheetName].length + 1);
                    } else {
                        row[k] = v;
                    }
                }
            } else {
                row.value = obj;
            }
            if (parentKey && parentId != null) row[parentKey] = parentId;
            localTables[sheetName].push(row);
        }
    }

    await processNode(node, name, parentKey, parentId);
    return localTables;
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// ---------- Convert JSON → Excel & Render Tabs ----------
async function convertJsonToExcel() {
    if (!parsedJson) return;
    sheetTabs.innerHTML = "";
    document.getElementById("sheetTabsContainer").innerHTML = "";
    workbook = XLSX.utils.book_new();
    sheetNames = [];
    tables = await buildSheets(parsedJson);

    // Create tabs
    
    const tabContainerDiv = document.getElementById("sheetTabsContainer");
      const tabHeader = document.createElement("div");
      tabHeader.className = "sheet-tab-header";
      tabContainerDiv.appendChild(tabHeader);

    const tabContent = document.createElement("div");
    tabContent.className = "sheet-tab-content";
    sheetTabs.appendChild(tabContent);
    let first = true;
    for (const [name, rows] of Object.entries(tables)) {
        const safeName = sanitizeSheetName(name, sheetNames);

        let ws;
        if (!rows || rows.length === 0) ws = XLSX.utils.aoa_to_sheet([["(no rows)"]]);
        else ws = XLSX.utils.json_to_sheet(rows, { skipHeader: false });
        XLSX.utils.book_append_sheet(workbook, ws, safeName);

        const html = XLSX.utils.sheet_to_html(ws, { header: "", editable: false });
        const sheetDiv = document.createElement("div");
        sheetDiv.innerHTML = html;
        sheetDiv.style.display = first ? "block" : "none";
        sheetDiv.style.maxHeight = '23rem';
        sheetDiv.style.overflow = 'auto';
        tabContent.appendChild(sheetDiv);

        const btn = document.createElement("button");
        btn.textContent = safeName;
        btn.className = "sheet-tab-btn";
        btn.addEventListener("click", () => {
            Array.from(tabContent.children).forEach(c => c.style.display = "none");
            sheetDiv.style.display = "block";
            Array.from(tabHeader.children).forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
          });

        tabHeader.appendChild(btn);
        if (first) btn.classList.add("active");
        first = false;
    }

    if (convertedFileAnchor) convertedFileAnchor.scrollIntoView({ behavior: "smooth" });
    showToast(`✅ Conversion Successful — ${sheetNames.length} sheet(s)`);
}

// ---------- Export ----------
function exportWorkbook(format = "xlsx") {
    if (!workbook) return showToast("Nothing to export, convert JSON first");
    const fname = (window.baseFileName || "data") + "." + (format === "xls" ? "xls" : "xlsx");
    try {
        XLSX.writeFile(workbook, fname, { bookType: format });
    } catch (e) {
        console.error(e);
        showToast("Export failed");
    }
}

// ---------- Toast ----------
let toastTimer = null;
function showToast(msg) {
    if (!toastJson) return;
    toastJson.textContent = msg;
    toastJson.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastJson.classList.remove("show"), 2000);
}

// ---------- Event Listeners ----------
convertBtnJson.addEventListener("click", convertJsonToExcel);
exportXlsxBtn.addEventListener("click", () => exportWorkbook("xlsx"));
exportXlsBtn.addEventListener("click", () => exportWorkbook("xls"));

// Initialize preview
updateJsonPreview();
