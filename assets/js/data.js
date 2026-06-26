// ============================================================
// WANJAARO — MASTER DATA FILE
// All data as plain JavaScript arrays and objects
// ============================================================

// ─── CURRENCIES ───────────────────────────────────────────────
window.currencies = [
  { code: "AED", numeric: "784", name: "United Arab Emirates Dirham", symbol: "د.إ" },
  { code: "AFN", numeric: "971", name: "Afghan Afghani", symbol: "؋" },
  { code: "ALL", numeric: "008", name: "Albanian Lek", symbol: "L" },
  { code: "AMD", numeric: "051", name: "Armenian Dram", symbol: "֏" },
  { code: "ANG", numeric: "532", name: "Netherlands Antillean Guilder", symbol: "ƒ" },
  { code: "AOA", numeric: "973", name: "Angolan Kwanza", symbol: "Kz" },
  { code: "ARS", numeric: "032", name: "Argentine Peso", symbol: "$" },
  { code: "AUD", numeric: "036", name: "Australian Dollar", symbol: "A$" },
  { code: "AWG", numeric: "533", name: "Aruban Florin", symbol: "ƒ" },
  { code: "AZN", numeric: "944", name: "Azerbaijani Manat", symbol: "₼" },
  { code: "BAM", numeric: "977", name: "Bosnia-Herzegovina Convertible Mark", symbol: "КМ" },
  { code: "BBD", numeric: "052", name: "Barbadian Dollar", symbol: "$" },
  { code: "BDT", numeric: "050", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "BGN", numeric: "975", name: "Bulgarian Lev", symbol: "лв." },
  { code: "BHD", numeric: "048", name: "Bahraini Dinar", symbol: ".د.ب" },
  { code: "BIF", numeric: "108", name: "Burundian Franc", symbol: "FBu" },
  { code: "BMD", numeric: "060", name: "Bermudian Dollar", symbol: "$" },
  { code: "BND", numeric: "096", name: "Brunei Dollar", symbol: "B$" },
  { code: "BOB", numeric: "068", name: "Bolivian Boliviano", symbol: "Bs." },
  { code: "BRL", numeric: "986", name: "Brazilian Real", symbol: "R$" },
  { code: "BSD", numeric: "044", name: "Bahamian Dollar", symbol: "$" },
  { code: "BTN", numeric: "064", name: "Bhutanese Ngultrum", symbol: "Nu." },
  { code: "BWP", numeric: "072", name: "Botswana Pula", symbol: "P" },
  { code: "BYN", numeric: "933", name: "Belarusian Ruble", symbol: "Br" },
  { code: "BZD", numeric: "084", name: "Belize Dollar", symbol: "$" },
  { code: "CAD", numeric: "124", name: "Canadian Dollar", symbol: "CA$" },
  { code: "CDF", numeric: "976", name: "Congolese Franc", symbol: "FC" },
  { code: "CHF", numeric: "756", name: "Swiss Franc", symbol: "CHF" },
  { code: "CLP", numeric: "152", name: "Chilean Peso", symbol: "$" },
  { code: "CNY", numeric: "156", name: "Chinese Yuan", symbol: "¥" },
  { code: "COP", numeric: "170", name: "Colombian Peso", symbol: "$" },
  { code: "CRC", numeric: "188", name: "Costa Rican Colón", symbol: "₡" },
  { code: "CUP", numeric: "192", name: "Cuban Peso", symbol: "$" },
  { code: "CVE", numeric: "132", name: "Cape Verdean Escudo", symbol: "$" },
  { code: "CZK", numeric: "203", name: "Czech Koruna", symbol: "Kč" },
  { code: "DJF", numeric: "262", name: "Djiboutian Franc", symbol: "Fdj" },
  { code: "DKK", numeric: "208", name: "Danish Krone", symbol: "kr." },
  { code: "DOP", numeric: "214", name: "Dominican Peso", symbol: "RD$" },
  { code: "DZD", numeric: "012", name: "Algerian Dinar", symbol: "د.ج" },
  { code: "EGP", numeric: "818", name: "Egyptian Pound", symbol: "£" },
  { code: "ERN", numeric: "232", name: "Eritrean Nakfa", symbol: "Nfk" },
  { code: "ETB", numeric: "230", name: "Ethiopian Birr", symbol: "Br" },
  { code: "EUR", numeric: "978", name: "Euro", symbol: "€" },
  { code: "FJD", numeric: "242", name: "Fijian Dollar", symbol: "$" },
  { code: "FKP", numeric: "238", name: "Falkland Islands Pound", symbol: "£" },
  { code: "GBP", numeric: "826", name: "British Pound Sterling", symbol: "£" },
  { code: "GEL", numeric: "981", name: "Georgian Lari", symbol: "₾" },
  { code: "GGP", numeric: "831", name: "Guernsey Pound", symbol: "£" },
  { code: "GHS", numeric: "936", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "GIP", numeric: "292", name: "Gibraltar Pound", symbol: "£" },
  { code: "GMD", numeric: "270", name: "Gambian Dalasi", symbol: "D" },
  { code: "GNF", numeric: "324", name: "Guinean Franc", symbol: "FG" },
  { code: "GTQ", numeric: "320", name: "Guatemalan Quetzal", symbol: "Q" },
  { code: "GYD", numeric: "328", name: "Guyanese Dollar", symbol: "$" },
  { code: "HKD", numeric: "344", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "HNL", numeric: "340", name: "Honduran Lempira", symbol: "L" },
  { code: "HRK", numeric: "191", name: "Croatian Kuna", symbol: "kn" },
  { code: "HTG", numeric: "332", name: "Haitian Gourde", symbol: "G" },
  { code: "HUF", numeric: "348", name: "Hungarian Forint", symbol: "Ft" },
  { code: "IDR", numeric: "360", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "ILS", numeric: "376", name: "Israeli New Shekel", symbol: "₪" },
  { code: "IMP", numeric: "833", name: "Isle of Man Pound", symbol: "£" },
  { code: "INR", numeric: "356", name: "Indian Rupee", symbol: "$" },
  { code: "IQD", numeric: "368", name: "Iraqi Dinar", symbol: "د.ع" },
  { code: "IRR", numeric: "364", name: "Iranian Rial", symbol: "﷼" },
  { code: "ISK", numeric: "352", name: "Icelandic Króna", symbol: "kr" },
  { code: "JMD", numeric: "388", name: "Jamaican Dollar", symbol: "$" },
  { code: "JOD", numeric: "400", name: "Jordanian Dinar", symbol: "د.ا" },
  { code: "JPY", numeric: "392", name: "Japanese Yen", symbol: "¥" },
  { code: "KES", numeric: "404", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "KGS", numeric: "417", name: "Kyrgyzstani Som", symbol: "с" },
  { code: "KHR", numeric: "116", name: "Cambodian Riel", symbol: "៛" },
  { code: "KMF", numeric: "174", name: "Comorian Franc", symbol: "FC" },
  { code: "KPW", numeric: "408", name: "North Korean Won", symbol: "₩" },
  { code: "KRW", numeric: "410", name: "South Korean Won", symbol: "₩" },
  { code: "KWD", numeric: "414", name: "Kuwaiti Dinar", symbol: "د.ك" },
  { code: "KYD", numeric: "136", name: "Cayman Islands Dollar", symbol: "$" },
  { code: "KZT", numeric: "398", name: "Kazakhstani Tenge", symbol: "₸" },
  { code: "LAK", numeric: "418", name: "Lao Kip", symbol: "₭" },
  { code: "LBP", numeric: "422", name: "Lebanese Pound", symbol: "ل.ل" },
  { code: "LKR", numeric: "144", name: "Sri Lankan Rupee", symbol: "Rs" },
  { code: "LRD", numeric: "430", name: "Liberian Dollar", symbol: "$" },
  { code: "LSL", numeric: "426", name: "Lesotho Loti", symbol: "L" },
  { code: "LYD", numeric: "434", name: "Libyan Dinar", symbol: "ل.د" },
  { code: "MAD", numeric: "504", name: "Moroccan Dirham", symbol: "د.م." },
  { code: "MDL", numeric: "498", name: "Moldovan Leu", symbol: "L" },
  { code: "MGA", numeric: "969", name: "Malagasy Ariary", symbol: "Ar" },
  { code: "MKD", numeric: "807", name: "Macedonian Denar", symbol: "ден" },
  { code: "MMK", numeric: "104", name: "Myanmar Kyat", symbol: "K" },
  { code: "MNT", numeric: "496", name: "Mongolian Tögrög", symbol: "₮" },
  { code: "MOP", numeric: "446", name: "Macanese Pataca", symbol: "MOP$" },
  { code: "MRU", numeric: "929", name: "Mauritanian Ouguiya", symbol: "UM" },
  { code: "MUR", numeric: "480", name: "Mauritian Rupee", symbol: "₨" },
  { code: "MVR", numeric: "462", name: "Maldivian Rufiyaa", symbol: "ރ." },
  { code: "MWK", numeric: "454", name: "Malawian Kwacha", symbol: "MK" },
  { code: "MXN", numeric: "484", name: "Mexican Peso", symbol: "$" },
  { code: "MYR", numeric: "458", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "MZN", numeric: "943", name: "Mozambican Metical", symbol: "MTn" },
  { code: "NAD", numeric: "516", name: "Namibian Dollar", symbol: "$" },
  { code: "NGN", numeric: "566", name: "Nigerian Naira", symbol: "₦" },
  { code: "NIO", numeric: "558", name: "Nicaraguan Córdoba", symbol: "C$" },
  { code: "NOK", numeric: "578", name: "Norwegian Krone", symbol: "kr" },
  { code: "NPR", numeric: "524", name: "Nepalese Rupee", symbol: "रू" },
  { code: "NZD", numeric: "554", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "OMR", numeric: "512", name: "Omani Rial", symbol: "ر.ع." },
  { code: "PAB", numeric: "590", name: "Panamanian Balboa", symbol: "B/." },
  { code: "PEN", numeric: "604", name: "Peruvian Sol", symbol: "S/" },
  { code: "PGK", numeric: "598", name: "Papua New Guinean Kina", symbol: "K" },
  { code: "PHP", numeric: "608", name: "Philippine Peso", symbol: "₱" },
  { code: "PKR", numeric: "586", name: "Pakistani Rupee", symbol: "₨" },
  { code: "PLN", numeric: "985", name: "Polish Złoty", symbol: "zł" },
  { code: "PYG", numeric: "600", name: "Paraguayan Guaraní", symbol: "₲" },
  { code: "QAR", numeric: "634", name: "Qatari Riyal", symbol: "ر.ق" },
  { code: "RON", numeric: "946", name: "Romanian Leu", symbol: "lei" },
  { code: "RSD", numeric: "941", name: "Serbian Dinar", symbol: "дин." },
  { code: "RUB", numeric: "643", name: "Russian Ruble", symbol: "₽" },
  { code: "RWF", numeric: "646", name: "Rwandan Franc", symbol: "FRw" },
  { code: "SAR", numeric: "682", name: "Saudi Riyal", symbol: "ر.س" },
  { code: "SBD", numeric: "090", name: "Solomon Islands Dollar", symbol: "$" },
  { code: "SCR", numeric: "690", name: "Seychellois Rupee", symbol: "₨" },
  { code: "SDG", numeric: "938", name: "Sudanese Pound", symbol: "ج.س." },
  { code: "SEK", numeric: "752", name: "Swedish Krona", symbol: "kr" },
  { code: "SGD", numeric: "702", name: "Singapore Dollar", symbol: "S$" },
  { code: "SHP", numeric: "654", name: "Saint Helena Pound", symbol: "£" },
  { code: "SLL", numeric: "694", name: "Sierra Leonean Leone", symbol: "Le" },
  { code: "SOS", numeric: "706", name: "Somali Shilling", symbol: "Sh" },
  { code: "SRD", numeric: "968", name: "Surinamese Dollar", symbol: "$" },
  { code: "SSP", numeric: "728", name: "South Sudanese Pound", symbol: "£" },
  { code: "STN", numeric: "930", name: "São Tomé and Príncipe Dobra", symbol: "Db" },
  { code: "SYP", numeric: "760", name: "Syrian Pound", symbol: "£S" },
  { code: "SZL", numeric: "748", name: "Swazi Lilangeni", symbol: "E" },
  { code: "THB", numeric: "764", name: "Thai Baht", symbol: "฿" },
  { code: "TJS", numeric: "972", name: "Tajikistani Somoni", symbol: "SM" },
  { code: "TMT", numeric: "934", name: "Turkmenistani Manat", symbol: "m" },
  { code: "TND", numeric: "788", name: "Tunisian Dinar", symbol: "د.ت" },
  { code: "TOP", numeric: "776", name: "Tongan Paʻanga", symbol: "T$" },
  { code: "TRY", numeric: "949", name: "Turkish Lira", symbol: "₺" },
  { code: "TTD", numeric: "780", name: "Trinidad and Tobago Dollar", symbol: "TT$" },
  { code: "TWD", numeric: "901", name: "New Taiwan Dollar", symbol: "NT$" },
  { code: "TZS", numeric: "834", name: "Tanzanian Shilling", symbol: "TSh" },
  { code: "UAH", numeric: "980", name: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "UGX", numeric: "800", name: "Ugandan Shilling", symbol: "USh" },
  { code: "USD", numeric: "840", name: "United States Dollar", symbol: "$" },
  { code: "UYU", numeric: "858", name: "Uruguayan Peso", symbol: "$U" },
  { code: "UZS", numeric: "860", name: "Uzbekistani Som", symbol: "soʻm" },
  { code: "VES", numeric: "928", name: "Venezuelan Bolívar", symbol: "Bs.S" },
  { code: "VND", numeric: "704", name: "Vietnamese Đồng", symbol: "₫" },
  { code: "VUV", numeric: "548", name: "Vanuatu Vatu", symbol: "VT" },
  { code: "WST", numeric: "882", name: "Samoan Tālā", symbol: "T" },
  { code: "XAF", numeric: "950", name: "Central African CFA Franc", symbol: "FCFA" },
  { code: "XCD", numeric: "951", name: "East Caribbean Dollar", symbol: "EC$" },
  { code: "XOF", numeric: "952", name: "West African CFA Franc", symbol: "CFA" },
  { code: "XPF", numeric: "953", name: "CFP Franc", symbol: "F" },
  { code: "YER", numeric: "886", name: "Yemeni Rial", symbol: "﷼" },
  { code: "ZAR", numeric: "710", name: "South African Rand", symbol: "R" },
  { code: "ZMW", numeric: "967", name: "Zambian Kwacha", symbol: "ZK" },
  // Crypto (optional)
  { code: "BTC", numeric: "000", name: "Bitcoin", symbol: "₿" },
  { code: "ETH", numeric: "000", name: "Ethereum", symbol: "Ξ" },
  { code: "USDT", numeric: "000", name: "Tether", symbol: "₮" },
  { code: "SOL", numeric: "000", name: "Solana", symbol: "◎" }
];

// ─── TOOLS ─────────────────────────────────────────────────────
window.tools = [
  // Finance: Investing
  { title: "Compound Interest Calculator", url: "/compound-interest-calculator", category: "investing" },
  { title: "CAGR Calculator", url: "/cagr-calculator", category: "investing" },
  { title: "ROI Calculator", url: "/roi-calculator", category: "investing" },
  { title: "Investment Return Calculator", url: "/investment-return-calculator", category: "investing" },
  { title: "Future Value Calculator", url: "/future-value-calculator", category: "investing" },
  { title: "Present Value Calculator", url: "/present-value-calculator", category: "investing" },
  { title: "Inflation Calculator", url: "/inflation-calculator", category: "investing" },
  { title: "Dollar Cost Averaging Calculator", url: "/dollar-cost-averaging-calculator", category: "investing" },
  { title: "SIP Return Calculator", url: "/sip-return-calculator", category: "investing" },
  { title: "Lump Sum vs SIP Calculator", url: "/lump-sum-vs-sip-calculator", category: "investing" },
  { title: "Inflation Adjusted Return Calculator", url: "/inflation-adjusted-return-calculator", category: "investing" },
  { title: "Rule of 72 Calculator", url: "/rule-of-72-calculator", category: "investing" },
  { title: "Dividend Yield Calculator", url: "/dividend-yield-calculator", category: "investing" },
  { title: "Stock Return Calculator", url: "/stock-return-calculator", category: "investing" },
  { title: "Asset Allocation Planner", url: "/asset-allocation-planner", category: "investing" },

  // Finance: Debt & Loans
  { title: "Loan Calculator", url: "/loan-calculator", category: "loans" },
  { title: "EMI Calculator", url: "/emi-calculator", category: "loans" },
  { title: "Mortgage Calculator", url: "/mortgage-calculator", category: "loans" },
  { title: "Debt Payoff Calculator", url: "/debt-payoff-calculator", category: "loans" },
  { title: "Avalanche vs Snowball Calculator", url: "/avalanche-vs-snowball-calculator", category: "loans" },
  { title: "Credit Card Payoff Calculator", url: "/credit-card-payoff-calculator", category: "loans" },
  { title: "Interest Calculator", url: "/interest-calculator", category: "loans" },
  { title: "Amortization Calculator", url: "/amortization-calculator", category: "loans" },
  { title: "Fixed vs ARM Calculator", url: "/fixed-vs-arm-calculator", category: "loans" },
  { title: "Student Loan Payoff Calculator", url: "/student-loan-payoff-calculator", category: "loans" },
  { title: "IDR vs Standard Repayment", url: "/idr-vs-standard-repayment", category: "loans" },

  // Finance: Budget & Wealth
  { title: "Budget Calculator", url: "/budget-calculator", category: "budget" },
  { title: "50/30/20 Calculator", url: "/50-30-20-calculator", category: "budget" },
  { title: "Net Worth Calculator", url: "/net-worth-calculator", category: "budget" },
  { title: "Savings Goal Calculator", url: "/savings-goal-calculator", category: "budget" },
  { title: "Emergency Fund Calculator", url: "/emergency-fund-calculator", category: "budget" },
  { title: "FIRE Calculator", url: "/fire-calculator", category: "budget" },
  { title: "Retirement Calculator", url: "/retirement-calculator", category: "budget" },
  { title: "FIRE Number Calculator", url: "/fire-number-calculator", category: "budget" },
  { title: "Retirement Corpus Calculator", url: "/retirement-corpus-calculator", category: "budget" },
  { title: "Safe Withdrawal Rate Calculator", url: "/safe-withdrawal-rate-calculator", category: "budget" },
  { title: "401k Growth Projector", url: "/401k-growth-projector", category: "budget" },
  { title: "Roth vs Traditional 401k", url: "/roth-vs-traditional-401k", category: "budget" },

  // Finance: Tax & Income
  { title: "Income Tax Calculator", url: "/income-tax-calculator", category: "tax" },
  { title: "Salary Calculator", url: "/salary-calculator", category: "tax" },
  { title: "Bring Home Pay Calculator", url: "/birng-home-pay-calculator", category: "tax" },
  { title: "Hourly to Salary Calculator", url: "/hourly-to-salary-calculator", category: "tax" },
  { title: "Tax Bracket Calculator", url: "/tax-bracket-calculator", category: "tax" },
  { title: "Capital Gains Calculator", url: "/capital-gains-calculator", category: "tax" },

  // Banking: Credit
  { title: "Credit Score Simulator", url: "/credit-score-simulator", category: "credit" },
  { title: "Credit Utilization Calculator", url: "/credit-utilization-calculator", category: "credit" },
  { title: "Debt-to-Income Calculator", url: "/debt-to-income-calculator", category: "credit" },
  { title: "Credit Card Interest Calculator", url: "/credit-card-interest-calculator", category: "credit" },

  // Banking: Credit Cards
  { title: "Cashback vs Points Calculator", url: "/cashback-vs-points-calculator", category: "cards" },
  { title: "Credit Card Rewards Calculator", url: "/credit-card-rewards-calculator", category: "cards" },
  { title: "Annual Fee Break Even Calculator", url: "/annual-fee-break-even-calculator", category: "cards" },
  { title: "Balance Transfer Calculator", url: "/balance-transfer-calculator", category: "cards" },

  // Banking: Savings & Deposits
  { title: "APY Calculator", url: "/apy-calculator", category: "savings" },
  { title: "Savings Calculator", url: "/savings-calculator", category: "savings" },
  { title: "CD Calculator", url: "/cd-calculator", category: "savings" },
  { title: "Compound Savings Calculator", url: "/compound-savings-calculator", category: "savings" },

  // Banking: Banking Decisions
  { title: "Checking vs Savings Calculator", url: "/checking-vs-savings-calculator", category: "banking" },
  { title: "Simple vs Compound Interest", url: "/simple-vs-compound-interest", category: "banking" },
  { title: "Bank Account Comparison Calculator", url: "/bank-account-comparison-calculator", category: "banking" },

  // Business: Planning
  { title: "Startup Cost Calculator", url: "/startup-cost-calculator", category: "planning" },
  { title: "Break Even Calculator", url: "/break-even-calculator", category: "planning" },
  { title: "Profit Calculator", url: "/profit-calculator", category: "planning" },
  { title: "Revenue Calculator", url: "/revenue-calculator", category: "planning" },

  // Business: Pricing
  { title: "Profit Margin Calculator", url: "/profit-margin-calculator", category: "pricing" },
  { title: "Markup Calculator", url: "/markup-calculator", category: "pricing" },
  { title: "Discount Calculator", url: "/discount-calculator", category: "pricing" },
  { title: "Wholesale Price Calculator", url: "/wholesale-price-calculator", category: "pricing" },

  // Business: Freelance & Income
  { title: "Freelancer Rate Calculator", url: "/freelancer-rate-calculator", category: "freelance" },
  { title: "Hourly Rate Calculator", url: "/hourly-rate-calculator", category: "freelance" },
  { title: "Invoice Calculator", url: "/invoice-calculator", category: "freelance" },
  { title: "Project Cost Calculator", url: "/project-cost-calculator", category: "freelance" },

  // Business: SaaS / Online Business
  { title: "MRR Calculator", url: "/mrr-calculator", category: "saas" },
  { title: "ARR Calculator", url: "/arr-calculator", category: "saas" },
  { title: "Churn Calculator", url: "/churn-calculator", category: "saas" },
  { title: "LTV Calculator", url: "/ltv-calculator", category: "saas" },
  { title: "CAC Calculator", url: "/cac-calculator", category: "saas" },

  // Insurance: Life
  { title: "Life Insurance Calculator", url: "/life-insurance-calculator", category: "life" },
  { title: "Coverage Calculator", url: "/coverage-calculator", category: "life" },
  { title: "Income Replacement Calculator", url: "/income-replacement-calculator", category: "life" },

  // Insurance: Health
  { title: "Premium Calculator", url: "/premium-calculator", category: "health-insurance" },
  { title: "Deductible Calculator", url: "/deductible-calculator", category: "health-insurance" },
  { title: "Out of Pocket Calculator", url: "/out-of-pocket-calculator", category: "health-insurance" },

  // Insurance: Vehicle
  { title: "Car Insurance Calculator", url: "/car-insurance-calculator", category: "vehicle-insurance" },
  { title: "Coverage Calculator", url: "/coverage-calculator-vehicle", category: "vehicle-insurance" },
  { title: "Deductible Comparison", url: "/deductible-comparison", category: "vehicle-insurance" },

  // Insurance: Property
  { title: "Home Insurance Calculator", url: "/home-insurance-calculator", category: "property-insurance" },
  { title: "Renters Insurance Calculator", url: "/renters-insurance-calculator", category: "property-insurance" },

  // Automotive: Car Buying
  { title: "Car Loan Calculator", url: "/car-loan-calculator", category: "car-buying" },
  { title: "Lease vs Buy Calculator", url: "/lease-vs-buy-calculator", category: "car-buying" },
  { title: "Affordability Calculator", url: "/affordability-calculator", category: "car-buying" },

  // Automotive: Running Costs
  { title: "Fuel Cost Calculator", url: "/fuel-cost-calculator", category: "running-costs" },
  { title: "Maintenance Cost Calculator", url: "/maintenance-cost-calculator", category: "running-costs" },
  { title: "Total Cost of Ownership", url: "/total-cost-of-ownership", category: "running-costs" },

  // Automotive: EV
  { title: "EV Charging Cost Calculator", url: "/ev-charging-cost-calculator", category: "ev" },
  { title: "EV Savings Calculator", url: "/ev-savings-calculator", category: "ev" },
  { title: "EV Range Calculator", url: "/ev-range-calculator", category: "ev" },

  // Automotive: Depreciation
  { title: "Car Depreciation Calculator", url: "/car-depreciation-calculator", category: "depreciation" },
  { title: "Resale Value Calculator", url: "/resale-value-calculator", category: "depreciation" },

  // Extra: Real Estate
  { title: "Rental Yield Calculator", url: "/rental-yield-calculator", category: "real-estate" },
  { title: "Cap Rate Calculator", url: "/cap-rate-calculator", category: "real-estate" },
  { title: "BRRRR Analyzer", url: "/brrrr-analyzer", category: "real-estate" },

  // Extra: Currency
  { title: "Currency Converter", url: "/currency-converter", category: "investing" }
];

// ─── CATEGORIES ──────────────────────────────────────────────
window.categories = [
  {
    id: "finance",
    name: "Finance",
    icon: "💰",
    subcategories: [
      { id: "investing", name: "Investing" },
      { id: "loans", name: "Debt & Loans" },
      { id: "budget", name: "Budget & Wealth" },
      { id: "tax", name: "Tax & Income" }
    ]
  },
  {
    id: "banking",
    name: "Banking",
    icon: "💳",
    subcategories: [
      { id: "credit", name: "Credit" },
      { id: "cards", name: "Credit Cards" },
      { id: "savings", name: "Savings & Deposits" },
      { id: "banking", name: "Banking Decisions" }
    ]
  },
  {
    id: "business",
    name: "Business",
    icon: "🏢",
    subcategories: [
      { id: "planning", name: "Business Planning" },
      { id: "pricing", name: "Pricing" },
      { id: "freelance", name: "Freelance & Income" },
      { id: "saas", name: "SaaS / Online Business" }
    ]
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: "🛡️",
    subcategories: [
      { id: "life", name: "Life Insurance" },
      { id: "health-insurance", name: "Health Insurance" },
      { id: "vehicle-insurance", name: "Vehicle Insurance" },
      { id: "property-insurance", name: "Property" }
    ]
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: "🚗",
    subcategories: [
      { id: "car-buying", name: "Car Buying" },
      { id: "running-costs", name: "Running Costs" },
      { id: "ev", name: "EV" },
      { id: "depreciation", name: "Depreciation" }
    ]
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "🏠",
    subcategories: [
      { id: "rental", name: "Rental & Yield" },
      { id: "investment", name: "Property Investment" }
    ]
  }
];

// ─── CONSTANTS ──────────────────────────────────────────────
window.constants = {
  compounding_frequencies: [
    { label: "Daily", value: 365 },
    { label: "Weekly", value: 52 },
    { label: "Monthly", value: 12 },
    { label: "Quarterly", value: 4 },
    { label: "Semi-annually", value: 2 },
    { label: "Annually", value: 1 }
  ],
  payment_frequencies: [
    { label: "Weekly", value: 52 },
    { label: "Bi-weekly", value: 26 },
    { label: "Monthly", value: 12 },
    { label: "Quarterly", value: 4 },
    { label: "Semi-annually", value: 2 },
    { label: "Annually", value: 1 }
  ],
  fuel_types: [
    { label: "Petrol", value: "petrol" },
    { label: "Diesel", value: "diesel" },
    { label: "Electric", value: "electric" },
    { label: "Hybrid", value: "hybrid" },
    { label: "CNG", value: "cng" }
  ],
  insurance_types: [
    { label: "Term Life", value: "term" },
    { label: "Whole Life", value: "whole" },
    { label: "Universal Life", value: "universal" },
    { label: "Variable Life", value: "variable" }
  ],
  depreciation_methods: [
    { label: "Straight-Line", value: "straight-line" },
    { label: "Declining Balance", value: "declining-balance" },
    { label: "Double-Declining Balance", value: "double-declining" }
  ],
  risk_profiles: [
    { label: "Conservative", value: "conservative" },
    { label: "Moderate", value: "moderate" },
    { label: "Aggressive", value: "aggressive" },
    { label: "Very Aggressive", value: "very-aggressive" }
  ],
  time_periods: [
    { label: "1 Year", value: 1 },
    { label: "2 Years", value: 2 },
    { label: "3 Years", value: 3 },
    { label: "5 Years", value: 5 },
    { label: "10 Years", value: 10 },
    { label: "15 Years", value: 15 },
    { label: "20 Years", value: 20 },
    { label: "25 Years", value: 25 },
    { label: "30 Years", value: 30 }
  ],
  loan_tenures_months: [
    { label: "12 Months (1 Year)", value: 12 },
    { label: "24 Months (2 Years)", value: 24 },
    { label: "36 Months (3 Years)", value: 36 },
    { label: "48 Months (4 Years)", value: 48 },
    { label: "60 Months (5 Years)", value: 60 },
    { label: "72 Months (6 Years)", value: 72 },
    { label: "84 Months (7 Years)", value: 84 },
    { label: "96 Months (8 Years)", value: 96 },
    { label: "120 Months (10 Years)", value: 120 },
    { label: "180 Months (15 Years)", value: 180 },
    { label: "240 Months (20 Years)", value: 240 },
    { label: "360 Months (30 Years)", value: 360 }
  ]
};

// ─── SLIDER RANGES ──────────────────────────────────────────
window.ranges = {
  principal_amount: { min: 100, max: 10000000, step: 100, default: 10000 },
  interest_rate: { min: 0, max: 30, step: 0.5, default: 5 },
  loan_tenure_years: { min: 1, max: 30, step: 1, default: 10 },
  investment_horizon_years: { min: 1, max: 40, step: 1, default: 10 },
  monthly_contribution: { min: 0, max: 50000, step: 100, default: 1000 },
  inflation_rate: { min: 0, max: 15, step: 0.5, default: 3 },
  expected_return: { min: 0, max: 25, step: 0.5, default: 8 },
  car_price: { min: 1000, max: 200000, step: 500, default: 30000 },
  down_payment_percent: { min: 0, max: 50, step: 1, default: 20 },
  fuel_efficiency_mpg: { min: 5, max: 60, step: 0.5, default: 25 },
  fuel_price_per_litre: { min: 0.5, max: 3, step: 0.01, default: 1.5 },
  ev_consumption_kwh_per_km: { min: 0.1, max: 0.5, step: 0.01, default: 0.2 },
  electricity_rate_per_kwh: { min: 0.05, max: 0.5, step: 0.01, default: 0.15 },
  annual_mileage: { min: 1000, max: 50000, step: 500, default: 12000 },
  income_amount: { min: 1000, max: 1000000, step: 100, default: 60000 },
  expenses_amount: { min: 0, max: 500000, step: 100, default: 30000 },
  age: { min: 18, max: 100, step: 1, default: 30 },
  retirement_age: { min: 40, max: 75, step: 1, default: 65 },
  coverage_multiplier: { min: 1, max: 20, step: 1, default: 10 }
};

// ─── TAX BRACKETS ────────────────────────────────────────────
window.taxBrackets = {
  us_federal_2024: [
    {
      year: 2024,
      filing_status: "single",
      brackets: [
        { rate: 10, from: 0, to: 11600 },
        { rate: 12, from: 11601, to: 47150 },
        { rate: 22, from: 47151, to: 100525 },
        { rate: 24, from: 100526, to: 191950 },
        { rate: 32, from: 191951, to: 243725 },
        { rate: 35, from: 243726, to: 609350 },
        { rate: 37, from: 609351, to: null }
      ]
    },
    {
      year: 2024,
      filing_status: "married_jointly",
      brackets: [
        { rate: 10, from: 0, to: 23200 },
        { rate: 12, from: 23201, to: 94300 },
        { rate: 22, from: 94301, to: 201050 },
        { rate: 24, from: 201051, to: 383900 },
        { rate: 32, from: 383901, to: 487450 },
        { rate: 35, from: 487451, to: 731200 },
        { rate: 37, from: 731201, to: null }
      ]
    }
  ]
};

// ─── LOAN TERMS ──────────────────────────────────────────────
window.loanTerms = {
  mortgage: [
    { label: "15-Year Fixed", years: 15, rate_range: [5.0, 7.0] },
    { label: "30-Year Fixed", years: 30, rate_range: [5.5, 7.5] },
    { label: "5/1 ARM", years: 30, rate_range: [4.5, 6.5] }
  ],
  auto_loan: [
    { label: "36 Months", months: 36, rate_range: [4.0, 8.0] },
    { label: "48 Months", months: 48, rate_range: [4.5, 8.5] },
    { label: "60 Months", months: 60, rate_range: [5.0, 9.0] }
  ],
  personal_loan: [
    { label: "12 Months", months: 12, rate_range: [6.0, 15.0] },
    { label: "24 Months", months: 24, rate_range: [6.5, 16.0] },
    { label: "36 Months", months: 36, rate_range: [7.0, 18.0] },
    { label: "60 Months", months: 60, rate_range: [8.0, 20.0] }
  ]
};

// ─── COUNTRY PRESETS ─────────────────────────────────────────
window.countryPresets = [
  { country: "US", currency: "USD", default_interest_rate: 7.0, default_inflation_rate: 3.0, default_income_tax_rate: 24.0, default_capital_gains_tax: 15.0, default_mortgage_rate: 6.5, default_car_loan_rate: 5.0 },
  { country: "UK", currency: "GBP", default_interest_rate: 5.0, default_inflation_rate: 2.5, default_income_tax_rate: 20.0, default_capital_gains_tax: 10.0, default_mortgage_rate: 4.5, default_car_loan_rate: 4.0 },
  { country: "India", currency: "INR", default_interest_rate: 8.0, default_inflation_rate: 4.5, default_income_tax_rate: 30.0, default_capital_gains_tax: 10.0, default_mortgage_rate: 8.5, default_car_loan_rate: 7.0 },
  { country: "Germany", currency: "EUR", default_interest_rate: 4.5, default_inflation_rate: 2.0, default_income_tax_rate: 26.0, default_capital_gains_tax: 26.38, default_mortgage_rate: 4.0, default_car_loan_rate: 3.5 },
  { country: "Australia", currency: "AUD", default_interest_rate: 6.0, default_inflation_rate: 2.5, default_income_tax_rate: 30.0, default_capital_gains_tax: 10.0, default_mortgage_rate: 5.5, default_car_loan_rate: 4.5 },
  { country: "Canada", currency: "CAD", default_interest_rate: 5.5, default_inflation_rate: 2.8, default_income_tax_rate: 25.0, default_capital_gains_tax: 10.0, default_mortgage_rate: 5.0, default_car_loan_rate: 4.0 },
  { country: "Pakistan", currency: "PKR", default_interest_rate: 12.0, default_inflation_rate: 8.0, default_income_tax_rate: 30.0, default_capital_gains_tax: 10.0, default_mortgage_rate: 15.0, default_car_loan_rate: 12.0 },
  { country: "UAE", currency: "AED", default_interest_rate: 5.0, default_inflation_rate: 2.0, default_income_tax_rate: 0.0, default_capital_gains_tax: 0.0, default_mortgage_rate: 4.5, default_car_loan_rate: 4.0 },
  { country: "Singapore", currency: "SGD", default_interest_rate: 4.0, default_inflation_rate: 1.5, default_income_tax_rate: 15.0, default_capital_gains_tax: 0.0, default_mortgage_rate: 3.5, default_car_loan_rate: 3.0 }
];