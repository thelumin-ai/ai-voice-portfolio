import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { PortfolioForm } from '../PortfolioForm'
import { getPortfolioProject } from '../actions'

export const dynamic = 'force-dynamic'

export default async function EditPortfolioPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const project = await getPortfolioProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="Edit Project"
        description={`Updating "${project.title || 'Portfolio Project'}"`}
        backHref="/admin/portfolio"
        backLabel="Back to Portfolio"
      />

      <PortfolioForm initialData={project} />
    </div>
  )
}
