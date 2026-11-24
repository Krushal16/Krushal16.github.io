# Krushal Sardhara · Portfolio

Personal portfolio of **Krushal Sardhara**, AI/ML postgraduate student at Lambton College (Ottawa), open to a Winter 2027 co-op in machine learning, NLP/LLMs and data science.

**Live site:** https://krushal16.github.io/ (after the first deploy)

Built with React 19, Vite and Tailwind CSS v4. No UI or animation libraries: motion is CSS plus a few small hooks, icons are inline SVG, and the font (DM Sans) is self-hosted, so the page makes no third-party requests except an optional call to the public GitHub API.

## What's on the page

| Section | What it does |
| --- | --- |
| Hero | Name, a flip-card that pages through focus areas, availability card, resume and social links. A slow field of points in four clusters sits behind it, coloured like the four project doors. |
| About | A statement that brightens word by word as you scroll, and three working principles. |
| Experience & education | "Let's go back in time": a sticky year that rolls from 2027 back to 2021 as you scroll the timeline. |
| Projects | Four doors (LLMs & RAG, NLP, Machine learning, Data & BI). Hovering opens a door; clicking zooms through it into a project "room". Below the doors, a full project list with hover previews. |
| Project rooms | Full-screen pages at `#/work/<room>` with each project's summary, metrics, highlights, your part in team projects, stack, GitHub/demo/report links, a data preview drawn from the README's numbers, and real images from the repository. Back button, Escape and "Next door" all work. |
| Skills | Pick a skill to see which projects used it. |
| Contact | "The road so far" timeline, then email, copy-email, resume, LinkedIn and GitHub. |

## Before you deploy

1. **Add your resume** as `public/resume.pdf`. The "Download resume" buttons stay hidden until that file exists, then appear on their own (it downloads as `Krushal_Sardhara_Resume.pdf`). `npm run build` warns while it's missing.
2. **Optional photo:** add a portrait as `public/profile.jpg` (4:5, at least 800×1000), then set `photo: 'profile.jpg'` in `src/data/profile.js`. Until then the hero shows a "KS" monogram.
3. **Different repo name?** The site URL in `index.html` (canonical and Open Graph tags), `public/robots.txt` and `public/sitemap.xml` assumes `https://krushal16.github.io/`. Update those if you deploy elsewhere. The build itself uses a relative base, so it works at any path.

## Run it locally

Requires Node.js 20.19 or newer.

```bash
npm install
npm run dev        # http://localhost:5173 with hot reload
npm run build      # production build into dist/
npm run preview    # serve dist/ locally to check the build
```

## Deploy to GitHub Pages

The included workflow (`.github/workflows/deploy.yml`) builds and publishes the site on every push to `main`.

1. Create a **public** repository named **`Krushal16.github.io`** (this gives you the root URL `https://krushal16.github.io/`). Any other name works too; the site will be at `https://krushal16.github.io/<repo-name>/`.
2. Push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/Krushal16/Krushal16.github.io.git
   git push -u origin main
   ```
3. In the repository, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to finish (about a minute). The site is then live.
5. After your first local `npm install`, commit the generated `package-lock.json`; the workflow then uses `npm ci` for reproducible builds.

Every later `git push` redeploys automatically.

## Editing content

All text lives in `src/data/`, so you rarely need to touch components:

| File | Contents |
| --- | --- |
| `profile.js` | Name, links, email, location, availability, resume and photo paths, hero words |
| `projects.js` | The four rooms (doors) and six projects: summaries, metrics, highlights, your part, stack, links, repository images |
| `experience.js` | The "back in time" timeline and the "road so far" strip |
| `skills.js` | Skill groups, and which projects or experience each skill links to |

To add a project, add an entry to `projects` in `projects.js` and list its `id` in one of the `rooms`. The `visual` field picks one of the drawn previews in `src/components/ProjectVisual.jsx` (`rag`, `f1`, `pipeline`, `r2`, `kpis`, `schema`); add a new one there if needed. `shots` takes image URLs from your repositories (raw.githubusercontent.com links); broken images are hidden automatically.

## GitHub integration

`src/hooks/useGithubRepos.js` calls the public GitHub REST API (`/users/Krushal16/repos`, no token) and caches the result in `localStorage` for an hour. It adds live details (public repo count, last push, each project's language and last update). If the API is unavailable or rate-limited, the site falls back to the static data with no visible error.

## Project structure

```
├── index.html                 SEO, Open Graph and JSON-LD metadata
├── vite.config.js             relative base for GitHub Pages; warns if resume.pdf is missing
├── public/                    favicon, og-image.png, robots.txt, sitemap.xml (+ resume.pdf, profile.jpg)
├── .github/workflows/         GitHub Pages deployment
└── src/
    ├── main.jsx, App.jsx
    ├── index.css              Tailwind v4 theme tokens and component styles
    ├── assets/fonts/          DM Sans variable font (SIL Open Font License)
    ├── data/                  all site content
    ├── hooks/                 scroll/in-view/reduced-motion helpers, GitHub API, room routing
    ├── components/            Nav, Icon, buttons, flip card, point field, project visuals, project room, footer
    └── sections/              Hero, About, Experience, Projects, Skills, Contact
```

## Accessibility and performance

- Keyboard: skip link, visible focus rings, doors and rooms fully usable from the keyboard; rooms trap focus, close on Escape and return focus to the door.
- Respects `prefers-reduced-motion` (animations and the zoom transition are skipped).
- Semantic landmarks and headings; decorative visuals are hidden from screen readers.
- About 85 KB of gzipped JavaScript (mostly React) and one 93 KB font file; the hero animation pauses when off-screen or in a background tab.

## Credits

Typeface: [DM Sans](https://github.com/googlefonts/dm-fonts) by Colophon Foundry, SIL Open Font License 1.1 (`src/assets/fonts/OFL.txt`).
