import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/motion.js'

// Four soft clusters of points, coloured like the four project doors:
// a quiet nod to an embedding space. Pauses when off-screen or in a hidden tab.
const CLUSTERS = [
  { x: 0.56, y: 0.22, color: [124, 140, 236] }, // indigo – LLMs & RAG
  { x: 0.94, y: 0.34, color: [190, 140, 214] }, // plum – NLP
  { x: 0.58, y: 0.8, color: [108, 196, 182] }, // teal – ML
  { x: 0.92, y: 0.84, color: [224, 150, 116] }, // rust – Data & BI
]

function gaussian() {
  let u = 0
  let v = 0
  while (!u) u = Math.random()
  while (!v) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export default function EmbeddingField({ className = '', density = 48 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = prefersReducedMotion()
    let w = 0
    let h = 0
    let frame = 0
    let running = false
    let visible = true
    const mouse = { x: -9999, y: -9999 }

    const points = CLUSTERS.flatMap((c, ci) =>
      Array.from({ length: density }, () => ({
        c: ci,
        ox: gaussian() * 0.045,
        oy: gaussian() * 0.06,
        r: 0.9 + Math.random() * 1.9,
        a: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.12 + Math.random() * 0.22,
        orbit: 3 + Math.random() * 9,
        dx: 0,
        dy: 0,
      })),
    )

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!running) draw(0)
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      const narrow = w < 768
      const time = t / 1000
      for (const p of points) {
        const c = CLUSTERS[p.c]
        // On small screens the clusters drift toward the top so they sit behind the portrait/title less.
        const cx = (narrow ? c.x * 0.95 : c.x) * w
        const cy = (narrow ? 0.5 + c.y * 0.45 : c.y) * h
        let x = cx + p.ox * w * (narrow ? 1.6 : 1) + Math.cos(time * p.speed + p.phase) * p.orbit
        let y = cy + p.oy * h + Math.sin(time * p.speed * 0.8 + p.phase) * p.orbit
        // Soft repulsion from the cursor.
        const mx = x - mouse.x
        const my = y - mouse.y
        const d2 = mx * mx + my * my
        const R = 130
        let tx = 0
        let ty = 0
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1
          const f = (1 - d / R) * 26
          tx = (mx / d) * f
          ty = (my / d) * f
        }
        p.dx += (tx - p.dx) * 0.08
        p.dy += (ty - p.dy) * 0.08
        x += p.dx
        y += p.dy
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c.color[0]},${c.color[1]},${c.color[2]},${p.a})`
        ctx.fill()
      }
    }

    const loop = (t) => {
      draw(t)
      frame = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || reduced || !visible || document.hidden) return
      running = true
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const onVis = () => (document.hidden ? stop() : start())

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      visible ? start() : stop()
    })
    io.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    resize()
    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [density])

  return <canvas ref={canvasRef} className={`embedding-field ${className}`} aria-hidden="true" />
}
