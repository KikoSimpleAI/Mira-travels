"use client"

import { Search, MapPin, Star, Users, Download, Plane } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/components/auth/auth-provider"
import { JoinCommunityDialog } from "@/components/community/join-community-dialog"

const featuredDestinations = [
  {
    id: "paris",
    name: "Paris, France",
    image: "/placeholder.svg?height=300&width=400&text=Paris+Eiffel+Tower",
    description: "The City of Light with world-class dining, museums, and romance",
    poiCount: 1247,
    rating: 4.8,
    categories: ["Restaurants", "Museums", "Nightlife", "Hotels"]
  },
  {
    id: "tokyo",
    name: "Tokyo, Japan",
    image: "/placeholder.svg?height=300&width=400&text=Tokyo+Skyline",
    description: "Modern metropolis blending tradition with cutting-edge culture",
    poiCount: 2156,
    rating: 4.9,
    categories: ["Restaurants", "Sightseeing", "Shopping", "Hotels"]
  },
  {
    id: "new-york",
    name: "New York, USA",
    image: "/placeholder.svg?height=300&width=400&text=New+York+Manhattan",
    description: "The city that never sleeps with endless entertainment options",
    poiCount: 3421,
    rating: 4.7,
    categories: ["Restaurants", "Museums", "Nightlife", "Broadway"]
  },
  {
    id: "barcelona",
    name: "Barcelona, Spain",
    image: "/placeholder.svg?height=300&width=400&text=Barcelona+Sagrada+Familia",
    description: "Mediterranean charm with stunning architecture and vibrant culture",
    poiCount: 892,
    rating: 4.6,
    categories: ["Restaurants", "Architecture", "Beaches", "Nightlife"]
  }
]

const categories = [
  { name: "Restaurants", icon: "🍽️", count: "12.5K+" },
  { name: "Hotels", icon: "🏨", count: "3.2K+" },
  { name: "Museums", icon: "🏛️", count: "1.8K+" },
  { name: "Nightlife", icon: "🌃", count: "2.1K+" },
  { name: "Sightseeing", icon: "📸", count: "4.7K+" },
  { name: "Transport", icon: "🚇", count: "890+" }
]

export default function HomePage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Mira Travels</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/destinations" className="text-muted-foreground hover:text-foreground">
                Destinations
              </Link>
              <Link href="/itineraries" className="text-muted-foreground hover:text-foreground">
                Itineraries
              </Link>
              <Link href="/travel-tips" className="text-muted-foreground hover:text-foreground">
                Travel Tips
              </Link>
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <AuthDialog variant="outline" />
                  <JoinCommunityDialog />
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Places
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your comprehensive travel guide with local insights, ratings, and personalized itineraries for unforgettable journeys
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                placeholder="Search destinations, restaurants, hotels..." 
                className="pl-12 py-6 text-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-muted-foreground">Places</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">200+</div>
              <div className="text-muted-foreground">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1M+</div>
              <div className="text-muted-foreground">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100K+</div>
              <div className="text-muted-foreground">Travelers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Explore by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h4 className="font-semibold mb-2">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold">Featured Destinations</h3>
            <Button variant="outline" asChild>
              <Link href="/destinations">View All Destinations</Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-background/90 text-foreground">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {destination.rating}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg mb-2">{destination.name}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{destination.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {destination.poiCount} places
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      Popular
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {destination.categories.slice(0, 3).map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link href={`/destination/${destination.id}`}>
                      Explore {destination.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Mira Travels?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Interactive Maps</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Explore destinations with detailed Google Maps integration, showing all points of interest with ratings and reviews.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>PDF Itineraries</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create and download personalized travel itineraries in PDF format, perfect for offline access during your trips.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Community Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Read authentic reviews from fellow travelers and share your own experiences to help others discover amazing places.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Plane className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Mira Travels</span>
              </div>
              <p className="text-muted-foreground">
                Your comprehensive travel companion for discovering amazing places around the world.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Destinations</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/destination/paris">Paris</Link></li>
                <li><Link href="/destination/tokyo">Tokyo</Link></li>
                <li><Link href="/destination/new-york">New York</Link></li>
                <li><Link href="/destination/barcelona">Barcelona</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/restaurants">Restaurants</Link></li>
                <li><Link href="/hotels">Hotels</Link></li>
                <li><Link href="/attractions">Attractions</Link></li>
                <li><Link href="/nightlife">Nightlife</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Mira Travels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
