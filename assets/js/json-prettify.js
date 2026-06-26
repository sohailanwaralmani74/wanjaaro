// Initialize Ace editors
  const inputEditor = ace.edit("input-editor");
  inputEditor.setTheme("ace/theme/tomorrow_night");
  inputEditor.session.setMode("ace/mode/json");
  inputEditor.setOptions({ fontSize: "13px", fontFamily: "Fira Code, monospace" });

  const outputEditor = ace.edit("output-editor");
  outputEditor.setTheme("ace/theme/tomorrow_night");
  outputEditor.session.setMode("ace/mode/json");
  outputEditor.setOptions({ fontSize: "13px", fontFamily: "Fira Code, monospace" });

  // Helper functions
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

  function getInputText() { return inputEditor.getValue(); }
  function setInputText(text) { inputEditor.setValue(text, -1); }
  function getOutputText() { return outputEditor.getValue(); }
  function setOutputText(text) { outputEditor.setValue(text, -1); }

  // Prettify: read input, validate, write prettified to output
  function prettifyOutput() {
    const raw = getInputText();
    if (!raw.trim()) {
      showToast('Input is empty', true);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const pretty = JSON.stringify(parsed, null, 2);
      setOutputText(pretty);
      showToast('Output prettified', false);
    } catch (err) {
      showToast('Invalid JSON: ' + err.message, true);
    }
  }

  // Minify: read input, validate, write minified to output
  function minifyOutput() {
    const raw = getInputText();
    if (!raw.trim()) {
      showToast('Input is empty', true);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const minified = JSON.stringify(parsed);
      setOutputText(minified);
      showToast('Output minified', false);
    } catch (err) {
      showToast('Invalid JSON: ' + err.message, true);
    }
  }

  // Load sample JSON into input, clear output
  function loadSample() {
    const sample = {
      "company": "DataFrog",
      "founded": 2024,
      "isActive": true,
      "revenue": null,
      "tags": ["converter", "cleaner", "generator"],
      "address": {
        "street": "123 Dev Lane",
        "city": "Tech Valley",
        "zip": "90210",
        "coordinates": { "lat": 37.7749, "lng": -122.4194 }
      },
      "departments": [
        {
          "name": "Engineering",
          "headcount": 12,
          "lead": {
            "name": "Alice Chen",
            "role": "CTO",
            "contacts": {
              "email": "alice@datafrog.tools",
              "phone": "+1 (555) 123-4567"
            }
          },
          "skills": ["Python", "JavaScript", "DevOps"]
        }
      ],
      "metadata": {
        "version": "2.0.1",
        "lastDeploy": "2025-03-15T10:30:00Z",
        "features": { "darkMode": true, "analytics": false, "rateLimit": 1000 }
      }
    };
    const pretty = JSON.stringify(sample, null, 2);
    setInputText(pretty);
    setOutputText('');
    showToast('Sample loaded into input', false);
  }

  // Copy helpers
  async function copyText(text, label) {
    if (!text.trim()) {
      showToast(`${label} is empty`, true);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied`, false);
    } catch (err) {
      showToast('Copy failed', true);
    }
  }

  function downloadText(text, filename, label) {
    if (!text.trim()) {
      showToast(`${label} is empty`, true);
      return;
    }
    const blob = new Blob([text], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`${label} downloaded as ${filename}`, false);
  }

  // Wire up buttons
  document.getElementById('prettify-btn').addEventListener('click', prettifyOutput);
  document.getElementById('minify-btn').addEventListener('click', minifyOutput);
  document.getElementById('sample-btn').addEventListener('click', loadSample);
  document.getElementById('clear-input').addEventListener('click', () => setInputText(''));
  document.getElementById('copy-input').addEventListener('click', () => copyText(getInputText(), 'Input'));
  document.getElementById('export-input').addEventListener('click', () => downloadText(getInputText(), 'input.json', 'Input'));
  document.getElementById('clear-output').addEventListener('click', () => setOutputText(''));
  document.getElementById('copy-output').addEventListener('click', () => copyText(getOutputText(), 'Output'));
  document.getElementById('export-output').addEventListener('click', () => downloadText(getOutputText(), 'output.json', 'Output'));

  // Initial sample
  loadSample();