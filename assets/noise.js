(()=>{
const canvas=document.querySelector('#noise');if(!canvas)return;
const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return;
const vertex='attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}';
const fragment=`precision mediump float;uniform vec2 resolution;uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float n=0.,a=.5;for(int i=0;i<4;i++){n+=a*noise(p);p=p*2.03+3.1;a*=.5;}return n;}
void main(){vec2 uv=gl_FragCoord.xy/resolution;vec2 p=uv*vec2(resolution.x/resolution.y,1.)*1.8;float t=time*.14;vec2 q=vec2(fbm(p+vec2(t,0.)),fbm(p+vec2(5.2,-t*.7)));vec2 r=vec2(fbm(p+2.6*q+vec2(1.7+t,9.2)),fbm(p+2.6*q+vec2(8.3,2.8-t)));float v=smoothstep(.27,.69,fbm(p+2.2*r));float ridge=exp(-pow((v-.48)*9.,2.));float g=.045+.56*v+.26*ridge;gl_FragColor=vec4(vec3(g),1.);}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
const resolution=gl.getUniformLocation(program,'resolution'),time=gl.getUniformLocation(program,'time'),reduce=matchMedia('(prefers-reduced-motion: reduce)');let visible=true,raf=0,last=-1;
function size(){const rect=canvas.getBoundingClientRect(),scale=Math.min(1,900/rect.width);const w=Math.max(1,Math.round(rect.width*scale)),h=Math.max(1,Math.round(rect.height*scale));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
function draw(ms){size();gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform1f(time,ms/1000);gl.drawArrays(gl.TRIANGLES,0,6);}
function loop(ms){raf=0;if(!visible||document.hidden||reduce.matches)return;if(last<0||ms-last>=15.5){draw(ms);last=ms;}raf=requestAnimationFrame(loop);}
function start(){if(!raf&&visible&&!document.hidden&&!reduce.matches)raf=requestAnimationFrame(loop)}
new ResizeObserver(()=>{size();if(reduce.matches)draw(0)}).observe(canvas.parentElement);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start()}).observe(canvas.parentElement);document.addEventListener('visibilitychange',start);reduce.addEventListener('change',()=>{if(reduce.matches){cancelAnimationFrame(raf);raf=0;draw(0)}else start()});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);raf=0});canvas.addEventListener('webglcontextrestored',()=>location.reload());draw(0);start();
})();
