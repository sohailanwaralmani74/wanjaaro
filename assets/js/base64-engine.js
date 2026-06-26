(function() {
    // DOM elements
    const inputTextarea = document.getElementById('df-input');
    const outputPanel = document.getElementById('df-output-panel');
    const outputTextarea = document.getElementById('df-output');
    const encodeBtn = document.getElementById('encode-action-btn');
    const decodeBtn = document.getElementById('decode-action-btn');
    const copyBtn = document.getElementById('df-copy-btn');
    const downloadBtn = document.getElementById('df-download-btn');
    const copyInputBtn = document.getElementById('copy-input-btn');
    const fileInput = document.getElementById('df-file-input');
    const previewContainer = document.getElementById('output-preview-container');
    const outputTitle = document.getElementById('output-title');

    // Global state
    let currentOutputState = {
      mode: null,
      rawBytes: null,
      textualContent: null,
      isTextual: false,
      mimeType: 'application/octet-stream',
      suggestedFileName: 'output.bin',
    };
    let scrollTimeout = null;

    // ---------- Toast with optional on-close callback ----------
    function showToast(message, type = 'info', onClose = null) {
      const toastContainer = document.getElementById('df-sqlcsv-toast');
      const toast = document.createElement('div');
      toast.className = 'toast-message';
      toast.innerText = message;
      toast.style.borderLeftColor = type === 'error' ? '#f97316' : '#2dd4bf';
      toastContainer.appendChild(toast);
      
      const removeToast = () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => {
          if (toast.parentNode) toast.remove();
          if (onClose && typeof onClose === 'function') onClose();
        }, 300);
      };
      
      setTimeout(removeToast, 2000);
    }

    // ---------- Auto‑scroll to output panel ----------
    function scrollToResultPane() {
      if (outputPanel && outputPanel.style.display !== 'none') {
        outputPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function scheduleScrollAfterToast() {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollToResultPane();
        scrollTimeout = null;
      }, 2000);
    }

    // ---------- Core helpers ----------
    function stringToUint8Array(str) {
      return new TextEncoder().encode(str);
    }
    function uint8ArrayToString(bytes) {
      return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    }
    function bytesToBase64(bytes) {
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    }
    function base64ToBytes(base64) {
      const binaryStr = atob(base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
      return bytes;
    }
    function encodeTextToBase64(str) {
      return bytesToBase64(stringToUint8Array(str));
    }
    function decodeBase64Smart(base64Str) {
      const rawBytes = base64ToBytes(base64Str);
      const decodedText = uint8ArrayToString(rawBytes);
      let isPureText = !decodedText.includes('\uFFFD');
      if (rawBytes.length > 0 && (rawBytes[0] === 0xFF || rawBytes[0] === 0x89 || rawBytes[0] === 0x47 || rawBytes[0] === 0x25)) isPureText = false;
      return { rawBytes, decodedText, isText: isPureText && rawBytes.length > 0 };
    }
    function detectMimeAndExtension(bytes) {
      if (!bytes || bytes.length < 4) return { mime: 'application/octet-stream', ext: 'bin' };
      const head = Array.from(bytes.slice(0, 12));
      if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4E && head[3] === 0x47) return { mime: 'image/png', ext: 'png' };
      if (head[0] === 0xFF && head[1] === 0xD8) return { mime: 'image/jpeg', ext: 'jpg' };
      if (head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46) return { mime: 'image/gif', ext: 'gif' };
      if (head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46) return { mime: 'image/webp', ext: 'webp' };
      if (head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46) return { mime: 'application/pdf', ext: 'pdf' };
      if (head[0] === 0x50 && head[1] === 0x4B) return { mime: 'application/zip', ext: 'zip' };
      return { mime: 'application/octet-stream', ext: 'dat' };
    }

    // Enable/disable encode button
    function setEncodeButtonEnabled(enabled) {
      encodeBtn.disabled = !enabled;
    }

    // Show output panel with conditional visibility (textarea vs preview)
    function showOutputPanel(state) {
      currentOutputState = state;
      const info = document.createElement('div');
      info.className = 'preview-image-area';
      // Update copy button state (disable for binary decode)
      const isBinaryDecode = (state.mode === 'decode' && !state.isTextual);
      copyBtn.disabled = isBinaryDecode;
      
      // Fill textarea (may be hidden later)
      outputTextarea.value = state.textualContent || (state.isTextual ? state.textualContent : '[Binary Data] — use Download button to save file');
      
      // Clear preview container first
      previewContainer.innerHTML = '';
      outputTitle.innerHTML = '';
      if (state.mode === 'decode') {
        if (state.isTextual) {
          // TEXT DECODE: show only textarea, hide preview area
          outputTextarea.style.display = 'block';
          previewContainer.style.display = 'none';
        } else {
          // BINARY DECODE: hide textarea, show preview (image or binary hint)
          outputTitle.style.display = 'none';
          outputTextarea.style.display = 'none';
          previewContainer.style.display = 'block';
          
          const detected = detectMimeAndExtension(state.rawBytes);
          if (detected.mime.startsWith('image/') && state.rawBytes.length > 0) {
            const blob = new Blob([state.rawBytes], { type: detected.mime });
            const imgUrl = URL.createObjectURL(blob);
            const imgDiv = document.createElement('div');
            imgDiv.className = 'preview-image-area';
            imgDiv.innerHTML = `<span style="font-size:0.7rem; color:#7f8c8d;">🔍 Image preview</span><br><img src="${imgUrl}" alt="decoded preview" style="max-width:100%; margin-top:6px;">`;
            previewContainer.appendChild(imgDiv);
          } else {
            const binHint = document.createElement('div');
            binHint.className = 'preview-image-area';
            binHint.innerHTML = `<span class="badge-binary">📀 Binary data · ${state.rawBytes.length} bytes</span><br><span style="font-size:12px; color:#9ca3af;">Detected type: ${detected.mime}</span><br><span style="font-size:11px;">⬇️ Use "Download Data" to save original file</span>`;
            previewContainer.appendChild(binHint);
          }
        }
        info.innerHTML = `<span style="font-size:12px;">🔷 Decoded string length: ${state.textualContent?.length || 0} chars | Copy or save .txt</span>`;
      } else { // ENCODE mode: always textual base64
        outputTextarea.style.display = 'block';
        info.innerHTML = `<span style="font-size:12px;">🔷 Base64 string length: ${state.textualContent?.length || 0} chars | Copy or save .txt</span>`;
      }
        
      outputTitle.appendChild(info);
      outputPanel.style.display = 'block';
    }

    function hideOutputPanel() {
      outputPanel.style.display = 'none';
      previewContainer.innerHTML = '';
      outputTitle.innerHTML = '';
    }

    // ---------- Actions ----------
    function performEncode() {
      let rawInput = inputTextarea.value;
      if (!rawInput.trim()) {
        showToast('⚠️ Nothing to encode — please enter text or upload a file first', 'error');
        return;
      }
      try {
        const base64Result = encodeTextToBase64(rawInput);
        const rawBytesOfBase64 = stringToUint8Array(base64Result);
        const outputState = {
          mode: 'encode',
          rawBytes: rawBytesOfBase64,
          textualContent: base64Result,
          isTextual: true,
          mimeType: 'text/plain',
          suggestedFileName: 'encoded_base64.txt',
        };
        showOutputPanel(outputState);
        showToast('✅ Encoded successfully! Base64 string ready', 'success');
        scheduleScrollAfterToast();
      } catch (err) {
        showToast(`Encode failed: ${err.message}`, 'error');
        hideOutputPanel();
      }
    }

    function performDecode() {
      let inputBase64 = inputTextarea.value.trim();
      if (!inputBase64) {
        showToast('❓ Nothing to decode — provide a valid Base64 string', 'error');
        return;
      }
      try {
        const { rawBytes, decodedText, isText } = decodeBase64Smart(inputBase64);
        let displayText;
        if (isText) displayText = decodedText;
        else {
          const detected = detectMimeAndExtension(rawBytes);
          displayText = `[🔷 Binary payload — ${rawBytes.length} bytes, type: ${detected.mime}]\nUse "Download Data" to save original content.`;
        }
        const mimeInfo = detectMimeAndExtension(rawBytes);
        const outputState = {
          mode: 'decode',
          rawBytes: rawBytes,
          textualContent: displayText,
          isTextual: isText,
          mimeType: mimeInfo.mime,
          suggestedFileName: `decoded.${mimeInfo.ext}`,
        };
        showOutputPanel(outputState);
        showToast(isText ? '🔓 Decoded to text successfully' : `🔓 Decoded binary data (${rawBytes.length} bytes)`, 'success');
        scheduleScrollAfterToast();
      } catch (err) {
        showToast(`Decode error: invalid Base64 format — ${err.message}`, 'error');
        hideOutputPanel();
      }
    }

    function handleFileUpload(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const bytes = new Uint8Array(e.target.result);
        const base64String = bytesToBase64(bytes);
        inputTextarea.value = base64String;
        // Disable encode button because input already contains Base64 of the file
        setEncodeButtonEnabled(false);
        showToast(`📁 "${file.name}" (${(file.size / 1024).toFixed(1)} KB) → Base64 loaded in input area. Encode button disabled to avoid double encoding.`, 'success');
        // Trigger input event manually? No need, but we keep flag
      };
      reader.onerror = () => showToast('Failed to read file', 'error');
      reader.readAsArrayBuffer(file);
    }

    // Copy input content to clipboard
    function copyInputContent() {
      const content = inputTextarea.value;
      if (!content.trim()) {
        showToast('Nothing to copy — input is empty', 'error');
        return;
      }
      navigator.clipboard.writeText(content).then(() => {
        showToast('📋 Input copied to clipboard!', 'success');
      }).catch(() => showToast('Failed to copy input', 'error'));
    }

    function copyOutput() {
      if (copyBtn.disabled) {
        showToast('Copy disabled for binary data — use Download button instead', 'error');
        return;
      }
      if (!outputPanel.style.display || outputPanel.style.display === 'none') {
        showToast('Nothing to copy — output panel is hidden', 'error');
        return;
      }
      const textToCopy = outputTextarea.value;
      if (!textToCopy.trim()) {
        showToast('No content to copy', 'error');
        return;
      }
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('📋 Copied to clipboard!', 'success');
      }).catch(() => showToast('Failed to copy', 'error'));
    }

    function downloadOutput() {
      if (!outputPanel.style.display || outputPanel.style.display === 'none' || !currentOutputState.mode) {
        showToast('No output data available — perform encode/decode first', 'error');
        return;
      }
      const state = currentOutputState;
      let blob, fileName;
      if (state.mode === 'encode') {
        blob = new Blob([state.textualContent], { type: 'text/plain' });
        fileName = 'base64_encoded.txt';
      } else if (state.mode === 'decode') {
        if (!state.rawBytes || state.rawBytes.length === 0) {
          showToast('No binary data to download', 'error');
          return;
        }
        const detected = detectMimeAndExtension(state.rawBytes);
        blob = new Blob([state.rawBytes], { type: detected.mime });
        fileName = `decoded_${Date.now()}.${detected.ext}`;
        if (state.isTextual && state.mimeType === 'text/plain') fileName = 'decoded_text.txt';
      } else {
        blob = new Blob([state.textualContent || ''], { type: 'text/plain' });
        fileName = 'output.txt';
      }
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`⬇️ Downloaded as ${fileName}`, 'success');
    }

    // Enable encode button when user manually edits the input (text or paste)
    function onInputChange() {
      // Re-enable encode button whenever user changes input manually
      setEncodeButtonEnabled(true);
    }

    // Setup file input (no double trigger)
    function setupFileInput() {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFileUpload(e.target.files[0]);
        }
        fileInput.value = '';
      });
    }

    function addEventListeners() {
      encodeBtn.addEventListener('click', performEncode);
      decodeBtn.addEventListener('click', performDecode);
      copyBtn.addEventListener('click', copyOutput);
      downloadBtn.addEventListener('click', downloadOutput);
      copyInputBtn.addEventListener('click', copyInputContent);
      inputTextarea.addEventListener('input', onInputChange);
    }

    function init() {
      setupFileInput();
      addEventListeners();
      hideOutputPanel();
      setEncodeButtonEnabled(true); // initially enabled
      showToast('🎯 Ready! Upload any file, paste text, then Encode or Decode', 'info');
    }
    init();
  })();