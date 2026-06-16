// ==================== Debt Payoff Planner JS ====================

let chartInstance = null;
let currentChartType = 'line';
let nextDebtId = 4;
let activeDebtIds = [1, 2, 3];

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

// Add new debt section
function addDebt() {
  nextDebtId++;
  activeDebtIds.push(nextDebtId);
  const container = document.querySelector('.input-panel');
  const addButton = document.querySelector('.btn-secondary');
  const newDebtDiv = document.createElement('div');
  newDebtDiv.className = 'debt-section';
  newDebtDiv.id = `debtSection${nextDebtId}`;
  newDebtDiv.innerHTML = `
    <div class="debt-header">
      <span class="debt-title">Debt ${nextDebtId}</span>
      <button type="button" class="remove-debt-btn" onclick="removeDebt(${nextDebtId})">✖ Remove</button>
    </div>
    <div class="form-group">
      <label for="debt${nextDebtId}Balance">Balance</label>
      <div class="input-addons">
        <span class="input-addon" id="currencySymbol${nextDebtId}a">$</span>
        <input type="number" id="debt${nextDebtId}Balance" value="0" min="0" step="500" oninput="calculate()" />
      </div>
    </div>
    <div class="form-group">
      <label for="debt${nextDebtId}Rate">Interest Rate (%)</label>
      <div class="input-addons">
        <input type="number" id="debt${nextDebtId}Rate" value="0" min="0" step="0.5" oninput="calculate()" />
        <span class="input-addon input-addon--right">%</span>
      </div>
    </div>
    <div class="form-group">
      <label for="debt${nextDebtId}Min">Minimum Monthly Payment</label>
      <div class="input-addons">
        <span class="input-addon" id="currencySymbol${nextDebtId}b">$</span>
        <input type="number" id="debt${nextDebtId}Min" value="0" min="0" step="25" oninput="calculate()" />
      </div>
    </div>
  `;
  container.insertBefore(newDebtDiv, addButton.parentElement);
  document.querySelectorAll(`[id^="currencySymbol${nextDebtId}"]`).forEach(el => el.textContent = window.currentCurrency?.symbol || '$');
}

function removeDebt(id) {
  if (activeDebtIds.length <= 1) return;
  const el = document.getElementById(`debtSection${id}`);
  if (el) el.remove();
  activeDebtIds = activeDebtIds.filter(d => d !== id);
  calculate();
}

// Get all debts from DOM
function getAllDebts() {
  let debts = [];
  for (let id of activeDebtIds) {
    const bal = parseFloat(document.getElementById(`debt${id}Balance`)?.value) || 0;
    const rate = parseFloat(document.getElementById(`debt${id}Rate`)?.value) || 0;
    const min = parseFloat(document.getElementById(`debt${id}Min`)?.value) || 0;
    if (bal > 0 || rate > 0 || min > 0) {
      debts.push({ id, balance: bal, rate: rate, minPayment: min });
    }
  }
  return debts.filter(d => d.balance > 0);
}

// Simulate payoff
function simulatePayoff(debts, strategy, monthlyBudget) {
  let workingDebts = debts.map(d => ({ ...d, balance: d.balance }));
  let totalInterest = 0;
  let months = 0;
  const schedule = [];

  while (workingDebts.some(d => d.balance > 0.01) && months < 600) {
    months++;
    let remainingBudget = monthlyBudget;

    // First, pay minimums (but cap at remaining balance)
    for (let d of workingDebts) {
      if (d.balance > 0.01) {
        const minPayment = Math.min(d.minPayment, d.balance);
        d.balance -= minPayment;
        remainingBudget -= minPayment;
      }
    }

    // Then accrue interest on remaining balances
    for (let d of workingDebts) {
      if (d.balance > 0.01) {
        const interest = d.balance * (d.rate / 100 / 12);
        totalInterest += interest;
        d.balance += interest;
      }
    }

    // Sort active debts for extra payment
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

    // Clean up tiny balances (rounding errors)
    for (let d of workingDebts) {
      if (d.balance < 0.01) d.balance = 0;
    }

    // Record snapshot (only if not all zero or every 12 months)
    if (workingDebts.some(d => d.balance > 0.01) || months === 1) {
      const snapshot = workingDebts.map(d => ({ id: d.id, balance: Math.max(0, d.balance) }));
      schedule.push({ month: months, debts: snapshot });
    }
  }

  const totalPaid = monthlyBudget * months;
  return { months, interest: totalInterest, totalPaid, schedule };
}

function calculate() {
  const monthlyBudget = parseFloat(document.getElementById('monthlyBudget').value) || 0;
  const strategy = document.getElementById('strategy').value;
  const debts = getAllDebts();

  if (debts.length === 0 || monthlyBudget <= 0) {
    document.getElementById('rTimeToPayoff').textContent = '—';
    document.getElementById('rTotalInterest').textContent = '—';
    document.getElementById('rTotalPayments').textContent = '—';
    document.getElementById('insightBox').style.display = 'none';
    return;
  }

  const totalMin = debts.reduce((sum, d) => sum + d.minPayment, 0);
  if (monthlyBudget < totalMin) {
    const insightBox = document.getElementById('insightBox');
    const insightText = document.getElementById('insightText');
    insightBox.style.display = 'block';
    insightText.innerHTML = `⚠️ Your monthly budget (${formatCurrency(monthlyBudget)}) is less than total minimum payments (${formatCurrency(totalMin)}). Increase budget or reduce minimums.`;
    return;
  }

  const result = simulatePayoff(debts, strategy, monthlyBudget);

  document.getElementById('rTimeToPayoff').textContent = `${result.months} months`;
  document.getElementById('rTotalInterest').textContent = formatCurrency(result.interest);
  document.getElementById('rTotalPayments').textContent = formatCurrency(result.totalPaid);

  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    const strategyName = strategy === 'avalanche' ? 'Highest Interest First (Avalanche)' : 'Smallest Balance First (Snowball)';
    insightText.innerHTML = `Using ${strategyName} strategy: ${formatCurrency(monthlyBudget)}/month. Debt free in ${result.months} months. Total interest: ${formatCurrency(result.interest)}.`;
  }

  renderSchedule(result.schedule, debts);
  renderChart(result.schedule);
}

function renderSchedule(schedule, originalDebts) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  const debtHeaders = originalDebts.map((_, idx) => `Debt ${originalDebts[idx].id}`);
  thead.innerHTML = `<tr><th>Month</th>${debtHeaders.map(h => `<th>${h} Balance</th>`).join('')}<th>Total Remaining</th></tr>`;
  let rows = '';
  for (let i = 0; i < Math.min(schedule.length, 60); i++) {
    const monthData = schedule[i];
    const totalRemaining = monthData.debts.reduce((sum, d) => sum + d.balance, 0);
    rows += `<tr><td class="highlight">${monthData.month}</td>`;
    for (let j = 0; j < monthData.debts.length; j++) {
      rows += `<td class="debt-balance">${formatCurrency(monthData.debts[j].balance)}</td>`;
    }
    rows += `<td class="total-balance">${formatCurrency(totalRemaining)}</td></tr>`;
  }
  if (schedule.length > 60) {
    rows += `<tr style="background:#f8fafc;"><td colspan="${debtHeaders.length+2}" style="text-align:center">... ${schedule.length - 60} more months ...</td></tr>`;
  }
  tbody.innerHTML = rows;
}

function renderChart(schedule) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();
  const months = schedule.map(s => s.month);
  const totals = schedule.map(s => s.debts.reduce((sum, d) => sum + d.balance, 0));
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels: months, datasets: [{ label: 'Total Debt Balance', data: totals, borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true, tension: 0.4 }] },
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
  a.download = 'debt-payoff-schedule.csv';
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
  params.set('monthlyBudget', document.getElementById('monthlyBudget').value);
  params.set('strategy', document.getElementById('strategy').value);
  for (let id of activeDebtIds) {
    params.set(`debt${id}Bal`, document.getElementById(`debt${id}Balance`)?.value || 0);
    params.set(`debt${id}Rate`, document.getElementById(`debt${id}Rate`)?.value || 0);
    params.set(`debt${id}Min`, document.getElementById(`debt${id}Min`)?.value || 0);
  }
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
  if (params.has('strategy')) document.getElementById('strategy').value = params.get('strategy');
  for (let id of [1, 2, 3, 4, 5, 6]) {
    if (params.has(`debt${id}Bal`)) {
      if (id > 3 && !document.getElementById(`debtSection${id}`)) addDebt();
      if (document.getElementById(`debt${id}Balance`)) document.getElementById(`debt${id}Balance`).value = params.get(`debt${id}Bal`);
      if (document.getElementById(`debt${id}Rate`)) document.getElementById(`debt${id}Rate`).value = params.get(`debt${id}Rate`);
      if (document.getElementById(`debt${id}Min`)) document.getElementById(`debt${id}Min`).value = params.get(`debt${id}Min`);
    }
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
  document.getElementById('monthlyBudget').value = 1000;
  document.getElementById('strategy').value = 'avalanche';
  document.getElementById('debt1Balance').value = 5000;
  document.getElementById('debt1Rate').value = 18;
  document.getElementById('debt1Min').value = 150;
  document.getElementById('debt2Balance').value = 3000;
  document.getElementById('debt2Rate').value = 22;
  document.getElementById('debt2Min').value = 100;
  document.getElementById('debt3Balance').value = 10000;
  document.getElementById('debt3Rate').value = 12;
  document.getElementById('debt3Min').value = 200;
  for (let i = 4; i <= nextDebtId; i++) {
    const el = document.getElementById(`debtSection${i}`);
    if (el) el.remove();
  }
  nextDebtId = 3;
  activeDebtIds = [1, 2, 3];
  syncSlider('monthlyBudget');
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  syncSlider('monthlyBudget');
  calculate();
});
