// app/auth/sign-in/page.tsx  (SERVER COMPONENT)
import { Suspense } from 'react'
import LoginClient from './LoginClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="shadow-lg dark:shadow-xl border dark:border-gray-700 justify-center w-full flex py-24">
          <div className="mx-auto max-w-md p-10 w-full max-w-md shadow rounded-xl">
            <p className="text-sm opacity-70">Loading…</p>
          </div>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  )
}
