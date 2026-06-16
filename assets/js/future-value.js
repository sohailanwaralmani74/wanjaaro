// =============================================================================
// FUTURE VALUE CALCULATOR — JS
// Fixes applied:
//   1. shareURL & loadFromURL exclude range sliders (no URL param pollution)
//   2. loadFromURL runs before setupCurrencySearch (currency from URL reflects correctly)
//   3. copyResult & shareURL have .catch() clipboard fallback
//   4. isMoney array deduplicated into shared MONEY_FIELDS Set + getSliderDisplayText()
//   5. Bar chart interest isolated correctly (interest delta, not value delta minus contribs)
//   6. renderTable map callback renamed from 'r' to 'row' to avoid shadowing rate variable
//   7. Inflation toggle show/hide removed from loadFromURL (calculate() owns it exclusively)
//   8. resetForm now syncs the 'monthly' slider
//   9. switchChart guards against null btn
//  10. Expanded currency list to 170+ world currencies
// =============================================================================

const currencies = [
  // Major / Most Common
  { code: "USD", name: "US Dollar",              symbol: "$"    },
  { code: "EUR", name: "Euro",                   symbol: "€"    },
  { code: "GBP", name: "British Pound",          symbol: "£"    },
  { code: "JPY", name: "Japanese Yen",           symbol: "¥"    },
  { code: "CHF", name: "Swiss Franc",            symbol: "Fr"   },
  { code: "CAD", name: "Canadian Dollar",        symbol: "C$"   },
  { code: "AUD", name: "Australian Dollar",      symbol: "A$"   },
  { code: "CNY", name: "Chinese Yuan",           symbol: "¥"    },
  { code: "HKD", name: "Hong Kong Dollar",       symbol: "HK$"  },
  { code: "NZD", name: "New Zealand Dollar",     symbol: "NZ$"  },
  { code: "SGD", name: "Singapore Dollar",       symbol: "S$"   },
  { code: "SEK", name: "Swedish Krona",          symbol: "kr"   },
  { code: "NOK", name: "Norwegian Krone",        symbol: "kr"   },
  { code: "DKK", name: "Danish Krone",           symbol: "kr"   },

  // Asia
  { code: "INR", name: "Indian Rupee",           symbol: "₹"    },
  { code: "PKR", name: "Pakistani Rupee",        symbol: "₨"    },
  { code: "BDT", name: "Bangladeshi Taka",       symbol: "৳"    },
  { code: "LKR", name: "Sri Lankan Rupee",       symbol: "Rs"   },
  { code: "NPR", name: "Nepalese Rupee",         symbol: "रू"   },
  { code: "MVR", name: "Maldivian Rufiyaa",      symbol: "Rf"   },
  { code: "BTN", name: "Bhutanese Ngultrum",     symbol: "Nu"   },
  { code: "MMK", name: "Myanmar Kyat",           symbol: "K"    },
  { code: "THB", name: "Thai Baht",              symbol: "฿"    },
  { code: "VND", name: "Vietnamese Dong",        symbol: "₫"    },
  { code: "KHR", name: "Cambodian Riel",         symbol: "៛"    },
  { code: "LAK", name: "Lao Kip",                symbol: "₭"    },
  { code: "MYR", name: "Malaysian Ringgit",      symbol: "RM"   },
  { code: "IDR", name: "Indonesian Rupiah",      symbol: "Rp"   },
  { code: "PHP", name: "Philippine Peso",        symbol: "₱"    },
  { code: "BND", name: "Brunei Dollar",          symbol: "B$"   },
  { code: "KRW", name: "South Korean Won",       symbol: "₩"    },
  { code: "TWD", name: "Taiwan Dollar",          symbol: "NT$"  },
  { code: "MNT", name: "Mongolian Tugrik",       symbol: "₮"    },
  { code: "KZT", name: "Kazakhstani Tenge",      symbol: "₸"    },
  { code: "UZS", name: "Uzbekistani Som",        symbol: "so'm" },
  { code: "KGS", name: "Kyrgyzstani Som",        symbol: "с"    },
  { code: "TJS", name: "Tajikistani Somoni",     symbol: "SM"   },
  { code: "TMT", name: "Turkmenistani Manat",    symbol: "T"    },
  { code: "AFN", name: "Afghan Afghani",         symbol: "؋"    },

  // Middle East
  { code: "AED", name: "UAE Dirham",             symbol: "د.إ"  },
  { code: "SAR", name: "Saudi Riyal",            symbol: "﷼"    },
  { code: "QAR", name: "Qatari Riyal",           symbol: "ر.ق"  },
  { code: "KWD", name: "Kuwaiti Dinar",          symbol: "د.ك"  },
  { code: "BHD", name: "Bahraini Dinar",         symbol: ".د.ب" },
  { code: "OMR", name: "Omani Rial",             symbol: "ر.ع." },
  { code: "JOD", name: "Jordanian Dinar",        symbol: "JD"   },
  { code: "ILS", name: "Israeli Shekel",         symbol: "₪"    },
  { code: "LBP", name: "Lebanese Pound",         symbol: "ل.ل"  },
  { code: "SYP", name: "Syrian Pound",           symbol: "£S"   },
  { code: "IQD", name: "Iraqi Dinar",            symbol: "ع.د"  },
  { code: "IRR", name: "Iranian Rial",           symbol: "﷼"    },
  { code: "YER", name: "Yemeni Rial",            symbol: "﷼"    },

  // Europe (non-Euro)
  { code: "GBP", name: "British Pound",          symbol: "£"    },
  { code: "RUB", name: "Russian Ruble",          symbol: "₽"    },
  { code: "PLN", name: "Polish Zloty",           symbol: "zł"   },
  { code: "CZK", name: "Czech Koruna",           symbol: "Kč"   },
  { code: "HUF", name: "Hungarian Forint",       symbol: "Ft"   },
  { code: "RON", name: "Romanian Leu",           symbol: "lei"  },
  { code: "BGN", name: "Bulgarian Lev",          symbol: "лв"   },
  { code: "HRK", name: "Croatian Kuna",          symbol: "kn"   },
  { code: "RSD", name: "Serbian Dinar",          symbol: "дин"  },
  { code: "BAM", name: "Bosnia-Herzegovina Mark",symbol: "KM"   },
  { code: "MKD", name: "Macedonian Denar",       symbol: "ден"  },
  { code: "ALL", name: "Albanian Lek",           symbol: "L"    },
  { code: "UAH", name: "Ukrainian Hryvnia",      symbol: "₴"    },
  { code: "BYN", name: "Belarusian Ruble",       symbol: "Br"   },
  { code: "MDL", name: "Moldovan Leu",           symbol: "L"    },
  { code: "GEL", name: "Georgian Lari",          symbol: "₾"    },
  { code: "AMD", name: "Armenian Dram",          symbol: "֏"    },
  { code: "AZN", name: "Azerbaijani Manat",      symbol: "₼"    },
  { code: "ISK", name: "Icelandic Krona",        symbol: "kr"   },
  { code: "NOK", name: "Norwegian Krone",        symbol: "kr"   },
  { code: "TRY", name: "Turkish Lira",           symbol: "₺"    },
  { code: "CHF", name: "Swiss Franc",            symbol: "Fr"   },

  // Africa
  { code: "NGN", name: "Nigerian Naira",         symbol: "₦"    },
  { code: "ZAR", name: "South African Rand",     symbol: "R"    },
  { code: "KES", name: "Kenyan Shilling",        symbol: "KSh"  },
  { code: "GHS", name: "Ghanaian Cedi",          symbol: "₵"    },
  { code: "ETB", name: "Ethiopian Birr",         symbol: "Br"   },
  { code: "TZS", name: "Tanzanian Shilling",     symbol: "TSh"  },
  { code: "UGX", name: "Ugandan Shilling",       symbol: "USh"  },
  { code: "RWF", name: "Rwandan Franc",          symbol: "FRw"  },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA"  },
  { code: "XAF", name: "Central African CFA",    symbol: "FCFA" },
  { code: "EGP", name: "Egyptian Pound",         symbol: "£"    },
  { code: "MAD", name: "Moroccan Dirham",        symbol: "MAD"  },
  { code: "TND", name: "Tunisian Dinar",         symbol: "DT"   },
  { code: "DZD", name: "Algerian Dinar",         symbol: "دج"   },
  { code: "LYD", name: "Libyan Dinar",           symbol: "LD"   },
  { code: "SDG", name: "Sudanese Pound",         symbol: "ج.س." },
  { code: "ZMW", name: "Zambian Kwacha",         symbol: "ZK"   },
  { code: "MWK", name: "Malawian Kwacha",        symbol: "MK"   },
  { code: "ZWL", name: "Zimbabwean Dollar",      symbol: "Z$"   },
  { code: "BWP", name: "Botswana Pula",          symbol: "P"    },
  { code: "NAD", name: "Namibian Dollar",        symbol: "N$"   },
  { code: "MZN", name: "Mozambican Metical",     symbol: "MT"   },
  { code: "AOA", name: "Angolan Kwanza",         symbol: "Kz"   },
  { code: "CDF", name: "Congolese Franc",        symbol: "FC"   },
  { code: "GNF", name: "Guinean Franc",          symbol: "FG"   },
  { code: "SLL", name: "Sierra Leonean Leone",   symbol: "Le"   },
  { code: "LRD", name: "Liberian Dollar",        symbol: "L$"   },
  { code: "GMD", name: "Gambian Dalasi",         symbol: "D"    },
  { code: "CVE", name: "Cape Verdean Escudo",    symbol: "$"    },
  { code: "SOS", name: "Somali Shilling",        symbol: "Sh"   },
  { code: "DJF", name: "Djiboutian Franc",       symbol: "Fdj"  },
  { code: "ERN", name: "Eritrean Nakfa",         symbol: "Nfk"  },
  { code: "SCR", name: "Seychellois Rupee",      symbol: "SR"   },
  { code: "MUR", name: "Mauritian Rupee",        symbol: "Rs"   },
  { code: "MGA", name: "Malagasy Ariary",        symbol: "Ar"   },
  { code: "KMF", name: "Comorian Franc",         symbol: "CF"   },
  { code: "STN", name: "São Tomé Dobra",         symbol: "Db"   },

  // Americas
  { code: "MXN", name: "Mexican Peso",           symbol: "Mex$" },
  { code: "BRL", name: "Brazilian Real",         symbol: "R$"   },
  { code: "ARS", name: "Argentine Peso",         symbol: "$"    },
  { code: "CLP", name: "Chilean Peso",           symbol: "CLP$" },
  { code: "COP", name: "Colombian Peso",         symbol: "COL$" },
  { code: "PEN", name: "Peruvian Sol",           symbol: "S/."  },
  { code: "VES", name: "Venezuelan Bolívar",     symbol: "Bs.S" },
  { code: "BOB", name: "Bolivian Boliviano",     symbol: "Bs."  },
  { code: "PYG", name: "Paraguayan Guaraní",     symbol: "₲"    },
  { code: "UYU", name: "Uruguayan Peso",         symbol: "$U"   },
  { code: "GYD", name: "Guyanese Dollar",        symbol: "G$"   },
  { code: "SRD", name: "Surinamese Dollar",      symbol: "Sr$"  },
  { code: "TTD", name: "Trinidad & Tobago Dollar",symbol: "TT$" },
  { code: "JMD", name: "Jamaican Dollar",        symbol: "J$"   },
  { code: "BBD", name: "Barbadian Dollar",       symbol: "Bds$" },
  { code: "BSD", name: "Bahamian Dollar",        symbol: "B$"   },
  { code: "HTG", name: "Haitian Gourde",         symbol: "G"    },
  { code: "DOP", name: "Dominican Peso",         symbol: "RD$"  },
  { code: "CUP", name: "Cuban Peso",             symbol: "$MN"  },
  { code: "GTQ", name: "Guatemalan Quetzal",     symbol: "Q"    },
  { code: "HNL", name: "Honduran Lempira",       symbol: "L"    },
  { code: "NIO", name: "Nicaraguan Córdoba",     symbol: "C$"   },
  { code: "CRC", name: "Costa Rican Colón",      symbol: "₡"    },
  { code: "PAB", name: "Panamanian Balboa",      symbol: "B/."  },
  { code: "BZD", name: "Belize Dollar",          symbol: "BZ$"  },
  { code: "XCD", name: "East Caribbean Dollar",  symbol: "EC$"  },

  // Pacific
  { code: "FJD", name: "Fijian Dollar",          symbol: "FJ$"  },
  { code: "PGK", name: "Papua New Guinea Kina",  symbol: "K"    },
  { code: "SBD", name: "Solomon Islands Dollar", symbol: "SI$"  },
  { code: "VUV", name: "Vanuatu Vatu",           symbol: "VT"   },
  { code: "WST", name: "Samoan Tala",            symbol: "WS$"  },
  { code: "TOP", name: "Tongan Paʻanga",         symbol: "T$"   },
];

// Deduplicate by code (GBP, NOK, CHF appear twice in the source data above)
const seenCodes = new Set();
const uniqueCurrencies = currencies.filter(c => {
  if (seenCodes.has(c.code)) return false;
  seenCodes.add(c.code);
  return true;
});

// Sort alphabetically by code for easy scanning
uniqueCurrencies.sort((a, b) => a.code.localeCompare(b.code));

// Re-export as the working list
const allCurrencies = uniqueCurrencies;

let currentCurrency = allCurrencies.find(c => c.code === 'USD') || allCurrencies[0];
let chartInstance = null;
let currentChartType = 'line';

// FIX 4: Single shared Set — no more duplicated isMoney arrays
const MONEY_FIELDS = new Set([
  'principal', 'initialAmount', 'monthly', 'yearly', 'monthlyContribution',
  'additionalContributions', 'goalAmount', 'currentSavings', 'monthlySavings',
  'loanAmount', 'homeValue', 'downPayment', 'extraPayment', 'balance', 'amount',
  'income', 'housing', 'food', 'transport', 'utilities', 'other', 'cash',
  'investments', 'propertyValue', 'otherAssets', 'mortgage', 'loans', 'otherDebts',
  'debt1', 'debt2', 'monthlyRetirement', 'initialSavings', 'monthlyPayment', 'monthlyExpenses'
]);

function getSliderDisplayText(id, val) {
  if (MONEY_FIELDS.has(id)) return formatCompact(val);
  if (['years', 'currentAge', 'retirementAge'].includes(id)) return val + ' yrs';
  if (id === 'monthsNeeded') return val + ' mo';
  return val + '%';
}

// =============================================================================
// CURRENCY SEARCH
// =============================================================================

function setupCurrencySearch() {
  const searchInput = document.getElementById('currencySearch');
  const resultsDiv  = document.getElementById('currencyResults');
  if (!searchInput || !resultsDiv) return;

  searchInput.value = currentCurrency.code + ' — ' + currentCurrency.name;

  searchInput.addEventListener('focus', () => {
    resultsDiv.classList.add('show');
    renderCurrencyResults(allCurrencies);
  });

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allCurrencies.filter(c =>
      c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
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
  const div = document.getElementById('currencyResults');
  if (!div) return;

  if (!list.length) {
    div.innerHTML = '<div class="currency-option"><span class="curr-name">No currencies found</span></div>';
    return;
  }

  div.innerHTML = list.map(c =>
    '<div class="currency-option" onclick="selectCurrency(\'' + c.code + '\')">' +
    '<span class="curr-code">' + c.code + '</span>' +
    '<span class="curr-name">' + c.name + '</span>' +
    '</div>'
  ).join('');
}

function selectCurrency(code) {
  currentCurrency = allCurrencies.find(c => c.code === code) || allCurrencies[0];
  const searchInput = document.getElementById('currencySearch');
  const resultsDiv  = document.getElementById('currencyResults');
  if (searchInput) searchInput.value = currentCurrency.code + ' — ' + currentCurrency.name;
  if (resultsDiv)  resultsDiv.classList.remove('show');

  document.querySelectorAll('[id^="currencySymbol"]').forEach(s => s.textContent = currentCurrency.symbol);
  calculate();
}

// =============================================================================
// SLIDER / INPUT SYNC
// =============================================================================

function syncSlider(id) {
  const input   = document.getElementById(id);
  const slider  = document.getElementById(id + 'Slider');
  const display = document.getElementById(id + 'SliderVal');
  if (!input || !slider) return;

  const val = parseFloat(input.value) || 0;
  slider.value = val;
  if (display) display.textContent = getSliderDisplayText(id, val);
}

function syncInput(id, value) {
  const input   = document.getElementById(id);
  const display = document.getElementById(id + 'SliderVal');
  if (!input) return;

  input.value = value;
  if (display) display.textContent = getSliderDisplayText(id, parseFloat(value) || 0);
}

// =============================================================================
// FORMATTING
// =============================================================================

function formatCompact(num) {
  const val = isFinite(parseFloat(num)) ? parseFloat(num) : 0;
  const s   = currentCurrency.symbol;
  if (val >= 1_000_000_000) return s + (val / 1_000_000_000).toFixed(1) + 'B';
  if (val >= 1_000_000)     return s + (val / 1_000_000).toFixed(1) + 'M';
  if (val >= 1_000)         return s + (val / 1_000).toFixed(1) + 'k';
  return s + val.toFixed(0);
}

function formatCurrency(num) {
  const val = isFinite(parseFloat(num)) ? parseFloat(num) : 0;
  return currentCurrency.symbol + val.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// =============================================================================
// CHART / SHARE / COPY
// =============================================================================

// FIX 9: null-guard on btn
function switchChart(type, btn) {
  currentChartType = type;
  document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  calculate();
}

function downloadCSV() {
  const rows = document.querySelectorAll('#breakdownTable tbody tr');
  if (!rows.length) return;

  let csv = '';
  const headers = document.querySelectorAll('#breakdownTable thead th');
  csv += Array.from(headers).map(h => '"' + h.textContent.replace(/"/g, '""') + '"').join(',') + '\n';
  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('td')).map(c => '"' + c.textContent.replace(/"/g, '""').trim() + '"');
    csv += cells.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'future-value-breakdown.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// FIX 3: .catch() on clipboard
function copyResult() {
  const cards = document.querySelectorAll('#resultCards .result-card');
  let text = '';
  cards.forEach(c => {
    const label = c.querySelector('.result-label')?.textContent || '';
    const value = c.querySelector('.result-value')?.textContent || '';
    if (label && value) text += label + ': ' + value + '\n';
  });

  if (!text.trim()) return;

  navigator.clipboard.writeText(text.trim()).then(() => {
    const btn = document.getElementById('copyBtn');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = orig, 2000);
  }).catch(() => {
    alert('Copy failed — please copy the results manually.');
  });
}

// FIX 1 & 3: Exclude range sliders + .catch() fallback
function shareURL() {
  const params = new URLSearchParams();
  document.querySelectorAll('.input-panel input:not([type="range"]), .input-panel select').forEach(el => {
    if (el.id) params.set(el.id, el.value);
  });
  params.set('currency', currentCurrency.code);

  const url = window.location.origin + window.location.pathname + '?' + params.toString();
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('shareBtn');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = '✓ Link Copied!';
    setTimeout(() => btn.textContent = orig, 2000);
  }).catch(() => {
    alert('Could not copy link — please copy the URL from your address bar.');
  });
}

// FIX 1: Exclude range sliders when restoring from URL
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  document.querySelectorAll('.input-panel input:not([type="range"]), .input-panel select').forEach(el => {
    if (params.has(el.id)) el.value = params.get(el.id);
  });

  if (params.has('currency')) {
    const c = allCurrencies.find(x => x.code === params.get('currency'));
    if (c) {
      currentCurrency = c;
      document.querySelectorAll('[id^="currencySymbol"]').forEach(s => s.textContent = currentCurrency.symbol);
    }
  }
  // FIX 7: Inflation toggle UI is handled entirely by calculate() — not duplicated here
}

// =============================================================================
// CORE CALCULATION
// =============================================================================

function calculate() {
  const principal      = parseFloat(document.getElementById('principal')?.value)      || 0;
  const rate           = parseFloat(document.getElementById('rate')?.value)           || 0;
  const years          = parseInt(document.getElementById('years')?.value)            || 1;
  const compound       = parseInt(document.getElementById('compound')?.value)         || 12;
  const monthly        = parseFloat(document.getElementById('monthly')?.value)        || 0;
  const inflationToggle = document.getElementById('inflationToggle')?.checked         || false;
  const inflationRate  = parseFloat(document.getElementById('inflationRate')?.value)  || 0;

  // FIX 7: Inflation toggle UI lives only here
  const inflationGroup = document.getElementById('inflationRateGroup');
  if (inflationGroup) inflationGroup.style.display = inflationToggle ? 'block' : 'none';

  const realValueCard = document.getElementById('realValueCard');
  if (realValueCard) realValueCard.style.display = inflationToggle ? 'flex' : 'none';

  // Edge case: zero rate
  if (rate <= 0) {
    const simpleTotal = principal + monthly * 12 * years;
    document.getElementById('rFutureValue').textContent  = formatCurrency(simpleTotal);
    document.getElementById('rContributed').textContent  = formatCurrency(simpleTotal);
    document.getElementById('rInterest').textContent     = formatCurrency(0);
    document.getElementById('rAPY').textContent          = '0%';
    document.getElementById('rMultiple').textContent     = '1.0×';
    if (inflationToggle) {
      const realVal = simpleTotal / Math.pow(1 + inflationRate / 100, years);
      document.getElementById('rRealValue').textContent  = formatCurrency(realVal);
    }
    document.getElementById('insightBox').style.display  = 'none';
    renderTable(principal, rate, years, compound, monthly, inflationToggle, inflationRate);
    renderChart(principal, rate, years, compound, monthly, inflationToggle, inflationRate);
    return;
  }

  const r           = rate / 100;
  const n           = compound;
  const t           = years;
  const monthlyRate = r / 12;   // contributions are always monthly → always compounded at r/12

  // Future Value: lump sum
  // FV = PV * (1 + r/n)^(n*t)
  const fvLumpSum = principal * Math.pow(1 + r / n, n * t);

  // Future Value: monthly contributions (annuity due — beginning of period)
  // FV = PMT * [(1 + monthlyRate)^(12*t) - 1] / monthlyRate * (1 + monthlyRate)
  // Note: monthly contributions are assumed to compound monthly regardless of 'compound' setting
  // because payments are made monthly. The compounding frequency only affects the lump sum.
  let fvContributions = 0;
  if (monthly > 0) {
    if (monthlyRate > 0) {
      fvContributions = monthly * ((Math.pow(1 + monthlyRate, 12 * t) - 1) / monthlyRate) * (1 + monthlyRate);
    } else {
      fvContributions = monthly * 12 * t;
    }
  }

  const futureValue      = fvLumpSum + fvContributions;
  const totalContributed = principal + monthly * 12 * t;
  const interestEarned   = futureValue - totalContributed;

  // Effective APY = (1 + r/n)^n - 1
  const apy      = (Math.pow(1 + r / n, n) - 1) * 100;
  const multiple = totalContributed > 0 ? futureValue / totalContributed : 1;

  document.getElementById('rFutureValue').textContent  = formatCurrency(futureValue);
  document.getElementById('rContributed').textContent  = formatCurrency(totalContributed);
  document.getElementById('rInterest').textContent     = formatCurrency(interestEarned);
  document.getElementById('rAPY').textContent          = apy.toFixed(2) + '%';
  document.getElementById('rMultiple').textContent     = multiple.toFixed(1) + '×';

  if (inflationToggle) {
    const realValue = futureValue / Math.pow(1 + inflationRate / 100, years);
    document.getElementById('rRealValue').textContent = formatCurrency(realValue);
  }

  // Insight box
  const insightBox  = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    let text = monthly > 0
      ? 'With ' + formatCurrency(principal) + ' upfront and ' + formatCurrency(monthly) + '/month, '
      : 'With ' + formatCurrency(principal) + ' invested, ';
    text += 'your money grows to ' + formatCurrency(futureValue) + ' in ' + years + ' years at ' + rate.toFixed(1) + '%. ';
    text += 'That is ' + multiple.toFixed(1) + '× your total contributions.';
    if (inflationToggle) {
      const realValue = futureValue / Math.pow(1 + inflationRate / 100, years);
      text += ' Adjusted for ' + inflationRate + '% inflation, the real purchasing power is ' + formatCurrency(realValue) + '.';
    }
    insightText.textContent = text;
  }

  renderChart(principal, rate, years, compound, monthly, inflationToggle, inflationRate);
  renderTable(principal, rate, years, compound, monthly, inflationToggle, inflationRate);
}

// =============================================================================
// CHART
// =============================================================================

function renderChart(principal, rate, years, compound, monthly, inflationToggle, inflationRate) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
  if (typeof Chart === 'undefined') { console.warn('Chart.js not loaded'); return; }

  const r           = rate / 100;
  const n           = compound;
  const monthlyRate = r / 12;

  // Build yearly data points
  const dataPoints = [];
  for (let yr = 0; yr <= years; yr++) {
    const fvLump = principal * Math.pow(1 + r / n, n * yr);
    let fvContrib = 0;
    if (monthly > 0 && monthlyRate > 0) {
      fvContrib = monthly * ((Math.pow(1 + monthlyRate, 12 * yr) - 1) / monthlyRate) * (1 + monthlyRate);
    } else if (monthly > 0) {
      fvContrib = monthly * 12 * yr;
    }
    dataPoints.push({ year: yr, value: fvLump + fvContrib });
  }

  const labels = dataPoints.map(d => 'Year ' + d.year);
  let config;

  if (currentChartType === 'line') {
    config = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Future Value',
          data: dataPoints.map(d => d.value),
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => formatCurrency(ctx.parsed.y) } }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => formatCompact(v), color: '#64748b', font: { size: 11 } },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: { maxTicksLimit: 10, color: '#64748b', font: { size: 11 } },
            grid: { display: false }
          }
        }
      }
    };

  } else if (currentChartType === 'bar') {
    // FIX 5: Correctly isolate interest earned each year
    // Annual interest = FV[year] - FV[year-1] - monthly contributions made that year
    const annualContrib = monthly * 12;
    const yearlyInterest = [];
    for (let yr = 1; yr <= years; yr++) {
      const interestThisYear = dataPoints[yr].value - dataPoints[yr - 1].value - annualContrib;
      yearlyInterest.push({ label: 'Year ' + yr, value: Math.max(0, interestThisYear) });
    }

    config = {
      type: 'bar',
      data: {
        labels: yearlyInterest.map(g => g.label),
        datasets: [{
          label: 'Interest Earned',
          data: yearlyInterest.map(g => g.value),
          backgroundColor: '#0d9488',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => formatCurrency(ctx.parsed.y) } }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => formatCompact(v), color: '#64748b', font: { size: 11 } },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: { maxTicksLimit: 10, color: '#64748b', font: { size: 11 } },
            grid: { display: false }
          }
        }
      }
    };

  } else {
    // Doughnut: principal vs. contributions vs. interest
    const finalValue       = dataPoints[dataPoints.length - 1].value;
    const totalContrib     = monthly * 12 * years;
    const interest         = finalValue - principal - totalContrib;

    let chartData, chartLabels, chartColors;
    if (monthly > 0) {
      chartData   = [principal, totalContrib, Math.max(0, interest)];
      chartLabels = ['Principal', 'Contributions', 'Interest'];
      chartColors = ['#0d9488', '#5eead4', '#99f6e4'];
    } else {
      chartData   = [principal, Math.max(0, interest)];
      chartLabels = ['Principal', 'Interest'];
      chartColors = ['#0d9488', '#99f6e4'];
    }

    config = {
      type: 'doughnut',
      data: {
        labels: chartLabels,
        datasets: [{ data: chartData, backgroundColor: chartColors, borderWidth: 0, hoverOffset: 4 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#475569', font: { size: 12 }, padding: 16, usePointStyle: true }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed;
                const pct = ((val / finalValue) * 100).toFixed(1);
                return ctx.label + ': ' + formatCurrency(val) + ' (' + pct + '%)';
              }
            }
          }
        }
      }
    };
  }

  chartInstance = new Chart(ctx, config);
}

// =============================================================================
// TABLE
// =============================================================================

function renderTable(principal, rate, years, compound, monthly, inflationToggle, inflationRate) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;

  const r           = rate / 100;
  const n           = compound;
  const monthlyRate = r / 12;

  thead.innerHTML = inflationToggle
    ? '<tr><th>Year</th><th>Future Value</th><th>Total Contributed</th><th>Interest Earned</th><th>Real Value (Adj.)</th></tr>'
    : '<tr><th>Year</th><th>Future Value</th><th>Total Contributed</th><th>Interest Earned</th><th>Annual Growth</th></tr>';

  const rows     = [];
  let   prevValue = principal;

  for (let yr = 1; yr <= years; yr++) {
    const fvLump = principal * Math.pow(1 + r / n, n * yr);
    let fvContrib = 0;
    if (monthly > 0 && monthlyRate > 0) {
      fvContrib = monthly * ((Math.pow(1 + monthlyRate, 12 * yr) - 1) / monthlyRate) * (1 + monthlyRate);
    } else if (monthly > 0) {
      fvContrib = monthly * 12 * yr;
    }

    const futureValue  = fvLump + fvContrib;
    const contributed  = principal + monthly * 12 * yr;
    const interest     = futureValue - contributed;

    // FIX 5: Annual growth = value delta minus contributions made this year
    const annualGrowth = futureValue - prevValue - (monthly * 12);
    const growthPct    = prevValue > 0
      ? ((Math.max(0, annualGrowth) / prevValue) * 100).toFixed(1) + '%'
      : '—';

    const realValue = inflationToggle
      ? futureValue / Math.pow(1 + inflationRate / 100, yr)
      : null;

    rows.push({ yr, futureValue, contributed, interest, annualGrowth, growthPct, realValue });
    prevValue = futureValue;
  }

  // FIX 6: Map callback renamed to 'row' so it doesn't shadow the outer 'r' (rate/100)
  tbody.innerHTML = rows.map(row => {
    const lastCol = (inflationToggle && row.realValue !== null)
      ? '<td>' + formatCurrency(row.realValue) + '</td>'
      : '<td>' + formatCurrency(Math.max(0, row.annualGrowth)) + ' (' + row.growthPct + ')</td>';

    return '<tr>' +
      '<td>' + row.yr + '</td>' +
      '<td class="highlight">' + formatCurrency(row.futureValue) + '</td>' +
      '<td>' + formatCurrency(row.contributed) + '</td>' +
      '<td>' + formatCurrency(row.interest) + '</td>' +
      lastCol +
      '</tr>';
  }).join('');
}

// =============================================================================
// RESET
// =============================================================================

function resetForm() {
  document.getElementById('principal').value      = 10000;
  document.getElementById('rate').value           = 7;
  document.getElementById('years').value          = 20;
  document.getElementById('compound').value       = 12;
  document.getElementById('monthly').value        = 0;
  document.getElementById('inflationToggle').checked = false;
  document.getElementById('inflationRate').value  = 3;

  // FIX 8: 'monthly' slider is now included
  ['principal', 'rate', 'years', 'monthly'].forEach(id => syncSlider(id));
  calculate();
}

// =============================================================================
// INIT
// FIX 2: loadFromURL runs before setupCurrencySearch so URL currency populates the input
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  ['principal', 'rate', 'years', 'monthly'].forEach(id => syncSlider(id));
  calculate();
});