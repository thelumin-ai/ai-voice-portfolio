import { getTechItem } from '../actions'
import { TechStackForm } from '../TechStackForm'
import { notFound } from 'next/navigation'

export default async function EditTechStackPage({ params }: { params: { id: string } }) {
  const { data: item, error } = await getTechItem(params.id)

  if (error || !item) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Tool</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Update technology details.</p>
      </div>
      <TechStackForm initialData={item} />
    </div>
  )
}
