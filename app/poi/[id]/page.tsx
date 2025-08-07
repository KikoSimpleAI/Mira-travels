"use client"

import { useState } from "react"
import { ArrowLeft, Star, MapPin, Phone, Globe, Clock, Heart, Share2, Camera } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { GoogleMaps } from "@/components/google-maps"

const poiData = {
  id: 1,
  name: "Le Comptoir du Relais",
  category: "Restaurant",
  rating: 4.6,
  reviewCount: 1247,
  price: "€€€",
  images: [
    "/placeholder.svg?height=400&width=600&text=Restaurant+Interior",
    "/placeholder.svg?height=400&width=600&text=French+Cuisine",
    "/placeholder.svg?height=400&width=600&text=Wine+Selection"
  ],
  description: "Authentic French bistro in Saint-Germain serving traditional dishes with a modern twist. Known for its cozy atmosphere and excellent wine selection.",
  address: "9 Carrefour de l'Odéon, 75006 Paris, France",
  phone: "+33 1 44 27 07 97",
  website: "www.hotel-paris-relais-saint-germain.com",
  hours: {
    monday: "12:00 PM - 2:00 PM, 7:00 PM - 11:00 PM",
    tuesday: "12:00 PM - 2:00 PM, 7:00 PM - 11:00 PM",
    wednesday: "12:00 PM - 2:00 PM, 7:00 PM - 11:00 PM",
    thursday: "12:00 PM - 2:00 PM, 7:00 PM - 11:00 PM",
    friday: "12:00 PM - 2:00 PM, 7:00 PM - 11:00 PM",
    saturday: "12:00 PM - 2:00 PM, 7:00 PM - 11:00 PM",
    sunday: "Closed"
  },
  features: ["Outdoor Seating", "Wine Bar", "Reservations Required", "Credit Cards Accepted"]
}

const ratingBreakdown = [
  { stars: 5, count: 687, percentage: 55 },
  { stars: 4, count: 374, percentage: 30 },
  { stars: 3, count: 125, percentage: 10 },
  { stars: 2, count: 37, percentage: 3 },
  { stars: 1, count: 24, percentage: 2 }
]

const reviews = [
  {
    id: 1,
    user: "Marie L.",
    avatar: "/placeholder.svg?height=40&width=40&text=ML",
    rating: 5,
    date: "3 days ago",
    comment: "Exceptional dining experience! The coq au vin was perfectly prepared and the service was impeccable. The wine selection is outstanding. Highly recommend making a reservation as it gets very busy.",
    helpful: 15,
    images: ["/placeholder.svg?height=200&width=200&text=Food+Photo"]
  },
  {
    id: 2,
    user: "James R.",
    avatar: "/placeholder.svg?height=40&width=40&text=JR",
    rating: 4,
    date: "1 week ago",
    comment: "Great atmosphere and authentic French cuisine. The escargot was delicious and the staff was very knowledgeable about the menu. Only downside was the wait time even with a reservation.",
    helpful: 8,
    images: []
  },
  {
    id: 3,
    user: "Sophie M.",
    avatar: "/placeholder.svg?height=40&width=40&text=SM",
    rating: 5,
    date: "2 weeks ago",
    comment: "This place is a gem! Perfect for a romantic dinner. The duck confit was amazing and the dessert selection is to die for. Will definitely be back!",
    helpful: 12,
    images: []
  }
]

export default function POIPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [newRating, setNewRating] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/destination/paris" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Paris
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
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={poiData.images[currentImageIndex] || "/placeholder.svg"}
                  alt={poiData.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {poiData.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-4 right-4"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  View All Photos
                </Button>
              </div>
            </Card>

            {/* Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge>{poiData.category}</Badge>
                    <Badge variant="outline">{poiData.price}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{poiData.name}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-current text-yellow-400 mr-1" />
                      <span className="font-semibold">{poiData.rating}</span>
                      <span className="text-muted-foreground ml-1">
                        ({poiData.reviewCount.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">{poiData.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {poiData.features.map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="hours">Hours & Info</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>

              <TabsContent value="reviews" className="space-y-6">
                {/* Rating Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rating Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">{poiData.rating}</div>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(poiData.rating)
                                  ? 'fill-current text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-muted-foreground">
                          {poiData.reviewCount.toLocaleString()} reviews
                        </div>
                      </div>
                      <div className="space-y-2">
                        {ratingBreakdown.map((item) => (
                          <div key={item.stars} className="flex items-center space-x-2">
                            <span className="text-sm w-8">{item.stars}★</span>
                            <Progress value={item.percentage} className="flex-1" />
                            <span className="text-sm text-muted-foreground w-12">
                              {item.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Review */}
                <Card>
                  <CardHeader>
                    <CardTitle>Write a Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Your rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 cursor-pointer ${
                              star <= newRating
                                ? 'fill-current text-yellow-400'
                                : 'text-muted-foreground hover:text-yellow-400'
                            }`}
                            onClick={() => setNewRating(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <Textarea placeholder="Share your experience..." />
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
                            <p className="text-muted-foreground mb-4">{review.comment}</p>
                            
                            {review.images.length > 0 && (
                              <div className="flex space-x-2 mb-4">
                                {review.images.map((image, index) => (
                                  <div key={index} className="relative w-20 h-20">
                                    <Image
                                      src={image || "/placeholder.svg"}
                                      alt="Review photo"
                                      fill
                                      className="object-cover rounded"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            
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

              <TabsContent value="hours">
                <Card>
                  <CardHeader>
                    <CardTitle>Hours & Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      {Object.entries(poiData.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize font-medium">{day}</span>
                          <span className="text-muted-foreground">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="photos">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {poiData.images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${poiData.name} photo ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-sm text-muted-foreground">{poiData.address}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{poiData.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Website</div>
                    <a 
                      href={`https://${poiData.website}`}
                      className="text-sm text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {poiData.website}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <GoogleMaps
                  center={{ lat: 48.8529, lng: 2.3387 }}
                  zoom={16}
                  pois={[{
                    id: poiData.id.toString(),
                    name: poiData.name,
                    category: poiData.category,
                    rating: poiData.rating,
                    reviewCount: poiData.reviewCount,
                    price: poiData.price,
                    lat: 48.8529,
                    lng: 2.3387,
                    address: poiData.address,
                    phone: poiData.phone,
                    website: poiData.website
                  }]}
                  onPOIClick={(poi) => {
                    console.log('POI location clicked:', poi)
                  }}
                  height="250px"
                />
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => {
                    const destination = encodeURIComponent(poiData.address)
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank')
                  }}
                >
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">Make Reservation</Button>
                <Button className="w-full" variant="outline">Call Now</Button>
                <Button className="w-full" variant="outline">Add to Itinerary</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
