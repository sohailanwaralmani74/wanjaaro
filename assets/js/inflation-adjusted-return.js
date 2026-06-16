/* ═══════════════════════════════════════════════════════════
   Inflation Adjusted Return Calculator — JavaScript
   Formula: Real Rate = (1 + Nominal) / (1 + Inflation) - 1
   Future Real Value = Nominal Value / (1 + Inflation)^Years
═══════════════════════════════════════════════════════════ */

// ── Currency data ──
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
let currentChartType = 'nominalVsReal';

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  setupCurrencySearch();
  loadFromURL();
  calculateInflation();
});

// ── Currency Search ──
function setupCurrencySearch() {
  const searchInput = document.getElementById('currencySearch');
  const resultsDiv = document.getElementById('currencyResults');

  searchInput.value = `${currentCurrency.code} — ${currentCurrency.name}`;

  searchInput.addEventListener('focus', () => {
    resultsDiv.classList.add('show');
    renderCurrencyResults(currencies);
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = currencies.filter(c =>
      c.code.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query)
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
  resultsDiv.innerHTML = list.map(c => `
    <div class="currency-option" onclick="selectCurrency('${c.code}')">
      <span class="curr-code">${c.code}</span>
      <span class="curr-name">${c.name}</span>
    </div>
  `).join('');
}

function selectCurrency(code) {
  currentCurrency = currencies.find(c => c.code === code) || currencies[0];
  document.getElementById('currencySearch').value = `${currentCurrency.code} — ${currentCurrency.name}`;
  document.getElementById('currencyResults').classList.remove('show');
  document.getElementById('currencySymbol').textContent = currentCurrency.symbol;
  document.getElementById('currencySymbol2').textContent = currentCurrency.symbol;
  document.getElementById('currencySymbol3').textContent = currentCurrency.symbol;
  calculateInflation();
}

// ── Slider Sync ──
function syncSlider(id) {
  const input = document.getElementById(id);
  const slider = document.getElementById(id + 'Slider');
  const valDisplay = document.getElementById(id + 'SliderVal');
  if (!slider) return;

  let val = parseFloat(input.value) || 0;
  slider.value = val;

  if (valDisplay) {
    if (id === 'initialAmount') {
      valDisplay.textContent = formatCompact(val);
    } else if (id === 'years') {
      valDisplay.textContent = val + ' yrs';
    } else {
      valDisplay.textContent = val + '%';
    }
  }
}

function syncInput(id, value) {
  const input = document.getElementById(id);
  const valDisplay = document.getElementById(id + 'SliderVal');
  input.value = value;

  if (valDisplay) {
    if (id === 'initialAmount') {
      valDisplay.textContent = formatCompact(parseFloat(value));
    } else if (id === 'years') {
      valDisplay.textContent = value + ' yrs';
    } else {
      valDisplay.textContent = value + '%';
    }
  }
}

function formatCompact(num) {
  const symbol = currentCurrency.symbol;
  if (num >= 1000000) return symbol + (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return symbol + (num / 1000).toFixed(1) + 'k';
  return symbol + num;
}

// ── Main Calculation ──
function calculateInflation() {
  const initialAmount = parseFloat(document.getElementById('initialAmount').value) || 0;
  const nominalRate = (parseFloat(document.getElementById('nominalRate').value) || 0) / 100;
  const inflationRate = (parseFloat(document.getElementById('inflationRate').value) || 0) / 100;
  const years = parseInt(document.getElementById('years').value) || 1;
  const monthly = parseFloat(document.getElementById('monthly').value) || 0;
  const yearly = parseFloat(document.getElementById('yearly').value) || 0;
  const startYear = parseInt(document.getElementById('startYear').value) || 2025;
  const showNominal = document.getElementById('showNominalToggle').checked;

  // Real rate of return formula: (1 + nominal) / (1 + inflation) - 1
  const realRate = ((1 + nominalRate) / (1 + inflationRate)) - 1;
  const realRatePercent = realRate * 100;

  // Build year-by-year data
  const yearlyData = [];
  let nominalBalance = initialAmount;
  let realBalance = initialAmount;
  let totalContributed = initialAmount;

  for (let year = 1; year <= years; year++) {
    // Add yearly contribution at start of year
    if (yearly > 0) {
      nominalBalance += yearly;
      realBalance += yearly;
      totalContributed += yearly;
    }

    // Add monthly contributions (12 months, at start of each month)
    if (monthly > 0) {
      for (let m = 0; m < 12; m++) {
        nominalBalance += monthly;
        realBalance += monthly;
        totalContributed += monthly;
      }
    }

    // Apply nominal return
    nominalBalance = nominalBalance * (1 + nominalRate);

    // Apply real return (compound the real rate)
    realBalance = realBalance * (1 + realRate);

    // Alternative: deflate nominal by cumulative inflation
    const cumulativeInflation = Math.pow(1 + inflationRate, year);
    const realValueFromNominal = nominalBalance / cumulativeInflation;

    yearlyData.push({
      year: startYear + year - 1,
      yearNum: year,
      nominalBalance: nominalBalance,
      realBalance: realBalance,
      realValueFromNominal: realValueFromNominal,
      totalContributed: totalContributed,
      inflationErosion: nominalBalance - realValueFromNominal
    });
  }

  const finalData = yearlyData[yearlyData.length - 1];
  const nominalFinal = finalData.nominalBalance;
  const realFinal = finalData.realValueFromNominal;
  const purchasingPowerLost = nominalFinal - realFinal;

  // Update result cards
  document.getElementById('rRealRate').textContent = realRatePercent.toFixed(2) + '%';
  document.getElementById('rRealRateSub').textContent = 
    realRatePercent >= 0 ? 'Your true earning rate' : 'Negative real return — losing purchasing power';

  document.getElementById('rNominalRate').textContent = (nominalRate * 100).toFixed(2) + '%';
  document.getElementById('rInflationRate').textContent = (inflationRate * 100).toFixed(2) + '%';
  document.getElementById('rNominalValue').textContent = formatCurrency(nominalFinal);
  document.getElementById('rRealValue').textContent = formatCurrency(realFinal);
  document.getElementById('rPurchasingPowerLost').textContent = formatCurrency(purchasingPowerLost);

  // Insight box
  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');

  if (realRatePercent < 0) {
    insightBox.style.display = 'block';
    insightText.innerHTML = `<strong>Warning:</strong> Your nominal return of ${(nominalRate * 100).toFixed(1)}% is below inflation of ${(inflationRate * 100).toFixed(1)}%. You are losing ${Math.abs(realRatePercent).toFixed(2)}% in purchasing power every year. Consider investments with higher returns or lower inflation environments.`;
  } else if (realRatePercent < 2) {
    insightBox.style.display = 'block';
    insightText.innerHTML = `<strong>Caution:</strong> Your real return is only ${realRatePercent.toFixed(2)}%. After ${years} years, your ${formatCurrency(initialAmount)} will only be worth ${formatCurrency(realFinal)} in today's money. Consider increasing your nominal return or finding lower inflation investments.`;
  } else {
    insightBox.style.display = 'block';
    insightText.innerHTML = `<strong>Good news:</strong> Your real return is ${realRatePercent.toFixed(2)}%. After ${years} years, your investment grows to ${formatCurrency(nominalFinal)} nominally, but its real purchasing power is ${formatCurrency(realFinal)} in today's money.`;
  }

  // Update chart
  updateChart(yearlyData, showNominal);

  // Update table
  updateTable(yearlyData);
}

function formatCurrency(num) {
  return currentCurrency.symbol + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Chart ──
function updateChart(data, showNominal) {
  const ctx = document.getElementById('toolChart').getContext('2d');
  const labels = data.map(d => d.year);

  const datasets = [];

  if (showNominal) {
    datasets.push({
      label: 'Nominal Value',
      data: data.map(d => d.nominalBalance),
      borderColor: '#0d9488',
      backgroundColor: 'rgba(13, 148, 136, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6
    });
  }

  datasets.push({
    label: 'Real Value (Inflation Adjusted)',
    data: data.map(d => d.realValueFromNominal),
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    fill: true,
    tension: 0.4,
    pointRadius: 3,
    pointHoverRadius: 6
  });

  if (currentChartType === 'purchasingPower') {
    datasets.length = 0;
    datasets.push({
      label: 'Purchasing Power Retained (%)',
      data: data.map(d => (d.realValueFromNominal / d.nominalBalance * 100)),
      borderColor: '#0d9488',
      backgroundColor: 'rgba(13, 148, 136, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6
    });
  } else if (currentChartType === 'breakdown') {
    datasets.length = 0;
    datasets.push({
      label: 'Inflation Erosion',
      data: data.map(d => d.inflationErosion),
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6
    });
    datasets.push({
      label: 'Real Value',
      data: data.map(d => d.realValueFromNominal),
      borderColor: '#0d9488',
      backgroundColor: 'rgba(13, 148, 136, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6
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
              if (currentChartType === 'purchasingPower') {
                label += context.parsed.y.toFixed(1) + '%';
              } else {
                label += currentCurrency.symbol + context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              }
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
              if (currentChartType === 'purchasingPower') return value.toFixed(0) + '%';
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
  calculateInflation();
}

// ── Table ──
function updateTable(data) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  const startYear = parseInt(document.getElementById('startYear').value) || 2025;

  thead.innerHTML = `
    <tr>
      <th>Year</th>
      <th>Nominal Value</th>
      <th>Real Value</th>
      <th>Inflation Erosion</th>
      <th>Purchasing Power</th>
    </tr>
  `;

  tbody.innerHTML = data.map(d => {
    const ppPercent = (d.realValueFromNominal / d.nominalBalance * 100).toFixed(1);
    return `
      <tr>
        <td>${d.year}</td>
        <td>${formatCurrency(d.nominalBalance)}</td>
        <td class="highlight">${formatCurrency(d.realValueFromNominal)}</td>
        <td>${formatCurrency(d.inflationErosion)}</td>
        <td>${ppPercent}%</td>
      </tr>
    `;
  }).join('');
}

// ── Reset ──
function resetForm() {
  document.getElementById('initialAmount').value = 10000;
  document.getElementById('nominalRate').value = 8;
  document.getElementById('inflationRate').value = 3;
  document.getElementById('years').value = 10;
  document.getElementById('monthly').value = 0;
  document.getElementById('yearly').value = 0;
  document.getElementById('startYear').value = 2025;
  document.getElementById('showNominalToggle').checked = true;

  syncSlider('initialAmount');
  syncSlider('nominalRate');
  syncSlider('inflationRate');
  syncSlider('years');

  calculateInflation();
}

// ── Download CSV ──
function downloadCSV() {
  const rows = document.querySelectorAll('#breakdownTable tbody tr');
  if (rows.length === 0) return;

  let csv = 'Year,Nominal Value,Real Value,Inflation Erosion,Purchasing Power\n';
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const line = Array.from(cells).map(c => c.textContent.replace(/[$,]/g, '')).join(',');
    csv += line + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inflation-adjusted-return.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ── Copy Result ──
function copyResult() {
  const realRate = document.getElementById('rRealRate').textContent;
  const nominalValue = document.getElementById('rNominalValue').textContent;
  const realValue = document.getElementById('rRealValue').textContent;
  const text = `Real Rate of Return: ${realRate}\nNominal Value: ${nominalValue}\nReal Value: ${realValue}`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    const original = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = original, 2000);
  });
}

// ── Share URL ──
function shareURL() {
  const params = new URLSearchParams({
    amount: document.getElementById('initialAmount').value,
    nominal: document.getElementById('nominalRate').value,
    inflation: document.getElementById('inflationRate').value,
    years: document.getElementById('years').value,
    monthly: document.getElementById('monthly').value,
    yearly: document.getElementById('yearly').value,
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

// ── Load from URL ──
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('amount')) document.getElementById('initialAmount').value = params.get('amount');
  if (params.has('nominal')) document.getElementById('nominalRate').value = params.get('nominal');
  if (params.has('inflation')) document.getElementById('inflationRate').value = params.get('inflation');
  if (params.has('years')) document.getElementById('years').value = params.get('years');
  if (params.has('monthly')) document.getElementById('monthly').value = params.get('monthly');
  if (params.has('yearly')) document.getElementById('yearly').value = params.get('yearly');
  if (params.has('startYear')) document.getElementById('startYear').value = params.get('startYear');
  if (params.has('currency')) {
    const code = params.get('currency');
    const found = currencies.find(c => c.code === code);
    if (found) selectCurrency(code);
  }

  syncSlider('initialAmount');
  syncSlider('nominalRate');
  syncSlider('inflationRate');
  syncSlider('years');
}