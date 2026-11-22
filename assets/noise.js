(()=>{
  const canvas=document.querySelector('#noise');
  if(!canvas)return;
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  if(!gl)return;
  const vertex='attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}';
  // Broad, directional folds: slow deformation and a soft satin highlight.
  // No turbulent noise or small, independently moving ripples.
  const fragment=`precision mediump float;
    uniform vec2 resolution;
    uniform float time;
    void main(){
      vec2 uv=gl_FragCoord.xy/resolution;
      float aspect=resolution.x/resolution.y;
      vec2 p=(uv-.5)*vec2(aspect,1.);
      float along=.82*p.x+.57*p.y;
      float across=-.57*p.x+.82*p.y;
      float t=time*.09;
      float bend=.46*sin(across*2.05+t*.55+.75)
                +.14*sin(across*3.3-t*.32-1.0)
                +.055*sin(along*1.6-across*1.3+t*.22);
      float phase=(along+bend)*8.2+t*.8;
      float fold=.5+.5*sin(phase);
      float slope=cos(phase)+.16*cos(phase*2.+.35);
      vec3 n=normalize(vec3(-slope*.95,.12*sin(across*1.4+t*.4),1.));
      vec3 lamp=normalize(vec3(-.75,.35,1.25));
      vec3 halfway=normalize(lamp+vec3(0.,0.,1.));
      float diffuse=max(dot(n,lamp),0.);
      float sheen=pow(max(dot(n,halfway),0.),28.);
      float light=.72+.28*cos(across*1.3-t*.25);
      float shadow=smoothstep(.04,.75,fold);
      float g=.025+.18*diffuse+.22*shadow+.36*sheen*light;
      g*=.88+.12*cos(across*.9);
      gl_FragColor=vec4(vec3(g),1.);
    }`;
  function shader(type,source){
    const s=gl.createShader(type);
    gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));
    return s;
  }
  const program=gl.createProgram();
  gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
  gl.useProgram(program);
  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const resolution=gl.getUniformLocation(program,'resolution');
  const time=gl.getUniformLocation(program,'time');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let visible=true,raf=0,last=-1,elapsed=0;
  function size(){
    const rect=canvas.getBoundingClientRect(),scale=Math.min(1,1000/rect.width);
    const w=Math.max(1,Math.round(rect.width*scale)),h=Math.max(1,Math.round(rect.height*scale));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
  }
  function draw(){
    size();gl.uniform2f(resolution,canvas.width,canvas.height);
    gl.uniform1f(time,elapsed/1000);gl.drawArrays(gl.TRIANGLES,0,6);
  }
  function loop(ms){
    raf=0;
    if(!visible||document.hidden||reduce.matches){last=-1;return}
    if(last<0)last=ms;
    if(ms-last>=32){elapsed+=Math.min(ms-last,64);last=ms;draw()}
    raf=requestAnimationFrame(loop);
  }
  function start(){if(!raf&&visible&&!document.hidden&&!reduce.matches){last=-1;raf=requestAnimationFrame(loop)}}
  function pause(){cancelAnimationFrame(raf);raf=0;last=-1}
  new ResizeObserver(draw).observe(canvas.parentElement);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else pause()}).observe(canvas.parentElement);
  document.addEventListener('visibilitychange',()=>document.hidden?pause():start());
  reduce.addEventListener('change',()=>{if(reduce.matches){pause();draw()}else start()});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();pause()});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  draw();start();
})();
