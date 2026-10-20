const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const data=require('../data/airport-data.js');
const analytics=require('../analytics.js');
const appJs=fs.readFileSync(require.resolve('../app.js'),'utf8');
function loadPage(hash){
 const elements={main:{innerHTML:''},breadcrumb:{textContent:''},sidebar:{classList:{remove(){}}}};
 const bySelector={'#appMain':elements.main,'#breadcrumb':elements.breadcrumb,'#sidebar':elements.sidebar};
 const document={getElementById(k){return k==='appMain'?elements.main:null},querySelector(k){return bySelector[k]},querySelectorAll(){return[]},addEventListener(){}};
 const ctx={globalThis:{AEROPULSE_DATA:data,AeroAnalytics:analytics},document,window:{addEventListener(){},scrollTo(){}},location:{hash:'#'+hash},history:{replaceState(){}},console,setTimeout,clearTimeout,Intl,Number,Math,Map};
 vm.runInNewContext(appJs,ctx,{timeout:2000});
 return elements.main.innerHTML;
}
for(const [id,title] of [['overview','Command Centre'],['explorer','Passenger Explorer'],['forecast','Forecast Lab'],['scenario','Scenario Studio'],['report','Executive Briefing'],['data','Data & Methods'],['about','About AeroPulse']]){
 test(`render ${id} without runtime errors`,()=>{const html=loadPage(id);assert.ok(html.includes(title));assert.ok(!html.includes('Unable to render dashboard'),html.slice(0,100));assert.ok(html.length>1400)})
}
test('overview SVG chart dimensions contain no NaN',()=>{const html=loadPage('overview');assert.ok(!html.includes('NaN'));assert.ok(html.includes('Traffic signal: Ottawa'));});

test('executive briefing distinguishes observed and hypothetical values',()=>{const html=loadPage('report');assert.match(html,/Source traceability/);assert.match(html,/hypothetical/i);assert.match(html,/4,866,236/);});
test('scenario comparison toolbar is available',()=>{const html=loadPage('scenario');assert.match(html,/Save current scenario/);assert.match(html,/No scenarios saved yet/);});

