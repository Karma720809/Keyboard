'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductForm, { ProductFormValues } from '@/components/admin/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(values: ProductFormValues, thumbnailFile: File | null) {
    setIsLoading(true)
    setError(null)

    try {
      let thumbnailUrl = values.thumbnail_url

      // 1. 이미지 파일이 있으면 먼저 업로드
      if (thumbnailFile) {
        const uploadForm = new FormData()
        uploadForm.set('file', thumbnailFile)
        uploadForm.set('productId', 'new-' + Date.now())

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

      // 2. 상품 생성
      const tagArray = values.tags
        ? values.tags.split(',').map(t => t.trim()).filter(Boolean)
        : []

      const res = await fetch('/api/admin/products', {
        method: 'POST',
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
          images: [],
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '상품 등록 실패')
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
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">새 상품 등록</h1>
        <p className="text-white/50 text-[14px]">새로운 상품 정보를 입력하고 등록하세요.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-5 py-3.5 text-sm">
          ⚠️ {error}
        </div>
      )}

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="상품 등록하기"
        isLoading={isLoading}
      />
    </div>
  )
}
