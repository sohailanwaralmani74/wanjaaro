// ============================================================
// INTEREST CALCULATOR — Simple & Compound
// ============================================================

(function() {
  'use strict';

  // ── Ensure data exists ──
  var currencies = window.currencies || [];

  // ── DOM References ──
  var currencySearch = document.getElementById('currencySearch');
  var currencyResults = document.getElementById('currencyResults');
  var currencySymbols = document.querySelectorAll('[id^="currencySymbol"]');

  var principal = document.getElementById('principal');
  var principalSlider = document.getElementById('principalSlider');
  var rate = document.getElementById('rate');
  var rateSlider = document.getElementById('rateSlider');
  var time = document.getElementById('time');
  var timeSlider = document.getElementById('timeSlider');
  var interestType = document.getElementById('interestType');
  var compounding = document.getElementById('compounding');
  var compoundingGroup = document.getElementById('compoundingGroup');

  var totalInterest = document.getElementById('totalInterest');
  var finalAmount = document.getElementById('finalAmount');
  var totalPrincipal = document.getElementById('totalPrincipal');
  var interestTypeDisplay = document.getElementById('interestTypeDisplay');
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
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function formatCurrency(num) {
    if (!isFinite(num)) return '—';
    return selectedCurrency.symbol + formatNumber(num);
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
        label.textContent = selectedCurrency.symbol + formatNumber(num);
        break;
      case 'rate':
        label.textContent = num + '%';
        break;
      case 'time':
        label.textContent = num + ' yr' + (num > 1 ? 's' : '');
        break;
      default:
        label.textContent = num;
    }
  }

  // ── Toggle Compounding Frequency ──
  function toggleCompounding() {
    if (interestType.value === 'simple') {
      compoundingGroup.style.display = 'none';
    } else {
      compoundingGroup.style.display = 'block';
    }
  }

  // ── Core Calculations ──
  function calculateSimpleInterest(P, r, t) {
    var rate = r / 100;
    var interest = P * rate * t;
    return {
      interest: interest,
      finalAmount: P + interest,
      data: []
    };
  }

  function calculateCompoundInterest(P, r, t, n) {
    var rate = r / 100;
    var periodicRate = rate / n;
    var totalPeriods = n * t;
    var balance = P;
    var data = [];

    for (var year = 1; year <= t; year++) {
      var startBalance = balance;
      var yearInterest = 0;
      for (var period = 1; period <= n; period++) {
        var interest = balance * periodicRate;
        yearInterest += interest;
        balance += interest;
      }
      data.push({
        year: year,
        startBalance: startBalance,
        interest: yearInterest,
        endBalance: balance
      });
    }

    return {
      interest: balance - P,
      finalAmount: balance,
      data: data
    };
  }

  // ── Main Calculate ──
  window.calculate = function() {
    toggleCompounding();

    var P = parseFloat(principal ? principal.value : 0) || 0;
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var t = parseFloat(time ? time.value : 0) || 0;
    var type = interestType ? interestType.value : 'compound';
    var n = parseInt(compounding ? compounding.value : 12) || 12;

    if (P <= 0 || t <= 0) {
      if (totalInterest) totalInterest.textContent = '—';
      if (finalAmount) finalAmount.textContent = '—';
      if (totalPrincipal) totalPrincipal.textContent = '—';
      if (interestTypeDisplay) interestTypeDisplay.textContent = '—';
      if (insightsGrid) insightsGrid.innerHTML = '';
      if (tableHead) tableHead.innerHTML = '';
      if (tableBody) tableBody.innerHTML = '';
      return;
    }

    var result;
    var typeLabel;

    if (type === 'simple') {
      result = calculateSimpleInterest(P, r, t);
      typeLabel = 'Simple';
    } else {
      result = calculateCompoundInterest(P, r, t, n);
      typeLabel = 'Compound';
    }

    if (totalInterest) totalInterest.textContent = formatCurrency(result.interest);
    if (finalAmount) finalAmount.textContent = formatCurrency(result.finalAmount);
    if (totalPrincipal) totalPrincipal.textContent = formatCurrency(P);
    if (interestTypeDisplay) interestTypeDisplay.textContent = typeLabel;

    generateInsights(result, P, r, t, type, n);
    generateBreakdown(result, P, r, t, type, n);
    updateChart(result, P, r, t, type, n);
    updateShareURL();
  };

  // ── Generate Insights ──
  function generateInsights(result, P, r, t, type, n) {
    if (!insightsGrid) return;
    var insights = [];

    if (result.interest > 0) {
      var ratio = result.interest / P;
      insights.push({
        icon: '📊',
        text: 'Interest is <strong>' + formatPercent(ratio * 100) + '</strong> of the principal'
      });
    }

    if (type === 'compound' && r > 0 && t > 0) {
      var yearsToDouble = 72 / r;
      insights.push({
        icon: '⏱️',
        text: 'Your money would double in ~<strong>' + yearsToDouble.toFixed(1) + ' years</strong> (Rule of 72)'
      });
    }

    if (type === 'simple') {
      insights.push({
        icon: '📉',
        text: 'Simple interest grows <strong>linearly</strong> — fixed amount each year'
      });
    } else {
      insights.push({
        icon: '📈',
        text: 'Compound interest grows <strong>exponentially</strong> — interest on interest'
      });
    }

    if (type === 'compound' && n > 0) {
      var annual = calculateCompoundInterest(P, r, t, 1);
      var monthly = calculateCompoundInterest(P, r, t, 12);
      var daily = calculateCompoundInterest(P, r, t, 365);
      var diff = daily.interest - annual.interest;
      if (diff > 0) {
        insights.push({
          icon: '🔄',
          text: 'Daily vs Annual compounding adds <strong>' + formatCurrency(diff) + '</strong> extra interest'
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        icon: '💡',
        text: 'Enter your details to calculate interest'
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
  function generateBreakdown(result, P, r, t, type, n) {
    if (!tableHead || !tableBody) return;
    var rows = '';

    tableHead.innerHTML = '<tr><th>Year</th><th>Starting Balance</th><th>Interest Earned</th><th>Ending Balance</th></tr>';

    if (type === 'simple') {
      var yearlyInterest = P * (r / 100);
      var balance = P;
      for (var year = 1; year <= t; year++) {
        balance += yearlyInterest;
        var isLastRow = (year === t);
        rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
          '<td><strong>' + year + '</strong></td>' +
          '<td>' + formatCurrency(balance - yearlyInterest) + '</td>' +
          '<td>' + formatCurrency(yearlyInterest) + '</td>' +
          '<td>' + formatCurrency(balance) + '</td>' +
        '</tr>';
      }
    } else {
      var data = result.data;
      data.forEach(function(item) {
        var isLastRow = (item.year === t);
        rows += '<tr class="' + (isLastRow ? 'highlight-row' : '') + '">' +
          '<td><strong>' + item.year + '</strong></td>' +
          '<td>' + formatCurrency(item.startBalance) + '</td>' +
          '<td>' + formatCurrency(item.interest) + '</td>' +
          '<td>' + formatCurrency(item.endBalance) + '</td>' +
        '</tr>';
      });
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
    var r = parseFloat(rate ? rate.value : 0) || 0;
    var t = parseFloat(time ? time.value : 0) || 0;
    var intType = interestType ? interestType.value : 'compound';
    var n = parseInt(compounding ? compounding.value : 12) || 12;

    if (P > 0 && t > 0) {
      var result = intType === 'simple' ?
        calculateSimpleInterest(P, r, t) :
        calculateCompoundInterest(P, r, t, n);
      updateChart(result, P, r, t, intType, n);
    }
  };

  function updateChart(result, P, r, t, type, n) {
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
    var labels = [];
    var values = [];
    var cumulativeInterest = [];

    if (type === 'simple') {
      var yearlyInterest = P * (r / 100);
      var balance = P;
      labels.push(0);
      values.push(P);
      cumulativeInterest.push(0);
      for (var year = 1; year <= t; year++) {
        balance += yearlyInterest;
        labels.push(year);
        values.push(balance);
        cumulativeInterest.push(balance - P);
      }
    } else {
      var data = result.data;
      labels.push(0);
      values.push(P);
      cumulativeInterest.push(0);
      data.forEach(function(item) {
        labels.push(item.year);
        values.push(item.endBalance);
        cumulativeInterest.push(item.endBalance - P);
      });
    }

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
                return context.dataset.label + ': ' + currencySymbol + context.parsed.y.toLocaleString('en-US', { maximumFractionDigits: 2 });
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
          data: values,
          borderColor: '#0d9488',
          backgroundColor: currentChartType === 'area' ? 'rgba(13, 148, 136, 0.3)' : 'rgba(13, 148, 136, 0.1)',
          fill: currentChartType === 'area',
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
      chartConfig.data.labels = ['Principal', 'Interest'];
      chartConfig.data.datasets = [{
        label: 'Amount',
        data: [P, result.interest],
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
      chartConfig.data.labels = ['Principal', 'Interest'];
      chartConfig.data.datasets = [{
        data: [P, result.interest],
        backgroundColor: ['#6366f1', '#0d9488'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }];
      chartConfig.options.plugins.legend = { position: 'bottom' };
      chartConfig.options.plugins.tooltip.callbacks.label = function(context) {
        var total = context.dataset.data.reduce(function(a, b) { return a + b; }, 0);
        var percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
        return context.label + ': ' + currencySymbol + context.parsed.toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' (' + percentage + '%)';
      };
    }

    chartInstance = new Chart(ctx, chartConfig);
  }

  // ── Share URL ──
  function updateShareURL() {
    var params = new URLSearchParams();
    if (principal) params.set('p', principal.value);
    if (rate) params.set('r', rate.value);
    if (time) params.set('t', time.value);
    if (interestType) params.set('i', interestType.value);
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
        text = text.replace(/[^0-9.,\-%]/g, '');
        rowData.push(text);
      });
      csv += rowData.join(',') + '\n';
    });
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'interest-breakdown.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ── Copy Result ──
  window.copyResult = function() {
    var interest = totalInterest ? totalInterest.textContent : '';
    var final = finalAmount ? finalAmount.textContent : '';
    var type = interestTypeDisplay ? interestTypeDisplay.textContent : '';
    var text = 'Interest Result:\nInterest Type: ' + type + '\nTotal Interest: ' + interest + '\nFinal Amount: ' + final;
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
    link.download = 'interest-chart.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Reset ──
  window.resetForm = function() {
    var defaultPrincipal = 10000;
    var defaultRate = 8;
    var defaultTime = 5;
    var defaultType = 'compound';
    var defaultFreq = 12;

    if (principal) { principal.value = defaultPrincipal; if (principalSlider) principalSlider.value = defaultPrincipal; }
    if (rate) { rate.value = defaultRate; if (rateSlider) rateSlider.value = defaultRate; }
    if (time) { time.value = defaultTime; if (timeSlider) timeSlider.value = defaultTime; }
    if (interestType) interestType.value = defaultType;
    if (compounding) compounding.value = defaultFreq;

    updateSliderLabel('principal', defaultPrincipal);
    updateSliderLabel('rate', defaultRate);
    updateSliderLabel('time', defaultTime);
    toggleCompounding();
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
    if (params.has('r')) {
      var rVal = parseFloat(params.get('r'));
      if (!isNaN(rVal) && rVal >= 0) {
        if (rate) { rate.value = rVal; if (rateSlider) rateSlider.value = rVal; }
        updateSliderLabel('rate', rVal);
      }
    }
    if (params.has('t')) {
      var tVal = parseFloat(params.get('t'));
      if (!isNaN(tVal) && tVal > 0) {
        if (time) { time.value = tVal; if (timeSlider) timeSlider.value = tVal; }
        updateSliderLabel('time', tVal);
      }
    }
    if (params.has('i')) {
      var iVal = params.get('i');
      if (iVal && interestType) interestType.value = iVal;
    }
    if (params.has('c')) {
      var cVal = parseInt(params.get('c'));
      if (!isNaN(cVal) && compounding) compounding.value = cVal;
    }
    toggleCompounding();
    window.calculate();
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function() {
    initCurrencyPicker();
    toggleCompounding();
    loadFromURL();
    window.addEventListener('resize', function() {
      if (chartInstance) chartInstance.resize();
    });
  });

})();

// ── Safety fallback ──
if (typeof window.calculate === 'undefined') {
  window.calculate = function() {
    console.warn('Interest Calculator not loaded yet.');
  };
}