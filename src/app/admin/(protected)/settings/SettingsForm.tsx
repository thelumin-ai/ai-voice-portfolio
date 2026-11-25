'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'
import { settingsSchema, SettingsFormValues } from '@/lib/validations/settings'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AdminImageUpload } from '@/components/admin/AdminImageUpload'
import { useAdminToast } from '@/components/admin/AdminToast'
import { getErrorMessage } from '@/lib/errors'
import { updateSiteSettings } from './actions'

export function SettingsForm({ initialData }: { initialData: SettingsFormValues }) {
  const router = useRouter()
  const toast = useAdminToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      contact_email: initialData.contact_email ?? '',
      footer_text: initialData.footer_text ?? '',
      admin_brand_name: initialData.admin_brand_name ?? '',
      admin_brand_subtitle: initialData.admin_brand_subtitle ?? '',
      admin_logo_url: initialData.admin_logo_url ?? '',
      social_links: {
        twitter: initialData.social_links?.twitter ?? '',
        linkedin: initialData.social_links?.linkedin ?? '',
        github: initialData.social_links?.github ?? '',
      },
      profile_image_url: initialData.profile_image_url ?? '',
      consultation_provider: initialData.consultation_provider ?? 'upwork',
      consultation_link_upwork: initialData.consultation_link_upwork ?? '',
      consultation_link_fiverr: initialData.consultation_link_fiverr ?? '',
      consultation_link_calendly: initialData.consultation_link_calendly ?? '',
      openai_api_key: initialData.openai_api_key ?? '',
      anthropic_api_key: initialData.anthropic_api_key ?? '',
      gemini_api_key: initialData.gemini_api_key ?? '',
    },
  })

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await updateSiteSettings(values)
      if (result.error) {
        setError(result.error)
        toast.error(result.error)
      } else {
        toast.success('Settings & admin branding saved')
        router.refresh()
      }
    } catch (err: unknown) {
      const msg = getErrorMessage(err)
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-16">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-adm-danger-border bg-adm-danger-bg p-4 text-sm text-adm-danger-text"
        >
          {error}
        </div>
      )}

      {/* Admin Branding */}
      <Card id="admin-branding">
        <CardHeader>
          <CardTitle>Admin Panel Branding</CardTitle>
          <CardDescription>
            Customize the admin workspace title, subtitle, and logo shown in the sidebar and login screen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="set-brand-name" className="adm-label">
                Admin Brand Name
              </label>
              <input
                id="set-brand-name"
                {...form.register('admin_brand_name')}
                className="adm-input"
                placeholder="Admin Panel"
              />
              {form.formState.errors.admin_brand_name && (
                <p className="adm-error">{form.formState.errors.admin_brand_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="set-brand-subtitle" className="adm-label">
                Console Subtitle
              </label>
              <input
                id="set-brand-subtitle"
                {...form.register('admin_brand_subtitle')}
                className="adm-input"
                placeholder="Dashboard Console"
              />
              {form.formState.errors.admin_brand_subtitle && (
                <p className="adm-error">{form.formState.errors.admin_brand_subtitle.message}</p>
              )}
            </div>
          </div>

          <AdminImageUpload
            label="Admin Logo (Optional)"
            hint="Square PNG, WebP, JPG, GIF, or AVIF logo displayed in the admin header and sign-in card."
            folder="branding"
            prefix="logo"
            aspect="square"
            allowManualUrl
            value={form.watch('admin_logo_url') || ''}
            onChange={(url) =>
              form.setValue('admin_logo_url', url, { shouldValidate: true })
            }
            error={form.formState.errors.admin_logo_url?.message}
          />
        </CardContent>
      </Card>

      {/* Global Information */}
      <Card>
        <CardHeader>
          <CardTitle>Global Information</CardTitle>
          <CardDescription>Basic contact details and footer text shown across the public site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5 max-w-md">
            <label htmlFor="set-email" className="adm-label">
              Contact Email
            </label>
            <input
              id="set-email"
              {...form.register('contact_email')}
              type="email"
              className="adm-input"
              placeholder="hello@agency.com"
            />
            {form.formState.errors.contact_email && (
              <p className="adm-error">{form.formState.errors.contact_email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="set-footer" className="adm-label">
              Footer Copyright Text
            </label>
            <input
              id="set-footer"
              {...form.register('footer_text')}
              className="adm-input"
              placeholder="© 2026 AI Voice Portfolio. All rights reserved."
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>URLs to your public profiles. Leave blank to hide an icon.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <label htmlFor="set-twitter" className="adm-label">
              X (Twitter) URL
            </label>
            <input
              id="set-twitter"
              {...form.register('social_links.twitter')}
              className="adm-input"
              placeholder="https://x.com/yourhandle"
            />
            {form.formState.errors.social_links?.twitter && (
              <p className="adm-error">{form.formState.errors.social_links.twitter.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="set-linkedin" className="adm-label">
              LinkedIn URL
            </label>
            <input
              id="set-linkedin"
              {...form.register('social_links.linkedin')}
              className="adm-input"
              placeholder="https://linkedin.com/in/yourprofile"
            />
            {form.formState.errors.social_links?.linkedin && (
              <p className="adm-error">{form.formState.errors.social_links.linkedin.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="set-github" className="adm-label">
              GitHub URL
            </label>
            <input
              id="set-github"
              {...form.register('social_links.github')}
              className="adm-input"
              placeholder="https://github.com/yourusername"
            />
            {form.formState.errors.social_links?.github && (
              <p className="adm-error">{form.formState.errors.social_links.github.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Image */}
      <Card>
        <CardHeader>
          <CardTitle>Public Profile Photo</CardTitle>
          <CardDescription>Displayed in the homepage About section.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminImageUpload
            folder="profile_images"
            prefix="avatar"
            aspect="avatar"
            allowManualUrl
            value={form.watch('profile_image_url') || ''}
            onChange={(url) =>
              form.setValue('profile_image_url', url, { shouldValidate: true })
            }
            error={form.formState.errors.profile_image_url?.message}
          />
        </CardContent>
      </Card>

      {/* Consultation & Booking */}
      <Card>
        <CardHeader>
          <CardTitle>Consultation &amp; Booking</CardTitle>
          <CardDescription>
            Choose where visitors are routed when clicking &ldquo;Book Consultation&rdquo;.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-1.5 max-w-sm">
            <label htmlFor="set-provider" className="adm-label">
              Active Provider
            </label>
            <select
              id="set-provider"
              {...form.register('consultation_provider')}
              className="adm-input"
            >
              <option value="upwork">Upwork</option>
              <option value="fiverr">Fiverr</option>
              <option value="calendly">Calendly</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="set-upwork" className="adm-label">
              Upwork Service Link
            </label>
            <input
              id="set-upwork"
              {...form.register('consultation_link_upwork')}
              className="adm-input"
              placeholder="https://www.upwork.com/..."
            />
            {form.formState.errors.consultation_link_upwork && (
              <p className="adm-error">
                {form.formState.errors.consultation_link_upwork.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="set-fiverr" className="adm-label">
              Fiverr Gig Link
            </label>
            <input
              id="set-fiverr"
              {...form.register('consultation_link_fiverr')}
              className="adm-input"
              placeholder="https://www.fiverr.com/..."
            />
            {form.formState.errors.consultation_link_fiverr && (
              <p className="adm-error">
                {form.formState.errors.consultation_link_fiverr.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="set-calendly" className="adm-label">
              Calendly Booking Link
            </label>
            <input
              id="set-calendly"
              {...form.register('consultation_link_calendly')}
              className="adm-input"
              placeholder="https://calendly.com/..."
            />
            {form.formState.errors.consultation_link_calendly && (
              <p className="adm-error">
                {form.formState.errors.consultation_link_calendly.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Keys */}
      <Card>
        <CardHeader>
          <CardTitle>AI Integration Keys</CardTitle>
          <CardDescription>
            Used by authenticated admin AI writers and image generators. For stronger production security, prefer configuring OPENAI_API_KEY, ANTHROPIC_API_KEY, and GEMINI_API_KEY as server environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <label htmlFor="set-openai" className="adm-label">
              OpenAI API Key
            </label>
            <input
              id="set-openai"
              {...form.register('openai_api_key')}
              type="password"
              className="adm-input"
              placeholder="sk-..."
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="set-anthropic" className="adm-label">
              Anthropic API Key (Claude)
            </label>
            <input
              id="set-anthropic"
              {...form.register('anthropic_api_key')}
              type="password"
              className="adm-input"
              placeholder="sk-ant-..."
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="set-gemini" className="adm-label">
              Gemini API Key
            </label>
            <input
              id="set-gemini"
              {...form.register('gemini_api_key')}
              type="password"
              className="adm-input"
              placeholder="AIzaSy..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Saving Changes...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  )
}
