import { getPlaygroundApp } from '../actions'
import { PlaygroundForm } from '../PlaygroundForm'
import { notFound } from 'next/navigation'

export default async function EditPlaygroundPage({ params }: { params: { id: string } }) {
  const { data: app, error } = await getPlaygroundApp(params.id)

  if (error || !app) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit App</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Update playground app details.</p>
      </div>
      <PlaygroundForm initialData={app} />
    </div>
  )
}
