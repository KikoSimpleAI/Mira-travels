export default function LoadingCompare() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-40 bg-muted rounded" />
          <div className="h-40 bg-muted rounded" />
          <div className="h-40 bg-muted rounded" />
        </div>
        <div className="h-10 bg-muted rounded" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-24 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
        <div className="h-64 bg-muted rounded" />
      </div>
    </main>
  )
}
