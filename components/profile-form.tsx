'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Save, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useUserProfile } from '@/hooks/use-user-profile'

interface UserProfile {
  name: string
  bio: string
  location: string
  travelStyle: string
  budget: string
  interests: string[]
}

interface ProfileFormProps {
  profile: UserProfile
}

const INTEREST_SUGGESTIONS = [
  'Adventure Sports', 'Art & Museums', 'Beach & Sun', 'City Breaks', 'Cultural Heritage',
  'Food & Wine', 'History', 'Mountains & Hiking', 'Nature & Wildlife', 'Nightlife',
  'Photography', 'Relaxation & Spa', 'Road Trips', 'Shopping', 'Water Sports'
]

const TRAVEL_STYLES = [
  { value: 'explorer', label: 'Explorer', description: 'Love discovering new places' },
  { value: 'relaxer', label: 'Relaxer', description: 'Prefer peaceful, restful trips' },
  { value: 'adventurer', label: 'Adventurer', description: 'Seek thrilling experiences' },
  { value: 'cultural', label: 'Cultural', description: 'Focus on history and culture' },
  { value: 'budget', label: 'Budget', description: 'Travel smart and economical' }
]

const BUDGET_LEVELS = [
  { value: 'budget', label: 'Budget', description: 'Under $100/day' },
  { value: 'moderate', label: 'Moderate', description: '$100-300/day' },
  { value: 'luxury', label: 'Luxury', description: '$300+/day' }
]

export function ProfileForm({ profile }: ProfileFormProps) {
  const { updateProfile } = useUserProfile()
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio,
    location: profile.location,
    travelStyle: profile.travelStyle,
    budget: profile.budget,
    interests: [...profile.interests]
  })
  const [newInterest, setNewInterest] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)

    const success = await updateProfile(formData)
    if (success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    
    setIsLoading(false)
  }

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      })
      setNewInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    })
  }

  const availableSuggestions = INTEREST_SUGGESTIONS.filter(
    suggestion => !formData.interests.includes(suggestion)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <Alert>
              <AlertDescription>
                Profile updated successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself and your travel experiences..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="travelStyle">Travel Style</Label>
              <Select
                value={formData.travelStyle}
                onValueChange={(value: any) => setFormData({ ...formData, travelStyle: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your travel style" />
                </SelectTrigger>
                <SelectContent>
                  {TRAVEL_STYLES.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label} - {style.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Level</Label>
              <Select
                value={formData.budget}
                onValueChange={(value: any) => setFormData({ ...formData, budget: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your budget level" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_LEVELS.map((budget) => (
                    <SelectItem key={budget.value} value={budget.value}>
                      {budget.label} - {budget.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Travel Interests</Label>
            
            {/* Current Interests */}
            {formData.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Custom Interest */}
            <div className="flex gap-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add a custom interest..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addInterest(newInterest)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addInterest(newInterest)}
                disabled={!newInterest.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Interest Suggestions */}
            {availableSuggestions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Suggestions:</Label>
                <div className="flex flex-wrap gap-2">
                  {availableSuggestions.slice(0, 8).map((suggestion) => (
                    <Button
                      key={suggestion}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addInterest(suggestion)}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
