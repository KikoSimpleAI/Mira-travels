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
import { Download, MapPin, Star, ExternalLink, LinkIcon, Search, Upload, AlertCircle, Globe, Users } from 'lucide-react'

interface Destination {
  id: string
  name: string
  country: string
  region?: string
  description: string
  image: string
  rating: number
  reviewCount: number
  poiCount: number
  categories: string[]
  coordinates: { lat: number; lng: number }
  bestTimeToVisit?: string
  averageStay?: string
  budget?: 'Budget' | 'Mid-range' | 'Luxury'
  highlights: string[]
  source: 'url' | 'search' | 'file' | 'manual'
  importedAt: Date
}

interface DestinationsImportProps {
  onImport: (destinations: Destination[]) => void
}

export function DestinationsImport({ onImport }: DestinationsImportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // URL Import
  const [mapUrl, setMapUrl] = useState('')
  const [urlDestinations, setUrlDestinations] = useState<Destination[]>([])
  
  // Search Import
  const [searchQuery, setSearchQuery] = useState('')
  const [searchRegion, setSearchRegion] = useState('Europe')
  const [searchDestinations, setSearchDestinations] = useState<Destination[]>([])
  
  // File Import
  const [fileDestinations, setFileDestinations] = useState<Destination[]>([])
  
  const [selectedDestinations, setSelectedDestinations] = useState<Set<string>>(new Set())

  // URL Import Functions
  const handleUrlImport = async () => {
    if (!mapUrl.trim()) {
      setError('Please enter a Google Maps URL or travel blog URL')
      return
    }

    setIsLoading(true)
    setError(null)
    setImportProgress(0)

    try {
      setImportProgress(20)
      
      const urlType = detectUrlType(mapUrl)
      let destinations: Destination[] = []

      switch (urlType) {
        case 'travel_guide':
          destinations = await importFromTravelGuide(mapUrl)
          break
        case 'my_maps':
          destinations = await importFromMyMaps(mapUrl)
          break
        case 'search_results':
          destinations = await importFromSearchResults(mapUrl)
          break
        case 'travel_blog':
          destinations = await importFromTravelBlog(mapUrl)
          break
        default:
          destinations = await importFromGenericUrl(mapUrl)
      }

      setImportProgress(100)
      setUrlDestinations(destinations)
      setSelectedDestinations(new Set(destinations.map(dest => dest.id)))
      setSuccess(`Successfully imported ${destinations.length} destinations from URL`)
      
    } catch (err) {
      setError('Failed to import destinations. Please check the URL and try again.')
      console.error('URL import error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const detectUrlType = (url: string): string => {
    if (url.includes('mymaps.google.com')) return 'my_maps'
    if (url.includes('maps.google.com/search')) return 'search_results'
    if (url.includes('travel') || url.includes('guide') || url.includes('blog')) return 'travel_blog'
    if (url.includes('maps.google.com')) return 'travel_guide'
    return 'generic'
  }

  const importFromTravelGuide = async (url: string): Promise<Destination[]> => {
    setImportProgress(40)
    
    // Simulate extracting destinations from a travel guide URL
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockDestinations: Destination[] = [
      {
        id: `dest-${Date.now()}-1`,
        name: 'Paris',
        country: 'France',
        region: 'Île-de-France',
        description: 'The City of Light, famous for its art, fashion, gastronomy, and culture. Home to iconic landmarks like the Eiffel Tower and Louvre Museum.',
        image: '/placeholder.svg?height=300&width=400&text=Paris+Skyline',
        rating: 4.8,
        reviewCount: 125847,
        poiCount: 2847,
        categories: ['Culture', 'Art', 'Food', 'Romance', 'History'],
        coordinates: { lat: 48.8566, lng: 2.3522 },
        bestTimeToVisit: 'April-June, September-October',
        averageStay: '3-5 days',
        budget: 'Mid-range',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Champs-Élysées', 'Montmartre'],
        source: 'url',
        importedAt: new Date()
      },
      {
        id: `dest-${Date.now()}-2`,
        name: 'Rome',
        country: 'Italy',
        region: 'Lazio',
        description: 'The Eternal City, where ancient history meets modern life. Explore the Colosseum, Vatican City, and incredible Italian cuisine.',
        image: '/placeholder.svg?height=300&width=400&text=Rome+Colosseum',
        rating: 4.7,
        reviewCount: 98234,
        poiCount: 1923,
        categories: ['History', 'Culture', 'Food', 'Architecture', 'Religion'],
        coordinates: { lat: 41.9028, lng: 12.4964 },
        bestTimeToVisit: 'April-June, September-November',
        averageStay: '3-4 days',
        budget: 'Mid-range',
        highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum', 'Pantheon'],
        source: 'url',
        importedAt: new Date()
      },
      {
        id: `dest-${Date.now()}-3`,
        name: 'Barcelona',
        country: 'Spain',
        region: 'Catalonia',
        description: 'A vibrant Mediterranean city known for Gaudí\'s architecture, beautiful beaches, and incredible nightlife.',
        image: '/placeholder.svg?height=300&width=400&text=Barcelona+Sagrada+Familia',
        rating: 4.6,
        reviewCount: 87456,
        poiCount: 1654,
        categories: ['Architecture', 'Beach', 'Nightlife', 'Food', 'Art'],
        coordinates: { lat: 41.3851, lng: 2.1734 },
        bestTimeToVisit: 'May-June, September-October',
        averageStay: '3-4 days',
        budget: 'Mid-range',
        highlights: ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Gothic Quarter', 'Barceloneta Beach'],
        source: 'url',
        importedAt: new Date()
      }
    ]
    
    setImportProgress(80)
    return mockDestinations
  }

  const importFromMyMaps = async (url: string): Promise<Destination[]> => {
    setImportProgress(30)
    
    // Extract map ID from My Maps URL
    const mapIdMatch = url.match(/mid=([a-zA-Z0-9_-]+)/)
    
    setImportProgress(60)
    
    // Simulate My Maps data extraction
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const mockMyMapsDestinations: Destination[] = [
      {
        id: `mymap-dest-${Date.now()}-1`,
        name: 'Tokyo',
        country: 'Japan',
        region: 'Kanto',
        description: 'A bustling metropolis where ultra-modern and traditional coexist. Experience cutting-edge technology, ancient temples, and incredible cuisine.',
        image: '/placeholder.svg?height=300&width=400&text=Tokyo+Skyline',
        rating: 4.9,
        reviewCount: 156789,
        poiCount: 3421,
        categories: ['Technology', 'Culture', 'Food', 'Shopping', 'Temples'],
        coordinates: { lat: 35.6762, lng: 139.6503 },
        bestTimeToVisit: 'March-May, September-November',
        averageStay: '5-7 days',
        budget: 'Luxury',
        highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree', 'Tsukiji Fish Market', 'Harajuku'],
        source: 'url',
        importedAt: new Date()
      },
      {
        id: `mymap-dest-${Date.now()}-2`,
        name: 'New York City',
        country: 'United States',
        region: 'New York',
        description: 'The city that never sleeps. Experience Broadway shows, world-class museums, diverse neighborhoods, and iconic landmarks.',
        image: '/placeholder.svg?height=300&width=400&text=NYC+Manhattan',
        rating: 4.7,
        reviewCount: 234567,
        poiCount: 4123,
        categories: ['Culture', 'Entertainment', 'Food', 'Shopping', 'Architecture'],
        coordinates: { lat: 40.7128, lng: -74.0060 },
        bestTimeToVisit: 'April-June, September-November',
        averageStay: '4-6 days',
        budget: 'Luxury',
        highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge', 'Empire State Building'],
        source: 'url',
        importedAt: new Date()
      }
    ]
    
    setImportProgress(90)
    return mockMyMapsDestinations
  }

  const importFromSearchResults = async (url: string): Promise<Destination[]> => {
    setImportProgress(40)
    
    // Extract search query from URL
    const searchMatch = url.match(/search\/([^\/\?]+)/)
    const query = searchMatch ? decodeURIComponent(searchMatch[1].replace(/\+/g, ' ')) : 'destinations'
    
    setImportProgress(70)
    
    // Simulate search results
    await new Promise(resolve => setTimeout(resolve, 1800))
    
    const mockSearchDestinations: Destination[] = [
      {
        id: `search-dest-${Date.now()}-1`,
        name: 'Amsterdam',
        country: 'Netherlands',
        region: 'North Holland',
        description: 'A charming city of canals, museums, and liberal culture. Famous for its artistic heritage and vibrant nightlife.',
        image: '/placeholder.svg?height=300&width=400&text=Amsterdam+Canals',
        rating: 4.5,
        reviewCount: 67890,
        poiCount: 1234,
        categories: ['Culture', 'Museums', 'Canals', 'Nightlife', 'History'],
        coordinates: { lat: 52.3676, lng: 4.9041 },
        bestTimeToVisit: 'April-October',
        averageStay: '2-3 days',
        budget: 'Mid-range',
        highlights: ['Anne Frank House', 'Van Gogh Museum', 'Jordaan District', 'Vondelpark', 'Red Light District'],
        source: 'url',
        importedAt: new Date()
      },
      {
        id: `search-dest-${Date.now()}-2`,
        name: 'Prague',
        country: 'Czech Republic',
        region: 'Central Bohemia',
        description: 'A fairy-tale city with stunning architecture, rich history, and affordable prices. Known as the "City of a Hundred Spires".',
        image: '/placeholder.svg?height=300&width=400&text=Prague+Castle',
        rating: 4.6,
        reviewCount: 54321,
        poiCount: 987,
        categories: ['History', 'Architecture', 'Culture', 'Beer', 'Castles'],
        coordinates: { lat: 50.0755, lng: 14.4378 },
        bestTimeToVisit: 'March-May, September-November',
        averageStay: '2-4 days',
        budget: 'Budget',
        highlights: ['Prague Castle', 'Charles Bridge', 'Old Town Square', 'Astronomical Clock', 'Wenceslas Square'],
        source: 'url',
        importedAt: new Date()
      }
    ]
    
    setImportProgress(90)
    return mockSearchDestinations
  }

  const importFromTravelBlog = async (url: string): Promise<Destination[]> => {
    setImportProgress(50)
    
    // Simulate blog content analysis
    await new Promise(resolve => setTimeout(resolve, 2200))
    
    const mockBlogDestinations: Destination[] = [
      {
        id: `blog-dest-${Date.now()}-1`,
        name: 'Santorini',
        country: 'Greece',
        region: 'South Aegean',
        description: 'A stunning Greek island famous for its white-washed buildings, blue domes, and spectacular sunsets over the Aegean Sea.',
        image: '/placeholder.svg?height=300&width=400&text=Santorini+Sunset',
        rating: 4.8,
        reviewCount: 43210,
        poiCount: 456,
        categories: ['Romance', 'Beach', 'Architecture', 'Wine', 'Sunset'],
        coordinates: { lat: 36.3932, lng: 25.4615 },
        bestTimeToVisit: 'April-June, September-October',
        averageStay: '3-5 days',
        budget: 'Luxury',
        highlights: ['Oia Village', 'Fira Town', 'Red Beach', 'Akrotiri Archaeological Site', 'Wine Tasting'],
        source: 'url',
        importedAt: new Date()
      }
    ]
    
    setImportProgress(85)
    return mockBlogDestinations
  }

  const importFromGenericUrl = async (url: string): Promise<Destination[]> => {
    setImportProgress(60)
    
    // Try to extract location information
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return [{
      id: `generic-dest-${Date.now()}`,
      name: 'Discovered Location',
      country: 'Unknown',
      description: 'Location discovered from URL analysis',
      image: '/placeholder.svg?height=300&width=400&text=Discovered+Location',
      rating: 0,
      reviewCount: 0,
      poiCount: 0,
      categories: ['Discovered'],
      coordinates: { lat: 0, lng: 0 },
      highlights: [],
      source: 'url',
      importedAt: new Date()
    }]
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
      
      // Simulate destination search
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockSearchResults: Destination[] = generateSearchResults(searchQuery, searchRegion)
      
      setImportProgress(100)
      setSearchDestinations(mockSearchResults)
      setSelectedDestinations(new Set(mockSearchResults.map(dest => dest.id)))
      setSuccess(`Found ${mockSearchResults.length} destinations for "${searchQuery}" in ${searchRegion}`)
      
    } catch (err) {
      setError('Search failed. Please try a different query.')
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSearchResults = (query: string, region: string): Destination[] => {
    const destinations = [
      {
        name: 'Vienna',
        country: 'Austria',
        region: 'Vienna',
        description: 'Imperial city with stunning architecture, classical music heritage, and coffeehouse culture.',
        coordinates: { lat: 48.2082, lng: 16.3738 },
        categories: ['Culture', 'Music', 'Architecture', 'Coffee', 'History'],
        highlights: ['Schönbrunn Palace', 'St. Stephen\'s Cathedral', 'Belvedere Palace', 'Vienna State Opera', 'Naschmarkt']
      },
      {
        name: 'Budapest',
        country: 'Hungary',
        region: 'Central Hungary',
        description: 'The Pearl of the Danube, famous for its thermal baths, stunning parliament building, and vibrant nightlife.',
        coordinates: { lat: 47.4979, lng: 19.0402 },
        categories: ['Thermal Baths', 'Architecture', 'Nightlife', 'History', 'River'],
        highlights: ['Parliament Building', 'Széchenyi Thermal Baths', 'Fisherman\'s Bastion', 'Chain Bridge', 'Ruin Bars']
      },
      {
        name: 'Lisbon',
        country: 'Portugal',
        region: 'Lisbon',
        description: 'A hilly coastal city known for its colorful buildings, historic trams, and delicious pastéis de nata.',
        coordinates: { lat: 38.7223, lng: -9.1393 },
        categories: ['History', 'Trams', 'Food', 'Ocean', 'Architecture'],
        highlights: ['Belém Tower', 'Jerónimos Monastery', 'Alfama District', 'Tram 28', 'Pastéis de Belém']
      }
    ]

    return destinations.map((dest, index) => ({
      id: `search-${Date.now()}-${index}`,
      ...dest,
      image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(dest.name)}`,
      rating: 4.0 + Math.random() * 0.9,
      reviewCount: Math.floor(Math.random() * 50000) + 10000,
      poiCount: Math.floor(Math.random() * 1000) + 200,
      bestTimeToVisit: 'April-October',
      averageStay: '2-4 days',
      budget: ['Budget', 'Mid-range', 'Luxury'][Math.floor(Math.random() * 3)] as any,
      source: 'search' as const,
      importedAt: new Date()
    }))
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
      
      let destinations: Destination[] = []
      
      if (file.name.endsWith('.json')) {
        destinations = await parseDestinationsJson(text)
      } else if (file.name.endsWith('.csv')) {
        destinations = await parseDestinationsCsv(text)
      } else {
        throw new Error('Unsupported file format')
      }
      
      setImportProgress(100)
      setFileDestinations(destinations)
      setSelectedDestinations(new Set(destinations.map(dest => dest.id)))
      setSuccess(`Imported ${destinations.length} destinations from ${file.name}`)
      
    } catch (err) {
      setError('Failed to parse file. Please check the format and try again.')
      console.error('File import error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const parseDestinationsJson = async (text: string): Promise<Destination[]> => {
    const data = JSON.parse(text)
    
    if (Array.isArray(data)) {
      return data.map((item, index) => ({
        id: `json-dest-${Date.now()}-${index}`,
        name: item.name || `Destination ${index + 1}`,
        country: item.country || 'Unknown',
        region: item.region,
        description: item.description || 'Imported destination',
        image: item.image || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(item.name || 'Destination')}`,
        rating: parseFloat(item.rating) || 0,
        reviewCount: parseInt(item.reviewCount) || 0,
        poiCount: parseInt(item.poiCount) || 0,
        categories: Array.isArray(item.categories) ? item.categories : ['Travel'],
        coordinates: {
          lat: parseFloat(item.lat || item.latitude || item.coordinates?.lat || 0),
          lng: parseFloat(item.lng || item.longitude || item.coordinates?.lng || 0)
        },
        bestTimeToVisit: item.bestTimeToVisit,
        averageStay: item.averageStay,
        budget: item.budget || 'Mid-range',
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        source: 'file' as const,
        importedAt: new Date()
      }))
    }
    
    throw new Error('Invalid JSON format')
  }

  const parseDestinationsCsv = async (text: string): Promise<Destination[]> => {
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim())
      const row: any = {}
      
      headers.forEach((header, i) => {
        row[header] = values[i] || ''
      })
      
      return {
        id: `csv-dest-${Date.now()}-${index}`,
        name: row.name || row.destination || `Destination ${index + 1}`,
        country: row.country || 'Unknown',
        region: row.region,
        description: row.description || 'Imported destination',
        image: row.image || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(row.name || 'Destination')}`,
        rating: parseFloat(row.rating) || 0,
        reviewCount: parseInt(row.reviews) || parseInt(row.reviewcount) || 0,
        poiCount: parseInt(row.pois) || parseInt(row.poicount) || 0,
        categories: row.categories ? row.categories.split(';') : ['Travel'],
        coordinates: {
          lat: parseFloat(row.lat || row.latitude) || 0,
          lng: parseFloat(row.lng || row.longitude) || 0
        },
        bestTimeToVisit: row.besttimetovisit || row.besttime,
        averageStay: row.averagestay || row.stay,
        budget: row.budget || 'Mid-range',
        highlights: row.highlights ? row.highlights.split(';') : [],
        source: 'file' as const,
        importedAt: new Date()
      }
    })
  }

  // Helper Functions
  const handleDestinationSelection = (destId: string, checked: boolean) => {
    const newSelected = new Set(selectedDestinations)
    if (checked) {
      newSelected.add(destId)
    } else {
      newSelected.delete(destId)
    }
    setSelectedDestinations(newSelected)
  }

  const handleImportSelected = () => {
    const allDestinations = [...urlDestinations, ...searchDestinations, ...fileDestinations]
    const selectedDestinationsList = allDestinations.filter(dest => selectedDestinations.has(dest.id))
    onImport(selectedDestinationsList)
    
    // Reset state
    setIsOpen(false)
    setUrlDestinations([])
    setSearchDestinations([])
    setFileDestinations([])
    setSelectedDestinations(new Set())
    setMapUrl('')
    setSearchQuery('')
    setError(null)
    setSuccess(null)
  }

  const renderDestinationCard = (destination: Destination) => (
    <Card key={destination.id} className="overflow-hidden">
      <div className="flex items-start space-x-4 p-4">
        <Checkbox
          checked={selectedDestinations.has(destination.id)}
          onCheckedChange={(checked) => handleDestinationSelection(destination.id, checked as boolean)}
        />
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={destination.image || "/placeholder.svg"}
            alt={destination.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-lg">{destination.name}</h4>
              <p className="text-sm text-muted-foreground">
                {destination.region ? `${destination.region}, ` : ''}{destination.country}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {destination.categories.slice(0, 3).map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  {destination.source}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              {destination.rating > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                  <span className="text-sm font-semibold">{destination.rating.toFixed(1)}</span>
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                {destination.reviewCount.toLocaleString()} reviews
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {destination.description}
          </p>
          
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {destination.poiCount} places
            </div>
            {destination.bestTimeToVisit && (
              <div>Best: {destination.bestTimeToVisit}</div>
            )}
            {destination.averageStay && (
              <div>Stay: {destination.averageStay}</div>
            )}
            {destination.budget && (
              <Badge variant="outline" className="text-xs">
                {destination.budget}
              </Badge>
            )}
          </div>
          
          {destination.highlights.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <strong>Highlights:</strong> {destination.highlights.slice(0, 3).join(', ')}
              {destination.highlights.length > 3 && '...'}
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  const allDestinations = [...urlDestinations, ...searchDestinations, ...fileDestinations]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Import Destinations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Destinations from Google Maps</DialogTitle>
          <DialogDescription>
            Import destination data from Google Maps URLs, search for destinations, or upload files with destination information.
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
              <span>Importing destinations...</span>
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
              Search Destinations
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="map-url">Google Maps URL or Travel Guide URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="map-url"
                    placeholder="https://maps.google.com/... or travel blog URL"
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
                  Supported: My Maps, Search Results, Travel Guides, Travel Blogs
                </p>
              </div>

              {urlDestinations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Imported from URL ({urlDestinations.length} destinations)
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {urlDestinations.map(renderDestinationCard)}
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
                    placeholder="romantic destinations, beach cities, cultural capitals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search-region">Region</Label>
                  <Input
                    id="search-region"
                    placeholder="Europe, Asia, Americas..."
                    value={searchRegion}
                    onChange={(e) => setSearchRegion(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleSearchImport}
                disabled={!searchQuery.trim() || isLoading}
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Destinations
              </Button>

              {searchDestinations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Search Results ({searchDestinations.length} destinations)
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {searchDestinations.map(renderDestinationCard)}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Destinations File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileImport}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: JSON, CSV with destination data
                </p>
              </div>

              {fileDestinations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Imported from File ({fileDestinations.length} destinations)
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {fileDestinations.map(renderDestinationCard)}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {allDestinations.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                {selectedDestinations.size} of {allDestinations.length} destinations selected
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDestinations(new Set(allDestinations.map(dest => dest.id)))}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDestinations(new Set())}
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
                disabled={selectedDestinations.size === 0}
              >
                Import {selectedDestinations.size} Destinations
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
