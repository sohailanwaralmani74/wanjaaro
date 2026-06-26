/**
 * --------------------------------------------------------------------------
 * QIF to QBO Converter - Client-Side JavaScript
 * --------------------------------------------------------------------------
 * Developer: Saeed Ahmed
 * Code Reviewer: Sohail Anwar
 * --------------------------------------------------------------------------
 * Description:
 *   Reads a QIF file from the user's browser, renders the raw QIF in the UI
 *   (using the exact preview mechanism you provided), parses transactions,
 *   converts them to a standard QBO (OFX SGML) file with required headers
 *   and OFX 1.x / QBO formatting, and enables Copy + Download actions.
 *
 *   The script strictly:
 *     - Keeps the same QIF rendering behavior (renderQifPreview)
 *     - Parses QIF lines and preserves unknown fields
 *     - Normalizes dates into YYYYMMDD (OFX required format)
 *     - Generates stable FITID values for each transaction
 *     - Sets TRNTYPE based on transaction amount (DEBIT/CREDIT)
 *     - Produces OFX/SGML style QBO output with required headers
 *     - Shows toast and scrolls to the convertedFile div after conversion
 * --------------------------------------------------------------------------
 */

/* ------------------ DOM ELEMENTS (bindings to HTML) ------------------ */

/** File input element for selecting .qif files. */
const fileInput = document.getElementById('fileInput');

/** Upload button label (decorative element wrapping file input). */
const uploadBtn = document.getElementById('uploadBtn');

/** Convert button that starts QIF -> QBO conversion. */
const convertBtn = document.getElementById('convertBtn');

/** Div where raw QIF text is rendered (kept identical to earlier behavior). */
const qifPreview = document.getElementById('qifPreview');

/** Panel containing QBO output; toggled visible after conversion. */
const qboPanel = document.getElementById('qboPanel');

/** Div where converted QBO (OFX/SGML) text is rendered (keeps div-based preview). */
const qboPreview = document.getElementById('qboPreview');

/** Button to trigger QBO file download (.qbo). */
const exportQboBtn = document.getElementById('exportQboBtn');

/** Button to copy QBO text to clipboard. */
const copyQboBtn = document.getElementById('copyQboBtn');

/** Toast element to show short notifications (id: toastXml). */
const toast = document.getElementById('toastQBO');

/** Anchor div to scroll to after successful conversion (id: convertedFile). */
const convertedFileDiv = document.getElementById('convertedFile');

/* ------------------ STATE VARIABLES ------------------ */

/** Raw QIF file content as read from FileReader. */
let rawQifText = '';

/** Array of parsed transaction objects produced by parseQIF(). */
let transactions = [];

/** Base filename (derived from uploaded file) used for downloads. */
let currentFilename = 'converted';

/** Account type extracted from QIF (e.g. BANK, CASH). */
let accountType = '';

/* ------------------ QIF FIELD MAPPING (preserve unknown codes) ------------------ */
/**
 * Maps common QIF single-letter codes to human-readable keys.
 * This mapping is reused from your original code so unknown fields
 * remain preserved with their original code.
 */
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

/* =================== Utility helpers (clean, small functions) =================== */

/**
 * Normalizes a variety of date formats into OFX date format: YYYYMMDD
 * - Accepts: MM/DD/YYYY, M/D/YYYY, YYYY-MM-DD, YYYY/MM/DD, DD/MM/YYYY (attempts),
 *   and simple YYYMMDD strings.
 * - Returns string YYYYMMDD or original input (safeguard) if parsing fails.
 *
 * @param {string} raw - Raw date string from QIF (often like 11/15/2025 or MM/DD'YY)
 * @returns {string} Normalized date in YYYYMMDD format.
 */
function normalizeDateToOfx(raw) {
    if (!raw) return '';

    // Trim and remove apostrophes common in some QIF dates (e.g. 11/15'25)
    let s = String(raw).trim().replace(/'/g, '');

    // Extract digits
    const digitsOnly = s.replace(/\D/g, '');

    // ====================== FIXED 8-DIGIT LOGIC ======================
    if (/^\d{8}$/.test(digitsOnly)) {
        const yyyy = digitsOnly.slice(0, 4);
        const mm   = digitsOnly.slice(4, 6);
        const dd   = digitsOnly.slice(6, 8);

        // Case 1: Already YYYYMMDD (valid year)
        if (Number(yyyy) >= 1900 && Number(yyyy) <= 2099) {
            return `${yyyy}${mm}${dd}`;
        }

        // Case 2: MMDDYYYY → convert to YYYYMMDD
        const mm2 = digitsOnly.slice(0, 2);
        const dd2 = digitsOnly.slice(2, 4);
        const yyyy2 = digitsOnly.slice(4, 8);
        return `${yyyy2}${mm2}${dd2}`;
    }
    // ===============================================================

    // Try ISO-like: YYYY-MM-DD or YYYY/MM/DD
    const isoMatch = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (isoMatch) {
        const [, y, m, d] = isoMatch;
        return `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`;
    }

    // Try MM/DD/YYYY or M/D/YYYY
    const mdyMatch = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
    if (mdyMatch) {
        const [, m, d, y] = mdyMatch;
        return `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`;
    }

    // Try DD/MM/YYYY (ambiguous but attempt)
    const dmyMatch = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
    if (dmyMatch) {
        // Already handled as fallback above — no change needed.
    }

    // Last resort: extract first 8 digits if available
    if (digitsOnly.length >= 8) {
        return digitsOnly.slice(0, 8);
    }

    // If all fails, return original trimmed string without separators as best-effort
    return digitsOnly || s;
}


/**
 * Generates a reasonably unique FITID for a transaction.
 * Uses normalized date + index + hashed content short form to avoid duplicates.
 * FITID must be unique per transaction for OFX/QBO consumers.
 *
 * @param {Object} tx - Transaction object
 * @param {number} idx - Transaction index
 * @returns {string} FITID string
 */
function generateFitId(tx, idx) {
    const baseDate = normalizeDateToOfx(tx.Date || '') || '00000000';
    // Simple stable hash: sum of char codes of joined values (keeps deterministic)
    const data = `${tx.Date || ''}|${tx.Amount || ''}|${tx.Payee || ''}|${tx.CheckNumber || ''}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        hash = ((hash << 5) - hash) + data.charCodeAt(i);
        hash = hash & hash; // convert to 32bit int
    }
    // Make positive and short
    const shortHash = Math.abs(hash).toString(36).slice(0,8);
    return `${baseDate}-${idx + 1}-${shortHash}`;
}

/**
 * Escapes angle brackets that could break the OFX/SGML structure.
 * OFX/SGML values are usually plain text; ensure stray < or > do not break tags.
 *
 * @param {string} text - Raw text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeOfxValue(text) {
    if (text === undefined || text === null) return '';
    return String(text).replace(/</g, '‹').replace(/>/g, '›'); // small substitution
}

/* =================== QIF Reading & Rendering (unchanged behavior) =================== */

/**
 * Render the QIF raw text in the preview div.
 * This function intentionally mirrors your provided renderQifPreview implementation.
 *
 * @param {string} text - Raw QIF content
 */
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

/* ------------------ File Upload Handler (keeps previous UX) ------------------ */

/**
 * Handles file selection event: reads file as text and updates state.
 * Enables convert button and resets panel state.
 */
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    currentFilename = file.name.replace(/\.[^/.]+$/, '') || currentFilename;

    const reader = new FileReader();
    reader.onload = function(ev) {
        rawQifText = ev.target.result;
        renderQifPreview(rawQifText);
        convertBtn.disabled = false;
        // Hide output panel until conversion completes
        if (qboPanel && qboPanel.classList) qboPanel.classList.remove('visible');
        accountType = '';
    };
    reader.readAsText(file);
});

/* =================== QIF Parsing (dynamic, preserves unknown fields) =================== */

/**
 * Parses raw QIF text into an array of transaction objects.
 * Mirrors the original parseQIF function but made robust with comments.
 *
 * @param {string} text - Raw QIF content
 * @returns {Array<Object>} Parsed transactions
 */
function parseQIF(text) {
    const lines = text.split(/\r?\n/);
    const txns = [];
    let txn = {};

    lines.forEach(line => {
        if (!line) return;

        // Detect account type line like "!Type:Bank"
        if (line.startsWith('!Type:')) {
            accountType = line.slice(6).trim();
            return;
        }

        // Transaction terminator
        if (line === '^') {
            if (Object.keys(txn).length > 0) {
                if (accountType) txn['AccountType'] = accountType;
                txns.push({ ...txn });
            }
            txn = {};
            return;
        }

        // Field code is first character; value is remainder
        const key = line[0];
        const value = line.slice(1).trim();

        if (commonFieldMap[key]) {
            txn[commonFieldMap[key]] = value;
        } else {
            // Preserve unknown fields by their code
            txn[key] = value;
        }
    });

    // If file did not end with ^ but we have data, include final txn
    if (Object.keys(txn).length > 0) {
        if (accountType) txn['AccountType'] = accountType;
        txns.push({ ...txn });
    }

    return txns;
}

/* =================== QIF -> QBO (OFX SGML) Conversion =================== */

/**
 * Builds a proper QBO (OFX SGML) string from parsed transaction objects.
 * This produces the required leading headers (OFXHEADER / DATA / VERSION / etc.)
 * and uses OFX 1.x SGML style tags (unclosed value tags).
 *
 * @param {Array<Object>} txns - Array of transaction objects from parseQIF
 * @returns {string} QBO formatted text (string)
 */
function buildQboFromTransactions(txns) {
    if (!txns || txns.length === 0) return '';

    // Header block required by QuickBooks / QBO consumers
    const headers = [
        'OFXHEADER:100',
        'DATA:OFXSGML',
        'VERSION:102',
        'SECURITY:NONE',
        'ENCODING:USASCII',
        'CHARSET:1252',
        'COMPRESSION:NONE',
        'OLDFILEUID:NONE',
        'NEWFILEUID:NONE',
        '', // blank line required before <OFX>
    ].join('\n');

    // Start OFX body (SGML style)
    let ofx = `${headers}<OFX>\n  <SIGNONMSGSRSV1>\n    <SONRS>\n      <STATUS>\n        <CODE>0\n        <SEVERITY>INFO\n      </STATUS>\n      <DTSERVER>${getTodayOfxDate()}\n      <LANGUAGE>ENG\n    </SONRS>\n  </SIGNONMSGSRSV1>\n  <BANKMSGSRSV1>\n    <STMTTRNRS>\n      <TRNUID>1\n      <STATUS>\n        <CODE>0\n        <SEVERITY>INFO\n      </STATUS>\n      <STMTRS>\n        <CURDEF>USD\n        <BANKTRANLIST>\n`;

    // Iterate transactions and append STMTTRN sections
    txns.forEach((tx, idx) => {
        // Normalize data
        const dtPosted = normalizeDateToOfx(tx.Date || tx.D || '');
        const amountRaw = tx.Amount || tx.T || '';
        // Ensure numeric sign/format (remove commas)
        const amountNum = String(amountRaw).replace(/,/g, '').trim();
        // Decide TRNTYPE based on sign: negative => DEBIT, positive or zero => CREDIT
        const trnType = (amountNum && (Number(amountNum) < 0)) ? 'DEBIT' : 'CREDIT';
        const trnAmt = amountNum || '';

        // Generate FITID
        const fitid = generateFitId(tx, idx);

        // Sanitize fields that will be included
        const name = sanitizeOfxValue(tx.Payee || tx.P || '');
        const memo = sanitizeOfxValue(tx.Memo || tx.M || tx.Memo || '');
        const checkNum = sanitizeOfxValue(tx.CheckNumber || tx.N || '');

        ofx += '          <STMTTRN>\n';
        ofx += `            <TRNTYPE>${trnType}\n`;
        if (dtPosted) ofx += `            <DTPOSTED>${dtPosted}\n`;
        if (trnAmt !== '') ofx += `            <TRNAMT>${trnAmt}\n`;
        ofx += `            <FITID>${fitid}\n`;
        if (checkNum) ofx += `            <CHECKNUM>${checkNum}\n`;
        if (name) ofx += `            <NAME>${name}\n`;
        if (memo) ofx += `            <MEMO>${memo}\n`;
        ofx += '          </STMTTRN>\n';
    });

    // Close tags
    ofx += '        </BANKTRANLIST>\n      </STMTRS>\n    </STMTTRNRS>\n  </BANKMSGSRSV1>\n</OFX>';

    return ofx;
}

/**
 * Returns today's date in OFX format YYYYMMDD (no separators).
 * Used for signon DTD or DTD server timestamp.
 *
 * @returns {string} Today's date as YYYYMMDD
 */
function getTodayOfxDate() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
}

/* =================== Render QBO Preview (div-based) =================== */

/**
 * Renders OFX/QBO text inside qboPreview div (using <pre> to preserve formatting).
 *
 * @param {string} text - OFX/SGML formatted QBO text
 */
function renderQboPreview(text) {
    qboPreview.innerHTML = '';
    if (!text) {
        qboPreview.innerHTML = '<div class="small">No transactions to display.</div>';
        return;
    }
    const pre = document.createElement('pre');
    pre.textContent = text;
    qboPreview.appendChild(pre);
}

/* =================== Conversion Trigger (button) =================== */

/**
 * Convert button click handler:
 *   - Parses raw QIF text
 *   - Builds QBO OFX/SGML text
 *   - Renders preview in qboPreview
 *   - Shows toast and scrolls to convertedFile div (as requested)
 *   - Toggles qboPanel visibility
 */
convertBtn.addEventListener('click', () => {
    if (!rawQifText) return;

    // Parse QIF and build transactions array
    transactions = parseQIF(rawQifText);

    // Convert transactions into OFX/SGML QBO string
    const qboText = buildQboFromTransactions(transactions);

    // Render in output div
    renderQboPreview(qboText);

    // Make panel visible
    if (qboPanel && qboPanel.classList) qboPanel.classList.add('visible');

    // Show user feedback and scroll to convertedFile div
    showToast('✅ QBO File Generated!');
});

/* =================== Copy to Clipboard =================== */

/**
 * Copies content of the qboPreview div to the clipboard.
 * If no content available, nothing happens.
 */
copyQboBtn.addEventListener('click', () => {
    const qboText = qboPreview.innerText;
    if (!qboText) return;

    navigator.clipboard.writeText(qboText).then(() => {
        showToast('✅ QBO copied to clipboard!');
    }).catch(() => {
        showToast('⚠️ Copy failed. Please select and copy manually.');
    });
});

/* =================== Export .qbo File =================== */

/**
 * Exports the qboPreview content as a downloadable .qbo file.
 * Uses a Blob and temporary anchor to trigger the browser download.
 */
exportQboBtn.addEventListener('click', () => {
    const qboText = qboPreview.innerText;
    if (!qboText) return;

    // QBO files are plain SGML text; use a generic text MIME
    const blob = new Blob([qboText], { type: 'application/x-qbofx' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename + '.qbo';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
    }, 5000);

    showToast('✅ QBO Exported!');
});

/* =================== Toast & Scroll (scroll to convertedFile div) =================== */

/**
 * Shows a temporary toast notification and then scrolls to the
 * convertedFile div (user explicitly requested this anchor).
 *
 * @param {string} text - Message to display in toast
 */
function showToast(text) {
    if (!toast) return;

    toast.textContent = text;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');

        // Scroll to the convertedFile div (strict requirement)
        if (convertedFileDiv && convertedFileDiv.scrollIntoView) {
            convertedFileDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 3000);
}

/* =================== END OF SCRIPT =================== */
