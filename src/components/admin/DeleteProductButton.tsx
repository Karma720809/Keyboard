'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface DeleteProductButtonProps {
  id: string
  name: string
}

export default function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        window.location.reload()
      }
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-white/40 text-xs">삭제?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium transition-colors"
        >
          {loading ? '...' : '확인'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 text-xs font-medium transition-colors"
        >
          취소
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white/30 transition-all text-xs font-medium"
    >
      <Trash2 className="w-3.5 h-3.5" />
      삭제
    </button>
  )
}
