// ═══════════════════════════════════════════════════════
//     LUMP SUM VS SIP COMPARISON CALCULATOR
// ═══════════════════════════════════════════════════════
(function () {
  'use strict';

  /* ── State ── */
  let sym         = '$';
  let freqN       = 12;
  let freqLabel   = 'month';
  let freqPerYear = 12;
  let chartInst   = null;
  let activeChart = 'line';
  let lastData    = null;

  /* ── Helpers ── */
  const $  = id => document.getElementById(id);
  const v  = id => parseFloat($(id).value) || 0;
  const vi = id => parseInt($(id).value)   || 0;

  function fmtFull(n) {
    const abs = Math.abs(n);
    if (abs >= 1e9) return sym + (n / 1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return sym + (n / 1e6).toFixed(2) + 'M';
    return sym + Math.round(n).toLocaleString('en-US');
  }

  function fmtShort(n) {
    const abs = Math.abs(n);
    if (abs >= 1e9) return sym + (n / 1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return sym + (n / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return sym + (n / 1e3).toFixed(1) + 'k';
    return sym + Math.round(n);
  }

  function animateValue(el, from, to, dur) {
    const start = performance.now();
    (function upd(now) {
      const t    = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = fmtFull(from + (to - from) * ease);
      if (t < 1) requestAnimationFrame(upd);
    })(performance.now());
  }

  /* ══════════════════════════════════════════
     CURRENCY — searchable dropdown
  ══════════════════════════════════════════ */
  const CURRENCIES = [
    { code:'USD', symbol:'$',   name:'US Dollar' },
    { code:'EUR', symbol:'€',   name:'Euro' },
    { code:'GBP', symbol:'£',   name:'British Pound' },
    { code:'PKR', symbol:'₨',  name:'Pakistani Rupee' },
    { code:'INR', symbol:'₹',   name:'Indian Rupee' },
    { code:'CAD', symbol:'CA$', name:'Canadian Dollar' },
    { code:'AUD', symbol:'A$',  name:'Australian Dollar' },
    { code:'JPY', symbol:'¥',   name:'Japanese Yen' },
    { code:'CNY', symbol:'¥',   name:'Chinese Yuan' },
    { code:'CHF', symbol:'Fr',  name:'Swiss Franc' },
    { code:'SGD', symbol:'S$',  name:'Singapore Dollar' },
    { code:'AED', symbol:'د.إ', name:'UAE Dirham' },
    { code:'SAR', symbol:'﷼',   name:'Saudi Riyal' },
    { code:'MYR', symbol:'RM',  name:'Malaysian Ringgit' },
    { code:'BDT', symbol:'৳',   name:'Bangladeshi Taka' },
    { code:'NZD', symbol:'NZ$', name:'New Zealand Dollar' },
    { code:'ZAR', symbol:'R',   name:'South African Rand' },
    { code:'BRL', symbol:'R$',  name:'Brazilian Real' },
    { code:'MXN', symbol:'$',   name:'Mexican Peso' },
    { code:'SEK', symbol:'kr',  name:'Swedish Krona' },
  ];

  function initCurrencySearch() {
    const input   = $('currencySearch');
    const results = $('currencyResults');
    if (!input || !results) return;

    input.value = 'US Dollar (USD)';

    input.addEventListener('input', function () {
      const q = this.value.toLowerCase().trim();
      results.innerHTML = '';
      if (!q) { results.style.display = 'none'; return; }
      const matches = CURRENCIES.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.symbol.includes(q)
      );
      if (!matches.length) { results.style.display = 'none'; return; }
      matches.forEach(c => {
        const div = document.createElement('div');
        div.className   = 'currency-result-item';
        div.textContent = c.symbol + ' ' + c.name + ' (' + c.code + ')';
        div.addEventListener('click', () => {
          sym          = c.symbol;
          input.value  = c.name + ' (' + c.code + ')';
          results.style.display = 'none';
          updateCurrencySymbols();
          calculate();
        });
        results.appendChild(div);
      });
      results.style.display = 'block';
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.currency-search-wrapper'))
        results.style.display = 'none';
    });
  }

  function updateCurrencySymbols() {
    ['currencySymbol'].forEach(id => {
      const el = $(id); if (el) el.textContent = sym;
    });
  }

  /* ══════════════════════════════════════════
     FREQUENCY
  ══════════════════════════════════════════ */
  window.setFreq = function (btn) {
    document.querySelectorAll('.freq-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    freqN       = parseInt(btn.dataset.n);
    freqLabel   = btn.dataset.freq === 'weekly'    ? 'week'
                : btn.dataset.freq === 'quarterly' ? 'quarter'
                : 'month';
    freqPerYear = freqN;
    calculate();
  };

  /* ══════════════════════════════════════════
     SLIDERS
  ══════════════════════════════════════════ */
  window.syncSlider = function (id) {
    const slider = $(id + 'Slider');
    if (!slider) return;
    slider.value = $(id).value;
    updateSliderLabel(id, $(id).value);
  };

  window.syncInput = function (id, val) {
    const el = $(id); if (el) el.value = val;
    updateSliderLabel(id, val);
  };

  function updateSliderLabel(id, val) {
    const el = $(id + 'SliderVal');
    if (!el) return;
    const n = parseFloat(val);
    if      (id === 'totalAmount') el.textContent = fmtShort(n);
    else if (id === 'returnRate')  el.textContent = n + '%';
    else if (id === 'duration')    el.textContent = n + ' yrs';
  }

  /* ══════════════════════════════════════════
     TOGGLES
  ══════════════════════════════════════════ */
  window.toggleStepUp = function () {
    const on = $('stepUpToggle').checked;
    $('stepUpGroup').style.display = on ? 'block' : 'none';
    calculate();
  };

  window.toggleInflation = function () {
    const on = $('inflationToggle').checked;
    $('inflationGroup').style.display = on ? 'block' : 'none';
    ['lumpRealRow', 'sipRealRow'].forEach(id => {
      $(id).style.display = on ? 'flex' : 'none';
    });
    calculate();
  };

  /* ══════════════════════════════════════════
     CORE CALCULATION
  ══════════════════════════════════════════ */
  window.calculate = function () {
    const total      = v('totalAmount');
    const rate       = v('returnRate');
    const years      = Math.min(vi('duration'), 40);
    const startYear  = vi('startYear') || new Date().getFullYear();
    const useStepUp  = $('stepUpToggle').checked;
    const stepUpPct  = useStepUp ? v('stepUpRate') / 100 : 0;
    const useInfl    = $('inflationToggle').checked;
    const inflRate   = useInfl ? v('inflationRate') / 100 : 0;

    if (total <= 0 || rate <= 0 || years <= 0) return;

    /* ── SIP amount = total ÷ (years × freqPerYear) ── */
    const totalPeriods = years * freqPerYear;
    const baseSIP      = total / totalPeriods;

    /* Update SIP preview hint */
    const sipHint = $('sipAmountPreview');
    if (sipHint) {
      sipHint.textContent = 'SIP amount: ' + fmtFull(baseSIP) + '/' + freqLabel +
        ' (' + fmtFull(total) + ' ÷ ' + totalPeriods + ' periods)';
    }

    const annualR = rate / 100;
    const r       = annualR / freqPerYear; // periodic rate

    /* ── Year-by-year arrays ── */
    const yLabels      = [];
    const yLump        = [];
    const yLumpReal    = [];
    const ySip         = [];
    const ySipReal     = [];
    const ySipInvested = [];
    const yLumpGains   = [];
    const ySipGains    = [];

    /* Lump sum balance starts at full amount */
    let lumpBal      = total;
    let sipBal       = 0;
    let sipInvested  = 0;
    let currentSIP   = baseSIP;

    for (let yr = 1; yr <= years; yr++) {
      /* Lump sum — compound for full year */
      lumpBal = lumpBal * Math.pow(1 + annualR, 1);

      /* SIP step-up at start of each year after first */
      if (useStepUp && yr > 1) currentSIP = currentSIP * (1 + stepUpPct);

      /* SIP — compound each period */
      for (let p = 0; p < freqPerYear; p++) {
        sipBal      = (sipBal + currentSIP) * (1 + r);
        sipInvested += currentSIP;
      }

      const lumpReal = useInfl ? lumpBal / Math.pow(1 + inflRate, yr) : lumpBal;
      const sipReal  = useInfl ? sipBal  / Math.pow(1 + inflRate, yr) : sipBal;

      yLabels.push(startYear + yr);
      yLump.push(parseFloat(lumpBal.toFixed(2)));
      yLumpReal.push(parseFloat(lumpReal.toFixed(2)));
      ySip.push(parseFloat(sipBal.toFixed(2)));
      ySipReal.push(parseFloat(sipReal.toFixed(2)));
      ySipInvested.push(parseFloat(sipInvested.toFixed(2)));
      yLumpGains.push(parseFloat((lumpBal - total).toFixed(2)));
      ySipGains.push(parseFloat((sipBal - sipInvested).toFixed(2)));
    }

    const finalLump     = yLump[yLump.length - 1];
    const finalSip      = ySip[ySip.length - 1];
    const finalSipInv   = ySipInvested[ySipInvested.length - 1];
    const finalLumpReal = yLumpReal[yLumpReal.length - 1];
    const finalSipReal  = ySipReal[ySipReal.length - 1];
    const lumpGains     = finalLump - total;
    const sipGains      = finalSip  - finalSipInv;
    const lumpRetPct    = ((lumpGains / total) * 100).toFixed(1);
    const sipRetPct     = ((sipGains  / finalSipInv) * 100).toFixed(1);

    /* ── Winner ── */
    const lumpWins  = finalLump >= finalSip;
    const diff      = Math.abs(finalLump - finalSip);
    const winner    = lumpWins ? 'Lump Sum' : 'SIP';

    lastData = {
      yLabels, yLump, ySip, ySipInvested,
      yLumpGains, ySipGains, yLumpReal, ySipReal,
      finalLump, finalSip, finalSipInv, total,
      lumpGains, sipGains, lumpRetPct, sipRetPct,
      finalLumpReal, finalSipReal,
      lumpWins, diff, winner, years, rate, baseSIP
    };

    /* ── Update UI ── */
    updateCards();
    updateWinner();
    renderChart(activeChart);
    renderTable();
  };

  /* ── Update comparison cards ── */
  function updateCards() {
    const {
      finalLump, finalSip, finalSipInv, total,
      lumpGains, sipGains, lumpRetPct, sipRetPct,
      finalLumpReal, finalSipReal, lumpWins
    } = lastData;

    const useInfl = $('inflationToggle').checked;

    /* Lump Sum card */
    const prevLump = parseFloat($('lumpFinal').textContent.replace(/[^0-9.]/g, '')) || 0;
    animateValue($('lumpFinal'), prevLump, finalLump, 600);
    $('lumpInvested').textContent = fmtFull(total);
    $('lumpGains').textContent    = fmtFull(lumpGains);
    $('lumpReturn').textContent   = lumpRetPct + '%';
    if (useInfl) $('lumpReal').textContent = fmtFull(finalLumpReal);

    /* SIP card */
    const prevSip = parseFloat($('sipFinal').textContent.replace(/[^0-9.]/g, '')) || 0;
    animateValue($('sipFinal'), prevSip, finalSip, 600);
    $('sipInvested').textContent = fmtFull(lastData.finalSipInv);
    $('sipGains').textContent    = fmtFull(sipGains);
    $('sipReturn').textContent   = sipRetPct + '%';
    if (useInfl) $('sipReal').textContent = fmtFull(finalSipReal);

    /* Winner highlight */
    const lumpCard = $('lumpCard');
    const sipCard  = $('sipCard');
    lumpCard.classList.toggle('compare-card--winner', lumpWins);
    sipCard.classList.toggle('compare-card--winner', !lumpWins);
    lumpCard.classList.toggle('compare-card--loser',  !lumpWins);
    sipCard.classList.toggle('compare-card--loser',   lumpWins);

    /* Badges */
    $('lumpBadge').textContent  = lumpWins  ? '🏆 Winner' : '';
    $('lumpBadge').className    = 'compare-badge' + (lumpWins  ? ' compare-badge--winner' : '');
    $('sipBadge').textContent   = !lumpWins ? '🏆 Winner' : '';
    $('sipBadge').className     = 'compare-badge' + (!lumpWins ? ' compare-badge--winner' : '');

    /* Difference card */
    $('diffValue').textContent = fmtFull(lastData.diff);
    $('diffSub').textContent   = lastData.winner + ' gives ' + fmtFull(lastData.diff) + ' more';
    $('diffCard').style.display = 'flex';
  }

  /* ── Winner banner ── */
  function updateWinner() {
    const { winner, lumpWins, diff } = lastData;
    const banner = $('winnerBanner');
    $('winnerText').innerHTML =
      '<strong>' + winner + '</strong> wins by <strong>' + fmtFull(diff) + '</strong> ' +
      (lumpWins
        ? '— investing the full amount upfront compounds longer.'
        : '— regular installments average out market timing risk.');
    banner.style.display = 'flex';
    banner.className = 'winner-banner' + (lumpWins ? ' winner-banner--lump' : ' winner-banner--sip');
  }

  /* ── Insight ── */
  function updateInsight() {
    const { winner, lumpWins, diff, finalLump, finalSip, years, rate, baseSIP } = lastData;
    const box = $('insightBox');
    box.innerHTML =
      'Over <strong>' + years + ' years</strong> at <strong>' + rate + '%</strong>, ' +
      (lumpWins
        ? 'investing <strong>' + fmtFull(lastData.total) + '</strong> upfront beats a ' +
          fmtFull(baseSIP) + '/' + freqLabel + ' SIP by <strong>' + fmtFull(diff) + '</strong>. ' +
          'Lump sum wins when markets trend upward — money compounds from day one.'
        : 'a ' + fmtFull(baseSIP) + '/' + freqLabel + ' SIP beats investing <strong>' +
          fmtFull(lastData.total) + '</strong> upfront by <strong>' + fmtFull(diff) + '</strong>. ' +
          'SIP wins through rupee cost averaging — buying more units when prices dip.');
    box.style.display = 'block';
  }

  /* ══════════════════════════════════════════
     CHARTS
  ══════════════════════════════════════════ */
  const TEAL     = '#0d9488';
  const TEAL_BG  = 'rgba(13,148,136,0.08)';
  const AMBER    = '#f59e0b';
  const AMBER_BG = 'rgba(245,158,11,0.08)';
  const SLATE    = '#94a3b8';

  function chartOpts() {
    return {
      responsive: true, maintainAspectRatio: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Inter', size: 12 }, color: '#475569', boxWidth: 12, padding: 16 }
        },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + ctx.dataset.label + ': ' + fmtFull(ctx.parsed.y ?? ctx.parsed)
          }
        }
      },
      scales: {
        x: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' } },
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8', callback: v => fmtShort(v) } }
      }
    };
  }

  function renderChart(type) {
    if (!lastData) return;
    const { yLabels, yLump, ySip, yLumpGains, ySipGains, finalLump, finalSip, total, lastData: ld } = lastData;
    const ctx = $('toolChart').getContext('2d');
    if (chartInst) chartInst.destroy();

    if (type === 'line') {
      chartInst = new Chart(ctx, {
        type: 'line',
        data: {
          labels: yLabels,
          datasets: [
            { label: 'Lump Sum', data: yLump, borderColor: TEAL,  backgroundColor: TEAL_BG,  borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: TEAL,  fill: true, tension: 0.35 },
            { label: 'SIP',      data: ySip,  borderColor: AMBER, backgroundColor: AMBER_BG, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: AMBER, fill: true, tension: 0.35 }
          ]
        },
        options: chartOpts()
      });

    } else if (type === 'bar') {
      chartInst = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: yLabels,
          datasets: [
            { label: 'Lump Sum Gains', data: yLumpGains, backgroundColor: TEAL_BG,  borderColor: TEAL,  borderWidth: 1.5, borderRadius: 4 },
            { label: 'SIP Gains',      data: ySipGains,  backgroundColor: AMBER_BG, borderColor: AMBER, borderWidth: 1.5, borderRadius: 4 }
          ]
        },
        options: chartOpts()
      });

    } else if (type === 'donut') {
      const sipInvested = lastData.finalSipInv;
      const lumpGains   = lastData.lumpGains;
      const sipGains    = lastData.sipGains;
      chartInst = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Lump Sum — Principal', 'Lump Sum — Gains', 'SIP — Invested', 'SIP — Gains'],
          datasets: [{
            data: [
              Math.max(0, lastData.total),
              Math.max(0, lumpGains),
              Math.max(0, sipInvested),
              Math.max(0, sipGains)
            ],
            backgroundColor: [TEAL, '#14b8a6', AMBER, '#fbbf24'],
            borderColor: '#fff', borderWidth: 3, hoverOffset: 8
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 11 }, color: '#475569', boxWidth: 12, padding: 12 } },
            tooltip: { callbacks: { label: ctx => ' ' + ctx.label + ': ' + fmtFull(ctx.parsed) } }
          }
        }
      });
    }

    updateInsight();
  }

  window.switchChart = function (type, btn) {
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    activeChart = type;
    renderChart(type);
  };

  /* ══════════════════════════════════════════
     TABLE
  ══════════════════════════════════════════ */
  function renderTable() {
    if (!lastData) return;
    const { yLabels, yLump, ySip, ySipInvested, yLumpGains, ySipGains } = lastData;
    const useInfl = $('inflationToggle').checked;

    $('tableHead').innerHTML = `<tr>
      <th>Year</th>
      <th>Lump Sum Value</th>
      <th>Lump Sum Gains</th>
      <th>SIP Corpus</th>
      <th>SIP Invested</th>
      <th>SIP Gains</th>
      <th>Winner</th>
    </tr>`;

    let rows = '';
    yLabels.forEach((yr, i) => {
      const lumpWinsRow = yLump[i] >= ySip[i];
      rows += `<tr>
        <td>${yr}</td>
        <td class="${lumpWinsRow ? 'highlight' : ''}">${fmtFull(yLump[i])}</td>
        <td>${fmtFull(yLumpGains[i])}</td>
        <td class="${!lumpWinsRow ? 'highlight' : ''}">${fmtFull(ySip[i])}</td>
        <td>${fmtFull(ySipInvested[i])}</td>
        <td>${fmtFull(ySipGains[i])}</td>
        <td>${lumpWinsRow ? '💰 Lump' : '📅 SIP'}</td>
      </tr>`;
    });
    $('tableBody').innerHTML = rows;
  }

  /* ══════════════════════════════════════════
     CSV DOWNLOAD
  ══════════════════════════════════════════ */
  window.downloadCSV = function () {
    if (!lastData) return;
    const { yLabels, yLump, ySip, ySipInvested, yLumpGains, ySipGains } = lastData;
    const rows = [['Year', 'Lump Sum Value', 'Lump Sum Gains', 'SIP Corpus', 'SIP Invested', 'SIP Gains', 'Winner']];
    yLabels.forEach((yr, i) => {
      rows.push([
        yr,
        yLump[i].toFixed(2), yLumpGains[i].toFixed(2),
        ySip[i].toFixed(2), ySipInvested[i].toFixed(2), ySipGains[i].toFixed(2),
        yLump[i] >= ySip[i] ? 'Lump Sum' : 'SIP'
      ]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const a   = document.createElement('a');
    a.href     = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'lump-sum-vs-sip-comparison.csv';
    a.click();
  };

  /* ══════════════════════════════════════════
     COPY RESULT
  ══════════════════════════════════════════ */
  window.copyResult = function () {
    if (!lastData) return;
    const { finalLump, finalSip, lumpGains, sipGains, winner, diff, years } = lastData;
    const text = [
      'Lump Sum vs SIP Comparison — Wanjaaro',
      '──────────────────────────────────────',
      'Lump Sum Final Value : ' + fmtFull(finalLump),
      'Lump Sum Gains       : ' + fmtFull(lumpGains),
      'SIP Final Corpus     : ' + fmtFull(finalSip),
      'SIP Gains            : ' + fmtFull(sipGains),
      '──────────────────────────────────────',
      '🏆 Winner: ' + winner + ' (by ' + fmtFull(diff) + ')',
      'Duration : ' + years + ' years',
      '──────────────────────────────────────',
      'Calculated at wanjaaro.com/lump-sum-vs-sip-calculator/'
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      const btn = $('copyBtn');
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = '📋 Copy Result'; }, 2000);
    });
  };

  /* ══════════════════════════════════════════
     SHARE URL
  ══════════════════════════════════════════ */
  window.shareURL = function () {
    const params = new URLSearchParams({
      t:  $('totalAmount').value,
      r:  $('returnRate').value,
      d:  $('duration').value,
      n:  freqN,
      su: $('stepUpToggle').checked ? v('stepUpRate') : 0,
      inf:$('inflationToggle').checked ? v('inflationRate') : 0,
      sy: $('startYear').value
    });
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(url).then(() => {
      const btn = $('shareBtn');
      btn.textContent = '✓ Link Copied!';
      setTimeout(() => { btn.textContent = 'Share'; }, 2000);
    });
  };

  /* ══════════════════════════════════════════
     RESTORE FROM URL
  ══════════════════════════════════════════ */
  function restoreFromURL() {
    const p = new URLSearchParams(window.location.search);
    if (p.get('t'))  $('totalAmount').value = p.get('t');
    if (p.get('r'))  $('returnRate').value  = p.get('r');
    if (p.get('d'))  $('duration').value    = p.get('d');
    if (p.get('sy')) $('startYear').value   = p.get('sy');
    if (p.get('n')) {
      const nVal = parseInt(p.get('n'));
      document.querySelectorAll('.freq-tab').forEach(btn => {
        if (parseInt(btn.dataset.n) === nVal) setFreq(btn);
      });
    }
    if (p.get('su') && parseFloat(p.get('su')) > 0) {
      $('stepUpToggle').checked = true;
      $('stepUpRate').value     = p.get('su');
      $('stepUpGroup').style.display = 'block';
    }
    if (p.get('inf') && parseFloat(p.get('inf')) > 0) {
      $('inflationToggle').checked = true;
      $('inflationRate').value     = p.get('inf');
      $('inflationGroup').style.display = 'block';
      ['lumpRealRow', 'sipRealRow'].forEach(id => $(id).style.display = 'flex');
    }
    ['totalAmount', 'returnRate', 'duration'].forEach(syncSlider);
  }

  /* ══════════════════════════════════════════
     RESET
  ══════════════════════════════════════════ */
  window.resetForm = function () {
    $('totalAmount').value = '120000';
    $('returnRate').value  = '12';
    $('duration').value    = '10';
    $('startYear').value   = new Date().getFullYear();
    $('stepUpToggle').checked   = false;
    $('inflationToggle').checked = false;
    $('stepUpGroup').style.display    = 'none';
    $('inflationGroup').style.display = 'none';
    ['lumpRealRow', 'sipRealRow'].forEach(id => $(id).style.display = 'none');
    freqN = 12; freqLabel = 'month'; freqPerYear = 12;
    document.querySelectorAll('.freq-tab').forEach(b => b.classList.remove('active'));
    document.querySelector('.freq-tab[data-freq="monthly"]').classList.add('active');
    ['totalAmount', 'returnRate', 'duration'].forEach(syncSlider);
    calculate();
  };

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  initCurrencySearch();
  restoreFromURL();
  calculate();

})();