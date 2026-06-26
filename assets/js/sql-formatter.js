/* =================================================================
   DATAFROG SQL FORMATTER ENGINE  v2
   - CodeMirror 5 editor (MIT)
   - Enhanced tokenizer: backtick/quoted identifiers, multi-char ops
   - Improved formatter: proper clause indentation, subquery support,
     CASE/WHEN alignment, JOIN ON alignment, aliasing, semicolons
   - Minifier with comment stripping
   - Metadata: tables, columns, query type, joins
   - UX: status bar, toast, CLEAR, DOWNLOAD, Ctrl+Enter shortcut,
     bracket matching, active-line highlight, auto-close brackets
================================================================= */

// ---------- DOM ----------
const sqlInputEl   = document.getElementById('sqlInput');
const formatBtn    = document.getElementById('formatBtn');
const minifyBtn    = document.getElementById('minifyBtn');
const copyBtn      = document.getElementById('copyBtn');
const clearBtn     = document.getElementById('clearBtn');
const loadSampleBtn= document.getElementById('loadSampleBtn');
const extractMetaBtn=document.getElementById('extractMetaBtn');
const downloadBtn  = document.getElementById('downloadBtn');
const caseSelect   = document.getElementById('caseSelect');
const indentSelect = document.getElementById('indentSelect');
const styleSelect  = document.getElementById('styleSelect');
const fileUpload   = document.getElementById('sqlFileUpload');
const tableListDiv = document.getElementById('tableList');
const columnListDiv= document.getElementById('columnList');
const queryTypeDiv = document.getElementById('queryType');
const joinListDiv  = document.getElementById('joinList');
const statLines    = document.getElementById('statLines');
const statChars    = document.getElementById('statChars');
const statCursor   = document.getElementById('statCursor');
const statMsg      = document.getElementById('statMsg');
const toastEl      = document.getElementById('toast');

// ---------- CodeMirror ----------
const editor = CodeMirror(document.getElementById('cmEditor'), {
    mode            : 'text/x-sql',
    theme           : 'dracula',
    lineNumbers     : true,
    lineWrapping    : true,
    tabSize         : 4,
    indentWithTabs  : false,
    autofocus       : true,
    matchBrackets   : true,
    autoCloseBrackets: true,
    styleActiveLine : true,
    extraKeys: {
        'Ctrl-Enter' : onFormat,
        'Cmd-Enter'  : onFormat,
        'Ctrl-/'     : (cm) => cm.toggleComment(),
        'Cmd-/'      : (cm) => cm.toggleComment(),
    }
});

function getValue() { return editor.getValue(); }
function setValue(v) {
    editor.setValue(v);
    editor.refresh();
    updateStatus();
    updateButtonsState();
}

const sqlInput = {
    get value() { return editor.getValue(); },
    set value(v) { setValue(v); }
};

editor.on('change', () => {
    sqlInputEl.value = editor.getValue();
    updateButtonsState();
    updateStatus();
    if (!editor.getValue().trim()) clearMeta();
});

editor.on('cursorActivity', updateStatus);

// ---------- Status Bar ----------
function updateStatus() {
    const val  = editor.getValue();
    const cur  = editor.getCursor();
    const sel  = editor.getSelection();
    statLines.textContent  = editor.lineCount();
    statChars.textContent  = val.length;
    statCursor.textContent = `${cur.line + 1}:${cur.ch + 1}`;
    statMsg.textContent    = sel.length > 0 ? `${sel.length} chars selected` : '';
}

// ---------- Toast ----------
let toastTimer;
function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

// ---------- Button state ----------
function updateButtonsState() {
    const has = editor.getValue().trim().length > 0;
    [formatBtn, minifyBtn, copyBtn, clearBtn, extractMetaBtn, downloadBtn].forEach(b => b.disabled = !has);
}

// =================================================================
//  TOKENIZER
// =================================================================
const SQL_KEYWORDS = new Set([
    'SELECT','FROM','WHERE','JOIN','INNER','LEFT','RIGHT','OUTER','FULL','CROSS',
    'ON','AND','OR','NOT','IN','EXISTS','BETWEEN','LIKE','ILIKE','IS','NULL',
    'ORDER','BY','GROUP','HAVING','LIMIT','OFFSET','UNION','ALL','DISTINCT','TOP',
    'AS','INSERT','INTO','UPDATE','DELETE','SET','VALUES','CREATE','ALTER','DROP',
    'TABLE','INDEX','VIEW','WITH','RECURSIVE','CASE','WHEN','THEN','ELSE','END',
    'CAST','PRIMARY','KEY','FOREIGN','REFERENCES','CONSTRAINT','RETURNING',
    'OVER','PARTITION','ROWS','RANGE','PRECEDING','FOLLOWING','UNBOUNDED',
    'CURRENT','ROW','FETCH','NEXT','ONLY','TIES','ROLLUP','CUBE','GROUPING',
    'SETS','LATERAL','APPLY','PIVOT','UNPIVOT','MERGE','MATCHED','USING','OUTPUT',
    'TRUNCATE','EXPLAIN','ANALYZE','VACUUM','REPLACE','IGNORE','STRAIGHT_JOIN',
    'SQL_CALC_FOUND_ROWS','SERIAL','BIGSERIAL','IF','ELSE','BEGIN','COMMIT',
    'ROLLBACK','TRANSACTION','SAVEPOINT','RELEASE','LOCK','UNLOCK','CALL'
]);

const SQL_FUNCTIONS = new Set([
    'COUNT','SUM','AVG','MAX','MIN','LOWER','UPPER','TRIM','LENGTH','LEN',
    'SUBSTRING','SUBSTR','CONCAT','CONCAT_WS','COALESCE','NULLIF','IFNULL','NVL',
    'NOW','DATE','DATEADD','DATEDIFF','YEAR','MONTH','DAY','HOUR','MINUTE',
    'SECOND','GETDATE','SYSDATE','CURRENT_DATE','CURRENT_TIME','CURRENT_TIMESTAMP',
    'CAST','CONVERT','TO_CHAR','TO_DATE','TO_NUMBER','ROUND','CEIL','CEILING',
    'FLOOR','ABS','MOD','POWER','SQRT','RANDOM','RAND','NEWID','UUID',
    'ROW_NUMBER','RANK','DENSE_RANK','NTILE','LAG','LEAD','FIRST_VALUE',
    'LAST_VALUE','NTH_VALUE','LISTAGG','STRING_AGG','GROUP_CONCAT',
    'REPLACE','STUFF','CHARINDEX','INSTR','POSITION','LOCATE','LPAD','RPAD',
    'LTRIM','RTRIM','REPEAT','REVERSE','SPLIT_PART','REGEXP_REPLACE',
    'ARRAY_AGG','JSON_AGG','JSONB_AGG','JSON_OBJECT','JSON_ARRAY',
    'DECODE','IIF','CHOOSE','GREATEST','LEAST','SIGN'
]);

const DIALECT_EXTRAS = {
    mysql     : new Set(['STRAIGHT_JOIN','SQL_CALC_FOUND_ROWS','LIMIT','OFFSET']),
    postgresql: new Set(['RETURNING','ILIKE','SERIAL','BIGSERIAL','LATERAL','OVER'])
};

function getKeywordSet() {
    const extra = DIALECT_EXTRAS[styleSelect.value] || new Set();
    return { kw: new Set([...SQL_KEYWORDS, ...extra]), fn: SQL_FUNCTIONS };
}

function tokenize(sql) {
    const tokens = [];
    let i = 0;
    const len = sql.length;
    const { kw, fn } = getKeywordSet();

    while (i < len) {
        const ch = sql[i];

        // Whitespace
        if (/\s/.test(ch)) {
            let s = i;
            while (i < len && /\s/.test(sql[i])) i++;
            tokens.push({ type: 'whitespace', value: sql.slice(s, i) });
            continue;
        }

        // Line comment
        if (ch === '-' && sql[i+1] === '-') {
            let s = i; i += 2;
            while (i < len && sql[i] !== '\n') i++;
            tokens.push({ type: 'comment', value: sql.slice(s, i) });
            continue;
        }

        // Block comment
        if (ch === '/' && sql[i+1] === '*') {
            let s = i; i += 2;
            while (i < len && !(sql[i] === '/' && sql[i-1] === '*')) i++;
            i++;
            tokens.push({ type: 'comment', value: sql.slice(s, i) });
            continue;
        }

        // Single-quoted string
        if (ch === "'") {
            let s = i; i++;
            while (i < len) {
                if (sql[i] === "'" && sql[i+1] === "'") { i += 2; continue; } // escaped ''
                if (sql[i] === "'" ) { i++; break; }
                if (sql[i] === '\\') i++;
                i++;
            }
            tokens.push({ type: 'string', value: sql.slice(s, i) });
            continue;
        }

        // Double-quoted identifier
        if (ch === '"') {
            let s = i; i++;
            while (i < len && sql[i] !== '"') { if (sql[i] === '\\') i++; i++; }
            i++;
            tokens.push({ type: 'identifier', value: sql.slice(s, i), quoted: true });
            continue;
        }

        // Backtick identifier (MySQL)
        if (ch === '`') {
            let s = i; i++;
            while (i < len && sql[i] !== '`') i++;
            i++;
            tokens.push({ type: 'identifier', value: sql.slice(s, i), quoted: true });
            continue;
        }

        // Numbers (including decimals and negatives after operator)
        if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(sql[i+1]))) {
            let s = i;
            if (ch === '.') i++;
            while (i < len && /[0-9eE._]/.test(sql[i])) i++;
            tokens.push({ type: 'number', value: sql.slice(s, i) });
            continue;
        }

        // Identifiers & keywords
        if (/[a-zA-Z_#@]/.test(ch)) {
            let s = i;
            while (i < len && /[a-zA-Z0-9_$#@]/.test(sql[i])) i++;
            const word = sql.slice(s, i);
            const up   = word.toUpperCase();
            if (kw.has(up))        tokens.push({ type: 'keyword',    value: word });
            else if (fn.has(up))   tokens.push({ type: 'function',   value: word });
            else                   tokens.push({ type: 'identifier', value: word });
            continue;
        }

        // Multi-char operators
        if (i + 1 < len) {
            const two = sql.slice(i, i+2);
            if (['<>','!=','<=','>=','::','||'].includes(two)) {
                tokens.push({ type: 'operator', value: two }); i += 2; continue;
            }
        }

        // Single-char
        if ('=<>!+-*/%^&|~'.includes(ch)) {
            tokens.push({ type: 'operator', value: ch }); i++; continue;
        }
        if (',;().[]:'.includes(ch)) {
            tokens.push({ type: 'symbol', value: ch }); i++; continue;
        }

        tokens.push({ type: 'unknown', value: ch }); i++;
    }
    return tokens;
}

// =================================================================
//  FORMATTER
// =================================================================

// Keywords that always start a new top-level line (at indent 0 inside a statement)
const CLAUSE_STARTERS = new Set([
    'SELECT','FROM','WHERE','JOIN','INNER','LEFT','RIGHT','OUTER','FULL','CROSS',
    'ORDER','GROUP','HAVING','LIMIT','OFFSET','UNION','EXCEPT','INTERSECT',
    'INSERT','INTO','UPDATE','DELETE','SET','VALUES','CREATE','ALTER','DROP',
    'WITH','ON','RETURNING','MERGE','USING','OUTPUT','TRUNCATE','EXPLAIN'
]);

// Keywords that go on the same line as JOIN (LEFT JOIN, INNER JOIN, etc.)
const JOIN_MODIFIERS = new Set(['INNER','LEFT','RIGHT','OUTER','FULL','CROSS']);

function applyCase(word, mode) {
    if (mode === 'upper') return word.toUpperCase();
    if (mode === 'lower') return word.toLowerCase();
    return word;
}

function formatSQL(sql) {
    if (!sql.trim()) return '';

    const indent     = indentSelect.value === 'tab' ? '\t' : ' '.repeat(parseInt(indentSelect.value));
    const caseMode   = caseSelect.value;
    const tokens     = tokenize(sql).filter(t => t.type !== 'whitespace');

    const lines      = [];
    let   cur        = '';
    let   depth      = 0;          // current subquery nesting level
    let   parenStack = [];          // tracks '(' contexts: 'subquery', 'func', 'list', 'inlist', 'select-cols'
    let   clauseDepth= [0];         // base indent per subquery level

    // FIX 1: pad() now adds an extra indent for 'select-cols' context
    const pad = () => indent.repeat(
        clauseDepth[depth] + (
            parenStack.length > 0 && 
            (parenStack[parenStack.length-1] === 'list' || 
             parenStack[parenStack.length-1] === 'inlist' ||
             parenStack[parenStack.length-1] === 'select-cols' ||
             parenStack[parenStack.length-1] === 'case') ? 1 : 0
        )
    );
    function flush() { if (cur.trim()) { lines.push(cur); cur = ''; } }
    function kw(v)   { return applyCase(v, caseMode); }

    for (let i = 0; i < tokens.length; i++) {
        const tok  = tokens[i];
        const val  = tok.value;
        const upv  = val.toUpperCase();
        const next = tokens[i+1];
        const prev = tokens[i-1];

        // Comments
        if (tok.type === 'comment') {
            flush();
            lines.push(pad() + val);
            continue;
        }
        // Semicolon
        if (val === ';') {
            cur += ';';
            flush();
            lines.push('');
            clauseDepth = [0];
            depth = 0;
            parenStack = [];
            continue;
        }
        // Opening parenthesis
        if (val === '(') {
            const nextMeaningful = tokens.slice(i+1).find(t => t.type !== 'whitespace');
            // Check for subquery
            if (nextMeaningful && nextMeaningful.value.toUpperCase() === 'SELECT') {
                cur += '(';
                flush();
                depth++;
                clauseDepth.push(clauseDepth[depth-1] + 1);
                parenStack.push('subquery');
            } else if (prev && prev.type === 'function') {
                cur += '(';
                parenStack.push('func');
            } else {
                cur += '(';
                // Check if this '(' belongs to an IN list
                if (prev && prev.value.toUpperCase() === 'IN') {
                    parenStack.push('inlist');
                } else {
                    parenStack.push('list');
                }
            }
            continue;
        }
        // Closing parenthesis
        if (val === ')') {
            const ctx = parenStack.pop() || 'list';
            if (ctx === 'subquery') {
                // Do NOT flush; append ')' to the current line (which contains the subquery's last token)
                cur += ')';
                flush();   // then push the line
                depth--;
                clauseDepth.pop();
                // After closing, we may need to continue; the next token (e.g., AS alias) will be on a new line
                // But we should not set cur here – it will be set by the next token's logic.
                // However, to keep the current line clean, we flush and leave cur empty.
                // The next flush() already happened.
                continue;
            } else if (ctx === 'func') {
                cur += ')';
            } else {
                cur += ')';
            }
            continue;
        }
        // CASE … END
        if (upv === 'CASE') {
            flush();
            cur = pad() + kw(val);
            parenStack.push('case');
            // Do NOT push an extra clauseDepth level; rely on pad()'s +1 for 'case' context
            continue;
        }
        if (upv === 'WHEN' || upv === 'ELSE') {
            flush();
            cur = pad() + kw(val) + ' ';
            continue;
        }
        if (upv === 'THEN') {
            cur += ' ' + kw(val) + ' ';
            continue;
        }
        if (upv === 'END') {
            const caseCtx = parenStack.lastIndexOf('case');
            if (caseCtx !== -1) {
                flush();
                parenStack.splice(caseCtx, 1);
                cur = pad() + kw(val);
            } else {
                cur += ' ' + kw(val);
            }
            continue;
        }

        // ---- JOIN modifiers: consume LEFT [OUTER] JOIN as one unit ----
        if (tok.type === 'keyword' && JOIN_MODIFIERS.has(upv)) {
            let n = i + 1;
            let phrase = kw(val);
            // Optional OUTER
            if (n < tokens.length && tokens[n].value.toUpperCase() === 'OUTER') {
                phrase += ' ' + kw('OUTER');
                n++;
            }
            // Required JOIN
            if (n < tokens.length && tokens[n].value.toUpperCase() === 'JOIN') {
                phrase += ' ' + kw('JOIN');
                flush();
                cur = indent.repeat(clauseDepth[depth]) + phrase;
                i = n;   // skip consumed tokens
                // If next token after JOIN is '(', add a space
                if (i+1 < tokens.length && tokens[i+1].value === '(') {
                    cur += ' ';
                }
                continue;
            }
        }

        // ---- Clause starters (including EXISTS and IN) ----
        if (tok.type === 'keyword' && CLAUSE_STARTERS.has(upv) && parenStack.every(c => c !== 'func')) {
            // Special: UNION / EXCEPT / INTERSECT
            if (['UNION','EXCEPT','INTERSECT'].includes(upv)) {
                flush();
                lines.push('');
                cur = indent.repeat(clauseDepth[depth]) + kw(val);
                const peekAll = tokens[i+1];
                if (peekAll && peekAll.value.toUpperCase() === 'ALL') {
                    cur += ' ' + kw(peekAll.value);
                    i++;
                }
                flush();
                lines.push('');
                continue;
            }
            // SELECT – FIX 2: use pad() for column indentation
            if (upv === 'SELECT') {
                flush();
                cur = indent.repeat(clauseDepth[depth]) + kw(val);
                flush();
                clauseDepth.push((clauseDepth[clauseDepth.length-1] || 0) + 1);
                parenStack.push('select-cols');
                cur = pad();   // <-- now uses pad() which includes select-cols indent
                continue;
            }
            // FROM (closes select-cols indent)
            if (upv === 'FROM') {
                const sIdx = parenStack.lastIndexOf('select-cols');
                if (sIdx !== -1) {
                    flush();
                    clauseDepth.pop();
                    parenStack.splice(sIdx, 1);
                }
                flush();
                cur = indent.repeat(clauseDepth[depth]) + kw(val) + ' ';
                continue;
            }
            // INTO after INSERT
            if (upv === 'INTO' && prev && prev.value.toUpperCase() === 'INSERT') {
                cur += ' ' + kw(val) + ' ';
                continue;
            }
            // WHERE / ON
            if (upv === 'WHERE' || upv === 'ON') {
                flush();
                cur = indent.repeat(clauseDepth[depth]) + kw(val) + ' ';
                continue;
            }
            // Default clause starter
            flush();
            cur = indent.repeat(clauseDepth[depth]) + kw(val) + ' ';
            continue;
        }

        // ---- EXISTS is not in CLAUSE_STARTERS by default, so we add a specific rule ----
                // ---- EXISTS is not in CLAUSE_STARTERS by default ----
        if (upv === 'EXISTS') {
            // If previous token was AND or OR, stay on same line (no flush, no indent)
            if (prev && (prev.value.toUpperCase() === 'AND' || prev.value.toUpperCase() === 'OR')) {
                if (!cur.endsWith(' ')) cur += ' ';
                cur += kw(val);
            } else {
                flush();
                cur = indent.repeat(clauseDepth[depth]) + kw(val);
            }
            // Add a space before '(' if next token is '('
            if (next && next.value === '(') {
                cur += ' ';
            }
            continue;
        }

        // ---- IN keyword: add space and indicate we are entering an IN list (handled by paren context) ----
        if (upv === 'IN') {
            if (cur.length > 0 && !cur.endsWith(' ')) cur += ' ';
            cur += kw(val) + ' ';
            continue;
        }

        // ---- AND / OR inside WHERE ----
        if (tok.type === 'keyword' && (upv === 'AND' || upv === 'OR') && parenStack.every(c => c !== 'func' && c !== 'case')) {
            flush();
            cur = indent.repeat(clauseDepth[depth] + 1) + kw(val) + ' ';
            continue;
        }

        // ---- Comma: flush unless inside a function, IN list, or GROUP BY clause ----
                // ---- Comma: flush unless inside a function, IN list, SELECT column list, or GROUP BY ----
                if (val === ',') {
            cur += ',';
            const context = parenStack.length > 0 ? parenStack[parenStack.length-1] : null;
            const isSelectCols = (context === 'select-cols');
            // Always flush in select-cols to put each column on a new line
            if (isSelectCols) {
                flush();
                cur = pad();   // same indentation as the first column
            } else {
                const keepInline = (context === 'func' || context === 'inlist');
                let isGroupBy = false;
                if (!keepInline) {
                    for (let j = i-1; j >= 0 && j > i-8; j--) {
                        if (tokens[j].type === 'keyword') {
                            const kwUp = tokens[j].value.toUpperCase();
                            if (kwUp === 'GROUP' || kwUp === 'BY') {
                                isGroupBy = true;
                                break;
                            }
                            if (kwUp === 'SELECT' || kwUp === 'FROM' || kwUp === 'WHERE') break;
                        }
                    }
                }
                if (!keepInline && !isGroupBy) {
                    flush();
                    cur = indent.repeat(clauseDepth[depth]);
                }
            }
            continue;
        }

        // ---- Operators: no spaces around dot or star ----
        if (tok.type === 'operator') {
            if (val === '.' || val === '*') {
                cur += val;
            } else {
                if (!cur.endsWith(' ')) cur += ' ';
                cur += val;
                if (next && next.type !== 'whitespace') cur += ' ';
            }
            continue;
        }

        // ---- Default append – with special dot/star handling (also symbols) ----
        if (val === '.' || val === '*') {
            cur += val;
        } else {
            // Add a leading space only if last character is not space, '(', or '.'
            if (cur.length > 0 && !cur.endsWith(' ') && !cur.endsWith('(') && !cur.endsWith('.')) {
                cur += ' ';
            }
            cur += tok.type === 'keyword' ? kw(val) : val;
        }
    }

    flush();

    // Post-process: fix IN list spacing and keep on one line
    let result = lines.map(l => l.trimEnd()).join('\n').replace(/\n{3,}/g, '\n\n');
    result = result.replace(/\bIN\s*\(\s*([^)]+?)\s*\)/gi, (m, p1) => {
        let items = p1.split(',').map(s => s.trim()).join(', ');
        return `IN (${items})`;
    });
    // Ensure space after EXISTS before '('
    result = result.replace(/\bEXISTS\s*\(/gi, 'EXISTS (');
    // Remove any remaining accidental spaces around dot (safety)
    result = result.replace(/\s*\.\s*/g, '.');
    // Ensure space after IN (in case the regex didn't catch)
    result = result.replace(/\bIN\s*\(/gi, 'IN (');
    return result.trim();
}

// =================================================================
//  MINIFIER
// =================================================================
function minifySQL(sql) {
    // Strip comments
    let s = sql
        .replace(/--[^\n]*/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '');
    // Collapse whitespace
    s = s.replace(/\s+/g, ' ').trim();
    // Tighten punctuation (keep space around operators for safety)
    s = s.replace(/\s*,\s*/g, ', ')
         .replace(/\s*;\s*/g, ';')
         .replace(/\s*\(\s*/g, '(')
         .replace(/\s*\)\s*/g, ')')
         .replace(/\s*\.\s*/g, '.');
    return s;
}

// =================================================================
//  METADATA EXTRACTION
// =================================================================
function extractMetadata(sql) {
    // Normalize: collapse whitespace, remove comments
    let normalized = sql.replace(/\s+/g, ' ').trim();
    normalized = normalized.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

    const tables = new Set();
    const columns = new Set();
    const joins = [];

    // ---- Extract CTE names ----
    const cteNames = new Set();
    const withMatch = normalized.match(/\bWITH\b\s+((?:[a-zA-Z_][a-zA-Z0-9_]*\s+AS\s*\([^)]*\)\s*,?\s*)+)/i);
    if (withMatch) {
        const ctePart = withMatch[1];
        const nameRe = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s+AS\s*\(/gi;
        let cteMatch;
        while ((cteMatch = nameRe.exec(ctePart)) !== null) {
            cteNames.add(cteMatch[1].toLowerCase());
        }
    }

    // ---- Extract tables (excluding CTEs) ----
    const tableRe = /\b(?:FROM|JOIN|INTO|UPDATE|TABLE)\s+([`"']?[a-zA-Z_][a-zA-Z0-9_.]*[`"']?)/gi;
    let m;
    while ((m = tableRe.exec(normalized)) !== null) {
        let table = m[1].replace(/[`"']/g, '');
        if (!cteNames.has(table.toLowerCase())) {
            tables.add(table);
        }
    }

    // ---- Extract main SELECT column list (robustly) ----
    function getMainSelectColumns(sqlText) {
        // Find the first SELECT at depth 0
        let selectIdx = -1;
        let depth = 0;
        const upper = sqlText.toUpperCase();
        for (let i = 0; i < upper.length; i++) {
            if (upper.substr(i, 6) === 'SELECT' && /[^a-zA-Z0-9_]/.test(upper[i-1] || ' ') && /[^a-zA-Z0-9_]/.test(upper[i+6] || ' ')) {
                if (depth === 0) {
                    selectIdx = i;
                    break;
                }
            }
            if (upper[i] === '(') depth++;
            else if (upper[i] === ')') depth--;
        }
        if (selectIdx === -1) return [];

        // Now find the matching FROM at depth 0, but ignore any FROM inside parentheses
        let fromIdx = -1;
        depth = 0;
        for (let i = selectIdx + 6; i < upper.length; i++) {
            const ch = upper[i];
            if (ch === '(') depth++;
            else if (ch === ')') depth--;
            else if (depth === 0 && upper.substr(i, 4) === 'FROM' && /[^a-zA-Z0-9_]/.test(upper[i-1] || ' ') && /[^a-zA-Z0-9_]/.test(upper[i+4] || ' ')) {
                fromIdx = i;
                break;
            }
        }
        if (fromIdx === -1) return [];

        let columnsPart = sqlText.substring(selectIdx + 6, fromIdx).trim();
        if (!columnsPart) return [];

        // Split by top-level commas (not inside parentheses or quotes)
        const colItems = [];
        let start = 0;
        depth = 0;
        let inString = false;
        let stringChar = '';
        for (let i = 0; i < columnsPart.length; i++) {
            const c = columnsPart[i];
            if (!inString && (c === "'" || c === '"')) {
                inString = true;
                stringChar = c;
            } else if (inString && c === stringChar && columnsPart[i-1] !== '\\') {
                inString = false;
            } else if (!inString && c === '(') {
                depth++;
            } else if (!inString && c === ')') {
                depth--;
            } else if (!inString && depth === 0 && c === ',') {
                let item = columnsPart.substring(start, i).trim();
                if (item) colItems.push(item);
                start = i + 1;
            }
        }
        let lastItem = columnsPart.substring(start).trim();
        if (lastItem) colItems.push(lastItem);
        return colItems;
    }

    const columnExpressions = getMainSelectColumns(normalized);

    // ---- Extract alias from a column expression (handles complex cases) ----
    function extractAlias(expr) {
        // Strip outer parentheses (subquery)
        while (expr.startsWith('(') && expr.endsWith(')')) {
            expr = expr.substring(1, expr.length - 1).trim();
        }
        // Look for 'AS alias'
        let asMatch = expr.match(/\s+AS\s+([`"']?[a-zA-Z_][a-zA-Z0-9_]*[`"']?)\s*$/i);
        if (asMatch) return asMatch[1].replace(/[`"']/g, '');

        // Otherwise, split by spaces and take the last token that is a valid identifier
        const tokens = expr.trim().split(/\s+/);
        const skipKeywords = new Set([
            'SELECT','FROM','WHERE','JOIN','INNER','LEFT','RIGHT','OUTER','FULL','CROSS',
            'ON','AND','OR','NOT','IN','EXISTS','BETWEEN','LIKE','IS','NULL','AS','DISTINCT',
            'ORDER','BY','GROUP','HAVING','LIMIT','OFFSET','UNION','ALL','CASE','WHEN','THEN',
            'ELSE','END','OVER','PARTITION','ROW_NUMBER','RANK','DENSE_RANK','LAG','LEAD',
            'COALESCE','NULLIF','CAST','CONVERT','AVG','SUM','COUNT','MIN','MAX','LOWER',
            'UPPER','TRIM','SUBSTRING','CONCAT','ROUND','CEIL','FLOOR','ABS','MOD','POWER',
            'LENGTH','LEN','NOW','DATE','DATEADD','DATEDIFF','EXISTS','WITH','RECURSIVE'
        ]);
        for (let i = tokens.length-1; i >= 0; i--) {
            let token = tokens[i].replace(/[;,]$/, '');
            if (token && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token) && !skipKeywords.has(token.toUpperCase())) {
                return token;
            }
        }
        return null;
    }

    for (let expr of columnExpressions) {
        const alias = extractAlias(expr);
        if (alias) {
            columns.add(alias);
        } else {
            // Fallback: try to get the last column reference (e.g., "t1.id" -> "id")
            const idMatch = expr.match(/([`"']?[a-zA-Z_][a-zA-Z0-9_.]*[`"']?)(?![^\(]*\))/);
            if (idMatch) {
                let col = idMatch[1].replace(/[`"']/g, '').replace(/.*\./, '');
                if (col && col !== '*') columns.add(col);
            }
        }
    }

    // ---- Extract JOINs ----
    const joinRe = /\b((?:INNER|LEFT|RIGHT|FULL|CROSS|OUTER)?\s*JOIN)\s+([`"']?[a-zA-Z_][a-zA-Z0-9_.]*[`"']?)/gi;
    while ((m = joinRe.exec(normalized)) !== null) {
        let joinTable = m[2].replace(/[`"']/g, '');
        if (!cteNames.has(joinTable.toLowerCase())) {
            joins.push(`${m[1].trim().toUpperCase()} ${joinTable}`);
        }
    }

    // ---- Query type ----
    let cleanSql = sql.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
    let firstWordMatch = cleanSql.match(/^\s*(\w+)/i);
    let qtype = firstWordMatch ? firstWordMatch[1].toUpperCase() : 'SELECT';
    if (qtype === 'WITH') qtype = 'SELECT';
    const selectCount = (normalized.match(/\bSELECT\b/gi) || []).length;
    const qtypeText = selectCount > 1 ? `${qtype} (${selectCount} SELECT)` : qtype;

    // ---- Update DOM ----
    tableListDiv.innerHTML  = tables.size  ? [...tables].map(t  => `<span class="meta-tag">${t}</span>`).join('') : '— empty —';
    columnListDiv.innerHTML = columns.size ? [...columns].map(c => `<span class="meta-tag">${c}</span>`).join('') : '— empty —';
    queryTypeDiv.innerHTML  = `<span class="meta-tag">${qtypeText}</span>`;
    joinListDiv.innerHTML   = joins.length ? joins.map(j => `<span class="meta-tag">${j}</span>`).join('') : '— none —';
}
function clearMeta() {
    tableListDiv.innerHTML  = '— empty —';
    columnListDiv.innerHTML = '— empty —';
    queryTypeDiv.innerHTML  = '— empty —';
    joinListDiv.innerHTML   = '— none —';
}

// =================================================================
//  ACTIONS
// =================================================================
async function copyToClipboard() {
    const text = editor.getValue();
    if (!text.trim()) return;
    try {
        await navigator.clipboard.writeText(text);
        toast('✓ Copied to clipboard');
    } catch { toast('Copy failed — try Ctrl+C'); }
}

function onClear() {
    setValue('');
    clearMeta();
    toast('Editor cleared');
}

function onDownload() {
    const text = editor.getValue();
    if (!text.trim()) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = 'query.sql';
    a.click();
    toast('⬇️ Downloaded query.sql');
}

function onFormat() {
    const raw = editor.getValue();
    if (!raw.trim()) return;
    try {
        const formatted = formatSQL(raw);
        setValue(formatted);
        extractMetadata(formatted);
        toast('✨ Formatted');
    } catch (err) { toast('Format error: ' + err.message); }
}

function onMinify() {
    const raw = editor.getValue();
    if (!raw.trim()) return;
    try {
        const minified = minifySQL(raw);
        setValue(minified);
        extractMetadata(minified);
        toast('🌀 Minified');
    } catch (err) { toast('Minify error: ' + err.message); }
}

function onExtractMeta() {
    const raw = editor.getValue();
    if (!raw.trim()) return;
    extractMetadata(raw);
    toast('🔍 Metadata extracted');
}

function loadSample() {
    const sample =
`-- Sales report with window function
SELECT
    c.customer_name,
    r.region_name,
    COUNT(o.order_id)                          AS total_orders,
    SUM(o.amount)                              AS total_spent,
    ROUND(AVG(o.amount), 2)                    AS avg_order,
    RANK() OVER (PARTITION BY r.region_name ORDER BY SUM(o.amount) DESC) AS region_rank
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
LEFT JOIN regions r ON c.region_id = r.region_id
WHERE o.order_date >= '2024-01-01'
  AND o.status <> 'cancelled'
GROUP BY c.customer_name, r.region_name
HAVING SUM(o.amount) > 1000
ORDER BY total_spent DESC
LIMIT 50;`;
    setValue(sample);
    extractMetadata(sample);
    toast('🎲 Sample loaded — press Ctrl+Enter to format');
}

// ---------- Event Bindings ----------
formatBtn.addEventListener('click', onFormat);
minifyBtn.addEventListener('click', onMinify);
copyBtn.addEventListener('click', copyToClipboard);
clearBtn.addEventListener('click', onClear);
loadSampleBtn.addEventListener('click', loadSample);
extractMetaBtn.addEventListener('click', onExtractMeta);
downloadBtn.addEventListener('click', onDownload);

fileUpload.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        setValue(ev.target.result);
        extractMetadata(ev.target.result);
        toast(`📂 Loaded ${file.name}`);
        fileUpload.value = '';
    };
    reader.onerror = () => toast('Failed to read file');
    reader.readAsText(file);
});

// ---------- Init ----------
updateButtonsState();
clearMeta();
updateStatus();