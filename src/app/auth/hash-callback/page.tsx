// app/auth/hash-callback/page.tsx  (SERVER COMPONENT)
import HashCallbackClient from './HashCallbackClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = {
  searchParams?: Record<string, string | string[] | undefined>
}

export default function Page({ searchParams }: Props) {
  const email =
    typeof searchParams?.email === 'string' ? searchParams.email : undefined
  const next =
    typeof searchParams?.next === 'string' ? searchParams.next : '/dashboard'

  // Pass props down — no useSearchParams hook anywhere
  return <HashCallbackClient email={email} next={next} />
}
