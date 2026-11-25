import { z } from 'zod'
import { optionalHttpUrlSchema } from './url.ts'

export const playgroundAppSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  embed_url: optionalHttpUrlSchema,
  status: z.enum(['published', 'draft', 'archived']),
  display_order: z.number().int(),
})

export type PlaygroundAppFormValues = z.infer<typeof playgroundAppSchema>
