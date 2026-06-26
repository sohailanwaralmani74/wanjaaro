// ============================================================
// DOLLAR COST AVERAGING CALCULATOR (No Comparison)
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var initialCapital = document.getElementById('initialCapital');
  var initialCapitalSlider = document.getElementById('initialCapitalSlider');
  var monthlyInvestment = document.getElementById('monthlyInvestment');
  var monthlyInvestmentSlider = document.getElementById('monthlyInvestmentSlider');
  var rate = document.getElementById('rate');
  var rateSlider = document.getElementById('rateSlider');
  var years = document.getElementById('years');
  var yearsSlider = document.getElementById('yearsSlider');
  var compounding = document.getElementById('compounding');

  var finalAssetValue = document.getElementById('finalAssetValue');
  var totalInvested = document.getElementById('totalInvested');
  var totalReturn = document.getElementById('totalReturn');
  var totalProfit = document.getElementById('totalProfit');
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
      case 'initialCapital':
      case 'monthlyInvestment':
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
  function calculateDCA(initial, monthly, rate, years, frequency) {var r = rate / 100;
var periodicRate = r / frequency;
var periodsPerMonth = frequency / 12;
var totalMonths = years * 12;
var growthPerMonth = Math.pow(1 + periodicRate, periodsPerMonth);
var data = [];

var balance = initial;          // initial capital invested at t=0
var contributionTotal = initial;

for (var i = 0; i < totalMonths; i++) {
  balance = growthPerMonth * (balance + monthly);
  contributionTotal += monthly;
  data.push({
    month: i + 1,
    value: balance,
    contribution: contributionTotal
  });
}

var initialFV = initial * Math.pow(growthPerMonth, totalMonths);
var totalInvested = initial + (monthly * totalMonths);

return {
  finalValue: balance,
  totalInvested: totalInvested,
  return: ((balance - totalInvested) / totalInvested) * 100,
  profit: balance - totalInvested,
  data: data,
  initialFV: initialFV
};
}

  // ── Main Calculate ──
  window.calculate = function() {
    var initial = parseFloat(initialCapital ? initialCapital.value : 0) || 0;
    var monthly = parseFloat(monthlyInvestment ? monthlyInvestment.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var yrs = parseFloat(years ? years.value : 0) || 0;
    var freq = parseInt(compounding ? compounding.value : 12) || 12;

    if (initial <= 0 && monthly <= 0) {
      if (finalAssetValue) finalAssetValue.textContent = '—';
      if (totalInvested) totalInvested.textContent = '—';
      if (totalReturn) totalReturn.textContent = '—';
      if (totalProfit) totalProfit.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var result = calculateDCA(initial, monthly, r, yrs, freq);

    if (finalAssetValue) finalAssetValue.textContent = formatCurrency(result.finalValue);
    if (totalInvested) totalInvested.textContent = formatCurrency(result.totalInvested);
    if (totalReturn) totalReturn.textContent = formatPercent(result.return);
    if (totalProfit) totalProfit.textContent = formatCurrency(result.profit);

    generateInsights(result, yrs);
    generateBreakdown(result, yrs);
    updateChart(result, yrs);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, yrs) {
    if (!insightsGrid) return;
    var insights = [];

    if (result.return > 0) {
      insights.push({
        icon: '📈',
        text: 'Your investment grew by <strong>' + formatPercent(result.return) + '</strong> over ' + yrs + ' years'
      });
    }

    if (result.profit > 0) {
      insights.push({
        icon: '💰',
        text: 'Total profit: <strong>' + formatCurrency(result.profit) + '</strong>'
      });
    }

    var totalMonths = yrs * 12;
    var totalContrib = result.totalInvested;
    var ratio = result.profit / totalContrib;
    if (ratio > 0.5) {
      insights.push({
        icon: '🎯',
        text: 'You earned <strong>' + formatPercent((result.profit / totalContrib) * 100) + '</strong> of your total invested amount'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Regular investments with compounding grow your wealth over time'
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
  function generateBreakdown(result, yrs) {
  if (!tableHead || !tableBody) return;
  var rows = '';

  tableHead.innerHTML = '<tr><th>Year</th><th>Starting Balance</th><th>Contributions</th><th>Interest Earned</th><th>Ending Balance</th></tr>';

  var monthly = parseFloat(monthlyInvestment ? monthlyInvestment.value : 0) || 0;
  var initial = parseFloat(initialCapital ? initialCapital.value : 0) || 0;
  var annualContrib = monthly * 12;
  var totalMonths = yrs * 12;

  // Starting balance is the initial capital at Year 1
  var balance = initial;

  for (var year = 1; year <= yrs; year++) {
    var startBalance = balance;
    
    // Contributions this year (just monthly contributions, NOT including initial)
    var yearContrib = annualContrib;
    
    // Find ending balance after this year from result data
    var endIndex = year * 12 - 1;
    var endBalance = result.data[endIndex].value;
    
    // Interest earned this year
    var yearInterest = endBalance - startBalance - yearContrib;

    var isLastRow = (year === yrs);
    rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
      '<td><strong>' + year + '</strong></td>' +
      '<td>' + formatCurrency(startBalance) + '</td>' +
      '<td>' + formatCurrency(yearContrib) + '</td>' +
      '<td>' + formatCurrency(yearInterest) + '</td>' +
      '<td><strong>' + formatCurrency(endBalance) + '</strong></td>' +
    '</tr>';

    balance = endBalance;
  }

  tableBody.innerHTML = rows;
}

  // ── Chart Functions ──
  window.switchChart = function(type, btn) {
    currentChartType = type;
    var tabs = document.querySelectorAll('.chart-tab');
    tabs.forEach(function(tab) { tab.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    var initial = parseFloat(initialCapital ? initialCapital.value : 0) || 0;
    var monthly = parseFloat(monthlyInvestment ? monthlyInvestment.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var yrs = parseFloat(years ? years.value : 0) || 0;
    var freq = parseInt(compounding ? compounding.value : 12) || 12;

    if (initial > 0 || monthly > 0) {
      var result = calculateDCA(initial, monthly, r, yrs, freq);
      updateChart(result, yrs);
    }
  };

  function updateChart(result, yrs) {
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
    var totalMonths = yrs * 12;
    var data = result.data;

    if (currentChartType === 'line') {
      var labels = [];
      var values = [];
      var step = Math.max(1, Math.floor(totalMonths / 20));

      for (var i = 0; i <= totalMonths; i += step) {
        if (i === 0) {
          labels.push('Start');
          values.push(parseFloat(initialCapital ? initialCapital.value : 0) || 0);
        } else {
          var idx = Math.min(i, totalMonths) - 1;
          labels.push('M' + i);
          values.push(data[idx].value);
        }
      }
      // Ensure last point is included
      if (totalMonths % step !== 0) {
        labels.push('End');
        values.push(data[totalMonths - 1].value);
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Portfolio Value',
            data: values,
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return 'Value: ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
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
      var lastIdx = totalMonths - 1;
      var totalContrib = result.totalInvested;
      var profit = result.profit;

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Contributions', 'Total Profit'],
          datasets: [{
            label: 'Amount',
            data: [totalContrib, profit],
            backgroundColor: ['#6366f1', '#0d9488'],
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
      var lastIdx2 = totalMonths - 1;
      var totalContrib2 = result.totalInvested;
      var profit2 = result.profit;

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Total Contributions', 'Total Profit'],
          datasets: [{
            data: [totalContrib2, Math.max(profit2, 0)],
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
    if (initialCapital) params.set('i', initialCapital.value);
    if (monthlyInvestment) params.set('m', monthlyInvestment.value);
    if (rate) params.set('r', rate.value);
    if (years) params.set('y', years.value);
    if (compounding) params.set('f', compounding.value);

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
    a.download = 'dca-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var fv = finalAssetValue ? finalAssetValue.textContent : '';
    var invested = totalInvested ? totalInvested.textContent : '';
    var ret = totalReturn ? totalReturn.textContent : '';
    var profit = totalProfit ? totalProfit.textContent : '';
    var text = 'DCA Result:\nFinal Asset Value: ' + fv + '\nTotal Invested: ' + invested + '\nTotal Return: ' + ret + '\nTotal Profit: ' + profit;
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
    link.download = 'dca-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultInitial = 10000;
    var defaultMonthly = 1000;
    var defaultRate = 8;
    var defaultYears = 20;
    var defaultFreq = 12;

    if (initialCapital) { initialCapital.value = defaultInitial; if (initialCapitalSlider) initialCapitalSlider.value = defaultInitial; }
    if (monthlyInvestment) { monthlyInvestment.value = defaultMonthly; if (monthlyInvestmentSlider) monthlyInvestmentSlider.value = defaultMonthly; }
    if (rate) { rate.value = defaultRate; if (rateSlider) rateSlider.value = defaultRate; }
    if (years) { years.value = defaultYears; if (yearsSlider) yearsSlider.value = defaultYears; }
    if (compounding) compounding.value = defaultFreq;

    updateSliderLabel('initialCapital', defaultInitial);
    updateSliderLabel('monthlyInvestment', defaultMonthly);
    updateSliderLabel('rate', defaultRate);
    updateSliderLabel('years', defaultYears);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('i')) {
      var iVal = parseFloat(params.get('i'));
      if (!isNaN(iVal) && iVal >= 0) {
        if (initialCapital) { initialCapital.value = iVal; if (initialCapitalSlider) initialCapitalSlider.value = iVal; }
        updateSliderLabel('initialCapital', iVal);
      }
    }
    if (params.has('m')) {
      var mVal = parseFloat(params.get('m'));
      if (!isNaN(mVal) && mVal >= 0) {
        if (monthlyInvestment) { monthlyInvestment.value = mVal; if (monthlyInvestmentSlider) monthlyInvestmentSlider.value = mVal; }
        updateSliderLabel('monthlyInvestment', mVal);
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
    if (params.has('f')) {
      var fVal = parseInt(params.get('f'));
      if (!isNaN(fVal) && compounding) compounding.value = fVal;
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
    console.warn('Dollar Cost Averaging Calculator not loaded yet.');
  };
}