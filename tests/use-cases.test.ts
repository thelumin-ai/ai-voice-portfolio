import test from 'node:test'
import assert from 'node:assert/strict'
import {
  RICH_USE_CASES,
  resolveRichUseCase,
  mergePublishedUseCases,
} from '../src/lib/useCasesData.ts'

test('all 12 built-in RICH_USE_CASES contain complete domain-specific content', () => {
  const expectedSlugs = [
    'real-estate',
    'solar',
    'home-services',
    'consulting',
    'finance',
    'customer-support',
    'sales',
    'ivr',
    'scheduling',
    'crm-integration',
    'multi-language',
    'custom-dashboards',
  ]

  assert.equal(RICH_USE_CASES.length, 12)
  assert.deepEqual(
    RICH_USE_CASES.map((u) => u.industry_slug),
    expectedSlugs
  )

  const uniqueHeadlines = new Set<string>()
  for (const uc of RICH_USE_CASES) {
    assert.ok(uc.name.length > 2, `${uc.industry_slug} missing name`)
    assert.ok(uc.headline.length > 10, `${uc.industry_slug} missing headline`)
    assert.ok(uc.subhead.length > 20, `${uc.industry_slug} missing subhead`)
    assert.ok(uc.problem.length > 30, `${uc.industry_slug} missing problem`)
    assert.ok(
      uc.deepDive.paragraphs.length >= 2,
      `${uc.industry_slug} should have multi-paragraph deepDive`
    )
    assert.equal(uc.scenarios.length, 3, `${uc.industry_slug} should have 3 scenarios`)
    assert.ok(
      uc.sampleDialogue.turns.length >= 4,
      `${uc.industry_slug} should have realistic call dialogue turns`
    )
    assert.ok(uc.features.length >= 4, `${uc.industry_slug} should list capabilities`)
    assert.ok(uc.flow.length >= 3, `${uc.industry_slug} should list call execution flow`)
    assert.ok(uc.results.length >= 2, `${uc.industry_slug} should list KPI results`)
    assert.ok(uc.integrations.length >= 3, `${uc.industry_slug} should list integrations`)
    uniqueHeadlines.add(uc.headline)
  }

  assert.equal(uniqueHeadlines.size, 12, 'Every use case must have a unique headline')
})

test('resolveRichUseCase preserves preset deepDive, scenarios, dialogue, and vapiAgentId when merged with DB rows', () => {
  const dbRow = {
    industry_slug: 'real-estate',
    name: 'Real Estate Teams',
    headline: 'Custom DB Headline',
    subhead: 'Custom DB Subhead',
    problem: 'Custom DB Problem',
    features: ['Custom Feature 1', 'Custom Feature 2'],
    flow: [{ step: 'DB Step', desc: 'DB Step Desc' }],
    results: [{ stat: '5x', label: 'Showings' }],
  }

  const resolved = resolveRichUseCase('real-estate', dbRow)
  assert.ok(resolved)
  assert.equal(resolved.name, 'Real Estate Teams')
  assert.equal(resolved.headline, 'Custom DB Headline')
  assert.ok(resolved.vapiAgentId, 'Preserves live Vapi agent ID on real-estate')
  assert.equal(resolved.scenarios.length, 3)
  assert.ok(resolved.sampleDialogue.turns.length >= 6)
})

test('resolveRichUseCase synthesizes structured non-generic content for custom admin slugs', () => {
  const unknown = resolveRichUseCase('non-existent-slug', null)
  assert.equal(unknown, null)

  const customResolved = resolveRichUseCase('dental-clinics', {
    industry_slug: 'dental-clinics',
    name: 'Dental Clinics',
    headline: '24/7 Hygiene Recall & Emergency Triage',
    subhead: 'Automated scheduling for multi-chair dental practices.',
    problem: 'Front desk staff miss calls while checking patients out.',
    features: ['Insurance Verification', 'OpenDental Sync'],
    flow: [{ step: 'Patient Calls', desc: 'AI verifies recall eligibility' }],
    results: [{ stat: '42%', label: 'Chair utilization lift' }],
  })

  assert.ok(customResolved)
  assert.equal(customResolved.name, 'Dental Clinics')
  assert.ok(customResolved.deepDive.paragraphs.length >= 2)
  assert.ok(customResolved.sampleDialogue.turns.length >= 4)
})

test('mergePublishedUseCases keeps DB order first and appends remaining built-in slugs', () => {
  const partialDb = [
    {
      industry_slug: 'solar',
      name: 'Solar & Clean Energy',
      headline: 'Custom Solar Headline',
    },
    {
      industry_slug: 'dental-clinics',
      name: 'Dental Clinics',
      headline: 'Dental AI Receptionist',
    },
  ]

  const merged = mergePublishedUseCases(partialDb)
  assert.equal(merged.length, 13)
  assert.equal(merged[0].industry_slug, 'solar')
  assert.equal(merged[0].headline, 'Custom Solar Headline')
  assert.equal(merged[1].industry_slug, 'dental-clinics')
})
