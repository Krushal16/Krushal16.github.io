import { useCallback } from 'react'
import { profile } from './data/profile.js'
import { useGithubRepos } from './hooks/useGithubRepos.js'
import { useRoomRoute } from './hooks/useRoomRoute.js'
import { prefersReducedMotion } from './hooks/motion.js'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import ProjectRoom from './components/ProjectRoom.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import Experience from './sections/Experience.jsx'
import Projects from './sections/Projects.jsx'
import Skills from './sections/Skills.jsx'
import Contact from './sections/Contact.jsx'

export default function App() {
  const repos = useGithubRepos(profile.githubUser)
  const route = useRoomRoute()
  const { open } = route

  // Open a project's room from anywhere (index rows, skills, timeline), growing out of the clicked element.
  const openProject = useCallback(
    (project, el) => {
      const rect = el?.getBoundingClientRect()
      open(project.room, {
        projectId: project.id,
        origin: rect && !prefersReducedMotion() ? { rect, shape: 'rect' } : null,
      })
    },
    [open],
  )

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Experience onOpenProject={openProject} />
        <Projects onOpenRoom={open} onOpenProject={openProject} repos={repos} />
        <Skills onOpenProject={openProject} />
        <Contact />
      </main>
      <Footer />
      <ProjectRoom route={route} repos={repos} />
    </>
  )
}
