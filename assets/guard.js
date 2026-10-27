(function(){
var s=document.createElement('style');
s.textContent='img,video,canvas,svg image{-webkit-user-drag:none;user-drag:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}img{pointer-events:none}@media print{body{display:none!important}}';
document.head.appendChild(s);
function media(t){return t&&t.closest&&t.closest('img,video,canvas,picture,svg')}
addEventListener('contextmenu',function(e){if(media(e.target)||!e.target.closest||!e.target.closest('input,textarea'))e.preventDefault()},true);
addEventListener('dragstart',function(e){if(media(e.target))e.preventDefault()},true);
addEventListener('keydown',function(e){var k=(e.key||'').toLowerCase();if((e.ctrlKey||e.metaKey)&&(k==='s'||k==='u'||k==='p'))e.preventDefault()},true);
function vids(){var v=document.getElementsByTagName('video');for(var i=0;i<v.length;i++){v[i].setAttribute('controlsList','nodownload noplaybackrate');v[i].setAttribute('disablePictureInPicture','');v[i].setAttribute('disableRemotePlayback','')}}
vids();new MutationObserver(vids).observe(document.documentElement,{childList:true,subtree:true});
})();
