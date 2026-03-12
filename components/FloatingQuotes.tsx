'use client'
import { useEffect, useState, useCallback } from 'react'

const QUOTES = [
  { text: "You are my favorite notification 🔔", },
  { text: "Every love song reminds me of you 🎵" },
  { text: "You make my heart do stupid things 💓" },
  { text: "I choose you. Every single day 🌅" },
  { text: "Home is wherever you are 🏡" },
  { text: "You're my person ✨" },
  { text: "I fall for you more every day 🍂" },
  { text: "You had me at hello 💬" },
  { text: "My heart smiles when I think of you 😊" },
  { text: "You're the reason I believe in magic 🪄" },
  { text: "Forever isn't long enough with you ♾️" },
  { text: "You are my happy place 🌸" },
  { text: "I love you more than words can say 💌" },
  { text: "You complete me in every way 🧩" },
  { text: "My world is better because of you 🌍" },
  { text: "You are enough. Always 🤍" },
  { text: "Thank you for existing 🌟" },
  { text: "You make ordinary moments magical ✨" },
  { text: "I'm lucky the universe brought us together 🌌" },
  { text: "You are my sunshine on cloudy days ☀️" },
]

interface QuoteItem {
  id: number
  text: string
  x: number
  size: number
  duration: number
  delay: number
  opacity: number
}

let idCounter = 0

export default function FloatingQuotes() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([])

  const spawnQuote = useCallback(() => {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
    const id = idCounter++
    const size = Math.random() * 4 + 13 // 13px – 17px
    const duration = Math.random() * 6 + 10 // 10s – 16s
    const x = Math.random() * 80 + 5 // 5% – 85% from left

    setQuotes(prev => [
      ...prev,
      { id, text: quote.text, x, size, duration, delay: 0, opacity: 1 },
    ])

    // Remove after animation completes
    setTimeout(() => {
      setQuotes(prev => prev.filter(q => q.id !== id))
    }, duration * 1000 + 500)
  }, [])

  useEffect(() => {
    // Spawn first one quickly
    const first = setTimeout(spawnQuote, 800)

    // Then keep spawning every 3–5 seconds
    const interval = setInterval(() => {
      spawnQuote()
    }, Math.random() * 2000 + 3000)

    return () => {
      clearTimeout(first)
      clearInterval(interval)
    }
  }, [spawnQuote])

  // Re-randomize interval
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const schedule = () => {
      timeout = setTimeout(() => {
        spawnQuote()
        schedule()
      }, Math.random() * 2500 + 3000)
    }
    schedule()
    return () => clearTimeout(timeout)
  }, [spawnQuote])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9000,
        overflow: 'hidden',
      }}
    >
      {quotes.map(q => (
        <div
          key={q.id}
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: `${q.x}%`,
            fontSize: `${q.size}px`,
            fontWeight: 700,
            color: '#ffffff',
            textShadow: '0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(255,182,193,0.7), 0 2px 8px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.02em',
            fontFamily: 'Georgia, serif',
            animation: `floatUp ${q.duration}s ease-in-out forwards`,
            willChange: 'transform, opacity',
          }}
        >
          {q.text}
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0)   scale(0.85); opacity: 0; }
          8%   { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(-105vh) scale(1.05); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
