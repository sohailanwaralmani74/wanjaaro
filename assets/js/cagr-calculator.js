/* ═══════════════════════════════════════════════════════════
   CAGR Calculator — JavaScript
   Formula: CAGR = (Ending Value / Starting Value)^(1/Years) - 1
═══════════════════════════════════════════════════════════ */

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal" },
  { code: "OMR", symbol: "﷼", name: "Omani Rial" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar" },
  { code: "JOD", symbol: "د.ا", name: "Jordanian Dinar" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee" },
  { code: "NPR", symbol: "रु", name: "Nepalese Rupee" },
  { code: "MMK", symbol: "K", name: "Myanmar Kyat" },
  { code: "UZS", symbol: "so'm", name: "Uzbekistani Som" },
  { code: "KZT", symbol: "₸", name: "Kazakhstani Tenge" },
  { code: "GEL", symbol: "₾", name: "Georgian Lari" },
  { code: "AMD", symbol: "֏", name: "Armenian Dram" },
  { code: "AZN", symbol: "₼", name: "Azerbaijani Manat" },
  { code: "BYN", symbol: "Br", name: "Belarusian Ruble" },
  { code: "MDL", symbol: "L", name: "Moldovan Leu" },
  { code: "RSD", symbol: "дин.", name: "Serbian Dinar" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna" },
  { code: "ISK", symbol: "kr", name: "Icelandic Krona" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "COP", symbol: "$", name: "Colombian Peso" },
  { code: "CLP", symbol: "$", name: "Chilean Peso" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol" },
  { code: "ARS", symbol: "$", name: "Argentine Peso" },
  { code: "UYU", symbol: "$", name: "Uruguayan Peso" },
  { code: "PYG", symbol: "₲", name: "Paraguayan Guarani" },
  { code: "BOB", symbol: "Bs", name: "Bolivian Boliviano" },
  { code: "VES", symbol: "Bs", name: "Venezuelan Bolívar" },
  { code: "CRC", symbol: "₡", name: "Costa Rican Colón" },
  { code: "NIO", symbol: "C$", name: "Nicaraguan Córdoba" },
  { code: "PAB", symbol: "B/.", name: "Panamanian Balboa" },
  { code: "DOP", symbol: "RD$", name: "Dominican Peso" },
  { code: "GTQ", symbol: "Q", name: "Guatemalan Quetzal" },
  { code: "HNL", symbol: "L", name: "Honduran Lempira" },
  { code: "SVC", symbol: "₡", name: "Salvadoran Colón" },
  { code: "BSD", symbol: "$", name: "Bahamian Dollar" },
  { code: "BBD", symbol: "$", name: "Barbadian Dollar" },
  { code: "JMD", symbol: "$", name: "Jamaican Dollar" },
  { code: "TTD", symbol: "$", name: "Trinidad and Tobago Dollar" },
  { code: "KYD", symbol: "$", name: "Cayman Islands Dollar" },
  { code: "FJD", symbol: "$", name: "Fijian Dollar" },
  { code: "SBD", symbol: "$", name: "Solomon Islands Dollar" },
  { code: "PGK", symbol: "K", name: "Papua New Guinean Kina" },
  { code: "WST", symbol: "WS$", name: "Samoan Tala" },
  { code: "TOP", symbol: "T$", name: "Tongan Paʻanga" },
  { code: "VUV", symbol: "Vt", name: "Vanuatu Vatu" },
  { code: "XPF", symbol: "₣", name: "CFP Franc" },
  { code: "FOK", symbol: "kr", name: "Faroese Króna" },
  { code: "IMP", symbol: "£", name: "Isle of Man Pound" },
  { code: "GGP", symbol: "£", name: "Guernsey Pound" },
  { code: "JEP", symbol: "£", name: "Jersey Pound" },
  { code: "GIP", symbol: "£", name: "Gibraltar Pound" },
  { code: "SHP", symbol: "£", name: "St Helena Pound" },
  { code: "FKP", symbol: "£", name: "Falkland Islands Pound" },
  { code: "BMD", symbol: "$", name: "Bermudian Dollar" },
  { code: "XCD", symbol: "$", name: "East Caribbean Dollar" },
  { code: "ANG", symbol: "ƒ", name: "Netherlands Antillean Guilder" },
  { code: "AWG", symbol: "ƒ", name: "Aruban Florin" },
  { code: "SRD", symbol: "$", name: "Surinamese Dollar" },
  { code: "GYD", symbol: "$", name: "Guyanese Dollar" },
  { code: "BZD", symbol: "$", name: "Belize Dollar" },
  { code: "CUC", symbol: "$", name: "Cuban Convertible Peso" },
  { code: "CUP", symbol: "$", name: "Cuban Peso" },
  { code: "HTG", symbol: "G", name: "Haitian Gourde" },
  { code: "MVR", symbol: "Rf", name: "Maldivian Rufiyaa" },
  { code: "MUR", symbol: "₨", name: "Mauritian Rupee" },
  { code: "SCR", symbol: "₨", name: "Seychellois Rupee" },
  { code: "CVE", symbol: "$", name: "Cape Verdean Escudo" },
  { code: "STN", symbol: "Db", name: "São Tomé and Príncipe Dobra" },
  { code: "GMD", symbol: "D", name: "Gambian Dalasi" },
  { code: "GNF", symbol: "FG", name: "Guinean Franc" },
  { code: "SLL", symbol: "Le", name: "Sierra Leonean Leone" },
  { code: "LRD", symbol: "$", name: "Liberian Dollar" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "XOF", symbol: "CFA", name: "West African CFA Franc" },
  { code: "XAF", symbol: "FCFA", name: "Central African CFA Franc" },
  { code: "MAD", symbol: "د.م.", name: "Moroccan Dirham" },
  { code: "DZD", symbol: "د.ج", name: "Algerian Dinar" },
  { code: "TND", symbol: "د.ت", name: "Tunisian Dinar" },
  { code: "LYD", symbol: "ل.د", name: "Libyan Dinar" },
  { code: "SDG", symbol: "ج.س.", name: "Sudanese Pound" },
  { code: "SSP", symbol: "£", name: "South Sudanese Pound" },
  { code: "ERN", symbol: "Nfk", name: "Eritrean Nakfa" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
  { code: "SOS", symbol: "Sh", name: "Somali Shilling" },
  { code: "DJF", symbol: "Fdj", name: "Djiboutian Franc" },
  { code: "TZS", symbol: "Sh", name: "Tanzanian Shilling" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "RWF", symbol: "FRw", name: "Rwandan Franc" },
  { code: "BIF", symbol: "FBu", name: "Burundian Franc" },
  { code: "MWK", symbol: "MK", name: "Malawian Kwacha" },
  { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },
  { code: "MZN", symbol: "MT", name: "Mozambican Metical" },
  { code: "BWP", symbol: "P", name: "Botswana Pula" },
  { code: "NAD", symbol: "$", name: "Namibian Dollar" },
  { code: "LSL", symbol: "L", name: "Lesotho Loti" },
  { code: "SZL", symbol: "E", name: "Swazi Lilangeni" },
  { code: "AOA", symbol: "Kz", name: "Angolan Kwanza" },
  { code: "CDF", symbol: "FC", name: "Congolese Franc" },
  { code: "MRU", symbol: "UM", name: "Mauritanian Ouguiya" },
  { code: "MGA", symbol: "Ar", name: "Malagasy Ariary" },
  { code: "KMF", symbol: "CF", name: "Comorian Franc" },
  { code: "AFN", symbol: "؋", name: "Afghan Afghani" },
  { code: "IRR", symbol: "﷼", name: "Iranian Rial" },
  { code: "IQD", symbol: "ع.د", name: "Iraqi Dinar" },
  { code: "YER", symbol: "﷼", name: "Yemeni Rial" },
  { code: "SYP", symbol: "£", name: "Syrian Pound" },
  { code: "LBP", symbol: "ل.ل", name: "Lebanese Pound" },
  { code: "KGS", symbol: "с", name: "Kyrgyzstani Som" },
  { code: "TJS", symbol: "ЅМ", name: "Tajikistani Somoni" },
  { code: "TMT", symbol: "m", name: "Turkmenistan Manat" },
  { code: "BTN", symbol: "Nu.", name: "Bhutanese Ngultrum" },
  { code: "KHR", symbol: "៛", name: "Cambodian Riel" },
  { code: "LAK", symbol: "₭", name: "Lao Kip" },
  { code: "BND", symbol: "$", name: "Brunei Dollar" },
  { code: "TWD", symbol: "NT$", name: "New Taiwan Dollar" },
  { code: "MOP", symbol: "MOP$", name: "Macanese Pataca" },
  { code: "KPW", symbol: "₩", name: "North Korean Won" },
  { code: "MKD", symbol: "ден", name: "Macedonian Denar" },
  { code: "ALL", symbol: "L", name: "Albanian Lek" },
  { code: "BAM", symbol: "KM", name: "Bosnia-Herzegovina Convertible Mark" }
];

let currentCurrency = currencies[0];
let chartInstance = null;
let currentChartType = 'growth';

document.addEventListener('DOMContentLoaded', () => {
  setupCurrencySearch();
  loadFromURL();
  calculateCAGR();
});

function setupCurrencySearch() {
  const searchInput = document.getElementById('currencySearch');
  const resultsDiv = document.getElementById('currencyResults');
  searchInput.value = currentCurrency.code + ' — ' + currentCurrency.name;
  searchInput.addEventListener('focus', () => {
    resultsDiv.classList.add('show');
    renderCurrencyResults(currencies);
  });
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = currencies.filter(c =>
      c.code.toLowerCase().includes(query) || c.name.toLowerCase().includes(query)
    );
    renderCurrencyResults(filtered);
    resultsDiv.classList.add('show');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.currency-search-wrapper')) {
      resultsDiv.classList.remove('show');
    }
  });
}

function renderCurrencyResults(list) {
  const resultsDiv = document.getElementById('currencyResults');
  if (list.length === 0) {
    resultsDiv.innerHTML = '<div class="currency-option"><span class="curr-name">No currencies found</span></div>';
    return;
  }
  resultsDiv.innerHTML = list.map(c => 
    '<div class="currency-option" onclick="selectCurrency(\'' + c.code + '\')">' +
    '<span class="curr-code">' + c.code + '</span>' +
    '<span class="curr-name">' + c.name + '</span>' +
    '</div>'
  ).join('');
}

function selectCurrency(code) {
  currentCurrency = currencies.find(c => c.code === code) || currencies[0];
  document.getElementById('currencySearch').value = currentCurrency.code + ' — ' + currentCurrency.name;
  document.getElementById('currencyResults').classList.remove('show');
  document.getElementById('currencySymbol').textContent = currentCurrency.symbol;
  document.getElementById('currencySymbol2').textContent = currentCurrency.symbol;
  calculateCAGR();
}

function syncSlider(id) {
  const input = document.getElementById(id);
  const slider = document.getElementById(id + 'Slider');
  const valDisplay = document.getElementById(id + 'SliderVal');
  if (!slider) return;
  let val = parseFloat(input.value) || 0;
  slider.value = val;
  if (valDisplay) {
    if (id === 'startValue' || id === 'endValue') {
      valDisplay.textContent = formatCompact(val);
    } else if (id === 'years') {
      valDisplay.textContent = val + ' yrs';
    }
  }
}

function syncInput(id, value) {
  const input = document.getElementById(id);
  const valDisplay = document.getElementById(id + 'SliderVal');
  input.value = value;
  if (valDisplay) {
    if (id === 'startValue' || id === 'endValue') {
      valDisplay.textContent = formatCompact(parseFloat(value));
    } else if (id === 'years') {
      valDisplay.textContent = value + ' yrs';
    }
  }
}

function formatCompact(num) {
  const symbol = currentCurrency.symbol;
  if (num >= 1000000) return symbol + (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return symbol + (num / 1000).toFixed(1) + 'k';
  return symbol + num;
}

function formatCurrency(num) {
  return currentCurrency.symbol + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculateCAGR() {
  const startValue = parseFloat(document.getElementById('startValue').value) || 0;
  const endValue = parseFloat(document.getElementById('endValue').value) || 0;
  const years = parseFloat(document.getElementById('years').value) || 1;
  const startYear = parseInt(document.getElementById('startYear').value) || 2020;
  const showYearly = document.getElementById('showYearlyToggle').checked;

  if (startValue <= 0 || years <= 0) {
    document.getElementById('rCAGR').textContent = '—';
    document.getElementById('rCAGRSub').textContent = 'Enter valid values';
    return;
  }

  // CAGR formula: (End / Start)^(1/Years) - 1
  const cagr = Math.pow(endValue / startValue, 1 / years) - 1;
  const cagrPercent = cagr * 100;

  const totalReturn = endValue - startValue;
  const absoluteReturn = ((endValue - startValue) / startValue) * 100;

  // Build year-by-year data
  const yearlyData = [];
  let currentValue = startValue;

  for (let year = 1; year <= Math.ceil(years); year++) {
    const isPartial = year > years;
    const actualYear = isPartial ? years : year;
    const yearFraction = isPartial ? (years - Math.floor(years)) : 1;

    // Compound growth: Start * (1 + CAGR)^year
    const compoundedValue = startValue * Math.pow(1 + cagr, actualYear);

    const yearlyGain = compoundedValue - currentValue;
    const yearlyReturn = currentValue > 0 ? (yearlyGain / currentValue) * 100 : 0;

    yearlyData.push({
      year: startYear + year - 1,
      yearNum: year,
      value: compoundedValue,
      yearlyGain: yearlyGain,
      yearlyReturn: yearlyReturn,
      cumulativeReturn: ((compoundedValue - startValue) / startValue) * 100,
      isPartial: isPartial
    });

    currentValue = compoundedValue;
  }

  // Update result cards
  document.getElementById('rCAGR').textContent = cagrPercent.toFixed(2) + '%';
  document.getElementById('rCAGRSub').textContent = 
    'Annualized growth rate over ' + years + ' year' + (years !== 1 ? 's' : '');

  document.getElementById('rTotalReturn').textContent = formatCurrency(Math.abs(totalReturn));
  document.getElementById('rTotalReturn').style.color = totalReturn >= 0 ? '#0f766e' : '#ef4444';

  document.getElementById('rAbsoluteReturn').textContent = absoluteReturn.toFixed(2) + '%';
  document.getElementById('rAbsoluteReturn').style.color = absoluteReturn >= 0 ? '#0f766e' : '#ef4444';

  document.getElementById('rStartValue').textContent = formatCurrency(startValue);
  document.getElementById('rEndValue').textContent = formatCurrency(endValue);
  document.getElementById('rPeriod').textContent = years + ' yr' + (years !== 1 ? 's' : '');

  // Insight box
  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');

  if (cagrPercent < 0) {
    insightBox.style.display = 'block';
    insightText.innerHTML = '<strong>Loss:</strong> Your investment declined at a CAGR of ' + cagrPercent.toFixed(2) + '% annually. ' +
      'The value dropped from ' + formatCurrency(startValue) + ' to ' + formatCurrency(endValue) + '. ' +
      'That is a total loss of ' + formatCurrency(Math.abs(totalReturn)) + '.';
  } else if (cagrPercent < 3) {
    insightBox.style.display = 'block';
    insightText.innerHTML = '<strong>Low growth:</strong> Your CAGR is ' + cagrPercent.toFixed(2) + '%. ' +
      'While positive, this barely keeps pace with typical inflation. ' +
      'Consider higher-return investments for better wealth growth.';
  } else if (cagrPercent > 15) {
    insightBox.style.display = 'block';
    insightText.innerHTML = '<strong>Excellent growth:</strong> A CAGR of ' + cagrPercent.toFixed(2) + '% is outstanding. ' +
      'Your ' + formatCurrency(startValue) + ' grew to ' + formatCurrency(endValue) + ' in ' + years + ' years. ' +
      'At this rate, money doubles approximately every ' + (70 / cagrPercent).toFixed(1) + ' years (Rule of 72).';
  } else {
    insightBox.style.display = 'block';
    insightText.innerHTML = '<strong>Solid growth:</strong> Your investment grew at a CAGR of ' + cagrPercent.toFixed(2) + '%. ' +
      'The total return was ' + formatCurrency(totalReturn) + ' (' + absoluteReturn.toFixed(2) + '%). ' +
      'Money doubles approximately every ' + (70 / cagrPercent).toFixed(1) + ' years at this rate.';
  }

  // Update chart
  updateChart(yearlyData, startValue, endValue, showYearly);

  // Update table
  updateTable(yearlyData, startValue);
}

function updateChart(data, startValue, endValue, showYearly) {
  const ctx = document.getElementById('toolChart').getContext('2d');
  const labels = data.map(d => d.year);

  const datasets = [];

  if (currentChartType === 'growth') {
    datasets.push({
      label: 'Investment Value',
      data: data.map(d => d.value),
      borderColor: '#0d9488',
      backgroundColor: 'rgba(13, 148, 136, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 7
    });
    if (showYearly) {
      datasets.push({
        label: 'Yearly Gain',
        data: data.map(d => d.yearlyGain),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderDash: [5, 5]
      });
    }
  } else if (currentChartType === 'yearly') {
    datasets.push({
      label: 'Yearly Gain',
      data: data.map(d => d.yearlyGain),
      borderColor: '#0d9488',
      backgroundColor: 'rgba(13, 148, 136, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6
    });
  } else if (currentChartType === 'comparison') {
    datasets.push({
      label: 'CAGR Growth',
      data: data.map(d => d.value),
      borderColor: '#0d9488',
      backgroundColor: 'rgba(13, 148, 136, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6
    });
    datasets.push({
      label: 'Linear Growth (Same Total)',
      data: data.map((d, i) => startValue + (endValue - startValue) * (i + 1) / data.length),
      borderColor: '#94a3b8',
      backgroundColor: 'transparent',
      fill: false,
      tension: 0,
      pointRadius: 0,
      pointHoverRadius: 0,
      borderDash: [8, 4]
    });
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Inter', size: 12 }, usePointStyle: true }
        },
        tooltip: {
          backgroundColor: '#1e293b',
          titleFont: { family: 'Inter', size: 13 },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              label += currentCurrency.symbol + context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: {
            font: { family: 'Inter', size: 11 },
            color: '#94a3b8',
            callback: function(value) {
              if (value >= 1000000) return currentCurrency.symbol + (value / 1000000).toFixed(1) + 'M';
              if (value >= 1000) return currentCurrency.symbol + (value / 1000).toFixed(0) + 'k';
              return currentCurrency.symbol + value;
            }
          }
        }
      }
    }
  });
}

function switchChart(type, btn) {
  currentChartType = type;
  document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  calculateCAGR();
}

function updateTable(data, startValue) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');

  thead.innerHTML = '<tr><th>Year</th><th>Value</th><th>Yearly Gain</th><th>Cumulative Return</th></tr>';

  tbody.innerHTML = data.map(d => {
    const gainClass = d.yearlyGain >= 0 ? 'positive' : 'negative';
    return '<tr>' +
      '<td>' + d.year + (d.isPartial ? ' (partial)' : '') + '</td>' +
      '<td class="highlight">' + formatCurrency(d.value) + '</td>' +
      '<td class="' + gainClass + '">' + formatCurrency(d.yearlyGain) + '</td>' +
      '<td>' + d.cumulativeReturn.toFixed(2) + '%</td>' +
      '</tr>';
  }).join('');
}

function resetForm() {
  document.getElementById('startValue').value = 10000;
  document.getElementById('endValue').value = 25000;
  document.getElementById('years').value = 5;
  document.getElementById('startYear').value = 2020;
  document.getElementById('showYearlyToggle').checked = true;

  syncSlider('startValue');
  syncSlider('endValue');
  syncSlider('years');

  calculateCAGR();
}

function downloadCSV() {
  const rows = document.querySelectorAll('#breakdownTable tbody tr');
  if (rows.length === 0) return;

  let csv = 'Year,Value,Yearly Gain,Cumulative Return\n';
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const line = Array.from(cells).map(c => c.textContent.replace(/[$,]/g, '').replace(' (partial)', '')).join(',');
    csv += line + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cagr-breakdown.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function copyResult() {
  const cagr = document.getElementById('rCAGR').textContent;
  const totalReturn = document.getElementById('rTotalReturn').textContent;
  const absoluteReturn = document.getElementById('rAbsoluteReturn').textContent;
  const text = 'CAGR: ' + cagr + '\nTotal Return: ' + totalReturn + '\nAbsolute Return: ' + absoluteReturn;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    const original = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = original, 2000);
  });
}

function shareURL() {
  const params = new URLSearchParams({
    start: document.getElementById('startValue').value,
    end: document.getElementById('endValue').value,
    years: document.getElementById('years').value,
    startYear: document.getElementById('startYear').value,
    currency: currentCurrency.code
  });

  const url = window.location.origin + window.location.pathname + '?' + params.toString();
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('shareBtn');
    const original = btn.textContent;
    btn.textContent = '✓ Link Copied!';
    setTimeout(() => btn.textContent = original, 2000);
  });
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('start')) document.getElementById('startValue').value = params.get('start');
  if (params.has('end')) document.getElementById('endValue').value = params.get('end');
  if (params.has('years')) document.getElementById('years').value = params.get('years');
  if (params.has('startYear')) document.getElementById('startYear').value = params.get('startYear');
  if (params.has('currency')) {
    const code = params.get('currency');
    const found = currencies.find(c => c.code === code);
    if (found) selectCurrency(code);
  }

  syncSlider('startValue');
  syncSlider('endValue');
  syncSlider('years');
}