import { useFieldArray, useFormContext } from 'react-hook-form'
import { FolderGit2, Plus } from 'lucide-react'
import type { Resume } from '@/types/resume'
import { uid } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { FormField } from '@/components/shared/FormField'
import { SectionControls } from '@/components/shared/SectionControls'

export function ProjectsForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<Resume>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'projects',
  })

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          No projects added yet.
        </p>
      )}

      {fields.map((field, index) => {
        const e = errors.projects?.[index]
        return (
          <Card key={field.id}>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FolderGit2 className="h-4 w-4" />
                  Project {index + 1}
                </div>
                <SectionControls
                  index={index}
                  count={fields.length}
                  label="project entry"
                  onMoveUp={() => move(index, index - 1)}
                  onMoveDown={() => move(index, index + 1)}
                  onRemove={() => remove(index)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Project Name"
                  required
                  error={e?.name?.message}
                  className="sm:col-span-2"
                >
                  <Input
                    placeholder="Project title"
                    {...register(`projects.${index}.name`)}
                  />
                </FormField>
                <FormField
                  label="Description"
                  required
                  error={e?.description?.message}
                  className="sm:col-span-2"
                >
                  <Textarea
                    rows={3}
                    placeholder="What the project does and your impact..."
                    {...register(`projects.${index}.description`)}
                  />
                </FormField>
                <FormField
                  label="Technologies Used"
                  required
                  error={e?.technologies?.message}
                  description="Comma-separated, e.g. React, Node.js, PostgreSQL"
                  className="sm:col-span-2"
                >
                  <Input
                    placeholder="React, Node.js, PostgreSQL"
                    {...register(`projects.${index}.technologies`)}
                  />
                </FormField>
                <FormField label="GitHub URL" error={e?.github?.message}>
                  <Input
                    placeholder="https://github.com/..."
                    {...register(`projects.${index}.github`)}
                  />
                </FormField>
                <FormField label="Live Demo URL" error={e?.demo?.message}>
                  <Input
                    placeholder="https://..."
                    {...register(`projects.${index}.demo`)}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() =>
          append({
            id: uid('prj'),
            name: '',
            description: '',
            technologies: '',
            github: '',
            demo: '',
          })
        }
      >
        <Plus className="h-4 w-4" /> Add Project
      </Button>
    </div>
  )
}
