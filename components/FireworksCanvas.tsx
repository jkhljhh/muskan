'use client'
import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  r: number; color: string; alpha: number; decay: number
}

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const parts = useRef<Particle[]>([])

  const launch = useCallback((n = 1) => {
    const cv = canvasRef.current; if (!cv) return
    const colors = ['#e8436a','#f7c5d0','#d4a853','#fff','#ff8fab','#ffccd5']
    for (let i = 0; i < n; i++) {
      const x = Math.random() * cv.width
      const y = Math.random() * cv.height * 0.55
      const c = colors[Math.floor(Math.random() * colors.length)]
      for (let j = 0; j < 70; j++) {
        const a = Math.random() * Math.PI * 2
        const s = 2 + Math.random() * 8
        parts.current.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s - 2,
          r: .5 + Math.random()*3.5, color: c, alpha: 1, decay: .012+Math.random()*.025 })
      }
    }
  }, [])

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d')!
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    let raf: number
    const draw = () => {
      raf = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, cv.width, cv.height)
      parts.current = parts.current.filter(p => p.alpha > .02)
      parts.current.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += .1; p.vx *= .98; p.vy *= .98
        p.alpha -= p.decay
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill()
      })
      ctx.globalAlpha = 1
    }
    draw()

    // expose globally so other components can trigger
    ;(window as any).__launchFireworks = launch

    setTimeout(() => launch(5), 1600)
    setTimeout(() => launch(4), 3600)

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [launch])

  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:100 }} />
}
