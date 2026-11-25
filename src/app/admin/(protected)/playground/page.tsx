import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import { getPlaygroundApps } from './actions'
import { SortableList } from './SortableList'

export const dynamic = 'force-dynamic'

export default async function PlaygroundAdminPage() {
  const { data: apps, error } = await getPlaygroundApps()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Playground Apps"
        description="Manage interactive AI voice and automation demos shown in the public playground."
        actions={
          <Button asChild>
            <Link href="/admin/playground/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add App
            </Link>
          </Button>
        }
      />

      {error && <AdminErrorBanner title="Failed to load playground apps" message={error} />}

      <div className="adm-surface adm-card-pad">
        <SortableList initialItems={apps || []} hasFetchError={Boolean(error)} />
      </div>
    </div>
  )
}
