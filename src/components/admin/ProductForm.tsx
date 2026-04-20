'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Plus, Loader2 } from 'lucide-react'
import { generateSlug } from '@/lib/slugify'

export interface ProductFormValues {
  name: string
  slug: string
  description: string
  price: string
  compare_at_price: string
  stock: string
  category: string
  tags: string
  is_published: boolean
  thumbnail_url: string
  images: string[]
}

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>
  productId?: string  // for edit mode — used in image paths
  onSubmit: (values: ProductFormValues, thumbnailFile: File | null) => Promise<void>
  submitLabel?: string
  isLoading?: boolean
}

const CATEGORIES = ['키보드', '스위치', '키캡', '케이블', '액세서리', '기타']

const DEFAULT_VALUES: ProductFormValues = {
  name: '',
  slug: '',
  description: '',
  price: '',
  compare_at_price: '',
  stock: '0',
  category: '',
  tags: '',
  is_published: true,
  thumbnail_url: '',
  images: [],
}

export default function ProductForm({
  initialValues = {},
  onSubmit,
  submitLabel = '저장하기',
  isLoading = false,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({ ...DEFAULT_VALUES, ...initialValues })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(initialValues.thumbnail_url || '')
  const [dragOver, setDragOver] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (name === 'name' && !initialValues.slug) {
      setValues((prev) => ({ ...prev, name: value, slug: generateSlug(value) }))
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }
  }

  function handleThumbnailFile(file: File) {
    setThumbnailFile(file)
    const url = URL.createObjectURL(file)
    setThumbnailPreview(url)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleThumbnailFile(file)
    }
  }

  function removeThumbnail() {
    setThumbnailFile(null)
    setThumbnailPreview('')
    setValues((prev) => ({ ...prev, thumbnail_url: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function addTag() {
    const trimmed = tagInput.trim()
    if (!trimmed) return
    const current = values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    if (!current.includes(trimmed)) {
      setValues((prev) => ({
        ...prev,
        tags: [...current, trimmed].join(', ')
      }))
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    const current = values.tags.split(',').map(t => t.trim()).filter(Boolean)
    setValues((prev) => ({
      ...prev,
      tags: current.filter(t => t !== tag).join(', ')
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(values, thumbnailFile)
  }

  const tagList = values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">

      {/* 기본 정보 */}
      <section className="bg-[#2a2932] border border-white/5 rounded-[24px] p-8">
        <h2 className="text-white font-semibold text-base mb-6">기본 정보</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">상품명 *</label>
            <input
              name="name"
              required
              value={values.name}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7b61ff]/60 transition-colors"
              placeholder="Aura Pro Wireless"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">슬러그 (URL) *</label>
            <input
              name="slug"
              required
              value={values.slug}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7b61ff]/60 transition-colors font-mono"
              placeholder="aura-pro-wireless"
            />
            <p className="text-white/20 text-xs mt-1.5">영문, 숫자, 하이픈만 사용. 상품명 입력 시 자동 생성.</p>
          </div>
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">상품 설명</label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7b61ff]/60 transition-colors resize-none"
              placeholder="상품에 대한 상세 설명을 입력하세요..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">카테고리</label>
              <select
                name="category"
                value={values.category}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#7b61ff]/60 transition-colors"
              >
                <option value="">선택 안함</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5">출시 여부</label>
              <label className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer">
                <input
                  name="is_published"
                  type="checkbox"
                  checked={values.is_published}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-[#7b61ff]"
                />
                <span className="text-sm text-white/70">
                  {values.is_published ? '출시됨 (공개)' : '미출시 (비공개)'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 가격 & 재고 */}
      <section className="bg-[#2a2932] border border-white/5 rounded-[24px] p-8">
        <h2 className="text-white font-semibold text-base mb-6">가격 & 재고</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">판매가 (원) *</label>
            <input
              name="price"
              type="number"
              required
              min="0"
              step="100"
              value={values.price}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7b61ff]/60 transition-colors"
              placeholder="299000"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">정가 (할인 전, 선택)</label>
            <input
              name="compare_at_price"
              type="number"
              min="0"
              step="100"
              value={values.compare_at_price}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7b61ff]/60 transition-colors"
              placeholder="350000"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5">재고 수량</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={values.stock}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7b61ff]/60 transition-colors"
              placeholder="100"
            />
          </div>
        </div>
      </section>

      {/* 썸네일 */}
      <section className="bg-[#2a2932] border border-white/5 rounded-[24px] p-8">
        <h2 className="text-white font-semibold text-base mb-6">썸네일 이미지</h2>

        {thumbnailPreview ? (
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnailPreview} alt="thumbnail" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={removeThumbnail}
              className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all
              ${dragOver ? 'border-[#7b61ff] bg-[#7b61ff]/5' : 'border-white/10 hover:border-white/30 hover:bg-white/2'}
            `}
          >
            <Upload className="w-8 h-8 text-white/30 mb-3" />
            <p className="text-white/50 text-sm font-medium">클릭하거나 이미지를 드래그하세요</p>
            <p className="text-white/20 text-xs mt-1">PNG, JPG, WebP, GIF — 최대 10MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleThumbnailFile(file)
          }}
        />

        {/* URL 직접 입력 */}
        <div className="mt-4">
          <label className="block text-white/30 text-xs font-medium mb-1.5">또는 이미지 URL 직접 입력</label>
          <input
            name="thumbnail_url"
            value={thumbnailFile ? '' : values.thumbnail_url}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, thumbnail_url: e.target.value }))
              setThumbnailPreview(e.target.value)
              setThumbnailFile(null)
            }}
            disabled={!!thumbnailFile}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7b61ff]/60 transition-colors disabled:opacity-30"
            placeholder="https://..."
          />
        </div>
      </section>

      {/* 태그 */}
      <section className="bg-[#2a2932] border border-white/5 rounded-[24px] p-8">
        <h2 className="text-white font-semibold text-base mb-6">태그</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7b61ff]/60 transition-colors"
            placeholder="태그 입력 후 Enter"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2.5 bg-[#7b61ff]/20 hover:bg-[#7b61ff]/30 text-[#7b61ff] rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tagList.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
              >
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-white/30 hover:text-white/70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 제출 버튼 */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          id="product-form-submit-button"
          className="flex items-center gap-2 bg-[#7b61ff] hover:bg-[#6b51ef] text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors disabled:opacity-60"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitLabel}
        </button>
        <a
          href="/admin/products"
          className="px-8 py-3.5 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-semibold transition-all text-sm flex items-center"
        >
          취소
        </a>
      </div>
    </form>
  )
}
