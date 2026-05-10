import * as z from 'zod'

export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon_name: z.string().min(1, 'Icon name is required'),
  status: z.enum(['published', 'draft', 'archived']),
  display_order: z.number().int().default(0),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>
