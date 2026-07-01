// ============================================================
// MARKUP CALCULATOR
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

  var costInput = document.getElementById('cost');
  var costSlider = document.getElementById('costSlider');
  var priceInput = document.getElementById('price');
  var priceSlider = document.getElementById('priceSlider');
  var targetMarkupInput = document.getElementById('targetMarkup');
  var targetMarkupSlider = document.getElementById('targetMarkupSlider');

  var markupPercentageEl = document.getElementById('markupPercentage');
  var profitAmountEl = document.getElementById('profitAmount');
  var sellingPriceEl = document.getElementById('sellingPrice');
  var marginEquivalentEl = document.getElementById('marginEquivalent');

  var insightsGrid = document.getElementById('insightsGrid');
  var breakdownContent = document.getElementById('breakdownContent');
  var toolChart = document.getElementById('toolChart');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'cost-breakdown';
  var currentMode = 'markup'; // 'markup' or 'price'

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
      case 'cost':
      case 'price':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'targetMarkup':
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

    var targetGroup = document.getElementById('targetMarkupGroup');
    var priceGroup = document.getElementById('priceGroup');

    if (mode === 'price') {
      targetGroup.classList.remove('hidden');
      priceGroup.querySelector('label').textContent = 'Selling Price (Calculated)';
    } else {
      targetGroup.classList.add('hidden');
      priceGroup.querySelector('label').textContent = 'Selling Price';
    }

    window.calculate();
  };

  // ── Core calculation ──
  function calculateMarkup(cost, price) {
    var profit = price - cost;
    var markup = cost > 0 ? (profit / cost) * 100 : 0;
    var margin = price > 0 ? (profit / price) * 100 : 0;
    return { profit: profit, markup: markup, margin: margin };
  }

  function calculatePriceFromMarkup(cost, targetMarkup) {
    var markupDecimal = targetMarkup / 100;
    var price = cost * (1 + markupDecimal);
    var profit = price - cost;
    var margin = price > 0 ? (profit / price) * 100 : 0;
    return { price: price, profit: profit, margin: margin, markup: targetMarkup };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var cost = parseFloat(costInput ? costInput.value : 0) || 0;
    var price = parseFloat(priceInput ? priceInput.value : 0) || 0;
    var targetMarkup = parseFloat(targetMarkupInput ? targetMarkupInput.value : 0) || 0;

    var result;

    if (currentMode === 'markup') {
      if (cost === 0 || price === 0) {
        markupPercentageEl.textContent = '—';
        profitAmountEl.textContent = '—';
        sellingPriceEl.textContent = '—';
        marginEquivalentEl.textContent = '—';
        if (insightsGrid) insightsGrid.innerHTML = '';
        if (breakdownContent) breakdownContent.innerHTML = '';
        return;
      }
      result = calculateMarkup(cost, price);
      markupPercentageEl.textContent = result.markup.toFixed(1) + '%';
      profitAmountEl.textContent = formatCurrency(result.profit);
      sellingPriceEl.textContent = formatCurrency(price);
      marginEquivalentEl.textContent = result.margin.toFixed(1) + '%';
    } else { // price mode
      if (cost === 0) {
        markupPercentageEl.textContent = '—';
        profitAmountEl.textContent = '—';
        sellingPriceEl.textContent = '—';
        marginEquivalentEl.textContent = '—';
        if (insightsGrid) insightsGrid.innerHTML = '';
        if (breakdownContent) breakdownContent.innerHTML = '';
        return;
      }
      result = calculatePriceFromMarkup(cost, targetMarkup);
      markupPercentageEl.textContent = targetMarkup.toFixed(1) + '%';
      profitAmountEl.textContent = formatCurrency(result.profit);
      sellingPriceEl.textContent = formatCurrency(result.price);
      marginEquivalentEl.textContent = result.margin.toFixed(1) + '%';
      // Update price input to show calculated price
      priceInput.value = Math.round(result.price);
    }

    generateInsights(result, currentMode, cost, price, targetMarkup);
    generateBreakdown(result, currentMode, cost, price, targetMarkup);
    updateChart(result, currentMode, cost);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, mode, cost, price, targetMarkup) {
    if (!insightsGrid) return;
    var insights = [];

    if (mode === 'markup') {
      if (result.markup > 0) {
        insights.push({
          icon: '📈',
          text: 'You have a <strong>' + result.markup.toFixed(0) + '% markup</strong> on products costing ' + formatCurrency(cost)
        });
        if (result.markup >= 50) {
          insights.push({
            icon: '✅',
            text: 'A markup of <strong>' + result.markup.toFixed(0) + '%</strong> is considered strong in most retail industries'
          });
        } else if (result.markup >= 25) {
          insights.push({
            icon: '📊',
            text: 'A markup of <strong>' + result.markup.toFixed(0) + '%</strong> is average for many wholesale and retail businesses'
          });
        } else {
          insights.push({
            icon: '⚠️',
            text: 'A markup of <strong>' + result.markup.toFixed(0) + '%</strong> is low — consider raising prices or reducing costs'
          });
        }
        if (result.margin > 0) {
          insights.push({
            icon: '🔄',
            text: 'Your <strong>' + result.markup.toFixed(0) + '% markup</strong> equals a <strong>' + result.margin.toFixed(1) + '% margin</strong>'
          });
        }
      } else if (result.markup < 0) {
        insights.push({
          icon: '🚨',
          text: 'You are <strong>selling below cost</strong> — markup is negative at ' + result.markup.toFixed(1) + '%'
        });
      } else {
        insights.push({
          icon: '⚖️',
          text: 'You are <strong>selling at cost</strong> — no markup applied'
        });
      }
      if (cost > 0 && price > 0) {
        var ratio = price / cost;
        insights.push({
          icon: '📐',
          text: 'Selling price is <strong>' + ratio.toFixed(2) + '×</strong> your cost'
        });
      }
    } else { // price mode
      insights.push({
        icon: '🎯',
        text: 'To achieve a <strong>' + targetMarkup.toFixed(0) + '% markup</strong>, sell at ' + formatCurrency(result.price)
      });
      insights.push({
        icon: '💰',
        text: 'Each sale will generate <strong>' + formatCurrency(result.profit) + '</strong> in profit'
      });
      if (result.margin > 0) {
        insights.push({
          icon: '🔄',
          text: 'A <strong>' + targetMarkup.toFixed(0) + '% markup</strong> equals a <strong>' + result.margin.toFixed(1) + '% margin</strong>'
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter cost and price to calculate your markup percentage'
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
  function generateBreakdown(result, mode, cost, price, targetMarkup) {
    if (!breakdownContent) return;
    var html = '';

    if (mode === 'markup') {
      html += '<div class="breakdown-row"><span class="breakdown-label">Cost:</span><span class="breakdown-value">' + formatCurrency(cost) + '</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Selling Price:</span><span class="breakdown-value">' + formatCurrency(price) + '</span></div>';
      html += '<hr>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Profit Amount:</span><span class="breakdown-value">' + formatCurrency(result.profit) + '</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Markup Percentage:</span><span class="breakdown-value">' + result.markup.toFixed(1) + '%</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Margin Equivalent:</span><span class="breakdown-value">' + result.margin.toFixed(1) + '%</span></div>';
    } else {
      html += '<div class="breakdown-row"><span class="breakdown-label">Cost:</span><span class="breakdown-value">' + formatCurrency(cost) + '</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Target Markup:</span><span class="breakdown-value">' + targetMarkup.toFixed(1) + '%</span></div>';
      html += '<hr>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Required Selling Price:</span><span class="breakdown-value">' + formatCurrency(result.price) + '</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Profit Amount:</span><span class="breakdown-value">' + formatCurrency(result.profit) + '</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Margin Equivalent:</span><span class="breakdown-value">' + result.margin.toFixed(1) + '%</span></div>';
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

  function updateChart(result, mode, cost) {
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

    var costValue = cost || 0;
    var profit = result.profit || 0;
    var price = mode === 'markup' ? parseFloat(priceInput ? priceInput.value : 0) || 0 : result.price || 0;

    var chartConfig;

    if (currentChartType === 'cost-breakdown') {
      // Cost Breakdown: Cost vs Profit
      chartConfig = {
        type: 'doughnut',
        data: {
          labels: ['Cost', 'Profit'],
          datasets: [{
            data: [Math.max(costValue, 0), Math.max(profit, 0)],
            backgroundColor: ['#6366f1', '#0d9488'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  var label = context.label || '';
                  var value = context.parsed || 0;
                  var total = context.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                  var percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return label + ': ' + currencySymbol + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' (' + percentage + '%)';
                }
              }
            },
            legend: { position: 'bottom', labels: { font: { weight: 'bold' } } }
          }
        }
      };
    } else {
      // Pricing Comparison: Cost vs Profit (stacked bar to show total price)
      chartConfig = {
        type: 'bar',
        data: {
          labels: ['Cost', 'Profit'],
          datasets: [{
            label: 'Amount',
            data: [Math.max(costValue, 0), Math.max(profit, 0)],
            backgroundColor: ['#6366f1', '#0d9488'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  var label = context.label || '';
                  var value = context.parsed.y || 0;
                  return label + ': ' + currencySymbol + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
              }
            },
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return currencySymbol + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                }
              }
            }
          }
        }
      };
    }

    chartInstance = new Chart(ctx, chartConfig);
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (costInput) params.set('c', costInput.value);
    if (priceInput) params.set('p', priceInput.value);
    if (targetMarkupInput) params.set('m', targetMarkupInput.value);
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
    var markup = markupPercentageEl ? markupPercentageEl.textContent : '';
    var profit = profitAmountEl ? profitAmountEl.textContent : '';
    var price = sellingPriceEl ? sellingPriceEl.textContent : '';
    var margin = marginEquivalentEl ? marginEquivalentEl.textContent : '';
    var text = 'Markup Calculation Result:\nMarkup Percentage: ' + markup + '\nProfit Amount: ' + profit + '\nSelling Price: ' + price + '\nMargin Equivalent: ' + margin;
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
    link.download = 'markup-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  window.resetForm = function() {
    var defaultCost = (ranges.cost && ranges.cost.default) || 100;
    var defaultPrice = (ranges.price && ranges.price.default) || 150;
    var defaultTargetMarkup = (ranges.target_markup && ranges.target_markup.default) || 50;

    if (costInput) { costInput.value = defaultCost; if (costSlider) costSlider.value = defaultCost; }
    if (priceInput) { priceInput.value = defaultPrice; if (priceSlider) priceSlider.value = defaultPrice; }
    if (targetMarkupInput) { targetMarkupInput.value = defaultTargetMarkup; if (targetMarkupSlider) targetMarkupSlider.value = defaultTargetMarkup; }

    updateSliderLabel('cost', defaultCost);
    updateSliderLabel('price', defaultPrice);
    updateSliderLabel('targetMarkup', defaultTargetMarkup);

    // Set mode to markup
    var markupBtn = document.querySelector('.mode-btn[data-mode="markup"]');
    if (markupBtn) setMode('markup', markupBtn);

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
    if (params.has('c')) {
      var cVal = parseFloat(params.get('c'));
      if (!isNaN(cVal) && cVal >= 0) {
        if (costInput) { costInput.value = cVal; if (costSlider) costSlider.value = cVal; }
        updateSliderLabel('cost', cVal);
      }
    }
    if (params.has('p')) {
      var pVal = parseFloat(params.get('p'));
      if (!isNaN(pVal) && pVal >= 0) {
        if (priceInput) { priceInput.value = pVal; if (priceSlider) priceSlider.value = pVal; }
        updateSliderLabel('price', pVal);
      }
    }
    if (params.has('m')) {
      var mVal = parseFloat(params.get('m'));
      if (!isNaN(mVal) && mVal >= 0) {
        if (targetMarkupInput) { targetMarkupInput.value = mVal; if (targetMarkupSlider) targetMarkupSlider.value = mVal; }
        updateSliderLabel('targetMarkup', mVal);
      }
    }
    if (params.has('mode')) {
      var mode = params.get('mode');
      if (mode === 'markup' || mode === 'price') {
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
    console.warn('Markup Calculator not loaded yet. Please wait.');
  };
}