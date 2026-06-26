// ============================================================
// FUTURE VALUE CALCULATOR
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

  var principal = document.getElementById('principal');
  var principalSlider = document.getElementById('principalSlider');
  var monthlyContribution = document.getElementById('monthlyContribution');
  var monthlyContributionSlider = document.getElementById('monthlyContributionSlider');
  var rate = document.getElementById('rate');
  var rateSlider = document.getElementById('rateSlider');
  var years = document.getElementById('years');
  var yearsSlider = document.getElementById('yearsSlider');
  var compounding = document.getElementById('compounding');

  var futureValue = document.getElementById('futureValue');
  var totalContributions = document.getElementById('totalContributions');
  var totalInterest = document.getElementById('totalInterest');
  var growthMultiple = document.getElementById('growthMultiple');
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
      case 'principal':
      case 'monthlyContribution':
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
  function calculateFutureValue(P, monthly, r, t, n) {
    var rate = r / 100;
    var monthlyRate = rate / n;
    var totalPeriods = n * t;

    var futureValue = P * Math.pow(1 + monthlyRate, totalPeriods);

    if (monthly > 0) {
      var futureValueContributions = monthly * ((Math.pow(1 + monthlyRate, totalPeriods) - 1) / monthlyRate);
      futureValue += futureValueContributions;
    }

    return futureValue;
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var P = parseFloat(principal ? principal.value : 0) || 0;
    var monthly = parseFloat(monthlyContribution ? monthlyContribution.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var t = parseFloat(years ? years.value : 0) || 0;
    var n = parseInt(compounding ? compounding.value : 12) || 12;

    if (P <= 0 && monthly <= 0) {
      if (futureValue) futureValue.textContent = '—';
      if (totalContributions) totalContributions.textContent = '—';
      if (totalInterest) totalInterest.textContent = '—';
      if (growthMultiple) growthMultiple.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var totalMonths = t * 12;
    var totalContrib = P + (monthly * totalMonths);
    var fv = calculateFutureValue(P, monthly, r, t, n);
    var interestEarned = fv - totalContrib;
    var multiple = P > 0 ? fv / P : 0;

    if (futureValue) futureValue.textContent = formatCurrency(fv);
    if (totalContributions) totalContributions.textContent = formatCurrency(totalContrib);
    if (totalInterest) totalInterest.textContent = formatCurrency(interestEarned);
    if (growthMultiple) growthMultiple.textContent = multiple > 0 ? multiple.toFixed(2) + '×' : '—';

    generateInsights(P, monthly, r, t, n, fv, totalContrib, interestEarned, multiple);
    generateBreakdown(P, monthly, r, t, n);
    updateChart(P, monthly, r, t, n);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(P, monthly, r, t, n, fv, totalContrib, interestEarned, multiple) {
    if (!insightsGrid) return;
    var insights = [];

    if (r > 0 && t > 0) {
      var yearsToDouble = 72 / r;
      insights.push({
        icon: '⏱️',
        text: 'Your money will double in <strong>' + yearsToDouble.toFixed(1) + ' years</strong> (Rule of 72)'
      });
    }

    if (interestEarned > 0 && totalContrib > 0) {
      var ratio = interestEarned / totalContrib;
      if (ratio > 1) {
        insights.push({
          icon: '🎯',
          text: 'You\'ll earn <strong>more in interest (' + formatCurrency(interestEarned) + ')</strong> than you contributed (' + formatCurrency(totalContrib) + ')'
        });
      } else {
        insights.push({
          icon: '📈',
          text: 'Interest earned: <strong>' + formatCurrency(interestEarned) + '</strong> on contributions of ' + formatCurrency(totalContrib)
        });
      }
    }

    if (multiple > 1) {
      insights.push({
        icon: '📊',
        text: 'Your money grew <strong>' + multiple.toFixed(1) + '×</strong> from your initial investment'
      });
    }

    if (r > 0 && t > 0) {
      var annualFV = calculateFutureValue(P, monthly, r, t, 1);
      var dailyFV = calculateFutureValue(P, monthly, r, t, 365);
      var diff = dailyFV - annualFV;
      if (diff > 0) {
        insights.push({
          icon: '🔄',
          text: 'Daily vs Annual compounding adds <strong>' + formatCurrency(diff) + '</strong> extra over ' + t + ' years'
        });
      }
    }

    if (monthly === 0 && P > 0) {
      var growth = ((fv / P) - 1) * 100;
      insights.push({
        icon: '📊',
        text: 'Your investment grew by <strong>' + growth.toFixed(1) + '%</strong> over ' + t + ' years'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Future value shows how much your investment will be worth over time'
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
  function generateBreakdown(P, monthly, r, t, n) {
    if (!tableHead || !tableBody) return;
    var rate = r / 100;
    var monthlyRate = rate / n;
    var balance = P;
    var rows = '';

    tableHead.innerHTML = '<tr><th>Year</th><th>Starting Balance</th><th>Contributions</th><th>Interest Earned</th><th>Ending Balance</th></tr>';

    for (var year = 1; year <= t; year++) {
      var startBalance = balance;
      var yearContrib = 0;
      var yearInterest = 0;
      for (var month = 1; month <= 12; month++) {
        var interest = balance * monthlyRate;
        yearInterest += interest;
        balance += interest;
        if (monthly > 0) {
          balance += monthly;
          yearContrib += monthly;
        }
      }
      var isLastRow = (year === t);
      rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
        '<td><strong>' + year + '</strong></td>' +
        '<td>' + formatCurrency(startBalance) + '</td>' +
        '<td>' + formatCurrency(yearContrib) + '</td>' +
        '<td>' + formatCurrency(yearInterest) + '</td>' +
        '<td><strong>' + formatCurrency(balance) + '</strong></td>' +
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
    var P = parseFloat(principal ? principal.value : 0) || 0;
    var monthly = parseFloat(monthlyContribution ? monthlyContribution.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var t = parseFloat(years ? years.value : 0) || 0;
    var n = parseInt(compounding ? compounding.value : 12) || 12;
    updateChart(P, monthly, r, t, n);
  };

  function updateChart(P, monthly, r, t, n) {
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

    if (P <= 0 && monthly <= 0) {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: { plugins: { legend: { display: false } } }
      });
      return;
    }

    var rate = r / 100;
    var monthlyRate = rate / n;
    var balance = P;
    var totalContrib = P;
    var labels = [], balanceData = [], contributionData = [], interestData = [];

    for (var year = 0; year <= t; year++) {
      labels.push(year);
      if (year === 0) {
        balanceData.push(P);
        contributionData.push(P);
        interestData.push(0);
        continue;
      }
      var yearContrib = 0, yearInterest = 0;
      for (var month = 1; month <= 12; month++) {
        var interest = balance * monthlyRate;
        yearInterest += interest;
        balance += interest;
        if (monthly > 0) {
          balance += monthly;
          yearContrib += monthly;
        }
      }
      totalContrib += yearContrib;
      balanceData.push(balance);
      contributionData.push(totalContrib);
      interestData.push(balance - totalContrib);
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
                return context.dataset.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
              }
            }
          }
        }
      }
    };

    if (currentChartType === 'line' || currentChartType === 'area') {
      chartConfig.data.datasets = [
        {
          label: 'Balance',
          data: balanceData,
          borderColor: '#0d9488',
          backgroundColor: currentChartType === 'area' ? 'rgba(13, 148, 136, 0.3)' : 'rgba(13, 148, 136, 0.1)',
          fill: currentChartType === 'area',
          tension: 0.3,
          pointRadius: 2
        },
        {
          label: 'Contributions',
          data: contributionData,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          fill: false,
          tension: 0.3,
          borderDash: [5, 5],
          pointRadius: 2
        }
      ];
      if (currentChartType === 'area') {
        chartConfig.data.datasets = [chartConfig.data.datasets[0]];
      }
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
      var lastIdx = balanceData.length - 1;
      chartConfig.data.labels = ['Contributions', 'Interest Earned'];
      chartConfig.data.datasets = [{
        label: 'Breakdown',
        data: [contributionData[lastIdx] || 0, interestData[lastIdx] || 0],
        backgroundColor: ['#6366f1', '#0d9488'],
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
      var lastIdx2 = balanceData.length - 1;
      chartConfig.data.labels = ['Contributions', 'Interest Earned'];
      chartConfig.data.datasets = [{
        data: [contributionData[lastIdx2] || 0, interestData[lastIdx2] || 0],
        backgroundColor: ['#6366f1', '#0d9488'],
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
    if (principal) params.set('p', principal.value);
    if (monthlyContribution) params.set('m', monthlyContribution.value);
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
    a.download = 'future-value-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var fv = futureValue ? futureValue.textContent : '';
    var contrib = totalContributions ? totalContributions.textContent : '';
    var interest = totalInterest ? totalInterest.textContent : '';
    var multiple = growthMultiple ? growthMultiple.textContent : '';
    var text = 'Future Value Result:\nFuture Value: ' + fv + '\nTotal Contributions: ' + contrib + '\nTotal Interest: ' + interest + '\nGrowth Multiple: ' + multiple;
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
    link.download = 'future-value-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultP = (ranges.principal_amount && ranges.principal_amount.default) || 10000;
    var defaultM = (ranges.monthly_contribution && ranges.monthly_contribution.default) || 1000;
    var defaultR = (ranges.interest_rate && ranges.interest_rate.default) || 8;
    var defaultY = (ranges.investment_horizon_years && ranges.investment_horizon_years.default) || 10;

    if (principal) { principal.value = defaultP; if (principalSlider) principalSlider.value = defaultP; }
    if (monthlyContribution) { monthlyContribution.value = defaultM; if (monthlyContributionSlider) monthlyContributionSlider.value = defaultM; }
    if (rate) { rate.value = defaultR; if (rateSlider) rateSlider.value = defaultR; }
    if (years) { years.value = defaultY; if (yearsSlider) yearsSlider.value = defaultY; }
    if (compounding) compounding.value = '12';

    updateSliderLabel('principal', defaultP);
    updateSliderLabel('monthlyContribution', defaultM);
    updateSliderLabel('rate', defaultR);
    updateSliderLabel('years', defaultY);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('p')) {
      var pVal = parseFloat(params.get('p'));
      if (!isNaN(pVal) && pVal >= 0) {
        if (principal) { principal.value = pVal; if (principalSlider) principalSlider.value = pVal; }
        updateSliderLabel('principal', pVal);
      }
    }
    if (params.has('m')) {
      var mVal = parseFloat(params.get('m'));
      if (!isNaN(mVal) && mVal >= 0) {
        if (monthlyContribution) { monthlyContribution.value = mVal; if (monthlyContributionSlider) monthlyContributionSlider.value = mVal; }
        updateSliderLabel('monthlyContribution', mVal);
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
    console.warn('Future Value Calculator not loaded yet.');
  };
}