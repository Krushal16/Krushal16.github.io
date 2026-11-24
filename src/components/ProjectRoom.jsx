import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { rooms, roomById, projectById, repoUrl } from '../data/projects.js'
import { timeAgo } from '../hooks/useGithubRepos.js'
import { useReducedMotion } from '../hooks/motion.js'
import Icon from './Icon.jsx'
import ProjectVisual from './ProjectVisual.jsx'
import { Button, Chip, StatusBadge } from './ui.jsx'

const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function lockScroll() {
  const html = document.documentElement
  html.dataset.prevOverflow = html.style.overflow
  html.style.overflow = 'hidden'
}
function unlockScroll() {
  const html = document.documentElement
  html.style.overflow = html.dataset.prevOverflow || ''
  delete html.dataset.prevOverflow
}

function insetFor(rect, shape) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const top = rect.top
  const right = vw - rect.right
  const bottom = vh - rect.bottom
  const left = rect.left
  const r = shape === 'door' ? rect.width / 2 : 18
  const rb = shape === 'door' ? 6 : 18
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${r}px ${r}px ${rb}px ${rb}px)`
}
const FULL = 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)'

export function MonitorFrame({ children, className = '' }) {
  return (
    <div className={`monitor ${className}`}>
      <div className="monitor-screen">{children}</div>
      <div className="monitor-neck" aria-hidden="true" />
      <div className="monitor-base" aria-hidden="true" />
    </div>
  )
}

function Lightbox({ shots, index, onClose, onIndex }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (index != null && !d.open) d.showModal()
    if (index == null && d.open) d.close()
  }, [index])
  const shot = index != null ? shots[index] : null
  return (
    <dialog
      ref={ref}
      className="lightbox"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      onKeyDown={(e) => {
        if (shots.length < 2) return
        if (e.key === 'ArrowRight') onIndex((index + 1) % shots.length)
        if (e.key === 'ArrowLeft') onIndex((index - 1 + shots.length) % shots.length)
      }}
      aria-label="Image from the repository"
    >
      {shot && (
        <figure className="flex max-h-full flex-col">
          <img src={shot.src} alt={shot.alt} className="max-h-[78vh] w-auto rounded-xl bg-white object-contain" />
          <figcaption className="mt-4 flex items-center justify-between gap-6 text-[14px] text-ash">
            <span>{shot.alt}</span>
            <span className="flex shrink-0 items-center gap-2">
              {shots.length > 1 && (
                <>
                  <button type="button" className="lightbox-btn" aria-label="Previous image" onClick={() => onIndex((index - 1 + shots.length) % shots.length)}>
                    <Icon name="arrowLeft" size={16} />
                  </button>
                  <button type="button" className="lightbox-btn" aria-label="Next image" onClick={() => onIndex((index + 1) % shots.length)}>
                    <Icon name="arrowRight" size={16} />
                  </button>
                </>
              )}
              <button type="button" className="lightbox-btn" aria-label="Close image" onClick={onClose}>
                <Icon name="close" size={16} />
              </button>
            </span>
          </figcaption>
        </figure>
      )}
    </dialog>
  )
}

function Shots({ project }) {
  const [broken, setBroken] = useState({})
  const [open, setOpen] = useState(null)
  const shots = project.shots.filter((s) => !broken[s.src])
  if (!shots.length) return null
  return (
    <div className="mt-8">
      <p className="text-[14px] text-ash">From the repository</p>
      <ul className="mt-3 grid grid-cols-3 gap-3">
        {shots.map((s, i) => (
          <li key={s.src}>
            <button type="button" className="shot" onClick={() => setOpen(i)} aria-label={`Enlarge: ${s.alt}`}>
              <img
                src={s.src}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setBroken((b) => ({ ...b, [s.src]: true }))}
              />
              <span className="shot-icon" aria-hidden="true">
                <Icon name="expand" size={14} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox shots={shots} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </div>
  )
}

function RoomProject({ project: p, live }) {
  return (
    <article id={`room-project-${p.id}`} className="room-project" aria-labelledby={`rp-${p.id}`}>
      <div className="grid gap-12 xl:grid-cols-12 xl:gap-16">
        <div className="xl:col-span-5">
          <div className="flex flex-wrap items-center gap-2">
            {p.status && <StatusBadge>{p.status}</StatusBadge>}
            <Chip>{p.team}</Chip>
            <Chip>{p.date}</Chip>
          </div>
          <h3 id={`rp-${p.id}`} className="mt-6 text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-fog md:text-[44px]">
            {p.title}
          </h3>
          <p className="mt-2 text-[19px] text-ash">{p.subtitle}</p>
          <p className="mt-6 text-[17px] leading-[1.7] text-fog/85">{p.summary}</p>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-6">
            {p.metrics.map((m) => (
              <div key={m.label}>
                <dt className="sr-only">{m.label}</dt>
                <dd className="text-[24px] font-semibold leading-none tracking-[-0.03em] text-fog md:text-[28px]">{m.value}</dd>
                <dd className="mt-2 text-[13px] leading-[1.4] text-ash">{m.label}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 space-y-3.5">
            {p.highlights.map((h) => (
              <li key={h} className="bullet text-[16px] leading-[1.6] text-ash">
                {h}
              </li>
            ))}
          </ul>

          {p.myPart && (
            <div className="mt-8 rounded-2xl border border-line bg-white/[0.02] p-5">
              <p className="text-[14px] font-medium text-fog">My part</p>
              <p className="mt-1.5 text-[15px] leading-[1.6] text-ash">{p.myPart}</p>
            </div>
          )}

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
            {p.stack.map((s) => (
              <li key={s}>
                <Chip>{s}</Chip>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={repoUrl(p.repo)} icon="github" external>
              View code on GitHub
            </Button>
            {p.demo && (
              <Button href={p.demo} variant="secondary" icon="play" external>
                Open live demo
              </Button>
            )}
            {p.links.map((l) => (
              <Button key={l.href} href={l.href} variant="small" icon="file" external>
                {l.label}
              </Button>
            ))}
          </div>
          {live && (
            <p className="mt-5 text-[13px] text-dim">
              {live.language ? `${live.language}, updated` : 'Updated'} {timeAgo(live.pushedAt)} on GitHub
              {live.stars > 0 && `, ${live.stars} star${live.stars > 1 ? 's' : ''}`}
            </p>
          )}
        </div>

        <div className="xl:col-span-7">
          <div className="xl:sticky xl:top-28">
            <MonitorFrame>
              <ProjectVisual project={p} />
            </MonitorFrame>
            <Shots project={p} />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ProjectRoom({ route, repos }) {
  const { roomId, projectId, origin, open, close } = route
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(null)
  const [phase, setPhase] = useState('closed') // entering | open | leaving | closed
  const [revealed, setRevealed] = useState(false) // content visible (kept in state so re-renders don't drop it)
  const rootRef = useRef(null)
  const flashRef = useRef(null)
  const headingRef = useRef(null)
  const openerRef = useRef(null)

  // Follow the route.
  useEffect(() => {
    if (roomId) {
      if (!shown || phase === 'leaving' || phase === 'closed') {
        openerRef.current = document.activeElement
        setShown({ roomId, projectId, origin })
        setPhase('entering')
      } else if (shown.roomId !== roomId || shown.projectId !== projectId) {
        setShown({ roomId, projectId, origin: null, swap: Date.now() })
      }
    } else if (shown && phase !== 'leaving' && phase !== 'closed') {
      setPhase('leaving')
    }
  }, [roomId, projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToProject = (id, smooth) => {
    const root = rootRef.current
    if (!root) return
    const el = id && root.querySelector(`#room-project-${id}`)
    const top = el ? el.offsetTop - 100 : 0
    root.scrollTo({ top, behavior: smooth && !reduced ? 'smooth' : 'auto' })
  }

  // Enter: grow out of the door (or the clicked element), then reveal the content.
  useLayoutEffect(() => {
    if (phase !== 'entering' || !shown) return
    const root = rootRef.current
    lockScroll()
    setRevealed(false)
    scrollToProject(shown.projectId, false)
    const o = shown.origin
    let anim
    if (o && !reduced) {
      anim = root.animate([{ clipPath: insetFor(o.rect, o.shape) }, { clipPath: FULL }], { duration: 850, easing: EASE })
      flashRef.current.animate([{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: 1250, easing: 'ease-out', fill: 'forwards' })
    } else {
      flashRef.current.style.opacity = '0'
      anim = root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? 1 : 320, easing: 'ease-out' })
    }
    const t = setTimeout(() => setRevealed(true), o && !reduced ? 470 : 30)
    anim.onfinish = () => setPhase('open')
    return () => clearTimeout(t)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === 'open') headingRef.current?.focus({ preventScroll: true })
  }, [phase])

  // Switching rooms in place (next door) or deep-linking to another project.
  useEffect(() => {
    if (shown?.swap && phase === 'open') {
      scrollToProject(shown.projectId, false)
      headingRef.current?.focus({ preventScroll: true })
    }
  }, [shown?.swap]) // eslint-disable-line react-hooks/exhaustive-deps

  // Leave: fade the content, then shrink back into the door if it's on screen.
  useLayoutEffect(() => {
    if (phase !== 'leaving' || !shown) return
    const root = rootRef.current
    setRevealed(false)
    const door = document.querySelector(`[data-door="${shown.roomId}"] .door-arch`)
    const rect = door?.getBoundingClientRect()
    const onScreen = rect && rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0
    let anim
    if (!reduced && onScreen && shown.origin?.shape === 'door') {
      flashRef.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 120, easing: 'ease-in', fill: 'forwards' })
      anim = root.animate([{ clipPath: FULL }, { clipPath: insetFor(rect, 'door') }], { duration: 700, delay: 120, easing: EASE, fill: 'forwards' })
    } else {
      anim = root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduced ? 1 : 280, easing: 'ease-in', fill: 'forwards' })
    }
    anim.onfinish = () => {
      unlockScroll()
      setShown(null)
      setPhase('closed')
      const opener = openerRef.current
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true })
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => unlockScroll(), [])

  if (!shown) return null

  const room = roomById[shown.roomId]
  const idx = rooms.findIndex((r) => r.id === room.id)
  const next = rooms[(idx + 1) % rooms.length]
  const list = room.projects.map((id) => projectById[id])

  const onKeyDown = (e) => {
    if (e.target.closest?.('dialog')) return
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
    if (e.key === 'Tab') {
      const items = Array.from(rootRef.current.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null && !el.closest('dialog'))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const goNext = () => open(next.id)

  return (
    <div
      ref={rootRef}
      className={`room door--${room.color} ${revealed ? 'is-in' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-title"
      onKeyDown={onKeyDown}
    >
      <div ref={flashRef} className="room-flash" aria-hidden="true" />
      <div className="room-glow" aria-hidden="true" />

      <div className="room-bar">
        <div className="container-x flex h-[72px] items-center justify-between gap-4">
          <button type="button" onClick={close} className="room-back">
            <Icon name="arrowLeft" size={16} />
            Back to the doors
          </button>
          <p className="hidden text-[13px] tabular-nums text-ash sm:block" aria-hidden="true">
            Room {idx + 1} of {rooms.length}
          </p>
          <button type="button" onClick={goNext} className="room-back">
            <span className="hidden sm:inline">Next door:</span> {next.plate}
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </div>

      <div className="room-content" key={room.id}>
        <div className="container-x">
          <header className="room-header grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-2.5 text-[15px] text-ash">
                <span className="room-dot" aria-hidden="true" />
                {room.plate}, {list.length} project{list.length > 1 ? 's' : ''}
              </p>
              <h2 id="room-title" ref={headingRef} tabIndex={-1} className="display-lg mt-5 max-w-[16ch] outline-none">
                {room.title}
              </h2>
              <p className="mt-6 max-w-[52ch] text-[18px] leading-[1.65] text-ash">{room.blurb}</p>
            </div>
            <nav aria-label="Projects in this room" className="lg:col-span-4 lg:col-start-9">
              <p className="text-[14px] text-ash">In this room</p>
              <ul className="mt-3 border-t border-line">
                {list.map((p) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => scrollToProject(p.id, true)} className="room-toc">
                      <span className="flex-1 text-left text-[16px] text-fog">{p.title}</span>
                      <span className="text-[13px] text-ash">{p.keyMetric}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          {list.map((p) => (
            <RoomProject key={p.id} project={p} live={repos.byName[p.repo.toLowerCase()]} />
          ))}

          <footer className="room-footer">
            <button type="button" onClick={goNext} className={`next-door door--${next.color}`}>
              <span className="text-[15px] text-ash">Next door</span>
              <span className="mt-2 flex items-center gap-4 text-[clamp(34px,5vw,72px)] font-semibold leading-none tracking-[-0.045em] text-fog">
                {next.title}
                <Icon name="arrowRight" size={40} strokeWidth={1.5} className="next-door-arrow shrink-0" />
              </span>
            </button>
            <button type="button" onClick={close} className="room-back mt-10">
              <Icon name="door" size={17} />
              Back to the doors
            </button>
          </footer>
        </div>
      </div>
    </div>
  )
}
