import { z } from "zod"

export const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  cover_image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  author: z.string().min(1, "Author is required"),
  status: z.enum(["published", "draft", "archived"]),
})

export type BlogPostFormValues = z.infer<typeof blogPostSchema>
