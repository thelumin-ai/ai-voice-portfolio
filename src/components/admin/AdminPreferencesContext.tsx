'use client'

import React, { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react'
import {
  ADMIN_PREFERENCES_STORAGE_KEY,
  AdminAccent,
  AdminDensity,
  AdminMode,
  AdminPreferences,
  ALL_DASHBOARD_WIDGET_IDS,
  DEFAULT_ADMIN_PREFERENCES,
  DashboardWidgetId,
  moveDashboardWidget,
  normalizeAdminPreferences,
  parseAdminPreferencesJson,
  reorderDashboardWidgets,
  toggleDashboardWidget,
} from '@/lib/admin/preferences'

const PREFERENCES_EVENT = 'admin-preferences-changed'

let cachedRaw: string | null | undefined = undefined
let cachedSnapshot: AdminPreferences = DEFAULT_ADMIN_PREFERENCES

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === ADMIN_PREFERENCES_STORAGE_KEY) {
      cachedRaw = undefined
      callback()
    }
  }

  const handleCustom = () => {
    callback()
  }

  window.addEventListener('storage', handleStorage)
  window.addEventListener(PREFERENCES_EVENT, handleCustom)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(PREFERENCES_EVENT, handleCustom)
  }
}

function getSnapshot(): AdminPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_ADMIN_PREFERENCES
  }

  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(ADMIN_PREFERENCES_STORAGE_KEY)
  } catch {
    return cachedSnapshot
  }

  if (raw === cachedRaw) {
    return cachedSnapshot
  }

  cachedRaw = raw
  cachedSnapshot = parseAdminPreferencesJson(raw)
  return cachedSnapshot
}

function getServerSnapshot(): AdminPreferences {
  return DEFAULT_ADMIN_PREFERENCES
}

function persistPreferences(next: AdminPreferences) {
  const normalized = normalizeAdminPreferences(next)
  const raw = JSON.stringify(normalized)
  cachedRaw = raw
  cachedSnapshot = normalized
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(ADMIN_PREFERENCES_STORAGE_KEY, raw)
    } catch {
      // Ignore storage quota / privacy mode errors cleanly
    }
    window.dispatchEvent(new Event(PREFERENCES_EVENT))
  }
}

export function useAdminPreferencesSnapshot(): AdminPreferences {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

interface AdminPreferencesContextValue {
  preferences: AdminPreferences
  setMode: (mode: AdminMode) => void
  toggleMode: () => void
  setAccent: (accent: AdminAccent) => void
  setDensity: (density: AdminDensity) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapsed: () => void
  moveWidget: (id: DashboardWidgetId, direction: 'up' | 'down') => void
  reorderWidgets: (fromIndex: number, toIndex: number) => void
  toggleWidgetVisibility: (id: DashboardWidgetId) => void
  resetDashboardWidgets: () => void
  resetAppearance: () => void
}

const AdminPreferencesContext = createContext<AdminPreferencesContextValue | null>(null)

export function AdminPreferencesProvider({ children }: { children: React.ReactNode }) {
  const preferences = useAdminPreferencesSnapshot()

  const setMode = useCallback((mode: AdminMode) => {
    persistPreferences({ ...getSnapshot(), mode })
  }, [])

  const toggleMode = useCallback(() => {
    const current = getSnapshot()
    persistPreferences({
      ...current,
      mode: current.mode === 'dark' ? 'light' : 'dark',
    })
  }, [])

  const setAccent = useCallback((accent: AdminAccent) => {
    persistPreferences({ ...getSnapshot(), accent })
  }, [])

  const setDensity = useCallback((density: AdminDensity) => {
    persistPreferences({ ...getSnapshot(), density })
  }, [])

  const setSidebarCollapsed = useCallback((sidebarCollapsed: boolean) => {
    persistPreferences({ ...getSnapshot(), sidebarCollapsed })
  }, [])

  const toggleSidebarCollapsed = useCallback(() => {
    const current = getSnapshot()
    persistPreferences({
      ...current,
      sidebarCollapsed: !current.sidebarCollapsed,
    })
  }, [])

  const moveWidget = useCallback((id: DashboardWidgetId, direction: 'up' | 'down') => {
    const current = getSnapshot()
    persistPreferences({
      ...current,
      widgetOrder: moveDashboardWidget(current.widgetOrder, id, direction),
    })
  }, [])

  const reorderWidgets = useCallback((fromIndex: number, toIndex: number) => {
    const current = getSnapshot()
    persistPreferences({
      ...current,
      widgetOrder: reorderDashboardWidgets(current.widgetOrder, fromIndex, toIndex),
    })
  }, [])

  const toggleWidgetVisibility = useCallback((id: DashboardWidgetId) => {
    const current = getSnapshot()
    persistPreferences({
      ...current,
      hiddenWidgets: toggleDashboardWidget(current.hiddenWidgets, id),
    })
  }, [])

  const resetDashboardWidgets = useCallback(() => {
    const current = getSnapshot()
    persistPreferences({
      ...current,
      widgetOrder: [...ALL_DASHBOARD_WIDGET_IDS],
      hiddenWidgets: [],
    })
  }, [])

  const resetAppearance = useCallback(() => {
    const current = getSnapshot()
    persistPreferences({
      ...DEFAULT_ADMIN_PREFERENCES,
      sidebarCollapsed: current.sidebarCollapsed,
      widgetOrder: current.widgetOrder,
      hiddenWidgets: current.hiddenWidgets,
    })
  }, [])

  const value = useMemo<AdminPreferencesContextValue>(
    () => ({
      preferences,
      setMode,
      toggleMode,
      setAccent,
      setDensity,
      setSidebarCollapsed,
      toggleSidebarCollapsed,
      moveWidget,
      reorderWidgets,
      toggleWidgetVisibility,
      resetDashboardWidgets,
      resetAppearance,
    }),
    [
      preferences,
      setMode,
      toggleMode,
      setAccent,
      setDensity,
      setSidebarCollapsed,
      toggleSidebarCollapsed,
      moveWidget,
      reorderWidgets,
      toggleWidgetVisibility,
      resetDashboardWidgets,
      resetAppearance,
    ]
  )

  return (
    <AdminPreferencesContext.Provider value={value}>
      {children}
    </AdminPreferencesContext.Provider>
  )
}

export function useAdminPreferences(): AdminPreferencesContextValue {
  const ctx = useContext(AdminPreferencesContext)
  if (!ctx) {
    throw new Error('useAdminPreferences must be used within AdminPreferencesProvider')
  }
  return ctx
}
