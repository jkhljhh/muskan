'use client'
import { useEffect, useRef } from 'react'

export default function FinaleSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        ;(window as any).__launchFireworks?.(6)
      }
    }, { threshold: .4 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="finale" style={{
      minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center',
      flexDirection:'column', textAlign:'center', position:'relative', overflow:'hidden',
      background:'radial-gradient(ellipse 70% 80% at 50% 50%, #3d0a1a 0%, #1a0a10 100%)',
      padding:'4rem 2rem',
    }}>
      {/* Pulsing rings */}
      {[1,2,3].map(i => (
        <div key={i} style={{
          position:'absolute', borderRadius:'50%', border:'1px solid rgba(232,67,106,.08)',
          width: `${i*25}vw`, height: `${i*25}vw`,
          top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          animation:`glowPulse ${5+i*2}s ease-in-out infinite`,
          animationDelay:`${i*.8}s`, pointerEvents:'none',
        }} />
      ))}

      <div style={{
        fontFamily:"'Dancing Script', cursive",
        fontSize:'clamp(2.5rem,8vw,6rem)',
        background:'linear-gradient(135deg,#f7c5d0,#e8436a,#d4a853)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
        lineHeight:1.2, marginBottom:'1.5rem',
        opacity:0, animation:'fadeUp 1s .3s forwards',
      }}>
        You are my forever,<br />Muskan.
      </div>

      <div style={{
        fontSize:'clamp(.9rem,2vw,1.1rem)', letterSpacing:'.25em',
        color:'rgba(255,248,240,.5)',
        opacity:0, animation:'fadeUp 1s .7s forwards',
      }}>
        with all my love · Nikhil
      </div>
    </section>
  )
}
