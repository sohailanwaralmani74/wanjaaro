// ==================== Dollar Cost Averaging Calculator JS ====================

let chartInstance = null;
let currentChartType = 'line';

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
  if (display) display.textContent = formatCompact(val);
}
function syncInput(id, val) {
  const input = document.getElementById(id);
  if (input) input.value = val;
  syncSlider(id);
}

// Currency search (identical to previous)
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

// Generate random walk price series (always creates exactly `periods` prices)
function generateRandomPrices() {
  const periods = parseInt(document.getElementById('periods').value) || 12;
  let prices = [];
  let price = 100;
  for (let i = 0; i < periods; i++) {
    const change = (Math.random() - 0.5) * 0.2;
    price = price * (1 + change);
    price = Math.max(1, price);
    prices.push(price.toFixed(2));
  }
  document.getElementById('priceList').value = prices.join(', ');
  calculate();
}

function calculate() {
  const investmentAmount = parseFloat(document.getElementById('investmentAmount').value) || 0;
  const frequency = document.getElementById('frequency').value;
  let periods = parseInt(document.getElementById('periods').value) || 1;
  let priceInput = document.getElementById('priceList').value.trim();
  let prices = [];

  // 1. Build price list based on user input or generate default
  if (priceInput === "") {
    // Default linear series: start at 100, increase by 2 each period
    for (let i = 1; i <= periods; i++) {
      prices.push(100 + (i-1)*2);
    }
    document.getElementById('priceList').value = prices.map(p => p.toFixed(2)).join(', ');
  } else {
    // Parse user‑provided prices
    let rawPrices = priceInput.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
    if (rawPrices.length === periods) {
      prices = rawPrices;
    } else if (rawPrices.length > periods) {
      // Trim to the first `periods` prices
      prices = rawPrices.slice(0, periods);
      document.getElementById('priceList').value = prices.map(p => p.toFixed(2)).join(', ');
    } else {
      // Pad by repeating the last price
      const last = rawPrices[rawPrices.length - 1] || 100;
      prices = [...rawPrices];
      while (prices.length < periods) {
        prices.push(last);
      }
      document.getElementById('priceList').value = prices.map(p => p.toFixed(2)).join(', ');
    }
  }

  // Fallback: ensure we have at least one price
  if (prices.length === 0) {
    prices = Array(periods).fill(100);
  }

  // 2. DCA calculation
  let totalShares = 0;
  let totalInvested = 0;
  let transactions = [];
  for (let i = 0; i < periods; i++) {
    const price = prices[i];
    if (price <= 0) continue;
    const sharesBought = investmentAmount / price;
    totalShares += sharesBought;
    totalInvested += investmentAmount;
    transactions.push({ period: i+1, price, investment: investmentAmount, shares: sharesBought });
  }
  const avgCost = totalShares > 0 ? totalInvested / totalShares : 0;
  const lastPrice = prices[prices.length-1];
  const dcaFinalValue = totalShares * lastPrice;
  const dcaTotalReturn = dcaFinalValue - totalInvested;
  const dcaReturnPct = totalInvested > 0 ? (dcaTotalReturn / totalInvested) * 100 : 0;

  // 3. Update result cards
  document.getElementById('rAvgCost').textContent = formatCurrency(avgCost);
  document.getElementById('rTotalShares').textContent = totalShares.toFixed(4);
  document.getElementById('rTotalInvested').textContent = formatCurrency(totalInvested);
  document.getElementById('rFinalValue').textContent = formatCurrency(dcaFinalValue);
  document.getElementById('rTotalReturn').textContent = formatCurrency(dcaTotalReturn);

  // 4. Comparison section (Lump sum vs DCA)
  const compareToggle = document.getElementById('lumpSumToggle').checked;
  const compareSection = document.getElementById('compareSection');
  if (compareToggle && prices.length > 0) {
    compareSection.style.display = 'block';
    const lumpSumInvestment = investmentAmount * periods;
    const lumpSumShares = lumpSumInvestment / prices[0];
    const lumpSumFinalValue = lumpSumShares * lastPrice;
    const lumpSumTotalReturn = lumpSumFinalValue - lumpSumInvestment;
    const lumpSumReturnPct = (lumpSumTotalReturn / lumpSumInvestment) * 100;

    // DCA card
    document.getElementById('dcaFinal').textContent = formatCurrency(dcaFinalValue);
    document.getElementById('dcaInvested').textContent = formatCurrency(totalInvested);
    document.getElementById('dcaGains').textContent = formatCurrency(dcaTotalReturn);
    document.getElementById('dcaReturnPct').textContent = dcaReturnPct.toFixed(2) + '%';
    document.getElementById('dcaBadge').textContent = dcaTotalReturn >= 0 ? 'Gain' : 'Loss';
    document.getElementById('dcaBadge').style.background = dcaTotalReturn >= 0 ? '#e6f7e6' : '#ffe6e6';
    document.getElementById('dcaBadge').style.color = dcaTotalReturn >= 0 ? '#2e7d32' : '#c62828';

    // Lump sum card
    document.getElementById('lumpFinal').textContent = formatCurrency(lumpSumFinalValue);
    document.getElementById('lumpInvested').textContent = formatCurrency(lumpSumInvestment);
    document.getElementById('lumpGains').textContent = formatCurrency(lumpSumTotalReturn);
    document.getElementById('lumpReturnPct').textContent = lumpSumReturnPct.toFixed(2) + '%';
    document.getElementById('lumpBadge').textContent = lumpSumTotalReturn >= 0 ? 'Gain' : 'Loss';
    document.getElementById('lumpBadge').style.background = lumpSumTotalReturn >= 0 ? '#e6f7e6' : '#ffe6e6';
    document.getElementById('lumpBadge').style.color = lumpSumTotalReturn >= 0 ? '#2e7d32' : '#c62828';

    // Summary text
    const diff = lumpSumFinalValue - dcaFinalValue;
    const summary = document.getElementById('compareSummary');
    if (Math.abs(diff) < 0.01) {
      summary.innerHTML = `⚖️ DCA and lump sum deliver the same final value.`;
      summary.style.color = '#64748b';
    } else if (diff > 0) {
      summary.innerHTML = `💰 Lump sum outperforms DCA by ${formatCurrency(diff)} (${((diff / lumpSumInvestment)*100).toFixed(2)}% of total invested).`;
      summary.style.color = '#0d9488';
    } else {
      summary.innerHTML = `📈 DCA outperforms lump sum by ${formatCurrency(Math.abs(diff))} (${((Math.abs(diff) / totalInvested)*100).toFixed(2)}% of total invested).`;
      summary.style.color = '#0d9488';
    }
  } else {
    compareSection.style.display = 'none';
  }

  // 5. Insight box
  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.textContent = `DCA: Total invested ${formatCurrency(totalInvested)}, final value ${formatCurrency(dcaFinalValue)}, return ${formatCurrency(dcaTotalReturn)} (${dcaReturnPct.toFixed(2)}%).`;
  }

  renderTable(transactions, prices);
  renderChart(prices, avgCost, totalShares, investmentAmount, periods);
}

function renderTable(transactions, prices) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  thead.innerHTML = '<tr><th>Period</th><th>Price</th><th>Investment</th><th>Shares Bought</th><th>Cumulative Shares</th><th>Cumulative Invested</th></td>';
  let cumShares = 0;
  let cumInvested = 0;
  let rows = '';
  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];
    cumShares += t.shares;
    cumInvested += t.investment;
    rows += `<tr>
      <td>${t.period}</td>
      <td>${formatCurrency(t.price)}</td>
      <td>${formatCurrency(t.investment)}</td>
      <td>${t.shares.toFixed(4)}</td>
      <td>${cumShares.toFixed(4)}</td>
      <td>${formatCurrency(cumInvested)}</td>
    </tr>`;
  }
  tbody.innerHTML = rows;
}

function renderChart(prices, avgCost, totalShares, investmentAmount, periods) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();

  const labels = Array.from({length: periods}, (_,i) => (i+1).toString());
  if (currentChartType === 'line') {
    const avgCostLine = Array(periods).fill(avgCost);
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Asset Price', data: prices, borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: false, tension: 0.3 },
          { label: 'Average Cost Basis', data: avgCostLine, borderColor: '#f59e0b', borderDash: [5,5], fill: false, pointRadius: 0 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatCompact(v) } } } }
    });
  } else {
    const sharesData = prices.map(p => investmentAmount / p);
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Shares Purchased', data: sharesData, backgroundColor: '#0d9488' }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => v.toFixed(2) } } } }
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
  a.download = 'dca-transactions.csv';
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
  ['investmentAmount', 'frequency', 'periods', 'priceList', 'lumpSumToggle'].forEach(id => {
    let val = document.getElementById(id).value;
    if (id === 'lumpSumToggle') val = document.getElementById(id).checked;
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
  ['investmentAmount', 'periods'].forEach(id => {
    if (params.has(id)) document.getElementById(id).value = params.get(id);
  });
  if (params.has('frequency')) document.getElementById('frequency').value = params.get('frequency');
  if (params.has('priceList')) document.getElementById('priceList').value = params.get('priceList');
  if (params.has('lumpSumToggle')) {
    document.getElementById('lumpSumToggle').checked = params.get('lumpSumToggle') === 'true';
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
  document.getElementById('investmentAmount').value = 100;
  document.getElementById('frequency').value = 'monthly';
  document.getElementById('periods').value = 12;
  document.getElementById('priceList').value = '';
  document.getElementById('lumpSumToggle').checked = false;
  syncSlider('investmentAmount');
  generateRandomPrices();
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  syncSlider('investmentAmount');
  if (!document.getElementById('priceList').value.trim()) {
    generateRandomPrices();
  } else {
    calculate();
  }
});