---
layout: main
title: "URL Decoder - Online URL Decoding Tool, Browser-Based & Private"
description: "Free online URL decoder. Decode URL-encoded strings, parse query parameters, and extract readable text from percent-encoded URLs. Batch conversion supported."
keywords: "url decoder, decode url, url decode, url decode online, percent encoding decoder, urldecode, decode uri component, url parser, query string decoder, online url decoder, decode url parameters, url unescape, url decoding tool, decode url string, url component decoder, http url decode, url decoder online free, decode encoded url, url decoder bulk, url decoder export"
category: utilities
---
<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/decode-a-url#webapp",
    "name": "URL Decoder - Online URL Decoding Tool",
    "url": "https://datafrog.tools/decode-a-url",
    "description": "A free, browser-based tool that decodes URL-encoded (percent-encoded) strings back to their original human-readable form. Supports decodeURI, decodeURIComponent, batch processing, and export results as CSV, TXT, or JSON with complete data privacy.",
    "applicationCategory": "DeveloperTool",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Privacy-first client-side processing (no data uploaded to servers)",
      "Dual decoding modes: decodeURI and decodeURIComponent",
      "Parses URL components: protocol, host, path, query parameters, and hash",
      "Batch decoding of multiple URLs line by line",
      "Export results as CSV, TXT, or JSON",
      "Handles non-UTF-8 encoded sequences gracefully",
      "Automatic detection of malformed or partially encoded strings",
      "Live inline preview with real-time updates",
      "Instant copy to clipboard or download results"
    ],
    "softwareRequirements": "A modern web browser",
    "softwareVersion": "1.0",
    "datePublished": "2025-11-21",
    "dateModified": "2025-11-21"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://datafrog.tools/decode-a-url#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this URL decoder really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, it is completely free with no premium tiers, signups, or hidden fees. Decode as many URLs as you need directly in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "What is URL encoding (percent-encoding)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "URL encoding, also known as percent-encoding, converts special characters in a URL into a format that can be safely transmitted over the internet. It replaces unsafe ASCII characters with a '%' followed by two hexadecimal digits (e.g., a space becomes '%20')."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between decodeURI and decodeURIComponent?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "decodeURI decodes a complete URL or URI but does not decode characters that are part of the URI syntax (like #, ?, &, /). decodeURIComponent decodes every percent-encoded character, including those used in query strings and hash fragments. Use decodeURI for full URLs and decodeURIComponent for query parameter values."
        }
      },
      {
        "@type": "Question",
        "name": "Does it handle query string parameters?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our tool parses the decoded URL and displays query parameters as a readable list of key-value pairs, making it easy to inspect and debug API endpoints and web requests."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data secure and private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All processing happens entirely within your browser; no URLs or data are sent to any server, making it safe for decoding sensitive API keys, tokens, or internal links."
        }
      },
      {
        "@type": "Question",
        "name": "Can I export the batch results?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! You can export batch results as CSV (for spreadsheets), TXT (for logs), or JSON (for APIs and scripts)."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://datafrog.tools/decode-a-url#howto",
    "name": "How to Decode a URL Online",
    "description": "Step-by-step guide to decode URL-encoded strings and parse query parameters using the free online URL decoder.",
    "tool": {
      "@type": "HowToTool",
      "name": "URL Decoder"
    },
    "supply": {
      "@type": "HowToSupply",
      "name": "Encoded URL or Query String"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter Your Encoded URL",
        "text": "Paste a URL-encoded string (e.g., https%3A%2F%2Fexample.com%2Fpath%3Fid%3D123) into the input field.",
        "url": "https://datafrog.tools/decode-a-url"
      },
      {
        "@type": "HowToStep",
        "name": "Choose Decoding Mode",
        "text": "Select either 'decodeURI' for full URLs or 'decodeURIComponent' for query strings and fragments.",
        "url": "https://datafrog.tools/decode-a-url"
      },
      {
        "@type": "HowToStep",
        "name": "View Instant Results",
        "text": "The decoded string appears instantly. The tool also parses the URL and displays its components: protocol, host, path, and query parameters.",
        "url": "https://datafrog.tools/decode-a-url"
      },
      {
        "@type": "HowToStep",
        "name": "Copy, Download, or Export",
        "text": "Copy the decoded URL to your clipboard, download the result as a .txt file, or export batch results as CSV, TXT, or JSON.",
        "url": "https://datafrog.tools/decode-a-url"
      }
    ],
    "totalTime": "PT1M"
  }
]
</script>

<style>
/* ====== All styles ====== */
.url-wrap{background:#1e1e1e;border-radius:10px;padding:20px;display:flex;flex-direction:column;gap:16px;min-height:100px}
.panel-card{background:#252526;border-radius:8px;border:1px solid #3c3c3c;overflow:hidden}
.panel-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#2d2d2d;border-bottom:1px solid #3c3c3c;flex-wrap:wrap;gap:8px}
.panel-title{font-size:13px;font-weight:500;color:#cccccc;letter-spacing:.3px}
.panel-sub{font-size:11px;color:#6a9955;margin-top:2px}
.btn-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.url-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:4px;font-size:12px;font-family:inherit;cursor:pointer;border:1px solid #555;background:#3a3a3a;color:#cccccc;transition:background .15s}
.url-btn:hover{background:#4a4a4a}
.url-btn.primary{background:#0e639c;border-color:#0e639c;color:#fff}
.url-btn.primary:hover{background:#1177bb}
.url-btn.green{background:#1e7a4a;border-color:#1e7a4a;color:#fff}
.url-btn.green:hover{background:#258a58}
.url-btn.amber{background:#8a6e1e;border-color:#8a6e1e;color:#fff}
.url-btn.amber:hover{background:#a07e23}
.url-btn.purple{background:#5b2d8e;border-color:#5b2d8e;color:#fff}
.url-btn.purple:hover{background:#6e38a8}
.url-btn:disabled{opacity:.4;cursor:not-allowed}

.url-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width:760px){.url-grid{grid-template-columns:1fr}}

.field-row{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.url-input{width:100%;background:#1b1b1b;color:#9cdcfe;font-family:var(--font-mono,'Fira Mono',monospace);font-size:13px;padding:10px 12px;border:1px solid #3c3c3c;border-radius:5px;outline:none;resize:vertical;min-height:60px}
.url-input::placeholder{color:#4a4a4a}
.url-input:focus{border-color:#0e639c}
.url-textarea{width:100%;background:#1b1b1b;color:#9cdcfe;font-family:var(--font-mono,'Fira Mono',monospace);font-size:13px;padding:10px 12px;border:1px solid #3c3c3c;border-radius:5px;outline:none;resize:vertical;min-height:80px}
.url-textarea::placeholder{color:#4a4a4a}
.url-textarea:focus{border-color:#0e639c}
.select-row{display:flex;gap:8px;flex-wrap:wrap}
.url-select{background:#1b1b1b;color:#cccccc;font-family:inherit;font-size:12px;padding:7px 10px;border:1px solid #3c3c3c;border-radius:5px;outline:none}

.result-box{padding:14px 16px;display:flex;flex-direction:column;gap:8px}
.result-line{display:flex;justify-content:space-between;align-items:center;gap:10px;background:#1b1b1b;border:1px solid #3c3c3c;border-radius:5px;padding:9px 12px}
.result-line-label{font-size:11px;color:#7a7a7a;min-width:78px}
.result-line-val{font-family:var(--font-mono,'Fira Mono',monospace);font-size:12.5px;color:#d4d4d4;word-break:break-all;flex:1}
.result-line-val.empty{color:#4a4a4a;font-style:italic}
.mini-copy{background:none;border:none;color:#6a9955;cursor:pointer;font-size:13px;padding:2px 4px;flex-shrink:0}
.mini-copy:hover{color:#9cdcfe}

.param-grid{margin-top:6px;display:flex;flex-direction:column;gap:4px}
.param-row{display:flex;gap:8px;background:#1b1b1b;padding:4px 10px;border-radius:4px;font-size:12px;font-family:var(--font-mono,'Fira Mono',monospace)}
.param-key{color:#fbbf24;font-weight:600;min-width:80px}
.param-val{color:#86efac;word-break:break-all}

.batch-ta{width:100%;min-height:140px;max-height:220px;background:#1b1b1b;color:#9cdcfe;font-family:var(--font-mono,'Fira Mono',monospace);font-size:12px;padding:12px;border:none;resize:vertical;outline:none;line-height:1.6}
.batch-ta::placeholder{color:#4a4a4a}
.batch-output{padding:0;max-height:260px;overflow-y:auto}
.batch-table{width:100%;border-collapse:collapse;font-family:var(--font-mono,'Fira Mono',monospace);font-size:12px}
.batch-table th{position:sticky;top:0;background:#2d2d2d;color:#7a7a7a;text-align:left;padding:8px 12px;font-weight:500;border-bottom:1px solid #3c3c3c}
.batch-table td{padding:7px 12px;color:#d4d4d4;border-bottom:1px solid #2a2a2a;word-break:break-all}
.batch-table td.err{color:#f97583}
.batch-empty{padding:24px;text-align:center;color:#4a4a4a;font-size:12px}

.batch-export-bar{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:#1b1b1b;border-top:1px solid #3c3c3c;flex-wrap:wrap;gap:8px}
.batch-export-label{font-size:10px;color:#7a7a7a;text-transform:uppercase;letter-spacing:.5px}

.toast{position:fixed;bottom:24px;right:24px;padding:10px 18px;border-radius:6px;font-size:12px;font-family:var(--font-mono,monospace);z-index:999;opacity:0;transform:translateY(8px);transition:opacity .25s,transform .25s;pointer-events:none;max-width:320px}
.toast.success{background:#1e293b;border:1px solid #2d7a4a;color:#6fcf97}
.toast.error{background:#1e293b;border:1px solid #8b3333;color:#f97583}
.toast.show{opacity:1;transform:translateY(0)}

.badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid var(--border);background:var(--surface-2);color:var(--ink-2)}
.badge.green{background:var(--green-light);border-color:#bbf7d0;color:var(--green)}
.badge.blue{background:var(--accent-light);border-color:#bfdbfe;color:var(--accent)}
.badge.amber{background:var(--amber-light);border-color:#fde68a;color:var(--amber)}

.section{margin-bottom:56px;margin-top:56px}
h2{font-size:clamp(20px,3vw,27px);font-weight:700;color:var(--ink);margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid var(--border);letter-spacing:-0.3px}
h3{font-size:18px;font-weight:700;color:var(--ink);margin:28px 0 8px}
p{margin-bottom:16px;color:var(--ink-2)}
p:last-child{margin-bottom:0}
strong{color:var(--ink);font-weight:700}
code{font-family:var(--font-code);font-size:13.5px;background:var(--surface-3);border:1px solid var(--border);border-radius:4px;padding:1px 6px;color:#be123c}

pre{background:#0f172a;color:#e2e8f0;border-radius:var(--radius);padding:20px 24px;overflow-x:auto;font-family:var(--font-code);font-size:13px;line-height:1.7;margin:16px 0 24px;border:1px solid #1e293b}
.code-lang{font-family:var(--font-ui);font-size:11px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.8px;font-weight:600;margin-bottom:6px}
.c-key{color:#7dd3fc}.c-str{color:#86efac}.c-cmt{color:#64748b;font-style:italic}
.c-kw{color:#f472b6}.c-fn{color:#fbbf24}.c-num{color:#fb923c}

.tbl-wrap{overflow-x:auto;margin:16px 0 24px}
table{width:100%;border-collapse:collapse;font-family:var(--font-ui);font-size:14px}
th{background:var(--surface-3);border:1px solid var(--border);padding:10px 14px;text-align:left;font-weight:600;color:var(--ink);white-space:nowrap}
td{border:1px solid var(--border);padding:9px 14px;color:var(--ink-2);vertical-align:top}
tr:nth-child(even) td{background:var(--surface-2)}

.callout{border-left:4px solid;padding:16px 20px;border-radius:0 var(--radius) var(--radius) 0;margin:20px 0}
.callout.info{border-color:var(--accent);background:var(--accent-light)}
.callout.warn{border-color:var(--amber);background:var(--amber-light)}
.callout.ok{border-color:var(--green);background:var(--green-light)}
.callout p{margin:0;font-size:15px}
.callout strong{display:block;margin-bottom:4px;font-family:var(--font-ui);font-size:12px;text-transform:uppercase;letter-spacing:.8px}
.callout.info strong{color:var(--accent)}.callout.warn strong{color:var(--amber)}.callout.ok strong{color:var(--green)}

.faq-item{border:1px solid var(--border);border-radius:var(--radius);margin-bottom:12px;overflow:hidden}
.faq-q{padding:16px 20px;font-family:var(--font-ui);font-weight:600;font-size:15px;color:var(--ink);background:var(--surface-2);cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none;list-style:none}
.faq-q::-webkit-details-marker{display:none}
details[open] .faq-q{border-bottom:1px solid var(--border);background:var(--surface)}
.faq-a{padding:16px 20px;font-size:15px;color:var(--ink-2);line-height:1.7}
.faq-chevron{font-size:18px;color:var(--ink-3);transition:transform .2s}
details[open] .faq-chevron{transform:rotate(90deg)}

.hero{padding:56px 0 40px;border-bottom:1px solid var(--border);margin-bottom:48px}
.hero-eyebrow{font-family:var(--font-ui);font-size:12px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--accent);margin-bottom:12px}
.hero-lead{font-size:19px;color:var(--ink-2);max-width:640px;margin-bottom:28px}
.hero-badges{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;font-family:var(--font-ui)}

@media (max-width:600px){h1{font-size:26px}.hero{padding:32px 0 28px}.url-grid{grid-template-columns:1fr}}
</style>

<!-- ================================================================
  HERO — WebApplication metadata
================================================================ -->
<div id="url-decoder-hero" class="home-hero">

  <h1 >URL Decoder — Decode URLs and Query Parameters Instantly</h1>

  <p>
    Decode percent-encoded URLs back to human-readable text. Works as a URL decoder,
    query string parser, and <code>decodeURI</code>/<code>decodeURIComponent</code> utility.
    Batch decode multiple URLs — all in your browser, no uploads required.
  </p>

  <div class="hero-badges">
    <span class="badge green">✓ 100% Client-Side</span>
    <span class="badge blue">✓ decodeURI &amp; decodeURIComponent</span>
    <span class="badge amber">✓ Parses Query Parameters</span>
    <span class="badge">✓ Batch Decode</span>
    <span class="badge">✓ Export CSV / TXT / JSON</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<section id="url-decoder-tool" aria-label="URL Decoder Tool" style="display:flex;justify-content:center" >
<div style="width:98%;">

<div class="url-wrap">

  <!-- ====== GRID: Decode + Encode Panels ====== -->
  <div class="url-grid">

    <!-- ===== PANEL 1: DECODE ===== -->
    <div class="panel-card">
      <div class="panel-header">
        <div>
          <div class="panel-title"><i class="ti ti-arrow-right" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#e2c08d"></i>URL Decoder</div>
          <div class="panel-sub">Paste an encoded URL to decode it</div>
        </div>
      </div>
      <div class="field-row">
        <textarea id="decode-input" class="url-textarea" placeholder="e.g. https%3A%2F%2Fexample.com%2Fpath%3Fid%3D123%26name%3DJohn%20Doe" spellcheck="false"></textarea>
        <div class="select-row">
          <select id="decode-mode" class="url-select">
            <option value="decodeURI">decodeURI (full URL)</option>
            <option value="decodeURIComponent">decodeURIComponent (query / hash)</option>
          </select>
          <button class="url-btn primary" id="btn-decode"><i class="ti ti-bolt" aria-hidden="true"></i> Decode</button>
        </div>
      </div>
      <div class="result-box">
        <div class="result-line">
          <span class="result-line-label">Decoded</span>
          <span class="result-line-val empty" id="out-decoded">—</span>
          <button class="mini-copy" data-copy="out-decoded"><i class="ti ti-copy" aria-hidden="true"></i></button>
        </div>
        <div style="margin-top:6px;font-size:11px;color:#7a7a7a;font-weight:500;">URL Components</div>
        <div id="url-components">
          <div class="result-line" style="background:#161616;">
            <span class="result-line-label">Protocol</span>
            <span class="result-line-val empty" id="out-proto">—</span>
          </div>
          <div class="result-line" style="background:#161616;">
            <span class="result-line-label">Host</span>
            <span class="result-line-val empty" id="out-host">—</span>
          </div>
          <div class="result-line" style="background:#161616;">
            <span class="result-line-label">Path</span>
            <span class="result-line-val empty" id="out-path">—</span>
          </div>
          <div class="result-line" style="background:#161616;">
            <span class="result-line-label">Query Params</span>
            <span class="result-line-val empty" id="out-params" style="font-size:11px;">—</span>
          </div>
        </div>
        <div id="param-list" style="margin-top:4px;"></div>
      </div>
    </div>

    <!-- ===== PANEL 2: ENCODE (bonus) ===== -->
    <div class="panel-card">
      <div class="panel-header">
        <div>
          <div class="panel-title"><i class="ti ti-arrow-left" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i>URL Encoder</div>
          <div class="panel-sub">Encode plain text or a URL for transmission</div>
        </div>
      </div>
      <div class="field-row">
        <textarea id="encode-input" class="url-textarea" placeholder="e.g. https://example.com/path?id=123&name=John Doe" spellcheck="false"></textarea>
        <div class="select-row">
          <select id="encode-mode" class="url-select">
            <option value="encodeURI">encodeURI (full URL)</option>
            <option value="encodeURIComponent">encodeURIComponent (query / hash)</option>
          </select>
          <button class="url-btn primary" id="btn-encode"><i class="ti ti-bolt" aria-hidden="true"></i> Encode</button>
        </div>
      </div>
      <div class="result-box">
        <div class="result-line">
          <span class="result-line-label">Encoded</span>
          <span class="result-line-val empty" id="out-encoded">—</span>
          <button class="mini-copy" data-copy="out-encoded"><i class="ti ti-copy" aria-hidden="true"></i></button>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== BATCH PANEL ===== -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-list" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#b392f0"></i>Batch Decode / Encode</div>
        <div class="panel-sub">One URL per line — decode or encode them all at once</div>
      </div>
      <div class="btn-row">
        <select id="batch-mode" class="url-select">
          <option value="decode">Decode</option>
          <option value="encode">Encode</option>
        </select>
        <button class="url-btn" id="btn-batch-clear">Clear</button>
        <button class="url-btn primary" id="btn-batch-run"><i class="ti ti-bolt" aria-hidden="true"></i> Convert All</button>
      </div>
    </div>
    <textarea id="batch-in" class="batch-ta" placeholder="https%3A%2F%2Fexample.com%2Fpath%3Fid%3D123&#10;https%3A%2F%2Ftest.com%2Fpage%3Fname%3DJohn%2520Doe" spellcheck="false"></textarea>
    <div class="batch-output" id="batch-output">
      <div class="batch-empty">Results will appear here as a table</div>
    </div>
    <!-- EXPORT BAR -->
    <div class="batch-export-bar">
      <span class="batch-export-label"><i class="ti ti-download" aria-hidden="true"></i> Export Results</span>
      <div class="btn-row">
        <button class="url-btn green" id="btn-export-csv"><i class="ti ti-file-spreadsheet" aria-hidden="true"></i> CSV</button>
        <button class="url-btn amber" id="btn-export-txt"><i class="ti ti-file-text" aria-hidden="true"></i> TXT</button>
        <button class="url-btn purple" id="btn-export-json"><i class="ti ti-file-code" aria-hidden="true"></i> JSON</button>
      </div>
    </div>
  </div>

</div>

<div class="toast" id="toast" role="alert" aria-live="assertive"></div>

<!-- ================================================================
  CONTENT BLOCKS
================================================================ -->
<article class="onpage-content">
 <div class="blog-post-meta">
     <a href="saeed-ahmed" style="display:flex; gap: 10px;" class="link">
      <img src="assets/img/saeed-ahmed.jpg" alt="Saeed Ahmed" class="author-img">
      <span class="author-name">Saeed Ahmed</span>
      </a>
      <span class="post-date">jan 10, 2026</span>
  </div>
  <section id="why-decode-url">
    <h2 style="margin-top:30px;">Why decode URL-encoded strings?</h2>
    <ul style="padding-left:20px;">
      <li>Debug web requests by reading encoded query parameters and URL fragments</li>
      <li>Extract readable text from encoded API responses, redirect URLs, and webhooks</li>
      <li>Inspect email tracking links and marketing campaign URLs</li>
      <li>Quickly validate and parse query strings during web development</li>
      <li>Decode encoded file paths and resource identifiers in logs</li>
    </ul>
  </section>

  <section id="how-it-works">
    <h2 style="margin-top:30px;">How to decode a URL – 3 simple steps</h2>
    <ol style="padding-left:20px;">
      <li><strong>Paste your encoded URL</strong> – paste a percent-encoded string (e.g., <code>https%3A%2F%2Fexample.com%2Fpath</code>) into the input field.</li>
      <li><strong>Choose your decoding mode</strong> – select <code>decodeURI</code> for full URLs or <code>decodeURIComponent</code> for query strings and hash fragments.</li>
      <li><strong>Get instant results</strong> – the decoded text appears instantly, along with a parsed breakdown of protocol, host, path, and query parameters.</li>
    </ul>
  </section>

  <section id="key-features">
    <h2 style="margin-top:30px;">URL decoder &amp; encoder – features you’ll love</h2>
    <ul style="padding-left:20px;">
      <li>✅ <strong>100% browser‑based</strong> – your URLs never leave your device, ensuring complete privacy</li>
      <li>✅ <strong>Two decoding modes</strong> – <code>decodeURI</code> for full URLs, <code>decodeURIComponent</code> for query strings and fragments</li>
      <li>✅ <strong>Dual‑direction</strong> – decode URLs <em>or</em> encode plain text in one tool</li>
      <li>✅ <strong>URL parser</strong> – automatically extracts protocol, host, path, and query parameters from decoded URLs</li>
      <li>✅ <strong>Readable query params</strong> – query strings are displayed as a clean key‑value list</li>
      <li>✅ <strong>Batch processing</strong> – decode or encode multiple URLs line by line</li>
      <li>✅ <strong>Export results</strong> – download batch results as CSV, TXT, or JSON for further analysis</li>
      <li>✅ <strong>Copy &amp; download</strong> – copy to clipboard or download single results as .txt</li>
      <li>✅ <strong>Works offline</strong> after first load – no internet connection required</li>
    </ul>
  </section>

  <section id="what-makes-different">
    <h2 style="margin-top:30px;">Why DataFrog’s URL decoder stands out</h2>
    <ul style="padding-left:20px;">
      <li><strong>Privacy first</strong> – your URLs are never uploaded to our servers. Many online decoders log your data – we don’t.</li>
      <li><strong>Production‑ready accuracy</strong> – handles malformed or partially encoded strings gracefully without crashing.</li>
      <li><strong>Handles real‑world inputs</strong> – correctly decodes UTF-8, ASCII, and extended character sets.</li>
      <li><strong>Export capabilities</strong> – save your batch results as CSV, TXT, or JSON for documentation or further processing.</li>
      <li><strong>No signup, no watermarks</strong> – completely free for all your URL decoding needs.</li>
    </ul>
  </section>

  <section id="supported-inputs">
    <h2 style="margin-top:30px;">Supported URL formats</h2>
    <ul style="padding-left:20px;">
      <li>Percent-encoded URLs (e.g., <code>https%3A%2F%2Fexample.com</code>)</li>
      <li>Encoded query strings (e.g., <code>id%3D123%26name%3DJohn</code>)</li>
      <li>URL fragments (e.g., <code>%23section-1</code>)</li>
      <li>Partial or malformed encoded strings</li>
      <li>UTF-8 and extended character encodings (<code>%C3%A9</code> for é)</li>
      <li>Full URLs with protocol, host, path, query, and hash</li>
    </ul>
  </section>

  <section id="use-cases">
    <h2 style="margin-top:30px;">Common use cases for URL decoding</h2>
    <ul style="padding-left:20px;">
      <li>📄 Web request debugging – decode query parameters from API URLs and redirects</li>
      <li>🔗 Email link analysis – inspect tracking and marketing campaign URLs</li>
      <li>🛠️ API development – decode encoded parameters sent to your endpoints</li>
      <li>📊 Data extraction – extract readable text from encoded log files</li>
      <li>🧩 Web scraping – decode URLs embedded in HTML and JavaScript</li>
    </ul>
  </section>

  <section id="privacy-security">
    <h2 style="margin-top:30px;">Privacy &amp; Security</h2>
    <ul style="padding-left:20px;">
      <li>🔒 All processing happens locally in your browser using native JavaScript</li>
      <li>🚫 No data transmission – your URLs never touch our network</li>
      <li>🕵️ No tracking, no cookies, no third‑party analytics scripts</li>
      <li>💼 Safe for decoding sensitive API keys, tokens, and internal URLs</li>
    </ul>
  </section>

  <section id="faq">
    <h2 style="margin-top:30px;">Frequently asked questions (URL Decoder)</h2>

    <h3 id="faq-1">Is this URL decoder really free?</h3>
    <p>Yes, completely free. No premium tiers, no hidden fees, no watermarks. Decode as many URLs as you need, entirely within your browser.</p>

    <h3 id="faq-2">What is URL encoding (percent-encoding)?</h3>
    <p>URL encoding, also known as percent-encoding, converts special characters in a URL into a format that can be safely transmitted over the internet. It replaces unsafe ASCII characters with a <code>%</code> followed by two hexadecimal digits. For example, a space becomes <code>%20</code> and <code>?</code> becomes <code>%3F</code>.</p>

    <h3 id="faq-3">What's the difference between decodeURI and decodeURIComponent?</h3>
    <p><code>decodeURI</code> decodes a complete URL but does not decode characters that are part of the URI syntax (like <code>#</code>, <code>?</code>, <code>&amp;</code>, <code>/</code>). <code>decodeURIComponent</code> decodes every percent-encoded character, including those used in query strings and hash fragments. Use <code>decodeURI</code> for full URLs and <code>decodeURIComponent</code> for query parameter values.</p>

    <h3 id="faq-4">Does it handle query string parameters?</h3>
    <p>Yes. After decoding, the tool parses the URL and displays query parameters as a readable list of key-value pairs, making it easy to inspect API endpoints and web requests.</p>

    <h3 id="faq-5">Can I encode a URL as well?</h3>
    <p>Yes! The right panel lets you encode plain text using either <code>encodeURI</code> or <code>encodeURIComponent</code>, making this a complete URL utility tool.</p>

    <h3 id="faq-6">Is my data uploaded to a server?</h3>
    <p><strong>No.</strong> The decoder runs entirely in your browser. Your input never leaves your computer – even if you paste thousands of URLs, everything stays local.</p>

    <h3 id="faq-7">Does it support batch decoding?</h3>
    <p>Yes. Paste multiple URLs (one per line) into the batch textarea and click "Convert All" to decode or encode them all at once in a clean table view.</p>

    <h3 id="faq-8">What about non‑UTF‑8 characters?</h3>
    <p>The tool uses JavaScript's native <code>decodeURI</code>/<code>decodeURIComponent</code> functions, which handle UTF-8 encoding correctly. Extended characters like <code>%C3%A9</code> (é) are decoded accurately.</p>

    <h3 id="faq-9">How do I export batch results?</h3>
    <p>After running a batch conversion, click the <strong>CSV</strong>, <strong>TXT</strong>, or <strong>JSON</strong> button in the export bar below the results table. The file will download automatically to your device.</p>
  </section>

</article>

</div>
</section>
<!-- ================================================================
  JAVASCRIPT — URL Decode / Encode / Export Logic
================================================================ -->
<script>
(function(){
  function showToast(msg, type){
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + type + ' show';
    setTimeout(function(){ t.className = 'toast ' + type; }, 1800);
  }

  function copyText(text){
    if(!text || text === '—') return;
    navigator.clipboard.writeText(text).then(function(){
      showToast('Copied to clipboard', 'success');
    }).catch(function(){ showToast('Copy failed', 'error'); });
  }

  function setResult(id, value){
    var el = document.getElementById(id);
    el.textContent = value;
    el.classList.toggle('empty', !value);
  }

  function parseURL(url){
    try {
      // Try to decode fully first if it has encoded characters
      var decoded = url;
      if (/%[0-9A-F]{2}/i.test(url)) {
        try { decoded = decodeURIComponent(url); } catch(e) {}
      }
      
      var a = document.createElement('a');
      a.href = decoded;
      if (a.protocol && a.protocol !== ':') {
        return a;
      }
    } catch(e) {}
    
    // Fallback: try original URL
    try {
      var a2 = document.createElement('a');
      a2.href = url;
      if (a2.protocol && a2.protocol !== ':') {
        return a2;
      }
    } catch(e) {}
    return null;
  }

  function renderQueryParams(query){
    var container = document.getElementById('param-list');
    if (!query) {
      container.innerHTML = '';
      return;
    }
    var params = new URLSearchParams(query);
    if ([...params].length === 0) {
      container.innerHTML = '';
      return;
    }
    var html = '<div class="param-grid">';
    for (var [key, val] of params){
      html += '<div class="param-row"><span class="param-key">' + key + '</span><span class="param-val">' + val + '</span></div>';
    }
    html += '</div>';
    container.innerHTML = html;
  }

  // ===== DECODE =====
  document.getElementById('btn-decode').addEventListener('click', function(){
    var raw = document.getElementById('decode-input').value.trim();
    if (!raw) { showToast('Enter a URL or encoded string', 'error'); return; }
    var mode = document.getElementById('decode-mode').value;
    var decoded;
    try {
      decoded = mode === 'decodeURI' ? decodeURI(raw) : decodeURIComponent(raw);
    } catch(e) {
      showToast('Invalid percent-encoding: ' + e.message, 'error');
      return;
    }
    setResult('out-decoded', decoded);

    // Parse components
    var parsed = parseURL(decoded);
    if (parsed && parsed.protocol && parsed.protocol !== ':'){
      setResult('out-proto', parsed.protocol);
      setResult('out-host', parsed.hostname || parsed.host);
      setResult('out-path', parsed.pathname || '/');
      var query = parsed.search ? parsed.search.substring(1) : '';
      setResult('out-params', query || 'none');
      renderQueryParams(query);
    } else {
      setResult('out-proto', '—');
      setResult('out-host', '—');
      setResult('out-path', '—');
      setResult('out-params', '—');
      document.getElementById('param-list').innerHTML = '';
    }
  });

  // ===== ENCODE =====
  document.getElementById('btn-encode').addEventListener('click', function(){
    var raw = document.getElementById('encode-input').value.trim();
    if (!raw) { showToast('Enter text to encode', 'error'); return; }
    var mode = document.getElementById('encode-mode').value;
    var encoded;
    try {
      encoded = mode === 'encodeURI' ? encodeURI(raw) : encodeURIComponent(raw);
    } catch(e) {
      showToast('Encoding failed: ' + e.message, 'error');
      return;
    }
    setResult('out-encoded', encoded);
  });

  // ===== COPY BUTTONS =====
  document.querySelectorAll('.mini-copy').forEach(function(btn){
    btn.addEventListener('click', function(){
      var el = document.getElementById(btn.dataset.copy);
      if (el) copyText(el.textContent);
    });
  });

  // ===== BATCH =====
  function batchProcessLine(line, mode){
    line = line.trim();
    if (!line) return null;
    try {
      var result;
      if (mode === 'decode'){
        // Check if the string contains URI characters that should be decoded
        var hasFullyEncoded = /%3[AF]|%3F|%23|%26|%3D/.test(line);
        
        if (hasFullyEncoded) {
          result = decodeURIComponent(line);
        } else {
          try {
            result = decodeURI(line);
            if (result === line && !line.includes('%20')) {
              result = decodeURIComponent(line);
            }
          } catch(e) {
            result = decodeURIComponent(line);
          }
        }
        return { input: line, output: result, status: 'decoded' };
      } else {
        if (/%[0-9A-F]{2}/i.test(line)) {
          return { input: line, output: 'Already encoded', status: 'skipped' };
        }
        try { result = encodeURI(line); }
        catch(e) { result = encodeURIComponent(line); }
        return { input: line, output: result, status: 'encoded' };
      }
    } catch(e) {
      return { input: line, output: 'Error: ' + e.message, status: 'error' };
    }
  }

  document.getElementById('btn-batch-run').addEventListener('click', function(){
    var lines = document.getElementById('batch-in').value.split('\n');
    var mode = document.getElementById('batch-mode').value;
    var rows = lines.map(function(l){ return batchProcessLine(l, mode); }).filter(Boolean);
    var out = document.getElementById('batch-output');
    if (!rows.length){ out.innerHTML = '<div class="batch-empty">Results will appear here as a table</div>'; return; }
    var html = '<table class="batch-table"><thead><tr><th>Input</th><th>Result</th><th>Status</th></tr></thead><tbody>';
    rows.forEach(function(r){
      var cls = r.status === 'error' ? 'err' : '';
      html += '<tr><td>' + r.input + '</td><td class="' + cls + '">' + r.output + '</td><td>' + r.status + '</td></tr>';
    });
    html += '</tbody></table>';
    out.innerHTML = html;
  });

  document.getElementById('btn-batch-clear').addEventListener('click', function(){
    document.getElementById('batch-in').value = '';
    document.getElementById('batch-output').innerHTML = '<div class="batch-empty">Results will appear here as a table</div>';
  });

  // ===== EXPORT FUNCTIONS =====

  function getResultsData() {
    var rows = document.querySelectorAll('#batch-output .batch-table tbody tr');
    var data = [];
    rows.forEach(function(row) {
      var cells = row.querySelectorAll('td');
      if (cells.length === 3) {
        data.push({
          input: cells[0].textContent,
          result: cells[1].textContent,
          status: cells[2].textContent
        });
      }
    });
    return data;
  }

  document.getElementById('btn-export-csv').addEventListener('click', function() {
    var data = getResultsData();
    if (!data.length) {
      showToast('No results to export', 'error');
      return;
    }
    
    var csv = 'Input,Result,Status\n';
    data.forEach(function(item) {
      csv += '"' + item.input.replace(/"/g, '""') + '","' + 
             item.result.replace(/"/g, '""') + '","' + 
             item.status + '"\n';
    });
    
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'url-decoder-results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('CSV exported successfully!', 'success');
  });

  document.getElementById('btn-export-txt').addEventListener('click', function() {
    var data = getResultsData();
    if (!data.length) {
      showToast('No results to export', 'error');
      return;
    }
    
    var text = 'URL Decoder Results\n';
    text += '='.repeat(50) + '\n\n';
    text += 'Exported: ' + new Date().toLocaleString() + '\n\n';
    data.forEach(function(item, index) {
      text += '[' + (index + 1) + ']\n';
      text += 'Input:  ' + item.input + '\n';
      text += 'Result: ' + item.result + '\n';
      text += 'Status: ' + item.status + '\n\n';
    });
    
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'url-decoder-results.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('TXT exported successfully!', 'success');
  });

  document.getElementById('btn-export-json').addEventListener('click', function() {
    var data = getResultsData();
    if (!data.length) {
      showToast('No results to export', 'error');
      return;
    }
    
    var json = JSON.stringify({
      exported: new Date().toISOString(),
      tool: 'URL Decoder',
      count: data.length,
      results: data
    }, null, 2);
    
    var blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'url-decoder-results.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('JSON exported successfully!', 'success');
  });

})();
</script>
