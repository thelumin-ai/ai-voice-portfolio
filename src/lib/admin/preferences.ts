export type AdminMode = 'dark' | 'light'

export type AdminAccent = 'blue' | 'violet' | 'emerald' | 'rose' | 'amber' | 'cyan'

export type AdminDensity = 'comfortable' | 'compact'

export type DashboardWidgetId =
  | 'kpi-stats'
  | 'quick-actions'
  | 'content-modules'
  | 'recent-leads'
  | 'recent-posts'

export const ALL_DASHBOARD_WIDGET_IDS: readonly DashboardWidgetId[] = [
  'kpi-stats',
  'quick-actions',
  'content-modules',
  'recent-leads',
  'recent-posts',
] as const

export const DASHBOARD_WIDGET_META: Record<
  DashboardWidgetId,
  { label: string; description: string }
> = {
  'kpi-stats': {
    label: 'Key Metrics',
    description: 'Portfolio, total leads, 7-day lead velocity, and published post totals.',
  },
  'quick-actions': {
    label: 'Quick Actions',
    description: 'One-click shortcuts to create content or jump to branding.',
  },
  'content-modules': {
    label: 'Content Modules',
    description: 'Live item counts across Use Cases, Services, Testimonials, Stack, Process, Playground, and SEO.',
  },
  'recent-leads': {
    label: 'Recent Leads',
    description: 'Latest inbound contact form submissions.',
  },
  'recent-posts': {
    label: 'Recent Blog Posts',
    description: 'Latest drafts and published articles.',
  },
}

export const ADMIN_ACCENT_OPTIONS: ReadonlyArray<{
  id: AdminAccent
  label: string
  swatch: string
}> = [
  { id: 'blue', label: 'Cobalt Blue', swatch: '#3b82f6' },
  { id: 'violet', label: 'Royal Violet', swatch: '#8b5cf6' },
  { id: 'emerald', label: 'Emerald', swatch: '#10b981' },
  { id: 'rose', label: 'Rose', swatch: '#f43f5e' },
  { id: 'amber', label: 'Amber Gold', swatch: '#f59e0b' },
  { id: 'cyan', label: 'Electric Cyan', swatch: '#06b6d4' },
]

export const ADMIN_PREFERENCES_STORAGE_KEY = 'admin_ui_preferences_v1'

export interface AdminPreferences {
  mode: AdminMode
  accent: AdminAccent
  density: AdminDensity
  sidebarCollapsed: boolean
  widgetOrder: DashboardWidgetId[]
  hiddenWidgets: DashboardWidgetId[]
}

export const DEFAULT_ADMIN_PREFERENCES: AdminPreferences = {
  mode: 'dark',
  accent: 'blue',
  density: 'comfortable',
  sidebarCollapsed: false,
  widgetOrder: [...ALL_DASHBOARD_WIDGET_IDS],
  hiddenWidgets: [],
}

const VALID_MODES = new Set<AdminMode>(['dark', 'light'])
const VALID_ACCENTS = new Set<AdminAccent>(['blue', 'violet', 'emerald', 'rose', 'amber', 'cyan'])
const VALID_DENSITIES = new Set<AdminDensity>(['comfortable', 'compact'])
const VALID_WIDGETS = new Set<DashboardWidgetId>(ALL_DASHBOARD_WIDGET_IDS)

function isWidgetId(value: unknown): value is DashboardWidgetId {
  return typeof value === 'string' && VALID_WIDGETS.has(value as DashboardWidgetId)
}

export function normalizeAdminPreferences(raw: unknown): AdminPreferences {
  if (!raw || typeof raw !== 'object') {
    return {
      ...DEFAULT_ADMIN_PREFERENCES,
      widgetOrder: [...ALL_DASHBOARD_WIDGET_IDS],
      hiddenWidgets: [],
    }
  }

  const record = raw as Record<string, unknown>

  const mode: AdminMode =
    typeof record.mode === 'string' && VALID_MODES.has(record.mode as AdminMode)
      ? (record.mode as AdminMode)
      : DEFAULT_ADMIN_PREFERENCES.mode

  const accent: AdminAccent =
    typeof record.accent === 'string' && VALID_ACCENTS.has(record.accent as AdminAccent)
      ? (record.accent as AdminAccent)
      : DEFAULT_ADMIN_PREFERENCES.accent

  const density: AdminDensity =
    typeof record.density === 'string' && VALID_DENSITIES.has(record.density as AdminDensity)
      ? (record.density as AdminDensity)
      : DEFAULT_ADMIN_PREFERENCES.density

  const sidebarCollapsed =
    typeof record.sidebarCollapsed === 'boolean'
      ? record.sidebarCollapsed
      : DEFAULT_ADMIN_PREFERENCES.sidebarCollapsed

  const seenOrder = new Set<DashboardWidgetId>()
  const widgetOrder: DashboardWidgetId[] = []
  if (Array.isArray(record.widgetOrder)) {
    for (const entry of record.widgetOrder) {
      if (isWidgetId(entry) && !seenOrder.has(entry)) {
        seenOrder.add(entry)
        widgetOrder.push(entry)
      }
    }
  }
  for (const id of ALL_DASHBOARD_WIDGET_IDS) {
    if (!seenOrder.has(id)) {
      seenOrder.add(id)
      widgetOrder.push(id)
    }
  }

  const seenHidden = new Set<DashboardWidgetId>()
  const hiddenWidgets: DashboardWidgetId[] = []
  if (Array.isArray(record.hiddenWidgets)) {
    for (const entry of record.hiddenWidgets) {
      if (isWidgetId(entry) && !seenHidden.has(entry)) {
        seenHidden.add(entry)
        hiddenWidgets.push(entry)
      }
    }
  }

  return {
    mode,
    accent,
    density,
    sidebarCollapsed,
    widgetOrder,
    hiddenWidgets,
  }
}

export function parseAdminPreferencesJson(raw: string | null | undefined): AdminPreferences {
  if (!raw || typeof raw !== 'string') {
    return normalizeAdminPreferences(null)
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    return normalizeAdminPreferences(parsed)
  } catch {
    return normalizeAdminPreferences(null)
  }
}

export function moveDashboardWidget(
  order: DashboardWidgetId[],
  id: DashboardWidgetId,
  direction: 'up' | 'down'
): DashboardWidgetId[] {
  const index = order.indexOf(id)
  if (index === -1) return order
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= order.length) return order
  return reorderDashboardWidgets(order, index, targetIndex)
}

export function reorderDashboardWidgets(
  order: DashboardWidgetId[],
  fromIndex: number,
  toIndex: number
): DashboardWidgetId[] {
  if (
    fromIndex < 0 ||
    fromIndex >= order.length ||
    toIndex < 0 ||
    toIndex >= order.length ||
    fromIndex === toIndex
  ) {
    return order
  }
  const next = [...order]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export function toggleDashboardWidget(
  hidden: DashboardWidgetId[],
  id: DashboardWidgetId
): DashboardWidgetId[] {
  if (hidden.includes(id)) {
    return hidden.filter((item) => item !== id)
  }
  return [...hidden, id]
}
