// ============================================================
// BUDGET CALCULATOR — With Type Selector
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var incomeList = document.getElementById('incomeList');
  var expenseList = document.getElementById('expenseList');

  var totalIncome = document.getElementById('totalIncome');
  var totalExpenses = document.getElementById('totalExpenses');
  var netBalance = document.getElementById('netBalance');
  var savingsRate = document.getElementById('savingsRate');
  var insightsGrid = document.getElementById('insightsGrid');
  var tableHead = document.getElementById('tableHead');
  var tableBody = document.getElementById('tableBody');
  var toolChart = document.getElementById('toolChart');

  // Settings Elements
  var settingsOverlay = document.getElementById('settingsOverlay');
  var settingsToggle = document.getElementById('settingsToggle');
  var settingsClose = document.getElementById('settingsClose');
  var settingsCancel = document.getElementById('settingsCancel');
  var settingsSave = document.getElementById('settingsSave');
  var defaultIncomeInput = document.getElementById('defaultIncome');
  var defaultExpenseInput = document.getElementById('defaultExpense');
  var numberFormatGroup = document.getElementById('numberFormatGroup');
  var themeGroup = document.getElementById('themeGroup');

  // Type Selector Elements
  var typeSelectorOverlay = document.getElementById('typeSelectorOverlay');
  var typeSelectorTitle = document.getElementById('typeSelectorTitle');
  var typeList = document.getElementById('typeList');
  var customTypeInput = document.getElementById('customTypeInput');
  var addCustomTypeBtn = document.getElementById('addCustomTypeBtn');
  var typeSelectorClose = document.getElementById('typeSelectorClose');
  var typeSelectorCancel = document.getElementById('typeSelectorCancel');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'donut';

  // ── Settings State ──
  var settings = {
    numberFormat: 'us',
    theme: 'light',
    defaultIncome: ['Salary', 'Freelance', 'Investment'],
    defaultExpense: ['Rent', 'Groceries', 'Transport', 'Entertainment', 'Insurance']
  };

  // ── Pending add operation (to know which list to add to) ──
  var pendingAddTarget = null; // 'income' or 'expense'

  // ── Helper: Check if Chart.js is loaded ──
  function isChartJsLoaded() {
    return typeof Chart !== 'undefined';
  }

  // ── Formatting ──
  function formatNumber(num) {
    if (!isFinite(num)) return '—';
    var locale = 'en-US';
    if (settings.numberFormat === 'eu') locale = 'de-DE';
    if (settings.numberFormat === 'in') locale = 'en-IN';
    return num.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
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

  // ── Settings Popup ──
  function openSettings() {
    defaultIncomeInput.value = settings.defaultIncome.join(', ');
    defaultExpenseInput.value = settings.defaultExpense.join(', ');

    var formatToggles = numberFormatGroup.querySelectorAll('.settings-toggle');
    formatToggles.forEach(function(t) {
      t.classList.toggle('active', t.dataset.value === settings.numberFormat);
    });

    var themeToggles = themeGroup.querySelectorAll('.settings-toggle');
    themeToggles.forEach(function(t) {
      t.classList.toggle('active', t.dataset.value === settings.theme);
    });

    settingsOverlay.classList.add('active');
  }

  function closeSettings() {
    settingsOverlay.classList.remove('active');
  }

  function saveSettings() {
    var formatActive = numberFormatGroup.querySelector('.settings-toggle.active');
    if (formatActive) {
      settings.numberFormat = formatActive.dataset.value;
    }

    var themeActive = themeGroup.querySelector('.settings-toggle.active');
    if (themeActive) {
      settings.theme = themeActive.dataset.value;
      applyTheme(settings.theme);
    }

    settings.defaultIncome = defaultIncomeInput.value.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    settings.defaultExpense = defaultExpenseInput.value.split(',').map(function(s) { return s.trim(); }).filter(Boolean);

    try {
      localStorage.setItem('budgetSettings', JSON.stringify(settings));
    } catch (e) {}

    closeSettings();
    window.calculate();
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : '');
      if (!prefersDark) document.documentElement.removeAttribute('data-theme');
    }
  }

  function loadSettings() {
    try {
      var saved = localStorage.getItem('budgetSettings');
      if (saved) {
        var parsed = JSON.parse(saved);
        settings = Object.assign(settings, parsed);
        applyTheme(settings.theme);
      }
    } catch (e) {}
  }

  // ── Event Listeners for Settings ──
  settingsToggle.addEventListener('click', openSettings);
  settingsClose.addEventListener('click', closeSettings);
  settingsCancel.addEventListener('click', closeSettings);
  settingsSave.addEventListener('click', saveSettings);

  settingsOverlay.addEventListener('click', function(e) {
    if (e.target === this) closeSettings();
  });

  document.querySelectorAll('.settings-toggle-group').forEach(function(group) {
    group.querySelectorAll('.settings-toggle').forEach(function(btn) {
      btn.addEventListener('click', function() {
        group.querySelectorAll('.settings-toggle').forEach(function(b) {
          b.classList.remove('active');
        });
        this.classList.add('active');
      });
    });
  });

  // ── Type Selector ──
  function openTypeSelector(target) {
    pendingAddTarget = target;
    var types = target === 'income' ? settings.defaultIncome : settings.defaultExpense;
    var title = target === 'income' ? 'Select Income Type' : 'Select Expense Type';
    var defaultAmount = target === 'income' ? 1000 : 500;

    typeSelectorTitle.textContent = title;
    customTypeInput.value = '';

    // Render type list
    var html = '';
    if (types.length === 0) {
      html = '<div class="type-option" style="cursor:default;color:var(--text-light);">No types defined in settings. Add one below.</div>';
    } else {
      types.forEach(function(type) {
        html += '<div class="type-option" data-type="' + type + '" data-default="' + defaultAmount + '">' +
          '<span class="type-name">' + type + '</span>' +
          '<span class="type-default-amount">' + formatCurrency(defaultAmount) + '</span>' +
        '</div>';
      });
    }
    typeList.innerHTML = html;

    // Add click handlers to type options
    typeList.querySelectorAll('.type-option').forEach(function(option) {
      option.addEventListener('click', function() {
        var type = this.dataset.type;
        var amount = parseFloat(this.dataset.default) || defaultAmount;
        addRowWithType(target, type, amount);
        closeTypeSelector();
      });
    });

    // Show the popup
    typeSelectorOverlay.classList.add('active');
    customTypeInput.focus();
  }

  function closeTypeSelector() {
    typeSelectorOverlay.classList.remove('active');
    pendingAddTarget = null;
  }

  function addRowWithType(target, type, amount) {
    if (target === 'income') {
      addIncome(type, amount);
    } else {
      addExpense(type, amount);
    }
  }

  // ── Event Listeners for Type Selector ──
  typeSelectorClose.addEventListener('click', closeTypeSelector);
  typeSelectorCancel.addEventListener('click', closeTypeSelector);
  typeSelectorOverlay.addEventListener('click', function(e) {
    if (e.target === this) closeTypeSelector();
  });

  addCustomTypeBtn.addEventListener('click', function() {
    var customType = customTypeInput.value.trim();
    if (!customType) return;
    var defaultAmount = pendingAddTarget === 'income' ? 1000 : 500;
    addRowWithType(pendingAddTarget, customType, defaultAmount);
    closeTypeSelector();
  });

  customTypeInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      addCustomTypeBtn.click();
    }
  });

  // ── Income Management ──
  window.addIncome = function(name, amount) {
    var id = Date.now() + Math.random() * 1000;
    var defaultName = name || 'Income';
    var defaultAmount = amount || 1000;
    var html = '<div class="debt-row income-row" data-id="' + id + '">' +
      '<div class="debt-row-header">' +
      '<span class="debt-title">' + defaultName + '</span>' +
      '<button class="debt-remove" onclick="removeIncome(' + id + ')">✕</button>' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Amount</label>' +
      '<div class="input-addons">' +
      '<span class="input-addon">' + selectedCurrency.symbol + '</span>' +
      '<input type="number" class="debt-amount" value="' + defaultAmount + '" min="0" step="50" />' +
      '</div>' +
      '</div>' +
      '</div>';
    incomeList.insertAdjacentHTML('beforeend', html);

    var row = incomeList.lastElementChild;
    row.querySelector('.debt-amount').addEventListener('input', function() {
      window.calculate();
    });
    window.calculate();
  };

  window.removeIncome = function(id) {
    var row = document.querySelector('.income-row[data-id="' + id + '"]');
    if (row) {
      row.remove();
      window.calculate();
    }
  };

  // ── Expense Management ──
  window.addExpense = function(name, amount) {
    var id = Date.now() + Math.random() * 1000;
    var defaultName = name || 'Expense';
    var defaultAmount = amount || 500;
    var html = '<div class="debt-row expense-row" data-id="' + id + '">' +
      '<div class="debt-row-header">' +
      '<span class="debt-title">' + defaultName + '</span>' +
      '<button class="debt-remove" onclick="removeExpense(' + id + ')">✕</button>' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Amount</label>' +
      '<div class="input-addons">' +
      '<span class="input-addon">' + selectedCurrency.symbol + '</span>' +
      '<input type="number" class="debt-amount" value="' + defaultAmount + '" min="0" step="50" />' +
      '</div>' +
      '</div>' +
      '</div>';
    expenseList.insertAdjacentHTML('beforeend', html);

    var row = expenseList.lastElementChild;
    row.querySelector('.debt-amount').addEventListener('input', function() {
      window.calculate();
    });
    window.calculate();
  };

  window.removeExpense = function(id) {
    var row = document.querySelector('.expense-row[data-id="' + id + '"]');
    if (row) {
      row.remove();
      window.calculate();
    }
  };

  // ── Button Handlers for Add Income / Expense ──
  document.getElementById('addIncomeBtn').addEventListener('click', function() {
    openTypeSelector('income');
  });

  document.getElementById('addExpenseBtn').addEventListener('click', function() {
    openTypeSelector('expense');
  });

  // ── Get Data from DOM ──
  function getIncomeData() {
    var data = [];
    var rows = document.querySelectorAll('.income-row');
    rows.forEach(function(row) {
      var name = row.querySelector('.debt-title')?.textContent || 'Income';
      var amount = parseFloat(row.querySelector('.debt-amount')?.value) || 0;
      if (amount > 0) {
        data.push({ name: name, amount: amount });
      }
    });
    return data;
  }

  function getExpenseData() {
    var data = [];
    var rows = document.querySelectorAll('.expense-row');
    rows.forEach(function(row) {
      var name = row.querySelector('.debt-title')?.textContent || 'Expense';
      var amount = parseFloat(row.querySelector('.debt-amount')?.value) || 0;
      if (amount > 0) {
        data.push({ name: name, amount: amount });
      }
    });
    return data;
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var incomes = getIncomeData();
    var expenses = getExpenseData();

    var totalInc = incomes.reduce(function(sum, i) { return sum + i.amount; }, 0);
    var totalExp = expenses.reduce(function(sum, e) { return sum + e.amount; }, 0);
    var net = totalInc - totalExp;
    var rate = totalInc > 0 ? (net / totalInc) * 100 : 0;

    if (totalIncome) totalIncome.textContent = formatCurrency(totalInc);
    if (totalExpenses) totalExpenses.textContent = formatCurrency(totalExp);
    if (netBalance) {
      netBalance.textContent = formatCurrency(net);
      netBalance.style.color = net >= 0 ? 'var(--primary, #0d9488)' : '#dc2626';
    }
    if (savingsRate) savingsRate.textContent = formatPercent(rate);

    generateInsights(totalInc, totalExp, net, rate);
    generateBreakdown(incomes, expenses);
    updateChart(incomes, expenses);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(totalInc, totalExp, net, rate) {
    if (!insightsGrid) return;
    var insights = [];

    if (net > 0) {
      insights.push({
        icon: '✅',
        text: 'You\'re <strong>saving ' + formatCurrency(net) + '</strong> per month (' + formatPercent(rate) + ' of income)'
      });
    } else if (net < 0) {
      insights.push({
        icon: '⚠️',
        text: 'You\'re <strong>spending ' + formatCurrency(Math.abs(net)) + '</strong> more than you earn. Consider reducing expenses.'
      });
    } else {
      insights.push({
        icon: '⚖️',
        text: 'Your income and expenses are <strong>balanced</strong>.'
      });
    }

    if (totalExp > 0 && totalInc > 0) {
      var expenseRatio = (totalExp / totalInc) * 100;
      insights.push({
        icon: '📊',
        text: 'Expenses are <strong>' + formatPercent(expenseRatio) + '</strong> of your income'
      });
    }

    if (totalInc > 0 && totalExp > 0 && net > 0 && rate > 20) {
      insights.push({
        icon: '🎯',
        text: 'Great savings rate! You\'re saving over 20% of your income.'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Add your income and expenses to see your budget breakdown'
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
  function generateBreakdown(incomes, expenses) {
    if (!tableHead || !tableBody) return;

    tableHead.innerHTML = '<tr><th>Category</th><th>Amount</th><th>% of Income</th><th>Type</th></tr>';

    var rows = '';
    var totalInc = incomes.reduce(function(sum, i) { return sum + i.amount; }, 0);

    incomes.forEach(function(inc) {
      var pct = totalInc > 0 ? (inc.amount / totalInc) * 100 : 0;
      rows += '<tr>' +
        '<td><strong>' + inc.name + '</strong></td>' +
        '<td style="color:var(--primary, #0d9488);">' + formatCurrency(inc.amount) + '</td>' +
        '<td>' + formatPercent(pct) + '</td>' +
        '<td>💰 Income</td>' +
      '</tr>';
    });

    expenses.forEach(function(exp) {
      var pct = totalInc > 0 ? (exp.amount / totalInc) * 100 : 0;
      var isLastRow = (exp === expenses[expenses.length - 1]);
      rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
        '<td><strong>' + exp.name + '</strong></td>' +
        '<td style="color:#dc2626;">' + formatCurrency(exp.amount) + '</td>' +
        '<td>' + formatPercent(pct) + '</td>' +
        '<td>📊 Expense</td>' +
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

    var incomes = getIncomeData();
    var expenses = getExpenseData();
    updateChart(incomes, expenses);
  };

  function updateChart(incomes, expenses) {
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

    if (currentChartType === 'donut') {
      var labels = expenses.map(function(e) { return e.name; });
      var amounts = expenses.map(function(e) { return e.amount; });

      if (amounts.length === 0) {
        labels = ['No Expenses'];
        amounts = [1];
      }

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: amounts,
            backgroundColor: [
              '#0d9488', '#6366f1', '#f59e0b', '#ef4444',
              '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
              '#f97316', '#14b8a6', '#3b82f6', '#a855f7'
            ],
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

    } else if (currentChartType === 'bar') {
      var totalInc = incomes.reduce(function(sum, i) { return sum + i.amount; }, 0);
      var totalExp = expenses.reduce(function(sum, e) { return sum + e.amount; }, 0);

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Income', 'Expenses'],
          datasets: [{
            label: 'Amount',
            data: [totalInc, totalExp],
            backgroundColor: ['rgba(13, 148, 136, 0.7)', 'rgba(239, 68, 68, 0.7)'],
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

    } else if (currentChartType === 'line') {
      var totalInc = incomes.reduce(function(sum, i) { return sum + i.amount; }, 0);
      var totalExp = expenses.reduce(function(sum, e) { return sum + e.amount; }, 0);

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Income', 'Expenses'],
          datasets: [{
            label: 'Amount',
            data: [totalInc, totalExp],
            borderColor: ['#0d9488', '#ef4444'],
            backgroundColor: ['rgba(13, 148, 136, 0.1)', 'rgba(239, 68, 68, 0.1)'],
            fill: true,
            tension: 0.3,
            pointRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
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
    }
  }

  // ── Share URL ──
  function updateShareURL() {
    var shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.dataset.url = window.location.pathname;
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
    a.download = 'budget-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var inc = totalIncome ? totalIncome.textContent : '';
    var exp = totalExpenses ? totalExpenses.textContent : '';
    var net = netBalance ? netBalance.textContent : '';
    var rate = savingsRate ? savingsRate.textContent : '';
    var text = 'Budget Result:\nTotal Income: ' + inc + '\nTotal Expenses: ' + exp + '\nNet Balance: ' + net + '\nSavings Rate: ' + rate;
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
    link.download = 'budget-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';
    window.calculate();
  };

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    initCurrencyPicker();

    // ── NO default items — lists start empty ──

    window.calculate();
    window.addEventListener('resize', function() {
      if (chartInstance) chartInstance.resize();
    });
  });

})();

// ── Safety fallback ──
if (typeof window.calculate === 'undefined') {
  window.calculate = function() {
    console.warn('Budget Calculator not loaded yet.');
  };
}