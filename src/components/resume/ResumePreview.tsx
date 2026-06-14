import { forwardRef } from 'react'
import { FileText } from 'lucide-react'
import type { Resume, TemplateId } from '@/types/resume'
import { isResumeEmpty } from '@/lib/utils'
import { ClassicTemplate } from '@/components/templates/ClassicTemplate'
import { ModernTemplate } from '@/components/templates/ModernTemplate'

interface ResumePreviewProps {
  resume: Resume
  template: TemplateId
  accent: string
  font: string
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resume, template, accent, font }, ref) => {
    const empty = isResumeEmpty(resume)

    return (
      <div
        ref={ref}
        className="resume-page shadow-lg ring-1 ring-black/5"
        id="resume-capture"
      >
        {empty ? (
          <div className="flex min-h-[600px] flex-col items-center justify-center px-10 py-16 text-center">
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${accent}1a`, color: accent }}
            >
              <FileText className="h-7 w-7" />
            </div>
            <p className="text-lg font-semibold text-gray-800">
              Your resume preview will appear here
            </p>
            <p className="mt-1 max-w-xs text-sm text-gray-500">
              Start by filling in your details on the left.
            </p>
          </div>
        ) : template === 'classic' ? (
          <ClassicTemplate resume={resume} accent={accent} font={font} />
        ) : (
          <ModernTemplate resume={resume} accent={accent} font={font} />
        )}
      </div>
    )
  },
)
ResumePreview.displayName = 'ResumePreview'
