'use client'
import { useEffect, useRef } from 'react'

const reasons = [
  { title: "Your Smile", text: "The world stops when you smile. It's the most beautiful thing I have ever seen, and I would travel to the ends of the earth just to see it every day." },
  { title: "Your Kindness", text: "You have a heart so big and warm that everyone around you feels loved without even asking for it. That is rare. That is you." },
  { title: "Your Strength", text: "You carry so much with such grace. You face storms and still manage to bloom. Watching you be strong is one of the most inspiring things in my life." },
  { title: "Your Voice", text: "Whether you're laughing, whispering, or just saying my name — the sound of your voice is the most comforting melody I know." },
  { title: "The Way You Think", text: "Your mind is brilliant and beautiful. The way you see the world, the way you find meaning in little things — it makes me fall harder every time." },
  { title: "Your Eyes", text: "I could spend a lifetime getting lost in your eyes and never want to find my way back. They hold galaxies I want to explore forever." },
  { title: "Your Honesty", text: "You are real with me in a world full of pretend. That truth between us — it is the foundation of everything we are." },
  { title: "The Way You Care", text: "You notice. You remember. You ask how I'm really doing. That kind of care is the most beautiful form of love there is." },
  { title: "Your Presence", text: "Just having you near makes everything better. You are peace and excitement wrapped in one extraordinary human being." },
  { title: "Simply You", text: "There is no single reason — it is everything, all at once, all the time. It is you, Muskan. Just you. Perfectly, entirely you." },
]

export default function ReasonsSection() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    gridRef.current?.querySelectorAll('.reason-card').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="reasons" style={{
      padding: 'clamp(4rem,10vw,8rem) clamp(1.5rem,6vw,5rem)',
      background: 'linear-gradient(180deg, #1a0a10 0%, #200812 50%, #1a0a10 100%)',
    }}>
      <div className="reveal section-label" style={{ fontFamily:"'Dancing Script', cursive", fontSize:'1.1rem', color:'#d4a853', letterSpacing:'.2em', marginBottom:'1rem' }}>
        — why I love you —
      </div>
      <h2 className="reveal s-heading" style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(2.2rem,6vw,4.5rem)', fontWeight:700,
        background:'linear-gradient(90deg,#fff 30%,#f7c5d0 70%,#e8436a 100%)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:'3rem' }}>
        10 Reasons You&apos;re <br /><em style={{ fontStyle:'italic' }}>Everything</em>
      </h2>

      <div ref={gridRef} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:'1.5rem', maxWidth:1100, margin:'0 auto' }}>
        {reasons.map((r, i) => (
          <div key={i} className="reason-card" style={{ transitionDelay:`${i*.08}s` }}>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:'4rem', fontWeight:700,
              color:'rgba(232,67,106,.14)', lineHeight:1, marginBottom:'.5rem' }}>
              {String(i+1).padStart(2,'0')}
            </div>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.3rem', fontWeight:700,
              color:'#f7c5d0', marginBottom:'.8rem' }}>{r.title}</div>
            <div style={{ fontSize:'1rem', lineHeight:1.8, color:'rgba(255,248,240,.65)', fontStyle:'italic' }}>{r.text}</div>
          </div>
        ))}
      </div>

      <style>{`
        .reason-card {
          border: 1px solid rgba(232,67,106,.18);
          border-radius: 2px;
          padding: 2.5rem 2rem;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(107,26,46,.2) 0%, rgba(26,10,16,.4) 100%);
          backdrop-filter: blur(10px);
          opacity: 0;
          transform: translateY(40px);
          transition: opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1), border-color .3s, box-shadow .3s;
          cursor: default;
        }
        .reason-card.visible { opacity: 1; transform: none; }
        .reason-card:hover {
          border-color: #e8436a;
          transform: translateY(-5px);
          box-shadow: 0 24px 60px rgba(232,67,106,.18);
        }
      `}</style>
    </section>
  )
}
