(()=>{
  const hero=document.querySelector('.graphic-hero');
  if(!hero)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,height=0,top=0,radius=0,base=0;
  function draw(){
    frame=0;
    if(document.body.classList.contains('site-menu-open'))return;
    const progress=Math.max(0,Math.min(1,(scrollY-top)/(height*.58)));
    const ease=reduced.matches?0:progress*progress*(3-2*progress);
    hero.style.setProperty('--hero-corner',(base+(radius-base)*ease).toFixed(2)+'px');
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(draw)}
  function measure(){
    if(document.body.classList.contains('site-menu-open'))return;
    height=hero.offsetHeight;
    top=hero.getBoundingClientRect().top+scrollY;
    base=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--surface-radius'))||24;
    radius=Math.max(base,document.querySelector('.work-highlights,.showcase-wall')?.getBoundingClientRect().left||0);
    schedule();
  }
  new ResizeObserver(measure).observe(hero);
  addEventListener('resize',measure,{passive:true});
  addEventListener('scroll',schedule,{passive:true});
  reduced.addEventListener('change',schedule);
  document.addEventListener('portfolio:menu',measure);
  measure();
})();
