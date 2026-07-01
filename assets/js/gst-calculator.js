// ============================================================
// GST CALCULATOR
// Uses global data from /assets/js/data.js
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists (graceful fallback) ──
  var currencies = window.currencies || [];
  var ranges = window.ranges || {};
  var constants = window.constants || {};

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var amountInput = document.getElementById('amount');
  var amountSlider = document.getElementById('amountSlider');
  var gstRateInput = document.getElementById('gstRate');
  var gstRateSlider = document.getElementById('gstRateSlider');

  var baseAmountEl = document.getElementById('baseAmount');
  var gstAmountEl = document.getElementById('gstAmount');
  var totalAmountEl = document.getElementById('totalAmount');
  var insightsGrid = document.getElementById('insightsGrid');
  var breakdownContent = document.getElementById('breakdownContent');
  var toolChart = document.getElementById('toolChart');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'donut';
  var currentMode = 'add'; // 'add' or 'remove'

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
      case 'amount':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'gstRate':
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
    window.calculate();
  };

  // ── Core calculation ──
  function calculateGST(amount, rate, mode) {
    var base, gst, total;
    rate = rate / 100;
    if (mode === 'add') {
      base = amount;
      gst = base * rate;
      total = base + gst;
    } else { // remove
      total = amount;
      gst = total * rate / (1 + rate);
      base = total - gst;
    }
    return { base: base, gst: gst, total: total };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var amount = parseFloat(amountInput ? amountInput.value : 0) || 0;
    var rate = parseFloat(gstRateInput ? gstRateInput.value : 0) || 0;

    if (amount === 0) {
      baseAmountEl.textContent = '—';
      gstAmountEl.textContent = '—';
      totalAmountEl.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (breakdownContent) breakdownContent.innerHTML = '';
      return;
    }

    var result = calculateGST(amount, rate, currentMode);

    baseAmountEl.textContent = formatCurrency(result.base);
    gstAmountEl.textContent = formatCurrency(result.gst);
    totalAmountEl.textContent = formatCurrency(result.total);

    generateInsights(result, rate, currentMode);
    generateBreakdown(result, rate, currentMode);
    updateChart(result);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, rate, mode) {
    if (!insightsGrid) return;
    var insights = [];

    var ratePercent = (rate * 100).toFixed(1);
    var modeText = (mode === 'add') ? 'Adding GST' : 'Removing GST';
    insights.push({
      icon: '🧾',
      text: 'You are <strong>' + modeText + '</strong> at a rate of <strong>' + ratePercent + '%</strong>'
    });

    if (result.gst > 0) {
      var percentOfTotal = (result.gst / result.total * 100);
      insights.push({
        icon: '📊',
        text: 'GST is <strong>' + percentOfTotal.toFixed(1) + '%</strong> of the total amount'
      });
    }

    if (result.gst === 0) {
      insights.push({
        icon: '💡',
        text: 'GST rate is 0% — no tax applied'
      });
    }

    // Effective rate (if removing, the effective rate on base is higher)
    if (mode === 'remove' && result.base > 0) {
      var effectiveRate = (result.gst / result.base * 100);
      insights.push({
        icon: '🔄',
        text: 'The effective tax rate on the base amount is <strong>' + effectiveRate.toFixed(1) + '%</strong>'
      });
    }

    if (result.gst > 0 && result.total > 0) {
      insights.push({
        icon: '💰',
        text: 'You pay <strong>' + formatCurrency(result.gst) + '</strong> in GST on a total of ' + formatCurrency(result.total)
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter an amount and tax rate to see insights'
      });
    }

    insightsGrid.innerHTML = insights.slice(0, 6).map(function(insight) {
      return '<div class="insight-item">' +
               '<span class="insight-icon">' + insight.icon + '</span>' +
               '<span class="insight-text">' + insight.text + '</span>' +
             '</div>';
    }).join('');
  }

  // ── Generate Breakdown (text) ──
  function generateBreakdown(result, rate, mode) {
    if (!breakdownContent) return;
    var ratePercent = (rate * 100).toFixed(1);
    var modeLabel = (mode === 'add') ? 'Exclusive (Add GST)' : 'Inclusive (Remove GST)';
    var html = '';
    html += '<div class="breakdown-row"><span class="breakdown-label">Amount entered:</span><span class="breakdown-value">' + formatCurrency((mode === 'add') ? result.base : result.total) + '</span></div>';
    html += '<div class="breakdown-row"><span class="breakdown-label">GST Rate:</span><span class="breakdown-value">' + ratePercent + '%</span></div>';
    html += '<div class="breakdown-row"><span class="breakdown-label">Mode:</span><span class="breakdown-value">' + modeLabel + '</span></div>';
    html += '<hr>';
    html += '<div class="breakdown-row"><span class="breakdown-label">Base Amount (excl. tax):</span><span class="breakdown-value">' + formatCurrency(result.base) + '</span></div>';
    html += '<div class="breakdown-row"><span class="breakdown-label">GST Amount:</span><span class="breakdown-value">' + formatCurrency(result.gst) + '</span></div>';
    html += '<div class="breakdown-row"><span class="breakdown-label">Total (incl. tax):</span><span class="breakdown-value">' + formatCurrency(result.total) + '</span></div>';
    breakdownContent.innerHTML = html;
  }

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    // Recalculate to refresh chart
    window.calculate();
  };

  function updateChart(result) {
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
        labels: ['Base Amount', 'GST Amount'],
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

    if (currentChartType === 'bar') {
      chartConfig.data.datasets = [{
        label: 'Breakdown',
        data: [result.base, result.gst],
        backgroundColor: ['#6366f1', '#0d9488'],
        borderRadius: 4
      }];
      chartConfig.options.plugins.legend = { display: false };
    } else { // donut
      chartConfig.data.datasets = [{
        data: [result.base, result.gst],
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
    if (amountInput) params.set('a', amountInput.value);
    if (gstRateInput) params.set('r', gstRateInput.value);
    params.set('m', currentMode);

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
    var base = baseAmountEl ? baseAmountEl.textContent : '';
    var gst = gstAmountEl ? gstAmountEl.textContent : '';
    var total = totalAmountEl ? totalAmountEl.textContent : '';
    var text = 'GST Calculation Result:\nBase Amount: ' + base + '\nGST Amount: ' + gst + '\nTotal Amount: ' + total;
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
    link.download = 'gst-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  window.resetForm = function() {
    var defaultAmount = (ranges.amount && ranges.amount.default) || 10000;
    var defaultRate = (ranges.gst_rate && ranges.gst_rate.default) || 15;

    if (amountInput) { amountInput.value = defaultAmount; if (amountSlider) amountSlider.value = defaultAmount; }
    if (gstRateInput) { gstRateInput.value = defaultRate; if (gstRateSlider) gstRateSlider.value = defaultRate; }

    updateSliderLabel('amount', defaultAmount);
    updateSliderLabel('gstRate', defaultRate);

    // Set mode to add
    var addBtn = document.querySelector('.mode-btn[data-mode="add"]');
    if (addBtn) setMode('add', addBtn);

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
    if (params.has('a')) {
      var aVal = parseFloat(params.get('a'));
      if (!isNaN(aVal) && aVal >= 0) {
        if (amountInput) { amountInput.value = aVal; if (amountSlider) amountSlider.value = aVal; }
        updateSliderLabel('amount', aVal);
      }
    }
    if (params.has('r')) {
      var rVal = parseFloat(params.get('r'));
      if (!isNaN(rVal) && rVal >= 0) {
        if (gstRateInput) { gstRateInput.value = rVal; if (gstRateSlider) gstRateSlider.value = rVal; }
        updateSliderLabel('gstRate', rVal);
      }
    }
    if (params.has('m')) {
      var mode = params.get('m');
      if (mode === 'add' || mode === 'remove') {
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
    console.warn('GST Calculator not loaded yet. Please wait.');
  };
}