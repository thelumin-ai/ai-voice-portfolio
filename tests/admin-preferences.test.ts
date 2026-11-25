import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ALL_DASHBOARD_WIDGET_IDS,
  DEFAULT_ADMIN_PREFERENCES,
  moveDashboardWidget,
  normalizeAdminPreferences,
  parseAdminPreferencesJson,
  reorderDashboardWidgets,
  toggleDashboardWidget,
} from '../src/lib/admin/preferences.ts'

test('normalizeAdminPreferences falls back to defaults for null or malformed input', () => {
  const fromNull = normalizeAdminPreferences(null)
  assert.deepEqual(fromNull, DEFAULT_ADMIN_PREFERENCES)

  const fromBadValues = normalizeAdminPreferences({
    mode: 'sepia',
    accent: 'neon',
    density: 'giant',
    sidebarCollapsed: 'yes',
    widgetOrder: ['recent-posts', 'unknown-widget', 'recent-posts'],
    hiddenWidgets: ['fake', 'quick-actions', 'quick-actions'],
  })

  assert.equal(fromBadValues.mode, 'dark')
  assert.equal(fromBadValues.accent, 'blue')
  assert.equal(fromBadValues.density, 'comfortable')
  assert.equal(fromBadValues.sidebarCollapsed, false)
  assert.equal(fromBadValues.widgetOrder[0], 'recent-posts')
  assert.equal(fromBadValues.widgetOrder.length, ALL_DASHBOARD_WIDGET_IDS.length)
  assert.deepEqual(fromBadValues.hiddenWidgets, ['quick-actions'])
})

test('parseAdminPreferencesJson safely parses valid and invalid JSON strings', () => {
  assert.deepEqual(parseAdminPreferencesJson('{invalid json'), DEFAULT_ADMIN_PREFERENCES)

  const parsed = parseAdminPreferencesJson(
    JSON.stringify({
      mode: 'light',
      accent: 'emerald',
      density: 'compact',
      sidebarCollapsed: true,
      widgetOrder: ['kpi-stats', 'recent-leads'],
      hiddenWidgets: ['content-modules'],
    })
  )

  assert.equal(parsed.mode, 'light')
  assert.equal(parsed.accent, 'emerald')
  assert.equal(parsed.density, 'compact')
  assert.equal(parsed.sidebarCollapsed, true)
  assert.equal(parsed.widgetOrder[0], 'kpi-stats')
  assert.equal(parsed.widgetOrder[1], 'recent-leads')
  assert.equal(parsed.widgetOrder.length, ALL_DASHBOARD_WIDGET_IDS.length)
  assert.deepEqual(parsed.hiddenWidgets, ['content-modules'])
})

test('moveDashboardWidget and reorderDashboardWidgets preserve bounds cleanly', () => {
  const initial = [...ALL_DASHBOARD_WIDGET_IDS]
  assert.deepEqual(moveDashboardWidget(initial, 'kpi-stats', 'up'), initial)

  const movedDown = moveDashboardWidget(initial, 'kpi-stats', 'down')
  assert.equal(movedDown[0], 'quick-actions')
  assert.equal(movedDown[1], 'kpi-stats')

  const reordered = reorderDashboardWidgets(initial, 0, 4)
  assert.equal(reordered[4], 'kpi-stats')
  assert.deepEqual(reorderDashboardWidgets(initial, -1, 2), initial)
})

test('toggleDashboardWidget adds and removes widget IDs cleanly', () => {
  const once = toggleDashboardWidget([], 'quick-actions')
  assert.deepEqual(once, ['quick-actions'])

  const twice = toggleDashboardWidget(once, 'quick-actions')
  assert.deepEqual(twice, [])
})
