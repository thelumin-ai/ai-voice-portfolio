import { z } from 'zod'

export const httpUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      try {
        const parsed = new URL(val)
        return parsed.protocol === 'https:' || parsed.protocol === 'http:'
      } catch {
        return false
      }
    },
    { message: 'Must be a valid http:// or https:// URL' }
  )

export const optionalHttpUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val) return true
      try {
        const parsed = new URL(val)
        return parsed.protocol === 'https:' || parsed.protocol === 'http:'
      } catch {
        return false
      }
    },
    { message: 'Must be a valid http:// or https:// URL' }
  )
  .optional()
  .or(z.literal(''))
