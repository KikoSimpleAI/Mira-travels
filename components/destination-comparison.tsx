"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Destination = {
  id: string
  name: string
  country: string
  image: string
  rating: number         // 0-5
  safety: number         // 0-10
  totalCost: number      // lower is better
  avgTemp: number        // used for climate score proximity to ~20°C
  poiCount: number       // activities proxy
  walkability: number    // 0-10
}

// Minimal dataset aligned with your app’s slugs and images.
const DATASET: Destination[] = [
  { id: "paris", name: "Paris", country: "France", image: "/images/destinations/paris.png", rating: 4.8, safety: 8, totalCost: 215, avgTemp: 15, poiCount: 2847, walkability: 9 },
  { id: "tokyo", name: "Tokyo", country: "Japan", image: "/images/destinations/tokyo.png", rating: 4.9, safety: 10, totalCost: 310, avgTemp: 18, poiCount: 3421, walkability: 8 },
  { id: "new-york", name: "New York City", country: "USA", image: "/images/destinations/new-york.png", rating: 4.7, safety: 7, totalCost: 350, avgTemp: 16, poiCount: 4123, walkability: 9 },
  { id: "barcelona", name: "Barcelona", country: "Spain", image: "/images/destinations/barcelona.png", rating: 4.6, safety: 8, totalCost: 177, avgTemp: 20, poiCount: 1654, walkability: 8 },
  { id: "rome", name: "Rome", country: "Italy", image: "/images/destinations/rome.png", rating: 4.7, safety: 7, totalCost: 185, avgTemp: 19, poiCount: 1923, walkability: 7 },
  { id: "london", name: "London", country: "UK", image: "/images/destinations/london.png", rating: 4.5, safety: 8, totalCost: 250, avgTemp: 12, poiCount: 2756, walkability: 8 },
  { id: "bali", name: "Bali", country: "Indonesia", image: "/images/destinations/bali.png", rating: 4.4, safety: 6, totalCost: 83, avgTemp: 27, poiCount: 1234, walkability: 5 },
  { id: "dubai", name: "Dubai", country: "UAE", image: "/images/destinations/dubai.png", rating: 4.3, safety: 9, totalCost: 415, avgTemp: 28, poiCount: 987, walkability: 6 },
  { id: "marrakech", name: "Marrakech", country: "Morocco", image: "/images/destinations/marrakech.png", rating: 4.6, safety: 7, totalCost: 115, avgTemp: 22, poiCount: 980, walkability: 7 },
  { id: "positano", name: "Positano", country: "Italy", image: "/images/destinations/positano.png", rating: 4.7, safety: 8, totalCost: 365, avgTemp: 23, poiCount: 350, walkability: 6 },
  { id: "portofino", name: "Portofino", country: "Italy", image: "/images/destinations/portofino.png", rating: 4.6, safety: 9, totalCost: 380, avgTemp: 22, poiCount: 180, walkability: 8 },
  { id: "marseille", name: "Marseille", country: "France", image: "/images/destinations/marseille.png", rating: 4.4, safety: 7, totalCost: 195, avgTemp: 18, poiCount: 1200, walkability: 7 },
  { id: "istanbul", name: "Istanbul", country: "Türkiye", image: "/images/destinations/istanbul.png", rating: 4.8, safety: 8, totalCost: 160, avgTemp: 14, poiCount: 3100, walkability: 7 },
]

function normalize(value: number, min: number, max: number) {
  if (max === min) return 50
  return ((value - min) / (max - min)) * 100
}

function climateScore(temp: number) {
  // Best around 20°C, linearly reducing 5 points per degree away
  return Math.max(0, Math.min(100, 100 - Math.abs(temp - 20) * 5))
}

export type DestinationComparisonProps = {
  preselectedDestinations?: string[]
}

export function DestinationComparison({ preselectedDestinations = [] }: DestinationComparisonProps) {
  // Selected IDs (max 4)
  const [selected, setSelected] = useState<string[]>(
    preselectedDestinations.length
      ? preselectedDestinations.slice(0, 4)
      : ["paris", "tokyo", "istanbul"].slice(0, 3)
  )

  // Weights 1..5 for simplicity
  const [weights, setWeights] = useState({
    rating: 3,
    safety: 3,
    cost: 3,
    climate: 2,
    activities: 3,
    walkability: 2,
  })

  const selectedDestinations = useMemo(
    () => DATASET.filter(d => selected.includes(d.id)),
    [selected]
  )

  // Precompute ranges for normalization
  const ranges = useMemo(() => {
    const ratings = DATASET.map(d => d.rating)
    const safety = DATASET.map(d => d.safety)
    const costs = DATASET.map(d => d.totalCost)
    const pois = DATASET.map(d => d.poiCount)
    const walk = DATASET.map(d => d.walkability)
    return {
      rating: { min: Math.min(...ratings), max: Math.max(...ratings) },
      safety: { min: Math.min(...safety), max: Math.max(...safety) },
      cost: { min: Math.min(...costs), max: Math.max(...costs) },
      activities: { min: Math.min(...pois), max: Math.max(...pois) },
      walkability: { min: Math.min(...walk), max: Math.max(...walk) },
    }
  }, [])

  const scores = useMemo(() => {
    return selectedDestinations.map(d => {
      const rating = normalize(d.rating, ranges.rating.min, ranges.rating.max) // higher better
      const safety = normalize(d.safety, ranges.safety.min, ranges.safety.max) // higher better
      const cost = 100 - normalize(d.totalCost, ranges.cost.min, ranges.cost.max) // lower cost = higher score
      const climate = climateScore(d.avgTemp)
      const activities = normalize(d.poiCount, ranges.activities.min, ranges.activities.max)
      const walkability = normalize(d.walkability, ranges.walkability.min, ranges.walkability.max)
      const sumWeights = Object.values(weights).reduce((a, b) => a + b, 0)
      const weighted =
        (rating * weights.rating +
          safety * weights.safety +
          cost * weights.cost +
          climate * weights.climate +
          activities * weights.activities +
          walkability * weights.walkability) / sumWeights
      return {
        id: d.id,
        total: weighted,
        breakdown: { rating, safety, cost, climate, activities, walkability },
      }
    }).sort((a, b) => b.total - a.total)
  }, [selectedDestinations, ranges, weights])

  const handleSelect = (index: number, value: string) => {
    setSelected(prev => {
      const next = [...prev]
      next[index] = value
      // Deduplicate
      return next.filter((v, i) => v && next.indexOf(v) === i).slice(0, 4)
    })
  }

  const availableOptions = DATASET.filter(d => !selected.includes(d.id))

  return (
    <div className="space-y-8">
      {/* Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select destinations to compare</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((slot) => {
            const current = selected[slot]
            const allForSlot = current
              ? [DATASET.find(d => d.id === current)!, ...DATASET.filter(d => d.id !== current)]
              : DATASET
            return (
              <div key={slot} className="space-y-2">
                <Select
                  value={current || ""}
                  onValueChange={(val) => handleSelect(slot, val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select #${slot + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {allForSlot.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} — {d.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {current && (
                  <div className="relative h-28 rounded overflow-hidden">
                    <Image
                      src={DATASET.find(d => d.id === current)?.image || "/placeholder.svg?height=160&width=240&query=destination"}
                      alt={DATASET.find(d => d.id === current)?.name || "Destination"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Weights */}
      <Card>
        <CardHeader>
          <CardTitle>Adjust category weights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {([
            ["rating", "Ratings"],
            ["safety", "Safety"],
            ["cost", "Cost (Value)"],
            ["climate", "Climate Comfort"],
            ["activities", "Activities"],
            ["walkability", "Walkability"],
          ] as const).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{label}</span>
                <Badge variant="secondary">x{weights[key]}</Badge>
              </div>
              <Slider
                value={[weights[key]]}
                min={1}
                max={5}
                step={1}
                onValueChange={([v]) => setWeights(w => ({ ...w, [key]: v }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {scores.length === 0 ? (
            <div className="text-muted-foreground">Select at least one destination.</div>
          ) : (
            <div className="min-w-[720px]">
              {/* Header row with images */}
              <div className="grid" style={{ gridTemplateColumns: `200px repeat(${scores.length}, minmax(160px, 1fr))` }}>
                <div className="p-2 font-medium">Metric</div>
                {scores.map((s, idx) => {
                  const d = DATASET.find(x => x.id === s.id)!
                  return (
                    <div key={s.id} className={cn("p-2 rounded", idx === 0 ? "bg-green-50" : "bg-muted/40")}>
                      <div className="relative h-24 w-full rounded overflow-hidden mb-2">
                        <Image
                          src={d.image || "/placeholder.svg?height=120&width=180&query=destination-card"}
                          alt={d.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="font-semibold">{d.name}</div>
                      <div className="text-sm text-muted-foreground">{d.country}</div>
                      <div className="mt-1 text-sm">
                        Overall: <span className="font-semibold">{s.total.toFixed(0)}/100</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Breakdown rows */}
              {([
                ["rating", "Ratings"],
                ["safety", "Safety"],
                ["cost", "Value (Cost)"],
                ["climate", "Climate"],
                ["activities", "Activities"],
                ["walkability", "Walkability"],
              ] as const).map(([key, label]) => (
                <div
                  key={key}
                  className="grid items-center"
                  style={{ gridTemplateColumns: `200px repeat(${scores.length}, minmax(160px, 1fr))` }}
                >
                  <div className="p-2 text-sm font-medium">{label}</div>
                  {scores.map((s, idx) => {
                    const val = s.breakdown[key as keyof typeof s.breakdown] as number
                    return (
                      <div key={s.id + key} className={cn("p-2", idx === 0 ? "bg-green-50" : "bg-muted/40")}>
                        <div className="flex items-center justify-between text-sm">
                          <div className="w-full h-2 bg-muted rounded mr-2 overflow-hidden">
                            <div
                              className="h-2 bg-primary"
                              style={{ width: `${Math.max(0, Math.min(100, val))}%` }}
                            />
                          </div>
                          <span className="tabular-nums">{val.toFixed(0)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setSelected([])}>Clear</Button>
        <Button onClick={() => setSelected(["paris", "tokyo", "istanbul", "barcelona"])}>Try example</Button>
      </div>
    </div>
  )
}
