import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile, asset } from '../data/profile.js'
import { useActiveSection } from '../hooks/motion.js'
import { useResumeAvailable } from '../hooks/useResume.js'
import Icon from './Icon.jsx'
import { IconLink } from './ui.jsx'

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

function LocalClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: profile.timeZone })
      .format(new Date())
      .replace(/\./g, '')
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const t = setInterval(() => setTime(fmt()), 20_000)
    return () => clearInterval(t)
  }, [])
  return (
    <p className="hidden items-center gap-2 text-[13px] text-ash 2xl:flex" aria-label={`Local time in ${profile.city}: ${time}`}>
      <span className="size-1.5 rounded-full bg-emerald-400/80" aria-hidden="true" />
      <span aria-hidden="true">
        {profile.city} <span className="tabular-nums text-fog/90">{time}</span>
      </span>
    </p>
  )
}

export default function Nav() {
  const active = useActiveSection(NAV.map((n) => n.id))
  const hasResume = useResumeAvailable()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const listRef = useRef(null)
  const pillRef = useRef(null)
  const progressRef = useRef(null)
  const menuBtnRef = useRef(null)

  // Scroll state + reading progress hairline (no re-render per frame).
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      setScrolled(y > 24)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Sliding pill behind the active link.
  useLayoutEffect(() => {
    const place = () => {
      const list = listRef.current
      const pill = pillRef.current
      const link = list?.querySelector(`[data-id="${active}"]`)
      if (!list || !pill || !link) return
      pill.style.width = `${link.offsetWidth}px`
      pill.style.transform = `translateX(${link.offsetLeft}px)`
      pill.style.opacity = '1'
    }
    place()
    const ro = new ResizeObserver(place) // re-measure when the web font swaps in or the window resizes
    if (listRef.current) ro.observe(listRef.current)
    return () => ro.disconnect()
  }, [active])

  // Mobile menu: lock scroll, close on Escape, return focus.
  useEffect(() => {
    if (!menuOpen) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      html.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      menuBtnRef.current?.focus()
    }
  }, [menuOpen])

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || menuOpen ? 'border-b border-line bg-ink/75 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <a href="#home" className="group relative z-10 flex items-baseline gap-1.5 text-[17px] font-semibold tracking-[-0.02em]" aria-label={`${profile.name}, back to top`}>
          <span>{profile.firstName}</span>
          <span className="font-normal text-ash transition-colors duration-300 group-hover:text-fog">{profile.lastName}</span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul ref={listRef} className="relative flex items-center rounded-full border border-line bg-white/[0.02] p-1">
            <span
              ref={pillRef}
              aria-hidden="true"
              className="absolute left-0 top-1 h-[calc(100%-8px)] rounded-full bg-white/[0.08] opacity-0 transition-[transform,width] duration-500 ease-out-expo"
            />
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-id={n.id}
                  aria-current={active === n.id ? 'location' : undefined}
                  className={`relative block rounded-full px-4 py-2 text-[14px] transition-colors duration-300 ${
                    active === n.id ? 'text-fog' : 'text-ash hover:text-fog'
                  }`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative z-10 flex items-center gap-1 sm:gap-2">
          <LocalClock />
          <div className="hidden items-center sm:flex">
            <IconLink href={profile.github} icon="github" label="GitHub profile" />
            <IconLink href={profile.linkedin} icon="linkedin" label="LinkedIn profile" />
          </div>
          {hasResume && (
            <a
              href={asset(profile.resume)}
              download={profile.resumeDownloadName}
              className="hidden h-10 items-center gap-2 rounded-full bg-fog px-4 text-[14px] font-medium text-ink transition-colors duration-300 hover:bg-white sm:inline-flex"
            >
              <Icon name="download" size={16} />
              Resume
            </a>
          )}
          <button
            ref={menuBtnRef}
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line text-fog lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={18} />
          </button>
        </div>
      </div>
      <span
        ref={progressRef}
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-signal/0 via-signal to-signal-soft"
      />
    </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu fixed inset-x-0 bottom-0 top-[72px] z-40 bg-ink lg:hidden ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav aria-label="Mobile" className="container-x flex h-full flex-col justify-between pb-10 pt-8">
          <ul className="space-y-1">
            {NAV.map((n, i) => (
              <li key={n.id} style={{ '--i': i }}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`mobile-menu-link flex items-center justify-between border-b border-line py-4 text-[34px] font-semibold tracking-[-0.035em] ${
                    active === n.id ? 'text-fog' : 'text-ash'
                  }`}
                >
                  {n.label}
                  {active === n.id && <span className="size-2 rounded-full bg-signal" aria-hidden="true" />}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            {hasResume && (
              <a href={asset(profile.resume)} download={profile.resumeDownloadName} className="inline-flex h-12 items-center gap-2 rounded-full bg-fog px-6 font-medium text-ink">
                <Icon name="download" size={17} /> Download resume
              </a>
            )}
            <IconLink href={profile.github} icon="github" label="GitHub profile" className="border border-line" />
            <IconLink href={profile.linkedin} icon="linkedin" label="LinkedIn profile" className="border border-line" />
          </div>
        </nav>
      </div>
    </>
  )
}
