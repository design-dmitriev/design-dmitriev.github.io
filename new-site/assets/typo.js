(function(){
  var ST=document.currentScript&&document.currentScript.hasAttribute('data-static');
  var NB=' ',W='а|в|и|к|о|с|у|я|на|по|за|от|до|из|не|ни|но|же|ли|бы|во|ко|со|об|то|для|при|про|без|над|под|или|что|как|так|его|её|их|мы|вы|он|она|они|это|все|всё|ещё|уже|вот|тут|там',
  re1=new RegExp('(^|[\\s(«„"—–-])('+W+')[ \\t]+(?=\\S)','gi'),
  re2=/(\d)[ \t]+(?=(?:[a-zA-Zа-яА-ЯёЁ%°×xх]|[×]))/g,
  re3=/[ \t]+([—–])(?=\s)/g,
  re4=/([×x])[ \t]+(?=\d)/g,
  re5=/(\S+)[ \t]+(\S{1,6}[.,!?…:;»)]*)$/;
  var SKIP={SCRIPT:1,STYLE:1,CODE:1,PRE:1,TEXTAREA:1,INPUT:1,SELECT:1,OPTION:1,NOSCRIPT:1,SVG:1};
  function fix(s){
    s=s.replace(re3,NB+'$1');
    for(var i=0;i<2;i++)s=s.replace(re1,function(m,a,w){return a+w+NB});
    s=s.replace(re2,'$1'+NB).replace(re4,'$1'+NB);
    return s}
  function walk(root){
    if(!root||root.nodeType!==1&&root.nodeType!==11)return;
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;if(!p||SKIP[p.nodeName.toUpperCase()]||p.isContentEditable)return NodeFilter.FILTER_REJECT;return /\S/.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}}),n,list=[];
    while(n=w.nextNode())list.push(n);
    list.forEach(function(n){var v=n.nodeValue,f=fix(v);
      if(n===n.parentNode.lastChild||!n.nextSibling){f=f.replace(re5,function(m,a,b){return / /.test(b)?m:a+NB+b})}
      if(n.nextSibling&&n.nextSibling.nodeType===1&&n.parentNode.className!=='nw'){f=f.replace(new RegExp('(^|[\\s(«„"—–-])('+W+')[ \\t]+$','i'),function(m,a,w){return a+w+NB})}
      var HY=/(?:[а-яёА-ЯЁa-zA-Z]{1,5}\u00A0)?[а-яёa-z]{2,7}-[а-яёa-z]{2,10}/gi,par=n.parentNode;
      if(!(par.className==='nw')&&HY.test(f)){HY.lastIndex=0;var fr=document.createDocumentFragment(),last=0,m;while(m=HY.exec(f)){if(m.index>last)fr.appendChild(document.createTextNode(f.slice(last,m.index).replace(new RegExp('(^|[\\s(«„"—–-])('+W+')[ \\t]+$','i'),function(x,a,w){return a+w+NB})));var sp=document.createElement('span');sp.className='nw';sp.textContent=m[0];fr.appendChild(sp);last=m.index+m[0].length}if(last<f.length)fr.appendChild(document.createTextNode(f.slice(last)));par.replaceChild(fr,n);return}
      HY.lastIndex=0;
      if(f!==v)n.nodeValue=f})}
  var busy=false,q=[];
  function run(){busy=false;var l=q;q=[];l.forEach(walk)}
  function init(){
    walk(document.body);
    if(ST)return;
    new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1||n.nodeType===3)q.push(n.nodeType===3?n.parentNode:n)});if(m.type==='characterData')q.push(m.target.parentNode)});if(!busy&&q.length){busy=true;requestAnimationFrame(run)}}).observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
