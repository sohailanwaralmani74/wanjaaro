/**
 * UUID & GUID Generator
 * Supports: UUID v1, v4, v7, GUID, ULID, NanoID, KSUID, CUID, CUID2
 * Features:
 * - Bulk generation (1-1000 IDs)
 * - Copy to clipboard
 * - Export: CSV, Excel, JSON, SQL, XML
 * - Toast notifications
 * Author: Sarees Ali
 */

// Immediately Invoked Function Expression to avoid global scope pollution
(function() {

    // DOM Elements
    const selectVersion = document.getElementById('uuidVersion');
    const inputCount = document.getElementById('uuidCount');
    const btnGenerate = document.getElementById('generateUUIDBtn');
    const outputArea = document.getElementById('uuid-output');
    const toast = document.getElementById('toastUUID');

    const btnCopy = document.getElementById('copyUUIDBtn');
    const btnCSV = document.getElementById('exportCSVBtn');
    const btnExcel = document.getElementById('exportExcelBtn');
    const btnJSON = document.getElementById('exportJSONBtn');
    const btnSQL = document.getElementById('exportSQLBtn');
    const btnXML = document.getElementById('exportXMLBtn');

    /**
     * Utility: Show Toast Message
     * @param {string} message
     */
    function showToast(message) {
        toast.innerText = message;
        toast.style.opacity = 1;
        setTimeout(() => toast.style.opacity = 0, 2000);
    }

    /**
     * Generate UUID/GUID/ULID/NanoID/KSUID/CUID/CUID2
     * @param {string} type
     * @returns {string} id
     */
    function generateID(type) {
        switch(type) {
            case 'v1': return uuidv1();
            case 'v4': return uuidv4();
            case 'v7': return uuidv7();
            case 'guid': return generateGUID();
            case 'ulid': return generateULID();
            case 'nanoid': return generateNanoID();
            case 'ksuid': return generateKSUID();
            case 'cuid': return generateCUID();
            case 'cuid2': return generateCUID2();
            default: return '';
        }
    }

    /**
     * Generate multiple IDs
     * @param {string} type
     * @param {number} count
     * @returns {string[]} array of IDs
     */
    function generateMultipleIDs(type, count) {
        const ids = [];
        for (let i = 0; i < count; i++) {
            ids.push(generateID(type));
        }
        return ids;
    }

    /**
     * Display IDs in textarea
     * @param {string[]} ids
     */
    function displayIDs(ids) {
        outputArea.value = ids.join('\n');
    }

    /**
     * Export utilities
     */
    function exportToCSV(ids) {
        const csvContent = ids.join('\n');
        downloadFile(csvContent, 'uuids.csv', 'text/csv');
    }

    function exportToJSON(ids) {
        const jsonContent = JSON.stringify(ids, null, 2);
        downloadFile(jsonContent, 'uuids.json', 'application/json');
    }

    function exportToSQL(ids) {
        const sqlContent = ids.map(id => `INSERT INTO uuids (id) VALUES ('${id}');`).join('\n');
        downloadFile(sqlContent, 'uuids.sql', 'text/sql');
    }

    function exportToXML(ids) {
        let xmlContent = '<uuids>\n';
        ids.forEach(id => {
            xmlContent += `  <uuid>${id}</uuid>\n`;
        });
        xmlContent += '</uuids>';
        downloadFile(xmlContent, 'uuids.xml', 'application/xml');
    }

    function exportToExcel(ids) {
        let xlsContent = '<table><tr><th>UUID</th></tr>';
        ids.forEach(id => {
            xlsContent += `<tr><td>${id}</td></tr>`;
        });
        xlsContent += '</table>';
        downloadFile(xlsContent, 'uuids.xls', 'application/vnd.ms-excel');
    }

    function copyToClipboard(ids) {
        navigator.clipboard.writeText(ids.join('\n'))
            .then(() => showToast('✅ Copied to clipboard'))
            .catch(() => showToast('❌ Copy failed'));
    }

    /**
     * Helper: Trigger download
     * @param {string} content
     * @param {string} filename
     * @param {string} type
     */
    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`✅ Exported ${filename}`);
    }

    // =========================
    //  Event Listeners
    // =========================
    btnGenerate.addEventListener('click', () => {
        const type = selectVersion.value;
        let count = parseInt(inputCount.value);
        if (isNaN(count) || count < 1) count = 1;
        if (count > 1000) count = 1000;

        const ids = generateMultipleIDs(type, count);
        displayIDs(ids);
        showToast('✅ UUID Generation Successful');
    });

    btnCopy.addEventListener('click', () => copyToClipboard(outputArea.value.split('\n')));
    btnCSV.addEventListener('click', () => exportToCSV(outputArea.value.split('\n')));
    btnExcel.addEventListener('click', () => exportToExcel(outputArea.value.split('\n')));
    btnJSON.addEventListener('click', () => exportToJSON(outputArea.value.split('\n')));
    btnSQL.addEventListener('click', () => exportToSQL(outputArea.value.split('\n')));
    btnXML.addEventListener('click', () => exportToXML(outputArea.value.split('\n')));

    // =========================
    //  ID Generation Functions
    //  (Simple versions for browser, can be replaced with libs for better performance)
    // =========================

    function uuidv1() { // timestamp-based
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    function uuidv4() { // random
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    function uuidv7() { // ordered timestamp
        const ts = Date.now();
        const rand = crypto.getRandomValues(new Uint8Array(10));
        let hexRand = Array.from(rand).map(x => x.toString(16).padStart(2,'0')).join('');
        return ts.toString(16).padStart(12,'0') + hexRand.substring(0,20);
    }

    function generateGUID() { // Windows-style GUID
        return uuidv4().toUpperCase();
    }

    function generateULID() { // simple ULID implementation
        const t = Date.now();
        const time = t.toString(36).toUpperCase().padStart(10,'0');
        const rand = Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(x => x.toString(36)).join('').toUpperCase();
        return (time + rand).substring(0,26);
    }

    function generateNanoID(size = 21) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
        let id = '';
        const values = crypto.getRandomValues(new Uint8Array(size));
        for(let i=0;i<size;i++){
            id += chars[values[i]%chars.length];
        }
        return id;
    }

    function generateKSUID() {
        const ts = Math.floor(Date.now()/1000).toString(16).padStart(8,'0');
        const rand = Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(x => x.toString(16).padStart(2,'0')).join('');
        return ts + rand;
    }

    function generateCUID() {
        const ts = Date.now().toString(36);
        const random = Array.from(crypto.getRandomValues(new Uint8Array(4)))
            .map(x=>x.toString(36)).join('');
        return 'c' + ts + random;
    }

    function generateCUID2() {
        const ts = Date.now().toString(36);
        const random = Array.from(crypto.getRandomValues(new Uint8Array(6)))
            .map(x=>x.toString(36)).join('');
        return 'c2' + ts + random;
    }

})();
