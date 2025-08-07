"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, MapPin, Star, ExternalLink, LinkIcon, Search, Upload, AlertCircle } from 'lucide-react'

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
  description?: string
  hours?: { [key: string]: string }
  source: 'url' | 'search' | 'nearby' | 'file'
}

interface GoogleMapsImportProps {
  onImport: (pois: POI[]) => void
}

export function GoogleMapsImport({ onImport }: GoogleMapsImportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // URL Import
  const [mapUrl, setMapUrl] = useState('')
  const [urlPOIs, setUrlPOIs] = useState<POI[]>([])
  
  // Search Import
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('Paris, France')
  const [searchPOIs, setSearchPOIs] = useState<POI[]>([])
  
  // File Import
  const [filePOIs, setFilePOIs] = useState<POI[]>([])
  
  const [selectedPOIs, setSelectedPOIs] = useState<Set<string>>(new Set())

  // URL Import Functions
  const handleUrlImport = async () => {
    if (!mapUrl.trim()) {
      setError('Please enter a Google Maps URL')
      return
    }

    setIsLoading(true)
    setError(null)
    setImportProgress(0)

    try {
      // Simulate progress
      setImportProgress(20)
      
      const urlType = detectUrlType(mapUrl)
      let pois: POI[] = []

      switch (urlType) {
        case 'place':
          pois = await importFromPlaceUrl(mapUrl)
          break
        case 'search':
          pois = await importFromSearchUrl(mapUrl)
          break
        case 'directions':
          pois = await importFromDirectionsUrl(mapUrl)
          break
        case 'mymap':
          pois = await importFromMyMapUrl(mapUrl)
          break
        case 'list':
          pois = await importFromListUrl(mapUrl)
          break
        default:
          pois = await importFromGenericUrl(mapUrl)
      }

      setImportProgress(100)
      setUrlPOIs(pois)
      setSelectedPOIs(new Set(pois.map(poi => poi.id)))
      setSuccess(`Successfully imported ${pois.length} places from URL`)
      
    } catch (err) {
      setError('Failed to import from URL. Please check the link and try again.')
      console.error('URL import error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const detectUrlType = (url: string): string => {
    if (url.includes('/place/')) return 'place'
    if (url.includes('/search/')) return 'search'
    if (url.includes('/dir/')) return 'directions'
    if (url.includes('mymaps.google.com')) return 'mymap'
    if (url.includes('/lists/')) return 'list'
    return 'generic'
  }

  const importFromPlaceUrl = async (url: string): Promise<POI[]> => {
    setImportProgress(40)
    
    // Extract place information from URL
    const placeMatch = url.match(/\/place\/([^\/]+)/)
    const coordsMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+)z/)
    const placeIdMatch = url.match(/place_id:([a-zA-Z0-9_-]+)/)
    
    setImportProgress(60)
    
    // Simulate API call to get place details
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const placeName = placeMatch ? decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')) : 'Imported Place'
    const coords = coordsMatch ? { lat: parseFloat(coordsMatch[1]), lng: parseFloat(coordsMatch[2]) } : { lat: 48.8566, lng: 2.3522 }
    
    setImportProgress(80)
    
    return [{
      id: `place-${Date.now()}`,
      name: placeName,
      category: 'Attraction',
      rating: 4.0 + Math.random(),
      reviewCount: Math.floor(Math.random() * 1000) + 100,
      lat: coords.lat,
      lng: coords.lng,
      placeId: placeIdMatch?.[1],
      address: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
      source: 'url'
    }]
  }

  const importFromSearchUrl = async (url: string): Promise<POI[]> => {
    setImportProgress(30)
    
    const searchMatch = url.match(/\/search\/([^\/\?]+)/)
    const query = searchMatch ? decodeURIComponent(searchMatch[1].replace(/\+/g, ' ')) : 'restaurants'
    
    setImportProgress(50)
    
    // Simulate search results
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockResults: POI[] = Array.from({ length: 8 }, (_, i) => ({
      id: `search-${Date.now()}-${i}`,
      name: `${query} Result ${i + 1}`,
      category: getCategoryFromQuery(query),
      rating: 3.5 + Math.random() * 1.5,
      reviewCount: Math.floor(Math.random() * 500) + 50,
      price: ['€', '€€', '€€€'][Math.floor(Math.random() * 3)],
      lat: 48.8566 + (Math.random() - 0.5) * 0.02,
      lng: 2.3522 + (Math.random() - 0.5) * 0.02,
      address: `${Math.floor(Math.random() * 999) + 1} Rue Example, Paris`,
      source: 'url'
    }))
    
    setImportProgress(90)
    return mockResults
  }

  const importFromDirectionsUrl = async (url: string): Promise<POI[]> => {
    setImportProgress(40)
    
    // Extract origin and destination
    const originMatch = url.match(/origin=([^&]+)/)
    const destMatch = url.match(/destination=([^&]+)/)
    
    setImportProgress(70)
    
    const pois: POI[] = []
    
    if (originMatch) {
      pois.push({
        id: `origin-${Date.now()}`,
        name: decodeURIComponent(originMatch[1].replace(/\+/g, ' ')),
        category: 'Location',
        rating: 0,
        reviewCount: 0,
        lat: 48.8566 + (Math.random() - 0.5) * 0.01,
        lng: 2.3522 + (Math.random() - 0.5) * 0.01,
        address: 'Origin Location',
        source: 'url'
      })
    }
    
    if (destMatch) {
      pois.push({
        id: `dest-${Date.now()}`,
        name: decodeURIComponent(destMatch[1].replace(/\+/g, ' ')),
        category: 'Location',
        rating: 0,
        reviewCount: 0,
        lat: 48.8566 + (Math.random() - 0.5) * 0.01,
        lng: 2.3522 + (Math.random() - 0.5) * 0.01,
        address: 'Destination Location',
        source: 'url'
      })
    }
    
    return pois
  }

  const importFromMyMapUrl = async (url: string): Promise<POI[]> => {
    setImportProgress(30)
    
    // Extract map ID from My Maps URL
    const mapIdMatch = url.match(/mid=([a-zA-Z0-9_-]+)/)
    
    setImportProgress(60)
    
    // Simulate My Maps data extraction
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockMyMapPOIs: POI[] = Array.from({ length: 12 }, (_, i) => ({
      id: `mymap-${Date.now()}-${i}`,
      name: `My Map Place ${i + 1}`,
      category: ['Restaurant', 'Hotel', 'Museum', 'Attraction'][i % 4],
      rating: 4.0 + Math.random(),
      reviewCount: Math.floor(Math.random() * 300) + 20,
      price: Math.random() > 0.5 ? ['€€', '€€€'][Math.floor(Math.random() * 2)] : undefined,
      lat: 48.8566 + (Math.random() - 0.5) * 0.03,
      lng: 2.3522 + (Math.random() - 0.5) * 0.03,
      address: `Custom location ${i + 1}`,
      description: `Custom description for place ${i + 1}`,
      source: 'url'
    }))
    
    setImportProgress(90)
    return mockMyMapPOIs
  }

  const importFromListUrl = async (url: string): Promise<POI[]> => {
    setImportProgress(40)
    
    // Simulate list import
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockListPOIs: POI[] = Array.from({ length: 6 }, (_, i) => ({
      id: `list-${Date.now()}-${i}`,
      name: `List Item ${i + 1}`,
      category: 'Restaurant',
      rating: 4.2 + Math.random() * 0.8,
      reviewCount: Math.floor(Math.random() * 800) + 100,
      price: '€€€',
      lat: 48.8566 + (Math.random() - 0.5) * 0.02,
      lng: 2.3522 + (Math.random() - 0.5) * 0.02,
      address: `List location ${i + 1}`,
      source: 'url'
    }))
    
    setImportProgress(85)
    return mockListPOIs
  }

  const importFromGenericUrl = async (url: string): Promise<POI[]> => {
    setImportProgress(50)
    
    // Try to extract coordinates
    const coordsMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+)z/)
    
    if (coordsMatch) {
      const lat = parseFloat(coordsMatch[1])
      const lng = parseFloat(coordsMatch[2])
      
      // Simulate nearby search
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return [{
        id: `generic-${Date.now()}`,
        name: 'Location from URL',
        category: 'Location',
        rating: 0,
        reviewCount: 0,
        lat,
        lng,
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        source: 'url'
      }]
    }
    
    throw new Error('Could not extract location data from URL')
  }

  // Search Import Functions
  const handleSearchImport = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query')
      return
    }

    setIsLoading(true)
    setError(null)
    setImportProgress(0)

    try {
      setImportProgress(30)
      
      // Simulate Places API search
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockSearchResults: POI[] = Array.from({ length: 10 }, (_, i) => ({
        id: `search-${Date.now()}-${i}`,
        name: `${searchQuery} - Result ${i + 1}`,
        category: getCategoryFromQuery(searchQuery),
        rating: 3.8 + Math.random() * 1.2,
        reviewCount: Math.floor(Math.random() * 600) + 50,
        price: Math.random() > 0.3 ? ['€', '€€', '€€€'][Math.floor(Math.random() * 3)] : undefined,
        lat: 48.8566 + (Math.random() - 0.5) * 0.04,
        lng: 2.3522 + (Math.random() - 0.5) * 0.04,
        address: `${Math.floor(Math.random() * 999) + 1} Street Name, ${searchLocation}`,
        phone: `+33 1 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        website: `www.example-${i + 1}.com`,
        source: 'search'
      }))
      
      setImportProgress(100)
      setSearchPOIs(mockSearchResults)
      setSelectedPOIs(new Set(mockSearchResults.map(poi => poi.id)))
      setSuccess(`Found ${mockSearchResults.length} places for "${searchQuery}"`)
      
    } catch (err) {
      setError('Search failed. Please try a different query.')
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // File Import Functions
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)
    setImportProgress(0)

    try {
      setImportProgress(20)
      
      const text = await file.text()
      setImportProgress(50)
      
      let pois: POI[] = []
      
      if (file.name.endsWith('.json')) {
        pois = await parseJsonFile(text)
      } else if (file.name.endsWith('.csv')) {
        pois = await parseCsvFile(text)
      } else if (file.name.endsWith('.kml')) {
        pois = await parseKmlFile(text)
      } else {
        throw new Error('Unsupported file format')
      }
      
      setImportProgress(100)
      setFilePOIs(pois)
      setSelectedPOIs(new Set(pois.map(poi => poi.id)))
      setSuccess(`Imported ${pois.length} places from ${file.name}`)
      
    } catch (err) {
      setError('Failed to parse file. Please check the format and try again.')
      console.error('File import error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const parseJsonFile = async (text: string): Promise<POI[]> => {
    const data = JSON.parse(text)
    
    // Handle different JSON formats
    if (Array.isArray(data)) {
      return data.map((item, index) => ({
        id: `json-${Date.now()}-${index}`,
        name: item.name || item.title || `Place ${index + 1}`,
        category: item.category || item.type || 'Location',
        rating: item.rating || 0,
        reviewCount: item.reviewCount || item.reviews || 0,
        price: item.price || item.priceLevel,
        lat: parseFloat(item.lat || item.latitude || item.coordinates?.lat || 0),
        lng: parseFloat(item.lng || item.longitude || item.coordinates?.lng || 0),
        address: item.address || item.location,
        phone: item.phone || item.phoneNumber,
        website: item.website || item.url,
        description: item.description || item.notes,
        source: 'file'
      }))
    }
    
    throw new Error('Invalid JSON format')
  }

  const parseCsvFile = async (text: string): Promise<POI[]> => {
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim())
      const row: any = {}
      
      headers.forEach((header, i) => {
        row[header] = values[i] || ''
      })
      
      return {
        id: `csv-${Date.now()}-${index}`,
        name: row.name || row.title || `Place ${index + 1}`,
        category: row.category || row.type || 'Location',
        rating: parseFloat(row.rating) || 0,
        reviewCount: parseInt(row.reviews) || parseInt(row.reviewcount) || 0,
        price: row.price || row.pricelevel,
        lat: parseFloat(row.lat || row.latitude) || 0,
        lng: parseFloat(row.lng || row.longitude) || 0,
        address: row.address || row.location,
        phone: row.phone || row.phonenumber,
        website: row.website || row.url,
        description: row.description || row.notes,
        source: 'file'
      }
    })
  }

  const parseKmlFile = async (text: string): Promise<POI[]> => {
    // Simple KML parsing (in a real implementation, you'd use a proper XML parser)
    const placemarkRegex = /<Placemark>(.*?)<\/Placemark>/gs
    const nameRegex = /<name>(.*?)<\/name>/
    const descRegex = /<description>(.*?)<\/description>/
    const coordsRegex = /<coordinates>(.*?)<\/coordinates>/
    
    const placemarks = text.match(placemarkRegex) || []
    
    return placemarks.map((placemark, index) => {
      const nameMatch = placemark.match(nameRegex)
      const descMatch = placemark.match(descRegex)
      const coordsMatch = placemark.match(coordsRegex)
      
      let lat = 0, lng = 0
      if (coordsMatch) {
        const coords = coordsMatch[1].trim().split(',')
        lng = parseFloat(coords[0]) || 0
        lat = parseFloat(coords[1]) || 0
      }
      
      return {
        id: `kml-${Date.now()}-${index}`,
        name: nameMatch?.[1] || `KML Place ${index + 1}`,
        category: 'Location',
        rating: 0,
        reviewCount: 0,
        lat,
        lng,
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        description: descMatch?.[1],
        source: 'file'
      }
    })
  }

  // Helper Functions
  const getCategoryFromQuery = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes('restaurant') || lowerQuery.includes('food') || lowerQuery.includes('cafe')) return 'Restaurant'
    if (lowerQuery.includes('hotel') || lowerQuery.includes('accommodation')) return 'Hotel'
    if (lowerQuery.includes('museum') || lowerQuery.includes('gallery')) return 'Museum'
    if (lowerQuery.includes('bar') || lowerQuery.includes('club') || lowerQuery.includes('nightlife')) return 'Nightlife'
    if (lowerQuery.includes('shop') || lowerQuery.includes('store') || lowerQuery.includes('mall')) return 'Shopping'
    return 'Attraction'
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
    const allPOIs = [...urlPOIs, ...searchPOIs, ...filePOIs]
    const selectedPOIsList = allPOIs.filter(poi => selectedPOIs.has(poi.id))
    onImport(selectedPOIsList)
    
    // Reset state
    setIsOpen(false)
    setUrlPOIs([])
    setSearchPOIs([])
    setFilePOIs([])
    setSelectedPOIs(new Set())
    setMapUrl('')
    setSearchQuery('')
    setError(null)
    setSuccess(null)
  }

  const renderPOICard = (poi: POI) => (
    <Card key={poi.id} className="p-4">
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={selectedPOIs.has(poi.id)}
          onCheckedChange={(checked) => handlePOISelection(poi.id, checked as boolean)}
        />
        <div className="flex-1 space-y-2">
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
            {poi.rating > 0 && (
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                <span className="text-sm font-semibold">{poi.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground ml-1">
                  ({poi.reviewCount})
                </span>
              </div>
            )}
          </div>
          
          {poi.address && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {poi.address}
            </div>
          )}
          
          {poi.description && (
            <p className="text-sm text-muted-foreground">{poi.description}</p>
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
  )

  const allPOIs = [...urlPOIs, ...searchPOIs, ...filePOIs]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Import from Google Maps
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import from Google Maps</DialogTitle>
          <DialogDescription>
            Import places from Google Maps URLs, search for places, or upload files with location data.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Importing...</span>
              <span>{importProgress}%</span>
            </div>
            <Progress value={importProgress} />
          </div>
        )}

        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url" className="flex items-center">
              <LinkIcon className="h-4 w-4 mr-2" />
              From URL
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Search Places
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-6">
            <div className="space-y-4">
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
                    onClick={handleUrlImport}
                    disabled={!mapUrl.trim() || isLoading}
                  >
                    Import
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Supported: Place URLs, Search URLs, Directions, My Maps, Lists
                </p>
              </div>

              {urlPOIs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Imported from URL ({urlPOIs.length} places)
                  </h3>
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {urlPOIs.map(renderPOICard)}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search-query">Search Query</Label>
                  <Input
                    id="search-query"
                    placeholder="restaurants, hotels, museums..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search-location">Location</Label>
                  <Input
                    id="search-location"
                    placeholder="Paris, France"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSearchImport}
                disabled={!searchQuery.trim() || isLoading}
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Places
              </Button>

              {searchPOIs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Search Results ({searchPOIs.length} places)
                  </h3>
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {searchPOIs.map(renderPOICard)}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json,.csv,.kml"
                  onChange={handleFileImport}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: JSON, CSV, KML (Google Earth)
                </p>
              </div>

              {filePOIs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Imported from File ({filePOIs.length} places)
                  </h3>
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {filePOIs.map(renderPOICard)}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {allPOIs.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                {selectedPOIs.size} of {allPOIs.length} places selected
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPOIs(new Set(allPOIs.map(poi => poi.id)))}
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
        )}
      </DialogContent>
    </Dialog>
  )
}
