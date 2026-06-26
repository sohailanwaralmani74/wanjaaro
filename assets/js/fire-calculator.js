// ============================================================
// FIRE CALCULATOR — Financial Independence, Retire Early
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var currentAge = document.getElementById('currentAge');
  var currentAgeSlider = document.getElementById('currentAgeSlider');
  var annualExpenses = document.getElementById('annualExpenses');
  var annualExpensesSlider = document.getElementById('annualExpensesSlider');
  var currentSavings = document.getElementById('currentSavings');
  var currentSavingsSlider = document.getElementById('currentSavingsSlider');
  var monthlyContribution = document.getElementById('monthlyContribution');
  var monthlyContributionSlider = document.getElementById('monthlyContributionSlider');
  var expectedReturn = document.getElementById('expectedReturn');
  var expectedReturnSlider = document.getElementById('expectedReturnSlider');
  var inflationRate = document.getElementById('inflationRate');
  var inflationRateSlider = document.getElementById('inflationRateSlider');
  var withdrawalRate = document.getElementById('withdrawalRate');
  var withdrawalRateSlider = document.getElementById('withdrawalRateSlider');

  var fireNumber = document.getElementById('fireNumber');
  var yearsToFire = document.getElementById('yearsToFire');
  var retirementAge = document.getElementById('retirementAge');
  var fireProgress = document.getElementById('fireProgress');
  var progressFill = document.getElementById('progressFill');
  var progressLabel = document.getElementById('progressLabel');
  var fireTimeline = document.getElementById('fireTimeline');
  var timelineMarker = document.getElementById('timelineMarker');
  var timelineLabel = document.getElementById('timelineLabel');
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
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
      case 'annualExpenses':
      case 'currentSavings':
      case 'monthlyContribution':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'currentAge':
        label.textContent = num + ' yr';
        break;
      case 'expectedReturn':
      case 'inflationRate':
      case 'withdrawalRate':
        label.textContent = num + '%';
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core FIRE Calculation ──
  function calculateFIRE(age, expenses, savings, monthly, returnRate, inflation, withdrawal) {
    var r = returnRate / 100;
    var inf = inflation / 100;
    var w = withdrawal / 100;
    var realRate = (1 + r) / (1 + inf) - 1; // Real return after inflation
    var annualContrib = monthly * 12;

    var fireTarget = expenses / w; // FIRE number (4% rule)
    var balance = savings;
    var years = 0;
    var schedule = [];
    var maxYears = 100 - age;

    if (realRate <= 0) {
      // If real return is zero or negative, calculate linearly
      while (balance < fireTarget && years < maxYears) {
        years++;
        balance += annualContrib;
        schedule.push({
          year: years,
          age: age + years,
          balance: balance,
          target: fireTarget
        });
      }
    } else {
      while (balance < fireTarget && years < maxYears) {
        years++;
        balance = balance * (1 + realRate) + annualContrib;
        schedule.push({
          year: years,
          age: age + years,
          balance: balance,
          target: fireTarget
        });
      }
    }

    var progress = Math.min((savings / fireTarget) * 100, 100);

    return {
      fireTarget: fireTarget,
      yearsToFire: years,
      retirementAge: age + years,
      progress: progress,
      schedule: schedule,
      achieved: balance >= fireTarget
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var age = parseFloat(currentAge ? currentAge.value : 0) || 0;
    var expenses = parseFloat(annualExpenses ? annualExpenses.value : 0) || 0;
    var savings = parseFloat(currentSavings ? currentSavings.value : 0) || 0;
    var monthly = parseFloat(monthlyContribution ? monthlyContribution.value : 0) || 0;
    var returnRate = parseFloat(expectedReturn ? expectedReturn.value : 0) || 0;
    var inflation = parseFloat(inflationRate ? inflationRate.value : 0) || 0;
    var withdrawal = parseFloat(withdrawalRate ? withdrawalRate.value : 0) || 0;

    if (expenses <= 0 || age <= 0) {
      if (fireNumber) fireNumber.textContent = '—';
      if (yearsToFire) yearsToFire.textContent = '—';
      if (retirementAge) retirementAge.textContent = '—';
      if (fireProgress) fireProgress.textContent = '—';
      if (progressFill) progressFill.style.width = '0%';
      if (progressLabel) progressLabel.textContent = '0% to FIRE';
      if (fireTimeline) fireTimeline.style.display = 'none';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var result = calculateFIRE(age, expenses, savings, monthly, returnRate, inflation, withdrawal);

    if (fireNumber) fireNumber.textContent = formatCurrency(result.fireTarget);
    if (yearsToFire) yearsToFire.textContent = result.yearsToFire + ' yr' + (result.yearsToFire > 1 ? 's' : '');
    if (retirementAge) retirementAge.textContent = result.retirementAge + ' yr';
    if (fireProgress) fireProgress.textContent = formatPercent(result.progress);

    // Progress bar
    if (progressFill) progressFill.style.width = Math.min(result.progress, 100) + '%';
    if (progressLabel) progressLabel.textContent = formatPercent(Math.min(result.progress, 100)) + ' to FIRE';

    // Timeline
    if (fireTimeline) {
      if (result.yearsToFire > 0 && result.yearsToFire < 60) {
        fireTimeline.style.display = 'block';
        var position = Math.min((result.yearsToFire / (100 - age)) * 100, 100);
        if (timelineMarker) timelineMarker.style.left = position + '%';
        if (timelineLabel) timelineLabel.textContent = 'FIRE at ' + result.retirementAge;
      } else {
        fireTimeline.style.display = 'none';
      }
    }

    generateInsights(result, expenses, monthly, returnRate, inflation, withdrawal);
    generateSchedule(result);
    updateChart(result);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, expenses, monthly, returnRate, inflation, withdrawal) {
    if (!insightsGrid) return;
    var insights = [];

    if (result.achieved) {
      insights.push({
        icon: '🎉',
        text: 'You\'ve already achieved <strong>Financial Independence!</strong>'
      });
    } else {
      insights.push({
        icon: '🏦',
        text: 'Your FIRE number is <strong>' + formatCurrency(result.fireTarget) + '</strong>'
      });
      insights.push({
        icon: '⏱️',
        text: 'You\'ll reach FIRE in <strong>' + result.yearsToFire + ' years</strong> at age <strong>' + result.retirementAge + '</strong>'
      });
    }

    if (result.progress > 0 && result.progress < 100) {
      insights.push({
        icon: '📈',
        text: 'You\'re <strong>' + formatPercent(result.progress) + '</strong> of the way to FIRE'
      });
    }

    if (monthly > 0 && result.yearsToFire > 0) {
      var totalContrib = monthly * 12 * result.yearsToFire;
      var totalGrowth = result.fireTarget - totalContrib;
      if (totalGrowth > 0) {
        insights.push({
          icon: '📊',
          text: 'Investment growth will contribute <strong>' + formatCurrency(totalGrowth) + '</strong> toward your FIRE number'
        });
      }
    }

    if (withdrawal === 4) {
      insights.push({
        icon: '📖',
        text: 'Using the <strong>4% rule</strong> — a safe withdrawal rate for a 30-year retirement'
      });
    }

    if (inflation > 0 && returnRate > 0) {
      var realReturn = (1 + returnRate / 100) / (1 + inflation / 100) - 1;
      if (realReturn > 0) {
        insights.push({
          icon: '📉',
          text: 'Real return after inflation: <strong>' + formatPercent(realReturn * 100) + '</strong>'
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter your details to calculate your FIRE number'
      });
    }

    insightsGrid.innerHTML = insights.slice(0, 6).map(function(insight) {
      return '<div class="insight-item">' +
               '<span class="insight-icon">' + insight.icon + '</span>' +
               '<span class="insight-text">' + insight.text + '</span>' +
             '</div>';
    }).join('');
  }

  // ── Generate Schedule Table ──
  function generateSchedule(result) {
    if (!tableHead || !tableBody) return;

    if (result.schedule.length === 0) {
      tableHead.innerHTML = '';
      tableBody.innerHTML = '';
      return;
    }

    tableHead.innerHTML = '<tr><th>Year</th><th>Age</th><th>Balance</th><th>FIRE Target</th><th>Progress</th></tr>';

    var rows = '';
    var schedule = result.schedule;
    var step = Math.max(1, Math.floor(schedule.length / 15));

    for (var i = 0; i < schedule.length; i += step) {
      var row = schedule[i];
      var progress = (row.balance / row.target) * 100;
      var isLastRow = (i === schedule.length - 1 || schedule.length - i <= step);
      rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
        '<td><strong>' + row.year + '</strong></td>' +
        '<td>' + row.age + '</td>' +
        '<td>' + formatCurrency(row.balance) + '</td>' +
        '<td>' + formatCurrency(row.target) + '</td>' +
        '<td>' + formatPercent(Math.min(progress, 100)) + '</td>' +
      '</tr>';
    }

    // If we skipped the last row, add it
    var lastRow = schedule[schedule.length - 1];
    if (schedule.length > 1 && (schedule.length - 1) % step !== 0) {
      var lastProgress = (lastRow.balance / lastRow.target) * 100;
      rows += '<tr class="highlight-row">' +
        '<td><strong>' + lastRow.year + '</strong></td>' +
        '<td>' + lastRow.age + '</td>' +
        '<td>' + formatCurrency(lastRow.balance) + '</td>' +
        '<td>' + formatCurrency(lastRow.target) + '</td>' +
        '<td>' + formatPercent(Math.min(lastProgress, 100)) + '</td>' +
      '</tr>';
    }

    tableBody.innerHTML = rows;
  }

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    var age = parseFloat(currentAge ? currentAge.value : 0) || 0;
    var expenses = parseFloat(annualExpenses ? annualExpenses.value : 0) || 0;
    var savings = parseFloat(currentSavings ? currentSavings.value : 0) || 0;
    var monthly = parseFloat(monthlyContribution ? monthlyContribution.value : 0) || 0;
    var returnRate = parseFloat(expectedReturn ? expectedReturn.value : 0) || 0;
    var inflation = parseFloat(inflationRate ? inflationRate.value : 0) || 0;
    var withdrawal = parseFloat(withdrawalRate ? withdrawalRate.value : 0) || 0;

    if (expenses > 0 && age > 0) {
      var result = calculateFIRE(age, expenses, savings, monthly, returnRate, inflation, withdrawal);
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
      var targets = [];
      var step = Math.max(1, Math.floor(schedule.length / 30));

      for (var i = 0; i < schedule.length; i += step) {
        labels.push(schedule[i].year);
        balances.push(schedule[i].balance);
        targets.push(schedule[i].target);
      }
      // Ensure last point is included
      if (schedule.length > 0 && (schedule.length - 1) % step !== 0) {
        labels.push(schedule[schedule.length - 1].year);
        balances.push(schedule[schedule.length - 1].balance);
        targets.push(schedule[schedule.length - 1].target);
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Projected Wealth',
              data: balances,
              borderColor: '#0d9488',
              backgroundColor: 'rgba(13, 148, 136, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 2
            },
            {
              label: 'FIRE Target',
              data: targets,
              borderColor: '#dc2626',
              backgroundColor: 'rgba(220, 38, 38, 0.05)',
              fill: false,
              tension: 0.3,
              borderDash: [5, 5],
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
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
      var finalBalance = schedule[lastIdx].balance;
      var target = schedule[lastIdx].target;

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Current Savings', 'FIRE Target', 'Projected Balance'],
          datasets: [{
            label: 'Amount',
            data: [
              parseFloat(currentSavings ? currentSavings.value : 0) || 0,
              target,
              finalBalance
            ],
            backgroundColor: ['#6366f1', '#dc2626', '#0d9488'],
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
                  return context.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
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
      var currentSavingsVal = parseFloat(currentSavings ? currentSavings.value : 0) || 0;
      var fireTargetVal = result.fireTarget;
      var remaining = Math.max(fireTargetVal - currentSavingsVal, 0);

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Current Savings', 'Remaining to FIRE'],
          datasets: [{
            data: [currentSavingsVal, remaining],
            backgroundColor: ['#0d9488', '#e2e8f0'],
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
                  return context.label + ': ' + currencySymbol + context.parsed.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' (' + percentage + '%)';
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
    if (currentAge) params.set('a', currentAge.value);
    if (annualExpenses) params.set('e', annualExpenses.value);
    if (currentSavings) params.set('s', currentSavings.value);
    if (monthlyContribution) params.set('m', monthlyContribution.value);
    if (expectedReturn) params.set('r', expectedReturn.value);
    if (inflationRate) params.set('i', inflationRate.value);
    if (withdrawalRate) params.set('w', withdrawalRate.value);

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
    a.download = 'fire-projection.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var fire = fireNumber ? fireNumber.textContent : '';
    var years = yearsToFire ? yearsToFire.textContent : '';
    var age = retirementAge ? retirementAge.textContent : '';
    var progress = fireProgress ? fireProgress.textContent : '';
    var text = 'FIRE Result:\nFIRE Number: ' + fire + '\nYears to FIRE: ' + years + '\nRetirement Age: ' + age + '\nProgress: ' + progress;
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
    link.download = 'fire-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultAge = 30;
    var defaultExpenses = 40000;
    var defaultSavings = 50000;
    var defaultMonthly = 1500;
    var defaultReturn = 7;
    var defaultInflation = 3;
    var defaultWithdrawal = 4;

    if (currentAge) { currentAge.value = defaultAge; if (currentAgeSlider) currentAgeSlider.value = defaultAge; }
    if (annualExpenses) { annualExpenses.value = defaultExpenses; if (annualExpensesSlider) annualExpensesSlider.value = defaultExpenses; }
    if (currentSavings) { currentSavings.value = defaultSavings; if (currentSavingsSlider) currentSavingsSlider.value = defaultSavings; }
    if (monthlyContribution) { monthlyContribution.value = defaultMonthly; if (monthlyContributionSlider) monthlyContributionSlider.value = defaultMonthly; }
    if (expectedReturn) { expectedReturn.value = defaultReturn; if (expectedReturnSlider) expectedReturnSlider.value = defaultReturn; }
    if (inflationRate) { inflationRate.value = defaultInflation; if (inflationRateSlider) inflationRateSlider.value = defaultInflation; }
    if (withdrawalRate) { withdrawalRate.value = defaultWithdrawal; if (withdrawalRateSlider) withdrawalRateSlider.value = defaultWithdrawal; }

    updateSliderLabel('currentAge', defaultAge);
    updateSliderLabel('annualExpenses', defaultExpenses);
    updateSliderLabel('currentSavings', defaultSavings);
    updateSliderLabel('monthlyContribution', defaultMonthly);
    updateSliderLabel('expectedReturn', defaultReturn);
    updateSliderLabel('inflationRate', defaultInflation);
    updateSliderLabel('withdrawalRate', defaultWithdrawal);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('a')) {
      var aVal = parseFloat(params.get('a'));
      if (!isNaN(aVal) && aVal >= 18 && aVal <= 80) {
        if (currentAge) { currentAge.value = aVal; if (currentAgeSlider) currentAgeSlider.value = aVal; }
        updateSliderLabel('currentAge', aVal);
      }
    }
    if (params.has('e')) {
      var eVal = parseFloat(params.get('e'));
      if (!isNaN(eVal) && eVal >= 0) {
        if (annualExpenses) { annualExpenses.value = eVal; if (annualExpensesSlider) annualExpensesSlider.value = eVal; }
        updateSliderLabel('annualExpenses', eVal);
      }
    }
    if (params.has('s')) {
      var sVal = parseFloat(params.get('s'));
      if (!isNaN(sVal) && sVal >= 0) {
        if (currentSavings) { currentSavings.value = sVal; if (currentSavingsSlider) currentSavingsSlider.value = sVal; }
        updateSliderLabel('currentSavings', sVal);
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
      if (!isNaN(rVal) && rVal >= 0 && rVal <= 20) {
        if (expectedReturn) { expectedReturn.value = rVal; if (expectedReturnSlider) expectedReturnSlider.value = rVal; }
        updateSliderLabel('expectedReturn', rVal);
      }
    }
    if (params.has('i')) {
      var iVal = parseFloat(params.get('i'));
      if (!isNaN(iVal) && iVal >= 0 && iVal <= 15) {
        if (inflationRate) { inflationRate.value = iVal; if (inflationRateSlider) inflationRateSlider.value = iVal; }
        updateSliderLabel('inflationRate', iVal);
      }
    }
    if (params.has('w')) {
      var wVal = parseFloat(params.get('w'));
      if (!isNaN(wVal) && wVal >= 2 && wVal <= 8) {
        if (withdrawalRate) { withdrawalRate.value = wVal; if (withdrawalRateSlider) withdrawalRateSlider.value = wVal; }
        updateSliderLabel('withdrawalRate', wVal);
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
    console.warn('FIRE Calculator not loaded yet.');
  };
}