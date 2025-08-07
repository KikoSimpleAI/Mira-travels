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
    info?: string
  }>
  className?: string
}

export default function GoogleMaps({ 
  center = { lat: 40.7128, lng: -74.0060 }, 
  zoom = 10, 
  markers = [],
  className = "h-96"
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          if (mounted) {
            setIsLoaded(true)
            setIsLoading(false)
          }
          return
        }

        // Fetch configuration from server
        const response = await fetch('/api/maps-config')
        if (!response.ok) {
          throw new Error('Failed to load maps configuration')
        }

        const config = await response.json()
        if (!config.configured) {
          throw new Error('Google Maps API not configured')
        }

        // Load Google Maps script
        const script = document.createElement('script')
        script.src = config.scriptUrl
        script.async = true
        script.defer = true
        
        script.onload = () => {
          if (mounted) {
            setIsLoaded(true)
            setIsLoading(false)
          }
        }
        
        script.onerror = () => {
          if (mounted) {
            setError('Failed to load Google Maps')
            setIsLoading(false)
          }
        }

        document.head.appendChild(script)

        return () => {
          document.head.removeChild(script)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load maps')
          setIsLoading(false)
        }
      }
    }

    loadGoogleMaps()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (isLoaded && mapRef.current && window.google) {
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

        if (marker.info) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-semibold">${marker.title}</h3>
                <p class="text-sm text-gray-600">${marker.info}</p>
              </div>
            `
          })

          mapMarker.addListener('click', () => {
            infoWindow.open(map, mapMarker)
          })
        }
      })
    }
  }, [isLoaded, center, zoom, markers])

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-0 h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <Skeleton className="h-full w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-8 w-8 mx-auto text-gray-400 animate-pulse" />
                <p className="text-sm text-gray-500">Loading map...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6 h-full flex items-center justify-center">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}. Map functionality is temporarily unavailable.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-0 h-full">
        <div ref={mapRef} className="w-full h-full rounded-lg" />
      </CardContent>
    </Card>
  )
}
