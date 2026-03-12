'use client'
import { useEffect, useRef, useState } from 'react'
import { sb } from '@/lib/supabase'

interface QueueItem {
  file: File
  status: 'waiting' | 'uploading' | 'done' | 'error'
  progress: number
}

const PRESET_FOLDERS = ['Dates', 'Travel', 'Selfies', 'Special Days', 'Together', 'Us', 'Mumbai']

export default function UploadSection() {
  const [isOpen, setIsOpen]         = useState(false)
  const [folders, setFolders]       = useState<string[]>(PRESET_FOLDERS)
  const [selFolder, setSelFolder]   = useState('All')
  const [newFolder, setNewFolder]   = useState('')
  const [queue, setQueue]           = useState<QueueItem[]>([])
  const [uploading, setUploading]   = useState(false)
  const [totalPct, setTotalPct]     = useState(0)
  const [dragOver, setDragOver]     = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load existing folders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('muskan_folders')
    if (saved) {
      try { setFolders(JSON.parse(saved)) } catch {}
    }
  }, [])

  const saveFolders = (f: string[]) => {
    setFolders(f)
    localStorage.setItem('muskan_folders', JSON.stringify(f))
  }

  const addFolder = () => {
    const nm = newFolder.trim()
    if (!nm || folders.includes(nm)) return
    saveFolders([...folders, nm])
    setNewFolder('')
    setSelFolder(nm)
  }

  const handleFiles = (files: FileList | File[]) => {
    const arr = Array.from(files)
    setQueue(arr.map(f => ({ file: f, status: 'waiting', progress: 0 })))
  }

  const sanitize = (name: string) =>
    name.replace(/ /g, '_').replace(/[()]/g, '').replace(/[^a-zA-Z0-9._\-]/g, '')

  const uploadAll = async () => {
    if (!queue.length || uploading) return
    setUploading(true)
    let done = 0

    for (let i = 0; i < queue.length; i++) {
      setQueue(q => q.map((it, idx) => idx === i ? { ...it, status: 'uploading' } : it))

      const f = queue[i].file
      const folder = selFolder === 'All' ? '' : selFolder + '/'
      const path   = folder + Date.now() + '_' + i + '_' + sanitize(f.name)

      const { error } = await sb.storage.from('memories').upload(path, f, { upsert: true })

      done++
      setTotalPct(Math.round((done / queue.length) * 100))
      setQueue(q => q.map((it, idx) =>
        idx === i ? { ...it, status: error ? 'error' : 'done', progress: 100 } : it
      ))
    }

    setUploading(false)
    // trigger sky reload if available
    ;(window as any).__reloadSky?.()

    setTimeout(() => {
      setQueue([])
      setTotalPct(0)
      setIsOpen(false)
    }, 2000)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 8000,
          width: 58, height: 58, borderRadius: '50%',
          background: 'linear-gradient(135deg, #e8436a, #d4a853)',
          border: 'none', cursor: 'pointer', fontSize: '1.5rem',
          boxShadow: '0 0 30px rgba(232,67,106,.5), 0 8px 32px rgba(0,0,0,.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform .2s, box-shadow .2s',
        }}
        onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.12)' }}
        onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)' }}
        title="Add memories"
        data-hover
      >
        ✦
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 8000,
      background: 'rgba(10,3,16,.92)', backdropFilter: 'blur(24px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'fadeUp .3s ease',
    }}>
      <div style={{
        width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto',
        background: 'linear-gradient(160deg, rgba(107,26,46,.25), rgba(26,10,16,.8))',
        border: '1px solid rgba(232,67,106,.22)',
        padding: '2.5rem 2rem', position: 'relative',
      }}>
        {/* Corner ornaments */}
        <div style={{ position:'absolute', top:-1, left:-1, width:32, height:32, borderTop:'2px solid #d4a853', borderLeft:'2px solid #d4a853' }} />
        <div style={{ position:'absolute', bottom:-1, right:-1, width:32, height:32, borderBottom:'2px solid #d4a853', borderRight:'2px solid #d4a853' }} />

        {/* Close */}
        <button onClick={() => { setIsOpen(false); setQueue([]) }} style={{
          position:'absolute', top:'1rem', right:'1.2rem',
          background:'none', border:'none', color:'rgba(255,248,240,.4)',
          fontSize:'1.4rem', cursor:'pointer', transition:'color .2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color='#e8436a')}
          onMouseLeave={e => (e.currentTarget.style.color='rgba(255,248,240,.4)')}
        >✕</button>

        <div style={{ fontFamily:"'Dancing Script', cursive", fontSize:'1.1rem', color:'#d4a853', letterSpacing:'.2em', marginBottom:'.5rem' }}>
          — add to the sky —
        </div>
        <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.8rem', fontWeight:700,
          background:'linear-gradient(90deg,#fff,#f7c5d0,#e8436a)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          marginBottom:'1.8rem' }}>
          New Memories
        </h3>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          style={{
            border: `1px dashed ${dragOver ? '#e8436a' : 'rgba(232,67,106,.35)'}`,
            borderRadius: 2, padding: '2.5rem 1rem', textAlign: 'center',
            cursor: 'pointer', marginBottom: '1.5rem',
            background: dragOver ? 'rgba(232,67,106,.08)' : 'rgba(232,67,106,.03)',
            transition: 'all .25s',
          }}
          data-hover
        >
          <div style={{ fontSize:'2.5rem', marginBottom:'.5rem',
            filter:'drop-shadow(0 0 16px rgba(232,67,106,.5))' }}>✦</div>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic',
            color:'rgba(255,248,240,.6)', fontSize:'1rem', lineHeight:1.7 }}>
            drop photos & videos here<br />
            <span style={{ color:'#d4a853', fontSize:'.85rem' }}>or click to choose</span>
          </div>
        </div>
        <input
          ref={fileInputRef} type="file" multiple accept="image/*,video/*"
          style={{ display:'none' }}
          onChange={e => { if(e.target.files) handleFiles(e.target.files) }}
        />

        {/* Constellation picker */}
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={{ fontSize:'.68rem', letterSpacing:'.3em', textTransform:'uppercase',
            color:'rgba(255,248,240,.35)', marginBottom:'.7rem' }}>
            Place in constellation:
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'.8rem' }}>
            {['All', ...folders].map(f => (
              <button key={f} onClick={() => setSelFolder(f)} style={{
                background: selFolder===f ? 'rgba(232,67,106,.2)' : 'none',
                border: `1px solid ${selFolder===f ? '#e8436a' : 'rgba(255,255,255,.1)'}`,
                color: selFolder===f ? '#fff8f0' : 'rgba(255,248,240,.45)',
                fontFamily:"'Cormorant Garamond', serif", fontSize:'.72rem',
                letterSpacing:'.18em', textTransform:'uppercase', padding:'.28rem .85rem',
                cursor:'pointer', transition:'all .25s', borderRadius:1,
              }}>{f}</button>
            ))}
          </div>
          {/* New folder */}
          <div style={{ display:'flex', gap:'.6rem', alignItems:'center' }}>
            <input
              value={newFolder}
              onChange={e => setNewFolder(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addFolder()}
              placeholder="or name a new one…"
              style={{
                flex:1, background:'none', border:'none',
                borderBottom:'1px solid rgba(255,255,255,.1)',
                color:'#fff8f0', fontFamily:"'Cormorant Garamond', serif",
                fontStyle:'italic', fontSize:'.95rem', padding:'.3rem 0', outline:'none',
              }}
            />
            <button onClick={addFolder} style={{
              background:'none', border:'1px solid rgba(255,255,255,.12)',
              color:'rgba(255,248,240,.55)', fontFamily:"'Cormorant Garamond', serif",
              fontSize:'.65rem', letterSpacing:'.2em', textTransform:'uppercase',
              padding:'.35rem .9rem', cursor:'pointer', transition:'all .25s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor='#e8436a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,.12)')}
            >create</button>
          </div>
        </div>

        {/* Queue */}
        {queue.length > 0 && (
          <div style={{ marginBottom:'1.5rem' }}>
            <div style={{ fontSize:'.68rem', letterSpacing:'.3em', textTransform:'uppercase',
              color:'rgba(255,248,240,.35)', marginBottom:'.6rem' }}>
              {queue.length} file{queue.length!==1?'s':''} selected
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.4rem', maxHeight:200, overflowY:'auto' }}>
              {queue.map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'.8rem',
                  padding:'.5rem 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                  <div style={{ flex:1, fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic',
                    fontSize:'.88rem', color:'rgba(255,248,240,.65)',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {item.file.name}
                  </div>
                  <div style={{
                    fontSize:'.65rem', letterSpacing:'.15em',
                    color: item.status==='done' ? '#d4a853' : item.status==='error' ? '#e8436a' : 'rgba(255,248,240,.3)'
                  }}>
                    {item.status==='waiting' ? 'ready' : item.status==='uploading' ? 'uploading…' : item.status==='done' ? '✦ done' : '✕ failed'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress bar */}
        {uploading && (
          <div style={{ marginBottom:'1.2rem' }}>
            <div style={{ height:2, background:'rgba(255,255,255,.06)', borderRadius:1, overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:1,
                background:'linear-gradient(90deg, #e8436a, #d4a853)',
                width: totalPct+'%', transition:'width .3s',
              }} />
            </div>
            <div style={{ fontSize:'.65rem', letterSpacing:'.2em', color:'#d4a853', marginTop:'.4rem', textAlign:'right' }}>
              {totalPct}%
            </div>
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={uploadAll}
          disabled={!queue.length || uploading}
          style={{
            width:'100%', padding:'1rem',
            background: queue.length && !uploading ? 'none' : 'rgba(255,255,255,.03)',
            border: `1px solid ${queue.length && !uploading ? 'rgba(232,67,106,.5)' : 'rgba(255,255,255,.08)'}`,
            color: queue.length && !uploading ? '#e8436a' : 'rgba(255,248,240,.25)',
            fontFamily:"'Cormorant Garamond', serif", fontSize:'.8rem',
            letterSpacing:'.35em', textTransform:'uppercase',
            cursor: queue.length && !uploading ? 'pointer' : 'default',
            transition:'all .35s',
          }}
          onMouseEnter={e => { if(queue.length && !uploading) { e.currentTarget.style.background='#e8436a'; e.currentTarget.style.color='#fff' } }}
          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color=queue.length&&!uploading?'#e8436a':'rgba(255,248,240,.25)' }}
        >
          {uploading ? 'uploading…' : `add ${queue.length||''} star${queue.length!==1?'s':''} to the sky ✦`}
        </button>
      </div>
    </div>
  )
}
