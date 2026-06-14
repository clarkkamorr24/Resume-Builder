import { createElement, type ReactElement } from 'react'
import { pdf, type DocumentProps } from '@react-pdf/renderer'
import type { Resume, TemplateId } from '@/types/resume'
import { resumeFileName } from '@/lib/utils'
import { ModernPdf } from '@/components/pdf/ModernPdf'
import { ClassicPdf } from '@/components/pdf/ClassicPdf'

interface GeneratePdfOptions {
  resume: Resume
  template: TemplateId
  accent: string
  font: string
}

export async function downloadResumePdf({
  resume,
  template,
  accent,
  font,
}: GeneratePdfOptions): Promise<void> {
  const Template = template === 'classic' ? ClassicPdf : ModernPdf
  const element = createElement(Template, {
    resume,
    accent,
    font,
  }) as unknown as ReactElement<DocumentProps>
  const blob = await pdf(element).toBlob()

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = resumeFileName(resume.personal.fullName)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
