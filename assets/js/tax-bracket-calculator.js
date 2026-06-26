// ============================================================
// TAX BRACKET CALCULATOR — Fully Configurable (Fixed)
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var taxableIncome = document.getElementById('taxableIncome');
  var taxableIncomeSlider = document.getElementById('taxableIncomeSlider');
  var filingStatus = document.getElementById('filingStatus');
  var bracketList = document.getElementById('bracketList');

  var marginalRate = document.getElementById('marginalRate');
  var effectiveRate = document.getElementById('effectiveRate');
  var totalTax = document.getElementById('totalTax');
  var taxableIncomeDisplay = document.getElementById('taxableIncomeDisplay');
  var bracketBody = document.getElementById('bracketBody');
  var insightsGrid = document.getElementById('insightsGrid');
  var toolChart = document.getElementById('toolChart');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'bar';

  // ── Default brackets (example: US 2024) ──
  var defaultBrackets = [
    { from: 0, to: 11600, rate: 10 },
    { from: 11601, to: 47150, rate: 12 },
    { from: 47151, to: 100525, rate: 22 },
    { from: 100526, to: 191950, rate: 24 },
    { from: 191951, to: 243725, rate: 32 },
    { from: 243726, to: 609350, rate: 35 },
    { from: 609351, to: Infinity, rate: 37 }
  ];

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
      case 'taxableIncome':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Bracket Management ──
  window.addBracket = function(from, to, rate) {
    var id = Date.now() + Math.random() * 1000;
    var defaultFrom = from !== undefined ? from : 0;
    var defaultTo = to !== undefined ? to : 50000;
    var defaultRate = rate !== undefined ? rate : 10;

    var toDisplay = defaultTo === Infinity ? '' : defaultTo;

    var html = '<div class="debt-row bracket-row" data-id="' + id + '">' +
      '<div class="debt-row-header">' +
      '<span class="debt-title">Bracket</span>' +
      '<button class="debt-remove" onclick="removeBracket(' + id + ')">✕</button>' +
      '</div>' +
      '<div class="form-group">' +
      '<label>From (' + selectedCurrency.symbol + ')</label>' +
      '<div class="input-addons">' +
      '<span class="input-addon">' + selectedCurrency.symbol + '</span>' +
      '<input type="number" class="bracket-from" value="' + defaultFrom + '" min="0" step="100" />' +
      '</div>' +
      '</div>' +
      '<div class="form-group">' +
      '<label>To (' + selectedCurrency.symbol + ') <span class="optional-badge">Leave blank for ∞</span></label>' +
      '<div class="input-addons">' +
      '<span class="input-addon">' + selectedCurrency.symbol + '</span>' +
      '<input type="number" class="bracket-to" value="' + toDisplay + '" min="0" step="100" placeholder="∞" />' +
      '</div>' +
      '</div>' +
      '<div class="form-group">' +
      '<label>Rate (%)</label>' +
      '<div class="input-addons">' +
      '<input type="number" class="bracket-rate" value="' + defaultRate + '" min="0" max="100" step="0.5" />' +
      '<span class="input-addon input-addon--right">%</span>' +
      '</div>' +
      '</div>' +
      '</div>';
    bracketList.insertAdjacentHTML('beforeend', html);

    var row = bracketList.lastElementChild;
    row.querySelectorAll('.bracket-from, .bracket-to, .bracket-rate').forEach(function(input) {
      input.addEventListener('input', function() {
        window.calculate();
      });
    });
    window.calculate();
  };

  window.removeBracket = function(id) {
    var row = document.querySelector('.bracket-row[data-id="' + id + '"]');
    if (row) {
      row.remove();
      window.calculate();
    }
  };

  // ── Get Bracket Data from DOM ──
  function getBrackets() {
    var brackets = [];
    var rows = document.querySelectorAll('.bracket-row');
    rows.forEach(function(row) {
      var from = parseFloat(row.querySelector('.bracket-from')?.value) || 0;
      var toInput = row.querySelector('.bracket-to')?.value;
      var to = toInput === '' ? Infinity : (parseFloat(toInput) || 0);
      var rate = parseFloat(row.querySelector('.bracket-rate')?.value) || 0;

      if (rate > 0) {
        brackets.push({
          from: from,
          to: to === 0 ? Infinity : to,
          rate: rate
        });
      }
    });

    brackets.sort(function(a, b) { return a.from - b.from; });
    return brackets;
  }

  // ── Core Calculation ──
  function calculateTax(income, brackets) {
    if (brackets.length === 0) {
      return {
        totalTax: 0,
        effectiveRate: 0,
        marginalRate: 0,
        bracketDetails: []
      };
    }

    var remaining = income;
    var totalTaxOwed = 0;
    var bracketDetails = [];

    for (var i = 0; i < brackets.length; i++) {
      var bracket = brackets[i];
      var lower = bracket.from;
      var upper = bracket.to;
      var rate = bracket.rate;

      if (remaining <= 0) {
        bracketDetails.push({
          rate: rate,
          amount: 0,
          tax: 0,
          lower: lower,
          upper: upper
        });
        continue;
      }

      var taxableInBracket = Math.min(remaining, upper - lower);
      if (taxableInBracket < 0) taxableInBracket = 0;

      var tax = taxableInBracket * (rate / 100);
      totalTaxOwed += tax;
      remaining -= taxableInBracket;

      bracketDetails.push({
        rate: rate,
        amount: taxableInBracket,
        tax: tax,
        lower: lower,
        upper: upper
      });

      if (remaining <= 0) break;
    }

    var marginal = 0;
    for (var j = brackets.length - 1; j >= 0; j--) {
      if (bracketDetails[j] && bracketDetails[j].amount > 0) {
        marginal = brackets[j].rate;
        break;
      }
    }

    var effectiveRate = income > 0 ? (totalTaxOwed / income) * 100 : 0;

    return {
      totalTax: totalTaxOwed,
      effectiveRate: effectiveRate,
      marginalRate: marginal,
      bracketDetails: bracketDetails
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var income = parseFloat(taxableIncome ? taxableIncome.value : 0) || 0;
    var brackets = getBrackets();

    if (income <= 0 || brackets.length === 0) {
      if (marginalRate) marginalRate.textContent = '—';
      if (effectiveRate) effectiveRate.textContent = '—';
      if (totalTax) totalTax.textContent = '—';
      if (taxableIncomeDisplay) taxableIncomeDisplay.textContent = '—';
      if (bracketBody) bracketBody.innerHTML = '';
      if (insightsGrid) insightsGrid.innerHTML = '';
      return;
    }

    var result = calculateTax(income, brackets);

    if (marginalRate) marginalRate.textContent = result.marginalRate + '%';
    if (effectiveRate) effectiveRate.textContent = formatPercent(result.effectiveRate);
    if (totalTax) totalTax.textContent = formatCurrency(result.totalTax);
    if (taxableIncomeDisplay) taxableIncomeDisplay.textContent = formatCurrency(income);

    generateBracketTable(result.bracketDetails);
    generateInsights(result, income, brackets);
    updateChart(result.bracketDetails);
    updateShareURL();
  };

  // ── Generate Bracket Table ──
  function generateBracketTable(bracketDetails) {
    if (!bracketBody) return;

    var rows = '';
    var totalTax = 0;
    var totalAmount = 0;

    bracketDetails.forEach(function(bracket) {
      if (bracket.amount > 0 || bracket.tax > 0) {
        totalTax += bracket.tax;
        totalAmount += bracket.amount;
        var range = formatCurrency(bracket.lower) + ' – ' + (bracket.upper === Infinity ? '∞' : formatCurrency(bracket.upper));
        rows += '<tr>' +
          '<td><strong>' + range + '</strong></td>' +
          '<td>' + formatCurrency(bracket.amount) + '</td>' +
          '<td>' + bracket.rate + '%</td>' +
          '<td>' + formatCurrency(bracket.tax) + '</td>' +
        '</tr>';
      }
    });

    rows += '<tr class="highlight-row">' +
      '<td><strong>Total</strong></td>' +
      '<td>' + formatCurrency(totalAmount) + '</td>' +
      '<td>—</td>' +
      '<td><strong>' + formatCurrency(totalTax) + '</strong></td>' +
    '</tr>';

    bracketBody.innerHTML = rows;
  }

  // ── Generate Insights ──
  function generateInsights(result, income, brackets) {
    if (!insightsGrid) return;
    var insights = [];

    if (result.marginalRate > 0) {
      insights.push({
        icon: '📈',
        text: 'Marginal tax rate: <strong>' + result.marginalRate + '%</strong>'
      });
    }

    insights.push({
      icon: '📊',
      text: 'Effective tax rate: <strong>' + formatPercent(result.effectiveRate) + '</strong>'
    });

    insights.push({
      icon: '💰',
      text: 'Total tax liability: <strong>' + formatCurrency(result.totalTax) + '</strong>'
    });

    if (brackets.length > 0) {
      var highestBracket = brackets[brackets.length - 1];
      insights.push({
        icon: '📋',
        text: 'Highest bracket: <strong>' + highestBracket.rate + '%</strong> above ' + formatCurrency(highestBracket.from)
      });
    }

    if (result.marginalRate >= 30) {
      insights.push({
        icon: '💡',
        text: 'You\'re in a high tax bracket. Consider tax‑efficient investments.'
      });
    } else if (result.marginalRate <= 12) {
      insights.push({
        icon: '✅',
        text: 'You\'re in a low tax bracket. Consider maximizing Roth contributions.'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter your income and tax brackets to see the breakdown'
      });
    }

    insightsGrid.innerHTML = insights.slice(0, 6).map(function(insight) {
      return '<div class="insight-item">' +
               '<span class="insight-icon">' + insight.icon + '</span>' +
               '<span class="insight-text">' + insight.text + '</span>' +
             '</div>';
    }).join('');
  }

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    var income = parseFloat(taxableIncome ? taxableIncome.value : 0) || 0;
    var brackets = getBrackets();

    if (income > 0 && brackets.length > 0) {
      var result = calculateTax(income, brackets);
      updateChart(result.bracketDetails);
    }
  };

  function updateChart(bracketDetails) {
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

    if (currentChartType === 'bar') {
      var labels = [];
      var amounts = [];
      var taxAmounts = [];

      bracketDetails.forEach(function(bracket) {
        if (bracket.amount > 0 || bracket.tax > 0) {
          var range = formatCurrency(bracket.lower) + ' – ' + (bracket.upper === Infinity ? '∞' : formatCurrency(bracket.upper));
          labels.push(range);
          amounts.push(bracket.amount);
          taxAmounts.push(bracket.tax);
        }
      });

      if (labels.length === 0) {
        labels = ['No Taxable Income'];
        amounts = [0];
        taxAmounts = [0];
      }

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Taxable Amount',
              data: amounts,
              backgroundColor: 'rgba(99, 102, 241, 0.7)',
              borderRadius: 4
            },
            {
              label: 'Tax Owed',
              data: taxAmounts,
              backgroundColor: 'rgba(13, 148, 136, 0.7)',
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

    } else if (currentChartType === 'donut') {
      var labels2 = [];
      var amounts2 = [];
      var colors = ['#0d9488', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

      bracketDetails.forEach(function(bracket, index) {
        if (bracket.tax > 0) {
          var range2 = formatCurrency(bracket.lower) + ' – ' + (bracket.upper === Infinity ? '∞' : formatCurrency(bracket.upper));
          labels2.push(range2);
          amounts2.push(bracket.tax);
        }
      });

      if (amounts2.length === 0) {
        labels2 = ['No Tax'];
        amounts2 = [1];
      }

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels2,
          datasets: [{
            data: amounts2,
            backgroundColor: colors.slice(0, amounts2.length),
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
    if (taxableIncome) params.set('i', taxableIncome.value);
    if (filingStatus) params.set('s', filingStatus.value);

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
    var table = document.getElementById('bracketTable');
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
    a.download = 'tax-brackets.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var marginal = marginalRate ? marginalRate.textContent : '';
    var effective = effectiveRate ? effectiveRate.textContent : '';
    var tax = totalTax ? totalTax.textContent : '';
    var text = 'Tax Bracket Result:\nMarginal Rate: ' + marginal + '\nEffective Rate: ' + effective + '\nTotal Tax: ' + tax;
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
    link.download = 'tax-bracket-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    bracketList.innerHTML = '';

    defaultBrackets.forEach(function(bracket) {
      addBracket(bracket.from, bracket.to, bracket.rate);
    });

    var defaultIncome = 75000;
    var defaultStatus = 'Married Filing Jointly';

    if (taxableIncome) { taxableIncome.value = defaultIncome; if (taxableIncomeSlider) taxableIncomeSlider.value = defaultIncome; }
    if (filingStatus) filingStatus.value = defaultStatus;

    updateSliderLabel('taxableIncome', defaultIncome);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('i')) {
      var iVal = parseFloat(params.get('i'));
      if (!isNaN(iVal) && iVal >= 0) {
        if (taxableIncome) { taxableIncome.value = iVal; if (taxableIncomeSlider) taxableIncomeSlider.value = iVal; }
        updateSliderLabel('taxableIncome', iVal);
      }
    }
    if (params.has('s')) {
      var sVal = params.get('s');
      if (sVal && filingStatus) filingStatus.value = sVal;
    }
    window.calculate();
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function() {
    initCurrencyPicker();
    resetForm();
    window.addEventListener('resize', function() {
      if (chartInstance) chartInstance.resize();
    });
  });

})();

// ── Safety fallback ──
if (typeof window.calculate === 'undefined') {
  window.calculate = function() {
    console.warn('Tax Bracket Calculator not loaded yet.');
  };
}