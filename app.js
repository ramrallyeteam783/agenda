// Agenda partagé — interface (vue Jour / Semaine / Mois / Planning)
import * as B from './backend.js';
import { appName } from './config.js';

const ICON={menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',left:'<path d="M15 5l-7 7 7 7"/>',right:'<path d="M9 5l7 7-7 7"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.6"/><path d="M12 17h.01"/>',pencil:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
trash:'<path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',plus:'<path d="M12 5v14M5 12h14"/>',down:'<path d="M7 10l5 5 5-5"/>',
clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',pin:'<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
notes:'<path d="M4 6h16M4 10h16M4 14h16M4 18h10"/>',cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5h16M8.5 3v4M15.5 3v4"/>',
lock:'<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',share:'<circle cx="9" cy="8" r="3.5"/><path d="M3 20c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5"/><path d="M18 8v6M15 11h6"/>',
link:'<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
mail:'<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',out:'<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 4-6.5 8-6.5s7.2 2.5 8 6.5"/>',dl:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'};
const ic=(n,s=20,w=1.8)=>`<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
document.querySelectorAll('[data-i]').forEach(el=>{el.insertAdjacentHTML('afterbegin',ic(el.dataset.i,+(el.dataset.s||20)))});

const PAL=[['Tomate','#d50000'],['Flamant','#e67c73'],['Mandarine','#f4511e'],['Banane','#f6bf26'],['Sauge','#33b679'],['Basilic','#0b8043'],['Paon','#039be5'],['Bleuet','#3f51b5'],['Lavande','#7986cb'],['Raisin','#8e24aa'],['Graphite','#616161']];
const MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const MC=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const JOURS=['dim.','lun.','mar.','mer.','jeu.','ven.','sam.'];
const JOURSL=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const VIEWS={day:['Jour','D'],week:['Semaine','W'],month:['Mois','M'],list:['Planning','A']};
const REP=['d','w','m','y'],HH=48;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p2=n=>String(n).padStart(2,'0');
const ds=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const pd=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c,12)};
const add=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return ds(d)};
const diff=(a,b)=>Math.round((pd(b)-pd(a))/864e5);
const today=()=>ds(new Date());
const validD=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s);
const validT=s=>typeof s==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(s);
const mins=t=>validT(t)?(+t.slice(0,2))*60+(+t.slice(3)):0;
const addMin=(t,n)=>{const m=Math.min(mins(t)+n,23*60+59);return p2(Math.floor(m/60))+':'+p2(m%60)};
const fmtT=t=>{if(!validT(t))return'';const h=+t.slice(0,2),m=t.slice(3);return h+' h'+(m==='00'?'':' '+m)};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const dnum=d=>d.getDate()===1?'1er':String(d.getDate());
const longDate=s=>{const d=pd(s);return JOURSL[d.getDay()]+' '+dnum(d)+' '+MOIS[d.getMonth()]+' '+d.getFullYear()};
const shortDate=s=>{const d=pd(s);return dnum(d)+' '+MC[d.getMonth()]+' '+d.getFullYear()};
const tc=h=>{const n=parseInt(h.slice(1),16);return((n>>16)*299+(n>>8&255)*587+(n&255)*114)/1000>160?'#1f1f1f':'#ffffff'};
const hashIdx=s=>{let h=0;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))|0;return Math.abs(h)%PAL.length};
const isAll=e=>!!e.all||!validT(e.s);
const narrow=()=>matchMedia('(max-width:699px)').matches;
const drawerMode=()=>matchMedia('(max-width:899px)').matches;
const tzLabel=()=>{const o=-new Date().getTimezoneOffset(),a=Math.abs(o);return'GMT'+(o>=0?'+':'-')+p2(Math.floor(a/60))+(a%60?':'+p2(a%60):'')};
const appUrl=()=>location.origin+location.pathname.replace(/index\.html$/,'');
const validEmail=s=>/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(s);

const S={pwMode:'in',view:'week',cur:today(),mini:today().slice(0,8)+'01',q:'',events:{},people:{},members:{},me:null,email:'',user:null,isOwner:false,entered:false,
 hidden:new Set(),ready:false,occMap:{},wsTop:null,day:today(),from:null,title:appName||'Agenda partagé',installEvt:null};
let ctx={},lastFocus=null,tT=null,unsubs=[],evUnsub=null,loadTimer=null;
try{JSON.parse(localStorage.getItem('agp-hidden')||'[]').forEach(x=>typeof x==='string'&&S.hidden.add(x));const v=localStorage.getItem('agp-view');if(VIEWS[v])S.view=v;if(localStorage.getItem('agp-side')==='0')$('#app').classList.add('noside')}catch(e){}

const canW=()=>S.entered&&!!S.me;
const profOf=u=>{const p=S.people[u];return p&&typeof p==='object'?p:{}};
const colOf=u=>{const c=profOf(u).color;return PAL[Number.isInteger(c)&&c>=0&&c<PAL.length?c:hashIdx(u)][1]};
const nameOf=u=>{const p=profOf(u);return(typeof p.name==='string'&&p.name.trim())||(typeof p.email==='string'&&p.email.split('@')[0])||(u===S.me?'Moi':'Quelqu’un')};
const mailOf=u=>{const e=profOf(u).email;return typeof e==='string'?e:''};
const sty=u=>{const c=colOf(u);return`--c:${c};--tc:${tc(c)}`};
const title=e=>String(e.t||'').trim()||'(Sans titre)';
const multi=o=>isAll(o.e)||o.s!==o.en;
const reg=o=>{S.occMap[o.key]=o;return esc(o.key)};
const ownerOf=e=>typeof e.owner==='string'?e.owner:'';

function occ(from,to){
 const out=[],q=S.q.toLowerCase();
 for(const id of Object.keys(S.events)){
  const e=S.events[id];if(!e||typeof e!=='object'||!validD(e.d))continue;
  const uid=ownerOf(e);if(!uid||S.hidden.has(uid))continue;
  if(q&&!(String(e.t||'')+' '+String(e.loc||'')+' '+String(e.n||'')).toLowerCase().includes(q))continue;
  const end=validD(e.e)&&e.e>=e.d?e.e:e.d,len=Math.min(diff(e.d,end),366),until=validD(e.u)?e.u:null,ex=Array.isArray(e.x)?e.x:[];
  const push=s=>{const en=add(s,len);if(en>=from&&s<=to&&!ex.includes(s))out.push({uid,id,e,s,en,key:id+'|'+s})};
  if(!REP.includes(e.r)){push(e.d);continue}
  if(e.r==='d'||e.r==='w'){const st=e.r==='d'?1:7;for(let k=Math.max(0,Math.floor((diff(e.d,from)-len)/st)),n=0;n<800;k++,n++){const s=add(e.d,k*st);if(s>to||(until&&s>until))break;push(s)}}
  else{const b=pd(e.d),dd=b.getDate();for(let k=0;k<1200;k++){const y=b.getFullYear()+(e.r==='y'?k:0),m=b.getMonth()+(e.r==='m'?k:0),d=new Date(y,m,1,12),mm=d.getMonth();d.setDate(dd);if(d.getMonth()!==mm)continue;const s=ds(d);if(s>to||(until&&s>until))break;push(s)}}
 }
 return out.sort((a,b)=>a.s<b.s?-1:a.s>b.s?1:(isAll(b.e)-isAll(a.e))||mins(a.e.s)-mins(b.e.s)||title(a.e).localeCompare(title(b.e),'fr'));
}
function byDay(list,from,to){const by={};for(const o of list){for(let s=o.s<from?from:o.s,n=0;s<=o.en&&s<=to&&n<400;s=add(s,1),n++)(by[s]=by[s]||[]).push(o)}return by}
function chip(o){const f=multi(o);return`<button class="ev${f?' fill':''}" data-occ="${reg(o)}" style="${sty(o.uid)}">${f?'':`<span class="dot"></span><span class="tm">${fmtT(o.e.s)}</span>`}<span class="tt">${esc(title(o.e))}</span></button>`}
function timeText(o){if(isAll(o.e))return'Toute la journée';if(o.s!==o.en)return fmtT(o.e.s)+' →';return fmtT(o.e.s)+(validT(o.e.f)?' – '+fmtT(o.e.f):'')}
function itemHTML(o){return`<button class="item" data-occ="${reg(o)}"><span class="sw" style="${sty(o.uid)}"></span><span class="time">${timeText(o)}</span><span class="what"><b>${esc(title(o.e))}</b><small>${esc(nameOf(o.uid))}${o.e.loc?' · '+esc(o.e.loc):''}</small></span></button>`}

function layout(list){
 const it=list.map(o=>{const a=mins(o.e.s);let b=validT(o.e.f)?mins(o.e.f):a+60;if(b<=a)b=a+30;return{o,a,b}}).sort((x,y)=>x.a-y.a||y.b-x.b);
 const out=[];let g=[],gEnd=-1;
 const flush=()=>{const cols=[];for(const x of g){let i=cols.findIndex(e=>e<=x.a);if(i<0){i=cols.length;cols.push(0)}cols[i]=x.b;x.col=i}for(const x of g){x.n=cols.length;out.push(x)}g=[]};
 for(const x of it){if(g.length&&x.a>=gEnd){flush();gEnd=-1}g.push(x);gEnd=Math.max(gEnd,x.b)}
 if(g.length)flush();return out;
}
function blk(x){const h=Math.max(20,(x.b-x.a)/60*HH-2),o=x.o,tm=fmtT(o.e.s)+(validT(o.e.f)?' – '+fmtT(o.e.f):''),one=h<38;
 return`<button class="blk${one?' one':''}" data-occ="${reg(o)}" style="${sty(o.uid)};top:${x.a/60*HH}px;height:${h}px;left:calc(${x.col/x.n*100}% + 1px);width:calc(${100/x.n}% - ${x.n>1?2:10}px)"><b>${esc(title(o.e))}${one?',':''}</b><span>${tm}</span></button>`}
function renderCols(start,n){
 const end=add(start,n-1),t=today(),oc=occ(start,end),allBy=byDay(oc.filter(multi),start,end),timed={};
 for(const o of oc)if(!multi(o))(timed[o.s]=timed[o.s]||[]).push(o);
 const gc=`grid-template-columns:var(--gut) repeat(${n},minmax(0,1fr))`;
 let head=`<div class="wh tz">${tzLabel()}</div>`,alld='<div class="wa g"></div>',cols='';
 for(let i=0;i<n;i++){const s=add(start,i),d=pd(s);
  head+=`<div class="wh${s===t?' today':''}"><span class="wd">${JOURS[d.getDay()].toUpperCase()}</span><button class="dn" data-goday="${s}" aria-label="${esc(cap(longDate(s)))}">${d.getDate()}</button></div>`;
  alld+=`<div class="wa" data-day="${s}">${(allBy[s]||[]).map(chip).join('')}</div>`;
  cols+=`<div class="col" data-col="${s}">${layout(timed[s]||[]).map(blk).join('')}${s===t?'<div class="now" id="now"></div>':''}</div>`}
 const hrs='<div>'+Array.from({length:24},(_,h)=>`<div class="hr">${h?h+' h':''}</div>`).join('')+'</div>';
 return`<div class="whead" style="${gc}">${head}</div><div class="wall" style="${gc}">${alld}</div><div class="wscroll" id="ws"><div class="tg" style="${gc}">${hrs}${cols}</div></div>`;
}
function monthRange(){const c=pd(S.cur),first=new Date(c.getFullYear(),c.getMonth(),1,12),last=new Date(c.getFullYear(),c.getMonth()+1,0,12);return[add(ds(first),-first.getDay()),add(ds(last),6-last.getDay())]}
function renderMonth(){
 const[start,end]=monthRange(),days=diff(start,end)+1,by=byDay(occ(start,end),start,end),t=today(),mon=pd(S.cur).getMonth(),max=3;
 let h='';
 for(let i=0;i<days;i++){const s=add(start,i),d=pd(s),l=by[s]||[];
  h+=`<div class="cell${d.getMonth()!==mon?' out':''}${s===t?' today':''}" data-day="${s}" role="button" tabindex="0" aria-label="${esc(cap(longDate(s)))}, ${l.length} événement${l.length>1?'s':''}">${i<7?`<span class="cdow">${JOURS[d.getDay()].toUpperCase()}</span>`:''}<button class="dn" data-goday="${s}">${d.getDate()===1?'1er '+MC[d.getMonth()]:d.getDate()}</button>${l.slice(0,l.length>max?max-1:max).map(chip).join('')}${l.length>max?`<button class="more" data-more="${s}">${narrow()?'+'+(l.length-max+1):(l.length-max+1)+' de plus'}</button>`:''}</div>`}
 return`<div class="month" style="grid-template-rows:repeat(${days/7},minmax(0,1fr))">${h}</div>`;
}
function renderList(){
 const from=S.cur,to=add(from,S.q?365:59),by=byDay(occ(from,to),from,to),keys=Object.keys(by).sort(),t=today();
 if(!keys.length)return`<div class="empty"><p>${S.q?'Aucun événement ne correspond à « '+esc(S.q)+' ».':'Rien de prévu pour les 60 prochains jours.'}</p>${canW()&&!S.q?'<button class="primary" data-act="new">Créer un événement</button>':''}</div>`;
 return'<div class="plan">'+keys.map(s=>{const d=pd(s);return`<section class="pday${s===t?' today':''}"><div class="pdl"><button class="dn" data-goday="${s}" aria-label="${esc(cap(longDate(s)))}">${d.getDate()}</button><small>${MC[d.getMonth()]} ${JOURS[d.getDay()]}</small></div><div>${by[s].map(itemHTML).join('')}</div></section>`}).join('')+'</div>';
}
const weekStart=s=>add(s,-pd(s).getDay());
function rangeStart(){return S.view==='month'?monthRange()[0]:S.view==='week'?weekStart(S.cur):S.cur}
function periodLabel(){const c=pd(S.cur);
 if(S.view==='day')return cap(dnum(c)+' '+MOIS[c.getMonth()]+' '+c.getFullYear());
 if(S.view==='week'){const a=pd(weekStart(S.cur)),b=pd(add(weekStart(S.cur),6));
  if(a.getMonth()===b.getMonth())return cap(MOIS[a.getMonth()])+' '+a.getFullYear();
  return a.getFullYear()===b.getFullYear()?cap(MC[a.getMonth()])+' – '+MC[b.getMonth()]+' '+b.getFullYear():cap(MC[a.getMonth()])+' '+a.getFullYear()+' – '+MC[b.getMonth()]+' '+b.getFullYear()}
 return cap(MOIS[c.getMonth()])+' '+c.getFullYear();
}
function renderMini(){
 const m=pd(S.mini),first=new Date(m.getFullYear(),m.getMonth(),1,12),start=add(ds(first),-first.getDay()),t=today();
 let a=S.cur,b=S.cur;if(S.view==='week'){a=weekStart(S.cur);b=add(a,6)}
 let h=`<div class="mh"><b>${cap(MOIS[m.getMonth()])} ${m.getFullYear()}</b><div><button class="ib sm" data-mini="-1" aria-label="Mois précédent">${ic('left',18)}</button><button class="ib sm" data-mini="1" aria-label="Mois suivant">${ic('right',18)}</button></div></div><div class="mg">`+['D','L','M','M','J','V','S'].map(x=>`<span>${x}</span>`).join('');
 for(let i=0;i<42;i++){const s=add(start,i),d=pd(s);h+=`<button class="${d.getMonth()!==m.getMonth()?'o ':''}${s===t?'t':s>=a&&s<=b&&S.view!=='month'&&S.view!=='list'?'s':''}" data-go="${s}" aria-label="${esc(cap(longDate(s)))}">${d.getDate()}</button>`}
 $('#mini').innerHTML=h+'</div>';
}
function peopleIds(){const ids=new Set(Object.keys(S.people));for(const e of Object.values(S.events)){const o=e&&ownerOf(e);if(o)ids.add(o)}if(S.me)ids.add(S.me);return[...ids]}
function renderPeople(){
 const cnt={};for(const e of Object.values(S.events)){const o=e&&ownerOf(e);if(o)cnt[o]=(cnt[o]||0)+1}
 const arr=peopleIds().sort((a,b)=>(b===S.me)-(a===S.me)||nameOf(a).localeCompare(nameOf(b),'fr'));
 $('#people').innerHTML=arr.map(u=>{const on=!S.hidden.has(u);return`<div class="prow" style="${sty(u)}"><button class="cb" role="checkbox" aria-checked="${on}" data-pp="${esc(u)}" title="${esc(mailOf(u))}"><span class="bx"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${tc(colOf(u))}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON.check}</svg></span><span class="nm">${esc(nameOf(u))}${u===S.me?' (moi)':''}</span><span class="cnt">${cnt[u]||0}</span></button>${u===S.me?`<button class="ib sm" data-act="color" aria-label="Changer ma couleur" title="Changer ma couleur"><span style="display:block;width:14px;height:14px;border-radius:50%;background:var(--c);box-shadow:0 0 0 2px var(--surf),0 0 0 3px var(--line)"></span></button>`:''}</div>`}).join('');
}
function renderViews(){
 $('#vlab').textContent=VIEWS[S.view][0];
 $('#vmenu').innerHTML=Object.entries(VIEWS).map(([k,[l,s]])=>`<button role="menuitemradio" aria-checked="${k===S.view}" data-view="${k}">${l}<kbd>${s}</kbd></button>`).join('');
 $('#vside').innerHTML=Object.entries(VIEWS).map(([k,[l]])=>`<button aria-pressed="${k===S.view}" data-view="${k}">${l}</button>`).join('');
}
function render(){
 if(S.entered)ensureWindow(rangeStart());
 S.occMap={};
 $('#period').textContent=periodLabel();
 const dn=pd(today()).getDate();$('#logod').textContent=dn;$('#tico').textContent=dn;
 const cw=canW();$('#new').hidden=!cw;$('#mnew').hidden=!cw;$('#ren').hidden=!S.isOwner;$('#smem').hidden=!S.isOwner;
 $('#instbar').hidden=!S.installEvt;
 const ws=$('#ws');if(ws)S.wsTop=ws.scrollTop;
 const v=S.view;
 $('#cal').innerHTML=v==='month'?renderMonth():v==='list'?renderList():renderCols(v==='day'?S.cur:weekStart(S.cur),v==='day'?1:7);
 const w=$('#ws');if(w){w.scrollTop=S.wsTop??7*HH-8;w.onscroll=()=>{S.wsTop=w.scrollTop};document.documentElement.style.setProperty('--sbw',(w.offsetWidth-w.clientWidth)+'px');placeNow()}
 renderMini();renderPeople();renderViews();
}
function placeNow(){const n=$('#now');if(n){const d=new Date();n.style.top=(d.getHours()*60+d.getMinutes())/60*HH+'px'}}

function status(m){const s=$('#status');s.textContent=m||'';s.hidden=!m}
function toast(m,undo){const t=$('#toast');t.textContent='';const s=document.createElement('span');s.textContent=m;t.append(s);if(undo){const b=document.createElement('button');b.textContent='Annuler';b.onclick=()=>{t.hidden=true;undo()};t.append(b)}t.hidden=false;clearTimeout(tT);tT=setTimeout(()=>{t.hidden=true},7000)}
function openSheet(html,sel,label,anchor,wide){
 if($('#ov').hidden)lastFocus=document.activeElement;
 const sh=$('#sheet'),ov=$('#ov');sh.innerHTML=html;sh.setAttribute('aria-label',label||'Détails');sh.className='sheet'+(wide?' wide':'');sh.style.left=sh.style.top='';
 ov.classList.remove('clear');ov.hidden=false;
 if(anchor&&anchor.isConnected&&!drawerMode()){ov.classList.add('clear');sh.classList.add('pop');
  const r=anchor.getBoundingClientRect(),w=sh.offsetWidth,h=sh.offsetHeight,vw=innerWidth,vh=innerHeight;
  let left=r.right+10;if(left+w>vw-8)left=r.left-w-10;if(left<8)left=Math.max(8,Math.min(vw-w-8,r.left));
  sh.style.left=left+'px';sh.style.top=Math.max(8,Math.min(r.top,vh-h-8))+'px'}
 const f=sh.querySelector(sel||'input,select,textarea,button');if(f)f.focus();
}
function closeSheet(){$('#ov').hidden=true;$('#sheet').innerHTML='';if(lastFocus&&lastFocus.isConnected)lastFocus.focus()}

/* ---------- écriture ---------- */
function failed(e){const c=e&&e.code;if(c==='permission-denied')toast('Action refusée : tu peux modifier seulement tes propres événements.');else if(c==='resource-exhausted')toast('La limite gratuite du jour est atteinte. Réessaie demain.');else toast('L’enregistrement a échoué. Vérifie ta connexion Internet.')}
function clean(e){return{t:String(e.t||'').slice(0,200)||'(Sans titre)',d:e.d,e:validD(e.e)&&e.e>=e.d?e.e:e.d,all:!!e.all,s:validT(e.s)?e.s:'',f:validT(e.f)?e.f:'',r:REP.includes(e.r)?e.r:'',u:validD(e.u)?e.u:'',loc:String(e.loc||'').slice(0,200),n:String(e.n||'').slice(0,2000),x:Array.isArray(e.x)?e.x.filter(validD).slice(-300):[]}}
function putEvent(id,obj){const o=clean(obj);B.setEvent(id,{...o,owner:S.me,last:o.r?(o.u||'9999-12-31'):o.e,updatedAt:B.stamp()}).catch(failed)}
function dropEvent(id){B.delEvent(id).catch(failed)}
function myProfile(color){const u=S.user||{},p=profOf(S.me);const c=Number.isInteger(color)?color:Number.isInteger(p.color)?p.color:hashIdx(S.me);
 return{name:String(u.displayName||S.email.split('@')[0]).slice(0,100),email:S.email,photo:typeof u.photoURL==='string'&&u.photoURL.startsWith('https://')?u.photoURL.slice(0,1000):'',color:c,updatedAt:B.stamp()}}
function syncProfile(){const p=profOf(S.me),m=myProfile();if(p.name!==m.name||p.email!==m.email||p.photo!==m.photo||!Number.isInteger(p.color))B.setProfile(S.me,m).catch(()=>{})}

function defDay(){const t=today();if(S.view==='month')return t.slice(0,7)===S.cur.slice(0,7)?t:S.cur.slice(0,8)+'01';if(S.view==='week'){const st=weekStart(S.cur);return t>=st&&t<=add(st,6)?t:st}if(S.view==='day')return S.cur;return S.cur>t?S.cur:t}
const nextHour=()=>p2(Math.min(new Date().getHours()+1,22))+':00';
function openNew(pre){if(!canW())return;ctx={o:null};const d=pre.d||defDay(),s=pre.s||nextHour();openSheet(formHTML(null,{d,s,f:pre.f||addMin(s,60),all:!!pre.all}),'#f-t','Nouvel événement',null,true)}
function formHTML(o,pre){
 const e=o?o.e:{},d=o?e.d:pre.d,end=o?(validD(e.e)&&e.e>=e.d?e.e:e.d):pre.d;
 const s=o?(validT(e.s)?e.s:'09:00'):pre.s,f=o?(validT(e.f)?e.f:addMin(s,60)):pre.f,all=o?isAll(e):pre.all,r=o&&REP.includes(e.r)?e.r:'';
 const op=(v,l)=>`<option value="${v}"${r===v?' selected':''}>${l}</option>`;
 return`<form id="evf" class="form" novalidate><div class="stop"><button type="button" class="ib" data-act="close" aria-label="Fermer">${ic('close')}</button></div>
 <div class="srow"><span></span><input id="f-t" class="tin" maxlength="200" autocomplete="off" placeholder="Ajouter un titre" aria-label="Titre" value="${esc(o?e.t||'':'')}"></div>
 <div class="srow"><span class="ico">${ic('clock')}</span><div><div class="dt"><span class="lb">Début</span><input type="date" id="f-d" class="fld" value="${d}" aria-label="Date de début"><input type="time" id="f-s" class="fld tm" value="${s}" step="300" aria-label="Heure de début"${all?' hidden':''}><span class="lb">Fin</span><input type="date" id="f-e" class="fld" value="${end}" aria-label="Date de fin"><input type="time" id="f-f" class="fld tm" value="${f}" step="300" aria-label="Heure de fin"${all?' hidden':''}></div>
 <div class="opts"><label class="ck"><input type="checkbox" id="f-all"${all?' checked':''}> Toute la journée</label><select id="f-r" class="sel" aria-label="Répétition">${op('','Ne se répète pas')}${op('d','Tous les jours')}${op('w','Toutes les semaines')}${op('m','Tous les mois')}${op('y','Tous les ans')}</select><label class="ck" id="f-uw"${r?'':' hidden'}>Jusqu’au <input type="date" id="f-u" class="fld" style="width:auto" value="${o&&validD(e.u)?e.u:''}"></label></div></div></div>
 <div class="srow"><span class="ico">${ic('pin')}</span><input id="f-loc" class="fld" maxlength="200" autocomplete="off" placeholder="Ajouter un lieu" aria-label="Lieu" value="${esc(o?e.loc||'':'')}"></div>
 <div class="srow"><span class="ico">${ic('notes')}</span><textarea id="f-n" class="fld" rows="3" maxlength="2000" placeholder="Ajouter une description" aria-label="Description">${esc(o?e.n||'':'')}</textarea></div>
 <div class="srow"><span class="ico" style="height:24px">${ic('cal')}</span><div class="calrow" style="${sty(S.me)}"><span class="sw"></span>${esc(nameOf(S.me))}</div></div>
 ${o&&r?'<div class="srow"><span></span><p class="hint">Les modifications s’appliquent à tous les événements de la série.</p></div>':''}
 <p class="err" id="f-err" role="alert"></p>
 <div class="acts"><button type="button" class="text" data-act="close">Annuler</button><button type="submit" class="primary">Enregistrer</button></div></form>`;
}
function submitForm(){
 const v=id=>$('#'+id).value,err=m=>{$('#f-err').textContent=m};
 const t=v('f-t').trim(),all=$('#f-all').checked,d=v('f-d'),r=v('f-r'),u=v('f-u');let e2=v('f-e'),s=v('f-s'),f=v('f-f');
 if(!t){err('Ajoute un titre à l’événement.');$('#f-t').focus();return}
 if(!validD(d)){err('Choisis une date de début.');return}
 if(!validD(e2)||e2<d)e2=d;
 if(!all){if(!validT(s)){err('Choisis une heure de début.');return}if(!validT(f))f=addMin(s,60);if(e2===d&&mins(f)<=mins(s)){err('L’heure de fin doit être après l’heure de début.');return}}
 if(r&&validD(u)&&u<d){err('La date « jusqu’au » doit suivre la date de début.');return}
 const o=ctx.o,prev=o?clean(o.e):null,id=o?o.id:B.newId();
 const obj={t,d,e:e2,all,s:all?'':s,f:all?'':f,r,u:r?u:'',loc:v('f-loc').trim(),n:v('f-n').trim(),x:prev&&prev.d===d?prev.x:[]};
 closeSheet();putEvent(id,obj);
 toast(o?'Événement modifié':'Événement enregistré',o?()=>putEvent(id,prev):()=>dropEvent(id));
}
function repText(e){const d=pd(e.d);const b={d:'Tous les jours',w:'Toutes les semaines le '+JOURSL[d.getDay()],m:'Tous les mois le '+dnum(d),y:'Tous les ans le '+dnum(d)+' '+MOIS[d.getMonth()]}[e.r];return b+(validD(e.u)?', jusqu’au '+shortDate(e.u):'')}
function whenText(o){const e=o.e;
 if(isAll(e))return o.s===o.en?cap(longDate(o.s)):cap(longDate(o.s))+' – '+longDate(o.en);
 const f=validT(e.f)?e.f:addMin(e.s,60);
 return o.s===o.en?cap(longDate(o.s))+' · '+fmtT(e.s)+' – '+fmtT(f):cap(longDate(o.s))+', '+fmtT(e.s)+' – '+longDate(o.en)+', '+fmtT(f);
}
function rrule(e){if(!REP.includes(e.r))return'';return'FREQ='+{d:'DAILY',w:'WEEKLY',m:'MONTHLY',y:'YEARLY'}[e.r]+(validD(e.u)?';UNTIL='+e.u.replace(/-/g,'')+'T235959':'')}
function span(o){const e=o.e,rec=REP.includes(e.r),s=rec?e.d:o.s,en=add(s,diff(o.s,o.en)),f=validT(e.f)?e.f:addMin(e.s,60);return{s,en,f}}
function gcal(o){const e=o.e,{s,en,f}=span(o),c=x=>x.replace(/-/g,''),tt=x=>x.replace(':','')+'00';
 const p=new URLSearchParams({action:'TEMPLATE',text:title(e),dates:isAll(e)?c(s)+'/'+c(add(en,1)):c(s)+'T'+tt(e.s)+'/'+c(en)+'T'+tt(f),details:String(e.n||''),location:String(e.loc||'')});const r=rrule(e);if(r)p.set('recur','RRULE:'+r);
 return'https://calendar.google.com/calendar/render?'+p.toString()}
function outlook(o){const e=o.e,{s,en,f}=span(o),all=isAll(e);
 const p=new URLSearchParams({path:'/calendar/action/compose',rru:'addevent',subject:title(e),startdt:all?s:s+'T'+e.s+':00',enddt:all?add(en,1):en+'T'+f+':00',allday:String(all),body:String(e.n||''),location:String(e.loc||'')});
 return'https://outlook.live.com/calendar/0/deeplink/compose?'+p.toString()}
function openDetails(o,anchor){
 ctx={o};const e=o.e,mine=o.uid===S.me&&canW(),rec=REP.includes(e.r),mail=mailOf(o.uid);
 const row=(i,html)=>`<div class="srow"><span class="ico">${ic(i)}</span><div>${html}</div></div>`;
 openSheet(`<div class="stop">${mine?`<button class="ib" data-act="edit" aria-label="Modifier l’événement" title="Modifier">${ic('pencil')}</button><button class="ib" data-act="del" aria-label="Supprimer l’événement" title="Supprimer">${ic('trash')}</button>`:''}<button class="ib" data-act="close" aria-label="Fermer" title="Fermer">${ic('close')}</button></div>
 <div class="srow head" style="${sty(o.uid)}"><span class="ico"><span class="sq"></span></span><div><h2 class="stt">${esc(title(e))}</h2><div class="sub">${esc(whenText(o))}</div>${rec?`<div class="sub">${esc(repText(e))}</div>`:''}</div></div>
 ${e.loc?row('pin',esc(e.loc)):''}${e.n?row('notes',`<div class="note">${esc(e.n)}</div>`):''}
 ${row('cal',`${esc(nameOf(o.uid))}${o.uid===S.me?' (toi)':''}${mail?` <span class="mail">· ${esc(mail)}</span>`:''}`)}
 ${mine?'':row('lock',`<span class="lock">Seul·e ${esc(nameOf(o.uid))} peut modifier ou supprimer cet événement.</span>`)}
 <div class="srow"><span class="ico" style="height:36px">${ic('link')}</span><div class="links"><a class="tl" href="${esc(gcal(o))}" target="_blank" rel="noopener">Copier dans Google Agenda</a><a class="tl" href="${esc(outlook(o))}" target="_blank" rel="noopener">Copier dans Outlook</a></div></div>`,'[data-act=close]',title(e),anchor);
}
function openDelRec(o){ctx={o};openSheet(`<h2 class="sh">Supprimer l’événement périodique</h2><label class="radio"><input type="radio" name="dr" value="one" checked> Cet événement</label><label class="radio"><input type="radio" name="dr" value="all"> Tous les événements</label><div class="acts"><button class="text" data-act="close">Annuler</button><button class="primary" data-act="delok">OK</button></div>`,'input[name=dr]','Supprimer l’événement périodique')}
function openDay(s,anchor){ctx={day:s};const l=occ(s,s),d=pd(s);
 openSheet(`<div class="stop"><button class="ib" data-act="close" aria-label="Fermer">${ic('close')}</button></div><div style="text-align:center;margin-top:-28px"><div class="wd">${JOURS[d.getDay()].toUpperCase()}</div><button class="dn" data-goday="${s}" style="margin:4px auto 10px">${d.getDate()}</button></div>${l.length?'<div class="dlist">'+l.map(itemHTML).join('')+'</div>':'<p class="hint" style="text-align:center">Aucun événement ce jour-là.</p>'}${canW()?'<div class="acts"><button class="primary" data-act="newday">Créer un événement</button></div>':''}`,'.item,[data-act=close]',cap(longDate(s)),anchor);
}
function openColor(){const p=profOf(S.me),cur=Number.isInteger(p.color)?p.color:hashIdx(S.me);
 openSheet(`<h2 class="sh">Couleur de mon agenda</h2><p class="ptxt hint">Tout le monde verra tes événements dans cette couleur.</p><div class="pal">${PAL.map(([n,h],i)=>`<button class="sws${cur===i?' on':''}" data-act="pick" data-i="${i}" style="--c:${h}" aria-pressed="${cur===i}"><span></span>${n}</button>`).join('')}</div><div class="acts"><button class="text" data-act="close">Fermer</button></div>`,'.sws.on','Couleur de mon agenda')}
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function openHelp(){
 openSheet(`<h2 class="sh">Aide</h2>
 <p class="ptxt"><b>Qui peut supprimer quoi :</b> chacun peut modifier ou supprimer seulement ses propres événements. Personne ne peut supprimer ceux des autres, pas même la personne qui gère l’agenda.</p>
 ${S.isOwner?'<p class="ptxt"><b>Inviter quelqu’un :</b> ouvre <b>Membres et invitations</b>, ajoute son adresse courriel, puis envoie-lui l’invitation avec le bouton ✉.</p>':'<p class="ptxt"><b>Inviter quelqu’un :</b> demande à la personne qui gère l’agenda de l’ajouter.</p>'}
 <p class="ptxt"><b>Installer l’app :</b> ${isIOS()?'dans Safari, touche Partager puis « Sur l’écran d’accueil ». Dans l’app installée, connecte-toi avec ton courriel et ton mot de passe.':'dans Chrome ou Edge, ouvre le menu ⋮ puis « Installer l’application » (ou « Ajouter à l’écran d’accueil » sur Android).'}</p>
 <p class="ptxt hint">Raccourcis : T aujourd’hui · J/K suivant/précédent · D jour · W semaine · M mois · A planning · C créer · / rechercher</p>
 <div class="acts"><button class="primary" data-act="close">OK</button></div>`,'[data-act=close]','Aide')}
function inviteHref(email){const n=S.title;const body=`Salut!\n\nJe t’ai ajouté·e à mon agenda partagé « ${n} ».\n\nOuvre ce lien :\n${appUrl()}\n\nConnecte-toi avec Google, ou crée un mot de passe, avec cette adresse : ${email}\n\nTu pourras y mettre tes événements. Personne d’autre ne peut modifier ou effacer les tiens.\n\nSur iPhone : ouvre le lien dans Safari, touche Partager puis « Sur l’écran d’accueil ». Dans l’app installée, utilise la connexion par courriel.`;
 return'mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent('Invitation : '+n)+'&body='+encodeURIComponent(body)}
function membersHTML(){const list=Object.keys(S.members).filter(validEmail).sort();
 return`<h2 class="sh">Membres et invitations</h2><p class="ptxt hint">Seules les personnes de cette liste peuvent ouvrir l’agenda. Elles se connectent avec Google ou avec un mot de passe, à la même adresse que celle inscrite ici. N’importe quelle adresse fonctionne (Gmail, Outlook, Hotmail, Vidéotron…).</p>
 <form id="memf" class="madd" novalidate><input id="m-e" class="fld" type="email" inputmode="email" autocomplete="off" placeholder="courriel@gmail.com" aria-label="Adresse courriel à ajouter"><button class="primary" type="submit">Ajouter</button></form><p class="err" id="m-err" role="alert"></p>
 <div class="mlist"><div class="mrow"><span class="em">${esc(B.owner())}</span><span class="tag">Gestionnaire (toi)</span></div>${list.map(m=>`<div class="mrow"><span class="em" title="${esc(m)}">${esc(m)}</span><a class="ib sm" href="${esc(inviteHref(m))}" title="Envoyer l’invitation par courriel" aria-label="Envoyer l’invitation par courriel à ${esc(m)}">${ic('mail',18)}</a><button class="ib sm" data-rm="${esc(m)}" title="Retirer l’accès" aria-label="Retirer l’accès de ${esc(m)}">${ic('trash',18)}</button></div>`).join('')||'<p class="hint" style="padding:6px 16px">Personne d’autre pour l’instant.</p>'}</div>
 <div class="mtools"><button class="text" data-act="copylink">${'Copier le lien de l’agenda'}</button></div>
 <p class="ptxt hint">Retirer une personne lui enlève l’accès, mais ses événements restent dans l’agenda.</p>
 <div class="acts"><button class="primary" data-act="close">OK</button></div>`}
function openMembers(){if(!S.isOwner)return;ctx={members:true};openSheet(membersHTML(),'#m-e','Membres et invitations',null,true)}
function openRename(){openSheet(`<form id="renf" class="form" novalidate><h2 class="sh">Nom de l’agenda</h2><div class="srow"><span></span><input id="r-t" class="tin" maxlength="80" value="${esc(S.title)}" aria-label="Nom de l’agenda"></div><div class="acts"><button type="button" class="text" data-act="close">Annuler</button><button type="submit" class="primary">Enregistrer</button></div></form>`,'#r-t','Nom de l’agenda')}
function setTitle(t){S.title=t;$('#title').textContent=t;document.title=t}

/* ---------- compte ---------- */
function avatarInner(){const u=S.user;if(u&&typeof u.photoURL==='string'&&u.photoURL.startsWith('https://'))return null;return(String((u&&u.displayName)||S.email||'?').trim().charAt(0)||'?').toUpperCase()}
function paintAvatar(el){el.textContent='';const t=avatarInner();if(t){el.textContent=t;return}const img=new Image();img.alt='';img.referrerPolicy='no-referrer';img.onerror=()=>{el.textContent=(S.email||'?').charAt(0).toUpperCase()};img.src=S.user.photoURL;el.append(img)}
function openAcct(){const a=$('#acct');if(!a.hidden){a.hidden=true;return}
 a.innerHTML=`<div class="big" id="bigav"></div><b></b><small></small>${S.isOwner?`<button data-act="members">${ic('share')}Membres et invitations</button>`:''}${S.installEvt?`<button data-act="install">${ic('dl')}Installer l’app</button>`:''}<button data-act="signout">${ic('out')}Se déconnecter</button>`;
 a.querySelector('b').textContent=(S.user&&S.user.displayName)||'';a.querySelector('small').textContent=S.email;paintAvatar($('#bigav'));a.hidden=false;
 const f=a.querySelector('button');if(f)f.focus()}
async function install(){const e=S.installEvt;if(!e)return;S.installEvt=null;render();try{await e.prompt()}catch(x){}}

/* ---------- écrans d’accès ---------- */
const iosApp=()=>navigator.standalone===true;
function authMsg(e){const c=e&&e.code||'';return({
 'auth/invalid-credential':'Courriel ou mot de passe incorrect.','auth/wrong-password':'Courriel ou mot de passe incorrect.','auth/user-not-found':'Courriel ou mot de passe incorrect.',
 'auth/email-already-in-use':'Un compte existe déjà avec ce courriel : connecte-toi, ou utilise « Mot de passe oublié? ».','auth/weak-password':'Le mot de passe doit avoir au moins 6 caractères.',
 'auth/invalid-email':'Adresse courriel invalide.','auth/too-many-requests':'Trop d’essais. Réessaie dans quelques minutes.','auth/network-request-failed':'Pas de connexion Internet.',
 'auth/operation-not-allowed':'Cette méthode de connexion n’est pas activée dans Firebase (Authentication → Méthode de connexion).',
 'auth/popup-closed-by-user':'Connexion annulée.','auth/cancelled-popup-request':'Connexion annulée.',
 'auth/unauthorized-domain':'Ce site n’est pas autorisé dans Firebase : ajoute son adresse dans Authentication → Paramètres → Domaines autorisés.'
 })[c]||'La connexion n’a pas fonctionné. Réessaie.'}
function gate(kind,msg){
 const g=$('#gate'),c=$('#gcard');g.hidden=false;
 const head=`<img src="icons/icon-192.png" alt=""><h1>${esc(S.title)}</h1>`;
 if(kind==='loading')c.innerHTML=head+'<div class="spin" aria-label="Chargement"></div>';
 else if(kind==='setup')c.innerHTML=`<img src="icons/icon-192.png" alt=""><h1>Configuration à terminer</h1><p>L’app n’est pas encore reliée à ta base de données. Il reste trois étapes, expliquées dans le fichier <b>LISEZMOI.md</b> :</p><ol><li>Créer un projet Firebase gratuit (connexion Google et courriel, base Firestore).</li><li>Coller sa configuration et ton courriel dans <b>config.js</b>.</li><li>Coller les règles de <b>firestore.rules</b> dans Firestore.</li></ol>`;
 else if(kind==='signin'){const up=S.pwMode==='up',g=`<button class="gbtn" id="gsign">${ic('user',22)}Continuer avec Google</button>`;
  const f=`<form id="pwf" class="pwf" novalidate>${up?'<input id="pw-n" class="fld" autocomplete="name" placeholder="Ton prénom" aria-label="Ton prénom" maxlength="60">':''}<input id="pw-e" class="fld" type="email" inputmode="email" autocomplete="username" placeholder="Adresse courriel" aria-label="Adresse courriel"><input id="pw-p" class="fld" type="password" autocomplete="${up?'new-password':'current-password'}" placeholder="${up?'Choisis un mot de passe (6 caractères ou plus)':'Mot de passe'}" aria-label="Mot de passe"><button class="primary" type="submit">${up?'Créer mon compte':'Se connecter'}</button><div class="pwl"><button class="text" type="button" id="pw-mode">${up?'J’ai déjà un compte':'Créer un compte'}</button>${up?'':'<button class="text" type="button" id="pw-forgot">Mot de passe oublié?</button>'}</div></form>`;
  c.innerHTML=head+`<p>${up?'Crée ton compte avec l’adresse courriel où tu as reçu l’invitation.':'Connecte-toi pour voir l’agenda et y ajouter tes événements.'}</p>${iosApp()?f+'<div class="or"><span>ou</span></div>'+g:g+'<div class="or"><span>ou avec ton courriel</span></div>'+f}<p class="gerr" id="gerr" role="alert"></p>`}
 else if(kind==='verify')c.innerHTML=head+`<p>Presque fini! Un courriel de confirmation a été envoyé à <span class="em"></span>.</p><p>Ouvre-le et clique sur le lien (regarde aussi dans les courriels indésirables), puis reviens ici.</p><button class="primary" id="vok">J’ai confirmé mon courriel</button><div class="pwl"><button class="text" id="vre">Renvoyer le courriel</button><button class="text" id="gout2">Changer de compte</button></div><p class="gerr" id="gerr" role="alert"></p>`;
 else if(kind==='pending')c.innerHTML=head+`<p>Tu es connecté·e avec <span class="em"></span>.</p><p>Cette adresse n’a pas encore accès à l’agenda. Demande à la personne qui le gère de t’ajouter dans <b>Membres</b>. La page s’ouvrira toute seule dès que c’est fait.</p><button class="gbtn" id="gout">${ic('out',20)}Changer de compte</button>`;
 else c.innerHTML=head+`<p></p><button class="gbtn" id="greload">Recharger</button>`;
 if(kind==='pending'||kind==='verify')c.querySelector('.em').textContent=S.email;
 if(kind==='error')c.querySelector('p').textContent=msg||'Une erreur est survenue.';
 const s=$('#gsign');if(s)s.onclick=async()=>{s.disabled=true;$('#gerr').textContent='';try{await B.signIn()}catch(e){$('#gerr').textContent=authMsg(e)+(iosApp()?' Sur l’app installée d’un iPhone, utilise plutôt la connexion par courriel.':'')}s.disabled=false};
 const o=$('#gout');if(o)o.onclick=()=>B.signOut();
 const o2=$('#gout2');if(o2)o2.onclick=()=>B.signOut();
 const er=m=>{const e=$('#gerr');if(e){e.textContent=m;e.style.color=''}},ok=m=>{const e=$('#gerr');if(e){e.textContent=m;e.style.color='var(--blue)'}};
 const pm=$('#pw-mode');if(pm)pm.onclick=()=>{S.pwMode=S.pwMode==='up'?'in':'up';const em=$('#pw-e').value;gate('signin');$('#pw-e').value=em;$(S.pwMode==='up'?'#pw-n':'#pw-e').focus()};
 const fg=$('#pw-forgot');if(fg)fg.onclick=async()=>{const em=$('#pw-e').value.trim();if(!validEmail(em)){er('Écris ton adresse courriel, puis appuie de nouveau sur « Mot de passe oublié? ».');$('#pw-e').focus();return}
  try{await B.resetPassword(em);ok('Si un compte existe pour '+em+', un courriel pour choisir un nouveau mot de passe vient d’être envoyé.')}catch(e){er(authMsg(e))}};
 const pf=$('#pwf');if(pf)pf.onsubmit=async ev=>{ev.preventDefault();const em=$('#pw-e').value.trim(),pw=$('#pw-p').value,btn=pf.querySelector('[type=submit]');
  if(!validEmail(em)){er('Entre une adresse courriel valide.');return}if(pw.length<6){er('Le mot de passe doit avoir au moins 6 caractères.');return}
  btn.disabled=true;er('');try{if(S.pwMode==='up')await B.signUpEmail(em,pw,($('#pw-n').value||'').trim().slice(0,60));else await B.signInEmail(em,pw)}catch(e){er(authMsg(e))}btn.disabled=false};
 const vok=$('#vok');if(vok)vok.onclick=async()=>{vok.disabled=true;try{const u=await B.refreshUser();if(u&&u.emailVerified)startFor(u);else er('Ton courriel n’est pas encore confirmé. Clique sur le lien reçu, puis réessaie.')}catch(e){er(authMsg(e))}vok.disabled=false};
 const vre=$('#vre');if(vre)vre.onclick=async()=>{try{await B.resendVerification();ok('Courriel renvoyé à '+S.email+'.')}catch(e){er(authMsg(e))}};
 const r=$('#greload');if(r)r.onclick=()=>location.reload();
}
function hideGate(){$('#gate').hidden=true}
function stopData(){for(const u of unsubs)try{u()}catch(e){}unsubs=[];if(evUnsub){try{evUnsub()}catch(e){}evUnsub=null}S.entered=false;S.events={};S.people={};S.members={};S.from=null;S.ready=false;clearTimeout(loadTimer)}
function dataErr(e){
 if(e&&e.code==='permission-denied'){
  if(S.isOwner){status('La base de données refuse l’accès. Vérifie que ton courriel est identique dans config.js et dans les règles Firestore (firestore.rules), puis que les règles sont publiées.');return}
  stopData();gate('pending');return}
 status('Connexion perdue avec la base de données. Les changements seront envoyés au retour de la connexion.');
}
function ensureWindow(start){if(S.from&&start>=S.from)return;const t=today();S.from=add(start<t?start:t,-31);
 if(evUnsub)try{evUnsub()}catch(e){}
 evUnsub=B.watchEvents(S.from,(m,meta)=>{S.events=m;S.ready=true;clearTimeout(loadTimer);if(meta&&!meta.fromCache)status('');render()},dataErr)}
function enter(){
 if(S.entered)return;S.entered=true;hideGate();
 clearTimeout(loadTimer);loadTimer=setTimeout(()=>{if(!S.ready)status('L’agenda tarde à répondre. Vérifie ta connexion Internet.')},10000);
 unsubs.push(B.watchCol('people',m=>{S.people=m;syncProfile();render()},dataErr));
 unsubs.push(B.watchDoc('config','main',d=>{setTitle(d&&typeof d.name==='string'&&d.name.trim()?d.name.trim().slice(0,80):appName||'Agenda partagé')},()=>{}));
 if(S.isOwner)unsubs.push(B.watchCol('members',m=>{S.members=m;if(ctx.members&&!$('#ov').hidden&&!$('#m-e').value){const y=$('#sheet .mlist');if(y)y.outerHTML=new DOMParser().parseFromString('<div>'+membersHTML()+'</div>','text/html').querySelector('.mlist').outerHTML}},()=>{}));
 render();
}

/* ---------- navigation ---------- */
function setView(v){if(!VIEWS[v])return;S.view=v;if(v==='list'&&S.cur<today())S.cur=today();S.wsTop=null;try{localStorage.setItem('agp-view',v)}catch(e){}$('#vmenu').hidden=true;$('#vbtn').setAttribute('aria-expanded','false');if(drawerMode())toggleSide(false);render()}
function goDate(s){S.cur=s;S.mini=s.slice(0,8)+'01';render()}
function nav(n){if(S.view==='month'){const d=pd(S.cur);d.setDate(1);d.setMonth(d.getMonth()+n);S.cur=ds(d)}else S.cur=add(S.cur,n*({day:1,week:7,list:30}[S.view]));S.mini=S.cur.slice(0,8)+'01';render()}
function goToday(){S.cur=today();S.mini=S.cur.slice(0,8)+'01';S.wsTop=null;render()}
function toggleSide(force){const a=$('#app');if(drawerMode()){const on=force??!a.classList.contains('drawer');a.classList.toggle('drawer',on);$('#scrim').hidden=!on}else{const off=force===undefined?!a.classList.contains('noside'):!force;a.classList.toggle('noside',off);try{localStorage.setItem('agp-side',off?'0':'1')}catch(e){}}}

$('#cal').addEventListener('click',ev=>{
 const g=ev.target.closest('[data-goday]');if(g){S.cur=g.dataset.goday;setView('day');return}
 const o=ev.target.closest('[data-occ]');if(o){const x=S.occMap[o.dataset.occ];if(x)openDetails(x,o);return}
 const m=ev.target.closest('[data-more]');if(m){openDay(m.dataset.more,m.closest('.cell'));return}
 if(ev.target.closest('[data-act=new]')){openNew({});return}
 const cell=ev.target.closest('.cell');if(cell){if(narrow()||!canW())openDay(cell.dataset.day,cell);else openNew({d:cell.dataset.day});return}
 const wa=ev.target.closest('.wa[data-day]');if(wa){if(canW())openNew({d:wa.dataset.day,all:true});return}
 const col=ev.target.closest('.col');if(col&&canW()){const r=col.getBoundingClientRect();const mm=Math.max(0,Math.min(Math.floor((ev.clientY-r.top)/HH*2)*30,22*60+30));const s=p2(Math.floor(mm/60))+':'+p2(mm%60);openNew({d:col.dataset.col,s,f:addMin(s,60)})}
});
$('#cal').addEventListener('keydown',ev=>{const c=ev.target.classList&&ev.target.classList.contains('cell')?ev.target:null;if(c&&(ev.key==='Enter'||ev.key===' ')){ev.preventDefault();openDay(c.dataset.day,c)}});
$('#sheet').addEventListener('click',ev=>{
 const g=ev.target.closest('[data-goday]');if(g){closeSheet();S.cur=g.dataset.goday;setView('day');return}
 const o=ev.target.closest('[data-occ]');if(o){const x=S.occMap[o.dataset.occ];if(x)openDetails(x);return}
 const rm=ev.target.closest('[data-rm]');if(rm){const m=rm.dataset.rm;B.removeMember(m).then(()=>toast('Accès retiré : '+m,()=>B.addMember(m).catch(failed))).catch(failed);return}
 const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,x=ctx.o;
 if(a==='close')closeSheet();
 else if(a==='edit'&&x){openSheet(formHTML(x),'#f-t','Modifier l’événement',null,true);ctx={o:x}}
 else if(a==='del'&&x){if(REP.includes(x.e.r))openDelRec(x);else{const prev=clean(x.e);closeSheet();dropEvent(x.id);toast('Événement supprimé',()=>putEvent(x.id,prev))}}
 else if(a==='delok'&&x){const one=($('#sheet input[name=dr]:checked')||{}).value!=='all',prev=clean(x.e);closeSheet();
  if(one){putEvent(x.id,{...prev,x:[...prev.x,x.s]});toast('Événement supprimé',()=>putEvent(x.id,prev))}else{dropEvent(x.id);toast('Série supprimée',()=>putEvent(x.id,prev))}}
 else if(a==='newday'){const d=ctx.day;closeSheet();openNew({d})}
 else if(a==='pick'){const i=+b.dataset.i;closeSheet();if(i>=0&&i<PAL.length){B.setProfile(S.me,myProfile(i)).catch(failed);toast('Couleur modifiée')}}
 else if(a==='copylink'){navigator.clipboard.writeText(appUrl()).then(()=>toast('Lien copié : '+appUrl())).catch(()=>toast('Lien : '+appUrl()))}
});
$('#sheet').addEventListener('change',ev=>{
 const id=ev.target.id;
 if(id==='f-all')document.querySelectorAll('#evf .tm').forEach(l=>{l.hidden=ev.target.checked});
 if(id==='f-r')$('#f-uw').hidden=!ev.target.value;
 if(id==='f-d'){const e=$('#f-e');if(validD(ev.target.value)&&(!validD(e.value)||e.value<ev.target.value))e.value=ev.target.value}
 if(id==='f-s'){const f=$('#f-f');if(validT(ev.target.value)&&$('#f-e').value===$('#f-d').value&&mins(f.value)<=mins(ev.target.value))f.value=addMin(ev.target.value,60)}
});
$('#sheet').addEventListener('submit',ev=>{ev.preventDefault();
 if(ev.target.id==='evf')submitForm();
 if(ev.target.id==='renf'){const t=$('#r-t').value.trim().slice(0,80)||appName||'Agenda partagé';closeSheet();B.setName(t).catch(failed);setTitle(t)}
 if(ev.target.id==='memf'){const m=$('#m-e').value.trim().toLowerCase(),er=$('#m-err');
  if(!validEmail(m)){er.textContent='Entre une adresse courriel valide.';return}
  if(m===B.owner()){er.textContent='C’est ton adresse : tu as déjà accès.';return}
  er.textContent='';$('#m-e').value='';B.addMember(m).then(()=>{toast('Ajouté : '+m);openSheet(membersHTML(),'#m-e','Membres et invitations',null,true)}).catch(failed)}
});
$('#ov').addEventListener('click',ev=>{if(ev.target.id==='ov')closeSheet()});
$('#side').addEventListener('click',ev=>{
 const go=ev.target.closest('[data-go]');if(go){goDate(go.dataset.go);if(drawerMode())toggleSide(false);return}
 const mi=ev.target.closest('[data-mini]');if(mi){const d=pd(S.mini);d.setMonth(d.getMonth()+(+mi.dataset.mini));S.mini=ds(d).slice(0,8)+'01';renderMini();return}
 const v=ev.target.closest('[data-view]');if(v){setView(v.dataset.view);return}
 if(ev.target.closest('[data-act=color]')){openColor();return}
 if(ev.target.closest('[data-act=help]')){if(drawerMode())toggleSide(false);openHelp();return}
 if(ev.target.closest('[data-act=members]')){if(drawerMode())toggleSide(false);openMembers();return}
 if(ev.target.closest('#inst')){install();return}
 const p=ev.target.closest('[data-pp]');if(!p)return;const u=p.dataset.pp;
 S.hidden.has(u)?S.hidden.delete(u):S.hidden.add(u);try{localStorage.setItem('agp-hidden',JSON.stringify([...S.hidden]))}catch(e){}render();
});
$('#acct').addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b)return;$('#acct').hidden=true;const a=b.dataset.act;
 if(a==='members')openMembers();else if(a==='install')install();else if(a==='signout')B.signOut()});
$('#avb').addEventListener('click',ev=>{ev.stopPropagation();openAcct()});
$('#vbtn').addEventListener('click',ev=>{ev.stopPropagation();const m=$('#vmenu');m.hidden=!m.hidden;$('#vbtn').setAttribute('aria-expanded',String(!m.hidden));if(!m.hidden){const c=m.querySelector('[aria-checked=true]');if(c)c.focus()}});
$('#vmenu').addEventListener('click',ev=>{const b=ev.target.closest('[data-view]');if(b)setView(b.dataset.view)});
document.addEventListener('click',ev=>{if(!ev.target.closest('.vsel'))$('#vmenu').hidden=true;if(!ev.target.closest('#acct')&&!ev.target.closest('#avb'))$('#acct').hidden=true});
$('#menu').addEventListener('click',()=>toggleSide());
$('#scrim').addEventListener('click',()=>toggleSide(false));
$('#prev').addEventListener('click',()=>nav(-1));
$('#next').addEventListener('click',()=>nav(1));
$('#tod').addEventListener('click',goToday);
$('#new').addEventListener('click',()=>openNew({}));
$('#mnew').addEventListener('click',()=>openNew({}));
$('#help').addEventListener('click',openHelp);
$('#ren').addEventListener('click',openRename);
let qT=null;$('#q').addEventListener('input',ev=>{clearTimeout(qT);qT=setTimeout(()=>{S.q=ev.target.value.trim();render()},150)});
document.addEventListener('keydown',ev=>{
 if(ev.key==='Escape'){if(!$('#ov').hidden)closeSheet();else if(!$('#acct').hidden)$('#acct').hidden=true;else if(!$('#vmenu').hidden)$('#vmenu').hidden=true;else if($('#app').classList.contains('drawer'))toggleSide(false);return}
 if(!S.entered||!$('#ov').hidden||ev.ctrlKey||ev.metaKey||ev.altKey)return;
 if(ev.target.closest&&ev.target.closest('input,textarea,select,[contenteditable]'))return;
 const f={t:goToday,j:()=>nav(1),n:()=>nav(1),k:()=>nav(-1),p:()=>nav(-1),d:()=>setView('day'),w:()=>setView('week'),m:()=>setView('month'),a:()=>setView('list'),c:()=>openNew({}),'/':()=>$('#q').focus()}[ev.key.toLowerCase()];
 if(f){ev.preventDefault();f()}
});
let lastW=narrow()+'|'+drawerMode();addEventListener('resize',()=>{const k=narrow()+'|'+drawerMode();if(k!==lastW){lastW=k;$('#app').classList.remove('drawer');$('#scrim').hidden=true;render()}});
setInterval(()=>{if(S.day!==today()){S.day=today();render()}else placeNow()},60000);
addEventListener('beforeinstallprompt',e=>{e.preventDefault();S.installEvt=e;render()});
addEventListener('appinstalled',()=>{S.installEvt=null;render()});
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});

/* ---------- démarrage ---------- */
function startFor(u){
 stopData();$('#acct').hidden=true;closeSheet();
 if(!u){S.user=null;S.me=null;S.email='';gate('signin');return}
 S.user=u;S.me=u.uid;S.email=String(u.email||'').toLowerCase();S.isOwner=!!S.email&&S.email===B.owner();paintAvatar($('#av'));
 if(!u.emailVerified){gate('verify');return}
 if(S.isOwner){enter();return}
 gate('loading');
 unsubs.push(B.watchDoc('members',S.email,d=>{if(d){enter()}else{if(S.entered){stopData();unsubs.push(B.watchDoc('members',S.email,x=>{if(x)enter()},()=>{}))}gate('pending')}},()=>gate('pending')));
}
setTitle(appName||'Agenda partagé');
render();
(async()=>{
 if(!B.configured||!B.ownerConfigured){gate('setup');return}
 try{await B.init()}catch(e){gate('error','Impossible de charger l’agenda. Vérifie ta connexion Internet, puis recharge la page.');return}
 B.onUser(startFor);
})();
