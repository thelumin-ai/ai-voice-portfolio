import { z } from 'zod'
import { optionalHttpUrlSchema } from './url.ts'

export const seoSchema = z.object({
  id: z.string().optional(),
  page_path: z.string().min(1, 'Page path is required').startsWith('/', 'Path must start with /'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  keywords: z.string().optional(),
  og_image_url: optionalHttpUrlSchema,
})

export type SeoFormValues = z.infer<typeof seoSchema>
