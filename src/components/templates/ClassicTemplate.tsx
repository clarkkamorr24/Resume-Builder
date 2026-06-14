import type { TemplateProps } from '@/types/resume'
import { dateRange, toBullets } from '@/lib/utils'

export function ClassicTemplate({ resume, accent, font }: TemplateProps) {
  const { personal, experience, education, skills, projects } = resume

  return (
    <article
      className="resume-page mx-auto w-full max-w-[794px] px-10 py-10 text-[13px] leading-relaxed text-gray-900"
      style={{ fontFamily: font }}
    >
      <header
        className="border-b-2 pb-3 text-center"
        style={{ borderColor: accent }}
      >
        <h1
          className="text-2xl font-bold uppercase tracking-wide"
          style={{ color: accent }}
        >
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.title && (
          <p className="mt-1 text-sm font-medium text-gray-700">{personal.title}</p>
        )}
        <p className="mt-2 flex flex-wrap justify-center gap-x-2 gap-y-0.5 text-[11px] text-gray-700">
          {[
            personal.email,
            personal.phone,
            personal.location,
            personal.linkedin,
            personal.website,
          ]
            .filter(Boolean)
            .map((item, i, arr) => (
              <span key={i}>
                {item}
                {i < arr.length - 1 && <span className="px-1">•</span>}
              </span>
            ))}
        </p>
      </header>

      {personal.summary && (
        <Section title="Summary" accent={accent}>
          <p className="text-justify">{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" accent={accent}>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-bold">{exp.position}</p>
                  <p className="whitespace-nowrap text-[11px] text-gray-700">
                    {dateRange(exp.startDate, exp.endDate, exp.current)}
                  </p>
                </div>
                <p className="text-[12px] italic text-gray-700">
                  {exp.company}
                  {exp.location ? `, ${exp.location}` : ''}
                </p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {toBullets(exp.responsibilities).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent={accent}>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-bold">{edu.school}</p>
                  <p className="whitespace-nowrap text-[11px] text-gray-700">
                    {dateRange(edu.startDate, edu.endDate)}
                  </p>
                </div>
                <p className="text-[12px] italic text-gray-700">
                  {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                  {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
                </p>
                {edu.description && (
                  <p className="mt-0.5 text-[12px]">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" accent={accent}>
          <ul className="space-y-0.5">
            {Object.entries(groupSkills(skills)).map(([cat, names]) => (
              <li key={cat}>
                <span className="font-bold">{cat}: </span>
                {names.join(', ')}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects" accent={accent}>
          <div className="space-y-2">
            {projects.map((p) => (
              <div key={p.id}>
                <p className="font-bold">
                  {p.name}
                  {p.technologies && (
                    <span className="font-normal italic text-gray-700">
                      {' '}
                      — {p.technologies}
                    </span>
                  )}
                </p>
                <p>{p.description}</p>
                {(p.github || p.demo) && (
                  <p className="text-[11px] text-gray-700">
                    {[p.github, p.demo].filter(Boolean).join(' • ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </article>
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
        className="mb-1.5 border-b pb-0.5 text-[13px] font-bold uppercase tracking-wider text-gray-900"
        style={{ borderColor: accent }}
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
