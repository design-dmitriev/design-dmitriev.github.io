(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow=matchMedia('(max-width:899px)');

  /* появление блоков */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  function reveal(sel){$$(sel).forEach(function(el,i){if(el.classList.contains('rv'))return;el.classList.add('rv');el.style.setProperty('--d',Math.min(i%6,5)*.07+'s');io.observe(el)})}
  reveal('.sec-head,.built>li,.jobs>li,.facts>div,.panel.dark .source,.works .slot');
  if(reduce)$$('.rv').forEach(function(el){el.classList.add('in')});

  /* кейсы: счётчики, полосы, карусель */
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);e.target.classList.add('in');count(e.target)})},{threshold:.55});
  function count(c){
    if(reduce||c.classList.contains('static'))return;
    var b=$('.bar.after .v b',c),em=$('.bar.after .v em',c);if(!b||!em)return;
    var bf=parseFloat(($('.bar.before .v',c)||{}).textContent)||100,to=+b.textContent,g=parseInt(em.textContent,10),t0=performance.now();
    (function f(t){var k=Math.min(1,(t-t0)/1100),e=1-Math.pow(1-k,3);b.textContent=Math.round(bf+(to-bf)*e);em.textContent=(g>=0?'+':'')+Math.round(g*e)+'%';if(k<1)requestAnimationFrame(f);else{b.textContent=to;em.textContent=(g>=0?'+':'')+g+'%'}})(t0);
  }
  function initCases(){
    var box=$('#cases'),cs=$$('.case',box);if(!cs.length||box._init)return;box._init=true;
    cs.forEach(function(c){cio.observe(c)});
    var dots=document.createElement('div');dots.className='dots';dots.setAttribute('aria-hidden','true');
    dots.innerHTML=cs.map(function(_,i){return '<button type="button" tabindex="-1" aria-label="Кейс '+(i+1)+'"></button>'}).join('')+'<span class="hint">листайте →</span><span class="cnt"></span>';
    box.insertAdjacentElement('afterend',dots);
    var bs=$$('button',dots),cnt=$('.cnt',dots),cur=-1;
    function upd(){
      var w=cs[0].offsetWidth+12,i=Math.max(0,Math.min(cs.length-1,Math.round(box.scrollLeft/w)));
      if(i===cur)return;cur=i;bs.forEach(function(b,k){b.classList.toggle('on',k===i)});cnt.textContent=(i+1)+' / '+cs.length;
      if(i>0){var h=$('.hint',dots);if(h)h.remove()}
    }
    box.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
    bs.forEach(function(b,k){b.onclick=function(){cs[k].scrollIntoView({behavior:'smooth',inline:'start',block:'nearest'})}});
    upd();
  }
  if($('#cases .case'))initCases();
  document.addEventListener('results:ready',initCases);

  /* нижняя навигация */
  var secs=[['zaglavki','Портфолио'],['results','Цифры'],['built','Система'],['team','Команда'],['experience','Опыт'],['works','Работы'],['terms','Условия'],['contact','Связь']];
  var dock=document.createElement('nav');dock.className='dock';dock.setAttribute('aria-label','Разделы');
  dock.innerHTML=secs.map(function(s){return '<a href="#'+s[0]+'">'+s[1]+'</a>'}).join('')+'<i class="ind"></i>';
  document.body.appendChild(dock);
  var links=$$('a',dock),ind=$('.ind',dock),active=null;
  function mark(id){
    active=id;var on=null;links.forEach(function(a){var m=a.getAttribute('href')==='#'+id;a.classList.toggle('on',m);if(m)on=a});
    if(on){try{dock.scrollTo({left:on.offsetLeft-(dock.clientWidth-on.offsetWidth)/2,behavior:'smooth'})}catch(x){}ind.style.setProperty('--x',on.offsetLeft+'px');ind.style.setProperty('--w',on.offsetWidth+'px');ind.style.opacity=1}else ind.style.opacity=0;
  }
  var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)mark(e.target.id)})},{rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(function(s){var el=document.getElementById(s[0]);if(el)sio.observe(el)});
  var hero=$('.hero');
  function dockShow(){var on=window.scrollY>(hero?hero.offsetHeight*.55:300);dock.classList.toggle('on',on);if(!on)mark('')}
  addEventListener('scroll',dockShow,{passive:true});dockShow();
  addEventListener('resize',function(){mark(active||'')});
  dock.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;e.preventDefault();var t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:reduce?'auto':'smooth'});if(navigator.vibrate)try{navigator.vibrate(8)}catch(x){}});

  /* док как скраббер: долгое касание, ведём пальцем, страница прыгает по блокам */
  var tip=document.createElement('div');tip.className='dock-tip';tip.setAttribute('aria-hidden','true');document.body.appendChild(tip);
  var scrub=false,tm=0,tx=0,ty=0,cur=-1,quiet=0;
  function pick(x){var r=dock.getBoundingClientRect(),f=Math.min(.999,Math.max(0,(x-r.left)/r.width));return Math.floor(f*secs.length)}
  function go(i){if(i===cur)return;cur=i;var el=document.getElementById(secs[i][0]);if(!el)return;window.scrollTo({top:el.getBoundingClientRect().top+scrollY-12,behavior:'instant'});tip.textContent=secs[i][1];mark(secs[i][0]);if(navigator.vibrate)try{navigator.vibrate(6)}catch(x){}}
  function stop(){clearTimeout(tm);if(scrub){quiet=Date.now()+450}scrub=false;cur=-1;dock.classList.remove('scrub');tip.classList.remove('on')}
  dock.addEventListener('touchstart',function(e){var t=e.touches[0];tx=t.clientX;ty=t.clientY;clearTimeout(tm);tm=setTimeout(function(){scrub=true;dock.classList.add('scrub');tip.classList.add('on');if(navigator.vibrate)try{navigator.vibrate(14)}catch(x){}go(pick(tx))},260)},{passive:true});
  dock.addEventListener('touchmove',function(e){var t=e.touches[0];if(!scrub){if(Math.abs(t.clientX-tx)>10||Math.abs(t.clientY-ty)>10)clearTimeout(tm);return}if(e.cancelable)e.preventDefault();go(pick(t.clientX))},{passive:false});
  dock.addEventListener('touchend',stop);dock.addEventListener('touchcancel',stop);
  dock.addEventListener('contextmenu',function(e){e.preventDefault()});
  dock.addEventListener('click',function(e){if(Date.now()<quiet){e.preventDefault();e.stopImmediatePropagation()}},true);

  /* «Что я выстроил»: на телефоне строка целиком открывает панель */
  var built=$('.built');
  if(built&&matchMedia('(max-width:899px)').matches){
    $$('li',built).forEach(function(li){li.addEventListener('click',function(e){if(e.target.closest('a,button'))return;var b=$('button.more',li);if(b)b.click()})});
  }else if(built&&matchMedia('(max-width:1099px),(hover:none)').matches){
    $$('.built>li').forEach(function(li){
      var src=li.getAttribute('data-peek'),stat=li.getAttribute('data-stat'),demo=li.getAttribute('data-demo');if(!src&&!stat&&!demo)return;
      var d=document.createElement('div');d.className='m-peek';
      d.innerHTML='<div>'+(demo?'<div class="m-demo" style="aspect-ratio:'+(li.getAttribute('data-ratio')||'.6')+'"><iframe src="'+demo+'" title="Демо" loading="lazy" tabindex="-1"></iframe></div>':src?'<img src="'+src+'" alt="" loading="lazy">':'<div class="m-stat"><b>'+stat+'</b><span>'+(li.getAttribute('data-stat-cap')||'')+'</span></div>')+'</div>';
      li.appendChild(d);li.setAttribute('role','button');li.setAttribute('tabindex','0');li.setAttribute('aria-expanded','false');
      function tg(e){if(e.target.closest('a,button'))return;var o=!li.classList.contains('open');$$('.built>li.open').forEach(function(x){if(x!==li){x.classList.remove('open');x.setAttribute('aria-expanded','false')}});li.classList.toggle('open',o);li.setAttribute('aria-expanded',String(o))}
      li.addEventListener('click',tg);li.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tg(e)}});
    });
  }

  /* свайп вбок по всей секции, а не только по ленте карточек */
  function wideSwipe(zone,row,item,soft){
    if(!zone||!row||!matchMedia('(max-width:899px)').matches)return;
    var sx=0,sy=0,sl=0,on=false,lock=null,lt=0,lx=0,vx=0,raf=0;
    zone.style.touchAction='pan-y';
    zone.addEventListener('touchstart',function(e){if(row.contains(e.target))return;if(raf){cancelAnimationFrame(raf);raf=0;row.style.scrollSnapType='none'}var t=e.touches[0];sx=lx=t.clientX;sy=t.clientY;sl=row.scrollLeft;on=true;lock=null;vx=0;lt=e.timeStamp},{passive:true});
    zone.addEventListener('touchmove',function(e){if(!on)return;var t=e.touches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(lock===null&&(Math.abs(dx)>12||Math.abs(dy)>12))lock=Math.abs(dx)>Math.abs(dy)*1.7;if(lock){row.style.scrollSnapType='none';row.scrollLeft=sl-dx;var dt=e.timeStamp-lt;if(dt>0)vx=(t.clientX-lx)/dt;lt=e.timeStamp;lx=t.clientX}},{passive:true});
    function end(){if(!on)return;on=false;if(!lock)return;var items=$$(item,row),pad=parseFloat(getComputedStyle(row).paddingLeft)||0,x=row.scrollLeft-vx*(soft?260:160),best=items[0],bd=1e9;items.forEach(function(el){var d=Math.abs(el.offsetLeft-row.offsetLeft-pad-x);if(d<bd){bd=d;best=el}});var to=best.offsetLeft-row.offsetLeft-pad;if(!soft||reduce){row.style.scrollSnapType='';row.scrollTo({left:to,behavior:reduce?'auto':'smooth'});return}var from=row.scrollLeft,dist=to-from,dur=Math.min(620,Math.max(320,Math.abs(dist)*1.1+260)),t0=performance.now();row.style.scrollSnapType='none';(function step(now){var k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,4);row.scrollLeft=from+dist*e;if(k<1)raf=requestAnimationFrame(step);else{raf=0;row.style.scrollSnapType=''}})(t0)}
    zone.addEventListener('touchend',end);zone.addEventListener('touchcancel',end);
  }
  wideSwipe($('.panel.dark'),$('#cases'),'.case',true);
  document.addEventListener('portfolio:ready',function(){wideSwipe($('#g-cards'),$('#cgs'),'li')});
})();
