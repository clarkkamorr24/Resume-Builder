import { useFormContext } from 'react-hook-form'
import type { Resume } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/shared/FormField'

export function PersonalInfoForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<Resume>()
  const e = errors.personal

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        label="Full Name"
        htmlFor="fullName"
        required
        error={e?.fullName?.message}
      >
        <Input id="fullName" placeholder="Jane Doe" {...register('personal.fullName')} />
      </FormField>

      <FormField
        label="Professional Title"
        htmlFor="title"
        required
        error={e?.title?.message}
      >
        <Input
          id="title"
          placeholder="Senior Software Engineer"
          {...register('personal.title')}
        />
      </FormField>

      <FormField label="Email" htmlFor="email" required error={e?.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          {...register('personal.email')}
        />
      </FormField>

      <FormField label="Phone Number" htmlFor="phone" required error={e?.phone?.message}>
        <Input
          id="phone"
          placeholder="+1 (555) 000-0000"
          {...register('personal.phone')}
        />
      </FormField>

      <FormField
        label="Location"
        htmlFor="location"
        required
        error={e?.location?.message}
      >
        <Input
          id="location"
          placeholder="City, Country"
          {...register('personal.location')}
        />
      </FormField>

      <FormField label="LinkedIn URL" htmlFor="linkedin" error={e?.linkedin?.message}>
        <Input
          id="linkedin"
          placeholder="https://linkedin.com/in/username"
          {...register('personal.linkedin')}
        />
      </FormField>

      <FormField
        label="Portfolio Website"
        htmlFor="website"
        error={e?.website?.message}
        className="sm:col-span-2"
      >
        <Input
          id="website"
          placeholder="https://yourportfolio.com"
          {...register('personal.website')}
        />
      </FormField>

      <FormField
        label="Professional Summary"
        htmlFor="summary"
        error={e?.summary?.message}
        description="2-4 sentences highlighting your experience and strengths."
        className="sm:col-span-2"
      >
        <Textarea
          id="summary"
          rows={4}
          placeholder="Experienced engineer specialising in..."
          {...register('personal.summary')}
        />
      </FormField>
    </div>
  )
}
