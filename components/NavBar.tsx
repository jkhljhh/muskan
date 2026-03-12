'use client'
import { useEffect, useRef, useState } from 'react'

export default function NavBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '2rem', padding: '1rem 2rem',
        background: 'rgba(26,10,16,.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(232,67,106,.12)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform .5s cubic-bezier(.4,0,.2,1)',
      }}
    >
      {[['hero','✦ Home'],['sky-section','✦ Stars'],['reasons','✦ Reasons'],['letter','✦ Letter'],['promise','✦ Promises']].map(([id, label]) => (
        <button key={id} className="nav-link" onClick={() => scrollTo(id)}
          style={{ background:'none', border:'none', fontFamily:"'Dancing Script', cursive", fontSize:'1.05rem',
            color:'rgba(255,248,240,.55)', letterSpacing:'.1em', cursor:'pointer', transition:'color .3s' }}
          onMouseEnter={e => (e.target as any).style.color='#e8436a'}
          onMouseLeave={e => (e.target as any).style.color='rgba(255,248,240,.55)'}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
