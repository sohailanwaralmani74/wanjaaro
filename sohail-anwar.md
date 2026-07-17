---
layout: main
title: Senior Consultant | Banking & Insurance Tools
description: Senior Consultant with 12+ years experience in enterprise ERP, finance, and banking applications — mortgage, claims, repurchase, and insurance.
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
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
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
  .gm-link-github {
    background: #24292e;
  }
  .gm-link-github:hover { background: #2f363d; }

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
    <img src="/assets/img/sohail-anwar.webp" alt="Sohail Anwar">
    <div>
      <p class="gm-eyebrow">Senior Consultant</p>
      <h1>Sohail Anwar</h1>
      <p class="gm-role">ERP, Finance &amp; Banking Application Specialist</p>
      <p class="gm-bio">
        Sohail is a <strong>Senior Consultant</strong> with over <strong>12 years</strong> of experience
        building enterprise‑grade solutions for <strong>ERPs, Finance, and Banking</strong> domains.
        He has deep hands‑on expertise in <strong>mortgage underwriting, claims processing,
        repurchase loan tracking, and insurance policy management</strong> — delivered through
        scalable architectures using <strong>Java, Spring Boot, JSF, Struts, Angular, and Microservices</strong>.
        <br><br>
        <strong>Tools he owns:</strong> Validates banking &amp; insurance Tools, including repurchase, mortgage, and claims.
      </p>
      <button class="gm-verify" id="gmVerifyBtn" aria-expanded="false" aria-controls="gmVerifyNote">
        ✓ Datafrog-verified expertise
      </button>
      <p class="gm-verify-note" id="gmVerifyNote">
        Verified means: continuous professional experience since 2013 in designing and delivering
        ERP, finance, and banking applications — including mortgage, claims, repurchase loans,
        and insurance — for enterprise clients. See the Case History tab below.
      </p>
    </div>
  </div>

  <div class="gm-tabs" role="tablist" aria-label="Profile sections">
    <button class="gm-tab" role="tab" aria-selected="true" id="tab-profile" aria-controls="panel-profile" onclick="gmSwitchTab('profile')">Profile</button>
    <button class="gm-tab" role="tab" aria-selected="false" id="tab-history" aria-controls="panel-history" onclick="gmSwitchTab('history')">Case History</button>
    <button class="gm-tab" role="tab" aria-selected="false" id="tab-method" aria-controls="panel-method" onclick="gmSwitchTab('method')">Methodology</button>
  </div>

  <div class="gm-panel active" id="panel-profile" role="tabpanel" aria-labelledby="tab-profile">
    <h2 style="font-size:1.2rem; margin-bottom:0.25rem;">Core technical expertise</h2>
    <div class="gm-skills">
      <span class="gm-skill">Java</span>
      <span class="gm-skill">Spring Boot</span>
      <span class="gm-skill">Microservices</span>
      <span class="gm-skill">Hibernate</span>
      <span class="gm-skill">JSF</span>
      <span class="gm-skill">Struts</span>
      <span class="gm-skill">Angular 8/9</span>
      <span class="gm-skill">REST (JAX-RS)</span>
      <span class="gm-skill">SOAP (JAX-WS)</span>
      <span class="gm-skill">ATG REST</span>
      <span class="gm-skill">Android</span>
      <span class="gm-skill">Pentaho Mondrian OLAP</span>
      <span class="gm-skill">Oracle/MySQL/PostgreSQL/MongoDB</span>
    </div>
    <p style="color:var(--ink-soft); margin-top:1.5rem; line-height:1.7; max-width:560px;">
      Sohail specialises in translating complex financial workflows into robust, maintainable
      software. Whether it's automating mortgage approvals, integrating claims pipelines, or
      building regulatory reporting modules, he ensures performance, data integrity, and
      security are baked in from day one.
    </p>
  </div>

  <div class="gm-panel" id="panel-history" role="tabpanel" aria-labelledby="tab-history">
    <div class="gm-case open">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">01</span><span class="gm-case-title">Finance &amp; Banking Platforms — Mortgage, Claims &amp; Insurance</span></span>
        <span class="gm-case-period gm-mono">Nov 2021 – Present</span>
      </button>
      <div class="gm-case-body">
        Leading the architecture and development of enterprise‑grade financial applications,
        covering <strong>mortgage underwriting, loan repurchase tracking, claims management,
        and insurance policy administration</strong>. Built with Java, Spring Boot, and
        microservices to handle high‑volume transactions with strict compliance requirements.
      </div>
    </div>
    <div class="gm-case">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">02</span><span class="gm-case-title">ERP &amp; Financial Systems Integration</span></span>
        <span class="gm-case-period gm-mono">Jan 2019 – May 2020</span>
      </button>
      <div class="gm-case-body">
        Designed and delivered ERP modules specifically for financial institutions —
        integrating banking workflows, loan lifecycle management, and automated compliance
        reporting using Spring Boot, Angular, and relational databases.
      </div>
    </div>
    <div class="gm-case">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">03</span><span class="gm-case-title">Insurance Claims &amp; Policy Management</span></span>
        <span class="gm-case-period gm-mono">Sep 2017 – Aug 2018</span>
      </button>
      <div class="gm-case-body">
        Built platforms for <strong>insurance claims processing</strong> and policyholder
        management, with integrated rule engines for automated adjudication and fraud
        detection, using Spring Boot, JPA, Angular, and Android mobile interfaces.
      </div>
    </div>
    <div class="gm-case">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">04</span><span class="gm-case-title">ERP Solutions for Banking &amp; Finance</span></span>
        <span class="gm-case-period gm-mono">Sep 2013 – Aug 2016</span>
      </button>
      <div class="gm-case-body">
        Designed and implemented comprehensive ERP systems for the banking and finance
        sectors — covering order tracking, policy administration, and regulatory compliance
        — using JSF, Hibernate, Swing, and AWT.
      </div>
    </div>
  </div>

  <div class="gm-panel" id="panel-method" role="tabpanel" aria-labelledby="tab-method">
    <h2 style="font-size:1.2rem; margin-bottom:1rem;">How Sohail ensures reliability for enterprise financial tools</h2>
    <div class="gm-method-item">
      <span class="gm-method-icon">01</span>
      <span class="gm-method-text">Domain‑driven design — modelling complex financial workflows
      (mortgage, claims, repurchase, insurance) accurately in code from the start.</span>
    </div>
    <div class="gm-method-item">
      <span class="gm-method-icon">02</span>
      <span class="gm-method-text">Strict data integrity and auditability — every transaction is
      logged, and every calculation is traceable to meet regulatory standards.</span>
    </div>
    <div class="gm-method-item">
      <span class="gm-method-icon">03</span>
      <span class="gm-method-text">Thorough testing with real‑world scenarios — unit, integration,
      and end‑to‑end tests that mirror actual banking and insurance use cases.</span>
    </div>
    <div class="gm-method-item">
      <span class="gm-method-icon">04</span>
      <span class="gm-method-text">Close collaboration with domain experts (underwriters, claims
      adjusters, compliance officers) to ensure the software solves the right problems.</span>
    </div>
  </div>

  <div class="gm-connect">
    <a href="https://www.linkedin.com/in/sohail-anwar-a63063162" target="_blank" class="gm-link">
      Connect on LinkedIn →
    </a>
    <a href="https://github.com/sohailanwaralmani74" target="_blank" class="gm-link gm-link-github">
      View on GitHub →
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