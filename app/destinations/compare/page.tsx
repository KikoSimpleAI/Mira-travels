"use client"

import { DestinationComparison } from "@/components/destination-comparison"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, TrendingUp, ContrastIcon as Compare } from 'lucide-react'

export default function ComparePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Compare Destinations</h1>
          <p className="text-muted-foreground">
            Pick up to 4 places and tune the weights to get a personalized ranking.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Compare className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>Side-by-Side</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Compare safety, cost, climate, activities, and more.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>Adjust Weights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Emphasize the factors that matter most to you.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>Smart Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                See overall and category scores with clear breakdowns.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Tool */}
        <DestinationComparison />
      </div>
    </main>
  )
}
