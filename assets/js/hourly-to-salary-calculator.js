// ============================================================
// HOURLY TO SALARY CALCULATOR
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var hourlyRate = document.getElementById('hourlyRate');
  var hourlyRateSlider = document.getElementById('hourlyRateSlider');
  var hoursPerWeek = document.getElementById('hoursPerWeek');
  var hoursPerWeekSlider = document.getElementById('hoursPerWeekSlider');
  var weeksPerYear = document.getElementById('weeksPerYear');
  var weeksPerYearSlider = document.getElementById('weeksPerYearSlider');
  var taxRate = document.getElementById('taxRate');
  var taxRateSlider = document.getElementById('taxRateSlider');

  var annualSalary = document.getElementById('annualSalary');
  var monthlySalary = document.getElementById('monthlySalary');
  var weeklySalary = document.getElementById('weeklySalary');
  var biweeklySalary = document.getElementById('biweeklySalary');
  var dailySalary = document.getElementById('dailySalary');
  var afterTaxAnnual = document.getElementById('afterTaxAnnual');
  var afterTaxMonthly = document.getElementById('afterTaxMonthly');
  var afterTaxWeekly = document.getElementById('afterTaxWeekly');
  var taxesPaid = document.getElementById('taxesPaid');
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
      case 'hourlyRate':
        label.textContent = selectedCurrency.symbol + num.toFixed(2);
        break;
      case 'hoursPerWeek':
        label.textContent = num + ' hr';
        break;
      case 'weeksPerYear':
        label.textContent = num + ' wk';
        break;
      case 'taxRate':
        label.textContent = num + '%';
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core Calculation ──
  function calculateSalary(hourly, hours, weeks, tax) {
    var annual = hourly * hours * weeks;
    var monthly = annual / 12;
    var weekly = hourly * hours;
    var biweekly = weekly * 2;
    var daily = hourly * 8;

    var taxRate = tax / 100;
    var afterTaxAnnual = annual * (1 - taxRate);
    var afterTaxMonthly = afterTaxAnnual / 12;
    var afterTaxWeekly = afterTaxAnnual / weeks;
    var taxesPaid = annual - afterTaxAnnual;

    return {
      annual: annual,
      monthly: monthly,
      weekly: weekly,
      biweekly: biweekly,
      daily: daily,
      afterTaxAnnual: afterTaxAnnual,
      afterTaxMonthly: afterTaxMonthly,
      afterTaxWeekly: afterTaxWeekly,
      taxesPaid: taxesPaid
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var hourly = parseFloat(hourlyRate ? hourlyRate.value : 0) || 0;
    var hours = parseFloat(hoursPerWeek ? hoursPerWeek.value : 0) || 0;
    var weeks = parseFloat(weeksPerYear ? weeksPerYear.value : 0) || 0;
    var tax = parseFloat(taxRate ? taxRate.value : 0) || 0;

    if (hourly <= 0 || hours <= 0 || weeks <= 0) {
      if (annualSalary) annualSalary.textContent = '—';
      if (monthlySalary) monthlySalary.textContent = '—';
      if (weeklySalary) weeklySalary.textContent = '—';
      if (biweeklySalary) biweeklySalary.textContent = '—';
      if (dailySalary) dailySalary.textContent = '—';
      if (afterTaxAnnual) afterTaxAnnual.textContent = '—';
      if (afterTaxMonthly) afterTaxMonthly.textContent = '—';
      if (afterTaxWeekly) afterTaxWeekly.textContent = '—';
      if (taxesPaid) taxesPaid.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      return;
    }

    var result = calculateSalary(hourly, hours, weeks, tax);

    if (annualSalary) annualSalary.textContent = formatCurrency(result.annual);
    if (monthlySalary) monthlySalary.textContent = formatCurrency(result.monthly);
    if (weeklySalary) weeklySalary.textContent = formatCurrency(result.weekly);
    if (biweeklySalary) biweeklySalary.textContent = formatCurrency(result.biweekly);
    if (dailySalary) dailySalary.textContent = formatCurrency(result.daily);
    if (afterTaxAnnual) afterTaxAnnual.textContent = formatCurrency(result.afterTaxAnnual);
    if (afterTaxMonthly) afterTaxMonthly.textContent = formatCurrency(result.afterTaxMonthly);
    if (afterTaxWeekly) afterTaxWeekly.textContent = formatCurrency(result.afterTaxWeekly);
    if (taxesPaid) taxesPaid.textContent = formatCurrency(result.taxesPaid);

    generateInsights(result, hourly, hours, weeks, tax);
    updateChart(result);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, hourly, hours, weeks, tax) {
    if (!insightsGrid) return;
    var insights = [];

    if (hourly > 0 && hours > 0 && weeks > 0) {
      insights.push({
        icon: '📊',
        text: 'Annual salary: <strong>' + formatCurrency(result.annual) + '</strong> at ' + hourly + '/hour'
      });

      insights.push({
        icon: '💰',
        text: 'Monthly gross: <strong>' + formatCurrency(result.monthly) + '</strong>'
      });

      if (tax > 0) {
        var taxPct = (result.taxesPaid / result.annual) * 100;
        insights.push({
          icon: '🏦',
          text: 'Estimated taxes: <strong>' + formatCurrency(result.taxesPaid) + '</strong> (' + formatPercent(taxPct) + ' of gross)'
        });
        insights.push({
          icon: '📈',
          text: 'Take-home: <strong>' + formatCurrency(result.afterTaxMonthly) + '</strong> per month'
        });
      } else {
        insights.push({
          icon: '💡',
          text: 'Add a tax rate to see your estimated take-home pay'
        });
      }

      var weeklyHours = hours * weeks;
      insights.push({
        icon: '⏱️',
        text: 'Annual working hours: <strong>' + weeklyHours + '</strong> hours/year'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter your hourly rate to see your salary breakdown'
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

    var hourly = parseFloat(hourlyRate ? hourlyRate.value : 0) || 0;
    var hours = parseFloat(hoursPerWeek ? hoursPerWeek.value : 0) || 0;
    var weeks = parseFloat(weeksPerYear ? weeksPerYear.value : 0) || 0;
    var tax = parseFloat(taxRate ? taxRate.value : 0) || 0;

    if (hourly > 0 && hours > 0 && weeks > 0) {
      var result = calculateSalary(hourly, hours, weeks, tax);
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
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Annual', 'Monthly', 'Weekly', 'Bi-Weekly', 'Daily'],
          datasets: [{
            label: 'Salary',
            data: [
              result.annual,
              result.monthly,
              result.weekly,
              result.biweekly,
              result.daily
            ],
            backgroundColor: ['#0d9488', '#6366f1', '#8b5cf6', '#f59e0b', '#ec4899'],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
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
      var taxAmount = result.taxesPaid;
      var takeHome = result.afterTaxAnnual;

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Take-Home Pay', 'Taxes'],
          datasets: [{
            data: [takeHome, taxAmount],
            backgroundColor: ['#0d9488', '#dc2626'],
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

    } else if (currentChartType === 'line') {
      var labels = [];
      var values = [];

      for (var i = 1; i <= 12; i++) {
        labels.push(i);
        values.push(result.monthly);
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monthly Income',
            data: values,
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return 'Month ' + context.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 2 });
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
    }
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (hourlyRate) params.set('h', hourlyRate.value);
    if (hoursPerWeek) params.set('w', hoursPerWeek.value);
    if (weeksPerYear) params.set('y', weeksPerYear.value);
    if (taxRate) params.set('t', taxRate.value);

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
    var hourly = parseFloat(hourlyRate ? hourlyRate.value : 0) || 0;
    var hours = parseFloat(hoursPerWeek ? hoursPerWeek.value : 0) || 0;
    var weeks = parseFloat(weeksPerYear ? weeksPerYear.value : 0) || 0;
    var tax = parseFloat(taxRate ? taxRate.value : 0) || 0;

    if (hourly <= 0 || hours <= 0 || weeks <= 0) return;

    var result = calculateSalary(hourly, hours, weeks, tax);

    var csv = 'Category,Amount\n';
    csv += 'Annual Salary,' + result.annual + '\n';
    csv += 'Monthly Salary,' + result.monthly + '\n';
    csv += 'Weekly Salary,' + result.weekly + '\n';
    csv += 'Bi-Weekly Salary,' + result.biweekly + '\n';
    csv += 'Daily Salary,' + result.daily + '\n';
    csv += 'After-Tax Annual,' + result.afterTaxAnnual + '\n';
    csv += 'After-Tax Monthly,' + result.afterTaxMonthly + '\n';
    csv += 'Taxes Paid,' + result.taxesPaid + '\n';

    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'hourly-to-salary.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var annual = annualSalary ? annualSalary.textContent : '';
    var monthly = monthlySalary ? monthlySalary.textContent : '';
    var weekly = weeklySalary ? weeklySalary.textContent : '';
    var afterTax = afterTaxMonthly ? afterTaxMonthly.textContent : '';
    var text = 'Hourly to Salary Result:\nAnnual: ' + annual + '\nMonthly: ' + monthly + '\nWeekly: ' + weekly + '\nTake-Home Monthly: ' + afterTax;
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
    link.download = 'hourly-to-salary-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultHourly = 25;
    var defaultHours = 40;
    var defaultWeeks = 52;
    var defaultTax = 20;

    if (hourlyRate) { hourlyRate.value = defaultHourly; if (hourlyRateSlider) hourlyRateSlider.value = defaultHourly; }
    if (hoursPerWeek) { hoursPerWeek.value = defaultHours; if (hoursPerWeekSlider) hoursPerWeekSlider.value = defaultHours; }
    if (weeksPerYear) { weeksPerYear.value = defaultWeeks; if (weeksPerYearSlider) weeksPerYearSlider.value = defaultWeeks; }
    if (taxRate) { taxRate.value = defaultTax; if (taxRateSlider) taxRateSlider.value = defaultTax; }

    updateSliderLabel('hourlyRate', defaultHourly);
    updateSliderLabel('hoursPerWeek', defaultHours);
    updateSliderLabel('weeksPerYear', defaultWeeks);
    updateSliderLabel('taxRate', defaultTax);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('h')) {
      var hVal = parseFloat(params.get('h'));
      if (!isNaN(hVal) && hVal >= 0) {
        if (hourlyRate) { hourlyRate.value = hVal; if (hourlyRateSlider) hourlyRateSlider.value = hVal; }
        updateSliderLabel('hourlyRate', hVal);
      }
    }
    if (params.has('w')) {
      var wVal = parseFloat(params.get('w'));
      if (!isNaN(wVal) && wVal >= 1 && wVal <= 80) {
        if (hoursPerWeek) { hoursPerWeek.value = wVal; if (hoursPerWeekSlider) hoursPerWeekSlider.value = wVal; }
        updateSliderLabel('hoursPerWeek', wVal);
      }
    }
    if (params.has('y')) {
      var yVal = parseFloat(params.get('y'));
      if (!isNaN(yVal) && yVal >= 1 && yVal <= 52) {
        if (weeksPerYear) { weeksPerYear.value = yVal; if (weeksPerYearSlider) weeksPerYearSlider.value = yVal; }
        updateSliderLabel('weeksPerYear', yVal);
      }
    }
    if (params.has('t')) {
      var tVal = parseFloat(params.get('t'));
      if (!isNaN(tVal) && tVal >= 0 && tVal <= 70) {
        if (taxRate) { taxRate.value = tVal; if (taxRateSlider) taxRateSlider.value = tVal; }
        updateSliderLabel('taxRate', tVal);
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
    console.warn('Hourly to Salary Calculator not loaded yet.');
  };
}