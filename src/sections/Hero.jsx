import { useState } from 'react'
import { profile, asset } from '../data/profile.js'
import EmbeddingField from '../components/EmbeddingField.jsx'
import FlipLabel from '../components/FlipLabel.jsx'
import Icon from '../components/Icon.jsx'
import { Button, IconLink } from '../components/ui.jsx'
import { useResumeAvailable } from '../hooks/useResume.js'

function Portrait() {
  const [failed, setFailed] = useState(false)
  const showPhoto = profile.photo && !failed
  return (
    <figure className="portrait">
      <div className="portrait-frame reveal-clip" style={{ '--d': 3 }}>
        <div className="portrait-monogram" aria-hidden={showPhoto ? 'true' : undefined}>
          <span>{profile.firstName[0]}</span>
          <span>{profile.lastName[0]}</span>
        </div>
        {showPhoto && (
          <img
            src={asset(profile.photo)}
            alt={`Portrait of ${profile.name}`}
            className="portrait-img"
            width="800"
            height="1000"
            fetchPriority="high"
            onError={() => setFailed(true)}
          />
        )}
        {!showPhoto && <span className="sr-only">Monogram of {profile.name}</span>}
      </div>
      <figcaption className="status-card reveal-up" style={{ '--d': 8 }}>
        <span className="pulse-dot" aria-hidden="true" />
        <span>
          <span className="block text-[14px] font-medium text-fog">{profile.availability.short}</span>
          <span className="block text-[13px] text-ash">{profile.availability.dates}</span>
        </span>
      </figcaption>
    </figure>
  )
}

export default function Hero() {
  const hasResume = useResumeAvailable()
  const words = profile.focus
  const sentence = `I build intelligent solutions with ${words.slice(0, -1).join(', ')} and ${words.at(-1)}.`

  return (
    <section id="home" aria-label="Introduction" className="hero relative isolate overflow-hidden">
      <EmbeddingField className="absolute inset-0 -z-10 h-full w-full" />
      <div className="hero-vignette" aria-hidden="true" />

      <div className="container-x flex min-h-[100svh] flex-col pt-[72px]">
        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-7">
            <h1 className="display-hero">
              <span className="mask">
                <span className="reveal-up" style={{ '--d': 0 }}>Hi, I'm {profile.firstName}</span>
              </span>
              <span className="mask">
                <span className="reveal-up" style={{ '--d': 1 }}>{profile.lastName}.</span>
              </span>
            </h1>

            <p className="hero-lead reveal-up" style={{ '--d': 2 }}>
              <span aria-hidden="true">I build intelligent solutions with</span>
              <FlipLabel words={words} />
              <span className="sr-only">{sentence}</span>
            </p>

            <p className="mt-7 max-w-[34rem] text-[17px] leading-[1.65] text-ash sm:text-[18px] reveal-up" style={{ '--d': 3 }}>
              AI/ML postgraduate student at Lambton College in Ottawa. I take projects end to end, from raw data to
              evaluated models to a demo people can actually use.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3 reveal-up" style={{ '--d': 4 }}>
              <Button href="#projects" iconRight="arrowDown">
                View my projects
              </Button>
              {hasResume && (
                <Button href={asset(profile.resume)} variant="secondary" icon="download" download={profile.resumeDownloadName}>
                  Download resume
                </Button>
              )}
              <span className="ml-1 flex items-center">
                <IconLink href={profile.github} icon="github" label="GitHub profile" size={20} />
                <IconLink href={profile.linkedin} icon="linkedin" label="LinkedIn profile" size={19} />
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pl-6 xl:pl-14">
            <Portrait />
          </div>
        </div>

        <div className="hero-strip reveal-up" style={{ '--d': 6 }}>
          <p className="flex items-center gap-2.5">
            <span className="pulse-dot" aria-hidden="true" />
            Available for a Winter 2027 co-op
          </p>
          <p className="hidden items-center gap-2 md:flex">
            <Icon name="pin" size={15} />
            Based in Ottawa, open to remote and hybrid roles
          </p>
          <a href="#about" className="group hidden items-center gap-2 transition-colors hover:text-fog sm:flex">
            Scroll to explore
            <Icon name="arrowDown" size={15} className="scroll-cue" />
          </a>
        </div>
      </div>
    </section>
  )
}
