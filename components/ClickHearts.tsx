'use client'
import { useEffect } from 'react'

export default function ClickHearts() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const h = document.createElement('div')
      h.className = 'float-heart'
      h.textContent = ['♥','💕','✨'][Math.floor(Math.random()*3)]
      h.style.left = e.clientX+'px'
      h.style.top  = e.clientY+'px'
      h.style.zIndex = '9990'
      document.body.appendChild(h)
      setTimeout(() => h.remove(), 1300)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}
