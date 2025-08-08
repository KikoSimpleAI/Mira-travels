"use client"

import { useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, MapPin, Users, Calendar, Clock, Wallet, Shield, Plane, Camera, Map, Heart, Share2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Destination data with real image paths
const destinations = {
  "paris": {
    id: "paris",
    name: "Paris",
    country: "France",
    region: "Île-de-France",
    description: "The City of Light with world-class dining, museums, and romance",
    longDescription:
      "Paris, the capital of France, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond landmarks like the Eiffel Tower and the Gothic Notre-Dame, the city is known for its café culture and designer boutiques.",
    image: "/images/destinations/paris-hero.png",
    images: [
      "/images/destinations/paris/eiffel-tower.png",
      "/images/destinations/paris/louvre.png",
      "/images/destinations/paris/notre-dame.png",
      "/images/destinations/paris/champs-elysees.png"
    ],
    rating: 4.8,
    reviewCount: 125847,
    poiCount: 2847,
    categories: ["Culture", "Art", "Food", "Romance", "History"],
    coordinates: { lat: 48.8566, lng: 2.3522 },
    bestTimeToVisit: "April-June, September-October",
    averageStay: "3-5 days",
    budget: "Mid-range",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Champs-Élysées", "Montmartre"],
    climate: {
      avgTemp: 15,
      rainfall: 50,
      sunshine: 6,
      seasons: {
        spring: "Mild and pleasant, perfect for walking",
        summer: "Warm with long days, peak tourist season",
        autumn: "Cool and crisp, fewer crowds",
        winter: "Cold but charming, Christmas markets"
      }
    },
    costs: {
      accommodation: 120,
      food: 45,
      activities: 35,
      transport: 15,
      total: 215
    },
    safety: {
      overall: 8,
      pettyTheft: "Moderate risk in tourist areas",
      emergency: "112",
      tips: ["Watch for pickpockets on metro", "Avoid poorly lit areas at night", "Keep valuables secure"]
    },
    transportation: {
      walkability: 9,
      publicTransport: "Excellent metro system",
      airport: "Charles de Gaulle (CDG), Orly (ORY)",
      gettingAround: "Metro, buses, taxis, walking"
    },
    language: {
      primary: "French",
      english: "Widely spoken in tourist areas",
      phrases: ["Bonjour - Hello", "Merci - Thank you", "Excusez-moi - Excuse me"]
    },
    visa: "EU citizens: No visa required. Others: Check requirements",
    currency: "Euro (€)",
    neighborhoods: [
      {
        name: "Le Marais",
        description: "Historic Jewish quarter with trendy boutiques and cafes",
        highlights: ["Place des Vosges", "Jewish quarter", "Vintage shopping"]
      },
      {
        name: "Montmartre",
        description: "Bohemian hilltop district with the Sacré-Cœur Basilica",
        highlights: ["Sacré-Cœur", "Artists' square", "Moulin Rouge"]
      },
      {
        name: "Saint-Germain",
        description: "Intellectual hub with bookshops, galleries, and cafes",
        highlights: ["Café de Flore", "Art galleries", "Luxembourg Gardens"]
      }
    ],
    dayTrips: [
      {
        name: "Palace of Versailles",
        distance: "20km",
        duration: "Full day",
        description: "Opulent royal palace with magnificent gardens"
      },
      {
        name: "Giverny",
        distance: "75km",
        duration: "Half day",
        description: "Monet's house and gardens that inspired his water lily paintings"
      }
    ]
  },

  "marrakech": {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    region: "Marrakesh-Safi",
    description: "Vibrant souks, riads, and rose-colored alleys at the foothills of the Atlas Mountains",
    longDescription:
      "Marrakech blends ancient tradition and modern energy. Explore buzzing souks, tranquil riads, and iconic sites like Jemaa el-Fnaa, Koutoubia Mosque, and Jardin Majorelle. The city is a gateway to Atlas Mountain adventures and Sahara excursions.",
    image: "/images/destinations/marrakech/hero.png",
    images: [
      "/images/destinations/marrakech/jemaa-el-fnaa.png",
      "/images/destinations/marrakech/koutoubia.png",
      "/images/destinations/marrakech/bahia-palace.png",
      "/images/destinations/marrakech/majorelle-garden.png",
      "/images/destinations/marrakech/souk.png"
    ],
    rating: 4.7,
    reviewCount: 80214,
    poiCount: 1520,
    categories: ["Culture", "Souks", "History", "Architecture", "Food"],
    coordinates: { lat: 31.6295, lng: -7.9811 },
    bestTimeToVisit: "March-May, September-November",
    averageStay: "3-4 days",
    budget: "Budget",
    highlights: ["Jemaa el-Fnaa", "Koutoubia Mosque", "Bahia Palace", "Jardin Majorelle", "Saadian Tombs"],
    climate: {
      avgTemp: 22,
      rainfall: 20,
      sunshine: 8,
      seasons: {
        spring: "Warm days and cool nights; ideal for exploring",
        summer: "Very hot afternoons; plan for early/late outings",
        autumn: "Pleasant temperatures with fewer crowds",
        winter: "Mild days, chilly nights; great for desert trips"
      }
    },
    costs: {
      accommodation: 60,
      food: 20,
      activities: 25,
      transport: 10,
      total: 115
    },
    safety: {
      overall: 7,
      pettyTheft: "Common around crowded markets and squares",
      emergency: "190",
      tips: ["Negotiate taxi fares", "Beware of unofficial guides", "Keep small change handy"]
    },
    transportation: {
      walkability: 7,
      publicTransport: "Local buses and taxis",
      airport: "Marrakech Menara (RAK)",
      gettingAround: "Walking in the medina, taxis for longer trips"
    },
    language: {
      primary: "Arabic",
      english: "Basic English in tourism areas; French widely spoken",
      phrases: ["Salam - Hello", "Shukran - Thank you", "Besh-hal? - How much?"]
    },
    visa: "Most travelers receive visa-free entry for short stays; confirm requirements",
    currency: "Moroccan Dirham (MAD)",
    neighborhoods: [
      { name: "Medina", description: "Historic heart with riads and souks", highlights: ["Jemaa el-Fnaa", "Souk Semmarine", "Mellah"] },
      { name: "Gueliz", description: "Modern district with cafes and galleries", highlights: ["Jardin Majorelle", "YSL Museum", "Boulevards"] },
      { name: "Kasbah", description: "South medina area near palaces", highlights: ["Bahia Palace", "Saadian Tombs", "Badi Palace"] }
    ],
    dayTrips: [
      { name: "Atlas Mountains", distance: "60-80km", duration: "Full day", description: "Villages and valleys with mountain views" },
      { name: "Aït Benhaddou", distance: "180km", duration: "Full day", description: "UNESCO ksar used as a film location" }
    ]
  },

  "positano": {
    id: "positano",
    name: "Positano",
    country: "Italy",
    region: "Campania",
    description: "Cliffside pastel houses cascading to the Tyrrhenian Sea on the Amalfi Coast",
    longDescription:
      "Positano enchants with steep lanes, chic boutiques, and pebble beaches. Ferries connect to Amalfi and Capri, while scenic trails like the Path of the Gods offer sweeping views.",
    image: "/images/destinations/positano/hero.png",
    images: [
      "/images/destinations/positano/spiaggia-grande.png",
      "/images/destinations/positano/cliff-houses.png",
      "/images/destinations/positano/path-of-gods.png",
      "/images/destinations/positano/sunset-bay.png",
      "/images/destinations/positano/boats-marina.png"
    ],
    rating: 4.8,
    reviewCount: 56421,
    poiCount: 640,
    categories: ["Beaches", "Romance", "Food", "Scenic", "Boating"],
    coordinates: { lat: 40.628, lng: 14.484 },
    bestTimeToVisit: "May-June, September-October",
    averageStay: "2-3 days",
    budget: "Luxury",
    highlights: ["Spiaggia Grande", "Path of the Gods", "Santa Maria Assunta", "Ferry to Capri", "Amalfi Coast Drive"],
    climate: {
      avgTemp: 18,
      rainfall: 60,
      sunshine: 7,
      seasons: {
        spring: "Mild and blooming; fewer crowds",
        summer: "Hot, beach-perfect, peak season",
        autumn: "Warm sea and quieter lanes",
        winter: "Quiet; limited services but dramatic scenery"
      }
    },
    costs: {
      accommodation: 220,
      food: 70,
      activities: 50,
      transport: 25,
      total: 365
    },
    safety: {
      overall: 8,
      pettyTheft: "Low to moderate in crowded spots",
      emergency: "112",
      tips: ["Book ferries early", "Wear good shoes for stairs", "Avoid driving if possible"]
    },
    transportation: {
      walkability: 6,
      publicTransport: "Ferries and SITA buses",
      airport: "Naples (NAP) via transfer",
      gettingAround: "Walking, buses, ferries"
    },
    language: {
      primary: "Italian",
      english: "Common in hotels and restaurants",
      phrases: ["Ciao - Hello", "Grazie - Thank you", "Per favore - Please"]
    },
    visa: "Schengen rules apply",
    currency: "Euro (€)",
    neighborhoods: [
      { name: "Spiaggia Grande", description: "Main beach and promenade", highlights: ["Beach clubs", "Marina", "Sea views"] },
      { name: "Fornillo", description: "Quieter cove west of the center", highlights: ["Fornillo Beach", "Coastal path", "Cliffside views"] },
      { name: "Chiesa Nuova", description: "Upper residential area", highlights: ["Scenic steps", "Local eateries", "Views of the bay"] }
    ],
    dayTrips: [
      { name: "Amalfi & Ravello", distance: "16-30km", duration: "Half/Full day", description: "Clifftop villas and gardens" },
      { name: "Capri", distance: "30km by ferry", duration: "Full day", description: "Blue Grotto and chic piazzetta" }
    ]
  },

  "portofino": {
    id: "portofino",
    name: "Portofino",
    country: "Italy",
    region: "Liguria",
    description: "Elegant harbor village with colorful facades, yachts, and coastal trails",
    longDescription:
      "Portofino charms with pastel houses around its crescent harbor, chic dining, and scenic paths to Castello Brown and the lighthouse at Punta del Capo.",
    image: "/images/destinations/portofino/hero.png",
    images: [
      "/images/destinations/portofino/harbor.png",
      "/images/destinations/portofino/castello-brown.png",
      "/images/destinations/portofino/lighthouse.png",
      "/images/destinations/portofino/sea-cliffs.png",
      "/images/destinations/portofino/piazzetta.png"
    ],
    rating: 4.6,
    reviewCount: 21456,
    poiCount: 210,
    categories: ["Coastal", "Food", "Boating", "Scenic", "Luxury"],
    coordinates: { lat: 44.303, lng: 9.209 },
    bestTimeToVisit: "May-September",
    averageStay: "1-2 days",
    budget: "Luxury",
    highlights: ["Harbor Piazzetta", "Castello Brown", "Lighthouse Trail", "Paraggi Beach", "Boat tours"],
    climate: {
      avgTemp: 17,
      rainfall: 80,
      sunshine: 7,
      seasons: {
        spring: "Sunny spells and fresh breezes",
        summer: "Warm and lively harbor",
        autumn: "Mellow and photogenic",
        winter: "Quiet; some closures"
      }
    },
    costs: {
      accommodation: 240,
      food: 80,
      activities: 40,
      transport: 20,
      total: 380
    },
    safety: {
      overall: 9,
      pettyTheft: "Low",
      emergency: "112",
      tips: ["Book restaurants in high season", "Consider nearby Santa Margherita for stays"]
    },
    transportation: {
      walkability: 8,
      publicTransport: "Buses and boats from Santa Margherita",
      airport: "Genoa (GOA)",
      gettingAround: "On foot and by boat"
    },
    language: {
      primary: "Italian",
      english: "Common in tourism",
      phrases: ["Buongiorno - Good morning", "Per favore - Please", "Grazie - Thank you"]
    },
    visa: "Schengen rules apply",
    currency: "Euro (€)",
    neighborhoods: [
      { name: "Piazzetta", description: "Harbor-side square", highlights: ["Cafés", "Boutiques", "Views"] },
      { name: "Paraggi", description: "Beach cove nearby", highlights: ["Beach clubs", "Emerald water", "Snorkeling"] },
      { name: "Castello Brown", description: "Hilltop fortress", highlights: ["Garden views", "Museum", "Trails"] }
    ],
    dayTrips: [
      { name: "Cinque Terre", distance: "50-80km", duration: "Full day", description: "Cliff villages and hiking" },
      { name: "Genoa", distance: "35km", duration: "Half/Full day", description: "Historic center and aquarium" }
    ]
  },

  "marseille": {
    id: "marseille",
    name: "Marseille",
    country: "France",
    region: "Provence-Alpes-Côte d’Azur",
    description: "Historic port city with Mediterranean flair, calanques, and vibrant neighborhoods",
    longDescription:
      "France’s oldest city blends maritime heritage and multicultural spirit. Stroll the Vieux-Port, climb to Notre-Dame de la Garde, and explore the dramatic Calanques National Park.",
    image: "/images/destinations/marseille/hero.png",
    images: [
      "/images/destinations/marseille/vieux-port.png",
      "/images/destinations/marseille/notre-dame-de-la-garde.png",
      "/images/destinations/marseille/calanque-sormiou.png",
      "/images/destinations/marseille/le-panier.png",
      "/images/destinations/marseille/mucem.png"
    ],
    rating: 4.5,
    reviewCount: 67210,
    poiCount: 1180,
    categories: ["Coastal", "Culture", "Food", "Hiking", "History"],
    coordinates: { lat: 43.2965, lng: 5.3698 },
    bestTimeToVisit: "April-June, September-October",
    averageStay: "2-3 days",
    budget: "Mid-range",
    highlights: ["Vieux-Port", "Notre-Dame de la Garde", "Le Panier", "MUCEM", "Calanques"],
    climate: {
      avgTemp: 18,
      rainfall: 40,
      sunshine: 7,
      seasons: {
        spring: "Mistral winds with sunny days",
        summer: "Hot and dry; perfect for calanques",
        autumn: "Warm seas and lighter crowds",
        winter: "Mild; occasional wind and rain"
      }
    },
    costs: {
      accommodation: 110,
      food: 40,
      activities: 30,
      transport: 15,
      total: 195
    },
    safety: {
      overall: 7,
      pettyTheft: "Watch for pickpockets near the port",
      emergency: "112",
      tips: ["Avoid isolated areas late", "Use official taxis", "Secure valuables on beaches"]
    },
    transportation: {
      walkability: 7,
      publicTransport: "Metro, tram, and buses",
      airport: "Marseille Provence (MRS)",
      gettingAround: "Public transport and walking"
    },
    language: {
      primary: "French",
      english: "Moderate in tourism",
      phrases: ["Bonjour - Hello", "Merci - Thank you", "S’il vous plaît - Please"]
    },
    visa: "EU citizens: No visa required. Others: Check requirements",
    currency: "Euro (€)",
    neighborhoods: [
      { name: "Le Panier", description: "Colorful old quarter", highlights: ["Street art", "Cafés", "Views"] },
      { name: "Vieux-Port", description: "Harbor heart of the city", highlights: ["Fish market", "Boat trips", "Sunsets"] },
      { name: "Prado", description: "Beaches and parks", highlights: ["Prado Beach", "Parc Borély", "Promenades"] }
    ],
    dayTrips: [
      { name: "Cassis & Calanques", distance: "30km", duration: "Half/Full day", description: "Turquoise coves and boat rides" },
      { name: "Aix-en-Provence", distance: "33km", duration: "Half day", description: "Cezanne’s hometown and markets" }
    ]
  },

  "istanbul": {
    id: "istanbul",
    name: "Istanbul",
    country: "Türkiye",
    region: "Marmara",
    description: "Where Europe meets Asia—Bosphorus views, Ottoman wonders, and vibrant bazaars",
    longDescription:
      "Istanbul’s skyline of domes and minarets tells a story across empires. Wander from Sultanahmet’s monuments to Galata’s streets, and cruise the Bosphorus between continents.",
    image: "/images/destinations/istanbul/hero.png",
    images: [
      "/images/destinations/istanbul/hagia-sophia.png",
      "/images/destinations/istanbul/blue-mosque.png",
      "/images/destinations/istanbul/galata-tower.png",
      "/images/destinations/istanbul/grand-bazaar.png",
      "/images/destinations/istanbul/bosphorus.png"
    ],
    rating: 4.8,
    reviewCount: 143220,
    poiCount: 2650,
    categories: ["History", "Architecture", "Food", "Markets", "Views"],
    coordinates: { lat: 41.0082, lng: 28.9784 },
    bestTimeToVisit: "April-June, September-October",
    averageStay: "3-4 days",
    budget: "Mid-range",
    highlights: ["Hagia Sophia", "Blue Mosque", "Topkapi Palace", "Grand Bazaar", "Bosphorus Cruise"],
    climate: {
      avgTemp: 14,
      rainfall: 65,
      sunshine: 6,
      seasons: {
        spring: "Blooming parks and comfortable weather",
        summer: "Warm and busy; sea breezes help",
        autumn: "Mild; golden light and festivals",
        winter: "Chilly; occasional snow; cozy tea houses"
      }
    },
    costs: {
      accommodation: 90,
      food: 30,
      activities: 30,
      transport: 10,
      total: 160
    },
    safety: {
      overall: 8,
      pettyTheft: "Moderate risk in crowded tourist zones",
      emergency: "112",
      tips: ["Use Istanbulkart for transit", "Beware of tourist scams", "Dress appropriately at mosques"]
    },
    transportation: {
      walkability: 7,
      publicTransport: "Metro, tram, ferries, and buses",
      airport: "Istanbul (IST), Sabiha Gökçen (SAW)",
      gettingAround: "Public transport and ferries"
    },
    language: {
      primary: "Turkish",
      english: "Common in tourist areas",
      phrases: ["Merhaba - Hello", "Teşekkürler - Thank you", "Lütfen - Please"]
    },
    visa: "Varies by nationality; many can apply online (e-Visa)",
    currency: "Turkish Lira (TRY)",
    neighborhoods: [
      { name: "Sultanahmet", description: "Historic core", highlights: ["Hagia Sophia", "Blue Mosque", "Topkapi"] },
      { name: "Beyoğlu", description: "Modern center", highlights: ["Istiklal Avenue", "Galata Tower", "Street food"] },
      { name: "Kadıköy", description: "Asian side food scene", highlights: ["Markets", "Cafés", "Ferries"] }
    ],
    dayTrips: [
      { name: "Princes’ Islands", distance: "20km by ferry", duration: "Half/Full day", description: "Car-free islands and mansions" },
      { name: "Bosphorus Villages", distance: "10-25km", duration: "Half day", description: "Ortaköy, Arnavutköy, and Rumeli Fortress" }
    ]
  }
} as const

type DestinationKey = keyof typeof destinations

interface DestinationPageProps {
  params: {
    id: string
  }
}

export default function DestinationPage({ params }: DestinationPageProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isFavorite, setIsFavorite] = useState(false)

  const destination = destinations[params.id as DestinationKey]

  if (!destination) {
    notFound()
  }

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case "Budget": return "bg-green-100 text-green-800"
      case "Mid-range": return "bg-yellow-100 text-yellow-800"
      case "Luxury": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
              <Link href="/destinations" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Destinations
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-96">
        <Image
          src={destination.image || "/placeholder.svg"}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-2">{destination.name}</h1>
              <p className="text-xl mb-4">{destination.region}, {destination.country}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-current text-yellow-400 mr-1" />
                  <span className="font-semibold">{destination.rating}</span>
                  <span className="ml-1">({destination.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <Badge className={getBudgetColor(destination.budget)}>
                  {destination.budget}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plan">Plan Visit</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="practical">Practical</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{destination.poiCount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Places to Visit</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold">{destination.bestTimeToVisit.split(',')[0]}</div>
                  <div className="text-sm text-muted-foreground">Best Time</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold">{destination.averageStay}</div>
                  <div className="text-sm text-muted-foreground">Average Stay</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Wallet className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold">€{destination.costs.total}</div>
                  <div className="text-sm text-muted-foreground">Per Day</div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {destination.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {destination.longDescription}
                </p>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {destination.categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
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
                <div className="grid md:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan" className="space-y-8">
            {/* Weather & Climate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Weather & Climate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{destination.climate.avgTemp}°C</div>
                    <div className="text-sm text-muted-foreground">Average Temperature</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{destination.climate.rainfall}mm</div>
                    <div className="text-sm text-muted-foreground">Monthly Rainfall</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{destination.climate.sunshine}h</div>
                    <div className="text-sm text-muted-foreground">Daily Sunshine</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {Object.entries(destination.climate.seasons).map(([season, description]) => (
                    <div key={season} className="p-4 border rounded-lg">
                      <h4 className="font-semibold capitalize mb-2">{season}</h4>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Planning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Budget Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(destination.costs).filter(([key]) => key !== 'total').map(([category, cost]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="capitalize">{category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">€{cost}</span>
                        <div className="w-24">
                          <Progress value={(Number(cost) / destination.costs.total) * 100} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total Daily Budget</span>
                      <span>€{destination.costs.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explore" className="space-y-8">
            {/* Neighborhoods */}
            <Card>
              <CardHeader>
                <CardTitle>Neighborhoods to Explore</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destination.neighborhoods.map((neighborhood, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="font-semibold">{neighborhood.name}</h3>
                      <p className="text-sm text-muted-foreground">{neighborhood.description}</p>
                      <div className="space-y-1">
                        {neighborhood.highlights.map((highlight: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Day Trips */}
            <Card>
              <CardHeader>
                <CardTitle>Day Trip Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {destination.dayTrips.map((trip, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <Plane className="h-6 w-6 text-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{trip.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{trip.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>📍 {trip.distance}</span>
                          <span>⏱️ {trip.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practical" className="space-y-8">
            {/* Safety Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Safety & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{destination.safety.overall}/10</div>
                    <div className="text-sm text-muted-foreground">Safety Rating</div>
                  </div>
                  <div className="flex-1">
                    <Progress value={destination.safety.overall * 10} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p><strong>Emergency Number:</strong> {destination.safety.emergency}</p>
                  <p><strong>Petty Theft:</strong> {destination.safety.pettyTheft}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Safety Tips:</h4>
                  <ul className="space-y-1">
                    {destination.safety.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Transportation */}
            <Card>
              <CardHeader>
                <CardTitle>Getting Around</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Walkability</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">{destination.transportation.walkability}/10</span>
                      <Progress value={destination.transportation.walkability * 10} className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Public Transport</h4>
                    <p className="text-sm text-muted-foreground">{destination.transportation.publicTransport}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p><strong>Airports:</strong> {destination.transportation.airport}</p>
                  <p><strong>Getting Around:</strong> {destination.transportation.gettingAround}</p>
                </div>
              </CardContent>
            </Card>

            {/* Language & Communication */}
            <Card>
              <CardHeader>
                <CardTitle>Language & Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Primary Language:</strong> {destination.language.primary}</p>
                  <p><strong>English:</strong> {destination.language.english}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Useful Phrases:</h4>
                  <div className="space-y-1">
                    {destination.language.phrases.map((phrase: string, index: number) => (
                      <div key={index} className="text-sm">
                        {phrase}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visa & Currency */}
            <Card>
              <CardHeader>
                <CardTitle>Visa & Currency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Visa Requirements:</strong> {destination.visa}</p>
                  <p><strong>Currency:</strong> {destination.currency}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Traveler Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Reviews Coming Soon</h3>
                  <p className="text-muted-foreground">
                    We're working on bringing you authentic traveler reviews and ratings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Photo Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {destination.images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${destination.name} ${index + 1}`}
                        fill
                        className="object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Map className="h-5 w-5 mr-2" />
                  Location & Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Map Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    We're working on bringing you detailed maps with points of interest.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p>Coordinates: {destination.coordinates.lat}, {destination.coordinates.lng}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
