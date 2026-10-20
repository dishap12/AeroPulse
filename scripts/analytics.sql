-- AeroPulse reproducible SQL analysis. Run after python scripts/build_sqlite.py.
-- YOW monthly records are actual airport data, including Jan-Aug 2026 preliminary values.

-- 1) Annual sector mix; only full years should be compared to each other.
SELECT year, COUNT(*) AS observed_months,
 SUM(domestic) AS domestic_passengers,
 SUM(transborder) AS transborder_passengers,
 SUM(international) AS other_international_passengers,
 SUM(total) AS all_passengers,
 ROUND(100.0 * SUM(domestic) / SUM(total), 1) AS domestic_share_pct
FROM yow_passengers
GROUP BY year ORDER BY year;

-- 2) Comparable monthly change (rather than partial/full-year mismatches).
WITH monthly AS (
 SELECT *, LAG(total, 12) OVER(ORDER BY year, month) AS last_year_same_month
 FROM yow_passengers
)
SELECT year,month,total,last_year_same_month,
 ROUND(100.0*(total-last_year_same_month)/NULLIF(last_year_same_month,0),1) AS yoy_pct
FROM monthly WHERE year >= 2023 ORDER BY year DESC,month DESC;

-- 3) Three-month trailing mean (signal smoothing).
SELECT year, month, total,
 ROUND(AVG(total) OVER(ORDER BY year,month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW),0) AS trailing_3mo_avg
FROM yow_passengers ORDER BY year,month;

-- 4) Peak month of each full year.
WITH ranked AS (
 SELECT year,month,total,
 ROW_NUMBER() OVER(PARTITION BY year ORDER BY total DESC) AS rn
 FROM yow_passengers WHERE year BETWEEN 2022 AND 2025
)
SELECT year,month,total FROM ranked WHERE rn=1 ORDER BY year;

-- 5) Data validation: all zero rows and reconciled monthly components.
SELECT COUNT(*) AS source_rows,
 SUM(CASE WHEN total != domestic+transborder+international THEN 1 ELSE 0 END) AS mismatched_rows,
 SUM(CASE WHEN total < 0 THEN 1 ELSE 0 END) AS negative_rows
FROM yow_passengers;

