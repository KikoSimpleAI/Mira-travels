'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuthDialog } from '@/components/auth-dialog'
import { UserMenu } from '@/components/user-menu'
import { useAuth } from '@/hooks/use-auth'
import { Search, MapPin, Star, Users, TrendingUp, Globe, Camera, Compass, Heart, Award, Shield, DollarSign, Sun, Activity, Navigation } from 'lucide-react'

const destinations = [
  {
    id: 1,
    name: "Santorini, Greece",
    image: "/santorini-white-blue.png",
    rating: 4.8,
    reviews: 2847,
    category: "Island Paradise",
    price: "$$$",
    highlights: ["Stunning sunsets", "White architecture", "Wine tasting"],
    safety: 9.2,
    walkability: 7.8,
    activities: 8.5
  },
  {
    id: 2,
    name: "Tokyo, Japan",
    image: "/tokyo-neon-skyline.png",
    rating: 4.9,
    reviews: 3921,
    category: "Urban Adventure",
    price: "$$$$",
    highlights: ["Modern culture", "Amazing food", "Technology"],
    safety: 9.8,
    walkability: 9.1,
    activities: 9.7
  },
  {
    id: 3,
    name: "Bali, Indonesia",
    image: "/bali-rice-temple.png",
    rating: 4.7,
    reviews: 1923,
    category: "Tropical Escape",
    price: "$$",
    highlights: ["Beautiful beaches", "Rich culture", "Affordable luxury"],
    safety: 8.1,
    walkability: 6.9,
    activities: 8.8
  },
  {
    id: 4,
    name: "Paris, France",
    image: "/eiffel-cafe.png",
    rating: 4.6,
    reviews: 4156,
    category: "Cultural Hub",
    price: "$$$",
    highlights: ["Art & museums", "Romantic atmosphere", "World-class cuisine"],
    safety: 8.7,
    walkability: 8.9,
    activities: 9.2
  },
  {
    id: 5,
    name: "Reykjavik, Iceland",
    image: "/reykjavik-northern-lights-houses.png",
    rating: 4.5,
    reviews: 1247,
    category: "Natural Wonder",
    price: "$$$$",
    highlights: ["Northern lights", "Geothermal spas", "Unique landscapes"],
    safety: 9.6,
    walkability: 8.3,
    activities: 7.9
  },
  {
    id: 6,
    name: "Marrakech, Morocco",
    image: "/placeholder-4mexv.png",
    rating: 4.4,
    reviews: 1834,
    category: "Exotic Adventure",
    price: "$",
    highlights: ["Vibrant markets", "Historic architecture", "Desert excursions"],
    safety: 7.8,
    walkability: 7.2,
    activities: 8.6
  }
]

const features = [
  {
    icon: MapPin,
    title: "Discover Hidden Gems",
    description: "Find unique destinations and local favorites beyond the typical tourist spots"
  },
  {
    icon: Users,
    title: "Community Insights",
    description: "Get real reviews and tips from fellow travelers who've been there"
  },
  {
    icon: TrendingUp,
    title: "Personalized Recommendations",
    description: "AI-powered suggestions based on your preferences and travel style"
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Explore destinations worldwide with detailed local information"
  }
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { user, loading } = useAuth()

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Compass className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Mira Travels</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/destinations" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Destinations
                </Link>
                <Link href="/destinations/compare" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Compare
                </Link>
                <Link href="/poi" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Places
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <UserMenu />
              ) : (
                <div className="flex items-center space-x-2">
                  <AuthDialog defaultMode="signin">
                    <Button variant="ghost">Sign In</Button>
                  </AuthDialog>
                  <AuthDialog defaultMode="signup">
                    <Button>Join Community</Button>
                  </AuthDialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Your Next
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}Adventure
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore amazing destinations with personalized recommendations, local insights, 
              and a community of fellow travelers to guide your journey.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search destinations, cities, or experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-lg"
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/destinations">
                <Button size="lg" className="px-8 py-4 text-lg">
                  <MapPin className="mr-2 h-5 w-5" />
                  Explore Destinations
                </Button>
              </Link>
              <Link href="/destinations/compare">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Compare Places
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Mira Travels?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine AI-powered recommendations with real traveler insights to help you 
              find the perfect destination for your next adventure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Popular Destinations
              </h2>
              <p className="text-xl text-gray-600">
                Discover the most loved places by our community
              </p>
            </div>
            <Link href="/destinations">
              <Button variant="outline" className="hidden sm:flex">
                View All Destinations
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.slice(0, 6).map((destination) => (
              <Card key={destination.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      {destination.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 rounded-full p-2">
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {destination.name}
                    </CardTitle>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{destination.rating}</span>
                      </div>
                      <p className="text-sm text-gray-500">{destination.reviews} reviews</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {destination.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{destination.safety}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Navigation className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{destination.walkability}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{destination.activities}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-gray-900">{destination.price}</span>
                      <Link href={`/destinations/${destination.id}`}>
                        <Button size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 sm:hidden">
            <Link href="/destinations">
              <Button variant="outline">
                View All Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of travelers who trust Mira Travels to discover their perfect destinations.
          </p>
          
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/profile">
                <Button size="lg" variant="secondary" className="px-8 py-4">
                  <Users className="mr-2 h-5 w-5" />
                  Customize Your Profile
                </Button>
              </Link>
              <Link href="/destinations/compare">
                <Button size="lg" variant="outline" className="px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Compare Destinations
                </Button>
              </Link>
            </div>
          ) : (
            <AuthDialog defaultMode="signup">
              <Button size="lg" variant="secondary" className="px-8 py-4">
                <Users className="mr-2 h-5 w-5" />
                Join the Community
              </Button>
            </AuthDialog>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Compass className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">Mira Travels</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted companion for discovering amazing destinations around the world. 
                Get personalized recommendations and connect with fellow travelers.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
                <li><Link href="/destinations/compare" className="hover:text-white transition-colors">Compare</Link></li>
                <li><Link href="/poi" className="hover:text-white transition-colors">Places of Interest</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Travel Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mira Travels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
