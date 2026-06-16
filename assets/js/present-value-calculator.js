// =============================================================================
// PRESENT VALUE CALCULATOR — Full JS
// Same structure as future-value.js, adjusted for discounting
// =============================================================================

// --- Currency data (fallback if currencies.js not loaded) ---
const DEFAULT_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "ZAR", symbol: "R", name: "South African Rand" }
];

let allCurrencies = window.allCurrencies || DEFAULT_CURRENCIES;
// Deduplicate and sort
if (!window.allCurrencies) {
  const seen = new Set();
  allCurrencies = DEFAULT_CURRENCIES.filter(c => {
    if (seen.has(c.code)) return false;
    seen.add(c.code);
    return true;
  });
}
allCurrencies.sort((a,b) => a.code.localeCompare(b.code));

// --- Global state ---
let currentCurrency = allCurrencies.find(c => c.code === 'USD') || allCurrencies[0];
let chartInstance = null;
let currentChartType = 'line';

// Helper: format compact (k, M, B)
function formatCompact(num) {
  const val = isFinite(parseFloat(num)) ? parseFloat(num) : 0;
  const s = currentCurrency.symbol;
  if (val >= 1e9) return s + (val / 1e9).toFixed(1) + 'B';
  if (val >= 1e6) return s + (val / 1e6).toFixed(1) + 'M';
  if (val >= 1e3) return s + (val / 1e3).toFixed(1) + 'k';
  return s + val.toFixed(0);
}
function formatCurrency(num) {
  const val = isFinite(parseFloat(num)) ? parseFloat(num) : 0;
  return currentCurrency.symbol + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Slider helpers (reuse same field names)
function syncSlider(id) {
  const input = document.getElementById(id);
  const slider = document.getElementById(id + 'Slider');
  const display = document.getElementById(id + 'SliderVal');
  if (!input || !slider) return;
  const val = parseFloat(input.value) || 0;
  slider.value = val;
  if (display) {
    if (id === 'futureValue') display.textContent = formatCompact(val);
    else if (id === 'rate') display.textContent = val + '%';
    else if (id === 'years') display.textContent = val + ' yrs';
    else display.textContent = val;
  }
}
function syncInput(id, val) {
  const input = document.getElementById(id);
  const display = document.getElementById(id + 'SliderVal');
  if (!input) return;
  input.value = val;
  if (display) {
    const num = parseFloat(val) || 0;
    if (id === 'futureValue') display.textContent = formatCompact(num);
    else if (id === 'rate') display.textContent = num + '%';
    else if (id === 'years') display.textContent = num + ' yrs';
    else display.textContent = num;
  }
}

// Currency search (same as future-value)
function setupCurrencySearch() {
  const searchInput = document.getElementById('currencySearch');
  const resultsDiv = document.getElementById('currencyResults');
  if (!searchInput || !resultsDiv) return;
  searchInput.value = currentCurrency.code + ' — ' + currentCurrency.name;
  searchInput.addEventListener('focus', () => {
    resultsDiv.classList.add('show');
    renderCurrencyResults(allCurrencies);
  });
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allCurrencies.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    renderCurrencyResults(filtered);
    resultsDiv.classList.add('show');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.currency-search-wrapper')) resultsDiv.classList.remove('show');
  });
}
function renderCurrencyResults(list) {
  const div = document.getElementById('currencyResults');
  if (!div) return;
  if (!list.length) {
    div.innerHTML = '<div class="currency-option"><span class="curr-name">No currencies found</span></div>';
    return;
  }
  div.innerHTML = list.map(c => `<div class="currency-option" onclick="selectCurrency('${c.code}')">
    <span class="curr-code">${c.code}</span><span class="curr-name">${c.name}</span>
  </div>`).join('');
}
function selectCurrency(code) {
  currentCurrency = allCurrencies.find(c => c.code === code) || allCurrencies[0];
  const searchInput = document.getElementById('currencySearch');
  const resultsDiv = document.getElementById('currencyResults');
  if (searchInput) searchInput.value = currentCurrency.code + ' — ' + currentCurrency.name;
  if (resultsDiv) resultsDiv.classList.remove('show');
  document.querySelectorAll('[id^="currencySymbol"]').forEach(s => s.textContent = currentCurrency.symbol);
  calculate();
}

// --- Core present value logic ---
function calculate() {
  // Get inputs
  const futureLump = parseFloat(document.getElementById('futureValue')?.value) || 0;
  const rate = parseFloat(document.getElementById('rate')?.value) || 0;
  const years = parseInt(document.getElementById('years')?.value) || 1;
  const compound = parseInt(document.getElementById('compound')?.value) || 12;
  const monthlyFuture = parseFloat(document.getElementById('monthly')?.value) || 0;
  const inflationToggle = document.getElementById('inflationToggle')?.checked || false;
  const inflationRate = parseFloat(document.getElementById('inflationRate')?.value) || 0;

  // Show/hide inflation group
  const inflationGroup = document.getElementById('inflationRateGroup');
  if (inflationGroup) inflationGroup.style.display = inflationToggle ? 'block' : 'none';
  const realCard = document.getElementById('realValueCard');
  if (realCard) realCard.style.display = inflationToggle ? 'flex' : 'none';

  const r = rate / 100;
  const n = compound;
  const t = years;

  // Discount factor for lump sum: PV = FV / (1 + r/n)^(n*t)
  let pvLump = 0;
  if (r === 0) pvLump = futureLump;
  else pvLump = futureLump / Math.pow(1 + r / n, n * t);

  // Present value of future monthly contributions (end of period? start? assume start)
  // Formula: PV of an annuity due = PMT * [1 - (1 + r_monthly)^(-N)] / r_monthly * (1+r_monthly)
  // where monthly rate = r/12, N = total months = 12*years
  let pvContrib = 0;
  if (monthlyFuture > 0 && r > 0) {
    const monthlyRate = r / 12;
    const totalMonths = 12 * t;
    if (monthlyRate > 0) {
      pvContrib = monthlyFuture * (1 - Math.pow(1 + monthlyRate, -totalMonths)) / monthlyRate * (1 + monthlyRate);
    } else {
      pvContrib = monthlyFuture * totalMonths; // no discount
    }
  } else if (monthlyFuture > 0 && r === 0) {
    pvContrib = monthlyFuture * 12 * t;
  }

  const presentValue = pvLump + pvContrib;
  const totalFutureContrib = futureLump + monthlyFuture * 12 * t;
  const discountAmount = totalFutureContrib - presentValue;
  const apy = (Math.pow(1 + r / n, n) - 1) * 100;
  const multiple = presentValue > 0 ? totalFutureContrib / presentValue : 1;

  // Update result cards
  document.getElementById('rPresentValue').textContent = formatCurrency(presentValue);
  document.getElementById('rTotalFutureContributed').textContent = formatCurrency(totalFutureContrib);
  document.getElementById('rDiscountEarned').textContent = formatCurrency(discountAmount);
  document.getElementById('rAPY').textContent = apy.toFixed(2) + '%';
  document.getElementById('rMultiple').textContent = multiple.toFixed(1) + '×';

  if (inflationToggle) {
    // Real present value: discount future cash flows using real rate = (1+r)/(1+infl) -1
    const realRate = (1 + r) / (1 + inflationRate/100) - 1;
    let realPV = 0;
    if (realRate <= 0) {
      realPV = totalFutureContrib / Math.pow(1 + inflationRate/100, t);
    } else {
      const realR = realRate;
      realPV = futureLump / Math.pow(1 + realR / n, n * t);
      if (monthlyFuture > 0) {
        const monthlyReal = realR / 12;
        const totalMonths = 12 * t;
        if (monthlyReal > 0) {
          realPV += monthlyFuture * (1 - Math.pow(1 + monthlyReal, -totalMonths)) / monthlyReal * (1 + monthlyReal);
        } else {
          realPV += monthlyFuture * totalMonths;
        }
      }
    }
    document.getElementById('rRealValue').textContent = formatCurrency(realPV);
  }

  // Insight box
  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    let text = `A future lump sum of ${formatCurrency(futureLump)} `;
    if (monthlyFuture > 0) text += `plus future contributions of ${formatCurrency(monthlyFuture)}/month `;
    text += `in ${years} years is worth ${formatCurrency(presentValue)} today at a ${rate}% discount rate. `;
    text += `That's a discount of ${formatCurrency(discountAmount)}. `;
    if (inflationToggle) text += `After ${inflationRate}% inflation, the real present value is ${document.getElementById('rRealValue').textContent}.`;
    insightText.textContent = text;
  }

  renderTable(presentValue, totalFutureContrib, discountAmount, years, rate, compound, monthlyFuture, inflationToggle, inflationRate);
  renderChart(presentValue, futureLump, monthlyFuture, years, rate, compound, inflationToggle, inflationRate);
}

// --- Table: year-by-year discounted values ---
function renderTable(presentValue, totalFuture, discount, years, rate, compound, monthlyFuture, inflationToggle, inflationRate) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;

  const r = rate / 100;
  const n = compound;
  const monthlyRate = r / 12;

  thead.innerHTML = inflationToggle
    ? '<tr><th>Year</th><th>Future Value</th><th>Discounted Present</th><th>Cumulative Discount</th><th>Real Present (Adj.)</th></tr>'
    : '<tr><th>Year</th><th>Future Value</th><th>Discounted Present</th><th>Cumulative Discount</th></tr>';

  let rows = '';
  for (let yr = 1; yr <= years; yr++) {
    const futureLumpAtYr = parseFloat(document.getElementById('futureValue').value) || 0;
    const monthlyTotal = (parseFloat(document.getElementById('monthly').value) || 0) * 12 * yr;
    const futureVal = futureLumpAtYr + monthlyTotal;
    let discFactor = 1;
    if (r > 0) discFactor = Math.pow(1 + r / n, n * yr);
    else discFactor = 1;
    const discounted = futureVal / discFactor;
    const cumDiscount = futureVal - discounted;
    const realDiscounted = inflationToggle ? discounted / Math.pow(1 + inflationRate/100, yr) : null;

    rows += '<tr>' +
      '<td>' + yr + '</td>' +
      '<td>' + formatCurrency(futureVal) + '</td>' +
      '<td>' + formatCurrency(discounted) + '</td>' +
      '<td>' + formatCurrency(cumDiscount) + '</td>' +
      (inflationToggle ? '<td>' + formatCurrency(realDiscounted) + '</td>' : '') +
      '</tr>';
  }
  tbody.innerHTML = rows;
}

// --- Chart: line (PV over time), bar (annual discount), donut (composition of future value)---
function renderChart(presentValue, futureLump, monthlyFuture, years, rate, compound, inflationToggle, inflationRate) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();

  const r = rate / 100;
  const n = compound;
  const monthlyRate = r / 12;
  const totalFuture = futureLump + monthlyFuture * 12 * years;

  if (currentChartType === 'line') {
    // Show discounted value curve (present value as each future year is discounted)
    const labels = [];
    const pvData = [];
    for (let yr = 0; yr <= years; yr++) {
      const futureVal = futureLump + monthlyFuture * 12 * yr;
      let discFactor = 1;
      if (r > 0) discFactor = Math.pow(1 + r / n, n * yr);
      const pv = futureVal / discFactor;
      labels.push(yr);
      pvData.push(pv);
    }
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{ label: 'Present Value of Future Sum', data: pvData, borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.1)', fill: true, tension: 0.4 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => formatCurrency(ctx.parsed.y) } } },
        scales: { y: { beginAtZero: true, ticks: { callback: v => formatCompact(v) } } }
      }
    });
  } else if (currentChartType === 'bar') {
    // Show discount amount per year
    const yearsArr = [], discountPerYear = [];
    for (let yr = 1; yr <= years; yr++) {
      const futureVal = futureLump + monthlyFuture * 12 * yr;
      const prevFuture = futureLump + monthlyFuture * 12 * (yr-1);
      const discFactorYr = Math.pow(1 + r / n, n * yr);
      const discFactorPrev = Math.pow(1 + r / n, n * (yr-1));
      const pvYr = futureVal / discFactorYr;
      const pvPrev = prevFuture / discFactorPrev;
      discountPerYear.push(pvPrev - pvYr); // positive if discount increases
      yearsArr.push(yr);
    }
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels: yearsArr, datasets: [{ label: 'Discount Applied This Year', data: discountPerYear, backgroundColor: '#0d9488', borderRadius: 6 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: { callbacks: { label: (ctx) => formatCurrency(ctx.parsed.y) } } },
        scales: { y: { beginAtZero: true, ticks: { callback: v => formatCompact(v) } } }
      }
    });
  } else { // donut: composition of future value (lump sum vs contributions)
    const lumpSumPortion = futureLump;
    const contribPortion = monthlyFuture * 12 * years;
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Future Lump Sum', 'Future Contributions'],
        datasets: [{ data: [lumpSumPortion, contribPortion], backgroundColor: ['#0d9488', '#5eead4'], borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#475569', font: { size: 12 } } },
          tooltip: { callbacks: { label: (ctx) => ctx.label + ': ' + formatCurrency(ctx.parsed) + ' (' + ((ctx.parsed / totalFuture)*100).toFixed(1) + '%)' } }
        }
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
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'present-value-breakdown.csv';
  a.click();
  URL.revokeObjectURL(url);
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
  }).catch(() => alert('Copy failed — copy manually.'));
}

function shareURL() {
  const params = new URLSearchParams();
  document.querySelectorAll('.input-panel input:not([type="range"]), .input-panel select').forEach(el => {
    if (el.id) params.set(el.id, el.value);
  });
  params.set('currency', currentCurrency.code);
  const url = window.location.origin + window.location.pathname + '?' + params.toString();
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('shareBtn');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Link Copied!';
      setTimeout(() => btn.textContent = orig, 2000);
    }
  }).catch(() => alert('Could not copy link — copy from address bar.'));
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  document.querySelectorAll('.input-panel input:not([type="range"]), .input-panel select').forEach(el => {
    if (params.has(el.id)) el.value = params.get(el.id);
  });
  if (params.has('currency')) {
    const c = allCurrencies.find(x => x.code === params.get('currency'));
    if (c) {
      currentCurrency = c;
      document.querySelectorAll('[id^="currencySymbol"]').forEach(s => s.textContent = currentCurrency.symbol);
    }
  }
}

function resetForm() {
  document.getElementById('futureValue').value = 10000;
  document.getElementById('rate').value = 7;
  document.getElementById('years').value = 20;
  document.getElementById('compound').value = 12;
  document.getElementById('monthly').value = 0;
  document.getElementById('inflationToggle').checked = false;
  document.getElementById('inflationRate').value = 3;
  ['futureValue', 'rate', 'years'].forEach(id => syncSlider(id));
  calculate();
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  ['futureValue', 'rate', 'years'].forEach(id => syncSlider(id));
  calculate();
});