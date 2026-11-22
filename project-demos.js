(()=>{
  const dialog=document.querySelector('#project-demo');
  if(!dialog)return;
  const stage=dialog.querySelector('.project-demo-stage');
  const close=document.querySelector('#project-demo-close');
  const title=document.querySelector('#project-demo-title');
  const link=document.querySelector('#project-demo-link');
  let previous,frame;
  const tools={
    folderify:{title:'Folderify',url:'folderify/',demo:'folderify/demo.html?v=2'},
    box:{title:'Сборщик коробочек',url:'https://design-dmitriev.github.io/box-builder/',video:'assets/demo/box.mp4',poster:'assets/demo/box.jpg'}
  };
  // Keep the original tutorial intact; fit its viewport inside the media area.
  function fit(){
    if(!dialog.open||!frame)return;
    const style=getComputedStyle(stage);
    const width=stage.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
    const height=stage.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
    const iframe=frame.querySelector('iframe');
    if(width/height>=1.65&&height<360){
      const w=Math.min(width,900);
      frame.style.width=w+'px';frame.style.height=height+'px';
      iframe.style.width=w+'px';iframe.style.height=height+'px';iframe.style.transform='none';
      return;
    }
    const w=Math.max(0,Math.min(width,height*.6,448.5)),h=w/.6;
    frame.style.width=w+'px';frame.style.height=h+'px';
    iframe.style.width=w+'px';iframe.style.height=h+'px';iframe.style.transform='none';
  }
  new ResizeObserver(fit).observe(stage);
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{
    stage.querySelector('video')?.pause();
    stage.replaceChildren();frame=null;
    document.body.classList.remove('viewing');
    previous?.focus({preventScroll:true});
  });
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
  });
  document.querySelectorAll('[data-tool]').forEach(button=>button.addEventListener('click',()=>{
    const item=tools[button.dataset.tool];
    if(!item)return;
    previous=button;title.textContent=item.title;
    link.href=item.url;link.target='_blank';link.rel='noopener';
    dialog.dataset.kind=item.video?'video':'html';
    if(item.video){
      const video=document.createElement('video');
      video.src=item.video;video.poster=item.poster;video.controls=true;video.playsInline=true;video.preload='metadata';
      video.setAttribute('aria-label',item.title+' — демо');
      stage.replaceChildren(video);
    }else{
      frame=document.createElement('div');frame.className='demo-viewport';
      const iframe=document.createElement('iframe');
      iframe.src=item.demo;iframe.title=item.title+' — демо';
      frame.append(iframe);stage.replaceChildren(frame);
    }
    dialog.showModal();document.body.classList.add('viewing');fit();
    close.focus({preventScroll:true});
  }));
})();
