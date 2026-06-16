
// ==================== FIRE Number Calculator ====================
// ---------- Currency data (fallback if window.allCurrencies not set) ----------
let allCurrencies = window.allCurrencies || [
  { code: "USD", name: "US Dollar", symbol: "$" }, { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" }, { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" }, { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" }, { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" }, { code: "BRL", name: "Brazilian Real", symbol: "R$" }
];
if (!window.allCurrencies) {
  const seen = new Set();
  allCurrencies = allCurrencies.filter(c => { if (seen.has(c.code)) return false; seen.add(c.code); return true; });
}
allCurrencies.sort((a,b) => a.code.localeCompare(b.code));

let currentCurrency = allCurrencies.find(c => c.code === 'USD') || allCurrencies[0];
let chartInstance = null;
let currentChartType = 'line';

// ---------- Formatting ----------
function formatCompact(num) {
  const val = parseFloat(num) || 0;
  const s = currentCurrency.symbol;
  if (val >= 1e9) return s + (val/1e9).toFixed(1) + 'B';
  if (val >= 1e6) return s + (val/1e6).toFixed(1) + 'M';
  if (val >= 1e3) return s + (val/1e3).toFixed(1) + 'k';
  return s + val.toFixed(0);
}
function formatCurrency(num) {
  const val = parseFloat(num) || 0;
  return currentCurrency.symbol + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---------- Slider sync ----------
function syncSlider(id) {
  const input = document.getElementById(id);
  const slider = document.getElementById(id + 'Slider');
  const display = document.getElementById(id + 'SliderVal');
  if (!input || !slider) return;
  const val = parseFloat(input.value) || 0;
  slider.value = val;
  if (display) {
    if (id === 'annualExpenses') display.textContent = formatCompact(val);
    else if (id === 'withdrawalRate') display.textContent = val + '%';
    else display.textContent = val;
  }
}
function syncInput(id, val) {
  const input = document.getElementById(id);
  if (input) input.value = val;
  syncSlider(id);
}

// ---------- Currency search (identical to future-value.js) ----------
function setupCurrencySearch() {
  const searchInput = document.getElementById('currencySearch');
  const resultsDiv = document.getElementById('currencyResults');
  if (!searchInput || !resultsDiv) return;
  searchInput.value = currentCurrency.code + ' — ' + currentCurrency.name;
  searchInput.addEventListener('focus', () => { renderCurrencyResults(allCurrencies); resultsDiv.classList.add('show'); });
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allCurrencies.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    renderCurrencyResults(filtered);
    resultsDiv.classList.add('show');
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.currency-search-wrapper')) resultsDiv.classList.remove('show'); });
}
function renderCurrencyResults(list) {
  const div = document.getElementById('currencyResults');
  if (!div) return;
  if (!list.length) { div.innerHTML = '<div class="currency-option"><span class="curr-name">No currencies found</span></div>'; return; }
  div.innerHTML = list.map(c => `<div class="currency-option" onclick="selectCurrency('${c.code}')">
    <span class="curr-code">${c.code}</span><span class="curr-name">${c.name}</span></div>`).join('');
}
function selectCurrency(code) {
  currentCurrency = allCurrencies.find(c => c.code === code) || allCurrencies[0];
  const searchInput = document.getElementById('currencySearch');
  if (searchInput) searchInput.value = currentCurrency.code + ' — ' + currentCurrency.name;
  const resultsDiv = document.getElementById('currencyResults');
  if (resultsDiv) resultsDiv.classList.remove('show');
  document.querySelectorAll('[id^="currencySymbol"]').forEach(s => s.textContent = currentCurrency.symbol);
  calculate();
}

// ---------- Core calculation ----------
function calculate() {
  const expenses = parseFloat(document.getElementById('annualExpenses').value) || 0;
  const swr = parseFloat(document.getElementById('withdrawalRate').value) / 100 || 0.04;
  const fireNumber = expenses / swr;

  const currentAge = parseInt(document.getElementById('currentAge').value) || 30;
  const retireAge = parseInt(document.getElementById('retirementAge').value) || 45;
  const yearsToRetire = Math.max(0, retireAge - currentAge);

  const currentSavings = parseFloat(document.getElementById('currentSavings').value) || 0;
  const monthlySavings = parseFloat(document.getElementById('monthlySavings').value) || 0;
  const returnRate = parseFloat(document.getElementById('returnRate').value) / 100 || 0.07;

  const inflationToggle = document.getElementById('inflationToggle').checked;
  const inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100 || 0.03;
  document.getElementById('inflationRateGroup').style.display = inflationToggle ? 'block' : 'none';

  // Future value of savings at retirement
  let projected = currentSavings;
  const monthlyReturn = returnRate / 12;
  for (let m = 1; m <= yearsToRetire * 12; m++) {
    projected = projected * (1 + monthlyReturn) + monthlySavings;
  }
  // Expenses at retirement (inflated)
  const expensesAtRetirement = expenses * Math.pow(1 + (inflationToggle ? inflationRate : 0), yearsToRetire);
  // Years to FIRE (simple annual compounding)
  let yearsToFire = 0;
  let test = currentSavings;
  while (test < fireNumber && yearsToFire < 100) {
    test = test * (1 + returnRate) + monthlySavings * 12;
    yearsToFire++;
  }

  document.getElementById('rFireNumber').textContent = formatCurrency(fireNumber);
  document.getElementById('rAnnualIncome').textContent = formatCurrency(expensesAtRetirement);
  document.getElementById('rProjectedSavings').textContent = formatCurrency(projected);
  document.getElementById('rYearsToFire').textContent = yearsToFire < 100 ? yearsToFire + ' years' : '>100 years';

  // Insight box
  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.textContent = `Your FIRE number is ${formatCurrency(fireNumber)}. At current savings rate, you'll reach it in ~${yearsToFire} years.`;
  }

  renderTable(currentSavings, monthlySavings, returnRate, yearsToRetire, fireNumber);
  renderChart(currentSavings, monthlySavings, returnRate, yearsToRetire, fireNumber);
}

function renderTable(start, monthly, rate, years, target) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  thead.innerHTML = '<tr><th>Year</th><th>Balance</th><th>Target (FIRE)</th><th>Shortfall</th></tr>';
  let balance = start;
  let rows = '';
  for (let y = 1; y <= years; y++) {
    balance = balance * (1 + rate) + monthly * 12;
    const targetAtYear = target * (y / years);
    const shortfall = targetAtYear - balance;
    rows += `<tr>
      <td>${y}</td>
      <td class="highlight">${formatCurrency(balance)}</td>
      <td>${formatCurrency(targetAtYear)}</td>
      <td class="${shortfall < 0 ? 'positive' : ''}">${formatCurrency(shortfall)}</td>
    </tr>`;
  }
  tbody.innerHTML = rows;
}

function renderChart(start, monthly, rate, years, target) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();
  const labels = Array.from({length: years+1}, (_,i) => i);
  const balanceData = [start];
  for (let y = 1; y <= years; y++) {
    balanceData.push(balanceData[y-1] * (1 + rate) + monthly * 12);
  }
  const targetData = labels.map(y => target * y / years);
  if (currentChartType === 'line') {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Projected Balance', data: balanceData, borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true, tension: 0.4 },
          { label: 'FIRE Target', data: targetData, borderColor: '#f59e0b', borderDash: [5,5], fill: false }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatCompact(v) } } } }
    });
  } else {
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.slice(1),
        datasets: [{ label: 'Annual Savings', data: Array.from({length: years}, (_,i) => monthly * 12), backgroundColor: '#0d9488' }]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatCompact(v) } } } }
    });
  }
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
  a.download = 'fire-projection.csv';
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
  params.set('currency', currentCurrency.code);
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
    const c = allCurrencies.find(x => x.code === params.get('currency'));
    if (c) {
      currentCurrency = c;
      document.querySelectorAll('[id^="currencySymbol"]').forEach(s => s.textContent = currentCurrency.symbol);
    }
  }
}

function resetForm() {
  document.getElementById('annualExpenses').value = 50000;
  document.getElementById('withdrawalRate').value = 4;
  document.getElementById('currentAge').value = 30;
  document.getElementById('retirementAge').value = 45;
  document.getElementById('currentSavings').value = 50000;
  document.getElementById('monthlySavings').value = 1000;
  document.getElementById('returnRate').value = 7;
  document.getElementById('inflationToggle').checked = false;
  document.getElementById('inflationRate').value = 3;
  ['annualExpenses', 'withdrawalRate'].forEach(syncSlider);
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  ['annualExpenses', 'withdrawalRate'].forEach(syncSlider);
  calculate();
});