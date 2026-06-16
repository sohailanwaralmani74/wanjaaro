const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" }
];

let currentCurrency = currencies[0];
let chartInstance = null;
let currentChartType = 'line';

// FIX 5: Extracted shared constant to avoid duplication between syncSlider and syncInput
const MONEY_FIELDS = new Set([
  'principal', 'initialAmount', 'monthly', 'yearly', 'monthlyContribution',
  'additionalContributions', 'goalAmount', 'currentSavings', 'monthlySavings',
  'loanAmount', 'homeValue', 'downPayment', 'extraPayment', 'balance', 'amount',
  'income', 'housing', 'food', 'transport', 'utilities', 'other', 'cash',
  'investments', 'propertyValue', 'otherAssets', 'mortgage', 'loans', 'otherDebts',
  'debt1', 'debt2', 'monthlyRetirement', 'initialSavings', 'monthlyPayment', 'monthlyExpenses'
]);

function setupCurrencySearch() {
  const searchInput = document.getElementById('currencySearch');
  const resultsDiv = document.getElementById('currencyResults');
  if (!searchInput || !resultsDiv) return;

  searchInput.value = currentCurrency.code + ' — ' + currentCurrency.name;

  searchInput.addEventListener('focus', () => {
    resultsDiv.classList.add('show');
    renderCurrencyResults(currencies);
  });

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = currencies.filter(c =>
      c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
    renderCurrencyResults(filtered);
    resultsDiv.classList.add('show');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.currency-search-wrapper')) {
      resultsDiv.classList.remove('show');
    }
  });
}

function renderCurrencyResults(list) {
  const div = document.getElementById('currencyResults');
  if (!div) return;

  if (!list.length) {
    div.innerHTML = '<div class="currency-option"><span class="curr-name">No currencies found</span></div>';
    return;
  }

  div.innerHTML = list.map(c =>
    '<div class="currency-option" onclick="selectCurrency(\'' + c.code + '\')">' +
    '<span class="curr-code">' + c.code + '</span>' +
    '<span class="curr-name">' + c.name + '</span>' +
    '</div>'
  ).join('');
}

function selectCurrency(code) {
  currentCurrency = currencies.find(c => c.code === code) || currencies[0];
  const searchInput = document.getElementById('currencySearch');
  const resultsDiv = document.getElementById('currencyResults');
  if (searchInput) searchInput.value = currentCurrency.code + ' — ' + currentCurrency.name;
  if (resultsDiv) resultsDiv.classList.remove('show');

  const syms = document.querySelectorAll('[id^="currencySymbol"]');
  syms.forEach(s => s.textContent = currentCurrency.symbol);

  calculate();
}

function getSliderDisplayText(id, val) {
  if (MONEY_FIELDS.has(id)) return formatCompact(val);
  if (id === 'years' || id === 'currentAge' || id === 'retirementAge') return val + ' yrs';
  if (id === 'monthsNeeded') return val + ' mo';
  return val + '%';
}

function syncSlider(id) {
  const input = document.getElementById(id);
  const slider = document.getElementById(id + 'Slider');
  const display = document.getElementById(id + 'SliderVal');
  if (!input || !slider) return;

  const val = parseFloat(input.value) || 0;
  slider.value = val;

  // FIX 5: Use shared helper instead of duplicated isMoney array
  if (display) display.textContent = getSliderDisplayText(id, val);
}

function syncInput(id, value) {
  const input = document.getElementById(id);
  const display = document.getElementById(id + 'SliderVal');
  if (!input) return;

  input.value = value;

  // FIX 5: Use shared helper instead of duplicated isMoney array
  if (display) display.textContent = getSliderDisplayText(id, parseFloat(value) || 0);
}

function formatCompact(num) {
  const val = parseFloat(num) || 0;
  const s = currentCurrency.symbol;
  if (val >= 1000000) return s + (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return s + (val / 1000).toFixed(1) + 'k';
  return s + val.toFixed(0);
}

function formatCurrency(num) {
  // FIX 5: Guard against non-finite values before passing to toLocaleString
  const val = isFinite(parseFloat(num)) ? parseFloat(num) : 0;
  return currentCurrency.symbol + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// FIX 6: Added null guard for btn parameter
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
  a.download = 'rule-of-72-breakdown.csv';
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

  // FIX 4: Added .catch() handler for clipboard failures
  navigator.clipboard.writeText(text.trim()).then(() => {
    const btn = document.getElementById('copyBtn');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = orig, 2000);
  }).catch(() => {
    alert('Copy failed — please copy the results manually.');
  });
}

function shareURL() {
  const params = new URLSearchParams();

  // FIX 3: Exclude range sliders to avoid duplicate/polluting params in the URL
  document.querySelectorAll('.input-panel input:not([type="range"]), .input-panel select').forEach(el => {
    if (el.id) params.set(el.id, el.value);
  });
  params.set('currency', currentCurrency.code);

  const url = window.location.origin + window.location.pathname + '?' + params.toString();
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('shareBtn');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = '✓ Link Copied!';
    setTimeout(() => btn.textContent = orig, 2000);
  }).catch(() => {
    alert('Could not copy link — please copy the URL from your address bar.');
  });
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  // FIX 3: Also exclude range sliders here for consistency
  document.querySelectorAll('.input-panel input:not([type="range"]), .input-panel select').forEach(el => {
    if (params.has(el.id)) el.value = params.get(el.id);
  });

  if (params.has('currency')) {
    const c = currencies.find(x => x.code === params.get('currency'));
    if (c) {
      currentCurrency = c;
      const syms = document.querySelectorAll('[id^="currencySymbol"]');
      syms.forEach(s => s.textContent = currentCurrency.symbol);
    }
  }
}

function calculate() {
  const rate = parseFloat(document.getElementById('rate')?.value) || 0;
  const initial = parseFloat(document.getElementById('initialAmount')?.value) || 0;
  const years = parseInt(document.getElementById('years')?.value) || 1;

  if (rate <= 0) {
    document.getElementById('rule72Estimate').textContent = '—';
    document.getElementById('exactDoubling').textContent = '—';
    document.getElementById('doublingsInPeriod').textContent = '—';
    document.getElementById('finalValue').textContent = formatCurrency(initial);
    document.getElementById('insightBox').style.display = 'none';
    return;
  }

  const rule72 = 72 / rate;
  const exact = Math.log(2) / Math.log(1 + rate / 100);
  const doublings = Math.floor(years / exact);

  const finalValue = initial * Math.pow(1 + rate / 100, years);

  document.getElementById('rule72Estimate').textContent = rule72.toFixed(1) + ' yrs';
  document.getElementById('exactDoubling').textContent = exact.toFixed(2) + ' yrs';
  // FIX 1: Show "< 1×" instead of "0×" when doublings haven't occurred yet
  document.getElementById('doublingsInPeriod').textContent = doublings === 0 ? '< 1×' : doublings + '×';
  document.getElementById('finalValue').textContent = formatCurrency(finalValue);

  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    const multiple = initial > 0 ? (finalValue / initial).toFixed(1) : '0';
    insightText.textContent =
      'At ' + rate.toFixed(1) + '% return, your money doubles every ' + exact.toFixed(1) + ' years. ' +
      'In ' + years + ' years, ' + formatCurrency(initial) + ' grows to ' + formatCurrency(finalValue) + ' — ' + multiple + '× your initial investment.';
  }

  renderChart(initial, rate, years, exact);
  renderTable(initial, rate, years, exact);
}

function renderChart(initial, rate, years, exact) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded');
    return;
  }

  const data = [];
  for (let year = 0; year <= years; year++) {
    data.push({ year: year, value: initial * Math.pow(1 + rate / 100, year) });
  }

  const labels = data.map(d => 'Year ' + d.year);
  let config;

  if (currentChartType === 'line') {
    config = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Investment Value',
          data: data.map(d => d.value),
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => formatCurrency(ctx.parsed.y)
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: v => formatCompact(v),
              color: '#64748b',
              font: { size: 11 }
            },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: {
              maxTicksLimit: 10,
              color: '#64748b',
              font: { size: 11 }
            },
            grid: { display: false }
          }
        }
      }
    };
  } else if (currentChartType === 'bar') {
    const milestones = [];
    const maxDoublings = Math.floor(years / exact);
    for (let i = 1; i <= maxDoublings; i++) {
      // FIX 2: Use Math.floor instead of Math.round to keep doubling years within bounds
      const year = Math.floor(i * exact);
      if (year > years) break;
      milestones.push({
        label: 'Double ' + i + ' (Y' + year + ')',
        value: initial * Math.pow(2, i)
      });
    }

    const finalValue = initial * Math.pow(1 + rate / 100, years);
    const lastDoublingYear = maxDoublings > 0 ? Math.floor(maxDoublings * exact) : -1;
    if (maxDoublings === 0 || Math.abs(years - lastDoublingYear) > 1) {
      milestones.push({
        label: 'Final (Y' + years + ')',
        value: finalValue
      });
    }

    config = {
      type: 'bar',
      data: {
        labels: milestones.map(m => m.label),
        datasets: [{
          label: 'Value',
          data: milestones.map(m => m.value),
          backgroundColor: '#0d9488',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => formatCurrency(ctx.parsed.y)
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: v => formatCompact(v),
              color: '#64748b',
              font: { size: 11 }
            },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: { color: '#64748b', font: { size: 10 } },
            grid: { display: false }
          }
        }
      }
    };
  } else {
    const finalValue = initial * Math.pow(1 + rate / 100, years);
    const totalGrowth = finalValue - initial;

    config = {
      type: 'doughnut',
      data: {
        labels: ['Initial Investment', 'Compound Growth'],
        datasets: [{
          data: [initial, totalGrowth],
          backgroundColor: ['#0d9488', '#99f6e4'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#475569',
              font: { size: 12 },
              padding: 16,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed;
                const pct = ((val / finalValue) * 100).toFixed(1);
                return ctx.label + ': ' + formatCurrency(val) + ' (' + pct + '%)';
              }
            }
          }
        }
      }
    };
  }

  chartInstance = new Chart(ctx, config);
}

function renderTable(initial, rate, years, exact) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;

  thead.innerHTML = '<tr><th>Doubling #</th><th>Year</th><th>Value</th><th>Growth from Start</th></tr>';

  const rows = [];
  const maxDoublings = Math.floor(years / exact);

  for (let i = 1; i <= maxDoublings; i++) {
    // FIX 2: Use Math.floor instead of Math.round to prevent year from exceeding the period
    const year = Math.floor(i * exact);
    if (year > years) break;
    const value = initial * Math.pow(1 + rate / 100, year);
    rows.push({
      doubling: i,
      year: year,
      value: value,
      growth: value - initial
    });
  }

  const finalValue = initial * Math.pow(1 + rate / 100, years);
  const lastDoublingYear = maxDoublings > 0 ? Math.floor(maxDoublings * exact) : -1;
  if (maxDoublings === 0 || Math.abs(years - lastDoublingYear) > 0) {
    rows.push({
      doubling: maxDoublings > 0 ? 'Final' : '—',
      year: years,
      value: finalValue,
      growth: finalValue - initial
    });
  }

  tbody.innerHTML = rows.map(r =>
    '<tr>' +
    '<td>' + r.doubling + '</td>' +
    '<td>' + r.year + '</td>' +
    '<td class="highlight">' + formatCurrency(r.value) + '</td>' +
    '<td>' + formatCurrency(r.growth) + '</td>' +
    '</tr>'
  ).join('');
}

function resetForm() {
  document.getElementById('rate').value = 8;
  document.getElementById('initialAmount').value = 10000;
  document.getElementById('years').value = 40;
  ['rate', 'initialAmount', 'years'].forEach(id => syncSlider(id));
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  // FIX 7 (was Fix 6): loadFromURL runs first so currency is set before setupCurrencySearch
  // populates the search input — this ensures the displayed currency name is correct
  loadFromURL();
  setupCurrencySearch();
  ['rate', 'initialAmount', 'years'].forEach(id => syncSlider(id));
  calculate();
});