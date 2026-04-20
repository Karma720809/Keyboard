'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductForm, { ProductFormValues } from '@/components/admin/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EditProductClientProps {
  product: {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    compare_at_price: number | null
    stock: number
    category: string | null
    tags: string[]
    is_published: boolean
    thumbnail_url: string | null
  }
}

export default function EditProductClient({ product }: EditProductClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialValues: Partial<ProductFormValues> = {
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: product.price.toString(),
    compare_at_price: product.compare_at_price?.toString() || '',
    stock: product.stock.toString(),
    category: product.category || '',
    tags: (product.tags || []).join(', '),
    is_published: product.is_published,
    thumbnail_url: product.thumbnail_url || '',
  }

  async function handleSubmit(values: ProductFormValues, thumbnailFile: File | null) {
    setIsLoading(true)
    setError(null)

    try {
      let thumbnailUrl = values.thumbnail_url

      if (thumbnailFile) {
        const uploadForm = new FormData()
        uploadForm.set('file', thumbnailFile)
        uploadForm.set('productId', product.id)

        const uploadRes = await fetch('/api/admin/products/upload', {
          method: 'POST',
          body: uploadForm,
        })

        if (!uploadRes.ok) {
          const err = await uploadRes.json()
          throw new Error(err.error || '이미지 업로드 실패')
        }
        const { url } = await uploadRes.json()
        thumbnailUrl = url
      }

      const tagArray = values.tags
        ? values.tags.split(',').map(t => t.trim()).filter(Boolean)
        : []

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          slug: values.slug,
          description: values.description || null,
          price: parseFloat(values.price),
          compare_at_price: values.compare_at_price ? parseFloat(values.compare_at_price) : null,
          stock: parseInt(values.stock),
          category: values.category || null,
          tags: tagArray,
          is_published: values.is_published,
          thumbnail_url: thumbnailUrl || null,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '상품 수정 실패')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        상품 목록으로
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">상품 수정</h1>
        <p className="text-white/50 text-[14px]">&apos;{product.name}&apos; 상품 정보를 수정합니다.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-5 py-3.5 text-sm">
          ⚠️ {error}
        </div>
      )}

      <ProductForm
        initialValues={initialValues}
        productId={product.id}
        onSubmit={handleSubmit}
        submitLabel="변경사항 저장"
        isLoading={isLoading}
      />
    </div>
  )
}
