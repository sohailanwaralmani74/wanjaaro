/**
 * Author: Saeed Ahmed Sheikh
 * Reviewed by: Sohail Anwar
 * Purpose: Handle ODS to Excel conversion with real-time editable previews, export, toast, and scroll.
 */

const fileInput = document.getElementById("fileInput");
const convertBtn = document.getElementById("convertBtn");
const odsPreview = document.getElementById("odsPreview");
const excelPreview = document.getElementById("excelPreview");
const exportXlsBtn = document.getElementById("exportXlsBtn");
const exportXlsxBtn = document.getElementById("exportXlsxBtn");
const toast = document.getElementById("toast");
const convertedFileDiv = document.getElementById("convertedFile");

// Global workbook object to store uploaded/edited data
let workbook = null;

/**
 * Method: readODSFile
 * Description: Reads the uploaded ODS file, parses it using SheetJS, and displays first sheet in editable preview.
 */
function readODSFile(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = e.target.result;
        workbook = XLSX.read(data, { type: "array" });

        // Show editable ODS preview
        displayPreview(workbook, odsPreview);

        convertBtn.disabled = false;
    };

    reader.readAsArrayBuffer(file);
}

/**
 * Method: displayPreview
 * Description: Converts workbook's first sheet to HTML and displays in given preview div.
 * @param {Object} wb - SheetJS workbook object
 * @param {HTMLElement} previewDiv - target div for preview
 */
function displayPreview(wb, previewDiv) {
    if (!wb) return;
    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];
    const html = XLSX.utils.sheet_to_html(ws, { editable: true });
    previewDiv.innerHTML = html;
}

/**
 * Method: updateWorkbookFromPreview
 * Description: Reads HTML table from a preview div and updates workbook object.
 * @param {HTMLElement} previewDiv - source div for reading table
 */
function updateWorkbookFromPreview(previewDiv) {
    if (!workbook) return;
    const firstSheetName = workbook.SheetNames[0];
    const table = previewDiv.querySelector("table");
    if (!table) return;
    const newSheet = XLSX.utils.table_to_sheet(table);
    workbook.Sheets[firstSheetName] = newSheet;
}

/**
 * Method: showToast
 * Description: Shows toast message for 2 seconds and scrolls to converted file section.
 * @param {string} message - Message to show
 */
function showToast(message) {
    toast.innerText = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
        convertedFileDiv.scrollIntoView({ behavior: "smooth" });
    }, 2000);
}

/**
 * Method: exportWorkbook
 * Description: Exports workbook to selected Excel format (.xls or .xlsx)
 * @param {string} type - 'xls' or 'xlsx'
 */
function exportWorkbook(type) {
    if (!workbook) return;
    const filename = `converted_file.${type}`;
    XLSX.writeFile(workbook, filename, { bookType: type });
}

/**
 * Method: bindExcelPreviewEdit
 * Description: Listens for edits in Excel preview and updates workbook in real-time.
 */
function bindExcelPreviewEdit() {
    excelPreview.addEventListener("input", () => {
        updateWorkbookFromPreview(excelPreview);
    });
}

/**
 * Event: File input change
 */
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    readODSFile(file);
});

/**
 * Event: Convert button click
 * Updates workbook from ODS preview, shows Excel preview, binds real-time editing, and displays toast.
 */
convertBtn.addEventListener("click", () => {
    // Update workbook from ODS preview edits
    updateWorkbookFromPreview(odsPreview);

    // Display in Excel preview
    displayPreview(workbook, excelPreview);

    // Bind real-time edit tracking in Excel preview
    bindExcelPreviewEdit();

    // Show conversion success toast
    showToast("✅ Conversion Successful!");
});

/**
 * Event: Export XLS click
 */
exportXlsBtn.addEventListener("click", () => {
    updateWorkbookFromPreview(excelPreview); // Ensure latest edits are captured
    exportWorkbook("xls");
});

/**
 * Event: Export XLSX click
 */
exportXlsxBtn.addEventListener("click", () => {
    updateWorkbookFromPreview(excelPreview); // Ensure latest edits are captured
    exportWorkbook("xlsx");
});
