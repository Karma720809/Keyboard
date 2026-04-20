'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, Building2, ChevronRight, ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface CheckoutClientProps {
  product: {
    name: string
    price: number
    thumbnail_url: string | null
    slug: string
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price)
}

const PAYMENT_METHODS = [
  { id: 'card', label: '신용/체크카드', icon: CreditCard },
  { id: 'kakao', label: '카카오페이', icon: Smartphone },
  { id: 'naver', label: '네이버페이', icon: Building2 },
]

export default function CheckoutClient({ product }: CheckoutClientProps) {
  const [qty, setQty] = useState(1)
  const [payMethod, setPayMethod] = useState('card')
  const [form, setForm] = useState({ name: '', phone: '', address: '', detail: '', memo: '' })
  const [step, setStep] = useState<'form' | 'done'>('form')
  const [loading, setLoading] = useState(false)

  const total = product.price * qty
  const shippingFee = total >= 30000 ? 0 : 3000

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // 실제 PG 연동 자리 — 현재는 더미 처리
    await new Promise((res) => setTimeout(res, 1500))
    setLoading(false)
    setStep('done')
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">주문이 완료되었습니다!</h1>
          <p className="text-white/40 text-base mb-8">
            주문해 주셔서 감사합니다.<br />
            입력하신 연락처로 주문 확인 문자가 발송됩니다.
          </p>
          <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">상품명</span>
              <span className="text-white font-medium">{product.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">수량</span>
              <span className="text-white font-medium">{qty}개</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">결제 금액</span>
              <span className="text-white font-bold">{formatPrice(total + shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">결제 수단</span>
              <span className="text-white font-medium">{PAYMENT_METHODS.find(m => m.id === payMethod)?.label}</span>
            </div>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/90 transition-colors"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black pt-20 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          href={`/shop/${product.slug}`}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          상품으로 돌아가기
        </Link>

        <h1 className="text-3xl font-bold text-white mb-10 tracking-tight">주문 / 결제</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">

            {/* Shipping */}
            <section className="bg-[#111113] border border-white/5 rounded-3xl p-6">
              <h2 className="text-white font-semibold text-base mb-5">배송 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5" htmlFor="name">받는 분 이름 *</label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#2997ff]/60 transition-colors"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5" htmlFor="phone">연락처 *</label>
                  <input
                    id="phone"
                    name="phone"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#2997ff]/60 transition-colors"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5" htmlFor="address">주소 *</label>
                  <input
                    id="address"
                    name="address"
                    required
                    value={form.address}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#2997ff]/60 transition-colors"
                    placeholder="서울특별시 강남구 ..."
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5" htmlFor="detail">상세 주소</label>
                  <input
                    id="detail"
                    name="detail"
                    value={form.detail}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#2997ff]/60 transition-colors"
                    placeholder="동/호수, 건물명 등"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5" htmlFor="memo">배송 요청 사항</label>
                  <input
                    id="memo"
                    name="memo"
                    value={form.memo}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#2997ff]/60 transition-colors"
                    placeholder="문 앞에 놓아주세요"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-[#111113] border border-white/5 rounded-3xl p-6">
              <h2 className="text-white font-semibold text-base mb-5">결제 수단</h2>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPayMethod(id)}
                    className={`
                      flex flex-col items-center gap-2 py-4 rounded-2xl border text-sm font-medium transition-all
                      ${payMethod === id
                        ? 'border-[#2997ff]/60 bg-[#2997ff]/10 text-white'
                        : 'border-white/5 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/70'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#111113] border border-white/5 rounded-3xl p-6 sticky top-24">
              <h2 className="text-white font-semibold text-base mb-5">주문 요약</h2>

              {/* Product */}
              <div className="flex gap-4 mb-5 pb-5 border-b border-white/5">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                  {product.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.thumbnail_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium line-clamp-2">{product.name}</p>
                  <p className="text-white/40 text-xs mt-1">{formatPrice(product.price)}</p>
                </div>
              </div>

              {/* Qty */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-white/50 text-sm">수량</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-lg transition-colors"
                  >
                    −
                  </button>
                  <span className="text-white font-medium w-6 text-center">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 mb-5 pb-5 border-b border-white/5 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">상품 금액</span>
                  <span className="text-white/70">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">배송비</span>
                  <span className={shippingFee === 0 ? 'text-emerald-400' : 'text-white/70'}>
                    {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between mb-8">
                <span className="text-white font-semibold">최종 결제 금액</span>
                <span className="text-white font-bold text-lg">{formatPrice(total + shippingFee)}</span>
              </div>

              <button
                id="submit-payment-button"
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-white/90 transition-colors active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full" />
                ) : (
                  <>
                    결제하기 <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-white/20 text-xs text-center mt-4">
                🔒 SSL 암호화 보안 결제
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
