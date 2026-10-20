# AeroPulse ✈️ — Aviation Intelligence Platform

**[🌐 Open the AeroPulse live demo](https://dishap12.github.io/AeroPulse/)** · [View repository](https://github.com/dishap12/AeroPulse) · [Recruiter guide](RECRUITER_GUIDE.md)

**A working, responsive aviation business intelligence portfolio application built with official Canadian airport passenger data.** Designed to demonstrate business analytics, KPI reporting, demand forecasting, data quality, and assumption-based planning relevant to airlines, airports, and aerospace manufacturers.

> **Independent portfolio demonstration.** AeroPulse is not affiliated with Porter Airlines, Air Canada, Toronto Pearson, Ottawa Airport Authority, Airbus, Boeing, Bombardier or NAV CANADA. No confidential airport data are used. It is *not* a live flight tracker.

## Quick start

**Option A: Just open `index.html`** in a modern browser. This is a dependency-free static application; the dataset and analytics load locally. Internet access is not required. No credentials, API keys, Node installation or paid services needed.

**Option B: Run a local web server** (optional):

```bash
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

## What works

| Screen | Interactive features | Output |
| --- | --- | --- |
| **Command Centre** | YOW metrics, genuine historical monthly trend and segment donut | Recorded demand and key findings |
| **Passenger Explorer** | Choose reporting year, view monthly trends and seasonality heatmap, compare YOW and YYZ | Official sector analysis and CSV download |
| **Forecast Lab** | Choose 3/6/12 months, change growth adjustment (-15 to +15 percentage points) | Explainable model forecast, backtest WAPE and CSV download |
| **Scenario Studio** | Select YOW/YYZ, modify assumptions, save up to four browser-local comparisons, export scenario results | Hypothetical flight equivalents, gate utilization and comparative business case |
| **Executive Briefing** | Generate a source-attributed dynamic executive report and print or save as PDF | Recruiter-ready findings, assumptions and CSV export |
| **Data & Methods** | Explore source records, filter reporting years and download CSV | Sources, methodology, data dictionary and limitations |
| **Project Brief** | Recruiter-friendly walkthrough of the business case | Employer relevance, capabilities and project narrative |

## Tech stack

- **HTML5, CSS3, modern vanilla JavaScript, SVG** — no JS framework or external data dependency. Works on GitHub Pages.
- **Python 3 standard library** — reproducible CSV bundle generator and optional SQLite ETL.
- **SQLite + SQL** — optional analytics queries (window functions, YoY, rolling averages, sector mix, integrity checks).
- **Node.js built-in test runner** — no third-party Node dependencies required.
- **CSV** — machine-readable offline snapshots from authoritative sources.

## Data sources and integrity

1. **Ottawa International Airport Authority: [Passenger volume](https://www.yow.ca/business/passenger-volume)**. YOW monthly enplaned + deplaned passengers by domestic, transborder (U.S.) and other international segment. **2022–2025 complete, Jan–Aug 2026 preliminary** (56 monthly observations). Values transcribed from the authority's public tables and programmatically reconciled against annual or year-to-date published totals.
2. **Greater Toronto Airports Authority: [2025 Annual Results](https://www.torontopearson.com/en/corporate/media/press-releases/2026-03-05)**. YYZ annual 2023, 2024 and 2025 totals. Data published in **rounded millions**.
3. **GTAA: [2022 Annual Results](https://www.torontopearson.com/en/corporate/media/press-releases/2023-03-23)** and **[2022 Annual Report (includes 2021 figures)](https://cdn.torontopearson.com/-/media/project/pearson/content/corporate/who-we-are/pdfs/annual-reports/gtaa-annual-report-2022.pdf)**. YYZ 2021–2022 totals and sector split, rounded to 0.1M.

Data snapshot checked **October 20, 2026**. The app intentionally ships a reproducible snapshot and does not claim to auto-refresh. Data are official *passenger volumes* — **not** actual aircraft movements, delays, gate data, or staffing.

**Important:** YOW reports **domestic / transborder / other international**. GTAA annual report combines U.S. travel into **international**. Only compare **overall passenger counts** between airports; the app intentionally does not compare incompatible sector subcategories.

## Forecasting methodology (not a production forecast)

The forecast begins after the last reported month (August 2026). It uses a **seasonal year-over-year carry-forward**, with growth factor:

```
base_growth_pct = 0.65 × recent_comparable_YoY_pct
                + 0.35 × previous_full_year_YoY_pct
applied_growth_pct = clamp(base_growth_pct + user_adjustment_pct, -40, +60)
next_year_month = prior_year_same_month × (1 + applied_growth_pct / 100)
```

The base growth is clipped at -20% to +25%. A simple historical 2025 holdout backtest trains on the 2023 → 2024 growth rate, predicting monthly 2025 values and reporting **weighted absolute percentage error (WAPE)**. The bands drawn around the forecast are **illustrative sensitivity bands** that widen with the horizon (not statistical prediction/confidence intervals). Route openings, airline schedule decisions, weather, security and macroeconomics are excluded. These must be considered before production use.

## Scenario modelling (hypothetical)

All outputs are scenario estimates, **not measured operational values**. The user can vary:

- Passenger growth assumption relative to 2025 airport passenger counts.
- Hypothetical aircraft seating and load factor.
- Average gate turnaround, peak concentration factor, and gate count.
- Passengers processed per assumed staff-hour.

```
projected_passengers = 2025_baseline × (1 + assumed_growth)
daily_flight_equivalents = projected_passengers / 365 / (seats × load_factor)
peak_gate_demand = (daily_flight_equivalents / 2) × (turn_minutes / 60) / 16 × peak_factor
modelled_gate_utilization = peak_gate_demand / available_gate_positions × 100
```

The dividing-by-two convention approximates arrivals as half of modelled arriving+departing passenger flight equivalents. It is an illustrative assumption and **does not predict a real airport's available gates, aircraft mix, gate scheduling, or commercial staffing**. Modelled risk thresholds are heuristic (>80% watch; >95% high), not official planning standards.

Saved scenarios are stored using browser `localStorage` only. They are never uploaded to a server or shared with recruiters. Clear browser site data to erase them.

## Data audit & testing

```bash
# From the repository root
python3 scripts/build_data.py       # regenerates CSV and data/airport-data.js; validates official sums
python3 scripts/build_sqlite.py     # creates an optional SQLite db
node --test tests/*.test.cjs        # tests model invariants, calculations and page rendering
```

`data/aeropulse.sqlite` is intentionally excluded from version control since it is generated. No Python third-party packages required.

## Deploy for free using GitHub Pages

1. Create a **public repository named `AeroPulse`** on your GitHub account.
2. Upload the *contents of this folder* (`index.html`, `app.js`, `analytics.js`, `styles.css`, `data/`, `assets/`, `tests/`, etc.). **Do not upload only the ZIP file.**
3. In GitHub: **Settings → Pages → Build and deployment**. Select **Deploy from a branch**; choose **main** and **/(root)**. Save.
4. AeroPulse is deployed to **[GitHub Pages](https://dishap12.github.io/AeroPulse/)**. The GitHub Pages deployment workflow completed successfully on October 20, 2026. Independently check the live site in your browser after future deployments.
5. Add the live URL to the GitHub repo's **About → Website** field, and link GitHub + live demo from your resume/LinkedIn.

Alternatively, drag the unzipped project folder to [Netlify Drop](https://app.netlify.com/drop); its static HTML works there too.

## What to say in a recruiter interview

> **Problem:** Airport and passenger demand data are published in separate public sources. Teams need accessible, attributable trend analysis and ways to test operational assumptions.
>
> **My solution:** I built AeroPulse to reconcile and visualize official YOW passenger data, compare high-level YOW/YYZ traffic, evaluate seasonal patterns, create transparent monthly forecasts, and run assumption-based capacity scenarios. The application includes source attribution and tests, and distinguishes observed figures from hypothetical outputs.
>
> **Trade-offs:** I used a simple interpretable model rather than opaque AI because the public dataset is limited. I did not invent confidential flight-operation data. A production version would require real schedules, gate occupancy, aircraft configuration and additional forecast validation.

## Skills demonstrated

KPI definition · business process analysis · data storytelling · SQL analytics · Python data validation · planning simulations · dashboard UX · forecasting / backtesting · quality controls · technical documentation · reproducibility.

## Further improvements

- Add a public flight movements source from Statistics Canada with its own defined geography and measurement unit.
- Add official YYZ monthly passenger records once consistently sourced and reconciled.
- Expand statistical forecasts with exogenous variables and proper calibrated prediction intervals.
- Add scheduled data-refresh validation, automated CI, and accessibility audits.

## License

MIT for original code. Source data belong to their respective publishers and are attributed above. See [LICENSE](LICENSE).

