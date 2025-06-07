
// pages/auth/callback.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClient } from "@/utils/supabase/client";
  const supabase = createClient();

export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    const handleMagicLink = async () => {
      const { error } = await supabase.auth.getSession()
      if (error) {
        console.error('Session error:', error.message)
      } else {
        // You may want to set a cookie or redirect to a protected route
        router.push('/dashboard')
      }
    }

    handleMagicLink()
  }, [])

  return <p>Logging you in...</p>
}