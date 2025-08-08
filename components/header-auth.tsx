'use client'

import { Button } from '@/components/ui/button'
import { AuthDialog } from '@/components/auth-dialog'
import { UserMenu } from '@/components/user-menu'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export function HeaderAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin" />
  }

  if (user) {
    return <UserMenu />
  }

  return (
    <div className="flex items-center space-x-2">
      <AuthDialog defaultMode="signin">
        <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
      </AuthDialog>
      <AuthDialog defaultMode="signup">
        <Button className="text-sm px-3 py-2">Join Community</Button>
      </AuthDialog>
    </div>
  )
}
