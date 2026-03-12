'use client'

function spawnHearts(x: number, y: number) {
  for (let i = 0; i < 12; i++) {
    const h = document.createElement('div')
    h.className = 'float-heart'
    h.textContent = ['♥','💕','🌸','✨','🌹'][Math.floor(Math.random()*5)]
    h.style.left = (x+(Math.random()-.5)*120)+'px'
    h.style.top  = (y+(Math.random()-.5)*60)+'px'
    h.style.animationDelay = Math.random()*.4+'s'
    h.style.fontSize = (1.2+Math.random()*.8)+'rem'
    document.body.appendChild(h)
    setTimeout(() => h.remove(), 1400)
  }
  ;(window as any).__launchFireworks?.(3)
}

export default function HeartSection() {
  return (
    <section id="heartbeat" style={{
      display:'flex', flexDirection:'column', alignItems:'center', gap:'3rem', textAlign:'center',
      padding: 'clamp(4rem,10vw,8rem) clamp(1.5rem,6vw,5rem)',
      background: '#1a0a10',
    }}>
      <div style={{ fontFamily:"'Dancing Script', cursive", fontSize:'1.1rem', color:'#d4a853', letterSpacing:'.2em' }}>
        — always beating for you —
      </div>

      <div
        className="heartbeat"
        onClick={e => spawnHearts(e.clientX, e.clientY)}
        style={{
          fontSize: 'clamp(6rem,15vw,10rem)', lineHeight:1, cursor:'pointer', userSelect:'none',
          filter:'drop-shadow(0 0 40px rgba(232,67,106,.75))',
        }}
        data-hover
      >
        ♥
      </div>

      <p style={{
        fontFamily:"'Playfair Display', serif",
        fontSize:'clamp(1.8rem,5vw,3.5rem)', fontStyle:'italic',
        background:'linear-gradient(90deg,#f7c5d0,#e8436a,#d4a853)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
        maxWidth:700,
      }}>
        &quot;Every heartbeat carries your name.&quot;
      </p>
    </section>
  )
}
