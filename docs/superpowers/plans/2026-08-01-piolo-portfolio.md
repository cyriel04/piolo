# Piolo Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the structure/design of the `cyriel-basilio-portfolio` reference repo inside the existing `piolo` CRA project, populated with Piolo B. Valledor's resume content.

**Architecture:** Create React App (react-scripts, TypeScript) stays as-is. Next.js-specific pieces from the reference (App Router, `next/link`, `next/font`) are swapped for CRA equivalents: `react-router-dom` for the `/contact` route, plain `<a>` tags for same-page anchor links and external links, a Google Fonts `<link>` for Inter. Content is data-driven from `src/constants/index.ts`; components map over it. Styling is CSS Modules (`.module.css` / `.module.scss`) + a dark MUI theme, ported near-verbatim from the reference.

**Tech Stack:** React 19, TypeScript, react-scripts (CRA), MUI (`@mui/material`, `@mui/icons-material`), `react-router-dom`, `classnames`, Sass (for `.module.scss`), `@testing-library/react` (already present).

## Global Constraints

- No Next.js — stay on CRA/react-scripts. (Design decision, see spec §Architecture.)
- No GitHub or LinkedIn links anywhere (nav, hero, footer, contact) — not provided.
- Resume button uses placeholder `href="#"` — no hosted resume PDF yet.
- Every test run must pass `--watchAll=false` (or `CI=true`) since `react-scripts test` runs in interactive watch mode by default and will hang otherwise: use `CI=true npm test -- --watchAll=false`.
- Dark MUI theme and CSS custom properties are ported verbatim from the reference repo (same palette, same class-name conventions) — this is a structure/content recreation, not a redesign.

---

## Reference source (for copy/paste-level porting)

The reference repo is cloned read-only at
`/private/tmp/claude-501/-Users-cyrielbasilio-Sites-piolo/dac017fe-59ce-44ec-9257-51d59ac1efb4/scratchpad/ref-portfolio`
(from `https://github.com/cyriel04/cyriel-basilio-portfolio.git`). Tasks below
inline every piece of content needed from it, so you should not need to
re-open it — but it's there if a task references "port from reference" and
you want to double check.

---

### Task 1: Project scaffold — dependencies, global styles, theme, routing shell

**Files:**
- Modify: `package.json` (add scripts)
- Delete: `src/Main.tsx`, `src/App.css`, `src/logo.svg`
- Create: `src/theme.ts`
- Modify: `src/index.css` (full rewrite)
- Modify: `public/index.html`
- Create: `src/App.tsx` (stub, replaced in Task 8)
- Modify: `src/index.tsx` (full rewrite)
- Modify: `src/App.test.tsx` (stub test, replaced in Task 8)

**Interfaces:**
- Produces: `theme` (default export of `src/theme.ts`, an MUI `Theme`) — consumed by `src/index.tsx`.
- Produces: `App` (default export of `src/App.tsx`) — consumed by `src/index.tsx`; reshaped in Task 8.

- [ ] **Step 1: Install dependencies**

Run:
```bash
npm install react-router-dom @mui/icons-material classnames sass
```

- [ ] **Step 2: Add a typecheck script**

Edit `package.json`, in the `"scripts"` block, add a `typecheck` entry next to `"build"`:

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "typecheck": "tsc --noEmit",
  "eject": "react-scripts eject"
},
```

- [ ] **Step 3: Delete scratch files**

```bash
rm src/Main.tsx src/App.css src/logo.svg
```

- [ ] **Step 4: Create the MUI dark theme**

Create `src/theme.ts`:

```ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#5ba3f5",
			light: "#7bb8ff",
			dark: "#4a8fd9",
		},
		background: {
			default: "#1a1d2e",
			paper: "#2d3348",
		},
		text: {
			primary: "#e8ecf4",
			secondary: "#b8c4dc",
			disabled: "#8a9bb8",
		},
	},
	typography: {
		fontFamily: '"Inter", "Poppins", system-ui, sans-serif',
		body1: {
			color: "#e8ecf4",
		},
		body2: {
			color: "#b8c4dc",
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
				},
			},
		},
	},
});

export default theme;
```

- [ ] **Step 5: Rewrite global CSS**

Replace the full contents of `src/index.css` with:

```css
:root {
	--nav-height: 88px;
	--max-width: 1100px;
	--border-radius: 12px;
	--font-mono:
		ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono",
		"Roboto Mono", monospace;

	/* Readable dark theme palette */
	--bg-primary: #1a1d2e;
	--bg-secondary: #252940;
	--bg-card: #2d3348;
	--text-primary: #e8ecf4;
	--text-secondary: #b8c4dc;
	--text-muted: #8a9bb8;
	--accent: #5ba3f5;
	--accent-hover: #7bb8ff;
	--border: rgba(184, 196, 220, 0.15);
}

* {
	box-sizing: border-box;
	padding: 0;
	margin: 0;
}

html {
	scroll-padding-top: 2rem;
	scroll-behavior: smooth;
}

html,
body {
	max-width: 100vw;
	overflow-x: hidden;
	overflow-y: auto;
	min-height: 100%;
	background: var(--bg-primary);
	color: var(--text-primary);
	font-family: "Inter", "Poppins", system-ui, sans-serif;
}

a {
	color: var(--accent);
	text-decoration: none;
}

a:hover {
	color: var(--accent-hover);
	text-decoration: underline;
}
```

- [ ] **Step 6: Update the HTML shell**

In `public/index.html`:

1. Replace the `<meta name="description" ...>` tag's `content` attribute with:
   `"Piolo B. Valledor — Aspiring Frontend / React Developer. IT professional with 3+ years in technical support, building toward frontend web development with React, TypeScript, and MUI."`
2. Replace `<title>React App</title>` with `<title>Piolo Valledor | Frontend Developer</title>`.
3. Add Google Fonts `<link>` tags for Inter right before the `<title>` tag:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 7: Create a minimal `App` stub**

Create `src/App.tsx`:

```tsx
function App() {
	return <div>Piolo Valledor Portfolio</div>;
}

export default App;
```

- [ ] **Step 8: Wire up routing and theming in the entry point**

Replace the full contents of `src/index.tsx` with:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "./index.css";
import theme from "./theme";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<App />
			</ThemeProvider>
		</BrowserRouter>
	</React.StrictMode>
);

reportWebVitals();
```

- [ ] **Step 9: Replace the smoke test**

Replace the full contents of `src/App.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders without crashing", () => {
	render(<App />);
	expect(screen.getByText(/Piolo Valledor Portfolio/i)).toBeInTheDocument();
});
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `CI=true npm test -- --watchAll=false`
Expected: 1 test suite, 1 test, PASS.

- [ ] **Step 11: Verify the production build compiles**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors (warnings about unused CRA boilerplate are fine).

- [ ] **Step 12: Commit**

```bash
git add package.json package-lock.json src/theme.ts src/index.css src/index.tsx src/App.tsx src/App.test.tsx public/index.html
git add -u src/Main.tsx src/App.css src/logo.svg
git commit -m "Scaffold portfolio: routing, theme, global styles"
```

---

### Task 2: Content constants

**Files:**
- Create: `src/constants/index.ts`
- Test: `src/constants/index.test.ts`

**Interfaces:**
- Produces: `PROFILE: { name, title, phone, email, location, resumeUrl }`, `SUMMARY: string`, `SKILLS: { frontend, backend, tools, itFoundation }` (each `string[]`), `EXPERIENCE: { company, role, period, type }[]`, `PROJECTS: { title, url, company, stack, description }[]`, `EDUCATION: { school, degree, period }`, `CERTIFICATIONS: { name, issuer, year }[]` — all consumed by later component/page tasks.

- [ ] **Step 1: Write the failing test**

Create `src/constants/index.test.ts`:

```ts
import {
	PROFILE,
	SUMMARY,
	SKILLS,
	EXPERIENCE,
	PROJECTS,
	EDUCATION,
	CERTIFICATIONS,
} from "./index";

test("profile has required contact fields", () => {
	expect(PROFILE.name).toBe("Piolo B. Valledor");
	expect(PROFILE.email).toBe("piolovalledor@gmail.com");
	expect(PROFILE.resumeUrl).toBe("#");
});

test("summary is non-empty", () => {
	expect(SUMMARY.length).toBeGreaterThan(0);
});

test("every skills group is non-empty", () => {
	Object.values(SKILLS).forEach((group) => {
		expect(group.length).toBeGreaterThan(0);
	});
});

test("experience has two roles", () => {
	expect(EXPERIENCE).toHaveLength(2);
});

test("projects include the portfolio site and the thesis project", () => {
	expect(PROJECTS).toHaveLength(2);
	expect(PROJECTS[0].title).toBe("Personal Portfolio Website");
	expect(PROJECTS[1].title).toContain("Bakasyunan Tanay Resort");
});

test("education and certifications are populated", () => {
	expect(EDUCATION.school).toBe("Pamantasan ng Lungsod ng Marikina");
	expect(CERTIFICATIONS).toHaveLength(2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=constants`
Expected: FAIL — `Cannot find module './index'`.

- [ ] **Step 3: Write the constants**

Create `src/constants/index.ts`:

```ts
export const PROFILE = {
	name: "Piolo B. Valledor",
	title: "Aspiring Frontend / React Developer",
	phone: "+63 916-692-4987",
	email: "piolovalledor@gmail.com",
	location: "Marikina City, Philippines",
	resumeUrl: "#",
};

export const SUMMARY =
	"IT professional with 3+ years of experience in technical support and systems troubleshooting, now building toward a career in frontend web development. Completed a full-stack thesis project using PHP, MySQL, HTML5, CSS3, and React JS, and currently deepening my React and JavaScript skills. Comfortable learning new tools quickly and working independently. Looking for an entry-level or junior Frontend/React Developer role where I can keep growing.";

export const SKILLS = {
	frontend: ["React JS", "HTML5", "CSS3", "JavaScript"],
	backend: ["PHP", "MySQL"],
	tools: ["WordPress", "Elementor", "Git basics", "Command Prompt"],
	itFoundation: [
		"Technical Troubleshooting",
		"Windows Environments",
		"Networking (LAN/IP)",
	],
};

export const EXPERIENCE = [
	{
		company: "Unified Forces Security & Investigation Agency, Inc.",
		role: "Technical Support / IT Assistant",
		period: "2022 - Present",
		type: "Full-time",
	},
	{
		company: "Unified Forces Security & Investigation Agency, Inc.",
		role: "IT Support / Technical Assistant (OJT)",
		period: "Feb 2023 - May 2023",
		type: "OJT",
	},
];

export const PROJECTS = [
	{
		title: "Personal Portfolio Website",
		url: null,
		company: "Personal Project",
		stack: ["React", "TypeScript", "Material UI", "React Router"],
		description:
			"This site — a self-directed React project built to strengthen frontend skills ahead of job applications. Adapted from a reference design into a data-driven Create React App structure with a dark MUI theme and CSS Modules.",
	},
	{
		title: "Bakasyunan Tanay Resort and Conference Center — Booking Website",
		url: null,
		company: "Thesis Project (Independent)",
		stack: ["PHP", "MySQL", "HTML5", "CSS3", "React JS"],
		description:
			"Full-stack booking website built as a capstone project, covering both frontend UI and backend logic. Set up a MySQL database connected to a PHP backend to handle booking and availability data. Built the UI with React JS, HTML5, and CSS3. Worked independently from planning through to a working system.",
	},
];

export const EDUCATION = {
	school: "Pamantasan ng Lungsod ng Marikina",
	degree: "Bachelor of Science in Information Technology",
	period: "2019 - 2023",
};

export const CERTIFICATIONS = [
	{ name: "Programming Using Java", issuer: "TESDA", year: "2018" },
	{
		name: "BOSH Safety Officer 1 (SO1)",
		issuer: "QESH Training Center",
		year: "2024",
	},
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=constants`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/constants/index.ts src/constants/index.test.ts
git commit -m "Add resume content constants"
```

---

### Task 3: `ContentCard` component

**Files:**
- Create: `src/components/ContentCard.tsx`
- Create: `src/components/ContentCard.module.scss`
- Test: `src/components/ContentCard.test.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `Project` type (`{ title: string; url: string | null; company: string; stack: string[]; description: string }`) and `ContentCard` default export (`{ project: Project; className?: string }`) — consumed by Task 4 (`Article`).

- [ ] **Step 1: Write the failing test**

Create `src/components/ContentCard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import ContentCard, { Project } from "./ContentCard";

const linkedProject: Project = {
	title: "Test Project",
	url: "https://example.com",
	company: "Test Co",
	stack: ["React", "TypeScript"],
	description: "A test project description.",
};

const unlinkedProject: Project = {
	...linkedProject,
	title: "No Link Project",
	url: null,
};

test("renders project details", () => {
	render(<ContentCard project={linkedProject} />);
	expect(screen.getByText("Test Project")).toBeInTheDocument();
	expect(screen.getByText("Test Co")).toBeInTheDocument();
	expect(screen.getByText("A test project description.")).toBeInTheDocument();
	expect(screen.getByText("React")).toBeInTheDocument();
	expect(screen.getByText("TypeScript")).toBeInTheDocument();
});

test("wraps the title in a link when a url is provided", () => {
	render(<ContentCard project={linkedProject} />);
	const link = screen.getByRole("link", { name: "Test Project" });
	expect(link).toHaveAttribute("href", "https://example.com");
});

test("does not render a link when url is null", () => {
	render(<ContentCard project={unlinkedProject} />);
	expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=ContentCard`
Expected: FAIL — `Cannot find module './ContentCard'`.

- [ ] **Step 3: Create the styles**

Create `src/components/ContentCard.module.scss`:

```scss
.link {
	text-decoration: none;
	color: inherit;
	display: block;
}

.contentCard {
	min-width: 275px;
	max-width: 380px;
	background-color: var(--bg-card) !important;
	border: 1px solid var(--border) !important;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease,
		border-color 0.2s ease;

	p,
	.title,
	.description {
		color: var(--text-primary) !important;
	}

	.company {
		color: var(--accent) !important;
		display: block;
		margin-bottom: 0.5rem;
	}

	.description {
		font-size: 0.9rem;
		line-height: 1.6;
		margin-bottom: 1rem;
		color: var(--text-secondary) !important;
	}

	.projectStack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.tech {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		background: rgba(91, 163, 245, 0.15);
		border-radius: 4px;
		color: var(--accent);
	}

	@media (max-width: 767px) {
		min-width: unset;
		max-width: 100%;
	}

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3) !important;
		border-color: rgba(91, 163, 245, 0.3) !important;
	}

	&.noLink {
		cursor: default;

		&:hover {
			transform: none;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
			border-color: var(--border) !important;
		}
	}
}
```

- [ ] **Step 4: Implement the component**

Create `src/components/ContentCard.tsx`:

```tsx
import { Card, CardContent, Typography } from "@mui/material";
import cx from "classnames";

import styles from "./ContentCard.module.scss";

export type Project = {
	title: string;
	url: string | null;
	company: string;
	stack: string[];
	description: string;
};

const ContentCard = ({
	project,
	className,
}: {
	project: Project;
	className?: string;
}) => (
	<Card
		className={cx(styles.contentCard, className, !project.url && styles.noLink)}
	>
		<CardContent>
			{project.url ? (
				<a
					href={project.url}
					target="_blank"
					rel="noopener noreferrer"
					className={styles.link}
				>
					<Typography
						gutterBottom
						variant="h6"
						component="div"
						className={styles.title}
					>
						{project.title}
					</Typography>
				</a>
			) : (
				<Typography
					gutterBottom
					variant="h6"
					component="div"
					className={styles.title}
				>
					{project.title}
				</Typography>
			)}
			<Typography variant="caption" className={styles.company}>
				{project.company}
			</Typography>
			<Typography variant="body2" className={styles.description}>
				{project.description}
			</Typography>
			<div className={styles.projectStack}>
				{project.stack.map((tech) => (
					<span key={tech} className={styles.tech}>
						{tech}
					</span>
				))}
			</div>
		</CardContent>
	</Card>
);

export default ContentCard;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=ContentCard`
Expected: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/ContentCard.tsx src/components/ContentCard.module.scss src/components/ContentCard.test.tsx
git commit -m "Add ContentCard component"
```

---

### Task 4: `Article` layout (projects grid)

**Files:**
- Create: `src/layout/Article.tsx`
- Create: `src/layout/Article.module.scss`
- Test: `src/layout/Article.test.tsx`

**Interfaces:**
- Consumes: `PROJECTS` from `src/constants` (Task 2), `ContentCard` default export + `Project` type from `src/components/ContentCard` (Task 3).
- Produces: `Article` default export (no props) — consumed by Task 7 (`Home` page).

- [ ] **Step 1: Write the failing test**

Create `src/layout/Article.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import Article from "./Article";
import { PROJECTS } from "../constants";

test("renders a ContentCard for every project", () => {
	render(<Article />);
	PROJECTS.forEach((project) => {
		expect(screen.getByText(project.title)).toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=Article`
Expected: FAIL — `Cannot find module './Article'`.

- [ ] **Step 3: Create the styles**

Create `src/layout/Article.module.scss`:

```scss
.article {
	display: flex;
	gap: 24px;
	flex-wrap: nowrap;
	overflow-x: auto;
	overflow-y: hidden;
	padding-bottom: 0.5rem;
	scroll-behavior: smooth;
	-webkit-overflow-scrolling: touch;

	&::-webkit-scrollbar {
		height: 8px;
	}

	&::-webkit-scrollbar-track {
		background: var(--bg-secondary);
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background: var(--accent);
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb:hover {
		background: var(--accent-hover);
	}

	.articleCard {
		flex: 0 0 calc(24% - 18px);
		min-width: 260px;

		@media (max-width: 1200px) {
			flex: 0 0 calc(48% - 12px);
		}

		@media (max-width: 800px) {
			flex: 0 0 calc(92% - 24px);
		}
	}
}
```

- [ ] **Step 4: Implement the component**

Create `src/layout/Article.tsx`:

```tsx
import ContentCard from "../components/ContentCard";
import { PROJECTS } from "../constants";
import styles from "./Article.module.scss";

const Article = () => {
	return (
		<div className={styles.article}>
			{PROJECTS.map((project, index) => (
				<ContentCard
					key={index}
					project={project}
					className={styles.articleCard}
				/>
			))}
		</div>
	);
};

export default Article;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=Article`
Expected: PASS, 1 test.

- [ ] **Step 6: Commit**

```bash
git add src/layout/Article.tsx src/layout/Article.module.scss src/layout/Article.test.tsx
git commit -m "Add Article projects layout"
```

---

### Task 5: `Navigation` component

**Files:**
- Create: `src/components/Navigation.tsx`
- Create: `src/components/Navigation.module.scss`
- Test: `src/components/Navigation.test.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks (link labels/hrefs are hardcoded, matching the reference's own hardcoded `NAV_LINKS`).
- Produces: `Navigation` default export (no props) — consumed by Task 7 (`Home`) and Task 8 (`Contact`).

**Note on link behavior:** same-page anchors (`/#experience`, `/#projects`, `/#skills`, `/#education`, `/#certifications`) use plain `<a>` tags so the browser's native hash-scroll behavior applies when already on `/`. Only `/contact` (a real route change) uses `react-router-dom`'s `Link`. This differs from the reference, which used `next/link` for both — Next.js's App Router has built-in same-page hash-scroll handling for `Link` that `react-router-dom` does not, so porting it 1:1 would silently break the anchor links.

- [ ] **Step 1: Write the failing test**

Create `src/components/Navigation.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navigation from "./Navigation";

const renderNav = () =>
	render(
		<MemoryRouter>
			<Navigation />
		</MemoryRouter>
	);

test("renders the PV logo and all nav links", () => {
	renderNav();
	expect(screen.getByText("PV")).toBeInTheDocument();
	[
		"experience",
		"projects",
		"skills",
		"education",
		"certifications",
		"contact",
	].forEach((label) => {
		expect(screen.getAllByText(label).length).toBeGreaterThan(0);
	});
});

test("the contact link uses react-router navigation", () => {
	renderNav();
	const contactLinks = screen.getAllByText("contact");
	expect(contactLinks[0].closest("a")).toHaveAttribute("href", "/contact");
});

test("opens the mobile drawer when the menu button is clicked", () => {
	renderNav();
	fireEvent.click(screen.getByLabelText("Open menu"));
	expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=Navigation`
Expected: FAIL — `Cannot find module './Navigation'`.

- [ ] **Step 3: Create the styles**

Create `src/components/Navigation.module.scss`:

```scss
.navigation {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5rem 6rem;
	background-color: var(--bg-primary);
	color: var(--text-primary);
	border-bottom: 1px solid var(--border);
}

.logo {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border-radius: 50%;
	background: var(--bg-secondary);
	color: var(--text-primary) !important;
	text-decoration: none !important;
	cursor: pointer;
}

.links {
	display: flex;
	gap: 1.5rem;
}

.links a {
	color: var(--text-secondary);
	font-weight: 500;
}

.links a:hover {
	color: var(--accent);
	text-decoration: none;
}

.title {
	color: var(--text-primary) !important;
	font-weight: 700 !important;
}

.links li {
	list-style: none;
}

.menuButton {
	display: none !important;
	color: var(--text-primary) !important;
}

.drawerPaper {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 1rem;
	min-width: 220px;
	padding: 1.25rem 1.5rem;
	background-color: var(--bg-primary) !important;
	color: var(--text-primary);
}

.closeButton {
	color: var(--text-primary) !important;
}

.drawerLinks {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 1.25rem;
	width: 100%;
}

.drawerLinks li {
	list-style: none;
}

.drawerLinks a {
	color: var(--text-secondary);
	font-weight: 500;
	font-size: 1.1rem;
}

.drawerLinks a:hover {
	color: var(--accent);
	text-decoration: none;
}

@media (max-width: 767px) {
	.navigation {
		padding: 1.25rem 1.5rem;
	}

	.links {
		display: none;
	}

	.menuButton {
		display: inline-flex !important;
	}
}
```

- [ ] **Step 4: Implement the component**

Create `src/components/Navigation.tsx`:

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.scss";
import { Drawer, IconButton, Typography } from "@mui/material";
import { Close, Menu } from "@mui/icons-material";

const NAV_LINKS = [
	{ href: "/#experience", label: "experience" },
	{ href: "/#projects", label: "projects" },
	{ href: "/#skills", label: "skills" },
	{ href: "/#education", label: "education" },
	{ href: "/#certifications", label: "certifications" },
	{ href: "/contact", label: "contact" },
];

const NavLink = ({
	href,
	label,
	onClick,
}: {
	href: string;
	label: string;
	onClick?: () => void;
}) =>
	href.includes("#") ? (
		<a href={href} onClick={onClick}>
			{label}
		</a>
	) : (
		<Link to={href} onClick={onClick}>
			{label}
		</Link>
	);

const Navigation = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav id="navigation" className={styles.navigation}>
			<Link to="/" className={styles.logo} aria-label="Home">
				<Typography
					fontWeight={700}
					className={styles.title}
					variant="subtitle1"
				>
					PV
				</Typography>
			</Link>
			<ul className={styles.links}>
				{NAV_LINKS.map((link) => (
					<li key={link.href}>
						<NavLink href={link.href} label={link.label} />
					</li>
				))}
			</ul>
			<IconButton
				className={styles.menuButton}
				aria-label="Open menu"
				onClick={() => setMenuOpen(true)}
			>
				<Menu />
			</IconButton>
			<Drawer
				anchor="right"
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
				classes={{ paper: styles.drawerPaper }}
			>
				<IconButton
					className={styles.closeButton}
					aria-label="Close menu"
					onClick={() => setMenuOpen(false)}
				>
					<Close />
				</IconButton>
				<ul className={styles.drawerLinks}>
					{NAV_LINKS.map((link) => (
						<li key={link.href}>
							<NavLink
								href={link.href}
								label={link.label}
								onClick={() => setMenuOpen(false)}
							/>
						</li>
					))}
				</ul>
			</Drawer>
		</nav>
	);
};

export default Navigation;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=Navigation`
Expected: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/Navigation.tsx src/components/Navigation.module.scss src/components/Navigation.test.tsx
git commit -m "Add Navigation component"
```

---

### Task 6: `Footer` component

**Files:**
- Create: `src/components/Footer.tsx`
- Create: `src/components/Footer.module.scss`
- Test: `src/components/Footer.test.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `Footer` default export (no props) — consumed by Task 7 (`Home`) and Task 8 (`Contact`).

- [ ] **Step 1: Write the failing test**

Create `src/components/Footer.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

test("renders a contact link and the current year", () => {
	render(
		<MemoryRouter>
			<Footer />
		</MemoryRouter>
	);
	expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
		"href",
		"/contact"
	);
	expect(
		screen.getByText(`© ${new Date().getFullYear()}`)
	).toBeInTheDocument();
});

test("does not render a Source link", () => {
	render(
		<MemoryRouter>
			<Footer />
		</MemoryRouter>
	);
	expect(screen.queryByText("Source")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=Footer`
Expected: FAIL — `Cannot find module './Footer'`.

- [ ] **Step 3: Create the styles**

Create `src/components/Footer.module.scss`:

```scss
.footer {
	padding: 2.5rem 2rem;
	margin-top: 4em;
	text-align: center;
	background: var(--bg-primary);
	border-top: 1px solid var(--border);
}

.links {
	display: flex;
	justify-content: center;
	gap: 2rem;
	margin-bottom: 0.75rem;
}

.link {
	color: var(--text-secondary) !important;
	text-decoration: none !important;
	padding: 0 0 0.3em 0;
	position: relative;
}

.link:hover {
	color: var(--accent) !important;
	text-decoration: none !important;
}

.link:before {
	content: "";
	display: inline;
	width: 0%;
	height: 0.2em;
	position: absolute;
	bottom: 0;
	background-color: var(--accent);
	transition: width 0.2s ease-in;
}

.link:hover:before {
	width: 100%;
}

.copyright {
	color: var(--text-muted) !important;
	font-size: 0.875rem;
	margin: 0;
}
```

- [ ] **Step 4: Implement the component**

Create `src/components/Footer.tsx`:

```tsx
import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.links}>
				<Link to="/contact" className={styles.link}>
					Contact
				</Link>
			</div>
			<p className={styles.copyright}>© {new Date().getFullYear()}</p>
		</footer>
	);
};

export default Footer;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=Footer`
Expected: PASS, 2 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/Footer.tsx src/components/Footer.module.scss src/components/Footer.test.tsx
git commit -m "Add Footer component"
```

---

### Task 7: `Home` page

**Files:**
- Create: `src/pages/Home.tsx`
- Create: `src/pages/Home.module.css`
- Test: `src/pages/Home.test.tsx`

**Interfaces:**
- Consumes: `Navigation` (Task 5), `Footer` (Task 6), `Article` (Task 4), `PROFILE`, `SUMMARY`, `SKILLS`, `EXPERIENCE`, `EDUCATION`, `CERTIFICATIONS` (Task 2).
- Produces: `Home` default export (no props) — consumed by Task 8 (`App` routing).

- [ ] **Step 1: Write the failing test**

Create `src/pages/Home.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import { PROFILE, EXPERIENCE, CERTIFICATIONS } from "../constants";

test("renders hero content", () => {
	render(
		<MemoryRouter>
			<Home />
		</MemoryRouter>
	);
	expect(screen.getByText(`${PROFILE.name}.`)).toBeInTheDocument();
	expect(
		screen.getByText(`${PROFILE.title} · ${PROFILE.location}`)
	).toBeInTheDocument();
});

test("renders one entry per experience item", () => {
	render(
		<MemoryRouter>
			<Home />
		</MemoryRouter>
	);
	EXPERIENCE.forEach((job) => {
		expect(
			screen.getByText(`${job.role} · ${job.company}`)
		).toBeInTheDocument();
	});
});

test("renders the certifications section", () => {
	render(
		<MemoryRouter>
			<Home />
		</MemoryRouter>
	);
	expect(screen.getByText("CERTIFICATIONS")).toBeInTheDocument();
	CERTIFICATIONS.forEach((cert) => {
		expect(
			screen.getByText(`${cert.name} · ${cert.issuer}`)
		).toBeInTheDocument();
	});
});

test("resume button uses the placeholder link", () => {
	render(
		<MemoryRouter>
			<Home />
		</MemoryRouter>
	);
	expect(screen.getByRole("link", { name: "Resume" })).toHaveAttribute(
		"href",
		PROFILE.resumeUrl
	);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=pages/Home`
Expected: FAIL — `Cannot find module './Home'`.

- [ ] **Step 3: Create the styles**

Create `src/pages/Home.module.css`:

```css
.main {
	display: flex;
	flex-direction: column;
	padding: calc(3rem + var(--nav-height)) 6rem 4rem;
	min-height: 100vh;
	text-align: center;
	background: var(--bg-primary);
	color: var(--text-primary);
}

.hero,
.aboutButtons,
.skills {
	display: flex;
	align-items: center;
	justify-content: center;
}

.hero {
	flex-direction: column;
	gap: 1rem;
	margin-bottom: 4rem;
}

.heroTitle {
	font-size: clamp(1.75rem, 4vw, 2.5rem) !important;
	color: var(--text-primary) !important;
}

.subtitle {
	opacity: 1;
	color: var(--text-secondary) !important;
}

.aboutButtons {
	gap: 0.5rem;
	margin-top: 0.5rem;
}

.aboutButtons button {
	color: var(--text-primary) !important;
}

.resumeBtn {
	border-color: var(--accent) !important;
	color: var(--accent) !important;
}

.resumeBtn:hover {
	background: rgba(91, 163, 245, 0.12) !important;
	border-color: var(--accent-hover) !important;
	color: var(--accent-hover) !important;
}

.nameText {
	color: var(--accent);
}

.descriptionText {
	max-width: 640px;
	line-height: 1.75;
	color: var(--text-secondary) !important;
}

.section {
	margin-bottom: 4rem;
	text-align: left;
}

.scrollAnchor {
	display: block;
	padding-top: calc(var(--nav-height) + 1rem);
	margin-top: calc(-1 * (var(--nav-height) + 1rem));
}

.sectionTitle {
	margin-bottom: 1.5rem !important;
	text-align: center;
	color: var(--text-primary) !important;
}

.experienceList {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	max-width: 600px;
	margin: 0 auto;
}

.experienceItem {
	padding: 1rem 1.25rem;
	background: var(--bg-card);
	border-radius: 8px;
	border-left: 3px solid var(--accent);
}

.experienceItem p {
	color: var(--text-primary) !important;
}

.experienceItem span {
	color: var(--text-secondary) !important;
}

.skills {
	gap: 0.5rem;
	max-width: 700px;
	margin: 0 auto;
	flex-wrap: wrap;
	justify-content: center;
}

.skillTag {
	padding: 0.4rem 0.85rem;
	background: rgba(91, 163, 245, 0.12);
	border-radius: 6px;
	font-size: 0.875rem;
	color: var(--text-secondary);
	border: 1px solid var(--border);
}

.education {
	max-width: 500px;
	margin: 0 auto;
	padding: 1.25rem;
	background: var(--bg-card);
	border-radius: 8px;
}

.education p {
	color: var(--text-primary) !important;
}

.education p:last-child {
	color: var(--text-secondary) !important;
}

/* Mobile */
@media (max-width: 768px) {
	.main {
		padding: calc(2rem + var(--nav-height)) 1.5rem 3rem;
	}

	.hero {
		margin-bottom: 3rem;
	}

	.section {
		margin-bottom: 3rem;
	}
}
```

- [ ] **Step 4: Implement the page**

Create `src/pages/Home.tsx`:

```tsx
import styles from "./Home.module.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Article from "../layout/Article";
import { Button, Typography } from "@mui/material";
import {
	PROFILE,
	SUMMARY,
	SKILLS,
	EXPERIENCE,
	EDUCATION,
	CERTIFICATIONS,
} from "../constants";

export default function Home() {
	const allSkills = [
		...SKILLS.frontend,
		...SKILLS.backend,
		...SKILLS.tools,
		...SKILLS.itFoundation,
	].filter((s, i, arr) => arr.indexOf(s) === i);

	return (
		<div>
			<Navigation />
			<main className={styles.main}>
				<section className={styles.hero}>
					<Typography
						variant="h2"
						fontWeight={700}
						className={styles.heroTitle}
					>
						Hi, I&apos;m{" "}
						<span className={styles.nameText}>{PROFILE.name}.</span>
					</Typography>
					<Typography
						variant="h5"
						fontWeight={500}
						className={styles.subtitle}
					>
						{PROFILE.title} · {PROFILE.location}
					</Typography>
					<Typography
						variant="body1"
						fontWeight={500}
						className={styles.descriptionText}
					>
						{SUMMARY}
					</Typography>

					<div className={styles.aboutButtons}>
						<Button
							variant="outlined"
							target="_blank"
							href={PROFILE.resumeUrl}
							rel="noopener noreferrer"
							className={styles.resumeBtn}
						>
							Resume
						</Button>
					</div>
				</section>

				<section className={styles.section}>
					<span
						id="experience"
						className={styles.scrollAnchor}
						aria-hidden="true"
					/>
					<Typography
						variant="h5"
						fontWeight={600}
						className={styles.sectionTitle}
					>
						EXPERIENCE
					</Typography>
					<div className={styles.experienceList}>
						{EXPERIENCE.map((job, index) => (
							<div key={index} className={styles.experienceItem}>
								<Typography variant="subtitle1" fontWeight={600}>
									{job.role} · {job.company}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{job.period} ({job.type})
								</Typography>
							</div>
						))}
					</div>
				</section>

				<section className={styles.section}>
					<span
						id="projects"
						className={styles.scrollAnchor}
						aria-hidden="true"
					/>
					<Typography
						variant="h5"
						fontWeight={600}
						className={styles.sectionTitle}
					>
						PROJECTS
					</Typography>
					<Article />
				</section>

				<section className={styles.section}>
					<span
						id="skills"
						className={styles.scrollAnchor}
						aria-hidden="true"
					/>
					<Typography
						variant="h5"
						fontWeight={600}
						className={styles.sectionTitle}
					>
						SKILLS
					</Typography>
					<div className={styles.skills}>
						{allSkills.map((skill, index) => (
							<span key={index} className={styles.skillTag}>
								{skill}
							</span>
						))}
					</div>
				</section>

				<section className={styles.section}>
					<span
						id="education"
						className={styles.scrollAnchor}
						aria-hidden="true"
					/>
					<Typography
						variant="h5"
						fontWeight={600}
						className={styles.sectionTitle}
					>
						EDUCATION
					</Typography>
					<div className={styles.education}>
						<Typography variant="subtitle1" fontWeight={600}>
							{EDUCATION.school}
						</Typography>
						<Typography variant="body2">
							{EDUCATION.degree} ({EDUCATION.period})
						</Typography>
					</div>
				</section>

				<section className={styles.section}>
					<span
						id="certifications"
						className={styles.scrollAnchor}
						aria-hidden="true"
					/>
					<Typography
						variant="h5"
						fontWeight={600}
						className={styles.sectionTitle}
					>
						CERTIFICATIONS
					</Typography>
					<div className={styles.experienceList}>
						{CERTIFICATIONS.map((cert, index) => (
							<div key={index} className={styles.experienceItem}>
								<Typography variant="subtitle1" fontWeight={600}>
									{cert.name} · {cert.issuer}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{cert.year}
								</Typography>
							</div>
						))}
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=pages/Home`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.tsx src/pages/Home.module.css src/pages/Home.test.tsx
git commit -m "Add Home page"
```

---

### Task 8: `Contact` page, routing, and final smoke test

**Files:**
- Create: `src/pages/Contact.tsx`
- Create: `src/pages/Contact.module.css`
- Test: `src/pages/Contact.test.tsx`
- Modify: `src/App.tsx` (replace stub with real routing)
- Modify: `src/App.test.tsx` (replace stub with real routing test)

**Interfaces:**
- Consumes: `Navigation` (Task 5), `Footer` (Task 6), `PROFILE` (Task 2), `Home` (Task 7).
- Produces: final `App` default export (no props) rendering `Routes` for `/` and `/contact` — this is the top-level export `src/index.tsx` (Task 1) already renders.

- [ ] **Step 1: Write the failing test for Contact**

Create `src/pages/Contact.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Contact from "./Contact";
import { PROFILE } from "../constants";

test("renders email and phone contact cards", () => {
	render(
		<MemoryRouter>
			<Contact />
		</MemoryRouter>
	);
	expect(screen.getByRole("link", { name: /Email/i })).toHaveAttribute(
		"href",
		`mailto:${PROFILE.email}`
	);
	expect(screen.getByRole("link", { name: /Phone/i })).toHaveAttribute(
		"href",
		`tel:${PROFILE.phone.replace(/\s/g, "")}`
	);
});

test("does not render LinkedIn or GitHub cards", () => {
	render(
		<MemoryRouter>
			<Contact />
		</MemoryRouter>
	);
	expect(screen.queryByText("LinkedIn")).not.toBeInTheDocument();
	expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
});

test("has a link back to home", () => {
	render(
		<MemoryRouter>
			<Contact />
		</MemoryRouter>
	);
	expect(
		screen.getByRole("link", { name: /Back to Home/i })
	).toHaveAttribute("href", "/");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=pages/Contact`
Expected: FAIL — `Cannot find module './Contact'`.

- [ ] **Step 3: Create the styles**

Create `src/pages/Contact.module.css`:

```css
.wrapper {
	min-height: 100vh;
	background: var(--bg-primary);
}

.main {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: calc(4rem + var(--nav-height)) 2rem 4rem;
	max-width: 800px;
	margin: 0 auto;
}

.title {
	color: var(--text-primary) !important;
	margin-bottom: 1rem !important;
}

.subtitle {
	color: var(--text-secondary) !important;
	margin-bottom: 4rem;
	text-align: center;
}

.links {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1.5rem;
	width: 100%;
	padding-top: 1.5rem;
	margin-bottom: 3rem;
}

.contactCard {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
	padding: 2rem 1.5rem;
	background: var(--bg-card);
	border: 1px solid var(--border);
	border-radius: 12px;
	text-decoration: none;
	color: var(--text-primary);
	transition:
		transform 0.2s ease,
		border-color 0.2s ease,
		box-shadow 0.2s ease;
}

.contactCard:hover {
	transform: translateY(-4px);
	border-color: rgba(91, 163, 245, 0.4);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
	color: var(--text-primary);
}

.contactCard svg {
	color: var(--accent);
}

.contactCard p {
	color: var(--text-secondary) !important;
}

.backLink {
	color: var(--accent) !important;
	text-decoration: none !important;
	font-weight: 500;
	transition: opacity 0.2s;
}

.backLink:hover {
	opacity: 0.85;
	color: var(--accent-hover) !important;
}
```

- [ ] **Step 4: Implement the Contact page**

Create `src/pages/Contact.tsx`:

```tsx
import { Typography } from "@mui/material";
import { Email, Phone } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { PROFILE } from "../constants";
import styles from "./Contact.module.css";

export default function Contact() {
	return (
		<div className={styles.wrapper}>
			<Navigation />
			<main className={styles.main}>
				<Typography variant="h4" fontWeight={700} className={styles.title}>
					Get in Touch
				</Typography>
				<Typography variant="body1" className={styles.subtitle}>
					Open to new opportunities and collaborations. Let&apos;s connect!
				</Typography>

				<div className={styles.links}>
					<a
						href={`mailto:${PROFILE.email}`}
						className={styles.contactCard}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Email fontSize="large" />
						<Typography variant="subtitle1" fontWeight={600}>
							Email
						</Typography>
						<Typography variant="body2">{PROFILE.email}</Typography>
					</a>

					<a
						href={`tel:${PROFILE.phone.replace(/\s/g, "")}`}
						className={styles.contactCard}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Phone fontSize="large" />
						<Typography variant="subtitle1" fontWeight={600}>
							Phone
						</Typography>
						<Typography variant="body2">{PROFILE.phone}</Typography>
					</a>
				</div>

				<Link to="/" className={styles.backLink}>
					← Back to Home
				</Link>
			</main>
			<Footer />
		</div>
	);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=pages/Contact`
Expected: PASS, 3 tests.

- [ ] **Step 6: Write the failing test for final App routing**

Replace the full contents of `src/App.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { PROFILE } from "./constants";

test("renders the hero section at /", () => {
	render(
		<MemoryRouter initialEntries={["/"]}>
			<App />
		</MemoryRouter>
	);
	expect(screen.getByText(`${PROFILE.name}.`)).toBeInTheDocument();
});

test("renders the contact page at /contact", () => {
	render(
		<MemoryRouter initialEntries={["/contact"]}>
			<App />
		</MemoryRouter>
	);
	expect(screen.getByText(/Get in Touch/i)).toBeInTheDocument();
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=App.test`
Expected: FAIL — the old stub `App` renders "Piolo Valledor Portfolio", not the hero/contact content.

- [ ] **Step 8: Replace the App stub with real routing**

Replace the full contents of `src/App.tsx` with:

```tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/contact" element={<Contact />} />
		</Routes>
	);
}

export default App;
```

- [ ] **Step 9: Run test to verify it passes**

Run: `CI=true npm test -- --watchAll=false --testPathPattern=App.test`
Expected: PASS, 2 tests.

- [ ] **Step 10: Run the full test suite**

Run: `CI=true npm test -- --watchAll=false`
Expected: all test suites pass (constants, ContentCard, Article, Navigation, Footer, Home, Contact, App).

- [ ] **Step 11: Typecheck and build**

Run: `npm run typecheck && npm run build`
Expected: both succeed with no errors.

- [ ] **Step 12: Commit**

```bash
git add src/pages/Contact.tsx src/pages/Contact.module.css src/pages/Contact.test.tsx src/App.tsx src/App.test.tsx
git commit -m "Add Contact page and wire up routing"
```

---

### Task 9: Manual verification in the browser

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run in the background: `npm start`
Wait for "Compiled successfully" and the server listening on `http://localhost:3000`.

- [ ] **Step 2: Load the homepage and check the hero, nav, and sections**

Using the claude-in-chrome browser tools, navigate to `http://localhost:3000/`. Confirm:
- Hero shows "Hi, I'm Piolo B. Valledor." and "Aspiring Frontend / React Developer".
- Nav bar shows "PV" logo and links: experience, projects, skills, education, certifications, contact.
- Scrolling or clicking "experience"/"projects"/"skills"/"education"/"certifications" jumps to the matching section.
- Projects section shows both "Personal Portfolio Website" and "Bakasyunan Tanay Resort and Conference Center — Booking Website" cards.
- Certifications section shows both TESDA and BOSH SO1 entries.
- No LinkedIn/GitHub icons appear anywhere on the page.

- [ ] **Step 3: Check the mobile nav drawer**

Resize the browser window to a narrow (mobile) width. Confirm the desktop nav links disappear, a menu button appears, and clicking it opens a drawer with the same links; clicking a link closes the drawer.

- [ ] **Step 4: Check the Contact page**

Click "contact" in the nav (or navigate to `http://localhost:3000/contact`). Confirm:
- "Get in Touch" heading renders.
- Email and Phone cards render with Piolo's actual email/phone.
- No LinkedIn/GitHub cards render.
- "← Back to Home" link returns to `/`.

- [ ] **Step 5: Stop the dev server**

Stop the background `npm start` process.

---

## Execution notes

- Every task after Task 1 depends only on tasks strictly before it — safe to execute in order.
- If any test step fails unexpectedly (not the intentional "FAIL" in a red step), stop and diagnose before continuing — don't paper over a red test by weakening the assertion.
