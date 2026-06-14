import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Resume } from '@/types/resume'
import { dateRange, toBullets } from '@/lib/utils'
import { resolvePdfFont } from './helpers'
import { PdfIcon, type PdfIconName } from './PdfIcons'

interface PdfProps {
  resume: Resume
  accent: string
  font: string
}

function createStyles(accent: string, fontFamily: string) {
  return StyleSheet.create({
    page: {
      paddingHorizontal: 40,
      paddingVertical: 36,
      fontFamily,
      fontSize: 10,
      color: '#1f2937',
      lineHeight: 1.4,
    },
    header: {
      borderBottomWidth: 2.5,
      borderBottomColor: accent,
      paddingBottom: 10,
      marginBottom: 4,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#111827',
      lineHeight: 1.25,
      marginBottom: 3,
    },
    title: { fontSize: 12, fontWeight: 'bold', color: accent, marginTop: 1 },
    contacts: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: 6,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 14,
      marginTop: 2,
    },
    contactText: { fontSize: 9, lineHeight: 1, color: '#4b5563', marginLeft: 4 },
    section: { marginTop: 14 },
    sectionTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: accent,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 5,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    itemTitle: { fontSize: 11, fontWeight: 'bold', color: '#111827' },
    date: { fontSize: 9, color: '#6b7280' },
    org: { fontSize: 10, fontWeight: 'bold', color: accent, marginTop: 1 },
    muted: { color: '#6b7280', fontWeight: 'normal' },
    bulletRow: { flexDirection: 'row', marginTop: 2 },
    bulletDot: { width: 10, color: '#9ca3af' },
    bulletText: { flex: 1, color: '#374151' },
    paragraph: { color: '#374151' },
    entry: { marginBottom: 9 },
    skillRow: { flexDirection: 'row', marginBottom: 3 },
    skillCat: { width: 90, fontWeight: 'bold', color: '#111827' },
    skillNames: { flex: 1, color: '#374151' },
    tech: { fontSize: 9, color: '#6b7280', marginTop: 1 },
  })
}

export function ModernPdf({ resume, accent, font }: PdfProps) {
  const { personal, experience, education, skills, projects } = resume
  const styles = createStyles(accent, resolvePdfFont(font))

  const contacts: { icon: PdfIconName; text: string }[] = [
    personal.email && { icon: 'mail' as const, text: personal.email },
    personal.phone && { icon: 'phone' as const, text: personal.phone },
    personal.location && { icon: 'pin' as const, text: personal.location },
    personal.linkedin && { icon: 'link' as const, text: personal.linkedin },
    personal.website && { icon: 'globe' as const, text: personal.website },
  ].filter(Boolean) as { icon: PdfIconName; text: string }[]

  const skillGroups = skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category || 'Other'
    ;(acc[cat] ??= []).push(s.name)
    return acc
  }, {})

  return (
    <Document
      title={`${personal.fullName || 'Resume'} — Resume`}
      author={personal.fullName || undefined}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personal.fullName || 'Your Name'}</Text>
          {!!personal.title && <Text style={styles.title}>{personal.title}</Text>}
          <View style={styles.contacts}>
            {contacts.map((c, i) => (
              <View key={i} style={styles.contactItem}>
                <PdfIcon name={c.icon} color={accent} />
                <Text style={styles.contactText}>{c.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {!!personal.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.paragraph}>{personal.summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.entry} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.date}>
                    {dateRange(exp.startDate, exp.endDate, exp.current)}
                  </Text>
                </View>
                <Text style={styles.org}>
                  {exp.company}
                  {exp.location ? (
                    <Text style={styles.muted}> · {exp.location}</Text>
                  ) : null}
                </Text>
                {toBullets(exp.responsibilities).map((line, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((p) => (
              <View key={p.id} style={styles.entry} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{p.name}</Text>
                  <Text style={styles.date}>
                    {[p.github, p.demo].filter(Boolean).join('  ·  ')}
                  </Text>
                </View>
                <Text style={styles.paragraph}>{p.description}</Text>
                {!!p.technologies && (
                  <Text style={styles.tech}>{p.technologies}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.entry} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{edu.school}</Text>
                  <Text style={styles.date}>
                    {dateRange(edu.startDate, edu.endDate)}
                  </Text>
                </View>
                <Text style={styles.paragraph}>
                  {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                  {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                </Text>
                {!!edu.description && (
                  <Text style={styles.tech}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Object.entries(skillGroups).map(([cat, names]) => (
              <View key={cat} style={styles.skillRow}>
                <Text style={styles.skillCat}>{cat}</Text>
                <Text style={styles.skillNames}>{names.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}
