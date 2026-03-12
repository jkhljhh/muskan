'use client'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const Cursor        = dynamic(() => import('@/components/Cursor'),        { ssr: false })
const Petals        = dynamic(() => import('@/components/Petals'),        { ssr: false })
const FireworksCanvas = dynamic(() => import('@/components/FireworksCanvas'), { ssr: false })
const Hero          = dynamic(() => import('@/components/Hero'),          { ssr: false })
const SkyMemories   = dynamic(() => import('@/components/SkyMemories'),   { ssr: false })
const ReasonsSection = dynamic(() => import('@/components/ReasonsSection'), { ssr: false })
const LetterSection = dynamic(() => import('@/components/LetterSection'), { ssr: false })
const HeartSection  = dynamic(() => import('@/components/HeartSection'),  { ssr: false })
const TimelineSection = dynamic(() => import('@/components/TimelineSection'), { ssr: false })
const PromiseSection = dynamic(() => import('@/components/PromiseSection'), { ssr: false })
const FinaleSection = dynamic(() => import('@/components/FinaleSection'), { ssr: false })
const NavBar        = dynamic(() => import('@/components/NavBar'),        { ssr: false })
const RevealObserver = dynamic(() => import('@/components/RevealObserver'), { ssr: false })
const UploadSection  = dynamic(() => import('@/components/UploadSection'),  { ssr: false })

export default function Home() {
  useEffect(() => {
    // Smooth scroll with Lenis
    let lenis: any
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    })
    return () => lenis?.destroy()
  }, [])

  return (
    <>
      <Cursor />
      <Petals />
      <FireworksCanvas />
      <NavBar />
      <RevealObserver />
      <UploadSection />
      <main>
        <Hero />
        <SkyMemories />
        <ReasonsSection />
        <LetterSection />
        <HeartSection />
        <TimelineSection />
        <PromiseSection />
        <FinaleSection />
      </main>
    </>
  )
}
