import { useEffect, useState } from 'react'

const TTL = 60 * 60 * 1000 // cache for an hour so visitors don't hit the API rate limit

function readCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { at, data } = JSON.parse(raw)
    return Date.now() - at < TTL ? data : null
  } catch {
    return null
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* storage can be unavailable (private mode, embedded views) */
  }
}

/**
 * Public repositories from the GitHub REST API (no token, read-only).
 * Returns { status: 'loading' | 'ready' | 'error', byName, count, lastPush }.
 * The site works fully without it: static project data is the source of truth.
 */
export function useGithubRepos(user) {
  const [state, setState] = useState({ status: 'loading', byName: {}, count: 0, lastPush: null })

  useEffect(() => {
    const key = `gh-repos:${user}`
    const shape = (list) => {
      const own = list.filter((r) => !r.fork)
      const byName = Object.fromEntries(
        own.map((r) => [
          r.name.toLowerCase(),
          {
            name: r.name,
            url: r.html_url,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
            pushedAt: r.pushed_at,
            homepage: r.homepage,
          },
        ]),
      )
      const lastPush = own.map((r) => r.pushed_at).sort().at(-1) ?? null
      return { status: 'ready', byName, count: own.length, lastPush }
    }

    const cached = readCache(key)
    if (cached) {
      setState(shape(cached))
      return
    }

    const ctrl = new AbortController()
    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: ctrl.signal,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`GitHub API ${res.status}`))))
      .then((list) => {
        const slim = list.map(({ name, html_url, description, language, stargazers_count, pushed_at, homepage, fork }) => ({
          name, html_url, description, language, stargazers_count, pushed_at, homepage, fork,
        }))
        writeCache(key, slim)
        setState(shape(slim))
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setState((s) => ({ ...s, status: 'error' }))
      })
    return () => ctrl.abort()
  }, [user])

  return state
}

/** "3 days ago" style relative time. */
export function timeAgo(iso) {
  if (!iso) return ''
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  for (const [unit, secs] of units) {
    if (s >= secs) return rtf.format(-Math.floor(s / secs), unit)
  }
  return 'just now'
}
