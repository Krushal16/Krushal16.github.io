// Personal details used across the site. Edit this file to update your info.
// Files referenced here (resume, photo) live in the /public folder.

export const profile = {
  name: 'Krushal Sardhara',
  firstName: 'Krushal',
  lastName: 'Sardhara',
  headline: 'AI/ML postgraduate student at Lambton College',
  tagline: 'Building intelligent solutions through AI & machine learning.',
  location: 'Ottawa, Ontario, Canada',
  city: 'Ottawa',
  timeZone: 'America/Toronto',
  email: 'krushalsardhara1608@gmail.com',
  githubUser: 'Krushal16',
  github: 'https://github.com/Krushal16',
  linkedin: 'https://www.linkedin.com/in/krushal-sardhara/',

  // Put your resume at public/resume.pdf (the build warns if it's missing).
  resume: 'resume.pdf',
  resumeDownloadName: 'Krushal_Sardhara_Resume.pdf',

  // Optional portrait: add public/profile.jpg (4:5, at least 800×1000), then set photo: 'profile.jpg'.
  // While this is null the hero shows a monogram instead.
  photo: null,

  availability: {
    short: 'Open to a Winter 2027 co-op',
    dates: 'January to April 2027',
    roles: 'machine learning, NLP/LLMs and data science',
    where: 'Ottawa, Toronto, or remote/hybrid across Canada',
  },

  // Rotating words in the hero ("I build intelligent solutions with …")
  focus: ['machine learning', 'NLP & LLMs', 'generative AI', 'data science'],
}

// Resolve a file in /public against Vite's base path (works on GitHub Pages sub-paths).
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`
