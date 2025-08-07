import { DestinationComparison } from "@/components/destination-comparison"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContrastIcon as Compare, Star, TrendingUp, Settings } from 'lucide-react'

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Compare Destinations</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Find your perfect destination with personalized scoring based on what matters most to you
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Compare className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>Side-by-Side Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Compare up to 4 destinations across multiple categories including costs, safety, climate, and activities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>Personalized Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Weight different factors by importance to get personalized destination rankings that match your priorities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-primary" />
              <CardTitle>Smart Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Get intelligent recommendations based on your preferences with detailed score breakdowns for each category.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How Personalized Scoring Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">1. Set Your Priorities</h3>
                <p className="text-sm text-muted-foreground">
                  Adjust the importance of different factors like safety, cost, climate, and activities using our intuitive sliders.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Get Personalized Scores</h3>
                <p className="text-sm text-muted-foreground">
                  Each destination receives a weighted score based on your preferences, helping you identify the best matches.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Compare Categories</h3>
                <p className="text-sm text-muted-foreground">
                  See detailed breakdowns of how each destination performs in the categories that matter most to you.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. Make Informed Decisions</h3>
                <p className="text-sm text-muted-foreground">
                  Use the comprehensive comparison data to choose destinations that align with your travel style and preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Tool */}
        <div className="text-center">
          <DestinationComparison />
        </div>

        {/* Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tips for Better Comparisons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">🎯 Focus on What Matters</h4>
                <p className="text-muted-foreground">
                  Increase weights for factors that are most important to your travel style. Budget travelers might prioritize cost, while luxury travelers might focus on ratings and activities.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">⚖️ Balance Your Weights</h4>
                <p className="text-muted-foreground">
                  While you can emphasize certain factors, maintaining some balance ensures you don't miss important aspects of a destination.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">🔄 Try Different Scenarios</h4>
                <p className="text-muted-foreground">
                  Experiment with different weight combinations to see how rankings change. This can help you discover destinations you might not have considered.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">📊 Check Score Breakdowns</h4>
                <p className="text-muted-foreground">
                  Look at the detailed category scores to understand why certain destinations rank higher and identify potential trade-offs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
