// ==================== Credit Utilization Calculator JS ====================

let chartInstance = null;
let currentChartType = 'gauge';
let cardCount = 3;
let nextCardId = 4;

// Helper: format currency
function formatCurrency(num) {
  const val = parseFloat(num) || 0;
  const s = window.currentCurrency?.symbol || '$';
  return s + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatCompact(num) {
  const val = parseFloat(num) || 0;
  const s = window.currentCurrency?.symbol || '$';
  if (val >= 1e6) return s + (val/1e6).toFixed(1) + 'M';
  if (val >= 1e3) return s + Math.round(val/1e3) + 'k';
  return s + val.toFixed(0);
}

function syncSlider(id) {
  const input = document.getElementById(id);
  const slider = document.getElementById(id + 'Slider');
  const display = document.getElementById(id + 'SliderVal');
  if (!input || !slider) return;
  const val = parseFloat(input.value) || 0;
  slider.value = val;
  if (display) display.textContent = formatCompact(val);
}

function syncInput(id, val) {
  const input = document.getElementById(id);
  if (input) input.value = val;
  syncSlider(id);
}

// Currency search
function setupCurrencySearch() {
  const searchInput = document.getElementById('currencySearch');
  const resultsDiv = document.getElementById('currencyResults');
  if (!searchInput || !resultsDiv) return;
  const allCurrencies = window.allCurrencies || [
    { code: "USD", name: "US Dollar", symbol: "$" }, { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" }, { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨" }, { code: "CAD", name: "Canadian Dollar", symbol: "C$" }
  ];
  if (!window.currentCurrency) window.currentCurrency = allCurrencies.find(c => c.code === 'USD') || allCurrencies[0];
  searchInput.value = window.currentCurrency.code + ' — ' + window.currentCurrency.name;
  function renderCurrencyResults(list) {
    if (!list.length) { resultsDiv.innerHTML = '<div class="currency-option"><span class="curr-name">No currencies found</span></div>'; return; }
    resultsDiv.innerHTML = list.map(c => `<div class="currency-option" onclick="selectCurrency('${c.code}')">
      <span class="curr-code">${c.code}</span><span class="curr-name">${c.name}</span></div>`).join('');
  }
  searchInput.addEventListener('focus', () => { renderCurrencyResults(allCurrencies); resultsDiv.classList.add('show'); });
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allCurrencies.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    renderCurrencyResults(filtered);
    resultsDiv.classList.add('show');
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.currency-search-wrapper')) resultsDiv.classList.remove('show'); });
}

function selectCurrency(code) {
  const allCurrencies = window.allCurrencies || [];
  window.currentCurrency = allCurrencies.find(c => c.code === code) || allCurrencies[0];
  const searchInput = document.getElementById('currencySearch');
  if (searchInput) searchInput.value = window.currentCurrency.code + ' — ' + window.currentCurrency.name;
  document.querySelectorAll('[id^="currencySymbol"]').forEach(s => s.textContent = window.currentCurrency.symbol);
  const multiToggle = document.getElementById('multiCardToggle')?.checked;
  if (multiToggle) calculateMultiCard();
  else calculate();
}

// Tooltip definitions
const definitions = {
  creditUsed: "Total outstanding balance across all your credit cards. High balances increase your utilization ratio.",
  creditLimit: "Total credit limit across all your credit cards. Higher limits lower your utilization ratio."
};

let tooltipTimeout;

function showTooltip(event, term) {
  const popup = document.getElementById('definitionPopup');
  const text = definitions[term];
  if (!text || !popup) return;
  popup.textContent = text;
  popup.style.display = 'block';
  const rect = event.target.getBoundingClientRect();
  let left = rect.left + window.scrollX;
  let top = rect.bottom + window.scrollY + 5;
  const viewportWidth = window.innerWidth;
  if (left + 150 > viewportWidth) left = viewportWidth - 160;
  if (left < 10) left = 10;
  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
}

function hideTooltip() {
  const popup = document.getElementById('definitionPopup');
  if (popup) popup.style.display = 'none';
}

// Hover events for tooltips (no click interference)
document.addEventListener('mouseover', function(e) {
  const target = e.target.closest('.tooltip-icon');
  if (target) {
    const term = target.getAttribute('data-term');
    if (term) {
      clearTimeout(tooltipTimeout);
      showTooltip(e, term);
    }
  }
});

document.addEventListener('mouseout', function(e) {
  const target = e.target.closest('.tooltip-icon');
  if (target) {
    tooltipTimeout = setTimeout(() => {
      hideTooltip();
    }, 100);
  }
});

// Single card calculation
function calculate() {
  const totalUsed = parseFloat(document.getElementById('totalUsed').value) || 0;
  const totalLimit = parseFloat(document.getElementById('totalLimit').value) || 0;
  const multiToggle = document.getElementById('multiCardToggle').checked;
  
  if (multiToggle) {
    calculateMultiCard();
    return;
  }

  let ratio = 0;
  if (totalLimit > 0) ratio = (totalUsed / totalLimit) * 100;
  ratio = Math.min(100, ratio);

  let rating = '';
  let impact = '';
  let action = '';
  let insight = '';

  if (ratio <= 10) {
    rating = 'Excellent';
    impact = 'Positive — Excellent for credit score';
    action = 'Maintain this level';
    insight = 'Excellent! Your utilization is in the ideal range (under 10%). This is optimal for your credit score.';
  } else if (ratio <= 30) {
    rating = 'Good';
    impact = 'Positive — Good for credit score';
    action = 'Keep below 30%';
    insight = 'Good! Your utilization is within the recommended range (under 30%). Try to get under 10% for excellent scores.';
  } else if (ratio <= 50) {
    rating = 'Fair';
    impact = 'Moderate — May lower your score';
    action = 'Reduce balance or increase limit';
    insight = 'Your utilization is above 30%. This may be hurting your credit score. Consider paying down balances or requesting a credit limit increase.';
  } else if (ratio <= 75) {
    rating = 'Poor';
    impact = 'Negative — Significantly lowers score';
    action = 'Pay down debt immediately';
    insight = 'Your utilization is high. This is significantly impacting your credit score. Focus on reducing your balances as quickly as possible.';
  } else {
    rating = 'Very Poor';
    impact = 'Severe — Maxed out cards';
    action = 'Urgent: Reduce utilization';
    insight = 'Your utilization is very high. Maxed out credit cards severely damage your credit score. Prioritize debt repayment immediately.';
  }

  document.getElementById('rRatio').textContent = ratio.toFixed(1) + '%';
  document.getElementById('rRating').textContent = rating;
  document.getElementById('rImpact').textContent = impact;
  document.getElementById('rAction').textContent = action;

  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.innerHTML = insight;
  }

  renderSingleCardTable(totalUsed, totalLimit, ratio);
  renderChart(totalUsed, totalLimit, ratio, null);
}

function renderSingleCardTable(used, limit, ratio) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  thead.innerHTML = '<td><th>Card</th><th>Balance</th><th>Credit Limit</th><th>Utilization</th><th>Status</th></tr>';
  
  let status = '';
  if (ratio <= 10) status = 'Excellent';
  else if (ratio <= 30) status = 'Good';
  else if (ratio <= 50) status = 'Fair';
  else status = 'Poor';
  
  tbody.innerHTML = `<tr>
    <td class="highlight">All Cards</td>
    <td>${formatCurrency(used)}</td>
    <td>${formatCurrency(limit)}</td>
    <td>${ratio.toFixed(1)}%</td>
    <td>${status}</td>
  </tr>`;
}

// Multi-card calculation
function calculateMultiCard() {
  let totalUsed = 0;
  let totalLimit = 0;
  let cards = [];
  
  for (let i = 1; i <= cardCount; i++) {
    const used = parseFloat(document.getElementById(`card${i}Used`)?.value) || 0;
    const limit = parseFloat(document.getElementById(`card${i}Limit`)?.value) || 0;
    if (limit > 0) {
      totalUsed += used;
      totalLimit += limit;
      cards.push({ id: i, used, limit, ratio: (used / limit) * 100 });
    }
  }
  
  let overallRatio = 0;
  if (totalLimit > 0) overallRatio = (totalUsed / totalLimit) * 100;
  overallRatio = Math.min(100, overallRatio);
  
  let rating = '';
  let impact = '';
  let action = '';
  let insight = '';
  
  if (overallRatio <= 10) {
    rating = 'Excellent';
    impact = 'Positive — Excellent for credit score';
    action = 'Maintain this level';
    insight = 'Excellent! Your overall utilization is in the ideal range (under 10%). This is optimal for your credit score.';
  } else if (overallRatio <= 30) {
    rating = 'Good';
    impact = 'Positive — Good for credit score';
    action = 'Keep below 30%';
    insight = 'Good! Your overall utilization is within the recommended range (under 30%). Try to get under 10% for excellent scores.';
  } else if (overallRatio <= 50) {
    rating = 'Fair';
    impact = 'Moderate — May lower your score';
    action = 'Reduce balance or increase limit';
    insight = 'Your overall utilization is above 30%. This may be hurting your credit score. Consider paying down balances or requesting a credit limit increase.';
  } else if (overallRatio <= 75) {
    rating = 'Poor';
    impact = 'Negative — Significantly lowers score';
    action = 'Pay down debt immediately';
    insight = 'Your overall utilization is high. This is significantly impacting your credit score. Focus on reducing your balances as quickly as possible.';
  } else {
    rating = 'Very Poor';
    impact = 'Severe — Maxed out cards';
    action = 'Urgent: Reduce utilization';
    insight = 'Your overall utilization is very high. Maxed out credit cards severely damage your credit score. Prioritize debt repayment immediately.';
  }
  
  document.getElementById('rRatio').textContent = overallRatio.toFixed(1) + '%';
  document.getElementById('rRating').textContent = rating;
  document.getElementById('rImpact').textContent = impact;
  document.getElementById('rAction').textContent = action;
  
  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.innerHTML = insight;
  }
  
  renderMultiCardTable(cards, totalUsed, totalLimit, overallRatio);
  renderChart(totalUsed, totalLimit, overallRatio, cards);
}

function renderMultiCardTable(cards, totalUsed, totalLimit, overallRatio) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;
  thead.innerHTML = '<table><th>Card</th><th>Balance</th><th>Credit Limit</th><th>Utilization</th><th>Status</th></tr>';
  
  let rows = '';
  cards.forEach(card => {
    let status = '';
    if (card.ratio <= 10) status = 'Excellent';
    else if (card.ratio <= 30) status = 'Good';
    else if (card.ratio <= 50) status = 'Fair';
    else status = 'Poor';
    rows += `<tr>
      <td class="highlight">Card ${card.id}</td>
      <td class="balance-cell">${formatCurrency(card.used)}</td>
      <td class="limit-cell">${formatCurrency(card.limit)}</td>
      <td class="ratio-cell">${card.ratio.toFixed(1)}%</td>
      <td class="status-cell">${status}</td>
    </tr>`;
  });
  rows += `<tr style="background:#f8fafc;">
    <td class="highlight">Total / Average</td>
    <td class="balance-cell">${formatCurrency(totalUsed)}</td>
    <td class="limit-cell">${formatCurrency(totalLimit)}</td>
    <td class="ratio-cell"><strong>${overallRatio.toFixed(1)}%</strong></td>
    <td class="status-cell">—</td>
  </tr>`;
  tbody.innerHTML = rows;
}

function renderChart(totalUsed, totalLimit, overallRatio, cards) {
  const canvas = document.getElementById('toolChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (chartInstance) chartInstance.destroy();
  
  if (currentChartType === 'gauge') {
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [`Utilization ${overallRatio.toFixed(1)}%`, `Remaining ${(100 - overallRatio).toFixed(1)}%`],
        datasets: [{ data: [overallRatio, 100 - overallRatio], backgroundColor: ['#0d9488', '#e2e8f0'], borderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' } } }
    });
  } else if (currentChartType === 'bar' && cards && cards.length > 0) {
    const labels = cards.map(c => `Card ${c.id}`);
    const ratios = cards.map(c => c.ratio);
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Credit Utilization (%)', data: ratios, backgroundColor: '#0d9488', borderRadius: 6 }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Utilization %' } } } }
    });
  } else {
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [`Utilization ${overallRatio.toFixed(1)}%`, `Remaining ${(100 - overallRatio).toFixed(1)}%`],
        datasets: [{ data: [overallRatio, 100 - overallRatio], backgroundColor: ['#0d9488', '#e2e8f0'], borderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' } } }
    });
  }
}

function switchChart(type, btn) {
  currentChartType = type;
  document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const multiToggle = document.getElementById('multiCardToggle')?.checked;
  if (multiToggle) calculateMultiCard();
  else calculate();
}

function toggleMultiCard() {
  const multiSection = document.getElementById('multiCardSection');
  const isChecked = document.getElementById('multiCardToggle').checked;
  multiSection.style.display = isChecked ? 'block' : 'none';
  if (isChecked) calculateMultiCard();
  else calculate();
}

function addCard() {
  cardCount++;
  const container = document.getElementById('multiCardSection');
  const addButton = container.querySelector('.btn-secondary');
  const newCardDiv = document.createElement('div');
  newCardDiv.className = 'form-group';
  newCardDiv.id = `cardGroup_${cardCount}`;
  newCardDiv.innerHTML = `
    <label>Card ${cardCount}</label>
    <div class="input-addons">
      <span class="input-addon" id="currencySymbol${cardCount}">$</span>
      <input type="number" id="card${cardCount}Used" placeholder="Used" value="0" min="0" step="100" oninput="calculateMultiCard()" />
      <span class="input-addon">/</span>
      <input type="number" id="card${cardCount}Limit" placeholder="Limit" value="1000" min="0" step="500" oninput="calculateMultiCard()" />
    </div>
    <button type="button" class="remove-card-btn" onclick="removeCard(${cardCount})" style="margin-top:5px; font-size:0.7rem;">✖ Remove</button>
  `;
  container.insertBefore(newCardDiv, addButton);
  document.getElementById(`currencySymbol${cardCount}`).textContent = window.currentCurrency?.symbol || '$';
}

function removeCard(id) {
  if (cardCount <= 3) return;
  const el = document.getElementById(`cardGroup_${id}`);
  if (el) el.remove();
  cardCount--;
  calculateMultiCard();
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
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'credit-utilization-breakdown.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function copyResult() {
  const ratio = document.getElementById('rRatio').textContent;
  const rating = document.getElementById('rRating').textContent;
  const impact = document.getElementById('rImpact').textContent;
  const action = document.getElementById('rAction').textContent;
  const text = `Credit Utilization: ${ratio}\nRating: ${rating}\nImpact: ${impact}\nAction: ${action}`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Copied!';
      setTimeout(() => btn.textContent = orig, 2000);
    }
  }).catch(() => {});
}

function shareURL() {
  const params = new URLSearchParams();
  const multiToggle = document.getElementById('multiCardToggle').checked;
  params.set('multiToggle', multiToggle);
  if (!multiToggle) {
    params.set('totalUsed', document.getElementById('totalUsed').value);
    params.set('totalLimit', document.getElementById('totalLimit').value);
  } else {
    for (let i = 1; i <= cardCount; i++) {
      if (document.getElementById(`card${i}Used`)) {
        params.set(`card${i}Used`, document.getElementById(`card${i}Used`).value);
        params.set(`card${i}Limit`, document.getElementById(`card${i}Limit`).value);
      }
    }
  }
  params.set('currency', window.currentCurrency?.code || 'USD');
  const url = window.location.origin + window.location.pathname + '?' + params.toString();
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('shareBtn');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Link Copied!';
      setTimeout(() => btn.textContent = orig, 2000);
    }
  }).catch(() => {});
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('multiToggle') && params.get('multiToggle') === 'true') {
    document.getElementById('multiCardToggle').checked = true;
    toggleMultiCard();
    for (let i = 1; i <= 10; i++) {
      if (params.has(`card${i}Used`)) {
        if (i > 3 && !document.getElementById(`card${i}Used`)) {
          while (cardCount < i) addCard();
        }
        if (document.getElementById(`card${i}Used`)) document.getElementById(`card${i}Used`).value = params.get(`card${i}Used`);
        if (document.getElementById(`card${i}Limit`)) document.getElementById(`card${i}Limit`).value = params.get(`card${i}Limit`);
      }
    }
    calculateMultiCard();
  } else {
    if (params.has('totalUsed')) document.getElementById('totalUsed').value = params.get('totalUsed');
    if (params.has('totalLimit')) document.getElementById('totalLimit').value = params.get('totalLimit');
    syncSlider('totalUsed');
    syncSlider('totalLimit');
    calculate();
  }
  if (params.has('currency')) {
    const all = window.allCurrencies || [];
    const c = all.find(x => x.code === params.get('currency'));
    if (c) {
      window.currentCurrency = c;
      document.querySelectorAll('[id^="currencySymbol"]').forEach(s => s.textContent = window.currentCurrency.symbol);
    }
  }
}

function resetForm() {
  document.getElementById('multiCardToggle').checked = false;
  toggleMultiCard();
  document.getElementById('totalUsed').value = 2500;
  document.getElementById('totalLimit').value = 10000;
  document.getElementById('card1Used').value = 1000;
  document.getElementById('card1Limit').value = 5000;
  document.getElementById('card2Used').value = 800;
  document.getElementById('card2Limit').value = 3000;
  document.getElementById('card3Used').value = 700;
  document.getElementById('card3Limit').value = 2000;
  for (let i = 4; i <= cardCount; i++) {
    const el = document.getElementById(`cardGroup_${i}`);
    if (el) el.remove();
  }
  cardCount = 3;
  syncSlider('totalUsed');
  syncSlider('totalLimit');
  calculate();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  setupCurrencySearch();
  syncSlider('totalUsed');
  syncSlider('totalLimit');
  calculate();
});

// Make functions global
window.syncSlider = syncSlider;
window.syncInput = syncInput;
window.calculate = calculate;
window.calculateMultiCard = calculateMultiCard;
window.toggleMultiCard = toggleMultiCard;
window.addCard = addCard;
window.removeCard = removeCard;
window.switchChart = switchChart;
window.downloadCSV = downloadCSV;
window.copyResult = copyResult;
window.shareURL = shareURL;
window.resetForm = resetForm;