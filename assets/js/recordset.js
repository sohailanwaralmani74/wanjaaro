 // ------------------ RECORDSET ENGINE (same robust core) ------------------
    class RecordsetEngine {
        static parseToRecordset(content) {
            if (!content || content.trim() === '') return { success: false, errorMessage: 'Empty content.' };
            const trimmed = content.trim();
            if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                const res = this.tryParseJSON(trimmed);
                if (res.success) return res;
            }
            const csvRes = this.tryParseCSV(trimmed);
            if (csvRes.success) return csvRes;
            if (trimmed.startsWith('<')) {
                const xmlRes = this.tryParseXML(trimmed);
                if (xmlRes.success) return xmlRes;
            }
            return { success: false, errorMessage: 'Unsupported format. Provide JSON array, CSV (headers), or XML.' };
        }
        static tryParseJSON(text) {
            try {
                let parsed = JSON.parse(text);
                let records = null;
                if (Array.isArray(parsed)) records = parsed;
                else if (parsed && typeof parsed === 'object') {
                    for (let k of ['records','recordset','data','items','rows']) {
                        if (Array.isArray(parsed[k])) { records = parsed[k]; break; }
                    }
                }
                if (!records || !records.length) return { success: false, errorMessage: 'No non-empty array found.' };
                if (!records.every(r => r && typeof r === 'object' && !Array.isArray(r))) 
                    return { success: false, errorMessage: 'Records must be objects.' };
                const columns = this.extractAllColumns(records);
                const normalized = this.normalizeRecords(records, columns);
                return { success: true, records: normalized, columns };
            } catch(e) { return { success: false, errorMessage: `JSON error: ${e.message}` }; }
        }
        static tryParseCSV(text) {
            const lines = text.split(/\r?\n/).filter(l => l.trim().length);
            if (lines.length < 2) return { success: false, errorMessage: 'Need header + data rows.' };
            const delimiters = [',', ';', '\t', '|'];
            let bestDelim = ',', maxCount = 0;
            for (let d of delimiters) {
                let cnt = (lines[0].match(new RegExp(`\\${d}`, 'g')) || []).length;
                if (cnt > maxCount) { maxCount = cnt; bestDelim = d; }
            }
            if (maxCount === 0) return { success: false, errorMessage: 'No delimiter found.' };
            const parseRow = (row, delim) => {
                let result = [], cur = '', inQuote = false;
                for (let i = 0; i < row.length; i++) {
                    let ch = row[i];
                    if (ch === '"') inQuote = !inQuote;
                    else if (!inQuote && ch === delim) { result.push(cur.trim()); cur = ''; }
                    else cur += ch;
                }
                result.push(cur.trim());
                return result.map(cell => cell.replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));
            };
            const headers = parseRow(lines[0], bestDelim).map(h => h.trim() || `col_${Math.random()}`);
            const records = [];
            for (let i=1; i<lines.length; i++) {
                let cells = parseRow(lines[i], bestDelim);
                let obj = {};
                headers.forEach((h, idx) => obj[h] = cells[idx] !== undefined ? cells[idx] : '');
                records.push(obj);
            }
            if (!records.length) return { success: false, errorMessage: 'No data rows.' };
            const columns = this.extractAllColumns(records);
            const normalized = this.normalizeRecords(records, columns);
            return { success: true, records: normalized, columns };
        }
        static tryParseXML(xmlStr) {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xmlStr, 'text/xml');
                if (doc.querySelector('parsererror')) return { success: false, errorMessage: 'XML parse error' };
                const root = doc.documentElement;
                if (!root) return { success: false, errorMessage: 'Empty XML' };
                const children = Array.from(root.children);
                if (!children.length) return { success: false, errorMessage: 'No child elements' };
                const records = [];
                for (let el of children) {
                    let obj = {};
                    if (el.children.length === 0) obj[el.tagName] = el.textContent.trim();
                    else for (let field of el.children) obj[field.tagName] = field.textContent.trim();
                    if (Object.keys(obj).length) records.push(obj);
                }
                if (!records.length) return { success: false, errorMessage: 'No records' };
                const columns = this.extractAllColumns(records);
                const normalized = this.normalizeRecords(records, columns);
                return { success: true, records: normalized, columns };
            } catch(e) { return { success: false, errorMessage: e.message }; }
        }
        static extractAllColumns(records) {
            const cols = new Set();
            records.forEach(r => Object.keys(r).forEach(k => cols.add(k)));
            return Array.from(cols);
        }
        static normalizeRecords(records, columns) {
            return records.map(rec => {
                let norm = {};
                for (let col of columns) norm[col] = rec[col] !== undefined ? String(rec[col]) : '';
                return norm;
            });
        }
        static deepValidate(records, columns) {
            if (!records?.length) return { valid: false, message: 'No records' };
            if (!columns?.length) return { valid: false, message: 'No columns' };
            return { valid: true, message: 'Valid' };
        }
        static toXML(records, root='recordset', row='row') {
            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${this.escapeXml(root)}>\n`;
            const cols = this.extractAllColumns(records);
            for (let rec of records) {
                xml += `  <${this.escapeXml(row)}>\n`;
                for (let col of cols) xml += `    <${this.escapeXml(col)}>${this.escapeXml(rec[col]||'')}</${this.escapeXml(col)}>\n`;
                xml += `  </${this.escapeXml(row)}>\n`;
            }
            xml += `</${this.escapeXml(root)}>`;
            return xml;
        }
        static toJSON(records) { return JSON.stringify(records, null, 2); }
        static toCSV(records) {
            const cols = this.extractAllColumns(records);
            let csv = cols.map(c => `"${c.replace(/"/g, '""')}"`).join(',') + '\n';
            for (let rec of records) {
                let row = cols.map(c => `"${(rec[c]||'').replace(/"/g, '""')}"`).join(',');
                csv += row + '\n';
            }
            return csv;
        }
        static toHTMLTable(records, withBadge=false) {
            const cols = this.extractAllColumns(records);
            let html = withBadge ? '<div class="preview-badge">📄 Preview (use Export button to download)</div>' : '';
            html += '<table class="html-table-output"><thead><tr>';
            for (let c of cols) html += `<th>${this.escapeXml(c)}</th>`;
            html += '</tr></thead><tbody>';
            for (let rec of records) {
                html += '<tr>';
                for (let c of cols) html += `<td>${this.escapeXml(rec[c] || '')}</td>`;
                html += '</tr>';
            }
            html += '</tbody></table>';
            return html;
        }
        static escapeXml(str) { return String(str).replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m])); }
    }

    // ---------- UI State ----------
    let currentRecordset = null;     // { records, columns }
    let currentOutputRaw = '';
    let currentOutputType = 'text';  // 'xml','json','csv','html','excel','pdf'
    let pendingBinaryBlob = null;    // for excel/pdf export

    // DOM elements
    const textarea = document.getElementById('recordsetInput');
    const bottomPane = document.getElementById('bottomPane');
    const scrollPane = document.getElementById('scrollPane');
    const outputCode = document.getElementById('outputCode');
    const outputPre = document.getElementById('outputPre');
    const toastRoot = document.getElementById('toastRoot');

    function showToast(msg, type='info') {
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerText = msg;
        toastRoot.appendChild(t);
        setTimeout(() => { t.style.opacity='0'; setTimeout(()=>t.remove(),300); }, 2800);
    }

    function highlightJSON(jsonStr) {
        return jsonStr.replace(/("(\\u[\dA-Fa-f]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            if (/^"/.test(match)) return /:$/.test(match) ? `<span class="json-key">${match}</span>` : `<span class="json-string">${match}</span>`;
            if (/true|false/.test(match)) return `<span class="json-boolean">${match}</span>`;
            if (/null/.test(match)) return `<span class="json-null">${match}</span>`;
            return `<span class="json-number">${match}</span>`;
        });
    }

    function showPreview(raw, type, binaryBlob=null) {
        currentOutputRaw = raw;
        currentOutputType = type;
        pendingBinaryBlob = binaryBlob;
        bottomPane.classList.add('visible');
        if (type === 'json') {
            outputPre.className = 'syntax-json';
            outputCode.innerHTML = highlightJSON(raw);
        } else if (type === 'xml') {
            outputPre.className = '';
            outputCode.innerHTML = raw.replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m])).replace(/(&lt;\/?[\w:]+)/g, '<span style="color:#569cd6">$1</span>');
        } else if (type === 'csv') {
            outputPre.className = 'csv-output';
            outputCode.textContent = raw;
        } else if (type === 'html') {
            outputPre.className = '';
            outputCode.innerHTML = raw;
        } else if (type === 'excel-preview' || type === 'pdf-preview') {
            outputPre.className = '';
            outputCode.innerHTML = raw;  // raw is HTML table with badge
        } else {
            outputPre.className = '';
            outputCode.textContent = raw;
        }
        setTimeout(() => scrollPane.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }

    async function getValidatedRecordset() {
        const raw = textarea.value;
        if (!raw.trim()) { showToast('Please provide recordset data.', 'error'); return null; }
        const parse = RecordsetEngine.parseToRecordset(raw);
        if (!parse.success) { showToast(`Parse error: ${parse.errorMessage}`, 'error'); return null; }
        const valid = RecordsetEngine.deepValidate(parse.records, parse.columns);
        if (!valid.valid) { showToast(`Invalid recordset: ${valid.message}`, 'error'); return null; }
        currentRecordset = { records: parse.records, columns: parse.columns };
        return currentRecordset;
    }

    // Converters
    async function toXML() { const rs = await getValidatedRecordset(); if(rs) { const xml = RecordsetEngine.toXML(rs.records); showPreview(xml, 'xml'); showToast('XML ready', 'success'); } }
    async function toJSON() { const rs = await getValidatedRecordset(); if(rs) { const json = RecordsetEngine.toJSON(rs.records); showPreview(json, 'json'); showToast('JSON ready', 'success'); } }
    async function toCSV() { const rs = await getValidatedRecordset(); if(rs) { const csv = RecordsetEngine.toCSV(rs.records); showPreview(csv, 'csv'); showToast('CSV ready', 'success'); } }
    async function toHTML() { const rs = await getValidatedRecordset(); if(rs) { const html = RecordsetEngine.toHTMLTable(rs.records, false); showPreview(html, 'html'); showToast('HTML table ready', 'success'); } }
    async function toExcelPreview() {
        const rs = await getValidatedRecordset();
        if(!rs) return;
        const htmlPreview = RecordsetEngine.toHTMLTable(rs.records, true);
        showPreview(htmlPreview, 'excel-preview', null);
        // Store binary for export later
        const wsData = [rs.columns, ...rs.records.map(r => rs.columns.map(c => r[c] || ''))];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Recordset');
        const excelBuf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        pendingBinaryBlob = new Blob([excelBuf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        currentOutputType = 'excel';
        showToast('Excel preview ready. Use Export to download .xlsx', 'success');
    }
    async function toPDFPreview() {
        const rs = await getValidatedRecordset();
        if(!rs) return;
        const htmlPreview = RecordsetEngine.toHTMLTable(rs.records, true);
        showPreview(htmlPreview, 'pdf-preview', null);
        // generate PDF blob for later export
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape' });
        const tableData = rs.records.map(r => rs.columns.map(c => r[c] || ''));
        doc.autoTable({ head: [rs.columns], body: tableData, startY: 20, theme: 'striped' });
        const pdfBlob = doc.output('blob');
        pendingBinaryBlob = pdfBlob;
        currentOutputType = 'pdf';
        showToast('PDF preview ready. Use Export to download .pdf', 'success');
    }

    function clearAll() { textarea.value = ''; bottomPane.classList.remove('visible'); currentRecordset = null; pendingBinaryBlob = null; showToast('Cleared', 'info'); }

    async function copyOutput() {
        if (!currentOutputRaw && !pendingBinaryBlob) { showToast('Nothing to copy', 'error'); return; }
        if (currentOutputType === 'excel' || currentOutputType === 'pdf') {
            showToast('Binary format cannot be copied. Use Export to download.', 'error');
            return;
        }
        await navigator.clipboard.writeText(currentOutputRaw);
        showToast('Copied to clipboard', 'success');
    }
    function exportOutput() {
        if (currentOutputType === 'excel' && pendingBinaryBlob) {
            const url = URL.createObjectURL(pendingBinaryBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recordset_${Date.now()}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Excel file downloaded', 'success');
        } else if (currentOutputType === 'pdf' && pendingBinaryBlob) {
            const url = URL.createObjectURL(pendingBinaryBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recordset_${Date.now()}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('PDF file downloaded', 'success');
        } else if (currentOutputRaw) {
            let ext = 'txt';
            if (currentOutputType === 'xml') ext = 'xml';
            else if (currentOutputType === 'json') ext = 'json';
            else if (currentOutputType === 'csv') ext = 'csv';
            else if (currentOutputType === 'html') ext = 'html';
            const blob = new Blob([currentOutputRaw], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `output.${ext}`;
            a.click();
            URL.revokeObjectURL(a.href);
            showToast('File exported', 'success');
        } else {
            showToast('No output to export', 'error');
        }
    }

    function handleFileUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.csv,.xml,.dat,.rec,.txt';
        input.onchange = e => {
            const file = e.target.files[0];
            if(!file) return;
            const reader = new FileReader();
            reader.onload = ev => { textarea.value = ev.target.result; showToast(`Loaded ${file.name}`, 'info'); bottomPane.classList.remove('visible'); pendingBinaryBlob = null; };
            reader.readAsText(file, 'UTF-8');
        };
        input.click();
    }

    // Event binding
    document.getElementById('uploadBtn').addEventListener('click', handleFileUpload);
    document.getElementById('toXmlBtn').addEventListener('click', toXML);
    document.getElementById('toJsonBtn').addEventListener('click', toJSON);
    document.getElementById('toCsvBtn').addEventListener('click', toCSV);
    document.getElementById('toExcelBtn').addEventListener('click', toExcelPreview);
    document.getElementById('toPdfBtn').addEventListener('click', toPDFPreview);
    document.getElementById('toHtmlBtn').addEventListener('click', toHTML);
    document.getElementById('clearBtn').addEventListener('click', clearAll);
    document.getElementById('copyOutputBtn').addEventListener('click', copyOutput);
    document.getElementById('exportOutputBtn').addEventListener('click', exportOutput);

    // sample data
    textarea.value = `[
  { "Product": "Laptop", "Price": 999, "Stock": 45 },
  { "Product": "Mouse", "Price": 25, "Stock": 200 }
]`;