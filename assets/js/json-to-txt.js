$(document).ready(function() {
  const fileInput = $('#fileInputJson');
  const jsonInput = $('#jsonInputEditor');
  const convertBtn = $('#convertBtnJson');
  const outputArea = $('#outputArea');
  const jsonPreview = $('#jsonPreviewArea');
  const toast = $('#toastJson');

  // Enable convert button when textarea has content
  jsonInput.on('input', function() {
    convertBtn.prop('disabled', !$(this).val().trim());
  });

  // Upload and read JSON file
  fileInput.on('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      jsonInput.val(ev.target.result);
      convertBtn.prop('disabled', false);
    };
    reader.readAsText(file);
  });

  // Flatten object recursively
  function flattenObject(obj, prefix = '', res = {}) {
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, res);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item, i) => {
          if (typeof item === 'object' && item !== null)
            flattenObject(item, `${newKey}[${i}]`, res);
          else
            res[`${newKey}[${i}]`] = item;
        });
      } else {
        res[newKey] = obj[key];
      }
    }
    return res;
  }

  // Convert JSON to readable text
  function toReadableText(obj, indent = 0) {
    let txt = '';
    const pad = '  '.repeat(indent);
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        txt += pad + '- ' + (typeof item === 'object' ? '\n' + toReadableText(item, indent + 1) : item) + '\n';
      });
    } else if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        const val = obj[key];
        if (typeof val === 'object' && val !== null)
          txt += `${pad}${key}:\n${toReadableText(val, indent + 1)}`;
        else
          txt += `${pad}${key}: ${val}\n`;
      }
    } else {
      txt += pad + obj + '\n';
    }
    return txt;
  }

  // Extract all values recursively
  function extractValues(obj, arr = []) {
    if (Array.isArray(obj)) {
      obj.forEach(item => extractValues(item, arr));
    } else if (typeof obj === 'object' && obj !== null) {
      for (let k in obj) extractValues(obj[k], arr);
    } else {
      arr.push(obj);
    }
    return arr;
  }

  // Main convert handler
  convertBtn.on('click', function() {
    try {
      const json = JSON.parse(jsonInput.val());
      jsonPreview.JSONView(json);

      const mode = $('#formatSelect').val();
      let output = '';

      switch (mode) {
        case 'raw':
          output = JSON.stringify(json, null, 2);
          break;
        case 'flattened':
          const flat = flattenObject(json);
          output = Object.entries(flat).map(([k, v]) => `${k}: ${v}`).join('\n');
          break;
        case 'readable':
          output = toReadableText(json);
          break;
        case 'values':
          output = extractValues(json).join('\n');
          break;
      }

      outputArea.val(output);
      toast.fadeIn(200).delay(1200).fadeOut(400);
      $('html, body').animate({ scrollTop: $("#convertedFile").offset().top }, 400);
    } catch (e) {
      alert('Invalid JSON format. Please check your input.');
    }
  });

  // Copy output
  $('#copyOutputBtn').on('click', function() {
    outputArea.select();
    document.execCommand('copy');
    toast.text('✅ Copied to Clipboard!').fadeIn(200).delay(1200).fadeOut(400);
  });

  // Export TXT
  $('#exportOutputBtn').on('click', function() {
    const blob = new Blob([outputArea.val()], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted.txt';
    link.click();
  });
});