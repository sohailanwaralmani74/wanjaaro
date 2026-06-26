(function() {
    const inputText = document.getElementById('input-text');
    const hashOutput = document.getElementById('hash-output');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-hash-btn');
    const downloadBtn = document.getElementById('download-hash-btn');
    const algorithmSelect = document.getElementById('hash-algorithm');
    const fileInput = document.getElementById('file-input');
    const spinnerOverlay = document.getElementById('spinner-overlay'); // overlay inside .textarea-wrapper

    let currentHash = '';

    function showToast(msg, isError = false) {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerText = msg;
      toast.style.borderLeftColor = isError ? '#f97316' : '#2dd4bf';
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 5000);
    }

    function getHashFromString(str, algorithm) {
      try {
        switch (algorithm) {
          case 'MD5': return CryptoJS.MD5(str).toString();
          case 'SHA1': return CryptoJS.SHA1(str).toString();
          case 'SHA256': return CryptoJS.SHA256(str).toString();
          case 'SHA512': return CryptoJS.SHA512(str).toString();
          case 'SHA3-256': return CryptoJS.SHA3(str, { outputLength: 256 }).toString();
          case 'SHA3-512': return CryptoJS.SHA3(str, { outputLength: 512 }).toString();
          default: return '';
        }
      } catch (e) {
        showToast('Hash generation failed: ' + e.message, true);
        return '';
      }
    }

    function getHashFromBytes(bytes, algorithm) {
      const wordArray = CryptoJS.lib.WordArray.create(bytes);
      switch (algorithm) {
        case 'MD5': return CryptoJS.MD5(wordArray).toString();
        case 'SHA1': return CryptoJS.SHA1(wordArray).toString();
        case 'SHA256': return CryptoJS.SHA256(wordArray).toString();
        case 'SHA512': return CryptoJS.SHA512(wordArray).toString();
        case 'SHA3-256': return CryptoJS.SHA3(wordArray, { outputLength: 256 }).toString();
        case 'SHA3-512': return CryptoJS.SHA3(wordArray, { outputLength: 512 }).toString();
        default: return '';
      }
    }

    async function generateHashFromFile(file, algorithm) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const bytes = new Uint8Array(e.target.result);
          const hash = getHashFromBytes(bytes, algorithm);
          resolve(hash);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
      });
    }

    async function generateHash() {
      const algorithm = algorithmSelect.value;
      const text = inputText.value;
      let hash = '';
      
      if (!text.trim() && (!fileInput.files || fileInput.files.length === 0)) {
        showToast('⚠️ Please enter text or upload a file', true);
        return;
      }
      
      if (fileInput.files && fileInput.files.length > 0 && !text.trim()) {
        const file = fileInput.files[0];
        showToast(`📁 Hashing ${file.name}...`, false);
        try {
          hash = await generateHashFromFile(file, algorithm);
          showToast(`✅ Hash generated from file`, false);
        } catch (err) {
          showToast('File read error', true);
          return;
        }
      } else {
        hash = getHashFromString(text, algorithm);
        if (!hash) return;
        showToast(`✅ Hash generated from text`, false);
      }
      
      currentHash = hash;
      hashOutput.innerText = `${algorithm}:\n${hash}`;
      setTimeout(() => hashOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }

    function copyHash() {
      if (!currentHash) {
        showToast('No hash to copy – generate one first', true);
        return;
      }
      navigator.clipboard.writeText(currentHash).then(() => {
        showToast('📋 Hash copied to clipboard', false);
      }).catch(() => showToast('Failed to copy', true));
    }

    function downloadHash() {
      if (!currentHash) {
        showToast('No hash to download – generate one first', true);
        return;
      }
      const algorithm = algorithmSelect.value;
      const blob = new Blob([`${algorithm}:\n${currentHash}`], { type: 'text/plain' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `hash_${algorithm.toLowerCase()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('💾 Hash saved as .txt', false);
    }

    // File upload: show spinner overlay, read file as UTF-8 text, hide when done
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Show overlay spinner
      if (spinnerOverlay) spinnerOverlay.style.display = 'flex';

      const reader = new FileReader();
      reader.onload = (ev) => {
        inputText.value = ev.target.result;
        showToast(`📂 "${file.name}" loaded into text area`, false);
        // Hide spinner
        if (spinnerOverlay) spinnerOverlay.style.display = 'none';
        // Clear file input so the same file can be uploaded again
        fileInput.value = '';
      };
      reader.onerror = () => {
        showToast('Failed to read file', true);
        if (spinnerOverlay) spinnerOverlay.style.display = 'none';
        fileInput.value = '';
      };
      reader.readAsText(file, 'UTF-8');
    });

    // No extra manual trigger – the label's default behavior is enough.
    // Ensure your HTML has <label for="file-input"> or wraps the input.

    generateBtn.addEventListener('click', generateHash);
    copyBtn.addEventListener('click', copyHash);
    downloadBtn.addEventListener('click', downloadHash);
})();