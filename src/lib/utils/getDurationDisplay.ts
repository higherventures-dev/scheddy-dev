import { formatDuration, intervalToDuration, isBefore, isEqual } from 'date-fns'

export const getDurationDisplay = (start: Date, end: Date): string => {
  if (!start || !end || isEqual(start, end) || !isBefore(start, end)) return '0m'

  const duration = intervalToDuration({ start, end })

  return formatDuration(duration, {
    format: ['hours', 'minutes'],
    zero: false, // skip units that are zero
  })
}