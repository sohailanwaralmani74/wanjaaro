// ---------- DOM Elements ----------
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const loadSampleBtn = document.getElementById('loadSampleBtn');
    const extractMetaBtn = document.getElementById('extractMetaBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewBtn = document.getElementById('previewBtn');
    const indentSelect = document.getElementById('indentSelect');
    const commentSelect = document.getElementById('commentSelect');
    const fileUpload = document.getElementById('htmlFileUpload');
    const doctypeDiv = document.getElementById('doctypeVal');
    const totalElementsDiv = document.getElementById('totalElements');
    const uniqueTagsDiv = document.getElementById('uniqueTags');
    const attributesListDiv = document.getElementById('attributesList');
    const resourcesListDiv = document.getElementById('resourcesList');
    const statLines = document.getElementById('statLines');
    const statChars = document.getElementById('statChars');
    const statCursor = document.getElementById('statCursor');
    const statMsg = document.getElementById('statMsg');
    const toastEl = document.getElementById('toast');
    const modal = document.getElementById('previewModal');
    const previewFrame = document.getElementById('previewFrame');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // ---------- CodeMirror ----------
    const editor = CodeMirror(document.getElementById('cmEditor'), {
        mode: 'htmlmixed',
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
        previewBtn.disabled = !has;
    }

    // =================================================================
    //  HTML FORMATTER (Pretty Print)
    // =================================================================
    function formatHTML(htmlStr) {
    if (!htmlStr.trim()) return '';
    const indent = indentSelect.value === 'tab' ? '\t' : ' '.repeat(parseInt(indentSelect.value));
    const preserveComments = (commentSelect.value === 'keep');

    // Use a DOMParser to get a DOM tree
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStr, 'text/html');

    // Remove comments if needed
    if (!preserveComments) {
        const walker = document.createTreeWalker(doc, NodeFilter.SHOW_COMMENT, null, false);
        const comments = [];
        while (walker.nextNode()) comments.push(walker.currentNode);
        comments.forEach(c => c.remove());
    }

    // Helper: check if a node should have preserved content
    function isPreservedTag(node) {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        const tag = node.nodeName.toLowerCase();
        return ['pre', 'code', 'textarea', 'script', 'style'].includes(tag);
    }

    function serialize(node, level) {
        const indentStr = indent.repeat(level);
        let result = '';

        if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.nodeName.toLowerCase();
            result += indentStr + '<' + tag;

            // Write attributes
            for (let i = 0; i < node.attributes.length; i++) {
                const attr = node.attributes[i];
                result += ` ${attr.name}="${escapeHtml(attr.value)}"`;
            }

            // Check if it's a void element
            const voidTags = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'];
            const isVoid = voidTags.includes(tag);

            if (isVoid) {
                result += '>\n';
                return result;
            }

            // For preserved tags, output raw inner content without processing
            if (isPreservedTag(node)) {
                let inner = '';
                for (let child of node.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        inner += child.textContent;
                    } else if (child.nodeType === Node.CDATA_SECTION_NODE) {
                        inner += `<![CDATA[${child.textContent}]]>`;
                    } else {
                        // In case of nested elements (rare inside <pre>), serialize them minimally
                        inner += serialize(child, 0).trim();
                    }
                }
                result += '>' + inner + '</' + tag + '>\n';
                return result;
            }

            // Normal element: serialize children with indentation
            if (node.childNodes.length === 0) {
                result += '></' + tag + '>\n';
            } else {
                result += '>\n';
                for (let child of node.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        const text = child.textContent.trim();
                        if (text) {
                            result += indentStr + indent + escapeHtml(text) + '\n';
                        }
                    } else {
                        result += serialize(child, level + 1);
                    }
                }
                result += indentStr + '</' + tag + '>\n';
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text) {
                result += indentStr + escapeHtml(text) + '\n';
            }
        } else if (node.nodeType === Node.COMMENT_NODE && preserveComments) {
            result += indentStr + '<!--' + node.textContent + '-->\n';
        }
        return result;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    let output = '';
    if (doc.doctype) {
        output += '<!DOCTYPE ' + doc.doctype.name + '>\n';
    }
    output += serialize(doc.documentElement, 0);
    return output.trim();
}

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // =================================================================
    //  HTML MINIFIER
    // =================================================================
    function minifyHTML(htmlStr) {
        let preserveComments = (commentSelect.value === 'keep');
        let cleaned = htmlStr;
        if (!preserveComments) {
            cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
        }
        // Collapse whitespace between tags, preserve text
        return cleaned.replace(/>\s+</g, '><').trim();
    }

    // =================================================================
    //  METADATA EXTRACTION
    // =================================================================
    function extractMetadata(htmlStr) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlStr, 'text/html');
            // Doctype
            let doctype = doc.doctype ? doc.doctype.name : '(none)';
            // Total elements
            let totalElements = doc.getElementsByTagName('*').length;
            // Unique tags
            let tags = new Set();
            for (let el of doc.getElementsByTagName('*')) tags.add(el.nodeName.toLowerCase());
            // Attributes
            let attrs = new Set();
            for (let el of doc.getElementsByTagName('*')) {
                for (let i = 0; i < el.attributes.length; i++) {
                    attrs.add(el.attributes[i].name);
                }
            }
            // External resources (src, href)
            let resources = new Set();
            const links = doc.querySelectorAll('link[href]');
            const scripts = doc.querySelectorAll('script[src]');
            const images = doc.querySelectorAll('img[src]');
            links.forEach(l => resources.add(l.getAttribute('href')));
            scripts.forEach(s => resources.add(s.getAttribute('src')));
            images.forEach(i => resources.add(i.getAttribute('src')));

            doctypeDiv.innerHTML = `<span class="meta-tag">${escapeHtml(doctype)}</span>`;
            totalElementsDiv.innerHTML = `<span class="meta-tag">${totalElements}</span>`;
            uniqueTagsDiv.innerHTML = tags.size ? [...tags].map(t => `<span class="meta-tag">${t}</span>`).join('') : '— empty —';
            attributesListDiv.innerHTML = attrs.size ? [...attrs].map(a => `<span class="meta-tag">${a}</span>`).join('') : '— empty —';
            resourcesListDiv.innerHTML = resources.size ? [...resources].map(r => `<span class="meta-tag">${r.length > 40 ? r.substring(0,40)+'…' : r}</span>`).join('') : '— empty —';
        } catch (err) {
            doctypeDiv.innerHTML = '— error —';
            totalElementsDiv.innerHTML = '— error —';
            uniqueTagsDiv.innerHTML = '— error —';
            attributesListDiv.innerHTML = '— error —';
            resourcesListDiv.innerHTML = '— error —';
        }
    }
    function clearMeta() {
        doctypeDiv.innerHTML = '— empty —';
        totalElementsDiv.innerHTML = '— empty —';
        uniqueTagsDiv.innerHTML = '— empty —';
        attributesListDiv.innerHTML = '— empty —';
        resourcesListDiv.innerHTML = '— empty —';
    }

    // =================================================================
    //  PREVIEW (modal)
    // =================================================================
    function showPreview() {
        const html = editor.getValue();
        if (!html.trim()) {
            toast('Nothing to preview');
            return;
        }
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        previewFrame.src = url;
        modal.style.display = 'block';
        // Revoke object URL after load to free memory
        previewFrame.onload = () => URL.revokeObjectURL(url);
    }
    function closeModal() {
        modal.style.display = 'none';
        previewFrame.src = 'about:blank';
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
        const blob = new Blob([text], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'document.html';
        a.click();
        toast('⬇️ Downloaded document.html');
    }
    function onFormat() {
        const raw = editor.getValue();
        if (!raw.trim()) return;
        try {
            const formatted = formatHTML(raw);
            setValue(formatted);
            extractMetadata(formatted);
            toast('✨ Formatted');
        } catch (err) { toast('Format error: ' + err.message); }
    }
    function onMinify() {
        const raw = editor.getValue();
        if (!raw.trim()) return;
        try {
            const minified = minifyHTML(raw);
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
    const sample = '<!DOCTYPE html><html><head><title>Messy HTML Test</title><meta charset="UTF-8"><style>body{background:#eee;font-family:sans-serif;}h1{color:blue;}</style><scr' + 'ipt>console.log("Hello");</scr' + 'ipt></head><body><h1>Welcome</h1><p>This is a <em>messy</em> paragraph with   extra   spaces.</p><ul><li>Item 1</li><li>Item 2</li></ul><div class="content" id="main"><span>Some text</span><br/><img src="image.jpg" alt="test"></div><!-- this is a comment --><pre>  preformatted   text   should stay   intact   </pre><code>var x = 1;</code></body></html>';
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
    previewBtn.addEventListener('click', showPreview);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // ---------- Init ----------
    updateButtonsState();
    clearMeta();
    updateStatus();