export function resolvePdfFont(stack: string): 'Helvetica' | 'Times-Roman' {
  if (/sans-serif/i.test(stack)) return 'Helvetica'
  if (/serif/i.test(stack)) return 'Times-Roman'
  return 'Helvetica'
}

export function joinContacts(parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join('   •   ')
}
