// ============================================================
// CAGR CALCULATOR
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

  var startValue = document.getElementById('startValue');
  var startValueSlider = document.getElementById('startValueSlider');
  var endValue = document.getElementById('endValue');
  var endValueSlider = document.getElementById('endValueSlider');
  var years = document.getElementById('years');
  var yearsSlider = document.getElementById('yearsSlider');

  var cagrResult = document.getElementById('cagrResult');
  var totalReturn = document.getElementById('totalReturn');
  var totalGain = document.getElementById('totalGain');
  var avgAnnualGain = document.getElementById('avgAnnualGain');
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
      case 'startValue':
      case 'endValue':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'years':
        label.textContent = num + ' yr' + (num > 1 ? 's' : '');
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core Calculation ──
  function calculateCAGR(start, end, years) {
    if (start <= 0 || end <= 0 || years <= 0) return null;
    return (Math.pow(end / start, 1 / years) - 1) * 100;
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var start = parseFloat(startValue ? startValue.value : 0) || 0;
    var end = parseFloat(endValue ? endValue.value : 0) || 0;
    var yrs = parseFloat(years ? years.value : 0) || 0;

    if (start <= 0 || end <= 0 || yrs <= 0) {
      if (cagrResult) cagrResult.textContent = '—';
      if (totalReturn) totalReturn.textContent = '—';
      if (totalGain) totalGain.textContent = '—';
      if (avgAnnualGain) avgAnnualGain.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var cagr = calculateCAGR(start, end, yrs);
    var totalReturnPct = ((end - start) / start) * 100;
    var totalGainAmt = end - start;
    var avgAnnualGainAmt = totalGainAmt / yrs;

    if (cagrResult) cagrResult.textContent = formatPercent(cagr);
    if (totalReturn) totalReturn.textContent = formatPercent(totalReturnPct);
    if (totalGain) totalGain.textContent = formatCurrency(totalGainAmt);
    if (avgAnnualGain) avgAnnualGain.textContent = formatCurrency(avgAnnualGainAmt);

    generateInsights(start, end, yrs, cagr, totalReturnPct, totalGainAmt);
    generateBreakdown(start, end, yrs);
    updateChart(start, end, yrs);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(start, end, yrs, cagr, totalReturnPct, totalGainAmt) {
    if (!insightsGrid) return;
    var insights = [];

    if (cagr !== null && isFinite(cagr)) {
      insights.push({
        icon: '📈',
        text: 'CAGR: <strong>' + cagr.toFixed(2) + '%</strong> average annual return'
      });
    }

    if (totalReturnPct > 0) {
      insights.push({
        icon: '📊',
        text: 'Total return: <strong>' + totalReturnPct.toFixed(2) + '%</strong> over ' + yrs + ' years'
      });
    } else if (totalReturnPct < 0) {
      insights.push({
        icon: '📉',
        text: 'Total loss: <strong>' + Math.abs(totalReturnPct).toFixed(2) + '%</strong> over ' + yrs + ' years'
      });
    }

    if (end > start) {
      insights.push({
        icon: '💰',
        text: 'Total gain: <strong>' + formatCurrency(totalGainAmt) + '</strong> – average of ' + formatCurrency(totalGainAmt / yrs) + ' per year'
      });
    } else if (end < start) {
      insights.push({
        icon: '💸',
        text: 'Total loss: <strong>' + formatCurrency(Math.abs(totalGainAmt)) + '</strong>'
      });
    }

    // Doubling time insight
    if (cagr !== null && cagr > 0 && isFinite(cagr)) {
      var doublingTime = 72 / cagr;
      if (doublingTime > 0 && isFinite(doublingTime)) {
        insights.push({
          icon: '⏱️',
          text: 'At this CAGR, your money would double in ~<strong>' + doublingTime.toFixed(1) + ' years</strong> (Rule of 72)'
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'CAGR measures the average annual growth rate of your investment'
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
  function generateBreakdown(start, end, yrs) {
    if (!tableHead || !tableBody) return;
    var rows = '';

    tableHead.innerHTML = '<tr><th>Year</th><th>Starting Value</th><th>Ending Value</th><th>Annual Return</th></tr>';

    var cagr = (Math.pow(end / start, 1 / yrs) - 1);

    for (var i = 0; i <= yrs; i++) {
      var yearValue = start * Math.pow(1 + cagr, i);
      var prevValue = i > 0 ? start * Math.pow(1 + cagr, i - 1) : start;
      var annualReturn = i > 0 ? ((yearValue - prevValue) / prevValue) * 100 : 0;

      var isLastRow = (i === yrs);
      rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
        '<td><strong>' + (i === 0 ? 'Start' : i) + '</strong></td>' +
        '<td>' + formatCurrency(prevValue) + '</td>' +
        '<td>' + formatCurrency(yearValue) + '</td>' +
        '<td>' + (i > 0 ? formatPercent(annualReturn) : '—') + '</td>' +
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
    var start = parseFloat(startValue ? startValue.value : 0) || 0;
    var end = parseFloat(endValue ? endValue.value : 0) || 0;
    var yrs = parseFloat(years ? years.value : 0) || 0;
    updateChart(start, end, yrs);
  };

  function updateChart(start, end, yrs) {
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

    if (start <= 0 || end <= 0 || yrs <= 0) {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: { plugins: { legend: { display: false } } }
      });
      return;
    }

    var cagr = (Math.pow(end / start, 1 / yrs) - 1);
    var labels = [];
    var values = [];
    var annualReturns = [];

    for (var i = 0; i <= yrs; i++) {
      labels.push(i === 0 ? 'Start' : i);
      var val = start * Math.pow(1 + cagr, i);
      values.push(val);
      if (i > 0) {
        var prev = start * Math.pow(1 + cagr, i - 1);
        annualReturns.push(((val - prev) / prev) * 100);
      }
    }

    var currencySymbol = selectedCurrency.symbol;

    var chartConfig = {
      type: currentChartType === 'bar' ? 'bar' : 'line',
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
                if (currentChartType === 'bar') {
                  return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
                }
                return context.dataset.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
              }
            }
          }
        }
      }
    };

    if (currentChartType === 'line' || currentChartType === 'area') {
      chartConfig.data.datasets = [{
        label: 'Investment Value',
        data: values,
        borderColor: '#0d9488',
        backgroundColor: currentChartType === 'area' ? 'rgba(13, 148, 136, 0.3)' : 'rgba(13, 148, 136, 0.1)',
        fill: currentChartType === 'area',
        tension: 0.3,
        pointRadius: 3
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
    } else if (currentChartType === 'bar') {
      chartConfig.data.datasets = [{
        label: 'Annual Return (%)',
        data: annualReturns,
        backgroundColor: annualReturns.map(function(r) {
          return r >= 0 ? '#0d9488' : '#ef4444';
        }),
        borderRadius: 4
      }];
      chartConfig.options.scales = {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toFixed(0) + '%';
            }
          }
        }
      };
      chartConfig.options.plugins.tooltip.callbacks.label = function(context) {
        return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '%';
      };
    }

    chartInstance = new Chart(ctx, chartConfig);
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (startValue) params.set('s', startValue.value);
    if (endValue) params.set('e', endValue.value);
    if (years) params.set('y', years.value);

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
    a.download = 'cagr-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var cagr = cagrResult ? cagrResult.textContent : '';
    var ret = totalReturn ? totalReturn.textContent : '';
    var gain = totalGain ? totalGain.textContent : '';
    var text = 'CAGR Result:\nCAGR: ' + cagr + '\nTotal Return: ' + ret + '\nTotal Gain: ' + gain;
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
    link.download = 'cagr-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    if (startValue) { startValue.value = '10000'; if (startValueSlider) startValueSlider.value = '10000'; }
    if (endValue) { endValue.value = '21589'; if (endValueSlider) endValueSlider.value = '21589'; }
    if (years) { years.value = '5'; if (yearsSlider) yearsSlider.value = '5'; }

    updateSliderLabel('startValue', '10000');
    updateSliderLabel('endValue', '21589');
    updateSliderLabel('years', '5');
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('s')) {
      var sVal = parseFloat(params.get('s'));
      if (!isNaN(sVal) && sVal >= 0) {
        if (startValue) { startValue.value = sVal; if (startValueSlider) startValueSlider.value = sVal; }
        updateSliderLabel('startValue', sVal);
      }
    }
    if (params.has('e')) {
      var eVal = parseFloat(params.get('e'));
      if (!isNaN(eVal) && eVal >= 0) {
        if (endValue) { endValue.value = eVal; if (endValueSlider) endValueSlider.value = eVal; }
        updateSliderLabel('endValue', eVal);
      }
    }
    if (params.has('y')) {
      var yVal = parseFloat(params.get('y'));
      if (!isNaN(yVal) && yVal > 0) {
        if (years) { years.value = yVal; if (yearsSlider) yearsSlider.value = yVal; }
        updateSliderLabel('years', yVal);
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
    console.warn('CAGR Calculator not loaded yet.');
  };
}