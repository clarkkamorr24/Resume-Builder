import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import type { Resume } from '@/types/resume'
import { SKILL_CATEGORIES } from '@/types/resume'
import { uid } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField } from '@/components/shared/FormField'

export function SkillsForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<Resume>()
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' })

  const [name, setName] = useState('')
  const [category, setCategory] = useState<string>(SKILL_CATEGORIES[0])

  const arrayError =
    (errors.skills as { message?: string } | undefined)?.message ??
    errors.skills?.root?.message

  const addSkill = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    append({ id: uid('sk'), name: trimmed, category })
    setName('')
  }

  const grouped = fields.reduce<Record<string, { id: string; index: number }[]>>(
    (acc, field, index) => {
      const cat = field.category || 'Other'
      ;(acc[cat] ??= []).push({ id: field.id, index })
      return acc
    },
    {},
  )

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto] sm:items-end">
        <FormField label="Skill">
          <Input
            placeholder="e.g. React"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') {
                ev.preventDefault()
                addSkill()
              }
            }}
          />
        </FormField>
        <FormField label="Category">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SKILL_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <Button type="button" onClick={addSkill}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {arrayError && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {arrayError}
        </p>
      )}

      {fields.length === 0 ? (
        <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          No skills added yet. Add at least one skill.
        </p>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {cat}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Badge
                    key={item.id}
                    variant="secondary"
                    className="gap-1 py-1 pl-2.5 pr-1 text-sm"
                  >
                    {fields[item.index].name}
                    <button
                      type="button"
                      onClick={() => remove(item.index)}
                      className="rounded-full p-0.5 hover:bg-background/60"
                      aria-label={`Remove ${fields[item.index].name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
