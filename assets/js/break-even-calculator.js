// ============================================================
// BREAK-EVEN POINT CALCULATOR
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

  var fixedCostsInput = document.getElementById('fixedCosts');
  var fixedCostsSlider = document.getElementById('fixedCostsSlider');
  var variableCostInput = document.getElementById('variableCost');
  var variableCostSlider = document.getElementById('variableCostSlider');
  var pricePerUnitInput = document.getElementById('pricePerUnit');
  var pricePerUnitSlider = document.getElementById('pricePerUnitSlider');

  var breakEvenUnitsEl = document.getElementById('breakEvenUnits');
  var breakEvenRevenueEl = document.getElementById('breakEvenRevenue');
  var contributionMarginEl = document.getElementById('contributionMargin');
  var contributionMarginPercentEl = document.getElementById('contributionMarginPercent');

  var insightsGrid = document.getElementById('insightsGrid');
  var breakdownContent = document.getElementById('breakdownContent');
  var toolChart = document.getElementById('toolChart');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'break-even';

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

  function formatUnits(num) {
    return Math.ceil(num).toLocaleString('en-US');
  }

  // ── Slider label updater ──
  function updateSliderLabel(inputId, value) {
    var label = document.getElementById(inputId + 'SliderVal');
    if (!label) return;
    var num = parseFloat(value);
    if (isNaN(num)) return;
    switch (inputId) {
      case 'fixedCosts':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'variableCost':
      case 'pricePerUnit':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core calculation ──
  function calculateBreakEven(fixedCosts, variableCost, pricePerUnit) {
    var contributionMargin = pricePerUnit - variableCost;
    var contributionMarginPercent = pricePerUnit > 0 ? (contributionMargin / pricePerUnit) * 100 : 0;
    var breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : Infinity;
    var breakEvenRevenue = breakEvenUnits * pricePerUnit;

    return {
      contributionMargin: contributionMargin,
      contributionMarginPercent: contributionMarginPercent,
      breakEvenUnits: breakEvenUnits,
      breakEvenRevenue: breakEvenRevenue
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var fixedCosts = parseFloat(fixedCostsInput ? fixedCostsInput.value : 0) || 0;
    var variableCost = parseFloat(variableCostInput ? variableCostInput.value : 0) || 0;
    var pricePerUnit = parseFloat(pricePerUnitInput ? pricePerUnitInput.value : 0) || 0;

    if (fixedCosts === 0 && (variableCost === 0 || pricePerUnit === 0)) {
      breakEvenUnitsEl.textContent = '—';
      breakEvenRevenueEl.textContent = '—';
      contributionMarginEl.textContent = '—';
      contributionMarginPercentEl.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (breakdownContent) breakdownContent.innerHTML = '';
      return;
    }

    var result = calculateBreakEven(fixedCosts, variableCost, pricePerUnit);

    if (result.breakEvenUnits === Infinity) {
      breakEvenUnitsEl.textContent = '∞';
      breakEvenRevenueEl.textContent = '∞';
    } else {
      breakEvenUnitsEl.textContent = formatUnits(result.breakEvenUnits);
      breakEvenRevenueEl.textContent = formatCurrency(result.breakEvenRevenue);
    }

    contributionMarginEl.textContent = formatCurrency(result.contributionMargin);
    contributionMarginPercentEl.textContent = result.contributionMarginPercent.toFixed(1) + '%';

    generateInsights(result, fixedCosts, variableCost, pricePerUnit);
    generateBreakdown(result, fixedCosts, variableCost, pricePerUnit);
    updateChart(result, fixedCosts, variableCost, pricePerUnit);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, fixedCosts, variableCost, pricePerUnit) {
    if (!insightsGrid) return;
    var insights = [];

    if (result.breakEvenUnits === Infinity) {
      insights.push({
        icon: '🚨',
        text: 'Break-even is <strong>impossible</strong> — price per unit is less than or equal to variable cost per unit. Increase your price or reduce variable costs.'
      });
    } else {
      insights.push({
        icon: '🎯',
        text: 'You need to sell <strong>' + formatUnits(result.breakEvenUnits) + ' units</strong> to cover all costs'
      });
      insights.push({
        icon: '💰',
        text: 'Break-even revenue: <strong>' + formatCurrency(result.breakEvenRevenue) + '</strong>'
      });

      if (result.contributionMarginPercent > 50) {
        insights.push({
          icon: '✅',
          text: 'Your contribution margin of <strong>' + result.contributionMarginPercent.toFixed(1) + '%</strong> is excellent — you have strong pricing power'
        });
      } else if (result.contributionMarginPercent > 30) {
        insights.push({
          icon: '📊',
          text: 'Your contribution margin of <strong>' + result.contributionMarginPercent.toFixed(1) + '%</strong> is healthy'
        });
      } else if (result.contributionMarginPercent > 10) {
        insights.push({
          icon: '⚠️',
          text: 'Your contribution margin of <strong>' + result.contributionMarginPercent.toFixed(1) + '%</strong> is low — consider cost reduction or price increase'
        });
      } else {
        insights.push({
          icon: '🚨',
          text: 'Your contribution margin of <strong>' + result.contributionMarginPercent.toFixed(1) + '%</strong> is very low — you are vulnerable to cost increases'
        });
      }

      if (fixedCosts > 0) {
        var ratio = result.breakEvenRevenue / fixedCosts;
        insights.push({
          icon: '📐',
          text: 'Each dollar of fixed costs requires <strong>' + ratio.toFixed(2) + '×</strong> in sales revenue to break even'
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter fixed costs, variable cost per unit, and price per unit to calculate your break-even point'
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
  function generateBreakdown(result, fixedCosts, variableCost, pricePerUnit) {
    if (!breakdownContent) return;
    var html = '';

    html += '<div class="breakdown-row"><span class="breakdown-label">Fixed Costs:</span><span class="breakdown-value">' + formatCurrency(fixedCosts) + '</span></div>';
    html += '<div class="breakdown-row"><span class="breakdown-label">Variable Cost per Unit:</span><span class="breakdown-value">' + formatCurrency(variableCost) + '</span></div>';
    html += '<div class="breakdown-row"><span class="breakdown-label">Price per Unit:</span><span class="breakdown-value">' + formatCurrency(pricePerUnit) + '</span></div>';
    html += '<hr>';
    html += '<div class="breakdown-row"><span class="breakdown-label">Contribution Margin per Unit:</span><span class="breakdown-value">' + formatCurrency(result.contributionMargin) + '</span></div>';
    html += '<div class="breakdown-row"><span class="breakdown-label">Contribution Margin %:</span><span class="breakdown-value">' + result.contributionMarginPercent.toFixed(1) + '%</span></div>';

    if (result.breakEvenUnits !== Infinity) {
      html += '<hr>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Break-Even Units:</span><span class="breakdown-value">' + formatUnits(result.breakEvenUnits) + '</span></div>';
      html += '<div class="breakdown-row"><span class="breakdown-label">Break-Even Revenue:</span><span class="breakdown-value">' + formatCurrency(result.breakEvenRevenue) + '</span></div>';
    } else {
      html += '<hr>';
      html += '<div class="breakdown-row"><span class="breakdown-label" style="color:#ef4444;">Break-Even:</span><span class="breakdown-value" style="color:#ef4444;">Impossible — Price must exceed Variable Cost</span></div>';
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

  function updateChart(result, fixedCosts, variableCost, pricePerUnit) {
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
    var chartConfig;

    if (currentChartType === 'break-even') {
      // Break-Even Chart: Revenue vs Total Costs
      var maxUnits = Math.ceil(result.breakEvenUnits * 2) || 100;
      if (result.breakEvenUnits === Infinity) maxUnits = 100;

      var labels = [];
      var revenueData = [];
      var totalCostData = [];
      var fixedCostData = [];

      for (var i = 0; i <= maxUnits; i += Math.max(1, Math.floor(maxUnits / 20))) {
        labels.push(i);
        revenueData.push(i * pricePerUnit);
        totalCostData.push(fixedCosts + (i * variableCost));
        fixedCostData.push(fixedCosts);
      }

      // Ensure break-even point is included
      if (result.breakEvenUnits !== Infinity && result.breakEvenUnits <= maxUnits) {
        var be = Math.round(result.breakEvenUnits);
        if (!labels.includes(be)) {
          labels.push(be);
          revenueData[labels.length - 1] = be * pricePerUnit;
          totalCostData[labels.length - 1] = fixedCosts + (be * variableCost);
          fixedCostData[labels.length - 1] = fixedCosts;
        }
      }

      chartConfig = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Revenue',
              data: revenueData,
              borderColor: '#0d9488',
              backgroundColor: 'rgba(13, 148, 136, 0.05)',
              fill: false,
              tension: 0.3,
              pointRadius: 1
            },
            {
              label: 'Total Cost',
              data: totalCostData,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              fill: false,
              tension: 0.3,
              pointRadius: 1
            },
            {
              label: 'Fixed Cost',
              data: fixedCostData,
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.05)',
              fill: false,
              borderDash: [5, 5],
              tension: 0.3,
              pointRadius: 1
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
                  return context.dataset.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
              }
            },
            legend: { position: 'bottom' }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Units Sold'
              }
            },
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

      // Add annotation for break-even point (if possible)
      if (result.breakEvenUnits !== Infinity) {
        chartConfig.options.plugins.annotation = {
          annotations: {
            line1: {
              type: 'line',
              xMin: result.breakEvenUnits,
              xMax: result.breakEvenUnits,
              borderColor: '#0d9488',
              borderWidth: 2,
              borderDash: [6, 6],
              label: {
                content: 'Break-Even',
                enabled: true,
                position: 'top',
                font: { weight: 'bold' }
              }
            }
          }
        };
      }

    } else {
      // Cost Breakdown: Fixed Costs vs Variable Costs at Break-Even
      var units = result.breakEvenUnits !== Infinity ? Math.ceil(result.breakEvenUnits) : 1;
      var totalVariableAtBE = units * variableCost;
      var totalFixed = fixedCosts;

      chartConfig = {
        type: 'doughnut',
        data: {
          labels: ['Fixed Costs', 'Variable Costs'],
          datasets: [{
            data: [totalFixed, totalVariableAtBE],
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
    }

    chartInstance = new Chart(ctx, chartConfig);
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (fixedCostsInput) params.set('f', fixedCostsInput.value);
    if (variableCostInput) params.set('v', variableCostInput.value);
    if (pricePerUnitInput) params.set('p', pricePerUnitInput.value);

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
    var units = breakEvenUnitsEl ? breakEvenUnitsEl.textContent : '';
    var revenue = breakEvenRevenueEl ? breakEvenRevenueEl.textContent : '';
    var margin = contributionMarginEl ? contributionMarginEl.textContent : '';
    var marginPercent = contributionMarginPercentEl ? contributionMarginPercentEl.textContent : '';
    var text = 'Break-Even Analysis Result:\nBreak-Even Units: ' + units + '\nBreak-Even Revenue: ' + revenue + '\nContribution Margin: ' + margin + '\nContribution Margin %: ' + marginPercent;
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
    link.download = 'break-even-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  window.resetForm = function() {
    var defaultFixed = (ranges.fixed_costs && ranges.fixed_costs.default) || 10000;
    var defaultVariable = (ranges.variable_cost && ranges.variable_cost.default) || 5;
    var defaultPrice = (ranges.price_per_unit && ranges.price_per_unit.default) || 25;

    if (fixedCostsInput) { fixedCostsInput.value = defaultFixed; if (fixedCostsSlider) fixedCostsSlider.value = defaultFixed; }
    if (variableCostInput) { variableCostInput.value = defaultVariable; if (variableCostSlider) variableCostSlider.value = defaultVariable; }
    if (pricePerUnitInput) { pricePerUnitInput.value = defaultPrice; if (pricePerUnitSlider) pricePerUnitSlider.value = defaultPrice; }

    updateSliderLabel('fixedCosts', defaultFixed);
    updateSliderLabel('variableCost', defaultVariable);
    updateSliderLabel('pricePerUnit', defaultPrice);

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
    if (params.has('f')) {
      var fVal = parseFloat(params.get('f'));
      if (!isNaN(fVal) && fVal >= 0) {
        if (fixedCostsInput) { fixedCostsInput.value = fVal; if (fixedCostsSlider) fixedCostsSlider.value = fVal; }
        updateSliderLabel('fixedCosts', fVal);
      }
    }
    if (params.has('v')) {
      var vVal = parseFloat(params.get('v'));
      if (!isNaN(vVal) && vVal >= 0) {
        if (variableCostInput) { variableCostInput.value = vVal; if (variableCostSlider) variableCostSlider.value = vVal; }
        updateSliderLabel('variableCost', vVal);
      }
    }
    if (params.has('p')) {
      var pVal = parseFloat(params.get('p'));
      if (!isNaN(pVal) && pVal >= 0) {
        if (pricePerUnitInput) { pricePerUnitInput.value = pVal; if (pricePerUnitSlider) pricePerUnitSlider.value = pVal; }
        updateSliderLabel('pricePerUnit', pVal);
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
    console.warn('Break-Even Point Calculator not loaded yet. Please wait.');
  };
}