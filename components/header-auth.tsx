'use client'

import { useAuth } from '@/lib/auth-provider'
import { UserMenu } from '@/components/user-menu'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function HeaderAuth() {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) {
    return <Skeleton className="h-10 w-24" />
  }

  if (user) {
    return <UserMenu />
  }

  return (
    <Button onClick={signInWithGoogle}>
      Sign In
    </Button>
  )
}
