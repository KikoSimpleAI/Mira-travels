'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, AlertCircle } from 'lucide-react'

interface GoogleMapsProps {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{
    position: { lat: number; lng: number }
    title: string
    description?: string
  }>
  className?: string
}

export function GoogleMaps({ 
  center = { lat: 40.7128, lng: -74.0060 }, 
  zoom = 10, 
  markers = [],
  className = ""
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    try {
      const response = await fetch('/api/maps-config')
      const data = await response.json()
      setIsConfigured(data.configured)
      
      if (data.configured) {
        loadGoogleMaps()
      } else {
        setError('Google Maps is not configured. Please add your API key.')
      }
    } catch (err) {
      setError('Failed to check Google Maps configuration')
      setIsConfigured(false)
    }
  }

  const loadGoogleMaps = async () => {
    try {
      // Load the Google Maps script from our secure endpoint
      const script = document.createElement('script')
      script.src = '/api/maps-script'
      script.async = true
      script.defer = true
      
      script.onload = () => {
        // Wait for Google Maps to be available
        const checkGoogleMaps = () => {
          if (window.google && window.google.maps) {
            initializeMap()
          } else {
            setTimeout(checkGoogleMaps, 100)
          }
        }
        checkGoogleMaps()
      }
      
      script.onerror = () => {
        setError('Failed to load Google Maps')
      }
      
      document.head.appendChild(script)
    } catch (err) {
      setError('Error loading Google Maps')
    }
  }

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      // Add markers
      markers.forEach(marker => {
        const mapMarker = new window.google.maps.Marker({
          position: marker.position,
          map,
          title: marker.title
        })

        if (marker.description) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-semibold">${marker.title}</h3>
                <p class="text-sm text-gray-600">${marker.description}</p>
              </div>
            `
          })

          mapMarker.addListener('click', () => {
            infoWindow.open(map, mapMarker)
          })
        }
      })

      setIsLoaded(true)
    } catch (err) {
      setError('Failed to initialize map')
    }
  }

  if (isConfigured === null) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isConfigured || error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Google Maps is not available. Please configure your API key.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg"
          style={{ minHeight: '400px' }}
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Initializing map...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default GoogleMaps

// Extend the Window interface to include Google Maps
declare global {
  interface Window {
    google: any
  }
}
