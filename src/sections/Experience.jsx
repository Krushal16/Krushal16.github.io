import { useEffect, useRef, useState } from 'react'
import { timeline } from '../data/experience.js'
import { projectById } from '../data/projects.js'
import { Section } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

/** Rolling digits: each column is a strip 0–9 that slides to the current digit. */
function Odometer({ value }) {
  return (
    <span className="odometer" aria-hidden="true">
      {value.split('').map((ch, i) => {
        const d = Number(ch)
        return (
          <span key={i} className="odometer-col">
            <span className="odometer-strip" style={{ transform: `translateY(${-d * 10}%)` }}>
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}

export default function Experience({ onOpenProject }) {
  const [active, setActive] = useState(0)
  const itemRefs = useRef([])

  useEffect(() => {
    const els = itemRefs.current.filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index))
        })
      },
      { rootMargin: '-38% 0px -58% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const item = timeline[active]
  const total = timeline.length

  return (
    <Section id="experience" label="Experience & education" className="py-24 md:py-36">
      <div className="grid gap-x-8 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="display-md max-w-[12ch]">Let's go back in time.</p>
            <div className="time-panel mt-10 hidden lg:block" aria-hidden="true">
              <Odometer value={item.year} />
              <p className="mt-4 text-[15px] text-ash">{item.range}</p>
              <div className="mt-8 flex items-center gap-4 text-[13px] tabular-nums text-ash">
                <span className="text-fog">{String(active + 1).padStart(2, '0')}</span>
                <span className="relative h-px w-40 bg-line">
                  <span
                    className="absolute inset-y-0 left-0 bg-fog transition-[width] duration-700 ease-out-expo"
                    style={{ width: `${((active + 1) / total) * 100}%` }}
                  />
                </span>
                <span>{String(total).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>

        <ol className="timeline lg:col-span-7">
          {timeline.map((t, i) => (
            <li
              key={t.id}
              ref={(el) => (itemRefs.current[i] = el)}
              data-index={i}
              className={`timeline-item ${active === i ? 'is-active' : ''}`}
            >
              <span className="timeline-node" aria-hidden="true" />
              <p className="text-[56px] font-semibold leading-none tracking-[-0.05em] text-fog lg:hidden" aria-hidden="true">
                {t.year}
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-ash lg:mt-0">
                <span className={`rounded-full border px-2.5 py-0.5 text-[12.5px] ${t.kind === 'Next' ? 'border-signal/40 text-signal-soft' : 'border-line text-ash'}`}>
                  {t.kind}
                </span>
                <span>{t.range}</span>
              </p>
              <h3 className="mt-5 max-w-[30ch] text-[26px] font-semibold leading-[1.2] tracking-[-0.025em] text-fog md:text-[30px]">
                {t.title}
              </h3>
              <p className="mt-2 text-[17px] text-ash">{t.org}</p>

              {t.body.map((para) => (
                <p key={para} className="mt-5 max-w-[60ch] text-[16.5px] leading-[1.7] text-ash">
                  {para}
                </p>
              ))}

              {t.bullets && (
                <ul className="mt-6 space-y-3">
                  {t.bullets.map((b) => (
                    <li key={b} className="bullet max-w-[60ch] text-[16.5px] leading-[1.6] text-ash">
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {t.projects && (
                <div className="mt-7">
                  <p className="text-[14px] text-ash">Projects from this program</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {t.projects.map((id) => {
                      const p = projectById[id]
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={(e) => onOpenProject(p, e.currentTarget)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.02] px-3.5 py-1.5 text-[14px] text-fog/90 transition-colors duration-300 hover:border-fog/40 hover:bg-white/[0.06]"
                          >
                            {p.title}
                            <Icon name="arrowUpRight" size={14} className="text-ash" />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {t.cta && (
                <a href="#contact" className="link-underline mt-6 inline-flex items-center gap-2 text-[16px] font-medium text-fog">
                  Get in touch
                  <Icon name="arrowRight" size={16} />
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
