import type { TemplateProps } from '@/types/resume'
import { Mail, Phone, MapPin, Link2, Globe } from 'lucide-react'
import { dateRange, toBullets } from '@/lib/utils'

export function ModernTemplate({ resume, accent: ACCENT, font }: TemplateProps) {
  const { personal, experience, education, skills, projects } = resume

  return (
    <article
      className="resume-page mx-auto w-full max-w-[794px] px-10 py-9 text-[13px] leading-relaxed text-gray-800"
      style={{ fontFamily: font }}
    >
      <header className="border-b-4 pb-4" style={{ borderColor: ACCENT }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.title && (
          <p
            className="mt-0.5 text-base font-semibold"
            style={{ color: ACCENT }}
          >
            {personal.title}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] leading-none text-gray-600">
          {personal.email && (
            <ContactItem
              icon={<Mail className="h-3 w-3" />}
              text={personal.email}
              accent={ACCENT}
            />
          )}
          {personal.phone && (
            <ContactItem
              icon={<Phone className="h-3 w-3" />}
              text={personal.phone}
              accent={ACCENT}
            />
          )}
          {personal.location && (
            <ContactItem
              icon={<MapPin className="h-3 w-3" />}
              text={personal.location}
              accent={ACCENT}
            />
          )}
          {personal.linkedin && (
            <ContactItem
              icon={<Link2 className="h-3 w-3" />}
              text={personal.linkedin}
              accent={ACCENT}
            />
          )}
          {personal.website && (
            <ContactItem
              icon={<Globe className="h-3 w-3" />}
              text={personal.website}
              accent={ACCENT}
            />
          )}
        </div>
      </header>

      {personal.summary && (
        <Section title="Summary" accent={ACCENT}>
          <p className="text-gray-700">{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" accent={ACCENT}>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[14px] font-bold text-gray-900">
                    {exp.position}
                  </p>
                  <p className="whitespace-nowrap text-[11px] font-medium text-gray-500">
                    {dateRange(exp.startDate, exp.endDate, exp.current)}
                  </p>
                </div>
                <p className="text-[12px] font-semibold" style={{ color: ACCENT }}>
                  {exp.company}
                  {exp.location && (
                    <span className="font-normal text-gray-500">
                      {' '}
                      · {exp.location}
                    </span>
                  )}
                </p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-gray-700 marker:text-gray-400">
                  {toBullets(exp.responsibilities).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects" accent={ACCENT}>
          <div className="space-y-2.5">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[14px] font-bold text-gray-900">{p.name}</p>
                  {(p.github || p.demo) && (
                    <p className="whitespace-nowrap text-[11px] text-gray-500">
                      {[p.github, p.demo].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                <p className="text-gray-700">{p.description}</p>
                {p.technologies && (
                  <p className="mt-0.5 text-[11px] font-medium text-gray-500">
                    {p.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent={ACCENT}>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[14px] font-bold text-gray-900">
                    {edu.school}
                  </p>
                  <p className="whitespace-nowrap text-[11px] font-medium text-gray-500">
                    {dateRange(edu.startDate, edu.endDate)}
                  </p>
                </div>
                <p className="text-[12px] text-gray-700">
                  {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                  {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                </p>
                {edu.description && (
                  <p className="mt-0.5 text-[12px] text-gray-600">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" accent={ACCENT}>
          <div className="space-y-1.5">
            {Object.entries(groupSkills(skills)).map(([cat, names]) => (
              <div key={cat} className="flex gap-2 text-gray-700">
                <span className="w-28 shrink-0 font-semibold text-gray-900">
                  {cat}
                </span>
                <span>{names.join(', ')}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </article>
  )
}

function ContactItem({
  icon,
  text,
  accent,
}: {
  icon: React.ReactNode
  text: string
  accent: string
}) {
  return (
    <span className="inline-flex items-center gap-1 leading-none whitespace-nowrap">
      <span className="flex shrink-0 items-center" style={{ color: accent }}>
        {icon}
      </span>
      <span>{text}</span>
    </span>
  )
}

function Section({
  title,
  accent,
  children,
}: {
  title: string
  accent: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-4">
      <h2
        className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.12em]"
        style={{ color: accent }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function groupSkills(skills: TemplateProps['resume']['skills']) {
  return skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category || 'Other'
    ;(acc[cat] ??= []).push(s.name)
    return acc
  }, {})
}
