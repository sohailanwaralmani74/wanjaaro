// ============================================================
// NET WORTH CALCULATOR — With Type Selector & Settings
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var assetList = document.getElementById('assetList');
  var liabilityList = document.getElementById('liabilityList');

  var totalAssets = document.getElementById('totalAssets');
  var totalLiabilities = document.getElementById('totalLiabilities');
  var netWorth = document.getElementById('netWorth');
  var statusIcon = document.getElementById('statusIcon');
  var statusText = document.getElementById('statusText');
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
  var defaultAssetsInput = document.getElementById('defaultAssets');
  var defaultLiabilitiesInput = document.getElementById('defaultLiabilities');
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
    defaultAssets: ['Savings Account', 'Home Value', 'Car Value', 'Investments', 'Retirement Fund'],
    defaultLiabilities: ['Mortgage', 'Car Loan', 'Credit Card', 'Student Loan', 'Personal Loan']
  };

  // ── Pending add operation ──
  var pendingAddTarget = null; // 'asset' or 'liability'

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
    defaultAssetsInput.value = settings.defaultAssets.join(', ');
    defaultLiabilitiesInput.value = settings.defaultLiabilities.join(', ');

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

    settings.defaultAssets = defaultAssetsInput.value.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    settings.defaultLiabilities = defaultLiabilitiesInput.value.split(',').map(function(s) { return s.trim(); }).filter(Boolean);

    try {
      localStorage.setItem('netWorthSettings', JSON.stringify(settings));
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
      var saved = localStorage.getItem('netWorthSettings');
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
    var types = target === 'asset' ? settings.defaultAssets : settings.defaultLiabilities;
    var title = target === 'asset' ? 'Select Asset Type' : 'Select Liability Type';
    var defaultAmount = target === 'asset' ? 10000 : 5000;

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
        addRowWithType(target, type, amount);
        closeTypeSelector();
      });
    });

    typeSelectorOverlay.classList.add('active');
    customTypeInput.focus();
  }

  function closeTypeSelector() {
    typeSelectorOverlay.classList.remove('active');
    pendingAddTarget = null;
  }

  function addRowWithType(target, type, amount) {
    if (target === 'asset') {
      addAsset(type, amount);
    } else {
      addLiability(type, amount);
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
    var defaultAmount = pendingAddTarget === 'asset' ? 10000 : 5000;
    addRowWithType(pendingAddTarget, customType, defaultAmount);
    closeTypeSelector();
  });

  customTypeInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      addCustomTypeBtn.click();
    }
  });

  // ── Asset Management ──
  function addAsset(name, amount) {
    var id = Date.now() + Math.random() * 1000;
    var defaultName = name || 'Asset';
    var defaultAmount = amount || 10000;
    var html = '<div class="debt-row asset-row" data-id="' + id + '">' +
      '<div class="debt-row-header">' +
      '<span class="debt-title">' + defaultName + '</span>' +
      '<button class="debt-remove" onclick="removeAsset(' + id + ')">✕</button>' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Value</label>' +
      '<div class="input-addons">' +
      '<span class="input-addon">' + selectedCurrency.symbol + '</span>' +
      '<input type="number" class="debt-amount" value="' + defaultAmount + '" min="0" step="100" />' +
      '</div>' +
      '</div>' +
      '</div>';
    assetList.insertAdjacentHTML('beforeend', html);

    var row = assetList.lastElementChild;
    row.querySelector('.debt-amount').addEventListener('input', function() {
      window.calculate();
    });
    window.calculate();
  }

  window.removeAsset = function(id) {
    var row = document.querySelector('.asset-row[data-id="' + id + '"]');
    if (row) {
      row.remove();
      window.calculate();
    }
  };

  // ── Liability Management ──
  function addLiability(name, amount) {
    var id = Date.now() + Math.random() * 1000;
    var defaultName = name || 'Liability';
    var defaultAmount = amount || 5000;
    var html = '<div class="debt-row liability-row" data-id="' + id + '">' +
      '<div class="debt-row-header">' +
      '<span class="debt-title">' + defaultName + '</span>' +
      '<button class="debt-remove" onclick="removeLiability(' + id + ')">✕</button>' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Balance</label>' +
      '<div class="input-addons">' +
      '<span class="input-addon">' + selectedCurrency.symbol + '</span>' +
      '<input type="number" class="debt-amount" value="' + defaultAmount + '" min="0" step="100" />' +
      '</div>' +
      '</div>' +
      '</div>';
    liabilityList.insertAdjacentHTML('beforeend', html);

    var row = liabilityList.lastElementChild;
    row.querySelector('.debt-amount').addEventListener('input', function() {
      window.calculate();
    });
    window.calculate();
  }

  window.removeLiability = function(id) {
    var row = document.querySelector('.liability-row[data-id="' + id + '"]');
    if (row) {
      row.remove();
      window.calculate();
    }
  };

  // ── Button Handlers for Add Asset / Liability ──
  document.getElementById('addAssetBtn').addEventListener('click', function() {
    openTypeSelector('asset');
  });

  document.getElementById('addLiabilityBtn').addEventListener('click', function() {
    openTypeSelector('liability');
  });

  // ── Get Data from DOM ──
  function getAssetData() {
    var data = [];
    var rows = document.querySelectorAll('.asset-row');
    rows.forEach(function(row) {
      var name = row.querySelector('.debt-title')?.textContent || 'Asset';
      var amount = parseFloat(row.querySelector('.debt-amount')?.value) || 0;
      if (amount > 0) {
        data.push({ name: name, amount: amount });
      }
    });
    return data;
  }

  function getLiabilityData() {
    var data = [];
    var rows = document.querySelectorAll('.liability-row');
    rows.forEach(function(row) {
      var name = row.querySelector('.debt-title')?.textContent || 'Liability';
      var amount = parseFloat(row.querySelector('.debt-amount')?.value) || 0;
      if (amount > 0) {
        data.push({ name: name, amount: amount });
      }
    });
    return data;
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var assets = getAssetData();
    var liabilities = getLiabilityData();

    var totalAssetValue = assets.reduce(function(sum, a) { return sum + a.amount; }, 0);
    var totalLiabilityValue = liabilities.reduce(function(sum, l) { return sum + l.amount; }, 0);
    var net = totalAssetValue - totalLiabilityValue;

    if (totalAssets) totalAssets.textContent = formatCurrency(totalAssetValue);
    if (totalLiabilities) totalLiabilities.textContent = formatCurrency(totalLiabilityValue);
    if (netWorth) {
      netWorth.textContent = formatCurrency(net);
      netWorth.style.color = net >= 0 ? 'var(--primary, #0d9488)' : '#dc2626';
    }

    // Status
    if (totalAssetValue === 0 && totalLiabilityValue === 0) {
      statusIcon.textContent = '📊';
      statusText.textContent = 'Enter your assets and liabilities to see your net worth';
    } else if (net > 0 && net > totalAssetValue * 0.5) {
      statusIcon.textContent = '🌟';
      statusText.textContent = 'Excellent! Your net worth is more than 50% of your total assets.';
    } else if (net > 0 && net > totalAssetValue * 0.25) {
      statusIcon.textContent = '✅';
      statusText.textContent = 'Good! Your net worth is positive and you\'re on the right track.';
    } else if (net > 0) {
      statusIcon.textContent = '📈';
      statusText.textContent = 'Your net worth is positive — keep building your assets and reducing liabilities.';
    } else if (net < 0 && net > -totalAssetValue * 0.5) {
      statusIcon.textContent = '⚠️';
      statusText.textContent = 'Your liabilities exceed your assets. Consider focusing on debt reduction.';
    } else {
      statusIcon.textContent = '🚨';
      statusText.textContent = 'Your liabilities are significantly higher than your assets. Prioritize debt management.';
    }

    generateInsights(totalAssetValue, totalLiabilityValue, net, assets, liabilities);
    generateBreakdown(assets, liabilities);
    updateChart(assets, liabilities);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(totalAssetValue, totalLiabilityValue, net, assets, liabilities) {
    if (!insightsGrid) return;
    var insights = [];

    if (totalAssetValue === 0 && totalLiabilityValue === 0) {
      insights.push({
        icon: '💡',
        text: 'Add your assets and liabilities to see your net worth analysis'
      });
    } else {
      var ratio = totalLiabilityValue > 0 ? totalAssetValue / totalLiabilityValue : Infinity;
      var equityRatio = totalAssetValue > 0 ? ((totalAssetValue - totalLiabilityValue) / totalAssetValue) * 100 : 0;

      if (ratio > 2) {
        insights.push({
          icon: '🏦',
          text: 'Your assets are <strong>' + ratio.toFixed(1) + '×</strong> your liabilities — strong financial position'
        });
      } else if (ratio > 1) {
        insights.push({
          icon: '📈',
          text: 'Your assets exceed liabilities by <strong>' + formatCurrency(net) + '</strong>'
        });
      } else {
        insights.push({
          icon: '📉',
          text: 'Your liabilities exceed assets by <strong>' + formatCurrency(Math.abs(net)) + '</strong>'
        });
      }

      if (net > 0) {
        insights.push({
          icon: '✅',
          text: 'Positive net worth of <strong>' + formatCurrency(net) + '</strong> — you\'re building wealth'
        });
      } else if (net < 0) {
        insights.push({
          icon: '⚠️',
          text: 'Negative net worth of <strong>' + formatCurrency(Math.abs(net)) + '</strong> — focus on debt reduction'
        });
      }

      if (equityRatio > 50) {
        insights.push({
          icon: '🌟',
          text: 'Equity ratio: <strong>' + formatPercent(equityRatio) + '</strong> — excellent financial health'
        });
      } else if (equityRatio > 0) {
        insights.push({
          icon: '📊',
          text: 'Equity ratio: <strong>' + formatPercent(equityRatio) + '</strong> — improving this will strengthen your finances'
        });
      }

      if (assets.length > 0) {
        var topAsset = assets.reduce(function(a, b) { return a.amount > b.amount ? a : b; });
        insights.push({
          icon: '🏠',
          text: 'Largest asset: <strong>' + topAsset.name + '</strong> (' + formatCurrency(topAsset.amount) + ')'
        });
      }

      if (liabilities.length > 0) {
        var topLiability = liabilities.reduce(function(a, b) { return a.amount > b.amount ? a : b; });
        insights.push({
          icon: '💳',
          text: 'Largest liability: <strong>' + topLiability.name + '</strong> (' + formatCurrency(topLiability.amount) + ')'
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
  function generateBreakdown(assets, liabilities) {
    if (!tableHead || !tableBody) return;

    tableHead.innerHTML = '<tr><th>Category</th><th>Name</th><th>Amount</th><th>% of Total</th></tr>';

    var rows = '';
    var totalAssetValue = assets.reduce(function(sum, a) { return sum + a.amount; }, 0);
    var totalLiabilityValue = liabilities.reduce(function(sum, l) { return sum + l.amount; }, 0);
    var total = totalAssetValue + totalLiabilityValue;

    assets.forEach(function(asset) {
      var pct = total > 0 ? (asset.amount / total) * 100 : 0;
      rows += '<tr>' +
        '<td style="color:var(--primary, #0d9488);"><strong>🏠 Asset</strong></td>' +
        '<td>' + asset.name + '</td>' +
        '<td style="color:var(--primary, #0d9488);">' + formatCurrency(asset.amount) + '</td>' +
        '<td>' + formatPercent(pct) + '</td>' +
      '</tr>';
    });

    liabilities.forEach(function(liability) {
      var pct = total > 0 ? (liability.amount / total) * 100 : 0;
      rows += '<tr>' +
        '<td style="color:#dc2626;"><strong>💳 Liability</strong></td>' +
        '<td>' + liability.name + '</td>' +
        '<td style="color:#dc2626;">' + formatCurrency(liability.amount) + '</td>' +
        '<td>' + formatPercent(pct) + '</td>' +
      '</tr>';
    });

    // Total row
    rows += '<tr class="highlight-row">' +
      '<td><strong>Net Worth</strong></td>' +
      '<td></td>' +
      '<td><strong>' + formatCurrency(totalAssetValue - totalLiabilityValue) + '</strong></td>' +
      '<td></td>' +
    '</tr>';

    tableBody.innerHTML = rows;
  }

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    var assets = getAssetData();
    var liabilities = getLiabilityData();
    updateChart(assets, liabilities);
  };

  function updateChart(assets, liabilities) {
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
      var assetLabels = assets.map(function(a) { return a.name; });
      var assetAmounts = assets.map(function(a) { return a.amount; });

      if (assetAmounts.length === 0) {
        assetLabels = ['No Assets'];
        assetAmounts = [1];
      }

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: assetLabels,
          datasets: [{
            data: assetAmounts,
            backgroundColor: [
              '#0d9488', '#6366f1', '#f59e0b', '#8b5cf6',
              '#ec4899', '#06b6d4', '#84cc16', '#f97316',
              '#14b8a6', '#3b82f6', '#a855f7'
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
      var totalAssetValue = assets.reduce(function(sum, a) { return sum + a.amount; }, 0);
      var totalLiabilityValue = liabilities.reduce(function(sum, l) { return sum + l.amount; }, 0);

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Assets', 'Liabilities'],
          datasets: [{
            label: 'Amount',
            data: [totalAssetValue, totalLiabilityValue],
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
      var totalAssetValue2 = assets.reduce(function(sum, a) { return sum + a.amount; }, 0);
      var totalLiabilityValue2 = liabilities.reduce(function(sum, l) { return sum + l.amount; }, 0);
      var netWorth2 = totalAssetValue2 - totalLiabilityValue2;

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Assets', 'Liabilities', 'Net Worth'],
          datasets: [{
            label: 'Amount',
            data: [totalAssetValue2, totalLiabilityValue2, netWorth2],
            borderColor: ['#0d9488', '#dc2626', '#6366f1'],
            backgroundColor: ['rgba(13, 148, 136, 0.1)', 'rgba(239, 68, 68, 0.1)', 'rgba(99, 102, 241, 0.1)'],
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
    a.download = 'net-worth-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var assets = totalAssets ? totalAssets.textContent : '';
    var liabilities = totalLiabilities ? totalLiabilities.textContent : '';
    var net = netWorth ? netWorth.textContent : '';
    var text = 'Net Worth Result:\nTotal Assets: ' + assets + '\nTotal Liabilities: ' + liabilities + '\nNet Worth: ' + net;
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
    link.download = 'net-worth-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    assetList.innerHTML = '';
    liabilityList.innerHTML = '';
    window.calculate();
  };

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    initCurrencyPicker();

    // ── Empty by default — no assets or liabilities ──

    window.calculate();
    window.addEventListener('resize', function() {
      if (chartInstance) chartInstance.resize();
    });
  });

})();

// ── Safety fallback ──
if (typeof window.calculate === 'undefined') {
  window.calculate = function() {
    console.warn('Net Worth Calculator not loaded yet.');
  };
}