'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"

export function RequireAuth({ children, redirectTo = "/" }: { children: React.ReactNode; redirectTo?: string }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo)
    }
  }, [loading, user, router, redirectTo])

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading your session…</div>
  }
  if (!user) return null
  return <>{children}</>
}
