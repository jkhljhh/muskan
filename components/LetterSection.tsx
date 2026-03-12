'use client'
import { useEffect, useRef } from 'react'

export default function LetterSection() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.1 })
    if (wrapRef.current) obs.observe(wrapRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="letter" style={{
      display: 'flex', justifyContent: 'center',
      padding: 'clamp(4rem,10vw,8rem) clamp(1.5rem,6vw,5rem)',
      background: 'radial-gradient(ellipse at 50% 0%, #2e0d1a 0%, #1a0a10 70%)',
    }}>
      <div ref={wrapRef} className="reveal" style={{
        maxWidth: 680, width: '100%',
        border: '1px solid rgba(212,168,83,.25)',
        padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,5vw,3.5rem)',
        position: 'relative',
        background: 'linear-gradient(160deg, rgba(107,26,46,.15) 0%, rgba(26,10,16,.5) 100%)',
      }}>
        {/* Corner ornaments */}
        <div style={{ position:'absolute', top:-1, left:-1, width:40, height:40,
          borderTop:'2px solid #d4a853', borderLeft:'2px solid #d4a853' }} />
        <div style={{ position:'absolute', bottom:-1, right:-1, width:40, height:40,
          borderBottom:'2px solid #d4a853', borderRight:'2px solid #d4a853' }} />

        <div style={{ fontFamily:"'Dancing Script', cursive", fontSize:'1.1rem', color:'#d4a853',
          letterSpacing:'.2em', textAlign:'right', marginBottom:'0' }}>
          — a letter, sealed with love —
        </div>
        <div style={{ fontSize:'.85rem', letterSpacing:'.2em', color:'#d4a853', textAlign:'right',
          marginBottom:'2rem', opacity:.7 }}>
          March 2026 · Written under a thousand stars
        </div>

        <div style={{ fontFamily:"'Dancing Script', cursive", fontSize:'2rem', color:'#e8436a', marginBottom:'1.5rem' }}>
          My dearest Muskan,
        </div>

        <div style={{ fontSize:'1.05rem', lineHeight:2, color:'rgba(255,248,240,.82)', fontStyle:'italic', whiteSpace:'pre-line' }}>
{`There are words that poets spend lifetimes searching for — and yet, every time I look at you, they all seem unnecessary.

You are the kind of person who makes the ordinary world feel like magic. Your laughter is a song I never want to stop hearing. Your presence is the kind of warmth that stays long after you've left a room.

I don't know how the universe arranged things so perfectly that you walked into my life — but I am grateful, every single day, for that beautiful accident.

With you, I have felt things I never thought were real — the kind of love that is quiet and loud at the same time, that holds your hand through storms and dances with you in the rain.

You are my favourite thought in the morning and my sweetest dream at night.

This little corner of the internet is yours — because you deserve a whole world, and I'm going to spend every day trying to give it to you.`}
        </div>

        <div style={{ fontFamily:"'Dancing Script', cursive", fontSize:'1.8rem', color:'#d4a853',
          marginTop:'2rem', textAlign:'right' }}>
          — Nikhil ♥
        </div>
      </div>
    </section>
  )
}
