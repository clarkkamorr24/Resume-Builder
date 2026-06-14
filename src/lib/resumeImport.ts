import type { Resume } from '@/types/resume'
import { resumeSchema } from '@/schemas/resumeSchema'
import { emptyResume } from '@/store/useResumeStore'
import { resumeFileName, uid } from '@/lib/utils'
import { parseResumeText } from '@/lib/resumeParser'

export type ImportResult = {
  resume: Resume
  fidelity: 'exact' | 'heuristic'
}

async function extractPdfText(file: File): Promise<ExtractResult> {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()

  const data = await file.arrayBuffer()
  const doc = await pdfjs.getDocument({ data }).promise
  const pages: string[] = []
  const urls: string[] = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    const rows = new Map<number, { x: number; s: string }[]>()
    for (const item of content.items as { str: string; transform: number[] }[]) {
      if (!('str' in item)) continue
      const y = Math.round(item.transform[5])
      const x = item.transform[4]
      if (!rows.has(y)) rows.set(y, [])
      rows.get(y)!.push({ x, s: item.str })
    }
    const lines = [...rows.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, parts]) =>
        parts
          .sort((a, b) => a.x - b.x)
          .map((p) => p.s)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim(),
      )
    pages.push(lines.join('\n'))

    const annotations = (await page.getAnnotations()) as {
      url?: string
      unsafeUrl?: string
    }[]
    for (const a of annotations) {
      const url = a.url ?? a.unsafeUrl
      if (url) urls.push(url)
    }
  }
  return { text: pages.join('\n'), urls }
}

async function extractDocxText(file: File): Promise<ExtractResult> {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const { value: text } = await mammoth.extractRawText({ arrayBuffer })
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer })
  const urls = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
  return { text, urls }
}

interface ExtractResult {
  text: string
  urls: string[]
}

function assignLinks(resume: Resume, urls: string[]): void {
  const clean = urls
    .map((u) => u.trim())
    .filter((u) => /^https?:\/\//i.test(u) || /^mailto:/i.test(u))

  if (!resume.personal.linkedin) {
    const li = clean.find((u) => /linkedin\.com/i.test(u))
    if (li) resume.personal.linkedin = li
  }
  if (!resume.personal.website) {
    const web = clean.find(
      (u) =>
        /^https?:\/\//i.test(u) &&
        !/linkedin\.com|github\.com|mailto:/i.test(u),
    )
    if (web) resume.personal.website = web
  }
}

function coerceJsonResume(raw: unknown): Resume {
  const parsed = resumeSchema.safeParse(raw)
  if (parsed.success) return parsed.data

  const obj = (raw ?? {}) as Partial<Resume>
  const withIds = <T extends { id?: string }>(arr: T[] | undefined, prefix: string) =>
    Array.isArray(arr) ? arr.map((x) => ({ ...x, id: x.id || uid(prefix) })) : []

  return {
    ...emptyResume,
    ...obj,
    personal: { ...emptyResume.personal, ...(obj.personal ?? {}) },
    experience: withIds(obj.experience as Resume['experience'], 'exp'),
    education: withIds(obj.education as Resume['education'], 'edu'),
    skills: withIds(obj.skills as Resume['skills'], 'sk'),
    projects: withIds(obj.projects as Resume['projects'], 'prj'),
  } as Resume
}

export async function importResumeFile(file: File): Promise<ImportResult> {
  const name = file.name.toLowerCase()

  if (name.endsWith('.json')) {
    const text = await file.text()
    return { resume: coerceJsonResume(JSON.parse(text)), fidelity: 'exact' }
  }

  let extracted: ExtractResult
  if (name.endsWith('.pdf')) {
    extracted = await extractPdfText(file)
  } else if (name.endsWith('.docx')) {
    extracted = await extractDocxText(file)
  } else {
    throw new Error('Unsupported file type. Use a .json, .pdf, or .docx file.')
  }

  if (!extracted.text.trim()) {
    throw new Error('No readable text found in the file.')
  }
  const resume = parseResumeText(extracted.text)
  assignLinks(resume, extracted.urls)
  return { resume, fidelity: 'heuristic' }
}

export function exportResumeJson(resume: Resume): void {
  const blob = new Blob([JSON.stringify(resume, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = resumeFileName(resume.personal.fullName).replace(/\.pdf$/, '.json')
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
