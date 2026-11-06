(function(){
  var scenes=[].slice.call(document.querySelectorAll('.wl-scene'));
  var captions=[].slice.call(document.querySelectorAll('#wlTxt>div'));
  var durations=[3200,3000,3400,3000],current=0,timer=0,paused=false;
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function announce(){
    if(parent!==window)parent.postMessage({fy:'step',i:current,n:scenes.length,d:paused||reduce?0:durations[current],paused:paused||reduce},location.origin);
  }
  function schedule(){
    clearTimeout(timer);
    if(!paused&&!reduce&&!document.hidden)timer=setTimeout(function(){go((current+1)%scenes.length)},durations[current]);
  }
  function go(i){
    current=i;
    scenes.forEach(function(scene,k){scene.setAttribute('aria-hidden',String(k!==i));scene.classList.remove('on');if(k===i){void scene.offsetWidth;scene.classList.add('on')}});
    captions.forEach(function(c,k){c.classList.toggle('on',k===i)});
    announce();schedule();
  }
  function fit(){
    var scale=Math.min(innerWidth/360,innerHeight/600);
    document.body.style.width='360px';document.body.style.height='600px';
    document.body.style.transformOrigin='0 0';document.body.style.transform='scale('+scale+')';
    document.body.style.left=(innerWidth-360*scale)/2+'px';
    document.body.style.top=(innerHeight-600*scale)/2+'px';
  }
  addEventListener('message',function(e){
    if(e.source!==parent||e.origin!==location.origin||!e.data)return;
    var m=e.data;
    if(m.fy==='go'&&Number.isInteger(m.i)&&m.i>=0&&m.i<scenes.length)go(m.i);
    if(m.fy==='pause'){paused=true;document.querySelector('.wl').classList.add('paused');clearTimeout(timer);announce()}
    if(m.fy==='play'){paused=false;document.querySelector('.wl').classList.remove('paused');announce();schedule()}
  });
  document.addEventListener('visibilitychange',schedule);
  addEventListener('resize',fit);fit();
  if(parent!==window)parent.postMessage({fy:'steps',n:scenes.length},location.origin);
  go(0);
})();
