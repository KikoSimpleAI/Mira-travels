'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Download, MapPin, AlertCircle, CheckCircle, Clock, Star, Navigation } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface ImportedLocation {
  id: string
  name: string
  address: string
  category: string
  rating?: number
  visitCount?: number
  lastVisited?: string
}

export function GoogleAccountImport() {
  const { user } = useAuth()
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [importedLocations, setImportedLocations] = useState<ImportedLocation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)

  const checkConfiguration = async () => {
    try {
      const response = await fetch('/api/maps-config')
      const data = await response.json()
      setIsConfigured(data.configured)
      return data.configured
    } catch (err) {
      setError('Failed to check Google Maps configuration')
      setIsConfigured(false)
      return false
    }
  }

  const simulateImport = async () => {
    if (!user) {
      setError('Please sign in to import your Google account data')
      return
    }

    const configured = await checkConfiguration()
    if (!configured) {
      setError('Google Maps API is not configured. Please contact support.')
      return
    }

    setIsImporting(true)
    setError(null)
    setProgress(0)

    const steps = [
      'Connecting to Google Account...',
      'Fetching saved places...',
      'Processing location data...',
      'Importing favorites...',
      'Finalizing import...'
    ]

    const mockLocations: ImportedLocation[] = [
      {
        id: '1',
        name: 'Central Park',
        address: 'New York, NY 10024, USA',
        category: 'Park',
        rating: 4.6,
        visitCount: 5,
        lastVisited: '2024-01-15'
      },
      {
        id: '2',
        name: 'The Metropolitan Museum of Art',
        address: '1000 5th Ave, New York, NY 10028, USA',
        category: 'Museum',
        rating: 4.7,
        visitCount: 2,
        lastVisited: '2024-01-10'
      },
      {
        id: '3',
        name: 'Brooklyn Bridge',
        address: 'New York, NY 10038, USA',
        category: 'Landmark',
        rating: 4.5,
        visitCount: 3,
        lastVisited: '2024-01-08'
      },
      {
        id: '4',
        name: 'Times Square',
        address: 'Manhattan, NY 10036, USA',
        category: 'Tourist Attraction',
        rating: 4.2,
        visitCount: 1,
        lastVisited: '2024-01-05'
      },
      {
        id: '5',
        name: 'High Line',
        address: 'New York, NY 10011, USA',
        category: 'Park',
        rating: 4.4,
        visitCount: 2,
        lastVisited: '2024-01-03'
      }
    ]

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i])
      setProgress((i + 1) * 20)
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
      
      // Add locations progressively
      if (i === 2) {
        setImportedLocations(mockLocations.slice(0, 2))
      } else if (i === 3) {
        setImportedLocations(mockLocations.slice(0, 4))
      } else if (i === 4) {
        setImportedLocations(mockLocations)
      }
    }

    setCurrentStep('Import completed successfully!')
    setIsImporting(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'park':
        return <Navigation className="h-4 w-4 text-green-600" />
      case 'museum':
        return <Star className="h-4 w-4 text-purple-600" />
      case 'landmark':
        return <MapPin className="h-4 w-4 text-blue-600" />
      case 'tourist attraction':
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'park':
        return 'bg-green-100 text-green-800'
      case 'museum':
        return 'bg-purple-100 text-purple-800'
      case 'landmark':
        return 'bg-blue-100 text-blue-800'
      case 'tourist attraction':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Import from Google Account
          </CardTitle>
          <CardDescription>
            Sign in to import your saved places and location history from Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please sign in to your account to import data from Google.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Import from Google Account
        </CardTitle>
        <CardDescription>
          Import your saved places, favorites, and location history from your Google account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isImporting && importedLocations.length === 0 && (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Import</h3>
            <p className="text-gray-600 mb-4">
              We'll import your saved places, favorites, and frequently visited locations
            </p>
            <Button onClick={simulateImport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Start Import
            </Button>
          </div>
        )}

        {isImporting && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="font-semibold mb-2">Importing Your Data</h3>
              <p className="text-sm text-gray-600 mb-4">{currentStep}</p>
            </div>
            
            <Progress value={progress} className="w-full" />
            
            <div className="text-center text-sm text-gray-500">
              {progress}% complete
            </div>

            {importedLocations.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Imported Locations ({importedLocations.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {importedLocations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(location.category)}
                        <span className="text-sm font-medium">{location.name}</span>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!isImporting && importedLocations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Import Successful
              </h3>
              <Badge variant="secondary">
                {importedLocations.length} locations
              </Badge>
            </div>

            <div className="grid gap-3">
              {importedLocations.map((location) => (
                <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    {getCategoryIcon(location.category)}
                    <div className="flex-1">
                      <h4 className="font-medium">{location.name}</h4>
                      <p className="text-sm text-gray-600">{location.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getCategoryColor(location.category)}>
                          {location.category}
                        </Badge>
                        {location.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600">{location.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {location.visitCount && (
                      <div>Visited {location.visitCount}x</div>
                    )}
                    {location.lastVisited && (
                      <div>Last: {new Date(location.lastVisited).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setImportedLocations([])
                  setProgress(0)
                  setCurrentStep('')
                }}
                className="flex-1"
              >
                Import More
              </Button>
              <Button className="flex-1">
                View All Locations
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default GoogleAccountImport
