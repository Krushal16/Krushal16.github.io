import { useState } from 'react'
import { skillGroups, allSkills } from '../data/skills.js'
import { projectById, roomById } from '../data/projects.js'
import { Section } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'

function Evidence({ skill, onOpenProject, className = '' }) {
  const items = skill.projects ?? []
  return (
    <div className={`evidence ${className}`} aria-live="polite">
      <p className="text-[14px] text-ash">Where I've used it</p>
      <p className="mt-2 text-[40px] font-semibold leading-none tracking-[-0.04em] text-fog md:text-[52px]" key={skill.name}>
        <span className="evidence-name">{skill.name}</span>
      </p>
      <ul className="mt-7 space-y-2">
        {items.map((id) => {
          const p = projectById[id]
          const room = roomById[p.room]
          return (
            <li key={id}>
              <button
                type="button"
                onClick={(e) => onOpenProject(p, e.currentTarget)}
                className={`evidence-row door--${room.color}`}
              >
                <span className="flex items-center gap-3">
                  <span className="room-dot" aria-hidden="true" />
                  <span className="text-[16px] text-fog">{p.title}</span>
                </span>
                <Icon name="arrowUpRight" size={16} className="shrink-0 text-ash" />
              </button>
            </li>
          )
        })}
        {(skill.context ?? []).map((c) => (
          <li key={c} className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] text-ash">
            <span className="size-1.5 shrink-0 rounded-full bg-ash/60" aria-hidden="true" />
            {c}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Skills({ onOpenProject }) {
  const [selected, setSelected] = useState(allSkills[0].name)
  const [preview, setPreview] = useState(null)
  const current = allSkills.find((s) => s.name === (preview ?? selected))
  const selectedGroup = allSkills.find((s) => s.name === selected)?.group

  return (
    <Section id="skills" label="Skills" className="py-24 md:py-36">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <p className="display-lg lg:col-span-8">Tools I've used, and where I used them.</p>
        <p className="max-w-[38ch] text-[17px] leading-[1.65] text-ash lg:col-span-4">
          Pick a skill to see the projects behind it. Only tools from my own work are listed here.
        </p>
      </div>

      <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-7" onMouseLeave={() => setPreview(null)}>
          {skillGroups.map((g) => (
            <div key={g.name} className="border-t border-line py-7 first:border-t-0 first:pt-0 md:grid md:grid-cols-[180px_1fr] md:gap-6">
              <h3 className="mb-4 text-[15px] font-medium text-fog md:mb-0 md:pt-2">{g.name}</h3>
              <div>
                <ul className="flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <li key={s.name}>
                      <button
                        type="button"
                        aria-pressed={selected === s.name}
                        onClick={() => setSelected(s.name)}
                        onMouseEnter={() => setPreview(s.name)}
                        onFocus={() => setPreview(s.name)}
                        onBlur={() => setPreview(null)}
                        className={`skill-chip ${selected === s.name ? 'is-selected' : ''} ${preview === s.name ? 'is-preview' : ''}`}
                      >
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
                {selectedGroup === g.name && (
                  <Evidence skill={allSkills.find((s) => s.name === selected)} onOpenProject={onOpenProject} className="mt-6 lg:hidden" />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-28">
            <Evidence skill={current} onOpenProject={onOpenProject} />
          </div>
        </div>
      </div>
    </Section>
  )
}
