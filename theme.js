(()=>{
  const root=document.documentElement;
  const theme=document.querySelector('.theme-toggle');
  function syncTheme(){theme?.setAttribute('aria-checked',String(root.dataset.theme==='dark'))}
  syncTheme();
  theme?.addEventListener('click',()=>{
    root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';
    try{localStorage.setItem('portfolio-theme',root.dataset.theme)}catch{}
    syncTheme();
  });
  addEventListener('storage',event=>{
    if(event.key==='portfolio-theme'){
      root.dataset.theme=event.newValue==='dark'?'dark':'light';syncTheme();
    }
  });
  const toggle=document.querySelector('.nav-toggle');
  const nav=document.querySelector('.top .nav');
  if(!toggle||!nav)return;
  const narrow=matchMedia('(max-width:1040px)');
  let open=false,savedY=0,savedTop='';
  nav.dataset.lenisPrevent='';
  function setOpen(next,returnFocus=false){
    next=next&&narrow.matches;
    if(next!==open){
      if(next){
        savedY=scrollY;savedTop=document.body.style.top;
        document.body.style.top=-savedY+'px';
        document.body.classList.add('site-menu-open');
      }else{
        document.body.classList.remove('site-menu-open');
        document.body.style.top=savedTop;
        window.scrollTo({top:savedY,behavior:'instant'});
      }
    }
    open=next;
    toggle.setAttribute('aria-expanded',String(open));
    toggle.textContent=open?'Закрыть':'Меню';
    toggle.setAttribute('aria-label',open?'Закрыть меню':'Меню');
    nav.classList.toggle('showcase-nav-open',open);
    nav.hidden=narrow.matches&&!open;
    document.dispatchEvent(new Event('portfolio:menu'));
    if(returnFocus)toggle.focus({preventScroll:true});
  }
  toggle.addEventListener('click',()=>setOpen(!open));
  nav.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false)});
  document.addEventListener('pointerdown',event=>{
    if(open&&!event.target.closest('.top'))setOpen(false);
  });
  document.addEventListener('keydown',event=>{
    if(!open)return;
    if(event.key==='Escape'){event.preventDefault();setOpen(false,true);return}
    if(event.key==='Tab'){
      const focusable=[...document.querySelectorAll('.top a,.top button')].filter(el=>el.getClientRects().length&&!el.hidden);
      const first=focusable[0],last=focusable.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  });
  narrow.addEventListener('change',()=>setOpen(false));
  setOpen(false);
})();
