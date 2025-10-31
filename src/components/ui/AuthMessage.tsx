'use client'

import { useEffect, useState } from 'react'

export default function AuthMessage({
  error,
  success,
}: {
  error?: string
  success?: string
}) {
  // Normalize + to space if you used encodeURIComponent & concatenated with '+'
  const [msg, setMsg] = useState<{ kind: 'error' | 'success'; text: string } | null>(null)

  useEffect(() => {
    const e = error?.replace(/\+/g, ' ')
    const s = success?.replace(/\+/g, ' ')
    if (e) setMsg({ kind: 'error', text: decodeURIComponent(e) })
    else if (s) setMsg({ kind: 'success', text: decodeURIComponent(s) })
  }, [error, success])

  if (!msg) return null

  return (
    <div
      role="status"
      className={[
        'mb-4 rounded-md border p-3 text-sm',
        msg.kind === 'error'
          ? 'border-red-300 bg-red-50 text-red-800'
          : 'border-green-300 bg-green-50 text-green-800',
      ].join(' ')}
      aria-live="polite"
    >
      {msg.text}
    </div>
  )
}
