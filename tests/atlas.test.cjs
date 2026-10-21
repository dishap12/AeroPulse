const test=require('node:test');
const assert=require('node:assert/strict');
const atlas=require('../atlas.js');

test('verified aircraft and airport catalogs remain distinct',()=>{
 assert.equal(atlas.AIRPORTS.length,12);
 assert.equal(atlas.FLEET.length,5);
 assert.equal(new Set(atlas.AIRPORTS.map(a=>a.code)).size,12);
 for(const a of atlas.FLEET){assert.ok(a.source.startsWith('https://'));assert.ok(a.range>1000&&a.seats>0)}
});
test('haversine is symmetric and airport distance is plausible',()=>{
 const from=atlas.AIRPORTS.find(a=>a.code==='YOW');
 const to=atlas.AIRPORTS.find(a=>a.code==='YYZ');
 const x=atlas.distance(from,to),y=atlas.distance(to,from);
 assert.equal(x,y);assert.ok(x>300&&x<400,'YOW–YYZ is about 365 km');
 assert.equal(atlas.distance(from,from),0);
});
test('airport and aircraft selections change the rendered results',()=>{
 atlas.state.from='YOW';atlas.state.to='YVR';atlas.state.aircraft='e195';
 let html=atlas.render();
 assert.match(html,/YOW → YVR/);
 assert.match(html,/Embraer E195-E2/);
 assert.match(html,/Airport map/);
 assert.match(html,/NOT LIVE FLIGHTS/);
 assert.equal(atlas.handleChange({target:{id:'atlasAircraft',value:'a220'}}),true);
 html=atlas.render();assert.match(html,/Airbus A220-300/);
 assert.equal(atlas.handleChange({target:{id:'atlasTo',value:'YYZ'}}),true);
 assert.match(atlas.render(),/YOW → YYZ/);
});
test('route dropdown prevents same airport for origin and destination',()=>{
 atlas.handleChange({target:{id:'atlasFrom',value:'YOW'}});
 atlas.handleChange({target:{id:'atlasTo',value:'YOW'}});
 assert.notEqual(atlas.state.from,atlas.state.to);
});
test('load-factor calculations and aircraft filter are exposed',()=>{
 atlas.state.from='YOW';atlas.state.to='YYZ';atlas.state.aircraft='e195';
 assert.equal(atlas.handleChange({target:{id:'atlasLoad',value:'90'}}),true);
 assert.match(atlas.render(),/119<\/strong>/);
 assert.equal(atlas.handleChange({target:{id:'atlasFilter',value:'Bombardier'}}),true);
 const page=atlas.render();
 assert.match(page,/Bombardier Global 7500/);
 assert.doesNotMatch(page,/class="atlas-plane-card[^"]*"><span>Airbus/);
});
test('map includes keyboard focusable airport controls and accessible semantics',()=>{
 const page=atlas.render();
 assert.match(page,/data-atlas-pin="YOW"/);
 assert.match(page,/tabindex="0"/);
 assert.match(page,/aria-label="Select/);
 assert.match(page,/illustrative/i);
});
