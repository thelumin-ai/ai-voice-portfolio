import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import { getAdminPortfolioProjects } from './actions'
import { SortableList } from './SortableList'

export const dynamic = 'force-dynamic'

export default async function PortfolioAdminPage() {
  const { data: projects, error } = await getAdminPortfolioProjects()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Portfolio Projects"
        description="Manage, preview, and reorder your AI voice deployments and case studies."
        actions={
          <Button asChild>
            <Link href="/admin/portfolio/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Project
            </Link>
          </Button>
        }
      />

      {error && <AdminErrorBanner title="Failed to load portfolio projects" message={error} />}

      <div className="adm-surface adm-card-pad">
        <SortableList initialItems={projects || []} hasFetchError={Boolean(error)} />
      </div>
    </div>
  )
}
