"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { DestinationComparison } from "@/components/destination-comparison"
import { Search, MapPin, Star, Filter, ContrastIcon as Compare, X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

interface Destination {
  id: string
  name: string
  country: string
  region: string
  description: string
  image: string
  rating: number
  reviewCount: number
  poiCount: number
  categories: string[]
  budget: 'Budget' | 'Mid-range' | 'Luxury'
  bestTimeToVisit: string
  climate?: {
    avgTemp: number
    rainfall: number
    sunshine: number
  }
  costs?: {
    accommodation: number
    food: number
    activities: number
    transport: number
  }
  safety?: {
    overall: number
  }
  transportation?: {
    walkability?: number
  }
}

interface AdvancedFilters {
  minRating: number
  minSafety: number
  minCostScore: number
  minClimate: number
  minActivities: number
  minWalkability: number
}

// Existing destinations (unchanged except for keeping structure). New destinations appended at the end.
const destinations: Destination[] = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    region: "Île-de-France",
    description: "The City of Light with world-class dining, museums, and romance",
    image: "/placeholder.svg?height=200&width=300&text=Paris",
    rating: 4.8,
    reviewCount: 125847,
    poiCount: 2847,
    categories: ["Culture", "Art", "Food", "Romance", "History"],
    budget: "Mid-range",
    bestTimeToVisit: "April-June, September-October",
    climate: { avgTemp: 15, rainfall: 50, sunshine: 6 },
    costs: { accommodation: 120, food: 45, activities: 35, transport: 15 },
    safety: { overall: 8 },
    transportation: { walkability: 9 }
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Kanto",
    description: "Modern metropolis blending tradition with cutting-edge culture",
    image: "/placeholder.svg?height=200&width=300&text=Tokyo",
    rating: 4.9,
    reviewCount: 156789,
    poiCount: 3421,
    categories: ["Technology", "Culture", "Food", "Shopping", "Temples"],
    budget: "Luxury",
    bestTimeToVisit: "March-May, September-November",
    climate: { avgTemp: 18, rainfall: 60, sunshine: 5 },
    costs: { accommodation: 180, food: 60, activities: 45, transport: 25 },
    safety: { overall: 10 },
    transportation: { walkability: 8 }
  },
  {
    id: "new-york",
    name: "New York City",
    country: "United States",
    region: "New York",
    description: "The city that never sleeps with endless entertainment options",
    image: "/placeholder.svg?height=200&width=300&text=New+York",
    rating: 4.7,
    reviewCount: 234567,
    poiCount: 4123,
    categories: ["Culture", "Entertainment", "Food", "Shopping", "Architecture"],
    budget: "Luxury",
    bestTimeToVisit: "April-June, September-November",
    climate: { avgTemp: 16, rainfall: 45, sunshine: 7 },
    costs: { accommodation: 200, food: 70, activities: 50, transport: 30 },
    safety: { overall: 7 },
    transportation: { walkability: 9 }
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Catalonia",
    description: "Mediterranean charm with stunning architecture and vibrant culture",
    image: "/placeholder.svg?height=200&width=300&text=Barcelona",
    rating: 4.6,
    reviewCount: 87456,
    poiCount: 1654,
    categories: ["Architecture", "Beach", "Nightlife", "Food", "Art"],
    budget: "Mid-range",
    bestTimeToVisit: "May-June, September-October",
    climate: { avgTemp: 20, rainfall: 35, sunshine: 8 },
    costs: { accommodation: 90, food: 35, activities: 25, transport: 12 },
    safety: { overall: 8 },
    transportation: { walkability: 8 }
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    region: "Lazio",
    description: "The Eternal City where ancient history meets modern life",
    image: "/placeholder.svg?height=200&width=300&text=Rome",
    rating: 4.7,
    reviewCount: 98234,
    poiCount: 1923,
    categories: ["History", "Culture", "Food", "Architecture", "Religion"],
    budget: "Mid-range",
    bestTimeToVisit: "April-June, September-November",
    climate: { avgTemp: 19, rainfall: 40, sunshine: 7 },
    costs: { accommodation: 100, food: 40, activities: 30, transport: 15 },
    safety: { overall: 7 },
    transportation: { walkability: 7 }
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    region: "England",
    description: "Historic capital with royal palaces, world-class museums, and diverse culture",
    image: "/placeholder.svg?height=200&width=300&text=London",
    rating: 4.5,
    reviewCount: 189456,
    poiCount: 2756,
    categories: ["History", "Culture", "Museums", "Royal", "Theater"],
    budget: "Mid-range",
    bestTimeToVisit: "May-September",
    climate: { avgTemp: 12, rainfall: 55, sunshine: 4 },
    costs: { accommodation: 140, food: 50, activities: 40, transport: 20 },
    safety: { overall: 8 },
    transportation: { walkability: 8 }
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Bali",
    description: "Tropical paradise with stunning beaches, temples, and rich culture",
    image: "/placeholder.svg?height=200&width=300&text=Bali",
    rating: 4.4,
    reviewCount: 67890,
    poiCount: 1234,
    categories: ["Beach", "Culture", "Nature", "Temples", "Wellness"],
    budget: "Budget",
    bestTimeToVisit: "April-October",
    climate: { avgTemp: 27, rainfall: 80, sunshine: 8 },
    costs: { accommodation: 40, food: 15, activities: 20, transport: 8 },
    safety: { overall: 6 },
    transportation: { walkability: 5 }
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    region: "Dubai",
    description: "Futuristic city with luxury shopping, modern architecture, and desert adventures",
    image: "/placeholder.svg?height=200&width=300&text=Dubai",
    rating: 4.3,
    reviewCount: 89123,
    poiCount: 987,
    categories: ["Luxury", "Shopping", "Architecture", "Desert", "Modern"],
    budget: "Luxury",
    bestTimeToVisit: "November-March",
    climate: { avgTemp: 28, rainfall: 10, sunshine: 10 },
    costs: { accommodation: 250, food: 80, activities: 60, transport: 25 },
    safety: { overall: 9 },
    transportation: { walkability: 6 }
  },

  // NEW: Added destinations with real images.
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    region: "Marrakesh-Safi",
    description: "Vibrant souks, historic medina, and the Koutoubia Mosque at the foot of the Atlas Mountains.",
    image: "/images/destinations/marrakech.png",
    rating: 4.6,
    reviewCount: 56321,
    poiCount: 980,
    categories: ["Markets", "Culture", "History", "Food", "Desert"],
    budget: "Mid-range",
    bestTimeToVisit: "March-May, September-November",
    climate: { avgTemp: 22, rainfall: 20, sunshine: 9 },
    costs: { accommodation: 60, food: 20, activities: 20, transport: 8 },
    safety: { overall: 7 },
    transportation: { walkability: 7 }
  },
  {
    id: "positano",
    name: "Positano",
    country: "Italy",
    region: "Campania",
    description: "Clifftop pastel houses overlooking the Amalfi Coast with chic beaches and coastal paths.",
    image: "/images/destinations/positano.png",
    rating: 4.7,
    reviewCount: 22345,
    poiCount: 350,
    categories: ["Beach", "Scenic", "Food", "Romance", "Hiking"],
    budget: "Luxury",
    bestTimeToVisit: "May-September",
    climate: { avgTemp: 23, rainfall: 25, sunshine: 9 },
    costs: { accommodation: 220, food: 70, activities: 60, transport: 20 },
    safety: { overall: 8 },
    transportation: { walkability: 6 }
  },
  {
    id: "portofino",
    name: "Portofino",
    country: "Italy",
    region: "Liguria",
    description: "Glamorous harbor village with colorful houses, yachts, and lush coastal hills.",
    image: "/images/destinations/portofino.png",
    rating: 4.6,
    reviewCount: 11234,
    poiCount: 180,
    categories: ["Harbor", "Scenic", "Food", "Boating", "Romance"],
    budget: "Luxury",
    bestTimeToVisit: "May-September",
    climate: { avgTemp: 22, rainfall: 40, sunshine: 8 },
    costs: { accommodation: 240, food: 80, activities: 65, transport: 25 },
    safety: { overall: 9 },
    transportation: { walkability: 6 }
  },
  {
    id: "marseille",
    name: "Marseille",
    country: "France",
    region: "Provence-Alpes-Côte d'Azur",
    description: "Historic port city with calanques, fresh seafood, and a vibrant multicultural scene.",
    image: "/images/destinations/marseille.png",
    rating: 4.4,
    reviewCount: 34567,
    poiCount: 1200,
    categories: ["Harbor", "Culture", "Food", "Beaches", "History"],
    budget: "Mid-range",
    bestTimeToVisit: "April-June, September-October",
    climate: { avgTemp: 18, rainfall: 45, sunshine: 7 },
    costs: { accommodation: 95, food: 40, activities: 30, transport: 15 },
    safety: { overall: 7 },
    transportation: { walkability: 7 }
  },
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Türkiye",
    region: "Marmara",
    description: "Where East meets West: grand mosques, bustling bazaars, and sweeping Bosphorus views.",
    image: "/images/destinations/istanbul.png",
    rating: 4.8,
    reviewCount: 178456,
    poiCount: 3100,
    categories: ["History", "Mosques", "Bazaars", "Food", "Bosphorus"],
    budget: "Mid-range",
    bestTimeToVisit: "April-June, September-October",
    climate: { avgTemp: 17, rainfall: 60, sunshine: 6 },
    costs: { accommodation: 85, food: 30, activities: 25, transport: 12 },
    safety: { overall: 8 },
    transportation: { walkability: 7 }
  }
]

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBudget, setSelectedBudget] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("rating")
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    minRating: 0,
    minSafety: 0,
    minCostScore: 0,
    minClimate: 0,
    minActivities: 0,
    minWalkability: 0
  })

  // Get all unique categories
  const allCategories = Array.from(new Set(destinations.flatMap(dest => dest.categories)))

  // Helper functions for scoring
  const normalizeScore = (value: number, min: number, max: number): number => {
    if (max === min) return 50
    return ((value - min) / (max - min)) * 100
  }

  const calculateTotalCost = (destination: Destination) => {
    if (!destination.costs) return 0
    return destination.costs.accommodation + destination.costs.food + destination.costs.activities + destination.costs.transport
  }

  const calculateCategoryScores = (destination: Destination, allDestinations: Destination[]) => {
    const ratings = allDestinations.map(d => d.rating)
    const safetyScores = allDestinations.map(d => d.safety?.overall || 5).filter(Boolean)
    const costs = allDestinations.map(d => calculateTotalCost(d)).filter(c => c > 0)
    const climateScores = allDestinations.map(d => d.climate?.avgTemp || 15)
    const activityCounts = allDestinations.map(d => d.poiCount)
    const walkabilityScores = allDestinations.map(d => d.transportation?.walkability || 5)

    const ratingScore = normalizeScore(destination.rating, Math.min(...ratings), Math.max(...ratings))
    const safetyScore = normalizeScore(destination.safety?.overall || 5, Math.min(...safetyScores), Math.max(...safetyScores))
    
    const totalCost = calculateTotalCost(destination)
    const costScore = totalCost > 0 ? 100 - normalizeScore(totalCost, Math.min(...costs), Math.max(...costs)) : 50
    
    const temp = destination.climate?.avgTemp || 15
    const climateScore = Math.max(0, Math.min(100, 100 - Math.abs(temp - 20) * 5))
    
    const activityScore = normalizeScore(destination.poiCount, Math.min(...activityCounts), Math.max(...activityCounts))
    const walkabilityScore = normalizeScore(destination.transportation?.walkability || 5, Math.min(...walkabilityScores), Math.max(...walkabilityScores))

    return {
      rating: ratingScore,
      safety: safetyScore,
      cost: costScore,
      climate: climateScore,
      activities: activityScore,
      walkability: walkabilityScore
    }
  }

  // Apply advanced filters
  const applyAdvancedFilters = (destinationsList: Destination[]): Destination[] => {
    if (Object.values(advancedFilters).every(v => v === 0)) {
      return destinationsList
    }

    return destinationsList.filter(destination => {
      const scores = calculateCategoryScores(destination, destinationsList)
      return (
        scores.rating >= advancedFilters.minRating &&
        scores.safety >= advancedFilters.minSafety &&
        scores.cost >= advancedFilters.minCostScore &&
        scores.climate >= advancedFilters.minClimate &&
        scores.activities >= advancedFilters.minActivities &&
        scores.walkability >= advancedFilters.minWalkability
      )
    })
  }

  // Filter destinations
  const basicFilteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || dest.categories.includes(selectedCategory)
    const matchesBudget = selectedBudget === "all" || dest.budget === selectedBudget

    return matchesSearch && matchesCategory && matchesBudget
  })

  const filteredDestinations = applyAdvancedFilters(basicFilteredDestinations)

  // Sort destinations
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      case "country":
        return a.country.localeCompare(b.country)
      case "places":
        return b.poiCount - a.poiCount
      case "safety":
        return (b.safety?.overall || 0) - (a.safety?.overall || 0)
      case "cost":
        return calculateTotalCost(a) - calculateTotalCost(b)
      default:
        return 0
    }
  })

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case "Budget": return "bg-green-100 text-green-800"
      case "Mid-range": return "bg-yellow-100 text-yellow-800"
      case "Luxury": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const toggleComparisonSelection = (destinationId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(destinationId)) {
        return prev.filter(id => id !== destinationId)
      } else if (prev.length < 4) {
        return [...prev, destinationId]
      }
      return prev
    })
  }

  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      minRating: 0,
      minSafety: 0,
      minCostScore: 0,
      minClimate: 0,
      minActivities: 0,
      minWalkability: 0
    })
  }

  const updateAdvancedFilter = (category: keyof AdvancedFilters, value: number) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const activeFiltersCount = Object.values(advancedFilters).filter(v => v > 0).length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Explore Destinations</h1>
          <p className="text-muted-foreground">
            Discover amazing places around the world and plan your next adventure
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {selectedForComparison.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedForComparison.length} selected
              </span>
              <DestinationComparison preselectedDestinations={selectedForComparison} />
            </div>
          )}
          <Button asChild>
            <Link href="/destinations/compare">
              <Compare className="h-4 w-4 mr-2" />
              Compare Tool
            </Link>
          </Button>
        </div>
      </div>

      {/* Basic Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBudget} onValueChange={setSelectedBudget}>
              <SelectTrigger>
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="Budget">Budget</SelectItem>
                <SelectItem value="Mid-range">Mid-range</SelectItem>
                <SelectItem value="Luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="places">Places to Visit</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="cost">Cost (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Advanced Score Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount} active
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAdvancedFilters}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                {showAdvancedFilters ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showAdvancedFilters && (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Set minimum score requirements for each category. Only destinations meeting all criteria will be shown.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(advancedFilters).map(([filter, value]) => {
                const displayName = filter.replace('min', '').replace('CostScore', 'Cost')
                const categoryName = displayName === 'Activities' ? 'Places to Visit' : displayName
                return (
                  <div key={filter} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize">Min {categoryName}</Label>
                      <span className="text-sm font-medium">{value}/100</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(newValue) => updateAdvancedFilter(filter as keyof AdvancedFilters, newValue[0])}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              Scores are calculated based on relative performance compared to all destinations.
            </div>
          </CardContent>
        )}
      </Card>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Active Score Filters:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAdvancedFilters}
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(advancedFilters)
                .filter(([_, value]) => value > 0)
                .map(([filter, value]) => {
                  const displayName = filter.replace('min', '').replace('CostScore', 'Cost')
                  const categoryName = displayName === 'Activities' ? 'Places to Visit' : displayName
                  return (
                    <Badge key={filter} variant="secondary" className="text-xs">
                      {categoryName} ≥ {value}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => updateAdvancedFilter(filter as keyof AdvancedFilters, 0)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )
                })
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground">
            Showing {sortedDestinations.length} of {destinations.length} destinations
            {filteredDestinations.length < basicFilteredDestinations.length && (
              <span className="text-orange-600 ml-1">
                ({basicFilteredDestinations.length - filteredDestinations.length} filtered by score requirements)
              </span>
            )}
          </p>
        </div>
        {selectedForComparison.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedForComparison([])}
          >
            Clear Selection ({selectedForComparison.length})
          </Button>
        )}
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDestinations.map((destination) => {
          const scores = calculateCategoryScores(destination, destinations)
          return (
            <Card key={destination.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="relative h-48">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button
                    variant={selectedForComparison.includes(destination.id) ? "default" : "secondary"}
                    size="sm"
                    onClick={() => toggleComparisonSelection(destination.id)}
                    disabled={!selectedForComparison.includes(destination.id) && selectedForComparison.length >= 4}
                  >
                    <Compare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                    <p className="text-muted-foreground text-sm">{destination.country}</p>
                  </div>
                  <Badge className={getBudgetColor(destination.budget)}>
                    {destination.budget}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {destination.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="font-medium">{scores.rating.toFixed(0)}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Safety:</span>
                    <span className="font-medium">{scores.safety.toFixed(0)}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-medium">{scores.cost.toFixed(0)}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Climate:</span>
                    <span className="font-medium">{scores.climate.toFixed(0)}/100</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                    <span className="font-semibold">{destination.rating}</span>
                    <span className="text-muted-foreground text-sm ml-1">
                      ({destination.reviewCount.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{destination.poiCount.toLocaleString()} places</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {destination.categories.slice(0, 3).map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {destination.categories.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{destination.categories.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground mb-4">
                  <strong>Best time:</strong> {destination.bestTimeToVisit}
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/destinations/${destination.id}`}>
                    Explore Destination
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {sortedDestinations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No destinations match your criteria</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or lowering the score requirements in advanced filters.
            </p>
            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={resetAdvancedFilters}>
                Clear Score Filters
              </Button>
              <Button variant="outline" onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedBudget("all")
                resetAdvancedFilters()
              }}>
                Reset All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
