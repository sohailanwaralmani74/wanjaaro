// ============================================================
// INFLATION CALCULATOR
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

  var startingAmount = document.getElementById('startingAmount');
  var startingAmountSlider = document.getElementById('startingAmountSlider');
  var startYear = document.getElementById('startYear');
  var endYear = document.getElementById('endYear');
  var inflationRate = document.getElementById('inflationRate');
  var inflationRateSlider = document.getElementById('inflationRateSlider');

  var adjustedValue = document.getElementById('adjustedValue');
  var purchasingPowerLoss = document.getElementById('purchasingPowerLoss');
  var totalInflation = document.getElementById('totalInflation');
  var avgAnnualInflation = document.getElementById('avgAnnualInflation');
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
      case 'startingAmount':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'inflationRate':
        label.textContent = num + '%';
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core Calculation ──
  function calculateInflation(startAmount, rate, years) {
    var r = rate / 100;
    return startAmount * Math.pow(1 + r, years);
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var startAmt = parseFloat(startingAmount ? startingAmount.value : 0) || 0;
    var startYr = parseInt(startYear ? startYear.value : 0) || 0;
    var endYr = parseInt(endYear ? endYear.value : 0) || 0;
    var rate = parseFloat(inflationRate ? inflationRate.value : 0) || 0;

    var years = endYr - startYr;

    if (startAmt <= 0 || years <= 0) {
      if (adjustedValue) adjustedValue.textContent = '—';
      if (purchasingPowerLoss) purchasingPowerLoss.textContent = '—';
      if (totalInflation) totalInflation.textContent = '—';
      if (avgAnnualInflation) avgAnnualInflation.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var adjusted = calculateInflation(startAmt, rate, years);
    var loss = adjusted - startAmt;
    var totalInfPct = ((adjusted - startAmt) / startAmt) * 100;
    var avgAnnual = rate;

    if (adjustedValue) adjustedValue.textContent = formatCurrency(adjusted);
    if (purchasingPowerLoss) purchasingPowerLoss.textContent = formatCurrency(loss);
    if (totalInflation) totalInflation.textContent = formatPercent(totalInfPct);
    if (avgAnnualInflation) avgAnnualInflation.textContent = formatPercent(avgAnnual);

    generateInsights(startAmt, adjusted, rate, years, loss, totalInfPct);
    generateBreakdown(startAmt, rate, years, startYr);
    updateChart(startAmt, rate, years, startYr);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(startAmt, adjusted, rate, years, loss, totalInfPct) {
    if (!insightsGrid) return;
    var insights = [];

    if (rate > 0 && years > 0) {
      insights.push({
        icon: '📉',
        text: 'Your <strong>' + formatCurrency(startAmt) + '</strong> will need <strong>' + formatCurrency(adjusted) + '</strong> to buy the same things in ' + years + ' years'
      });
    }

    if (loss > 0) {
      insights.push({
        icon: '💸',
        text: 'Purchasing power loss: <strong>' + formatCurrency(loss) + '</strong> (' + totalInfPct.toFixed(1) + '% total inflation)'
      });
    }

    if (rate > 0 && years > 0) {
      var halvingTime = 72 / rate;
      if (halvingTime > 0 && isFinite(halvingTime)) {
        insights.push({
          icon: '⏱️',
          text: 'At <strong>' + rate + '%</strong> inflation, purchasing power halves in ~<strong>' + halvingTime.toFixed(1) + ' years</strong> (Rule of 72)'
        });
      }
    }

    if (years > 0 && rate > 0) {
      var annualLoss = loss / years;
      insights.push({
        icon: '📊',
        text: 'Average loss in purchasing power: <strong>' + formatCurrency(annualLoss) + '</strong> per year'
      });
    }

    if (rate === 0) {
      insights.push({
        icon: '💡',
        text: 'With <strong>0% inflation</strong>, purchasing power remains unchanged over time'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Inflation erodes the purchasing power of your money over time'
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
  function generateBreakdown(startAmt, rate, years, startYr) {
    if (!tableHead || !tableBody) return;
    var rows = '';
    var r = rate / 100;

    tableHead.innerHTML = '<tr><th>Year</th><th>Value</th><th>Inflation Added</th><th>Cumulative Inflation</th></tr>';

    var cumulative = 0;
    for (var i = 0; i <= years; i++) {
      var val = startAmt * Math.pow(1 + r, i);
      var added = i > 0 ? val - (startAmt * Math.pow(1 + r, i - 1)) : 0;
      var cumPct = i > 0 ? ((Math.pow(1 + r, i) - 1) * 100) : 0;

      var isLastRow = (i === years);
      rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
        '<td><strong>' + (startYr + i) + '</strong></td>' +
        '<td>' + formatCurrency(val) + '</td>' +
        '<td>' + (i > 0 ? formatCurrency(added) : '—') + '</td>' +
        '<td>' + (i > 0 ? formatPercent(cumPct) : '—') + '</td>' +
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
    var startAmt = parseFloat(startingAmount ? startingAmount.value : 0) || 0;
    var rate = parseFloat(inflationRate ? inflationRate.value : 0) || 0;
    var years = (parseInt(endYear ? endYear.value : 0) || 0) - (parseInt(startYear ? startYear.value : 0) || 0);
    var startYr = parseInt(startYear ? startYear.value : 0) || 0;
    updateChart(startAmt, rate, years, startYr);
  };

  function updateChart(startAmt, rate, years, startYr) {
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

    if (startAmt <= 0 || years <= 0) {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: { plugins: { legend: { display: false } } }
      });
      return;
    }

    var r = rate / 100;
    var labels = [];
    var values = [];
    var inflationAdded = [];

    for (var i = 0; i <= years; i++) {
      labels.push(startYr + i);
      var val = startAmt * Math.pow(1 + r, i);
      values.push(val);
      var prev = i > 0 ? startAmt * Math.pow(1 + r, i - 1) : startAmt;
      inflationAdded.push(i > 0 ? val - prev : 0);
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
          label: 'Value',
          data: values,
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.3,
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
      var lastIdx = values.length - 1;
      chartConfig.data.labels = ['Starting Value', 'Inflation Added', 'Adjusted Value'];
      chartConfig.data.datasets = [{
        label: 'Amount',
        data: [startAmt, values[lastIdx] - startAmt, values[lastIdx]],
        backgroundColor: ['#6366f1', '#ef4444', '#0d9488'],
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
      var lastIdx2 = values.length - 1;
      chartConfig.data.labels = ['Starting Value', 'Inflation Added'];
      chartConfig.data.datasets = [{
        data: [startAmt, values[lastIdx2] - startAmt],
        backgroundColor: ['#6366f1', '#ef4444'],
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
    if (startingAmount) params.set('a', startingAmount.value);
    if (startYear) params.set('s', startYear.value);
    if (endYear) params.set('e', endYear.value);
    if (inflationRate) params.set('r', inflationRate.value);

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
    a.download = 'inflation-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var adj = adjustedValue ? adjustedValue.textContent : '';
    var loss = purchasingPowerLoss ? purchasingPowerLoss.textContent : '';
    var total = totalInflation ? totalInflation.textContent : '';
    var text = 'Inflation Result:\nAdjusted Value: ' + adj + '\nPurchasing Power Loss: ' + loss + '\nTotal Inflation: ' + total;
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
    link.download = 'inflation-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultAmt = 10000;
    var defaultStart = 2020;
    var defaultEnd = 2026;
    var defaultRate = 5;

    if (startingAmount) { startingAmount.value = defaultAmt; if (startingAmountSlider) startingAmountSlider.value = defaultAmt; }
    if (startYear) startYear.value = defaultStart;
    if (endYear) endYear.value = defaultEnd;
    if (inflationRate) { inflationRate.value = defaultRate; if (inflationRateSlider) inflationRateSlider.value = defaultRate; }

    updateSliderLabel('startingAmount', defaultAmt);
    updateSliderLabel('inflationRate', defaultRate);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('a')) {
      var aVal = parseFloat(params.get('a'));
      if (!isNaN(aVal) && aVal >= 0) {
        if (startingAmount) { startingAmount.value = aVal; if (startingAmountSlider) startingAmountSlider.value = aVal; }
        updateSliderLabel('startingAmount', aVal);
      }
    }
    if (params.has('s')) {
      var sVal = parseInt(params.get('s'));
      if (!isNaN(sVal) && sVal >= 1900 && sVal <= 2100 && startYear) startYear.value = sVal;
    }
    if (params.has('e')) {
      var eVal = parseInt(params.get('e'));
      if (!isNaN(eVal) && eVal >= 1900 && eVal <= 2100 && endYear) endYear.value = eVal;
    }
    if (params.has('r')) {
      var rVal = parseFloat(params.get('r'));
      if (!isNaN(rVal) && rVal >= 0 && rVal <= 50) {
        if (inflationRate) { inflationRate.value = rVal; if (inflationRateSlider) inflationRateSlider.value = rVal; }
        updateSliderLabel('inflationRate', rVal);
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
    console.warn('Inflation Calculator not loaded yet.');
  };
}