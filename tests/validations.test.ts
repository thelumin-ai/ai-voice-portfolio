import test from 'node:test'
import assert from 'node:assert/strict'
import { portfolioSchema } from '../src/lib/validations/portfolio.ts'
import { leadSchema } from '../src/lib/validations/lead.ts'
import { blogPostSchema } from '../src/lib/validations/blog.ts'
import { settingsSchema } from '../src/lib/validations/settings.ts'
import { processStepSchema } from '../src/lib/validations/processStep.ts'
import { useCaseSchema } from '../src/lib/validations/useCase.ts'

test('portfolioSchema requires cover image and enforces 2,500-character description limit', () => {
  const basePortfolio = {
    title: 'Real Estate Speed-to-Lead Agent',
    industry_tag: 'Real Estate',
    short_description: 'A'.repeat(2500),
    metrics: [{ label: 'Conversion', value: '34%' }],
    integrations: ['Calendly'],
    media_files: [],
    cover_image_url: 'https://example.com/cover.jpg',
    status: 'published' as const,
    display_order: 0,
  }

  assert.equal(portfolioSchema.safeParse(basePortfolio).success, true)

  const missingCover = portfolioSchema.safeParse({
    ...basePortfolio,
    cover_image_url: '',
  })
  assert.equal(missingCover.success, false)

  const overLimit = portfolioSchema.safeParse({
    ...basePortfolio,
    short_description: 'A'.repeat(2501),
  })
  assert.equal(overLimit.success, false)
})

test('leadSchema validates email and supports optional honeypot website field', () => {
  assert.equal(
    leadSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      website: '',
      status: 'new',
    }).success,
    true
  )

  assert.equal(
    leadSchema.safeParse({
      name: 'Jane Doe',
      email: 'not-an-email',
      status: 'new',
    }).success,
    false
  )
})

test('blogPostSchema enforces valid lowercase hyphenated slugs and safe cover URLs', () => {
  assert.equal(
    blogPostSchema.safeParse({
      title: 'Voice AI in 2026',
      slug: 'voice-ai-2026',
      content: '# Body',
      cover_image_url: 'https://example.com/img.jpg',
      author: 'Admin',
      status: 'published',
    }).success,
    true
  )

  assert.equal(
    blogPostSchema.safeParse({
      title: 'Invalid Slug',
      slug: 'Invalid Slug!',
      content: '# Body',
      author: 'Admin',
      status: 'draft',
    }).success,
    false
  )
})

test('settingsSchema blocks javascript URLs in social or consultation links', () => {
  assert.equal(
    settingsSchema.safeParse({
      contact_email: 'team@example.com',
      social_links: {
        twitter: 'https://x.com/example',
        linkedin: '',
        github: 'https://github.com/example',
      },
      consultation_link_upwork: 'https://www.upwork.com/services/test',
    }).success,
    true
  )

  assert.equal(
    settingsSchema.safeParse({
      social_links: {
        twitter: 'javascript:alert(1)',
        linkedin: '',
        github: '',
      },
    }).success,
    false
  )
})

test('processStepSchema permits Lucide icon names and https URLs while rejecting unsafe URIs', () => {
  assert.equal(
    processStepSchema.safeParse({
      title: 'Discovery',
      description: 'Scope workflows',
      icon_url: 'phone-call',
      status: 'published',
      display_order: 0,
    }).success,
    true
  )

  assert.equal(
    processStepSchema.safeParse({
      title: 'Discovery',
      description: 'Scope workflows',
      icon_url: 'javascript:alert(1)',
      status: 'published',
      display_order: 0,
    }).success,
    false
  )
})

test('useCaseSchema validates flow steps and expected results arrays', () => {
  assert.equal(
    useCaseSchema.safeParse({
      industry_slug: 'real-estate',
      name: 'Real Estate',
      headline: 'Speed-to-Lead',
      subhead: 'Instant callbacks',
      problem: 'Slow follow-up',
      flow: [{ step: 'Trigger', desc: 'Calls immediately' }],
      results: [{ stat: '300%', label: 'Connect rate' }],
      status: 'published',
    }).success,
    true
  )
})
