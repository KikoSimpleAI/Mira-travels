"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, MapPin, Star, ExternalLink, LinkIcon } from 'lucide-react'
import { GoogleAccountImport } from './google-account-import'

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
}

interface POIImportDialogProps {
  onImport: (pois: POI[]) => void
}

export function POIImportDialog({ onImport }: POIImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mapUrl, setMapUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [importedPOIs, setImportedPOIs] = useState<POI[]>([])
  const [selectedPOIs, setSelectedPOIs] = useState<Set<string>>(new Set())

  const handleImportFromUrl = async () => {
    if (!mapUrl.trim()) return

    setIsLoading(true)
    try {
      // Extract place IDs or coordinates from Google Maps URL
      const placeIds = extractPlaceIdsFromUrl(mapUrl)
      
      if (placeIds.length > 0) {
        await fetchPlaceDetails(placeIds)
      } else {
        // Try to extract coordinates and search nearby
        const coords = extractCoordinatesFromUrl(mapUrl)
        if (coords) {
          await searchNearbyPlaces(coords.lat, coords.lng)
        } else {
          // Try to extract search query
          const query = extractSearchQuery(mapUrl)
          if (query) {
            await searchByQuery(query)
          } else {
            alert('Could not extract location information from the URL. Please try a different Google Maps link.')
          }
        }
      }
    } catch (error) {
      console.error('Error importing POIs:', error)
      alert('Failed to import POIs. Please check the URL and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const extractPlaceIdsFromUrl = (url: string): string[] => {
    const placeIdRegex = /place_id:([a-zA-Z0-9_-]+)/g
    const matches = []
    let match
    while ((match = placeIdRegex.exec(url)) !== null) {
      matches.push(match[1])
    }
    return matches
  }

  const extractCoordinatesFromUrl = (url: string): { lat: number; lng: number } | null => {
    const patterns = [
      /@(-?\d+\.?\d*),(-?\d+\.?\d*),?\d*z?/,
      /ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      /center=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/,
      /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        const lat = parseFloat(match[1])
        const lng = parseFloat(match[2])
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng }
        }
      }
    }
    return null
  }

  const extractSearchQuery = (url: string): string | null => {
    const patterns = [
      /[?&]q=([^&]+)/,
      /[?&]query=([^&]+)/,
      /search\/([^\/\?]+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return decodeURIComponent(match[1].replace(/\+/g, ' '))
      }
    }
    return null
  }

  const searchByQuery = async (query: string) => {
    const mockPOIs: POI[] = [
      {
        id: `search-${Date.now()}-1`,
        name: `${query} - Restaurant`,
        category: 'Restaurant',
        rating: 4.0 + Math.random(),
        reviewCount: Math.floor(Math.random() * 500) + 50,
        price: ['€', '€€', '€€€'][Math.floor(Math.random() * 3)],
        lat: 48.8566 + (Math.random() - 0.5) * 0.02,
        lng: 2.3522 + (Math.random() - 0.5) * 0.02,
        address: `Search result for ${query}`,
      },
      {
        id: `search-${Date.now()}-2`,
        name: `${query} - Hotel`,
        category: 'Hotel',
        rating: 4.0 + Math.random(),
        reviewCount: Math.floor(Math.random() * 300) + 30,
        price: ['€€', '€€€', '€€€€'][Math.floor(Math.random() * 3)],
        lat: 48.8566 + (Math.random() - 0.5) * 0.02,
        lng: 2.3522 + (Math.random() - 0.5) * 0.02,
        address: `Search result for ${query}`,
      }
    ]
    
    setImportedPOIs(mockPOIs)
    setSelectedPOIs(new Set(mockPOIs.map(poi => poi.id)))
  }

  const searchNearbyPlaces = async (lat: number, lng: number) => {
    const mockPOIs: POI[] = [
      {
        id: 'mock-1',
        name: 'Le Petit Bistro',
        category: 'Restaurant',
        rating: 4.5,
        reviewCount: 234,
        price: '€€€',
        lat: lat + 0.001,
        lng: lng + 0.001,
        address: '123 Rue de la Paix, Paris',
        phone: '+33 1 23 45 67 89'
      },
      {
        id: 'mock-2',
        name: 'Hotel Moderne',
        category: 'Hotel',
        rating: 4.2,
        reviewCount: 456,
        price: '€€€€',
        lat: lat - 0.002,
        lng: lng + 0.002,
        address: '456 Avenue des Champs, Paris',
        phone: '+33 1 98 76 54 32'
      },
      {
        id: 'mock-3',
        name: 'Musée d\'Art Moderne',
        category: 'Museum',
        rating: 4.7,
        reviewCount: 1234,
        lat: lat + 0.003,
        lng: lng - 0.001,
        address: '789 Boulevard Saint-Germain, Paris',
        website: 'www.musee-art-moderne.fr'
      }
    ]
    
    setImportedPOIs(mockPOIs)
    setSelectedPOIs(new Set(mockPOIs.map(poi => poi.id)))
  }

  const fetchPlaceDetails = async (placeIds: string[]) => {
    const mockPOIs: POI[] = placeIds.map((id, index) => ({
      id,
      name: `Imported Place ${index + 1}`,
      category: ['Restaurant', 'Hotel', 'Museum'][index % 3],
      rating: 4.0 + Math.random(),
      reviewCount: Math.floor(Math.random() * 1000) + 100,
      price: ['€', '€€', '€€€', '€€€€'][Math.floor(Math.random() * 4)],
      lat: 48.8566 + (Math.random() - 0.5) * 0.01,
      lng: 2.3522 + (Math.random() - 0.5) * 0.01,
      placeId: id,
      address: `${Math.floor(Math.random() * 999) + 1} Rue Example, Paris`,
      phone: `+33 1 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`
    }))

    setImportedPOIs(mockPOIs)
    setSelectedPOIs(new Set(mockPOIs.map(poi => poi.id)))
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
    const selectedPOIsList = importedPOIs.filter(poi => selectedPOIs.has(poi.id))
    onImport(selectedPOIsList)
    setIsOpen(false)
    setImportedPOIs([])
    setSelectedPOIs(new Set())
    setMapUrl('')
  }

  const handleAccountImport = (accountPOIs: POI[]) => {
    onImport(accountPOIs)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Import POIs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Points of Interest</DialogTitle>
          <DialogDescription>
            Import POIs from Google Maps URLs, your Google account, or other sources.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center">
              <LinkIcon className="h-4 w-4 mr-2" />
              From URL
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              From Google Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="map-url">Google Maps URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="map-url"
                  placeholder="https://maps.google.com/..."
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                />
                <Button 
                  onClick={handleImportFromUrl}
                  disabled={!mapUrl.trim() || isLoading}
                >
                  {isLoading ? 'Importing...' : 'Import'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Supported formats: Google Maps URLs, My Maps share links, place URLs
              </p>
            </div>

            {importedPOIs.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Found {importedPOIs.length} POIs
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPOIs(new Set(importedPOIs.map(poi => poi.id)))}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPOIs(new Set())}
                    >
                      Select None
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {importedPOIs.map((poi) => (
                    <Card key={poi.id} className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedPOIs.has(poi.id)}
                          onCheckedChange={(checked) => 
                            handlePOISelection(poi.id, checked as boolean)
                          }
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{poi.name}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary">{poi.category}</Badge>
                                {poi.price && (
                                  <Badge variant="outline">{poi.price}</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                              <span className="text-sm font-semibold">{poi.rating.toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground ml-1">
                                ({poi.reviewCount})
                              </span>
                            </div>
                          </div>
                          
                          {poi.address && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              {poi.address}
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm">
                            {poi.phone && (
                              <span className="text-muted-foreground">{poi.phone}</span>
                            )}
                            {poi.website && (
                              <a 
                                href={`https://${poi.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleImportSelected}
                    disabled={selectedPOIs.size === 0}
                  >
                    Import {selectedPOIs.size} POIs
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <GoogleAccountImport onImport={handleAccountImport} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
