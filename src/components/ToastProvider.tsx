'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
  action?: { label: string; href: string }
}

// ── 전역 이벤트 버스 ──────────────────────────
type ToastHandler = (toast: Omit<ToastMessage, 'id'>) => void
let globalHandler: ToastHandler | null = null

export function toast(options: Omit<ToastMessage, 'id'>) {
  if (globalHandler) {
    globalHandler(options)
  }
}

// ── 단일 Toast 아이템 ───────────────────────────
function ToastItem({
  item,
  onRemove,
}: {
  item: ToastMessage
  onRemove: (id: string) => void
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // mount 후 fade-in
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(item.id), 300)
    }, 3500)
    return () => clearTimeout(timer)
  }, [item.id, onRemove])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />,
  }

  const borders = {
    success: 'border-emerald-500/30',
    error: 'border-red-500/30',
    info: 'border-blue-500/30',
  }

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3.5 rounded-2xl
        bg-[#1d1d1f]/90 backdrop-blur-xl border ${borders[item.type]}
        shadow-2xl shadow-black/50 min-w-[280px] max-w-[360px]
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      {icons[item.type]}
      <div className="flex-1 min-w-0">
        <p className="text-white/90 text-sm font-medium leading-snug">{item.message}</p>
        {item.action && (
          <a
            href={item.action.href}
            className="mt-1.5 inline-block text-xs text-[#2997ff] hover:underline font-semibold"
          >
            {item.action.label} →
          </a>
        )}
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(item.id), 300) }}
        className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Provider ────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addToast = useCallback((options: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...options, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    globalHandler = addToast
    return () => { globalHandler = null }
  }, [addToast])

  return (
    <>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 items-end">
            {toasts.map((t) => (
              <ToastItem key={t.id} item={t} onRemove={removeToast} />
            ))}
          </div>,
          document.body
        )}
    </>
  )
}
