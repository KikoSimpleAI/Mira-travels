"use client"

import { useAuth } from '@/hooks/use-auth'
import { useUserProfile } from '@/hooks/use-user-profile'
import { ProfileForm } from '@/components/profile-form'
import { PreferencesForm } from '@/components/preferences-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Settings, MapPin, Wallet, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  if (authLoading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </CardHeader>
          </Card>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const getTravelStyleIcon = (style: string) => {
    switch (style) {
      case 'explorer': return '🗺️'
      case 'relaxer': return '🏖️'
      case 'adventurer': return '🏔️'
      case 'cultural': return '🏛️'
      case 'budget': return '💰'
      default: return '✈️'
    }
  }

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case 'budget': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-blue-100 text-blue-800'
      case 'luxury': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        {/* Profile Summary Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl">{profile.name}</CardTitle>
                <p className="text-muted-foreground">{profile.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {profile.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {profile.location}
                    </div>
                  )}
                  <Badge className={getBudgetColor(profile.budget)}>
                    <Wallet className="h-3 w-3 mr-1" />
                    {profile.budget.charAt(0).toUpperCase() + profile.budget.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    {getTravelStyleIcon(profile.travelStyle)} {profile.travelStyle.charAt(0).toUpperCase() + profile.travelStyle.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            {profile.bio && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              </div>
            )}
            {profile.interests.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Interests</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Profile Management Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Travel Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileForm profile={profile} />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <PreferencesForm profile={profile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
