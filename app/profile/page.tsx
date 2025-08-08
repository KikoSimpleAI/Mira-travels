import ProfileForm from "@/components/profile/profile-form"

export default function ProfilePage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your profile and travel preferences.</p>
      </header>
      <ProfileForm />
    </main>
  )
}
