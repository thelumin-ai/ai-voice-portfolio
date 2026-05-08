import { PortfolioForm } from '../PortfolioForm'
import { getPortfolioProject } from '../actions'
import { notFound } from 'next/navigation'

export default async function EditPortfolioPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const project = await getPortfolioProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
        <p className="text-sm text-gray-500">Update the portfolio case study.</p>
      </div>

      <PortfolioForm initialData={project} />
    </div>
  )
}
