// ==================== Retirement Corpus Calculator JS ====================

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
  if (display && id === 'currentExpenses') display.textContent = formatCompact(val);
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
  const currentExpenses = parseFloat(document.getElementById('currentExpenses').value) || 0;
  const currentAge = parseInt(document.getElementById('currentAge').value) || 30;
  const retireAge = parseInt(document.getElementById('retirementAge').value) || 60;
  const lifeAge = parseInt(document.getElementById('lifeExpectancy').value) || 85;
  const inflation = parseFloat(document.getElementById('inflationRate').value) / 100 || 0.06;
  const preReturn = parseFloat(document.getElementById('preReturn').value) / 100 || 0.10;
  const postReturn = parseFloat(document.getElementById('postReturn').value) / 100 || 0.05;
  const currentSavings = parseFloat(document.getElementById('currentSavings').value) || 0;
  const monthlySaving = parseFloat(document.getElementById('monthlySaving').value) || 0;

  const yearsToRetire = Math.max(0, retireAge - currentAge);
  const retirementYears = Math.max(0, lifeAge - retireAge);

  // Expenses at retirement (inflated)
  const expensesAtRetirement = currentExpenses * Math.pow(1 + inflation, yearsToRetire);

  // Corpus needed at retirement (present value of future expenses, discounted at postReturn)
  let corpusNeeded = 0;
  const realReturn = (1 + postReturn) / (1 + inflation) - 1;
  if (realReturn === 0) {
    corpusNeeded = expensesAtRetirement * retirementYears;
  } else {
    corpusNeeded = expensesAtRetirement * (1 - Math.pow(1 + realReturn, -retirementYears)) / realReturn;
  }

  // Projected corpus at retirement from current savings + monthly contributions
  let projected = currentSavings;
  const monthlyPre = preReturn / 12;
  for (let m = 1; m <= yearsToRetire * 12; m++) {
    projected = projected * (1 + monthlyPre) + monthlySaving;
  }

  const shortfall = corpusNeeded - projected;
  let requiredMonthly = 0;
  if (yearsToRetire > 0) {
    const monthlyRate = preReturn / 12;
    const periods = yearsToRetire * 12;
    if (monthlyRate === 0) {
      requiredMonthly = (corpusNeeded - currentSavings) / periods;
    } else {
      requiredMonthly = (corpusNeeded - currentSavings * Math.pow(1 + monthlyRate, periods)) * monthlyRate / (Math.pow(1 + monthlyRate, periods) - 1);
    }
    if (requiredMonthly < 0) requiredMonthly = 0;
  }

  document.getElementById('rCorpusNeeded').textContent = formatCurrency(corpusNeeded);
  document.getElementById('rProjectedCorpus').textContent = formatCurrency(projected);
  document.getElementById('rShortfall').textContent = formatCurrency(shortfall);
  document.getElementById('rRequiredMonthly').textContent = formatCurrency(requiredMonthly);

  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.textContent = `You need ${formatCurrency(corpusNeeded)} at retirement. Your projected savings: ${formatCurrency(projected)}. ${shortfall > 0 ? 'Shortfall: ' + formatCurrency(shortfall) : 'Surplus!'}`;
  }

  renderTable(projected, corpusNeeded, yearsToRetire, preReturn, monthlySaving, currentSavings);
  renderChart(projected, corpusNeeded, yearsToRetire);
}

function renderTable(projected, target, years, returnRate, monthlySave, startSavings) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  thead.innerHTML = '<tr><th>Year</th><th>Projected Corpus</th><th>Target Corpus</th><th>Shortfall</th></tr>';
  let balance = startSavings;
  let rows = '';
  for (let y = 1; y <= years; y++) {
    balance = balance * (1 + returnRate) + monthlySave * 12;
    const targetAtYear = target * (y / years);
    const short = targetAtYear - balance;
    rows += `<tr>
      <td>${y}</td>
      <td class="highlight">${formatCurrency(balance)}</td>
      <td>${formatCurrency(targetAtYear)}</td>
      <td class="${short < 0 ? 'positive' : ''}">${formatCurrency(short)}</td>
    </tr>`;
  }
  tbody.innerHTML = rows;
}

function renderChart(projected, target, years) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();
  const labels = Array.from({length: years+1}, (_,i) => i);
  const projData = [parseFloat(document.getElementById('currentSavings').value) || 0];
  for (let y = 1; y <= years; y++) {
    projData.push(projData[y-1] * (1 + (parseFloat(document.getElementById('preReturn').value)/100)) + (parseFloat(document.getElementById('monthlySaving').value)*12));
  }
  const targetData = labels.map(y => target * y / years);
  chartInstance = new Chart(ctx, {
    type: currentChartType === 'line' ? 'line' : 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Projected Corpus', data: projData, borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true, tension: 0.4 },
        { label: 'Target Corpus', data: targetData, borderColor: '#f59e0b', borderDash: [5,5], fill: false }
      ]
    },
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
  a.download = 'retirement-corpus-projection.csv';
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
  document.getElementById('currentExpenses').value = 50000;
  document.getElementById('currentAge').value = 30;
  document.getElementById('retirementAge').value = 60;
  document.getElementById('lifeExpectancy').value = 85;
  document.getElementById('inflationRate').value = 6;
  document.getElementById('preReturn').value = 10;
  document.getElementById('postReturn').value = 5;
  document.getElementById('currentSavings').value = 50000;
  document.getElementById('monthlySaving').value = 5000;
  syncSlider('currentExpenses');
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  syncSlider('currentExpenses');
  calculate();
});