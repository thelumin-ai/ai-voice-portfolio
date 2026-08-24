import { z } from "zod"

export const metricSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
})

export const mediaFileSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  type: z.enum(['image', 'video', 'audio', 'json']),
  name: z.string().optional(),
})

export const portfolioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  industry_tag: z.string().min(1, "Industry tag is required"),
  short_description: z.string().min(1, "Description is required").max(2500, "Description must not exceed 2,500 characters"),
  case_study_body: z.string().optional(),
  metrics: z.array(metricSchema),
  integrations: z.array(z.string()),
  media_files: z.array(mediaFileSchema),
  project_type: z.enum(['webrtc', 'audio', 'video', 'iframe']).optional(),
  media_url: z.string().optional().or(z.literal("")),
  api_key: z.string().optional().or(z.literal("")),
  cover_image_url: z.string().min(1, "Portfolio image is required"),
  voice_platform: z.enum(['vapi', 'retell']).optional().default('vapi'),
  status: z.enum(["published", "draft", "archived"]),
  is_featured: z.any().optional(),
  display_order: z.number().int(),
})

export type PortfolioFormValues = z.infer<typeof portfolioSchema>
