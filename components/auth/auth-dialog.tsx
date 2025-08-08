"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "./auth-provider"
import { Loader2, Mail, UserRound, LogIn, LogOut, Shield } from 'lucide-react'
import { cn } from "@/lib/utils"

export function AuthDialog({ variant = "default", className }: { variant?: "default" | "outline"; className?: string }) {
  const { user, loading, error, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [open, setOpen] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  const handleGoogle = async () => {
    setFormError(null)
    setIsBusy(true)
    try {
      await signInWithGoogle()
      setOpen(false)
    } catch (e: any) {
      setFormError(e?.message || "Google sign-in failed")
    } finally {
      setIsBusy(false)
    }
  }

  const handleEmailSignIn = async () => {
    setFormError(null)
    setIsBusy(true)
    try {
      await signInWithEmail(email, password)
      setOpen(false)
    } catch (e: any) {
      setFormError(e?.message || "Email sign-in failed")
    } finally {
      setIsBusy(false)
    }
  }

  const handleEmailSignUp = async () => {
    setFormError(null)
    setIsBusy(true)
    try {
      await signUpWithEmail(email, password, displayName || undefined)
      setOpen(false)
    } catch (e: any) {
      setFormError(e?.message || "Sign up failed")
    } finally {
      setIsBusy(false)
    }
  }

  if (user) {
    // If already signed in, no need to show dialog trigger
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className={cn(className)}>
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>Sign in to save places, build itineraries, and join the community.</DialogDescription>
        </DialogHeader>

        {(error || formError) && (
          <Alert className="mb-2">
            <AlertDescription>{formError || error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button className="w-full" onClick={handleGoogle} disabled={isBusy || loading}>
            {isBusy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email1">Email</Label>
                <Input id="email1" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password1">Password</Label>
                <Input id="password1" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleEmailSignIn} disabled={isBusy}>
                {isBusy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                Sign in with Email
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">Display name</Label>
                <Input id="name" placeholder="Your name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email2">Email</Label>
                <Input id="email2" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password2">Password</Label>
                <Input id="password2" type="password" placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleEmailSignUp} disabled={isBusy}>
                {isBusy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserRound className="h-4 w-4 mr-2" />}
                Create account
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
