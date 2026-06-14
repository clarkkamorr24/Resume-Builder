import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Resume, TemplateId } from '@/types/resume'
import { uid } from '@/lib/utils'

export const emptyResume: Resume = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
}

export const sampleResume: Resume = {
  personal: {
    fullName: 'Alex Morgan',
    title: 'Senior Frontend Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/alexmorgan',
    website: 'https://alexmorgan.dev',
    summary:
      'Frontend engineer with 7+ years building accessible, high-performance web applications. Specialised in React, TypeScript and design systems, with a track record of shipping products used by millions and mentoring growing teams.',
  },
  experience: [
    {
      id: uid('exp'),
      company: 'Acme Corp',
      position: 'Senior Frontend Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      responsibilities:
        'Led the migration of a legacy Angular app to React and TypeScript, cutting page load times by 45%.\nBuilt a reusable component library adopted by 6 product teams.\nMentored 4 engineers and established frontend testing standards.',
    },
    {
      id: uid('exp'),
      company: 'Brightline Labs',
      position: 'Frontend Engineer',
      location: 'Remote',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      responsibilities:
        'Developed customer-facing dashboards with React and D3, improving engagement by 30%.\nCollaborated with designers to ship an accessible (WCAG 2.1 AA) design system.',
    },
  ],
  education: [
    {
      id: uid('edu'),
      school: 'University of California, Berkeley',
      degree: 'B.S.',
      fieldOfStudy: 'Computer Science',
      startDate: '2014-08',
      endDate: '2018-05',
      gpa: '3.8',
      description: '',
    },
  ],
  skills: [
    { id: uid('sk'), name: 'React', category: 'Frontend' },
    { id: uid('sk'), name: 'TypeScript', category: 'Frontend' },
    { id: uid('sk'), name: 'Tailwind CSS', category: 'Frontend' },
    { id: uid('sk'), name: 'Node.js', category: 'Backend' },
    { id: uid('sk'), name: 'PostgreSQL', category: 'Database' },
    { id: uid('sk'), name: 'Docker', category: 'DevOps' },
    { id: uid('sk'), name: 'Mentorship', category: 'Soft Skills' },
  ],
  projects: [
    {
      id: uid('prj'),
      name: 'OpenChart',
      description:
        'An open-source charting library focused on accessibility and performance, with 2k+ GitHub stars.',
      technologies: 'React, TypeScript, D3, Vite',
      github: 'https://github.com/example/openchart',
      demo: 'https://openchart.dev',
    },
  ],
}

export const DEFAULT_ACCENT = '#7c3aed'

export const FONT_OPTIONS = [
  { label: 'Inter / System', value: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  { label: 'Arial', value: 'Arial, "Helvetica Neue", Helvetica, sans-serif' },
  { label: 'Calibri', value: 'Calibri, "Segoe UI", Candara, sans-serif' },
  { label: 'Georgia', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
] as const

export const DEFAULT_FONT = FONT_OPTIONS[0].value

interface ResumeState {
  resume: Resume
  template: TemplateId
  accentColor: string
  fontFamily: string
  setResume: (resume: Resume) => void
  setTemplate: (template: TemplateId) => void
  setAccentColor: (color: string) => void
  setFontFamily: (font: string) => void
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resume: emptyResume,
      template: 'modern',
      accentColor: DEFAULT_ACCENT,
      fontFamily: DEFAULT_FONT,
      setResume: (resume) => set({ resume }),
      setTemplate: (template) => set({ template }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
    }),
    {
      name: 'resume-builder-store',
      version: 2,
      partialize: (s) => ({
        resume: s.resume,
        template: s.template,
        accentColor: s.accentColor,
        fontFamily: s.fontFamily,
      }),
    },
  ),
)
