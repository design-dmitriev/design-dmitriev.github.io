(function(){
  var s=document.getElementById('s'),fit=document.getElementById('fit'),cap=document.getElementById('cap');
  function sc(){var k=Math.min(innerWidth/900,innerHeight/1500);fit.style.transform='scale('+k+')';fit.style.margin=((1500*k-1500)/2)+'px '+((900*k-900)/2)+'px'}
  addEventListener('resize',sc);sc();
  var t=[],cfg,N,cur=-1;
  function at(ms,f){t.push(setTimeout(f,ms))}
  function rep(i,d){try{parent.postMessage({fy:'step',i:i,n:N,d:d},'*')}catch(e){}}
  function cls(n){for(var i=1;i<=N;i++)s.classList.toggle('st'+i,i<=n)}
  function show(x){cap.style.opacity=0;setTimeout(function(){cap.textContent=x;cap.style.opacity=1},200)}
  function run(from){
    from=from||0;t.forEach(clearTimeout);t=[];
    s.classList.add('nt');cls(from);cfg.reset&&cfg.reset(s);
    for(var j=0;j<from;j++)cfg.steps[j].fn&&cfg.steps[j].fn(s,true);
    void s.offsetWidth;s.classList.remove('nt');
    if(!from){cap.textContent='';cap.style.opacity=0}
    var o=from?0:300,acc=o;
    cfg.steps.forEach(function(st,i){
      if(i<from)return;
      (function(st,i,a){at(a,function(){cls(i+1);show(st.c);rep(i,st.ms);st.fn&&st.fn(s,false)})})(st,i,acc);
      acc+=st.ms;
    });
    at(acc+(cfg.end||1400),function(){run(0)});
  }
  window.Motion={start:function(c){
    cfg=c;N=c.steps.length;
    try{parent.postMessage({fy:'steps',n:N},'*')}catch(e){}
    addEventListener('message',function(e){var m=e.data;if(m&&m.fy==='go'&&m.i>=0&&m.i<N)run(m.i)});
    var rec=/[?&]rec/.test(location.search);
    window.__run=function(){run(0)};
    if(!rec)document.fonts.ready.then(function(){run(0)});
  },marks:function(){var a=[],x=300;cfg.steps.forEach(function(st){a.push(x/1000);x+=st.ms});return a},total:function(){var x=300;cfg.steps.forEach(function(st){x+=st.ms});return (x+(cfg.end||1400))/1000}};
})();
