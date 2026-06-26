// ============================================================
// GLOBAL EMI CALCULATOR
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var loanAmount = document.getElementById('loanAmount');
  var loanAmountSlider = document.getElementById('loanAmountSlider');
  var rate = document.getElementById('rate');
  var rateSlider = document.getElementById('rateSlider');
  var loanTermMonths = document.getElementById('loanTermMonths');
  var loanTermMonthsSlider = document.getElementById('loanTermMonthsSlider');

  var monthlyEmi = document.getElementById('monthlyEmi');
  var totalInterest = document.getElementById('totalInterest');
  var totalPayment = document.getElementById('totalPayment');
  var principalAmount = document.getElementById('principalAmount');
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
      case 'loanAmount':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'rate':
        label.textContent = num + '%';
        break;
      case 'loanTermMonths':
        label.textContent = num + ' mo' + (num > 1 ? 's' : '');
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core EMI Calculation ──
  function calculateEMI(P, r, n) {
    var monthlyRate = r / 100 / 12;
    var emi;

    if (monthlyRate === 0) {
      emi = P / n;
    } else {
      emi = P * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    }

    var schedule = [];
    var balance = P;
    var totalInterestPaid = 0;
    var totalPaid = 0;

    for (var i = 1; i <= n; i++) {
      var interest = balance * monthlyRate;
      var principal = emi - interest;
      if (principal > balance) principal = balance;
      if (principal < 0) principal = 0;

      balance -= principal;
      if (balance < 0) balance = 0;

      totalInterestPaid += interest;
      totalPaid += (interest + principal);

      schedule.push({
        month: i,
        payment: emi,
        principal: principal,
        interest: interest,
        balance: balance
      });

      if (balance === 0) break;
    }

    return {
      emi: emi,
      totalInterest: totalInterestPaid,
      totalPayment: totalPaid,
      schedule: schedule,
      principal: P
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var P = parseFloat(loanAmount ? loanAmount.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var n = parseInt(loanTermMonths ? loanTermMonths.value : 0) || 0;

    if (P <= 0 || n <= 0) {
      if (monthlyEmi) monthlyEmi.textContent = '—';
      if (totalInterest) totalInterest.textContent = '—';
      if (totalPayment) totalPayment.textContent = '—';
      if (principalAmount) principalAmount.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var result = calculateEMI(P, r, n);

    if (monthlyEmi) monthlyEmi.textContent = formatCurrency(result.emi);
    if (totalInterest) totalInterest.textContent = formatCurrency(result.totalInterest);
    if (totalPayment) totalPayment.textContent = formatCurrency(result.totalPayment);
    if (principalAmount) principalAmount.textContent = formatCurrency(result.principal);

    generateInsights(result);
    generateSchedule(result);
    updateChart(result);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result) {
    if (!insightsGrid) return;
    var insights = [];

    if (result.totalInterest > 0 && result.principal > 0) {
      var ratio = result.totalInterest / result.principal;
      insights.push({
        icon: '📊',
        text: 'Total interest is <strong>' + formatPercent(ratio * 100) + '</strong> of the principal'
      });
    }

    if (result.totalInterest > 0) {
      insights.push({
        icon: '💰',
        text: 'Total interest paid: <strong>' + formatCurrency(result.totalInterest) + '</strong>'
      });
    }

    if (result.schedule && result.schedule.length > 0) {
      var firstPayment = result.schedule[0];
      var lastPayment = result.schedule[result.schedule.length - 1];

      insights.push({
        icon: '📈',
        text: 'First month interest: <strong>' + formatCurrency(firstPayment.interest) + '</strong>'
      });

      if (lastPayment.interest > 0) {
        insights.push({
          icon: '📉',
          text: 'Last month interest: <strong>' + formatCurrency(lastPayment.interest) + '</strong>'
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter loan details to see your EMI and amortization schedule'
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
  function generateSchedule(result) {
    if (!tableHead || !tableBody) return;
    var rows = '';
    var schedule = result.schedule;

    tableHead.innerHTML = '<tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>';

    // Show first 12 months and last few months if schedule is long
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

    var P = parseFloat(loanAmount ? loanAmount.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var n = parseInt(loanTermMonths ? loanTermMonths.value : 0) || 0;

    if (P > 0 && n > 0) {
      var result = calculateEMI(P, r, n);
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
            label: 'Loan Balance',
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
      var lastIdx = schedule.length - 1;
      var totalPrincipal = result.principal;
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
      var totalPrincipal2 = result.principal;
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
    if (loanAmount) params.set('a', loanAmount.value);
    if (rate) params.set('r', rate.value);
    if (loanTermMonths) params.set('t', loanTermMonths.value);

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
    a.download = 'emi-amortization.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var emi = monthlyEmi ? monthlyEmi.textContent : '';
    var interest = totalInterest ? totalInterest.textContent : '';
    var total = totalPayment ? totalPayment.textContent : '';
    var text = 'EMI Result:\nMonthly EMI: ' + emi + '\nTotal Interest: ' + interest + '\nTotal Payment: ' + total;
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
    link.download = 'emi-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultAmount = 100000;
    var defaultRate = 8;
    var defaultTerm = 60;

    if (loanAmount) { loanAmount.value = defaultAmount; if (loanAmountSlider) loanAmountSlider.value = defaultAmount; }
    if (rate) { rate.value = defaultRate; if (rateSlider) rateSlider.value = defaultRate; }
    if (loanTermMonths) { loanTermMonths.value = defaultTerm; if (loanTermMonthsSlider) loanTermMonthsSlider.value = defaultTerm; }

    updateSliderLabel('loanAmount', defaultAmount);
    updateSliderLabel('rate', defaultRate);
    updateSliderLabel('loanTermMonths', defaultTerm);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('a')) {
      var aVal = parseFloat(params.get('a'));
      if (!isNaN(aVal) && aVal >= 0) {
        if (loanAmount) { loanAmount.value = aVal; if (loanAmountSlider) loanAmountSlider.value = aVal; }
        updateSliderLabel('loanAmount', aVal);
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
      var tVal = parseInt(params.get('t'));
      if (!isNaN(tVal) && tVal > 0) {
        if (loanTermMonths) { loanTermMonths.value = tVal; if (loanTermMonthsSlider) loanTermMonthsSlider.value = tVal; }
        updateSliderLabel('loanTermMonths', tVal);
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
    console.warn('EMI Calculator not loaded yet.');
  };
}