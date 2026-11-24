// Every fact and number below comes from the project's README on GitHub.
// To add a project: add an entry to `projects`, then list its id in a room.

const GH = 'https://github.com/Krushal16'
const RAW = 'https://raw.githubusercontent.com/Krushal16'

export const rooms = [
  {
    id: 'llms',
    plate: 'LLMs & RAG',
    title: 'Large language models & retrieval',
    blurb: 'Grounding LLM answers in documents, and knowing when not to answer from them.',
    color: 'indigo',
    projects: ['covid-rag'],
  },
  {
    id: 'nlp',
    plate: 'NLP',
    title: 'Natural language processing',
    blurb: 'Turning raw text into decisions: what a story is about, and whether a job posting is a scam.',
    color: 'plum',
    projects: ['news-classifier', 'jobshield'],
  },
  {
    id: 'ml',
    plate: 'Machine learning',
    title: 'Machine learning',
    blurb: 'Cleaning, feature engineering, tuning and validation on large tabular data.',
    color: 'teal',
    projects: ['uber-lyft'],
  },
  {
    id: 'data',
    plate: 'Data & BI',
    title: 'Data modelling & analytics',
    blurb: 'Schemas that hold up under real requirements, and reports managers can act on.',
    color: 'rust',
    projects: ['retail-powerbi', 'airport-db'],
  },
]

export const projects = [
  {
    id: 'covid-rag',
    room: 'llms',
    title: 'COVID-19 Research Assistant',
    subtitle: 'Agentic RAG on Databricks',
    date: 'April 2026',
    team: 'Individual project',
    summary:
      "A retrieval-augmented assistant that answers COVID-19 questions from PDF documents, cites the source file and page, and falls back to Wikipedia when the documents don't hold a good answer.",
    highlights: [
      'Ingests PDFs page by page into Delta tables in Unity Catalog, then embeds 800-character chunks (150 overlap) with all-MiniLM-L6-v2 into a FAISS index',
      'Routes every question three ways: a greeting reply, an answer from the PDFs by Llama 3.3 70B with page-level citations, or a Wikipedia fallback',
      'A context-quality gate (chunk count, context length, L2 distance, keyword overlap) stops confident answers built on loosely related chunks',
      'Keeps six turns of chat memory and is evaluated on 12 test questions, with route accuracy and latency logged to MLflow',
    ],
    metrics: [
      { value: '3', label: 'answer routes, chosen per question' },
      { value: 'Top 4', label: 'chunks retrieved from FAISS' },
      { value: '12', label: 'evaluation questions in MLflow' },
    ],
    keyMetric: 'Page-level citations',
    stack: ['Databricks', 'LangChain', 'FAISS', 'Sentence Transformers', 'Llama 3.3 70B', 'MLflow', 'Unity Catalog'],
    repo: 'covid19-rag-assistant',
    links: [{ kind: 'report', label: 'Read the report', href: `${GH}/covid19-rag-assistant/blob/main/docs/covid_rag_report.pdf` }],
    shots: [],
    visual: 'rag',
  },
  {
    id: 'news-classifier',
    room: 'nlp',
    title: 'Intelligent News Classifier',
    subtitle: 'Text classification with a live demo',
    date: 'January to April 2026',
    team: 'Team of 4, course project',
    summary:
      'Sorts news articles into World, Sports, Business and Sci/Tech. TF-IDF features with a tuned LinearSVC, trained on 120,000 AG News articles and served in a Streamlit app anyone can try.',
    highlights: [
      'TF-IDF with unigrams and bigrams (5,000 features); Logistic Regression and LinearSVC tuned over C on a stratified validation split',
      'Final LinearSVC (C = 0.5) retrained on all 120,000 training articles: 90.17% accuracy and 0.90 macro-F1 on 7,600 held-out articles',
      'Error analysis: Business and Sci/Tech confusions make up 43% of test errors, mostly earnings and acquisition stories about tech companies',
    ],
    metrics: [
      { value: '90.17%', label: 'test accuracy' },
      { value: '0.90', label: 'macro-F1 on 7,600 articles' },
      { value: '120K', label: 'training articles' },
    ],
    myPart:
      'Repository setup, consistent label handling across the pipeline, refactoring onto src/ modules, TF-IDF and tuning experiments, final evaluation and the Codespaces dev container.',
    keyMetric: '90.17% accuracy',
    stack: ['Python', 'scikit-learn', 'TF-IDF', 'LinearSVC', 'Streamlit'],
    repo: 'Intelligent-News-Classifier',
    demo: 'https://intelligent-news-classifier-dhecwgfu4rg3utdnrc5xn9.streamlit.app/',
    links: [],
    shots: [
      { src: `${RAW}/Intelligent-News-Classifier/main/docs/images/confusion_matrix.png`, alt: 'Confusion matrix of the final model on the 7,600-article test set' },
    ],
    visual: 'f1',
  },
  {
    id: 'jobshield',
    room: 'nlp',
    title: 'JobShield',
    subtitle: 'Explainable fake job posting detection',
    date: 'Fall 2026',
    team: 'Team of 4, AI/ML capstone',
    status: 'In progress',
    summary:
      'Reads a job posting, predicts whether it is real or fraudulent, gives a risk score and highlights the words and warning signs behind the decision. Built on EMSCAD, with a hand-labelled 2026 test set to measure how scams have changed.',
    highlights: [
      'Model path: a TF-IDF + Logistic Regression baseline, XGBoost with engineered red-flag features, then a fine-tuned DistilBERT',
      'Explanations with SHAP (XGBoost) and LIME (DistilBERT) so non-technical users can see why a posting was flagged',
      'Judged on precision, recall, F1 and PR-AUC for the fraud class, because predicting "real" for everything is already about 95% accurate',
      'Streamlit app with posting checks, a live feed and model insights, planned for Hugging Face Spaces',
    ],
    metrics: [
      { value: '17,880', label: 'postings in EMSCAD' },
      { value: '4.8%', label: 'of them fraudulent' },
      { value: '~200', label: '2026 postings for drift testing' },
    ],
    myPart: 'Coordination, repository setup, the live-data pipeline, the Streamlit app and deployment.',
    keyMetric: 'In progress',
    stack: ['Python', 'scikit-learn', 'XGBoost', 'DistilBERT', 'SHAP', 'LIME', 'Streamlit'],
    repo: 'JobShield',
    links: [],
    shots: [],
    visual: 'pipeline',
  },
  {
    id: 'uber-lyft',
    room: 'ml',
    title: 'Uber & Lyft Ride Price Prediction',
    subtitle: 'Regression on 693K Boston rides',
    date: 'March 2026',
    team: 'Team of 2, course project',
    summary:
      'Predicts the price of an Uber or Lyft ride in Boston from 693,071 ride records. After cleaning, EDA and feature engineering, four models were compared and the two ensembles tuned.',
    highlights: [
      'Removed duplicates and invalid rides, filled nulls and dropped price and distance outliers with the IQR rule (625,229 rows kept)',
      'Engineered time, rush-hour and night flags plus a surge × distance interaction, which became a top-five predictor',
      'Tuned Gradient Boosting reached R² 0.970 and RMSE $1.52 on the test set; 5-fold cross-validation confirmed it (R² 0.969 ± 0.0002)',
      'Tree ensembles beat linear regression by a wide margin (R² 0.97 against 0.50) because ride pricing is non-linear',
    ],
    metrics: [
      { value: '0.970', label: 'R² on the test set' },
      { value: '$1.52', label: 'RMSE' },
      { value: '693K', label: 'ride records' },
    ],
    myPart:
      'Data loading and inspection, data cleaning (missing values, datetime fixing, outlier removal), baseline models, and Random Forest modelling and hyperparameter tuning.',
    keyMetric: 'R² 0.97',
    stack: ['Python', 'pandas', 'scikit-learn', 'Gradient Boosting', 'Random Forest'],
    repo: 'uber-lyft-price-prediction',
    links: [{ kind: 'report', label: 'Read the report', href: `${GH}/uber-lyft-price-prediction/blob/main/docs/project_report.pdf` }],
    shots: [
      { src: `${RAW}/uber-lyft-price-prediction/main/images/predicted_vs_actual.png`, alt: 'Predicted against actual ride price for the tuned Gradient Boosting model' },
      { src: `${RAW}/uber-lyft-price-prediction/main/images/feature_importance.png`, alt: 'Feature importance of the tuned model' },
      { src: `${RAW}/uber-lyft-price-prediction/main/images/model_comparison.png`, alt: 'Model comparison by RMSE, MAE and R²' },
    ],
    visual: 'r2',
  },
  {
    id: 'retail-powerbi',
    room: 'data',
    title: 'Retail Sales Analytics Dashboard',
    subtitle: 'Power BI, DAX and a star schema',
    date: 'April 2026',
    team: 'Individual project',
    summary:
      'A four-page Power BI report analysing $17.33M in net sales across 55K orders (2021–2023) for a multi-channel retailer, built on a star-schema model with 14 DAX measures.',
    highlights: [
      'Star schema with Fact_Sales at the centre and four dimensions; DimDate is marked as the date table so prior-year and YoY measures work',
      '14 DAX measures in a dedicated measures table, covering margin, discount and refund rates, average order value and YoY growth',
      "Found that Delivery's refund rate (~4%) is about double In-Store's (~2%), and recommended an audit of the delivery channel",
      'Customers with no loyalty tier generate the most sales, so the report recommends a loyalty enrolment campaign at checkout',
    ],
    metrics: [
      { value: '$17.33M', label: 'net sales analysed' },
      { value: '40%', label: 'profit margin' },
      { value: '14', label: 'DAX measures' },
    ],
    keyMetric: '$17.3M analysed',
    stack: ['Power BI', 'DAX', 'Data modelling'],
    repo: 'retail-sales-powerbi-dashboard',
    links: [],
    shots: [
      { src: `${RAW}/retail-sales-powerbi-dashboard/main/images/01_executive_summary.png`, alt: 'Executive summary page: KPIs, sales trend and channel split' },
      { src: `${RAW}/retail-sales-powerbi-dashboard/main/images/02_customer_channel_insight.png`, alt: 'Customer and channel insight page' },
      { src: `${RAW}/retail-sales-powerbi-dashboard/main/images/03_star_schema_model.png`, alt: 'Star schema data model' },
    ],
    visual: 'kpis',
  },
  {
    id: 'airport-db',
    room: 'data',
    title: 'Airport & Food-Delivery Database Design',
    subtitle: 'SQL and NoSQL data modelling',
    date: 'Winter 2026',
    team: 'Team of 4, course project',
    summary:
      'Two designs: a relational schema for an airport management system, and FoodFleet, a document database for a food-delivery platform, implemented in MongoDB Atlas.',
    highlights: [
      'ER diagram and data dictionary for 17 tables, with composite keys such as Flight (flight_no, airline_code) and Gate (gate_no, terminal_id)',
      'Compared document and graph models for FoodFleet and chose MongoDB Atlas, keeping a graph database as a later option for recommendations',
      'Six collections with hybrid embedding and referencing: data read together is embedded, fast-growing delivery logs get their own collection',
      'Ten queries plus CRUD operations in mongosh, using filters, projections, sorting and a $group aggregation',
    ],
    metrics: [
      { value: '17', label: 'relational tables' },
      { value: '6', label: 'MongoDB collections' },
      { value: '10', label: 'queries plus CRUD' },
    ],
    keyMetric: '17 tables, 6 collections',
    stack: ['SQL', 'ER modelling', 'MongoDB Atlas', 'JSON'],
    repo: 'airport-food-delivery-database-design',
    links: [
      { kind: 'report', label: 'Airport design (PDF)', href: `${GH}/airport-food-delivery-database-design/blob/main/assignment1_airport_management_system.pdf` },
      { kind: 'report', label: 'FoodFleet design (PDF)', href: `${GH}/airport-food-delivery-database-design/blob/main/assignment2_foodfleet_nosql_design.pdf` },
    ],
    shots: [
      { src: `${RAW}/airport-food-delivery-database-design/main/airport_er_diagram.jpg`, alt: 'ER diagram of the airport management system' },
    ],
    visual: 'schema',
  },
]

export const projectById = Object.fromEntries(projects.map((p) => [p.id, p]))
export const roomById = Object.fromEntries(rooms.map((r) => [r.id, r]))
export const repoUrl = (repo) => `${GH}/${repo}`
