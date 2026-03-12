'use client'
import { useEffect, useRef, useState } from 'react'

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)

  // Auto-play on first user interaction (browser policy workaround)
  useEffect(() => {
    setVisible(true)
    const tryPlay = () => {
      const audio = audioRef.current
      if (!audio) return
      audio.play().then(() => {
        setPlaying(true)
        cleanup()
      }).catch(() => {})
    }
    const cleanup = () => {
      window.removeEventListener('click', tryPlay)
      window.removeEventListener('keydown', tryPlay)
      window.removeEventListener('touchstart', tryPlay)
    }
    // Try immediately first (works in some browsers)
    const audio = audioRef.current
    if (audio) {
      audio.play().then(() => setPlaying(true)).catch(() => {
        // Fallback: wait for first interaction
        window.addEventListener('click', tryPlay)
        window.addEventListener('keydown', tryPlay)
        window.addEventListener('touchstart', tryPlay)
      })
    }
    return cleanup
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/music/saiyaara.mp3" loop />
      <button
        onClick={toggle}
        title={playing ? 'Pause Saiyaara' : 'Play Saiyaara ♥'}
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '28px',
          zIndex: 99999,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '2px solid rgba(255,182,193,0.6)',
          background: 'rgba(20,10,30,0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          boxShadow: playing
            ? '0 0 20px 6px rgba(255,105,180,0.55), 0 2px 16px rgba(0,0,0,0.4)'
            : '0 2px 16px rgba(0,0,0,0.35)',
          transition: 'opacity 0.4s ease, box-shadow 0.3s ease, transform 0.2s ease',
          opacity: visible ? 1 : 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {playing ? '🔇' : '🎵'}
      </button>
    </>
  )
}
