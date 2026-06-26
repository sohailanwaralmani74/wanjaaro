// ============================================================
// MORTGAGE CALCULATOR — Full Three-Way Sync
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var homePrice = document.getElementById('homePrice');
  var homePriceSlider = document.getElementById('homePriceSlider');
  var downPayment = document.getElementById('downPayment');
  var downPaymentSlider = document.getElementById('downPaymentSlider');
  var loanAmount = document.getElementById('loanAmount');
  var loanAmountSlider = document.getElementById('loanAmountSlider');
  var rate = document.getElementById('rate');
  var rateSlider = document.getElementById('rateSlider');
  var loanTerm = document.getElementById('loanTerm');
  var loanTermSlider = document.getElementById('loanTermSlider');
  var extraPayment = document.getElementById('extraPayment');
  var extraPaymentSlider = document.getElementById('extraPaymentSlider');

  var monthlyPayment = document.getElementById('monthlyPayment');
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

  // ── Slider Label Update ──
  function updateSliderLabel(inputId, value) {
    var label = document.getElementById(inputId + 'SliderVal');
    if (!label) return;
    var num = parseFloat(value);
    if (isNaN(num)) return;

    switch (inputId) {
      case 'homePrice':
      case 'downPayment':
      case 'loanAmount':
      case 'extraPayment':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'rate':
        label.textContent = num + '%';
        break;
      case 'loanTerm':
        label.textContent = num + ' yr' + (num > 1 ? 's' : '');
        break;
      default:
        label.textContent = num;
    }
  }

  // ── UI Update Functions ──
  function updateHomePriceUI(value) {
    if (homePrice) homePrice.value = value;
    if (homePriceSlider) homePriceSlider.value = value;
    updateSliderLabel('homePrice', value);
  }

  function updateDownPaymentUI(value) {
    if (downPayment) downPayment.value = value;
    if (downPaymentSlider) downPaymentSlider.value = value;
    updateSliderLabel('downPayment', value);
  }

  function updateLoanAmountUI(value) {
    if (loanAmount) loanAmount.value = value;
    if (loanAmountSlider) loanAmountSlider.value = value;
    updateSliderLabel('loanAmount', value);
  }

  // ── Three-Way Sync Functions ──

  // Sync when Home Price changes
  window.syncHomePrice = function(value) {
    var price = parseFloat(value) || 0;
    var down = parseFloat(downPayment ? downPayment.value : 0) || 0;
    var loan = price - down;
    if (loan < 0) loan = 0;

    updateHomePriceUI(price);
    updateLoanAmountUI(loan);
    window.calculate();
  };

  // Sync when Down Payment changes
  window.syncDownPayment = function(value) {
    var down = parseFloat(value) || 0;
    var price = parseFloat(homePrice ? homePrice.value : 0) || 0;
    var loan = price - down;
    if (loan < 0) loan = 0;

    updateDownPaymentUI(down);
    updateLoanAmountUI(loan);
    window.calculate();
  };

  // Sync when Loan Amount changes
  window.syncLoanAmount = function(value) {
    var loan = parseFloat(value) || 0;
    var price = parseFloat(homePrice ? homePrice.value : 0) || 0;
    var down = price - loan;
    if (down < 0) down = 0;

    updateLoanAmountUI(loan);
    updateDownPaymentUI(down);
    window.calculate();
  };

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

  // ── Core Mortgage Calculation ──
  function calculateMortgage(P, r, n, extra) {
    var monthlyRate = r / 100 / 12;
    var totalMonths = n * 12;
    var balance = P;
    var monthlyPayment;
    var schedule = [];
    var totalInterestPaid = 0;
    var totalPaid = 0;

    if (P <= 0) {
      return {
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayment: 0,
        schedule: [],
        principal: P
      };
    }

    if (monthlyRate === 0) {
      monthlyPayment = P / totalMonths;
    } else {
      monthlyPayment = P * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    var totalPaymentWithExtra = monthlyPayment + extra;

    var currentBalance = P;
    var month = 0;

    while (currentBalance > 0 && month < totalMonths * 2) {
      month++;
      var interest = currentBalance * monthlyRate;
      var principalPayment = Math.min(totalPaymentWithExtra - interest, currentBalance);
      if (principalPayment < 0) principalPayment = 0;

      currentBalance -= principalPayment;
      if (currentBalance < 0) currentBalance = 0;

      totalInterestPaid += interest;
      totalPaid += interest + principalPayment;

      schedule.push({
        month: month,
        payment: interest + principalPayment,
        principal: principalPayment,
        interest: interest,
        balance: currentBalance
      });

      if (currentBalance === 0) break;
    }

    var finalMonthlyPayment = extra > 0 ? totalPaymentWithExtra : monthlyPayment;

    return {
      monthlyPayment: finalMonthlyPayment,
      totalInterest: totalInterestPaid,
      totalPayment: totalPaid,
      totalMonths: schedule.length,
      schedule: schedule,
      principal: P
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var loan = parseFloat(loanAmount ? loanAmount.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var n = parseFloat(loanTerm ? loanTerm.value : 0) || 0;
    var extra = parseFloat(extraPayment ? extraPayment.value : 0) || 0;

    if (loan <= 0 || n <= 0) {
      if (monthlyPayment) monthlyPayment.textContent = '—';
      if (totalInterest) totalInterest.textContent = '—';
      if (totalPayment) totalPayment.textContent = '—';
      if (payoffDate) payoffDate.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var result = calculateMortgage(loan, r, n, extra);

    if (monthlyPayment) monthlyPayment.textContent = formatCurrency(result.monthlyPayment);
    if (totalInterest) totalInterest.textContent = formatCurrency(result.totalInterest);
    if (totalPayment) totalPayment.textContent = formatCurrency(result.totalPayment);

    if (payoffDate) {
      if (extra > 0) {
        var years = Math.floor(result.totalMonths / 12);
        var months = result.totalMonths % 12;
        var saved = (n * 12) - result.totalMonths;
        payoffDate.textContent = years + ' yr' + (years > 1 ? 's' : '') +
          (months > 0 ? ' ' + months + ' mo' : '') +
          (saved > 0 ? ' (Saved ' + saved + ' mo)' : '');
      } else {
        payoffDate.textContent = n + ' yrs';
      }
    }

    generateInsights(result, loan, r, n, extra);
    generateSchedule(result, n);
    updateChart(result);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, loan, r, n, extra) {
    if (!insightsGrid) return;
    var insights = [];

    var totalMonths = n * 12;
    var savedMonths = totalMonths - result.totalMonths;

    if (extra > 0 && savedMonths > 0) {
      insights.push({
        icon: '⏱️',
        text: 'Extra payments save <strong>' + savedMonths + ' months</strong> of payments'
      });
    }

    if (result.totalInterest > 0 && loan > 0) {
      var ratio = result.totalInterest / loan;
      insights.push({
        icon: '📊',
        text: 'Total interest is <strong>' + formatPercent(ratio * 100) + '</strong> of the loan amount'
      });
    }

    if (extra === 0 && result.totalInterest > 0) {
      insights.push({
        icon: '💡',
        text: 'Try adding extra payments to reduce your total interest'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter mortgage details to see your payment breakdown'
      });
    }

    insightsGrid.innerHTML = insights.slice(0, 6).map(function(insight) {
      return '<div class="insight-item">' +
               '<span class="insight-icon">' + insight.icon + '</span>' +
               '<span class="insight-text">' + insight.text + '</span>' +
             '</div>';
    }).join('');
  }

  // ── Generate Amortization Schedule ──
  function generateSchedule(result, n) {
    if (!tableHead || !tableBody) return;
    var rows = '';
    var schedule = result.schedule;
    var totalMonths = schedule.length;

    tableHead.innerHTML = '<tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>';

    var displayRows = [];
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

    var loan = parseFloat(loanAmount ? loanAmount.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var n = parseFloat(loanTerm ? loanTerm.value : 0) || 0;
    var extra = parseFloat(extraPayment ? extraPayment.value : 0) || 0;

    if (loan > 0 && n > 0) {
      var result = calculateMortgage(loan, r, n, extra);
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
            label: 'Mortgage Balance',
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
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Principal', 'Total Interest'],
          datasets: [{
            label: 'Amount',
            data: [result.principal, result.totalInterest],
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
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Principal', 'Total Interest'],
          datasets: [{
            data: [result.principal, result.totalInterest],
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
    if (homePrice) params.set('h', homePrice.value);
    if (downPayment) params.set('d', downPayment.value);
    if (loanAmount) params.set('l', loanAmount.value);
    if (rate) params.set('r', rate.value);
    if (loanTerm) params.set('t', loanTerm.value);
    if (extraPayment) params.set('e', extraPayment.value);

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
    a.download = 'mortgage-amortization.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var monthly = monthlyPayment ? monthlyPayment.textContent : '';
    var interest = totalInterest ? totalInterest.textContent : '';
    var total = totalPayment ? totalPayment.textContent : '';
    var text = 'Mortgage Result:\nMonthly Payment: ' + monthly + '\nTotal Interest: ' + interest + '\nTotal Payment: ' + total;
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
    link.download = 'mortgage-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultPrice = 300000;
    var defaultDown = 60000;
    var defaultLoan = defaultPrice - defaultDown;
    var defaultRate = 7;
    var defaultTerm = 30;
    var defaultExtra = 0;

    if (homePrice) { homePrice.value = defaultPrice; if (homePriceSlider) homePriceSlider.value = defaultPrice; }
    if (downPayment) { downPayment.value = defaultDown; if (downPaymentSlider) downPaymentSlider.value = defaultDown; }
    if (loanAmount) { loanAmount.value = defaultLoan; if (loanAmountSlider) loanAmountSlider.value = defaultLoan; }
    if (rate) { rate.value = defaultRate; if (rateSlider) rateSlider.value = defaultRate; }
    if (loanTerm) { loanTerm.value = defaultTerm; if (loanTermSlider) loanTermSlider.value = defaultTerm; }
    if (extraPayment) { extraPayment.value = defaultExtra; if (extraPaymentSlider) extraPaymentSlider.value = defaultExtra; }

    updateSliderLabel('homePrice', defaultPrice);
    updateSliderLabel('downPayment', defaultDown);
    updateSliderLabel('loanAmount', defaultLoan);
    updateSliderLabel('rate', defaultRate);
    updateSliderLabel('loanTerm', defaultTerm);
    updateSliderLabel('extraPayment', defaultExtra);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('h')) {
      var hVal = parseFloat(params.get('h'));
      if (!isNaN(hVal) && hVal >= 0) {
        if (homePrice) { homePrice.value = hVal; if (homePriceSlider) homePriceSlider.value = hVal; }
        updateSliderLabel('homePrice', hVal);
      }
    }
    if (params.has('d')) {
      var dVal = parseFloat(params.get('d'));
      if (!isNaN(dVal) && dVal >= 0) {
        if (downPayment) { downPayment.value = dVal; if (downPaymentSlider) downPaymentSlider.value = dVal; }
        updateSliderLabel('downPayment', dVal);
      }
    }
    if (params.has('l')) {
      var lVal = parseFloat(params.get('l'));
      if (!isNaN(lVal) && lVal >= 0) {
        if (loanAmount) { loanAmount.value = lVal; if (loanAmountSlider) loanAmountSlider.value = lVal; }
        updateSliderLabel('loanAmount', lVal);
      }
    }
    if (params.has('r')) {
      var rVal = parseFloat(params.get('r'));
      if (!isNaN(rVal) && rVal >= 0) {
        if (rate) { rate.value = rVal; if (rateSlider) rateSlider.value = rVal; }
        updateSliderLabel('rate', rVal);
      }
    }
    if (params.has('t')) {
      var tVal = parseFloat(params.get('t'));
      if (!isNaN(tVal) && tVal > 0) {
        if (loanTerm) { loanTerm.value = tVal; if (loanTermSlider) loanTermSlider.value = tVal; }
        updateSliderLabel('loanTerm', tVal);
      }
    }
    if (params.has('e')) {
      var eVal = parseFloat(params.get('e'));
      if (!isNaN(eVal) && eVal >= 0) {
        if (extraPayment) { extraPayment.value = eVal; if (extraPaymentSlider) extraPaymentSlider.value = eVal; }
        updateSliderLabel('extraPayment', eVal);
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
    console.warn('Mortgage Calculator not loaded yet.');
  };
}