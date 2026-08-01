# Piolo Valledor Portfolio — Design

## Summary

Recreate the structure and visual design of the reference repo
[cyriel-basilio-portfolio](https://github.com/cyriel04/cyriel-basilio-portfolio)
inside the existing `piolo` project, populated with Piolo B. Valledor's resume
content. The reference is a Next.js 15 App Router site; this project stays on
its current Create React App (react-scripts, TypeScript) stack, porting the
reference's architecture to CRA equivalents rather than migrating to Next.js.

## Architecture

CRA (react-scripts) + TypeScript, unchanged from current setup. Reference
Next.js-specific pieces are swapped for CRA equivalents:

| Reference (Next.js) | This project (CRA) |
|---|---|
| App Router file-based routes | `react-router-dom` `BrowserRouter` + `Routes` in `src/App.tsx` |
| `next/link` | `react-router-dom`'s `Link` |
| `next/font` (Inter) | Google Fonts `<link>` tag in `public/index.html` |
| `AppRouterCacheProvider` (Next SSR emotion cache) | Dropped — CRA is CSR-only, plain MUI `ThemeProvider` suffices |
| `app/layout.tsx` metadata | `<title>` / `<meta description>` in `public/index.html` |

Everything else carries over: MUI dark theme, CSS Modules (`.module.css` /
`.module.scss`) composed with `classnames` (`cx`), and a data-driven content
model — all resume content lives in `src/constants/index.ts`; components map
over it.

All current scratch code (`src/Main.tsx`, the Star Wars API fetch in
`src/App.tsx`, stray MUI button demos, `src/App.css` boilerplate) is deleted —
it predates this work and has nothing worth preserving.

## File layout

```
src/
  index.tsx              — ReactDOM root; wraps App in BrowserRouter + ThemeProvider
  App.tsx                — Routes: "/" → Home, "/contact" → Contact
  theme.ts               — dark MUI theme (ported from reference, same palette)
  index.css              — global styles
  constants/index.ts     — PROFILE, SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION, CERTIFICATIONS
  components/
    Navigation.tsx + .module.scss
    Footer.tsx + .module.scss
    ContentCard.tsx + .module.scss
  layout/
    Article.tsx + .module.scss   — maps PROJECTS into ContentCards
  pages/
    Home.tsx + .module.css       — hero + anchor sections
    Contact.tsx + .module.css
```

`public/index.html`: `<title>` → "Piolo Valledor | Frontend Developer",
`<meta name="description">` from the resume summary, Inter font `<link>`
added.

## Content model (`src/constants/index.ts`)

```ts
PROFILE = {
  name: "Piolo B. Valledor",
  title: "Aspiring Frontend / React Developer",
  phone: "+63 916-692-4987",
  email: "piolovalledor@gmail.com",
  location: "Marikina City, Philippines",
  resumeUrl: "#", // placeholder — no hosted resume PDF yet
}

SUMMARY = "IT professional with 3+ years of experience in technical support
and systems troubleshooting, now building toward a career in frontend web
development. Completed a full-stack thesis project using PHP, MySQL, HTML5,
CSS3, and React JS, and currently deepening my React and JavaScript skills.
Comfortable learning new tools quickly and working independently. Looking for
an entry-level or junior Frontend/React Developer role where I can keep
growing."

SKILLS = {
  frontend: ["React JS", "HTML5", "CSS3", "JavaScript"],
  backend: ["PHP", "MySQL"],
  tools: ["WordPress", "Elementor", "Git basics", "Command Prompt"],
  itFoundation: ["Technical Troubleshooting", "Windows Environments", "Networking (LAN/IP)"],
}

EXPERIENCE = [
  { company: "Unified Forces Security & Investigation Agency, Inc.", role: "Technical Support / IT Assistant", period: "2022 - Present", type: "Full-time" },
  { company: "Unified Forces Security & Investigation Agency, Inc.", role: "IT Support / Technical Assistant (OJT)", period: "Feb 2023 - May 2023", type: "OJT" },
]

PROJECTS = [
  {
    title: "Personal Portfolio Website",
    url: null, // no public repo link provided
    company: "Personal Project",
    stack: ["React", "TypeScript", "Material UI", "React Router"],
    description: "This site — a self-directed React project built to
    strengthen frontend skills ahead of job applications. Recreated from a
    reference design, adapted to a data-driven Create React App structure
    with a dark MUI theme and CSS Modules.",
  },
  {
    title: "Bakasyunan Tanay Resort and Conference Center — Booking Website",
    url: null,
    company: "Thesis Project (Independent)",
    stack: ["PHP", "MySQL", "HTML5", "CSS3", "React JS"],
    description: "Full-stack booking website built as a capstone project,
    covering both frontend UI and backend logic. Set up a MySQL database
    connected to a PHP backend to handle booking and availability data. Built
    the UI with React JS, HTML5, and CSS3. Worked independently from planning
    through to a working system.",
  },
]

EDUCATION = {
  school: "Pamantasan ng Lungsod ng Marikina",
  degree: "Bachelor of Science in Information Technology",
  period: "2019 - 2023",
}

CERTIFICATIONS = [
  { name: "Programming Using Java", issuer: "TESDA", year: "2018" },
  { name: "BOSH Safety Officer 1 (SO1)", issuer: "QESH Training Center", year: "2024" },
]
```

## Page structure

**Home (`/`)** — single page, same section order as reference plus a new
Certifications section:

1. Hero — name, title, summary, Resume button (placeholder `href="#"`). No
   LinkedIn/GitHub icon buttons (not provided).
2. `#experience`
3. `#projects` — renders `PROJECTS` via `Article`/`ContentCard`
4. `#skills`
5. `#education`
6. `#certifications` — new section, same visual treatment as Experience
   (name · issuer, year)

**Contact (`/contact`)** — same layout as reference, but only Email and Phone
cards (no LinkedIn/GitHub cards, since those links aren't available). "Back to
Home" link retained.

**Navigation** — links: experience, projects, skills, education,
certifications, contact. Logo initials: "PV", links to `/`.

**Footer** — "Contact" link retained. The reference's "Source" link (points to
the reference's own GitHub repo) is dropped — no GitHub URL available for this
project.

## Styling

Dark MUI theme ported verbatim from the reference (`palette.mode: "dark"`,
blue accent `#5ba3f5`, `background.default: #1a1d2e`, Inter/Poppins font
stack). No new visual identity — this design deliberately reuses the
reference's look, since the task is to recreate its structure/design with new
content, not redesign it.

## Error handling / edge cases

- No data fetching — content is fully static from `constants/index.ts`, so no
  loading/error states are needed.
- Resume button uses a placeholder `href="#"` until a real hosted resume link
  is provided; clicking it is a no-op. Revisit once Piolo has a hosted PDF.
- Projects and Certifications both render from arrays and tolerate empty
  arrays gracefully (sections just render no items) without additional
  guarding, matching the reference's pattern.

## Testing

No new automated tests are added beyond what the reference has (it has none).
`src/App.test.tsx` currently smoke-tests the deleted scratch `App` component
and will be rewritten as a minimal smoke test asserting the app renders at
`/` without crashing (via `react-scripts test`, CRA's built-in Jest runner).

## Out of scope

- Custom favicon/logo images (CRA defaults are left in place; swappable
  later).
- A real hosted resume PDF, GitHub profile, and LinkedIn profile — all
  explicitly omitted per current information; can be added later by filling
  in the placeholders in `constants/index.ts`.
