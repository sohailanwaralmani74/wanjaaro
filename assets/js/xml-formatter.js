// ---------- DOM Elements ----------
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const loadSampleBtn = document.getElementById('loadSampleBtn');
    const extractMetaBtn = document.getElementById('extractMetaBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const indentSelect = document.getElementById('indentSelect');
    const preserveSelect = document.getElementById('preserveSelect');
    const fileUpload = document.getElementById('xmlFileUpload');
    const rootElementDiv = document.getElementById('rootElement');
    const totalElementsDiv = document.getElementById('totalElements');
    const uniqueTagsDiv = document.getElementById('uniqueTags');
    const attributesListDiv = document.getElementById('attributesList');
    const namespacesListDiv = document.getElementById('namespacesList');
    const statLines = document.getElementById('statLines');
    const statChars = document.getElementById('statChars');
    const statCursor = document.getElementById('statCursor');
    const statMsg = document.getElementById('statMsg');
    const toastEl = document.getElementById('toast');

    // ---------- CodeMirror ----------
    const editor = CodeMirror(document.getElementById('cmEditor'), {
        mode: 'xml',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true,
        tabSize: 4,
        indentWithTabs: false,
        autofocus: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        extraKeys: {
            'Ctrl-Enter': () => onFormat(),
            'Cmd-Enter': () => onFormat(),
            'Ctrl-/': (cm) => cm.toggleComment(),
            'Cmd-/': (cm) => cm.toggleComment(),
        }
    });

    function getValue() { return editor.getValue(); }
    function setValue(v) {
        editor.setValue(v);
        editor.refresh();
        updateStatus();
        updateButtonsState();
    }

    editor.on('change', () => {
        updateButtonsState();
        updateStatus();
    });
    editor.on('cursorActivity', updateStatus);

    // ---------- Status Bar ----------
    function updateStatus() {
        const val = editor.getValue();
        const cur = editor.getCursor();
        const sel = editor.getSelection();
        statLines.textContent = editor.lineCount();
        statChars.textContent = val.length;
        statCursor.textContent = `${cur.line + 1}:${cur.ch + 1}`;
        statMsg.textContent = sel.length > 0 ? `${sel.length} chars selected` : '';
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
        formatBtn.disabled = !has;
        minifyBtn.disabled = !has;
        copyBtn.disabled = !has;
        clearBtn.disabled = false;
        extractMetaBtn.disabled = !has;
        downloadBtn.disabled = !has;
    }

    // =================================================================
    //  XML FORMATTER (Pretty Print)
    // =================================================================
    function formatXML(xmlStr) {
    if (!xmlStr.trim()) return '';
    let preserveComments = (preserveSelect.value === 'comments');
    let indent = indentSelect.value === 'tab' ? '\t' : ' '.repeat(parseInt(indentSelect.value));
    
    try {
        let cleaned = xmlStr;
        if (!preserveComments) {
            cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleaned, 'application/xml');
        const parseError = doc.querySelector('parsererror');
        if (parseError) {
            throw new Error('Invalid XML: ' + parseError.textContent);
        }
        
        function serialize(node, level) {
            const indentStr = indent.repeat(level);
            let result = '';
            if (node.nodeType === Node.ELEMENT_NODE) {
                result += indentStr + '<' + node.nodeName;
                // Attributes
                for (let i = 0; i < node.attributes.length; i++) {
                    const attr = node.attributes[i];
                    result += ` ${attr.name}="${escapeXml(attr.value)}"`;
                }
                // Check if element has any element children
                let hasElementChild = false;
                let textParts = [];
                let cdataParts = [];
                for (let child of node.childNodes) {
                    if (child.nodeType === Node.ELEMENT_NODE) {
                        hasElementChild = true;
                        break;
                    } else if (child.nodeType === Node.TEXT_NODE) {
                        if (child.textContent.trim()) textParts.push(child.textContent);
                    } else if (child.nodeType === Node.CDATA_SECTION_NODE) {
                        cdataParts.push(child.textContent);
                    }
                }
                if (node.childNodes.length === 0) {
                    result += '/>\n';
                } else if (!hasElementChild) {
                    // Only text and/or CDATA – put inline
                    let content = textParts.join('') + cdataParts.map(c => `<![CDATA[${c}]]>`).join('');
                    result += '>' + escapeXml(content) + '</' + node.nodeName + '>\n';
                } else {
                    result += '>\n';
                    for (let child of node.childNodes) {
                        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() === '') continue;
                        result += serialize(child, level + 1);
                    }
                    result += indentStr + '</' + node.nodeName + '>\n';
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) {
                    result += indentStr + escapeXml(text) + '\n';
                }
            } else if (node.nodeType === Node.CDATA_SECTION_NODE) {
                result += indentStr + `<![CDATA[${node.textContent}]]>\n`;
            } else if (node.nodeType === Node.COMMENT_NODE && preserveComments) {
                result += indentStr + `<!--${node.textContent}-->\n`;
            } else if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
                result += indentStr + `<?${node.target} ${node.data}?>\n`;
            }
            return result;
        }
        
        let output = '';
        for (let child of doc.childNodes) {
            if (child.nodeType === Node.DOCUMENT_TYPE_NODE) {
                output += `<!DOCTYPE ${child.name}>\n`;
            } else {
                output += serialize(child, 0);
            }
        }
        return output.trim();
    } catch (err) {
        console.error(err);
        return xmlStr;
    }
}

    function escapeXml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    // =================================================================
    //  XML MINIFIER
    // =================================================================
    function minifyXML(xmlStr) {
        let preserve = preserveSelect.value === 'comments';
        let cleaned = xmlStr;
        if (!preserve) {
            cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
        }
        return cleaned.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
    }

    // =================================================================
    //  METADATA EXTRACTION
    // =================================================================
    function extractMetadata(xmlStr) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlStr, 'application/xml');
            const parseError = doc.querySelector('parsererror');
            if (parseError) throw new Error('Invalid XML');
            
            let root = doc.documentElement;
            let rootName = root ? root.nodeName : '—';
            let totalElements = doc.getElementsByTagName('*').length;
            let tags = new Set();
            for (let el of doc.getElementsByTagName('*')) tags.add(el.nodeName);
            let attrs = new Set();
            for (let el of doc.getElementsByTagName('*')) {
                for (let i = 0; i < el.attributes.length; i++) attrs.add(el.attributes[i].name);
            }
            let namespaces = new Set();
            const xmlnsRe = /xmlns(?::[a-zA-Z0-9_]+)?=.*?/g;
            let match;
            while ((match = xmlnsRe.exec(xmlStr)) !== null) namespaces.add(match[0]);
            
            rootElementDiv.innerHTML = `<span class="meta-tag">${escapeHtml(rootName)}</span>`;
            totalElementsDiv.innerHTML = `<span class="meta-tag">${totalElements}</span>`;
            uniqueTagsDiv.innerHTML = tags.size ? [...tags].map(t => `<span class="meta-tag">${escapeHtml(t)}</span>`).join('') : '— empty —';
            attributesListDiv.innerHTML = attrs.size ? [...attrs].map(a => `<span class="meta-tag">${escapeHtml(a)}</span>`).join('') : '— empty —';
            namespacesListDiv.innerHTML = namespaces.size ? [...namespaces].map(ns => `<span class="meta-tag">${escapeHtml(ns)}</span>`).join('') : '— empty —';
        } catch (err) {
            rootElementDiv.innerHTML = '— error —';
            totalElementsDiv.innerHTML = '— error —';
            uniqueTagsDiv.innerHTML = '— error —';
            attributesListDiv.innerHTML = '— error —';
            namespacesListDiv.innerHTML = '— error —';
        }
    }
    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function clearMeta() {
        rootElementDiv.innerHTML = '— empty —';
        totalElementsDiv.innerHTML = '— empty —';
        uniqueTagsDiv.innerHTML = '— empty —';
        attributesListDiv.innerHTML = '— empty —';
        namespacesListDiv.innerHTML = '— empty —';
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
        const blob = new Blob([text], { type: 'application/xml' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'document.xml';
        a.click();
        toast('⬇️ Downloaded document.xml');
    }
    function onFormat() {
        const raw = editor.getValue();
        if (!raw.trim()) return;
        try {
            const formatted = formatXML(raw);
            setValue(formatted);
            extractMetadata(formatted);
            toast('✨ Formatted');
        } catch (err) { toast('Format error: ' + err.message); }
    }
    function onMinify() {
        const raw = editor.getValue();
        if (!raw.trim()) return;
        try {
            const minified = minifyXML(raw);
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
        const sample = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Sample book catalog -->
<bookstore xmlns:ns="http://example.com/ns">
    <book category="fiction">
        <title lang="en">The Great Gatsby</title>
        <author>F. Scott Fitzgerald</author>
        <year>1925</year>
        <price>12.99</price>
    </book>
    <book category="nonfiction">
        <title lang="en">Sapiens</title>
        <author>Yuval Noah Harari</author>
        <year>2011</year>
        <price>18.99</price>
    </book>
    <book category="science">
        <title lang="fr">Le Petit Prince</title>
        <author>Antoine de Saint‑Exupéry</author>
        <year>1943</year>
        <price>9.99</price>
        <cddata><![CDATA[Some <special> content]]></cddata>
    </book>
</bookstore>`;
        setValue(sample);
        extractMetadata(sample);
        toast('🎲 Sample loaded');
    }

    // ---------- File Upload ----------
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

    // ---------- Event Bindings ----------
    formatBtn.addEventListener('click', onFormat);
    minifyBtn.addEventListener('click', onMinify);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', onClear);
    loadSampleBtn.addEventListener('click', loadSample);
    extractMetaBtn.addEventListener('click', onExtractMeta);
    downloadBtn.addEventListener('click', onDownload);

    // ---------- Init ----------
    updateButtonsState();
    clearMeta();
    updateStatus();