import { Check, Palette } from 'lucide-react'
import { FONT_OPTIONS } from '@/store/useResumeStore'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const PRESETS = [
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Slate', value: '#475569' },
  { name: 'Black', value: '#111827' },
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  font: string
  onFontChange: (font: string) => void
}

export function ColorPicker({
  value,
  onChange,
  font,
  onFontChange,
}: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" aria-label="Customize resume" className="gap-2">
          <Palette className="h-4 w-4" style={{ color: value }} />
          <span className="hidden sm:inline">Customize</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Accent colour</p>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((preset) => {
                const active =
                  preset.value.toLowerCase() === value.toLowerCase()
                return (
                  <button
                    key={preset.value}
                    type="button"
                    title={preset.name}
                    aria-label={preset.name}
                    aria-pressed={active}
                    onClick={() => onChange(preset.value)}
                    className={cn(
                      'flex h-9 w-full items-center justify-center rounded-md ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      active && 'ring-2 ring-ring ring-offset-2',
                    )}
                    style={{ backgroundColor: preset.value }}
                  >
                    {active && <Check className="h-4 w-4 text-white" />}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="custom-color" className="text-sm">
                Custom
              </Label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase text-muted-foreground">
                  {value}
                </span>
                <input
                  id="custom-color"
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border bg-transparent p-0.5"
                  aria-label="Custom accent colour"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t pt-3">
            <Label htmlFor="font-family" className="text-sm font-medium">
              Font family
            </Label>
            <Select value={font} onValueChange={onFontChange}>
              <SelectTrigger id="font-family">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    style={{ fontFamily: option.value }}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
