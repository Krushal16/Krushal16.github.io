// Timeline, newest first ("Let's go back in time").
export const timeline = [
  {
    id: 'coop',
    year: '2027',
    range: 'January to April 2027',
    kind: 'Next',
    title: 'Co-op in machine learning, NLP/LLMs or data science',
    org: 'Your team?',
    body: [
      "January to April 2027 is my program's co-op term. I'm looking for a role in Ottawa, Toronto, or remote/hybrid anywhere in Canada.",
    ],
    cta: true,
  },
  {
    id: 'lambton',
    year: '2025',
    range: 'September 2025 to May 2027',
    kind: 'Education',
    title: 'Post Graduation Diploma, Artificial Intelligence & Machine Learning (Co-op)',
    org: 'Lambton College, Ontario',
    body: [
      'Course and capstone projects across LLMs, NLP, machine learning and data. Currently studying neural networks and deep learning, and cloud computing.',
      'Leading the NLP work (sentiment and aspect-level analysis) on LocalPulse, a team social-listening dashboard for Ottawa businesses.',
    ],
    projects: ['covid-rag', 'news-classifier', 'jobshield', 'uber-lyft', 'retail-powerbi', 'airport-db'],
  },
  {
    id: 'exosoft',
    year: '2024',
    range: 'June 2024 to June 2025',
    kind: 'Experience',
    title: 'AI/ML Intern',
    org: 'Exosoft IT Solutions, Surat, India',
    body: [],
    bullets: [
      'Collected, cleaned and validated data from Excel, CSV and database sources with Python, pandas and NumPy',
      'Helped build and test regression and classification models, and reported their performance',
      'Visualized trends and model results with Matplotlib',
      'Documented experiments so the team could reproduce and compare them',
    ],
  },
  {
    id: 'bca',
    year: '2021',
    range: 'August 2021 to April 2024',
    kind: 'Education',
    title: 'Bachelor of Computer Applications (BCA)',
    org: 'Bhagwan Mahavir University, Surat, India',
    body: ['Undergraduate degree in computer applications.'],
  },
]

// The short "road so far" strip above the contact section.
export const journey = [
  { years: '2021–2024', title: 'Bachelor of Computer Applications', place: 'Bhagwan Mahavir University' },
  { years: '2024–2025', title: 'AI/ML internship', place: 'Exosoft IT Solutions' },
  { years: '2025–2027', title: 'AI/ML postgraduate studies', place: 'Lambton College' },
  { years: 'Winter 2027', title: 'Co-op', place: 'Your team?', open: true },
]
