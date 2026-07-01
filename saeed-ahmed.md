---
layout: main
title: Full Stack Developer | Data Converters & Dev Utils
description: Full Stack Developer with 6+ years experience in Java, Spring Boot, Angular, Ionic, Hibernate, and web development. Builds and maintains the dev utilities and data converters on Datafrog.tools.
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
    <img src="/assets/img/saeed-ahmed.jpg" alt="Saeed Ahmed Sheikh">
    <div>
      <p class="gm-eyebrow">Full Stack Developer</p>
      <h1>Saeed Ahmed Sheikh</h1>
      <p class="gm-role">Java &amp; Angular Specialist</p>
      <p class="gm-bio">
        Saeed is a <strong>Full Stack Developer</strong> with <strong>6+ years</strong> of hands‑on experience
        building enterprise‑grade applications. He combines deep expertise in <strong>Java, Spring Boot, Angular,
        Ionic, Hibernate, and REST APIs</strong> with a strong focus on clean, maintainable code and user‑centric design.
        <br><br>
        <strong>Tools he owns:</strong> Builds and maintains the dev utilities, data converters, and API integrations.
      </p>
      <button class="gm-verify" id="gmVerifyBtn" aria-expanded="false" aria-controls="gmVerifyNote">
        ✓ Datafrog-verified expertise
      </button>
      <p class="gm-verify-note" id="gmVerifyNote">
        Verified means: continuous professional experience as a full‑stack developer since 2018,
        with a proven track record of delivering scalable web and mobile solutions across multiple
        domains — see the Case History tab below.
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
      <span class="gm-skill">Angular 8/9</span>
      <span class="gm-skill">Ionic</span>
      <span class="gm-skill">Hibernate</span>
      <span class="gm-skill">JSP</span>
      <span class="gm-skill">REST (JAX-RS)</span>
      <span class="gm-skill">Microservices</span>
      <span class="gm-skill">Oracle/MySQL/NoSQL</span>
      <span class="gm-skill">JavaScript</span>
      <span class="gm-skill">Android</span>
    </div>
    <p style="color:var(--ink-soft); margin-top:1.5rem; line-height:1.7; max-width:560px;">
      Saeed is equally comfortable on the backend (Java, Spring Boot, Hibernate) and the frontend
      (Angular, Ionic, JSP). He designs APIs, optimises database queries, and builds responsive UIs
      — all with a strong emphasis on performance, security, and Agile collaboration.
    </p>
  </div>

  <div class="gm-panel" id="panel-history" role="tabpanel" aria-labelledby="tab-history">
    <div class="gm-case open">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">01</span><span class="gm-case-title">Telecom &amp; eCommerce Platforms</span></span>
        <span class="gm-case-period gm-mono">Mar 2024 – Present</span>
      </button>
      <div class="gm-case-body">
        Developing and supporting features for telecom and e‑commerce solutions using Java, Spring Boot,
        and RESTful APIs, with a focus on modular, scalable architecture.
      </div>
    </div>
    <div class="gm-case">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">02</span><span class="gm-case-title">CRM &amp; Enterprise Applications</span></span>
        <span class="gm-case-period gm-mono">Sep 2022 – Feb 2024</span>
      </button>
      <div class="gm-case-body">
        Built enterprise‑grade CRM solutions with Java, Spring Boot, JSP, Hibernate, JavaScript, and MySQL,
        streamlining web‑based business workflows and improving data visibility.
      </div>
    </div>
    <div class="gm-case">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">03</span><span class="gm-case-title">B2B e‑Commerce Frameworks</span></span>
        <span class="gm-case-period gm-mono">Sep 2021 – Dec 2022</span>
      </button>
      <div class="gm-case-body">
        Contributed to B2B e‑commerce systems using Java, Oracle ATG, JSP, and RESTful services,
        focusing on back‑end integration and performance optimisation.
      </div>
    </div>
    <div class="gm-case">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">04</span><span class="gm-case-title">Full‑Stack Apps with Angular &amp; Ionic</span></span>
        <span class="gm-case-period gm-mono">Dec 2019 – Oct 2021</span>
      </button>
      <div class="gm-case-body">
        Developed cross‑platform web and mobile applications using Angular, Ionic, Spring Boot,
        and both relational and NoSQL databases, following Agile methodologies.
      </div>
    </div>
    <div class="gm-case">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">05</span><span class="gm-case-title">Web Development &amp; Database Design</span></span>
        <span class="gm-case-period gm-mono">Mar 2018 – Oct 2019</span>
      </button>
      <div class="gm-case-body">
        Designed and implemented databases and web applications using Java, JSP, and core web technologies,
        laying a strong foundation in full‑stack development.
      </div>
    </div>
    <div class="gm-case">
      <button class="gm-case-head" onclick="gmToggleCase(this)">
        <span><span class="gm-case-marker">06</span><span class="gm-case-title">Academic &amp; Training Projects</span></span>
        <span class="gm-case-period gm-mono">2017 – 2018</span>
      </button>
      <div class="gm-case-body">
        Built early learning management systems, traffic simulation tools, and educational web applications
        during certification and academic courses.
      </div>
    </div>
  </div>

  <div class="gm-panel" id="panel-method" role="tabpanel" aria-labelledby="tab-method">
    <h2 style="font-size:1.2rem; margin-bottom:1rem;">How Saeed builds reliable dev tools &amp; converters</h2>
    <div class="gm-method-item">
      <span class="gm-method-icon">01</span>
      <span class="gm-method-text">Every converter is tested with malformed, empty, and multi‑MB inputs to ensure no data loss and consistent output regardless of payload size.</span>
    </div>
    <div class="gm-method-item">
      <span class="gm-method-icon">02</span>
      <span class="gm-method-text">Utils are profiled for speed — especially when handling large JSON/CSV payloads — so they remain snappy even under heavy loads.</span>
    </div>
    <div class="gm-method-item">
      <span class="gm-method-icon">03</span>
      <span class="gm-method-text">Output schemas are validated against common standards (RFC 8259 for JSON, RFC 4180 for CSV, etc.) to guarantee interoperability.</span>
    </div>
    <div class="gm-method-item">
      <span class="gm-method-icon">04</span>
      <span class="gm-method-text">All tools are cross‑browser tested and accessibility‑checked, so they work reliably for every user, on every device.</span>
    </div>
  </div>

  <div class="gm-connect">
    <a href="https://www.linkedin.com/in/saeedahmedsheikh" target="_blank" class="gm-link">
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