import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SectionControlsProps {
  index: number
  count: number
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  label: string
}

export function SectionControls({
  index,
  count,
  onMoveUp,
  onMoveDown,
  onRemove,
  label,
}: SectionControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={index === 0}
        onClick={onMoveUp}
        aria-label={`Move ${label} up`}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={index === count - 1}
        onClick={onMoveDown}
        aria-label={`Move ${label} down`}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={onRemove}
        aria-label={`Delete ${label}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
