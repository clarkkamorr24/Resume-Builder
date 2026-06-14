import { Svg, Path, Rect, Circle, Line } from '@react-pdf/renderer'

export type PdfIconName = 'mail' | 'phone' | 'pin' | 'link' | 'globe'

interface PdfIconProps {
  name: PdfIconName
  color: string
  size?: number
}

export function PdfIcon({ name, color, size = 9 }: PdfIconProps) {
  const stroke = {
    stroke: color,
    strokeWidth: 2,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'mail' && (
        <>
          <Rect x={2} y={4} width={20} height={16} rx={2} {...stroke} />
          <Path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" {...stroke} />
        </>
      )}
      {name === 'phone' && (
        <Path
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
          {...stroke}
        />
      )}
      {name === 'pin' && (
        <>
          <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" {...stroke} />
          <Circle cx={12} cy={10} r={3} {...stroke} />
        </>
      )}
      {name === 'link' && (
        <>
          <Path d="M9 17H7A5 5 0 0 1 7 7h2" {...stroke} />
          <Path d="M15 7h2a5 5 0 1 1 0 10h-2" {...stroke} />
          <Line x1={8} y1={12} x2={16} y2={12} {...stroke} />
        </>
      )}
      {name === 'globe' && (
        <>
          <Circle cx={12} cy={12} r={10} {...stroke} />
          <Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" {...stroke} />
          <Line x1={2} y1={12} x2={22} y2={12} {...stroke} />
        </>
      )}
    </Svg>
  )
}
