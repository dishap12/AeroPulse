/* AeroPulse Aviation Explorer — public-domain airport locations and manufacturer specs.
   Geographic and range comparisons only: NOT schedules, certified dispatch calculations, or live flight status. */
(function(root){
'use strict';
const AIRPORTS=[
{code:'YOW',city:'Ottawa',name:'Ottawa Macdonald–Cartier',lat:45.3225,lon:-75.6692},
{code:'YYZ',city:'Toronto Pearson',name:'Toronto Pearson',lat:43.6777,lon:-79.6248},
{code:'YTZ',city:'Billy Bishop Toronto',name:'Billy Bishop Toronto City',lat:43.6275,lon:-79.3962},
{code:'YUL',city:'Montréal',name:'Montréal–Trudeau',lat:45.4706,lon:-73.7408},
{code:'YVR',city:'Vancouver',name:'Vancouver International',lat:49.1951,lon:-123.1779},
{code:'YYC',city:'Calgary',name:'Calgary International',lat:51.1139,lon:-114.0203},
{code:'YEG',city:'Edmonton',name:'Edmonton International',lat:53.3097,lon:-113.5797},
{code:'YWG',city:'Winnipeg',name:'Winnipeg Richardson',lat:49.9100,lon:-97.2399},
{code:'YHZ',city:'Halifax',name:'Halifax Stanfield',lat:44.8808,lon:-63.5086},
{code:'YQB',city:'Québec City',name:'Québec City Jean Lesage',lat:46.7911,lon:-71.3933},
{code:'YYJ',city:'Victoria',name:'Victoria International',lat:48.6469,lon:-123.4258},
{code:'YYT',city:"St. John's",name:"St. John's International",lat:47.6186,lon:-52.7519}
];
const FLEET=[
{id:'e195',label:'Embraer E195-E2',maker:'Embraer',seats:132,range:5556,category:'Regional jet',operator:'Porter Airlines',source:'https://www.embraer.com/media/q5sll1p5/e195-e2-spec.pdf',detail:'132-seat manufacturer single-class configuration.'},
{id:'dash8',label:'Dash 8-400',maker:'De Havilland Canada',seats:78,range:2040,category:'Turboprop',operator:'Porter Airlines',source:'https://www.flyporter.com/en-ca/about-porter/our-fleet/dash-8-400/1000',detail:'Porter published seating and range.'},
{id:'a220',label:'Airbus A220-300',maker:'Airbus',seats:145,range:6300,category:'Single-aisle jet',operator:'Air Canada',source:'https://www.aircraft.airbus.com/en/aircraft/a220/a220-300',detail:'Representative seat count within Airbus typical two-class 120–150 range.'},
{id:'b738',label:'Boeing 737-8 MAX',maker:'Boeing',seats:170,range:6480,category:'Single-aisle jet',operator:'Air Canada',source:'https://www.boeing.com/Commercial/737MAX',detail:'Representative seats within Boeing typical two-class 160–180 range.'},
{id:'g7500',label:'Bombardier Global 7500',maker:'Bombardier',seats:17,range:14260,category:'Business jet',operator:'Business aviation',source:'https://bombardier.com/en/Bombardier--EPD-Global7500--en.pdf?attachment=',detail:'Standard accommodation: 17; published theoretical range for specific operating conditions.'}
];
const state={from:'YOW',to:'YYZ',aircraft:'e195',load:85,filter:'all'};
function getAirport(k){return AIRPORTS.find(a=>a.code===k)}
function getAircraft(k){return FLEET.find(a=>a.id===k)}
function rad(d){return d*Math.PI/180}
function distance(a,b){
const dlat=rad(b.lat-a.lat),dlon=rad(b.lon-a.lon);
const h=Math.sin(dlat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dlon/2)**2;
return Math.round(6371.0088*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h)));
}
function project(a){return {x:Math.round(32+(a.lon+138)/90*872),y:Math.round(35+(61-a.lat)/21*403)}}
function fmt(n){return new Intl.NumberFormat('en-CA',{maximumFractionDigits:0}).format(n)}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function options(current){return AIRPORTS.map(a=>'<option value="'+a.code+'"'+(a.code===current?' selected':'')+'>'+a.code+' · '+esc(a.city)+'</option>').join('')}
function fleetOptions(){return FLEET.map(a=>'<option value="'+a.id+'"'+(a.id===state.aircraft?' selected':'')+'>'+esc(a.label)+'</option>').join('')}
function mapSvg(){
const from=getAirport(state.from),to=getAirport(state.to),p=project(from),q=project(to);
const cx=(p.x+q.x)/2,cy=(p.y+q.y)/2-35;
const grid=[90,180,270,360].map(y=>'<path d="M 0 '+y+' H 940" stroke="#36536a" stroke-width="1" stroke-dasharray="3 9" opacity=".55"/>').join('');
const stops=AIRPORTS.map(a=>{const u=project(a),active=a.code===from.code||a.code===to.code;
return '<g tabindex="0" role="button" aria-label="Select '+esc(a.city)+' as destination" data-atlas-pin="'+a.code+'" class="atlas-pin" style="cursor:pointer"><circle cx="'+u.x+'" cy="'+u.y+'" r="'+(active?11:8)+'" fill="'+(a.code===from.code?'#f8bc77':a.code===to.code?'#7ce9de':'#204a60')+'" stroke="'+(active?'#e1fffc':'#81a8bf')+'" stroke-width="'+(active?2.5:1.5)+'"/><text x="'+u.x+'" y="'+(u.y-14)+'" text-anchor="middle" fill="#deebf8" font-size="13" font-weight="700">'+a.code+'</text></g>'}).join('');
return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 505" role="img" aria-label="Canadian airport geographic coordinate plot with an illustrative great-circle comparison line"><defs><linearGradient id="atlasSea" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0a2435"/><stop offset="1" stop-color="#123044"/></linearGradient></defs><rect width="940" height="505" rx="18" fill="url(#atlasSea)"/>'+grid+'<path d="M 0 140 H 940 M 0 300 H 940" stroke="#27465e" stroke-dasharray="7 9" opacity=".4"/><text x="35" y="469" fill="#61899b" font-size="17" letter-spacing="3">PACIFIC</text><text x="380" y="468" fill="#61899b" font-size="17" letter-spacing="3">CANADA · SOUTHERN CORRIDOR</text><text x="770" y="468" fill="#61899b" font-size="17" letter-spacing="3">ATLANTIC</text><path d="M '+p.x+' '+p.y+' Q '+cx+' '+cy+' '+q.x+' '+q.y+'" fill="none" stroke="#72eadf" stroke-width="3" stroke-dasharray="9 7"/>'+stops+'</svg>';
}
function tile(title,value,desc){return '<div class="atlas-stat"><span>'+title+'</span><strong>'+value+'</strong><small>'+desc+'</small></div>'}
function selectedCards(){
return FLEET.filter(a=>state.filter==='all'||a.maker===state.filter).map(a=>'<button type="button" data-atlas-aircraft="'+a.id+'" class="atlas-plane-card'+(state.aircraft===a.id?' chosen':'')+'"><span>'+esc(a.maker)+' · '+esc(a.category)+'</span><strong>'+esc(a.label)+'</strong><small>'+fmt(a.seats)+' example seats · '+fmt(a.range)+' km listed range</small></button>').join('');
}
function render(){
const from=getAirport(state.from),to=getAirport(state.to),aircraft=getAircraft(state.aircraft);
const km=distance(from,to),ratio=km/aircraft.range*100,within=km<=aircraft.range;
return '<section class="atlas-heading"><div><div class="eyebrow">AVIATION EXPLORER / DISCOVER & COMPARE</div><h1>Explore the network.</h1><p>Pick two airports and an aircraft. Instantly compare distance, published range, and example passenger capacity.</p></div><span class="atlas-label">INTERACTIVE · NOT LIVE FLIGHTS</span></section>'+
'<div class="atlas-controls">'+
'<label class="field">From airport<select id="atlasFrom">'+options(state.from)+'</select></label>'+
'<label class="field">To airport<select id="atlasTo">'+options(state.to)+'</select></label>'+
'<label class="field">Aircraft model<select id="atlasAircraft">'+fleetOptions()+'</select></label>'+
'</div>'+
'<div class="atlas-layout"><section class="panel atlas-map-panel"><div class="atlas-panel-head"><div><h2>Airport map</h2><p>Click a pin to choose a destination</p></div><span class="atlas-quiet">Geographic coordinate plot · schematic</span></div><div class="atlas-map-wrap">'+mapSvg()+'</div><div class="atlas-map-footer"><span><i class="atlas-key origin"></i> Origin</span><span><i class="atlas-key destination"></i> Destination</span><span>Airport coordinates: OurAirports</span></div></section>'+
'<section class="panel atlas-result"><div class="atlas-panel-head"><div><h2>Route lens</h2><p>'+esc(from.code)+' → '+esc(to.code)+'</p></div><span class="atlas-label">WHAT-IF</span></div>'+
'<div class="atlas-distance">'+fmt(km)+' <span>km</span></div><p class="atlas-sub">Shortest surface distance between airports, not an actual flown route.</p>'+
'<div class="atlas-divider"></div>'+tile('Selected aircraft',esc(aircraft.label),esc(aircraft.maker))+tile('Manufacturer range',fmt(aircraft.range)+' km','Advertised maximum, operating limits vary')+
'<div class="atlas-range-track"><div style="width:'+Math.min(100,ratio).toFixed(1)+'%"></div></div><div class="atlas-range-label"><span>'+ratio.toFixed(1)+'% of published max range</span><strong class="'+(within?'atlas-ok':'atlas-bad')+'">'+(within?'Within nominal range':'Beyond nominal range')+'</strong></div>'+
'<label class="atlas-load">Example seat load <strong>'+state.load+'%</strong><input type="range" id="atlasLoad" min="60" max="100" step="5" value="'+state.load+'"/></label>'+
'<p class="atlas-occupancy">≈ <strong>'+fmt(Math.round(aircraft.seats*state.load/100))+'</strong> passengers per hypothetical one-way flight</p></section></div>'+
'<div class="atlas-collection"><div class="atlas-panel-head"><div><h2>Aircraft library</h2><p>Manufacturer specifications · select a model to explore</p></div><label class="field">Manufacturer<select id="atlasFilter"><option value="all">All manufacturers</option>'+['Embraer','De Havilland Canada','Airbus','Boeing','Bombardier'].map(s=>'<option value="'+s+'"'+(state.filter===s?' selected':'')+'>'+esc(s)+'</option>').join('')+'</select></label></div><div class="atlas-fleet-grid">'+selectedCards()+'</div><div class="atlas-spec"><div><strong>'+esc(aircraft.label)+'</strong><span>'+esc(aircraft.detail)+' Associated operation: '+esc(aircraft.operator)+'.</span></div><a href="'+esc(aircraft.source)+'" target="_blank" rel="noopener noreferrer">Official specification ↗</a></div></div>'+
'<details class="atlas-note"><summary>About the data and calculations</summary><p>Airport locations are approximated from the public-domain <a href="https://ourairports.com/data/" target="_blank" rel="noopener noreferrer">OurAirports</a> database. Great-circle distance is calculated with the haversine formula. Aircraft seats are illustrative configurations; published range is a maximum under specified conditions. No airline schedules, route availability, passenger bookings, fuel burn, aircraft performance or operating feasibility is inferred. Data snapshot: October 2026.</p><p>Aircraft information: <a href="https://www.flyporter.com/en-ca/about-porter/our-fleet" target="_blank" rel="noopener noreferrer">Porter</a>, <a href="https://www.aircanada.com/ca/en/aco/home/fly/onboard/fleet.html" target="_blank" rel="noopener noreferrer">Air Canada</a>, and linked manufacturer specification pages.</p></details>';
}
function handleChange(e){
const el=e.target;if(!el||!el.id)return false;
if(el.id==='atlasFrom'||el.id==='atlasTo'){
const v=el.value;if(!getAirport(v))return false;state[el.id==='atlasFrom'?'from':'to']=v;
if(state.from===state.to){state[el.id==='atlasFrom'?'to':'from']=AIRPORTS.find(a=>a.code!==v).code}
return true;
}
if(el.id==='atlasAircraft'){if(!getAircraft(el.value))return false;state.aircraft=el.value;return true}
if(el.id==='atlasFilter'){state.filter=el.value;return true}
if(el.id==='atlasLoad'){state.load=Math.min(100,Math.max(60,Number(el.value)));return true}
return false;
}
function handleClick(e){const pin=e.target.closest('[data-atlas-pin]'),plane=e.target.closest('[data-atlas-aircraft]');
if(pin){const code=pin.getAttribute('data-atlas-pin');if(!getAirport(code))return false;state.to=code;if(state.from===state.to)state.from=AIRPORTS.find(a=>a.code!==code).code;return true}
if(plane){const id=plane.getAttribute('data-atlas-aircraft');if(!getAircraft(id))return false;state.aircraft=id;return true}
return false}
const api={AIRPORTS,FLEET,state,render,handleChange,handleClick,distance,project};
root.AeroAtlas=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);