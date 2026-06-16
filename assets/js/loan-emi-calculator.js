// ==================== Loan EMI Calculator JS ====================

let chartInstance = null;
let currentChartType = 'donut';

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

function calculate() {
  let loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
  let annualRate = parseFloat(document.getElementById('interestRate').value) || 0;
  let years = parseFloat(document.getElementById('loanTenure').value) || 1;
  let monthsInput = parseFloat(document.getElementById('loanTenureMonths').value) || 0;
  let prepayment = parseFloat(document.getElementById('prepaymentAmount').value) || 0;
  const showPrepayment = document.getElementById('prepaymentToggle').checked;
  const prepaymentResults = document.getElementById('prepaymentResults');

  let months = monthsInput > 0 ? monthsInput : years * 12;
  if (months <= 0) months = 12;

  const monthlyRate = annualRate / 100 / 12;

  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;
  let schedule = [];

  if (loanAmount > 0 && monthlyRate > 0) {
    emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    totalPayment = emi * months;
    totalInterest = totalPayment - loanAmount;

    // Build amortisation schedule
    let balance = loanAmount;
    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principal = emi - interest;
      balance -= principal;
      schedule.push({ month: i, principal, interest, emi, balance: Math.max(0, balance) });
    }
  } else if (loanAmount > 0 && monthlyRate === 0) {
    emi = loanAmount / months;
    totalPayment = loanAmount;
    totalInterest = 0;
    let balance = loanAmount;
    for (let i = 1; i <= months; i++) {
      const principal = emi;
      balance -= principal;
      schedule.push({ month: i, principal, interest: 0, emi, balance: Math.max(0, balance) });
    }
  }

  document.getElementById('rEMI').textContent = formatCurrency(emi);
  document.getElementById('rTotalInterest').textContent = formatCurrency(totalInterest);
  document.getElementById('rTotalPayment').textContent = formatCurrency(totalPayment);
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  document.getElementById('rInterestPercent').textContent = interestPercent.toFixed(1) + '%';

  // Prepayment impact
  if (showPrepayment && prepayment > 0 && prepayment <= loanAmount) {
    prepaymentResults.style.display = 'block';
    const newLoanAmount = loanAmount - prepayment;
    let newEMI = 0;
    let newTenure = months;
    if (newLoanAmount > 0 && monthlyRate > 0) {
      newEMI = newLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      // Calculate new tenure if EMI kept same
      const remaining = newLoanAmount;
      let tenure = 0;
      let bal = remaining;
      while (bal > 0 && tenure < 600) {
        const interestBal = bal * monthlyRate;
        const principalPaid = emi - interestBal;
        if (principalPaid <= 0) break;
        bal -= principalPaid;
        tenure++;
      }
      newTenure = tenure;
    } else if (monthlyRate === 0) {
      newEMI = newLoanAmount / months;
      newTenure = Math.ceil(newLoanAmount / emi);
    }
    const newTotalPayment = newEMI * months;
    const newTotalInterest = newTotalPayment - newLoanAmount;
    const interestSaved = totalInterest - newTotalInterest;
    document.getElementById('rPrepaymentSavings').textContent = formatCurrency(Math.max(0, interestSaved));
    document.getElementById('rNewEMI').textContent = formatCurrency(newEMI);
    document.getElementById('rNewTenure').textContent = newTenure + ' months';
  } else {
    prepaymentResults.style.display = 'none';
  }

  // Insight box
  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.innerHTML = `Monthly EMI: ${formatCurrency(emi)} for ${months} months. Total interest: ${formatCurrency(totalInterest)} (${interestPercent.toFixed(1)}% of total payment).`;
  }

  renderTable(schedule, months);
  renderChart(loanAmount, totalInterest, schedule, months);
}

function renderTable(schedule, totalMonths) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  
  const showFullTable = document.getElementById('fullTableToggle')?.checked || false;
  
  thead.innerHTML = '<tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Remaining Balance</th></tr>';
  
  let rows = '';
  
  // If full table is requested, show ALL months
  if (showFullTable) {
    for (let i = 0; i < schedule.length; i++) {
      const s = schedule[i];
      rows += `<tr>
        <td class="highlight">${s.month}</td>
        <td>${formatCurrency(s.emi)}</td>
        <td>${formatCurrency(s.principal)}</td>
        <td>${formatCurrency(s.interest)}</td>
        <td>${formatCurrency(s.balance)}</td>
      </tr>`;
    }
  } 
  // If tenure is 36 months or less, show full monthly schedule (summary view = full)
  else if (totalMonths <= 36) {
    for (let i = 0; i < schedule.length; i++) {
      const s = schedule[i];
      rows += `<tr>
        <td class="highlight">${s.month}</td>
        <td>${formatCurrency(s.emi)}</td>
        <td>${formatCurrency(s.principal)}</td>
        <td>${formatCurrency(s.interest)}</td>
        <td>${formatCurrency(s.balance)}</td>
      </tr>`;
    }
  } 
  // Default summary view for loans > 3 years
  else {
    // Show first 12 months monthly
    for (let i = 0; i < Math.min(schedule.length, 12); i++) {
      const s = schedule[i];
      rows += `<tr>
        <td class="highlight">${s.month}</td>
        <td>${formatCurrency(s.emi)}</td>
        <td>${formatCurrency(s.principal)}</td>
        <td>${formatCurrency(s.interest)}</td>
        <td>${formatCurrency(s.balance)}</td>
      </tr>`;
    }
    
    // Add separator
    rows += `<tr style="background:#f8fafc;"><td colspan="5" style="text-align:center">... Yearly summary from year 2 onward ...</td></tr>`;
    
    // Show every 12th month (end of each year)
    for (let i = 11; i < schedule.length; i += 12) {
      const s = schedule[i];
      const year = Math.floor(s.month / 12) + 1;
      rows += `<tr>
        <td class="highlight">Year ${year} (Month ${s.month})</td>
        <td>${formatCurrency(s.emi)}</td>
        <td>${formatCurrency(s.principal)}</td>
        <td>${formatCurrency(s.interest)}</td>
        <td>${formatCurrency(s.balance)}</td>
      </tr>`;
    }
  }
  
  tbody.innerHTML = rows;
}

function renderChart(loanAmount, totalInterest, schedule, months) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();

  if (currentChartType === 'donut') {
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Principal', 'Interest'],
        datasets: [{ data: [loanAmount, totalInterest], backgroundColor: ['#0d9488', '#f59e0b'], borderWidth: 0, hoverOffset: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom' } } }
    });
  } else {
    // Line chart: balance over time
    const balances = schedule.map(s => s.balance);
    const labels = schedule.map(s => `M${s.month}`);
    // Show only every 12th label to avoid clutter
    const filteredLabels = labels.map((l, i) => i % 12 === 0 ? l : '');
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: filteredLabels,
        datasets: [{ label: 'Remaining Balance', data: balances, borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true, tension: 0.4 }]
      },
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
  a.download = 'loan-amortisation-schedule.csv';
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
  ['loanAmount', 'interestRate', 'loanTenure', 'loanTenureMonths', 'prepaymentAmount', 'prepaymentToggle', 'fullTableToggle'].forEach(id => {
    let val = document.getElementById(id).value;
    if (id === 'prepaymentToggle' || id === 'fullTableToggle') val = document.getElementById(id).checked;
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
  ['loanAmount', 'interestRate', 'loanTenure', 'loanTenureMonths', 'prepaymentAmount'].forEach(id => {
    if (params.has(id)) document.getElementById(id).value = params.get(id);
  });
  if (params.has('prepaymentToggle')) {
    document.getElementById('prepaymentToggle').checked = params.get('prepaymentToggle') === 'true';
  }
  if (params.has('fullTableToggle')) {  // <-- add this
    document.getElementById('fullTableToggle').checked = params.get('fullTableToggle') === 'true';
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
  document.getElementById('loanAmount').value = 500000;
  document.getElementById('interestRate').value = 8.5;
  document.getElementById('loanTenure').value = 20;
  document.getElementById('loanTenureMonths').value = 0;
  document.getElementById('prepaymentAmount').value = 0;
  document.getElementById('prepaymentToggle').checked = false;
  document.getElementById('fullTableToggle').checked = false;  // <-- add this line
  ['loanAmount', 'interestRate', 'loanTenure'].forEach(syncSlider);
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  ['loanAmount', 'interestRate', 'loanTenure'].forEach(syncSlider);
  calculate();
});