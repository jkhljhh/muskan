'use client'
import { useEffect, useRef } from 'react'

const moments = [
  { time: "The Beginning",    title: "The Day I Met You",         desc: "There was something about the way you looked at the world — curious and full of light. I knew, even then, that you were extraordinary." },
  { time: "First Laugh",      title: "When You Laughed With Me",  desc: "That first real laugh we shared — I replayed it a hundred times that night. I knew then I wanted to spend forever making you laugh." },
  { time: "A Quiet Evening",  title: "When the World Faded Away", desc: "Just the two of us, talking about everything and nothing. Time stopped. I wished it would never start again." },
  { time: "Hard Days",        title: "When I Needed You Most",    desc: "You didn't say much. You didn't have to. You just stayed. And that was everything." },
  { time: "Right Now",        title: "Every Single Day with You", desc: "Every ordinary moment spent with you becomes a memory I treasure. You make life feel like the most beautiful adventure." },
]

export default function TimelineSection() {
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })
    innerRef.current?.querySelectorAll('.tl-item').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="timeline" style={{
      padding: 'clamp(4rem,10vw,8rem) clamp(1.5rem,6vw,5rem)',
      background: 'linear-gradient(180deg, #1a0a10 0%, #1e0810 100%)',
    }}>
      <div style={{ fontFamily:"'Dancing Script', cursive", fontSize:'1.1rem', color:'#d4a853', letterSpacing:'.2em', marginBottom:'1rem' }}>
        — our little universe —
      </div>
      <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(2.2rem,6vw,4.5rem)', fontWeight:700,
        background:'linear-gradient(90deg,#fff 30%,#f7c5d0 70%,#e8436a 100%)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
        marginBottom:'3rem' }}>
        Moments That <br />Matter Most
      </h2>

      <div ref={innerRef} style={{ maxWidth:700, margin:'0 auto' }}>
        {moments.map((m, i) => (
          <div key={i} className="tl-item" style={{ transitionDelay:`${i*.1}s` }}>
            <div style={{ flexShrink:0, width:14, height:14, borderRadius:'50%', background:'#e8436a',
              marginTop:'.5rem', boxShadow:'0 0 22px #e8436a', position:'relative' }}>
              {i < moments.length-1 && (
                <div style={{ position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)',
                  width:1, height:60, background:'linear-gradient(#e8436a, transparent)' }} />
              )}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'.8rem', letterSpacing:'.2em', color:'#d4a853', marginBottom:'.4rem' }}>{m.time}</div>
              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.2rem', color:'#f7c5d0', marginBottom:'.4rem' }}>{m.title}</div>
              <div style={{ fontSize:'.95rem', lineHeight:1.8, color:'rgba(255,248,240,.6)', fontStyle:'italic' }}>{m.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .tl-item {
          display: flex;
          gap: 2rem;
          margin-bottom: 3rem;
          opacity: 0;
          transform: translateX(-30px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .tl-item.visible { opacity: 1; transform: none; }
        .tl-item:nth-child(even) { flex-direction: row-reverse; transform: translateX(30px); }
        .tl-item:nth-child(even).visible { transform: none; }
        @media (max-width: 600px) {
          .tl-item, .tl-item:nth-child(even) { flex-direction: row; }
        }
      `}</style>
    </section>
  )
}
