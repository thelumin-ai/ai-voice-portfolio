'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { settingsSchema, SettingsFormValues } from '@/lib/validations/settings'
import { updateSiteSettings } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export function SettingsForm({ initialData }: { initialData: SettingsFormValues }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSubmitting(true)
    setMessage(null)
    
    try {
      const result = await updateSiteSettings(values)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
        router.refresh()
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Something went wrong' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-20">
      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Global Information</CardTitle>
          <CardDescription>Basic contact and branding info used across the site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Email</label>
            <input
              {...form.register('contact_email')}
              type="email"
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 max-w-md"
              placeholder="hello@agency.com"
            />
            {form.formState.errors.contact_email && (
              <p className="text-sm text-red-500">{form.formState.errors.contact_email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Footer Copyright Text</label>
            <input
              {...form.register('footer_text')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="© 2026 AI Agency. All rights reserved."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>URLs to your social profiles. Leave blank to hide the icon.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-medium">X (Twitter) URL</label>
            <input
              {...form.register('social_links.twitter')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="https://twitter.com/yourhandle"
            />
            {form.formState.errors.social_links?.twitter && (
              <p className="text-sm text-red-500">{form.formState.errors.social_links.twitter.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn URL</label>
            <input
              {...form.register('social_links.linkedin')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="https://linkedin.com/in/yourprofile"
            />
            {form.formState.errors.social_links?.linkedin && (
              <p className="text-sm text-red-500">{form.formState.errors.social_links.linkedin.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub URL</label>
            <input
              {...form.register('social_links.github')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="https://github.com/yourusername"
            />
            {form.formState.errors.social_links?.github && (
              <p className="text-sm text-red-500">{form.formState.errors.social_links.github.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving Changes...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  )
}
