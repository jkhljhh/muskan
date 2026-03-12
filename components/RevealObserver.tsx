'use client'
import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal, .s-heading, .section-label').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return null
}
