// ============================================================
// PRESENT VALUE CALCULATOR
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];
  var ranges = window.ranges || {};

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var futureValue = document.getElementById('futureValue');
  var futureValueSlider = document.getElementById('futureValueSlider');
  var rate = document.getElementById('rate');
  var rateSlider = document.getElementById('rateSlider');
  var years = document.getElementById('years');
  var yearsSlider = document.getElementById('yearsSlider');
  var compounding = document.getElementById('compounding');

  var presentValue = document.getElementById('presentValue');
  var totalDiscount = document.getElementById('totalDiscount');
  var discountRate = document.getElementById('discountRate');
  var pvFactor = document.getElementById('pvFactor');
  var insightsGrid = document.getElementById('insightsGrid');
  var tableHead = document.getElementById('tableHead');
  var tableBody = document.getElementById('tableBody');
  var toolChart = document.getElementById('toolChart');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'line';

  // ── Helper: Check if Chart.js is loaded ──
  function isChartJsLoaded() {
    return typeof Chart !== 'undefined';
  }

  // ── Formatting ──
  function formatNumber(num) {
    if (!isFinite(num)) return '—';
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatCurrency(num) {
    if (!isFinite(num)) return '—';
    return selectedCurrency.symbol + formatNumber(Math.round(num));
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
      case 'futureValue':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'rate':
        label.textContent = num + '%';
        break;
      case 'years':
        label.textContent = num + ' yr' + (num > 1 ? 's' : '');
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core Calculation ──
  function calculatePresentValue(FV, r, t, n) {
    var rate = r / 100;
    var periodicRate = rate / n;
    var totalPeriods = n * t;
    return FV / Math.pow(1 + periodicRate, totalPeriods);
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var FV = parseFloat(futureValue ? futureValue.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var t = parseFloat(years ? years.value : 0) || 0;
    var n = parseInt(compounding ? compounding.value : 12) || 12;

    if (FV <= 0 || t <= 0) {
      if (presentValue) presentValue.textContent = '—';
      if (totalDiscount) totalDiscount.textContent = '—';
      if (discountRate) discountRate.textContent = '—';
      if (pvFactor) pvFactor.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var PV = calculatePresentValue(FV, r, t, n);
    var discount = FV - PV;
    var factor = PV / FV;

    if (presentValue) presentValue.textContent = formatCurrency(PV);
    if (totalDiscount) totalDiscount.textContent = formatCurrency(discount);
    if (discountRate) discountRate.textContent = formatPercent(r);
    if (pvFactor) pvFactor.textContent = factor.toFixed(4);

    generateInsights(FV, PV, r, t, n, discount, factor);
    generateBreakdown(FV, r, t, n);
    updateChart(FV, r, t, n);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(FV, PV, r, t, n, discount, factor) {
    if (!insightsGrid) return;
    var insights = [];

    if (PV > 0 && FV > 0) {
      var discountPct = ((FV - PV) / FV) * 100;
      insights.push({
        icon: '📉',
        text: 'Discount: <strong>' + formatCurrency(discount) + '</strong> (' + discountPct.toFixed(1) + '% of future value)'
      });
    }

    if (factor > 0 && factor < 1) {
      insights.push({
        icon: '🔢',
        text: 'PV Factor: <strong>' + factor.toFixed(4) + '</strong> — every $1 future = $' + factor.toFixed(2) + ' today'
      });
    }

    if (r > 0 && t > 0) {
      insights.push({
        icon: '⏱️',
        text: 'At <strong>' + r + '%</strong> discount rate, value halves in ~<strong>' + (72 / r).toFixed(1) + ' years</strong> (Rule of 72)'
      });
    }

    if (discount > 0) {
      var annualDiscount = discount / t;
      insights.push({
        icon: '📊',
        text: 'Value decreases by an average of <strong>' + formatCurrency(annualDiscount) + '</strong> per year'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Present value shows what future money is worth in today\'s purchasing power'
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
  function generateBreakdown(FV, r, t, n) {
    if (!tableHead || !tableBody) return;
    var rate = r / 100;
    var periodicRate = rate / n;
    var rows = '';

    tableHead.innerHTML = '<tr><th>Year</th><th>Future Value at Year End</th><th>Present Value Today</th><th>Discount</th><th>PV Factor</th></tr>';

    for (var year = 0; year <= t; year++) {
      var periods = n * year;
      var pvAtYear = FV / Math.pow(1 + periodicRate, periods);
      var discAtYear = FV - pvAtYear;
      var factorAtYear = pvAtYear / FV;

      var isLastRow = (year === t);
      rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
        '<td><strong>' + (year === 0 ? 'Today' : year) + '</strong></td>' +
        '<td>' + formatCurrency(FV) + '</td>' +
        '<td>' + formatCurrency(pvAtYear) + '</td>' +
        '<td>' + formatCurrency(discAtYear) + '</td>' +
        '<td>' + factorAtYear.toFixed(4) + '</td>' +
      '</tr>';
    }

    tableBody.innerHTML = rows;
  }

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    var FV = parseFloat(futureValue ? futureValue.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var t = parseFloat(years ? years.value : 0) || 0;
    var n = parseInt(compounding ? compounding.value : 12) || 12;
    updateChart(FV, r, t, n);
  };

  function updateChart(FV, r, t, n) {
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

    if (FV <= 0 || t <= 0) {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: { plugins: { legend: { display: false } } }
      });
      return;
    }

    var rate = r / 100;
    var periodicRate = rate / n;
    var labels = [];
    var pvData = [];
    var discountData = [];

    for (var year = 0; year <= t; year++) {
      labels.push(year === 0 ? 'Today' : year);
      var periods = n * year;
      var pv = FV / Math.pow(1 + periodicRate, periods);
      pvData.push(pv);
      discountData.push(FV - pv);
    }

    var currencySymbol = selectedCurrency.symbol;

    var chartConfig = {
      type: currentChartType === 'bar' ? 'bar' : (currentChartType === 'donut' ? 'doughnut' : 'line'),
      data: {
        labels: labels,
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                if (currentChartType === 'donut') {
                  return context.label + ': ' + currencySymbol + context.parsed.toLocaleString('en-US', { maximumFractionDigits: 0 });
                }
                return context.dataset.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
              }
            }
          }
        }
      }
    };

    if (currentChartType === 'line') {
      chartConfig.data.datasets = [
        {
          label: 'Present Value',
          data: pvData,
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 3
        },
        {
          label: 'Discount',
          data: discountData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          fill: false,
          tension: 0.3,
          borderDash: [5, 5],
          pointRadius: 3
        }
      ];
      chartConfig.options.scales = {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return currencySymbol + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
            }
          }
        }
      };
    } else if (currentChartType === 'bar') {
      chartConfig.data.labels = ['Future Value', 'Present Value', 'Discount'];
      chartConfig.data.datasets = [{
        label: 'Amount',
        data: [FV, pvData[t], discountData[t]],
        backgroundColor: ['#6366f1', '#0d9488', '#ef4444'],
        borderRadius: 4
      }];
      chartConfig.options.scales = {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return currencySymbol + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
            }
          }
        }
      };
      chartConfig.options.plugins.legend = { display: false };
    } else if (currentChartType === 'donut') {
      chartConfig.data.labels = ['Present Value', 'Discount'];
      chartConfig.data.datasets = [{
        data: [pvData[t], discountData[t]],
        backgroundColor: ['#0d9488', '#ef4444'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }];
      chartConfig.options.plugins.legend = { position: 'bottom' };
      chartConfig.options.plugins.tooltip.callbacks.label = function(context) {
        var total = context.dataset.data.reduce(function(a, b) { return a + b; }, 0);
        var percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
        return context.label + ': ' + currencySymbol + context.parsed.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' (' + percentage + '%)';
      };
    }

    chartInstance = new Chart(ctx, chartConfig);
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (futureValue) params.set('f', futureValue.value);
    if (rate) params.set('r', rate.value);
    if (years) params.set('y', years.value);
    if (compounding) params.set('c', compounding.value);

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
        text = text.replace(/[^0-9.,\-]/g, '');
        rowData.push(text);
      });
      csv += rowData.join(',') + '\n';
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'present-value-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var pv = presentValue ? presentValue.textContent : '';
    var disc = totalDiscount ? totalDiscount.textContent : '';
    var factor = pvFactor ? pvFactor.textContent : '';
    var text = 'Present Value Result:\nPresent Value: ' + pv + '\nTotal Discount: ' + disc + '\nPV Factor: ' + factor;
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
    link.download = 'present-value-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultFV = 100000;
    var defaultR = 8;
    var defaultY = 10;

    if (futureValue) { futureValue.value = defaultFV; if (futureValueSlider) futureValueSlider.value = defaultFV; }
    if (rate) { rate.value = defaultR; if (rateSlider) rateSlider.value = defaultR; }
    if (years) { years.value = defaultY; if (yearsSlider) yearsSlider.value = defaultY; }
    if (compounding) compounding.value = '12';

    updateSliderLabel('futureValue', defaultFV);
    updateSliderLabel('rate', defaultR);
    updateSliderLabel('years', defaultY);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('f')) {
      var fVal = parseFloat(params.get('f'));
      if (!isNaN(fVal) && fVal >= 0) {
        if (futureValue) { futureValue.value = fVal; if (futureValueSlider) futureValueSlider.value = fVal; }
        updateSliderLabel('futureValue', fVal);
      }
    }
    if (params.has('r')) {
      var rVal = parseFloat(params.get('r'));
      if (!isNaN(rVal) && rVal >= 0) {
        if (rate) { rate.value = rVal; if (rateSlider) rateSlider.value = rVal; }
        updateSliderLabel('rate', rVal);
      }
    }
    if (params.has('y')) {
      var yVal = parseFloat(params.get('y'));
      if (!isNaN(yVal) && yVal > 0) {
        if (years) { years.value = yVal; if (yearsSlider) yearsSlider.value = yVal; }
        updateSliderLabel('years', yVal);
      }
    }
    if (params.has('c')) {
      var cVal = parseInt(params.get('c'));
      if (!isNaN(cVal) && compounding) compounding.value = cVal;
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
    console.warn('Present Value Calculator not loaded yet.');
  };
}