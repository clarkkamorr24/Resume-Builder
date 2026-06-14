import { create } from 'zustand'
import { uid } from '@/lib/utils'

export type ToastVariant = 'default' | 'success' | 'destructive'

export interface Toast {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastState {
  toasts: Toast[]
  toast: (input: Omit<Toast, 'id' | 'variant'> & { variant?: ToastVariant }) => string
  dismiss: (id: string) => void
}

const AUTO_DISMISS_MS = 4000

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  toast: ({ title, description, variant = 'default' }) => {
    const id = uid('toast')
    set((s) => ({ toasts: [...s.toasts, { id, title, description, variant }] }))
    setTimeout(() => get().dismiss(id), AUTO_DISMISS_MS)
    return id
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export function useToast() {
  const toast = useToastStore((s) => s.toast)
  const dismiss = useToastStore((s) => s.dismiss)
  const toasts = useToastStore((s) => s.toasts)
  return { toast, dismiss, toasts }
}
