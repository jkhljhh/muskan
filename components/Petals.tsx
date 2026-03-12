'use client'
import { useEffect } from 'react'

const PETALS = ['🌸','🌺','❤️','🌹','✨','💕']

export default function Petals() {
  useEffect(() => {
    const els: HTMLDivElement[] = []
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('div')
      p.className = 'petal'
      p.textContent = PETALS[Math.floor(Math.random() * PETALS.length)]
      p.style.cssText = `--l:${Math.random()*100}%;--fs:${12+Math.random()*18}px;--fd:${7+Math.random()*10}s;--delay:${Math.random()*14}s`
      document.body.appendChild(p)
      els.push(p)
    }
    return () => els.forEach(e => e.remove())
  }, [])
  return null
}
