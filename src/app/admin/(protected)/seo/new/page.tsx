import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { SeoForm } from '../SeoForm'

export default function NewSeoPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Add Route SEO"
        description="Configure custom metadata tags and OpenGraph settings for a route."
        backHref="/admin/seo"
        backLabel="Back to SEO & Meta"
      />

      <SeoForm />
    </div>
  )
}
