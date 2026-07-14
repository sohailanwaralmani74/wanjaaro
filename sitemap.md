---
layout: main
title: Datafrog Sitemap | Complete Directory of Data Conversion Tools
description: Browse all Datafrog tools including JSON, CSV, Excel, XML, SQL, PDF, YAML, QIF, recordset converters, generators, duplicate removal tools.
keywords: datafrog sitemap, data conversion tools, json tools, csv tools, excel tools, xml tools, sql tools, yaml tools, uuid generator, hash generator, recordset converter
---

<style>

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Header */
  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    font-size: 2.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #45a29e, #66f0e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }

  .page-header p {
    max-width: 700px;
    margin: 0.5rem auto 0;
    color: #a0b3c9;
    font-size: 1.1rem;
  }

  /* Stats */
  .stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    margin: 2rem 0 3rem;
  }

  .stat-item {
    background: #19232e;
    padding: 0.8rem 2rem;
    border-radius: 60px;
    border: 1px solid #2a3a4a;
    text-align: center;
    min-width: 120px;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #45a29e;
    display: block;
    line-height: 1.2;
  }

  .stat-label {
    font-size: 0.85rem;
    color: #8899aa;
  }

  /* Search */
  .search-wrap {
    max-width: 500px;
    margin: 0 auto 2.5rem;
  }

  #search-input {
    width: 100%;
    padding: 0.8rem 1.5rem;
    background: #19232e;
    border: 2px solid #2a3a4a;
    border-radius: 60px;
    color: #e8edf2;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
    outline: none;
  }

  #search-input:focus {
    border-color: #45a29e;
    box-shadow: 0 0 0 4px rgba(69, 162, 158, 0.2);
  }

  #search-input::placeholder {
    color: #6a7f92;
  }

  /* Grid of tool sections */
  .section-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.8rem;
  }

  .section-card {
    background: #141e28;
    border-radius: 16px;
    padding: 1.6rem;
    border: 1px solid #2a3a4a;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
  }

  .section-card:hover {
    transform: translateY(-4px);
    border-color: #45a29e;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  }

  .section-card.hidden {
    display: none;
  }

  .section-card .card-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.4rem;
  }

  .section-card .card-header .icon {
    font-size: 1.8rem;
    line-height: 1;
  }

  .section-card h2 {
    font-size: 1.4rem;
    font-weight: 600;
    color: #e8edf2;
  }

  .section-card .desc {
    color: #8899aa;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #1f2c38;
    padding-bottom: 0.6rem;
  }

  .section-card ul {
    list-style: none;
    flex: 1;
  }

  .section-card li {
    margin-bottom: 0.4rem;
  }

  .section-card a {
    color: #b0c8dd;
    text-decoration: none;
    font-size: 0.95rem;
    display: inline-block;
    transition: color 0.2s, transform 0.2s;
    padding: 0.1rem 0;
    border-bottom: 1px solid transparent;
  }

  .section-card a:hover {
    color: #66f0e0;
    transform: translateX(4px);
    border-bottom-color: #45a29e;
  }

  .section-card .tag {
    display: inline-block;
    margin-top: 1rem;
    background: #1f2c38;
    color: #66f0e0;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.2rem 0.8rem;
    border-radius: 20px;
    align-self: flex-start;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .section-card.featured {
    border-color: #f0b34b;
    background: #1f2a20;
  }

  .section-card.featured h2 {
    color: #f0b34b;
  }

  .section-card.featured .tag {
    background: #f0b34b22;
    color: #f0b34b;
  }

  /* "No results" message */
  #no-results {
    display: none;
    text-align: center;
    color: #8899aa;
    font-size: 1.2rem;
    padding: 3rem 0;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .page-header h1 {
      font-size: 2rem;
    }
    .stats {
      gap: 1rem;
    }
    .stat-item {
      padding: 0.5rem 1rem;
      min-width: 80px;
    }
    .stat-number {
      font-size: 1.5rem;
    }
    .section-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<div class="container">
  <!-- Header -->
  <div class="page-header">
    <h1>🗺️ Datafrog Sitemap</h1>
    <p>A complete directory of 60+ data tools for developers, analysts, and business users. Convert formats, clean duplicates, and generate code—all locally, without uploading sensitive data. Free, offline-first, and no sign-up required.</p>
  </div>

  <!-- Stats -->
  <div class="stats">
    <div class="stat-item">
      <span class="stat-number">60+</span>
      <span class="stat-label">Conversion Tools</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">10+</span>
      <span class="stat-label">Data Formats</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">100%</span>
      <span class="stat-label">Free to Use</span>
    </div>
  </div>

  <!-- Search -->
  <div class="search-wrap">
    <input type="text" id="search-input" placeholder="🔍 Filter tools by name or category..." autocomplete="off">
  </div>

  <!-- Tool Sections -->
  <div class="section-grid" id="section-grid">
    <!-- Featured Tools -->
    <section class="section-card featured" data-category="featured">
      <div class="card-header">
        <span class="icon">🚀</span>
        <h2>Featured Tools</h2>
      </div>
      <div class="desc">Most popular and frequently used converters</div>
      <ul>
        <li><a href="/uuid-generator">UUID Generator</a></li>
        <li><a href="/json-minify-prettify">JSON Minify &amp; Prettify</a></li>
        <li><a href="/json-to-csv">JSON To CSV Converter</a></li>
        <li><a href="/json-to-xml">JSON To XML Converter</a></li>
        <li><a href="/hash-generator">Hash Generator</a></li>
        <li><a href="/rem-px-converter">REM to PX Converter</a></li>
      </ul>
      <span class="tag">Most Used</span>
    </section>

    <!-- JSON Tools -->
    <section class="section-card" data-category="json">
      <div class="card-header">
        <span class="icon">📋</span>
        <h2>JSON Tools</h2>
      </div>
      <div class="desc">Convert, validate, and transform JSON data</div>
      <ul>
        <li><a href="/json-minify-prettify">JSON Minify &amp; Prettify</a></li>
        <li><a href="/json-string-to-json-object">JSON String To Object</a></li>
        <li><a href="/json-to-c-sharp">JSON To C#</a></li>
        <li><a href="/json-to-csv">JSON To CSV</a></li>
        <li><a href="/json-to-dart">JSON To Dart</a></li>
        <li><a href="/json-to-excel">JSON To Excel</a></li>
        <li><a href="/json-to-go">JSON To Go</a></li>
        <li><a href="/json-to-html">JSON To HTML</a></li>
        <li><a href="/json-to-java">JSON To Java</a></li>
        <li><a href="/json-to-json-schema">JSON To Schema</a></li>
        <li><a href="/json-to-pdf">JSON To PDF</a></li>
        <li><a href="/json-to-sql">JSON To SQL</a></li>
        <li><a href="/json-to-ts">JSON To TypeScript</a></li>
        <li><a href="/json-to-txt">JSON To TXT</a></li>
        <li><a href="/json-to-xml">JSON To XML</a></li>
        <li><a href="/json-to-yaml">JSON To YAML</a></li>
      </ul>
      <span class="tag">16 Tools</span>
    </section>

    <!-- CSV Tools -->
    <section class="section-card" data-category="csv">
      <div class="card-header">
        <span class="icon">📊</span>
        <h2>CSV Tools</h2>
      </div>
      <div class="desc">Process and convert CSV spreadsheet data</div>
      <ul>
        <li><a href="/convert-csv-to-excel">CSV To Excel</a></li>
        <li><a href="/convert-csv-to-html">CSV To HTML</a></li>
        <li><a href="/convert-csv-to-json">CSV To JSON</a></li>
        <li><a href="/convert-csv-to-pdf">CSV To PDF</a></li>
        <li><a href="/convert-csv-to-txt">CSV To TXT</a></li>
        <li><a href="/convert-csv-to-xml">CSV To XML</a></li>
        <li><a href="/csv-to-sql">CSV To SQL</a></li>
        <li><a href="/remove-csv-duplicates">Remove CSV Duplicates</a></li>
      </ul>
      <span class="tag">8 Tools</span>
    </section>

    <!-- Excel Tools -->
    <section class="section-card" data-category="excel">
      <div class="card-header">
        <span class="icon">📈</span>
        <h2>Excel &amp; XLSX Tools</h2>
      </div>
      <div class="desc">Work with Excel spreadsheets and XLSX files</div>
      <ul>
        <li><a href="/convert-xlsx-to-csv">XLSX To CSV</a></li>
        <li><a href="/convert-xlsx-to-xml">XLSX To XML</a></li>
        <li><a href="/excel-to-html">Excel To HTML</a></li>
        <li><a href="/excel-to-json">Excel To JSON</a></li>
        <li><a href="/excel-to-txt">Excel To TXT</a></li>
        <li><a href="/remove-excel-duplicates">Remove Excel Duplicates</a></li>
        <li><a href="/xlsx-to-pdf">XLSX To PDF</a></li>
        <li><a href="/xlsx-to-sql-converter">XLSX To SQL</a></li>
      </ul>
      <span class="tag">8 Tools</span>
    </section>

    <!-- XML, SQL & Data Tools -->
    <section class="section-card" data-category="xml-sql">
      <div class="card-header">
        <span class="icon">🗄️</span>
        <h2>XML, SQL &amp; Data</h2>
      </div>
      <div class="desc">Advanced data transformation and database tools</div>
      <ul>
        <li><a href="/xml-to-json">XML To JSON</a></li>
        <li><a href="/xml-to-xsd-generator">XML To XSD Generator</a></li>
        <li><a href="/sql-to-csv">SQL To CSV</a></li>
        <li><a href="/sql-to-excel">SQL To Excel</a></li>
        <li><a href="/sql-to-xml">SQL To XML</a></li>
        <li><a href="/remove-duplicates-in-sql">Remove SQL Duplicates</a></li>
        <li><a href="/recordset-converter">Recordset Converter</a></li>
        <li><a href="/yaml-to-json">YAML To JSON</a></li>
      </ul>
      <span class="tag">8 Tools</span>
    </section>

    <!-- Financial Tools -->
    <section class="section-card" data-category="financial">
      <div class="card-header">
        <span class="icon">💰</span>
        <h2>Financial Tools</h2>
      </div>
      <div class="desc">Convert financial data formats (QIF, QBO)</div>
      <ul>
        <li><a href="/qif-to-csv">QIF To CSV</a></li>
        <li><a href="/qif-to-excel">QIF To Excel</a></li>
        <li><a href="/qif-to-qbo">QIF To QBO</a></li>
      </ul>
      <span class="tag">3 Tools</span>
    </section>

    <!-- PDF & Presentation -->
    <section class="section-card" data-category="pdf">
      <div class="card-header">
        <span class="icon">📄</span>
        <h2>PDF &amp; Presentation</h2>
      </div>
      <div class="desc">Convert between PDFs and presentations</div>
      <ul>
        <li><a href="/pdf-to-powerpoint">PDF To PowerPoint</a></li>
        <li><a href="/pptx-to-pdf">PPTX To PDF</a></li>
      </ul>
      <span class="tag">2 Tools</span>
    </section>

    <!-- Developer Tools -->
    <section class="section-card" data-category="developer">
      <div class="card-header">
        <span class="icon">👨‍💻</span>
        <h2>Developer Tools</h2>
      </div>
      <div class="desc">Utilities for developers and programmers</div>
      <ul>
        <li><a href="/uuid-generator">UUID Generator (v4, v5, v1)</a></li>
        <li><a href="/hash-generator">Hash Generator (MD5, SHA)</a></li>
        <li><a href="/base64">Base64 Encoder &amp; Decoder</a></li>
        <li><a href="/jwt-decoder">JWT Decoder</a></li>
      </ul>
      <span class="tag">3 Tools</span>
    </section>

    <!-- Guides -->
    <section class="section-card" data-category="guides">
      <div class="card-header">
        <span class="icon">📚</span>
        <h2>How‑To Guides</h2>
      </div>
      <div class="desc">Step‑by‑step tutorials and conversion guides</div>
      <ul>
        <li><a href="/how-to-convert-json-to-csv">How To Convert JSON To CSV</a></li>
        <li><a href="/how-to-convert-json-to-pdf">How To Convert JSON To PDF</a></li>
        <li><a href="/how-to-convert-json-to-xml">How To Convert JSON To XML</a></li>
        <li><a href="/how-to-open-json-file-in-excel">How To Open JSON in Excel</a></li>
      </ul>
      <span class="tag">4 Guides</span>
    </section>

    <!-- Company Pages -->
    <section class="section-card" data-category="company">
      <div class="card-header">
        <span class="icon">🏢</span>
        <h2>Company Pages</h2>
      </div>
      <div class="desc">Information about Datafrog and policies</div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about-us">About Us</a></li>
        <li><a href="/contact-us">Contact Us</a></li>
        <li><a href="/privacy-policy">Privacy Policy</a></li>
        <li><a href="/terms-of-service">Terms of Service</a></li>
      </ul>
      <span class="tag">6 Pages</span>
    </section>

    <!-- Contributors -->
    <section class="section-card" data-category="contributors">
      <div class="card-header">
        <span class="icon">✍️</span>
        <h2>Contributors</h2>
      </div>
      <div class="desc">Meet the team behind Datafrog</div>
      <ul>
        <li><a href="/sohail-anwar">Sohail Anwar</a></li>
        <li><a href="/saeed-ahmed">Saeed Ahmed</a></li>
        <li><a href="/gourav-mishra">Gourav Mishra</a></li>
      </ul>
      <span class="tag">3 Contributors</span>
    </section>
  </div>

  <!-- No results message -->
  <div id="no-results">😕 No tools match your filter.</div>
</div>

<script>
  (function() {
    const searchInput = document.getElementById('search-input');
    const cards = document.querySelectorAll('.section-card');
    const noResults = document.getElementById('no-results');

    function filterCards() {
      const query = searchInput.value.toLowerCase().trim();
      let visibleCount = 0;

      cards.forEach(card => {
        // Get all link text and category data
        const links = card.querySelectorAll('a');
        const category = card.getAttribute('data-category') || '';
        let match = false;

        // Search in link text
        links.forEach(link => {
          if (link.textContent.toLowerCase().includes(query)) {
            match = true;
          }
        });

        // Also search in category (like "json", "csv")
        if (category.toLowerCase().includes(query)) {
          match = true;
        }

        if (match || query === '') {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    searchInput.addEventListener('input', filterCards);
    // Initial state – show all
    filterCards();
  })();
</script>

<!-- Microdata and structured data remain the same (you can add them below) -->
<!-- Structured Data for Search Engines -->