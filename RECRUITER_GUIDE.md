## New in version 3 — a memorable 90-second walkthrough

1. Open the **Command Centre**. Explain YOW 2025 passenger growth and why reporting periods must be comparable.
2. Select **Aviation Explorer** and click **Vancouver (YVR)** on the map while Ottawa is the origin.
3. Compare the Embraer E195-E2 and the Dash 8-400. Notice how the route distance relates to each aircraft's **published maximum range**. Mention that aircraft performance and actual route operation cannot be inferred from range alone.
4. Change the passenger-load slider to demonstrate how the application recalculates hypothetical occupancy.
5. Finish in **Forecast Lab** or **Scenario Studio** to show the business analytics connection.

**Interview framing:** "I wanted to make aviation data easier to explore, not just prettier to display. I built a dashboard to interpret public airport passenger trends, and extended it with a geographic aircraft comparison tool. The user can make choices and see real calculations update. I validated the data and documented the difference between reported facts and hypothetical planning assumptions."

**Honesty:** The map does not contain actual scheduled routes or live flights; it plots selected locations and theoretical direct distances. Aircraft range data comes from manufacturer/airline publications. This is a portfolio prototype, not an aircraft dispatch or airport capacity management product.


---

# AeroPulse — Recruiter Presentation Guide

## 20-second elevator pitch

“AeroPulse is an aviation intelligence web application I developed to analyze real Canadian airport passenger data. It brings together interactive reporting, a transparent forecast model and scenario-based capacity analysis. I focused on clean data, KPI design and clear business recommendations rather than claiming access to confidential airport systems.”

## 60-second portfolio walkthrough

1. **Command Centre:** “This is the 2025 reported baseline: roughly 4.87 million passengers at Ottawa and 47.3 million at Toronto Pearson. I also show how 2026 year-to-date demand is developing compared with the same months of 2025.”
2. **Passenger Explorer:** “I can segment YOW traffic into domestic, U.S. transborder and other international and identify peak seasonality. I also flag the partial 2026 data and source differences.”
3. **Forecast Lab:** “I created a basic, explainable seasonal year-over-year model. Its inputs, adjustment, monthly forecasts and backtest error are visible. These projections are not official airport forecasts.”
4. **Scenario Studio:** “I developed an illustrative planning model where aircraft seating, load factor, passenger growth, turnaround and gate capacity change the estimated demand. The assumptions are visible so stakeholders can discuss scenarios responsibly.”
5. **Data & Methods:** “I reconciled the source figures to published totals and wrote repeatable tests and documentation.”

## Example resume entry (after you personally inspect and understand the project)

**AeroPulse — Canadian Aviation Passenger Intelligence Platform** | Independent Portfolio Project | 2026

- Developed an interactive airport analytics platform using public Ottawa and Toronto Pearson passenger datasets, enabling KPI reporting, demand trend analysis, airport comparisons and CSV exports.
- Built a transparent seasonal forecasting model with historical backtesting and an assumption-based airport capacity simulator; implemented data reconciliation checks, automated tests and technical documentation.

**Tech:** JavaScript, HTML/CSS, SVG, Python, SQL/SQLite, CSV, data visualization and forecasting.

Do not claim deployment until the site is actually live. Do not claim this project improved real airline KPIs or operations; its impact is demonstrated functionality, not deployed outcomes.

## Likely interview questions and recommended approach

**Why aviation?**
“I have a genuine interest in aircraft and airline operations. My professional work is in analytics, service performance and cross-functional problem solving, so I wanted to apply those strengths to a real aviation use case.”

**Why did you use a simple model rather than advanced AI?**
“An interpretable model was more appropriate for the available public monthly data. The objective was to support explainable decisions and quantify model error, not to overstate predictive accuracy.”

**Where did your data come from?**
“Official monthly Ottawa airport passenger reports and Toronto Pearson annual reports. I cited the sources, reconciled yearly totals and explicitly labelled 2026 YOW data as preliminary.”

**How would this scale into an enterprise environment?**
“I would add a governed data pipeline, automated source validation, a SQL warehouse, access controls, operational feeds from permitted sources, scheduled refreshes, and a formal forecast testing framework.”

**What was the biggest limitation?**
“Public passenger counts cannot reveal actual aircraft movement mix, staffing requirements or gate utilization. That is why Scenario Studio treats those as adjustable hypotheses, not measured operational facts.”

## Employer relevance

- **Porter, Air Canada:** operational business analysis, customer demand reporting, data storytelling, forecasting foundations.
- **Ottawa / Toronto airports:** airport KPIs, peak-demand planning, variance analysis, methodology discipline.
- **Boeing, Airbus, Bombardier:** general operational analytics, scenario planning, aircraft-capacity assumptions (not aircraft engineering).

## Next steps after deployment

- Add live GitHub Pages link to resume and LinkedIn.
- Include screenshots of the dashboard, explorer and scenario pages in the GitHub README.
- Be prepared to demonstrate changing a year filter, forecast horizon and scenario gate count in under two minutes.

