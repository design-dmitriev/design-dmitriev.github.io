(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var CATS=['Заглавки','Упаковка','Баннеры'];
  var items=[];for(var i=0;i<12;i++)items.push({n:(i%5)+1,c:CATS[i%3],t:'Макет '+(i+1)});
  function tile(it,i){return '<li style="--i:'+i+'" data-c="'+it.c+'"><button class="zg" type="button" data-n="'+it.n+'" aria-label="Открыть: '+it.c+', '+it.t+'"><img src="../assets/zag/'+it.n+'-s.webp" width="450" height="600" alt="" loading="lazy"></button></li>'}
  window.PM={
    render:function(grid,cnt){grid.innerHTML=items.map(tile).join('');this.cnt=cnt},
    chips:function(box,grid,cnt){
      box.innerHTML='<button type="button" aria-pressed="true" data-c="">Все <small>'+items.length+'</small></button>'+CATS.map(function(c){return '<button type="button" aria-pressed="false" data-c="'+c+'">'+c+' <small>'+items.filter(function(x){return x.c===c}).length+'</small></button>'}).join('');
      box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;$$('button',box).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});var c=b.dataset.c,n=0;$$('li',grid).forEach(function(li,k){var show=!c||li.dataset.c===c;li.hidden=!show;if(show){li.style.setProperty('--i',n++);li.style.animation='none';void li.offsetWidth;li.style.animation=''}});if(cnt)cnt.textContent=n+' из '+items.length})},
    lightbox:function(grid){
      var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.innerHTML='<figure><img alt=""></figure><button class="x" type="button" aria-label="Закрыть">×</button>';document.body.appendChild(lb);
      var img=$('img',lb),y=0;
      function open(n){img.src='../assets/zag/'+n+'.webp';lb.classList.add('on');y=pageYOffset;document.body.style.cssText='position:fixed;left:0;right:0;width:100%;top:'+(-y)+'px'}
      function close(){lb.classList.remove('on');document.body.style.cssText='';scrollTo(0,y)}
      grid.addEventListener('click',function(e){var b=e.target.closest('.zg');if(b)open(b.dataset.n)});
      $('.x',lb).onclick=close;lb.addEventListener('click',function(e){if(e.target===lb)close()});document.addEventListener('keydown',function(e){if(e.key==='Escape')close()})}
  };
})();
