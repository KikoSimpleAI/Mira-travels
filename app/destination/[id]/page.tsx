"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Star, Clock, Phone, Globe, Download, Filter, Heart, Share2 } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GoogleMaps } from "@/components/google-maps"
import { GoogleMapsImport } from "@/components/google-maps-import"

const destinationData = {
  id: "paris",
  name: "Paris, France",
  description: "The City of Light, known for its art, fashion, gastronomy, and culture",
  image: "/placeholder.svg?height=400&width=800&text=Paris+Panorama",
  rating: 4.8,
  reviewCount: 12847,
  categories: ["Restaurants", "Museums", "Hotels", "Nightlife", "Shopping", "Sightseeing"]
}

const travelTips = [
  {
    title: "Airport to City Center",
    content: "Take RER B train (35 min, €10) or taxi (45-60 min, €50-70). Avoid rush hours 7-9 AM and 5-7 PM."
  },
  {
    title: "Public Transport",
    content: "Metro day pass costs €7.50. Buy a Navigo weekly pass for €22.80 if staying longer than 3 days."
  },
  {
    title: "Uber Availability",
    content: "Uber is widely available. Expect 3-5 min wait times in central areas. UberX costs similar to taxis."
  },
  {
    title: "Best Time to Visit",
    content: "April-June and September-October offer pleasant weather and fewer crowds."
  }
]

const pois = [
  {
    id: 1,
    name: "Le Comptoir du Relais",
    category: "Restaurant",
    rating: 4.6,
    reviewCount: 1247,
    price: "€€€",
    image: "/placeholder.svg?height=200&width=300&text=French+Restaurant",
    description: "Authentic French bistro in Saint-Germain",
    address: "9 Carrefour de l'Odéon, 75006 Paris",
    phone: "+33 1 44 27 07 97",
    website: "www.hotel-paris-relais-saint-germain.com",
    lat: 48.8529,
    lng: 2.3387
  },
  {
    id: 2,
    name: "Louvre Museum",
    category: "Museum",
    rating: 4.9,
    reviewCount: 45621,
    price: "€€",
    image: "/placeholder.svg?height=200&width=300&text=Louvre+Museum",
    description: "World's largest art museum and historic monument",
    address: "Rue de Rivoli, 75001 Paris",
    phone: "+33 1 40 20 50 50",
    website: "www.louvre.fr",
    lat: 48.8606,
    lng: 2.3376
  },
  {
    id: 3,
    name: "Hotel des Grands Boulevards",
    category: "Hotel",
    rating: 4.7,
    reviewCount: 892,
    price: "€€€€",
    image: "/placeholder.svg?height=200&width=300&text=Boutique+Hotel",
    description: "Stylish boutique hotel in the 2nd arrondissement",
    address: "17 Boulevard Poissonnière, 75002 Paris",
    phone: "+33 1 85 73 33 33",
    website: "www.hoteldesgrandsboulevards.com",
    lat: 48.8719,
    lng: 2.3438
  }
]

const reviews = [
  {
    id: 1,
    user: "Sarah M.",
    avatar: "/placeholder.svg?height=40&width=40&text=SM",
    rating: 5,
    date: "2 days ago",
    comment: "Amazing experience! The food scene in Paris is incredible. Highly recommend Le Comptoir du Relais for authentic French cuisine.",
    helpful: 12
  },
  {
    id: 2,
    user: "John D.",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
    rating: 4,
    date: "1 week ago",
    comment: "Great city for walking and exploring. The metro system is efficient but can be crowded during rush hours.",
    helpful: 8
  }
]

export default function DestinationPage({ params }: { params: { id: string } }) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("rating")
  const [importedPOIs, setImportedPOIs] = useState<any[]>([])
  const [allPOIs, setAllPOIs] = useState(pois)

  const handleImportPOIs = (newPOIs: any[]) => {
    console.log('Importing POIs:', newPOIs)
    setImportedPOIs(newPOIs)
    
    // Convert imported POIs to match the existing format
    const convertedPOIs = newPOIs.map(poi => ({
      ...poi,
      image: `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(poi.category)}`,
      description: poi.description || `${poi.category} in ${destinationData.name}`
    }))
    
    setAllPOIs([...pois, ...convertedPOIs])
  }

  const filteredPois = selectedCategory === "All" 
    ? allPOIs 
    : allPOIs.filter(poi => poi.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Itinerary
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96">
        <Image
          src={destinationData.image || "/placeholder.svg"}
          alt={destinationData.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{destinationData.name}</h1>
          <p className="text-lg mb-4">{destinationData.description}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-current text-yellow-400 mr-1" />
              <span className="font-semibold">{destinationData.rating}</span>
              <span className="text-white/80 ml-1">({destinationData.reviewCount.toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="travel-tips">Travel Tips</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            {/* Import Status */}
            {importedPOIs.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {importedPOIs.length} places imported
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        from Google Maps
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImportedPOIs([])
                        setAllPOIs(pois)
                      }}
                    >
                      Clear Imports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Restaurant">Restaurants</SelectItem>
                  <SelectItem value="Hotel">Hotels</SelectItem>
                  <SelectItem value="Museum">Museums</SelectItem>
                  <SelectItem value="Nightlife">Nightlife</SelectItem>
                  <SelectItem value="Attraction">Attractions</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Search places..." className="max-w-xs" />
            </div>

            {/* POI Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPois.map((poi) => (
                <Card key={poi.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={poi.image || "/placeholder.svg"}
                      alt={poi.name}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-background/90 text-foreground">
                      {poi.category}
                    </Badge>
                    {poi.price && (
                      <Badge className="absolute top-4 right-4 bg-background/90 text-foreground">
                        {poi.price}
                      </Badge>
                    )}
                    {poi.source && (
                      <Badge className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground text-xs">
                        {poi.source}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{poi.name}</h3>
                      {poi.rating > 0 && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                          <span className="text-sm font-semibold">{poi.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4">{poi.description}</p>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {poi.address}
                      </div>
                      {poi.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {poi.phone}
                        </div>
                      )}
                      {poi.website && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          <a href={`https://${poi.website}`} className="hover:underline">
                            {poi.website}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {poi.reviewCount > 0 ? `${poi.reviewCount} reviews` : 'No reviews'}
                      </span>
                      <Button size="sm" asChild>
                        <Link href={`/poi/${poi.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Interactive Map</CardTitle>
                    <CardDescription>
                      Explore all points of interest on the map. Import more places from Google Maps.
                    </CardDescription>
                  </div>
                  <GoogleMapsImport onImport={handleImportPOIs} />
                </div>
              </CardHeader>
              <CardContent>
                <GoogleMaps
                  center={{ lat: 48.8566, lng: 2.3522 }}
                  zoom={13}
                  pois={allPOIs.map(poi => ({
                    id: poi.id.toString(),
                    name: poi.name,
                    category: poi.category,
                    rating: poi.rating || 0,
                    reviewCount: poi.reviewCount || 0,
                    price: poi.price,
                    lat: poi.lat || 48.8566 + (Math.random() - 0.5) * 0.02,
                    lng: poi.lng || 2.3522 + (Math.random() - 0.5) * 0.02,
                    address: poi.address,
                    phone: poi.phone,
                    website: poi.website
                  }))}
                  onPOIClick={(poi) => {
                    console.log('POI clicked:', poi)
                  }}
                  showImportButton={true}
                  onImportPOIs={handleImportPOIs}
                  height="500px"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="travel-tips" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {travelTips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tip.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {/* Add Review Form */}
            <Card>
              <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
                <CardDescription>
                  Help other travelers by sharing your thoughts about {destinationData.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-muted-foreground hover:text-yellow-400 cursor-pointer" />
                    ))}
                  </div>
                </div>
                <Textarea placeholder="Write your review..." />
                <Button>Submit Review</Button>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={review.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{review.user.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{review.user}</span>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground mb-2">{review.comment}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <button className="hover:text-foreground">
                            👍 Helpful ({review.helpful})
                          </button>
                          <button className="hover:text-foreground">Reply</button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
