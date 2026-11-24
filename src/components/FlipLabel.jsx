import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/motion.js'

/**
 * A spiral-bound flip card that pages through words, like a desk calendar.
 * Decorative: the full sentence is given to screen readers by the parent.
 */
export default function FlipLabel({ words, interval = 2800 }) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(null) // { word, key }
  const [widths, setWidths] = useState([])
  const current = useRef(0)
  const paused = useRef(false)
  const measureRef = useRef(null)

  // Measure every word once fonts are ready, so the card can glide between widths.
  // A ResizeObserver catches the web font swapping in (fonts.ready can resolve before it starts loading).
  useLayoutEffect(() => {
    const nodes = Array.from(measureRef.current?.children ?? [])
    const measure = () => setWidths(nodes.map((n) => Math.ceil(n.offsetWidth)))
    measure()
    const ro = new ResizeObserver(measure)
    nodes.forEach((n) => ro.observe(n))
    return () => ro.disconnect()
  }, [words])

  useEffect(() => {
    const t = setInterval(() => {
      if (paused.current || document.hidden) return
      const prev = current.current
      const next = (prev + 1) % words.length
      current.current = next
      if (!reduced) setLeaving({ word: words[prev], key: Date.now() })
      setIndex(next)
    }, interval)
    return () => clearInterval(t)
  }, [words, interval, reduced])

  const w = widths[index]

  return (
    <span
      className="flip"
      aria-hidden="true"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <span className="flip-rings">
        {Array.from({ length: 11 }, (_, i) => (
          <i key={i} />
        ))}
      </span>
      <span className="flip-stack" style={w ? { width: `${w}px` } : undefined}>
        <span className="flip-page" key={`cur-${index}`}>
          <span className={reduced ? 'flip-fade' : ''}>{words[index]}</span>
        </span>
        {leaving && (
          <span key={leaving.key} className="flip-page is-leaving" onAnimationEnd={() => setLeaving(null)}>
            <span>{leaving.word}</span>
          </span>
        )}
      </span>
      <span ref={measureRef} className="flip-measure">
        {words.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </span>
    </span>
  )
}
