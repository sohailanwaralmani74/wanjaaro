// ============================================================
// PROFIT MARGIN CALCULATOR
// Uses global data from /assets/js/data.js
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];
  var ranges = window.ranges || {};
  var constants = window.constants || {};

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var revenueInput = document.getElementById('revenue');
  var revenueSlider = document.getElementById('revenueSlider');
  var costInput = document.getElementById('cost');
  var costSlider = document.getElementById('costSlider');
  var targetMarginInput = document.getElementById('targetMargin');
  var targetMarginSlider = document.getElementById('targetMarginSlider');

  var profitAmountEl = document.getElementById('profitAmount');
  var profitMarginEl = document.getElementById('profitMargin');
  var markupEl = document.getElementById('markup');
  var revenueResultEl = document.getElementById('revenueResult');

  var insightsGrid = document.getElementById('insightsGrid');
  var breakdownContent = document.getElementById('breakdownContent');
  var toolChart = document.getElementById('toolChart');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'donut';
  var currentMode = 'margin'; // 'margin' or 'price'

  // ── Helper ──
  function isChartJsLoaded() {
    return typeof Chart !== 'undefined';
  }

  // ── Formatting ──
  function formatNumber(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatCurrency(num) {
    return selectedCurrency.symbol + formatNumber(num);
  }

  // ── Slider label updater ──
  function updateSliderLabel(inputId, value) {
    var label = document.getElementById(inputId + 'SliderVal');
    if (!label) return;
    var num = parseFloat(value);
    if (isNaN(num)) return;
    switch (inputId) {
      case 'revenue':
      case 'cost':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'targetMargin':
        label.textContent = num + '%';
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Mode toggle ──
  window.setMode = function(mode, btn) {
    currentMode = mode;
    var btns = document.querySelectorAll('.mode-btn');
    btns.forEach(function(b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    // Show/hide fields based on mode
    var targetGroup = document.getElementById('targetMarginGroup');
    var revenueGroup = document.getElementById('revenueGroup');
    var costGroup = document.getElementById('costGroup');

    if (mode === 'price') {
      targetGroup.classList.remove('hidden');
      revenueGroup.querySelector('label').textContent = 'Selling Price (Calculated)';
    } else {
      targetGroup.classList.add('hidden');
      revenueGroup.querySelector('label').textContent = 'Revenue';
    }

    window.calculate();
  };

  // ── Core calculation ──
  function calculateMargin(revenue, cost) {
    var profit = revenue - cost;
    var margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    var markup = cost > 0 ? (profit / cost) * 100 : 0;
    return { profit: profit, margin: margin, markup: markup };
  }

  function calculatePriceFromMargin(cost, targetMargin) {
    var marginDecimal = targetMargin / 100;
    var revenue = cost / (1 - marginDecimal);
    var profit = revenue - cost;
    var markup = cost > 0 ? (profit / cost) * 100 : 0;
    return { revenue: revenue, profit: profit, markup: markup };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var revenue = parseFloat(revenueInput ? revenueInput.value : 0) || 0;
    var cost = parseFloat(costInput ? costInput.value : 0) || 0;
    var targetMargin = parseFloat(targetMarginInput ? targetMarginInput.value : 0) || 0;

    var result;

    if (currentMode === 'margin') {
      if (revenue === 0 && cost === 0) {
        profitAmountEl.textContent = '—';
        profitMarginEl.textContent = '—';
        markupEl.textContent = '—';
        revenueResultEl.textContent = '—';
        if (insightsGrid) insightsGrid.innerHTML = '';
        if (breakdownContent) breakdownContent.innerHTML = '';
        return;
      }
      result = calculateMargin(revenue, cost);
      profitAmountEl.textContent = formatCurrency(result.profit);
      profitMarginEl.textContent = result.margin.toFixed(1) + '%';
      markupEl.textContent = result.markup.toFixed(1) + '%';
      revenueResultEl.textContent = formatCurrency(revenue);
    } else { // price mode
      if (cost === 0) {
        profitAmountEl.textContent = '—';
        profitMarginEl.textContent = '—';
        markupEl.textContent = '—';
        revenueResultEl.textContent = '—';
        if (insightsGrid) insightsGrid.innerHTML = '';
        if (breakdownContent) breakdownContent.innerHTML = '';
        return;
      }
      result = calculatePriceFromMargin(cost, targetMargin);
      profitAmountEl.textContent = formatCurrency(result.profit);
      profitMarginEl.textContent = targetMargin.toFixed(1) + '%';
      markupEl.textContent = result.markup.toFixed(1) + '%';
      revenueResultEl.textContent = formatCurrency(result.revenue);
      // Update revenue input display to show calculated price
      revenueInput.value = Math.round(result.revenue);
    }

    generateInsights(result, currentMode, revenue, cost, targetMargin);
    generateBreakdown(result, currentMode, revenue, cost, targetMargin);
    updateChart(result, currentMode);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, mode, revenue, cost, targetMargin) {
    if (!insightsGrid) return;
    var insights = [];

    if (mode === 'margin') {
      if (result.profit > 0) {
        insights.push({
          icon: '📈',
          text: 'You have a <strong>positive profit</strong> of ' + formatCurrency(result.profit) + ' on revenue of ' + formatCurrency(revenue)
        });
        if (result.margin > 20) {
          insights.push({
            icon: '✅',
            text: 'Your profit margin of <strong>' + result.margin.toFixed(1) + '%</strong> is considered <strong>healthy</strong>'
          });
        } else if (result.margin > 10) {
          insights.push({
            icon: '📊',
            text: 'Your profit margin of <strong>' + result.margin.toFixed(1) + '%</strong> is <strong>average</strong>'
          });
        } else {
          insights.push({
            icon: '⚠️',
            text: 'Your profit margin of <strong>' + result.margin.toFixed(1) + '%</strong> is <strong>low</strong> — consider cost reduction or price increase'
          });
        }
        if (result.markup > 0) {
          insights.push({
            icon: '🔄',
            text: 'You mark up your costs by <strong>' + result.markup.toFixed(1) + '%</strong> to arrive at your selling price'
          });
        }
      } else if (result.profit < 0) {
        insights.push({
          icon: '🚨',
          text: 'You are <strong>operating at a loss</strong> of ' + formatCurrency(Math.abs(result.profit)) + ' — review your pricing or reduce costs'
        });
      } else {
        insights.push({
          icon: '⚖️',
          text: 'You are <strong>breaking even</strong> — revenue equals cost'
        });
      }
      if (cost > 0 && revenue > 0) {
        var ratio = revenue / cost;
        insights.push({
          icon: '📐',
          text: 'Revenue is <strong>' + ratio.toFixed(2) + '×</strong> your cost'
        });
      }
    } else { // price mode
      if (result.profit > 0) {
        insights.push({
          icon: '🎯',
          text: 'To achieve a <strong>' + targetMargin.toFixed(0) + '%</strong> margin, you need to sell at ' + formatCurrency(result.revenue)
        });
        insights.push({
          icon: '💰',
          text: 'Each sale will generate <strong>' + formatCurrency(result.profit) + '</strong> in profit'
        });
        if (result.markup > 0) {
          insights.push({
            icon: '🏷️',
            text: 'This represents a markup of <strong>' + result.markup.toFixed(1) + '%</strong> over your cost'
          });
        }
      } else {
        insights.push({
          icon: '⚠️',
          text: 'Target margin of ' + targetMargin.toFixed(0) + '% is <strong>not achievable</strong> — your required price would be infinite or negative'
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter revenue and cost to calculate your profit margin'
      });
    }

    insightsGrid.innerHTML = insights.slice(0, 6).map(function(insight) {
      return '<div class="insight-item">' +
               '<span class="insight-icon">' + insight.icon + '</span>' +
               '<span class="insight-text">' + insight.text + '</span>' +
             '</div>';
    }).join('');
  }

  // ── Generate Breakdown ──
  function generateBreakdown(result, mode, revenue, cost, targetMargin) {
    if (!breakdownContent) return;
    var html = '';

    if (mode === 'margin') {
      html += '<div class="breakdown-row"><span class="breakdown-label">Revenue:</span><span class="breakdown-value">' + formatCurrency(revenue) + '</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Cost:</span><span class="breakdown-value">' + formatCurrency(cost) + '</span></div>';
      html += '<hr>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Profit Amount:</span><span class="breakdown-value">' + formatCurrency(result.profit) + '</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Profit Margin:</span><span class="breakdown-value">' + result.margin.toFixed(1) + '%</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Markup:</span><span class="breakdown-value">' + result.markup.toFixed(1) + '%</span></div>';
    } else {
      html += '<div class="breakdown-row"><span class="breakdown-label">Cost:</span><span class="breakdown-value">' + formatCurrency(cost) + '</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Target Margin:</span><span class="breakdown-value">' + targetMargin.toFixed(1) + '%</span></div>';
      html += '<hr>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Required Revenue/Price:</span><span class="breakdown-value">' + formatCurrency(result.revenue) + '</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Profit Amount:</span><span class="breakdown-value">' + formatCurrency(result.profit) + '</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Markup:</span><span class="breakdown-value">' + result.markup.toFixed(1) + '%</span></div>';
    }

    breakdownContent.innerHTML = html;
  }

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    window.calculate();
  };

  function updateChart(result, mode) {
    if (!toolChart) return;
    if (!isChartJsLoaded()) {
      var ctx = toolChart.getContext('2d');
      ctx.clearRect(0, 0, toolChart.width, toolChart.height);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Chart.js library not loaded. Please check your internet connection.', toolChart.width/2, toolChart.height/2);
      return;
    }

    if (chartInstance) chartInstance.destroy();

    var currencySymbol = selectedCurrency.symbol;
    var ctx = toolChart.getContext('2d');

    var chartConfig = {
      type: currentChartType === 'bar' ? 'bar' : 'doughnut',
      data: {
        labels: ['Cost', 'Profit'],
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                var label = context.label || '';
                var value = context.parsed.y || context.parsed || 0;
                if (currentChartType === 'bar') {
                  return label + ': ' + currencySymbol + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else {
                  var total = context.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  var percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return label + ': ' + currencySymbol + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' (' + percentage + '%)';
                }
              }
            }
          },
          legend: { position: 'bottom' }
        },
        scales: currentChartType === 'bar' ? {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return currencySymbol + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
              }
            }
          }
        } : undefined
      }
    };

    // For price mode, we need to calculate the breakdown differently
    var cost, profit;
    if (mode === 'margin') {
      cost = result.profit >= 0 ? (revenueInput ? parseFloat(revenueInput.value) || 0 : 0) - result.profit : 0;
      profit = result.profit;
    } else {
      cost = costInput ? parseFloat(costInput.value) || 0 : 0;
      profit = result.profit;
    }

    if (profit < 0) profit = 0; // don't show negative in chart

    if (currentChartType === 'bar') {
      chartConfig.data.datasets = [{
        label: 'Breakdown',
        data: [cost, profit],
        backgroundColor: ['#6366f1', '#0d9488'],
        borderRadius: 4
      }];
      chartConfig.options.plugins.legend = { display: false };
    } else { // donut
      chartConfig.data.datasets = [{
        data: [cost, profit],
        backgroundColor: ['#6366f1', '#0d9488'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }];
    }

    chartInstance = new Chart(ctx, chartConfig);
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (revenueInput) params.set('r', revenueInput.value);
    if (costInput) params.set('c', costInput.value);
    if (targetMarginInput) params.set('m', targetMarginInput.value);
    params.set('mode', currentMode);

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

  window.copyResult = function() {
    var profit = profitAmountEl ? profitAmountEl.textContent : '';
    var margin = profitMarginEl ? profitMarginEl.textContent : '';
    var markup = markupEl ? markupEl.textContent : '';
    var revenue = revenueResultEl ? revenueResultEl.textContent : '';
    var text = 'Profit Margin Calculation Result:\nProfit Amount: ' + profit + '\nProfit Margin: ' + margin + '\nMarkup: ' + markup + '\nRevenue/Price: ' + revenue;
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

  window.exportChart = function() {
    var canvas = document.getElementById('toolChart');
    if (!canvas) return;
    var link = document.createElement('a');
    link.download = 'profit-margin-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  window.resetForm = function() {
    var defaultRevenue = (ranges.revenue && ranges.revenue.default) || 10000;
    var defaultCost = (ranges.cost && ranges.cost.default) || 7000;
    var defaultTargetMargin = (ranges.target_margin && ranges.target_margin.default) || 25;

    if (revenueInput) { revenueInput.value = defaultRevenue; if (revenueSlider) revenueSlider.value = defaultRevenue; }
    if (costInput) { costInput.value = defaultCost; if (costSlider) costSlider.value = defaultCost; }
    if (targetMarginInput) { targetMarginInput.value = defaultTargetMargin; if (targetMarginSlider) targetMarginSlider.value = defaultTargetMargin; }

    updateSliderLabel('revenue', defaultRevenue);
    updateSliderLabel('cost', defaultCost);
    updateSliderLabel('targetMargin', defaultTargetMargin);

    // Set mode to margin
    var marginBtn = document.querySelector('.mode-btn[data-mode="margin"]');
    if (marginBtn) setMode('margin', marginBtn);

    window.calculate();
  };

  // ── Sync functions ──
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

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('r')) {
      var rVal = parseFloat(params.get('r'));
      if (!isNaN(rVal) && rVal >= 0) {
        if (revenueInput) { revenueInput.value = rVal; if (revenueSlider) revenueSlider.value = rVal; }
        updateSliderLabel('revenue', rVal);
      }
    }
    if (params.has('c')) {
      var cVal = parseFloat(params.get('c'));
      if (!isNaN(cVal) && cVal >= 0) {
        if (costInput) { costInput.value = cVal; if (costSlider) costSlider.value = cVal; }
        updateSliderLabel('cost', cVal);
      }
    }
    if (params.has('m')) {
      var mVal = parseFloat(params.get('m'));
      if (!isNaN(mVal) && mVal >= 0 && mVal <= 100) {
        if (targetMarginInput) { targetMarginInput.value = mVal; if (targetMarginSlider) targetMarginSlider.value = mVal; }
        updateSliderLabel('targetMargin', mVal);
      }
    }
    if (params.has('mode')) {
      var mode = params.get('mode');
      if (mode === 'margin' || mode === 'price') {
        var btn = document.querySelector('.mode-btn[data-mode="' + mode + '"]');
        if (btn) setMode(mode, btn);
      }
    }
    window.calculate();
  }

  // ── Initialise ──
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
    console.warn('Profit Margin Calculator not loaded yet. Please wait.');
  };
}