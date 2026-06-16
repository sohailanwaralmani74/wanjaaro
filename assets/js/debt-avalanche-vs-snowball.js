// ==================== Debt Avalanche vs Snowball Simulator JS ====================

let chartInstance = null;
let currentChartType = 'line';
let avalancheDonutChart = null;
let snowballDonutChart = null;

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

// Simulate payoff for a given strategy (avalanche or snowball) with 2 debts
function simulatePayoff(debts, strategy, monthlyBudget) {
  let workingDebts = debts.map(d => ({ ...d, balance: d.balance }));
  let totalInterest = 0;
  let months = 0;
  let firstDebtCleared = null;
  const schedule = [];
  let totalPrincipal = debts.reduce((sum, d) => sum + d.balance, 0);

  while (workingDebts.some(d => d.balance > 0.01) && months < 600) {
    months++;
    let remainingBudget = monthlyBudget;

    // Record balances before this month's payments
    const beforeBalances = workingDebts.map(d => d.balance);

    // Pay minimums on all debts
    for (let d of workingDebts) {
      if (d.balance > 0.01) {
        const minPayment = Math.min(d.minPayment, d.balance);
        d.balance -= minPayment;
        remainingBudget -= minPayment;
      }
    }

    // Accrue interest on remaining balances
    for (let d of workingDebts) {
      if (d.balance > 0.01) {
        const interest = d.balance * (d.rate / 100 / 12);
        totalInterest += interest;
        d.balance += interest;
      }
    }

    // Sort active debts based on strategy
    let activeDebts = workingDebts.filter(d => d.balance > 0.01);
    if (strategy === 'snowball') {
      activeDebts.sort((a, b) => a.balance - b.balance);
    } else {
      activeDebts.sort((a, b) => b.rate - a.rate);
    }

    // Apply remaining budget to first active debt
    if (activeDebts.length > 0 && remainingBudget > 0.01) {
      const target = activeDebts[0];
      const extra = Math.min(remainingBudget, target.balance);
      target.balance -= extra;
      remainingBudget -= extra;
    }

    // Check if any debt was just cleared
    for (let i = 0; i < workingDebts.length; i++) {
      if (beforeBalances[i] > 0.01 && workingDebts[i].balance <= 0.01 && firstDebtCleared === null) {
        firstDebtCleared = months;
      }
    }

    // Clean up tiny balances
    for (let d of workingDebts) {
      if (d.balance < 0.01) d.balance = 0;
    }

    // Record snapshot
    const snapshot = workingDebts.map(d => ({ id: d.id, balance: Math.max(0, d.balance) }));
    schedule.push({ month: months, debts: snapshot });
  }

  const totalPaid = monthlyBudget * months;
  const totalPrincipalRepaid = totalPrincipal;
  
  return { months, interest: totalInterest, totalPaid, totalPrincipal: totalPrincipalRepaid, schedule, firstDebtCleared };
}

function calculate() {
  const monthlyBudget = parseFloat(document.getElementById('monthlyBudget').value) || 0;
  
  // Get 2 debts
  const debts = [
    { id: 1, balance: parseFloat(document.getElementById('debt1Balance').value) || 0, rate: parseFloat(document.getElementById('debt1Rate').value) || 0, minPayment: parseFloat(document.getElementById('debt1Min').value) || 0 },
    { id: 2, balance: parseFloat(document.getElementById('debt2Balance').value) || 0, rate: parseFloat(document.getElementById('debt2Rate').value) || 0, minPayment: parseFloat(document.getElementById('debt2Min').value) || 0 }
  ].filter(d => d.balance > 0);

  if (debts.length === 0 || monthlyBudget <= 0) {
    document.getElementById('avalancheTime').textContent = '—';
    document.getElementById('avalancheInterest').textContent = '—';
    document.getElementById('avalancheFirstPaid').textContent = '—';
    document.getElementById('snowballTime').textContent = '—';
    document.getElementById('snowballInterest').textContent = '—';
    document.getElementById('snowballFirstPaid').textContent = '—';
    document.getElementById('winnerBox').style.display = 'none';
    return;
  }

  const totalMin = debts.reduce((sum, d) => sum + d.minPayment, 0);
  if (monthlyBudget < totalMin) {
    const winnerBox = document.getElementById('winnerBox');
    winnerBox.style.display = 'block';
    document.getElementById('winnerBadge').innerHTML = '⚠️ Warning';
    document.getElementById('winnerMessage').innerHTML = `Your monthly budget (${formatCurrency(monthlyBudget)}) is less than total minimum payments (${formatCurrency(totalMin)}). Increase budget or reduce minimums.`;
    return;
  }

  // Simulate both strategies
  const avalanche = simulatePayoff(debts, 'avalanche', monthlyBudget);
  const snowball = simulatePayoff(debts, 'snowball', monthlyBudget);

  // Update results
  document.getElementById('avalancheTime').textContent = `${avalanche.months} months`;
  document.getElementById('avalancheInterest').textContent = formatCurrency(avalanche.interest);
  document.getElementById('avalancheFirstPaid').textContent = avalanche.firstDebtCleared ? `Month ${avalanche.firstDebtCleared}` : '—';
  document.getElementById('snowballTime').textContent = `${snowball.months} months`;
  document.getElementById('snowballInterest').textContent = formatCurrency(snowball.interest);
  document.getElementById('snowballFirstPaid').textContent = snowball.firstDebtCleared ? `Month ${snowball.firstDebtCleared}` : '—';

  // Determine winner and show insight
  const winnerBox = document.getElementById('winnerBox');
  winnerBox.style.display = 'block';
  
  if (avalanche.interest < snowball.interest) {
    const saved = snowball.interest - avalanche.interest;
    const monthsSaved = avalanche.months < snowball.months ? snowball.months - avalanche.months : 0;
    document.getElementById('winnerBadge').innerHTML = '🏆 Avalanche Wins';
    document.getElementById('winnerMessage').innerHTML = `Avalanche saves you ${formatCurrency(saved)} in interest and gets you debt-free ${monthsSaved > 0 ? monthsSaved + ' months faster' : 'faster'}.`;
  } else if (snowball.interest < avalanche.interest) {
    const saved = avalanche.interest - snowball.interest;
    const monthsSaved = snowball.months < avalanche.months ? avalanche.months - snowball.months : 0;
    document.getElementById('winnerBadge').innerHTML = '🏆 Snowball Wins';
    document.getElementById('winnerMessage').innerHTML = `Snowball saves you ${formatCurrency(saved)} in interest and gets you debt-free ${monthsSaved > 0 ? monthsSaved + ' months faster' : 'faster'}.`;
  } else {
    document.getElementById('winnerBadge').innerHTML = '⚖️ Tie';
    document.getElementById('winnerMessage').innerHTML = `Both strategies take ${avalanche.months} months and pay the same total interest.`;
  }

  // Render donut charts
  renderDonutCharts(avalanche.totalPrincipal, avalanche.interest, snowball.totalPrincipal, snowball.interest);
  
  // Render comparison table
  renderComparisonTable(avalanche.schedule, snowball.schedule, debts);
  
  // Render line/bar chart
  renderChart(avalanche.schedule, snowball.schedule);
}

function renderDonutCharts(avalanchePrincipal, avalancheInterest, snowballPrincipal, snowballInterest) {
  const ctx1 = document.getElementById('avalancheDonutChart')?.getContext('2d');
  const ctx2 = document.getElementById('snowballDonutChart')?.getContext('2d');
  
  if (ctx1) {
    if (avalancheDonutChart) avalancheDonutChart.destroy();
    avalancheDonutChart = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Principal Repaid', 'Interest Paid'],
        datasets: [{ data: [avalanchePrincipal, avalancheInterest], backgroundColor: ['#0d9488', '#f59e0b'], borderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } } }
    });
  }
  
  if (ctx2) {
    if (snowballDonutChart) snowballDonutChart.destroy();
    snowballDonutChart = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Principal Repaid', 'Interest Paid'],
        datasets: [{ data: [snowballPrincipal, snowballInterest], backgroundColor: ['#0d9488', '#f59e0b'], borderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } } }
    });
  }
}

function renderComparisonTable(avalancheSchedule, snowballSchedule, debts) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  
  thead.innerHTML = `<tr>
    <th rowspan="2">Month</th>
    <th colspan="2">Avalanche (Highest Interest First)</th>
    <th colspan="2">Snowball (Smallest Balance First)</th>
  </tr>
  <tr>
    <th>Debt 1</th>
    <th>Debt 2</th>
    <th>Debt 1</th>
    <th>Debt 2</th>
  </tr>`;

  const maxMonths = Math.max(avalancheSchedule.length, snowballSchedule.length);
  let rows = '';
  
  for (let i = 0; i < Math.min(maxMonths, 36); i++) {
    const avaMonth = avalancheSchedule[i] || { debts: debts.map(() => ({ balance: 0 })) };
    const snowMonth = snowballSchedule[i] || { debts: debts.map(() => ({ balance: 0 })) };
    
    rows += `<tr>
      <td class="highlight">${i + 1}</td>
      <td>${formatCurrency(avaMonth.debts[0]?.balance || 0)}</td>
      <td>${formatCurrency(avaMonth.debts[1]?.balance || 0)}</td>
      <td>${formatCurrency(snowMonth.debts[0]?.balance || 0)}</td>
      <td>${formatCurrency(snowMonth.debts[1]?.balance || 0)}</td>
    </tr>`;
  }
  
  if (maxMonths > 36) {
    rows += `<tr style="background:#f8fafc;"><td colspan="5" style="text-align:center">... ${maxMonths - 36} more months ...</td></tr>`;
  }
  
  tbody.innerHTML = rows;
}

function renderChart(avalancheSchedule, snowballSchedule) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();
  
  if (currentChartType === 'line') {
    const months = Array.from({ length: Math.min(avalancheSchedule.length, 60) }, (_, i) => i + 1);
    const avalancheTotals = months.map(m => avalancheSchedule[m-1]?.debts.reduce((sum, d) => sum + d.balance, 0) || 0);
    const snowballTotals = months.map(m => snowballSchedule[m-1]?.debts.reduce((sum, d) => sum + d.balance, 0) || 0);
    
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          { label: 'Avalanche (Highest Interest First)', data: avalancheTotals, borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true, tension: 0.4 },
          { label: 'Snowball (Smallest Balance First)', data: snowballTotals, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', fill: true, tension: 0.4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { ticks: { callback: v => formatCompact(v) } } },
        plugins: { tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}` } } }
      }
    });
  } else {
    // Bar chart: Interest by Debt
    const debt1Balance = parseFloat(document.getElementById('debt1Balance').value) || 0;
    const debt2Balance = parseFloat(document.getElementById('debt2Balance').value) || 0;
    const debt1Rate = parseFloat(document.getElementById('debt1Rate').value) || 0;
    const debt2Rate = parseFloat(document.getElementById('debt2Rate').value) || 0;
    
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Debt 1', 'Debt 2'],
        datasets: [
          { label: 'Balance', data: [debt1Balance, debt2Balance], backgroundColor: '#0d9488' },
          { label: 'Interest Rate (%)', data: [debt1Rate, debt2Rate], backgroundColor: '#f59e0b', type: 'bar', yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { title: { display: true, text: 'Amount ($)' } }, y1: { position: 'right', title: { display: true, text: 'Interest Rate (%)' } } }
      }
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
  a.download = 'debt-strategy-comparison.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function copyResult() {
  const avalancheTime = document.getElementById('avalancheTime').textContent;
  const avalancheInterest = document.getElementById('avalancheInterest').textContent;
  const snowballTime = document.getElementById('snowballTime').textContent;
  const snowballInterest = document.getElementById('snowballInterest').textContent;
  const text = `Avalanche: ${avalancheTime}, Interest: ${avalancheInterest}\nSnowball: ${snowballTime}, Interest: ${snowballInterest}`;
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
  params.set('monthlyBudget', document.getElementById('monthlyBudget').value);
  params.set('debt1Bal', document.getElementById('debt1Balance').value);
  params.set('debt1Rate', document.getElementById('debt1Rate').value);
  params.set('debt1Min', document.getElementById('debt1Min').value);
  params.set('debt2Bal', document.getElementById('debt2Balance').value);
  params.set('debt2Rate', document.getElementById('debt2Rate').value);
  params.set('debt2Min', document.getElementById('debt2Min').value);
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
  if (params.has('monthlyBudget')) document.getElementById('monthlyBudget').value = params.get('monthlyBudget');
  if (params.has('debt1Bal')) document.getElementById('debt1Balance').value = params.get('debt1Bal');
  if (params.has('debt1Rate')) document.getElementById('debt1Rate').value = params.get('debt1Rate');
  if (params.has('debt1Min')) document.getElementById('debt1Min').value = params.get('debt1Min');
  if (params.has('debt2Bal')) document.getElementById('debt2Balance').value = params.get('debt2Bal');
  if (params.has('debt2Rate')) document.getElementById('debt2Rate').value = params.get('debt2Rate');
  if (params.has('debt2Min')) document.getElementById('debt2Min').value = params.get('debt2Min');
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
  document.getElementById('monthlyBudget').value = 1000;
  document.getElementById('debt1Balance').value = 5000;
  document.getElementById('debt1Rate').value = 22;
  document.getElementById('debt1Min').value = 200;
  document.getElementById('debt2Balance').value = 3000;
  document.getElementById('debt2Rate').value = 18;
  document.getElementById('debt2Min').value = 150;
  syncSlider('monthlyBudget');
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  syncSlider('monthlyBudget');
  calculate();
});