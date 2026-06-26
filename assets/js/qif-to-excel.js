// ------------------ QIF Parser & Excel Creator ------------------

// Common QIF codes mapped to full column names
const commonFieldMap = {
    D: 'Date',
    T: 'Amount',
    P: 'Payee',
    M: 'Memo',
    L: 'Category',
    C: 'Cleared',
    S: 'Split',
    N: 'CheckNumber',
    A: 'Address',
    O: 'Original'
};

let accountType = ''; // store !Type

function parseQIFToArray(qifText) {
    const lines = qifText.split(/\r?\n/);
    const transactions = [];
    let currentTx = {};

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Handle account type
        if (line.startsWith('!Type:')) {
            accountType = line.slice(6).trim();
            continue;
        }

        const code = line[0];
        const value = line.slice(1).trim();

        if (code === '^') {
            if (Object.keys(currentTx).length > 0) {
                if (accountType) currentTx['AccountType'] = accountType;
                transactions.push({...currentTx});
            }
            currentTx = {};
        } else if (commonFieldMap[code]) {
            currentTx[commonFieldMap[code]] = value;
        } else {
            // unknown field, include dynamically
            currentTx[code] = value;
        }
    }

    return transactions;
}

// ------------------ Excel Workbook ------------------
function workbookFromArray(array) {
    const ws = XLSX.utils.json_to_sheet(array);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    return wb;
}

function downloadWorkbook(wb, filename, bookType) {
    const wbout = XLSX.write(wb, {bookType: bookType === 'xls' ? 'biff8' : 'xlsx', type:'array'});
    const blob = new Blob([wbout], {type: bookType === 'xls' ? 'application/vnd.ms-excel' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url = URL.createObjectURL(blob);
    triggerDownload(url, filename);
}

function triggerDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 5000);
}

// ------------------ DOM & UI Logic ------------------
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const convertBtn = document.getElementById('convertBtn');
const qifPreview = document.getElementById('qifPreview');
const excelPanel = document.getElementById('excelPanel');
const excelPreview = document.getElementById('excelPreview');
const exportXlsBtn = document.getElementById('exportXlsBtn');
const exportXlsxBtn = document.getElementById('exportXlsxBtn');
const toast = document.getElementById('toast');

let rawQifText = '';
let workbook = null;
let currentFilename = 'converted';

// ------------------ File Upload ------------------
fileInput.addEventListener('change', (e)=>{
    const file = e.target.files[0];
    if (!file) return;
    currentFilename = file.name.replace(/\.[^/.]+$/, '') || currentFilename;

    const reader = new FileReader();
    reader.onload = function(ev){
        rawQifText = ev.target.result;
        renderQIFPreview(rawQifText);
        convertBtn.disabled = false;
        excelPanel.classList.remove('visible');
        accountType = '';
    };
    reader.readAsText(file);
});

// ------------------ Preview QIF ------------------
function renderQIFPreview(text) {
    qifPreview.innerHTML = '';
    if (!text) {
        qifPreview.innerHTML = '<div class="small">QIF empty or failed to load.</div>';
        return;
    }
    const pre = document.createElement('pre');
    pre.textContent = text;
    qifPreview.appendChild(pre);
    qifPreview.scrollTop = 0;
}

// ------------------ Convert to Excel ------------------
convertBtn.addEventListener('click', () => {
    if (!rawQifText) return;

    const dataArray = parseQIFToArray(rawQifText);
    workbook = workbookFromArray(dataArray);

    // Render Excel preview (reuse table UI)
    excelPreview.innerHTML = '';
    if (dataArray.length > 0) {
        const table = document.createElement('table');
        table.className = 'sheet';

        // Prepare header: common fields first, unknown fields later
        const allKeys = new Set();
        dataArray.forEach(tx => Object.keys(tx).forEach(k => allKeys.add(k)));

        const headerOrder = ['Date','Amount','Payee','Memo','Category','Cleared','Split','CheckNumber','Address','Original','AccountType'];
        const headers = [...headerOrder.filter(h=>allKeys.has(h)), ...[...allKeys].filter(k=>!headerOrder.includes(k))];

        // Header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(key => { const th=document.createElement('th'); th.textContent=key; headerRow.appendChild(th); });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        dataArray.forEach(tx => {
            const tr = document.createElement('tr');
            headers.forEach(key => {
                const td = document.createElement('td');
                td.textContent = tx[key] || '';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        excelPreview.appendChild(table);
    } else {
        excelPreview.innerHTML = '<div class="small">No transactions found to convert.</div>';
    }

    excelPanel.classList.add('visible');
    showToast('✅ Conversion Successful!');
});

// ------------------ Export Buttons ------------------
exportXlsxBtn.addEventListener('click', ()=>{
    if (!workbook) return;
    downloadWorkbook(workbook, currentFilename+'.xlsx','xlsx');
});
exportXlsBtn.addEventListener('click', ()=>{
    if (!workbook) return;
    downloadWorkbook(workbook, currentFilename+'.xls','xls');
});

// ------------------ Toast ------------------
function showToast(text){
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(()=>{
        toast.classList.remove('show');
        if (excelPanel.classList.contains('visible')){
            const rect = excelPanel.getBoundingClientRect();
            const top = window.scrollY + rect.top - 20;
            window.scrollTo({top, behavior:'smooth'});
        }
    }, 3000);
}
