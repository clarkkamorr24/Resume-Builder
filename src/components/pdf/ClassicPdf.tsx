import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Resume } from '@/types/resume'
import { dateRange, toBullets } from '@/lib/utils'
import { joinContacts, resolvePdfFont } from './helpers'

interface PdfProps {
  resume: Resume
  accent: string
  font: string
}

function createStyles(accent: string, fontFamily: string) {
  return StyleSheet.create({
    page: {
      paddingHorizontal: 44,
      paddingVertical: 40,
      fontFamily,
      fontSize: 10,
      color: '#111827',
      lineHeight: 1.4,
    },
    header: {
      borderBottomWidth: 1.5,
      borderBottomColor: accent,
      paddingBottom: 8,
      marginBottom: 4,
      textAlign: 'center',
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      color: accent,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 10,
    },
    title: { fontSize: 11, color: '#374151', marginTop: 3 },
    contacts: { fontSize: 9, color: '#374151', marginTop: 5 },
    section: { marginTop: 13 },
    sectionTitle: {
      fontSize: 10.5,
      fontWeight: 'bold',
      color: '#111827',
      textTransform: 'uppercase',
      letterSpacing: 1,
      borderBottomWidth: 0.75,
      borderBottomColor: accent,
      paddingBottom: 2,
      marginBottom: 5,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    itemTitle: { fontSize: 11, fontWeight: 'bold', color: '#111827' },
    date: { fontSize: 9, color: '#374151' },
    org: { fontSize: 10, fontStyle: 'italic', color: '#374151', marginTop: 1 },
    bulletRow: { flexDirection: 'row', marginTop: 2 },
    bulletDot: { width: 10, color: '#111827' },
    bulletText: { flex: 1, color: '#1f2937' },
    paragraph: { color: '#1f2937', textAlign: 'justify' },
    entry: { marginBottom: 8 },
    skillRow: { marginBottom: 2 },
    skillCat: { fontWeight: 'bold', color: '#111827' },
    tech: { fontSize: 9, color: '#374151', marginTop: 1 },
  })
}

export function ClassicPdf({ resume, accent, font }: PdfProps) {
  const { personal, experience, education, skills, projects } = resume
  const styles = createStyles(accent, resolvePdfFont(font))

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
          <Text style={styles.contacts}>
            {joinContacts([
              personal.email,
              personal.phone,
              personal.location,
              personal.linkedin,
              personal.website,
            ])}
          </Text>
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
                  {exp.location ? `, ${exp.location}` : ''}
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
                <Text style={styles.org}>
                  {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(', ')}
                  {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
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
              <Text key={cat} style={styles.skillRow}>
                <Text style={styles.skillCat}>{cat}: </Text>
                {names.join(', ')}
              </Text>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((p) => (
              <View key={p.id} style={styles.entry} wrap={false}>
                <Text style={styles.itemTitle}>
                  {p.name}
                  {p.technologies ? (
                    <Text style={styles.org}> — {p.technologies}</Text>
                  ) : null}
                </Text>
                <Text style={styles.paragraph}>{p.description}</Text>
                {(p.github || p.demo) && (
                  <Text style={styles.tech}>
                    {[p.github, p.demo].filter(Boolean).join('  ·  ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}
