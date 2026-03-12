'use client'
import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * .5 + .5;
  gl_Position = vec4(a_pos, 0., 1.);
}`

const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec2  u_res;

float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.-2.*f);
  float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.1+.3;a*=.5;}
  return v;
}

void main(){
  vec2 uv=v_uv;
  vec2 m=u_mouse/u_res;
  float t=u_time*.15;
  vec2 warp=vec2(fbm(uv*2.5+t+vec2(1.7,9.2)),fbm(uv*2.5+t+vec2(8.3,2.8)));
  float f=fbm(uv*3.+warp*.8+t*.4);
  float b1=smoothstep(.0,.5,sin(uv.y*5.+f*4.+t*1.2)*.5+.5);
  float b2=smoothstep(.0,.5,sin(uv.y*3.-f*3.+t*.8+1.5)*.5+.5);
  float b3=smoothstep(.1,.6,sin(uv.y*7.+f*2.+t*1.5+3.)*.5+.5);
  vec3 c1=vec3(.91,.26,.42);
  vec3 c2=vec3(.45,.22,.85);
  vec3 c3=vec3(.83,.66,.2);
  vec3 col=mix(vec3(0.),c1,b1*.3);
  col+=c2*b2*.22;
  col+=c3*b3*.14;
  float md=length(uv-m);
  col+=c1*.1*smoothstep(.5,.0,md);
  float vig=uv.x*(1.-uv.x)*uv.y*(1.-uv.y);
  col*=16.*vig*vig+.04;
  gl_FragColor=vec4(col,1.);
}`

export default function Hero() {
  const cvRef  = useRef<HTMLCanvasElement>(null)
  const lettersRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const cv = cvRef.current; if (!cv) return
    const gl = cv.getContext('webgl') || cv.getContext('experimental-webgl') as WebGLRenderingContext | null
    if (!gl) return

    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; (gl as WebGLRenderingContext).viewport(0,0,cv.width,cv.height) }
    resize()
    window.addEventListener('resize', resize)

    const mkShader = (type: number, src: string) => {
      const s = (gl as WebGLRenderingContext).createShader(type)!
      ;(gl as WebGLRenderingContext).shaderSource(s, src)
      ;(gl as WebGLRenderingContext).compileShader(s)
      return s
    }
    const prog = (gl as WebGLRenderingContext).createProgram()!
    ;(gl as WebGLRenderingContext).attachShader(prog, mkShader((gl as WebGLRenderingContext).VERTEX_SHADER, VERT))
    ;(gl as WebGLRenderingContext).attachShader(prog, mkShader((gl as WebGLRenderingContext).FRAGMENT_SHADER, FRAG))
    ;(gl as WebGLRenderingContext).linkProgram(prog)
    ;(gl as WebGLRenderingContext).useProgram(prog)

    const buf = (gl as WebGLRenderingContext).createBuffer()
    ;(gl as WebGLRenderingContext).bindBuffer((gl as WebGLRenderingContext).ARRAY_BUFFER, buf)
    ;(gl as WebGLRenderingContext).bufferData((gl as WebGLRenderingContext).ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), (gl as WebGLRenderingContext).STATIC_DRAW)
    const aPos = (gl as WebGLRenderingContext).getAttribLocation(prog, 'a_pos')
    ;(gl as WebGLRenderingContext).enableVertexAttribArray(aPos)
    ;(gl as WebGLRenderingContext).vertexAttribPointer(aPos, 2, (gl as WebGLRenderingContext).FLOAT, false, 0, 0)

    const uTime  = (gl as WebGLRenderingContext).getUniformLocation(prog, 'u_time')
    const uMouse = (gl as WebGLRenderingContext).getUniformLocation(prog, 'u_mouse')
    const uRes   = (gl as WebGLRenderingContext).getUniformLocation(prog, 'u_res')

    let mx = window.innerWidth/2, my = window.innerHeight/2
    document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY })

    const t0 = performance.now()
    let raf: number
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      ;(gl as WebGLRenderingContext).uniform1f(uTime, (now-t0)/1000)
      ;(gl as WebGLRenderingContext).uniform2f(uMouse, mx, cv.height-my)
      ;(gl as WebGLRenderingContext).uniform2f(uRes, cv.width, cv.height)
      ;(gl as WebGLRenderingContext).drawArrays((gl as WebGLRenderingContext).TRIANGLE_STRIP, 0, 4)
    }
    requestAnimationFrame(frame)

    // Animate hero letters
    lettersRef.current.forEach((el, i) => {
      if (!el) return
      setTimeout(() => {
        el.style.transform = 'translateY(0)'
        el.style.opacity = '1'
      }, 400 + i * 90)
    })

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [])

  const name = 'Muskan'

  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', textAlign: 'center', position: 'relative', padding: '2rem',
      background: 'radial-gradient(ellipse 80% 60% at 50% 60%, #3d0a1a 0%, #1a0a10 70%)',
      overflow: 'hidden',
    }}>
      {/* WebGL aurora */}
      <canvas ref={cvRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0 }} />

      {/* Stars */}
      <Stars />

      {/* Glow orbs */}
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'rgba(232,67,106,.18)', filter:'blur(80px)', top:'5%', left:'15%', animation:'glowPulse 6s ease-in-out infinite', pointerEvents:'none', zIndex:1 }} />
      <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'rgba(212,168,83,.12)', filter:'blur(80px)', bottom:'8%', right:'12%', animation:'glowPulse 9s ease-in-out infinite reverse', pointerEvents:'none', zIndex:1 }} />

      {/* Content */}
      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ fontFamily:"'Dancing Script', cursive", fontSize:'clamp(1rem,3vw,1.4rem)', color:'#d4a853',
          letterSpacing:'.15em', opacity:0, animation:'fadeUp .8s .3s forwards', marginBottom:'1.5rem' }}>
          ✦ a love story, written just for you ✦
        </div>

        <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(4.5rem,16vw,12rem)',
          fontWeight:700, lineHeight:.9, letterSpacing:'-.02em', display:'flex', overflow:'hidden',
          marginBottom:0 }}>
          {name.split('').map((ch, i) => (
            <span key={i} ref={el => { if(el) lettersRef.current[i] = el }}
              style={{ display:'inline-block', background:'linear-gradient(135deg,#fff 0%,#f7c5d0 30%,#e8436a 65%,#d4a853 100%)',
                backgroundSize:'300%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text', transform:'translateY(110%)', opacity:0,
                transition:'transform .7s cubic-bezier(.16,1,.3,1), opacity .7s',
                filter:'drop-shadow(0 0 50px rgba(232,67,106,.4))',
                animation: i === 0 ? undefined : `shimmer 6s ${1.5+i*.2}s linear infinite`,
              }}>
              {ch}
            </span>
          ))}
        </h1>

        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic',
          fontSize:'clamp(1rem,3vw,1.5rem)', color:'rgba(255,248,240,.7)', marginTop:'1.5rem',
          letterSpacing:'.08em', opacity:0, animation:'fadeUp .9s 1.1s forwards' }}>
          From the boy who fell for your smile, completely and forever.
        </p>

        <div style={{ marginTop:'3rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'.5rem',
          opacity:0, animation:'fadeUp .8s 2s forwards' }}>
          <span style={{ fontSize:'.7rem', letterSpacing:'.3em', color:'#d4a853', opacity:.7 }}>SCROLL</span>
          <div style={{ width:1, height:50, background:'linear-gradient(to bottom, #d4a853, transparent)',
            animation:'scroll-line 1.5s ease-in-out infinite' }} />
        </div>
      </div>

      <style>{`
        @keyframes scroll-line {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </section>
  )
}

function Stars() {
  return (
    <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none' }}>
      {Array.from({length:180}, (_,i) => {
        const size = Math.random()*2.5+.4
        const delay = Math.random()*7
        const dur   = 2+Math.random()*5
        const op    = .4+Math.random()*.6
        return (
          <div key={i} style={{
            position:'absolute', borderRadius:'50%', background:'#fff',
            width:size, height:size,
            left: Math.random()*100+'%', top: Math.random()*100+'%',
            opacity:0,
            animation:`starPulse ${dur}s ${delay}s ease-in-out infinite`,
            ['--op' as any]: op,
          }} />
        )
      })}
    </div>
  )
}
