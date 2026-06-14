import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export function isResumeEmpty(resume: {
  personal: Record<string, string>
  experience: unknown[]
  education: unknown[]
  skills: unknown[]
  projects: unknown[]
}): boolean {
  const noPersonal = Object.values(resume.personal).every(
    (v) => !v || v.trim() === '',
  )
  return (
    noPersonal &&
    resume.experience.length === 0 &&
    resume.education.length === 0 &&
    resume.skills.length === 0 &&
    resume.projects.length === 0
  )
}

export function resumeFileName(fullName: string): string {
  const base = fullName.trim() || 'resume'
  const slug = base.replace(/\s+/g, '_').replace(/[^\w-]/g, '')
  return `${slug}_Resume.pdf`
}

export function formatMonth(value?: string): string {
  if (!value) return ''
  const [year, month] = value.split('-')
  if (!year) return value
  if (!month) return year
  const date = new Date(Number(year), Number(month) - 1, 1)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function dateRange(
  start?: string,
  end?: string,
  current?: boolean,
): string {
  const from = formatMonth(start)
  const to = current ? 'Present' : formatMonth(end)
  if (from && to) return `${from} – ${to}`
  return from || to || ''
}

export function toBullets(value?: string): string[] {
  if (!value) return []
  return value
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
}
