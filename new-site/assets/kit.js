(function(){
  var root=document.getElementById('kit');if(!root)return;
  var $=function(s,r){return (r||root).querySelector(s)},$$=function(s,r){return [].slice.call((r||root).querySelectorAll(s))};
  var CAT={cables:['#101114','#ffffff','#5ac8fa'],chargers:['#f5f5f7','#1d1d1f','#0071e3'],ears:['#f4efe9','#1d1d1f','#bf5af2'],sets:['#1d1d1f','#f5f5f7','#ff9f0a'],power:['#e8f0ff','#0a1a3a','#0a84ff']};
  var slide=$('#slide'),ttl=$('.ttl',slide),pills=$('.pills',slide);
  var st={cat:'cables',pos:'center',extra:false,pr:'l'};
  function render(){
    var c=CAT[st.cat];slide.style.setProperty('--bg',c[0]);slide.style.setProperty('--fg',c[1]);slide.style.setProperty('--ac',c[2]);
    slide.dataset.pos=st.pos;slide.classList.toggle('extra',st.extra);
    $('.pills',slide).style.display=st.extra?'none':'flex';
    pills.classList.toggle('r',st.pr==='r');
  }
  function seg(id,key,fn){$$('#'+id+' button').forEach(function(b){b.onclick=function(){st[key]=b.dataset.v==='1'?true:b.dataset.v==='0'?false:b.dataset.v;$$('#'+id+' button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});render();if(navigator.vibrate)try{navigator.vibrate(5)}catch(e){}}})}
  seg('k-cat','cat');seg('k-pos','pos');seg('k-type','extra');seg('k-pill','pr');
  $('#k-text').oninput=function(){ttl.textContent=this.value||' '};
  $('#k-guides').onclick=function(){var on=slide.classList.toggle('g');this.setAttribute('aria-pressed',String(on))};
  /* подсветка правил ↔ направляющие */
  var map={'logo':'.e2','margin':'.e1','text':'.e3'};
  $$('.rules li').forEach(function(li){
    function on(){li.classList.add('hl');slide.classList.add('g')}
    function off(){li.classList.remove('hl');if($('#k-guides').getAttribute('aria-pressed')!=='true')slide.classList.remove('g')}
    li.addEventListener('mouseenter',on);li.addEventListener('mouseleave',off);li.addEventListener('touchstart',on,{passive:true});li.addEventListener('touchend',function(){setTimeout(off,900)});
  });
  /* авто-демо, пока не трогали */
  var touched=false,seq=[['cat','chargers'],['pos','right'],['cat','ears'],['pos','left'],['cat','sets'],['pos','center'],['cat','power'],['cat','cables']],i=0,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,vis=false;
  root.addEventListener('pointerdown',function(){touched=true});
  new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(slide);
  function sync(){['cat','pos'].forEach(function(k){$$('#k-'+k+' button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.v===st[k]))})})}
  if(!reduce)setInterval(function(){if(touched||!vis||document.hidden)return;var s=seq[i++%seq.length];st[s[0]]=s[1];sync();render()},2200);
  /* Figma */
  fetch('data/kit.json').then(function(r){return r.json()}).then(function(k){
    var bar=$('#kit-bar'),h='';
    if(k.figma)h+='<a href="'+k.figma+'" target="_blank" rel="noopener">Открыть в Figma ↗</a>';
    if(k.file)h+='<a class="alt" href="'+k.file+'" download>'+(k.fileLabel||'Скачать .fig')+'</a>';
    bar.innerHTML=h;
  }).catch(function(){});
  render();
})();
