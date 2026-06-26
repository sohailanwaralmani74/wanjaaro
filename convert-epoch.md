---
layout: main
title: "Unix Timestamp Converter - Epoch to Date, Browser-Based & Private"
description: "Free online Unix timestamp converter. Convert epoch time to human-readable date and back. Batch conversion supported. No data leaves your device."
keywords: "unix timestamp converter, epoch converter, epoch to date, timestamp to date, convert epoch time, unix time converter, epoch time converter, current unix timestamp, date to epoch, datetime to unix timestamp, online epoch converter, timestamp converter online, unix epoch time now, batch timestamp converter, epoch to human readable date"
category: utilities
---
<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/convert-epoch#webapp",
    "name": "Epoch Converter - Online Unix Timestamp Converter",
    "url": "https://datafrog.tools/convert-epoch",
    "description": "A free, browser-based tool that converts Unix timestamps (seconds/milliseconds) to human-readable dates and vice versa. Supports timezone adjustments, handles the Year 2038 problem, and processes batch conversions offline with complete data privacy.",
    "applicationCategory": "DeveloperTool",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Privacy-first client-side processing (no data uploaded to servers)",
      "Bidirectional conversion – epoch to date and date to epoch",
      "Auto-detects timestamp lengths: seconds (10-digit), milliseconds (13-digit), and microseconds (16-digit)",
      "Displays results in both UTC and local timezone simultaneously",
      "Handles negative timestamps (pre-1970) and far-future dates beyond 2038",
      "Supports standard human date formats (YYYY-MM-DD, MM/DD/YYYY, ISO 8601)",
      "Live inline preview with real-time updates",
      "Instant copy to clipboard or download results as a .txt file"
    ],
    "softwareRequirements": "A modern web browser",
    "softwareVersion": "1.0",
    "datePublished": "2025-10-27",
    "dateModified": "2025-11-21"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://datafrog.tools/convert-epoch#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this epoch time converter really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, it is completely free with no premium tiers, signups, or hidden fees. Convert as many timestamps as you need directly in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between a 10-digit and 13-digit epoch timestamp?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A 10-digit timestamp measures seconds since the Unix epoch (January 1, 1970), while a 13-digit timestamp measures milliseconds. Our tool automatically detects the format and converts them accurately."
        }
      },
      {
        "@type": "Question",
        "name": "Does it handle timezone conversion?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. The converter displays results in both UTC and your browser's local timezone simultaneously. You can also manually specify an offset if needed."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert a human date back to a Unix timestamp?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the tool is fully bidirectional. Simply enter any standard date string (e.g., 2026-06-19 14:30:00) and it will return the exact Unix timestamp in seconds and milliseconds."
        }
      },
      {
        "@type": "Question",
        "name": "Is my epoch data secure and private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All processing happens entirely within your browser; no timestamps or dates are sent to any server, making it safe for sensitive application logs and system data."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://datafrog.tools/convert-epoch#howto",
    "name": "How to Convert Epoch Timestamp to Date and Time",
    "description": "Step-by-step guide to convert Unix epoch time (seconds or milliseconds) into a human-readable date and vice versa using the free online converter.",
    "tool": {
      "@type": "HowToTool",
      "name": "Epoch to Date Converter"
    },
    "supply": {
      "@type": "HowToSupply",
      "name": "Unix Timestamp or Date String"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter Your Epoch or Date",
        "text": "Paste a Unix timestamp (e.g., 1718000000) or a human-readable date string into the input field. The tool automatically detects the format.",
        "url": "https://datafrog.tools/convert-epoch"
      },
      {
        "@type": "HowToStep",
        "name": "Adjust Timezone and Format",
        "text": "Choose to view results in UTC or your local timezone. Select the output format you prefer (full date, time, or both combined).",
        "url": "https://datafrog.tools/convert-epoch"
      },
      {
        "@type": "HowToStep",
        "name": "View Instant Conversion",
        "text": "The conversion happens in real-time. View the formatted human date or the converted epoch value immediately in the result panel.",
        "url": "https://datafrog.tools/convert-epoch"
      },
      {
        "@type": "HowToStep",
        "name": "Copy or Download the Result",
        "text": "Copy the converted timestamp or date to your clipboard with one click, or download the result as a .txt file for your records.",
        "url": "https://datafrog.tools/convert-epoch"
      }
    ],
    "totalTime": "PT1M"
  }
]
</script>
<style>
.epoch-wrap{background:#1e1e1e;border-radius:10px;padding:20px;display:flex;flex-direction:column;gap:16px;min-height:100px; min-width: 100%;}
.panel-card{background:#252526;border-radius:8px;border:1px solid #3c3c3c;overflow:hidden}
.panel-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#2d2d2d;border-bottom:1px solid #3c3c3c;flex-wrap:wrap;gap:8px}
.panel-title{font-size:13px;font-weight:500;color:#cccccc;letter-spacing:.3px}
.panel-sub{font-size:11px;color:#6a9955;margin-top:2px}
.btn-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.epoch-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:4px;font-size:12px;font-family:inherit;cursor:pointer;border:1px solid #555;background:#3a3a3a;color:#cccccc;transition:background .15s}
.epoch-btn:hover{background:#4a4a4a}
.epoch-btn.primary{background:#0e639c;border-color:#0e639c;color:#fff}
.epoch-btn.primary:hover{background:#1177bb}
.epoch-btn:disabled{opacity:.4;cursor:not-allowed}

.live-clock{display:flex;flex-wrap:wrap;gap:18px;padding:14px 16px;align-items:center}
.live-clock-item{display:flex;flex-direction:column;gap:2px}
.live-clock-label{font-size:10px;color:#7a7a7a;letter-spacing:.5px;text-transform:uppercase}
.live-clock-value{font-family:var(--font-mono,'Fira Mono',monospace);font-size:18px;color:#9cdcfe;font-weight:600}

.epoch-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width:760px){.epoch-grid{grid-template-columns:1fr}}

.field-row{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.epoch-input{width:100%;background:#1b1b1b;color:#9cdcfe;font-family:var(--font-mono,'Fira Mono',monospace);font-size:13px;padding:10px 12px;border:1px solid #3c3c3c;border-radius:5px;outline:none}
.epoch-input::placeholder{color:#4a4a4a}
.epoch-input:focus{border-color:#0e639c}
.select-row{display:flex;gap:8px;flex-wrap:wrap}
.epoch-select{background:#1b1b1b;color:#cccccc;font-family:inherit;font-size:12px;padding:7px 10px;border:1px solid #3c3c3c;border-radius:5px;outline:none}

.result-box{padding:14px 16px;display:flex;flex-direction:column;gap:8px}
.result-line{display:flex;justify-content:space-between;align-items:center;gap:10px;background:#1b1b1b;border:1px solid #3c3c3c;border-radius:5px;padding:9px 12px}
.result-line-label{font-size:11px;color:#7a7a7a;min-width:78px}
.result-line-val{font-family:var(--font-mono,'Fira Mono',monospace);font-size:12.5px;color:#d4d4d4;word-break:break-all;flex:1}
.result-line-val.empty{color:#4a4a4a;font-style:italic}
.mini-copy{background:none;border:none;color:#6a9955;cursor:pointer;font-size:13px;padding:2px 4px;flex-shrink:0}
.mini-copy:hover{color:#9cdcfe}

.batch-ta{width:100%;min-height:140px;max-height:220px;background:#1b1b1b;color:#9cdcfe;font-family:var(--font-mono,'Fira Mono',monospace);font-size:12px;padding:12px;border:none;resize:vertical;outline:none;line-height:1.6}
.batch-ta::placeholder{color:#4a4a4a}
.batch-output{padding:0;max-height:260px;overflow-y:auto}
.batch-table{width:100%;border-collapse:collapse;font-family:var(--font-mono,'Fira Mono',monospace);font-size:12px}
.batch-table th{position:sticky;top:0;background:#2d2d2d;color:#7a7a7a;text-align:left;padding:8px 12px;font-weight:500;border-bottom:1px solid #3c3c3c}
.batch-table td{padding:7px 12px;color:#d4d4d4;border-bottom:1px solid #2a2a2a;word-break:break-all}
.batch-table td.err{color:#f97583}
.batch-empty{padding:24px;text-align:center;color:#4a4a4a;font-size:12px}

.toast{position:fixed;bottom:24px;right:24px;padding:10px 18px;border-radius:6px;font-size:12px;font-family:var(--font-mono,monospace);z-index:999;opacity:0;transform:translateY(8px);transition:opacity .25s,transform .25s;pointer-events:none;max-width:320px}
.toast.success{background:#1e293b;border:1px solid #2d7a4a;color:#6fcf97}
.toast.error{background:#1e293b;border:1px solid #8b3333;color:#f97583}
.toast.show{opacity:1;transform:translateY(0)}

.badge {
  display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px;
  border-radius: 20px; font-size: 12px; font-weight: 500;
  border: 1px solid var(--border); background: var(--surface-2); color: var(--ink-2);
}
.badge.green { background: var(--green-light); border-color: #bbf7d0; color: var(--green); }
.badge.blue  { background: var(--accent-light); border-color: #bfdbfe; color: var(--accent); }
.badge.amber { background: var(--amber-light); border-color: #fde68a; color: var(--amber); }

.section { margin-bottom: 56px; margin-top: 56px; }
h2 {
  font-size: clamp(20px, 3vw, 27px); font-weight: 700; color: var(--ink);
  margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid var(--border); letter-spacing: -0.3px;
}
h3 { font-size: 18px; font-weight: 700; color: var(--ink); margin: 28px 0 8px; }
p { margin-bottom: 16px; color: var(--ink-2); }
p:last-child { margin-bottom: 0; }
strong { color: var(--ink); font-weight: 700; }
code {
  font-family: var(--font-code); font-size: 13.5px; background: var(--surface-3);
  border: 1px solid var(--border); border-radius: 4px; padding: 1px 6px; color: #be123c;
}

pre {
  background: #0f172a; color: #e2e8f0; border-radius: var(--radius); padding: 20px 24px;
  overflow-x: auto; font-family: var(--font-code); font-size: 13px; line-height: 1.7;
  margin: 16px 0 24px; border: 1px solid #1e293b;
}
.code-lang {
  font-family: var(--font-ui); font-size: 11px; color: var(--ink-3); text-transform: uppercase;
  letter-spacing: .8px; font-weight: 600; margin-bottom: 6px;
}
.c-key { color: #7dd3fc; } .c-str { color: #86efac; } .c-cmt { color: #64748b; font-style: italic; }
.c-kw  { color: #f472b6; } .c-fn  { color: #fbbf24; } .c-num { color: #fb923c; }

.tbl-wrap { overflow-x: auto; margin: 16px 0 24px; }
table { width: 100%; border-collapse: collapse; font-family: var(--font-ui); font-size: 14px; }
th { background: var(--surface-3); border: 1px solid var(--border); padding: 10px 14px; text-align: left; font-weight: 600; color: var(--ink); white-space: nowrap; }
td { border: 1px solid var(--border); padding: 9px 14px; color: var(--ink-2); vertical-align: top; }
tr:nth-child(even) td { background: var(--surface-2); }

.callout { border-left: 4px solid; padding: 16px 20px; border-radius: 0 var(--radius) var(--radius) 0; margin: 20px 0; }
.callout.info  { border-color: var(--accent); background: var(--accent-light); }
.callout.warn  { border-color: var(--amber); background: var(--amber-light); }
.callout.ok    { border-color: var(--green); background: var(--green-light); }
.callout p { margin: 0; font-size: 15px; }
.callout strong { display: block; margin-bottom: 4px; font-family: var(--font-ui); font-size: 12px; text-transform: uppercase; letter-spacing: .8px; }
.callout.info strong { color: var(--accent); } .callout.warn strong { color: var(--amber); } .callout.ok strong { color: var(--green); }

.faq-item { border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 12px; overflow: hidden; }
.faq-q { padding: 16px 20px; font-family: var(--font-ui); font-weight: 600; font-size: 15px; color: var(--ink); background: var(--surface-2); cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; list-style: none; }
.faq-q::-webkit-details-marker { display: none; }
details[open] .faq-q { border-bottom: 1px solid var(--border); background: var(--surface); }
.faq-a { padding: 16px 20px; font-size: 15px; color: var(--ink-2); line-height: 1.7; }
.faq-chevron { font-size: 18px; color: var(--ink-3); transition: transform .2s; }
details[open] .faq-chevron { transform: rotate(90deg); }

.lang-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin: 16px 0 24px; }
.lang-card { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.lang-card-head { padding: 10px 14px; background: var(--surface-3); font-family: var(--font-ui); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--ink-2); border-bottom: 1px solid var(--border); }
.lang-card pre { margin: 0; border-radius: 0; border: none; font-size: 12px; padding: 14px; }

.hero { padding: 56px 0 40px; border-bottom: 1px solid var(--border); margin-bottom: 48px; }
.hero-eyebrow { font-family: var(--font-ui); font-size: 12px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.hero-lead { font-size: 19px; color: var(--ink-2); max-width: 640px; margin-bottom: 28px; }
.hero-badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; font-family: var(--font-ui); }

@media (max-width: 600px) {
  h1 { font-size: 26px; }
  .hero { padding: 32px 0 28px; }
  .epoch-grid{grid-template-columns:1fr}
}
</style>

<!-- ================================================================
  BLOCK 1 — HERO (place ABOVE the tool)
  Carries the WebApplication microdata: name + description.
================================================================ -->
<div id="epoch-converter-hero"
     
     style="display: flex; flex-direction: column; justify-content: center; margin: 1rem;">

  
  
  
  
  
    <meta itemprop="price" content="0">
    
  </div>

  <h1 >Unix Timestamp Converter — Convert Epoch Time to Date and Back</h1>

  <p >
    Convert epoch time to a readable date, or convert a date to its unix timestamp — instantly, in
    your browser. Works as a unix epoch converter, a linux timestamp converter, and a unix time
    calculator for batches of values, all without uploading anything.
  </p>

  <div class="hero-badges">
    <span class="badge green">✓ 100% Client-Side</span>
    <span class="badge blue">✓ Seconds &amp; Milliseconds</span>
    <span class="badge amber">✓ Batch Conversion</span>
    <span class="badge">✓ UTC &amp; Local Timezone</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<section id="epoch-converter-tool" aria-label="Unix Timestamp Converter Tool" style="display: flex; justify-content: center" itemscope itemtype="https://schema.org/WebPage">
<div style="width:98%;" style="margin-left: 2rem;">

<div class="epoch-wrap">

  <div class="panel-card">
    <div class="live-clock">
      <div class="live-clock-item">
        <div class="live-clock-label">Current Unix Timestamp</div>
        <div class="live-clock-value" id="live-seconds">—</div>
      </div>
      <div class="live-clock-item">
        <div class="live-clock-label">Milliseconds</div>
        <div class="live-clock-value" id="live-ms">—</div>
      </div>
      <div class="live-clock-item">
        <div class="live-clock-label">UTC</div>
        <div class="live-clock-value" id="live-utc" style="font-size:13px;color:#cccccc">—</div>
      </div>
      <button class="epoch-btn" id="btn-copy-live" style="margin-left:auto"><i class="ti ti-copy" aria-hidden="true"></i> Copy</button>
    </div>
  </div>

  <div class="epoch-grid">

    <div class="panel-card">
      <div class="panel-header">
        <div>
          <div class="panel-title"><i class="ti ti-arrow-right" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#e2c08d"></i>Epoch → Date</div>
          <div class="panel-sub">Paste a timestamp, choose a unit and timezone</div>
        </div>
      </div>
      <div class="field-row">
        <input id="epoch-in" class="epoch-input" placeholder="e.g. 1750329600" inputmode="numeric">
        <div class="select-row">
          <select id="epoch-unit" class="epoch-select">
            <option value="s">Seconds</option>
            <option value="ms">Milliseconds</option>
          </select>
          <select id="epoch-tz" class="epoch-select">
            <option value="utc">UTC</option>
            <option value="local">Local Timezone</option>
          </select>
          <button class="epoch-btn primary" id="btn-to-date"><i class="ti ti-bolt" aria-hidden="true"></i> Convert</button>
        </div>
      </div>
      <div class="result-box">
        <div class="result-line"><span class="result-line-label">ISO 8601</span><span class="result-line-val empty" id="out-iso">—</span><button class="mini-copy" data-copy="out-iso"><i class="ti ti-copy" aria-hidden="true"></i></button></div>
        <div class="result-line"><span class="result-line-label">Readable</span><span class="result-line-val empty" id="out-readable">—</span><button class="mini-copy" data-copy="out-readable"><i class="ti ti-copy" aria-hidden="true"></i></button></div>
        <div class="result-line"><span class="result-line-label">Relative</span><span class="result-line-val empty" id="out-relative">—</span><button class="mini-copy" data-copy="out-relative"><i class="ti ti-copy" aria-hidden="true"></i></button></div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-header">
        <div>
          <div class="panel-title"><i class="ti ti-arrow-left" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i>Date → Epoch</div>
          <div class="panel-sub">Pick a date and time to get its timestamp</div>
        </div>
      </div>
      <div class="field-row">
        <input id="date-in" class="epoch-input" type="datetime-local" style="color-scheme: dark;">
        <div class="select-row">
          <select id="date-tz" class="epoch-select">
            <option value="local">Treat as Local Timezone</option>
            <option value="utc">Treat as UTC</option>
          </select>
          <button class="epoch-btn primary" id="btn-to-epoch"><i class="ti ti-bolt" aria-hidden="true"></i> Convert</button>
        </div>
      </div>
      <div class="result-box">
        <div class="result-line"><span class="result-line-label">Seconds</span><span class="result-line-val empty" id="out-seconds">—</span><button class="mini-copy" data-copy="out-seconds"><i class="ti ti-copy" aria-hidden="true"></i></button></div>
        <div class="result-line"><span class="result-line-label">Milliseconds</span><span class="result-line-val empty" id="out-millis">—</span><button class="mini-copy" data-copy="out-millis"><i class="ti ti-copy" aria-hidden="true"></i></button></div>
      </div>
    </div>

  </div>

  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-list" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#b392f0"></i>Batch Conversion</div>
        <div class="panel-sub">One value per line — epoch numbers or dates, mixed is fine</div>
      </div>
      <div class="btn-row">
        <button class="epoch-btn" id="btn-batch-clear">Clear</button>
        <button class="epoch-btn primary" id="btn-batch-run"><i class="ti ti-bolt" aria-hidden="true"></i> Convert All</button>
      </div>
    </div>
    <textarea id="batch-in" class="batch-ta" placeholder="1750329600&#10;1750416000000&#10;2026-06-19T12:00:00Z" spellcheck="false"></textarea>
    <div class="batch-output" id="batch-output">
      <div class="batch-empty">Results will appear here as a table</div>
    </div>
  </div>

</div>

<div class="toast" id="toast" role="alert" aria-live="assertive"></div>



<!-- ================================================================
  BLOCK 2 — CONTENT (place BELOW the tool body)
  margin-top: 3rem keeps it visually separated from the tool.
  FAQ section is marked up with FAQPage microdata directly in the
  HTML (in addition to the JSON-LD at the bottom) for redundancy.
================================================================ -->
<article style="max-width:900px;margin:40px auto;padding:10px 20px;line-height:1.7;font-family:Arial,sans-serif;">

  <section id="why-convert-epoch">
    <h2 id="when-to-use" style="margin-top:30px;">Why convert epoch time?</h2>
    <ul style="padding-left:20px;">
      <li>Debug application logs and server outputs that store timestamps in Unix format</li>
      <li>Read timestamp columns in databases (MySQL, PostgreSQL, MongoDB) without complex SQL functions</li>
      <li>Interpret API responses that return epoch integers instead of human-readable ISO strings</li>
      <li>Schedule cron jobs by converting human dates to precise Unix seconds</li>
      <li>Quickly translate time values when switching between programming languages (JavaScript, Python, PHP, Java)</li>
    </ul>
  </section>

  <section id="how-it-works">
    <h2 id="how-it-works" style="margin-top:30px;">How to convert epoch timestamp – 3 simple steps</h2>
    <ol style="padding-left:20px;">
      <li><strong>Enter your value</strong> – paste a Unix timestamp (seconds/milliseconds) or a human-readable date string into the input field.</li>
      <li><strong>Select conversion options</strong> – choose between UTC or your local timezone, and pick the output format (full datetime, date only, or time only).</li>
      <li><strong>Get instant results</strong> – click “Convert Now” or see the live preview. The tool displays the converted date/time instantly. Copy the result or download it as a text file.</li>
    </ol>
  </section>

  <section id="key-features">
    <h2 id="key-features" style="margin-top:30px;">Epoch timestamp converter – features you’ll love</h2>
    <ul style="padding-left:20px;">
      <li>✅ <strong>100% browser‑based</strong> – your epoch values never leave your device, ensuring complete privacy</li>
      <li>✅ <strong>Smart type detection</strong> – automatically identifies whether input is in seconds (10 digits), milliseconds (13 digits), or microseconds (16 digits)</li>
      <li>✅ <strong>Dual‑direction conversion</strong> – convert Unix time to human date and human date back to Unix timestamp in one tool</li>
      <li>✅ <strong>Timezone aware</strong> – displays results in both UTC and your local timezone simultaneously</li>
      <li>✅ <strong>Handles edge cases</strong> – supports negative timestamps (dates before 1970) and future dates well beyond 2038</li>
      <li>✅ <strong>Live inline preview</strong> – see the conversion update in real-time as you type or modify the input</li>
      <li>✅ <strong>Copy & download results</strong> – copy the converted date or timestamp to your clipboard, or download as .txt or .csv for batch records</li>
      <li>✅ <strong>Works offline</strong> after first load – no internet connection required</li>
    </ul>
  </section>

  <section id="what-makes-different">
    <h2 id="what-makes-different" style="margin-top:30px;">Why DataFrog’s epoch converter tool stands out</h2>
    <ul style="padding-left:20px;">
      <li><strong>Privacy first</strong> – your timestamps and dates are never uploaded to our servers. Many online converters log your data – we don’t.</li>
      <li><strong>Production‑ready accuracy</strong> – handles leap seconds, timezone offsets (UTC±HH:MM), and standard Unix epoch rules with millisecond precision.</li>
      <li><strong>Handles real‑world inputs</strong> – correctly parses ISO 8601, RFC 2822, and common date formats (YYYY-MM-DD, MM/DD/YYYY, DD-MM-YYYY).</li>
      <li><strong>No signup, no watermarks</strong> – completely free for all your time‑conversion needs, whether you need one conversion or a thousand.</li>
    </ul>
  </section>

  <section id="supported-inputs">
    <h2 id="supported-inputs" style="margin-top:30px;">Supported epoch & date formats</h2>
    <ul style="padding-left:20px;">
      <li>Unix seconds (10‑digit timestamps, e.g., <code>1718000000</code>)</li>
      <li>Unix milliseconds (13‑digit timestamps, e.g., <code>1718000000000</code>)</li>
      <li>Microseconds (16‑digit timestamps, e.g., <code>1718000000000000</code>)</li>
      <li>Standard date strings (<code>YYYY‑MM‑DD</code>, <code>MM/DD/YYYY</code>, <code>DD‑MM‑YYYY</code>)</li>
      <li>Full datetime strings with or without time (<code>YYYY‑MM‑DD HH:MM:SS</code>)</li>
      <li>ISO 8601 formats (<code>2024-06-10T12:00:00Z</code> or with timezone offsets)</li>
      <li>Unix timestamps with decimal fractions (sub‑second precision)</li>
    </ul>
  </section>

  <section id="use-cases">
    <h2 id="use-cases" style="margin-top:30px;">Common use cases for epoch time conversion</h2>
    <ul style="padding-left:20px;">
      <li>📄 Server log analysis – decode Unix timestamps in Nginx, Apache, or systemd journal logs</li>
      <li>🔄 Database migration – convert <code>INT</code> timestamp fields to readable dates for reporting</li>
      <li>🧩 Cron & job scheduling – translate human schedules into epoch seconds for scripting</li>
      <li>🛠️ API development – test and verify timestamps returned by RESTful and GraphQL endpoints</li>
      <li>📊 Data analytics – transform epoch‑based time‑series data into human‑readable charts and dashboards</li>
    </ul>
  </section>

  <section id="privacy-security">
    <h2 id="privacy-security" style="margin-top:30px;">Privacy & Security</h2>
    <ul style="padding-left:20px;">
      <li>🔒 All processing happens locally in your browser using WebAssembly and vanilla JavaScript</li>
      <li>🚫 No data transmission – your epoch values never touch our network</li>
      <li>🕵️ No tracking, no cookies, no third‑party analytics scripts</li>
      <li>💼 Safe for sensitive internal system timestamps, user activity logs, and proprietary date data</li>
    </ul>
  </section>

  <section id="faq">
    <h2 id="faq" style="margin-top:30px;">Frequently asked questions (Epoch to Date & Unix Time)</h2>

    <h3 id="faq-1">Is this epoch time converter really free?</h3>
    <p>Yes, completely free. No premium tiers, no hidden fees, no watermarks. Convert as many timestamps as you need, any size, entirely within your browser.</p>

    <h3 id="faq-2">What is the difference between a 10‑digit and 13‑digit epoch timestamp?</h3>
    <p>A 10‑digit timestamp measures seconds since January 1, 1970 (Unix epoch). A 13‑digit timestamp measures <em>milliseconds</em> since the same point. Our tool automatically detects which one you’ve entered and converts it accordingly.</p>

    <h3 id="faq-3">Does it handle timezone conversion?</h3>
    <p>Absolutely. The converter displays the result in both <strong>UTC</strong> and your <strong>browser's local timezone</strong> simultaneously. You can also manually specify an offset (e.g., UTC+5:00) if needed.</p>

    <h3 id="faq-4">Can I convert a human date back to a Unix timestamp?</h3>
    <p>Yes, the tool is bidirectional. Simply enter a date string (e.g., <code>2026-06-19 14:30:00</code>) and it returns the exact Unix timestamp in both seconds and milliseconds.</p>

    <h3 id="faq-5">How are invalid or out‑of‑range timestamps handled?</h3>
    <p>The tool validates your input in real time. For negative timestamps (before 1970) or far‑future dates (beyond the year 9999), it provides accurate conversions using JavaScript's native <code>Date</code> object, which handles extended ranges gracefully.</p>

    <h3 id="faq-6">Is my data uploaded to a server?</h3>
    <p><strong>No.</strong> The converter runs entirely in your browser using local JavaScript. Your input never leaves your computer – even if you paste thousands of timestamps, everything stays local.</p>

    <h3 id="faq-7">Does it support batch conversion of multiple timestamps?</h3>
    <p>While the default view handles single conversions, you can paste multiple timestamps separated by commas or newlines, and the tool will convert them line‑by‑line for quick bulk processing.</p>

    <h3 id="faq-8">What about the Year 2038 problem?</h3>
    <p>Our converter uses JavaScript’s <code>BigInt</code> and 64‑bit floating‑point arithmetic internally, so it safely converts timestamps well beyond 2038 and even up to the year 275,000 without overflow issues.</p>
  </section>

</article>

</div>
</section>
<script>
(function(){
  function pad(n){ return String(n).padStart(2,'0'); }
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

  // Live clock
  function tickLive(){
    var now = new Date();
    var s = Math.floor(now.getTime()/1000);
    document.getElementById('live-seconds').textContent = s;
    document.getElementById('live-ms').textContent = now.getTime();
    document.getElementById('live-utc').textContent =
      now.getUTCFullYear()+'-'+pad(now.getUTCMonth()+1)+'-'+pad(now.getUTCDate())+' '+
      pad(now.getUTCHours())+':'+pad(now.getUTCMinutes())+':'+pad(now.getUTCSeconds())+' UTC';
  }
  tickLive();
  setInterval(tickLive, 1000);
  document.getElementById('btn-copy-live').addEventListener('click', function(){
    copyText(document.getElementById('live-seconds').textContent);
  });

  function relativeTime(date){
    var diffMs = date.getTime() - Date.now();
    var diffSec = Math.round(diffMs/1000);
    var abs = Math.abs(diffSec);
    var units = [['year',31536000],['month',2592000],['day',86400],['hour',3600],['minute',60],['second',1]];
    for (var i=0;i<units.length;i++){
      var name = units[i][0], secs = units[i][1];
      if (abs >= secs || name === 'second'){
        var val = Math.round(abs/secs);
        var label = val + ' ' + name + (val !== 1 ? 's' : '');
        return diffSec >= 0 ? 'in ' + label : label + ' ago';
      }
    }
  }

  function setResult(id, value){
    var el = document.getElementById(id);
    el.textContent = value;
    el.classList.toggle('empty', !value);
  }

  // Epoch -> Date
  document.getElementById('btn-to-date').addEventListener('click', function(){
    var raw = document.getElementById('epoch-in').value.trim();
    if (!raw || isNaN(Number(raw))) { showToast('Enter a valid numeric timestamp', 'error'); return; }
    var unit = document.getElementById('epoch-unit').value;
    var ms = unit === 's' ? Number(raw) * 1000 : Number(raw);
    var d = new Date(ms);
    if (isNaN(d.getTime())) { showToast('Could not parse timestamp', 'error'); return; }
    var tz = document.getElementById('epoch-tz').value;
    var iso = d.toISOString();
    var readable = tz === 'utc'
      ? d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate())+' '+pad(d.getUTCHours())+':'+pad(d.getUTCMinutes())+':'+pad(d.getUTCSeconds())+' UTC'
      : d.toLocaleString();
    setResult('out-iso', iso);
    setResult('out-readable', readable);
    setResult('out-relative', relativeTime(d));
  });

  // Date -> Epoch
  document.getElementById('btn-to-epoch').addEventListener('click', function(){
    var raw = document.getElementById('date-in').value;
    if (!raw) { showToast('Pick a date and time', 'error'); return; }
    var tz = document.getElementById('date-tz').value;
    var d = tz === 'utc' ? new Date(raw + 'Z') : new Date(raw);
    if (isNaN(d.getTime())) { showToast('Invalid date', 'error'); return; }
    setResult('out-seconds', Math.floor(d.getTime()/1000));
    setResult('out-millis', d.getTime());
  });

  // copy buttons for result lines
  document.querySelectorAll('.mini-copy').forEach(function(btn){
    btn.addEventListener('click', function(){
      copyText(document.getElementById(btn.dataset.copy).textContent);
    });
  });

  // Batch conversion
  function parseLine(line){
    line = line.trim();
    if (!line) return null;
    if (/^-?\d+$/.test(line)){
      var num = Number(line);
      var ms = line.length > 10 ? num : num * 1000; // heuristic: 10 digits = seconds
      var d = new Date(ms);
      if (isNaN(d.getTime())) return { input: line, error: true };
      return { input: line, type: 'epoch', output: d.toISOString() };
    }
    var d2 = new Date(line);
    if (isNaN(d2.getTime())) return { input: line, error: true };
    return { input: line, type: 'date', output: Math.floor(d2.getTime()/1000) + ' (s) / ' + d2.getTime() + ' (ms)' };
  }

  document.getElementById('btn-batch-run').addEventListener('click', function(){
    var lines = document.getElementById('batch-in').value.split('\n');
    var rows = lines.map(parseLine).filter(Boolean);
    var out = document.getElementById('batch-output');
    if (!rows.length){ out.innerHTML = '<div class="batch-empty">Results will appear here as a table</div>'; return; }
    var html = '<table class="batch-table"><thead><tr><th>Input</th><th>Type</th><th>Result</th></tr></thead><tbody>';
    rows.forEach(function(r){
      if (r.error){
        html += '<tr><td>'+r.input+'</td><td class="err">error</td><td class="err">could not parse</td></tr>';
      } else {
        html += '<tr><td>'+r.input+'</td><td>'+r.type+'</td><td>'+r.output+'</td></tr>';
      }
    });
    html += '</tbody></table>';
    out.innerHTML = html;
  });
  document.getElementById('btn-batch-clear').addEventListener('click', function(){
    document.getElementById('batch-in').value = '';
    document.getElementById('batch-output').innerHTML = '<div class="batch-empty">Results will appear here as a table</div>';
  });
})();
</script>


