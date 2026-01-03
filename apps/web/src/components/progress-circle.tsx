interface ProgressCircleProps {
  progress: number
  color: string
  size?: number
  strokeWidth?: number
}

export function ProgressCircle({
  progress,
  color,
  size = 18,
  strokeWidth = 2,
}: ProgressCircleProps) {
  // 强制整数几何以避免亚像素混叠
  const s = Math.round(size)
  const r = Math.floor((s - strokeWidth) / 2)
  const cx = s / 2
  const cy = s / 2

  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * (1 - progress / 100)

  return (
    <div className='relative flex items-center justify-center' style={{ height: s, width: s }}>
      <svg aria-hidden height={s} viewBox={`0 0 ${s} ${s}`} width={s}>
        <title>进度环</title>
        {/* 背景环 */}
        <circle
          className='text-border'
          cx={cx}
          cy={cy}
          fill='none'
          r={r}
          stroke='currentColor'
          strokeWidth={strokeWidth}
        />

        {/* 进度环 */}
        <circle
          cx={cx}
          cy={cy}
          fill='none'
          r={r}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap='round'
          strokeWidth={strokeWidth}
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
          }}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
    </div>
  )
}
