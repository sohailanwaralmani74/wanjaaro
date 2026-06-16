// ==================== Safe Withdrawal Rate Calculator JS ====================

let chartInstance = null;
let currentChartType = 'line';

function formatCompact(num) {
  const val = parseFloat(num) || 0;
  const s = window.currentCurrency?.symbol || '$';
  if (val >= 1e9) return s + (val/1e9).toFixed(1) + 'B';
  if (val >= 1e6) return s + (val/1e6).toFixed(1) + 'M';
  if (val >= 1e3) return s + (val/1e3).toFixed(1) + 'k';
  return s + val.toFixed(0);
}

function formatCurrency(num) {
  const val = parseFloat(num) || 0;
  const s = window.currentCurrency?.symbol || '$';
  return s + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function syncSlider(id) {
  const input = document.getElementById(id);
  const slider = document.getElementById(id + 'Slider');
  const display = document.getElementById(id + 'SliderVal');
  if (!input || !slider) return;
  const val = parseFloat(input.value) || 0;
  slider.value = val;
  if (display && id === 'portfolio') display.textContent = formatCompact(val);
}

function syncInput(id, val) {
  const input = document.getElementById(id);
  if (input) input.value = val;
  syncSlider(id);
}

function setupCurrencySearch() {
  const searchInput = document.getElementById('currencySearch');
  const resultsDiv = document.getElementById('currencyResults');
  if (!searchInput || !resultsDiv) return;
  const allCurrencies = window.allCurrencies || [
    { code: "USD", name: "US Dollar", symbol: "$" }, { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" }, { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨" }, { code: "CAD", name: "Canadian Dollar", symbol: "C$" }
  ];
  if (!window.currentCurrency) window.currentCurrency = allCurrencies.find(c => c.code === 'USD') || allCurrencies[0];
  searchInput.value = window.currentCurrency.code + ' — ' + window.currentCurrency.name;
  function renderCurrencyResults(list) {
    if (!list.length) { resultsDiv.innerHTML = '<div class="currency-option"><span class="curr-name">No currencies found</span></div>'; return; }
    resultsDiv.innerHTML = list.map(c => `<div class="currency-option" onclick="selectCurrency('${c.code}')">
      <span class="curr-code">${c.code}</span><span class="curr-name">${c.name}</span></div>`).join('');
  }
  searchInput.addEventListener('focus', () => { renderCurrencyResults(allCurrencies); resultsDiv.classList.add('show'); });
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allCurrencies.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    renderCurrencyResults(filtered);
    resultsDiv.classList.add('show');
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.currency-search-wrapper')) resultsDiv.classList.remove('show'); });
}

function selectCurrency(code) {
  const allCurrencies = window.allCurrencies || [];
  window.currentCurrency = allCurrencies.find(c => c.code === code) || allCurrencies[0];
  const searchInput = document.getElementById('currencySearch');
  if (searchInput) searchInput.value = window.currentCurrency.code + ' — ' + window.currentCurrency.name;
  document.querySelectorAll('[id^="currencySymbol"]').forEach(s => s.textContent = window.currentCurrency.symbol);
  calculate();
}

function calculate() {
  const portfolio = parseFloat(document.getElementById('portfolio').value) || 0;
  const years = parseInt(document.getElementById('years').value) || 30;
  const portReturn = parseFloat(document.getElementById('portfolioReturn').value) / 100 || 0.07;
  const inflation = parseFloat(document.getElementById('inflation').value) / 100 || 0.03;
  const desired = parseFloat(document.getElementById('desiredWithdrawal').value) || 0;

  const realReturn = (1 + portReturn) / (1 + inflation) - 1;
  let safeRate = 0;
  if (realReturn === 0) {
    safeRate = 1 / years;
  } else {
    safeRate = realReturn / (1 - Math.pow(1 + realReturn, -years));
  }
  const safeWithdrawal = portfolio * safeRate;
  // Simulate end balance with safe withdrawal
  let balance = portfolio;
  for (let y = 1; y <= years; y++) {
    balance = balance * (1 + portReturn) - safeWithdrawal * Math.pow(1 + inflation, y-1);
  }
  const endBalance = Math.max(0, balance);

  let successMsg = "";
  if (desired > 0) {
    successMsg = (desired / portfolio <= safeRate) ? "Likely safe" : "May be too high";
  } else {
    successMsg = (safeRate >= 0.04) ? "Good (>=4% rule)" : "Conservative (<4% rule)";
  }

  document.getElementById('rSafeRate').textContent = (safeRate*100).toFixed(2) + '%';
  document.getElementById('rSafeWithdrawal').textContent = formatCurrency(safeWithdrawal);
  document.getElementById('rEndBalance').textContent = formatCurrency(endBalance);
  document.getElementById('rSuccess').textContent = successMsg;

  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.textContent = `At ${(safeRate*100).toFixed(2)}% withdrawal rate, you can take ${formatCurrency(safeWithdrawal)} in year 1. Portfolio end balance: ${formatCurrency(endBalance)}.`;
  }

  renderTable(portfolio, safeRate, portReturn, inflation, years);
  renderChart(portfolio, safeRate, portReturn, inflation, years);
}

function renderTable(startPort, withdrawalRate, returnRate, inflation, years) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  thead.innerHTML = '<tr><th>Year</th><th>Start Balance</th><th>Withdrawal</th><th>End Balance</th></tr>';
  let balance = startPort;
  let rows = '';
  for (let y = 1; y <= years; y++) {
    const withdrawal = startPort * withdrawalRate * Math.pow(1 + inflation, y-1);
    const endBalance = balance * (1 + returnRate) - withdrawal;
    rows += `<tr>
      <td>${y}</td>
      <td class="highlight">${formatCurrency(balance)}</td>
      <td>${formatCurrency(withdrawal)}</td>
      <td class="${endBalance < 0 ? 'negative' : ''}">${formatCurrency(Math.max(0, endBalance))}</td>
    </tr>`;
    balance = endBalance;
  }
  tbody.innerHTML = rows;
}

function renderChart(startPort, rate, ret, infl, years) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();
  const labels = [];
  const balances = [];
  let bal = startPort;
  for (let y = 0; y <= years; y++) {
    labels.push(y);
    balances.push(bal);
    if (y < years) {
      const withdraw = startPort * rate * Math.pow(1 + infl, y);
      bal = bal * (1 + ret) - withdraw;
    }
  }
  chartInstance = new Chart(ctx, {
    type: currentChartType === 'line' ? 'line' : 'bar',
    data: { labels, datasets: [{ label: 'Portfolio Value', data: balances, borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true, tension: 0.4 }] },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatCompact(v) } } } }
  });
}

function switchChart(type, btn) {
  currentChartType = type;
  document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  calculate();
}

function downloadCSV() {
  const rows = document.querySelectorAll('#breakdownTable tbody tr');
  if (!rows.length) return;
  let csv = '';
  const headers = document.querySelectorAll('#breakdownTable thead th');
  csv += Array.from(headers).map(h => '"' + h.textContent.replace(/"/g, '""') + '"').join(',') + '\n';
  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('td')).map(c => '"' + c.textContent.replace(/"/g, '""').trim() + '"');
    csv += cells.join(',') + '\n';
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'safe-withdrawal-simulation.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function copyResult() {
  const cards = document.querySelectorAll('#resultCards .result-card');
  let text = '';
  cards.forEach(c => {
    const label = c.querySelector('.result-label')?.textContent || '';
    const value = c.querySelector('.result-value')?.textContent || '';
    if (label && value) text += label + ': ' + value + '\n';
  });
  if (!text.trim()) return;
  navigator.clipboard.writeText(text.trim()).then(() => {
    const btn = document.getElementById('copyBtn');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Copied!';
      setTimeout(() => btn.textContent = orig, 2000);
    }
  }).catch(() => {});
}

function shareURL() {
  const params = new URLSearchParams();
  document.querySelectorAll('.input-panel input:not([type="range"]), .input-panel select').forEach(el => {
    if (el.id) params.set(el.id, el.value);
  });
  params.set('currency', window.currentCurrency?.code || 'USD');
  const url = window.location.origin + window.location.pathname + '?' + params.toString();
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('shareBtn');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Link Copied!';
      setTimeout(() => btn.textContent = orig, 2000);
    }
  }).catch(() => {});
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  document.querySelectorAll('.input-panel input:not([type="range"]), .input-panel select').forEach(el => {
    if (params.has(el.id)) el.value = params.get(el.id);
  });
  if (params.has('currency')) {
    const all = window.allCurrencies || [];
    const c = all.find(x => x.code === params.get('currency'));
    if (c) {
      window.currentCurrency = c;
      document.querySelectorAll('[id^="currencySymbol"]').forEach(s => s.textContent = window.currentCurrency.symbol);
    }
  }
}

function resetForm() {
  document.getElementById('portfolio').value = 1000000;
  document.getElementById('years').value = 30;
  document.getElementById('portfolioReturn').value = 7;
  document.getElementById('inflation').value = 3;
  document.getElementById('desiredWithdrawal').value = 0;
  syncSlider('portfolio');
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  syncSlider('portfolio');
  calculate();
});