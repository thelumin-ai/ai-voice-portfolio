import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getTechItem } from '../actions'
import { TechStackForm } from '../TechStackForm'

export const dynamic = 'force-dynamic'

export default async function EditTechStackPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { data: item, error } = await getTechItem(resolvedParams.id)

  if (error || !item) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Edit Tool"
        description={`Updating "${item.name || 'Tech Stack Item'}"`}
        backHref="/admin/tech-stack"
        backLabel="Back to Tech Stack"
      />

      <TechStackForm initialData={item} />
    </div>
  )
}
