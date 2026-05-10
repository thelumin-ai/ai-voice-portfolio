'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { settingsSchema, SettingsFormValues } from '@/lib/validations/settings'
import { updateSiteSettings } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { UploadCloud } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function SettingsForm({ initialData }: { initialData: SettingsFormValues }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  })

  const supabase = createClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `profile_${Math.random()}.${fileExt}`
      const filePath = `profile_images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio_media') // Using same bucket for simplicity
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('portfolio_media').getPublicUrl(filePath)
      form.setValue('profile_image_url', data.publicUrl)
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`)
    }
  }

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

      <Card>
        <CardHeader>
          <CardTitle>Profile Image</CardTitle>
          <CardDescription>Your main profile image used on the site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {form.watch('profile_image_url') && (
              <img src={form.watch('profile_image_url') as string} alt="Profile" className="w-20 h-20 object-cover rounded-full" />
            )}
            <label className="cursor-pointer flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
              <UploadCloud className="w-5 h-5 mr-2" />
              <span>Upload Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <input type="hidden" {...form.register('profile_image_url')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consultation & Booking</CardTitle>
          <CardDescription>Configure where users go when they click "Book Consultation".</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-sm">
            <label className="text-sm font-medium">Active Provider</label>
            <select
              {...form.register('consultation_provider')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
            >
              <option value="upwork">Upwork</option>
              <option value="fiverr">Fiverr</option>
              <option value="calendly">Calendly</option>
            </select>
          </div>

          <div className="space-y-2 max-w-2xl">
            <label className="text-sm font-medium">Upwork Service Link</label>
            <input
              {...form.register('consultation_link_upwork')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="https://www.upwork.com/..."
            />
          </div>

          <div className="space-y-2 max-w-2xl">
            <label className="text-sm font-medium">Fiverr Gig Link</label>
            <input
              {...form.register('consultation_link_fiverr')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="https://www.fiverr.com/..."
            />
          </div>

          <div className="space-y-2 max-w-2xl">
            <label className="text-sm font-medium">Calendly Booking Link</label>
            <input
              {...form.register('consultation_link_calendly')}
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="https://calendly.com/..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Integration Keys</CardTitle>
          <CardDescription>API Keys for AI Blog generation tools. These are stored securely.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI API Key</label>
            <input
              {...form.register('openai_api_key')}
              type="password"
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="sk-..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Anthropic API Key (Claude)</label>
            <input
              {...form.register('anthropic_api_key')}
              type="password"
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="sk-ant-..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Gemini API Key</label>
            <input
              {...form.register('gemini_api_key')}
              type="password"
              className="w-full px-3 py-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700"
              placeholder="AIzaSy..."
            />
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
