# Resume Builder — ATS-Friendly

A modern resume builder built with **React 19, Vite, TypeScript, Tailwind CSS,
shadcn-style UI, React Hook Form, Zod, Zustand, @react-pdf/renderer**.

Create, edit, live-preview and export a professional resume to PDF, with two
ATS-optimized templates (Classic & Modern).

## Features

- **Live split-screen preview** — form on the left, resume on the right,
  updating as you type. On mobile, toggle between Editor and Preview.
- **Two ATS-friendly templates** — switch instantly between **Classic**
  (single-column, black & white) and **Modern** (accent colour, clean
  typography). Both use semantic HTML, no layout tables and clear headings.
- **Validated sections** — Personal Info, Experience, Education, Skills and
  Projects, each validated with Zod + React Hook Form (inline errors, required
  `*` markers, submit validation before export).
- **Repeatable entries** — add / edit / delete / reorder education, experience
  and project entries; categorised skills with badges.
- **PDF export** — real, **text-based** multi-page A4 PDF via @react-pdf/renderer
  (selectable, machine-readable text that ATS systems can parse — not a
  rasterised image). The engine is lazy-loaded only on first export.
- **Print preview** — a Print button (and Ctrl/Cmd+P) opens a clean,
  resume-only print preview via a dedicated print stylesheet.
- **Import & export** — export an exact JSON backup and re-import it any time;
  also import an existing **PDF or DOCX** résumé, whose text is parsed
  (best-effort, heuristic) into the form fields for editing. Parser libraries
  (`pdfjs-dist`, `mammoth`) are lazy-loaded only when a file is imported.
- **Auto-save** — data and template choice persist to `localStorage` (Zustand
  `persist`), surviving refreshes.
- **Dark mode**, **toast notifications**, **loading states**, **reset / load
  sample** — full SaaS-style UX.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
├── components/
│   ├── resume/        # ResumeForm + section forms + ResumePreview
│   ├── templates/     # ClassicTemplate, ModernTemplate (on-screen HTML)
│   ├── pdf/           # ClassicPdf, ModernPdf (@react-pdf/renderer documents)
│   ├── shared/        # FormField, SectionControls, ColorPicker
│   └── ui/            # shadcn-style primitives (button, input, dialog, ...)
├── hooks/             # useTheme, use-toast
├── lib/               # utils, pdf export
├── schemas/           # resumeSchema (Zod) — single source of truth
├── store/             # useResumeStore (Zustand + persist)
└── types/             # domain types inferred from the Zod schemas
```

## Architecture notes

- **Single source of truth for types:** all domain types in
  [`src/types/resume.ts`](src/types/resume.ts) are `z.infer`-ed from the Zod
  schemas, so validation and typing can never drift.
- **React Hook Form** holds the editing state and validates on change; a
  `watch` subscription mirrors changes into the Zustand store, which drives the
  live preview and auto-saves to `localStorage`.
- **Two renderings, one data model:** the on-screen preview is styled HTML
  (`components/templates`) for fast, themeable live editing, while export uses
  parallel `@react-pdf/renderer` documents (`components/pdf`) that emit real,
  selectable PDF text. Accent colour and font choice flow into both. This keeps
  the exported resume ATS-parseable rather than a flat image.
