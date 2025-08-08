"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, Loader2, LogIn, Sparkles, Shield, User, MapPin } from 'lucide-react'
import { useAuth } from "@/components/auth/auth-provider"
import { getUserProfile, isUsernameAvailable, upsertUserProfile, usernameFromDisplayName, type UserProfile } from "@/lib/user"
import { cn } from "@/lib/utils"

const INTEREST_OPTIONS = [
  "Foodie",
  "Museums",
  "Nightlife",
  "Outdoors",
  "Photography",
  "Family Travel",
  "Backpacking",
  "Luxury",
  "Remote Work",
  "History",
  "Architecture",
  "Beach",
]

type Step = "auth" | "profile" | "success"

export function JoinCommunityDialog({ className }: { className?: string }) {
  const { user, loading, signInWithGoogle } = useAuth()
  const [open, setOpen] = useState(false)

  const [step, setStep] = useState<Step>("auth")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Profile fields
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle")
  const [homeBase, setHomeBase] = useState("")
  const [bio, setBio] = useState("")
  const [interests, setInterests] = useState<string[]>([])

  const initials = useMemo(() => {
    if (!displayName) return "U"
    return displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  }, [displayName])

  // When dialog opens, derive default fields from auth and check if profile exists
  useEffect(() => {
    let isMounted = true
    const load = async () => {
      if (!open) return
      setError(null)
      if (!user) {
        setStep("auth")
        return
      }

      // Prefill from auth
      const suggested = usernameFromDisplayName(user.displayName || user.email?.split("@")[0], "traveler")
      if (isMounted) {
        setDisplayName(user.displayName || "")
        setUsername(suggested)
        setHomeBase("")
        setBio("")
        setInterests([])
      }

      // Check if user already has a profile
      try {
        const existing = await getUserProfile(user.uid)
        if (!isMounted) return
        if (existing) {
          // Already joined
          setDisplayName(existing.displayName || user.displayName || "")
          setUsername(existing.username)
          setHomeBase(existing.homeBase || "")
          setBio(existing.bio || "")
          setInterests(existing.interests || [])
          setStep("success")
        } else {
          setStep("profile")
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || "Failed to load your profile")
      }
    }
    load()
    return () => { isMounted = false }
  }, [open, user])

  // Username availability check (debounced)
  useEffect(() => {
    let active = true
    const run = async () => {
      if (!username || step !== "profile") {
        setUsernameStatus("idle")
        return
      }
      const cleaned = username.toLowerCase()
      // Validate local format before checking DB
      const valid = /^[a-z0-9_]{3,20}$/.test(cleaned)
      if (!valid) {
        setUsernameStatus("unavailable")
        return
      }
      setUsernameStatus("checking")
      try {
        const available = await isUsernameAvailable(cleaned)
        if (!active) return
        setUsernameStatus(available ? "available" : "unavailable")
      } catch {
        if (!active) return
        setUsernameStatus("idle")
      }
    }
    const t = setTimeout(run, 400)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [username, step])

  const toggleInterest = (value: string) => {
    setInterests(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const handleSignIn = async () => {
    setError(null)
    setBusy(true)
    try {
      await signInWithGoogle()
      // After sign-in, step will be resolved by open-effect (profile or success)
    } catch (e: any) {
      setError(e?.message || "Failed to sign in")
    } finally {
      setBusy(false)
    }
  }

  const handleCreateProfile = async () => {
    if (!user) return
    setError(null)

    const cleanedUsername = username.toLowerCase()
    if (!/^[a-z0-9_]{3,20}$/.test(cleanedUsername)) {
      setError("Username must be 3-20 characters, lowercase letters, numbers, or underscores.")
      return
    }
    if (usernameStatus !== "available") {
      setError("This username is not available. Please choose another.")
      return
    }

    setBusy(true)
    try {
      const profile: UserProfile = {
        uid: user.uid,
        displayName: displayName || user.displayName || "Traveler",
        username: cleanedUsername,
        usernameLower: cleanedUsername,
        photoURL: user.photoURL || undefined,
        email: user.email || undefined,
        homeBase: homeBase || undefined,
        bio: bio || undefined,
        interests,
      }
      await upsertUserProfile(profile)
      setStep("success")
    } catch (e: any) {
      setError(e?.message || "Failed to save your profile")
    } finally {
      setBusy(false)
    }
  }

  // Hide button if already signed-in AND previously joined
  const [hideTrigger, setHideTrigger] = useState(false)
  useEffect(() => {
    let mounted = true
    const check = async () => {
      if (!user) {
        setHideTrigger(false)
        return
      }
      try {
        const existing = await getUserProfile(user.uid)
        if (!mounted) return
        setHideTrigger(!!existing)
      } catch {
        if (!mounted) return
        setHideTrigger(false)
      }
    }
    check()
    return () => { mounted = false }
  }, [user])

  if (hideTrigger) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn(className)}>
          <Sparkles className="h-4 w-4 mr-2" />
          Join Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Join the Mira Travels Community</DialogTitle>
          <DialogDescription>
            Create your traveler profile to save places, write reviews, and build itineraries.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="mb-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step: Auth */}
        {step === "auth" && (
          <div className="space-y-4">
            <div className="text-center">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarImage src="/lone-traveler-mountain-path.png" />
                <AvatarFallback>MT</AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground">
                Sign in to get started
              </p>
            </div>
            <Button className="w-full" onClick={handleSignIn} disabled={busy || loading}>
              {busy || loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
              Continue with Google
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        )}

        {/* Step: Profile */}
        {step === "profile" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={(user?.photoURL as string) || "/placeholder.svg?height=48&width=48&query=avatar"} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Set up your profile</div>
                <div className="text-xs text-muted-foreground">Let others know a bit about you</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="your_handle"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {usernameStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    {usernameStatus === "available" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                  </div>
                </div>
                <p className={cn("text-xs", usernameStatus === "unavailable" ? "text-red-600" : "text-muted-foreground")}>
                  Use 3-20 characters: lowercase letters, numbers, or underscores.
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="homeBase">Home base</Label>
                <div className="relative">
                  <MapPin className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="homeBase"
                    className="pl-8"
                    placeholder="City, Country (e.g., Paris, France)"
                    value={homeBase}
                    onChange={(e) => setHomeBase(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="bio">Short bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell the community about your travel style..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <div className="text-xs text-muted-foreground text-right">{bio.length}/280</div>
              </div>

              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((opt) => {
                    const active = interests.includes(opt)
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleInterest(opt)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm border transition-colors",
                          active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted border-muted-foreground/20"
                        )}
                        aria-pressed={active}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                You can change this later in settings.
              </p>
              <Button onClick={handleCreateProfile} disabled={busy || usernameStatus !== "available"}>
                {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <User className="h-4 w-4 mr-2" />}
                Create profile
              </Button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">You're in! 🎉</h3>
            <p className="text-sm text-muted-foreground">
              Welcome to the community. Start saving places, writing reviews, and building itineraries.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary">Member</Badge>
              <Badge variant="outline">@{username}</Badge>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => setOpen(false)}>Start exploring</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
