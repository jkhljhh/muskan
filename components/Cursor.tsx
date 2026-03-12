'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot  = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ax = window.innerWidth / 2, ay = window.innerHeight / 2
    const onMove = (e: MouseEvent) => {
      if (dot.current)  { dot.current.style.left  = e.clientX + 'px'; dot.current.style.top  = e.clientY + 'px' }
      ax += (e.clientX - ax) * .12
      ay += (e.clientY - ay) * .12
    }
    let raf: number
    const loop = () => {
      if (ring.current) { ring.current.style.left = ax + 'px'; ring.current.style.top = ay + 'px' }
      ax += (parseFloat(dot.current?.style.left || '0') - ax) * .12
      ay += (parseFloat(dot.current?.style.top  || '0') - ay) * .12
      raf = requestAnimationFrame(loop)
    }
    document.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    const hover = () => document.body.classList.add('cursor-hover')
    const unhov = () => document.body.classList.remove('cursor-hover')
    document.querySelectorAll('button, a, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', hover)
      el.addEventListener('mouseleave', unhov)
    })
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div id="cursor" ref={dot} />
      <div id="cursor-ring" ref={ring} />
    </>
  )
}
