'use client'
import { useEffect, useRef } from 'react'

const promises = [
  "I promise to always choose you, every day, without hesitation.",
  "I promise to hold your hand through every storm and dance with you after.",
  "I promise to listen — really listen — when you speak.",
  "I promise to make you laugh as often as possible, even on hard days.",
  "I promise to love the parts of you that you sometimes forget to love yourself.",
  "I promise to be your safe place, always and without conditions.",
  "I promise to keep choosing this — choosing us — for as long as you'll have me.",
]

export default function PromiseSection() {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })
    listRef.current?.querySelectorAll('li').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="promise" style={{
      textAlign:'center',
      padding: 'clamp(4rem,10vw,8rem) clamp(1.5rem,6vw,5rem) 8rem',
      background: 'radial-gradient(ellipse at 50% 100%, #350d1e 0%, #1a0a10 60%)',
    }}>
      <div style={{ fontFamily:"'Dancing Script', cursive", fontSize:'1.1rem', color:'#d4a853', letterSpacing:'.2em', marginBottom:'1rem' }}>
        — forever, I promise —
      </div>
      <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(2.2rem,6vw,4.5rem)', fontWeight:700,
        background:'linear-gradient(90deg,#fff 30%,#f7c5d0 70%,#e8436a 100%)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
        marginBottom:'0' }}>
        Promises I Keep
      </h2>

      {/* Rotating ring */}
      <div style={{ width:'clamp(180px,40vw,280px)', height:'clamp(180px,40vw,280px)', borderRadius:'50%',
        border:'1px solid rgba(212,168,83,.3)', display:'flex', alignItems:'center', justifyContent:'center',
        margin:'3rem auto', position:'relative' }}>
        <div className="rotate-slow" style={{ position:'absolute', inset:-14, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.5rem', letterSpacing:'.15em', color:'#d4a853', opacity:.5 }}>
          {'✦ '.repeat(20)}
        </div>
        <div className="rotate-slow-rev" style={{ fontSize:'3rem' }}>💍</div>
      </div>

      <ul ref={listRef} style={{ listStyle:'none', maxWidth:600, margin:'0 auto', display:'flex', flexDirection:'column', gap:'1.2rem' }}>
        {promises.map((p, i) => (
          <li key={i} className="promise-item" style={{ transitionDelay:`${i*.12}s`,
            fontSize:'clamp(1rem,2.5vw,1.2rem)', lineHeight:1.7,
            color:'rgba(255,248,240,.82)', fontStyle:'italic',
            padding:'1rem 1.5rem', borderLeft:'2px solid #e8436a', textAlign:'left' }}>
            {p}
          </li>
        ))}
      </ul>
    </section>
  )
}
