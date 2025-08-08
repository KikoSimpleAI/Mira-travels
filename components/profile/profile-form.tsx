"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  type UserProfile,
  type UserCorePreferences,
  type TravelStyle,
  type BudgetLevel,
  type Companions,
  getUserProfile,
  upsertUserProfile,
  isUsernameAvailable,
  KEY_INTERESTS,
  TRAVEL_STYLE_OPTIONS,
  BUDGET_OPTIONS,
  COMPANION_OPTIONS,
} from "@/lib/user"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Check, AlertCircle } from 'lucide-react'

function Fieldset({ children, legend }: { children: React.ReactNode; legend: string }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">{legend}</legend>
      {children}
    </fieldset>
  )
}

export default function ProfileForm() {
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [busy, setBusy] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Profile basics
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [originalUsername, setOriginalUsername] = useState<string | null>(null)
  const [photoURL, setPhotoURL] = useState("")
  const [homeBase, setHomeBase] = useState("")
  const [bio, setBio] = useState("")
  const [interests, setInterests] = useState<string[]>([])

  // Preferences
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("relaxation")
  const [budget, setBudget] = useState<BudgetLevel>("mid_range")
  const [companions, setCompanions] = useState<Companions>("solo")

  // Username availability
  const [checking, setChecking] = useState(false)
  const [nameErr, setNameErr] = useState<string | null>(null)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!user) return
      setLoadError(null)
      try {
        const prof = await getUserProfile(user.uid)
        if (!mounted) return
        if (prof) {
          setDisplayName(prof.displayName || "")
          setUsername(prof.username || "")
          setOriginalUsername(prof.username || null)
          setPhotoURL(prof.photoURL || "")
          setHomeBase(prof.homeBase || "")
          setBio(prof.bio || "")
          // If legacy interests exist, use them; else fall back to pref interests
          const prefInterests = prof.preferences?.interests || []
          setInterests(Array.from(new Set([...(prof.interests || []), ...prefInterests])))
          if (prof.preferences) {
            setTravelStyle(prof.preferences.travelStyle)
            setBudget(prof.preferences.budget)
            setCompanions(prof.preferences.companions)
          }
        } else {
          // Seed with best-guess defaults
          setDisplayName(user.displayName || "")
          setPhotoURL(user.photoURL || "")
        }
      } catch (e: any) {
        if (!mounted) return
        setLoadError(e?.message || "Failed to load profile")
      }
    }
    run()
    return () => { mounted = false }
  }, [user])

  // Debounced username availability check
  useEffect(() => {
    if (!username) {
      setIsAvailable(null)
      setNameErr("Username is required")
      return
    }
    setNameErr(null)

    // If unchanged, skip availability check
    if (originalUsername && username.toLowerCase() === originalUsername.toLowerCase()) {
      setIsAvailable(true)
      setChecking(false)
      return
    }

    let active = true
    setChecking(true)
    const id = setTimeout(async () => {
      try {
        const ok = await isUsernameAvailable(username)
        if (!active) return
        setIsAvailable(ok)
      } finally {
        if (active) setChecking(false)
      }
    }, 450)
    return () => { active = false; clearTimeout(id) }
  }, [username, originalUsername])

  const canSave = useMemo(() => {
    const baseValid = user && displayName.trim() && username.trim()
    const unameValid = isAvailable !== false && !nameErr
    return !!baseValid && !!unameValid && !busy
  }, [user, displayName, username, isAvailable, nameErr, busy])

  const toggleInterest = (val: string) => {
    setInterests((prev) => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
  }

  const save = async () => {
    if (!user) return
    setBusy(true)
    try {
      const payload: UserProfile = {
        uid: user.uid,
        displayName: displayName.trim(),
        username: username.trim(),
        usernameLower: username.trim().toLowerCase(),
        email: user.email || undefined,
        photoURL: photoURL || undefined,
        homeBase: homeBase || undefined,
        bio: bio || undefined,
        // Keep root interests for compatibility with older UI
        interests,
        // Unified preferences live under profile.preferences
        preferences: {
          travelStyle,
          budget,
          companions,
          interests,
        } satisfies UserCorePreferences,
      }
      await upsertUserProfile(payload)
      toast({ title: "Profile saved", description: "Your profile and preferences were updated." })
      setOriginalUsername(payload.username)
      setIsAvailable(true)
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message || "Please try again.", variant: "destructive" })
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Sign in to edit your profile</CardTitle>
          <CardDescription>Use the Join Community button on the homepage, then return here.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {loadError && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{loadError}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your basic information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={photoURL || "/placeholder.svg?height=64&width=64&query=user-avatar"} alt="Profile photo" />
              <AvatarFallback>{(displayName || user.email || "U").slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="grid gap-4 w-full sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photoURL">Avatar URL</Label>
                <Input id="photoURL" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={cn(
                      isAvailable === false ? "border-red-500" : "",
                      isAvailable && !checking ? "border-green-600" : ""
                    )}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {checking ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
                    {!checking && isAvailable && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                </div>
                {nameErr && <p className="text-xs text-red-600">{nameErr}</p>}
                {isAvailable === false && <p className="text-xs text-red-600">That username is taken.</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeBase">Home base</Label>
                <Input id="homeBase" value={homeBase} onChange={(e) => setHomeBase(e.target.value)} placeholder="e.g., Lisbon, PT" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about you" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Travel Preferences</CardTitle>
          <CardDescription>These power personalized recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Fieldset legend="Travel Style / Vibe">
              <div className="grid gap-2">
                {TRAVEL_STYLE_OPTIONS.map((opt) => (
                  <label key={opt.value} className={cn(
                    "flex items-start gap-3 rounded-md border p-3 hover:bg-muted cursor-pointer",
                    travelStyle === opt.value && "border-primary"
                  )}>
                    <input
                      type="radio"
                      name="travelStyle"
                      value={opt.value}
                      checked={travelStyle === opt.value}
                      onChange={() => setTravelStyle(opt.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.example}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Fieldset>

            <Fieldset legend="Budget Level">
              <div className="grid gap-2">
                {BUDGET_OPTIONS.map((opt) => (
                  <label key={opt.value} className={cn(
                    "flex items-start gap-3 rounded-md border p-3 hover:bg-muted cursor-pointer",
                    budget === opt.value && "border-primary"
                  )}>
                    <input
                      type="radio"
                      name="budget"
                      value={opt.value}
                      checked={budget === opt.value}
                      onChange={() => setBudget(opt.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.example}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Fieldset>
          </div>

          <Fieldset legend="Companions">
            <div className="grid gap-2 sm:grid-cols-4">
              {COMPANION_OPTIONS.map((opt) => (
                <label key={opt.value} className={cn(
                  "flex items-center gap-3 rounded-md border p-3 hover:bg-muted cursor-pointer",
                  companions === opt.value && "border-primary"
                )}>
                  <input
                    type="radio"
                    name="companions"
                    value={opt.value}
                    checked={companions === opt.value}
                    onChange={() => setCompanions(opt.value)}
                  />
                  <div className="font-medium">{opt.label}</div>
                </label>
              ))}
            </div>
          </Fieldset>

          <Fieldset legend="Key Interests">
            <div className="flex flex-wrap gap-2">
              {KEY_INTERESTS.map((k) => {
                const active = interests.includes(k)
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggleInterest(k)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm border transition-colors",
                      active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted border-muted-foreground/20"
                    )}
                    aria-pressed={active}
                  >
                    {active ? <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" />{k}</span> : k}
                  </button>
                )
              })}
            </div>
          </Fieldset>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end">
        <Button onClick={save} disabled={!canSave}>
          {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Save Changes
        </Button>
      </div>
    </div>
  )
}
