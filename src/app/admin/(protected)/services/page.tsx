import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import { getServices } from './actions'
import { ServicesList } from './ServicesList'
import { SeedServicesButton } from './SeedServicesButton'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const { data: services, error } = await getServices()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Services & Solutions"
        description="Manage the core offerings and capability cards showcased on your homepage."
        actions={
          <>
            <SeedServicesButton />
            <Button asChild>
              <Link href="/admin/services/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Link>
            </Button>
          </>
        }
      />

      {error && <AdminErrorBanner title="Failed to load services" message={error} />}

      <div className="adm-surface adm-card-pad">
        <ServicesList initialItems={services || []} hasFetchError={Boolean(error)} />
      </div>
    </div>
  )
}
