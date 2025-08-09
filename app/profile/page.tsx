"use client"

import { useState } from "react"
import { useUserProfile } from "@/hooks/use-user-profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { profile, loading, error, isOffline, updateProfile } = useUserProfile()
  const [local, setLocal] = useState({
    name: "",
    location: "",
    bio: "",
  })
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  // Initialize local state when profile loads
  if (!loading && profile && local.name === "" && local.location === "" && local.bio === "") {
    setLocal({
      name: profile.name ?? "",
      location: profile.location ?? "",
      bio: profile.bio ?? "",
    })
  }

  const onSave = async () => {
    if (!profile) return
    setSaving(true)
    setSavedMsg(null)
    const ok = await updateProfile({
      name: local.name,
      location: local.location,
      bio: local.bio,
    })
    setSaving(false)
    setSavedMsg(ok ? "Profile saved." : "Failed to save profile.")
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Your Profile</h1>

      {isOffline && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          You are viewing cached data. Changes will sync when back online.
        </div>
      )}

      {error && <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={local.name}
              onChange={(e) => setLocal((s) => ({ ...s, name: e.target.value }))}
              placeholder="Your name"
              disabled={loading || saving}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Home base</Label>
            <Input
              id="location"
              value={local.location}
              onChange={(e) => setLocal((s) => ({ ...s, location: e.target.value }))}
              placeholder="City, Country"
              disabled={loading || saving}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={local.bio}
              onChange={(e) => setLocal((s) => ({ ...s, bio: e.target.value }))}
              placeholder="Tell others about your travel style..."
              className="min-h-[120px]"
              disabled={loading || saving}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={onSave} disabled={loading || saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            {savedMsg && <span className="text-sm text-muted-foreground">{savedMsg}</span>}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-2">
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
          <div className="h-24 w-full animate-pulse rounded bg-muted" />
        </div>
      )}
    </main>
  )
}
