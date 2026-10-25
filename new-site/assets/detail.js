(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  var lockY=0,locked=false;
  function lockPage(on){var b=document.body,h=document.documentElement;
    if(on&&!locked){locked=true;lockY=window.pageYOffset;b.classList.add('lock');b.style.top=(-lockY)+'px'}
    else if(!on&&locked){locked=false;b.classList.remove('lock');b.style.top='';h.style.scrollBehavior='auto';window.scrollTo(0,lockY);h.style.scrollBehavior=''}}
  var vw=null,vwOn=false,frames={},curF=null,ORI=location.origin;
  function frameFor(path){
    var base=path.split('?')[0];
    if(!vw){vw=document.createElement('div');vw.className='vw';vw.setAttribute('role','dialog');vw.setAttribute('aria-modal','true');vw.setAttribute('aria-label','Просмотр слайдов');document.body.appendChild(vw)}
    if(!frames[base]){var f=document.createElement('iframe');f.title='Просмотр слайдов';f.src=base;f.loaded=false;f.pend=null;vw.appendChild(f);frames[base]=f}
    return frames[base];
  }
  function sendOpen(f,i){try{f.contentWindow.postMessage({t:'open',i:i},ORI);f.contentWindow.focus()}catch(e){}}
  function openVw(path){
    var f=frameFor(path),m=/[?&]i=(\d+)/.exec(path),i=m?+m[1]:0;
    if(curF&&curF!==f)curF.classList.remove('cur','ready');
    curF=f;f.classList.remove('ready');f.classList.add('cur');
    if(f.loaded)sendOpen(f,i);else f.pend=i;
    lockPage(true);void vw.offsetWidth;vw.classList.add('on');vwOn=true;
    try{history.scrollRestoration='manual';history.pushState({vw:1},'')}catch(e){}
  }
  function closeVw(back){
    if(!vwOn)return;vwOn=false;vw.classList.remove('on');
    setTimeout(function(){if(!vwOn){try{history.scrollRestoration='auto'}catch(e){}}},500);
    if(!sheetOn)lockPage(false);
    if(back!==true){try{if(history.state&&history.state.vw)history.back()}catch(e){}}
  }
  window.addEventListener('popstate',function(){if(vwOn)closeVw(true)});
  window.addEventListener('message',function(e){
    if(e.origin!==ORI||!e.data)return;
    var k=e.data.t||e.data,f=null;for(var p in frames)if(frames[p].contentWindow===e.source)f=frames[p];
    if(k==='vw-close')closeVw();
    else if(k==='vw-loaded'&&f){f.loaded=true;if(f.pend!==null){var i=f.pend;f.pend=null;sendOpen(f,i)}}
    else if(k==='vw-ready'&&f&&f===curF)f.classList.add('ready');
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&vwOn)closeVw()});
  function warm(){['portfolio/slides/'].concat($$('.zc').map(function(b){return 'portfolio/'+b.dataset.card+'/'})).forEach(function(p,k){setTimeout(function(){frameFor(p)},k*400)})}
  document.addEventListener('portfolio:ready',function(){(window.requestIdleCallback||function(f){setTimeout(f,1500)})(warm)});
  $$('#zgs .zg').forEach(function(b){b.onclick=function(){openVw('portfolio/slides/?i='+b.dataset.i)}});
  fetch('portfolio/cards.json?v=6').then(function(r){return r.json()}).then(function(d){
    var ul=$('#cgs');if(!ul||!d.cards.length)return;
    function w(n){var a=n%10,b=n%100;return n+' '+(b>10&&b<15?'слайдов':a===1?'слайд':a>1&&a<5?'слайда':'слайдов')}
    d.cards.forEach(function(c,k){var li=document.createElement('li');
      li.innerHTML='<div class="zw"><i class="stk s2"></i><i class="stk s1"></i><button class="zg zc" type="button" data-card="'+(k+1)+'" aria-label="Открыть презентацию: '+esc(c.title)+', '+w(c.slides.length)+'"><img src="portfolio/'+c.cover+'" width="450" height="600" alt="" decoding="async"><span class="bdg">'+w(c.slides.length)+'</span></button></div><span class="cap">'+esc(c.title)+'</span>';
      ul.appendChild(li)});
    $('#cgn').textContent=d.cards.length;$('#g-cards').hidden=false;
    $$('.zc',ul).forEach(function(b){b.onclick=function(){openVw('portfolio/'+b.dataset.card+'/')}});
    document.dispatchEvent(new Event('portfolio:ready'));
    $$('.zg img').forEach(function(im){if(im.decode)im.decode().catch(function(){})});
  }).catch(function(){});

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
  /* шаги демо: полоски живут в интерфейсе, а не внутри видео */
  var fsN=0;
  function fsEl(){return $('.fy-steps',sh)}
  function fsBuild(n){var el=fsEl();if(!el)return;fsN=n;el.innerHTML='';for(var k=0;k<n;k++){var b=document.createElement('button');b.type='button';b.className='fs';b.setAttribute('aria-label','Шаг '+(k+1)+' из '+n);b.innerHTML='<i></i>';b.dataset.k=k;el.appendChild(b)}el.hidden=false}
  function fsSet(i,ms){var el=fsEl();if(!el)return;$$('.fs',el).forEach(function(b,k){b.classList.remove('cur','done');if(k<i)b.classList.add('done');if(k===i){b.style.setProperty('--d',(ms||3000)+'ms');void b.offsetWidth;b.classList.add('cur')}})}
  window.addEventListener('message',function(e){var fr=$('.fy-box iframe',sh),m=e.data;if(!fr||e.source!==fr.contentWindow||!m||!m.fy)return;if(m.fy==='steps')fsBuild(m.n);else if(m.fy==='step'){if(!fsEl()||!fsEl().children.length)fsBuild(m.n||fsN||4);fsSet(m.i,m.d)}});
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.fy-steps .fs');if(!b)return;var fr=$('.fy-box iframe',sh);if(fr&&fr.contentWindow){var k=+b.dataset.k;fsSet(k,3000);try{fr.contentWindow.postMessage({fy:'go',i:k},'*')}catch(x){}}});
  function fitFy(){
    if(sh.classList.contains('reels'))return fitM();
    var st=$('.fy-stage',sh);if(!st)return;var box=$('.fy-box',st),fr=$('iframe,video',box),r=parseFloat(st.getAttribute('data-r'))||.6,fw=parseFloat(st.getAttribute('data-fw'))||0,W=st.clientWidth,H=st.clientHeight-232;
    var cap=r>1?640:540,w=r>1?Math.min(W,cap):innerWidth<900?Math.min(W,Math.max(180,Math.min(340,((window.visualViewport?visualViewport.height:innerHeight)-352)*r))):Math.min(W,H*r,336);if(w<168)w=168;box.style.width=w+'px';box.style.height=w/r+'px';var fs=$('.fy-steps',st);if(fs)fs.style.width=w+'px';
    if(fw&&fr.tagName==='IFRAME'){fr.style.transform='scale('+(w/fw)+')'}
  }
  window.addEventListener('resize',function(){if(sheetOn)fitFy()});window.addEventListener('orientationchange',function(){setTimeout(function(){if(sheetOn)fitFy()},300)});if(window.visualViewport)visualViewport.addEventListener('resize',function(){if(sheetOn)fitFy()});

  function vidInit(d){var v=$('.fy-box video',sh);if(!v||!d.frame.marks)return;var m=d.frame.marks,st=d.frame.steps||[],cb=$('.fy-cap b',sh),cs=$('.fy-cap span',sh),cur=-1;fsBuild(m.length);
    function idx(t){var i=0;for(var k=0;k<m.length;k++)if(t>=m[k]-.02)i=k;return i}
    function end(i){return i+1<m.length?m[i+1]:(v.duration||d.frame.dur)}
    function upd(){var t=v.currentTime,i=idx(t);if(i!==cur){cur=i;fsSet(i,Math.max(300,(end(i)-m[i])*1000));if(st[i]){cb.textContent=st[i][0];cs.textContent=st[i][1]}}}
    v.addEventListener('timeupdate',upd);v.addEventListener('play',upd);v.addEventListener('seeked',function(){cur=-1;upd()});
    var go=function(e){var b=e.target.closest&&e.target.closest('.fy-steps .fs');if(!b)return;e.stopImmediatePropagation();var k=+b.dataset.k;cur=-1;v.currentTime=m[k]+.05;fsSet(k,Math.max(300,(end(k)-m[k])*1000));cur=k;if(st[k]){cb.textContent=st[k][0];cs.textContent=st[k][1]}v.play&&v.play().catch(function(){})};
    $('.fy-steps',sh).addEventListener('click',go,true);upd();var pr=v.play();if(pr&&pr.catch)pr.catch(function(){})}
  function renderSkills(d){
    var h='<div class="sh-top"><small>Что я выстроил</small><button class="sh-x" type="button" aria-label="Закрыть">×</button></div><div class="sh-body fy-layout"><div class="fy-info">';
    h+='<h3>'+esc(d.title)+'</h3><p class="lead">'+esc(d.lead)+'</p>';
    if(d.stat)h+='<div class="fy-chip"><b>'+esc(d.stat[0])+'</b><span>'+esc(d.stat[1])+'</span></div>';
    h+='<ul class="fy-skills">'+d.skills.map(function(s,i){return '<li style="--i:'+i+'"'+(s.plugin?' class="is-plugin"':'')+'><b>'+esc(s.h)+'</b><span>'+esc(s.t)+'</span></li>'}).join('')+'</ul></div>';
    var fv=d.frame.w?(innerWidth<900&&d.frame.mw?{w:d.frame.mw,h:d.frame.mh}:{w:d.frame.w,h:d.frame.h}):null,fr=fv?fv.w/fv.h:d.frame.ratio;
    h+='<div class="fy-stage" data-r="'+fr+'"'+(fv?' data-fw="'+fv.w+'"':'')+'>'+(d.frame.badge?'<span class="m-badge">'+esc(d.frame.badge)+'</span>':'')+'<div class="fy-box">'+(d.frame.video&&innerWidth<900?'<video src="'+d.frame.video+'" poster="'+d.frame.poster+'" muted playsinline loop autoplay preload="auto" aria-label="Демо"></video>':'<iframe src="'+d.frame.src+'" title="Превью" tabindex="-1" inert aria-hidden="true"'+(fv?' style="inset:auto;left:0;top:0;width:'+fv.w+'px;height:'+fv.h+'px;transform-origin:0 0"':'')+'></iframe>')+'</div><div class="fy-steps" role="group" aria-label="Шаги демо" hidden></div><div class="fy-cap" aria-live="off"'+(d.frame.video&&innerWidth<900?'':' hidden')+'><b></b><span></span></div><div class="fy-meta"><p>'+esc(d.cap)+'</p>';
    if(d.actions){h+='<div class="fy-act">'+d.actions.map(function(a,i){return '<a class="sh-link'+(i?' alt':'')+'" href="'+a.href+'" target="_blank" rel="noopener">'+esc(a.label)+' ↗</a>'}).join('')+'</div>'}
    else if(d.download||d.files){h+='<div class="fy-act">';if(d.download)h+='<a class="sh-link" href="'+d.download.href+'" download>'+esc(d.download.label)+'</a>';if(d.files)h+='<a class="sh-link alt" href="'+d.files.href+'" target="_blank" rel="noopener">'+esc(d.files.label)+'</a>';h+='</div>'}
    if(d.install)h+='<small>'+esc(d.install)+'</small>';
    h+='</div></div></div>';
    sh.innerHTML=h;vidInit(d);sh.classList.add('wide');if(fr>1)$('.fy-layout',sh).classList.add('land');$('.sh-x',sh).onclick=closeSheet;
  }

  /* телефон: медиа сверху, панель с текстом снизу (как комментарии в Reels) */
  var XSVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',mK=1;
  function renderSkillsM(d){
    var fv=d.frame.w?(d.frame.mw?{w:d.frame.mw,h:d.frame.mh}:{w:d.frame.w,h:d.frame.h}):null,fr=fv?fv.w/fv.h:d.frame.ratio,vid=!!d.frame.video;
    var h='<div class="m-top"><small>Что я выстроил</small><button class="m-x" type="button" aria-label="Закрыть">'+XSVG+'</button></div>';
    h+='<div class="m-zone"><div class="fy-stage" data-r="'+fr+'"'+(fv?' data-fw="'+fv.w+'"':'')+'>'+(d.frame.badge?'<span class="m-badge">'+esc(d.frame.badge)+'</span>':'')+'<div class="fy-box">'+(vid?'<video src="'+d.frame.video+'" poster="'+d.frame.poster+'" muted playsinline loop autoplay preload="auto" aria-label="Демо"></video>':'<iframe src="'+d.frame.src+'" title="Превью" tabindex="-1" inert aria-hidden="true"'+(fv?' style="inset:auto;left:0;top:0;width:'+fv.w+'px;height:'+fv.h+'px;transform-origin:0 0"':'')+'></iframe>')+'</div><div class="fy-steps" role="group" aria-label="Шаги демо" hidden></div><div class="fy-cap" aria-live="off"'+(vid?'':' hidden')+'><b></b><span></span></div></div></div>';
    h+='<div class="m-panel"><div class="m-grab" aria-hidden="true"></div><div class="m-scroll sh-body"><div class="fy-info"><h3>'+esc(d.title)+'</h3><p class="lead">'+esc(d.lead)+'</p>';
    if(d.stat)h+='<div class="fy-chip"><b>'+esc(d.stat[0])+'</b><span>'+esc(d.stat[1])+'</span></div>';
    h+='<ul class="fy-skills">'+d.skills.map(function(s,i){return '<li style="--i:'+i+'"'+(s.plugin?' class="is-plugin"':'')+'><b>'+esc(s.h)+'</b><span>'+esc(s.t)+'</span></li>'}).join('')+'</ul></div>';
    h+='<div class="fy-meta"><p>'+esc(d.cap)+'</p>'+(d.install?'<small>'+esc(d.install)+'</small>':'')+'</div></div>';
    var a='';
    if(d.actions)a=d.actions.map(function(x,i){return '<a class="sh-link'+(i?' alt':'')+'" href="'+x.href+'" target="_blank" rel="noopener">'+esc(x.label)+' ↗</a>'}).join('');
    else{if(d.download)a+='<a class="sh-link" href="'+d.download.href+'" download>'+esc(d.download.label)+'</a>';if(d.files)a+='<a class="sh-link alt" href="'+d.files.href+'" target="_blank" rel="noopener">'+esc(d.files.label)+'</a>'}
    if(a)h+='<div class="m-act">'+a+'</div>';
    h+='</div>';
    sh.innerHTML=h;sh.classList.add('reels');vidInit(d);
    $('.m-x',sh).onclick=closeSheet;
    $('.m-zone',sh).addEventListener('click',function(e){if(e.target===this||e.target.classList.contains('fy-stage'))closeSheet()});
    mGesture();
  }
  function fitM(){
    var z=$('.m-zone',sh),st=$('.fy-stage',sh);if(!z||!st)return;
    var box=$('.fy-box',st),fr=$('iframe,video',box),r=parseFloat(st.getAttribute('data-r'))||.6,fw=parseFloat(st.getAttribute('data-fw'))||0,W=z.clientWidth;
    var panel=$('.m-panel',sh),ph=Math.round(innerHeight*.52);sh.style.setProperty('--ph',ph+'px');
    var used=8+($('.m-badge',st)?38:0)+($('.fy-steps',st)&&!$('.fy-steps',st).hidden?44:0)+(!$('.fy-cap',st).hidden?56:0);
    var availH=innerHeight-ph-$('.m-top',sh).offsetHeight-used,w=Math.max(120,Math.min(W-32,availH*r,340));
    box.style.width=w+'px';box.style.height=w/r+'px';var fs=$('.fy-steps',st);if(fs)fs.style.width=Math.max(w,200)+'px';
    var cp=$('.fy-cap',st);if(cp)cp.style.maxWidth=Math.max(w,260)+'px';
    if(fw&&fr.tagName==='IFRAME')fr.style.transform='scale('+(w/fw)+')';
    var wBig=Math.max(w,Math.min(W-16,(innerHeight-$('.m-top',sh).offsetHeight-110)*r,420));mK=Math.min(2.2,wBig/w);
  }
  function mEnter(){
    var box=$('.fy-box',sh);if(!box)return;
    box.style.transition='none';box.style.transform='scale('+mK+')';void box.offsetWidth;
    requestAnimationFrame(function(){requestAnimationFrame(function(){box.style.transition='transform .6s cubic-bezier(.2,.7,.2,1)';box.style.transform='scale(1)'})});
  }
  function mGesture(){
    var panel=$('.m-panel',sh),sc=$('.m-scroll',sh),box=$('.fy-box',sh),y0=0,dy=0,on=false,drag=false,grab=false,s0=0,t0=0;
    function reset(){panel.style.transition='';panel.style.transform='';box.style.transition='';box.style.transform=''}
    panel.addEventListener('touchstart',function(e){y0=e.touches[0].clientY;dy=0;on=true;drag=false;grab=!!e.target.closest('.m-grab');s0=sc.scrollTop;t0=e.timeStamp},{passive:true});
    panel.addEventListener('touchmove',function(e){
      if(!on)return;var d=e.touches[0].clientY-y0;
      if(!drag){if(d>6&&(grab||(s0<=0&&sc.scrollTop<=0))){drag=true;panel.style.transition='none';box.style.transition='none'}else return}
      if(e.cancelable)e.preventDefault();
      dy=Math.max(0,d);var p=Math.min(dy/(panel.offsetHeight||1),1);
      panel.style.transform='translateY('+dy+'px)';box.style.transform='scale('+(1+(mK-1)*p)+')';
    },{passive:false});
    function end(e){if(!on)return;on=false;if(!drag)return;drag=false;var v=dy/Math.max(1,e.timeStamp-t0);
      if(dy>110||v>.7){reset();closeSheet()}else{panel.style.transition='transform .35s cubic-bezier(.2,.7,.2,1)';box.style.transition='transform .35s cubic-bezier(.2,.7,.2,1)';panel.style.transform='';box.style.transform='scale(1)';setTimeout(function(){panel.style.transition='';box.style.transition=''},380)}}
    panel.addEventListener('touchend',end);panel.addEventListener('touchcancel',end);
  }
  function render(key){
    sh.classList.remove('wide');
    var d=DATA[key];if(!d)return;
    sh.classList.remove('reels');
    if(d.layout==='skills'){if(innerWidth<900)renderSkillsM(d);else renderSkills(d);return}
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
    sheetOn=true;bg.classList.add('on');sh.classList.add('on');lockPage(true);sh.scrollTop=0;$('.sh-body',sh).scrollTop=0;
    if(DATA[key]&&DATA[key].demo===true)runDemo();
    bg.classList.toggle('dk',sh.classList.contains('reels'));
    if(DATA[key]&&DATA[key].layout==='skills'){fitFy();if(sh.classList.contains('reels'))mEnter();setTimeout(fitFy,600)}
    if(push!==false)history.replaceState(null,'','#built-'+key);
    setTimeout(function(){var x=$('.sh-x',sh);if(x)x.focus()},350);
  }
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-open]');if(t){e.stopPropagation();openSheet(t.getAttribute('data-open'))}},true);
  function closeSheet(){
    sheetOn=false;clearInterval(timer);bg.classList.remove('on');sh.classList.remove('on');if(!vwOn)lockPage(false);
    if(location.hash.indexOf('#built-')===0)history.replaceState(null,'',location.pathname+location.search+'#built');
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }
  bg.onclick=closeSheet;
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&sheetOn&&!vwOn)closeSheet()
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
