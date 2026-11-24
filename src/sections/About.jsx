import { useRef } from 'react'
import { useScrollProgressVar } from '../hooks/motion.js'
import { Section } from '../components/ui.jsx'

const STATEMENT =
  "I study artificial intelligence and machine learning at Lambton College in Ottawa. Before that, I spent a year as an AI/ML intern in Surat, India, cleaning data and testing regression and classification models. Now I build projects end to end, and I judge models by more than their accuracy."

const PRINCIPLES = [
  {
    title: 'End to end',
    body: 'Data cleaning, modelling, evaluation, then something people can use. The news classifier runs as a live Streamlit app; the RAG assistant answers with citations.',
  },
  {
    title: 'Evaluation beyond accuracy',
    body: 'F1, PR-AUC, cross-validation and error analysis. In the news classifier, error analysis traced 43% of mistakes to one confusable pair: Business and Sci/Tech.',
  },
  {
    title: 'Language and LLMs',
    body: 'Most of my recent work is NLP: retrieval with page-level citations, text classification, and now aspect-level sentiment for LocalPulse, a team dashboard where I lead the NLP.',
  },
]

export default function About() {
  const textRef = useRef(null)
  useScrollProgressVar(textRef, { start: 0.9, end: 0.55 })
  const words = STATEMENT.split(' ')

  return (
    <Section id="about" label="About" className="py-24 md:py-36">
      <div className="grid gap-y-16 lg:grid-cols-12">
        <p
          ref={textRef}
          className="statement lg:col-span-11"
          style={{ '--n': words.length }}
        >
          {words.map((word, i) => (
            <span key={i} className="statement-word" style={{ '--i': i }}>
              {word}{' '}
            </span>
          ))}
        </p>

        <ul className="grid gap-10 border-t border-line pt-12 md:grid-cols-3 md:gap-8 lg:col-span-12">
          {PRINCIPLES.map((p) => (
            <li key={p.title}>
              <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-fog">{p.title}</h3>
              <p className="mt-3 max-w-[36ch] text-[16px] leading-[1.65] text-ash">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
