/* Pure analytics functions. Works in the browser and in Node's built-in test runner. */
(function (root) {
  'use strict';
  const SEGMENTS = ['domestic', 'transborder', 'international'];
  const sum = (numbers) => numbers.reduce((a, b) => a + b, 0);
  const safeDiv = (a, b) => b ? a / b : 0;
  const clamp = (x, min, max) => Math.min(max, Math.max(min, x));
  const keyOf = (year, month) => `${year}-${String(month).padStart(2, '0')}`;
  const percentChange = (current, previous) => previous ? (current / previous - 1) * 100 : 0;

  function aggregateAnnual(rows, minYear = 0) {
    const index = {};
    rows.forEach(r => {
      if (r.year < minYear) return;
      if (!index[r.year]) index[r.year] = {year: r.year, airport: 'YOW', domestic: 0, transborder: 0, international: 0, total: 0, months: 0};
      SEGMENTS.forEach(segment => index[r.year][segment] += r[segment]);
      index[r.year].total += r.total;
      index[r.year].months += 1;
    });
    return Object.values(index).sort((a,b) => a.year - b.year);
  }

  function segmentBreakdown(rows, year) {
    const subset = rows.filter(r => r.year === year);
    return SEGMENTS.map(name => ({name, value: sum(subset.map(r => r[name]))}));
  }

  function comparableYtd(rows, year) {
    const actual = rows.filter(r => r.year === year);
    if (!actual.length) return null;
    const maxMonth = Math.max(...actual.map(r => r.month));
    const prior = rows.filter(r => r.year === year-1 && r.month <= maxMonth);
    if (prior.length !== actual.length) return null;
    return {year, months: maxMonth, current: sum(actual.map(r => r.total)), previous: sum(prior.map(r => r.total)), growthPct: percentChange(sum(actual.map(r => r.total)), sum(prior.map(r => r.total)))};
  }

  function estimateGrowth(rows, lastYear) {
    // Applies a weighted recent growth rate; use equal month coverage for partial 2026.
    const current = comparableYtd(rows, lastYear);
    const previous = comparableYtd(rows, lastYear - 1);
    if (!current) return 0;
    if (!previous) return clamp(current.growthPct, -20, 25);
    return clamp(0.65 * current.growthPct + 0.35 * previous.growthPct, -20, 25);
  }

  function forecastYow(rows, horizon = 6, adjustmentPct = 0) {
    const sorted = [...rows].sort((a,b) => a.year-b.year || a.month-b.month);
    const last = sorted[sorted.length - 1];
    if (!last || horizon < 1 || horizon > 24) return {predictions: [], growthPct: 0, backtestWape: null};
    const byDate = new Map(sorted.map(r => [keyOf(r.year,r.month),r.total]));
    const growthPct = estimateGrowth(sorted, last.year);
    const effectivePct = clamp(growthPct + adjustmentPct, -40, 60);
    const predictions=[];
    let year=last.year, month=last.month;
    for (let i=1;i<=horizon;i++) {
      month++;
      if (month>12){month=1;year++}
      const base=byDate.get(keyOf(year-1,month));
      if (base === undefined) throw new Error('Forecast needs prior-year monthly observations');
      const predicted=Math.round(base*(1+effectivePct/100));
      const uncertainty=0.08+0.008*i; // illustrative sensitivity band, not calibrated confidence interval
      const item={year,month,date:keyOf(year,month),value:predicted,lower:Math.round(predicted*(1-uncertainty)),upper:Math.round(predicted*(1+uncertainty)),type:'forecast'};
      predictions.push(item);
      byDate.set(keyOf(year,month),predicted);
    }
    // Hold out 2025, train simple 2023->2024 YoY growth, predict each 2025 month.
    const y23=sum(sorted.filter(r=>r.year===2023).map(r=>r.total));
    const y24=sum(sorted.filter(r=>r.year===2024).map(r=>r.total));
    const growth2024 = y23 ? clamp(y24/y23-1,-.20,.25) : 0;
    const test=sorted.filter(r=>r.year===2025);
    const truth=[], errors=[];
    test.forEach(r=>{
      const base=byDate.get(keyOf(2024,r.month));
      if(base!==undefined){truth.push(r.total);errors.push(Math.abs(r.total-Math.round(base*(1+growth2024))))}
    });
    const backtestWape=truth.length === 12 && sum(truth) ? 100*sum(errors)/sum(truth) : null;
    return {predictions,growthPct,effectivePct,backtestWape,lastObserved:keyOf(last.year,last.month)};
  }

  function scenarioModel({annualPassengers,growthPct=8,seats=132,loadFactor=82,peakFactor=2,turnaroundMin=75,gates=18,throughput=95,operatingHours=16}) {
    if (!(annualPassengers>0 && seats>0 && loadFactor>0 && loadFactor<=100 && peakFactor>=1 && turnaroundMin>0 && gates>0 && throughput>0 && operatingHours>0)) throw new Error('All scenario inputs must be valid positive numbers.');
    const projectedAnnual=annualPassengers*(1+growthPct/100);
    if (projectedAnnual <= 0) throw new Error('Scenario passenger volume must be positive');
    const passengersDay=projectedAnnual/365;
    const flightEquivalentDay=passengersDay/(seats*loadFactor/100);
    const departingOrArrivingDay=flightEquivalentDay/2; // arrivals approx half of flights for gate turnaround estimate
    const peakGateDemand=(departingOrArrivingDay*(turnaroundMin/60)/operatingHours)*peakFactor;
    const gateUtilizationPct=100*peakGateDemand/gates;
    const gateRequirement=Math.ceil(peakGateDemand);
    const processingHoursDay=passengersDay/throughput;
    const baselineFlightsDay=(annualPassengers/365)/(seats*loadFactor/100);
    const risk=gateUtilizationPct>95?'high':gateUtilizationPct>80?'watch':'comfortable';
    const diffFlightsDay=flightEquivalentDay-baselineFlightsDay;
    return {projectedAnnual,passengersDay,flightEquivalentDay,departingOrArrivingDay,peakGateDemand,gateUtilizationPct,gateRequirement,processingHoursDay,baselineFlightsDay,diffFlightsDay,risk,remainingGateCapacity:gates-peakGateDemand};
  }

  function peakMonth(rows,year){const subset=rows.filter(r=>r.year===year);return subset.length?subset.reduce((a,b)=>b.total>a.total?b:a):null}
  function totalForYear(rows,year){return sum(rows.filter(r=>r.year===year).map(r=>r.total))}
  function csvString(rows,columns){const escape=v=>'"'+String(v??'').replaceAll('"','""')+'"';return [columns.join(','),...rows.map(r=>columns.map(k=>escape(r[k])).join(','))].join('\r\n')}
  const API={sum,safeDiv,clamp,keyOf,percentChange,aggregateAnnual,segmentBreakdown,comparableYtd,estimateGrowth,forecastYow,scenarioModel,peakMonth,totalForYear,csvString};
  root.AeroAnalytics=API;
  if(typeof module!=='undefined' && module.exports)module.exports=API;
})(typeof globalThis!=='undefined'?globalThis:this);
