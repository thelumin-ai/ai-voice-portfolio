import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminErrorBanner } from '@/components/admin/AdminStates'
import { getUseCases } from './actions'
import { UseCasesList } from './UseCasesList'
import { SeedUseCasesButton } from './SeedUseCasesButton'

export const dynamic = 'force-dynamic'

export default async function UseCasesPage() {
  const { data: usecases, error } = await getUseCases()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Use Cases"
        description="Manage your dedicated industry and capability landing pages."
        actions={
          <>
            <SeedUseCasesButton />
            <Button asChild>
              <Link href="/admin/use-cases/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Use Case
              </Link>
            </Button>
          </>
        }
      />

      {error && <AdminErrorBanner title="Failed to load use cases" message={error} />}

      <div className="adm-surface adm-card-pad">
        <UseCasesList initialItems={usecases || []} hasFetchError={Boolean(error)} />
      </div>
    </div>
  )
}
