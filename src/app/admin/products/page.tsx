import { adminGetAllProducts } from '@/lib/products'
import Link from 'next/link'
import { Plus, ShoppingBag, Pencil } from 'lucide-react'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

function formatPrice(price: number) {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)
}

export const metadata = {
  title: '상품 관리 — Aura Pro Admin',
}

export default async function AdminProductsPage() {
  const products = await adminGetAllProducts()

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">상품 관리</h1>
          <p className="text-white/50 text-[14px]">상품 등록, 수정, 삭제를 관리합니다.</p>
        </div>
        <Link
          href="/admin/products/new"
          id="new-product-button"
          className="flex items-center gap-2 bg-[#7b61ff] hover:bg-[#6b51ef] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          새 상품 등록
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-[#2a2932] border border-white/5 rounded-[24px] p-20 flex flex-col items-center justify-center text-center">
          <ShoppingBag className="w-14 h-14 text-white/10 mb-5" />
          <h3 className="text-white/40 text-xl font-medium mb-2">등록된 상품이 없습니다</h3>
          <p className="text-white/20 text-sm mb-8">새 상품을 등록하여 Shop을 시작해보세요.</p>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-[#7b61ff] hover:bg-[#6b51ef] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            첫 상품 등록하기
          </Link>
        </div>
      ) : (
        <div className="bg-[#2a2932] border border-white/5 rounded-[24px] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-black/10">
                <th className="px-6 py-4 text-left text-white/30 text-xs uppercase tracking-wider font-semibold">상품</th>
                <th className="px-6 py-4 text-left text-white/30 text-xs uppercase tracking-wider font-semibold">카테고리</th>
                <th className="px-6 py-4 text-left text-white/30 text-xs uppercase tracking-wider font-semibold">가격</th>
                <th className="px-6 py-4 text-left text-white/30 text-xs uppercase tracking-wider font-semibold">재고</th>
                <th className="px-6 py-4 text-left text-white/30 text-xs uppercase tracking-wider font-semibold">상태</th>
                <th className="px-6 py-4 text-right text-white/30 text-xs uppercase tracking-wider font-semibold">액션</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr
                  key={product.id}
                  className={`border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                >
                  {/* Product Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                        {product.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.thumbnail_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-white/15" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium line-clamp-1">{product.name}</p>
                        <p className="text-white/30 text-xs font-mono mt-0.5">{product.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-white/50">
                    {product.category || <span className="text-white/20">—</span>}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-semibold">{formatPrice(product.price)}</p>
                      {product.compare_at_price && (
                        <p className="text-white/25 text-xs line-through">{formatPrice(product.compare_at_price)}</p>
                      )}
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    <span className={`font-medium ${product.stock === 0 ? 'text-red-400' : product.stock <= 10 ? 'text-amber-400' : 'text-white/60'}`}>
                      {product.stock}개
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${product.is_published ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                      {product.is_published ? '출시' : '미출시'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#7b61ff]/20 hover:text-[#7b61ff] text-white/50 transition-all text-xs font-medium"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        수정
                      </Link>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 py-4 border-t border-white/5 bg-black/10">
            <p className="text-white/20 text-xs">총 {products.length}개 상품</p>
          </div>
        </div>
      )}
    </div>
  )
}
