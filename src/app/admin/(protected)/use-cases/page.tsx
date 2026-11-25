import Link from 'next/link'
import { Layers, Pencil, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import {
  AdminEmptyState,
  AdminErrorBanner,
  AdminStatusBadge,
} from '@/components/admin/AdminStates'
import { getUseCases } from './actions'
import { DeleteUseCaseButton } from './DeleteUseCaseButton'

export const dynamic = 'force-dynamic'

export default async function UseCasesPage() {
  const { data: usecases, error } = await getUseCases()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Use Cases"
        description="Manage your industry-specific AI voice automation landing pages."
        actions={
          <Button asChild>
            <Link href="/admin/use-cases/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Use Case
            </Link>
          </Button>
        }
      />

      {error && <AdminErrorBanner title="Failed to load use cases" message={error} />}

      <div className="adm-surface adm-card-pad">
        {usecases && usecases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usecases.map((usecase) => {
              const nameLabel = usecase.name || 'Untitled Use Case'
              const slugLabel = usecase.industry_slug || ''
              return (
                <div
                  key={usecase.id}
                  className="rounded-xl border border-adm-border bg-adm-surface-2/40 p-5 flex flex-col justify-between gap-4 hover:border-adm-accent/40 hover:bg-adm-surface-2/80 transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-adm-accent-soft border border-adm-accent/25 flex items-center justify-center text-adm-accent shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <AdminStatusBadge status={usecase.status} />
                    </div>

                    <h3 className="text-base font-semibold text-adm-text truncate">{nameLabel}</h3>
                    {slugLabel && (
                      <p
                        className="text-xs font-mono text-adm-subtle mt-1 truncate"
                        title={`/use-cases/${slugLabel}`}
                      >
                        /use-cases/{slugLabel}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-adm-border flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-adm-muted uppercase tracking-wider">
                      Manage
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/use-cases/${usecase.id}`}>
                          <Pencil className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteUseCaseButton id={usecase.id} name={nameLabel} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-adm-muted">
            Fix the error above and click Retry to load use cases.
          </p>
        ) : (
          <AdminEmptyState
            icon={Layers}
            title="No use cases yet"
            description="Create an industry-specific use case landing page to capture targeted leads."
            action={
              <Button asChild size="sm">
                <Link href="/admin/use-cases/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Use Case
                </Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  )
}
