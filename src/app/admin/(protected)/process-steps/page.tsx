import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import { getProcessSteps } from './actions'
import { SortableList } from './SortableList'

export const dynamic = 'force-dynamic'

export default async function ProcessStepsAdminPage() {
  const { data: steps, error } = await getProcessSteps()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Process Steps"
        description="Manage your agency workflow timeline and delivery stages."
        actions={
          <Button asChild>
            <Link href="/admin/process-steps/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Step
            </Link>
          </Button>
        }
      />

      {error && <AdminErrorBanner title="Failed to load process steps" message={error} />}

      <div className="adm-surface adm-card-pad">
        <SortableList initialItems={steps || []} hasFetchError={Boolean(error)} />
      </div>
    </div>
  )
}
