// ==================== Stock Return Calculator JS ====================

let chartInstance = null;
let currentChartType = 'donut';

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
  if (display) display.textContent = formatCompact(val);
}

function syncInput(id, val) {
  const input = document.getElementById(id);
  if (input) input.value = val;
  syncSlider(id);
}

// Currency search (same as previous tools)
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
  const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
  const currentPrice = parseFloat(document.getElementById('currentPrice').value) || 0;
  const shares = parseFloat(document.getElementById('shares').value) || 0;
  let dividends = parseFloat(document.getElementById('totalDividends').value) || 0;
  const holdingPeriod = parseFloat(document.getElementById('holdingPeriod').value) || 1;
  const reinvest = document.getElementById('reinvestToggle').checked;

  // If reinvesting, we need to adjust the effective return calculation (simulate DRIP)
  // For simplicity, we'll treat reinvested dividends as additional shares purchased at the current price (or average).
  // But to keep accurate CAGR, we can use the total final value (including additional shares from reinvestment) and the actual total invested amount.
  // We'll compute:
  //   Total invested = shares * purchasePrice
  //   Final value = shares * currentPrice + (dividends reinvested would buy more shares, but that's complex)
  // Standard approach: use the formula for total return including dividends not reinvested: (end value + dividends) / (start value) -1
  // For annualised return: ((end value + dividends) / start value)^(1/years) -1
  const startValue = shares * purchasePrice;
  let endValue = shares * currentPrice;
  let totalDividends = dividends;
  if (reinvest) {
    // Approximate: dividends purchase additional shares at the current price (end price)
    const additionalShares = dividends / currentPrice;
    endValue = (shares + additionalShares) * currentPrice;
    totalDividends = dividends; // still the same cash flow, but now added to value
    // For total return percent, we can compute (endValue - startValue) / startValue
  }
  const totalReturnDollars = (reinvest ? endValue : endValue + totalDividends) - startValue;
  const totalReturnPercent = ( (reinvest ? endValue : endValue + totalDividends) / startValue - 1) * 100;
  let cagr = 0;
  if (holdingPeriod > 0 && startValue > 0) {
    const ratio = (reinvest ? endValue : endValue + totalDividends) / startValue;
    cagr = (Math.pow(ratio, 1/holdingPeriod) - 1) * 100;
  }
  const capitalGain = shares * (currentPrice - purchasePrice);
  const dividendIncome = totalDividends;

  document.getElementById('rTotalReturn').textContent = formatCurrency(totalReturnDollars);
  document.getElementById('rTotalReturnPct').textContent = totalReturnPercent.toFixed(2) + '%';
  document.getElementById('rCAGR').textContent = cagr.toFixed(2) + '%';
  document.getElementById('rCapitalGain').textContent = formatCurrency(capitalGain);
  document.getElementById('rDividendIncome').textContent = formatCurrency(dividendIncome);

  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.textContent = `Total return: ${formatCurrency(totalReturnDollars)} (${totalReturnPercent.toFixed(2)}%). Annualised return (CAGR): ${cagr.toFixed(2)}%. ${capitalGain >= 0 ? 'Capital gain' : 'Capital loss'} of ${formatCurrency(capitalGain)} plus dividends of ${formatCurrency(dividendIncome)}.`;
  }

  renderChart(startValue, endValue, totalReturnDollars, capitalGain, dividendIncome, reinvest);
}

function renderChart(startVal, endVal, totalReturn, capitalGain, dividendIncome, reinvest) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();

  // Donut chart: show composition of total return (capital gain vs dividend income)
  // Only if totalReturn > 0, otherwise show start vs end?
  if (totalReturn <= 0) {
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: { labels: ['Capital Loss', 'Dividends (if any)'], datasets: [{ data: [Math.abs(capitalGain), Math.max(0, dividendIncome)], backgroundColor: ['#ef4444', '#0d9488'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom' } } }
    });
  } else {
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: { labels: ['Capital Gain', 'Dividend Income'], datasets: [{ data: [Math.max(0, capitalGain), dividendIncome], backgroundColor: ['#0d9488', '#5eead4'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom' } } }
    });
  }
}

function switchChart(type, btn) {
  if (btn) {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }
  calculate();
}

function downloadCSV() {
  const data = {
    'Purchase Price': document.getElementById('purchasePrice').value,
    'Current Price': document.getElementById('currentPrice').value,
    'Shares': document.getElementById('shares').value,
    'Total Dividends': document.getElementById('totalDividends').value,
    'Holding Period (years)': document.getElementById('holdingPeriod').value,
    'Reinvest Dividends': document.getElementById('reinvestToggle').checked,
    'Total Return ($)': document.getElementById('rTotalReturn').textContent,
    'Total Return (%)': document.getElementById('rTotalReturnPct').textContent,
    'Annualised Return (CAGR)': document.getElementById('rCAGR').textContent,
    'Capital Gain ($)': document.getElementById('rCapitalGain').textContent,
    'Dividend Income ($)': document.getElementById('rDividendIncome').textContent
  };
  let csv = Object.keys(data).map(k => `"${k}","${data[k]}"`).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'stock-return-data.csv';
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
  ['purchasePrice', 'currentPrice', 'shares', 'totalDividends', 'holdingPeriod', 'reinvestToggle'].forEach(id => {
    let val = document.getElementById(id).value;
    if (id === 'reinvestToggle') val = document.getElementById(id).checked;
    params.set(id, val);
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
  ['purchasePrice', 'currentPrice', 'shares', 'totalDividends', 'holdingPeriod'].forEach(id => {
    if (params.has(id)) document.getElementById(id).value = params.get(id);
  });
  if (params.has('reinvestToggle')) {
    document.getElementById('reinvestToggle').checked = params.get('reinvestToggle') === 'true';
  }
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
  document.getElementById('purchasePrice').value = 50;
  document.getElementById('currentPrice').value = 70;
  document.getElementById('shares').value = 100;
  document.getElementById('totalDividends').value = 200;
  document.getElementById('holdingPeriod').value = 5;
  document.getElementById('reinvestToggle').checked = false;
  ['purchasePrice', 'currentPrice'].forEach(syncSlider);
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  ['purchasePrice', 'currentPrice'].forEach(syncSlider);
  calculate();
});