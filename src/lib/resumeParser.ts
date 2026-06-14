import type { Resume } from '@/types/resume'
import { emptyResume } from '@/store/useResumeStore'
import { uid } from '@/lib/utils'

const SECTION_PATTERNS: { key: SectionKey; re: RegExp }[] = [
  { key: 'summary', re: /^(professional\s+)?(summary|profile|objective|about(\s+me)?)\s*:?$/i },
  { key: 'experience', re: /^(work\s+|professional\s+|employment\s+)?(experience|history|employment)\s*:?$/i },
  { key: 'education', re: /^(education|academic(\s+background)?|qualifications)\s*:?$/i },
  { key: 'skills', re: /^(technical\s+|core\s+)?(skills|competencies|technologies)\s*:?$/i },
  { key: 'projects', re: /^(personal\s+|key\s+)?(projects|portfolio)\s*:?$/i },
]

type SectionKey = 'summary' | 'experience' | 'education' | 'skills' | 'projects'

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/
const LINKEDIN_RE = /((https?:\/\/)?(www\.)?linkedin\.com\/[^\s|]+)/i
const URL_RE = /((https?:\/\/)[^\s|]+|(www\.)[^\s|]+)/i
const DATE_RE = /\b(19|20)\d{2}\b|present|current/i

const MONTHS: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
}
const MON = '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?'
const RANGE_RE = new RegExp(
  `(?:${MON}\\s+)?((?:19|20)\\d{2})\\s*(?:[-–—]|to)\\s*(?:(present|current)|(?:${MON}\\s+)?((?:19|20)\\d{2}))`,
  'i',
)
const SINGLE_RE = new RegExp(`(?:${MON}\\s+)?((?:19|20)\\d{2})`, 'i')

function ym(monthWord: string | undefined, year: string): string {
  if (!year) return ''
  const m = monthWord ? MONTHS[monthWord.slice(0, 3).toLowerCase()] : ''
  return m ? `${year}-${m}` : year
}

interface ParsedDate {
  text: string
  start: string
  end: string
  current: boolean
}

function extractDate(line: string): ParsedDate | null {
  const r = line.match(RANGE_RE)
  if (r) {
    const current = Boolean(r[3])
    return {
      text: r[0],
      start: ym(r[1], r[2]),
      end: current ? '' : ym(r[4], r[5]),
      current,
    }
  }
  const s = line.match(SINGLE_RE)
  if (s) {
    return { text: s[0], start: ym(s[1], s[2]), end: '', current: false }
  }
  return null
}

function normalize(text: string): string[] {
  return text
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/[•▪◦·‣]/g, '').trim())
    .filter((l) => l.length > 0)
}

function isContactLine(line: string): boolean {
  return (
    EMAIL_RE.test(line) ||
    PHONE_RE.test(line) ||
    /linkedin\.com|github\.com|https?:\/\//i.test(line)
  )
}

function matchSection(line: string): SectionKey | null {
  const cleaned = line.replace(/[:|].*$/, '').trim()
  for (const { key, re } of SECTION_PATTERNS) {
    if (re.test(line) || re.test(cleaned)) return key
  }
  return null
}

function splitSections(lines: string[]) {
  const header: string[] = []
  const sections: Record<SectionKey, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
  }
  let current: SectionKey | null = null

  for (const line of lines) {
    const section = matchSection(line)
    if (section) {
      current = section
      continue
    }
    if (current) sections[current].push(line)
    else header.push(line)
  }
  return { header, sections }
}

function parseContacts(lines: string[]): Resume['personal'] {
  const joined = lines.join('  ')
  const email = joined.match(EMAIL_RE)?.[0] ?? ''
  const linkedin = joined.match(LINKEDIN_RE)?.[0] ?? ''
  const phone = lines.map((l) => l.match(PHONE_RE)?.[0]).find(Boolean) ?? ''
  let website = ''
  for (const l of lines) {
    const u = l.match(URL_RE)?.[0]
    if (u && !/linkedin\.com|github\.com/i.test(u)) {
      website = u
      break
    }
  }

  const nonContact = lines.filter((l) => !isContactLine(l))
  const fullName = nonContact[0] ?? ''
  let title = ''
  if (nonContact[1] && nonContact[1].length <= 80 && !/^location|^address/i.test(nonContact[1])) {
    title = nonContact[1]
  }

  const LOCATION_RE = /\b([A-Z][A-Za-z.'-]+(?:\s[A-Z][A-Za-z.'-]+)*,\s*(?:[A-Z]{2}|[A-Z][a-z.'-]+(?:\s[A-Z][a-z.'-]+)*))\b/
  let location = ''
  for (const l of lines) {
    for (const seg of l.split(/[|•·•]/).map((s) => s.trim())) {
      if (!seg || isContactLine(seg) || seg === fullName || seg === title) continue
      const m = seg.match(LOCATION_RE)
      if (m) {
        location = m[1]
        break
      }
    }
    if (location) break
  }

  return {
    fullName: withPrefix(fullName),
    title,
    email,
    phone: phone.trim(),
    location,
    linkedin: withPrefix(linkedin),
    website: withPrefix(website),
    summary: '',
  }
}

function withPrefix(url: string): string {
  if (!url) return url
  if (/@/.test(url) && !/^https?:/i.test(url)) return url
  if (/^(www\.|linkedin\.com|github\.com)/i.test(url)) return `https://${url}`
  return url
}

function parseSkills(lines: string[]): Resume['skills'] {
  const skills: Resume['skills'] = []
  for (const line of lines) {
    const m = line.match(/^([A-Za-z /&+]+):\s*(.+)$/)
    if (m && m[2].includes(',')) {
      const category = m[1].trim()
      for (const name of m[2].split(/[,;]/).map((s) => s.trim()).filter(Boolean)) {
        skills.push({ id: uid('sk'), name, category })
      }
    } else {
      for (const name of line.split(/[,;|]/).map((s) => s.trim()).filter(Boolean)) {
        if (name.length <= 40) skills.push({ id: uid('sk'), name, category: 'Other' })
      }
    }
  }
  return skills
}

interface DateChunk {
  head: string
  start: string
  end: string
  current: boolean
  body: string[]
}

function chunkByDate(lines: string[]): DateChunk[] {
  const entries: DateChunk[] = []
  let cur: DateChunk | null = null
  for (const line of lines) {
    const date = DATE_RE.test(line) ? extractDate(line) : null
    if (date) {
      if (cur) entries.push(cur)
      const head = line
        .replace(date.text, '')
        .replace(/[-–—|,]\s*$/, '')
        .replace(/^\s*[-–—|,]/, '')
        .trim()
      cur = { head, start: date.start, end: date.end, current: date.current, body: [] }
    } else if (cur) {
      cur.body.push(line)
    } else {
      cur = { head: line, start: '', end: '', current: false, body: [] }
    }
  }
  if (cur) entries.push(cur)
  return entries
}

function reflowToBullets(lines: string[]): string {
  const bullets: string[] = []
  let buf = ''
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    buf = buf ? `${buf} ${line}` : line
    if (/[.!?]$/.test(line)) {
      bullets.push(buf.trim())
      buf = ''
    }
  }
  if (buf.trim()) bullets.push(buf.trim())
  return bullets.join('\n')
}

function looksLikeOrg(line: string): boolean {
  return (
    line.length > 0 &&
    line.length <= 70 &&
    !/[.!?]$/.test(line) &&
    /[A-Za-z]/.test(line) &&
    !/^technology used/i.test(line)
  )
}

function parseExperience(lines: string[]): Resume['experience'] {
  return chunkByDate(lines).map((e) => {
    const parts = e.head.split(/\s+(?:at|@|[-–—|,])\s+/).map((p) => p.trim())
    const position = parts[0] ?? ''
    let company = parts[1] ?? ''
    const body = [...e.body]

    if (!company && body.length && looksLikeOrg(body[0])) {
      company = body.shift()!.trim()
    }

    return {
      id: uid('exp'),
      company,
      position,
      location: '',
      startDate: e.start,
      endDate: e.end,
      current: e.current,
      responsibilities: reflowToBullets(body),
    }
  })
}

function parseEducation(lines: string[]): Resume['education'] {
  return chunkByDate(lines).map((e) => {
    const parts = e.head.split(/\s+(?:[-–—|,])\s+/).map((p) => p.trim())
    const body = [...e.body]
    let school = parts[0] ?? e.head
    let degree = parts[1] ?? ''
    const fieldOfStudy = parts[2] ?? ''
    if (!degree && body.length && /bachelor|master|associate|b\.?s|m\.?s|ph\.?d|diploma/i.test(body[0])) {
      degree = body.shift()!.trim()
    }
    if (!school) school = e.head
    return {
      id: uid('edu'),
      school,
      degree,
      fieldOfStudy,
      startDate: e.start,
      endDate: e.end,
      gpa: e.body.join(' ').match(/GPA[:\s]*([\d.]+)/i)?.[1] ?? '',
      description: '',
    }
  })
}

function parseProjects(lines: string[]): Resume['projects'] {
  const projects: Resume['projects'] = []
  let cur: Resume['projects'][number] | null = null
  for (const line of lines) {
    const looksLikeName = line.length <= 60 && /^[A-Z0-9]/.test(line)
    if (looksLikeName && (!cur || cur.description)) {
      if (cur) projects.push(cur)
      cur = {
        id: uid('prj'),
        name: line,
        description: '',
        technologies: '',
        github: '',
        demo: '',
      }
    } else if (cur) {
      cur.description = cur.description ? `${cur.description} ${line}` : line
    }
  }
  if (cur) projects.push(cur)
  return projects
}

export function parseResumeText(text: string): Resume {
  const lines = normalize(text)
  const { header, sections } = splitSections(lines)

  const personal = parseContacts(header)
  personal.summary = sections.summary.join(' ').trim()

  return {
    ...emptyResume,
    personal,
    experience: parseExperience(sections.experience),
    education: parseEducation(sections.education),
    skills: parseSkills(sections.skills),
    projects: parseProjects(sections.projects),
  }
}
