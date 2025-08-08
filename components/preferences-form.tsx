"use client"

import { useState } from 'react'
import { useUserProfile, UserProfile } from '@/hooks/use-user-profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Save, Loader2, RotateCcw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PreferencesFormProps {
  profile: UserProfile
}

const PREFERENCE_CONFIG = {
  rating: {
    label: 'Overall Rating',
    description: 'How important are high ratings and reviews?',
    icon: '⭐',
    colors: {
      high: 'bg-yellow-100 text-yellow-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    }
  },
  safety: {
    label: 'Safety & Security',
    description: 'How important is destination safety?',
    icon: '🛡️',
    colors: {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    }
  },
  cost: {
    label: 'Value for Money',
    description: 'How important is getting good value?',
    icon: '💰',
    colors: {
      high: 'bg-emerald-100 text-emerald-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    }
  },
  climate: {
    label: 'Climate & Weather',
    description: 'How important is favorable weather?',
    icon: '🌤️',
    colors: {
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    }
  },
  activities: {
    label: 'Activities & Attractions',
    description: 'How important are things to do?',
    icon: '🎯',
    colors: {
      high: 'bg-purple-100 text-purple-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    }
  },
  walkability: {
    label: 'Walkability',
    description: 'How important is easy walking access?',
    icon: '🚶',
    colors: {
      high: 'bg-teal-100 text-teal-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    }
  }
}

const DEFAULT_PREFERENCES = {
  rating: 80,
  safety: 70,
  cost: 60,
  climate: 50,
  activities: 70,
  walkability: 40
}

export function PreferencesForm({ profile }: PreferencesFormProps) {
  const { updatePreferences } = useUserProfile()
  const [preferences, setPreferences] = useState(profile.preferences)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)

    const success = await updatePreferences(preferences)
    if (success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    
    setIsLoading(false)
  }

  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES)
  }

  const getImportanceLevel = (value: number) => {
    if (value >= 80) return { level: 'Very Important', color: 'high' }
    if (value >= 60) return { level: 'Important', color: 'medium' }
    if (value >= 40) return { level: 'Somewhat Important', color: 'medium' }
    return { level: 'Not Important', color: 'low' }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Travel Preferences</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Adjust these settings to personalize your destination recommendations
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {success && (
            <Alert>
              <AlertDescription>
                Preferences updated successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-8">
            {Object.entries(PREFERENCE_CONFIG).map(([key, config]) => {
              const value = preferences[key as keyof typeof preferences]
              const importance = getImportanceLevel(value)
              
              return (
                <div key={key} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <Label className="text-base font-medium">
                          {config.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${config.colors[importance.color]}`}>
                      {importance.level}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Not Important</span>
                      <span className="font-medium">{value}</span>
                      <span>Very Important</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(newValue) =>
                        setPreferences({
                          ...preferences,
                          [key]: newValue[0]
                        })
                      }
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-6 border-t">
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">Preference Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {Object.entries(preferences).map(([key, value]) => {
                  const config = PREFERENCE_CONFIG[key as keyof typeof PREFERENCE_CONFIG]
                  const importance = getImportanceLevel(value)
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="flex items-center">
                        <span className="mr-2">{config.icon}</span>
                        {config.label}
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  )
                })}
              </div>
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
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
