// ============================================================
// DEBT PAYOFF CALCULATOR (Single Plan)
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var totalDebt = document.getElementById('totalDebt');
  var totalDebtSlider = document.getElementById('totalDebtSlider');
  var rate = document.getElementById('rate');
  var rateSlider = document.getElementById('rateSlider');
  var monthlyPayment = document.getElementById('monthlyPayment');
  var monthlyPaymentSlider = document.getElementById('monthlyPaymentSlider');

  var payoffTime = document.getElementById('payoffTime');
  var totalInterest = document.getElementById('totalInterest');
  var totalPayment = document.getElementById('totalPayment');
  var payoffDate = document.getElementById('payoffDate');
  var insightsGrid = document.getElementById('insightsGrid');
  var tableHead = document.getElementById('tableHead');
  var tableBody = document.getElementById('tableBody');
  var toolChart = document.getElementById('toolChart');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'line';

  // ── Helper: Check if Chart.js is loaded ──
  function isChartJsLoaded() {
    return typeof Chart !== 'undefined';
  }

  // ── Formatting ──
  function formatNumber(num) {
    if (!isFinite(num)) return '—';
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function formatCurrency(num) {
    if (!isFinite(num)) return '—';
    return selectedCurrency.symbol + formatNumber(num);
  }

  function formatPercent(num) {
    if (!isFinite(num)) return '—';
    return num.toFixed(2) + '%';
  }

  // ── Currency Picker ──
  function renderCurrencyOptions(filter) {
    if (!currencyResults || !currencies.length) return;
    var q = (filter || '').toLowerCase().trim();
    var matches = currencies.filter(function(c) {
      return c.code.toLowerCase().includes(q) ||
             c.name.toLowerCase().includes(q) ||
             c.symbol.includes(q);
    });

    if (matches.length === 0) {
      currencyResults.innerHTML = '<div class="currency-option" style="color:#94a3b8;cursor:default;">No currencies found</div>';
      currencyResults.style.display = 'block';
      return;
    }

    var html = '';
    matches.forEach(function(c) {
      html += '<div class="currency-option" data-code="' + c.code + '" data-symbol="' + c.symbol + '">' +
                '<span><span class="code">' + c.code + '</span> – ' + c.name + '</span>' +
                '<span class="symbol">' + c.symbol + '</span>' +
              '</div>';
    });
    currencyResults.innerHTML = html;
    currencyResults.style.display = 'block';

    currencyResults.querySelectorAll('.currency-option').forEach(function(opt) {
      opt.addEventListener('click', function() {
        var code = this.dataset.code;
        var symbol = this.dataset.symbol;
        selectCurrency(code, symbol);
      });
    });
  }

  function selectCurrency(code, symbol) {
    var found = currencies.find(function(c) { return c.code === code; });
    selectedCurrency = { code: code, symbol: symbol };
    if (currencySearch) {
      currencySearch.value = code + ' – ' + (found ? found.name : code);
    }
    if (currencyResults) {
      currencyResults.style.display = 'none';
    }
    currencySymbols.forEach(function(el) {
      el.textContent = symbol;
    });
    window.calculate();
  }

  // ── Init Currency Picker ──
  function initCurrencyPicker() {
    if (!currencySearch) return;

    currencySearch.addEventListener('input', function() {
      var val = this.value;
      if (val.length === 0) {
        if (currencyResults) currencyResults.style.display = 'none';
        return;
      }
      renderCurrencyOptions(val);
    });

    currencySearch.addEventListener('focus', function() {
      if (this.value.length > 0) {
        renderCurrencyOptions(this.value);
      }
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.currency-search-wrapper')) {
        if (currencyResults) currencyResults.style.display = 'none';
      }
    });

    var defaultCurrency = currencies.find(function(c) { return c.code === 'USD'; }) || currencies[0];
    if (defaultCurrency) {
      selectCurrency(defaultCurrency.code, defaultCurrency.symbol);
    } else {
      selectCurrency('USD', '$');
    }
  }

  // ── Slider Sync ──
  window.syncInput = function(inputId, value) {
    var input = document.getElementById(inputId);
    if (input) {
      input.value = value;
      updateSliderLabel(inputId, value);
    }
  };

  window.syncSlider = function(inputId) {
    var input = document.getElementById(inputId);
    var slider = document.getElementById(inputId + 'Slider');
    if (input && slider) {
      slider.value = input.value;
      updateSliderLabel(inputId, input.value);
    }
  };

  function updateSliderLabel(inputId, value) {
    var label = document.getElementById(inputId + 'SliderVal');
    if (!label) return;
    var num = parseFloat(value);
    if (isNaN(num)) return;

    switch (inputId) {
      case 'totalDebt':
      case 'monthlyPayment':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'rate':
        label.textContent = num + '%';
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core Calculation ──
  function calculateDebtPayoff(P, r, payment) {
    var monthlyRate = r / 100 / 12;
    var balance = P;
    var schedule = [];
    var totalInterestPaid = 0;
    var totalPaid = 0;
    var months = 0;

    if (payment <= 0 || P <= 0) {
      return {
        months: 0,
        totalInterest: 0,
        totalPayment: 0,
        schedule: []
      };
    }

    // Check if payment covers interest
    var firstMonthInterest = P * monthlyRate;
    if (payment <= firstMonthInterest) {
      return {
        months: Infinity,
        totalInterest: Infinity,
        totalPayment: Infinity,
        schedule: []
      };
    }

    while (balance > 0.01 && months < 600) {
      months++;
      var interest = balance * monthlyRate;
      var principal = Math.min(payment - interest, balance);
      if (principal < 0) principal = 0;

      balance -= principal;
      if (balance < 0) balance = 0;

      totalInterestPaid += interest;
      totalPaid += interest + principal;

      schedule.push({
        month: months,
        payment: payment,
        principal: principal,
        interest: interest,
        balance: balance
      });

      if (balance === 0) break;
    }

    return {
      months: months,
      totalInterest: totalInterestPaid,
      totalPayment: totalPaid,
      schedule: schedule
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var P = parseFloat(totalDebt ? totalDebt.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var payment = parseFloat(monthlyPayment ? monthlyPayment.value : 0) || 0;

    if (P <= 0 || payment <= 0) {
      if (payoffTime) payoffTime.textContent = '—';
      if (totalInterest) totalInterest.textContent = '—';
      if (totalPayment) totalPayment.textContent = '—';
      if (payoffDate) payoffDate.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var result = calculateDebtPayoff(P, r, payment);

    if (result.months === Infinity) {
      if (payoffTime) payoffTime.textContent = '∞';
      if (totalInterest) totalInterest.textContent = '—';
      if (totalPayment) totalPayment.textContent = '—';
      if (payoffDate) payoffDate.textContent = 'Never';
      if (insightsGrid) {
        insightsGrid.innerHTML = '<div class="insight-item"><span class="insight-icon">⚠️</span><span class="insight-text"><strong>Payment is too low!</strong> Increase your monthly payment to cover the interest.</span></div>';
      }
      return;
    }

    if (payoffTime) payoffTime.textContent = result.months + ' mo';
    if (totalInterest) totalInterest.textContent = formatCurrency(result.totalInterest);
    if (totalPayment) totalPayment.textContent = formatCurrency(result.totalPayment);

    // Payoff Date
    if (payoffDate) {
      var today = new Date();
      var payoffMonth = today.getMonth() + result.months;
      var payoffYear = today.getFullYear() + Math.floor(payoffMonth / 12);
      payoffMonth = payoffMonth % 12;
      var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      payoffDate.textContent = monthNames[payoffMonth] + ' ' + payoffYear;
    }

    generateInsights(result, P, r, payment);
    generateSchedule(result);
    updateChart(result);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, P, r, payment) {
    if (!insightsGrid) return;
    var insights = [];

    if (result.months > 0 && result.totalInterest > 0) {
      var ratio = result.totalInterest / P;
      insights.push({
        icon: '📊',
        text: 'Total interest is <strong>' + formatPercent(ratio * 100) + '</strong> of the principal'
      });
    }

    if (result.months > 0) {
      var firstMonthInterest = P * (r / 100 / 12);
      var principalPercentage = ((payment - firstMonthInterest) / payment) * 100;
      insights.push({
        icon: '📈',
        text: 'First month: <strong>' + formatPercent(principalPercentage) + '</strong> of payment goes to principal'
      });
    }

    if (result.months > 0 && payment > 0) {
      var annualPayment = payment * 12;
      var totalPrincipal = P;
      var years = result.months / 12;
      insights.push({
        icon: '💰',
        text: 'Total interest: <strong>' + formatCurrency(result.totalInterest) + '</strong> over ' + result.months + ' months'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter your debt details to see your payoff plan'
      });
    }

    insightsGrid.innerHTML = insights.slice(0, 6).map(function(insight) {
      return '<div class="insight-item">' +
               '<span class="insight-icon">' + insight.icon + '</span>' +
               '<span class="insight-text">' + insight.text + '</span>' +
             '</div>';
    }).join('');
  }

  // ── Generate Schedule ──
  function generateSchedule(result) {
    if (!tableHead || !tableBody) return;
    var rows = '';
    var schedule = result.schedule;

    if (schedule.length === 0) {
      tableHead.innerHTML = '';
      tableBody.innerHTML = '';
      return;
    }

    tableHead.innerHTML = '<tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>';

    var displayRows = [];
    var totalMonths = schedule.length;

    if (totalMonths <= 24) {
      displayRows = schedule;
    } else {
      for (var i = 0; i < 12 && i < totalMonths; i++) {
        displayRows.push(schedule[i]);
      }
      displayRows.push({ month: '…', payment: '…', principal: '…', interest: '…', balance: '…' });
      for (var j = totalMonths - 6; j < totalMonths; j++) {
        displayRows.push(schedule[j]);
      }
    }

    displayRows.forEach(function(row) {
      if (row.month === '…') {
        rows += '<tr><td colspan="5" style="text-align:center;color:#94a3b8;">…</td></tr>';
        return;
      }
      var isLastRow = (row.month === schedule.length);
      rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
        '<td><strong>' + row.month + '</strong></td>' +
        '<td>' + formatCurrency(row.payment) + '</td>' +
        '<td>' + formatCurrency(row.principal) + '</td>' +
        '<td>' + formatCurrency(row.interest) + '</td>' +
        '<td>' + formatCurrency(row.balance) + '</td>' +
      '</tr>';
    });

    tableBody.innerHTML = rows;
  }

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    var P = parseFloat(totalDebt ? totalDebt.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var payment = parseFloat(monthlyPayment ? monthlyPayment.value : 0) || 0;

    if (P > 0 && payment > 0) {
      var result = calculateDebtPayoff(P, r, payment);
      updateChart(result);
    }
  };

  function updateChart(result) {
    if (!toolChart) return;
    if (!isChartJsLoaded()) {
      var ctx = toolChart.getContext('2d');
      ctx.clearRect(0, 0, toolChart.width, toolChart.height);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Chart.js library not loaded.', toolChart.width/2, toolChart.height/2);
      return;
    }

    var ctx = toolChart.getContext('2d');
    if (chartInstance) chartInstance.destroy();

    var currencySymbol = selectedCurrency.symbol;
    var schedule = result.schedule;

    if (schedule.length === 0) {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: { plugins: { legend: { display: false } } }
      });
      return;
    }

    if (currentChartType === 'line') {
      var labels = [];
      var balances = [];
      var step = Math.max(1, Math.floor(schedule.length / 30));

      for (var i = 0; i < schedule.length; i += step) {
        labels.push(schedule[i].month);
        balances.push(schedule[i].balance);
      }
      if (schedule.length > 0 && (schedule.length - 1) % step !== 0) {
        labels.push(schedule[schedule.length - 1].month);
        balances.push(schedule[schedule.length - 1].balance);
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Balance',
            data: balances,
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return 'Balance: ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 2 });
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return currencySymbol + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
                }
              }
            }
          }
        }
      });

    } else if (currentChartType === 'bar') {
      var totalPrincipal = parseFloat(totalDebt ? totalDebt.value : 0) || 0;
      var totalInterestPaid = result.totalInterest;

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Principal', 'Total Interest'],
          datasets: [{
            label: 'Amount',
            data: [totalPrincipal, totalInterestPaid],
            backgroundColor: ['#6366f1', '#0d9488'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 2 });
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return currencySymbol + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
                }
              }
            }
          }
        }
      });

    } else if (currentChartType === 'donut') {
      var totalPrincipal2 = parseFloat(totalDebt ? totalDebt.value : 0) || 0;
      var totalInterestPaid2 = result.totalInterest;

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Principal', 'Total Interest'],
          datasets: [{
            data: [totalPrincipal2, totalInterestPaid2],
            backgroundColor: ['#6366f1', '#0d9488'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: function(context) {
                  var total = context.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  var percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                  return context.label + ': ' + currencySymbol + context.parsed.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' (' + percentage + '%)';
                }
              }
            }
          }
        }
      });
    }
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (totalDebt) params.set('d', totalDebt.value);
    if (rate) params.set('r', rate.value);
    if (monthlyPayment) params.set('p', monthlyPayment.value);

    var shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.dataset.url = window.location.pathname + '?' + params.toString();
    }
  }

  window.shareURL = function() {
    var shareBtn = document.getElementById('shareBtn');
    if (shareBtn && shareBtn.dataset.url) {
      var url = window.location.origin + shareBtn.dataset.url;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
          var original = shareBtn.textContent;
          shareBtn.textContent = '✓ Copied!';
          setTimeout(function() { shareBtn.textContent = original; }, 2000);
        });
      } else {
        prompt('Copy this URL to share:', url);
      }
    }
  };

  // ── Download CSV ──
  window.downloadCSV = function() {
    var table = document.getElementById('breakdownTable');
    if (!table) return;
    var csv = '';
    var rows = table.querySelectorAll('tr');
    rows.forEach(function(row) {
      var cells = row.querySelectorAll('th, td');
      var rowData = [];
      cells.forEach(function(cell) {
        var text = cell.textContent.trim();
        text = text.replace(/[^0-9.,\-%]/g, '');
        rowData.push(text);
      });
      csv += rowData.join(',') + '\n';
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'debt-payoff-schedule.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var time = payoffTime ? payoffTime.textContent : '';
    var interest = totalInterest ? totalInterest.textContent : '';
    var total = totalPayment ? totalPayment.textContent : '';
    var date = payoffDate ? payoffDate.textContent : '';
    var text = 'Debt Payoff Result:\nTime: ' + time + '\nTotal Interest: ' + interest + '\nTotal Payment: ' + total + '\nPayoff Date: ' + date;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        var btn = document.getElementById('copyBtn');
        if (btn) {
          var original = btn.textContent;
          btn.textContent = '✓ Copied!';
          setTimeout(function() { btn.textContent = original; }, 2000);
        }
      });
    } else {
      prompt('Copy this result:', text);
    }
  };

  // ── Export Chart ──
  window.exportChart = function() {
    var canvas = document.getElementById('toolChart');
    if (!canvas) return;
    var link = document.createElement('a');
    link.download = 'debt-payoff-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultDebt = 10000;
    var defaultRate = 18;
    var defaultPayment = 500;

    if (totalDebt) { totalDebt.value = defaultDebt; if (totalDebtSlider) totalDebtSlider.value = defaultDebt; }
    if (rate) { rate.value = defaultRate; if (rateSlider) rateSlider.value = defaultRate; }
    if (monthlyPayment) { monthlyPayment.value = defaultPayment; if (monthlyPaymentSlider) monthlyPaymentSlider.value = defaultPayment; }

    updateSliderLabel('totalDebt', defaultDebt);
    updateSliderLabel('rate', defaultRate);
    updateSliderLabel('monthlyPayment', defaultPayment);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('d')) {
      var dVal = parseFloat(params.get('d'));
      if (!isNaN(dVal) && dVal >= 0) {
        if (totalDebt) { totalDebt.value = dVal; if (totalDebtSlider) totalDebtSlider.value = dVal; }
        updateSliderLabel('totalDebt', dVal);
      }
    }
    if (params.has('r')) {
      var rVal = parseFloat(params.get('r'));
      if (!isNaN(rVal) && rVal >= 0) {
        if (rate) { rate.value = rVal; if (rateSlider) rateSlider.value = rVal; }
        updateSliderLabel('rate', rVal);
      }
    }
    if (params.has('p')) {
      var pVal = parseFloat(params.get('p'));
      if (!isNaN(pVal) && pVal >= 0) {
        if (monthlyPayment) { monthlyPayment.value = pVal; if (monthlyPaymentSlider) monthlyPaymentSlider.value = pVal; }
        updateSliderLabel('monthlyPayment', pVal);
      }
    }
    window.calculate();
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function() {
    initCurrencyPicker();
    loadFromURL();
    window.addEventListener('resize', function() {
      if (chartInstance) chartInstance.resize();
    });
  });

})();

// ── Safety fallback ──
if (typeof window.calculate === 'undefined') {
  window.calculate = function() {
    console.warn('Debt Payoff Calculator not loaded yet.');
  };
}