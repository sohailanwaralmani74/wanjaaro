// ==================== 401k Growth Projector JS ====================

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
  if (display && id === 'currentBalance') display.textContent = formatCompact(val);
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
  let balance = parseFloat(document.getElementById('currentBalance').value) || 0;
  const salary = parseFloat(document.getElementById('currentSalary').value) || 0;
  const contribPct = parseFloat(document.getElementById('contributionPct').value) / 100 || 0;
  const matchRate = parseFloat(document.getElementById('employerMatch').value) || 0;
  const matchLimit = parseFloat(document.getElementById('matchLimit').value) / 100 || 0.06;
  const raise = parseFloat(document.getElementById('annualRaise').value) / 100 || 0;
  const returnRate = parseFloat(document.getElementById('returnRate').value) / 100 || 0.07;
  const years = parseInt(document.getElementById('years').value) || 30;

  let totalContrib = 0;
  let totalGains = 0;
  let currentSalary = salary;
  const yearlyData = [];

  for (let y = 1; y <= years; y++) {
    const employeeContrib = currentSalary * contribPct;
    let match = 0;
    if (matchRate > 0) {
      const eligible = Math.min(currentSalary * contribPct, currentSalary * matchLimit);
      match = eligible * matchRate;
    }
    const annualContrib = employeeContrib + match;
    totalContrib += annualContrib;
    const gain = balance * returnRate;
    totalGains += gain;
    balance = balance + annualContrib + gain;
    yearlyData.push({ year: y, balance, contrib: annualContrib, gain, salary: currentSalary });
    currentSalary = currentSalary * (1 + raise);
  }

  document.getElementById('rFutureBalance').textContent = formatCurrency(balance);
  document.getElementById('rTotalContrib').textContent = formatCurrency(totalContrib);
  document.getElementById('rGains').textContent = formatCurrency(totalGains);
  document.getElementById('rIncome').textContent = formatCurrency(balance * 0.04);

  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.textContent = `After ${years} years, your 401k balance is projected at ${formatCurrency(balance)}. Total contributions: ${formatCurrency(totalContrib)}. Gains: ${formatCurrency(totalGains)}.`;
  }

  renderTable(yearlyData);
  renderChart(yearlyData);
}

function renderTable(data) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  thead.innerHTML = '<tr><th>Year</th><th>Balance</th><th>Contributions (Year)</th><th>Investment Gains</th><th>Salary</th></tr>';
  let rows = '';
  data.forEach(d => {
    rows += `<tr>
      <td>${d.year}</td>
      <td class="highlight">${formatCurrency(d.balance)}</td>
      <td>${formatCurrency(d.contrib)}</td>
      <td>${formatCurrency(d.gain)}</td>
      <td>${formatCurrency(d.salary)}</td>
    </tr>`;
  });
  tbody.innerHTML = rows;
}

function renderChart(data) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();
  const labels = data.map(d => d.year);
  const balances = data.map(d => d.balance);
  if (currentChartType === 'line') {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: '401k Balance', data: balances, borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true, tension: 0.4 }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatCompact(v) } } } }
    });
  } else {
    const contribs = data.map(d => d.contrib);
    const gains = data.map(d => d.gain);
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Contributions', data: contribs, backgroundColor: '#0d9488' }, { label: 'Gains', data: gains, backgroundColor: '#5eead4' }] },
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
  a.download = '401k-growth-projection.csv';
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
  document.getElementById('currentBalance').value = 50000;
  document.getElementById('currentSalary').value = 70000;
  document.getElementById('contributionPct').value = 10;
  document.getElementById('employerMatch').value = 0.5;
  document.getElementById('matchLimit').value = 6;
  document.getElementById('annualRaise').value = 3;
  document.getElementById('returnRate').value = 7;
  document.getElementById('years').value = 30;
  syncSlider('currentBalance');
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  syncSlider('currentBalance');
  calculate();
});