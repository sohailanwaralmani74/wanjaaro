// ------------------ DOM Elements ------------------
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const convertBtn = document.getElementById('convertBtn');
const qifPreview = document.getElementById('qifPreview');
const csvPanel = document.getElementById('csvPanel');
const csvPreview = document.getElementById('csvPreview');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const toast = document.getElementById('toast');

let rawQifText = '';
let transactions = [];
let currentFilename = 'converted';
let accountType = '';

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

// ------------------ File Upload ------------------
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    currentFilename = file.name.replace(/\.[^/.]+$/, '') || currentFilename;

    const reader = new FileReader();
    reader.onload = function(ev) {
        rawQifText = ev.target.result;
        renderQifPreview(rawQifText);
        convertBtn.disabled = false;
        csvPanel.classList.remove('visible');
        accountType = ''; // reset
    };
    reader.readAsText(file);
});

// ------------------ Preview QIF ------------------
function renderQifPreview(text) {
    qifPreview.innerHTML = '';
    if (!text) {
        qifPreview.innerHTML = '<div class="small">QIF file empty or failed to parse.</div>';
        return;
    }
    const pre = document.createElement('pre');
    pre.textContent = text;
    qifPreview.appendChild(pre);
    qifPreview.scrollTop = 0;
}

// ------------------ Parse QIF Dynamically ------------------
function parseQIF(text) {
    const lines = text.split(/\r?\n/);
    const txns = [];
    let txn = {};

    lines.forEach(line => {
        if (!line) return;

        // Handle account type
        if (line.startsWith('!Type:')) {
            accountType = line.slice(6).trim();
            return;
        }

        // End of transaction
        if (line === '^') {
            if (Object.keys(txn).length > 0) {
                // Include account type as a column if available
                if (accountType) txn['AccountType'] = accountType;
                txns.push({ ...txn });
            }
            txn = {};
            return;
        }

        // Extract field code
        const key = line[0];
        const value = line.slice(1).trim();

        if (commonFieldMap[key]) {
            txn[commonFieldMap[key]] = value;
        } else {
            // Unknown field, store as-is using code as column
            txn[key] = value;
        }
    });

    return txns;
}

// ------------------ Generate CSV Array ------------------
function transactionsToCSVArray(txns) {
    const headersSet = new Set();

    // Collect all column names dynamically
    txns.forEach(tx => Object.keys(tx).forEach(key => headersSet.add(key)));

    const headers = Array.from(headersSet);
    const array = [headers];

    txns.forEach(tx => {
        const row = headers.map(h => tx[h] || '');
        array.push(row);
    });

    return array;
}

// ------------------ Render CSV Preview ------------------
function renderCSVPreview(array) {
    csvPreview.innerHTML = '';
    if (!array || array.length === 0) {
        csvPreview.innerHTML = '<div class="small">No transactions to display.</div>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'sheet';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Header
    const headerRow = document.createElement('tr');
    array[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Body
    for (let i = 1; i < array.length; i++) {
        const row = document.createElement('tr');
        array[i].forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    csvPreview.appendChild(table);
}

// ------------------ Convert Button ------------------
convertBtn.addEventListener('click', () => {
    if (!rawQifText) return;

    transactions = parseQIF(rawQifText);
    const csvArray = transactionsToCSVArray(transactions);
    renderCSVPreview(csvArray);
    csvPanel.classList.add('visible');

    showToast('✅ Conversion Successful!');
});

// ------------------ Export CSV ------------------
exportCsvBtn.addEventListener('click', () => {
    if (!transactions || transactions.length === 0) return;

    const csvArray = transactionsToCSVArray(transactions);
    const csvLines = csvArray.map(row => row.map(cell => {
        let text = String(cell).replace(/"/g, '""');
        if (text.includes(',') || text.includes('"')) text = `"${text}"`;
        return text;
    }).join(','));

    const csvContent = csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename + '.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
    }, 5000);

    showToast('✅ CSV Exported!');
});

// ------------------ Toast Function ------------------
function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        if (csvPanel.classList.contains('visible')) {
            const rect = csvPanel.getBoundingClientRect();
            const top = window.scrollY + rect.top - 20;
            window.scrollTo({ top, behavior:'smooth' });
        }
    }, 3000);
}
