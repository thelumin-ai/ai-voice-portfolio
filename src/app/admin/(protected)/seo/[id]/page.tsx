import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getSeoSetting } from '../actions'
import { SeoForm } from '../SeoForm'

export const dynamic = 'force-dynamic'

export default async function EditSeoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { data: setting, error } = await getSeoSetting(resolvedParams.id)

  if (error || !setting) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Edit Route SEO"
        description={`Updating meta tags for "${setting.page_path || '/'}"`}
        backHref="/admin/seo"
        backLabel="Back to SEO & Meta"
      />

      <SeoForm initialData={setting} />
    </div>
  )
}
