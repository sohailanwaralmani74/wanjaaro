// ========================
// CURRENCY DROPDOWN + POPUP DEFINITIONS + FULL CALCULATOR
// ========================
(function () {
  'use strict';

  /* ══════════════════════════════════
     STATE
  ══════════════════════════════════ */
  let currencySymbol = '$';
  let chartInstance  = null;
  let activeChart    = 'line';
  let lastData       = null;

  /* ══════════════════════════════════
     HELPERS
  ══════════════════════════════════ */
  const $  = id => document.getElementById(id);
  const v  = id => parseFloat($(id).value) || 0;
  const vi = id => parseInt($(id).value)   || 0;

  function fmt(n) {
    if (Math.abs(n) >= 1e9)  return currencySymbol + (n/1e9).toFixed(2) + 'B';
    if (Math.abs(n) >= 1e6)  return currencySymbol + (n/1e6).toFixed(2) + 'M';
    if (Math.abs(n) >= 1e3)  return currencySymbol + (n/1e3).toFixed(1) + 'k';
    return currencySymbol + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function fmtFull(n) {
    return currencySymbol + Math.round(n).toLocaleString('en-US');
  }

  function animateValue(el, from, to, duration) {
    const start = performance.now();
    function update(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const current = from + (to - from) * ease;
      el.textContent = fmtFull(current);
      if (t < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ══════════════════════════════════
     CURRENCY (dropdown version)
  ══════════════════════════════════ */
  window.setCurrencyFromSelect = function(selectEl) {
    const [symbol, code] = selectEl.value.split('|');
    currencySymbol = symbol;
    ['currencySymbol','currencySymbol2','currencySymbol3'].forEach(id => {
      const el = $(id);
      if (el) el.textContent = currencySymbol;
    });
    calculate();
  };

  /* ══════════════════════════════════
     POPUP DEFINITIONS (click on ⓘ)
  ══════════════════════════════════ */
  const popup = document.getElementById('definitionPopup');
  const definitions = {
    apy: "APY (Annual Percentage Yield) – The real rate of return after compounding. For example, 8% compounded monthly gives an APY of ~8.30%.",
    moneyMultiplied: "Money Multiplied = Final balance ÷ Total contributed (principal + all additions). Shows how many times your total contributions grew.",
    startYear: "Only changes year labels in the table & chart. Does NOT affect interest calculation.",
    realBalance: "Real Balance = Nominal balance adjusted for inflation. Shows today's purchasing power after accounting for price increases."
  };

  function showPopup(event, term) {
    const text = definitions[term];
    if (!text) return;
    popup.textContent = text;
    popup.style.display = 'block';
    const rect = event.target.getBoundingClientRect();
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 5;
    // Prevent going off-screen right
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    if (left + 150 > viewportWidth) left = viewportWidth - 160;
    if (left < 10) left = 10;
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    // Auto-hide after 4 seconds or on click elsewhere
    clearTimeout(window.popupTimer);
    window.popupTimer = setTimeout(() => { popup.style.display = 'none'; }, 4000);
  }

  function hidePopup() {
    popup.style.display = 'none';
  }

  // Attach click listeners to all .term-info
  document.addEventListener('click', function(e) {
    const target = e.target.closest('.term-info');
    if (target) {
      e.stopPropagation();
      const term = target.getAttribute('data-term');
      if (term) showPopup(e, term);
    } else {
      hidePopup();
    }
  });

  /* ══════════════════════════════════
     SLIDER SYNC
  ══════════════════════════════════ */
  window.syncSlider = function(id) {
    const input  = $(id);
    const slider = $(id + 'Slider');
    if (!slider) return;
    slider.value = input.value;
    updateSliderLabel(id, input.value);
  };

  window.syncInput = function(id, val) {
    const input = $(id);
    if (input) input.value = val;
    updateSliderLabel(id, val);
  };

  function updateSliderLabel(id, val) {
    const el = $(id + 'SliderVal');
    if (!el) return;
    const n = parseFloat(val);
    if (id === 'principal')  el.textContent = fmt(n);
    else if (id === 'rate')  el.textContent = n + '%';
    else if (id === 'years') el.textContent = n + ' yrs';
  }

  /* ══════════════════════════════════
     INFLATION TOGGLE
  ══════════════════════════════════ */
  const inflToggle = $('inflationToggle');
  if (inflToggle) {
    inflToggle.addEventListener('change', function() {
      $('inflationRateGroup').style.display = this.checked ? 'block' : 'none';
      $('realReturnCard').style.display     = this.checked ? 'flex'  : 'none';
      calculate();
    });
  }

  /* ══════════════════════════════════
     CORE CALCULATION
  ══════════════════════════════════ */
  window.calculate = function() {
    const P          = v('principal');
    const rate       = v('rate');
    const t          = Math.min(vi('years'), 50);
    const n          = vi('compound') || 12;
    const mc         = v('monthly');
    const yc         = v('yearly');
    const startYear  = vi('startYear') || new Date().getFullYear();
    const useInflation = $('inflationToggle').checked;
    const inflRate   = useInflation ? v('inflationRate') / 100 : 0;

    if (P < 0 || rate <= 0 || t <= 0) return;

    const rPerPeriod = rate / 100 / n;

    const years      = [];
    const balances   = [];
    const contribs   = [];
    const interests  = [];
    const realBals   = [];
    const yearlyInt  = [];

    let balance      = P;
    let totalContrib = P;

    for (let yr = 1; yr <= t; yr++) {
      const openBal = balance;

      if (yc > 0 && yr > 1) {
        balance      += yc;
        totalContrib += yc;
      }

      for (let p = 1; p <= n; p++) {
        balance = balance * (1 + rPerPeriod);
        if (n >= 12) {
          balance      += mc;
          totalContrib += mc;
        }
      }

      if (n < 12 && mc > 0) {
        const monthlyLump = mc * 12;
        balance           += monthlyLump;
        totalContrib      += monthlyLump;
      }

      const realBalance = useInflation ? balance / Math.pow(1 + inflRate, yr) : balance;

      years.push(startYear + yr);
      balances.push(parseFloat(balance.toFixed(2)));
      contribs.push(parseFloat(totalContrib.toFixed(2)));
      interests.push(parseFloat((balance - totalContrib).toFixed(2)));
      realBals.push(parseFloat(realBalance.toFixed(2)));
      yearlyInt.push(parseFloat((balance - openBal - (yc > 0 && yr > 1 ? yc : 0)).toFixed(2)));
    }

    const finalBalance   = balances[balances.length - 1];
    const totalContribAmt = contribs[contribs.length - 1];
    const totalInterest  = interests[interests.length - 1];
    const realFinal      = realBals[realBals.length - 1];

    const apy = (Math.pow(1 + (rate / 100 / n), n) - 1) * 100;
    const multiple = (finalBalance / P).toFixed(2);

    lastData = { years, balances, contribs, interests, realBals, yearlyInt,
                 finalBalance, totalContribAmt, totalInterest, realFinal, apy, multiple, t };

    const prevFinal = parseFloat($('rFinalBalance').textContent.replace(/[^0-9.]/g,'')) || 0;
    animateValue($('rFinalBalance'), prevFinal, finalBalance, 600);
    $('rFinalSub').textContent   = 'After ' + t + ' years at ' + rate + '% p.a.';
    $('rContributed').textContent = fmtFull(totalContribAmt);
    $('rInterest').textContent    = fmtFull(totalInterest);
    $('rAPY').textContent         = apy.toFixed(3) + '%';
    $('rMultiple').textContent    = multiple + '×';

    if (useInflation) {
      $('rRealBalance').textContent = fmtFull(realFinal);
      $('inflationNote').textContent =
        'Inflation at ' + v('inflationRate') + '% reduces your real purchasing power to ' +
        fmtFull(realFinal) + ' in today\'s money.';
      $('inflationNote').classList.add('show');
    } else {
      $('inflationNote').classList.remove('show');
    }

    const interestPct = ((totalInterest / finalBalance) * 100).toFixed(0);
    $('insightText').innerHTML =
      'Compound interest accounts for <strong>' + interestPct + '%</strong> of your final balance. ' +
      'Your <strong>' + fmtFull(P) + '</strong> grows to <strong>' + fmtFull(finalBalance) + '</strong> — ' +
      'a gain of <strong>' + fmtFull(totalInterest) + '</strong> in pure interest.';
    $('insightBox').style.display = 'block';

    renderChart(activeChart);
    renderTable(years, balances, contribs, interests, realBals);
  };

  /* ══════════════════════════════════
     CHARTS (unchanged)
  ══════════════════════════════════ */
  const TEAL    = '#0d9488';
  const TEAL_BG = 'rgba(13,148,136,0.08)';
  const SLATE   = '#94a3b8';
  const SLATE_BG= 'rgba(148,163,184,0.07)';
  const AMBER   = '#f59e0b';

  function chartDefaults() {
    return {
      plugins: {
        legend: { position:'bottom', labels:{ font:{family:'Inter',size:12}, color:'#475569', boxWidth:12, padding:16 } },
        tooltip: { callbacks:{ label: ctx => ' ' + ctx.dataset.label + ': ' + fmtFull(ctx.parsed.y ?? ctx.parsed) } }
      },
      scales: {
        x: { grid:{color:'#f1f5f9'}, ticks:{font:{family:'Inter',size:11},color:'#94a3b8'} },
        y: { grid:{color:'#f1f5f9'}, ticks:{font:{family:'Inter',size:11},color:'#94a3b8'},
             callback: v => currencySymbol + (v>=1e6?(v/1e6).toFixed(1)+'M':v>=1e3?(v/1e3).toFixed(0)+'k':v) }
      },
      responsive: true,
      maintainAspectRatio: true,
      interaction:{ mode:'index', intersect:false }
    };
  }

  function renderChart(type) {
    if (!lastData) return;
    const { years, balances, contribs, yearlyInt, totalInterest, finalBalance } = lastData;
    const ctx = $('toolChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    if (type === 'line') {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: years,
          datasets: [
            { label:'Balance', data:balances, borderColor:TEAL, backgroundColor:TEAL_BG, borderWidth:2.5, pointRadius:3, pointBackgroundColor:TEAL, fill:true, tension:0.35 },
            { label:'Contributions', data:lastData.contribs, borderColor:SLATE, backgroundColor:SLATE_BG, borderWidth:1.5, pointRadius:2, borderDash:[5,4], fill:true, tension:0.35 }
          ]
        },
        options: chartDefaults()
      });
    } else if (type === 'bar') {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels: years, datasets: [{ label:'Interest Earned This Year', data:yearlyInt, backgroundColor:TEAL_BG, borderColor:TEAL, borderWidth:1.5, borderRadius:4 }] },
        options: { ...chartDefaults(), plugins:{ tooltip:{ callbacks:{ label: ctx => ' Interest: ' + fmtFull(ctx.parsed.y) } } } }
      });
    } else if (type === 'donut') {
      const contrib = lastData.totalContribAmt - (parseFloat($('principal').value)||0);
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Principal', 'Contributions', 'Interest'],
          datasets: [{ data: [parseFloat($('principal').value)||0, Math.max(0, contrib), Math.max(0, totalInterest)], backgroundColor: [TEAL, '#14b8a6', AMBER], borderColor: '#fff', borderWidth: 3, hoverOffset: 8 }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position:'bottom', labels:{ font:{family:'Inter',size:12}, color:'#475569' } },
            tooltip: { callbacks:{ label: ctx => ' ' + ctx.label + ': ' + fmtFull(ctx.parsed) + ' (' + ((ctx.parsed/finalBalance)*100).toFixed(1) + '%)' } }
          }
        }
      });
    }
  }

  window.switchChart = function(type, btn) {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    activeChart = type;
    renderChart(type);
  };

  function renderTable(years, balances, contribs, interests, realBals) {
    const useInflation = $('inflationToggle').checked;
    $('tableTitle').textContent = 'Year-by-Year Breakdown';
    $('tableHead').innerHTML = `<tr><th>Year</th><th>Balance</th><th>Contributed</th><th>Interest Earned</th><th>Growth</th>${useInflation ? '<th>Real Balance</th>' : ''}</tr>`;
    let rows = '';
    years.forEach((yr, i) => {
      const growth = i === 0 ? '—' : (((balances[i] - balances[i-1]) / balances[i-1]) * 100).toFixed(2) + '%';
      rows += `<tr><td>${yr}</td><td class="highlight">${fmtFull(balances[i])}</td><td>${fmtFull(contribs[i])}</td><td>${fmtFull(interests[i])}</td><td>${growth}</td>${useInflation ? '<td>' + fmtFull(realBals[i]) + '</td>' : ''}</tr>`;
    });
    $('tableBody').innerHTML = rows;
  }

  window.downloadCSV = function() {
    if (!lastData) return;
    const { years, balances, contribs, interests } = lastData;
    const rows = [['Year','Balance','Total Contributed','Interest Earned','Growth %']];
    years.forEach((yr, i) => {
      const growth = i === 0 ? '—' : (((balances[i]-balances[i-1])/balances[i-1])*100).toFixed(2);
      rows.push([yr, balances[i].toFixed(2), contribs[i].toFixed(2), interests[i].toFixed(2), growth]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'compound-interest-breakdown.csv';
    a.click(); URL.revokeObjectURL(url);
  };

  window.copyResult = function() {
    if (!lastData) return;
    const { finalBalance, totalContribAmt, totalInterest, apy, t } = lastData;
    const text = `Compound Interest Calculation — Wanjaaro\n─────────────────────────────────────────\nFinal Balance    : ${fmtFull(finalBalance)}\nTotal Contributed: ${fmtFull(totalContribAmt)}\nInterest Earned  : ${fmtFull(totalInterest)}\nEffective APY    : ${apy.toFixed(3)}%\nDuration         : ${t} years\n─────────────────────────────────────────\nCalculated at wanjaaro.com/compound-interest-calculator/`;
    navigator.clipboard.writeText(text).then(() => {
      const btn = $('copyBtn');
      btn.textContent = '✓ Copied!';
      setTimeout(() => btn.textContent = '📋 Copy Result', 2000);
    });
  };

  window.shareURL = function() {
    const params = new URLSearchParams({ p: $('principal').value, r: $('rate').value, y: $('years').value, n: $('compound').value, mc: $('monthly').value, yc: $('yearly').value, sy: $('startYear').value });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => {
      const btn = $('shareBtn');
      btn.textContent = '✓ Link Copied!';
      setTimeout(() => btn.textContent = 'Share', 2000);
    });
  };

  function restoreFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('p'))  { $('principal').value = params.get('p'); syncSlider('principal'); }
    if (params.get('r'))  { $('rate').value = params.get('r'); syncSlider('rate'); }
    if (params.get('y'))  { $('years').value = params.get('y'); syncSlider('years'); }
    if (params.get('n'))  { $('compound').value = params.get('n'); }
    if (params.get('mc')) { $('monthly').value = params.get('mc'); }
    if (params.get('yc')) { $('yearly').value = params.get('yc'); }
    if (params.get('sy')) { $('startYear').value = params.get('sy'); }
  }

  window.toggleFaq = function(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  };

  window.resetForm = function() {
    $('principal').value = '10000'; $('rate').value = '8'; $('years').value = '10';
    $('compound').value = '12'; $('monthly').value = '200'; $('yearly').value = '0';
    $('startYear').value = new Date().getFullYear();
    $('inflationToggle').checked = false;
    $('inflationRateGroup').style.display = 'none';
    $('realReturnCard').style.display = 'none';
    ['principal','rate','years'].forEach(syncSlider);
    calculate();
  };
  // ----------------------------------------------------------
  // SEARCHABLE CURRENCY DROPDOWN (200+ currencies)
  // ----------------------------------------------------------
  const currencyList = [
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

  const searchInput = document.getElementById("currencySearch");
  const resultsDiv = document.getElementById("currencyResults");

  function filterCurrencies(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return currencyList;
    return currencyList.filter(c => 
      c.code.toLowerCase().includes(term) || 
      c.name.toLowerCase().includes(term) || 
      c.symbol.toLowerCase().includes(term)
    );
  }

  function renderCurrencyResults(searchTerm) {
    const filtered = filterCurrencies(searchTerm);
    if (!resultsDiv) return;
    if (filtered.length === 0) {
      resultsDiv.innerHTML = '<div class="currency-option" style="justify-content:center;">No matching currency</div>';
      resultsDiv.classList.add("show");
      return;
    }
    resultsDiv.innerHTML = "";
    filtered.slice(0, 30).forEach(curr => {  // Limit to 30 for performance
      const div = document.createElement("div");
      div.className = "currency-option";
      div.innerHTML = `<span class="curr-code">${curr.code}</span> <span class="curr-name">${curr.symbol} ${curr.name}</span>`;
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        selectCurrency(curr);
      });
      resultsDiv.appendChild(div);
    });
    resultsDiv.classList.add("show");
  }

  function selectCurrency(currency) {
    // Update global symbol
    currencySymbol = currency.symbol;
    // Update all three currency display spans
    ["currencySymbol", "currencySymbol2", "currencySymbol3"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = currency.symbol;
    });
    // Update search input display
    if (searchInput) searchInput.value = `${currency.symbol} ${currency.code} - ${currency.name}`;
    // Hide results
    if (resultsDiv) resultsDiv.classList.remove("show");
    // Recalculate the whole tool
    if (typeof calculate === "function") calculate();
  }

  // Attach event listeners if elements exist
  if (searchInput && resultsDiv) {
    searchInput.addEventListener("focus", () => {
      renderCurrencyResults(searchInput.value);
    });
    searchInput.addEventListener("input", (e) => {
      renderCurrencyResults(e.target.value);
    });
    document.addEventListener("click", function(e) {
      if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
        resultsDiv.classList.remove("show");
      }
    });
    // Set default USD on page load
    const defaultCurrency = currencyList.find(c => c.code === "USD");
    if (defaultCurrency) selectCurrency(defaultCurrency);
  }
  restoreFromURL();
  calculate();
  
})();