import { z } from "zod"

export const metricSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
})

export const portfolioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  industry_tag: z.string().min(1, "Industry tag is required"),
  short_description: z.string().min(1, "Short description is required"),
  case_study_body: z.string().optional(),
  metrics: z.array(metricSchema),
  integrations: z.array(z.string()),
  demo_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  cover_image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["published", "draft", "archived"]),
  display_order: z.number().int(),
})

export type PortfolioFormValues = z.infer<typeof portfolioSchema>
