'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/use-auth'
import { MapPin, Download, CheckCircle, AlertCircle, Clock, Star, Calendar, Navigation } from 'lucide-react'

interface ImportedPlace {
  id: string
  name: string
  address: string
  rating?: number
  category: string
  visitDate?: string
  coordinates?: { lat: number; lng: number }
}

export default function GoogleAccountImport() {
  const { user } = useAuth()
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importedPlaces, setImportedPlaces] = useState<ImportedPlace[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)

  const checkConfiguration = async () => {
    try {
      const response = await fetch('/api/maps-config')
      const config = await response.json()
      setIsConfigured(config.configured)
      return config.configured
    } catch (err) {
      setError('Failed to check Google Maps configuration')
      setIsConfigured(false)
      return false
    }
  }

  const handleImport = async () => {
    if (!user) {
      setError('Please sign in to import your Google data')
      return
    }

    const configured = await checkConfiguration()
    if (!configured) {
      setError('Google Maps integration is not configured')
      return
    }

    setIsImporting(true)
    setError(null)
    setImportProgress(0)

    try {
      // Simulate import process with mock data
      const mockPlaces: ImportedPlace[] = [
        {
          id: '1',
          name: 'Central Park',
          address: 'New York, NY 10024, USA',
          rating: 4.6,
          category: 'Park',
          visitDate: '2024-01-15',
          coordinates: { lat: 40.7829, lng: -73.9654 }
        },
        {
          id: '2',
          name: 'Times Square',
          address: 'Times Square, New York, NY 10036, USA',
          rating: 4.3,
          category: 'Tourist Attraction',
          visitDate: '2024-01-16',
          coordinates: { lat: 40.7580, lng: -73.9855 }
        },
        {
          id: '3',
          name: 'Brooklyn Bridge',
          address: 'New York, NY 10038, USA',
          rating: 4.7,
          category: 'Bridge',
          visitDate: '2024-01-17',
          coordinates: { lat: 40.7061, lng: -73.9969 }
        },
        {
          id: '4',
          name: 'Statue of Liberty',
          address: 'New York, NY 10004, USA',
          rating: 4.5,
          category: 'Monument',
          visitDate: '2024-01-18',
          coordinates: { lat: 40.6892, lng: -74.0445 }
        }
      ]

      // Simulate progressive import
      for (let i = 0; i < mockPlaces.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setImportProgress(((i + 1) / mockPlaces.length) * 100)
        setImportedPlaces(prev => [...prev, mockPlaces[i]])
      }

      // Final success state
      setTimeout(() => {
        setIsImporting(false)
      }, 500)

    } catch (err) {
      setError('Failed to import Google data. Please try again.')
      setIsImporting(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'park':
        return <Navigation className="h-4 w-4 text-green-600" />
      case 'tourist attraction':
        return <Star className="h-4 w-4 text-yellow-600" />
      case 'bridge':
        return <MapPin className="h-4 w-4 text-blue-600" />
      case 'monument':
        return <Calendar className="h-4 w-4 text-purple-600" />
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Import from Google Account</span>
          </CardTitle>
          <CardDescription>
            Import your saved places, reviews, and travel history from your Google account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!user && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please sign in to your account to import Google data
              </AlertDescription>
            </Alert>
          )}

          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importing your places...</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
          )}

          <Button 
            onClick={handleImport}
            disabled={!user || isImporting || isConfigured === false}
            className="w-full"
          >
            {isImporting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Import Google Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {importedPlaces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Imported Places ({importedPlaces.length})</span>
              <Badge variant="secondary">
                <CheckCircle className="h-3 w-3 mr-1" />
                Success
              </Badge>
            </CardTitle>
            <CardDescription>
              Your places have been successfully imported and are ready to use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {importedPlaces.map((place) => (
                <div key={place.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(place.category)}
                    <div>
                      <h4 className="font-medium">{place.name}</h4>
                      <p className="text-sm text-gray-600">{place.address}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {place.category}
                        </Badge>
                        {place.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{place.rating}</span>
                          </div>
                        )}
                        {place.visitDate && (
                          <span className="text-xs text-gray-500">
                            Visited {new Date(place.visitDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
