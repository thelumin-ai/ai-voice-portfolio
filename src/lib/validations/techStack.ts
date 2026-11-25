import { z } from 'zod'
import { optionalHttpUrlSchema } from './url.ts'

export const techStackSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  icon_url: optionalHttpUrlSchema,
  status: z.enum(['published', 'draft', 'archived']),
  display_order: z.number().int(),
})

export type TechStackFormValues = z.infer<typeof techStackSchema>
