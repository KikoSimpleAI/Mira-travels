"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Check } from 'lucide-react'
import { useAuth } from "@/components/auth/auth-provider"
import {
  type UserCorePreferences,
  TRAVEL_STYLE_OPTIONS,
  BUDGET_OPTIONS,
  COMPANION_OPTIONS,
  KEY_INTERESTS,
  getUserCorePreferences,
  upsertUserCorePreferences,
} from "@/lib/user"
import { cn } from "@/lib/utils"

export function PreferencesForm() {
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [travelStyle, setTravelStyle] = useState<UserCorePreferences["travelStyle"]>("relaxation")
  const [budget, setBudget] = useState<UserCorePreferences["budget"]>("mid_range")
  const [companions, setCompanions] = useState<UserCorePreferences["companions"]>("solo")
  const [interests, setInterests] = useState<string[]>([])

  const canSave = useMemo(() => {
    return !!user && !!travelStyle && !!budget && !!companions
  }, [user, travelStyle, budget, companions])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!user) return
      setError(null)
      try {
        const prefs = await getUserCorePreferences(user.uid)
        if (!mounted) return
        if (prefs) {
          setTravelStyle(prefs.travelStyle)
          setBudget(prefs.budget)
          setCompanions(prefs.companions)
          setInterests(prefs.interests || [])
        }
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message || "Failed to load your preferences")
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

  const toggleInterest = (value: string) => {
    setInterests((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const handleSave = async () => {
    if (!user) return
    setBusy(true)
    setError(null)
    try {
      await upsertUserCorePreferences(user.uid, {
        travelStyle,
        budget,
        companions,
        interests,
      })
      toast({ title: "Preferences saved", description: "We’ll use these to tailor destinations and ideas." })
    } catch (e: any) {
      setError(e?.message || "Failed to save preferences")
      toast({ title: "Save failed", description: "Please try again.", variant: "destructive" })
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
          <CardTitle>Sign in to set preferences</CardTitle>
          <CardDescription>Your travel preferences are saved to your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the Join Community button on the homepage to sign in, then return here to personalize your experience.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Travel Style / Vibe</CardTitle>
          <CardDescription>Select the primary motivation for your trips.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={travelStyle} onValueChange={(v) => setTravelStyle(v as any)} className="grid gap-3 sm:grid-cols-2">
            {TRAVEL_STYLE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                htmlFor={`style-${opt.value}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted",
                  travelStyle === opt.value && "border-primary"
                )}
              >
                <RadioGroupItem id={`style-${opt.value}`} value={opt.value} />
                <div>
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.example}</div>
                </div>
              </label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Level</CardTitle>
          <CardDescription>Choose the budget you’re most comfortable with.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={budget} onValueChange={(v) => setBudget(v as any)} className="grid gap-3 sm:grid-cols-3">
            {BUDGET_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                htmlFor={`budget-${opt.value}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted",
                  budget === opt.value && "border-primary"
                )}
              >
                <RadioGroupItem id={`budget-${opt.value}`} value={opt.value} />
                <div>
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.example}</div>
                </div>
              </label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Companions</CardTitle>
          <CardDescription>Who do you usually travel with?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={companions} onValueChange={(v) => setCompanions(v as any)} className="grid gap-3 sm:grid-cols-4">
            {COMPANION_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                htmlFor={`comp-${opt.value}`}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-muted",
                  companions === opt.value && "border-primary"
                )}
              >
                <RadioGroupItem id={`comp-${opt.value}`} value={opt.value} />
                <div className="font-medium">{opt.label}</div>
              </label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Interests</CardTitle>
          <CardDescription>Select your must-haves.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {KEY_INTERESTS.map((opt) => {
              const active = interests.includes(opt)
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleInterest(opt)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-colors",
                    active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted border-muted-foreground/20"
                  )}
                  aria-pressed={active}
                >
                  {active ? <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5" />{opt}</span> : opt}
                </button>
              )
            })}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Selected: {interests.length ? interests.join(", ") : "None"}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button onClick={handleSave} disabled={!canSave || busy}>
          {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
