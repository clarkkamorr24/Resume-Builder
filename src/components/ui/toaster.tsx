import { X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div
      className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[400px]"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex items-start justify-between gap-3 rounded-md border p-4 shadow-lg animate-in slide-in-from-right-full',
            t.variant === 'destructive' &&
              'border-destructive bg-destructive text-destructive-foreground',
            t.variant === 'success' &&
              'border-emerald-600 bg-emerald-600 text-white',
            t.variant === 'default' && 'border bg-background text-foreground',
          )}
        >
          <div className="grid gap-1">
            <p className="text-sm font-semibold">{t.title}</p>
            {t.description && (
              <p className="text-sm opacity-90">{t.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="shrink-0 rounded-md opacity-70 transition-opacity hover:opacity-100"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
