// ============================================================
// 50/30/20 CALCULATOR
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var income = document.getElementById('income');
  var incomeSlider = document.getElementById('incomeSlider');
  var needsPercent = document.getElementById('needsPercent');
  var wantsPercent = document.getElementById('wantsPercent');
  var savingsPercent = document.getElementById('savingsPercent');

  var needsAmount = document.getElementById('needsAmount');
  var wantsAmount = document.getElementById('wantsAmount');
  var savingsAmount = document.getElementById('savingsAmount');
  var needsPercentDisplay = document.getElementById('needsPercentDisplay');
  var wantsPercentDisplay = document.getElementById('wantsPercentDisplay');
  var savingsPercentDisplay = document.getElementById('savingsPercentDisplay');
  var totalIncomeDisplay = document.getElementById('totalIncomeDisplay');
  var totalAllocatedDisplay = document.getElementById('totalAllocatedDisplay');
  var insightsGrid = document.getElementById('insightsGrid');
  var toolChart = document.getElementById('toolChart');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'donut';

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
    return num.toFixed(0) + '%';
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
      case 'income':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Percent Sync ──
  window.syncPercent = function(changed) {
    var n = parseFloat(needsPercent.value) || 0;
    var w = parseFloat(wantsPercent.value) || 0;
    var s = parseFloat(savingsPercent.value) || 0;

    // Auto-adjust: if sum != 100, adjust the changed field
    var sum = n + w + s;
    if (sum === 0 || sum === 100) {
      window.calculate();
      return;
    }

    var diff = 100 - sum;
    if (changed === 'needs') {
      n = Math.max(0, n + diff);
    } else if (changed === 'wants') {
      w = Math.max(0, w + diff);
    } else if (changed === 'savings') {
      s = Math.max(0, s + diff);
    }

    // Ensure sum is 100
    var newSum = n + w + s;
    if (newSum !== 100 && newSum > 0) {
      // Adjust proportionally
      var factor = 100 / newSum;
      n = Math.round(n * factor);
      w = Math.round(w * factor);
      s = 100 - n - w;
      if (s < 0) { s = 0; n = 100 - w; }
    }

    needsPercent.value = n;
    wantsPercent.value = w;
    savingsPercent.value = s;

    window.calculate();
  };

  // ── Main Calculate ──
  window.calculate = function() {
    var total = parseFloat(income ? income.value : 0) || 0;
    var nPct = parseFloat(needsPercent ? needsPercent.value : 0) || 0;
    var wPct = parseFloat(wantsPercent ? wantsPercent.value : 0) || 0;
    var sPct = parseFloat(savingsPercent ? savingsPercent.value : 0) || 0;

    // Ensure percentages sum to 100
    var sum = nPct + wPct + sPct;
    if (sum !== 100 && sum > 0) {
      var factor = 100 / sum;
      nPct = Math.round(nPct * factor);
      wPct = Math.round(wPct * factor);
      sPct = 100 - nPct - wPct;
      if (sPct < 0) { sPct = 0; nPct = 100 - wPct; }
      needsPercent.value = nPct;
      wantsPercent.value = wPct;
      savingsPercent.value = sPct;
    }

    var needs = total * (nPct / 100);
    var wants = total * (wPct / 100);
    var savings = total * (sPct / 100);

    if (needsAmount) needsAmount.textContent = formatCurrency(needs);
    if (wantsAmount) wantsAmount.textContent = formatCurrency(wants);
    if (savingsAmount) savingsAmount.textContent = formatCurrency(savings);

    if (needsPercentDisplay) needsPercentDisplay.textContent = formatPercent(nPct) + ' of income';
    if (wantsPercentDisplay) wantsPercentDisplay.textContent = formatPercent(wPct) + ' of income';
    if (savingsPercentDisplay) savingsPercentDisplay.textContent = formatPercent(sPct) + ' of income';

    if (totalIncomeDisplay) totalIncomeDisplay.textContent = formatCurrency(total);
    if (totalAllocatedDisplay) totalAllocatedDisplay.textContent = formatCurrency(needs + wants + savings);

    generateInsights(total, needs, wants, savings, nPct, wPct, sPct);
    updateChart(needs, wants, savings);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(total, needs, wants, savings, nPct, wPct, sPct) {
    if (!insightsGrid) return;
    var insights = [];

    if (total <= 0) {
      insights.push({
        icon: '💡',
        text: 'Enter your after-tax income to see the 50/30/20 breakdown'
      });
    } else {
      insights.push({
        icon: '📊',
        text: 'You should spend <strong>' + formatCurrency(needs) + '</strong> on Needs (' + formatPercent(nPct) + ')'
      });
      insights.push({
        icon: '🎉',
        text: 'You should spend <strong>' + formatCurrency(wants) + '</strong> on Wants (' + formatPercent(wPct) + ')'
      });
      insights.push({
        icon: '💰',
        text: 'You should save <strong>' + formatCurrency(savings) + '</strong> (' + formatPercent(sPct) + ')'
      });

      if (sPct >= 20) {
        insights.push({
          icon: '✅',
          text: 'Great! Your savings rate is ' + formatPercent(sPct) + ' — at or above the recommended 20%'
        });
      } else {
        insights.push({
          icon: '⚠️',
          text: 'Your savings rate is ' + formatPercent(sPct) + ' — below the recommended 20%. Consider adjusting your budget.'
        });
      }

      if (nPct > 50) {
        insights.push({
          icon: '📈',
          text: 'Your Needs are ' + formatPercent(nPct) + ' — above the recommended 50%. Look for ways to reduce essential expenses.'
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

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    var total = parseFloat(income ? income.value : 0) || 0;
    var nPct = parseFloat(needsPercent ? needsPercent.value : 0) || 0;
    var wPct = parseFloat(wantsPercent ? wantsPercent.value : 0) || 0;
    var sPct = parseFloat(savingsPercent ? savingsPercent.value : 0) || 0;

    var needs = total * (nPct / 100);
    var wants = total * (wPct / 100);
    var savings = total * (sPct / 100);

    updateChart(needs, wants, savings);
  };

  function updateChart(needs, wants, savings) {
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
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Needs (50%)', 'Wants (30%)', 'Savings (20%)'],
          datasets: [{
            data: [needs, wants, savings],
            backgroundColor: ['#6366f1', '#f59e0b', '#0d9488'],
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
          labels: ['Needs', 'Wants', 'Savings'],
          datasets: [{
            label: 'Amount',
            data: [needs, wants, savings],
            backgroundColor: ['#6366f1', '#f59e0b', '#0d9488'],
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
    if (income) params.set('i', income.value);
    if (needsPercent) params.set('n', needsPercent.value);
    if (wantsPercent) params.set('w', wantsPercent.value);
    if (savingsPercent) params.set('s', savingsPercent.value);

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
    var total = parseFloat(income ? income.value : 0) || 0;
    var nPct = parseFloat(needsPercent ? needsPercent.value : 0) || 0;
    var wPct = parseFloat(wantsPercent ? wantsPercent.value : 0) || 0;
    var sPct = parseFloat(savingsPercent ? savingsPercent.value : 0) || 0;

    var needs = total * (nPct / 100);
    var wants = total * (wPct / 100);
    var savings = total * (sPct / 100);

    var csv = 'Category,Percentage,Amount\n';
    csv += 'Needs,' + nPct + '%,' + needs + '\n';
    csv += 'Wants,' + wPct + '%,' + wants + '\n';
    csv += 'Savings,' + sPct + '%,' + savings + '\n';
    csv += 'Total Income,100%,' + total + '\n';

    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = '50-30-20-budget.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var total = parseFloat(income ? income.value : 0) || 0;
    var nPct = parseFloat(needsPercent ? needsPercent.value : 0) || 0;
    var wPct = parseFloat(wantsPercent ? wantsPercent.value : 0) || 0;
    var sPct = parseFloat(savingsPercent ? savingsPercent.value : 0) || 0;

    var needs = total * (nPct / 100);
    var wants = total * (wPct / 100);
    var savings = total * (sPct / 100);

    var text = '50/30/20 Budget Result:\n\n' +
      'Total Income: ' + formatCurrency(total) + '\n\n' +
      'Needs (' + nPct + '%): ' + formatCurrency(needs) + '\n' +
      'Wants (' + wPct + '%): ' + formatCurrency(wants) + '\n' +
      'Savings (' + sPct + '%): ' + formatCurrency(savings);

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
    link.download = '50-30-20-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultIncome = 5000;
    var defaultNeeds = 50;
    var defaultWants = 30;
    var defaultSavings = 20;

    if (income) { income.value = defaultIncome; if (incomeSlider) incomeSlider.value = defaultIncome; }
    if (needsPercent) needsPercent.value = defaultNeeds;
    if (wantsPercent) wantsPercent.value = defaultWants;
    if (savingsPercent) savingsPercent.value = defaultSavings;

    updateSliderLabel('income', defaultIncome);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('i')) {
      var iVal = parseFloat(params.get('i'));
      if (!isNaN(iVal) && iVal >= 0) {
        if (income) { income.value = iVal; if (incomeSlider) incomeSlider.value = iVal; }
        updateSliderLabel('income', iVal);
      }
    }
    if (params.has('n')) {
      var nVal = parseFloat(params.get('n'));
      if (!isNaN(nVal) && nVal >= 0 && nVal <= 100 && needsPercent) needsPercent.value = nVal;
    }
    if (params.has('w')) {
      var wVal = parseFloat(params.get('w'));
      if (!isNaN(wVal) && wVal >= 0 && wVal <= 100 && wantsPercent) wantsPercent.value = wVal;
    }
    if (params.has('s')) {
      var sVal = parseFloat(params.get('s'));
      if (!isNaN(sVal) && sVal >= 0 && sVal <= 100 && savingsPercent) savingsPercent.value = sVal;
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
  };
}