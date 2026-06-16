// ==================== Asset Allocation Planner JS ====================

let chartInstance = null;
let currentChartType = 'donut';

// Asset class return and risk assumptions (historical approximations)
const ASSET_CLASSES = {
  stocks: { return: 0.09, risk: 8, label: 'Stocks' },
  bonds: { return: 0.04, risk: 3, label: 'Bonds' },
  realEstate: { return: 0.07, risk: 5, label: 'Real Estate' },
  cash: { return: 0.02, risk: 0.5, label: 'Cash / Short Term' }
};

// Risk profile presets (% allocation)
const PRESETS = {
  conservative: { stocks: 20, bonds: 50, realEstate: 10, cash: 20 },
  moderate: { stocks: 50, bonds: 30, realEstate: 10, cash: 10 },
  aggressive: { stocks: 80, bonds: 10, realEstate: 5, cash: 5 }
};

// Helper: format currency
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
  if (display) display.textContent = val + ' yrs';
}
function syncInput(id, val) {
  const input = document.getElementById(id);
  if (input) input.value = val;
  syncSlider(id);
}

// Currency search
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

// Update custom sliders and enforce sum = 100
function updateCustomAllocation() {
  let stocks = parseFloat(document.getElementById('stocksSlider').value) || 0;
  let bonds = parseFloat(document.getElementById('bondsSlider').value) || 0;
  let realEstate = parseFloat(document.getElementById('realEstateSlider').value) || 0;
  let cash = parseFloat(document.getElementById('cashSlider').value) || 0;
  let total = stocks + bonds + realEstate + cash;
  if (total !== 100) {
    // Adjust proportionally (simple scaling)
    let scale = 100 / total;
    stocks = Math.round(stocks * scale);
    bonds = Math.round(bonds * scale);
    realEstate = Math.round(realEstate * scale);
    cash = 100 - (stocks + bonds + realEstate);
    document.getElementById('stocksSlider').value = stocks;
    document.getElementById('bondsSlider').value = bonds;
    document.getElementById('realEstateSlider').value = realEstate;
    document.getElementById('cashSlider').value = cash;
  }
  document.getElementById('stocksValue').textContent = stocks + '%';
  document.getElementById('bondsValue').textContent = bonds + '%';
  document.getElementById('realEstateValue').textContent = realEstate + '%';
  document.getElementById('cashValue').textContent = cash + '%';
  calculate();
}

function calculate() {
  const useCustom = document.getElementById('customAllocationToggle').checked;
  const customDiv = document.getElementById('customSliders');
  customDiv.style.display = useCustom ? 'block' : 'none';

  let allocation = {};
  if (useCustom) {
    allocation.stocks = parseFloat(document.getElementById('stocksSlider').value) || 0;
    allocation.bonds = parseFloat(document.getElementById('bondsSlider').value) || 0;
    allocation.realEstate = parseFloat(document.getElementById('realEstateSlider').value) || 0;
    allocation.cash = parseFloat(document.getElementById('cashSlider').value) || 0;
  } else {
    const risk = document.getElementById('riskTolerance').value;
    allocation = { ...PRESETS[risk] };
  }

  // Apply age adjustment if current age provided (overrides time horizon)
  let timeHorizon = parseFloat(document.getElementById('timeHorizon').value) || 20;
  const currentAge = parseFloat(document.getElementById('currentAge').value);
  if (currentAge && currentAge > 0 && currentAge < 100) {
    const yearsToRetire = Math.max(0, 65 - currentAge);
    timeHorizon = yearsToRetire;
    document.getElementById('timeHorizon').value = timeHorizon;
    syncSlider('timeHorizon');
  }

  // Glide path adjustment: if time horizon < 10, shift from stocks to bonds
  let stocksAdj = allocation.stocks;
  let bondsAdj = allocation.bonds;
  if (timeHorizon < 10) {
    const reduction = Math.min(20, (10 - timeHorizon) * 2);
    stocksAdj = Math.max(0, allocation.stocks - reduction);
    bondsAdj = Math.min(100, allocation.bonds + reduction);
  } else {
    stocksAdj = allocation.stocks;
    bondsAdj = allocation.bonds;
  }
  // Normalize to 100
  let total = stocksAdj + bondsAdj + allocation.realEstate + allocation.cash;
  if (total !== 100) {
    stocksAdj = Math.round(stocksAdj * 100 / total);
    bondsAdj = Math.round(bondsAdj * 100 / total);
    allocation.realEstate = Math.round(allocation.realEstate * 100 / total);
    allocation.cash = 100 - (stocksAdj + bondsAdj + allocation.realEstate);
  }
  allocation.stocks = stocksAdj;
  allocation.bonds = bondsAdj;

  // Calculate expected return and risk
  let expectedReturn = (allocation.stocks/100) * ASSET_CLASSES.stocks.return +
                       (allocation.bonds/100) * ASSET_CLASSES.bonds.return +
                       (allocation.realEstate/100) * ASSET_CLASSES.realEstate.return +
                       (allocation.cash/100) * ASSET_CLASSES.cash.return;
  let riskScore = (allocation.stocks/100) * ASSET_CLASSES.stocks.risk +
                  (allocation.bonds/100) * ASSET_CLASSES.bonds.risk +
                  (allocation.realEstate/100) * ASSET_CLASSES.realEstate.risk +
                  (allocation.cash/100) * ASSET_CLASSES.cash.risk;
  riskScore = Math.round(riskScore * 10) / 10;

  // Update result cards
  document.getElementById('rExpectedReturn').textContent = (expectedReturn * 100).toFixed(1) + '%';
  document.getElementById('rRiskScore').textContent = riskScore.toFixed(1) + '/10';
  let styleName = '';
  if (!useCustom) {
    const risk = document.getElementById('riskTolerance').value;
    styleName = risk.charAt(0).toUpperCase() + risk.slice(1);
  } else {
    styleName = 'Custom';
  }
  document.getElementById('rStyle').textContent = styleName;

  // Rebalancing cards (show only when portfolio value > 0)
  const portfolioValue = parseFloat(document.getElementById('portfolioValue').value) || 0;
  const stocksCard = document.getElementById('rebalanceStocksCard');
  const bondsCard = document.getElementById('rebalanceBondsCard');
  const reCard = document.getElementById('rebalanceRECard');
  const cashCard = document.getElementById('rebalanceCashCard');

  if (portfolioValue > 0) {
    const targetStocks = portfolioValue * (allocation.stocks / 100);
    const targetBonds = portfolioValue * (allocation.bonds / 100);
    const targetRealEstate = portfolioValue * (allocation.realEstate / 100);
    const targetCash = portfolioValue * (allocation.cash / 100);

    document.getElementById('rStocksTarget').textContent = formatCurrency(targetStocks);
    document.getElementById('rBondsTarget').textContent = formatCurrency(targetBonds);
    document.getElementById('rRealEstateTarget').textContent = formatCurrency(targetRealEstate);
    document.getElementById('rCashTarget').textContent = formatCurrency(targetCash);

    stocksCard.style.display = 'grid';
    bondsCard.style.display = 'grid';
    reCard.style.display = 'grid';
    cashCard.style.display = 'grid';
  } else {
    stocksCard.style.display = 'none';
    bondsCard.style.display = 'none';
    reCard.style.display = 'none';
    cashCard.style.display = 'none';
  }

  // Insight box
  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.innerHTML = `For a ${timeHorizon}-year horizon, a ${styleName.toLowerCase()} profile suggests ${allocation.stocks}% stocks, ${allocation.bonds}% bonds, ${allocation.realEstate}% real estate, ${allocation.cash}% cash. Expected annual return: ${(expectedReturn*100).toFixed(1)}%. Risk score: ${riskScore}/10.`;
  }

  renderTable(allocation);
  renderChart(allocation);
}

function renderTable(allocation) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  thead.innerHTML = '<tr><th>Asset Class</th><th>Target Allocation (%)</th><th>Expected Return</th><th>Risk Contribution</th></tr>';
  const classes = [
    { name: 'Stocks', pct: allocation.stocks, ret: ASSET_CLASSES.stocks.return, risk: ASSET_CLASSES.stocks.risk },
    { name: 'Bonds', pct: allocation.bonds, ret: ASSET_CLASSES.bonds.return, risk: ASSET_CLASSES.bonds.risk },
    { name: 'Real Estate', pct: allocation.realEstate, ret: ASSET_CLASSES.realEstate.return, risk: ASSET_CLASSES.realEstate.risk },
    { name: 'Cash', pct: allocation.cash, ret: ASSET_CLASSES.cash.return, risk: ASSET_CLASSES.cash.risk }
  ];
  let rows = '';
  classes.forEach(c => {
    rows += `<tr>
      <td class="highlight">${c.name}</td>
      <td>${c.pct}%</td>
      <td>${(c.ret*100).toFixed(1)}%</td>
      <td>${c.risk}</td>
    </tr>`;
  });
  tbody.innerHTML = rows;
}

function renderChart(allocation) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();

  const labels = ['Stocks', 'Bonds', 'Real Estate', 'Cash'];
  const data = [allocation.stocks, allocation.bonds, allocation.realEstate, allocation.cash];
  const colors = ['#0d9488', '#5eead4', '#f59e0b', '#94a3b8'];

  if (currentChartType === 'donut') {
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { font: { size: 12 } } } } }
    });
  } else {
    // Bar chart for risk vs return comparison (simplified)
    const returns = [ASSET_CLASSES.stocks.return*100, ASSET_CLASSES.bonds.return*100, ASSET_CLASSES.realEstate.return*100, ASSET_CLASSES.cash.return*100];
    const risks = [ASSET_CLASSES.stocks.risk, ASSET_CLASSES.bonds.risk, ASSET_CLASSES.realEstate.risk, ASSET_CLASSES.cash.risk];
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Expected Return (%)', data: returns, backgroundColor: '#0d9488' },
          { label: 'Risk Score', data: risks, backgroundColor: '#f59e0b' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
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
  const table = document.getElementById('breakdownTable');
  if (!table) return;
  let csv = '';
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    csv += Array.from(cells).map(cell => '"' + cell.textContent.replace(/"/g, '""') + '"').join(',') + '\n';
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'asset-allocation-plan.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function copyResult() {
  const cards = document.querySelectorAll('#resultCards .result-card');
  let text = '';
  cards.forEach(c => {
    if (c.style.display === 'none') return;
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
  ['riskTolerance', 'timeHorizon', 'currentAge', 'portfolioValue', 'customAllocationToggle',
   'stocksSlider', 'bondsSlider', 'realEstateSlider', 'cashSlider'].forEach(id => {
    let val = document.getElementById(id)?.value;
    if (id === 'customAllocationToggle') val = document.getElementById(id).checked;
    if (val !== undefined) params.set(id, val);
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
  ['riskTolerance', 'timeHorizon', 'currentAge', 'portfolioValue', 'stocksSlider', 'bondsSlider', 'realEstateSlider', 'cashSlider'].forEach(id => {
    if (params.has(id)) document.getElementById(id).value = params.get(id);
  });
  if (params.has('customAllocationToggle')) {
    document.getElementById('customAllocationToggle').checked = params.get('customAllocationToggle') === 'true';
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
  document.getElementById('riskTolerance').value = 'moderate';
  document.getElementById('timeHorizon').value = 20;
  document.getElementById('currentAge').value = 35;
  document.getElementById('portfolioValue').value = 100000;
  document.getElementById('customAllocationToggle').checked = false;
  document.getElementById('stocksSlider').value = 60;
  document.getElementById('bondsSlider').value = 30;
  document.getElementById('realEstateSlider').value = 5;
  document.getElementById('cashSlider').value = 5;
  syncSlider('timeHorizon');
  updateCustomAllocation();
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  syncSlider('timeHorizon');
  updateCustomAllocation();
  calculate();
});