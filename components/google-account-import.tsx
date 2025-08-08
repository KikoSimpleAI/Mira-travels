"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, MapPin, Star, User, List, Bookmark, Map } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface POI {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  price?: string
  lat: number
  lng: number
  placeId?: string
  address?: string
  phone?: string
  website?: string
  photos?: string[]
  source?: 'saved' | 'list' | 'mymap' | 'history'
}

interface GoogleList {
  id: string
  name: string
  description?: string
  itemCount: number
  isPublic: boolean
  places: POI[]
}

interface MyMap {
  id: string
  name: string
  description?: string
  layers: Array<{
    name: string
    places: POI[]
  }>
}

interface GoogleAccountImportProps {
  onImport: (pois: POI[]) => void
}

export function GoogleAccountImport({ onImport }: GoogleAccountImportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [savedPlaces, setSavedPlaces] = useState<POI[]>([])
  const [googleLists, setGoogleLists] = useState<GoogleList[]>([])
  const [myMaps, setMyMaps] = useState<MyMap[]>([])
  const [visitHistory, setVisitHistory] = useState<POI[]>([])
  const [selectedPOIs, setSelectedPOIs] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'demo-client-id',
          callback: handleSignIn,
          auto_select: false,
        })
      }
    }

    if (!window.google || !window.google.accounts) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.onload = initializeGoogleAuth
      script.onerror = () => setError('Failed to load Google Sign-In')
      document.head.appendChild(script)
    } else {
      initializeGoogleAuth()
    }
  }, [])

  const handleSignIn = async (response: any) => {
    try {
      setIsLoading(true)
      // In a real implementation, you would decode the JWT token
      // For demo purposes, we'll simulate user data
      setUserProfile({
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        picture: '/placeholder.svg?height=40&width=40&text=JD'
      })
      setIsSignedIn(true)
      await loadUserData()
      setError(null)
    } catch (err) {
      setError('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt()
    } else {
      // Fallback: simulate sign-in for demo
      handleSignIn({})
    }
  }

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      
      // Simulate loading saved places
      const mockSavedPlaces: POI[] = [
        {
          id: 'saved-1',
          name: 'Favorite Café Paris',
          category: 'Restaurant',
          rating: 4.8,
          reviewCount: 245,
          price: '€€',
          lat: 48.8566,
          lng: 2.3522,
          address: '123 Rue de Rivoli, Paris',
          source: 'saved'
        },
        {
          id: 'saved-2',
          name: 'Hotel Saved for Later',
          category: 'Hotel',
          rating: 4.5,
          reviewCount: 189,
          price: '€€€€',
          lat: 48.8584,
          lng: 2.2945,
          address: '456 Avenue des Champs-Élysées, Paris',
          source: 'saved'
        }
      ]

      // Simulate loading Google Lists
      const mockLists: GoogleList[] = [
        {
          id: 'list-1',
          name: 'Paris Trip 2024',
          description: 'Places to visit during my Paris vacation',
          itemCount: 8,
          isPublic: false,
          places: [
            {
              id: 'list-1-1',
              name: 'Louvre Museum',
              category: 'Museum',
              rating: 4.9,
              reviewCount: 45621,
              lat: 48.8606,
              lng: 2.3376,
              address: 'Rue de Rivoli, 75001 Paris',
              source: 'list'
            },
            {
              id: 'list-1-2',
              name: 'Eiffel Tower',
              category: 'Attraction',
              rating: 4.7,
              reviewCount: 89234,
              lat: 48.8584,
              lng: 2.2945,
              address: 'Champ de Mars, Paris',
              source: 'list'
            }
          ]
        },
        {
          id: 'list-2',
          name: 'Best Restaurants',
          description: 'My favorite dining spots',
          itemCount: 12,
          isPublic: true,
          places: [
            {
              id: 'list-2-1',
              name: 'Le Comptoir du Relais',
              category: 'Restaurant',
              rating: 4.6,
              reviewCount: 1247,
              price: '€€€',
              lat: 48.8529,
              lng: 2.3387,
              address: '9 Carrefour de l\'Odéon, Paris',
              source: 'list'
            }
          ]
        }
      ]

      // Simulate loading My Maps
      const mockMyMaps: MyMap[] = [
        {
          id: 'mymap-1',
          name: 'European Adventure',
          description: 'Custom map for my Europe trip',
          layers: [
            {
              name: 'Hotels',
              places: [
                {
                  id: 'mymap-1-1',
                  name: 'Boutique Hotel Central',
                  category: 'Hotel',
                  rating: 4.4,
                  reviewCount: 156,
                  price: '€€€',
                  lat: 48.8566,
                  lng: 2.3522,
                  address: 'Central Paris Location',
                  source: 'mymap'
                }
              ]
            },
            {
              name: 'Restaurants',
              places: [
                {
                  id: 'mymap-1-2',
                  name: 'Traditional Bistro',
                  category: 'Restaurant',
                  rating: 4.7,
                  reviewCount: 89,
                  price: '€€',
                  lat: 48.8529,
                  lng: 2.3387,
                  address: 'Latin Quarter, Paris',
                  source: 'mymap'
                }
              ]
            }
          ]
        }
      ]

      // Simulate loading visit history
      const mockHistory: POI[] = [
        {
          id: 'history-1',
          name: 'Recently Visited Café',
          category: 'Restaurant',
          rating: 4.3,
          reviewCount: 67,
          price: '€€',
          lat: 48.8566,
          lng: 2.3522,
          address: 'Visited last week',
          source: 'history'
        }
      ]

      setSavedPlaces(mockSavedPlaces)
      setGoogleLists(mockLists)
      setMyMaps(mockMyMaps)
      setVisitHistory(mockHistory)
      
      // Auto-select all items initially
      const allPOIs = [
        ...mockSavedPlaces,
        ...mockLists.flatMap(list => list.places),
        ...mockMyMaps.flatMap(map => map.layers.flatMap(layer => layer.places)),
        ...mockHistory
      ]
      setSelectedPOIs(new Set(allPOIs.map(poi => poi.id)))
      
    } catch (err) {
      setError('Failed to load your Google data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePOISelection = (poiId: string, checked: boolean) => {
    const newSelected = new Set(selectedPOIs)
    if (checked) {
      newSelected.add(poiId)
    } else {
      newSelected.delete(poiId)
    }
    setSelectedPOIs(newSelected)
  }

  const handleImportSelected = () => {
    const allPOIs = [
      ...savedPlaces,
      ...googleLists.flatMap(list => list.places),
      ...myMaps.flatMap(map => map.layers.flatMap(layer => layer.places)),
      ...visitHistory
    ]
    
    const selectedPOIsList = allPOIs.filter(poi => selectedPOIs.has(poi.id))
    onImport(selectedPOIsList)
    setIsOpen(false)
  }

  const signOut = () => {
    setIsSignedIn(false)
    setUserProfile(null)
    setSavedPlaces([])
    setGoogleLists([])
    setMyMaps([])
    setVisitHistory([])
    setSelectedPOIs(new Set())
  }

  const renderPOICard = (poi: POI) => (
    <Card key={poi.id} className="p-4">
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={selectedPOIs.has(poi.id)}
          onCheckedChange={(checked) => handlePOISelection(poi.id, checked as boolean)}
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold">{poi.name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary">{poi.category}</Badge>
                {poi.price && <Badge variant="outline">{poi.price}</Badge>}
                <Badge variant="outline" className="text-xs">
                  {poi.source}
                </Badge>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
              <span className="text-sm font-semibold">{poi.rating}</span>
              <span className="text-sm text-muted-foreground ml-1">
                ({poi.reviewCount})
              </span>
            </div>
          </div>
          {poi.address && (
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <MapPin className="h-3 w-3 mr-1" />
              {poi.address}
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <User className="h-4 w-4 mr-2" />
          Import from Google Account
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import from Google Account</DialogTitle>
          <DialogDescription>
            Import your saved places, lists, and My Maps from your Google account.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isSignedIn ? (
          <div className="text-center py-8">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign in to Google</h3>
            <p className="text-muted-foreground mb-6">
              Connect your Google account to import your saved places, lists, and custom maps.
            </p>
            <Button onClick={signInWithGoogle} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Profile */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={userProfile?.picture || "/placeholder.svg"} />
                      <AvatarFallback>
                        {userProfile?.name?.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{userProfile?.name}</p>
                      <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Import Tabs */}
            <Tabs defaultValue="saved" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="saved" className="flex items-center">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Saved ({savedPlaces.length})
                </TabsTrigger>
                <TabsTrigger value="lists" className="flex items-center">
                  <List className="h-4 w-4 mr-2" />
                  Lists ({googleLists.length})
                </TabsTrigger>
                <TabsTrigger value="mymaps" className="flex items-center">
                  <Map className="h-4 w-4 mr-2" />
                  My Maps ({myMaps.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  History ({visitHistory.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="saved" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Saved Places</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const savedIds = savedPlaces.map(p => p.id)
                      const newSelected = new Set(selectedPOIs)
                      savedIds.forEach(id => newSelected.add(id))
                      setSelectedPOIs(newSelected)
                    }}
                  >
                    Select All
                  </Button>
                </div>
                <div className="grid gap-4">
                  {savedPlaces.map(renderPOICard)}
                </div>
              </TabsContent>

              <TabsContent value="lists" className="space-y-4">
                <h3 className="text-lg font-semibold">Google Lists</h3>
                {googleLists.map((list) => (
                  <Card key={list.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{list.name}</CardTitle>
                          {list.description && (
                            <p className="text-sm text-muted-foreground">{list.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={list.isPublic ? "default" : "secondary"}>
                            {list.isPublic ? "Public" : "Private"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const listIds = list.places.map(p => p.id)
                              const newSelected = new Set(selectedPOIs)
                              listIds.forEach(id => newSelected.add(id))
                              setSelectedPOIs(newSelected)
                            }}
                          >
                            Select All
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {list.places.map(renderPOICard)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="mymaps" className="space-y-4">
                <h3 className="text-lg font-semibold">My Maps</h3>
                {myMaps.map((myMap) => (
                  <Card key={myMap.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{myMap.name}</CardTitle>
                      {myMap.description && (
                        <p className="text-sm text-muted-foreground">{myMap.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      {myMap.layers.map((layer, layerIndex) => (
                        <div key={layerIndex} className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Layer: {layer.name}</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const layerIds = layer.places.map(p => p.id)
                                const newSelected = new Set(selectedPOIs)
                                layerIds.forEach(id => newSelected.add(id))
                                setSelectedPOIs(newSelected)
                              }}
                            >
                              Select Layer
                            </Button>
                          </div>
                          <div className="grid gap-4">
                            {layer.places.map(renderPOICard)}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Visit History</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const historyIds = visitHistory.map(p => p.id)
                      const newSelected = new Set(selectedPOIs)
                      historyIds.forEach(id => newSelected.add(id))
                      setSelectedPOIs(newSelected)
                    }}
                  >
                    Select All
                  </Button>
                </div>
                <div className="grid gap-4">
                  {visitHistory.map(renderPOICard)}
                </div>
              </TabsContent>
            </Tabs>

            {/* Import Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {selectedPOIs.size} places selected for import
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleImportSelected}
                  disabled={selectedPOIs.size === 0}
                >
                  Import {selectedPOIs.size} Places
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
