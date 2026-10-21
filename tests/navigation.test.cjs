const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const data=require('../data/airport-data.js');
const analytics=require('../analytics.js');
const atlasSource=fs.readFileSync(path.join(__dirname,'../atlas.js'),'utf8');
const appSource=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');

function launch(){
  const handlers={};
  const main={innerHTML:''},crumb={textContent:''},side={classList:{remove(){}}};
  const nodes={'#appMain':main,'#breadcrumb':crumb,'#sidebar':side};
  const document={
    getElementById(id){return id==='appMain'?main:null},
    querySelector(q){return nodes[q]||null},
    querySelectorAll(){return []},
    addEventListener(event,fn){(handlers[event]??=[]).push(fn)}
  };
  const window={addEventListener(){},scrollTo(){}};
  const context={globalThis:{AEROPULSE_DATA:data,AeroAnalytics:analytics},document,window,
    location:{hash:'#overview'},history:{replaceState(){}},console,
    Intl,Map,Math,Number,setTimeout,clearTimeout};
  vm.runInNewContext(atlasSource,context,{timeout:2500});
  vm.runInNewContext(appSource,context,{timeout:2500});
  function dispatch(event,target){
    for(const fn of handlers[event]||[])fn({target,key:'Enter',preventDefault(){}});
  }
  const nav=tab=>({closest(selector){return selector==='[data-tab]'?{dataset:{tab}}:null}});
  return {main,crumb,dispatch,nav};
}
test('navigating to Aviation Explorer replaces homepage with map and aircraft selectors',()=>{
 const a=launch();assert.match(a.main.innerHTML,/Command Centre/);
 a.dispatch('click',a.nav('atlas'));
 assert.match(a.main.innerHTML,/Explore the network/);
 assert.match(a.main.innerHTML,/id="atlasFrom"/);
 assert.match(a.main.innerHTML,/Embraer E195-E2/);
 assert.match(a.main.innerHTML,/YOW → YYZ/);
});
test('airport dropdown dynamically recalculates the selected route',()=>{
 const a=launch();
 a.dispatch('click',a.nav('atlas'));
 a.dispatch('change',{id:'atlasTo',value:'YVR'});
 assert.match(a.main.innerHTML,/YOW → YVR/);
 assert.match(a.main.innerHTML,/Within nominal range/);
 a.dispatch('change',{id:'atlasAircraft',value:'dash8'});
 assert.match(a.main.innerHTML,/Beyond nominal range/);
});
test('existing passenger explorer still responds to year selection',()=>{
 const a=launch();a.dispatch('click',a.nav('explorer'));
 assert.match(a.main.innerHTML,/Passenger Explorer/);
 a.dispatch('change',{id:'yearSelect',value:'2023'});
 assert.match(a.main.innerHTML,/YOW · 2023 passenger volume/);
});
