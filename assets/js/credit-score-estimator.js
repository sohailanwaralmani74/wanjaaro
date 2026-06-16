// ==================== Credit Score Estimator JS ====================

function syncSlider(id) {
  const input = document.getElementById(id);
  const slider = document.getElementById(id + 'Slider');
  const display = document.getElementById(id + 'SliderVal');
  if (!input || !slider) return;
  const val = parseFloat(input.value) || 0;
  slider.value = val;
  if (display) {
    if (id === 'creditUtilization') display.textContent = val + '%';
    else if (id === 'creditAge') display.textContent = val + ' yrs';
    else if (id === 'hardInquiries') display.textContent = val + (val === 1 ? ' inquiry' : ' inquiries');
    else display.textContent = val;
  }
}

function syncInput(id, val) {
  const input = document.getElementById(id);
  if (input) input.value = val;
  syncSlider(id);
}

function getPaymentHistoryPoints(value) {
  switch(value) {
    case 'excellent': return 190;
    case 'good': return 150;
    case 'fair': return 100;
    case 'poor': return 40;
    default: return 100;
  }
}

function getUtilizationPoints(utilization) {
  if (utilization <= 10) return 165;
  if (utilization <= 20) return 150;
  if (utilization <= 30) return 130;
  if (utilization <= 40) return 110;
  if (utilization <= 50) return 90;
  if (utilization <= 70) return 60;
  return 30;
}

function getCreditAgePoints(years) {
  if (years >= 15) return 85;
  if (years >= 10) return 75;
  if (years >= 7) return 65;
  if (years >= 5) return 55;
  if (years >= 3) return 45;
  if (years >= 1) return 35;
  return 20;
}

function getCreditMixPoints(value) {
  switch(value) {
    case 'excellent': return 55;
    case 'good': return 45;
    case 'basic': return 30;
    case 'none': return 10;
    default: return 35;
  }
}

function getInquiriesPoints(inquiries) {
  if (inquiries === 0) return 55;
  if (inquiries === 1) return 50;
  if (inquiries === 2) return 42;
  if (inquiries === 3) return 35;
  if (inquiries === 4) return 28;
  if (inquiries <= 6) return 20;
  return 10;
}

function calculateScore() {
  const paymentHistory = document.getElementById('paymentHistory').value;
  const creditUtilization = parseFloat(document.getElementById('creditUtilization').value) || 0;
  const creditAge = parseFloat(document.getElementById('creditAge').value) || 0;
  const creditMix = document.getElementById('creditMix').value;
  const hardInquiries = parseFloat(document.getElementById('hardInquiries').value) || 0;

  const paymentPoints = getPaymentHistoryPoints(paymentHistory);
  const utilPoints = getUtilizationPoints(creditUtilization);
  const agePoints = getCreditAgePoints(creditAge);
  const mixPoints = getCreditMixPoints(creditMix);
  const inquiryPoints = getInquiriesPoints(hardInquiries);

  const totalPoints = paymentPoints + utilPoints + agePoints + mixPoints + inquiryPoints;
  const estimatedScore = 300 + totalPoints;

  let rating = '';
  let range = '';
  let approval = '';
  let insight = '';

  if (estimatedScore >= 800) {
    rating = 'Exceptional';
    range = '800 - 850';
    approval = 'Excellent — Best rates available';
    insight = 'You have exceptional credit. You qualify for the best interest rates and premium credit cards.';
  } else if (estimatedScore >= 740) {
    rating = 'Very Good';
    range = '740 - 799';
    approval = 'Very Good — Above average approval';
    insight = 'You have very good credit. Most lenders will approve you with competitive rates.';
  } else if (estimatedScore >= 670) {
    rating = 'Good';
    range = '670 - 739';
    approval = 'Good — Likely approval';
    insight = 'You have good credit. You should qualify for most loans and credit cards.';
  } else if (estimatedScore >= 580) {
    rating = 'Fair';
    range = '580 - 669';
    approval = 'Fair — Subprime rates may apply';
    insight = 'You have fair credit. Work on paying bills on time and reducing credit utilization.';
  } else {
    rating = 'Poor';
    range = '300 - 579';
    approval = 'Poor — May require secured cards';
    insight = 'You have poor credit. Focus on building positive payment history and reducing debt.';
  }

  document.getElementById('rScore').textContent = estimatedScore;
  document.getElementById('rRating').textContent = rating;
  document.getElementById('rRange').textContent = range;
  document.getElementById('rApproval').textContent = approval;

  const insightBox = document.getElementById('insightBox');
  const insightText = document.getElementById('insightText');
  if (insightBox && insightText) {
    insightBox.style.display = 'block';
    insightText.innerHTML = insight;
  }

  renderBreakdownTable(paymentHistory, creditUtilization, creditAge, creditMix, hardInquiries);
}

function renderBreakdownTable(paymentHistory, creditUtilization, creditAge, creditMix, hardInquiries) {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  if (!thead || !tbody) return;

  thead.innerHTML = '<tr><th>Factor</th><th>Your Input</th><th>Impact</th><th>Weight</th><th>Tips to Improve</th></tr>';

  const paymentHistoryText = document.getElementById('paymentHistory').options[document.getElementById('paymentHistory').selectedIndex]?.text || paymentHistory;
  const creditMixText = document.getElementById('creditMix').options[document.getElementById('creditMix').selectedIndex]?.text || creditMix;

  const paymentPoints = getPaymentHistoryPoints(paymentHistory);
  const utilPoints = getUtilizationPoints(creditUtilization);
  const agePoints = getCreditAgePoints(creditAge);
  const mixPoints = getCreditMixPoints(creditMix);
  const inquiryPoints = getInquiriesPoints(hardInquiries);

  const paymentPercent = (paymentPoints / 190) * 100;
  const utilPercent = (utilPoints / 165) * 100;
  const agePercent = (agePoints / 85) * 100;
  const mixPercent = (mixPoints / 55) * 100;
  const inquiryPercent = (inquiryPoints / 55) * 100;

  const rows = [
    { factor: 'Payment History', input: paymentHistoryText, impact: `${paymentPoints}/190 pts (${Math.round(paymentPercent)}%)`, weight: '35%', tip: 'Pay all bills on time. Set up autopay. Never miss a due date.' },
    { factor: 'Credit Utilization', input: `${creditUtilization}%`, impact: `${utilPoints}/165 pts (${Math.round(utilPercent)}%)`, weight: '30%', tip: `Keep utilization below 30% (ideally under 10%). Pay down balances.` },
    { factor: 'Credit Age', input: `${creditAge} years`, impact: `${agePoints}/85 pts (${Math.round(agePercent)}%)`, weight: '15%', tip: 'Keep old accounts open. Avoid opening many new accounts at once.' },
    { factor: 'Credit Mix', input: creditMixText, impact: `${mixPoints}/55 pts (${Math.round(mixPercent)}%)`, weight: '10%', tip: 'Add different credit types (installment loans, credit cards) responsibly.' },
    { factor: 'Hard Inquiries', input: `${hardInquiries} inquiries`, impact: `${inquiryPoints}/55 pts (${Math.round(inquiryPercent)}%)`, weight: '10%', tip: 'Limit credit applications. Inquiries stay for 2 years.' }
  ];

  tbody.innerHTML = rows.map(row => `
    <tr>
      <td class="highlight">${row.factor}</td>
      <td>${row.input}</td>
      <td>${row.impact}</td>
      <td>${row.weight}</td>
      <td class="tip-cell">${row.tip}</td>
    </tr>
  `).join('');
}

function copyResult() {
  const score = document.getElementById('rScore').textContent;
  const rating = document.getElementById('rRating').textContent;
  const range = document.getElementById('rRange').textContent;
  const approval = document.getElementById('rApproval').textContent;
  const text = `Estimated Credit Score: ${score} (${rating})\nScore Range: ${range}\nApproval Likelihood: ${approval}`;
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
  params.set('paymentHistory', document.getElementById('paymentHistory').value);
  params.set('creditUtilization', document.getElementById('creditUtilization').value);
  params.set('creditAge', document.getElementById('creditAge').value);
  params.set('creditMix', document.getElementById('creditMix').value);
  params.set('hardInquiries', document.getElementById('hardInquiries').value);
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
  if (params.has('paymentHistory')) document.getElementById('paymentHistory').value = params.get('paymentHistory');
  if (params.has('creditUtilization')) document.getElementById('creditUtilization').value = params.get('creditUtilization');
  if (params.has('creditAge')) document.getElementById('creditAge').value = params.get('creditAge');
  if (params.has('creditMix')) document.getElementById('creditMix').value = params.get('creditMix');
  if (params.has('hardInquiries')) document.getElementById('hardInquiries').value = params.get('hardInquiries');
  ['creditUtilization', 'creditAge', 'hardInquiries'].forEach(syncSlider);
}

function resetForm() {
  document.getElementById('paymentHistory').value = 'good';
  document.getElementById('creditUtilization').value = 30;
  document.getElementById('creditAge').value = 5;
  document.getElementById('creditMix').value = 'good';
  document.getElementById('hardInquiries').value = 2;
  ['creditUtilization', 'creditAge', 'hardInquiries'].forEach(syncSlider);
  calculateScore();
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromURL();
  ['creditUtilization', 'creditAge', 'hardInquiries'].forEach(syncSlider);
  calculateScore();
});

// Make functions global for HTML event handlers
window.syncSlider = syncSlider;
window.syncInput = syncInput;
window.calculateScore = calculateScore;
window.copyResult = copyResult;
window.shareURL = shareURL;
window.resetForm = resetForm;