// ============================================================
// SAVINGS GOAL CALCULATOR
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var currentSavings = document.getElementById('currentSavings');
  var currentSavingsSlider = document.getElementById('currentSavingsSlider');
  var monthlyContribution = document.getElementById('monthlyContribution');
  var monthlyContributionSlider = document.getElementById('monthlyContributionSlider');
  var rate = document.getElementById('rate');
  var rateSlider = document.getElementById('rateSlider');
  var savingsGoal = document.getElementById('savingsGoal');
  var savingsGoalSlider = document.getElementById('savingsGoalSlider');

  var timeToGoal = document.getElementById('timeToGoal');
  var totalContributions = document.getElementById('totalContributions');
  var totalInterest = document.getElementById('totalInterest');
  var goalProgress = document.getElementById('goalProgress');
  var progressFill = document.getElementById('progressFill');
  var progressLabel = document.getElementById('progressLabel');
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
      case 'currentSavings':
      case 'monthlyContribution':
      case 'savingsGoal':
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
  function calculateSavingsGoal(current, monthly, rate, goal) {
    var r = rate / 100;
    var monthlyRate = r / 12;
    var balance = current;
    var totalContrib = current;
    var schedule = [];
    var months = 0;
    var totalInterestEarned = 0;

    if (current >= goal) {
      return {
        months: 0,
        totalContrib: current,
        totalInterest: 0,
        schedule: [{ month: 0, balance: current, contribution: current, interest: 0 }],
        achieved: true
      };
    }

    if (monthly <= 0 && current < goal) {
      return {
        months: Infinity,
        totalContrib: current,
        totalInterest: 0,
        schedule: [],
        achieved: false,
        impossible: true
      };
    }

    var maxMonths = 1200; // 100 years safety

    while (balance < goal && months < maxMonths) {
      months++;
      var interest = balance * monthlyRate;
      balance += interest + monthly;
      totalContrib += monthly;
      totalInterestEarned += interest;

      schedule.push({
        month: months,
        balance: balance,
        contribution: totalContrib,
        interest: totalInterestEarned
      });
    }

    if (months >= maxMonths) {
      return {
        months: Infinity,
        totalContrib: totalContrib,
        totalInterest: totalInterestEarned,
        schedule: schedule,
        achieved: false,
        impossible: true
      };
    }

    return {
      months: months,
      totalContrib: totalContrib,
      totalInterest: totalInterestEarned,
      schedule: schedule,
      achieved: true,
      impossible: false
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var current = parseFloat(currentSavings ? currentSavings.value : 0) || 0;
    var monthly = parseFloat(monthlyContribution ? monthlyContribution.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var goal = parseFloat(savingsGoal ? savingsGoal.value : 0) || 0;

    if (goal <= 0) {
      if (timeToGoal) timeToGoal.textContent = '—';
      if (totalContributions) totalContributions.textContent = '—';
      if (totalInterest) totalInterest.textContent = '—';
      if (goalProgress) goalProgress.textContent = '—';
      if (progressFill) progressFill.style.width = '0%';
      if (progressLabel) progressLabel.textContent = '0% of goal reached';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var result = calculateSavingsGoal(current, monthly, r, goal);

    // Time to Goal
    if (result.impossible) {
      timeToGoal.textContent = '∞';
    } else if (result.months === 0) {
      timeToGoal.textContent = 'Already achieved!';
    } else {
      var years = Math.floor(result.months / 12);
      var months = result.months % 12;
      timeToGoal.textContent = (years > 0 ? years + ' yr' + (years > 1 ? 's' : '') : '') +
        (months > 0 ? (years > 0 ? ' ' : '') + months + ' mo' : '');
      if (result.months === 1) timeToGoal.textContent = '1 mo';
    }

    if (totalContributions) totalContributions.textContent = formatCurrency(result.totalContrib);
    if (totalInterest) totalInterest.textContent = formatCurrency(result.totalInterest);

    // Progress
    var progress = Math.min((current / goal) * 100, 100);
    if (goalProgress) goalProgress.textContent = formatPercent(progress);
    if (progressFill) progressFill.style.width = progress + '%';
    if (progressLabel) progressLabel.textContent = formatPercent(progress) + ' of goal reached';

    // Highlight progress fill color based on progress
    if (progressFill) {
      if (progress >= 100) {
        progressFill.style.background = '#0d9488';
      } else if (progress >= 50) {
        progressFill.style.background = '#f59e0b';
      } else {
        progressFill.style.background = '#6366f1';
      }
    }

    generateInsights(result, current, monthly, r, goal);
    generateBreakdown(result, current, monthly, r);
    updateChart(result, current);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, current, monthly, r, goal) {
    if (!insightsGrid) return;
    var insights = [];

    if (current >= goal) {
      insights.push({
        icon: '🎉',
        text: 'You\'ve already reached your savings goal of <strong>' + formatCurrency(goal) + '</strong>!'
      });
    } else if (result.impossible) {
      insights.push({
        icon: '⚠️',
        text: 'You\'ll never reach your goal with <strong>$0 monthly contributions</strong>. Add a monthly contribution to start saving.'
      });
    } else {
      var years = Math.floor(result.months / 12);
      var months = result.months % 12;
      var timeStr = (years > 0 ? years + ' year' + (years > 1 ? 's' : '') : '') +
        (months > 0 ? (years > 0 ? ' and ' : '') + months + ' month' + (months > 1 ? 's' : '') : '');
      insights.push({
        icon: '⏱️',
        text: 'You\'ll reach your goal in <strong>' + timeStr + '</strong>'
      });

      if (result.totalInterest > 0) {
        var ratio = result.totalInterest / result.totalContrib;
        insights.push({
          icon: '📈',
          text: 'Interest earned: <strong>' + formatCurrency(result.totalInterest) + '</strong> (' + formatPercent(ratio * 100) + ' of contributions)'
        });
      }

      if (result.months > 0 && monthly > 0) {
        var totalNeeded = goal - current;
        var monthlyWithoutInterest = totalNeeded / result.months;
        insights.push({
          icon: '💰',
          text: 'Without interest, you\'d need <strong>' + formatCurrency(monthlyWithoutInterest) + '</strong>/month (vs ' + formatCurrency(monthly) + ')'
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter your savings goal and contributions to start planning'
      });
    }

    insightsGrid.innerHTML = insights.slice(0, 6).map(function(insight) {
      return '<div class="insight-item">' +
               '<span class="insight-icon">' + insight.icon + '</span>' +
               '<span class="insight-text">' + insight.text + '</span>' +
             '</div>';
    }).join('');
  }

  // ── Generate Breakdown Table ──
  function generateBreakdown(result, current, monthly, r) {
    if (!tableHead || !tableBody) return;
    var rows = '';

    if (result.schedule.length === 0) {
      tableHead.innerHTML = '';
      tableBody.innerHTML = '';
      return;
    }

    tableHead.innerHTML = '<tr><th>Year</th><th>Starting Balance</th><th>Contributions</th><th>Interest Earned</th><th>Ending Balance</th></tr>';

    var data = result.schedule;
    var years = Math.ceil(data.length / 12);
    var balance = current;
    var totalContrib = current;
    var totalInterest = 0;

    for (var year = 1; year <= years; year++) {
      var startBalance = balance;
      var yearContrib = 0;
      var yearInterest = 0;

      for (var month = 1; month <= 12; month++) {
        var index = (year - 1) * 12 + month - 1;
        if (index >= data.length) break;

        var monthlyRate = r / 100 / 12;
        var interest = balance * monthlyRate;
        balance += interest + monthly;
        totalContrib += monthly;
        yearContrib += monthly;
        totalInterest += interest;
        yearInterest += interest;
      }

      var isLastRow = (year === years);
      rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
        '<td><strong>' + year + '</strong></td>' +
        '<td>' + formatCurrency(startBalance) + '</td>' +
        '<td>' + formatCurrency(yearContrib) + '</td>' +
        '<td>' + formatCurrency(yearInterest) + '</td>' +
        '<td><strong>' + formatCurrency(balance) + '</strong></td>' +
      '</tr>';

      if (balance >= result.totalContrib) break;
    }

    tableBody.innerHTML = rows;
  }

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    var current = parseFloat(currentSavings ? currentSavings.value : 0) || 0;
    var monthly = parseFloat(monthlyContribution ? monthlyContribution.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var goal = parseFloat(savingsGoal ? savingsGoal.value : 0) || 0;

    if (goal > 0) {
      var result = calculateSavingsGoal(current, monthly, r, goal);
      updateChart(result, current);
    }
  };

  function updateChart(result, current) {
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
            label: 'Savings Balance',
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
      var totalContrib = result.totalContrib;
      var interestEarned = result.totalInterest;

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Contributions', 'Total Interest Earned'],
          datasets: [{
            label: 'Amount',
            data: [totalContrib, interestEarned],
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
      var totalContrib2 = result.totalContrib;
      var interestEarned2 = result.totalInterest;

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Total Contributions', 'Total Interest Earned'],
          datasets: [{
            data: [totalContrib2, interestEarned2],
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
    if (currentSavings) params.set('c', currentSavings.value);
    if (monthlyContribution) params.set('m', monthlyContribution.value);
    if (rate) params.set('r', rate.value);
    if (savingsGoal) params.set('g', savingsGoal.value);

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
    a.download = 'savings-goal-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var time = timeToGoal ? timeToGoal.textContent : '';
    var contrib = totalContributions ? totalContributions.textContent : '';
    var interest = totalInterest ? totalInterest.textContent : '';
    var progress = goalProgress ? goalProgress.textContent : '';
    var text = 'Savings Goal Result:\nTime to Goal: ' + time + '\nTotal Contributions: ' + contrib + '\nTotal Interest: ' + interest + '\nGoal Progress: ' + progress;
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
    link.download = 'savings-goal-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultCurrent = 5000;
    var defaultMonthly = 500;
    var defaultRate = 8;
    var defaultGoal = 25000;

    if (currentSavings) { currentSavings.value = defaultCurrent; if (currentSavingsSlider) currentSavingsSlider.value = defaultCurrent; }
    if (monthlyContribution) { monthlyContribution.value = defaultMonthly; if (monthlyContributionSlider) monthlyContributionSlider.value = defaultMonthly; }
    if (rate) { rate.value = defaultRate; if (rateSlider) rateSlider.value = defaultRate; }
    if (savingsGoal) { savingsGoal.value = defaultGoal; if (savingsGoalSlider) savingsGoalSlider.value = defaultGoal; }

    updateSliderLabel('currentSavings', defaultCurrent);
    updateSliderLabel('monthlyContribution', defaultMonthly);
    updateSliderLabel('rate', defaultRate);
    updateSliderLabel('savingsGoal', defaultGoal);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('c')) {
      var cVal = parseFloat(params.get('c'));
      if (!isNaN(cVal) && cVal >= 0) {
        if (currentSavings) { currentSavings.value = cVal; if (currentSavingsSlider) currentSavingsSlider.value = cVal; }
        updateSliderLabel('currentSavings', cVal);
      }
    }
    if (params.has('m')) {
      var mVal = parseFloat(params.get('m'));
      if (!isNaN(mVal) && mVal >= 0) {
        if (monthlyContribution) { monthlyContribution.value = mVal; if (monthlyContributionSlider) monthlyContributionSlider.value = mVal; }
        updateSliderLabel('monthlyContribution', mVal);
      }
    }
    if (params.has('r')) {
      var rVal = parseFloat(params.get('r'));
      if (!isNaN(rVal) && rVal >= 0) {
        if (rate) { rate.value = rVal; if (rateSlider) rateSlider.value = rVal; }
        updateSliderLabel('rate', rVal);
      }
    }
    if (params.has('g')) {
      var gVal = parseFloat(params.get('g'));
      if (!isNaN(gVal) && gVal > 0) {
        if (savingsGoal) { savingsGoal.value = gVal; if (savingsGoalSlider) savingsGoalSlider.value = gVal; }
        updateSliderLabel('savingsGoal', gVal);
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
    console.warn('Savings Goal Calculator not loaded yet.');
  };
}