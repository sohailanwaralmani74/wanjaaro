---
layout: main
title: "Advanced Word Counter - Text Analysis Tool, Browser-Based & Private"
description: "Word counter and text analyzer. Count words, characters, sentences, paragraphs, lexical density, readability scores, etc."
keywords: "word counter, advanced word counter, text analysis, character counter, sentence counter, readability score, lexical density, keyword density, word frequency, letter counter, count words online, reading time calculator, text analyzer, word count tool, online word counter, content analysis, vocabulary analyzer, text statistics, free word counter, writing assistant"
category: utilities
---
<script type="application/ld+json">
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://datafrog.tools/word-counter#webapp",
    "name": "Advanced Word Counter - Text Analysis Tool",
    "url": "https://datafrog.tools/word-counter",
    "description": "A free, browser-based advanced word counter and text analysis tool. Count words, characters, sentences, paragraphs, lexical density, readability scores, keyword frequency, and more. 100% client-side with complete data privacy.",
    "applicationCategory": "DeveloperTool",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Privacy-first client-side processing (no data uploaded to servers)",
      "Real-time analysis as you type or paste",
      "Word, character, sentence, and paragraph counting",
      "Lexical density and vocabulary richness analysis",
      "Readability scores (Flesch Reading Ease, Flesch-Kincaid Grade Level)",
      "Keyword density and word frequency analysis",
      "Letter and character frequency breakdown",
      "Average word and sentence length calculation",
      "Reading and speaking time estimation",
      "Copy results to clipboard or export as CSV/TXT/JSON"
    ],
    "softwareRequirements": "A modern web browser",
    "softwareVersion": "1.0",
    "datePublished": "2025-11-21",
    "dateModified": "2025-11-21"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://datafrog.tools/word-counter#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this word counter really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, it is completely free with no premium tiers, signups, or hidden fees. Analyze as much text as you need directly in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "What is lexical density?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lexical density measures the proportion of unique words (types) to total words (tokens) in a text. A higher lexical density indicates richer vocabulary and more complex content. It's calculated as: (Number of Unique Words ÷ Total Words) × 100."
        }
      },
      {
        "@type": "Question",
        "name": "What are readability scores?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Readability scores estimate how easy or difficult a text is to read. The Flesch Reading Ease score ranges from 0-100 (higher = easier). The Flesch-Kincaid Grade Level estimates the US school grade level needed to understand the text."
        }
      },
      {
        "@type": "Question",
        "name": "Does it handle large text files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the tool can handle large documents. Performance depends on your device's memory and browser, but most documents (up to a few MB) analyze instantly."
        }
      },
      {
        "@type": "Question",
        "name": "Is my text data secure and private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All processing happens entirely within your browser; no text is sent to any server, making it safe for sensitive documents, drafts, and proprietary content."
        }
      },
      {
        "@type": "Question",
        "name": "Can I export the analysis results?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! You can copy the results to your clipboard or export them as CSV, TXT, or JSON for further analysis or documentation."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://datafrog.tools/word-counter#howto",
    "name": "How to Analyze Text with the Word Counter",
    "description": "Step-by-step guide to count words, characters, sentences, and analyze text readability and vocabulary using the free online advanced word counter.",
    "tool": {
      "@type": "HowToTool",
      "name": "Advanced Word Counter"
    },
    "supply": {
      "@type": "HowToSupply",
      "name": "Text Content"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Paste or Type Your Text",
        "text": "Paste your text into the editor or type directly. The tool analyzes in real-time as you write.",
        "url": "https://datafrog.tools/word-counter"
      },
      {
        "@type": "HowToStep",
        "name": "View Instant Analysis",
        "text": "See comprehensive statistics including word count, character count, sentence count, readability scores, and keyword frequency.",
        "url": "https://datafrog.tools/word-counter"
      },
      {
        "@type": "HowToStep",
        "name": "Review Detailed Metrics",
        "text": "Explore lexical density, average word length, reading time, and more advanced metrics.",
        "url": "https://datafrog.tools/word-counter"
      },
      {
        "@type": "HowToStep",
        "name": "Copy or Export Results",
        "text": "Copy results to your clipboard or export as CSV, TXT, or JSON for documentation.",
        "url": "https://datafrog.tools/word-counter"
      }
    ],
    "totalTime": "PT1M"
  }
]
</script>

<style>
/* ====== All styles from existing tools ====== */
.word-wrap{background:#1e1e1e;border-radius:10px;padding:20px;display:flex;flex-direction:column;gap:16px;min-height:100px}
.panel-card{background:#252526;border-radius:8px;border:1px solid #3c3c3c;overflow:hidden}
.panel-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#2d2d2d;border-bottom:1px solid #3c3c3c;flex-wrap:wrap;gap:8px}
.panel-title{font-size:13px;font-weight:500;color:#cccccc;letter-spacing:.3px}
.panel-sub{font-size:11px;color:#6a9955;margin-top:2px}
.btn-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.word-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:4px;font-size:12px;font-family:inherit;cursor:pointer;border:1px solid #555;background:#3a3a3a;color:#cccccc;transition:background .15s}
.word-btn:hover{background:#4a4a4a}
.word-btn.primary{background:#0e639c;border-color:#0e639c;color:#fff}
.word-btn.primary:hover{background:#1177bb}
.word-btn.green{background:#1e7a4a;border-color:#1e7a4a;color:#fff}
.word-btn.green:hover{background:#258a58}
.word-btn.amber{background:#8a6e1e;border-color:#8a6e1e;color:#fff}
.word-btn.amber:hover{background:#a07e23}
.word-btn.purple{background:#5b2d8e;border-color:#5b2d8e;color:#fff}
.word-btn.purple:hover{background:#6e38a8}
.word-btn:disabled{opacity:.4;cursor:not-allowed}

.word-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width:760px){.word-grid{grid-template-columns:1fr}}

.field-row{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.word-textarea{width:100%;min-height:200px;max-height:400px;background:#1b1b1b;color:#d4d4d4;font-family:var(--font-mono,'Fira Mono',monospace);font-size:14px;padding:12px;border:1px solid #3c3c3c;border-radius:5px;outline:none;resize:vertical;line-height:1.7}
.word-textarea::placeholder{color:#4a4a4a}
.word-textarea:focus{border-color:#0e639c}
.word-textarea:disabled{opacity:.5;cursor:not-allowed}

.select-row{display:flex;gap:8px;flex-wrap:wrap}
.word-select{background:#1b1b1b;color:#cccccc;font-family:inherit;font-size:12px;padding:7px 10px;border:1px solid #3c3c3c;border-radius:5px;outline:none}

/* Stats Grid */
.stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;padding:14px 16px}
.stat-card{background:#1b1b1b;border:1px solid #3c3c3c;border-radius:5px;padding:10px 12px;text-align:center}
.stat-number{font-family:var(--font-mono,'Fira Mono',monospace);font-size:22px;font-weight:700;color:#9cdcfe;display:block}
.stat-label{font-size:10px;color:#7a7a7a;text-transform:uppercase;letter-spacing:.5px;margin-top:2px}

/* Details Section */
.details-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:0 16px 16px}
@media (max-width:600px){.details-grid{grid-template-columns:1fr}}
.detail-block{background:#1b1b1b;border:1px solid #3c3c3c;border-radius:5px;padding:12px 14px}
.detail-block-title{font-size:10px;color:#7a7a7a;text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:6px}
.detail-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #2a2a2a;font-size:12px}
.detail-row:last-child{border-bottom:none}
.detail-label{color:#7a7a7a}
.detail-value{font-family:var(--font-mono,'Fira Mono',monospace);color:#d4d4d4}

/* Keyword Frequency */
.keyword-container{max-height:200px;overflow-y:auto;padding:0 16px 16px}
.keyword-bar{display:flex;align-items:center;gap:10px;padding:3px 0;font-size:12px;font-family:var(--font-mono,'Fira Mono',monospace)}
.keyword-name{color:#d4d4d4;min-width:80px}
.keyword-count{color:#7a7a7a;min-width:30px}
.keyword-track{flex:1;height:16px;background:#252526;border-radius:3px;overflow:hidden}
.keyword-fill{height:100%;background:linear-gradient(90deg,#0e639c,#1177bb);border-radius:3px;transition:width .3s}

/* Word Frequency List */
.freq-list{max-height:180px;overflow-y:auto;padding:0 16px 16px}
.freq-item{display:flex;justify-content:space-between;padding:3px 8px;font-size:12px;font-family:var(--font-mono,'Fira Mono',monospace);border-bottom:1px solid #1b1b1b}
.freq-item:hover{background:#252526}
.freq-word{color:#d4d4d4}
.freq-count{color:#7a7a7a}

.analysis-tabs{display:flex;gap:4px;padding:0 16px;flex-wrap:wrap}
.analysis-tab{background:#252526;border:1px solid #3c3c3c;border-bottom:none;padding:8px 16px;font-size:12px;color:#7a7a7a;cursor:pointer;border-radius:4px 4px 0 0;transition:all .2s}
.analysis-tab:hover{background:#2d2d2d;color:#d4d4d4}
.analysis-tab.active{background:#1b1b1b;color:#9cdcfe;border-color:#0e639c}
.analysis-tab:disabled{opacity:.4;cursor:not-allowed}

.analysis-content{padding:12px 16px;background:#1b1b1b;border:1px solid #3c3c3c;border-radius:0 0 5px 5px;margin:0 16px 16px;min-height:100px}
.analysis-content .empty{color:#4a4a4a;font-style:italic;font-size:13px;text-align:center;padding:20px 0}

/* Letter frequency grid */
.letter-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(60px,1fr));gap:6px}
.letter-item{display:flex;flex-direction:column;align-items:center;padding:6px;background:#252526;border-radius:4px}
.letter-char{font-family:var(--font-mono,'Fira Mono',monospace);font-size:14px;font-weight:600;color:#d4d4d4}
.letter-count{font-size:11px;color:#7a7a7a}

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

.hero{padding:56px 0 40px;border-bottom:1px solid var(--border);margin-bottom:48px}
.hero-eyebrow{font-family:var(--font-ui);font-size:12px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--accent);margin-bottom:12px}
.hero-lead{font-size:19px;color:var(--ink-2);max-width:640px;margin-bottom:28px}
.hero-badges{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;font-family:var(--font-ui)}

.toast{position:fixed;bottom:24px;right:24px;padding:10px 18px;border-radius:6px;font-size:12px;font-family:var(--font-mono,monospace);z-index:999;opacity:0;transform:translateY(8px);transition:opacity .25s,transform .25s;pointer-events:none;max-width:320px}
.toast.success{background:#1e293b;border:1px solid #2d7a4a;color:#6fcf97}
.toast.error{background:#1e293b;border:1px solid #8b3333;color:#f97583}
.toast.show{opacity:1;transform:translateY(0)}

@media (max-width:600px){h1{font-size:26px}.hero{padding:32px 0 28px}}
</style>

<!-- ================================================================
  HERO — WebApplication metadata
================================================================ -->
<div id="word-counter-hero"
     
     style="display:flex;flex-direction:column;justify-content:center;margin:1rem;">

  
  
  
  
  
    <meta itemprop="price" content="0">
    <meta itemprop="priceCurrency" content="USD">
  </div>

  <h1 >Advanced Word Counter — Complete Text Analysis Tool</h1>

  <p >
    Analyze your text in real-time. Count words, characters, sentences, paragraphs,
    lexical density, readability scores, keyword frequency, and more.
    100% client-side — your text never leaves your device.
  </p>

  <div class="hero-badges">
    <span class="badge green">✓ 100% Client-Side</span>
    <span class="badge blue">✓ Real-Time Analysis</span>
    <span class="badge amber">✓ Lexical Density</span>
    <span class="badge">✓ Readability Scores</span>
    <span class="badge">✓ Keyword Frequency</span>
    <span class="badge">✓ Free Forever</span>
  </div>
</div>

<section id="word-counter-tool" aria-label="Advanced Word Counter Tool" style="display:flex;justify-content:center" >
<div style="width:98%;">

<div class="word-wrap">

  <!-- ===== TEXT INPUT ===== -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-pencil" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#e2c08d"></i>Enter Your Text</div>
        <div class="panel-sub">Paste or type your text — analysis updates in real-time</div>
      </div>
      <div class="btn-row">
        <button class="word-btn" id="btn-clear-text"><i class="ti ti-trash" aria-hidden="true"></i> Clear</button>
        <button class="word-btn primary" id="btn-sample-text"><i class="ti ti-file-text" aria-hidden="true"></i> Sample Text</button>
      </div>
    </div>
    <div class="field-row">
      <textarea id="text-input" class="word-textarea" placeholder="Paste or type your text here to analyze it. The analysis updates automatically as you type." spellcheck="false"></textarea>
    </div>
  </div>

  <!-- ===== STATS GRID ===== -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-chart-bar" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#79b8ff"></i>Text Statistics</div>
        <div class="panel-sub">Key metrics at a glance</div>
      </div>
      <div class="btn-row">
        <button class="word-btn green" id="btn-export-csv"><i class="ti ti-file-spreadsheet" aria-hidden="true"></i> CSV</button>
        <button class="word-btn amber" id="btn-export-txt"><i class="ti ti-file-text" aria-hidden="true"></i> TXT</button>
        <button class="word-btn purple" id="btn-export-json"><i class="ti ti-file-code" aria-hidden="true"></i> JSON</button>
      </div>
    </div>
    <div class="stats-grid" id="stats-grid">
      <div class="stat-card"><span class="stat-number" id="stat-words">0</span><span class="stat-label">Words</span></div>
      <div class="stat-card"><span class="stat-number" id="stat-chars">0</span><span class="stat-label">Characters</span></div>
      <div class="stat-card"><span class="stat-number" id="stat-chars-nospace">0</span><span class="stat-label">Chars (no space)</span></div>
      <div class="stat-card"><span class="stat-number" id="stat-sentences">0</span><span class="stat-label">Sentences</span></div>
      <div class="stat-card"><span class="stat-number" id="stat-paragraphs">0</span><span class="stat-label">Paragraphs</span></div>
      <div class="stat-card"><span class="stat-number" id="stat-lines">0</span><span class="stat-label">Lines</span></div>
      <div class="stat-card"><span class="stat-number" id="stat-unique">0</span><span class="stat-label">Unique Words</span></div>
      <div class="stat-card"><span class="stat-number" id="stat-density">0%</span><span class="stat-label">Lexical Density</span></div>
      <div class="stat-card"><span class="stat-number" id="stat-reading-time">0s</span><span class="stat-label">Reading Time</span></div>
      <div class="stat-card"><span class="stat-number" id="stat-speaking-time">0s</span><span class="stat-label">Speaking Time</span></div>
      <div class="stat-card"><span class="stat-number" id="stat-avg-word">0</span><span class="stat-label">Avg Word Length</span></div>
      <div class="stat-card"><span class="stat-number" id="stat-avg-sentence">0</span><span class="stat-label">Avg Sentence Length</span></div>
    </div>
  </div>

  <!-- ===== DETAILED ANALYSIS TABS ===== -->
  <div class="panel-card">
    <div class="panel-header">
      <div>
        <div class="panel-title"><i class="ti ti-details" aria-hidden="true" style="font-size:14px;margin-right:6px;color:#b392f0"></i>Detailed Analysis</div>
        <div class="panel-sub">Explore advanced metrics and breakdowns</div>
      </div>
    </div>
    <div class="analysis-tabs">
      <button class="analysis-tab active" data-tab="readability">Readability</button>
      <button class="analysis-tab" data-tab="keywords">Keywords</button>
      <button class="analysis-tab" data-tab="letters">Letters</button>
      <button class="analysis-tab" data-tab="wordlist">Word List</button>
    </div>
    <div class="analysis-content" id="analysis-content">
      <div id="tab-readability" class="tab-panel">
        <div class="empty">Analyze text to see readability scores and vocabulary metrics</div>
      </div>
      <div id="tab-keywords" class="tab-panel" style="display:none">
        <div class="empty">Analyze text to see keyword frequency and density</div>
      </div>
      <div id="tab-letters" class="tab-panel" style="display:none">
        <div class="empty">Analyze text to see letter frequency breakdown</div>
      </div>
      <div id="tab-wordlist" class="tab-panel" style="display:none">
        <div class="empty">Analyze text to see full word list with frequencies</div>
      </div>
    </div>
  </div>

</div>

<div class="toast" id="toast" role="alert" aria-live="assertive"></div>

<!-- ================================================================
  CONTENT BLOCKS
================================================================ -->
<article class="onpage-content">

  <section id="why-use-word-counter">
    <h2 style="margin-top:30px;">Why use an advanced word counter?</h2>
    <ul style="padding-left:20px;">
      <li>Track word count for essays, articles, blog posts, and academic papers</li>
      <li>Analyze vocabulary richness and lexical density for content quality assessment</li>
      <li>Calculate readability scores to ensure your content is appropriate for your audience</li>
      <li>Optimize SEO content by analyzing keyword density and frequency</li>
      <li>Estimate reading and speaking times for presentations and video scripts</li>
      <li>Improve writing quality with detailed text statistics and insights</li>
    </ul>
  </section>

  <section id="how-it-works">
    <h2 style="margin-top:30px;">How to use the word counter – 3 simple steps</h2>
    <ol style="padding-left:20px;">
      <li><strong>Enter your text</strong> – paste your content into the text area or type directly.</li>
      <li><strong>View real-time statistics</strong> – see word count, character count, sentences, paragraphs, and more update instantly.</li>
      <li><strong>Explore detailed analysis</strong> – switch tabs to view readability scores, keyword frequency, letter breakdowns, and full word lists.</li>
    </ol>
  </section>

  <section id="key-features">
    <h2 style="margin-top:30px;">Word counter – features you’ll love</h2>
    <ul style="padding-left:20px;">
      <li>✅ <strong>100% browser‑based</strong> – your text never leaves your device, ensuring complete privacy</li>
      <li>✅ <strong>Real‑time analysis</strong> – statistics update instantly as you type or paste</li>
      <li>✅ <strong>Comprehensive metrics</strong> – words, characters, sentences, paragraphs, lines, and more</li>
      <li>✅ <strong>Lexical density</strong> – measure vocabulary richness and content complexity</li>
      <li>✅ <strong>Readability scores</strong> – Flesch Reading Ease and Flesch-Kincaid Grade Level</li>
      <li>✅ <strong>Keyword frequency</strong> – see which words appear most often in your text</li>
      <li>✅ <strong>Letter frequency</strong> – detailed breakdown of letter usage</li>
      <li>✅ <strong>Reading & speaking times</strong> – estimate how long your text takes to read or speak</li>
      <li>✅ <strong>Export results</strong> – download statistics as CSV, TXT, or JSON</li>
      <li>✅ <strong>Works offline</strong> after first load – no internet connection required</li>
    </ul>
  </section>

  <section id="what-makes-different">
    <h2 style="margin-top:30px;">Why DataFrog’s word counter stands out</h2>
    <ul style="padding-left:20px;">
      <li><strong>Privacy first</strong> – your text is never uploaded to our servers. Many online word counters log your data – we don’t.</li>
      <li><strong>Advanced metrics</strong> – go beyond simple word counts with lexical density, readability scores, and detailed frequency analysis.</li>
      <li><strong>Real‑time analysis</strong> – see results update instantly as you type, without clicking any buttons.</li>
      <li><strong>Export capabilities</strong> – save your analysis results as CSV, TXT, or JSON for documentation or further processing.</li>
      <li><strong>No signup, no watermarks</strong> – completely free for all your text analysis needs.</li>
    </ul>
  </section>

  <section id="readability-guide">
    <h2 style="margin-top:30px;">Understanding readability scores</h2>
    <div class="tbl-wrap">
      <table>
        <thead>
          <tr>
            <th>Score</th>
            <th>Reading Ease</th>
            <th>Grade Level</th>
            <th>Audience</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>90–100</td><td>Very Easy</td><td>5th grade</td><td>Children's content</td></tr>
          <tr><td>80–89</td><td>Easy</td><td>6th grade</td><td>General audience</td></tr>
          <tr><td>70–79</td><td>Fairly Easy</td><td>7th–8th grade</td><td>Popular writing</td></tr>
          <tr><td>60–69</td><td>Plain English</td><td>9th–10th grade</td><td>Newspapers, magazines</td></tr>
          <tr><td>50–59</td><td>Fairly Difficult</td><td>11th–12th grade</td><td>Technical writing</td></tr>
          <tr><td>30–49</td><td>Difficult</td><td>College</td><td>Academic texts</td></tr>
          <tr><td>0–29</td><td>Very Difficult</td><td>Graduate</td><td>Advanced academic</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section id="supported-inputs">
    <h2 style="margin-top:30px;">Supported text formats</h2>
    <ul style="padding-left:20px;">
      <li>Plain text content (any length)</li>
      <li>HTML-stripped text (paste from web pages)</li>
      <li>Formatted text (from email, Word, Google Docs)</li>
      <li>Multi-language text (UTF-8 support)</li>
      <li>Markdown content (text extracted automatically)</li>
      <li>Code comments and documentation</li>
    </ul>
  </section>

  <section id="use-cases">
    <h2 style="margin-top:30px;">Common use cases for text analysis</h2>
    <ul style="padding-left:20px;">
      <li>📝 Content writing – track word count and readability for blog posts and articles</li>
      <li>🎓 Academic writing – analyze essays, papers, and theses</li>
      <li>📊 SEO optimization – analyze keyword density and content quality</li>
      <li>🎬 Script writing – estimate reading and speaking times for videos</li>
      <li>📧 Email marketing – ensure your content is appropriately scoped</li>
      <li>📚 Editing and proofreading – improve writing quality with detailed insights</li>
    </ul>
  </section>

  <section id="privacy-security">
    <h2 style="margin-top:30px;">Privacy &amp; Security</h2>
    <ul style="padding-left:20px;">
      <li>🔒 All processing happens locally in your browser using native JavaScript</li>
      <li>🚫 No data transmission – your text never touches our network</li>
      <li>🕵️ No tracking, no cookies, no third‑party analytics scripts</li>
      <li>💼 Safe for analyzing sensitive drafts, proprietary content, and confidential documents</li>
    </ul>
  </section>

  <section id="faq">
    <h2 style="margin-top:30px;">Frequently asked questions (Word Counter)</h2>

    <h3 id="faq-1">Is this word counter really free?</h3>
    <p>Yes, completely free. No premium tiers, no hidden fees, no watermarks. Analyze as much text as you need, entirely within your browser.</p>

    <h3 id="faq-2">What is lexical density?</h3>
    <p>Lexical density measures the proportion of unique words (types) to total words (tokens) in a text. A higher lexical density indicates richer vocabulary and more complex content. It's calculated as: <code>(Number of Unique Words ÷ Total Words) × 100</code>.</p>

    <h3 id="faq-3">What are readability scores?</h3>
    <p>Readability scores estimate how easy or difficult a text is to read. The <strong>Flesch Reading Ease</strong> score ranges from 0–100 (higher = easier). The <strong>Flesch-Kincaid Grade Level</strong> estimates the US school grade level needed to understand the text.</p>

    <h3 id="faq-4">What is keyword density?</h3>
    <p>Keyword density is the percentage of times a specific keyword appears in your text relative to the total word count. It's calculated as: <code>(Keyword Count ÷ Total Words) × 100</code>. This is important for SEO optimization.</p>

    <h3 id="faq-5">Does it handle large text files?</h3>
    <p>Yes, the tool can handle large documents. Performance depends on your device's memory and browser, but most documents (up to a few MB) analyze instantly.</p>

    <h3 id="faq-6">Is my text data secure and private?</h3>
    <p><strong>Yes.</strong> All processing happens entirely within your browser; no text is sent to any server, making it safe for sensitive documents, drafts, and proprietary content.</p>

    <h3 id="faq-7">Can I export the analysis results?</h3>
    <p>Yes! You can copy the results to your clipboard or export them as <strong>CSV</strong>, <strong>TXT</strong>, or <strong>JSON</strong> for further analysis or documentation.</p>

    <h3 id="faq-8">What languages does it support?</h3>
    <p>The tool supports all languages that use the Latin alphabet (English, French, Spanish, German, etc.). It also supports Unicode characters, so it works with non-Latin scripts as well.</p>
  </section>

</article>
</div>
</section>
<!-- ================================================================
  JAVASCRIPT — Word Counter Logic
================================================================ -->
<script>
(function(){
  var textarea = document.getElementById('text-input');
  var stopWords = new Set(['a','an','the','and','or','but','for','nor','on','at','to','by','in','of','with','without','about','against','between','through','during','within','upon','towards','than','so','as','because','since','until','while','if','then','else','when','where','whereas','whereby','whereupon','who','whom','which','that','what','whose','etc','e.g','i.e','ltd','co','inc','is','are','was','were','have','has','had','do','does','did','will','would','could','should','may','might','must']);

  function showToast(msg, type){
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + type + ' show';
    setTimeout(function(){ t.className = 'toast ' + type; }, 1800);
  }

  function setStat(id, value){
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function formatTime(seconds){
    if (seconds < 60) return Math.round(seconds) + 's';
    var mins = Math.floor(seconds / 60);
    var secs = Math.round(seconds % 60);
    return mins + 'm ' + secs + 's';
  }

  function analyzeText(text){
    if (!text || text.trim().length === 0) {
      setStat('stat-words', 0);
      setStat('stat-chars', 0);
      setStat('stat-chars-nospace', 0);
      setStat('stat-sentences', 0);
      setStat('stat-paragraphs', 0);
      setStat('stat-lines', 0);
      setStat('stat-unique', 0);
      setStat('stat-density', '0%');
      setStat('stat-reading-time', '0s');
      setStat('stat-speaking-time', '0s');
      setStat('stat-avg-word', 0);
      setStat('stat-avg-sentence', 0);
      document.querySelectorAll('.tab-panel').forEach(function(p){ p.innerHTML = '<div class="empty">Enter text to see analysis</div>'; });
      return;
    }

    // Basic counts
    var words = text.match(/[a-zA-Z0-9\u00C0-\u024F\u0400-\u04FF]+(?:['’][a-zA-Z]+)?/g) || [];
    var wordCount = words.length;
    var charCount = text.length;
    var charCountNoSpace = text.replace(/\s/g, '').length;
    var sentences = text.match(/[.!?]+/g) || [];
    var sentenceCount = sentences.length || (text.trim().length > 0 ? 1 : 0);
    var lines = text.split('\n').filter(function(l){ return l.trim().length > 0; });
    var lineCount = lines.length;
    var paragraphs = text.split(/\n\s*\n/).filter(function(p){ return p.trim().length > 0; });
    var paragraphCount = paragraphs.length || (text.trim().length > 0 ? 1 : 0);

    // Unique words
    var wordMap = {};
    var uniqueWords = 0;
    var totalWords = wordCount;
    words.forEach(function(w){
      var lower = w.toLowerCase();
      if (wordMap[lower]) {
        wordMap[lower]++;
      } else {
        wordMap[lower] = 1;
        uniqueWords++;
      }
    });

    // Lexical density
    var lexicalDensity = totalWords > 0 ? ((uniqueWords / totalWords) * 100) : 0;

    // Average word length
    var totalCharsInWords = words.reduce(function(sum, w){ return sum + w.length; }, 0);
    var avgWordLength = totalWords > 0 ? (totalCharsInWords / totalWords) : 0;

    // Average sentence length
    var avgSentenceLength = sentenceCount > 0 ? (totalWords / sentenceCount) : 0;

    // Reading time (average 200 words per minute)
    var readingTimeSec = totalWords / 200 * 60;

    // Speaking time (average 130 words per minute)
    var speakingTimeSec = totalWords / 130 * 60;

    // Readability (Flesch Reading Ease)
    var syllables = 0;
    var complexWords = 0;
    var words3Plus = 0;
    words.forEach(function(w){
      var syl = countSyllables(w);
      syllables += syl;
      if (syl >= 3) words3Plus++;
    });

    var fleschEase = 0;
    var fleschGrade = 0;
    if (sentenceCount > 0 && totalWords > 0) {
      fleschEase = 206.835 - 1.015 * (totalWords / sentenceCount) - 84.6 * (syllables / totalWords);
      fleschGrade = 0.39 * (totalWords / sentenceCount) + 11.8 * (syllables / totalWords) - 15.59;
    }

    // Update stats
    setStat('stat-words', wordCount);
    setStat('stat-chars', charCount);
    setStat('stat-chars-nospace', charCountNoSpace);
    setStat('stat-sentences', sentenceCount);
    setStat('stat-paragraphs', paragraphCount);
    setStat('stat-lines', lineCount);
    setStat('stat-unique', uniqueWords);
    setStat('stat-density', lexicalDensity.toFixed(1) + '%');
    setStat('stat-reading-time', formatTime(readingTimeSec));
    setStat('stat-speaking-time', formatTime(speakingTimeSec));
    setStat('stat-avg-word', avgWordLength.toFixed(1));
    setStat('stat-avg-sentence', avgSentenceLength.toFixed(1));

    // Build tab content
    renderReadability(fleschEase, fleschGrade, lexicalDensity, uniqueWords, totalWords, words3Plus);
    renderKeywords(wordMap, totalWords);
    renderLetters(text);
    renderWordList(wordMap);

    // Store data for export
    window._analysisData = {
      words: wordCount,
      characters: charCount,
      charactersNoSpace: charCountNoSpace,
      sentences: sentenceCount,
      paragraphs: paragraphCount,
      lines: lineCount,
      uniqueWords: uniqueWords,
      lexicalDensity: lexicalDensity,
      readingTime: readingTimeSec,
      speakingTime: speakingTimeSec,
      avgWordLength: avgWordLength,
      avgSentenceLength: avgSentenceLength,
      fleschReadingEase: fleschEase,
      fleschKincaidGrade: fleschGrade,
      complexWords: words3Plus,
      wordFrequency: wordMap
    };
  }

  function countSyllables(word){
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    var count = 0;
    var vowels = 'aeiouy';
    var prevIsVowel = false;
    for (var i = 0; i < word.length; i++){
      var isVowel = vowels.indexOf(word[i]) !== -1;
      if (isVowel && !prevIsVowel) count++;
      prevIsVowel = isVowel;
    }
    if (word.endsWith('e')) count--;
    if (word.endsWith('le') && word.length > 2 && vowels.indexOf(word[word.length - 3]) !== -1) count++;
    return Math.max(1, count);
  }

  function renderReadability(fleschEase, fleschGrade, density, unique, total, complex){
    var el = document.getElementById('tab-readability');
    if (!el) return;
    var easeLabel = '';
    if (fleschEase >= 90) easeLabel = 'Very Easy (5th grade)';
    else if (fleschEase >= 80) easeLabel = 'Easy (6th grade)';
    else if (fleschEase >= 70) easeLabel = 'Fairly Easy (7th–8th grade)';
    else if (fleschEase >= 60) easeLabel = 'Plain English (9th–10th grade)';
    else if (fleschEase >= 50) easeLabel = 'Fairly Difficult (11th–12th grade)';
    else if (fleschEase >= 30) easeLabel = 'Difficult (College)';
    else easeLabel = 'Very Difficult (Graduate)';

    el.innerHTML = `
      <div class="details-grid" style="padding:0;">
        <div class="detail-block">
          <div class="detail-block-title">Readability</div>
          <div class="detail-row"><span class="detail-label">Flesch Reading Ease</span><span class="detail-value">${fleschEase.toFixed(1)}</span></div>
          <div class="detail-row"><span class="detail-label">Flesch-Kincaid Grade</span><span class="detail-value">${fleschGrade.toFixed(1)}</span></div>
          <div class="detail-row"><span class="detail-label">Reading Level</span><span class="detail-value">${easeLabel}</span></div>
        </div>
        <div class="detail-block">
          <div class="detail-block-title">Vocabulary</div>
          <div class="detail-row"><span class="detail-label">Total Words</span><span class="detail-value">${total}</span></div>
          <div class="detail-row"><span class="detail-label">Unique Words</span><span class="detail-value">${unique}</span></div>
          <div class="detail-row"><span class="detail-label">Lexical Density</span><span class="detail-value">${density.toFixed(1)}%</span></div>
          <div class="detail-row"><span class="detail-label">Complex Words (3+ syllables)</span><span class="detail-value">${complex}</span></div>
        </div>
      </div>
    `;
  }

  function renderKeywords(wordMap, total){
    var el = document.getElementById('tab-keywords');
    if (!el) return;
    var sorted = Object.entries(wordMap).sort(function(a,b){ return b[1] - a[1]; });
    var top = sorted.slice(0, 20);
    if (top.length === 0) {
      el.innerHTML = '<div class="empty">No words found</div>';
      return;
    }
    var maxCount = top[0][1];
    var html = '<div style="padding:0;">';
    top.forEach(function(item){
      var word = item[0];
      var count = item[1];
      var pct = total > 0 ? ((count / total) * 100) : 0;
      var width = maxCount > 0 ? (count / maxCount * 100) : 0;
      html += `
        <div class="keyword-bar">
          <span class="keyword-name">${word}</span>
          <span class="keyword-count">${count}</span>
          <div class="keyword-track"><div class="keyword-fill" style="width:${width}%"></div></div>
          <span style="color:#7a7a7a;font-size:10px;min-width:40px;">${pct.toFixed(1)}%</span>
        </div>
      `;
    });
    html += '</div>';
    el.innerHTML = html;
  }

  function renderLetters(text){
    var el = document.getElementById('tab-letters');
    if (!el) return;
    var clean = text.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.length === 0) {
      el.innerHTML = '<div class="empty">No letters found</div>';
      return;
    }
    var counts = {};
    for (var i = 0; i < clean.length; i++){
      var c = clean[i];
      counts[c] = (counts[c] || 0) + 1;
    }
    var sorted = Object.keys(counts).sort();
    var html = '<div class="letter-grid" style="padding:0;">';
    sorted.forEach(function(char){
      html += `
        <div class="letter-item">
          <span class="letter-char">${char}</span>
          <span class="letter-count">${counts[char]}</span>
        </div>
      `;
    });
    html += '</div>';
    el.innerHTML = html;
  }

  function renderWordList(wordMap){
    var el = document.getElementById('tab-wordlist');
    if (!el) return;
    var sorted = Object.entries(wordMap).sort(function(a,b){ return b[1] - a[1]; });
    if (sorted.length === 0) {
      el.innerHTML = '<div class="empty">No words found</div>';
      return;
    }
    var html = '<div class="freq-list" style="padding:0;">';
    sorted.forEach(function(item){
      html += `<div class="freq-item"><span class="freq-word">${item[0]}</span><span class="freq-count">${item[1]}</span></div>`;
    });
    html += '</div>';
    el.innerHTML = html;
  }

  // ===== TABS =====
  document.querySelectorAll('.analysis-tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      var target = this.dataset.tab;
      document.querySelectorAll('.analysis-tab').forEach(function(t){ t.classList.remove('active'); });
      this.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(function(p){ p.style.display = 'none'; });
      var panel = document.getElementById('tab-' + target);
      if (panel) panel.style.display = 'block';
    });
  });

  // ===== TEXT INPUT =====
  textarea.addEventListener('input', function(){
    analyzeText(this.value);
  });

  document.getElementById('btn-clear-text').addEventListener('click', function(){
    textarea.value = '';
    analyzeText('');
    showToast('Text cleared', 'success');
  });

  document.getElementById('btn-sample-text').addEventListener('click', function(){
    var sample = "The art of writing is a skill that can be developed and refined over time. Whether you are writing a blog post, an academic paper, or a simple email, the ability to communicate clearly and effectively is essential. Good writing requires practice, patience, and a willingness to revise and improve.\n\nOne of the most important aspects of writing is understanding your audience. Different readers have different expectations and levels of understanding. A technical document written for engineers will use specialized terminology and assume a certain level of background knowledge. On the other hand, a general interest article should be accessible to a wider audience and avoid unnecessary jargon.\n\nAnother key element of effective writing is structure. A well-organized piece of writing guides the reader through your ideas in a logical and coherent manner. This typically involves an introduction that sets the stage, body paragraphs that develop your arguments, and a conclusion that summarizes your main points. Transitions between paragraphs and sections help to maintain the flow of the text.\n\nIn addition to structure, word choice plays a crucial role in how your message is received. Using precise and vivid language can make your writing more engaging and memorable. At the same time, it is important to avoid overly complex or obscure words that might confuse your readers. Strive for clarity and simplicity without sacrificing nuance or depth.\n\nFinally, the revision process is where good writing becomes great. Even experienced writers rarely produce a perfect draft on the first try. Taking the time to review and edit your work can help you catch errors, clarify your ideas, and strengthen your overall argument. Reading your writing aloud is a particularly effective way to identify awkward phrasing or unclear passages.";
    textarea.value = sample;
    analyzeText(sample);
    showToast('Sample text loaded!', 'success');
  });

  // ===== EXPORT FUNCTIONS =====
  function getExportData(){
    var data = window._analysisData;
    if (!data || !data.words) {
      showToast('No text to export. Enter some text first.', 'error');
      return null;
    }
    return data;
  }

  document.getElementById('btn-export-csv').addEventListener('click', function(){
    var data = getExportData();
    if (!data) return;
    var rows = [
      ['Metric', 'Value'],
      ['Words', data.words],
      ['Characters', data.characters],
      ['Characters (no space)', data.charactersNoSpace],
      ['Sentences', data.sentences],
      ['Paragraphs', data.paragraphs],
      ['Lines', data.lines],
      ['Unique Words', data.uniqueWords],
      ['Lexical Density', data.lexicalDensity.toFixed(1) + '%'],
      ['Reading Time', formatTime(data.readingTime)],
      ['Speaking Time', formatTime(data.speakingTime)],
      ['Avg Word Length', data.avgWordLength.toFixed(1)],
      ['Avg Sentence Length', data.avgSentenceLength.toFixed(1)],
      ['Flesch Reading Ease', data.fleschReadingEase.toFixed(1)],
      ['Flesch-Kincaid Grade', data.fleschKincaidGrade.toFixed(1)],
      ['Complex Words (3+ syllables)', data.complexWords]
    ];
    var csv = rows.map(function(r){ return r.join(','); }).join('\n');
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'text-analysis-results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully!', 'success');
  });

  document.getElementById('btn-export-txt').addEventListener('click', function(){
    var data = getExportData();
    if (!data) return;
    var text = 'Text Analysis Results\n';
    text += '='.repeat(50) + '\n\n';
    text += 'Exported: ' + new Date().toLocaleString() + '\n\n';
    text += 'Words:                       ' + data.words + '\n';
    text += 'Characters:                  ' + data.characters + '\n';
    text += 'Characters (no space):       ' + data.charactersNoSpace + '\n';
    text += 'Sentences:                   ' + data.sentences + '\n';
    text += 'Paragraphs:                  ' + data.paragraphs + '\n';
    text += 'Lines:                       ' + data.lines + '\n';
    text += 'Unique Words:                ' + data.uniqueWords + '\n';
    text += 'Lexical Density:             ' + data.lexicalDensity.toFixed(1) + '%\n';
    text += 'Reading Time:                ' + formatTime(data.readingTime) + '\n';
    text += 'Speaking Time:               ' + formatTime(data.speakingTime) + '\n';
    text += 'Avg Word Length:             ' + data.avgWordLength.toFixed(1) + '\n';
    text += 'Avg Sentence Length:         ' + data.avgSentenceLength.toFixed(1) + '\n';
    text += 'Flesch Reading Ease:         ' + data.fleschReadingEase.toFixed(1) + '\n';
    text += 'Flesch-Kincaid Grade Level:  ' + data.fleschKincaidGrade.toFixed(1) + '\n';
    text += 'Complex Words (3+ syllables):' + data.complexWords + '\n';
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'text-analysis-results.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('TXT exported successfully!', 'success');
  });

  document.getElementById('btn-export-json').addEventListener('click', function(){
    var data = getExportData();
    if (!data) return;
    var json = JSON.stringify({
      exported: new Date().toISOString(),
      tool: 'Advanced Word Counter',
      metrics: data
    }, null, 2);
    var blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'text-analysis-results.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('JSON exported successfully!', 'success');
  });

  // ===== INITIAL STATE =====
  analyzeText('');
})();
</script>

