"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Navigation, Download, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GoogleMap, LoadScript } from '@react-google-maps/api';

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

interface GoogleMapsProps {
  center: { lat: number; lng: number }
  zoom?: number
  pois?: POI[]
  onPOIClick?: (poi: POI) => void
  showImportButton?: boolean
  onImportPOIs?: (pois: POI[]) => void
  height?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

export function GoogleMaps({
  center,
  zoom = 13,
  pois = [],
  onPOIClick,
  showImportButton = false,
  onImportPOIs,
  height = "400px",
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null)
  const [importedPOIs, setImportedPOIs] = useState<POI[]>([])
  const [error, setError] = useState<string | null>(null)

  // Load Google Maps API via our server proxy route (keeps key server-side)
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.google?.maps) {
      setIsLoaded(true)
      return
    }

    const id = 'gmaps-js'
    if (document.getElementById(id)) return

    const script = document.createElement('script')
    script.id = id
    script.src = `/api/google-maps/js?libraries=places&callback=initMap&v=weekly`
    script.async = true
    script.defer = true

    window.initMap = () => {
      if (window.google?.maps) {
        setIsLoaded(true)
        setError(null)
      } else {
        setError('Google Maps failed to initialize properly.')
      }
    }

    script.onerror = () => {
      setError('Failed to load Google Maps API.')
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      // Clean global callback
      try {
        delete window.initMap
      } catch {
        // noop
      }
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi.business",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      mapInstance.addListener('click', (event: any) => {
        console.log('Map clicked at:', event.latLng.lat(), event.latLng.lng())
      })

      setMap(mapInstance)
      setError(null)
    } catch (err) {
      console.error('Error initializing map:', err)
      setError('Failed to initialize the map. Please refresh the page and try again.')
    }
  }, [isLoaded, center, zoom])

  // Add markers for POIs
  useEffect(() => {
    if (!map || !window.google?.maps) return

    try {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null))

      const newMarkers = pois.map((poi) => {
        const marker = new window.google.maps.Marker({
          position: { lat: poi.lat, lng: poi.lng },
          map,
          title: poi.name,
          icon: {
            url: getCategoryIcon(poi.category),
            scaledSize: new window.google.maps.Size(32, 32),
          },
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(poi),
        })

        marker.addListener('click', () => {
          setSelectedPOI(poi)
          infoWindow.open(map, marker)
          onPOIClick?.(poi)
        })

        return marker
      })

      setMarkers(newMarkers)
    } catch (err) {
      console.error('Error adding markers:', err)
    }
  }, [map, pois, onPOIClick])

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      Restaurant: 'https://maps.google.com/mapfiles/ms/icons/restaurant.png',
      Hotel: 'https://maps.google.com/mapfiles/ms/icons/lodging.png',
      Museum: 'https://maps.google.com/mapfiles/ms/icons/arts.png',
      Nightlife: 'https://maps.google.com/mapfiles/ms/icons/bar.png',
      Shopping: 'https://maps.google.com/mapfiles/ms/icons/shopping.png',
      Attraction: 'https://maps.google.com/mapfiles/ms/icons/camera.png',
    }
    return icons[category] || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
  }

  const createInfoWindowContent = (poi: POI) => {
    return `
      <div style="max-width: 250px; padding: 8px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${poi.name}</h3>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span style="color: #fbbf24;">★</span>
          <span style="margin-left: 4px; font-weight: 500;">${poi.rating}</span>
          <span style="margin-left: 4px; color: #6b7280;">(${poi.reviewCount} reviews)</span>
        </div>
        <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">${poi.category}</p>
        ${poi.price ? `<p style="margin: 4px 0; font-weight: 500;">${poi.price}</p>` : ''}
        ${poi.address ? `<p style="margin: 4px 0; font-size: 12px; color: #6b7280;">${poi.address}</p>` : ''}
      </div>
    `
  }

  const importPOIsFromMap = async () => {
    if (!map || !window.google?.maps?.places) {
      setError('Google Places API is not available. Please try again shortly.')
      return
    }

    try {
      const service = new window.google.maps.places.PlacesService(map)
      const bounds = map.getBounds()

      if (!bounds) {
        setError('Map bounds not available. Please wait for the map to load completely.')
        return
      }

      const request = {
        bounds,
        type: [
          'restaurant',
          'lodging',
          'tourist_attraction',
          'museum',
          'night_club',
          'bar',
          'shopping_mall',
        ],
      }

      service.nearbySearch(request, (results: any[], status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const newPOIs: POI[] = results.slice(0, 20).map((place, index) => {
            const photos = place.photos
              ? place.photos.slice(0, 3).map((photo: any) =>
                  photo.getUrl({ maxWidth: 400, maxHeight: 300 })
                )
              : []

            return {
              id: place.place_id || `imported-${Date.now()}-${index}`,
              name: place.name || 'Unknown Place',
              category: mapPlaceTypeToCategory(place.types || []),
              rating: place.rating || 0,
              reviewCount: place.user_ratings_total || 0,
              price: place.price_level ? '€'.repeat(place.price_level) : undefined,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              placeId: place.place_id,
              address: place.vicinity || place.formatted_address,
              photos,
            }
          })

          setImportedPOIs(newPOIs)
          onImportPOIs?.(newPOIs)
          setError(null)
        } else {
          setError(`Places search failed: ${status}. Please try again or check your API permissions.`)
        }
      })
    } catch (err) {
      console.error('Error importing POIs:', err)
      setError('Failed to import POIs. Please try again.')
    }
  }

  const mapPlaceTypeToCategory = (types: string[]): string => {
    const typeMapping: { [key: string]: string } = {
      restaurant: 'Restaurant',
      food: 'Restaurant',
      lodging: 'Hotel',
      tourist_attraction: 'Attraction',
      museum: 'Museum',
      night_club: 'Nightlife',
      bar: 'Nightlife',
      shopping_mall: 'Shopping',
      store: 'Shopping',
    }

    for (const type of types) {
      if (typeMapping[type]) {
        return typeMapping[type]
      }
    }
    return 'Attraction'
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    if (!map || !window.google) {
      setError('Map is not ready. Please wait for the map to load.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          map.setCenter(pos)
          map.setZoom(15)

          // Remove existing user location marker
          markers.forEach((marker) => {
            if (marker.getTitle && marker.getTitle() === 'Your Location') {
              marker.setMap(null)
            }
          })

          // Add new user location marker
          const userMarker = new window.google.maps.Marker({
            position: pos,
            map,
            title: 'Your Location',
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(32, 32),
            },
            animation: window.google.maps.Animation.DROP,
          })

          setMarkers((prev) => [...prev.filter((m) => m.getTitle?.() !== 'Your Location'), userMarker])
          setError(null)
        } catch (err) {
          console.error('Error setting location:', err)
          setError('Failed to set your location on the map.')
        }
      },
      (error) => {
        let errorMessage = 'An unknown error occurred.'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        setError(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <div
          className="bg-muted rounded-lg flex items-center justify-center border-2 border-dashed"
          style={{ height }}
        >
          <div className="text-center p-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Map Unavailable</h3>
            <p className="text-muted-foreground mb-4">Interactive map features are currently unavailable.</p>
            {pois.length > 0 && (
              <div className="text-left">
                <h4 className="font-medium mb-2">Available Locations:</h4>
                <div className="space-y-2">
                  {pois.slice(0, 3).map((poi) => (
                    <div key={poi.id} className="flex items-center justify-between text-sm">
                      <span>{poi.name}</span>
                      <Badge variant="secondary">{poi.category}</Badge>
                    </div>
                  ))}
                  {pois.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{pois.length - 3} more locations</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render loading state
  if (!isLoaded) {
    return (
      <div className="bg-muted rounded-lg flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
          <p className="text-muted-foreground">Loading Google Maps...</p>
          <p className="text-xs text-muted-foreground mt-1">This may take a few moments</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={getCurrentLocation} disabled={!map}>
            <Navigation className="h-4 w-4 mr-2" />
            My Location
          </Button>
          {showImportButton && (
            <Button variant="outline" size="sm" onClick={importPOIsFromMap} disabled={!map}>
              <Download className="h-4 w-4 mr-2" />
              Import POIs
            </Button>
          )}
        </div>
        {importedPOIs.length > 0 && <Badge variant="secondary">{importedPOIs.length} POIs imported</Badge>}
      </div>

      <div ref={mapRef} className="w-full rounded-lg border" style={{ height }} />

      {selectedPOI && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedPOI.name}</span>
              <Badge>{selectedPOI.category}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                <span className="font-semibold">{selectedPOI.rating}</span>
                <span className="text-muted-foreground ml-1">({selectedPOI.reviewCount} reviews)</span>
              </div>
              {selectedPOI.price && <Badge variant="outline">{selectedPOI.price}</Badge>}
            </div>
            {selectedPOI.address && <p className="text-sm text-muted-foreground mb-2">{selectedPOI.address}</p>}
            <div className="flex gap-2">
              <Button size="sm">View Details</Button>
              <Button size="sm" variant="outline">
                Get Directions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
