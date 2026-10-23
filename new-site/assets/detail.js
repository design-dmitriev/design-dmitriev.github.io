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
  function show(i){cur=(i+ALT.length)%ALT.length;li.src='assets/zag/'+(cur+1)+'.webp';li.alt=ALT[cur];ct.textContent=(cur+1)+' / '+ALT.length}
  function openLb(i){show(i);lb.classList.add('on');document.body.classList.add('lock')}
  function closeLb(){lb.classList.remove('on');if(!sheetOn)document.body.classList.remove('lock')}
  $$('.zg').forEach(function(b){b.onclick=function(){openLb(+b.dataset.i)}});
  $('.x',lb).onclick=closeLb;$('.pv',lb).onclick=function(){show(cur-1)};$('.nx',lb).onclick=function(){show(cur+1)};
  lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
  var sx=0;li.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  li.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))});

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
  function render(key){
    var d=DATA[key];if(!d)return;
    var h='<div class="sh-top"><small>Что я выстроил</small><button class="sh-x" type="button" aria-label="Закрыть">×</button></div><div class="sh-body">';
    h+='<h3>'+esc(d.title)+'</h3><p class="lead">'+esc(d.lead)+'</p>';
    if(d.demo==='folderify')h+='<div class="fdemo"><iframe src="folderify/ui.html?demo=1" title="Как работает Folderify" loading="lazy"></iframe></div>';
    else if(d.demo)h+=demoHtml();
    else if(d.stat)h+='<div class="sh-stat"><b>'+esc(d.stat[0])+'</b><span>'+esc(d.stat[1])+'</span></div>';
    var n=0;(d.blocks||[]).forEach(function(b){h+='<h4>'+esc(b.h)+'</h4><ul>'+b.items.map(function(t){return '<li style="--i:'+(n++)+'">'+esc(t)+'</li>'}).join('')+'</ul>'});
    if(d.tags)h+='<div class="tags">'+d.tags.map(function(t){return '<span>'+esc(t)+'</span>'}).join('')+'</div>';
    if(d.files)h+='<a class="sh-link" href="'+d.files.href+'" target="_blank" rel="noopener">'+esc(d.files.label)+'</a>';
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
    });
    var m=location.hash.match(/^#built-(\w+)/);if(m&&d[m[1]])openSheet(m[1],false);
  }).catch(function(){});
})();
