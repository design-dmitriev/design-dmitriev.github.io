(function(){
  var frame=document.getElementById('folderify-demo');
  var buttons=[].slice.call(document.querySelectorAll('#steps button'));
  function send(data){if(frame.contentWindow)frame.contentWindow.postMessage(data,location.origin)}
  function mark(i){buttons.forEach(function(b,k){b.classList.toggle('on',k===i);b.setAttribute('aria-pressed',String(k===i))})}
  buttons.forEach(function(b,i){b.addEventListener('click',function(){send({fy:'go',i:i});mark(i)})});
  addEventListener('message',function(e){if(e.origin!==location.origin||e.source!==frame.contentWindow||!e.data)return;if(e.data.fy==='step')mark(e.data.i)});
  new IntersectionObserver(function(entries){send({fy:entries[0].isIntersecting?'play':'pause'})},{threshold:.15}).observe(frame);
  mark(0);
})();
