// ============================================================
// INCOME TAX CALCULATOR
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var annualIncome = document.getElementById('annualIncome');
  var annualIncomeSlider = document.getElementById('annualIncomeSlider');
  var filingStatus = document.getElementById('filingStatus');
  var taxYear = document.getElementById('taxYear');
  var standardDeduction = document.getElementById('standardDeduction');
  var standardDeductionSlider = document.getElementById('standardDeductionSlider');

  var totalTax = document.getElementById('totalTax');
  var effectiveRate = document.getElementById('effectiveRate');
  var marginalRate = document.getElementById('marginalRate');
  var taxableIncome = document.getElementById('taxableIncome');
  var bracketBody = document.getElementById('bracketBody');
  var insightsGrid = document.getElementById('insightsGrid');
  var toolChart = document.getElementById('toolChart');

  var chartInstance = null;
  var selectedCurrency = { code: 'USD', symbol: '$' };
  var currentChartType = 'bar';

  // ── Tax Brackets Data (US Federal 2024) ──
  var taxBrackets = {
    2024: {
      single: [
        { rate: 10, from: 0, to: 11600 },
        { rate: 12, from: 11601, to: 47150 },
        { rate: 22, from: 47151, to: 100525 },
        { rate: 24, from: 100526, to: 191950 },
        { rate: 32, from: 191951, to: 243725 },
        { rate: 35, from: 243726, to: 609350 },
        { rate: 37, from: 609351, to: Infinity }
      ],
      married: [
        { rate: 10, from: 0, to: 23200 },
        { rate: 12, from: 23201, to: 94300 },
        { rate: 22, from: 94301, to: 201050 },
        { rate: 24, from: 201051, to: 383900 },
        { rate: 32, from: 383901, to: 487450 },
        { rate: 35, from: 487451, to: 731200 },
        { rate: 37, from: 731201, to: Infinity }
      ],
      head: [
        { rate: 10, from: 0, to: 16550 },
        { rate: 12, from: 16551, to: 63100 },
        { rate: 22, from: 63101, to: 100500 },
        { rate: 24, from: 100501, to: 191950 },
        { rate: 32, from: 191951, to: 243700 },
        { rate: 35, from: 243701, to: 609350 },
        { rate: 37, from: 609351, to: Infinity }
      ]
    },
    2023: {
      single: [
        { rate: 10, from: 0, to: 11000 },
        { rate: 12, from: 11001, to: 44725 },
        { rate: 22, from: 44726, to: 95375 },
        { rate: 24, from: 95376, to: 182100 },
        { rate: 32, from: 182101, to: 231250 },
        { rate: 35, from: 231251, to: 578125 },
        { rate: 37, from: 578126, to: Infinity }
      ],
      married: [
        { rate: 10, from: 0, to: 22000 },
        { rate: 12, from: 22001, to: 89450 },
        { rate: 22, from: 89451, to: 190750 },
        { rate: 24, from: 190751, to: 364200 },
        { rate: 32, from: 364201, to: 462500 },
        { rate: 35, from: 462501, to: 693750 },
        { rate: 37, from: 693751, to: Infinity }
      ],
      head: [
        { rate: 10, from: 0, to: 15700 },
        { rate: 12, from: 15701, to: 59850 },
        { rate: 22, from: 59851, to: 95350 },
        { rate: 24, from: 95351, to: 182100 },
        { rate: 32, from: 182101, to: 231250 },
        { rate: 35, from: 231251, to: 578100 },
        { rate: 37, from: 578101, to: Infinity }
      ]
    },
    2022: {
      single: [
        { rate: 10, from: 0, to: 10275 },
        { rate: 12, from: 10276, to: 41775 },
        { rate: 22, from: 41776, to: 89075 },
        { rate: 24, from: 89076, to: 170050 },
        { rate: 32, from: 170051, to: 215950 },
        { rate: 35, from: 215951, to: 539900 },
        { rate: 37, from: 539901, to: Infinity }
      ],
      married: [
        { rate: 10, from: 0, to: 20550 },
        { rate: 12, from: 20551, to: 83550 },
        { rate: 22, from: 83551, to: 178150 },
        { rate: 24, from: 178151, to: 340100 },
        { rate: 32, from: 340101, to: 431900 },
        { rate: 35, from: 431901, to: 647850 },
        { rate: 37, from: 647851, to: Infinity }
      ],
      head: [
        { rate: 10, from: 0, to: 14650 },
        { rate: 12, from: 14651, to: 55900 },
        { rate: 22, from: 55901, to: 89050 },
        { rate: 24, from: 89051, to: 170050 },
        { rate: 32, from: 170051, to: 215950 },
        { rate: 35, from: 215951, to: 539900 },
        { rate: 37, from: 539901, to: Infinity }
      ]
    }
  };

  // ── Standard Deduction Values ──
  var standardDeductions = {
    2024: { single: 14600, married: 29200, head: 21900 },
    2023: { single: 13850, married: 27700, head: 20800 },
    2022: { single: 12950, married: 25900, head: 19400 }
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
      case 'annualIncome':
      case 'standardDeduction':
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Update Standard Deduction ──
  window.updateBrackets = function() {
    var year = taxYear.value;
    var status = filingStatus.value;

    if (standardDeductions[year] && standardDeductions[year][status] !== undefined) {
      var deduction = standardDeductions[year][status];
      standardDeduction.value = deduction;
      if (standardDeductionSlider) standardDeductionSlider.value = deduction;
      updateSliderLabel('standardDeduction', deduction);
    }
    window.calculate();
  };

  // ── Core Calculation ──
  function calculateTax(income, status, year, deduction) {
    var brackets = taxBrackets[year] && taxBrackets[year][status] ? taxBrackets[year][status] : taxBrackets[2024].single;

    var taxable = Math.max(0, income - deduction);
    var remaining = taxable;
    var totalTaxOwed = 0;
    var bracketDetails = [];

    for (var i = 0; i < brackets.length; i++) {
      var bracket = brackets[i];
      var lower = bracket.from;
      var upper = bracket.to;
      var rate = bracket.rate;

      if (remaining <= 0) {
        bracketDetails.push({
          rate: rate,
          amount: 0,
          tax: 0,
          bracketRange: formatCurrency(lower) + ' – ' + (upper === Infinity ? '∞' : formatCurrency(upper))
        });
        continue;
      }

      var taxableInBracket = Math.min(remaining, upper - lower + 1);
      if (taxableInBracket < 0) taxableInBracket = 0;

      var tax = taxableInBracket * (rate / 100);
      totalTaxOwed += tax;
      remaining -= taxableInBracket;

      bracketDetails.push({
        rate: rate,
        amount: taxableInBracket,
        tax: tax,
        bracketRange: formatCurrency(lower) + ' – ' + (upper === Infinity ? '∞' : formatCurrency(upper))
      });

      if (remaining <= 0) break;
    }

    // Marginal rate: the highest bracket that had taxable income
    var marginal = 0;
    for (var j = brackets.length - 1; j >= 0; j--) {
      if (bracketDetails[j] && bracketDetails[j].amount > 0) {
        marginal = brackets[j].rate;
        break;
      }
    }

    var effectiveRate = taxable > 0 ? (totalTaxOwed / income) * 100 : 0;

    return {
      taxableIncome: taxable,
      totalTax: totalTaxOwed,
      effectiveRate: effectiveRate,
      marginalRate: marginal,
      bracketDetails: bracketDetails
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    var income = parseFloat(annualIncome ? annualIncome.value : 0) || 0;
    var status = filingStatus ? filingStatus.value : 'single';
    var year = taxYear ? taxYear.value : '2024';
    var deduction = parseFloat(standardDeduction ? standardDeduction.value : 0) || 0;

    if (income <= 0) {
      if (totalTax) totalTax.textContent = '—';
      if (effectiveRate) effectiveRate.textContent = '—';
      if (marginalRate) marginalRate.textContent = '—';
      if (taxableIncome) taxableIncome.textContent = '—';
      if (bracketBody) bracketBody.innerHTML = '';
      if (insightsGrid) insightsGrid.innerHTML = '';
      return;
    }

    var result = calculateTax(income, status, year, deduction);

    if (totalTax) totalTax.textContent = formatCurrency(result.totalTax);
    if (effectiveRate) effectiveRate.textContent = formatPercent(result.effectiveRate);
    if (marginalRate) marginalRate.textContent = result.marginalRate + '%';
    if (taxableIncome) taxableIncome.textContent = formatCurrency(result.taxableIncome);

    generateBracketTable(result.bracketDetails);
    generateInsights(result, income, deduction);
    updateChart(result.bracketDetails, income, result.totalTax);
    updateShareURL();
  };

  // ── Generate Bracket Table ──
  function generateBracketTable(bracketDetails) {
    if (!bracketBody) return;

    var rows = '';
    var totalTax = 0;
    var totalAmount = 0;

    bracketDetails.forEach(function(bracket) {
      if (bracket.amount > 0 || bracket.tax > 0) {
        totalTax += bracket.tax;
        totalAmount += bracket.amount;
        rows += '<tr>' +
          '<td><strong>' + bracket.rate + '%</strong></td>' +
          '<td>' + formatCurrency(bracket.amount) + '</td>' +
          '<td>' + bracket.rate + '%</td>' +
          '<td>' + formatCurrency(bracket.tax) + '</td>' +
        '</tr>';
      }
    });

    // Add total row
    rows += '<tr class="highlight-row">' +
      '<td><strong>Total</strong></td>' +
      '<td>' + formatCurrency(totalAmount) + '</td>' +
      '<td>—</td>' +
      '<td><strong>' + formatCurrency(totalTax) + '</strong></td>' +
    '</tr>';

    bracketBody.innerHTML = rows;
  }

  // ── Generate Insights ──
  function generateInsights(result, income, deduction) {
    if (!insightsGrid) return;
    var insights = [];

    insights.push({
      icon: '📊',
      text: 'Effective tax rate: <strong>' + formatPercent(result.effectiveRate) + '</strong>'
    });

    insights.push({
      icon: '📈',
      text: 'Marginal tax rate: <strong>' + result.marginalRate + '%</strong>'
    });

    insights.push({
      icon: '💰',
      text: 'Total tax liability: <strong>' + formatCurrency(result.totalTax) + '</strong>'
    });

    if (deduction > 0 && income > 0) {
      var deductionPercent = (deduction / income) * 100;
      insights.push({
        icon: '🏦',
        text: 'Standard deduction: <strong>' + formatCurrency(deduction) + '</strong> (' + formatPercent(deductionPercent) + ' of income)'
      });
    }

    if (result.effectiveRate > 30) {
      insights.push({
        icon: '⚠️',
        text: 'Your effective tax rate is above 30%. Consider tax‑advantaged investments.'
      });
    } else if (result.effectiveRate < 10) {
      insights.push({
        icon: '✅',
        text: 'Your effective tax rate is below 10%. You\'re in a low tax bracket.'
      });
    }

    if (result.marginalRate >= 32) {
      insights.push({
        icon: '💡',
        text: 'You\'re in a high tax bracket. Tax‑efficient investing is important.'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter your income to see your tax breakdown'
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

    var income = parseFloat(annualIncome ? annualIncome.value : 0) || 0;
    var status = filingStatus ? filingStatus.value : 'single';
    var year = taxYear ? taxYear.value : '2024';
    var deduction = parseFloat(standardDeduction ? standardDeduction.value : 0) || 0;

    if (income > 0) {
      var result = calculateTax(income, status, year, deduction);
      updateChart(result.bracketDetails, income, result.totalTax);
    }
  };

  function updateChart(bracketDetails, income, totalTax) {
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
      var labels = [];
      var amounts = [];
      var taxAmounts = [];

      bracketDetails.forEach(function(bracket) {
        if (bracket.amount > 0 || bracket.tax > 0) {
          labels.push(bracket.rate + '%');
          amounts.push(bracket.amount);
          taxAmounts.push(bracket.tax);
        }
      });

      if (labels.length === 0) {
        labels = ['No Taxable Income'];
        amounts = [0];
        taxAmounts = [0];
      }

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Taxable Amount',
              data: amounts,
              backgroundColor: 'rgba(99, 102, 241, 0.7)',
              borderRadius: 4
            },
            {
              label: 'Tax Owed',
              data: taxAmounts,
              backgroundColor: 'rgba(13, 148, 136, 0.7)',
              borderRadius: 4
            }
          ]
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

    } else if (currentChartType === 'donut') {
      var labels2 = [];
      var amounts2 = [];
      var colors = ['#0d9488', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

      bracketDetails.forEach(function(bracket, index) {
        if (bracket.tax > 0) {
          labels2.push(bracket.rate + '% bracket');
          amounts2.push(bracket.tax);
        }
      });

      if (amounts2.length === 0) {
        labels2 = ['No Tax'];
        amounts2 = [1];
      }

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels2,
          datasets: [{
            data: amounts2,
            backgroundColor: colors.slice(0, amounts2.length),
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

    } else if (currentChartType === 'line') {
      // Generate income vs tax curve
      var incomeLabels = [];
      var taxValues = [];
      var stepSize = Math.max(1, Math.floor(income / 20));

      for (var i = 0; i <= income; i += stepSize) {
        incomeLabels.push(i);
        var result = calculateTax(i, filingStatus.value, taxYear.value, parseFloat(standardDeduction.value) || 0);
        taxValues.push(result.totalTax);
      }

      // Ensure final point is included
      if (income % stepSize !== 0) {
        var lastResult = calculateTax(income, filingStatus.value, taxYear.value, parseFloat(standardDeduction.value) || 0);
        incomeLabels.push(income);
        taxValues.push(lastResult.totalTax);
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: incomeLabels,
          datasets: [{
            label: 'Tax Liability',
            data: taxValues,
            borderColor: '#0d9488',
            backgroundColor: 'rgba(13, 148, 136, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return 'Income: ' + currencySymbol + context.parsed.x.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ', Tax: ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 0 });
                }
              }
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Income (' + selectedCurrency.code + ')' }
            },
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
    if (annualIncome) params.set('i', annualIncome.value);
    if (filingStatus) params.set('s', filingStatus.value);
    if (taxYear) params.set('y', taxYear.value);
    if (standardDeduction) params.set('d', standardDeduction.value);

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
    var table = document.getElementById('bracketTable');
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
    a.download = 'tax-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var tax = totalTax ? totalTax.textContent : '';
    var effective = effectiveRate ? effectiveRate.textContent : '';
    var marginal = marginalRate ? marginalRate.textContent : '';
    var taxable = taxableIncome ? taxableIncome.textContent : '';
    var text = 'Tax Result:\nTotal Tax: ' + tax + '\nEffective Rate: ' + effective + '\nMarginal Rate: ' + marginal + '\nTaxable Income: ' + taxable;
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
    link.download = 'tax-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultIncome = 100000;
    var defaultStatus = 'married';
    var defaultYear = '2024';
    var defaultDeduction = 29200;

    if (annualIncome) { annualIncome.value = defaultIncome; if (annualIncomeSlider) annualIncomeSlider.value = defaultIncome; }
    if (filingStatus) filingStatus.value = defaultStatus;
    if (taxYear) taxYear.value = defaultYear;
    if (standardDeduction) { standardDeduction.value = defaultDeduction; if (standardDeductionSlider) standardDeductionSlider.value = defaultDeduction; }

    updateSliderLabel('annualIncome', defaultIncome);
    updateSliderLabel('standardDeduction', defaultDeduction);
    updateBrackets();
    window.calculate();
  };

  // ── Load URL params ──
  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('i')) {
      var iVal = parseFloat(params.get('i'));
      if (!isNaN(iVal) && iVal >= 0) {
        if (annualIncome) { annualIncome.value = iVal; if (annualIncomeSlider) annualIncomeSlider.value = iVal; }
        updateSliderLabel('annualIncome', iVal);
      }
    }
    if (params.has('s')) {
      var sVal = params.get('s');
      if (sVal && filingStatus) filingStatus.value = sVal;
    }
    if (params.has('y')) {
      var yVal = params.get('y');
      if (yVal && taxYear) taxYear.value = yVal;
    }
    if (params.has('d')) {
      var dVal = parseFloat(params.get('d'));
      if (!isNaN(dVal) && dVal >= 0) {
        if (standardDeduction) { standardDeduction.value = dVal; if (standardDeductionSlider) standardDeductionSlider.value = dVal; }
        updateSliderLabel('standardDeduction', dVal);
      }
    }
    updateBrackets();
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
    console.warn('Income Tax Calculator not loaded yet.');
  };
}