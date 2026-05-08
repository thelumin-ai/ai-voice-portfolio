import { z } from "zod"

export const seoSchema = z.object({
  id: z.string().optional(),
  page_path: z.string().min(1, "Page path is required").startsWith("/", "Path must start with /"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  keywords: z.string().optional(),
  og_image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export type SeoFormValues = z.infer<typeof seoSchema>
