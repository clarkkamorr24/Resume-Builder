import { useFieldArray, useFormContext } from 'react-hook-form'
import { GraduationCap, Plus } from 'lucide-react'
import type { Resume } from '@/types/resume'
import { uid } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { FormField } from '@/components/shared/FormField'
import { SectionControls } from '@/components/shared/SectionControls'

export function EducationForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<Resume>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'education',
  })

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          No education added yet.
        </p>
      )}

      {fields.map((field, index) => {
        const e = errors.education?.[index]
        return (
          <Card key={field.id}>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  Education {index + 1}
                </div>
                <SectionControls
                  index={index}
                  count={fields.length}
                  label="education entry"
                  onMoveUp={() => move(index, index - 1)}
                  onMoveDown={() => move(index, index + 1)}
                  onRemove={() => remove(index)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="School Name" required error={e?.school?.message}>
                  <Input
                    placeholder="University name"
                    {...register(`education.${index}.school`)}
                  />
                </FormField>
                <FormField label="Degree" required error={e?.degree?.message}>
                  <Input
                    placeholder="B.S., M.S., etc."
                    {...register(`education.${index}.degree`)}
                  />
                </FormField>
                <FormField label="Field of Study" error={e?.fieldOfStudy?.message}>
                  <Input
                    placeholder="Computer Science"
                    {...register(`education.${index}.fieldOfStudy`)}
                  />
                </FormField>
                <FormField label="GPA" error={e?.gpa?.message}>
                  <Input
                    placeholder="3.8"
                    {...register(`education.${index}.gpa`)}
                  />
                </FormField>
                <FormField label="Start Date" required error={e?.startDate?.message}>
                  <Input type="month" {...register(`education.${index}.startDate`)} />
                </FormField>
                <FormField label="End Date" error={e?.endDate?.message}>
                  <Input type="month" {...register(`education.${index}.endDate`)} />
                </FormField>
                <FormField
                  label="Description"
                  error={e?.description?.message}
                  className="sm:col-span-2"
                >
                  <Textarea
                    rows={2}
                    placeholder="Honors, relevant coursework, activities..."
                    {...register(`education.${index}.description`)}
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
            id: uid('edu'),
            school: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            gpa: '',
            description: '',
          })
        }
      >
        <Plus className="h-4 w-4" /> Add Education
      </Button>
    </div>
  )
}
