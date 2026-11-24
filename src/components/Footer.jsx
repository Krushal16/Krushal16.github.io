import { profile } from '../data/profile.js'
import Icon from './Icon.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-6 py-10 text-[14px] text-ash md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. {profile.location}.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-fog">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-fog">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="link-underline hover:text-fog">
            Email
          </a>
          <a href="#home" className="inline-flex items-center gap-1.5 hover:text-fog">
            Back to top
            <Icon name="arrowDown" size={14} className="rotate-180" />
          </a>
        </div>
      </div>
    </footer>
  )
}
