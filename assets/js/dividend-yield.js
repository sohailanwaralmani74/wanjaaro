// ==================== Dividend Yield Calculator JS ====================

let chartInstance = null;
let currentChartType = 'donut';  // only donut chart used

function formatCurrency(num) {
  const val = parseFloat(num) || 0;
  const s = window.currentCurrency?.symbol || '$';
  return s + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatCompact(num) {
  const val = parseFloat(num) || 0;
  const s = window.currentCurrency?.symbol || '$';
  if (val >= 1e9) return s + (val/1e9).toFixed(1) + 'B';
  if (val >= 1e6) return s + (val/1e6).toFixed(1) + 'M';
  if (val >= 1e3) return s + (val/1e3).toFixed(1) + 'k';
  return s + val.toFixed(0);
}

function syncSlider(id) {
  const input = document.getElementById(id);
  const slider = document.getElementById(id + 'Slider');
  const display = document.getElementById(id + 'SliderVal');
  if (!input || !slider) return;
  const val = parseFloat(input.value) || 0;
  slider.value = val;
  if (display) {
    if (id === 'sharePrice') display.textContent = formatCompact(val);
    else if (id === 'dividendPerShare') display.textContent = formatCurrency(val);
  }
}

function syncInput(id, val) {
  const input = document.getElementById(id);
  if (input) input.value = val;
  syncSlider(id);
}

// Currency search (identical to previous tools)
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
  const sharePrice = parseFloat(document.getElementById('sharePrice').value) || 0;
  const dividendPerShare = parseFloat(document.getElementById('dividendPerShare').value) || 0;
  const sharesOwned = parseFloat(document.getElementById('sharesOwned').value) || 0;

  let yieldPct = 0;
  if (sharePrice > 0) {
    yieldPct = (dividendPerShare / sharePrice) * 100;
  }
  const annualIncome = dividendPerShare * sharesOwned;
  const totalValue = sharePrice * sharesOwned;

  document.getElementById('rYield').textContent = yieldPct.toFixed(2) + '%';
  document.getElementById('rAnnualIncome').textContent = formatCurrency(annualIncome);
  document.getElementById('rTotalValue').textContent = formatCurrency(totalValue);
  document.getElementById('rIncomePerShare').textContent = formatCurrency(dividendPerShare);

  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.textContent = `A $${dividendPerShare.toFixed(2)} annual dividend on a $${sharePrice.toFixed(2)} share gives a yield of ${yieldPct.toFixed(2)}%. Your ${sharesOwned} shares would generate ${formatCurrency(annualIncome)} per year.`;
  }

  renderChart(sharePrice, dividendPerShare, sharesOwned);
}

function renderChart(price, dividend, shares) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();

  // Donut: show composition of total return? but dividend yield alone is just a percentage.
  // Instead, show relative size of dividend income vs principal? Or simply a yield gauge.
  // We'll show a simple bar indicator for yield (out of maybe 10% max) to keep it visual.
  const yieldPct = (dividend / price) * 100;
  const maxYield = 10; // cap at 10% for visual scale
  const fillPercent = Math.min(yieldPct / maxYield, 1);
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [`Dividend Yield ${yieldPct.toFixed(1)}%`, 'Remaining to 10%'],
      datasets: [{ data: [fillPercent * 100, 100 - fillPercent * 100], backgroundColor: ['#0d9488', '#e2e8f0'], borderWidth: 0 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#475569' } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(1)}%` } }
      }
    }
  });
}

function switchChart(type, btn) {
  // Only donut used, but keep for consistency
  if (btn) {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }
  calculate();
}

function downloadCSV() {
  const sharePrice = document.getElementById('sharePrice').value;
  const dividend = document.getElementById('dividendPerShare').value;
  const shares = document.getElementById('sharesOwned').value;
  const yieldVal = (parseFloat(dividend) / parseFloat(sharePrice) * 100).toFixed(2);
  const csv = `Share Price,${sharePrice}\nAnnual Dividend Per Share,${dividend}\nShares Owned,${shares}\nDividend Yield (%),${yieldVal}\nAnnual Dividend Income,${document.getElementById('rAnnualIncome').textContent}\nTotal Investment Value,${document.getElementById('rTotalValue').textContent}`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'dividend-yield-data.csv';
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
  ['sharePrice', 'dividendPerShare', 'sharesOwned'].forEach(id => {
    params.set(id, document.getElementById(id).value);
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
  ['sharePrice', 'dividendPerShare', 'sharesOwned'].forEach(id => {
    if (params.has(id)) document.getElementById(id).value = params.get(id);
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
  document.getElementById('sharePrice').value = 100;
  document.getElementById('dividendPerShare').value = 4;
  document.getElementById('sharesOwned').value = 100;
  ['sharePrice', 'dividendPerShare'].forEach(syncSlider);
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  ['sharePrice', 'dividendPerShare'].forEach(syncSlider);
  calculate();
});