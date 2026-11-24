import { useRef, useState } from 'react'
import { profile, asset } from '../data/profile.js'
import { journey } from '../data/experience.js'
import { useScrollProgressVar } from '../hooks/motion.js'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'
import { useResumeAvailable } from '../hooks/useResume.js'

function Journey() {
  const ref = useRef(null)
  useScrollProgressVar(ref, { start: 0.85, end: 0.6 })
  return (
    <div ref={ref} className="journey">
      <h3 className="text-[15px] font-medium text-ash">The road so far</h3>
      <ol className="journey-track mt-10">
        {journey.map((j, i) => (
          <li key={j.years} className={`journey-stop ${j.open ? 'is-open' : ''}`} style={{ '--i': i, '--n': journey.length }}>
            <span className="journey-node" aria-hidden="true" />
            <p className="text-[14px] tabular-nums text-ash">{j.years}</p>
            <p className="mt-2 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-fog">{j.title}</p>
            <p className={`mt-1 text-[15px] ${j.open ? 'text-signal-soft' : 'text-ash'}`}>{j.place}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Contact() {
  const hasResume = useResumeAvailable()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  const a = profile.availability

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-24 pb-16 pt-12 md:pb-24">
      <div className="container-x">
        <Journey />

        <div className="contact-card mt-20 md:mt-28">
          <p className="flex items-center gap-2.5 text-[14px] text-ash">
            <span className="pulse-dot" aria-hidden="true" />
            {a.short}, {a.dates}
          </p>
          <h2 id="contact-title" className="display-contact mt-8">
            <span className="block">Have an interesting project in mind?</span>
            <span className="block text-ash">Let's build something intelligent together.</span>
          </h2>
          <p className="mt-8 max-w-[56ch] text-[17px] leading-[1.7] text-ash md:text-[18px]">
            I'm looking for co-op roles in {a.roles}. {a.where.charAt(0).toUpperCase() + a.where.slice(1)}. The best way to
            reach me is email.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href={`mailto:${profile.email}?subject=${encodeURIComponent('Co-op opportunity')}`} icon="mail">
              Email me
            </Button>
            <Button variant="secondary" icon={copied ? 'check' : 'copy'} onClick={copy} aria-live="polite">
              {copied ? 'Email copied' : 'Copy email address'}
            </Button>
            {hasResume && (
              <Button href={asset(profile.resume)} variant="secondary" icon="download" download={profile.resumeDownloadName}>
                Download resume
              </Button>
            )}
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            <a href={`mailto:${profile.email}`} className="contact-link">
              <Icon name="mail" size={20} />
              <span className="min-w-0">
                <span className="block text-[13px] text-ash">Email</span>
                <span className="block truncate text-[15px] text-fog">{profile.email}</span>
              </span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
              <Icon name="linkedin" size={19} />
              <span>
                <span className="block text-[13px] text-ash">LinkedIn</span>
                <span className="block text-[15px] text-fog">in/krushal-sardhara</span>
              </span>
              <Icon name="arrowUpRight" size={16} className="ml-auto text-ash" />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-link">
              <Icon name="github" size={19} />
              <span>
                <span className="block text-[13px] text-ash">GitHub</span>
                <span className="block text-[15px] text-fog">{profile.githubUser}</span>
              </span>
              <Icon name="arrowUpRight" size={16} className="ml-auto text-ash" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
