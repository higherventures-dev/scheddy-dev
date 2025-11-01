// app/auth/sign-in/page.tsx  (SERVER COMPONENT)
import LoginClient from './LoginClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = {
  searchParams?: Record<string, string | string[] | undefined>
}

export default function Page({ searchParams }: Props) {
  const error =
    typeof searchParams?.error === 'string' ? searchParams.error : undefined
  const success =
    typeof searchParams?.success === 'string' ? searchParams.success : undefined
  const next =
    typeof searchParams?.next === 'string' ? searchParams.next : '/dashboard'

  return <LoginClient errorMessage={error} successMessage={success} nextPath={next} />
}
