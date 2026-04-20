import { getProductBySlug } from '@/lib/products'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, Package, ShieldCheck, Truck } from 'lucide-react'
import Link from 'next/link'
import BuyButton from '@/components/shop/BuyButton'

function formatPrice(price: number) {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: '상품을 찾을 수 없습니다 — Aura Pro' }
  return {
    title: `${product.name} — Aura Pro Shop`,
    description: product.description || '',
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, supabase] = await Promise.all([
    getProductBySlug(slug),
    createClient(),
  ])

  if (!product) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : null

  const allImages = [
    ...(product.thumbnail_url ? [product.thumbnail_url] : []),
    ...(product.images || []),
  ]

  return (
    <main className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium mb-10 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Shop으로 돌아가기
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-3xl overflow-hidden bg-[#111113] border border-white/5">
              {allImages.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={allImages[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-20 h-20 text-white/10" />
                </div>
              )}
            </div>
            {/* Thumbnails row */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-20 h-20 rounded-xl object-cover border border-white/10 flex-shrink-0 cursor-pointer hover:border-white/40 transition-colors"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            {product.category && (
              <span className="text-[#2997ff] text-xs font-semibold uppercase tracking-widest mb-3">
                {product.category}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-white/30 text-xl line-through mb-0.5">
                    {formatPrice(product.compare_at_price!)}
                  </span>
                  <span className="bg-red-500/20 text-red-400 text-sm font-bold px-2.5 py-0.5 rounded-lg mb-0.5">
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock badge */}
            <div className="mb-6">
              {product.stock > 10 ? (
                <span className="text-emerald-400 text-sm font-medium">✓ 재고 있음</span>
              ) : product.stock > 0 ? (
                <span className="text-amber-400 text-sm font-medium">⚡ 재고 {product.stock}개 남음</span>
              ) : (
                <span className="text-red-400 text-sm font-medium">✗ 품절</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-white/50 text-base leading-relaxed mb-8 border-t border-white/5 pt-6">
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-white/40 bg-white/5 border border-white/5 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Buy Button */}
            <div className="mt-auto">
              <BuyButton
                slug={slug}
                isLoggedIn={isLoggedIn}
                outOfStock={product.stock === 0}
              />
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/5">
              {[
                { icon: Truck, label: '무료 배송', sub: '3만원 이상 주문' },
                { icon: ShieldCheck, label: '정품 보증', sub: '1년 품질 보증' },
                { icon: Package, label: '안전 포장', sub: '파손 방지 포장' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1.5">
                  <Icon className="w-5 h-5 text-white/30" />
                  <span className="text-white/60 text-[11px] font-semibold">{label}</span>
                  <span className="text-white/25 text-[10px]">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
