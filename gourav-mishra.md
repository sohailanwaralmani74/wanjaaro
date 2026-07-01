---
layout: main
title: Financial Risk & Underwriting Analyst | Calculator Reviewer
description: Financial risk analyst with a background in mortgage underwriting, fraud detection, and credit evaluation. Reviews and verifies the financial calculators on Datafrog.tools.
is_homepage: true
---

<style>
  .gm-profile {
    --paper: #EFEDE6;
    --ink: #1B2430;
    --ink-soft: #4A5568;
    --brass: #A9792C;
    --teal: #2F6F62;
    --hairline: #C9C2B4;
    --paper-card: #F7F5F0;

    font-family: 'Inter', system-ui, sans-serif;
    color: var(--ink);
    padding: 3rem 1.5rem 5rem;
    max-width: 920px;
    margin: 0 auto;
  }
  .gm-profile h1, .gm-profile h2 {
    font-family: 'Fraunces', serif;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .gm-mono {
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.02em;
  }
  .gm-eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }

  .gm-hero {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 1.75rem;
    align-items: start;
    border-bottom: 1px solid var(--hairline);
    padding-bottom: 2rem;
    margin-bottom: 2rem;
  }
  .gm-hero img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    border-radius: 0.5rem;
    border: 1px solid var(--hairline);
  }
  .gm-hero h1 {
    font-size: 1.9rem;
    margin: 0 0 0.25rem;
  }
  .gm-role {
    color: var(--ink-soft);
    font-weight: 500;
    margin-bottom: 0.75rem;
  }
  .gm-bio {
    line-height: 1.7;
    color: var(--ink-soft);
    max-width: 540px;
  }

  .gm-verify {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.9rem;
    background: var(--paper-card);
    border: 1px solid var(--hairline);
    border-radius: 2rem;
    padding: 0.4rem 0.9rem;
    font-size: 0.85rem;
    cursor: pointer;
    color: var(--teal);
    font-weight: 600;
  }
  .gm-verify:hover { border-color: var(--teal); }
  .gm-verify-note {
    display: none;
    margin-top: 0.75rem;
    font-size: 0.88rem;
    color: var(--ink-soft);
    background: var(--paper-card);
    border-left: 3px solid var(--brass);
    padding: 0.75rem 1rem;
    max-width: 480px;
  }
  .gm-verify-note.open { display: block; }

  .gm-tabs {
    display: flex;
    gap: 0.25rem;
    border-bottom: 1px solid var(--hairline);
    margin-bottom: 2rem;
  }
  .gm-tab {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: none;
    border: none;
    padding: 0.75rem 1.1rem;
    color: var(--ink-soft);
    cursor: pointer;
    border-bottom: 2px solid transparent;
  }
  .gm-tab[aria-selected="true"] {
    color: var(--ink);
    border-bottom-color: var(--brass);
  }
  .gm-tab:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: 2px;
  }
  .gm-panel { display: none; }
  .gm-panel.active { display: block; }

  .gm-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .gm-skill {
    background: var(--paper-card);
    border: 1px solid var(--hairline);
    padding: 0.4rem 0.9rem;
    border-radius: 0.3rem;
    font-size: 0.85rem;
  }

  .gm-case {
    border: 1px solid var(--hairline);
    border-radius: 0.4rem;
    margin-bottom: 0.75rem;
    overflow: hidden;
    background: var(--paper-card);
  }
  .gm-case-head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    background: none;
    border: none;
    text-align: left;
    padding: 1rem 1.1rem;
    cursor: pointer;
    color: var(--ink);
  }
  .gm-case-head:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: 2px;
  }
  .gm-case-title { font-weight: 600; }
  .gm-case-period {
    font-size: 0.78rem;
    color: var(--brass);
    white-space: nowrap;
  }
  .gm-case-body {
    display: none;
    padding: 0 1.1rem 1.1rem;
    color: var(--ink-soft);
    line-height: 1.65;
    font-size: 0.95rem;
  }
  .gm-case.open .gm-case-body { display: block; }
  .gm-case-marker {
    font-family: 'IBM Plex Mono', monospace;
    color: var(--ink-soft);
    margin-right: 0.6rem;
  }

  .gm-method-item {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 0.75rem;
    margin-bottom: 1.1rem;
    align-items: start;
  }
  .gm-method-icon {
    font-family: 'IBM Plex Mono', monospace;
    color: var(--brass);
    font-weight: 700;
  }
  .gm-method-text { color: var(--ink-soft); line-height: 1.65; }

  .gm-connect {
    margin-top: 2.5rem;
    border-top: 1px solid var(--hairline);
    padding-top: 1.5rem;
  }
  .gm-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    background: var(--ink);
    color: var(--paper);
    padding: 0.6rem 1.3rem;
    border-radius: 0.4rem;
    font-size: 0.9rem;
    font-weight: 600;
  }
  .gm-link:hover { background: var(--teal); }

  @media (prefers-reduced-motion: reduce) {
    .gm-profile * { transition: none !important; animation: none !important; }
  }
  @media (max-width: 560px) {
    .gm-hero { grid-template-columns: 1fr; text-align: left; }
    .gm-hero img { width: 100px; height: 100px; }
  }
</style>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<div class="gm-profile">

  <div class="gm-hero">
    <img src="/assets/img/gourav-mishra.jpg" alt="Gourav Mishra">
    <div>
      <p class="gm-eyebrow">Author &amp; Calculator Reviewer</p>
      <h1>Gourav Mishra</h1>
      <p class="gm-role">Financial Risk &amp; Underwriting Analyst</p>
      <p class="gm-bio">
        Gourav has spent <strong>9+ years</strong> in mortgage risk, underwriting, and fraud evaluation,
        reviewing financial applications for accuracy, compliance, and risk exposure. He applies that
        same scrutiny to every calculator on Datafrog.tools — checking formulas against the standard
        financial methodology before they're published.
        <br><br>
        <strong>Tools he owns:</strong> Reviews all financial calculators — mortgages, loans, and investment returns.
      </p>
      <button class="gm-verify" id="gmVerifyBtn" aria-expanded="false" aria-controls="gmVerifyNote">
        ✓ Datafrog-verified expertise
      </button>
      <p class="gm-verify-note" id="gmVerifyNote">
        Verified means: real, continuous professional experience in mortgage underwriting and credit
        risk roles since 2016, listed in the Case History tab below. This is a background check on the
        author, not a claim that any calculator output is personalized financial advice — see the
        disclaimer on each tool.
      </p>
    </div>
  </div>

  <div class="gm-tabs" role="tablist" aria-label="Profile sections">
    <button class="gm-tab" role="tab" aria-selected="true" id="tab-profile" aria-controls="panel-profile" onclick="gmSwitchTab('profile')">Profile</button>
    <button class="gm-tab" role="tab" aria-selected="false" id="tab-history" aria-controls="panel-history" onclick="gmSwitchTab('history')">Case History</button>
    <button class="gm-tab" role="tab" aria-selected="false" id="tab-method" aria-controls="panel-method" onclick="gmSwitchTab('method')">Methodology</button>
  </div>

  <div class="gm-panel active" id="panel-profile" role="tabpanel" aria-labelledby="tab-profile">
    <h2 style="font-size:1.2rem; margin-bottom:0.25rem;">Areas of expertise</h2>
    <div class="gm-skills">
      <span class="gm-skill">Mortgage Underwriting</span>
      <span class="gm-skill">Fraud Analysis</span>
      <span class="gm-skill">Credit Evaluation</span>
      <span class="gm-skill">Risk Mitigation</span>
      <span class="gm-skill">Workflow &amp; Process Design</span>
      <span class="gm-skill">Financial Compliance Review</span>
    </div>
    <p style="color:var(--ink-soft); margin-top:1.5rem; line-height:1.7; max-width:560px;">
      Gourav's work has centered on evaluating financial risk at the individual application level —
      mortgage files, credit decisions, and fraud indicators — where small errors carry real financial
      consequences. That same standard of verification is applied to the calculators published here.
    </p>
  </div>

  <div class="gm-panel" id="panel-history" role="tabpanel" aria-labelledby="tab-history">
    <div class="gm-case open">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">01</span><span class="gm-case-title">Business Analyst — Mortgage Risk &amp; Fraud</span></span>
        <span class="gm-case-period gm-mono">Jul 2023 – Present</span>
      </button>
      <div class="gm-case-body">
        Conducts mortgage loan analysis, fraud detection, and credit evaluation for financial
        applications, alongside business process optimization work.
      </div>
    </div>
    <div class="gm-case">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">02</span><span class="gm-case-title">Team Manager — Underwriting Operations</span></span>
        <span class="gm-case-period gm-mono">Feb 2021 – Feb 2025</span>
      </button>
      <div class="gm-case-body">
        Managed underwriting and mortgage lending teams, focused on workflow efficiency and
        risk mitigation practices across the lending process.
      </div>
    </div>
    <div class="gm-case">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">03</span><span class="gm-case-title">Mortgage Underwriter</span></span>
        <span class="gm-case-period gm-mono">Jul 2019 – Feb 2021</span>
      </button>
      <div class="gm-case-body">
        Performed detailed mortgage underwriting and fraud assessment to support accurate,
        compliant credit decisions.
      </div>
    </div>
    <div class="gm-case">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">04</span><span class="gm-case-title">Pre-Underwriter, Mortgage Review</span></span>
        <span class="gm-case-period gm-mono">Sep 2016 – Jun 2019</span>
      </button>
      <div class="gm-case-body">
        Reviewed mortgage applications, validated underlying data, and supported compliance
        and risk-minimization standards on every file.
      </div>
    </div>
  </div>

  <div class="gm-panel" id="panel-method" role="tabpanel" aria-labelledby="tab-method">
    <h2 style="font-size:1.2rem; margin-bottom:1rem;">How Gourav verifies every calculator on Datafrog</h2>
    <div class="gm-method-item">
      <span class="gm-method-icon">01</span>
      <span class="gm-method-text">Every formula is checked against the recognized standard for that
      calculation — compound interest, CAGR, or amortization — not assumed or approximated.</span>
    </div>
    <div class="gm-method-item">
      <span class="gm-method-icon">02</span>
      <span class="gm-method-text">Worked examples on each page are calculated by hand and matched
      against the live tool's default settings before publishing, so the documented examples and the
      tool itself never disagree.</span>
    </div>
    <div class="gm-method-item">
      <span class="gm-method-icon">03</span>
      <span class="gm-method-text">Every financial calculator carries a disclaimer stating results are
      illustrative, not personalized financial advice, and that a registered advisor should be consulted
      before acting on them.</span>
    </div>
    <div class="gm-method-item">
      <span class="gm-method-icon">04</span>
      <span class="gm-method-text">Pages are revisited when formulas, tax rules, or underlying data
      sources change, not left static indefinitely.</span>
    </div>
  </div>

  <div class="gm-connect">
    <a href="https://www.linkedin.com/in/gourav-m-0a0584132" target="_blank" class="gm-link">
      Connect on LinkedIn →
    </a>
  </div>
</div>

<script>
  function gmSwitchTab(name) {
    document.querySelectorAll('.gm-tab').forEach(t => t.setAttribute('aria-selected', 'false'));
    document.querySelectorAll('.gm-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + name).setAttribute('aria-selected', 'true');
    document.getElementById('panel-' + name).classList.add('active');
  }
  function gmToggleCase(headerEl) {
    const caseEl = headerEl.closest('.gm-case');
    caseEl.classList.toggle('open');
  }
  document.getElementById('gmVerifyBtn').addEventListener('click', function () {
    const note = document.getElementById('gmVerifyNote');
    const open = note.classList.toggle('open');
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
</script>