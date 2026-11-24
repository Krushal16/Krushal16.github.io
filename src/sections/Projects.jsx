import { useEffect, useRef, useState } from 'react'
import { rooms, projects, projectById, roomById, repoUrl } from '../data/projects.js'
import { profile } from '../data/profile.js'
import { timeAgo } from '../hooks/useGithubRepos.js'
import { useMediaQuery, prefersReducedMotion } from '../hooks/motion.js'
import { Section, StatusBadge } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import ProjectVisual from '../components/ProjectVisual.jsx'

function Door({ room, active, onActivate, onOpen }) {
  const btnRef = useRef(null)
  const [opening, setOpening] = useState(false)
  const list = room.projects.map((id) => projectById[id])
  const count = list.length

  const enter = () => {
    const arch = btnRef.current.querySelector('.door-arch')
    if (prefersReducedMotion()) {
      onOpen(room.id, { origin: null })
      return
    }
    setOpening(true)
    setTimeout(() => {
      onOpen(room.id, { origin: { rect: arch.getBoundingClientRect(), shape: 'door' } })
      setTimeout(() => setOpening(false), 900)
    }, 260)
  }

  return (
    <li
      className={`door-item door--${room.color} ${active || opening ? 'is-active' : ''} ${opening ? 'is-opening' : ''}`}
      onMouseEnter={() => onActivate(room.id)}
    >
      <button
        ref={btnRef}
        type="button"
        data-door={room.id}
        className="door"
        onClick={enter}
        onFocus={() => onActivate(room.id)}
        aria-label={`Enter the ${room.plate} room: ${count} project${count > 1 ? 's' : ''}`}
        aria-describedby={`door-desc-${room.id}`}
      >
        <span className="door-arch">
          <span className="door-glow" />
          <span className="door-leaf">
            <span className="door-panels" />
            <span className="door-plate">{room.plate}</span>
            <span className="door-knob" />
          </span>
        </span>
        <span className="door-floor" />
      </button>

      <div className="door-info" id={`door-desc-${room.id}`}>
        <div className="door-info-inner">
          <p className="text-[22px] font-semibold leading-tight tracking-[-0.025em] text-fog">{room.title}</p>
          <p className="mt-2 text-[14.5px] leading-[1.6] text-ash">{room.blurb}</p>
          <ul className="mt-5 space-y-2.5 border-t border-line pt-4">
            {list.map((p) => (
              <li key={p.id} className="flex items-baseline justify-between gap-4 text-[14.5px]">
                <span className="text-fog">{p.title}</span>
                <span className="shrink-0 text-[13px] text-ash">{p.keyMetric}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="door-caption">
        <p className="text-[15px] font-semibold tracking-[-0.01em] text-fog">{room.plate}</p>
        <p className="mt-1 text-[13px] leading-[1.45] text-ash">{list.map((p) => p.title).join(', ')}</p>
      </div>
    </li>
  )
}

function Doors({ onOpenRoom }) {
  const [active, setActive] = useState(null)
  const wrapRef = useRef(null)
  const cursorRef = useRef(null)
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')

  // "Click to enter" pill that trails the cursor over the doors.
  useEffect(() => {
    if (!fine) return
    const wrap = wrapRef.current
    const pill = cursorRef.current
    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    let frame = 0
    const tick = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      pill.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect()
      tx = e.clientX - r.left + 18
      ty = e.clientY - r.top + 18
      if (!frame) frame = requestAnimationFrame(tick)
    }
    wrap.addEventListener('pointermove', onMove)
    return () => {
      wrap.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [fine])

  return (
    <div ref={wrapRef} className="relative" onMouseLeave={() => setActive(null)}>
      <ul className="doors" aria-label="Project areas">
        {rooms.map((room) => (
          <Door key={room.id} room={room} active={active === room.id} onActivate={setActive} onOpen={onOpenRoom} />
        ))}
      </ul>
      {fine && (
        <span ref={cursorRef} className={`door-cursor ${active ? 'is-visible' : ''}`} aria-hidden="true">
          Click to enter
        </span>
      )}
    </div>
  )
}

function ProjectIndex({ onOpenProject, repos }) {
  const [hover, setHover] = useState(null)
  const listRef = useRef(null)
  const previewRef = useRef(null)
  const fine = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)')

  useEffect(() => {
    if (!fine) return
    const list = listRef.current
    const el = previewRef.current
    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    let frame = 0
    const tick = () => {
      x += (tx - x) * 0.14
      y += (ty - y) * 0.14
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e) => {
      const r = list.getBoundingClientRect()
      tx = Math.min(e.clientX - r.left + 32, r.width - 380)
      ty = e.clientY - r.top - 120
      if (!frame) frame = requestAnimationFrame(tick)
    }
    list.addEventListener('pointermove', onMove)
    return () => {
      list.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [fine])

  const hovered = hover ? projectById[hover] : null

  return (
    <div className="mt-28 md:mt-36">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
        <h3 className="text-[26px] font-semibold tracking-[-0.03em] text-fog">All projects</h3>
        {repos.status === 'ready' ? (
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-underline text-[14px] text-ash hover:text-fog">
            {repos.count} public repositories on GitHub, last push {timeAgo(repos.lastPush)}
          </a>
        ) : (
          <p className="text-[14px] text-ash">{projects.length} projects</p>
        )}
      </div>
      <div ref={listRef} className="relative" onMouseLeave={() => setHover(null)}>
      <ul>
        {projects.map((p) => {
          const room = roomById[p.room]
          const live = repos.byName[p.repo.toLowerCase()]
          return (
            <li key={p.id} className={`index-row door--${room.color}`} onMouseEnter={() => setHover(p.id)}>
              <div className="col-span-2 min-w-0 md:col-span-5">
                <button type="button" className="index-open text-left" onClick={(e) => onOpenProject(p, e.currentTarget.closest('li'))}>
                  <span className="block text-[20px] font-semibold leading-snug tracking-[-0.02em] text-fog md:text-[22px]">{p.title}</span>
                </button>
                <span className="mt-1 block text-[14.5px] text-ash">{p.subtitle}</span>
              </div>
              <p className="hidden items-center gap-2 text-[14px] text-ash md:col-span-2 md:flex">
                <span className="room-dot" aria-hidden="true" />
                {room.plate}
              </p>
              <div className="md:col-span-2">
                {p.status ? (
                  <StatusBadge>{p.status}</StatusBadge>
                ) : (
                  <span className="text-[15px] font-medium text-fog">{p.keyMetric}</span>
                )}
              </div>
              <p className="hidden text-[14px] leading-[1.5] text-ash lg:col-span-2 lg:block">
                {p.stack.slice(0, 3).join(', ')}
                {live?.pushedAt && <span className="block text-[12.5px] text-dim">Updated {timeAgo(live.pushedAt)}</span>}
              </p>
              <div className="relative z-10 flex items-center justify-end gap-1 md:col-span-3 lg:col-span-1">
                <a
                  href={repoUrl(p.repo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.title} on GitHub`}
                  title="View code on GitHub"
                  className="grid size-10 place-items-center rounded-full text-ash transition-colors hover:bg-white/[0.06] hover:text-fog"
                >
                  <Icon name="github" size={18} />
                </a>
                <span className="index-arrow grid size-10 place-items-center rounded-full text-ash" aria-hidden="true">
                  <Icon name="arrowUpRight" size={18} />
                </span>
              </div>
            </li>
          )
        })}
      </ul>
        {fine && (
          <div ref={previewRef} className={`index-preview ${hovered ? 'is-visible' : ''}`} aria-hidden="true">
            {hovered && (
              <div className={`index-preview-card door--${roomById[hovered.room].color}`}>
                <ProjectVisual project={hovered} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Projects({ onOpenRoom, onOpenProject, repos }) {
  return (
    <Section id="projects" label="Projects" className="py-24 md:py-36">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <p className="display-lg lg:col-span-7">Six projects behind four doors.</p>
        <p className="max-w-[40ch] text-[17px] leading-[1.65] text-ash lg:col-span-4 lg:col-start-9">
          Each door is an area I've worked in. Step inside for the details and the code, or skip to the full list below.
        </p>
      </div>
      <div className="mt-16 md:mt-24">
        <Doors onOpenRoom={onOpenRoom} />
      </div>
      <ProjectIndex onOpenProject={onOpenProject} repos={repos} />
    </Section>
  )
}
