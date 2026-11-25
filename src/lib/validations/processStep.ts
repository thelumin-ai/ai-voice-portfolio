import { z } from 'zod'

const iconOrUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val) return true
      // Allow Lucide icon names (e.g., phone-call, cpu, sparkles)
      if (/^[a-z0-9-]+$/i.test(val)) return true
      try {
        const parsed = new URL(val)
        return parsed.protocol === 'https:' || parsed.protocol === 'http:'
      } catch {
        return false
      }
    },
    { message: 'Must be a valid Lucide icon name or http(s) URL' }
  )
  .optional()
  .or(z.literal(''))

export const processStepSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon_url: iconOrUrlSchema,
  status: z.enum(['published', 'draft', 'archived']),
  display_order: z.number().int(),
})

export type ProcessStepFormValues = z.infer<typeof processStepSchema>
