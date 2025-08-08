export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex items-center gap-3" role="status" aria-live="polite" aria-busy="true">
        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  )
}
