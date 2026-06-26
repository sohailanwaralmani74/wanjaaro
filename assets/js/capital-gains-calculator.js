// ============================================================
// CAPITAL GAINS CALCULATOR
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var purchasePrice = document.getElementById('purchasePrice');
  var purchasePriceSlider = document.getElementById('purchasePriceSlider');
  var salePrice = document.getElementById('salePrice');
  var salePriceSlider = document.getElementById('salePriceSlider');
  var holdingPeriod = document.getElementById('holdingPeriod');
  var taxRate = document.getElementById('taxRate');
  var taxRateSlider = document.getElementById('taxRateSlider');
  var deductions = document.getElementById('deductions');
  var deductionsSlider = document.getElementById('deductionsSlider');

  var totalGain = document.getElementById('totalGain');
  var taxableGain = document.getElementById('taxableGain');
  var capitalGainsTax = document.getElementById('capitalGainsTax');
  var netProceeds = document.getElementById('netProceeds');
  var gainTypeBadge = document.getElementById('gainTypeBadge');
  var insightsGrid = document.getElementById('insightsGrid');
  var toolChart = document.getElementById('toolChart');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'bar';

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
      case 'purchasePrice':
      case 'salePrice':
      case 'deductions':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'taxRate':
        label.textContent = num + '%';
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core Calculation ──
  function calculateCapitalGains(purchase, sale, holding, rate, deductions) {
    var totalGain = sale - purchase;
    var taxable = Math.max(0, totalGain - deductions);
    var tax = taxable * (rate / 100);
    var netProceeds = sale - tax;

    var gainType = holding === 'short' ? 'Short-Term' : 'Long-Term';

    return {
      totalGain: totalGain,
      taxableGain: taxable,
      tax: tax,
      netProceeds: netProceeds,
      gainType: gainType,
      isLoss: totalGain < 0
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var purchase = parseFloat(purchasePrice ? purchasePrice.value : 0) || 0;
    var sale = parseFloat(salePrice ? salePrice.value : 0) || 0;
    var holding = holdingPeriod ? holdingPeriod.value : 'long';
    var rate = parseFloat(taxRate ? taxRate.value : 0) || 0;
    var deduct = parseFloat(deductions ? deductions.value : 0) || 0;

    if (purchase <= 0 && sale <= 0) {
      if (totalGain) totalGain.textContent = '—';
      if (taxableGain) taxableGain.textContent = '—';
      if (capitalGainsTax) capitalGainsTax.textContent = '—';
      if (netProceeds) netProceeds.textContent = '—';
      if (gainTypeBadge) gainTypeBadge.style.display = 'none';
      if (insightsGrid) insightsGrid.innerHTML = '';
      return;
    }

    var result = calculateCapitalGains(purchase, sale, holding, rate, deduct);

    if (totalGain) totalGain.textContent = formatCurrency(result.totalGain);
    if (taxableGain) taxableGain.textContent = formatCurrency(result.taxableGain);
    if (capitalGainsTax) capitalGainsTax.textContent = formatCurrency(result.tax);
    if (netProceeds) netProceeds.textContent = formatCurrency(result.netProceeds);

    // Gain Type Badge
    if (gainTypeBadge) {
      gainTypeBadge.style.display = 'block';
      var emoji = result.isLoss ? '📉' : (result.gainType === 'Short-Term' ? '⚡' : '📈');
      var label = result.isLoss ? 'Capital Loss' : (result.gainType + ' Gain');
      gainTypeBadge.innerHTML = '<span class="gain-type-label">' + emoji + ' ' + label + '</span>';
      gainTypeBadge.style.borderLeftColor = result.isLoss ? '#dc2626' : (result.gainType === 'Short-Term' ? '#f59e0b' : '#0d9488');
    }

    generateInsights(result, purchase, sale, rate, deduct);
    updateChart(result);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, purchase, sale, rate, deduct) {
    if (!insightsGrid) return;
    var insights = [];

    if (result.isLoss) {
      insights.push({
        icon: '📉',
        text: 'You have a <strong>capital loss</strong> of ' + formatCurrency(Math.abs(result.totalGain)) + ' — may be used to offset other gains'
      });
    } else {
      insights.push({
        icon: '📈',
        text: 'You have a <strong>capital gain</strong> of ' + formatCurrency(result.totalGain)
      });
    }

    insights.push({
      icon: '📊',
      text: 'Gain type: <strong>' + result.gainType + '</strong>'
    });

    if (deduct > 0) {
      insights.push({
        icon: '💰',
        text: 'Deductions: <strong>' + formatCurrency(deduct) + '</strong> reduced taxable gain'
      });
    }

    if (result.tax > 0) {
      insights.push({
        icon: '🏦',
        text: 'Estimated tax: <strong>' + formatCurrency(result.tax) + '</strong> at ' + formatPercent(rate) + ' rate'
      });
    } else {
      insights.push({
        icon: '✅',
        text: 'No tax owed on this transaction'
      });
    }

    if (result.taxableGain > 0 && result.tax > 0) {
      var effectiveTaxRate = (result.tax / result.totalGain) * 100;
      insights.push({
        icon: '📈',
        text: 'Effective tax rate on gain: <strong>' + formatPercent(effectiveTaxRate) + '</strong>'
      });
    }

    if (result.isLoss) {
      insights.push({
        icon: '💡',
        text: 'Capital losses can be used to offset capital gains in the same tax year'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter asset details to calculate capital gains tax'
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

    var purchase = parseFloat(purchasePrice ? purchasePrice.value : 0) || 0;
    var sale = parseFloat(salePrice ? salePrice.value : 0) || 0;
    var holding = holdingPeriod ? holdingPeriod.value : 'long';
    var rate = parseFloat(taxRate ? taxRate.value : 0) || 0;
    var deduct = parseFloat(deductions ? deductions.value : 0) || 0;

    if (purchase > 0 || sale > 0) {
      var result = calculateCapitalGains(purchase, sale, holding, rate, deduct);
      updateChart(result);
    }
  };

  function updateChart(result) {
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
      var purchase = parseFloat(purchasePrice ? purchasePrice.value : 0) || 0;
      var gain = result.totalGain > 0 ? result.totalGain : 0;
      var tax = result.tax;

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Purchase Price', 'Gain', 'Tax'],
          datasets: [{
            label: 'Amount',
            data: [purchase, gain, tax],
            backgroundColor: ['#6366f1', '#0d9488', '#dc2626'],
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

    } else if (currentChartType === 'donut') {
      var purchase2 = parseFloat(purchasePrice ? purchasePrice.value : 0) || 0;
      var gain2 = result.totalGain > 0 ? result.totalGain : 0;
      var tax2 = result.tax;

      var labels2 = [];
      var data2 = [];
      var colors2 = [];

      if (purchase2 > 0) {
        labels2.push('Purchase Price');
        data2.push(purchase2);
        colors2.push('#6366f1');
      }
      if (gain2 > 0) {
        labels2.push('Gain');
        data2.push(gain2);
        colors2.push('#0d9488');
      }
      if (tax2 > 0) {
        labels2.push('Tax');
        data2.push(tax2);
        colors2.push('#dc2626');
      }

      if (data2.length === 0) {
        labels2 = ['No Data'];
        data2 = [1];
        colors2 = ['#94a3b8'];
      }

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels2,
          datasets: [{
            data: data2,
            backgroundColor: colors2,
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
    }
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (purchasePrice) params.set('p', purchasePrice.value);
    if (salePrice) params.set('s', salePrice.value);
    if (holdingPeriod) params.set('h', holdingPeriod.value);
    if (taxRate) params.set('t', taxRate.value);
    if (deductions) params.set('d', deductions.value);

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
    var purchase = parseFloat(purchasePrice ? purchasePrice.value : 0) || 0;
    var sale = parseFloat(salePrice ? salePrice.value : 0) || 0;
    var holding = holdingPeriod ? holdingPeriod.value : 'long';
    var rate = parseFloat(taxRate ? taxRate.value : 0) || 0;
    var deduct = parseFloat(deductions ? deductions.value : 0) || 0;

    if (purchase <= 0 && sale <= 0) return;

    var result = calculateCapitalGains(purchase, sale, holding, rate, deduct);

    var csv = 'Category,Amount\n';
    csv += 'Purchase Price,' + purchase + '\n';
    csv += 'Sale Price,' + sale + '\n';
    csv += 'Total Gain,' + result.totalGain + '\n';
    csv += 'Deductions,' + deduct + '\n';
    csv += 'Taxable Gain,' + result.taxableGain + '\n';
    csv += 'Capital Gains Tax,' + result.tax + '\n';
    csv += 'Net Proceeds,' + result.netProceeds + '\n';
    csv += 'Gain Type,' + result.gainType + '\n';

    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'capital-gains-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var gain = totalGain ? totalGain.textContent : '';
    var taxable = taxableGain ? taxableGain.textContent : '';
    var tax = capitalGainsTax ? capitalGainsTax.textContent : '';
    var net = netProceeds ? netProceeds.textContent : '';
    var type = gainTypeBadge ? gainTypeBadge.textContent.trim() : '';
    var text = 'Capital Gains Result:\n' + type + '\nTotal Gain: ' + gain + '\nTaxable Gain: ' + taxable + '\nTax: ' + tax + '\nNet Proceeds: ' + net;
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
    link.download = 'capital-gains-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultPurchase = 10000;
    var defaultSale = 15000;
    var defaultHolding = 'long';
    var defaultRate = 15;
    var defaultDeductions = 0;

    if (purchasePrice) { purchasePrice.value = defaultPurchase; if (purchasePriceSlider) purchasePriceSlider.value = defaultPurchase; }
    if (salePrice) { salePrice.value = defaultSale; if (salePriceSlider) salePriceSlider.value = defaultSale; }
    if (holdingPeriod) holdingPeriod.value = defaultHolding;
    if (taxRate) { taxRate.value = defaultRate; if (taxRateSlider) taxRateSlider.value = defaultRate; }
    if (deductions) { deductions.value = defaultDeductions; if (deductionsSlider) deductionsSlider.value = defaultDeductions; }

    updateSliderLabel('purchasePrice', defaultPurchase);
    updateSliderLabel('salePrice', defaultSale);
    updateSliderLabel('taxRate', defaultRate);
    updateSliderLabel('deductions', defaultDeductions);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('p')) {
      var pVal = parseFloat(params.get('p'));
      if (!isNaN(pVal) && pVal >= 0) {
        if (purchasePrice) { purchasePrice.value = pVal; if (purchasePriceSlider) purchasePriceSlider.value = pVal; }
        updateSliderLabel('purchasePrice', pVal);
      }
    }
    if (params.has('s')) {
      var sVal = parseFloat(params.get('s'));
      if (!isNaN(sVal) && sVal >= 0) {
        if (salePrice) { salePrice.value = sVal; if (salePriceSlider) salePriceSlider.value = sVal; }
        updateSliderLabel('salePrice', sVal);
      }
    }
    if (params.has('h')) {
      var hVal = params.get('h');
      if (hVal && holdingPeriod) holdingPeriod.value = hVal;
    }
    if (params.has('t')) {
      var tVal = parseFloat(params.get('t'));
      if (!isNaN(tVal) && tVal >= 0 && tVal <= 40) {
        if (taxRate) { taxRate.value = tVal; if (taxRateSlider) taxRateSlider.value = tVal; }
        updateSliderLabel('taxRate', tVal);
      }
    }
    if (params.has('d')) {
      var dVal = parseFloat(params.get('d'));
      if (!isNaN(dVal) && dVal >= 0) {
        if (deductions) { deductions.value = dVal; if (deductionsSlider) deductionsSlider.value = dVal; }
        updateSliderLabel('deductions', dVal);
      }
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
    console.warn('Capital Gains Calculator not loaded yet.');
  };
}