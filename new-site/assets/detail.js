(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* лайтбокс */
  var ALT=$$('#zgs img').map(function(i){return i.alt}),cur=0;
  var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Просмотр слайда');
  lb.innerHTML='<figure><img alt=""></figure><button class="x" type="button" aria-label="Закрыть">×</button><button class="pv" type="button" aria-label="Назад">‹</button><button class="nx" type="button" aria-label="Вперёд">›</button><span class="ct"></span>';
  document.body.appendChild(lb);
  var li=$('img',lb),ct=$('.ct',lb);
  var ready={},pend={};
  function url(i){return 'assets/zag/'+(i+1)+'.webp'}
  function pre(i){i=(i+ALT.length)%ALT.length;if(ready[i]||pend[i])return pend[i]||Promise.resolve();var im=new Image();im.decoding='async';im.src=url(i);pend[i]=(im.decode?im.decode():new Promise(function(r){im.onload=r;im.onerror=r})).catch(function(){}).then(function(){ready[i]=true;delete pend[i]});return pend[i]}
  function show(i){cur=(i+ALT.length)%ALT.length;var t=cur;li.alt=ALT[cur];ct.textContent=(cur+1)+' / '+ALT.length;
    if(ready[t])li.src=url(t);else pre(t).then(function(){if(cur===t)li.src=url(t)});
    pre(cur+1);pre(cur-1)}
  function preAll(){for(var k=0;k<ALT.length;k++)pre(k)}
  function openLb(i){preAll();show(i);lb.classList.add('on');document.body.classList.add('lock')}
  function closeLb(){lb.classList.remove('on');if(!sheetOn)document.body.classList.remove('lock')}
  $$('.zg').forEach(function(b){b.onclick=function(){openLb(+b.dataset.i)}});
  $('.x',lb).onclick=closeLb;$('.pv',lb).onclick=function(){show(cur-1)};$('.nx',lb).onclick=function(){show(cur+1)};
  lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
  var fg=$('figure',lb),sx=0,sy=0,dx=0,drag=false;
  li.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY;dx=0;drag=true;fg.style.transition='none'},{passive:true});
  li.addEventListener('touchmove',function(e){if(!drag)return;var x=e.touches[0].clientX-sx,y=e.touches[0].clientY-sy;if(Math.abs(y)>Math.abs(x)*1.4&&Math.abs(dx)<10)return;dx=x;fg.style.transform='translateX('+dx+'px)'},{passive:true});
  li.addEventListener('touchend',function(){drag=false;fg.style.transition='';if(Math.abs(dx)>50){var dir=dx<0?1:-1;fg.style.transition='none';show(cur+dir);fg.style.transform='translateX('+(dir*60)+'px)';fg.style.opacity='0';void fg.offsetWidth;fg.style.transition='transform .3s cubic-bezier(.2,.7,.2,1),opacity .3s';fg.style.transform='';fg.style.opacity=''}else fg.style.transform=''});

  /* шторка «Подробнее» */
  var sheetOn=false,DATA=null,bg=document.createElement('div'),sh=document.createElement('aside');
  bg.className='sh-bg';sh.className='sheet';sh.setAttribute('role','dialog');sh.setAttribute('aria-modal','true');sh.setAttribute('aria-label','Подробнее');
  document.body.appendChild(bg);document.body.appendChild(sh);
  var timer=0,lastFocus=null;
  function demoHtml(){
    return '<div class="kdemo" id="demo2"><img src="assets/zag/2.webp" alt="Заглавка, на которой показаны правила кита"><span class="bx"></span><div class="pg"></div><div class="cap"></div></div>';
  }
  var STEPS=[
    ['Логотип всегда сверху по центру',{l:31,t:1.8,w:38,h:7}],
    ['Одна мысль в заголовке',{l:6,t:9,w:88,h:15}],
    ['Плашки и надписи не выше заголовка',{l:60,t:27,w:34,h:14}],
    ['Товар в центре кадра',{l:6,t:26,w:80,h:68}],
    ['Охранные поля со всех сторон',{l:3,t:2,w:94,h:96}]
  ];
  function runDemo(){
    var d=$('#demo2',sh);if(!d)return;var bx=$('.bx',d),cap=$('.cap',d),pg=$('.pg',d),i=0;
    pg.innerHTML=STEPS.map(function(){return '<i></i>'}).join('');
    function go(){var s=STEPS[i%STEPS.length],b=s[1];bx.style.left=b.l+'%';bx.style.top=b.t+'%';bx.style.width=b.w+'%';bx.style.height=b.h+'%';cap.textContent=s[0];$$('i',pg).forEach(function(x,k){x.classList.toggle('on',k===i%STEPS.length)});i++}
    go();if(!reduce)timer=setInterval(go,2400);
  }
  function fitFy(){
    var st=$('.fy-stage',sh);if(!st)return;var box=$('.fy-box',st),fr=$('iframe',box),r=parseFloat(st.getAttribute('data-r'))||.6,fw=parseFloat(st.getAttribute('data-fw'))||0,W=st.clientWidth,H=st.clientHeight-200;
    var cap=r>1?640:540,w=r>1?Math.min(W,cap):innerWidth<900?Math.min(W,Math.max(168,Math.min(260,((window.visualViewport?visualViewport.height:innerHeight)-396)*r))):Math.min(W,H*r,336);if(w<168)w=168;box.style.width=w+'px';box.style.height=w/r+'px';
    if(fw){fr.style.transform='scale('+(w/fw)+')'}
  }
  window.addEventListener('resize',function(){if(sheetOn)fitFy()});window.addEventListener('orientationchange',function(){setTimeout(function(){if(sheetOn)fitFy()},300)});if(window.visualViewport)visualViewport.addEventListener('resize',function(){if(sheetOn)fitFy()});
  function renderSkills(d){
    var h='<div class="sh-top"><small>Что я выстроил</small><button class="sh-x" type="button" aria-label="Закрыть">×</button></div><div class="sh-body fy-layout"><div class="fy-info">';
    h+='<h3>'+esc(d.title)+'</h3><p class="lead">'+esc(d.lead)+'</p>';
    if(d.stat)h+='<div class="fy-chip"><b>'+esc(d.stat[0])+'</b><span>'+esc(d.stat[1])+'</span></div>';
    h+='<ul class="fy-skills">'+d.skills.map(function(s,i){return '<li style="--i:'+i+'"'+(s.plugin?' class="is-plugin"':'')+'><b>'+esc(s.h)+'</b><span>'+esc(s.t)+'</span></li>'}).join('')+'</ul></div>';
    var fv=d.frame.w?(innerWidth<900&&d.frame.mw?{w:d.frame.mw,h:d.frame.mh}:{w:d.frame.w,h:d.frame.h}):null,fr=fv?fv.w/fv.h:d.frame.ratio;
    h+='<div class="fy-stage" data-r="'+fr+'"'+(fv?' data-fw="'+fv.w+'"':'')+'>'+(d.frame.badge?'<span class="m-badge">'+esc(d.frame.badge)+'</span>':'')+'<div class="fy-box"><iframe src="'+d.frame.src+'" title="Превью" tabindex="-1" inert aria-hidden="true"'+(fv?' style="inset:auto;left:0;top:0;width:'+fv.w+'px;height:'+fv.h+'px;transform-origin:0 0"':'')+'></iframe></div><div class="fy-meta"><p>'+esc(d.cap)+'</p>';
    if(d.actions){h+='<div class="fy-act">'+d.actions.map(function(a,i){return '<a class="sh-link'+(i?' alt':'')+'" href="'+a.href+'" target="_blank" rel="noopener">'+esc(a.label)+' ↗</a>'}).join('')+'</div>'}
    else if(d.download||d.files){h+='<div class="fy-act">';if(d.download)h+='<a class="sh-link" href="'+d.download.href+'" download>'+esc(d.download.label)+'</a>';if(d.files)h+='<a class="sh-link alt" href="'+d.files.href+'" target="_blank" rel="noopener">'+esc(d.files.label)+'</a>';h+='</div>'}
    if(d.install)h+='<small>'+esc(d.install)+'</small>';
    h+='</div></div></div>';
    sh.innerHTML=h;sh.classList.add('wide');if(fr>1)$('.fy-layout',sh).classList.add('land');$('.sh-x',sh).onclick=closeSheet;
  }
  function render(key){
    sh.classList.remove('wide');
    var d=DATA[key];if(!d)return;
    if(d.layout==='skills'){renderSkills(d);return}
    var h='<div class="sh-top"><small>Что я выстроил</small><button class="sh-x" type="button" aria-label="Закрыть">×</button></div><div class="sh-body">';
    h+='<h3>'+esc(d.title)+'</h3><p class="lead">'+esc(d.lead)+'</p>';
    if(d.demo==='folderify')h+='<div class="fdemo"><iframe src="folderify/ui.html?demo=1" title="Как работает Folderify" loading="lazy"></iframe></div>';
    else if(d.demo)h+=demoHtml();
    else if(d.stat)h+='<div class="sh-stat"><b'+(String(d.stat[0]).length>8?' class="long"':'')+'>'+esc(d.stat[0])+'</b><span>'+esc(d.stat[1])+'</span></div>';
    var n=0;(d.blocks||[]).forEach(function(b){h+='<h4>'+esc(b.h)+'</h4><ul>'+b.items.map(function(t){return '<li style="--i:'+(n++)+'">'+esc(t)+'</li>'}).join('')+'</ul>'});
    if(d.tags)h+='<div class="tags">'+d.tags.map(function(t){return '<span>'+esc(t)+'</span>'}).join('')+'</div>';
    if(d.download)h+='<a class="sh-link" href="'+d.download.href+'" download>'+esc(d.download.label)+'</a> ';
    if(d.files)h+='<a class="sh-link alt" href="'+d.files.href+'" target="_blank" rel="noopener">'+esc(d.files.label)+'</a>';
    if(d.link)h+='<a class="sh-link" href="'+d.link.href+'" data-close>'+esc(d.link.label)+'</a>';
    h+='<div id="figbar"></div></div>';
    sh.innerHTML=h;
    $('.sh-x',sh).onclick=closeSheet;
    $$('[data-close]',sh).forEach(function(a){a.addEventListener('click',closeSheet)});
    if(d.demo===true)fetch('data/kit.json').then(function(r){return r.json()}).then(function(k){var x='';if(k.figma)x+='<a class="sh-link" href="'+k.figma+'" target="_blank" rel="noopener">Открыть в Figma ↗</a>';if(k.file)x+='<a class="sh-link alt" href="'+k.file+'" download>'+(k.fileLabel||'Скачать .fig')+'</a>';$('#figbar',sh).innerHTML=x}).catch(function(){});
  }
  function openSheet(key,push){
    if(!DATA)return;lastFocus=document.activeElement;clearInterval(timer);render(key);
    sheetOn=true;bg.classList.add('on');sh.classList.add('on');document.body.classList.add('lock');sh.scrollTop=0;$('.sh-body',sh).scrollTop=0;
    if(DATA[key]&&DATA[key].demo===true)runDemo();
    if(DATA[key]&&DATA[key].layout==='skills'){fitFy();setTimeout(fitFy,600)}
    if(push!==false)history.replaceState(null,'','#built-'+key);
    setTimeout(function(){var x=$('.sh-x',sh);if(x)x.focus()},350);
  }
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-open]');if(t){e.stopPropagation();openSheet(t.getAttribute('data-open'))}},true);
  function closeSheet(){
    sheetOn=false;clearInterval(timer);bg.classList.remove('on');sh.classList.remove('on');if(!lb.classList.contains('on'))document.body.classList.remove('lock');
    if(location.hash.indexOf('#built-')===0)history.replaceState(null,'',location.pathname+location.search+'#built');
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }
  bg.onclick=closeSheet;
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){if(lb.classList.contains('on'))closeLb();else if(sheetOn)closeSheet()}
    if(lb.classList.contains('on')){if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)}
  });
  /* свайп вниз закрывает шторку на телефоне */
  var y0=0,top0=0;sh.addEventListener('touchstart',function(e){y0=e.touches[0].clientY;top0=$('.sh-body',sh)?$('.sh-body',sh).scrollTop:0},{passive:true});
  sh.addEventListener('touchend',function(e){if(innerWidth<900&&top0<=0&&e.changedTouches[0].clientY-y0>110)closeSheet()});

  fetch('data/built.json').then(function(r){return r.json()}).then(function(d){
    DATA=d;
    $$('.built>li[data-key]').forEach(function(li){
      var key=li.dataset.key;if(!d[key])return;
      var b=document.createElement('button');b.type='button';b.className='more';b.innerHTML='Подробнее <span>→</span>';
      b.setAttribute('aria-label','Подробнее: '+d[key].title);b.onclick=function(e){e.stopPropagation();openSheet(key)};
      li.appendChild(b);
      li.classList.add('go');li.addEventListener('click',function(e){if(e.target.closest('a,button'))return;if(matchMedia('(min-width:1100px) and (hover:hover)').matches)openSheet(key)});
    });
    var m=location.hash.match(/^#built-(\w+)/);if(m&&d[m[1]])openSheet(m[1],false);
  }).catch(function(){});
})();
