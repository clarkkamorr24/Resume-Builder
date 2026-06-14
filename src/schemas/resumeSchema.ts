import { z } from 'zod'

const optionalUrl = z
  .string()
  .trim()
  .url('Please enter a valid URL')
  .or(z.literal(''))
  .optional()

export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  title: z.string().trim().min(1, 'Professional title is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  location: z.string().trim().min(1, 'Location is required'),
  linkedin: optionalUrl,
  website: optionalUrl,
  summary: z
    .string()
    .trim()
    .min(1, 'Professional summary is required')
    .max(1200, 'Summary is too long'),
})

export const educationSchema = z.object({
  id: z.string(),
  school: z.string().trim().min(1, 'School name is required'),
  degree: z.string().trim().min(1, 'Degree is required'),
  fieldOfStudy: z.string().trim(),
  startDate: z.string().trim().min(1, 'Start date is required'),
  endDate: z.string().trim(),
  gpa: z.string().trim(),
  description: z.string().trim(),
})

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().trim().min(1, 'Company name is required'),
  position: z.string().trim().min(1, 'Position is required'),
  location: z.string().trim(),
  startDate: z.string().trim().min(1, 'Start date is required'),
  endDate: z.string().trim(),
  current: z.boolean(),
  responsibilities: z
    .string()
    .trim()
    .min(1, 'Responsibilities are required'),
})

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, 'Skill name is required'),
  category: z.string().trim().min(1, 'Category is required'),
})

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, 'Project name is required'),
  description: z.string().trim().min(1, 'Description is required'),
  technologies: z.string().trim().min(1, 'Technologies are required'),
  github: optionalUrl,
  demo: optionalUrl,
})

export const resumeSchema = z.object({
  personal: personalInfoSchema,
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  skills: z.array(skillSchema).min(1, 'Add at least one skill'),
  projects: z.array(projectSchema),
})

export type ResumeSchema = typeof resumeSchema
