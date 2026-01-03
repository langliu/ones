'use client'

import { WarningOctagon } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'

export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low'

function BarsGlyph({
  level,
  className,
}: {
  level: Exclude<PriorityLevel, 'urgent'>
  className?: string
}) {
  // Match Figma design: stroked bars with varying heights and colors
  const bars = [
    { color: 'currentColor', x: 4, y1: 13.333, y2: 13.333 },
    { color: level === 'low' ? 'rgb(228, 228, 231)' : 'currentColor', x: 8, y1: 6.667, y2: 13.333 },
    {
      color: level === 'high' ? 'currentColor' : 'rgb(228, 228, 231)',
      x: 12,
      y1: level === 'high' ? 2.667 : level === 'medium' ? 6.667 : 6.667,
      y2: 13.333,
    },
  ]

  return (
    <svg
      aria-hidden='true'
      className={className}
      fill='none'
      height='16'
      viewBox='0 0 16 16'
      width='16'
    >
      {bars.map((bar) => (
        <path
          d={`M${bar.x} ${bar.y2}V${bar.y1}`}
          key={bar.x}
          stroke={bar.color}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
        />
      ))}
    </svg>
  )
}

export function PriorityGlyphIcon({
  level,
  size = 'md',
  className,
}: {
  level: PriorityLevel
  size?: 'sm' | 'md'
  className?: string
}) {
  const isUrgent = level === 'urgent'
  const baseIcon = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'

  if (isUrgent) {
    return (
      <WarningOctagon className={cn(baseIcon, 'text-muted-foreground', className)} weight='fill' />
    )
  }

  const safeLevel: Exclude<PriorityLevel, 'urgent'> =
    level === 'high' || level === 'medium' ? level : 'low'
  return (
    <BarsGlyph className={cn(baseIcon, 'text-muted-foreground', className)} level={safeLevel} />
  )
}

export type PriorityBadgeProps = {
  level: PriorityLevel
  appearance?: 'badge' | 'inline'
  size?: 'sm' | 'md'
  className?: string
  withIcon?: boolean
}

export function PriorityBadge({
  level,
  appearance = 'badge',
  size = 'md',
  className,
  withIcon = true,
}: PriorityBadgeProps) {
  const isUrgent = level === 'urgent'
  const label =
    level === 'urgent' ? '紧急' : level === 'high' ? '高' : level === 'medium' ? '中' : '低'

  const baseText = size === 'md' ? 'text-sm' : 'text-xs'
  const baseIcon = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'

  if (appearance === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-foreground', baseText, className)}>
        {withIcon &&
          (isUrgent ? (
            <WarningOctagon className={cn(baseIcon, 'text-muted-foreground')} weight='fill' />
          ) : (
            <BarsGlyph
              className={cn(baseIcon, 'text-muted-foreground')}
              level={level as Exclude<PriorityLevel, 'urgent'>}
            />
          ))}
        <span className={cn(isUrgent ? 'text-foreground/80' : 'text-foreground/80')}>{label}</span>
      </span>
    )
  }

  // appearance: badge
  const colorClass = isUrgent
    ? 'text-foreground/80 border-zinc-200 bg-zinc-50'
    : 'text-foreground/80 border-zinc-200 bg-zinc-50'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5',
        baseText,
        colorClass,
        className,
      )}
    >
      {withIcon &&
        (isUrgent ? (
          <WarningOctagon className={cn(baseIcon, 'text-muted-foreground')} weight='fill' />
        ) : (
          <BarsGlyph
            className={cn(baseIcon, 'text-muted-foreground')}
            level={level as Exclude<PriorityLevel, 'urgent'>}
          />
        ))}
      <span>{label}</span>
    </span>
  )
}
