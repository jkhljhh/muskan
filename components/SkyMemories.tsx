'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { sb } from '@/lib/supabase'

interface MemoryMedia {
  url: string; name: string; folder: string; type: 'image'|'video'
}

interface Star3D {
  x: number; y: number; z: number
  vx: number; vy: number  // gentle drift
  r: number; pulse: number; pulseSpeed: number
  media: MemoryMedia
  hovered: boolean; opacity: number
  img?: HTMLImageElement
}

export default function SkyMemories() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const starsRef    = useRef<Star3D[]>([])
  const mediaRef    = useRef<MemoryMedia[]>([])
  const folderRef   = useRef('All')
  const [folders,   setFolders] = useState<string[]>(['All'])
  const [activeFolder, setActiveFolder] = useState('All')
  const [lightbox,  setLightbox] = useState<{media: MemoryMedia; idx: number}|null>(null)
  const [loaded,    setLoaded]   = useState(false)
  const hoveredRef  = useRef<Star3D|null>(null)

  // Load media from Supabase
  const loadMedia = useCallback(async () => {
    try {
      const { data, error } = await sb.storage.from('memories').list('', { limit:500, sortBy:{column:'created_at',order:'desc'} })
      if (error) throw error
      const all: MemoryMedia[] = []
      const folderSet = new Set<string>(['All'])
      const scan = async (prefix: string, items: any[]) => {
        if (!items) return
        for (const it of items) {
          if (it.id === null) {
            const { data: sub } = await sb.storage.from('memories').list(prefix + it.name, {limit:500})
            await scan(prefix + it.name + '/', sub || [])
          } else {
            if (it.name === '.emptyFolderPlaceholder') continue
            const { data: { publicUrl } } = sb.storage.from('memories').getPublicUrl(prefix + it.name)
            const folder = prefix ? prefix.replace(/\/$/, '') : 'All'
            folderSet.add(folder)
            all.push({ url: publicUrl, name: it.name, folder, type: /\.(mp4|webm|mov)$/i.test(it.name) ? 'video' : 'image' })
          }
        }
      }
      await scan('', data || [])
      mediaRef.current = all
      setFolders(Array.from(folderSet))
      buildStars()
      setLoaded(true)
    } catch(e) { console.error(e) }
  }, [])

  const buildStars = useCallback(() => {
    const folder = folderRef.current
    const visible = folder === 'All' ? mediaRef.current : mediaRef.current.filter(m => m.folder === folder)
    const W = window.innerWidth, H = window.innerHeight

    starsRef.current = visible.map((m, i) => {
      // Fibonacci sphere distribution
      const phi = Math.acos(1 - 2*(i+.5)/Math.max(visible.length,1))
      const theta = Math.PI * (1+Math.sqrt(5)) * i
      const rad = 0.35 + 0.55 * Math.sqrt(i / Math.max(visible.length,1))
      const x = W/2 + Math.sin(phi)*Math.cos(theta) * W * rad * .45
      const y = H/2 + Math.sin(phi)*Math.sin(theta) * H * rad * .35
      const star: Star3D = {
        x, y, z: .6 + Math.random()*.8,
        vx: (Math.random()-.5)*.15, vy: (Math.random()-.5)*.1,
        r: 4 + Math.random()*5,
        pulse: Math.random()*Math.PI*2, pulseSpeed: .016+Math.random()*.014,
        media: m, hovered: false, opacity: 0,
      }
      if (m.type === 'image') {
        const img = new Image(); img.crossOrigin = 'anonymous'
        img.src = m.url; img.onload = () => { star.img = img }
      }
      return star
    })
  }, [])

  const setSkyFolder = (f: string) => {
    folderRef.current = f
    setActiveFolder(f)
    buildStars()
  }

  // expose reload globally so UploadSection can trigger a refresh
  useEffect(() => {
    ;(window as any).__reloadSky = loadMedia
    return () => { delete (window as any).__reloadSky }
  }, [loadMedia])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  // Canvas render loop
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d')!
    let t = 0, raf: number

    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    // Ambient dust
    const dust = Array.from({length:300}, () => ({
      x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
      r: .3+Math.random()*1.1, alpha: .06+Math.random()*.3,
      phase: Math.random()*Math.PI*2, speed: .004+Math.random()*.012,
      col: ['#fff','#ffc8d8','#d4a853','#b48fff'][Math.floor(Math.random()*4)]
    }))

    const draw = () => {
      raf = requestAnimationFrame(draw)
      t += .01
      const W = cv.width, H = cv.height
      ctx.clearRect(0, 0, W, H)

      // dust
      dust.forEach(d => {
        d.phase += d.speed
        ctx.globalAlpha = d.alpha * (.6 + .4*Math.sin(d.phase))
        ctx.fillStyle = d.col
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI*2); ctx.fill()
      })

      // stars
      starsRef.current.forEach(s => {
        if (s.opacity < 1) s.opacity = Math.min(1, s.opacity + .018)

        // gentle parallax drift
        s.x += s.vx * .5
        s.y += s.vy * .3
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0
        if (s.y < 0) s.y = H; if (s.y > H) s.y = 0

        s.pulse += s.pulseSpeed
        const scale = s.hovered ? 1+.35*Math.sin(t*4) : 1+.18*Math.sin(s.pulse)
        const r = s.r * scale * s.z

        // outer glow
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r*6)
        if (s.hovered) {
          grd.addColorStop(0, 'rgba(232,67,106,.95)')
          grd.addColorStop(.3,'rgba(232,67,106,.3)')
          grd.addColorStop(1, 'rgba(232,67,106,0)')
        } else {
          grd.addColorStop(0, 'rgba(255,200,220,.8)')
          grd.addColorStop(.25,'rgba(255,100,150,.18)')
          grd.addColorStop(1, 'rgba(255,100,150,0)')
        }
        ctx.globalAlpha = s.opacity
        ctx.fillStyle = grd
        ctx.beginPath(); ctx.arc(s.x, s.y, r*6, 0, Math.PI*2); ctx.fill()

        // core
        ctx.fillStyle = s.hovered ? '#e8436a' : '#ffc8d8'
        ctx.shadowColor = s.hovered ? '#e8436a' : 'rgba(255,150,180,.5)'
        ctx.shadowBlur  = s.hovered ? 35 : 12
        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI*2); ctx.fill()
        ctx.shadowBlur = 0

        // thumbnail on hover
        if (s.hovered && s.img) {
          const sz = 110
          const tx = Math.min(Math.max(s.x - sz/2, 10), W-sz-10)
          const ty = s.y > H/2 ? s.y - sz - r*7 - 8 : s.y + r*7 + 8
          ctx.globalAlpha = .92
          ctx.save()
          ctx.beginPath(); ctx.arc(tx+sz/2, ty+sz/2, sz/2, 0, Math.PI*2); ctx.clip()
          ctx.drawImage(s.img, tx, ty, sz, sz)
          ctx.restore()
          ctx.globalAlpha = .65; ctx.strokeStyle='#e8436a'; ctx.lineWidth=1.5
          ctx.beginPath(); ctx.arc(tx+sz/2, ty+sz/2, sz/2, 0, Math.PI*2); ctx.stroke()
        }

        // label on hover
        if (s.hovered) {
          const label = s.media.name.replace(/^\d+_\d+_/, '').replace(/\.[^.]+$/, '')
          const ly = s.img
            ? (s.y > H/2 ? s.y-r*7-120 : s.y+r*7+125)
            : (s.y > H/2 ? s.y-r-16   : s.y+r+20)
          ctx.globalAlpha = .85
          ctx.font = `200 11px 'Cormorant Garamond', serif`
          ctx.fillStyle = '#fff8f0'; ctx.textAlign = 'center'
          ctx.fillText(label, s.x, ly)
        }

        ctx.globalAlpha = 1
      })

      // count label
      if (starsRef.current.length > 0) {
        ctx.globalAlpha = .22; ctx.font = `200 10px 'Cormorant Garamond', serif`
        ctx.fillStyle = '#fff8f0'; ctx.textAlign = 'right'
        ctx.fillText(`${starsRef.current.length} memor${starsRef.current.length!==1?'ies':'y'}`, W-20, H-16)
        ctx.globalAlpha = 1
      }
    }
    draw()

    // Mouse interaction
    const onMove = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect()
      const mx = e.clientX - rect.left, my = e.clientY - rect.top
      const hit = starsRef.current.find(s => {
        const dx=s.x-mx, dy=s.y-my
        return Math.sqrt(dx*dx+dy*dy) < Math.max(s.r*s.z*5, 28)
      })
      starsRef.current.forEach(s => s.hovered = (s === hit))
      hoveredRef.current = hit || null
      cv.style.cursor = hit ? 'pointer' : 'default'
    }

    const onClick = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect()
      const mx = e.clientX - rect.left, my = e.clientY - rect.top
      const hit = starsRef.current.find(s => {
        const dx=s.x-mx, dy=s.y-my
        return Math.sqrt(dx*dx+dy*dy) < Math.max(s.r*s.z*5, 28)
      })
      if (hit) {
        const items = folderRef.current === 'All' ? mediaRef.current : mediaRef.current.filter(m => m.folder === folderRef.current)
        const idx = items.findIndex(m => m.url === hit.media.url)
        if (idx !== -1) setLightbox({ media: hit.media, idx })
        spawnHearts(e.clientX, e.clientY)
      }
    }

    const onTouch = (e: TouchEvent) => {
      const t = e.changedTouches[0]
      const rect = cv.getBoundingClientRect()
      const mx = t.clientX - rect.left, my = t.clientY - rect.top
      const hit = starsRef.current.find(s => {
        const dx=s.x-mx, dy=s.y-my
        return Math.sqrt(dx*dx+dy*dy) < Math.max(s.r*s.z*5, 36)
      })
      if (hit) {
        const items = folderRef.current === 'All' ? mediaRef.current : mediaRef.current.filter(m => m.folder === folderRef.current)
        const idx = items.findIndex(m => m.url === hit.media.url)
        if (idx !== -1) setLightbox({ media: hit.media, idx })
      }
    }

    cv.addEventListener('mousemove', onMove)
    cv.addEventListener('click', onClick)
    cv.addEventListener('touchend', onTouch)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
      cv.removeEventListener('mousemove', onMove)
      cv.removeEventListener('click', onClick)
      cv.removeEventListener('touchend', onTouch)
    }
  }, [])

  return (
    <section id="sky-section" style={{
      position: 'relative', minHeight: '100vh',
      background: 'radial-gradient(ellipse 90% 70% at 50% 50%, #200812 0%, #1a0a10 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ position:'relative', zIndex:10, padding:'3rem 2rem 1rem', pointerEvents:'none' }}>
        <div style={{ fontFamily:"'Dancing Script', cursive", fontSize:'1.1rem', color:'#d4a853', letterSpacing:'.2em', marginBottom:'.8rem' }}>
          — memories as stars —
        </div>
        <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(2.2rem,6vw,4.5rem)', fontWeight:700,
          background:'linear-gradient(90deg,#fff 30%,#f7c5d0 70%,#e8436a 100%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          marginBottom:'1.5rem' }}>
          Our <em style={{ fontStyle:'italic', color:'#e8436a' }}>Sky</em>
        </h2>
        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', color:'rgba(255,248,240,.6)', fontSize:'1.05rem' }}>
          Every photo is a star. Click one to relive it.
        </p>
      </div>

      {/* Folder pills */}
      <div style={{ position:'relative', zIndex:20, padding:'0 2rem 1.5rem', display:'flex', flexWrap:'wrap', gap:'.5rem' }}>
        {folders.map(f => (
          <button key={f} onClick={() => setSkyFolder(f)} style={{
            background: activeFolder===f ? 'rgba(232,67,106,.2)' : 'none',
            border: `1px solid ${activeFolder===f ? '#e8436a' : 'rgba(255,255,255,.12)'}`,
            color: activeFolder===f ? '#fff8f0' : 'rgba(255,248,240,.45)',
            fontFamily:"'Cormorant Garamond', serif", fontWeight:300, fontSize:'.72rem',
            letterSpacing:'.2em', textTransform:'uppercase', padding:'.3rem 1rem',
            cursor:'pointer', transition:'all .3s',
          }}>{f}</button>
        ))}
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:5 }} />

      {/* Empty state */}
      {loaded && starsRef.current.length === 0 && (
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          textAlign:'center', zIndex:15, pointerEvents:'none' }}>
          <div style={{ fontSize:'4rem', opacity:.3, marginBottom:'1rem' }}>✦</div>
          <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', color:'rgba(255,248,240,.3)' }}>
            The sky is empty — add memories to the old app
          </p>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          media={lightbox.media}
          idx={lightbox.idx}
          all={folderRef.current === 'All' ? mediaRef.current : mediaRef.current.filter(m => m.folder === folderRef.current)}
          onClose={() => setLightbox(null)}
          onNav={(idx) => {
            const items = folderRef.current === 'All' ? mediaRef.current : mediaRef.current.filter(m => m.folder === folderRef.current)
            setLightbox({ media: items[idx], idx })
          }}
        />
      )}
    </section>
  )
}

function Lightbox({ media, idx, all, onClose, onNav }: {
  media: MemoryMedia; idx: number; all: MemoryMedia[]
  onClose: () => void; onNav: (idx: number) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft')  onNav((idx - 1 + all.length) % all.length)
      if (e.key === 'ArrowRight') onNav((idx + 1) % all.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [idx, all, onClose, onNav])

  let tx0 = 0
  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:5000, display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(10,3,16,.94)', backdropFilter:'blur(22px)', animation:'fadeUp .3s ease' }}
      onTouchStart={e => { tx0 = e.touches[0].clientX }}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - tx0; if(Math.abs(dx)>50) onNav(dx<0?(idx+1)%all.length:(idx-1+all.length)%all.length) }}
    >
      <button onClick={onClose} style={{ position:'fixed', top:'1.5rem', right:'2rem', background:'none',
        border:'1px solid rgba(255,255,255,.15)', color:'rgba(255,248,240,.6)', fontSize:'1.4rem',
        width:44, height:44, cursor:'pointer', zIndex:3, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>

      <button onClick={() => onNav((idx-1+all.length)%all.length)}
        style={{ position:'fixed', left:'1.5rem', top:'50%', transform:'translateY(-50%)', background:'none',
          border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,248,240,.5)', fontSize:'2.5rem',
          width:52, height:52, cursor:'pointer', zIndex:3, display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>

      <div style={{ position:'relative', zIndex:2, maxWidth:'90vw', maxHeight:'85vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        {media.type === 'video'
          ? <video src={media.url} controls autoPlay style={{ maxWidth:'90vw', maxHeight:'85vh', borderRadius:2 }} />
          : <img src={media.url} alt={media.name} style={{ maxWidth:'90vw', maxHeight:'85vh', objectFit:'contain', borderRadius:2, boxShadow:'0 0 80px rgba(0,0,0,.8), 0 0 40px rgba(232,67,106,.1)' }} />
        }
      </div>

      <button onClick={() => onNav((idx+1)%all.length)}
        style={{ position:'fixed', right:'1.5rem', top:'50%', transform:'translateY(-50%)', background:'none',
          border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,248,240,.5)', fontSize:'2.5rem',
          width:52, height:52, cursor:'pointer', zIndex:3, display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>

      <div style={{ position:'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)', textAlign:'center', zIndex:3, pointerEvents:'none' }}>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:'1.1rem', color:'#fff8f0', marginBottom:'.3rem' }}>
          {media.name.replace(/^\d+_\d+_/, '').replace(/\.[^.]+$/, '')}
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'.65rem', letterSpacing:'.35em', color:'#d4a853', opacity:.7 }}>
          {idx+1} · {all.length}
        </div>
      </div>
    </div>
  )
}

function spawnHearts(x: number, y: number) {
  for (let i = 0; i < 8; i++) {
    const h = document.createElement('div')
    h.className = 'float-heart'
    h.textContent = ['♥','💕','🌸','✨'][Math.floor(Math.random()*4)]
    h.style.left = (x+(Math.random()-.5)*80)+'px'
    h.style.top  = (y+(Math.random()-.5)*40)+'px'
    h.style.animationDelay = Math.random()*.3+'s'
    document.body.appendChild(h)
    setTimeout(() => h.remove(), 1400)
  }
}
