import { adminGetProduct } from '@/lib/products'
import { notFound } from 'next/navigation'
import EditProductClient from '@/components/admin/EditProductClient'

export const metadata = {
  title: '상품 수정 — Aura Pro Admin',
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await adminGetProduct(id)
  if (!product) notFound()

  return <EditProductClient product={product} />
}
