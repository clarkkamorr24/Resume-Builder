import { Briefcase, FolderGit2, GraduationCap, User, Wrench } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PersonalInfoForm } from './PersonalInfoForm'
import { ExperienceForm } from './ExperienceForm'
import { EducationForm } from './EducationForm'
import { SkillsForm } from './SkillsForm'
import { ProjectsForm } from './ProjectsForm'

const SECTIONS = [
  { value: 'personal', label: 'Personal', icon: User, Form: PersonalInfoForm },
  { value: 'experience', label: 'Experience', icon: Briefcase, Form: ExperienceForm },
  { value: 'education', label: 'Education', icon: GraduationCap, Form: EducationForm },
  { value: 'skills', label: 'Skills', icon: Wrench, Form: SkillsForm },
  { value: 'projects', label: 'Projects', icon: FolderGit2, Form: ProjectsForm },
] as const

export function ResumeForm() {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
        {SECTIONS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="gap-1.5 border data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {SECTIONS.map(({ value, Form }) => (
        <TabsContent key={value} value={value} className="mt-6">
          <Form />
        </TabsContent>
      ))}
    </Tabs>
  )
}
