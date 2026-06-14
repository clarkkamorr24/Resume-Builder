import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Briefcase, Plus } from 'lucide-react'
import type { Resume } from '@/types/resume'
import { uid } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { FormField } from '@/components/shared/FormField'
import { SectionControls } from '@/components/shared/SectionControls'

export function ExperienceForm() {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<Resume>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'experience',
  })

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          No work experience added yet.
        </p>
      )}

      {fields.map((field, index) => {
        const e = errors.experience?.[index]
        const isCurrent = watch(`experience.${index}.current`)
        return (
          <Card key={field.id}>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  Experience {index + 1}
                </div>
                <SectionControls
                  index={index}
                  count={fields.length}
                  label="experience entry"
                  onMoveUp={() => move(index, index - 1)}
                  onMoveDown={() => move(index, index + 1)}
                  onRemove={() => remove(index)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Company Name" required error={e?.company?.message}>
                  <Input
                    placeholder="Company"
                    {...register(`experience.${index}.company`)}
                  />
                </FormField>
                <FormField label="Position" required error={e?.position?.message}>
                  <Input
                    placeholder="Job title"
                    {...register(`experience.${index}.position`)}
                  />
                </FormField>
                <FormField
                  label="Location"
                  error={e?.location?.message}
                  className="sm:col-span-2"
                >
                  <Input
                    placeholder="City, Country or Remote"
                    {...register(`experience.${index}.location`)}
                  />
                </FormField>
                <FormField label="Start Date" required error={e?.startDate?.message}>
                  <Input
                    type="month"
                    {...register(`experience.${index}.startDate`)}
                  />
                </FormField>
                <FormField label="End Date" error={e?.endDate?.message}>
                  <Input
                    type="month"
                    disabled={isCurrent}
                    {...register(`experience.${index}.endDate`)}
                  />
                </FormField>

                <div className="flex items-center gap-2 sm:col-span-2">
                  <Controller
                    control={control}
                    name={`experience.${index}.current`}
                    render={({ field: cb }) => (
                      <Checkbox
                        id={`current-${field.id}`}
                        checked={cb.value}
                        onCheckedChange={(checked) => {
                          const value = checked === true
                          cb.onChange(value)
                          if (value) setValue(`experience.${index}.endDate`, '')
                        }}
                      />
                    )}
                  />
                  <Label htmlFor={`current-${field.id}`} className="cursor-pointer">
                    I currently work here
                  </Label>
                </div>

                <FormField
                  label="Responsibilities"
                  required
                  error={e?.responsibilities?.message}
                  description="One achievement per line"
                  className="sm:col-span-2"
                >
                  <Textarea
                    rows={4}
                    placeholder={'Led ...\nBuilt ...\nImproved ...'}
                    {...register(`experience.${index}.responsibilities`)}
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
            id: uid('exp'),
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            responsibilities: '',
          })
        }
      >
        <Plus className="h-4 w-4" /> Add Experience
      </Button>
    </div>
  )
}
