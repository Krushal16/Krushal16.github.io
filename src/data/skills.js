// Each skill lists where it was used: project ids (open the project) and/or plain-text context.
export const skillGroups = [
  {
    name: 'Programming',
    skills: [
      { name: 'Python', projects: ['covid-rag', 'news-classifier', 'jobshield', 'uber-lyft'], context: ['AI/ML internship at Exosoft'] },
      { name: 'SQL', projects: ['airport-db'] },
      { name: 'JavaScript', projects: ['airport-db'], context: ['MongoDB queries and CRUD written in mongosh'] },
    ],
  },
  {
    name: 'Machine learning',
    skills: [
      { name: 'scikit-learn', projects: ['news-classifier', 'uber-lyft', 'jobshield'] },
      { name: 'Regression', projects: ['uber-lyft'], context: ['AI/ML internship at Exosoft'] },
      { name: 'Classification', projects: ['news-classifier', 'jobshield'], context: ['AI/ML internship at Exosoft'] },
      { name: 'Model evaluation', projects: ['news-classifier', 'uber-lyft', 'covid-rag', 'jobshield'], context: ['Macro-F1, PR-AUC, cross-validation and error analysis'] },
    ],
  },
  {
    name: 'AI & NLP',
    skills: [
      { name: 'NLP', projects: ['news-classifier', 'jobshield', 'covid-rag'], context: ['NLP lead on LocalPulse (sentiment and aspect-level analysis)'] },
      { name: 'LLMs', projects: ['covid-rag'], context: ['Llama 3.3 70B through Databricks'] },
      { name: 'Generative AI', projects: ['covid-rag'] },
      { name: 'LangChain', projects: ['covid-rag'] },
      { name: 'FAISS', projects: ['covid-rag'] },
      { name: 'Sentence Transformers', projects: ['covid-rag'] },
    ],
  },
  {
    name: 'Data analytics',
    skills: [
      { name: 'pandas', projects: ['uber-lyft', 'covid-rag'], context: ['AI/ML internship at Exosoft'] },
      { name: 'NumPy', context: ['AI/ML internship at Exosoft'] },
      { name: 'Matplotlib', context: ['AI/ML internship at Exosoft'] },
      { name: 'Power BI', projects: ['retail-powerbi'] },
      { name: 'DAX', projects: ['retail-powerbi'] },
    ],
  },
  {
    name: 'Platforms & tools',
    skills: [
      { name: 'Databricks', projects: ['covid-rag'] },
      { name: 'MLflow', projects: ['covid-rag'] },
      { name: 'Streamlit', projects: ['news-classifier', 'jobshield'] },
      { name: 'MongoDB', projects: ['airport-db'] },
      { name: 'Git', context: ['Branch-per-task workflow with reviewed pull requests on team projects'] },
      { name: 'GitHub', context: ['All six featured projects are public on GitHub'] },
    ],
  },
]

export const allSkills = skillGroups.flatMap((g) => g.skills.map((s) => ({ ...s, group: g.name })))
