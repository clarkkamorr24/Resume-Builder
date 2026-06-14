import type { z } from 'zod'
import type {
  personalInfoSchema,
  educationSchema,
  experienceSchema,
  skillSchema,
  projectSchema,
  resumeSchema,
} from '@/schemas/resumeSchema'

export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type Education = z.infer<typeof educationSchema>
export type Experience = z.infer<typeof experienceSchema>
export type Skill = z.infer<typeof skillSchema>
export type Project = z.infer<typeof projectSchema>
export type Resume = z.infer<typeof resumeSchema>

export type TemplateId = 'classic' | 'modern'

export interface TemplateProps {
  resume: Resume
  accent: string
  font: string
}

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Soft Skills',
  'Tools',
  'Other',
] as const

export type SkillCategory = (typeof SKILL_CATEGORIES)[number]
