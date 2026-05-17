import { getSeoSetting } from '../actions'
import { SeoForm } from '../SeoForm'
import { notFound } from 'next/navigation'

export default async function EditSeoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { data: setting, error } = await getSeoSetting(resolvedParams.id)

  if (error || !setting) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Route SEO</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Update meta tags for {setting.page_path}</p>
      </div>
      <SeoForm initialData={setting} />
    </div>
  )
}
