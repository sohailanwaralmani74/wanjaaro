// ============================================================
// INVESTMENT RETURN CALCULATOR
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

  var totalReturn = document.getElementById('totalReturn');
  var annualizedReturn = document.getElementById('annualizedReturn');
  var netGain = document.getElementById('netGain');
  var finalValue = document.getElementById('finalValue');
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
  function calculateTotalReturn(start, end) {
    if (start <= 0) return null;
    return ((end - start) / start) * 100;
  }

  function calculateAnnualizedReturn(start, end, yrs) {
    if (start <= 0 || yrs <= 0) return null;
    return (Math.pow(end / start, 1 / yrs) - 1) * 100;
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var start = parseFloat(startValue ? startValue.value : 0) || 0;
    var end = parseFloat(endValue ? endValue.value : 0) || 0;
    var yrs = parseFloat(years ? years.value : 0) || 0;

    if (start <= 0 || end <= 0) {
      if (totalReturn) totalReturn.textContent = '—';
      if (annualizedReturn) annualizedReturn.textContent = '—';
      if (netGain) netGain.textContent = '—';
      if (finalValue) finalValue.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var totalRet = calculateTotalReturn(start, end);
    var annualRet = yrs > 0 ? calculateAnnualizedReturn(start, end, yrs) : null;
    var net = end - start;

    if (totalReturn) totalReturn.textContent = totalRet !== null ? formatPercent(totalRet) : '—';
    if (annualizedReturn) annualizedReturn.textContent = annualRet !== null ? formatPercent(annualRet) : 'N/A';
    if (netGain) netGain.textContent = formatCurrency(net);
    if (finalValue) finalValue.textContent = formatCurrency(end);

    generateInsights(start, end, yrs, totalRet, annualRet, net);
    generateBreakdown(start, end, yrs);
    updateChart(start, end, yrs);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(start, end, yrs, totalRet, annualRet, net) {
    if (!insightsGrid) return;
    var insights = [];

    if (totalRet !== null && isFinite(totalRet)) {
      if (totalRet > 0) {
        insights.push({
          icon: '📈',
          text: 'Total return: <strong>' + totalRet.toFixed(2) + '%</strong> — your investment grew'
        });
      } else if (totalRet < 0) {
        insights.push({
          icon: '📉',
          text: 'Total return: <strong>' + totalRet.toFixed(2) + '%</strong> — your investment declined'
        });
      } else {
        insights.push({
          icon: '⚖️',
          text: 'Total return: <strong>0%</strong> — you broke even'
        });
      }
    }

    if (net > 0) {
      insights.push({
        icon: '💰',
        text: 'Net gain: <strong>' + formatCurrency(net) + '</strong>'
      });
    } else if (net < 0) {
      insights.push({
        icon: '💸',
        text: 'Net loss: <strong>' + formatCurrency(Math.abs(net)) + '</strong>'
      });
    }

    if (annualRet !== null && isFinite(annualRet) && yrs > 0) {
      insights.push({
        icon: '📊',
        text: 'Annualized return: <strong>' + annualRet.toFixed(2) + '%</strong> per year over ' + yrs + ' years'
      });
    }

    if (totalRet > 0 && yrs > 0 && annualRet && annualRet > 0) {
      var doublingTime = 72 / annualRet;
      if (doublingTime > 0 && isFinite(doublingTime)) {
        insights.push({
          icon: '⏱️',
          text: 'At this rate, your money doubles in ~<strong>' + doublingTime.toFixed(1) + ' years</strong> (Rule of 72)'
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Investment return measures the profit or loss on your investment'
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

    if (yrs <= 0) {
      // If no years, show a simple summary
      rows += '<tr>' +
        '<td><strong>Start</strong></td>' +
        '<td>' + formatCurrency(start) + '</td>' +
        '<td>' + formatCurrency(end) + '</td>' +
        '<td>' + formatPercent(((end - start) / start) * 100) + '</td>' +
      '</tr>';
    } else {
      var totalRet = (end - start) / start;
      var cagr = Math.pow(1 + totalRet, 1 / yrs) - 1;

      for (var i = 0; i <= yrs; i++) {
        var val = start * Math.pow(1 + cagr, i);
        var prev = i > 0 ? start * Math.pow(1 + cagr, i - 1) : start;
        var annualRet = i > 0 ? ((val - prev) / prev) * 100 : 0;

        var isLastRow = (i === yrs);
        rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
          '<td><strong>' + (i === 0 ? 'Start' : i) + '</strong></td>' +
          '<td>' + formatCurrency(prev) + '</td>' +
          '<td>' + formatCurrency(val) + '</td>' +
          '<td>' + (i > 0 ? formatPercent(annualRet) : '—') + '</td>' +
        '</tr>';
      }
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

    if (start <= 0 || end <= 0) {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: { plugins: { legend: { display: false } } }
      });
      return;
    }

    var currencySymbol = selectedCurrency.symbol;
    var net = end - start;

    if (currentChartType === 'line') {
      var labels = [];
      var values = [];
      var steps = Math.max(yrs || 10, 10);

      if (yrs > 0) {
        var totalRet = (end - start) / start;
        var cagr = Math.pow(1 + totalRet, 1 / yrs) - 1;
        for (var i = 0; i <= steps; i++) {
          var t = (i / steps) * yrs;
          var val = start * Math.pow(1 + cagr, t);
          labels.push(t === 0 ? 'Start' : t.toFixed(1));
          values.push(val);
        }
      } else {
        labels = ['Start', 'End'];
        values = [start, end];
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Investment Value',
            data: values,
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 3
          }]
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

    } else if (currentChartType === 'bar') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Initial Investment', 'Net Gain / Loss'],
          datasets: [{
            label: 'Amount',
            data: [start, net],
            backgroundColor: ['#6366f1', net >= 0 ? '#0d9488' : '#ef4444'],
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
                  return context.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
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
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Initial Investment', 'Net Gain'],
          datasets: [{
            data: [start, Math.max(net, 0)],
            backgroundColor: ['#6366f1', '#0d9488'],
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
    a.download = 'investment-return-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var total = totalReturn ? totalReturn.textContent : '';
    var annual = annualizedReturn ? annualizedReturn.textContent : '';
    var gain = netGain ? netGain.textContent : '';
    var text = 'Investment Return Result:\nTotal Return: ' + total + '\nAnnualized Return: ' + annual + '\nNet Gain/Loss: ' + gain;
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
    link.download = 'investment-return-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    if (startValue) { startValue.value = '10000'; if (startValueSlider) startValueSlider.value = '10000'; }
    if (endValue) { endValue.value = '15000'; if (endValueSlider) endValueSlider.value = '15000'; }
    if (years) { years.value = '5'; if (yearsSlider) yearsSlider.value = '5'; }

    updateSliderLabel('startValue', '10000');
    updateSliderLabel('endValue', '15000');
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
      if (!isNaN(yVal) && yVal >= 0) {
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
    console.warn('Investment Return Calculator not loaded yet.');
  };
}