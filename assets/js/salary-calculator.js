// ============================================================
// SALARY CALCULATOR (CORRECTED)
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var annualSalary = document.getElementById('annualSalary');
  var annualSalarySlider = document.getElementById('annualSalarySlider');
  var hoursPerWeek = document.getElementById('hoursPerWeek');
  var hoursPerWeekSlider = document.getElementById('hoursPerWeekSlider');
  var weeksPerYear = document.getElementById('weeksPerYear');
  var weeksPerYearSlider = document.getElementById('weeksPerYearSlider');
  var taxRate = document.getElementById('taxRate');
  var taxRateSlider = document.getElementById('taxRateSlider');

  var hourlyRate = document.getElementById('hourlyRate');
  var dailyRate = document.getElementById('dailyRate');
  var weeklyPay = document.getElementById('weeklyPay');
  var biweeklyPay = document.getElementById('biweeklyPay');
  var monthlyPay = document.getElementById('monthlyPay');
  var afterTaxAnnual = document.getElementById('afterTaxAnnual');
  var afterTaxMonthly = document.getElementById('afterTaxMonthly');
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
      case 'annualSalary':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
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

  // ── Core Calculation (FIXED) ──
  function calculateSalary(annual, hours, weeks, tax) {
    var hourly = annual / (hours * weeks);
    var daily = hourly * 8; // Standard 8-hour workday
    var weekly = hourly * hours;
    var biweekly = weekly * 2;
    var monthly = annual / 12;

    var taxRate = tax / 100;
    var afterTaxAnnual = annual * (1 - taxRate);
    var afterTaxMonthly = afterTaxAnnual / 12;
    var taxesPaid = annual - afterTaxAnnual;

    return {
      hourlyRate: hourly,
      dailyRate: daily,
      weeklyPay: weekly,
      biweeklyPay: biweekly,
      monthlyPay: monthly,
      afterTaxAnnual: afterTaxAnnual,
      afterTaxMonthly: afterTaxMonthly,
      taxesPaid: taxesPaid
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var annual = parseFloat(annualSalary ? annualSalary.value : 0) || 0;
    var hours = parseFloat(hoursPerWeek ? hoursPerWeek.value : 0) || 0;
    var weeks = parseFloat(weeksPerYear ? weeksPerYear.value : 0) || 0;
    var tax = parseFloat(taxRate ? taxRate.value : 0) || 0;

    if (annual <= 0 || hours <= 0 || weeks <= 0) {
      if (hourlyRate) hourlyRate.textContent = '—';
      if (dailyRate) dailyRate.textContent = '—';
      if (weeklyPay) weeklyPay.textContent = '—';
      if (biweeklyPay) biweeklyPay.textContent = '—';
      if (monthlyPay) monthlyPay.textContent = '—';
      if (afterTaxAnnual) afterTaxAnnual.textContent = '—';
      if (afterTaxMonthly) afterTaxMonthly.textContent = '—';
      if (taxesPaid) taxesPaid.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      return;
    }

    var result = calculateSalary(annual, hours, weeks, tax);

    if (hourlyRate) hourlyRate.textContent = formatCurrency(result.hourlyRate);
    if (dailyRate) dailyRate.textContent = formatCurrency(result.dailyRate);
    if (weeklyPay) weeklyPay.textContent = formatCurrency(result.weeklyPay);
    if (biweeklyPay) biweeklyPay.textContent = formatCurrency(result.biweeklyPay);
    if (monthlyPay) monthlyPay.textContent = formatCurrency(result.monthlyPay);
    if (afterTaxAnnual) afterTaxAnnual.textContent = formatCurrency(result.afterTaxAnnual);
    if (afterTaxMonthly) afterTaxMonthly.textContent = formatCurrency(result.afterTaxMonthly);
    if (taxesPaid) taxesPaid.textContent = formatCurrency(result.taxesPaid);

    generateInsights(result, annual, hours, weeks, tax);
    updateChart(result, annual);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, annual, hours, weeks, tax) {
    if (!insightsGrid) return;
    var insights = [];

    if (annual > 0 && hours > 0 && weeks > 0) {
      insights.push({
        icon: '📊',
        text: 'Hourly rate: <strong>' + formatCurrency(result.hourlyRate) + '</strong> based on ' + hours + ' hours/week'
      });

      insights.push({
        icon: '💰',
        text: 'Monthly gross pay: <strong>' + formatCurrency(result.monthlyPay) + '</strong>'
      });

      if (tax > 0) {
        var taxPct = (result.taxesPaid / annual) * 100;
        insights.push({
          icon: '🏦',
          text: 'Estimated taxes: <strong>' + formatCurrency(result.taxesPaid) + '</strong> (' + formatPercent(taxPct) + ' of gross)'
        });
        insights.push({
          icon: '📈',
          text: 'Take-home pay: <strong>' + formatCurrency(result.afterTaxMonthly) + '</strong> per month'
        });
      } else {
        insights.push({
          icon: '💡',
          text: 'Set your tax rate above to see your take-home pay'
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
        text: 'Enter your annual salary to see the breakdown'
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

    var annual = parseFloat(annualSalary ? annualSalary.value : 0) || 0;
    var hours = parseFloat(hoursPerWeek ? hoursPerWeek.value : 0) || 0;
    var weeks = parseFloat(weeksPerYear ? weeksPerYear.value : 0) || 0;
    var tax = parseFloat(taxRate ? taxRate.value : 0) || 0;

    if (annual > 0 && hours > 0 && weeks > 0) {
      var result = calculateSalary(annual, hours, weeks, tax);
      updateChart(result, annual);
    }
  };

  function updateChart(result, annual) {
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
          labels: ['Hourly', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly'],
          datasets: [{
            label: 'Pay Amount',
            data: [
              result.hourlyRate,
              result.dailyRate,
              result.weeklyPay,
              result.biweeklyPay,
              result.monthlyPay
            ],
            backgroundColor: ['#6366f1', '#8b5cf6', '#0d9488', '#14b8a6', '#f59e0b'],
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
        values.push(annual / 12);
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monthly Pay',
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
    if (annualSalary) params.set('a', annualSalary.value);
    if (hoursPerWeek) params.set('h', hoursPerWeek.value);
    if (weeksPerYear) params.set('w', weeksPerYear.value);
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
    var annual = parseFloat(annualSalary ? annualSalary.value : 0) || 0;
    var hours = parseFloat(hoursPerWeek ? hoursPerWeek.value : 0) || 0;
    var weeks = parseFloat(weeksPerYear ? weeksPerYear.value : 0) || 0;
    var tax = parseFloat(taxRate ? taxRate.value : 0) || 0;

    if (annual <= 0 || hours <= 0 || weeks <= 0) return;

    var result = calculateSalary(annual, hours, weeks, tax);

    var csv = 'Category,Amount\n';
    csv += 'Hourly Rate,' + result.hourlyRate + '\n';
    csv += 'Daily Rate,' + result.dailyRate + '\n';
    csv += 'Weekly Pay,' + result.weeklyPay + '\n';
    csv += 'Bi-Weekly Pay,' + result.biweeklyPay + '\n';
    csv += 'Monthly Pay,' + result.monthlyPay + '\n';
    csv += 'After-Tax Annual,' + result.afterTaxAnnual + '\n';
    csv += 'After-Tax Monthly,' + result.afterTaxMonthly + '\n';
    csv += 'Taxes Paid,' + result.taxesPaid + '\n';

    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'salary-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var hourly = hourlyRate ? hourlyRate.textContent : '';
    var daily = dailyRate ? dailyRate.textContent : '';
    var weekly = weeklyPay ? weeklyPay.textContent : '';
    var monthly = monthlyPay ? monthlyPay.textContent : '';
    var afterTax = afterTaxMonthly ? afterTaxMonthly.textContent : '';
    var text = 'Salary Breakdown:\nHourly: ' + hourly + '\nDaily: ' + daily + '\nWeekly: ' + weekly + '\nMonthly: ' + monthly + '\nTake-Home Monthly: ' + afterTax;
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
    link.download = 'salary-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultSalary = 75000;
    var defaultHours = 40;
    var defaultWeeks = 52;
    var defaultTax = 20;

    if (annualSalary) { annualSalary.value = defaultSalary; if (annualSalarySlider) annualSalarySlider.value = defaultSalary; }
    if (hoursPerWeek) { hoursPerWeek.value = defaultHours; if (hoursPerWeekSlider) hoursPerWeekSlider.value = defaultHours; }
    if (weeksPerYear) { weeksPerYear.value = defaultWeeks; if (weeksPerYearSlider) weeksPerYearSlider.value = defaultWeeks; }
    if (taxRate) { taxRate.value = defaultTax; if (taxRateSlider) taxRateSlider.value = defaultTax; }

    updateSliderLabel('annualSalary', defaultSalary);
    updateSliderLabel('hoursPerWeek', defaultHours);
    updateSliderLabel('weeksPerYear', defaultWeeks);
    updateSliderLabel('taxRate', defaultTax);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('a')) {
      var aVal = parseFloat(params.get('a'));
      if (!isNaN(aVal) && aVal >= 0) {
        if (annualSalary) { annualSalary.value = aVal; if (annualSalarySlider) annualSalarySlider.value = aVal; }
        updateSliderLabel('annualSalary', aVal);
      }
    }
    if (params.has('h')) {
      var hVal = parseFloat(params.get('h'));
      if (!isNaN(hVal) && hVal >= 1 && hVal <= 80) {
        if (hoursPerWeek) { hoursPerWeek.value = hVal; if (hoursPerWeekSlider) hoursPerWeekSlider.value = hVal; }
        updateSliderLabel('hoursPerWeek', hVal);
      }
    }
    if (params.has('w')) {
      var wVal = parseFloat(params.get('w'));
      if (!isNaN(wVal) && wVal >= 1 && wVal <= 52) {
        if (weeksPerYear) { weeksPerYear.value = wVal; if (weeksPerYearSlider) weeksPerYearSlider.value = wVal; }
        updateSliderLabel('weeksPerYear', wVal);
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
    console.warn('Salary Calculator not loaded yet.');
  };
}