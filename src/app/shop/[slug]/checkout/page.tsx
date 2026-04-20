import { getProductBySlug } from '@/lib/products'
import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import CheckoutClient from '@/components/shop/CheckoutClient'

export const metadata = {
  title: '결제 — Aura Pro',
}

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // 로그인 확인 — 미로그인 시 auth로 리다이렉트
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/auth?next=/shop/${slug}/checkout`)
  }

  const product = await getProductBySlug(slug)
  if (!product) notFound()

  return (
    <CheckoutClient
      product={{
        name: product.name,
        price: product.price,
        thumbnail_url: product.thumbnail_url,
        slug: product.slug,
      }}
    />
  )
}
