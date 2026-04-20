export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 animate-pulse space-y-4">
          <div className="h-4 bg-white/5 rounded w-24" />
          <div className="h-10 bg-white/5 rounded w-64" />
          <div className="h-5 bg-white/5 rounded w-80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#111113] border border-white/5 rounded-3xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-white/5 rounded w-1/3" />
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-5 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
