// ==================== Interest vs Principal Breakdown JS ====================

let chartInstance = null;
let currentChartType = 'area';

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
  if (val >= 1e3 && val < 1e6) return s + Math.round(val/1e3) + 'k';
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
    if (id === 'loanAmount') display.textContent = formatCompact(val);
    else if (id === 'interestRate') display.textContent = val + '%';
    else if (id === 'loanTenure') display.textContent = val + ' yrs';
  }
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
  const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
  const annualRate = parseFloat(document.getElementById('interestRate').value) || 0;
  const years = parseFloat(document.getElementById('loanTenure').value) || 1;
  const months = years * 12;

  if (loanAmount <= 0 || annualRate <= 0 || months <= 0) {
    return;
  }

  const monthlyRate = annualRate / 100 / 12;
  let emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  let balance = loanAmount;
  let totalInterest = 0;
  let tippingPoint = null;
  let schedule = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principal = emi - interest;
    balance -= principal;
    totalInterest += interest;
    
    if (tippingPoint === null && principal > interest) {
      tippingPoint = i;
    }
    
    schedule.push({ 
      month: i, emi, principal, interest, balance: Math.max(0, balance)
    });
  }

  const totalPayment = loanAmount + totalInterest;
  const ratio = (loanAmount / totalPayment) * 100;

  document.getElementById('rEMI').textContent = formatCurrency(emi);
  document.getElementById('rTippingPoint').textContent = tippingPoint ? `Month ${tippingPoint} (Year ${Math.ceil(tippingPoint/12)})` : 'Never';
  document.getElementById('rTotalInterest').textContent = formatCurrency(totalInterest);
  document.getElementById('rRatio').textContent = `${ratio.toFixed(1)}% / ${(100 - ratio).toFixed(1)}%`;

  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.innerHTML = `Monthly payment: ${formatCurrency(emi)}. Tipping point at month ${tippingPoint || 'N/A'} where principal exceeds interest. Total interest: ${formatCurrency(totalInterest)} (${(100 - ratio).toFixed(1)}% of total).`;
  }

  renderTable(schedule);
  renderChart(schedule, loanAmount, totalInterest);
}

function renderTable(schedule) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  
  thead.innerHTML = '<tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Remaining Balance</th></tr>';
  
  let rows = '';
  // First 12 months
  for (let i = 0; i < Math.min(schedule.length, 12); i++) {
    const s = schedule[i];
    rows += `<tr><td class="highlight">${s.month}</td><td>${formatCurrency(s.emi)}</td><td class="principal-cell">${formatCurrency(s.principal)}</td><td class="interest-cell">${formatCurrency(s.interest)}</td><td class="balance-cell">${formatCurrency(s.balance)}</td></tr>`;
  }
  
  // Yearly summary for remaining years
  if (schedule.length > 12) {
    rows += `<tr style="background:#f8fafc;"><td colspan="5" style="text-align:center">... Yearly summary ...</td></tr>`;
    for (let i = 11; i < schedule.length; i += 12) {
      const s = schedule[i];
      const year = Math.floor(s.month / 12) + 1;
      rows += `<tr><td class="highlight">Year ${year} (Month ${s.month})</td><td>${formatCurrency(s.emi)}</td><td class="principal-cell">${formatCurrency(s.principal)}</td><td class="interest-cell">${formatCurrency(s.interest)}</td><td class="balance-cell">${formatCurrency(s.balance)}</td></tr>`;
    }
  }
  
  tbody.innerHTML = rows;
}

function renderChart(schedule, loanAmount, totalInterest) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();
  
  const months = schedule.map(s => s.month);
  const principalData = schedule.map(s => s.principal);
  const interestData = schedule.map(s => s.interest);
  const balances = schedule.map(s => s.balance);
  
  if (currentChartType === 'area') {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          { label: 'Principal Payment', data: principalData, borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.7)', fill: true, tension: 0.4 },
          { label: 'Interest Payment', data: interestData, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.7)', fill: true, tension: 0.4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { ticks: { callback: v => formatCompact(v) }, title: { display: true, text: 'Monthly Payment Amount' } } },
        plugins: { tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}` } } }
      }
    });
  } else if (currentChartType === 'balance') {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: { labels: months, datasets: [{ label: 'Remaining Balance', data: balances, borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true, tension: 0.4 }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: v => formatCompact(v) } } } }
    });
  } else {
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: { labels: ['Principal', 'Interest'], datasets: [{ data: [loanAmount, totalInterest], backgroundColor: ['#0d9488', '#f59e0b'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom' } } }
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
  a.download = 'interest-principal-breakdown.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function copyResult() {
  const text = `Monthly EMI: ${document.getElementById('rEMI').textContent}\nTipping Point: ${document.getElementById('rTippingPoint').textContent}\nTotal Interest: ${document.getElementById('rTotalInterest').textContent}\nSplit: ${document.getElementById('rRatio').textContent}`;
  navigator.clipboard.writeText(text).then(() => {
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
  params.set('loanAmount', document.getElementById('loanAmount').value);
  params.set('interestRate', document.getElementById('interestRate').value);
  params.set('loanTenure', document.getElementById('loanTenure').value);
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
  if (params.has('loanAmount')) document.getElementById('loanAmount').value = params.get('loanAmount');
  if (params.has('interestRate')) document.getElementById('interestRate').value = params.get('interestRate');
  if (params.has('loanTenure')) document.getElementById('loanTenure').value = params.get('loanTenure');
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
  document.getElementById('loanAmount').value = 500000;
  document.getElementById('interestRate').value = 8.5;
  document.getElementById('loanTenure').value = 20;
  ['loanAmount', 'interestRate', 'loanTenure'].forEach(syncSlider);
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  ['loanAmount', 'interestRate', 'loanTenure'].forEach(syncSlider);
  calculate();
});