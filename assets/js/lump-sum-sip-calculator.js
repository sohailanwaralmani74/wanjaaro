/* ==========================================================
   Lump Sum SIP Calculator — Calculation Logic
   Formula: FV = P × (1 + r/n)^(n×t)
   Default compounding = Annually (n=1), matching on-page examples.
   ========================================================== */

let toolChartInstance = null;
let currentChartType = 'line';
let lastBreakdown = [];
let currentCurrencySymbol = '$';

function syncSlider(fieldId) {
  const input = document.getElementById(fieldId);
  const slider = document.getElementById(fieldId + 'Slider');
  const sliderVal = document.getElementById(fieldId + 'SliderVal');
  if (slider) slider.value = input.value;
  if (sliderVal) sliderVal.textContent = formatSliderLabel(fieldId, input.value);
}

function syncInput(fieldId, value) {
  const input = document.getElementById(fieldId);
  const sliderVal = document.getElementById(fieldId + 'SliderVal');
  input.value = value;
  if (sliderVal) sliderVal.textContent = formatSliderLabel(fieldId, value);
}

function formatSliderLabel(fieldId, value) {
  if (fieldId === 'lumpSum') return currentCurrencySymbol + Number(value).toLocaleString();
  if (fieldId === 'rate') return value + '%';
  if (fieldId === 'years') return value + ' yrs';
  return value;
}

function formatCurrency(num) {
  const rounded = Math.round(num);
  return currentCurrencySymbol + rounded.toLocaleString('en-IN');
}

/**
 * Core calculation. Verified against on-page worked examples:
 * P=100000, r=8%, t=10, n=1 (annual)  -> FV ≈ 215,892
 * P=1000000, r=12%, t=15, n=1 (annual) -> FV ≈ 5,473,566
 */
function calculate() {
  const principal = parseFloat(document.getElementById('lumpSum').value) || 0;
  const ratePct = parseFloat(document.getElementById('rate').value) || 0;
  const years = parseFloat(document.getElementById('years').value) || 0;
  const n = parseFloat(document.getElementById('compounding').value) || 1;

  const r = ratePct / 100;
  const totalValue = principal * Math.pow(1 + r / n, n * years);
  const returns = totalValue - principal;
  const multiplier = principal > 0 ? totalValue / principal : 0;

  document.getElementById('investedAmount').textContent = formatCurrency(principal);
  document.getElementById('estimatedReturns').textContent = formatCurrency(returns);
  document.getElementById('totalValue').textContent = formatCurrency(totalValue);
  document.getElementById('wealthMultiplier').textContent = multiplier.toFixed(2) + 'x';

  buildYearlyBreakdown(principal, r, n, years);
  renderInsights(principal, returns, totalValue, multiplier, years, ratePct);
  renderChart();
}

function buildYearlyBreakdown(principal, r, n, years) {
  lastBreakdown = [];
  const totalYears = Math.round(years);
  for (let y = 1; y <= totalYears; y++) {
    const value = principal * Math.pow(1 + r / n, n * y);
    const growth = value - principal;
    lastBreakdown.push({
      year: y,
      value: value,
      growth: growth
    });
  }
  renderTable();
}

function renderTable() {
  const head = document.getElementById('tableHead');
  const body = document.getElementById('tableBody');
  head.innerHTML = '<tr><th>Year</th><th>Investment Value</th><th>Cumulative Growth</th></tr>';
  body.innerHTML = lastBreakdown.map(row =>
    `<tr><td>${row.year}</td><td>${formatCurrency(row.value)}</td><td>${formatCurrency(row.growth)}</td></tr>`
  ).join('');
}

function renderInsights(principal, returns, totalValue, multiplier, years, ratePct) {
  const grid = document.getElementById('insightsGrid');
  const grid2 = document.getElementById('insightsGrid2');
  if (!grid) return;
  grid.innerHTML = `
    <div>Your  ${formatCurrency(principal)}  lump sum is projected to grow to ${formatCurrency(totalValue)} in ${years} years at ${ratePct}% annual return.</div>
  `;
  if (!grid2) return;
  grid2.innerHTML = `
    <div>That's a ${multiplier.toFixed(2)}x wealth multiplier — your money grows by ${formatCurrency(returns)} through compounding alone.</div>
  `;
}

function renderChart() {
  const ctx = document.getElementById('toolChart');
  if (!ctx || typeof Chart === 'undefined') return;
  if (toolChartInstance) toolChartInstance.destroy();

  const principal = parseFloat(document.getElementById('lumpSum').value) || 0;
  const totalValue = lastBreakdown.length ? lastBreakdown[lastBreakdown.length - 1].value : principal;
  const returns = totalValue - principal;

  if (currentChartType === 'line') {
    toolChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: lastBreakdown.map(r => 'Year ' + r.year),
        datasets: [{
          label: 'Investment Value',
          data: lastBreakdown.map(r => r.value),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          fill: true,
          tension: 0.25
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  } else if (currentChartType === 'bar') {
    toolChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Invested Amount', 'Estimated Returns'],
        datasets: [{
          label: 'Amount',
          data: [principal, returns],
          backgroundColor: ['#94a3b8', '#22c55e']
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  } else if (currentChartType === 'donut') {
    toolChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Invested Amount', 'Estimated Returns'],
        datasets: [{
          data: [principal, returns],
          backgroundColor: ['#94a3b8', '#22c55e']
        }]
      },
      options: { responsive: true }
    });
  }
}

function switchChart(type, btnEl) {
  currentChartType = type;
  document.querySelectorAll('.chart-tab').forEach(tab => tab.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderChart();
}

function resetForm() {
  document.getElementById('lumpSum').value = 100000;
  document.getElementById('rate').value = 12;
  document.getElementById('years').value = 10;
  document.getElementById('compounding').value = '1';
  syncSlider('lumpSum');
  syncSlider('rate');
  syncSlider('years');
  calculate();
}

function shareURL() {
  const params = new URLSearchParams({
    lumpSum: document.getElementById('lumpSum').value,
    rate: document.getElementById('rate').value,
    years: document.getElementById('years').value,
    compounding: document.getElementById('compounding').value
  });
  const url = window.location.origin + window.location.pathname + '?' + params.toString();
  navigator.clipboard?.writeText(url);
  const btn = document.getElementById('shareBtn');
  if (btn) {
    const original = btn.textContent;
    btn.textContent = 'Link Copied!';
    setTimeout(() => { btn.textContent = original; }, 1500);
  }
}

function downloadCSV() {
  let csv = 'Year,Investment Value,Cumulative Growth\n';
  lastBreakdown.forEach(row => {
    csv += `${row.year},${row.value.toFixed(2)},${row.growth.toFixed(2)}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'lump-sum-sip-breakdown.csv';
  link.click();
}

function copyResult() {
  const totalValue = document.getElementById('totalValue').textContent;
  const returns = document.getElementById('estimatedReturns').textContent;
  const text = `Lump Sum Investment Result — Total Value: ${totalValue}, Estimated Returns: ${returns}`;
  navigator.clipboard?.writeText(text);
  const btn = document.getElementById('copyBtn');
  if (btn) {
    const original = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.textContent = original; }, 1500);
  }
}

function exportChart() {
  if (!toolChartInstance) return;
  const link = document.createElement('a');
  link.href = toolChartInstance.toBase64Image();
  link.download = 'lump-sum-growth-chart.png';
  link.click();
}

document.addEventListener('DOMContentLoaded', () => {
  calculate();
});