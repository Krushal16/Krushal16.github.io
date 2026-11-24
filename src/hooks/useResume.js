import { useEffect, useState } from 'react'
import { profile, asset } from '../data/profile.js'

let check // one request shared by every resume button

/**
 * True once public/resume.pdf is confirmed to exist. Resume buttons stay hidden until then,
 * so the live site never shows a link that 404s. Add the file and the buttons appear on their own.
 */
export function useResumeAvailable() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    if (!profile.resume) return
    check ??= fetch(asset(profile.resume), { method: 'HEAD', cache: 'no-store' })
      .then((r) => r.ok && /pdf|octet-stream/i.test(r.headers.get('content-type') || ''))
      .catch(() => false)
    let alive = true
    check.then((v) => alive && setOk(v))
    return () => {
      alive = false
    }
  }, [])
  return ok
}
