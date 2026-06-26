// ============================================================
// AVALANCHE VS SNOWBALL CALCULATOR (FIXED - NO HANGS)
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var monthlyBudget = document.getElementById('monthlyBudget');
  var monthlyBudgetSlider = document.getElementById('monthlyBudgetSlider');
  var debtList = document.getElementById('debtList');

  var avalancheTime = document.getElementById('avalancheTime');
  var avalancheInterest = document.getElementById('avalancheInterest');
  var avalancheFirstPaid = document.getElementById('avalancheFirstPaid');
  var snowballTime = document.getElementById('snowballTime');
  var snowballInterest = document.getElementById('snowballInterest');
  var snowballFirstPaid = document.getElementById('snowballFirstPaid');
  var winnerBox = document.getElementById('winnerBox');
  var winnerBadge = document.getElementById('winnerBadge');
  var winnerMessage = document.getElementById('winnerMessage');
  var tableHead = document.getElementById('tableHead');
  var tableBody = document.getElementById('tableBody');
  var toolChart = document.getElementById('toolChart');
  var avalancheDonutChart = document.getElementById('avalancheDonutChart');
  var snowballDonutChart = document.getElementById('snowballDonutChart');

  var chartInstance = null;
  var donutAvalancheInstance = null;
  var donutSnowballInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'line';
  var debts = [];

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
      case 'monthlyBudget':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Debt Management ──
  window.addDebt = function(name, balance, rate, min) {
    var id = Date.now() + Math.random() * 1000;
    var html = '<div class="debt-row" data-id="' + id + '">' +
      '<div class="debt-row-header">' +
      '<span class="debt-title">' + (name || 'Debt ' + (debts.length + 1)) + '</span>' +
      '<button class="debt-remove" onclick="removeDebt(' + id + ')">✕</button>' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Debt Name</label>' +
      '<input type="text" class="debt-name" value="' + (name || 'Debt ' + (debts.length + 1)) + '" />' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Balance</label>' +
      '<div class="input-addons">' +
      '<span class="input-addon">' + selectedCurrency.symbol + '</span>' +
      '<input type="number" class="debt-balance" value="' + (balance || 5000) + '" min="0" step="100" />' +
      '</div>' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Interest Rate (%)</label>' +
      '<div class="input-addons">' +
      '<input type="number" class="debt-rate" value="' + (rate || 22) + '" min="0" step="0.5" />' +
      '<span class="input-addon input-addon--right">%</span>' +
      '</div>' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Minimum Payment</label>' +
      '<div class="input-addons">' +
      '<span class="input-addon">' + selectedCurrency.symbol + '</span>' +
      '<input type="number" class="debt-min" value="' + (min || 200) + '" min="0" step="25" />' +
      '</div>' +
      '</div>' +
      '</div>';

    debtList.insertAdjacentHTML('beforeend', html);

    // ── Attach input events to debt fields ──
    var row = debtList.lastElementChild;
    row.querySelectorAll('.debt-balance, .debt-rate, .debt-min, .debt-name').forEach(function(input) {
      input.addEventListener('input', function() {
        updateDebtsFromDOM();
        window.calculate();
      });
    });

    updateDebtsFromDOM();
    window.calculate();
  };

  window.removeDebt = function(id) {
    var row = document.querySelector('.debt-row[data-id="' + id + '"]');
    if (row) {
      row.remove();
      updateDebtsFromDOM();
      window.calculate();

      var titles = document.querySelectorAll('.debt-title');
      titles.forEach(function(title, index) {
        var nameInput = title.closest('.debt-row').querySelector('.debt-name');
        if (nameInput && nameInput.value.trim()) {
          title.textContent = nameInput.value;
        } else {
          title.textContent = 'Debt ' + (index + 1);
        }
      });
    }
  };

  function updateDebtsFromDOM() {
    debts = [];
    var rows = document.querySelectorAll('.debt-row');
    rows.forEach(function(row) {
      var name = row.querySelector('.debt-name')?.value || 'Debt';
      var balance = parseFloat(row.querySelector('.debt-balance')?.value) || 0;
      var rate = parseFloat(row.querySelector('.debt-rate')?.value) || 0;
      var min = parseFloat(row.querySelector('.debt-min')?.value) || 0;
      if (balance > 0) {
        debts.push({
          id: row.dataset.id,
          name: name,
          balance: balance,
          rate: rate,
          min: min
        });
      }
    });
  }

  // ── Debt Payoff Simulation (FIXED — NO HANGS) ──
  function simulatePayoff(debts, budget, strategy) {
    var debtCopy = debts.map(function(d) {
      return {
        name: d.name,
        balance: d.balance,
        rate: d.rate,
        min: d.min,
        originalBalance: d.balance
      };
    });

    var totalMinPayments = debtCopy.reduce(function(sum, d) { return sum + d.min; }, 0);
    var extraPayment = Math.max(0, budget - totalMinPayments);
    var totalInterest = 0;
    var schedule = [];
    var month = 0;
    var firstPaidMonth = null;
    var paidDebts = [];

    // 1. Check if budget is less than total minimums → impossible
    if (budget < totalMinPayments) {
      return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity, schedule: [], firstPaidMonth: null, impossible: true };
    }

    // 2. Check if no extra payment and minimum payments don't even cover interest → impossible
    var firstMonthInterest = debtCopy.reduce(function(sum, d) {
      return sum + d.balance * (d.rate / 100 / 12);
    }, 0);
    if (extraPayment === 0 && totalMinPayments <= firstMonthInterest) {
      return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity, schedule: [], firstPaidMonth: null, impossible: true };
    }

    var maxMonths = 1200; // 100 years safety
    var previousTotalBalance = debtCopy.reduce(function(sum, d) { return sum + d.balance; }, 0);
    var noProgressCount = 0;

    while (debtCopy.some(function(d) { return d.balance > 0.01; }) && month < maxMonths) {
      month++;

      // Pay minimums on all debts
      debtCopy.forEach(function(d) {
        if (d.balance <= 0) return;
        var interest = d.balance * (d.rate / 100 / 12);
        var minPayment = Math.min(d.min, d.balance + interest);
        var principalPaid = minPayment - interest;
        if (principalPaid < 0) principalPaid = 0;
        if (principalPaid > d.balance) principalPaid = d.balance;
        d.balance -= principalPaid;
        if (d.balance < 0) d.balance = 0;
        totalInterest += interest;
      });

      // Apply extra payment to target debt
      var target = null;
      if (strategy === 'avalanche') {
        target = debtCopy.filter(function(d) { return d.balance > 0.01; })
          .sort(function(a, b) { return b.rate - a.rate; })[0];
      } else {
        target = debtCopy.filter(function(d) { return d.balance > 0.01; })
          .sort(function(a, b) { return a.balance - b.balance; })[0];
      }

      if (target && extraPayment > 0) {
        var principalPaid = Math.min(extraPayment, target.balance);
        target.balance -= principalPaid;
        if (target.balance < 0) target.balance = 0;

        if (target.balance <= 0.01 && firstPaidMonth === null && !paidDebts.includes(target.name)) {
          firstPaidMonth = month;
          paidDebts.push(target.name);
        }
      }

      var totalBalance = debtCopy.reduce(function(sum, d) { return sum + d.balance; }, 0);
      schedule.push({
        month: month,
        balance: totalBalance,
        totalInterest: totalInterest
      });

      // 3. Check for progress; if no progress for 12 months → impossible
      if (totalBalance >= previousTotalBalance) {
        noProgressCount++;
        if (noProgressCount > 12) {
          return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity, schedule: schedule, firstPaidMonth: firstPaidMonth, impossible: true };
        }
      } else {
        noProgressCount = 0;
        previousTotalBalance = totalBalance;
      }

      if (totalBalance <= 0.01) break;
    }

    if (month >= maxMonths) {
      return { months: Infinity, totalInterest: Infinity, totalPaid: Infinity, schedule: schedule, firstPaidMonth: firstPaidMonth, impossible: true };
    }

    var totalPrincipal = debts.reduce(function(sum, d) { return sum + d.balance; }, 0);
    return {
      months: month,
      totalInterest: totalInterest,
      totalPaid: totalPrincipal + totalInterest,
      schedule: schedule,
      firstPaidMonth: firstPaidMonth,
      impossible: false
    };
  }

  // ── Main Calculate (FIXED) ──
  window.calculate = function() {
    updateDebtsFromDOM();

    var budget = parseFloat(monthlyBudget ? monthlyBudget.value : 0) || 0;
    var totalMin = debts.reduce(function(sum, d) { return sum + d.min; }, 0);

    if (debts.length === 0 || budget < totalMin) {
      // Clear results
      if (avalancheTime) avalancheTime.textContent = '—';
      if (avalancheInterest) avalancheInterest.textContent = '—';
      if (avalancheFirstPaid) avalancheFirstPaid.textContent = '—';
      if (snowballTime) snowballTime.textContent = '—';
      if (snowballInterest) snowballInterest.textContent = '—';
      if (snowballFirstPaid) snowballFirstPaid.textContent = '—';
      if (winnerBox) winnerBox.style.display = 'none';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var avalancheResult = simulatePayoff(debts, budget, 'avalanche');
    var snowballResult = simulatePayoff(debts, budget, 'snowball');

    // Display Avalanche results
    if (avalancheResult.impossible) {
      avalancheTime.textContent = 'Never';
      avalancheInterest.textContent = '∞';
    } else {
      avalancheTime.textContent = avalancheResult.months + ' mo';
      avalancheInterest.textContent = formatCurrency(avalancheResult.totalInterest);
    }
    avalancheFirstPaid.textContent = avalancheResult.firstPaidMonth ? 'Month ' + avalancheResult.firstPaidMonth : '—';

    // Display Snowball results
    if (snowballResult.impossible) {
      snowballTime.textContent = 'Never';
      snowballInterest.textContent = '∞';
    } else {
      snowballTime.textContent = snowballResult.months + ' mo';
      snowballInterest.textContent = formatCurrency(snowballResult.totalInterest);
    }
    snowballFirstPaid.textContent = snowballResult.firstPaidMonth ? 'Month ' + snowballResult.firstPaidMonth : '—';

    // Winner logic
    if (winnerBox) {
      winnerBox.style.display = 'block';
      if (avalancheResult.impossible && snowballResult.impossible) {
        winnerBadge.textContent = '⚠️ Cannot Pay Off';
        winnerMessage.textContent = 'Your monthly budget is insufficient to cover the interest. Increase your payment.';
      } else if (avalancheResult.impossible) {
        winnerBadge.textContent = '🏆 Snowball Wins!';
        winnerMessage.textContent = 'Snowball can pay off the debt (Avalanche cannot).';
      } else if (snowballResult.impossible) {
        winnerBadge.textContent = '🏆 Avalanche Wins!';
        winnerMessage.textContent = 'Avalanche can pay off the debt (Snowball cannot).';
      } else if (avalancheResult.totalInterest < snowballResult.totalInterest) {
        winnerBadge.textContent = '🏆 Avalanche Wins!';
        winnerMessage.textContent = 'Avalanche saves ' + formatCurrency(snowballResult.totalInterest - avalancheResult.totalInterest) +
          ' in interest and takes ' + (snowballResult.months - avalancheResult.months) + ' months less';
      } else if (snowballResult.totalInterest < avalancheResult.totalInterest) {
        winnerBadge.textContent = '🏆 Snowball Wins!';
        winnerMessage.textContent = 'Snowball saves ' + formatCurrency(avalancheResult.totalInterest - snowballResult.totalInterest) +
          ' in interest and takes ' + (avalancheResult.months - snowballResult.months) + ' months less';
      } else {
        winnerBadge.textContent = '⚖️ Tie!';
        winnerMessage.textContent = 'Both strategies yield the same result.';
      }
    }

    // Update charts and table (only if not impossible)
    if (!avalancheResult.impossible && !snowballResult.impossible) {
      updateDonutCharts(avalancheResult, snowballResult);
      generateSchedule(avalancheResult, snowballResult);
      updateChart(avalancheResult, snowballResult);
    } else {
      // If impossible, clear or show appropriate message
      if (avalancheDonutChart && donutAvalancheInstance) {
        donutAvalancheInstance.destroy();
        donutAvalancheInstance = null;
      }
      if (snowballDonutChart && donutSnowballInstance) {
        donutSnowballInstance.destroy();
        donutSnowballInstance = null;
      }
      if (toolChart && chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
    }
    updateShareURL();
  };

  // ── Update Donut Charts ──
  function updateDonutCharts(avalancheResult, snowballResult) {
    if (!isChartJsLoaded()) return;
    if (avalancheResult.impossible || snowballResult.impossible) return;

    var totalPrincipal = debts.reduce(function(sum, d) { return sum + d.balance; }, 0);

    if (avalancheDonutChart) {
      if (donutAvalancheInstance) donutAvalancheInstance.destroy();
      var ctx1 = avalancheDonutChart.getContext('2d');
      donutAvalancheInstance = new Chart(ctx1, {
        type: 'doughnut',
        data: {
          labels: ['Principal', 'Interest'],
          datasets: [{
            data: [totalPrincipal, avalancheResult.totalInterest],
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
                  return context.label + ': ' + selectedCurrency.symbol + context.parsed.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' (' + percentage + '%)';
                }
              }
            }
          }
        }
      });
    }

    if (snowballDonutChart) {
      if (donutSnowballInstance) donutSnowballInstance.destroy();
      var ctx2 = snowballDonutChart.getContext('2d');
      donutSnowballInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Principal', 'Interest'],
          datasets: [{
            data: [totalPrincipal, snowballResult.totalInterest],
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
                  return context.label + ': ' + selectedCurrency.symbol + context.parsed.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' (' + percentage + '%)';
                }
              }
            }
          }
        }
      });
    }
  }

  // ── Generate Schedule Table ──
  function generateSchedule(avalancheResult, snowballResult) {
    if (!tableHead || !tableBody) return;
    if (avalancheResult.impossible || snowballResult.impossible) return;

    tableHead.innerHTML = '<tr><th>Month</th><th>Avalanche Balance</th><th>Snowball Balance</th><th>Avalanche Interest</th><th>Snowball Interest</th></tr>';

    var rows = '';
    var maxMonths = Math.max(avalancheResult.schedule.length, snowballResult.schedule.length);
    var step = Math.max(1, Math.floor(maxMonths / 20));

    for (var i = 0; i < maxMonths; i += step) {
      var avalanche = avalancheResult.schedule[i] || avalancheResult.schedule[avalancheResult.schedule.length - 1];
      var snowball = snowballResult.schedule[i] || snowballResult.schedule[snowballResult.schedule.length - 1];

      rows += '<tr>' +
        '<td><strong>' + (i + 1) + '</strong></td>' +
        '<td>' + formatCurrency(avalanche.balance) + '</td>' +
        '<td>' + formatCurrency(snowball.balance) + '</td>' +
        '<td>' + formatCurrency(avalanche.totalInterest) + '</td>' +
        '<td>' + formatCurrency(snowball.totalInterest) + '</td>' +
      '</tr>';
    }

    var avFinal = avalancheResult.schedule[avalancheResult.schedule.length - 1];
    var sbFinal = snowballResult.schedule[snowballResult.schedule.length - 1];
    rows += '<tr class="highlight-row">' +
      '<td><strong>Done</strong></td>' +
      '<td>' + formatCurrency(avFinal.balance) + '</td>' +
      '<td>' + formatCurrency(sbFinal.balance) + '</td>' +
      '<td>' + formatCurrency(avFinal.totalInterest) + '</td>' +
      '<td>' + formatCurrency(sbFinal.totalInterest) + '</td>' +
    '</tr>';

    tableBody.innerHTML = rows;
  }

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    var budget = parseFloat(monthlyBudget ? monthlyBudget.value : 0) || 0;

    if (debts.length > 0) {
      var avalancheResult = simulatePayoff(debts, budget, 'avalanche');
      var snowballResult = simulatePayoff(debts, budget, 'snowball');
      if (!avalancheResult.impossible && !snowballResult.impossible) {
        updateChart(avalancheResult, snowballResult);
      } else {
        if (toolChart && chartInstance) {
          chartInstance.destroy();
          chartInstance = null;
        }
      }
    }
  };

  function updateChart(avalancheResult, snowballResult) {
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
    if (avalancheResult.impossible || snowballResult.impossible) return;

    var ctx = toolChart.getContext('2d');
    if (chartInstance) chartInstance.destroy();

    var currencySymbol = selectedCurrency.symbol;

    if (currentChartType === 'line') {
      var labels = [];
      var avalancheBalances = [];
      var snowballBalances = [];
      var maxMonths = Math.max(avalancheResult.schedule.length, snowballResult.schedule.length);
      var step = Math.max(1, Math.floor(maxMonths / 30));

      for (var i = 0; i < maxMonths; i += step) {
        var av = avalancheResult.schedule[i] || avalancheResult.schedule[avalancheResult.schedule.length - 1];
        var sb = snowballResult.schedule[i] || snowballResult.schedule[snowballResult.schedule.length - 1];
        labels.push(i + 1);
        avalancheBalances.push(av.balance);
        snowballBalances.push(sb.balance);
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Avalanche Balance',
              data: avalancheBalances,
              borderColor: '#0d9488',
              backgroundColor: 'rgba(13, 148, 136, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 2
            },
            {
              label: 'Snowball Balance',
              data: snowballBalances,
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              fill: true,
              tension: 0.3,
              pointRadius: 2
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
                  return context.dataset.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 2 });
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
      var debtNames = debts.map(function(d) { return d.name; });
      var avalancheInterestByDebt = [];
      var snowballInterestByDebt = [];

      var totalPrincipal = debts.reduce(function(sum, d) { return sum + d.balance; }, 0);
      debts.forEach(function(d) {
        var ratio = d.balance / totalPrincipal;
        avalancheInterestByDebt.push(avalancheResult.totalInterest * ratio);
        snowballInterestByDebt.push(snowballResult.totalInterest * ratio);
      });

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: debtNames,
          datasets: [
            {
              label: 'Avalanche Interest',
              data: avalancheInterestByDebt,
              backgroundColor: 'rgba(13, 148, 136, 0.7)',
              borderRadius: 4
            },
            {
              label: 'Snowball Interest',
              data: snowballInterestByDebt,
              backgroundColor: 'rgba(99, 102, 241, 0.7)',
              borderRadius: 4
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
                  return context.dataset.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 2 });
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
    }
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (monthlyBudget) params.set('b', monthlyBudget.value);

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
    a.download = 'avalanche-vs-snowball.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var avTime = avalancheTime ? avalancheTime.textContent : '';
    var sbTime = snowballTime ? snowballTime.textContent : '';
    var avInt = avalancheInterest ? avalancheInterest.textContent : '';
    var sbInt = snowballInterest ? snowballInterest.textContent : '';
    var text = 'Avalanche vs Snowball Result:\n\nAvalanche:\nTime: ' + avTime + '\nInterest: ' + avInt +
      '\n\nSnowball:\nTime: ' + sbTime + '\nInterest: ' + sbInt;
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
    link.download = 'avalanche-vs-snowball-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    debtList.innerHTML = '';

    addDebt('Credit Card', 5000, 22, 200);
    addDebt('Personal Loan', 3000, 18, 150);
    addDebt('Student Loan', 2000, 12, 100);

    if (monthlyBudget) { monthlyBudget.value = '1000'; if (monthlyBudgetSlider) monthlyBudgetSlider.value = '1000'; }

    updateSliderLabel('monthlyBudget', '1000');
    window.calculate();
  };

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function() {
    initCurrencyPicker();

    addDebt('Credit Card', 5000, 22, 200);
    addDebt('Personal Loan', 3000, 18, 150);
    addDebt('Student Loan', 2000, 12, 100);

    window.calculate();
    window.addEventListener('resize', function() {
      if (chartInstance) chartInstance.resize();
    });
  });

})();

// ── Safety fallback ──
if (typeof window.calculate === 'undefined') {
  window.calculate = function() {
    console.warn('Avalanche vs Snowball Calculator not loaded yet.');
  };
}