import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getPlaygroundApp } from '../actions'
import { PlaygroundForm } from '../PlaygroundForm'

export const dynamic = 'force-dynamic'

export default async function EditPlaygroundPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { data: app, error } = await getPlaygroundApp(resolvedParams.id)

  if (error || !app) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Edit Playground App"
        description={`Updating "${app.title || 'Playground App'}"`}
        backHref="/admin/playground"
        backLabel="Back to Playground"
      />

      <PlaygroundForm initialData={app} />
    </div>
  )
}
