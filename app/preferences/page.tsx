import { PreferencesForm } from "@/components/community/preferences-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PreferencesPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Your Travel Preferences</h1>
        <p className="text-sm text-muted-foreground">
          Set your core travel profile so we can personalize recommendations.
        </p>
      </div>
      <PreferencesForm />
      <div className="mt-10">
        <Card>
          <CardHeader>
            <CardTitle>What we store</CardTitle>
            <CardDescription>
              Your selections are saved to your user profile in Firebase and can be edited anytime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Travel Style / Vibe (single select)</li>
              <li>Budget Level (single select)</li>
              <li>Companions (single select)</li>
              <li>Key Interests (multi-select)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
