const test = require('node:test');
const assert = require('node:assert/strict');
const D=require('../data/airport-data.js');
const A=require('../analytics.js');
test('YOW annual source totals match official 2023-2025',()=>{
 for(const [yr,v] of [[2023,4095914],[2024,4606824],[2025,4866236]])assert.equal(A.totalForYear(D.yowMonthly,yr),v);
});
test('YOW 2026 partial is labelled, no future values',()=>{
 const subset=D.yowMonthly.filter(r=>r.year===2026);
 assert.equal(subset.length,8);
 assert.equal(A.sum(subset.map(r=>r.total)),3478226);
 assert.ok(subset.every(r=>r.status==='preliminary'));
});
test('YOW annual aggregates reconcile across sectors',()=>{
 for(const y of A.aggregateAnnual(D.yowMonthly)){
  assert.equal(y.domestic+y.transborder+y.international,y.total);
  assert.equal(y.months,y.year===2026?8:12);
 }
});
test('YOW sector change 2025 6-ish percent',()=>{
 const p=A.percentChange(A.totalForYear(D.yowMonthly,2025),A.totalForYear(D.yowMonthly,2024));
 assert.ok(p>5 && p<6.5);
});
test('forecast starts September 2026 with coherent ranges, creates 12 months',()=>{
 const f=A.forecastYow(D.yowMonthly,12,0);
 assert.equal(f.predictions.length,12);
 assert.equal(f.predictions[0].date,'2026-09');
 assert.equal(f.predictions.at(-1).date,'2027-08');
 assert.ok(f.predictions.every(p=>p.lower<=p.value&&p.value<=p.upper));
 assert.ok(f.backtestWape>=0);
});
test('higher uplift yields larger passenger forecasts',()=>{
 const l=A.forecastYow(D.yowMonthly,6,-5);
 const h=A.forecastYow(D.yowMonthly,6,5);
 assert.ok(A.sum(h.predictions.map(p=>p.value))>A.sum(l.predictions.map(p=>p.value)));
});
test('scenario reacts to gate count, growth and seating',()=>{
 const opt={annualPassengers:4866236,growthPct:6,seats:132,loadFactor:82,peakFactor:2,turnaroundMin:75,gates:18,throughput:95};
 const base=A.scenarioModel(opt);
 const gates=A.scenarioModel({...opt,gates:36});
 const demand=A.scenarioModel({...opt,growthPct:20});
 const seats=A.scenarioModel({...opt,seats:180});
 assert.ok(gates.gateUtilizationPct<base.gateUtilizationPct);
 assert.ok(demand.flightEquivalentDay>base.flightEquivalentDay);
 assert.ok(seats.flightEquivalentDay<base.flightEquivalentDay);
});
test('scenario invalid values rejected',()=>{assert.throws(()=>A.scenarioModel({annualPassengers:100,gates:0}));});
test('CSV escaping handles commas, quotes',()=>{assert.match(A.csvString([{name:'Gate "A", North'}],['name']), /"Gate ""A"", North"/)});

