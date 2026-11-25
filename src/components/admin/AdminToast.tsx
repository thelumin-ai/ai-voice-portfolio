'use client'

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

type ToastTone = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  tone: ToastTone
  message: string
}

interface AdminToastContextValue {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const AdminToastContext = createContext<AdminToastContextValue | null>(null)

const toneClasses: Record<ToastTone, string> = {
  success: 'bg-adm-success-bg border-adm-success-border text-adm-success-text',
  error: 'bg-adm-danger-bg border-adm-danger-border text-adm-danger-text',
  info: 'bg-adm-info-bg border-adm-info-border text-adm-info-text',
}

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const push = useCallback(
    (tone: ToastTone, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => [...prev.slice(-3), { id, tone, message }])
      const timer = setTimeout(() => {
        timersRef.current.delete(id)
        setToasts((prev) => prev.filter((item) => item.id !== id))
      }, 4200)
      timersRef.current.set(id, timer)
    },
    []
  )

  const api = useMemo<AdminToastContextValue>(
    () => ({
      success: (message: string) => push('success', message),
      error: (message: string) => push('error', message),
      info: (message: string) => push('info', message),
    }),
    [push]
  )

  return (
    <AdminToastContext.Provider value={api}>
      {children}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          aria-label="Notifications"
          className="fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0 pointer-events-none"
        >
          {toasts.map((toast) => {
            const Icon =
              toast.tone === 'success'
                ? CheckCircle2
                : toast.tone === 'error'
                ? AlertCircle
                : Info
            return (
              <div
                key={toast.id}
                role="status"
                className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${toneClasses[toast.tone]}`}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="flex-1 font-medium leading-snug">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 rounded-md p-0.5 opacity-75 transition-opacity hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </AdminToastContext.Provider>
  )
}

export function useAdminToast(): AdminToastContextValue {
  const ctx = useContext(AdminToastContext)
  if (!ctx) {
    throw new Error('useAdminToast must be used within AdminToastProvider')
  }
  return ctx
}
