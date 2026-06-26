// ============================================================
// ROI CALCULATOR
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

  var initialInvestment = document.getElementById('initialInvestment');
  var initialInvestmentSlider = document.getElementById('initialInvestmentSlider');
  var finalValue = document.getElementById('finalValue');
  var finalValueSlider = document.getElementById('finalValueSlider');
  var period = document.getElementById('period');
  var periodSlider = document.getElementById('periodSlider');

  var roiResult = document.getElementById('roiResult');
  var netProfit = document.getElementById('netProfit');
  var annualizedROI = document.getElementById('annualizedROI');
  var finalValueDisplay = document.getElementById('finalValueDisplay');
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
      case 'initialInvestment':
      case 'finalValue':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'period':
        label.textContent = num + ' yr' + (num > 1 ? 's' : '');
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core Calculation ──
  function calculateROI(initial, final, yrs) {
    if (initial <= 0) return null;
    return ((final - initial) / initial) * 100;
  }

  function calculateAnnualizedROI(roi, yrs) {
    if (!yrs || yrs <= 0) return null;
    return (Math.pow(1 + (roi / 100), 1 / yrs) - 1) * 100;
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var initial = parseFloat(initialInvestment ? initialInvestment.value : 0) || 0;
    var final = parseFloat(finalValue ? finalValue.value : 0) || 0;
    var yrs = parseFloat(period ? period.value : 0) || 0;

    if (initial <= 0 || final <= 0) {
      if (roiResult) roiResult.textContent = '—';
      if (netProfit) netProfit.textContent = '—';
      if (annualizedROI) annualizedROI.textContent = '—';
      if (finalValueDisplay) finalValueDisplay.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var roi = calculateROI(initial, final, yrs);
    var profit = final - initial;
    var annualized = yrs > 0 ? calculateAnnualizedROI(roi, yrs) : null;

    if (roiResult) roiResult.textContent = roi !== null ? formatPercent(roi) : '—';
    if (netProfit) netProfit.textContent = formatCurrency(profit);
    if (annualizedROI) annualizedROI.textContent = annualized !== null ? formatPercent(annualized) : 'N/A';
    if (finalValueDisplay) finalValueDisplay.textContent = formatCurrency(final);

    generateInsights(initial, final, yrs, roi, profit, annualized);
    generateBreakdown(initial, final, yrs);
    updateChart(initial, final, yrs);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(initial, final, yrs, roi, profit, annualized) {
    if (!insightsGrid) return;
    var insights = [];

    if (roi !== null && isFinite(roi)) {
      if (roi > 0) {
        insights.push({
          icon: '📈',
          text: 'ROI: <strong>' + roi.toFixed(2) + '%</strong> — your investment grew by this much'
        });
      } else if (roi < 0) {
        insights.push({
          icon: '📉',
          text: 'ROI: <strong>' + roi.toFixed(2) + '%</strong> — your investment lost value'
        });
      } else {
        insights.push({
          icon: '⚖️',
          text: 'ROI: <strong>0%</strong> — your investment broke even'
        });
      }
    }

    if (profit > 0) {
      insights.push({
        icon: '💰',
        text: 'Net profit: <strong>' + formatCurrency(profit) + '</strong>'
      });
    } else if (profit < 0) {
      insights.push({
        icon: '💸',
        text: 'Net loss: <strong>' + formatCurrency(Math.abs(profit)) + '</strong>'
      });
    }

    if (annualized !== null && isFinite(annualized) && yrs > 0) {
      insights.push({
        icon: '📊',
        text: 'Annualized ROI: <strong>' + annualized.toFixed(2) + '%</strong> per year over ' + yrs + ' years'
      });
    }

    if (roi > 0 && yrs > 0) {
      var doublingTime = annualized && annualized > 0 ? 72 / annualized : null;
      if (doublingTime && doublingTime > 0 && isFinite(doublingTime)) {
        insights.push({
          icon: '⏱️',
          text: 'At this annualized rate, your money would double in ~<strong>' + doublingTime.toFixed(1) + ' years</strong> (Rule of 72)'
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'ROI measures the profitability of your investment'
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
  function generateBreakdown(initial, final, yrs) {
    if (!tableHead || !tableBody) return;
    var rows = '';

    tableHead.innerHTML = '<tr><th>Item</th><th>Amount</th><th>Percentage</th></tr>';

    var roi = ((final - initial) / initial) * 100;

    rows += '<tr>' +
      '<td><strong>Initial Investment</strong></td>' +
      '<td>' + formatCurrency(initial) + '</td>' +
      '<td>100%</td>' +
    '</tr>';

    if (final >= initial) {
      var profit = final - initial;
      var profitPct = (profit / initial) * 100;
      rows += '<tr class="highlight-row">' +
        '<td><strong>Profit / Gain</strong></td>' +
        '<td>' + formatCurrency(profit) + '</td>' +
        '<td>' + formatPercent(profitPct) + '</td>' +
      '</tr>';
    } else {
      var loss = initial - final;
      var lossPct = (loss / initial) * 100;
      rows += '<tr class="highlight-row">' +
        '<td><strong>Loss</strong></td>' +
        '<td>' + formatCurrency(loss) + '</td>' +
        '<td>' + formatPercent(lossPct) + '</td>' +
      '</tr>';
    }

    rows += '<tr>' +
      '<td><strong>Final Value</strong></td>' +
      '<td>' + formatCurrency(final) + '</td>' +
      '<td>' + formatPercent(100 + roi) + '</td>' +
    '</tr>';

    tableBody.innerHTML = rows;
  }

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    var initial = parseFloat(initialInvestment ? initialInvestment.value : 0) || 0;
    var final = parseFloat(finalValue ? finalValue.value : 0) || 0;
    var yrs = parseFloat(period ? period.value : 0) || 0;
    updateChart(initial, final, yrs);
  };

  function updateChart(initial, final, yrs) {
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

    if (initial <= 0 || final <= 0) {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: { plugins: { legend: { display: false } } }
      });
      return;
    }

    var currencySymbol = selectedCurrency.symbol;
    var profit = final - initial;

    if (currentChartType === 'line') {
      var labels = [];
      var values = [];
      var steps = Math.max(yrs || 10, 10);

      if (yrs > 0) {
        for (var i = 0; i <= steps; i++) {
          var t = (i / steps) * yrs;
          var val = initial + (profit * (t / yrs));
          labels.push(t === 0 ? 'Start' : t.toFixed(1));
          values.push(val);
        }
      } else {
        labels = ['Initial', 'Final'];
        values = [initial, final];
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
          labels: ['Initial Investment', 'Net Profit'],
          datasets: [{
            label: 'Amount',
            data: [initial, profit],
            backgroundColor: ['#6366f1', profit >= 0 ? '#0d9488' : '#ef4444'],
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
          labels: ['Initial Investment', 'Net Profit'],
          datasets: [{
            data: [initial, Math.max(profit, 0)],
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
    if (initialInvestment) params.set('i', initialInvestment.value);
    if (finalValue) params.set('f', finalValue.value);
    if (period) params.set('p', period.value);

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
    a.download = 'roi-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var roi = roiResult ? roiResult.textContent : '';
    var profit = netProfit ? netProfit.textContent : '';
    var annualized = annualizedROI ? annualizedROI.textContent : '';
    var text = 'ROI Result:\nROI: ' + roi + '\nNet Profit: ' + profit + '\nAnnualized ROI: ' + annualized;
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
    link.download = 'roi-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    if (initialInvestment) { initialInvestment.value = '10000'; if (initialInvestmentSlider) initialInvestmentSlider.value = '10000'; }
    if (finalValue) { finalValue.value = '15000'; if (finalValueSlider) finalValueSlider.value = '15000'; }
    if (period) { period.value = '5'; if (periodSlider) periodSlider.value = '5'; }

    updateSliderLabel('initialInvestment', '10000');
    updateSliderLabel('finalValue', '15000');
    updateSliderLabel('period', '5');
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('i')) {
      var iVal = parseFloat(params.get('i'));
      if (!isNaN(iVal) && iVal >= 0) {
        if (initialInvestment) { initialInvestment.value = iVal; if (initialInvestmentSlider) initialInvestmentSlider.value = iVal; }
        updateSliderLabel('initialInvestment', iVal);
      }
    }
    if (params.has('f')) {
      var fVal = parseFloat(params.get('f'));
      if (!isNaN(fVal) && fVal >= 0) {
        if (finalValue) { finalValue.value = fVal; if (finalValueSlider) finalValueSlider.value = fVal; }
        updateSliderLabel('finalValue', fVal);
      }
    }
    if (params.has('p')) {
      var pVal = parseFloat(params.get('p'));
      if (!isNaN(pVal) && pVal >= 0) {
        if (period) { period.value = pVal; if (periodSlider) periodSlider.value = pVal; }
        updateSliderLabel('period', pVal);
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
    console.warn('ROI Calculator not loaded yet.');
  };
}