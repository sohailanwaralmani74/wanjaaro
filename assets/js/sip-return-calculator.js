// ═══════════════════════════════════════════════════════
//     SIP Return CALCULATOR
// ═══════════════════════════════════════════════════════ 
(function(){
  'use strict';

  /* ── State ── */
  let sym         = '$';
  let freqN       = 12;         // periods per year
  let freqLabel   = 'month';
  let chartInst   = null;
  let activeChart = 'line';
  let lastData    = null;

  /* ── Helpers ── */
  const $  = id => document.getElementById(id);
  const v  = id => parseFloat($(id).value) || 0;
  const vi = id => parseInt($(id).value)   || 0;

  function fmtFull(n){
    if(Math.abs(n)>=1e9) return sym+(n/1e9).toFixed(2)+'B';
    if(Math.abs(n)>=1e6) return sym+(n/1e6).toFixed(2)+'M';
    return sym+Math.round(n).toLocaleString('en-US');
  }
  function fmtShort(n){
    if(Math.abs(n)>=1e9) return sym+(n/1e9).toFixed(2)+'B';
    if(Math.abs(n)>=1e6) return sym+(n/1e6).toFixed(2)+'M';
    if(Math.abs(n)>=1e3) return sym+(n/1e3).toFixed(1)+'k';
    return sym+n.toFixed(0);
  }

  function animateValue(el,from,to,dur){
    const start=performance.now();
    (function upd(now){
      const t=Math.min((now-start)/dur,1);
      const ease=1-Math.pow(1-t,3);
      el.textContent=fmtFull(from+(to-from)*ease);
      if(t<1) requestAnimationFrame(upd);
    })(performance.now());
  }

  /* ── Currency ── */
  window.setCurrency=function(btn){
    document.querySelectorAll('.currency-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    sym=btn.dataset.symbol;
    ['currencySymbol','currencySymbol2'].forEach(id=>{ const el=$(id); if(el) el.textContent=sym; });
    calculate();
  };

  /* ── Frequency ── */
  window.setFreq=function(btn){
    document.querySelectorAll('.freq-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    freqN=parseInt(btn.dataset.n);
    freqLabel = btn.dataset.freq==='weekly' ? 'week' : btn.dataset.freq==='quarterly' ? 'quarter' : 'month';
    $('freqLabel').textContent='(per '+freqLabel+')';
    $('sipHint').textContent='Amount invested each '+freqLabel;
    calculate();
  };

  /* ── Sliders ── */
  window.syncSlider=function(id){
    const slider=$(id+'Slider'); if(!slider) return;
    slider.value=$(id).value;
    updateLabel(id,$(id).value);
  };
  window.syncInput=function(id,val){
    const el=$(id); if(el) el.value=val;
    updateLabel(id,val);
  };
  function updateLabel(id,val){
    const el=$(id+'SliderVal'); if(!el) return;
    const n=parseFloat(val);
    if(id==='sipAmount')   el.textContent=fmtShort(n);
    else if(id==='returnRate') el.textContent=n+'%';
    else if(id==='duration')   el.textContent=n+' yrs';
  }

  /* ── Step-Up Toggle ── */
  window.toggleStepUp=function(){
    const on=$('stepUpToggle').checked;
    $('stepUpGroup').style.display=on?'block':'none';
    calculate();
  };

  /* ── Inflation Toggle ── */
  window.toggleInflation=function(){
    const on=$('inflationToggle').checked;
    $('inflationGroup').style.display=on?'block':'none';
    $('realCorpusCard').style.display=on?'flex':'none';
    calculate();
  };

  /* ── Core Calculation ── */
  window.calculate=function(){
    const baseSIP    = v('sipAmount');
    const annualRate = v('returnRate');
    const years      = Math.min(vi('duration'),40);
    const startYear  = vi('startYear')||new Date().getFullYear();
    const useStepUp  = $('stepUpToggle').checked;
    const stepUpPct  = useStepUp ? v('stepUpRate')/100 : 0;
    const useInfl    = $('inflationToggle').checked;
    const inflRate   = useInfl ? v('inflationRate')/100 : 0;

    if(baseSIP<=0||annualRate<=0||years<=0) return;

    const r = annualRate/100/freqN; // periodic rate

    /* Build year-by-year */
    const yLabels=[], yCorpus=[], yInvested=[], yGained=[], yRealCorpus=[], yYearlyGain=[];

    let corpus=0, totalInvested=0, currentSIP=baseSIP;

    for(let yr=1;yr<=years;yr++){
      const prevCorpus=corpus;
      // Apply step-up at start of each year (after year 1)
      if(useStepUp && yr>1) currentSIP=currentSIP*(1+stepUpPct);

      // compound for each period this year
      for(let p=0;p<freqN;p++){
        corpus=(corpus+currentSIP)*(1+r);
        totalInvested+=currentSIP;
      }

      const realCorpus=useInfl ? corpus/Math.pow(1+inflRate,yr) : corpus;
      yLabels.push(startYear+yr);
      yCorpus.push(parseFloat(corpus.toFixed(2)));
      yInvested.push(parseFloat(totalInvested.toFixed(2)));
      yGained.push(parseFloat((corpus-totalInvested).toFixed(2)));
      yRealCorpus.push(parseFloat(realCorpus.toFixed(2)));
      yYearlyGain.push(parseFloat((corpus-prevCorpus-(currentSIP*freqN)).toFixed(2)));
    }

    const finalCorpus   = yCorpus[yCorpus.length-1];
    const finalInvested = yInvested[yInvested.length-1];
    const finalGained   = yGained[yGained.length-1];
    const finalReal     = yRealCorpus[yRealCorpus.length-1];
    const absoluteRet   = ((finalCorpus-finalInvested)/finalInvested*100).toFixed(1);
    // Approximate XIRR ≈ annualRate (since our formula uses it directly)
    const xirr          = annualRate.toFixed(2);

    lastData={yLabels,yCorpus,yInvested,yGained,yRealCorpus,yYearlyGain,
              finalCorpus,finalInvested,finalGained,finalReal,absoluteRet,xirr,years};

    /* ── Update cards ── */
    const prev=parseFloat($('rCorpus').textContent.replace(/[^0-9.]/g,''))||0;
    animateValue($('rCorpus'),prev,finalCorpus,600);
    $('rCorpusSub').textContent='After '+years+' years at '+annualRate+'% p.a.';
    $('rInvested').textContent=fmtFull(finalInvested);
    $('rGained').textContent=fmtFull(finalGained);
    $('rAbsolute').textContent=absoluteRet+'%';
    $('rXIRR').textContent=xirr+'%';
    if(useInfl){
      $('rRealCorpus').textContent=fmtFull(finalReal);
      $('inflationNote').textContent='At '+v('inflationRate')+'% inflation, real purchasing power is '+fmtFull(finalReal)+' in today\'s money.';
      $('inflationNote').classList.add('show');
    } else {
      $('inflationNote').classList.remove('show');
    }

    /* ── Step-Up preview ── */
    if(useStepUp){
      let sip=baseSIP, lines=['Year 1: '+fmtFull(sip)+'/'+freqLabel];
      for(let i=2;i<=Math.min(years,5);i++){
        sip=sip*(1+stepUpPct);
        lines.push('Year '+i+': '+fmtFull(sip)+'/'+freqLabel);
      }
      if(years>5) lines.push('...');
      $('stepUpPreview').innerHTML='<strong>Step-up schedule:</strong><br>'+lines.join(' → ');
      $('stepUpPreview').classList.add('show');
    } else {
      $('stepUpPreview').classList.remove('show');
    }

    /* ── Insight ── */
    const gainPct=((finalGained/finalCorpus)*100).toFixed(0);
    $('insightBox').innerHTML='Returns account for <strong>'+gainPct+'%</strong> of your corpus. '+
      'Investing <strong>'+fmtFull(baseSIP)+'/'+freqLabel+'</strong> grows to <strong>'+fmtFull(finalCorpus)+'</strong> — '+
      'a wealth gain of <strong>'+fmtFull(finalGained)+'</strong>.';
    $('insightBox').style.display='block';

    renderChart(activeChart);
    renderTable();
  };

  /* ── Charts ── */
  const TEAL='#0d9488', TEAL_BG='rgba(13,148,136,0.08)';
  const SLATE='#94a3b8', SLATE_BG='rgba(148,163,184,0.07)';
  const AMBER='#f59e0b';

  function chartOpts(){
    return {
      responsive:true, maintainAspectRatio:true, interaction:{mode:'index',intersect:false},
      plugins:{
        legend:{position:'bottom',labels:{font:{family:'Inter',size:12},color:'#475569',boxWidth:12,padding:16}},
        tooltip:{callbacks:{label:ctx=>' '+ctx.dataset.label+': '+fmtFull(ctx.parsed.y??ctx.parsed)}}
      },
      scales:{
        x:{grid:{color:'#f1f5f9'},ticks:{font:{family:'Inter',size:11},color:'#94a3b8'}},
        y:{grid:{color:'#f1f5f9'},ticks:{font:{family:'Inter',size:11},color:'#94a3b8',callback:v=>fmtShort(v)}}
      }
    };
  }

  function renderChart(type){
    if(!lastData) return;
    const {yLabels,yCorpus,yInvested,yGained,yYearlyGain,finalCorpus,finalInvested,finalGained}=lastData;
    const ctx=$('toolChart').getContext('2d');
    if(chartInst) chartInst.destroy();

    if(type==='line'){
      chartInst=new Chart(ctx,{
        type:'line',
        data:{labels:yLabels,datasets:[
          {label:'Corpus',data:yCorpus,borderColor:TEAL,backgroundColor:TEAL_BG,borderWidth:2.5,pointRadius:3,pointBackgroundColor:TEAL,fill:true,tension:0.35},
          {label:'Invested',data:yInvested,borderColor:SLATE,backgroundColor:SLATE_BG,borderWidth:1.5,pointRadius:2,borderDash:[5,4],fill:true,tension:0.35}
        ]},
        options:chartOpts()
      });
    } else if(type==='bar'){
      chartInst=new Chart(ctx,{
        type:'bar',
        data:{labels:yLabels,datasets:[
          {label:'Returns Earned This Year',data:yYearlyGain,backgroundColor:TEAL_BG,borderColor:TEAL,borderWidth:1.5,borderRadius:4}
        ]},
        options:chartOpts()
      });
    } else if(type==='donut'){
      chartInst=new Chart(ctx,{
        type:'doughnut',
        data:{
          labels:['Amount Invested','Wealth Gained'],
          datasets:[{
            data:[Math.max(0,finalInvested),Math.max(0,finalGained)],
            backgroundColor:[SLATE,TEAL],
            borderColor:'#fff',borderWidth:3,hoverOffset:8
          }]
        },
        options:{
          responsive:true,maintainAspectRatio:true,
          plugins:{
            legend:{position:'bottom',labels:{font:{family:'Inter',size:12},color:'#475569',boxWidth:14,padding:16}},
            tooltip:{callbacks:{label:ctx=>' '+ctx.label+': '+fmtFull(ctx.parsed)+' ('+((ctx.parsed/finalCorpus)*100).toFixed(1)+'%)'}}
          }
        }
      });
    }
  }

  window.switchChart=function(type,btn){
    document.querySelectorAll('.chart-tab').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    activeChart=type;
    renderChart(type);
  };

  /* ── Table ── */
  function renderTable(){
    if(!lastData) return;
    const {yLabels,yCorpus,yInvested,yGained,yRealCorpus}=lastData;
    const useInfl=$('inflationToggle').checked;
    const useStepUp=$('stepUpToggle').checked;

    $('tableHead').innerHTML=`<tr>
      <th>Year</th>
      <th>SIP Amount</th>
      <th>Total Invested</th>
      <th>Corpus</th>
      <th>Wealth Gained</th>
      <th>Return %</th>
      ${useInfl?'<th>Real Corpus</th>':''}
    </tr>`;

    let sip=v('sipAmount'), rows='';
    yLabels.forEach((yr,i)=>{
      if(useStepUp && i>0) sip=sip*(1+v('stepUpRate')/100);
      const ret=((yGained[i]/yInvested[i])*100).toFixed(1);
      rows+=`<tr>
        <td>${yr}</td>
        <td>${fmtFull(sip)}<span style="font-size:10px;color:#94a3b8">/${freqLabel}</span></td>
        <td>${fmtFull(yInvested[i])}</td>
        <td class="highlight">${fmtFull(yCorpus[i])}</td>
        <td>${fmtFull(yGained[i])}</td>
        <td>${ret}%</td>
        ${useInfl?'<td>'+fmtFull(yRealCorpus[i])+'</td>':''}
      </tr>`;
    });
    $('tableBody').innerHTML=rows;
  }

  /* ── CSV ── */
  window.downloadCSV=function(){
    if(!lastData) return;
    const {yLabels,yCorpus,yInvested,yGained}=lastData;
    const rows=[['Year','Total Invested','Corpus','Wealth Gained','Return %']];
    yLabels.forEach((yr,i)=>{
      rows.push([yr,yInvested[i].toFixed(2),yCorpus[i].toFixed(2),yGained[i].toFixed(2),((yGained[i]/yInvested[i])*100).toFixed(1)]);
    });
    const csv=rows.map(r=>r.join(',')).join('\n');
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download='sip-return-breakdown.csv'; a.click();
  };

  /* ── Copy ── */
  window.copyResult=function(){
    if(!lastData) return;
    const {finalCorpus,finalInvested,finalGained,absoluteRet,xirr,years}=lastData;
    const text=[
      'SIP Return Calculation — Wanjaaro',
      '─────────────────────────────────',
      'Total Corpus   : '+fmtFull(finalCorpus),
      'Total Invested : '+fmtFull(finalInvested),
      'Wealth Gained  : '+fmtFull(finalGained),
      'Absolute Return: '+absoluteRet+'%',
      'Est. XIRR      : '+xirr+'%',
      'Duration       : '+years+' years',
      '─────────────────────────────────',
      'Calculated at wanjaaro.com/sip-return-calculator/'
    ].join('\n');
    navigator.clipboard.writeText(text).then(()=>{
      const btn=$('copyBtn');
      btn.textContent='✓ Copied!';
      setTimeout(()=>{ btn.textContent='📋 Copy Result'; },2000);
    });
  };

  /* ── Share URL ── */
  window.shareURL=function(){
    const params=new URLSearchParams({
      s:$('sipAmount').value, r:$('returnRate').value,
      d:$('duration').value,  n:freqN,
      su:$('stepUpToggle').checked?v('stepUpRate'):0,
      inf:$('inflationToggle').checked?v('inflationRate'):0,
      sy:$('startYear').value
    });
    const url=window.location.origin+window.location.pathname+'?'+params.toString();
    navigator.clipboard.writeText(url).then(()=>{
      const btn=$('shareBtn');
      btn.textContent='✓ Link Copied!';
      setTimeout(()=>{ btn.textContent='Share'; },2000);
    });
  };

  /* ── Restore from URL ── */
  function restoreFromURL(){
    const p=new URLSearchParams(window.location.search);
    if(p.get('s'))  $('sipAmount').value  =p.get('s');
    if(p.get('r'))  $('returnRate').value =p.get('r');
    if(p.get('d'))  $('duration').value   =p.get('d');
    if(p.get('sy')) $('startYear').value  =p.get('sy');
    if(p.get('n')){
      const nVal=parseInt(p.get('n'));
      document.querySelectorAll('.freq-tab').forEach(btn=>{
        if(parseInt(btn.dataset.n)===nVal){ setFreq(btn); btn.classList.add('active'); }
        else btn.classList.remove('active');
      });
    }
    if(p.get('su')&&parseFloat(p.get('su'))>0){
      $('stepUpToggle').checked=true; $('stepUpRate').value=p.get('su');
      $('stepUpGroup').style.display='block';
    }
    if(p.get('inf')&&parseFloat(p.get('inf'))>0){
      $('inflationToggle').checked=true; $('inflationRate').value=p.get('inf');
      $('inflationGroup').style.display='block';
      $('realCorpusCard').style.display='flex';
    }
    ['sipAmount','returnRate','duration'].forEach(syncSlider);
  }

  /* ── FAQ ── */
  window.toggleFaq=function(btn){
    const item=btn.closest('.faq-item');
    const isOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!isOpen) item.classList.add('open');
  };

  /* ── Reset ── */
  window.resetForm=function(){
    $('sipAmount').value='500'; $('returnRate').value='12';
    $('duration').value='10';   $('startYear').value=new Date().getFullYear();
    $('stepUpToggle').checked=false; $('stepUpGroup').style.display='none';
    $('inflationToggle').checked=false; $('inflationGroup').style.display='none';
    $('realCorpusCard').style.display='none';
    $('stepUpPreview').classList.remove('show');
    freqN=12; freqLabel='month';
    document.querySelectorAll('.freq-tab').forEach(b=>b.classList.remove('active'));
    document.querySelector('.freq-tab[data-freq="monthly"]').classList.add('active');
    ['sipAmount','returnRate','duration'].forEach(syncSlider);
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
    sym = currency.symbol;
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
  /* ── Init ── */
  restoreFromURL();
  calculate();

})();