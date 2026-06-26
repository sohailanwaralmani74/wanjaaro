// ============================================================
// EMERGENCY FUND CALCULATOR — Uses Same CSS as Budget Calculator
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var expenseList = document.getElementById('expenseList');
  var coverageMonths = document.getElementById('coverageMonths');
  var coverageMonthsSlider = document.getElementById('coverageMonthsSlider');
  var currentSavings = document.getElementById('currentSavings');

  var emergencyFund = document.getElementById('emergencyFund');
  var monthlyExpenses = document.getElementById('monthlyExpenses');
  var coverageDisplay = document.getElementById('coverageDisplay');
  var currentSavingsDisplay = document.getElementById('currentSavingsDisplay');
  var gapBox = document.getElementById('gapBox');
  var gapIcon = document.getElementById('gapIcon');
  var gapText = document.getElementById('gapText');
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
  var defaultExpensesInput = document.getElementById('defaultExpenses');
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

  // ── Buttons ──
  var addExpenseBtn = document.getElementById('addExpenseBtn');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'donut';

  // ── Settings State ──
  var settings = {
    numberFormat: 'us',
    theme: 'light',
    defaultExpenses: ['Rent/Mortgage', 'Utilities', 'Groceries', 'Insurance', 'Transport', 'Minimum Debt Payments', 'Healthcare']
  };

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
    defaultExpensesInput.value = settings.defaultExpenses.join(', ');

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

    settings.defaultExpenses = defaultExpensesInput.value.split(',').map(function(s) { return s.trim(); }).filter(Boolean);

    try {
      localStorage.setItem('emergencyFundSettings', JSON.stringify(settings));
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
      var saved = localStorage.getItem('emergencyFundSettings');
      if (saved) {
        var parsed = JSON.parse(saved);
        settings = Object.assign(settings, parsed);
        applyTheme(settings.theme);
      }
    } catch (e) {}
  }

  // ── Event Listeners for Settings ──
  if (settingsToggle) settingsToggle.addEventListener('click', openSettings);
  if (settingsClose) settingsClose.addEventListener('click', closeSettings);
  if (settingsCancel) settingsCancel.addEventListener('click', closeSettings);
  if (settingsSave) settingsSave.addEventListener('click', saveSettings);

  if (settingsOverlay) {
    settingsOverlay.addEventListener('click', function(e) {
      if (e.target === this) closeSettings();
    });
  }

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
  function openTypeSelector() {
    var types = settings.defaultExpenses;
    var title = 'Select Expense Type';
    var defaultAmount = 500;

    typeSelectorTitle.textContent = title;
    customTypeInput.value = '';

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

    typeList.querySelectorAll('.type-option').forEach(function(option) {
      option.addEventListener('click', function() {
        var type = this.dataset.type;
        var amount = parseFloat(this.dataset.default) || defaultAmount;
        addExpense(type, amount);
        closeTypeSelector();
      });
    });

    typeSelectorOverlay.classList.add('active');
    customTypeInput.focus();
  }

  function closeTypeSelector() {
    typeSelectorOverlay.classList.remove('active');
  }

  // ── Event Listeners for Type Selector ──
  if (typeSelectorClose) typeSelectorClose.addEventListener('click', closeTypeSelector);
  if (typeSelectorCancel) typeSelectorCancel.addEventListener('click', closeTypeSelector);
  if (typeSelectorOverlay) {
    typeSelectorOverlay.addEventListener('click', function(e) {
      if (e.target === this) closeTypeSelector();
    });
  }

  if (addCustomTypeBtn) {
    addCustomTypeBtn.addEventListener('click', function() {
      var customType = customTypeInput.value.trim();
      if (!customType) return;
      addExpense(customType, 500);
      closeTypeSelector();
    });
  }

  if (customTypeInput) {
    customTypeInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        if (addCustomTypeBtn) addCustomTypeBtn.click();
      }
    });
  }

  // ── Expense Management ──
  function addExpense(name, amount) {
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
  }

  window.removeExpense = function(id) {
    var row = document.querySelector('.expense-row[data-id="' + id + '"]');
    if (row) {
      row.remove();
      window.calculate();
    }
  };

  // ── Button Handler for Add Expense ──
  if (addExpenseBtn) {
    addExpenseBtn.addEventListener('click', function() {
      openTypeSelector();
    });
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
      case 'coverageMonths':
        label.textContent = num + ' mo' + (num > 1 ? 's' : '');
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Get Data from DOM ──
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
    var expenses = getExpenseData();
    var months = parseFloat(coverageMonths ? coverageMonths.value : 0) || 0;
    var current = parseFloat(currentSavings ? currentSavings.value : 0) || 0;

    var totalMonthly = expenses.reduce(function(sum, e) { return sum + e.amount; }, 0);
    var fundNeeded = totalMonthly * months;

    if (emergencyFund) emergencyFund.textContent = formatCurrency(fundNeeded);
    if (monthlyExpenses) monthlyExpenses.textContent = formatCurrency(totalMonthly);
    if (coverageDisplay) coverageDisplay.textContent = months + ' months';
    if (currentSavingsDisplay) currentSavingsDisplay.textContent = formatCurrency(current);

    // Gap / Surplus
    if (gapBox) {
      if (current > 0) {
        gapBox.style.display = 'flex';
        var gap = fundNeeded - current;
        if (gap > 0) {
          gapIcon.textContent = '⚠️';
          gapText.textContent = 'You need ' + formatCurrency(gap) + ' more to reach your emergency fund goal.';
          gapText.style.color = '#dc2626';
        } else if (gap < 0) {
          gapIcon.textContent = '🎉';
          gapText.textContent = 'You\'ve exceeded your goal by ' + formatCurrency(Math.abs(gap)) + '! Great work!';
          gapText.style.color = 'var(--primary, #0d9488)';
        } else {
          gapIcon.textContent = '✅';
          gapText.textContent = 'You\'ve exactly reached your emergency fund goal!';
          gapText.style.color = 'var(--primary, #0d9488)';
        }
      } else {
        gapBox.style.display = 'none';
      }
    }

    generateInsights(totalMonthly, fundNeeded, months, current);
    generateBreakdown(expenses);
    updateChart(expenses, fundNeeded, current);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(totalMonthly, fundNeeded, months, current) {
    if (!insightsGrid) return;
    var insights = [];

    if (totalMonthly === 0) {
      insights.push({
        icon: '💡',
        text: 'Add your monthly expenses to calculate your emergency fund'
      });
    } else {
      var monthsSaved = current > 0 ? (current / totalMonthly) : 0;

      insights.push({
        icon: '📊',
        text: 'Your monthly essential expenses: <strong>' + formatCurrency(totalMonthly) + '</strong>'
      });

      if (months === 0) {
        insights.push({
          icon: '⚠️',
          text: 'Select how many months of expenses you want to cover'
        });
      } else {
        insights.push({
          icon: '🏦',
          text: 'Emergency fund needed for ' + months + ' months: <strong>' + formatCurrency(fundNeeded) + '</strong>'
        });
      }

      if (current > 0) {
        insights.push({
          icon: '💰',
          text: 'Current savings: <strong>' + formatCurrency(current) + '</strong> (' + monthsSaved.toFixed(1) + ' months covered)'
        });

        if (monthsSaved >= months) {
          insights.push({
            icon: '✅',
            text: 'You have <strong>enough</strong> saved for your emergency fund!'
          });
        } else {
          var shortfall = months - monthsSaved;
          insights.push({
            icon: '📈',
            text: 'You need <strong>' + shortfall.toFixed(1) + ' more months</strong> of expenses to reach your goal'
          });
        }
      } else {
        insights.push({
          icon: '💡',
          text: 'Start building your emergency fund by saving <strong>' + formatCurrency(totalMonthly) + '</strong> for month 1'
        });
      }

      var recommendedMonths = months < 3 ? 3 : (months > 6 ? 6 : months);
      if (months < 3) {
        insights.push({
          icon: '📖',
          text: 'Financial experts recommend <strong>3-6 months</strong> of expenses for a solid emergency fund'
        });
      }
    }

    insightsGrid.innerHTML = insights.slice(0, 6).map(function(insight) {
      return '<div class="insight-item">' +
               '<span class="insight-icon">' + insight.icon + '</span>' +
               '<span class="insight-text">' + insight.text + '</span>' +
             '</div>';
    }).join('');
  }

  // ── Generate Breakdown Table ──
  function generateBreakdown(expenses) {
    if (!tableHead || !tableBody) return;

    if (expenses.length === 0) {
      tableHead.innerHTML = '';
      tableBody.innerHTML = '';
      return;
    }

    tableHead.innerHTML = '<tr><th>Category</th><th>Monthly Amount</th><th>% of Total</th></tr>';

    var total = expenses.reduce(function(sum, e) { return sum + e.amount; }, 0);
    var rows = '';

    expenses.forEach(function(exp) {
      var pct = total > 0 ? (exp.amount / total) * 100 : 0;
      rows += '<tr>' +
        '<td><strong>' + exp.name + '</strong></td>' +
        '<td>' + formatCurrency(exp.amount) + '</td>' +
        '<td>' + formatPercent(pct) + '</td>' +
      '</tr>';
    });

    // Total row
    rows += '<tr class="highlight-row">' +
      '<td><strong>Total Monthly Expenses</strong></td>' +
      '<td><strong>' + formatCurrency(total) + '</strong></td>' +
      '<td>100%</td>' +
    '</tr>';

    tableBody.innerHTML = rows;
  }

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    var expenses = getExpenseData();
    var months = parseFloat(coverageMonths ? coverageMonths.value : 0) || 0;
    var total = expenses.reduce(function(sum, e) { return sum + e.amount; }, 0);
    var fundNeeded = total * months;
    var current = parseFloat(currentSavings ? currentSavings.value : 0) || 0;

    updateChart(expenses, fundNeeded, current);
  };

  function updateChart(expenses, fundNeeded, current) {
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
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Emergency Fund Needed', 'Current Savings'],
          datasets: [{
            label: 'Amount',
            data: [fundNeeded, current],
            backgroundColor: ['rgba(13, 148, 136, 0.7)', 'rgba(99, 102, 241, 0.7)'],
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
    }
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (coverageMonths) params.set('c', coverageMonths.value);
    if (currentSavings) params.set('s', currentSavings.value);

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
    a.download = 'emergency-fund-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var fund = emergencyFund ? emergencyFund.textContent : '';
    var monthly = monthlyExpenses ? monthlyExpenses.textContent : '';
    var coverage = coverageDisplay ? coverageDisplay.textContent : '';
    var current = currentSavingsDisplay ? currentSavingsDisplay.textContent : '';
    var text = 'Emergency Fund Result:\nMonthly Expenses: ' + monthly + '\nCoverage: ' + coverage + '\nEmergency Fund Needed: ' + fund + '\nCurrent Savings: ' + current;
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
    link.download = 'emergency-fund-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    expenseList.innerHTML = '';

    if (coverageMonths) { coverageMonths.value = 6; if (coverageMonthsSlider) coverageMonthsSlider.value = 6; }
    if (currentSavings) currentSavings.value = 0;

    updateSliderLabel('coverageMonths', 6);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('c')) {
      var cVal = parseFloat(params.get('c'));
      if (!isNaN(cVal) && cVal > 0) {
        if (coverageMonths) { coverageMonths.value = cVal; if (coverageMonthsSlider) coverageMonthsSlider.value = cVal; }
        updateSliderLabel('coverageMonths', cVal);
      }
    }
    if (params.has('s')) {
      var sVal = parseFloat(params.get('s'));
      if (!isNaN(sVal) && sVal >= 0) {
        if (currentSavings) currentSavings.value = sVal;
      }
    }
    window.calculate();
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    initCurrencyPicker();

    // ── NO default expenses — list starts empty ──

    window.calculate();
    window.addEventListener('resize', function() {
      if (chartInstance) chartInstance.resize();
    });
  });

})();

// ── Safety fallback ──
if (typeof window.calculate === 'undefined') {
  window.calculate = function() {
    console.warn('Emergency Fund Calculator not loaded yet.');
  };
}