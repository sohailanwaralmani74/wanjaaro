// ============================================================
// RETIREMENT CALCULATOR (No Settings Popup)
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
  var retirementAge = document.getElementById('retirementAge');
  var retirementAgeSlider = document.getElementById('retirementAgeSlider');
  var currentSavings = document.getElementById('currentSavings');
  var currentSavingsSlider = document.getElementById('currentSavingsSlider');
  var monthlyContribution = document.getElementById('monthlyContribution');
  var monthlyContributionSlider = document.getElementById('monthlyContributionSlider');
  var expectedReturn = document.getElementById('expectedReturn');
  var expectedReturnSlider = document.getElementById('expectedReturnSlider');
  var inflationRate = document.getElementById('inflationRate');
  var inflationRateSlider = document.getElementById('inflationRateSlider');
  var desiredIncome = document.getElementById('desiredIncome');
  var desiredIncomeSlider = document.getElementById('desiredIncomeSlider');

  var projectedSavings = document.getElementById('projectedSavings');
  var monthlyIncome = document.getElementById('monthlyIncome');
  var annualIncome = document.getElementById('annualIncome');
  var incomeGap = document.getElementById('incomeGap');
  var statusIcon = document.getElementById('statusIcon');
  var statusText = document.getElementById('statusText');
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
    return num.toFixed(1) + '%';
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
      case 'desiredIncome':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'currentAge':
      case 'retirementAge':
        label.textContent = num + ' yr';
        break;
      case 'expectedReturn':
      case 'inflationRate':
        label.textContent = num + '%';
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core Calculation ──
  function calculateRetirement(age, retireAge, savings, monthly, returnRate, inflation, desired) {
    var yearsToRetire = retireAge - age;
    var r = returnRate / 100;
    var i = inflation / 100;
    var realReturn = (1 + r) / (1 + i) - 1;

    var balance = savings;
    var schedule = [];
    var year = 0;

    // Project savings growth
    var annualContrib = monthly * 12;
    var totalContrib = savings;

    for (var y = 0; y < yearsToRetire; y++) {
      year++;
      var startBalance = balance;
      var interest = balance * realReturn;
      var contrib = annualContrib;
      balance += interest + contrib;
      totalContrib += contrib;

      // Increase contributions with inflation
      annualContrib = annualContrib * (1 + i);

      schedule.push({
        year: year,
        age: age + year,
        startBalance: startBalance,
        contributions: totalContrib,
        interest: balance - totalContrib,
        balance: balance
      });
    }

    // Calculate retirement income (4% rule)
    var annualIncomeFromSavings = balance * 0.04;
    var monthlyIncomeFromSavings = annualIncomeFromSavings / 12;

    // Inflation-adjusted desired income at retirement
    var desiredAtRetirement = desired * Math.pow(1 + i, yearsToRetire);
    var gap = desiredAtRetirement - annualIncomeFromSavings;

    return {
      finalBalance: balance,
      annualIncome: annualIncomeFromSavings,
      monthlyIncome: monthlyIncomeFromSavings,
      desiredIncome: desiredAtRetirement,
      gap: gap,
      schedule: schedule,
      yearsToRetire: yearsToRetire,
      totalContributions: totalContrib,
      totalInterest: balance - totalContrib
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var age = parseFloat(currentAge ? currentAge.value : 0) || 0;
    var retireAge = parseFloat(retirementAge ? retirementAge.value : 0) || 0;
    var savings = parseFloat(currentSavings ? currentSavings.value : 0) || 0;
    var monthly = parseFloat(monthlyContribution ? monthlyContribution.value : 0) || 0;
    var returnRate = parseFloat(expectedReturn ? expectedReturn.value : 0) || 0;
    var inflation = parseFloat(inflationRate ? inflationRate.value : 0) || 0;
    var desired = parseFloat(desiredIncome ? desiredIncome.value : 0) || 0;

    if (age <= 0 || retireAge <= age || desired <= 0) {
      if (projectedSavings) projectedSavings.textContent = '—';
      if (monthlyIncome) monthlyIncome.textContent = '—';
      if (annualIncome) annualIncome.textContent = '—';
      if (incomeGap) incomeGap.textContent = '—';
      if (statusIcon) statusIcon.textContent = '📊';
      if (statusText) statusText.textContent = 'Enter your details to see your retirement plan';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var result = calculateRetirement(age, retireAge, savings, monthly, returnRate, inflation, desired);

    if (projectedSavings) projectedSavings.textContent = formatCurrency(result.finalBalance);
    if (monthlyIncome) monthlyIncome.textContent = formatCurrency(result.monthlyIncome);
    if (annualIncome) annualIncome.textContent = formatCurrency(result.annualIncome);

    if (incomeGap) {
      if (result.gap > 0) {
        incomeGap.textContent = formatCurrency(result.gap) + ' short';
        incomeGap.style.color = '#dc2626';
      } else if (result.gap < 0) {
        incomeGap.textContent = formatCurrency(Math.abs(result.gap)) + ' surplus';
        incomeGap.style.color = 'var(--primary, #0d9488)';
      } else {
        incomeGap.textContent = 'On target';
        incomeGap.style.color = 'var(--primary, #0d9488)';
      }
    }

    // Status
    if (statusIcon && statusText) {
      if (result.gap <= 0) {
        statusIcon.textContent = '✅';
        statusText.textContent = 'You\'re on track for your retirement goal!';
      } else {
        statusIcon.textContent = '📈';
        statusText.textContent = 'You need to save more to reach your retirement goal.';
      }
    }

    generateInsights(result, age, retireAge, savings, monthly, returnRate, inflation, desired);
    generateBreakdown(result);
    updateChart(result);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, age, retireAge, savings, monthly, returnRate, inflation, desired) {
    if (!insightsGrid) return;
    var insights = [];

    insights.push({
      icon: '🏦',
      text: 'Projected savings at retirement: <strong>' + formatCurrency(result.finalBalance) + '</strong>'
    });

    insights.push({
      icon: '💰',
      text: 'Monthly retirement income: <strong>' + formatCurrency(result.monthlyIncome) + '</strong>'
    });

    if (result.gap > 0) {
      insights.push({
        icon: '⚠️',
        text: 'Income gap: <strong>' + formatCurrency(result.gap) + '</strong> — increase contributions by <strong>' + formatCurrency(result.gap / 12) + '</strong>/month'
      });
    } else if (result.gap < 0) {
      insights.push({
        icon: '🎉',
        text: 'You\'re on track! You have <strong>' + formatCurrency(Math.abs(result.gap)) + '</strong> more than your goal'
      });
    }

    if (result.totalInterest > 0) {
      insights.push({
        icon: '📈',
        text: 'Investment growth: <strong>' + formatCurrency(result.totalInterest) + '</strong> (' + formatPercent((result.totalInterest / result.totalContributions) * 100) + ' of contributions)'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter your details to see your retirement plan'
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
  function generateBreakdown(result) {
    if (!tableHead || !tableBody) return;
    var schedule = result.schedule;

    if (schedule.length === 0) {
      tableHead.innerHTML = '';
      tableBody.innerHTML = '';
      return;
    }

    tableHead.innerHTML = '<tr><th>Year</th><th>Age</th><th>Starting Balance</th><th>Contributions</th><th>Growth</th><th>Balance</th></tr>';

    var rows = '';
    var step = Math.max(1, Math.floor(schedule.length / 20));

    for (var i = 0; i < schedule.length; i += step) {
      var row = schedule[i];
      var isLastRow = (i === schedule.length - 1);
      rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
        '<td><strong>' + row.year + '</strong></td>' +
        '<td>' + row.age + '</td>' +
        '<td>' + formatCurrency(row.startBalance) + '</td>' +
        '<td>' + formatCurrency(row.contributions) + '</td>' +
        '<td>' + formatCurrency(row.interest) + '</td>' +
        '<td><strong>' + formatCurrency(row.balance) + '</strong></td>' +
      '</tr>';
    }

    // Ensure last row is included
    if (schedule.length > 0 && (schedule.length - 1) % step !== 0) {
      var lastRow = schedule[schedule.length - 1];
      rows += '<tr class="highlight-row">' +
        '<td><strong>' + lastRow.year + '</strong></td>' +
        '<td>' + lastRow.age + '</td>' +
        '<td>' + formatCurrency(lastRow.startBalance) + '</td>' +
        '<td>' + formatCurrency(lastRow.contributions) + '</td>' +
        '<td>' + formatCurrency(lastRow.interest) + '</td>' +
        '<td><strong>' + formatCurrency(lastRow.balance) + '</strong></td>' +
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
    var retireAge = parseFloat(retirementAge ? retirementAge.value : 0) || 0;
    var savings = parseFloat(currentSavings ? currentSavings.value : 0) || 0;
    var monthly = parseFloat(monthlyContribution ? monthlyContribution.value : 0) || 0;
    var returnRate = parseFloat(expectedReturn ? expectedReturn.value : 0) || 0;
    var inflation = parseFloat(inflationRate ? inflationRate.value : 0) || 0;
    var desired = parseFloat(desiredIncome ? desiredIncome.value : 0) || 0;

    if (age > 0 && retireAge > age && desired > 0) {
      var result = calculateRetirement(age, retireAge, savings, monthly, returnRate, inflation, desired);
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
        labels.push(schedule[i].age);
        balances.push(schedule[i].balance);
      }
      if (schedule.length > 0 && (schedule.length - 1) % step !== 0) {
        var last = schedule[schedule.length - 1];
        labels.push(last.age);
        balances.push(last.balance);
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Retirement Savings',
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
                  return 'Savings: ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
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
      var totalContrib = result.totalContributions;
      var totalInterest = result.totalInterest;

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Contributions', 'Total Growth'],
          datasets: [{
            label: 'Amount',
            data: [totalContrib, totalInterest],
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
      var totalContrib2 = result.totalContributions;
      var totalInterest2 = result.totalInterest;

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Total Contributions', 'Total Growth'],
          datasets: [{
            data: [totalContrib2, totalInterest2],
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
    if (retirementAge) params.set('r', retirementAge.value);
    if (currentSavings) params.set('s', currentSavings.value);
    if (monthlyContribution) params.set('m', monthlyContribution.value);
    if (expectedReturn) params.set('e', expectedReturn.value);
    if (inflationRate) params.set('i', inflationRate.value);
    if (desiredIncome) params.set('d', desiredIncome.value);

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
    a.download = 'retirement-projection.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var projected = projectedSavings ? projectedSavings.textContent : '';
    var monthly = monthlyIncome ? monthlyIncome.textContent : '';
    var annual = annualIncome ? annualIncome.textContent : '';
    var gap = incomeGap ? incomeGap.textContent : '';
    var text = 'Retirement Result:\nProjected Savings: ' + projected + '\nMonthly Income: ' + monthly + '\nAnnual Income: ' + annual + '\nIncome Gap: ' + gap;
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
    link.download = 'retirement-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultAge = 30;
    var defaultRetireAge = 65;
    var defaultSavings = 50000;
    var defaultMonthly = 1000;
    var defaultReturn = 7;
    var defaultInflation = 3;
    var defaultIncome = 40000;

    if (currentAge) { currentAge.value = defaultAge; if (currentAgeSlider) currentAgeSlider.value = defaultAge; }
    if (retirementAge) { retirementAge.value = defaultRetireAge; if (retirementAgeSlider) retirementAgeSlider.value = defaultRetireAge; }
    if (currentSavings) { currentSavings.value = defaultSavings; if (currentSavingsSlider) currentSavingsSlider.value = defaultSavings; }
    if (monthlyContribution) { monthlyContribution.value = defaultMonthly; if (monthlyContributionSlider) monthlyContributionSlider.value = defaultMonthly; }
    if (expectedReturn) { expectedReturn.value = defaultReturn; if (expectedReturnSlider) expectedReturnSlider.value = defaultReturn; }
    if (inflationRate) { inflationRate.value = defaultInflation; if (inflationRateSlider) inflationRateSlider.value = defaultInflation; }
    if (desiredIncome) { desiredIncome.value = defaultIncome; if (desiredIncomeSlider) desiredIncomeSlider.value = defaultIncome; }

    updateSliderLabel('currentAge', defaultAge);
    updateSliderLabel('retirementAge', defaultRetireAge);
    updateSliderLabel('currentSavings', defaultSavings);
    updateSliderLabel('monthlyContribution', defaultMonthly);
    updateSliderLabel('expectedReturn', defaultReturn);
    updateSliderLabel('inflationRate', defaultInflation);
    updateSliderLabel('desiredIncome', defaultIncome);
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
    if (params.has('r')) {
      var rVal = parseFloat(params.get('r'));
      if (!isNaN(rVal) && rVal >= 18 && rVal <= 100) {
        if (retirementAge) { retirementAge.value = rVal; if (retirementAgeSlider) retirementAgeSlider.value = rVal; }
        updateSliderLabel('retirementAge', rVal);
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
    if (params.has('e')) {
      var eVal = parseFloat(params.get('e'));
      if (!isNaN(eVal) && eVal >= 0 && eVal <= 20) {
        if (expectedReturn) { expectedReturn.value = eVal; if (expectedReturnSlider) expectedReturnSlider.value = eVal; }
        updateSliderLabel('expectedReturn', eVal);
      }
    }
    if (params.has('i')) {
      var iVal = parseFloat(params.get('i'));
      if (!isNaN(iVal) && iVal >= 0 && iVal <= 15) {
        if (inflationRate) { inflationRate.value = iVal; if (inflationRateSlider) inflationRateSlider.value = iVal; }
        updateSliderLabel('inflationRate', iVal);
      }
    }
    if (params.has('d')) {
      var dVal = parseFloat(params.get('d'));
      if (!isNaN(dVal) && dVal >= 0) {
        if (desiredIncome) { desiredIncome.value = dVal; if (desiredIncomeSlider) desiredIncomeSlider.value = dVal; }
        updateSliderLabel('desiredIncome', dVal);
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
    console.warn('Retirement Calculator not loaded yet.');
  };
}