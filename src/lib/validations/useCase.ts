import * as z from 'zod'

export const useCaseSchema = z.object({
  industry_slug: z.string().min(1, 'Industry slug is required').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  name: z.string().min(1, 'Industry name is required'),
  headline: z.string().min(1, 'Headline is required'),
  subhead: z.string().min(1, 'Subhead is required'),
  problem: z.string().min(1, 'Problem description is required'),
  features: z.array(z.string()).optional(),
  flow: z.array(z.object({
      step: z.string().min(1, 'Step name is required'),
      desc: z.string().min(1, 'Description is required')
  })).optional(),
  results: z.array(z.object({
      stat: z.string().min(1, 'Stat is required'),
      label: z.string().min(1, 'Label is required')
  })).optional(),
  status: z.enum(['published', 'draft', 'archived']),
  display_order: z.number().int().optional(),
})

export type UseCaseFormValues = z.infer<typeof useCaseSchema>
