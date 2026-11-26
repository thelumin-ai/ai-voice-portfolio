import * as z from 'zod'

const optionalRouteOrUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val) return true
      if (val.startsWith('/') && !val.startsWith('//')) return true
      try {
        const parsed = new URL(val)
        return parsed.protocol === 'https:' || parsed.protocol === 'http:'
      } catch {
        return false
      }
    },
    { message: 'Must be a relative route (e.g. /use-cases/sales) or http(s) URL' }
  )
  .optional()
  .or(z.literal(''))

export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon_name: z.string().min(1, 'Icon name is required'),
  link: optionalRouteOrUrlSchema,
  status: z.enum(['published', 'draft', 'archived']),
  display_order: z.number().int().optional(),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>
