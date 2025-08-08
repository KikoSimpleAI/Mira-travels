export default function DestinationsLoading() {
  return (
    <main className="container mx-auto px-4 py-10" aria-busy="true" aria-live="polite">
      <div className="h-8 w-40 rounded-md bg-muted animate-pulse mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="h-40 w-full rounded-md bg-muted animate-pulse mb-4" />
            <div className="h-5 w-3/4 rounded bg-muted animate-pulse mb-2" />
            <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  )
}
