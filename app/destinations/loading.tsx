import { Skeleton } from "@/components/ui/skeleton"

export default function DestinationsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Skeleton className="h-6 w-24 mb-4" />
              
              {/* Search */}
              <div className="mb-6">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <Skeleton className="h-4 w-20 mb-2" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center mb-2">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>

              {/* Rating */}
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center mb-1">
                    <Skeleton className="h-4 w-20 mr-2" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and View Options */}
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Skeleton className="h-4 w-16 mr-2" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
