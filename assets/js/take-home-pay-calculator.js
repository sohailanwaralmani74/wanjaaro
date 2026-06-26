// ============================================================
// Bring Home Pay Calculator
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var grossSalary = document.getElementById('grossSalary');
  var grossSalarySlider = document.getElementById('grossSalarySlider');
  var payFrequency = document.getElementById('payFrequency');
  var incomeTaxRate = document.getElementById('incomeTaxRate');
  var incomeTaxRateSlider = document.getElementById('incomeTaxRateSlider');
  var socialSecurityRate = document.getElementById('socialSecurityRate');
  var socialSecurityRateSlider = document.getElementById('socialSecurityRateSlider');
  var medicareRate = document.getElementById('medicareRate');
  var medicareRateSlider = document.getElementById('medicareRateSlider');
  var pensionRate = document.getElementById('pensionRate');
  var pensionRateSlider = document.getElementById('pensionRateSlider');
  var otherDeductions = document.getElementById('otherDeductions');
  var otherDeductionsSlider = document.getElementById('otherDeductionsSlider');

  var takeHomePay = document.getElementById('takeHomePay');
  var annualTakeHome = document.getElementById('annualTakeHome');
  var totalDeductions = document.getElementById('totalDeductions');
  var netPayPercentage = document.getElementById('netPayPercentage');
  var deductionBody = document.getElementById('deductionBody');
  var insightsGrid = document.getElementById('insightsGrid');
  var toolChart = document.getElementById('toolChart');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'donut';

  // ── Pay Frequency Multipliers ──
  var frequencyMultipliers = {
    weekly: 52,
    biweekly: 26,
    monthly: 12
  };

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
      case 'grossSalary':
      case 'otherDeductions':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'incomeTaxRate':
        label.textContent = num + '%';
        break;
      case 'socialSecurityRate':
        label.textContent = num + '%';
        break;
      case 'medicareRate':
        label.textContent = num + '%';
        break;
      case 'pensionRate':
        label.textContent = num + '%';
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Core Calculation ──
  function calculateTakeHome(gross, freq, tax, ss, medicare, pension, other) {
    var payPeriods = frequencyMultipliers[freq] || 12;
    var grossPerPeriod = gross / payPeriods;

    var taxAmount = gross * (tax / 100);
    var ssAmount = gross * (ss / 100);
    var medicareAmount = gross * (medicare / 100);
    var pensionAmount = gross * (pension / 100);
    var otherAmount = other * payPeriods;

    var totalDeductionsAnnual = taxAmount + ssAmount + medicareAmount + pensionAmount + otherAmount;
    var annualTakeHome = gross - totalDeductionsAnnual;
    var perPeriodTakeHome = annualTakeHome / payPeriods;
    var perPeriodDeductions = totalDeductionsAnnual / payPeriods;
    var netPercentage = gross > 0 ? (annualTakeHome / gross) * 100 : 0;

    return {
      annualTakeHome: annualTakeHome,
      perPeriodTakeHome: perPeriodTakeHome,
      totalDeductionsAnnual: totalDeductionsAnnual,
      perPeriodDeductions: perPeriodDeductions,
      netPercentage: netPercentage,
      grossPerPeriod: grossPerPeriod,
      deductions: {
        incomeTax: taxAmount,
        socialSecurity: ssAmount,
        medicare: medicareAmount,
        pension: pensionAmount,
        other: otherAmount
      },
      rates: {
        incomeTax: tax,
        socialSecurity: ss,
        medicare: medicare,
        pension: pension
      }
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var gross = parseFloat(grossSalary ? grossSalary.value : 0) || 0;
    var freq = payFrequency ? payFrequency.value : 'biweekly';
    var tax = parseFloat(incomeTaxRate ? incomeTaxRate.value : 0) || 0;
    var ss = parseFloat(socialSecurityRate ? socialSecurityRate.value : 0) || 0;
    var medicare = parseFloat(medicareRate ? medicareRate.value : 0) || 0;
    var pension = parseFloat(pensionRate ? pensionRate.value : 0) || 0;
    var other = parseFloat(otherDeductions ? otherDeductions.value : 0) || 0;

    if (gross <= 0) {
      if (takeHomePay) takeHomePay.textContent = '—';
      if (annualTakeHome) annualTakeHome.textContent = '—';
      if (totalDeductions) totalDeductions.textContent = '—';
      if (netPayPercentage) netPayPercentage.textContent = '—';
      if (deductionBody) deductionBody.innerHTML = '';
      if (insightsGrid) insightsGrid.innerHTML = '';
      return;
    }

    var result = calculateTakeHome(gross, freq, tax, ss, medicare, pension, other);

    var freqLabel = freq.charAt(0).toUpperCase() + freq.slice(1);
    if (takeHomePay) takeHomePay.textContent = formatCurrency(result.perPeriodTakeHome);
    if (annualTakeHome) annualTakeHome.textContent = formatCurrency(result.annualTakeHome);
    if (totalDeductions) totalDeductions.textContent = formatCurrency(result.perPeriodDeductions);
    if (netPayPercentage) netPayPercentage.textContent = formatPercent(result.netPercentage);

    generateDeductionTable(result, gross);
    generateInsights(result, gross, freq);
    updateChart(result, gross);
    updateShareURL();
  };

  // ── Generate Deduction Table ──
function generateDeductionTable(result, gross) {
  if (!deductionBody) return;

  var rows = '';
  var deductions = [
    { name: 'Income Tax', rate: result.rates.incomeTax, amount: result.deductions.incomeTax },
    { name: 'Social Security', rate: result.rates.socialSecurity, amount: result.deductions.socialSecurity },
    { name: 'Medicare / Health', rate: result.rates.medicare, amount: result.deductions.medicare },
    { name: 'Pension / Retirement', rate: result.rates.pension, amount: result.deductions.pension },
    { name: 'Other Deductions', rate: null, amount: result.deductions.other }
  ];

  deductions.forEach(function(d) {
    if (d.amount > 0 || d.name === 'Other Deductions') {
      // For "Other Deductions", compute the percentage of gross
      var displayRate = d.rate !== null ? d.rate + '%' : (gross > 0 ? ((d.amount / gross) * 100).toFixed(1) + '%' : '0%');
      rows += '<tr>' +
        '<td><strong>' + d.name + '</strong></td>' +
        '<td>' + displayRate + '</td>' +
        '<td>' + formatCurrency(d.amount) + '</td>' +
      '</tr>';
    }
  });

  // Total row
 var totalPct = gross > 0 ? ((result.totalDeductionsAnnual / gross) * 100) : 0;
  rows += '<tr class="highlight-row">' +
    '<td><strong>Total Deductions</strong></td>' +
    '<td><strong>' + formatPercent(totalPct) + '</strong></td>' +
    '<td><strong>' + formatCurrency(result.totalDeductionsAnnual) + '</strong></td>' +
  '</tr>';

  deductionBody.innerHTML = rows;
}

  // ── Generate Insights ──
  function generateInsights(result, gross, freq) {
    if (!insightsGrid) return;
    var insights = [];

    var freqLabel = freq.charAt(0).toUpperCase() + freq.slice(1);

    insights.push({
      icon: '💰',
      text: 'Take-home pay: <strong>' + formatCurrency(result.perPeriodTakeHome) + '</strong> per ' + freqLabel + ' period'
    });

    insights.push({
      icon: '📊',
      text: 'Net pay: <strong>' + formatPercent(result.netPercentage) + '</strong> of gross salary'
    });

    insights.push({
      icon: '🏦',
      text: 'Total deductions: <strong>' + formatCurrency(result.totalDeductionsAnnual) + '</strong> annually'
    });

    var largestDeduction = '';
    var maxAmount = 0;
    var deductionNames = {
      incomeTax: 'Income Tax',
      socialSecurity: 'Social Security',
      medicare: 'Medicare/Health',
      pension: 'Pension/Retirement',
      other: 'Other'
    };

    for (var key in result.deductions) {
      if (result.deductions[key] > maxAmount) {
        maxAmount = result.deductions[key];
        largestDeduction = deductionNames[key] || key;
      }
    }

    if (largestDeduction && maxAmount > 0) {
      insights.push({
        icon: '📈',
        text: 'Largest deduction: <strong>' + largestDeduction + '</strong> (' + formatCurrency(maxAmount) + ')'
      });
    }

    if (result.netPercentage > 80) {
      insights.push({
        icon: '✅',
        text: 'You keep over 80% of your gross pay — low deduction rate'
      });
    } else if (result.netPercentage < 60) {
      insights.push({
        icon: '⚠️',
        text: 'You keep less than 60% of your gross pay — review your deductions'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter your gross salary to see your take-home pay'
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

    var gross = parseFloat(grossSalary ? grossSalary.value : 0) || 0;
    var freq = payFrequency ? payFrequency.value : 'biweekly';
    var tax = parseFloat(incomeTaxRate ? incomeTaxRate.value : 0) || 0;
    var ss = parseFloat(socialSecurityRate ? socialSecurityRate.value : 0) || 0;
    var medicare = parseFloat(medicareRate ? medicareRate.value : 0) || 0;
    var pension = parseFloat(pensionRate ? pensionRate.value : 0) || 0;
    var other = parseFloat(otherDeductions ? otherDeductions.value : 0) || 0;

    if (gross > 0) {
      var result = calculateTakeHome(gross, freq, tax, ss, medicare, pension, other);
      updateChart(result, gross);
    }
  };

  function updateChart(result, gross) {
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

    if (currentChartType === 'donut') {
      var takeHome = result.annualTakeHome;
      var totalDed = result.totalDeductionsAnnual;

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Take-Home Pay', 'Total Deductions'],
          datasets: [{
            data: [takeHome, totalDed],
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

    } else if (currentChartType === 'bar') {
      var deductions = [
        result.deductions.incomeTax,
        result.deductions.socialSecurity,
        result.deductions.medicare,
        result.deductions.pension,
        result.deductions.other
      ];

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Income Tax', 'Social Security', 'Medicare', 'Pension', 'Other'],
          datasets: [{
            label: 'Deduction Amount',
            data: deductions,
            backgroundColor: ['#6366f1', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'],
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
    }
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (grossSalary) params.set('g', grossSalary.value);
    if (payFrequency) params.set('f', payFrequency.value);
    if (incomeTaxRate) params.set('t', incomeTaxRate.value);
    if (socialSecurityRate) params.set('s', socialSecurityRate.value);
    if (medicareRate) params.set('m', medicareRate.value);
    if (pensionRate) params.set('p', pensionRate.value);
    if (otherDeductions) params.set('o', otherDeductions.value);

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
    var table = document.getElementById('deductionTable');
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
    a.download = 'take-home-pay-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var takeHome = takeHomePay ? takeHomePay.textContent : '';
    var annual = annualTakeHome ? annualTakeHome.textContent : '';
    var deductions = totalDeductions ? totalDeductions.textContent : '';
    var pct = netPayPercentage ? netPayPercentage.textContent : '';
    var text = 'Take-Home Pay Result:\nPer Period: ' + takeHome + '\nAnnual Take-Home: ' + annual + '\nDeductions: ' + deductions + '\nNet Pay: ' + pct;
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
    link.download = 'take-home-pay-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultGross = 75000;
    var defaultFreq = 'biweekly';
    var defaultTax = 20;
    var defaultSS = 6.2;
    var defaultMedicare = 1.45;
    var defaultPension = 5;
    var defaultOther = 0;

    if (grossSalary) { grossSalary.value = defaultGross; if (grossSalarySlider) grossSalarySlider.value = defaultGross; }
    if (payFrequency) payFrequency.value = defaultFreq;
    if (incomeTaxRate) { incomeTaxRate.value = defaultTax; if (incomeTaxRateSlider) incomeTaxRateSlider.value = defaultTax; }
    if (socialSecurityRate) { socialSecurityRate.value = defaultSS; if (socialSecurityRateSlider) socialSecurityRateSlider.value = defaultSS; }
    if (medicareRate) { medicareRate.value = defaultMedicare; if (medicareRateSlider) medicareRateSlider.value = defaultMedicare; }
    if (pensionRate) { pensionRate.value = defaultPension; if (pensionRateSlider) pensionRateSlider.value = defaultPension; }
    if (otherDeductions) { otherDeductions.value = defaultOther; if (otherDeductionsSlider) otherDeductionsSlider.value = defaultOther; }

    updateSliderLabel('grossSalary', defaultGross);
    updateSliderLabel('incomeTaxRate', defaultTax);
    updateSliderLabel('socialSecurityRate', defaultSS);
    updateSliderLabel('medicareRate', defaultMedicare);
    updateSliderLabel('pensionRate', defaultPension);
    updateSliderLabel('otherDeductions', defaultOther);
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('g')) {
      var gVal = parseFloat(params.get('g'));
      if (!isNaN(gVal) && gVal >= 0) {
        if (grossSalary) { grossSalary.value = gVal; if (grossSalarySlider) grossSalarySlider.value = gVal; }
        updateSliderLabel('grossSalary', gVal);
      }
    }
    if (params.has('f')) {
      var fVal = params.get('f');
      if (fVal && payFrequency) payFrequency.value = fVal;
    }
    if (params.has('t')) {
      var tVal = parseFloat(params.get('t'));
      if (!isNaN(tVal) && tVal >= 0 && tVal <= 70) {
        if (incomeTaxRate) { incomeTaxRate.value = tVal; if (incomeTaxRateSlider) incomeTaxRateSlider.value = tVal; }
        updateSliderLabel('incomeTaxRate', tVal);
      }
    }
    if (params.has('s')) {
      var sVal = parseFloat(params.get('s'));
      if (!isNaN(sVal) && sVal >= 0 && sVal <= 20) {
        if (socialSecurityRate) { socialSecurityRate.value = sVal; if (socialSecurityRateSlider) socialSecurityRateSlider.value = sVal; }
        updateSliderLabel('socialSecurityRate', sVal);
      }
    }
    if (params.has('m')) {
      var mVal = parseFloat(params.get('m'));
      if (!isNaN(mVal) && mVal >= 0 && mVal <= 10) {
        if (medicareRate) { medicareRate.value = mVal; if (medicareRateSlider) medicareRateSlider.value = mVal; }
        updateSliderLabel('medicareRate', mVal);
      }
    }
    if (params.has('p')) {
      var pVal = parseFloat(params.get('p'));
      if (!isNaN(pVal) && pVal >= 0 && pVal <= 30) {
        if (pensionRate) { pensionRate.value = pVal; if (pensionRateSlider) pensionRateSlider.value = pVal; }
        updateSliderLabel('pensionRate', pVal);
      }
    }
    if (params.has('o')) {
      var oVal = parseFloat(params.get('o'));
      if (!isNaN(oVal) && oVal >= 0) {
        if (otherDeductions) { otherDeductions.value = oVal; if (otherDeductionsSlider) otherDeductionsSlider.value = oVal; }
        updateSliderLabel('otherDeductions', oVal);
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
    console.warn('Bring Home Pay Calculator not loaded yet.');
  };
}