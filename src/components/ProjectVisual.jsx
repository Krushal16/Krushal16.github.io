import { useId } from 'react'

// Data-driven previews drawn from each README's reported numbers (not screenshots).
// Real images from the repositories are shown separately in the project room.

const T = { fontFamily: 'inherit' }

function Box({ x, y, w, h, title, sub, tone = 'base' }) {
  const stroke = tone === 'accent' ? 'var(--accent)' : tone === 'dim' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.16)'
  const fill = tone === 'accent' ? 'color-mix(in oklab, var(--accent) 14%, transparent)' : 'rgba(255,255,255,0.03)'
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={fill} stroke={stroke} />
      <text x={x + 14} y={y + (sub ? 22 : h / 2 + 5)} fontSize="14" fontWeight="600" fill="#EDEDEA" style={T}>
        {title}
      </text>
      {sub && (
        <text x={x + 14} y={y + 40} fontSize="11.5" fill="#9496A1" style={T}>
          {sub}
        </text>
      )}
    </g>
  )
}

function Arrow({ d, accent, id }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={accent ? 'var(--accent)' : 'rgba(255,255,255,0.28)'}
      strokeWidth="1.4"
      markerEnd={accent ? `url(#${id}-a)` : `url(#${id}-b)`}
      className="viz-flow"
    />
  )
}

function Defs({ id }) {
  return (
    <defs>
      <marker id={`${id}-b`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0l10 5-10 5z" fill="rgba(255,255,255,0.4)" />
      </marker>
      <marker id={`${id}-a`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0l10 5-10 5z" fill="var(--accent)" />
      </marker>
    </defs>
  )
}

function Header({ left, right }) {
  return (
    <g>
      <text x="24" y="34" fontSize="12" fill="#9496A1" style={T}>
        {left}
      </text>
      {right && (
        <text x="616" y="34" fontSize="12" fill="#9496A1" textAnchor="end" style={T}>
          {right}
        </text>
      )}
      <line x1="24" x2="616" y1="50" y2="50" stroke="rgba(255,255,255,0.08)" />
    </g>
  )
}

function Rag() {
  const id = 'v' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <>
      <Defs id={id} />
      <Header left="covid19-rag-assistant / 04_rag_chain.py" right="Databricks" />
      <text x="24" y="82" fontSize="13" fill="var(--accent)" style={{ ...T, fontWeight: 500 }}>
        chat("What are common symptoms of COVID-19?")
      </text>
      <Box x={24} y={104} w={118} h={54} title="PDF pages" sub="Delta table" />
      <Box x={162} y={104} w={160} h={54} title="Chunks" sub="800 chars, 150 overlap" />
      <Box x={342} y={104} w={138} h={54} title="Embeddings" sub="MiniLM, 384-d" />
      <Box x={500} y={104} w={116} h={54} title="FAISS" sub="top 4 chunks" />
      <Arrow id={id} d="M142 131h16" />
      <Arrow id={id} d="M322 131h16" />
      <Arrow id={id} d="M480 131h16" />
      <Arrow id={id} d="M558 158v26q0 18-18 18H426" />
      <Box x={214} y={182} w={208} h={54} title="Context quality gate" sub="chunks, length, L2 distance, overlap" />
      <Arrow id={id} d="M280 236v22q0 14-14 14h-80q-14 0-14 14v6" accent />
      <Arrow id={id} d="M356 236v22q0 14 14 14h80q14 0 14 14v6" />
      <Box x={60} y={296} w={232} h={58} title="Llama 3.3 70B" sub="answer with source file and page" tone="accent" />
      <Box x={348} y={296} w={232} h={58} title="Wikipedia fallback" sub="when the documents fall short" tone="dim" />
      <text x="24" y="384" fontSize="11.5" fill="#5F616B" style={T}>
        Route accuracy and latency tracked in MLflow
      </text>
    </>
  )
}

function Bars({ rows, max = 1, ticks = [0, 0.25, 0.5, 0.75, 1], x0 = 170, x1 = 560, y0 = 132, gap = 52, fmt = (v) => v.toFixed(3) }) {
  const scale = (v) => x0 + ((x1 - x0) * v) / max
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={scale(t)} x2={scale(t)} y1={y0 - 18} y2={y0 + gap * rows.length - 24} stroke="rgba(255,255,255,0.06)" />
          <text x={scale(t)} y={y0 + gap * rows.length - 6} fontSize="11" fill="#5F616B" textAnchor="middle" style={T}>
            {t}
          </text>
        </g>
      ))}
      {rows.map((r, i) => {
        const y = y0 + i * gap
        return (
          <g key={r.label}>
            <text x={x0 - 14} y={y + 5} fontSize="13" fill={r.hi ? '#EDEDEA' : '#9496A1'} textAnchor="end" style={T}>
              {r.label}
            </text>
            <rect x={x0} y={y - 9} width={scale(r.value) - x0} height="18" rx="4" fill={r.hi ? 'var(--accent)' : 'rgba(255,255,255,0.16)'} className="viz-bar" style={{ '--delay': `${i * 90}ms` }} />
            <text x={scale(r.value) + 10} y={y + 5} fontSize="13" fontWeight="600" fill={r.hi ? '#EDEDEA' : '#9496A1'} style={T}>
              {fmt(r.value)}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function F1() {
  return (
    <>
      <Header left="Intelligent-News-Classifier / reports" right="TF-IDF + LinearSVC" />
      <text x="24" y="92" fontSize="30" fontWeight="600" fill="#EDEDEA" style={{ ...T, letterSpacing: '-0.03em' }}>
        90.17%
      </text>
      <text x="152" y="92" fontSize="13" fill="#9496A1" style={T}>
        test accuracy, F1 per class on 7,600 articles
      </text>
      <Bars
        y0={142}
        rows={[
          { label: 'Sports', value: 0.958, hi: true },
          { label: 'World', value: 0.907 },
          { label: 'Sci/Tech', value: 0.876 },
          { label: 'Business', value: 0.866 },
        ]}
      />
      <text x="24" y="384" fontSize="11.5" fill="#5F616B" style={T}>
        Business and Sci/Tech confusions: 323 of 747 test errors
      </text>
    </>
  )
}

function R2() {
  return (
    <>
      <Header left="uber-lyft-price-prediction / results" right="R² on the test set" />
      <text x="24" y="92" fontSize="30" fontWeight="600" fill="#EDEDEA" style={{ ...T, letterSpacing: '-0.03em' }}>
        0.970
      </text>
      <text x="118" y="92" fontSize="13" fill="#9496A1" style={T}>
        tuned Gradient Boosting, RMSE $1.52
      </text>
      <Bars
        y0={142}
        rows={[
          { label: 'Gradient Boosting', value: 0.97, hi: true },
          { label: 'Random Forest', value: 0.963 },
          { label: 'Decision Tree', value: 0.908 },
          { label: 'Linear Regression', value: 0.496 },
        ]}
      />
      <text x="24" y="384" fontSize="11.5" fill="#5F616B" style={T}>
        5-fold cross-validation: R² 0.969 ± 0.0002
      </text>
    </>
  )
}

function Kpis() {
  const tiles = [
    ['$17.33M', 'Net sales'],
    ['$7.00M', 'Total profit'],
    ['40%', 'Profit margin'],
    ['$315.16', 'Average order value'],
  ]
  return (
    <>
      <Header left="retail_sales_dashboard.pbix / Executive summary" right="2021–2023" />
      {tiles.map(([v, l], i) => {
        const x = 24 + i * 150
        return (
          <g key={l}>
            <rect x={x} y={70} width="138" height="92" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" />
            <text x={x + 14} y={112} fontSize="24" fontWeight="600" fill={i === 0 ? 'var(--accent)' : '#EDEDEA'} style={{ ...T, letterSpacing: '-0.03em' }}>
              {v}
            </text>
            <text x={x + 14} y={140} fontSize="12" fill="#9496A1" style={T}>
              {l}
            </text>
          </g>
        )
      })}
      <text x="24" y="210" fontSize="13" fill="#EDEDEA" fontWeight="600" style={T}>
        Refund rate by channel
      </text>
      <Bars
        x0={110}
        x1={520}
        y0={248}
        gap={44}
        max={5}
        ticks={[0, 1, 2, 3, 4, 5]}
        fmt={(v) => `~${v}%`}
        rows={[
          { label: 'Delivery', value: 4, hi: true },
          { label: 'In-Store', value: 2 },
        ]}
      />
      <text x="24" y="384" fontSize="11.5" fill="#5F616B" style={T}>
        Star schema, 14 DAX measures, 55K+ orders
      </text>
    </>
  )
}

function Pipeline() {
  const steps = [
    ['Data', 'EMSCAD, 17,880 postings'],
    ['Preprocessing', 'cleaning, red-flag features'],
    ['Baseline', 'TF-IDF + Logistic Regression'],
    ['Classical', 'XGBoost, class weights / SMOTE'],
    ['Transformer', 'fine-tuned DistilBERT'],
    ['Explain', 'SHAP and LIME'],
    ['App', 'Streamlit on Hugging Face Spaces'],
  ]
  return (
    <>
      <Header left="JobShield / research plan" right="In progress" />
      <line x1="44" x2="44" y1="76" y2="340" stroke="rgba(255,255,255,0.12)" />
      {steps.map(([t, s], i) => {
        const y = 78 + i * 44
        return (
          <g key={t}>
            <circle cx="44" cy={y} r="9" fill="#16171C" stroke={i < 2 ? 'var(--accent)' : 'rgba(255,255,255,0.3)'} />
            <text x="44" y={y + 4} fontSize="10" fill={i < 2 ? 'var(--accent)' : '#9496A1'} textAnchor="middle" style={T}>
              {i + 1}
            </text>
            <text x="70" y={y + 5} fontSize="14" fontWeight="600" fill="#EDEDEA" style={T}>
              {t}
            </text>
            <text x="190" y={y + 5} fontSize="13" fill="#9496A1" style={T}>
              {s}
            </text>
          </g>
        )
      })}
      <text x="24" y="384" fontSize="11.5" fill="#5F616B" style={T}>
        Metrics: precision, recall, F1 and PR-AUC on the fraud class
      </text>
    </>
  )
}

function Schema() {
  const tables = [
    ['Airline', 40, 84],
    ['Flight', 150, 84],
    ['Gate', 150, 164],
    ['Terminal', 40, 164],
    ['Ticket', 150, 244],
    ['Passenger', 40, 244],
    ['Baggage', 40, 324],
  ]
  const pos = Object.fromEntries(tables.map(([n, x, y]) => [n, [x, y]]))
  const rel = [
    ['Airline', 'Flight'],
    ['Flight', 'Gate'],
    ['Gate', 'Terminal'],
    ['Flight', 'Ticket'],
    ['Ticket', 'Passenger'],
    ['Passenger', 'Baggage'],
  ]
  const W = 92
  const H = 34
  const c = (n) => [pos[n][0] + W / 2, pos[n][1] + H / 2]
  const cols = ['users', 'restaurants', 'orders', 'drivers', 'order_logs', 'notifications']
  return (
    <>
      <Header left="Airport (SQL) and FoodFleet (MongoDB)" right="17 tables, 6 collections" />
      {rel.map(([a, b]) => {
        const [x1, y1] = c(a)
        const [x2, y2] = c(b)
        return <line key={a + b} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.22)" />
      })}
      {tables.map(([n, x, y]) => (
        <g key={n}>
          <rect x={x} y={y} width={W} height={H} rx="7" fill="#1D1F26" stroke={n === 'Flight' ? 'var(--accent)' : 'rgba(255,255,255,0.16)'} />
          <text x={x + W / 2} y={y + 22} fontSize="12.5" fill="#EDEDEA" textAnchor="middle" style={T}>
            {n}
          </text>
        </g>
      ))}
      <text x="40" y="384" fontSize="11.5" fill="#5F616B" style={T}>
        Composite keys, e.g. Flight (flight_no, airline_code)
      </text>
      <line x1="300" x2="300" y1="74" y2="370" stroke="rgba(255,255,255,0.08)" />
      {cols.map((n, i) => {
        const x = 330 + (i % 2) * 146
        const y = 84 + Math.floor(i / 2) * 80
        const hub = n === 'orders'
        return (
          <g key={n}>
            <rect x={x} y={y} width="132" height="52" rx="10" fill={hub ? 'color-mix(in oklab, var(--accent) 14%, transparent)' : 'rgba(255,255,255,0.03)'} stroke={hub ? 'var(--accent)' : 'rgba(255,255,255,0.14)'} />
            <text x={x + 14} y={y + 22} fontSize="13" fontWeight="600" fill="#EDEDEA" style={T}>
              {n}
            </text>
            <text x={x + 14} y={y + 39} fontSize="11" fill="#9496A1" style={T}>
              {hub ? 'embeds cart, references logs' : 'collection'}
            </text>
          </g>
        )
      })}
      <text x="330" y="384" fontSize="11.5" fill="#5F616B" style={T}>
        Hybrid embedding and referencing
      </text>
    </>
  )
}

const VISUALS = { rag: Rag, f1: F1, r2: R2, kpis: Kpis, pipeline: Pipeline, schema: Schema }

export default function ProjectVisual({ project, className = '' }) {
  const V = VISUALS[project.visual]
  if (!V) return null
  return (
    <svg
      viewBox="0 0 640 400"
      className={`project-visual block h-auto w-full ${className}`}
      role="img"
      aria-label={`Diagram for ${project.title}`}
    >
      <V />
    </svg>
  )
}
