import { useCallback, useEffect, useRef, useState } from 'react'
import { roomById } from '../data/projects.js'

// Rooms live at #/work/<room>[/<project>] so they work with the back button,
// can be shared as links, and need no server rewrites on GitHub Pages.
function parse() {
  const m = window.location.hash.match(/^#\/work\/([\w-]+)(?:\/([\w-]+))?/)
  if (!m || !roomById[m[1]]) return { roomId: null, projectId: null }
  return { roomId: m[1], projectId: m[2] ?? null }
}

// Some embedded/sandboxed views refuse history changes; the room still opens, just without a URL.
function setHash(method, hash) {
  try {
    window.history[method](null, '', hash)
    return true
  } catch {
    return false
  }
}

export function useRoomRoute() {
  const [state, setState] = useState(() => ({ ...parse(), origin: null }))
  const pushed = useRef(false)

  useEffect(() => {
    const sync = () => {
      const next = parse()
      if (!next.roomId) pushed.current = false
      setState((s) =>
        s.roomId === next.roomId && s.projectId === next.projectId ? s : { ...next, origin: null },
      )
    }
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  /** origin: { rect, shape: 'door' | 'rect', el } – where the zoom transition starts. */
  const open = useCallback((roomId, { projectId = null, origin = null } = {}) => {
    const hash = `#/work/${roomId}${projectId ? `/${projectId}` : ''}`
    if (parse().roomId) {
      setHash('replaceState', hash)
    } else {
      pushed.current = setHash('pushState', hash)
    }
    setState({ roomId, projectId, origin })
  }, [])

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false
      window.history.back() // popstate clears the room
    } else {
      setHash('replaceState', '#projects')
      setState({ roomId: null, projectId: null, origin: null })
    }
  }, [])

  return { ...state, open, close }
}
