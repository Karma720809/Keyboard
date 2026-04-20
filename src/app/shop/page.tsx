import { getProducts } from '@/lib/products'
import Link from 'next/link'
import { ShoppingBag, Tag } from 'lucide-react'
import { Suspense } from 'react'

function formatPrice(price: number) {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)
}

function ProductCard({ product }: { product: Awaited<ReturnType<typeof getProducts>>[0] }) {
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : null

  return (
    <Link
      href={`/shop/${product.slug}`}
      id={`product-card-${product.slug}`}
      className="group block bg-[#111113] border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 hover:bg-[#18181b] transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-[#1a1a1e]">
        {product.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-white/10" />
          </div>
        )}
        {discountPct && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{discountPct}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white/60 text-sm font-medium">품절</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        {product.category && (
          <span className="text-[11px] uppercase tracking-widest text-[#2997ff] font-semibold mb-2 block">
            {product.category}
          </span>
        )}
        <h3 className="text-white font-semibold text-base leading-snug mb-3 group-hover:text-white/90 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-end gap-2">
          <span className="text-white text-lg font-bold">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-white/30 text-sm line-through mb-0.5">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>
        {product.tags && product.tags.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

function ProductGridSkeleton() {
  return (
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
  )
}

async function ProductGrid() {
  const products = await getProducts()

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShoppingBag className="w-16 h-16 text-white/10 mb-6" />
        <h3 className="text-white/40 text-xl font-medium mb-2">아직 출시된 상품이 없습니다</h3>
        <p className="text-white/20 text-sm">곧 새로운 상품이 등록될 예정입니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export const metadata = {
  title: 'Shop — Aura Pro',
  description: '프리미엄 키보드와 액세서리를 지금 만나보세요.',
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-[#2997ff]" />
            <span className="text-[#2997ff] text-sm font-semibold uppercase tracking-widest">Store</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Aura Pro Shop
          </h1>
          <p className="text-white/40 text-lg max-w-xl">
            타이핑을 예술로 만드는 프리미엄 키보드와 액세서리.
          </p>
        </div>

        {/* Grid */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </div>
    </main>
  )
}
