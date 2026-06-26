const inp = document.getElementById('jwt-input');
const btnDecode = document.getElementById('btn-decode');
const btnClear = document.getElementById('btn-clear');
const btnCopy = document.getElementById('btn-copy');
const segH = document.getElementById('seg-header');
const segP = document.getElementById('seg-payload');
const segS = document.getElementById('seg-sig');
const toast = document.getElementById('toast');
const statusTitle = document.getElementById('status-title');
const statusSub = document.getElementById('status-sub');

let toastTimer = null;
let scrollTimer = null;
let lastDecoded = null;

function showToast(msg, type, duration) {
  if (toastTimer) clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.className = 'toast ' + type + ' show';
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    if (type === 'success') {
      scrollTimer = setTimeout(() => {
        document.getElementById('output-panel').scrollIntoView({behavior:'smooth', block:'start'});
      }, 300);
    }
  }, duration);
}

function b64decode(str) {
  try {
    str = str.replace(/-/g,'+').replace(/_/g,'/');
    while (str.length % 4) str += '=';
    return JSON.parse(decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
  } catch(e) { return null; }
}

function colorize(obj, indent) {
  indent = indent || 0;
  const sp = '  '.repeat(indent);
  const sp2 = '  '.repeat(indent+1);
  if (obj === null) return '<span class="val-bool">null</span>';
  if (typeof obj === 'boolean') return `<span class="val-bool">${obj}</span>`;
  if (typeof obj === 'number') {
    if (('' + obj).length === 10 && obj > 1e9) {
      const d = new Date(obj * 1000);
      return `<span class="val-num">${obj}</span> <span style="color:#6a9955;font-size:10px">(${d.toUTCString()})</span>`;
    }
    return `<span class="val-num">${obj}</span>`;
  }
  if (typeof obj === 'string') return `<span class="val-str">"${obj}"</span>`;
  if (Array.isArray(obj)) {
    if (!obj.length) return '[]';
    return '[\n' + obj.map(v => sp2 + colorize(v, indent+1)).join(',\n') + '\n' + sp + ']';
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (!keys.length) return '{}';
    return '{\n' + keys.map(k => `${sp2}<span class="key">"${k}"</span>: ${colorize(obj[k], indent+1)}`).join(',\n') + '\n' + sp + '}';
  }
  return String(obj);
}

function setDisabled() {
  [segH, segP, segS].forEach(el => { el.className = 'seg-body disabled-look'; el.innerHTML = '— waiting —'; });
  btnCopy.disabled = true;
  statusTitle.innerHTML = '<i class="ti ti-lock" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#555"></i>Decoded Output';
  statusSub.textContent = 'Awaiting valid token...';
  lastDecoded = null;
}

function decode() {
  const raw = inp.value.trim();
  if (!raw) { showToast('Please paste a JWT token first.', 'error', 5000); return; }
  const parts = raw.split('.');
  if (parts.length !== 3) { setDisabled(); showToast('Invalid JWT — must have exactly 3 parts (header.payload.signature).', 'error', 5000); return; }
  const header = b64decode(parts[0]);
  const payload = b64decode(parts[1]);
  if (!header || !payload) { setDisabled(); showToast('Failed to decode — token parts are malformed or not valid base64url JSON.', 'error', 5000); return; }
  segH.className = 'seg-body'; segH.innerHTML = colorize(header);
  segP.className = 'seg-body'; segP.innerHTML = colorize(payload);
  segS.className = 'seg-body'; segS.innerHTML = `<span style="color:#b392f0;word-break:break-all">${parts[2]}</span>\n<span style="color:#444;font-size:10px;display:block;margin-top:6px">Base64url-encoded — cannot be verified client-side without the secret.</span>`;
  btnCopy.disabled = false;
  const algo = header.alg || '?';
  const typ = header.typ || 'JWT';
  statusTitle.innerHTML = `<i class="ti ti-shield-check" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#6fcf97"></i>Decoded Output <span class="badge valid">${typ} · ${algo}</span>`;
  const sub = payload.sub ? `sub: ${payload.sub}` : '';
  const exp = payload.exp ? ` · exp: ${new Date(payload.exp*1000).toLocaleString()}` : '';
  statusSub.textContent = (sub + exp) || 'Token decoded successfully';
  lastDecoded = {header, payload, signature: parts[2]};
  showToast('JWT decoded successfully!', 'success', 3000);
}

btnDecode.addEventListener('click', decode);
btnClear.addEventListener('click', () => { inp.value = ''; setDisabled(); });
btnCopy.addEventListener('click', () => {
  if (!lastDecoded) return;
  const txt = JSON.stringify({header: lastDecoded.header, payload: lastDecoded.payload, signature: lastDecoded.signature}, null, 2);
  navigator.clipboard.writeText(txt).then(() => showToast('Copied to clipboard!', 'success', 3000)).catch(() => showToast('Copy failed — try manually.', 'error', 5000));
});
inp.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') decode(); });