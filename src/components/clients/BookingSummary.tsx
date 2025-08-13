'use client'

import { useState, useEffect } from 'react'
import type { ClientProfileWithSummary } from '@/lib/types/clientprofilewithsummary'

interface Props {
  clientId: string
}

export default function ClientSummary({ clientId }: Props) {
  const [data, setData] = useState<ClientProfileWithSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log("CLIENT ID", clientId);
  useEffect(() => {
    if (!clientId) return

    setLoading(true)
    fetch(`/api/clients/${clientId}/summary`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data')
        return res.json()
      })
      .then((json) => {
        setData(json)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [clientId])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!data) return <p>No data found</p>

  return (
    <div>
      <h2>
        {data.profile.first_name} {data.profile.last_name}
      </h2>
      <p>Total Bookings: {data.summary.total_bookings}</p>
      <p>Total Revenue: ${data.summary.total_revenue}</p>
      <p>No Shows: {data.summary.total_no_shows}</p>
      <p>Canceled: {data.summary.total_canceled}</p>
    </div>
  )
}
