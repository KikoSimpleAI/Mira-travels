"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContrastIcon as Compare, Star, MapPin, Users, Wallet, Thermometer, Shield, Plane, X, Plus, TrendingUp, TrendingDown, Minus, Settings, RotateCcw, Filter } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

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
  language?: {
    english: string
  }
  visa?: string
  currency?: string
}

interface WeightingFactors {
  rating: number
  safety: number
  cost: number
  climate: number
  activities: number
  walkability: number
}

interface ScoredDestination extends Destination {
  weightedScore: number
  categoryScores: {
    rating: number
    safety: number
    cost: number
    climate: number
    activities: number
    walkability: number
  }
}

// Mock destinations data
const availableDestinations: Destination[] = [
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
    coordinates: { lat: 48.8566, lng: 2.3522 },
    bestTimeToVisit: "April-June, September-October",
    averageStay: "3-5 days",
    budget: "Mid-range",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Champs-Élysées", "Montmartre"],
    climate: { avgTemp: 15, rainfall: 50, sunshine: 6 },
    costs: { accommodation: 120, food: 45, activities: 35, transport: 15 },
    safety: { overall: 8 },
    transportation: { walkability: 9 },
    language: { english: "Widely spoken in tourist areas" },
    visa: "EU citizens: No visa required",
    currency: "Euro (€)"
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
    coordinates: { lat: 35.6762, lng: 139.6503 },
    bestTimeToVisit: "March-May, September-November",
    averageStay: "5-7 days",
    budget: "Luxury",
    highlights: ["Shibuya Crossing", "Senso-ji Temple", "Tokyo Skytree", "Tsukiji Fish Market", "Harajuku"],
    climate: { avgTemp: 18, rainfall: 60, sunshine: 5 },
    costs: { accommodation: 180, food: 60, activities: 45, transport: 25 },
    safety: { overall: 10 },
    transportation: { walkability: 8 },
    language: { english: "Limited outside tourist areas" },
    visa: "Many countries have visa-free access",
    currency: "Japanese Yen (¥)"
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
    coordinates: { lat: 40.7128, lng: -74.0060 },
    bestTimeToVisit: "April-June, September-November",
    averageStay: "4-6 days",
    budget: "Luxury",
    highlights: ["Statue of Liberty", "Central Park", "Times Square", "Brooklyn Bridge", "Empire State Building"],
    climate: { avgTemp: 16, rainfall: 45, sunshine: 7 },
    costs: { accommodation: 200, food: 70, activities: 50, transport: 30 },
    safety: { overall: 7 },
    transportation: { walkability: 9 },
    language: { english: "Primary language" },
    visa: "ESTA required for most visitors",
    currency: "US Dollar ($)"
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
    coordinates: { lat: 41.3851, lng: 2.1734 },
    bestTimeToVisit: "May-June, September-October",
    averageStay: "3-4 days",
    budget: "Mid-range",
    highlights: ["Sagrada Familia", "Park Güell", "Las Ramblas", "Gothic Quarter", "Barceloneta Beach"],
    climate: { avgTemp: 20, rainfall: 35, sunshine: 8 },
    costs: { accommodation: 90, food: 35, activities: 25, transport: 12 },
    safety: { overall: 8 },
    transportation: { walkability: 8 },
    language: { english: "Spoken in tourist areas" },
    visa: "EU citizens: No visa required",
    currency: "Euro (€)"
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
    coordinates: { lat: 41.9028, lng: 12.4964 },
    bestTimeToVisit: "April-June, September-November",
    averageStay: "3-4 days",
    budget: "Mid-range",
    highlights: ["Colosseum", "Vatican City", "Trevi Fountain", "Roman Forum", "Pantheon"],
    climate: { avgTemp: 19, rainfall: 40, sunshine: 7 },
    costs: { accommodation: 100, food: 40, activities: 30, transport: 15 },
    safety: { overall: 7 },
    transportation: { walkability: 7 },
    language: { english: "Basic English in tourist areas" },
    visa: "EU citizens: No visa required",
    currency: "Euro (€)"
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
    coordinates: { lat: 51.5074, lng: -0.1278 },
    bestTimeToVisit: "May-September",
    averageStay: "4-6 days",
    budget: "Mid-range",
    highlights: ["Big Ben", "Tower of London", "British Museum", "Buckingham Palace", "London Eye"],
    climate: { avgTemp: 12, rainfall: 55, sunshine: 4 },
    costs: { accommodation: 140, food: 50, activities: 40, transport: 20 },
    safety: { overall: 8 },
    transportation: { walkability: 8 },
    language: { english: "Primary language" },
    visa: "Check post-Brexit requirements",
    currency: "British Pound (£)"
  }
]

interface DestinationComparisonProps {
  preselectedDestinations?: string[]
}

export function DestinationComparison({ preselectedDestinations = [] }: DestinationComparisonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>(
    preselectedDestinations.map(id => availableDestinations.find(d => d.id === id)).filter(Boolean) as Destination[]
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [comparisonView, setComparisonView] = useState<'overview' | 'detailed' | 'costs' | 'practical'>('overview')
  const [showWeighting, setShowWeighting] = useState(false)
  const [weights, setWeights] = useState<WeightingFactors>({
    rating: 20,
    safety: 20,
    cost: 20,
    climate: 15,
    activities: 15,
    walkability: 10
  })
  const [advancedFilters, setAdvancedFilters] = useState({
    minRating: 0,
    minSafety: 0,
    minCostScore: 0,
    minClimate: 0,
    minActivities: 0,
    minWalkability: 0
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const filteredDestinations = availableDestinations.filter(dest => 
    !selectedDestinations.find(selected => selected.id === dest.id) &&
    (dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     dest.country.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const addDestination = (destination: Destination) => {
    if (selectedDestinations.length < 4) {
      setSelectedDestinations([...selectedDestinations, destination])
    }
  }

  const removeDestination = (destinationId: string) => {
    setSelectedDestinations(selectedDestinations.filter(dest => dest.id !== destinationId))
  }

  const normalizeScore = (value: number, min: number, max: number): number => {
    if (max === min) return 50 // Default middle score if no variation
    return ((value - min) / (max - min)) * 100
  }

  const calculateWeightedScore = (destination: Destination, allDestinations: Destination[]): ScoredDestination => {
    // Get min/max values for normalization
    const ratings = allDestinations.map(d => d.rating)
    const safetyScores = allDestinations.map(d => d.safety?.overall || 5).filter(Boolean)
    const costs = allDestinations.map(d => calculateTotalCost(d)).filter(c => c > 0)
    const climateScores = allDestinations.map(d => d.climate?.avgTemp || 15)
    const activityCounts = allDestinations.map(d => d.poiCount)
    const walkabilityScores = allDestinations.map(d => d.transportation?.walkability || 5)
  
    // Calculate normalized scores (0-100)
    const ratingScore = normalizeScore(destination.rating, Math.min(...ratings), Math.max(...ratings))
    const safetyScore = normalizeScore(destination.safety?.overall || 5, Math.min(...safetyScores), Math.max(...safetyScores))
    
    // For cost, lower is better, so invert the score
    const totalCost = calculateTotalCost(destination)
    const costScore = totalCost > 0 ? 100 - normalizeScore(totalCost, Math.min(...costs), Math.max(...costs)) : 50
    
    // Climate score based on moderate temperature preference (15-25°C ideal)
    const temp = destination.climate?.avgTemp || 15
    const climateScore = 100 - Math.abs(temp - 20) * 5 // Penalty for deviation from 20°C
    
    const activityScore = normalizeScore(destination.poiCount, Math.min(...activityCounts), Math.max(...activityCounts))
    const walkabilityScore = normalizeScore(destination.transportation?.walkability || 5, Math.min(...walkabilityScores), Math.max(...walkabilityScores))
  
    // Calculate weighted total
    const weightedScore = (
      (ratingScore * weights.rating) +
      (safetyScore * weights.safety) +
      (costScore * weights.cost) +
      (Math.max(0, Math.min(100, climateScore)) * weights.climate) +
      (activityScore * weights.activities) +
      (walkabilityScore * weights.walkability)
    ) / 100
  
    return {
      ...destination,
      weightedScore,
      categoryScores: {
        rating: ratingScore,
        safety: safetyScore,
        cost: costScore,
        climate: Math.max(0, Math.min(100, climateScore)),
        activities: activityScore,
        walkability: walkabilityScore
      }
    }
  }
  
  const resetWeights = () => {
    setWeights({
      rating: 20,
      safety: 20,
      cost: 20,
      climate: 15,
      activities: 15,
      walkability: 10
    })
  }
  
  const updateWeight = (factor: keyof WeightingFactors, value: number) => {
    setWeights(prev => ({
      ...prev,
      [factor]: value
    }))
  }

  const getBudgetColor = (budget?: string) => {
    switch (budget) {
      case "Budget": return "bg-green-100 text-green-800"
      case "Mid-range": return "bg-yellow-100 text-yellow-800"
      case "Luxury": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getComparisonIcon = (value: number, compareValue: number) => {
    if (value > compareValue) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (value < compareValue) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const calculateTotalCost = (destination: Destination) => {
    if (!destination.costs) return 0
    return destination.costs.accommodation + destination.costs.food + destination.costs.activities + destination.costs.transport
  }

const applyAdvancedFilters = (destinations: ScoredDestination[]): ScoredDestination[] => {
  return destinations.filter(destination => {
    return (
      destination.categoryScores.rating >= advancedFilters.minRating &&
      destination.categoryScores.safety >= advancedFilters.minSafety &&
      destination.categoryScores.cost >= advancedFilters.minCostScore &&
      destination.categoryScores.climate >= advancedFilters.minClimate &&
      destination.categoryScores.activities >= advancedFilters.minActivities &&
      destination.categoryScores.walkability >= advancedFilters.minWalkability
    )
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

const updateAdvancedFilter = (category: keyof typeof advancedFilters, value: number) => {
  setAdvancedFilters(prev => ({
    ...prev,
    [category]: value
  }))
}

const renderOverviewComparison = () => {
  const allScoredDestinations = selectedDestinations.map(dest => 
    calculateWeightedScore(dest, selectedDestinations)
  )
  
  const filteredScoredDestinations = applyAdvancedFilters(allScoredDestinations)
  const scoredDestinations = filteredScoredDestinations.sort((a, b) => b.weightedScore - a.weightedScore)

  return (
    <div className="space-y-6">
      {/* Weighting Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Personalized Scoring
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetWeights}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWeighting(!showWeighting)}
              >
                {showWeighting ? 'Hide' : 'Customize'} Weights
              </Button>
            </div>
          </div>
        </CardHeader>
        {showWeighting && (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Adjust the importance of each factor to get personalized destination scores based on your preferences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(weights).map(([factor, value]) => (
                <div key={factor} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="capitalize">{factor === 'activities' ? 'Places to Visit' : factor}</Label>
                    <span className="text-sm font-medium">{value}%</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => updateWeight(factor as keyof WeightingFactors, newValue[0])}
                    max={50}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Total weight: {Object.values(weights).reduce((sum, weight) => sum + weight, 0)}%
            </div>
          </CardContent>
        )}
      </Card>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filters
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetAdvancedFilters}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                {showAdvancedFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        {showAdvancedFilters && (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Set minimum score requirements for each category. Destinations not meeting these criteria will be filtered out.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      onValueChange={(newValue) => updateAdvancedFilter(filter as keyof typeof advancedFilters, newValue[0])}
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
              Active filters: {Object.values(advancedFilters).filter(v => v > 0).length} of {Object.keys(advancedFilters).length}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Personalized Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Personalized Rankings</CardTitle>
          <p className="text-sm text-muted-foreground">
            Destinations ranked based on your preferences
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scoredDestinations.map((destination, index) => (
              <div key={destination.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div className="relative w-16 h-16">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{destination.name}</h3>
                  <p className="text-sm text-muted-foreground">{destination.country}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm font-medium mr-2">
                      Score: {destination.weightedScore.toFixed(1)}/100
                    </span>
                    <Progress value={destination.weightedScore} className="flex-1 max-w-32" />
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getBudgetColor(destination.budget)}>
                    {destination.budget}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    {destination.rating} ⭐
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter Status */}
      {Object.values(advancedFilters).some(v => v > 0) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Showing {filteredScoredDestinations.length} of {selectedDestinations.length} destinations
                  {filteredScoredDestinations.length < selectedDestinations.length && 
                    ` (${selectedDestinations.length - filteredScoredDestinations.length} filtered out)`
                  }
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAdvancedFilters}
              >
                Clear All Filters
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
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
                        onClick={() => updateAdvancedFilter(filter as keyof typeof advancedFilters, 0)}
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

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">
            How each destination scores in different categories
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(weights).filter(([_, weight]) => weight > 0).map(([factor, weight]) => (
              <div key={factor}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium capitalize">
                    {factor === 'activities' ? 'Places to Visit' : factor} ({weight}% weight)
                  </h4>
                </div>
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
                  {scoredDestinations.map((destination) => (
                    <div key={destination.id} className="text-center">
                      <div className="text-sm font-medium mb-1">{destination.name}</div>
                      <div className="text-lg font-bold mb-2">
                        {destination.categoryScores[factor as keyof typeof destination.categoryScores].toFixed(1)}
                      </div>
                      <Progress 
                        value={destination.categoryScores[factor as keyof typeof destination.categoryScores]} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Original comparison sections with updated data */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
        {scoredDestinations.map((destination) => (
          <Card key={destination.id} className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => removeDestination(destination.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="relative h-32">
              <Image
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-1">{destination.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{destination.country}</p>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                  <span className="text-sm font-semibold">{destination.rating}</span>
                </div>
                <Badge className={getBudgetColor(destination.budget)}>
                  {destination.budget}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Your Score</div>
                <div className="text-xl font-bold text-primary">
                  {destination.weightedScore.toFixed(1)}
                </div>
                <Progress value={destination.weightedScore} className="mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rest of the original comparison metrics... */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Overall Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id} className="text-center">
                <div className="text-2xl font-bold mb-2">{destination.rating}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(destination.rating)
                          ? 'fill-current text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {destination.reviewCount.toLocaleString()} reviews
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Places to Visit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id} className="text-center">
                <div className="text-2xl font-bold mb-2">{destination.poiCount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Points of Interest</div>
                <Progress 
                  value={(destination.poiCount / Math.max(...selectedDestinations.map(d => d.poiCount))) * 100} 
                  className="mt-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Safety Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id} className="text-center">
                <div className="text-2xl font-bold mb-2">{destination.safety?.overall || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">out of 10</div>
                {destination.safety?.overall && (
                  <Progress 
                    value={destination.safety.overall * 10} 
                    className="mt-2" 
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Best Time to Visit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id} className="text-center">
                <div className="font-medium mb-2">{destination.bestTimeToVisit || 'Year-round'}</div>
                <div className="text-sm text-muted-foreground">
                  Average stay: {destination.averageStay || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

  const renderDetailedComparison = () => (
    <div className="space-y-6">
      {/* Climate Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Thermometer className="h-5 w-5 mr-2" />
            Climate & Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id} className="space-y-4">
                <h4 className="font-medium text-center">{destination.name}</h4>
                {destination.climate && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Temperature</span>
                      <span className="font-medium">{destination.climate.avgTemp}°C</span>
                    </div>
                    <Progress value={(destination.climate.avgTemp / 30) * 100} />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rainfall</span>
                      <span className="font-medium">{destination.climate.rainfall}mm</span>
                    </div>
                    <Progress value={(destination.climate.rainfall / 100) * 100} />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sunshine Hours</span>
                      <span className="font-medium">{destination.climate.sunshine}h/day</span>
                    </div>
                    <Progress value={(destination.climate.sunshine / 12) * 100} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transportation */}
      <Card>
        <CardHeader>
          <CardTitle>Transportation & Walkability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id} className="text-center">
                <h4 className="font-medium mb-3">{destination.name}</h4>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Walkability</div>
                  <div className="text-xl font-bold">{destination.transportation?.walkability || 'N/A'}/10</div>
                  {destination.transportation?.walkability && (
                    <Progress value={destination.transportation.walkability * 10} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories & Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id}>
                <h4 className="font-medium mb-3 text-center">{destination.name}</h4>
                <div className="flex flex-wrap gap-1 justify-center">
                  {destination.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Top Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id}>
                <h4 className="font-medium mb-3 text-center">{destination.name}</h4>
                <ul className="space-y-1">
                  {destination.highlights.slice(0, 5).map((highlight, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCostComparison = () => {
    const avgCosts = selectedDestinations.reduce((acc, dest) => {
      if (dest.costs) {
        acc.accommodation += dest.costs.accommodation
        acc.food += dest.costs.food
        acc.activities += dest.costs.activities
        acc.transport += dest.costs.transport
      }
      return acc
    }, { accommodation: 0, food: 0, activities: 0, transport: 0 })

    Object.keys(avgCosts).forEach(key => {
      avgCosts[key as keyof typeof avgCosts] /= selectedDestinations.length
    })

    return (
      <div className="space-y-6">
        {/* Total Daily Cost */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Total Daily Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
              {selectedDestinations.map((destination) => {
                const totalCost = calculateTotalCost(destination)
                const avgTotal = calculateTotalCost({ costs: avgCosts } as Destination)
                return (
                  <div key={destination.id} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold mr-2">
                        {destination.currency?.includes('€') ? '€' : 
                         destination.currency?.includes('¥') ? '¥' : 
                         destination.currency?.includes('$') ? '$' : 
                         destination.currency?.includes('£') ? '£' : ''}
                        {totalCost}
                      </span>
                      {getComparisonIcon(totalCost, avgTotal)}
                    </div>
                    <div className="text-sm text-muted-foreground">per day</div>
                    <Progress 
                      value={(totalCost / Math.max(...selectedDestinations.map(calculateTotalCost))) * 100} 
                      className="mt-2" 
                    />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        {['accommodation', 'food', 'activities', 'transport'].map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category} Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
                {selectedDestinations.map((destination) => {
                  const cost = destination.costs?.[category as keyof typeof destination.costs] || 0
                  const avgCost = avgCosts[category as keyof typeof avgCosts]
                  return (
                    <div key={destination.id} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-xl font-bold mr-2">
                          {destination.currency?.includes('€') ? '€' : 
                           destination.currency?.includes('¥') ? '¥' : 
                           destination.currency?.includes('$') ? '$' : 
                           destination.currency?.includes('£') ? '£' : ''}
                          {cost}
                        </span>
                        {getComparisonIcon(cost, avgCost)}
                      </div>
                      <Progress 
                        value={(cost / Math.max(...selectedDestinations.map(d => d.costs?.[category as keyof typeof d.costs] || 0))) * 100} 
                        className="mt-2" 
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Budget Level */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
              {selectedDestinations.map((destination) => (
                <div key={destination.id} className="text-center">
                  <Badge className={getBudgetColor(destination.budget)} size="lg">
                    {destination.budget}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderPracticalComparison = () => (
    <div className="space-y-6">
      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle>Language & Communication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id} className="text-center">
                <h4 className="font-medium mb-2">{destination.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {destination.language?.english || 'English information not available'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visa Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Visa Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id} className="text-center">
                <h4 className="font-medium mb-2">{destination.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {destination.visa || 'Check visa requirements'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currency */}
      <Card>
        <CardHeader>
          <CardTitle>Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id} className="text-center">
                <h4 className="font-medium mb-2">{destination.name}</h4>
                <p className="text-lg font-semibold">
                  {destination.currency || 'Currency not specified'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Comparison Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedDestinations.length}, 1fr)` }}>
            {selectedDestinations.map((destination) => (
              <div key={destination.id} className="space-y-3">
                <h4 className="font-medium text-center">{destination.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span className="font-medium">{destination.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Safety:</span>
                    <span className="font-medium">{destination.safety?.overall || 'N/A'}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Cost:</span>
                    <span className="font-medium">
                      {destination.currency?.includes('€') ? '€' : 
                       destination.currency?.includes('¥') ? '¥' : 
                       destination.currency?.includes('$') ? '$' : 
                       destination.currency?.includes('£') ? '£' : ''}
                      {calculateTotalCost(destination)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Places:</span>
                    <span className="font-medium">{destination.poiCount.toLocaleString()}</span>
                  </div>
                </div>
                <Button className="w-full" size="sm" asChild>
                  <Link href={`/destinations/${destination.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Compare className="h-4 w-4 mr-2" />
          Compare Destinations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Destinations</DialogTitle>
          <DialogDescription>
            Compare up to 4 destinations side by side to help plan your perfect trip.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Destination Selection */}
          {selectedDestinations.length < 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Add Destinations to Compare</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-48 overflow-y-auto">
                  {filteredDestinations.slice(0, 6).map((destination) => (
                    <Card 
                      key={destination.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addDestination(destination)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12">
                            <Image
                              src={destination.image || "/placeholder.svg"}
                              alt={destination.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{destination.name}</h4>
                            <p className="text-xs text-muted-foreground">{destination.country}</p>
                            <div className="flex items-center mt-1">
                              <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                              <span className="text-xs">{destination.rating}</span>
                            </div>
                          </div>
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Content */}
          {selectedDestinations.length >= 2 && (
            <div className="space-y-6">
              <Tabs value={comparisonView} onValueChange={(value) => setComparisonView(value as any)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed</TabsTrigger>
                  <TabsTrigger value="costs">Costs</TabsTrigger>
                  <TabsTrigger value="practical">Practical</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  {renderOverviewComparison()}
                </TabsContent>

                <TabsContent value="detailed">
                  {renderDetailedComparison()}
                </TabsContent>

                <TabsContent value="costs">
                  {renderCostComparison()}
                </TabsContent>

                <TabsContent value="practical">
                  {renderPracticalComparison()}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {selectedDestinations.length < 2 && (
            <Card className="text-center py-12">
              <CardContent>
                <Compare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select destinations to compare</h3>
                <p className="text-muted-foreground">
                  Choose at least 2 destinations to start comparing their features, costs, and amenities.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
