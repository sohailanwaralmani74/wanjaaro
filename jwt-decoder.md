---
layout: main
title: "JWT Decoder - Browser Based , Secure, and Private Tool"
description: "Free online tools to decode, parse, and verify JWT tokens. Fast and secure. JWT Decoder works within browser. No code uploaded to server."
keywords: "jwt decoder, jwt token decode, decode jwt, decodejwt, jwt token decrypt, jwt parser, jwt decode online, token decode, decode jwt token, jwt token decode online, decode token, bearer token decode, parse jwt, parse jwt token, jwt decrypt"
category: utilities
---

<style>
.jwt-wrap{background:#1e1e1e;border-radius:10px;padding:20px;display:flex;flex-direction:column;gap:16px;min-height:100px; margin: 2rem;}
.panel-card{background:#252526;border-radius:8px;border:1px solid #3c3c3c;overflow:hidden}
.panel-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#2d2d2d;border-bottom:1px solid #3c3c3c}
.panel-title{font-size:13px;font-weight:500;color:#cccccc;letter-spacing:.3px}
.panel-sub{font-size:11px;color:#6a9955;margin-top:2px}
.btn-row{display:flex;gap:8px;align-items:center}
.jwt-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:4px;font-size:12px;font-family:inherit;cursor:pointer;border:1px solid #555;background:#3a3a3a;color:#cccccc;transition:background .15s}
.jwt-btn:hover{background:#4a4a4a}
.jwt-btn.primary{background:#0e639c;border-color:#0e639c;color:#fff}
.jwt-btn.primary:hover{background:#1177bb}
.jwt-btn:disabled{opacity:.4;cursor:not-allowed}
.jwt-btn i{font-size:14px}
.jwt-ta{width:100%;min-height:160px;max-height:200px;background:#1b1b1b;color:#9cdcfe;font-family:var(--font-mono,'Fira Mono',monospace);font-size:12px;padding:12px;border:none;resize:none;outline:none;line-height:1.6}
.jwt-ta::placeholder{color:#4a4a4a}
.jwt-ta:disabled{color:#555;cursor:not-allowed}
.output-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#3c3c3c}
.seg-panel{background:#1e1e1e;display:flex;flex-direction:column}
.seg-label{padding:7px 12px;font-size:11px;font-weight:500;letter-spacing:.5px;border-bottom:1px solid #3c3c3c}
.seg-label.hdr{color:#f97583;background:#252526}
.seg-label.pay{color:#79b8ff;background:#252526}
.seg-label.sig{color:#b392f0;background:#252526}
.seg-body{padding:12px;font-size:11.5px;line-height:1.7;flex:1;color:#d4d4d4;overflow-y:auto;max-height:220px;word-break:break-all}
.seg-body.disabled-look{color:#444;font-style:italic}
.key{color:#9cdcfe}.val-str{color:#ce9178}.val-num{color:#b5cea8}.val-bool{color:#569cd6}
.badge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:10px;margin-left:8px;vertical-align:middle}
.badge.valid{background:#1c4a2a;color:#6fcf97}.badge.invalid{background:#4a1c1c;color:#f97583}
.toast{position:fixed;bottom:24px;right:24px;padding:10px 18px;border-radius:6px;font-size:12px;font-family:var(--font-mono,monospace);z-index:999;opacity:0;transform:translateY(8px);transition:opacity .25s,transform .25s;pointer-events:none;max-width:320px}
.toast.success{background:#1e293b;border:1px solid #2d7a4a;color:#6fcf97}
.toast.error{background:#1e293b;border:1px solid #8b3333;color:#f97583}
.toast.show{opacity:1;transform:translateY(0)}
.badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid var(--border);
    background: var(--surface-2);
    color: var(--ink-2);
  }
  .badge.green { background: var(--green-light); border-color: #bbf7d0; color: var(--green); }
  .badge.blue  { background: var(--accent-light); border-color: #bfdbfe; color: var(--accent); }
  .badge.amber { background: var(--amber-light); border-color: #fde68a; color: var(--amber); }
 
  /* ── SECTIONS ── */
  .section { margin-bottom: 56px; margin-top: 56px; }
  h2 {
    font-size: clamp(20px, 3vw, 27px);
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--border);
    letter-spacing: -0.3px;
  }
  h3 {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    margin: 28px 0 8px;
  }
  p { margin-bottom: 16px; color: var(--ink-2); }
  p:last-child { margin-bottom: 0; }
  strong { color: var(--ink); font-weight: 700; }
  code {
    font-family: var(--font-code);
    font-size: 13.5px;
    background: var(--surface-3);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 1px 6px;
    color: #be123c;
  }
 
  /* ── ANATOMY DIAGRAM ── */
  .jwt-anatomy {
    background: #0f172a;
    border-radius: var(--radius);
    padding: 24px;
    margin: 24px 0;
    overflow-x: auto;
  }
  .jwt-parts {
    display: flex;
    gap: 0;
    font-family: var(--font-code);
    font-size: 13px;
    line-height: 1;
    flex-wrap: wrap;
    word-break: break-all;
  }
  .jwt-part { padding: 8px 10px; border-radius: 4px; }
  .jwt-part.hdr { background: #7f1d1d; color: #fca5a5; }
  .jwt-part.dot { color: #94a3b8; padding: 8px 2px; }
  .jwt-part.pay { background: #1e3a5f; color: #93c5fd; }
  .jwt-part.sig { background: #1a1a4e; color: #c4b5fd; }
  .jwt-labels {
    display: flex;
    gap: 12px;
    margin-top: 14px;
    flex-wrap: wrap;
    font-family: var(--font-ui);
    font-size: 12px;
  }
  .jwt-label { display: flex; align-items: center; gap: 6px; }
  .jwt-label-dot { width: 10px; height: 10px; border-radius: 2px; }
 
  /* ── CODE BLOCKS ── */
  pre {
    background: #0f172a;
    color: #e2e8f0;
    border-radius: var(--radius);
    padding: 20px 24px;
    overflow-x: auto;
    font-family: var(--font-code);
    font-size: 13px;
    line-height: 1.7;
    margin: 16px 0 24px;
    border: 1px solid #1e293b;
  }
  .code-lang {
    font-family: var(--font-ui);
    font-size: 11px;
    color: var(--ink-3);
    text-transform: uppercase;
    letter-spacing: .8px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .c-key { color: #7dd3fc; }
  .c-str { color: #86efac; }
  .c-cmt { color: #64748b; font-style: italic; }
  .c-kw  { color: #f472b6; }
  .c-fn  { color: #fbbf24; }
  .c-num { color: #fb923c; }
 
  /* ── COMPARISON TABLE ── */
  .tbl-wrap { overflow-x: auto; margin: 16px 0 24px; }
  table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-ui);
    font-size: 14px;
  }
  th {
    background: var(--surface-3);
    border: 1px solid var(--border);
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
    color: var(--ink);
    white-space: nowrap;
  }
  td {
    border: 1px solid var(--border);
    padding: 9px 14px;
    color: var(--ink-2);
    vertical-align: top;
  }
  tr:nth-child(even) td { background: var(--surface-2); }
 
  /* ── CALLOUT BOXES ── */
  .callout {
    border-left: 4px solid;
    padding: 16px 20px;
    border-radius: 0 var(--radius) var(--radius) 0;
    margin: 20px 0;
  }
  .callout.info  { border-color: var(--accent); background: var(--accent-light); }
  .callout.warn  { border-color: var(--amber); background: var(--amber-light); }
  .callout.ok    { border-color: var(--green); background: var(--green-light); }
  .callout p { margin: 0; font-size: 15px; }
  .callout strong { display: block; margin-bottom: 4px; font-family: var(--font-ui); font-size: 12px; text-transform: uppercase; letter-spacing: .8px; }
  .callout.info strong { color: var(--accent); }
  .callout.warn strong { color: var(--amber); }
  .callout.ok strong { color: var(--green); }
 
  /* ── FAQ ── */
  .faq-item {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 12px;
    overflow: hidden;
  }
  .faq-q {
    padding: 16px 20px;
    font-family: var(--font-ui);
    font-weight: 600;
    font-size: 15px;
    color: var(--ink);
    background: var(--surface-2);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    list-style: none;
  }
  .faq-q::-webkit-details-marker { display: none; }
  details[open] .faq-q { border-bottom: 1px solid var(--border); background: var(--surface); }
  .faq-a {
    padding: 16px 20px;
    font-size: 15px;
    color: var(--ink-2);
    line-height: 1.7;
  }
  .faq-chevron { font-size: 18px; color: var(--ink-3); transition: transform .2s; }
  details[open] .faq-chevron { transform: rotate(90deg); }
 
  /* ── CLAIMS TABLE ── */
  .claim-tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: var(--font-code);
    font-size: 12px;
    background: var(--surface-3);
    border: 1px solid var(--border);
    color: #be123c;
  }
 
  /* ── STEPS ── */
  .steps { counter-reset: step; list-style: none; padding: 0; }
  .steps li {
    counter-increment: step;
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    align-items: flex-start;
  }
  .step-num {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--accent);
    color: white;
    font-family: var(--font-ui);
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 3px;
  }
  .step-body { font-size: 16px; color: var(--ink-2); }
  .step-body strong { display: block; color: var(--ink); font-family: var(--font-ui); margin-bottom: 4px; }
 
  /* ── BREADCRUMB ── */
  .breadcrumb {
    font-family: var(--font-ui);
    font-size: 13px;
    color: var(--ink-3);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .breadcrumb a { color: var(--accent); text-decoration: none; }
  .breadcrumb a:hover { text-decoration: underline; }
 
  /* ── LANG GRID ── */
  .lang-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin: 16px 0 24px; }
  .lang-card {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .lang-card-head {
    padding: 10px 14px;
    background: var(--surface-3);
    font-family: var(--font-ui);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .8px;
    color: var(--ink-2);
    border-bottom: 1px solid var(--border);
  }
  .lang-card pre {
    margin: 0;
    border-radius: 0;
    border: none;
    font-size: 12px;
    padding: 14px;
  }
 
  @media (max-width: 600px) {
    .jwt-parts { font-size: 10px; }
    h1 { font-size: 26px; }
    .hero { padding: 32px 0 28px; }
  }
    .hero-lead {
    font-size: 19px;
    color: var(--ink-2);
    max-width: 640px;
    margin-bottom: 28px;
  }
  .hero-badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    font-family: var(--font-ui);
  }
    .hero {
    padding: 56px 0 40px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 48px;
  }
  .hero-eyebrow {
    font-family: var(--font-ui);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 12px;
  }
</style>

<div id="jwt-decoder" aria-label="JWT Decoder Tool " >
  <h1 >JWT Decoder — Decode Any JWT Token Instantly</h1>
 <p  >
      Paste your <strong>JWT token</strong> above and decode it in one click. The header, payload, and signature are rendered as readable JSON — no server calls, no login, no data ever leaves your browser.
    </p>
  <div class="hero-badges">
      <span class="badge green">✓ 100% Client-Side</span>
      <span class="badge blue">✓ All Algorithms Supported</span>
      <span class="badge amber">✓ Expiry Detection</span>
      <span class="badge">✓ Bearer Token Ready</span>
      <span class="badge">✓ Free Forever</span>
    </div>
</div>
<div id="jwt-decoder" aria-label="JWT Decoder Tool " >
    

<div class="jwt-wrap">
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-key" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#e2c08d"></i>JWT Decoder</div>
        <div class="panel-sub">Paste a JWT token and click Decode</div>
      </div>
      <div class="btn-row">
        <button class="jwt-btn" id="btn-clear" aria-label="Clear input"><i class="ti ti-trash" aria-hidden="true"></i> Clear</button>
        <button class="jwt-btn primary" id="btn-decode"><i class="ti ti-bolt" aria-hidden="true"></i> Decode</button>
      </div>
    </div>
    <textarea id="jwt-input" class="jwt-ta" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" spellcheck="false"></textarea>
  </div>

  <div class="panel-card" id="output-panel">
    <div class="panel-header">
      <div>
        <div class="panel-title" id="status-title"><i class="ti ti-lock" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#555"></i>Decoded Output</div>
        <div class="panel-sub" id="status-sub">Awaiting valid token...</div>
      </div>
      <div class="btn-row">
        <button class="jwt-btn" id="btn-copy" disabled><i class="ti ti-copy" aria-hidden="true"></i> Copy JSON</button>
      </div>
    </div>
    <div class="output-grid" id="output-grid">
      <div class="seg-panel">
        <div class="seg-label hdr">HEADER</div>
        <div class="seg-body disabled-look" id="seg-header">— waiting —</div>
      </div>
      <div class="seg-panel">
        <div class="seg-label pay">PAYLOAD</div>
        <div class="seg-body disabled-look" id="seg-payload">— waiting —</div>
      </div>
      <div class="seg-panel">
        <div class="seg-label sig">SIGNATURE</div>
        <div class="seg-body disabled-look" id="seg-sig">— waiting —</div>
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast" role="alert" aria-live="assertive"></div>


<!-- ══ WHAT IS A JWT ══ -->
  <article  style="margin:2rem;">
    <h2 itemprop="headline">What Is a JWT Token? A Plain-English Explanation</h2>
    <p >
      A <strong>JSON Web Token</strong> (JWT, pronounced "jot") is a compact, self-contained string that securely
      carries information between two parties. You see them constantly in modern web development — they are the
      tokens returned when you log in, the bearer tokens attached to every API request, and the access tokens
      your OAuth provider hands you after authorization.
    </p>
 
    <p>
      A JWT is made of three Base64url-encoded sections joined by dots. There is no encryption by default —
      the data is <em>encoded</em>, not hidden. That is why a JWT decoder can read the contents instantly,
      without any secret key.
    </p>
 
    <div class="jwt-anatomy" role="img" aria-label="JWT token anatomy showing header, payload and signature parts">
      <div class="jwt-parts">
        <span class="jwt-part hdr">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>
        <span class="jwt-part dot">.</span>
        <span class="jwt-part pay">eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ</span>
        <span class="jwt-part dot">.</span>
        <span class="jwt-part sig">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
      </div>
      <div class="jwt-labels">
        <span class="jwt-label" style="color:#fca5a5"><span class="jwt-label-dot" style="background:#7f1d1d"></span>Header</span>
        <span class="jwt-label" style="color:#93c5fd"><span class="jwt-label-dot" style="background:#1e3a5f"></span>Payload</span>
        <span class="jwt-label" style="color:#c4b5fd"><span class="jwt-label-dot" style="background:#1a1a4e"></span>Signature</span>
      </div>
    </div>
 
    <h3>The Three Parts of a JWT</h3>
 
    <p><strong>1. Header</strong> — Describes the token type and the signing algorithm used.
    After decoding, it looks like <code>{"alg":"HS256","typ":"JWT"}</code>. The algorithm could be
    symmetric (HS256, HS512) or asymmetric (RS256, ES256, PS256).</p>
 
    <p><strong>2. Payload</strong> — The meat of the token. Contains <em>claims</em>: key-value pairs
    that assert facts about the user or session. Standard claims include <code>sub</code> (user ID),
    <code>exp</code> (expiry timestamp), <code>iat</code> (issued-at), <code>iss</code> (issuer),
    and <code>aud</code> (audience). Your app can add any custom claims it needs.</p>
 
    <p><strong>3. Signature</strong> — A cryptographic hash of the header and payload, created with
    a secret key or private key. It guarantees the token has not been tampered with. You cannot verify
    the signature client-side without the key — but you can always <em>read</em> the header and payload.</p>
 
    <div class="callout info">
      <p><strong>Quick Fact</strong>
      Every JWT starts with <code>eyJ</code> — that is Base64url for the opening <code>{"</code> of the JSON header object. If your token starts with anything else, it is likely not a standard JWT.</p>
    </div>
  </article>
 
  <!-- ══ HOW TO USE ══ -->
  <article  itemscope itemtype="https://schema.org/HowTo" style="margin:2rem;">
    <h2 >How to Decode a JWT Token Online — Step by Step</h2>
    <meta  content="Step-by-step instructions to decode a JWT token using this free online JWT decoder tool.">
 
    <ol class="steps" itemprop="step" itemscope itemtype="https://schema.org/ItemList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/HowToStep">
        <div class="step-num">1</div>
        <div class="step-body">
          <strong >Get your JWT token</strong>
          <span >Find it in your API response, browser DevTools (Application → Local Storage or Cookies),
          Authorization header, or your auth provider's dashboard. It is three Base64url strings separated by dots.</span>
        </div>
      </li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/HowToStep">
        <div class="step-num">2</div>
        <div class="step-body">
          <strong >Paste it into the input panel</strong>
          <span >Copy the entire token — including all three parts and both dots — and paste it into
          the input area at the top of this page. If it is a bearer token, paste everything after <code>Bearer </code>.</span>
        </div>
      </li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/HowToStep">
        <div class="step-num">3</div>
        <div class="step-body">
          <strong >Click Decode</strong>
          <span >Press the Decode button (or hit Ctrl+Enter). The JWT parser immediately splits
          the token and displays the header and payload as colour-coded JSON.</span>
        </div>
      </li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/HowToStep">
        <div class="step-num">4</div>
        <div class="step-body">
          <strong >Read your claims</strong>
          <span >Inspect the decoded output. Unix timestamps like <code>exp</code> and <code>iat</code>
          are automatically converted to human-readable dates. Check the algorithm, user ID, roles,
          permissions, and any custom claims your application sets.</span>
        </div>
      </li>
    </ol>
  </article>
 
  <!-- ══ STANDARD CLAIMS ══ -->
  <article class="onpage-content">
    <h2>Standard JWT Claims Explained</h2>
    <p>When you decode a JWT token, the payload contains <em>claims</em>. Here are the registered claims
    defined by <a href="https://datatracker.ietf.org/doc/html/rfc7519" rel="noopener noreferrer" target="_blank">RFC 7519</a>
    that you will encounter most often:</p>
 
    <div class="tbl-wrap">
      <table itemscope itemtype="https://schema.org/Table">
        <thead>
          <tr>
            <th>Claim</th>
            <th>Full Name</th>
            <th>Description</th>
            <th>Example Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="claim-tag">sub</span></td>
            <td>Subject</td>
            <td>Unique identifier for the user or entity the token represents</td>
            <td><code>"1234567890"</code></td>
          </tr>
          <tr>
            <td><span class="claim-tag">iss</span></td>
            <td>Issuer</td>
            <td>Who created and signed the token (e.g. your auth server domain)</td>
            <td><code>"https://auth.example.com"</code></td>
          </tr>
          <tr>
            <td><span class="claim-tag">aud</span></td>
            <td>Audience</td>
            <td>Intended recipient — the API or service that should accept the token</td>
            <td><code>"api.example.com"</code></td>
          </tr>
          <tr>
            <td><span class="claim-tag">exp</span></td>
            <td>Expiration Time</td>
            <td>Unix timestamp after which the token must not be accepted</td>
            <td><code>1893456000</code></td>
          </tr>
          <tr>
            <td><span class="claim-tag">iat</span></td>
            <td>Issued At</td>
            <td>Unix timestamp when the token was created</td>
            <td><code>1516239022</code></td>
          </tr>
          <tr>
            <td><span class="claim-tag">nbf</span></td>
            <td>Not Before</td>
            <td>Token must not be accepted before this timestamp</td>
            <td><code>1516239022</code></td>
          </tr>
          <tr>
            <td><span class="claim-tag">jti</span></td>
            <td>JWT ID</td>
            <td>Unique identifier for the token, used to prevent replay attacks</td>
            <td><code>"abc123-xyz"</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
 
  <!-- ══ DECODE vs DECRYPT ══ -->
  <article class="onpage-content">
    <h2>JWT Decode vs JWT Decrypt — What Is the Difference?</h2>
 
    <p>This is the question developers ask most often, and the confusion is completely understandable.
    The words <em>decode</em> and <em>decrypt</em> sound interchangeable, but they describe fundamentally
    different operations when it comes to JWT tokens.</p>
 
    <p><strong>Decoding</strong> reverses Base64url encoding. Because standard JWTs are only encoded —
    not encrypted — anyone who holds the token string can decode and read the payload. The signing
    signature on a JWT proves the token has not been tampered with, but it does not hide the payload
    from view.</p>
 
    <p><strong>Decryption</strong> applies to JWE (JSON Web Encryption) tokens. In a JWE, the payload
    is genuinely encrypted using a key, and it cannot be read without that key. JWEs are much less common
    than standard signed JWTs and require a different tool and the corresponding decryption key.</p>
 
    <div class="tbl-wrap">
      <table>
        <thead>
          <tr><th>Property</th><th>JWT (JWS — Signed)</th><th>JWE (Encrypted)</th></tr>
        </thead>
        <tbody>
          <tr><td>Payload visible?</td><td>Yes — Base64url only</td><td>No — encrypted</td></tr>
          <tr><td>Key required to read?</td><td>No</td><td>Yes</td></tr>
          <tr><td>Tamper-proof?</td><td>Yes (signature)</td><td>Yes (AEAD)</td></tr>
          <tr><td>Common in auth flows?</td><td>Very common</td><td>Rare</td></tr>
          <tr><td>This tool supports it?</td><td>✓ Yes</td><td>✗ No</td></tr>
        </tbody>
      </table>
    </div>
 
    <div class="callout warn">
      <p><strong>Important</strong>
      Because the JWT payload is only encoded — not encrypted — never store sensitive data like passwords,
      credit card numbers, or private keys inside a JWT claim. Treat the payload as public information.</p>
    </div>
  </article>
 
  <!-- ══ CODE EXAMPLES ══ -->
  <article class="onpage-content">
    <h2>How to Decode a JWT in Code — Language Examples</h2>
    <p>Our online JWT parser is the quickest way to inspect a token, but sometimes you need to decode
    a JWT programmatically inside your application. Here are concise examples for the most popular languages.</p>
 
    <div class="lang-grid">
 
      <div class="lang-card">
        <div class="lang-card-head">JavaScript — No Library</div>
        <pre><code><span class="c-kw">function</span> <span class="c-fn">decodeJWT</span>(token) {
  <span class="c-kw">const</span> [,payload] = token.split(<span class="c-str">'.'</span>);
  <span class="c-kw">const</span> b64 = payload
    .replace(/<span class="c-str">-/g, '+'</span>)
    .replace(/<span class="c-str">_/g, '/'</span>);
  <span class="c-kw">return</span> JSON.parse(atob(b64));
}</code></pre>
      </div>
 
      <div class="lang-card">
        <div class="lang-card-head">JavaScript — jwt-decode npm</div>
        <pre><code><span class="c-cmt">// npm install jwt-decode</span>
<span class="c-kw">import</span> { jwtDecode } <span class="c-kw">from</span> <span class="c-str">'jwt-decode'</span>;
 
<span class="c-kw">const</span> decoded = <span class="c-fn">jwtDecode</span>(token);
console.log(decoded.sub);
console.log(decoded.exp);</code></pre>
      </div>
 
      <div class="lang-card">
        <div class="lang-card-head">Python — PyJWT</div>
        <pre><code><span class="c-cmt"># pip install PyJWT</span>
<span class="c-kw">import</span> jwt
 
decoded = jwt.decode(
  token,
  options={
    <span class="c-str">"verify_signature"</span>: <span class="c-kw">False</span>
  }
)
<span class="c-kw">print</span>(decoded[<span class="c-str">"sub"</span>])</code></pre>
      </div>
 
      <div class="lang-card">
        <div class="lang-card-head">PHP</div>
        <pre><code><span class="c-cmt">// composer require firebase/php-jwt</span>
<span class="c-kw">use</span> Firebase\JWT\JWT;
<span class="c-kw">use</span> Firebase\JWT\Key;
 
$decoded = JWT::<span class="c-fn">decode</span>(
  $token,
  <span class="c-kw">new</span> <span class="c-fn">Key</span>($secret, <span class="c-str">'HS256'</span>)
);</code></pre>
      </div>
 
      <div class="lang-card">
        <div class="lang-card-head">React Hook</div>
        <pre><code><span class="c-kw">import</span> { jwtDecode } <span class="c-kw">from</span> <span class="c-str">'jwt-decode'</span>;
<span class="c-kw">import</span> { useMemo } <span class="c-kw">from</span> <span class="c-str">'react'</span>;
 
<span class="c-kw">function</span> <span class="c-fn">useJWT</span>(token) {
  <span class="c-kw">return</span> useMemo(() =>
    token ? <span class="c-fn">jwtDecode</span>(token) : null,
    [token]
  );
}</code></pre>
      </div>
 
      <div class="lang-card">
        <div class="lang-card-head">Python — Manual (No Library)</div>
        <pre><code><span class="c-kw">import</span> base64, json
 
<span class="c-kw">def</span> <span class="c-fn">decode_jwt</span>(token):
  part = token.split(<span class="c-str">"."</span>)[<span class="c-num">1</span>]
  pad = part + <span class="c-str">"="</span> * (-<span class="c-fn">len</span>(part) % <span class="c-num">4</span>)
  <span class="c-kw">return</span> json.loads(
    base64.<span class="c-fn">urlsafe_b64decode</span>(pad)
  )</code></pre>
      </div>
 
    </div>
 
    <div class="callout ok">
      <p><strong>Tip</strong>
      For production applications, always use a well-maintained library (PyJWT, jsonwebtoken, php-jwt)
      rather than manual Base64 decoding. Libraries handle edge cases, padding issues, and also give you
      signature verification — which manual decoding does not.</p>
    </div>
  </article>
 
  <!-- ══ ALGORITHMS ══ -->
  <article class="onpage-content">
    <h2>Supported JWT Algorithms</h2>
    <p>This JWT decoder works with tokens signed by any algorithm. Here is a quick reference for what
    you will see in the <code>alg</code> field of the decoded header:</p>
 
    <div class="tbl-wrap">
      <table>
        <thead>
          <tr><th>Algorithm</th><th>Type</th><th>Key Type</th><th>Common Use Case</th></tr>
        </thead>
        <tbody>
          <tr><td><code>HS256</code></td><td>HMAC + SHA-256</td><td>Shared secret</td><td>Single-server apps, microservices with shared secret</td></tr>
          <tr><td><code>HS384 / HS512</code></td><td>HMAC + SHA-384/512</td><td>Shared secret</td><td>Higher-security symmetric signing</td></tr>
          <tr><td><code>RS256</code></td><td>RSA + SHA-256</td><td>RSA key pair</td><td>Auth0, AWS Cognito, enterprise SSO</td></tr>
          <tr><td><code>RS384 / RS512</code></td><td>RSA + SHA-384/512</td><td>RSA key pair</td><td>High-assurance enterprise systems</td></tr>
          <tr><td><code>ES256</code></td><td>ECDSA + SHA-256</td><td>EC key pair</td><td>Mobile apps, IoT — smaller token size</td></tr>
          <tr><td><code>PS256</code></td><td>RSASSA-PSS + SHA-256</td><td>RSA key pair</td><td>FAPI, open banking compliance</td></tr>
          <tr><td><code>none</code></td><td>Unsigned</td><td>None</td><td>Testing only — never in production</td></tr>
        </tbody>
      </table>
    </div>
  </article>
 
  <!-- ══ SECURITY ══ -->
  <article class="onpage-content">
    <h2>Is It Safe to Decode a JWT Online?</h2>
 
    <p>Security-conscious developers rightly ask this question before pasting anything into a third-party
    tool. Here is an honest answer.</p>
 
    <p><strong>This tool is 100% client-side.</strong> The JavaScript that decodes your token runs
    entirely inside your browser. No token data is transmitted to any server, stored in a database,
    or logged anywhere. You can verify this by opening your browser's Network tab — you will see zero
    outbound requests when you click Decode.</p>
 
    <p>That said, a few good practices apply regardless of which tool you use:</p>
 
    <p><strong>Use test tokens for inspection.</strong> If you are debugging in a shared environment
    (pair programming, screen share, public computer), use a test token rather than a production
    access token containing real user data.</p>
 
    <p><strong>Remember payloads are not secret.</strong> JWT payloads are only Base64url-encoded.
    Anyone who has the token string can read the claims. If your payload contains information you
    need to keep confidential, you need JWE (JSON Web Encryption), not a standard signed JWT.</p>
 
    <p><strong>Rotate compromised tokens immediately.</strong> If you accidentally expose a production
    JWT — in a log file, a GitHub commit, or a public paste — revoke it immediately from your
    auth provider and issue new tokens to affected users.</p>
 
    <div class="callout warn">
      <p><strong>Best Practice</strong>
      Never paste long-lived tokens (refresh tokens, API keys, personal access tokens) into any
      online tool. Decode only short-lived access tokens, and prefer using test credentials during development.</p>
    </div>
  </article>
  
  <!-- ══ FAQ ══ -->
  <section style="margin:2rem;"  >
    <h2>Frequently Asked Questions</h2>
 
    <div class="faq-item"  >
      <details>
        <summary class="faq-q">
          <span >What is the difference between a JWT decoder and jwt.io?</span>
          <span class="faq-chevron">›</span>
        </summary>
        <div class="faq-a" >
          <span >jwt.io is the official reference tool from Auth0. Our JWT decoder does the same
          core job — decode the header, payload, and signature — but with a VS-Code-style dark interface,
          instant expiry parsing, and an entirely client-side implementation. Both are reliable choices
          for inspecting tokens during development.</span>
        </div>
      </details>
    </div>
 
    <div class="faq-item"  >
      <details>
        <summary class="faq-q">
          <span >Can I decode a refresh token?</span>
          <span class="faq-chevron">›</span>
        </summary>
        <div class="faq-a" >
          <span >It depends on the auth provider. Some providers issue refresh tokens as
          opaque random strings (not JWTs), which cannot be decoded because they have no internal structure.
          Others, like Keycloak or certain Firebase configurations, issue refresh tokens as JWTs. If yours
          starts with eyJ, paste it in and it will decode. If it is a random string, it is opaque and
          not decodable by design.</span>
        </div>
      </details>
    </div>
 
    <div class="faq-item"  >
      <details>
        <summary class="faq-q">
          <span >How do I decode a JWT in Flutter or Dart?</span>
          <span class="faq-chevron">›</span>
        </summary>
        <div class="faq-a" >
          <span >Use the <code>dart_jsonwebtoken</code> package from pub.dev.
          Call <code>JWT.decode(token)</code> to read the payload without signature verification.
          For full verification with a secret or public key, use <code>JWT.verify(token, key)</code>.
          Alternatively, manually split by '.' and base64-decode the second segment using
          <code>base64Url.decode()</code> from Dart's convert library.</span>
        </div>
      </details>
    </div>
 
    <div class="faq-item"  >
      <details>
        <summary class="faq-q">
          <span >What does "decode JWT token online" actually do?</span>
          <span class="faq-chevron">›</span>
        </summary>
        <div class="faq-a" >
          <span >It splits the token by the dot separator, takes the first two parts
          (header and payload), applies Base64url decoding to each one, and then JSON.parses the
          resulting byte strings into readable objects. The third part (signature) is displayed
          as-is because it is a cryptographic hash, not JSON. The whole process takes under a millisecond
          and runs entirely in your browser.</span>
        </div>
      </details>
    </div>
 
    <div class="faq-item"  >
      <details>
        <summary class="faq-q">
          <span >Why does my token fail to decode?</span>
          <span class="faq-chevron">›</span>
        </summary>
        <div class="faq-a" >
          <span >The most common reasons are: (1) the token is an opaque token, not a JWT —
          it will not have the three-part dot structure; (2) you copied only part of the token — make sure
          you include all three segments; (3) there are trailing spaces or newline characters — the decoder
          trims input automatically but some environments wrap tokens in quotes; (4) it is a JWE encrypted
          token — the payload will be ciphertext, not JSON. Check the raw token starts with <code>eyJ</code>.</span>
        </div>
      </details>
    </div>
 
    <div class="faq-item"  >
      <details>
        <summary class="faq-q">
          <span >How do I decode a JWT access token from OAuth2 / OpenID Connect?</span>
          <span class="faq-chevron">›</span>
        </summary>
        <div class="faq-a" >
          <span >OAuth2 access tokens from providers like Google, Microsoft, Okta, and Auth0
          are standard JWTs. Copy the <code>access_token</code> value from the token response and paste it
          here. The decoded payload will typically include <code>iss</code> (issuer URL), <code>sub</code>
          (user ID), <code>aud</code> (client ID), <code>exp</code>, and provider-specific claims like
          email, roles, or scopes.</span>
        </div>
      </details>
    </div>
 
  </section>
 
  <!-- ══ CLOSING / ABOUT ══ -->
  <section  style="border-top:1px solid var(--border);padding-top:32px;">
    <p style="font-size:14px;color:var(--ink-3);font-family:var(--font-ui);">
      This free online JWT decoder is built for developers who need to quickly inspect tokens during
      development and debugging. It supports all standard JWT algorithms and processes everything
      locally in your browser. No account required, no usage limits, no data collection.
    </p>
  </section>
</div>

<script src="/assets/js/jwt-decoder.js"></script>