'use client'

import { useRouter } from 'next/navigation'
import { ShoppingCart, Zap } from 'lucide-react'
import { toast } from '@/components/ToastProvider'

interface BuyButtonProps {
  slug: string
  isLoggedIn: boolean
  outOfStock: boolean
}

export default function BuyButton({ slug, isLoggedIn, outOfStock }: BuyButtonProps) {
  const router = useRouter()

  function handleBuy() {
    if (!isLoggedIn) {
      toast({
        type: 'error',
        message: '로그인이 필요합니다. 로그인 후 구매하세요.',
        action: { label: '로그인하기', href: '/auth' },
      })
      return
    }
    router.push(`/shop/${slug}/checkout`)
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        id="buy-now-button"
        onClick={handleBuy}
        disabled={outOfStock}
        className={`
          flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-semibold
          transition-all duration-200
          ${outOfStock
            ? 'bg-white/5 text-white/20 cursor-not-allowed'
            : 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'
          }
        `}
      >
        <Zap className="w-5 h-5" />
        {outOfStock ? '품절' : '지금 구매하기'}
      </button>
      {!outOfStock && (
        <button
          id="add-to-cart-button"
          onClick={handleBuy}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-semibold border border-white/10 text-white hover:bg-white/5 transition-all duration-200 active:scale-[0.98]"
        >
          <ShoppingCart className="w-5 h-5" />
          장바구니 담기
        </button>
      )}
    </div>
  )
}
