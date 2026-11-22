(()=>{
  if(!window.Lenis)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const native=matchMedia('(max-width:1040px), (hover:none)');
  let lenis;
  function setup(){
    lenis?.destroy();lenis=null;
    if(reduced.matches||native.matches)return;
    lenis=new Lenis({autoRaf:true,lerp:.1,smoothWheel:true,syncTouch:false,anchors:{offset:-110},prevent:node=>node.closest?.('dialog,[data-lenis-prevent]')});
    sync();
  }
  function sync(){
    if(!lenis)return;
    if(document.querySelector('dialog[open]')||document.body.classList.contains('site-menu-open'))lenis.stop();else lenis.start();
  }
  document.querySelectorAll('dialog').forEach(dialog=>new MutationObserver(sync).observe(dialog,{attributes:true,attributeFilter:['open']}));
  document.addEventListener('portfolio:menu',sync);
  reduced.addEventListener('change',setup);native.addEventListener('change',setup);setup();
})();
