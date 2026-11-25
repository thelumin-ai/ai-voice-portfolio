import Link from 'next/link'
import { Briefcase, Pencil, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import {
  AdminEmptyState,
  AdminErrorBanner,
  AdminStatusBadge,
} from '@/components/admin/AdminStates'
import { getServices } from './actions'
import { DeleteServiceButton } from './DeleteServiceButton'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const { data: services, error } = await getServices()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Services & Solutions"
        description="Manage the core offerings and capability cards showcased on your homepage."
        actions={
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Link>
          </Button>
        }
      />

      {error && <AdminErrorBanner title="Failed to load services" message={error} />}

      <div className="adm-surface overflow-hidden">
        {services && services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-adm-border bg-adm-surface-2/60">
                  <th className="py-3.5 px-5 text-xs font-semibold text-adm-muted uppercase tracking-wider">
                    Service
                  </th>
                  <th className="py-3.5 px-5 text-xs font-semibold text-adm-muted uppercase tracking-wider">
                    Description
                  </th>
                  <th className="py-3.5 px-5 text-xs font-semibold text-adm-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3.5 px-5 text-xs font-semibold text-adm-muted uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-adm-border">
                {services.map((service) => {
                  const titleLabel = service.title || 'Untitled Service'
                  return (
                    <tr key={service.id} className="hover:bg-adm-surface-2/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-lg bg-adm-accent-soft text-adm-accent border border-adm-accent/25 flex items-center justify-center font-bold text-xs shrink-0">
                            {(service.icon_name || titleLabel).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-adm-text">{titleLabel}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-sm text-adm-muted">
                        <span className="line-clamp-1 max-w-md">{service.description || '—'}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <AdminStatusBadge status={service.status} />
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button variant="outline" size="icon" asChild>
                            <Link
                              href={`/admin/services/${service.id}`}
                              aria-label={`Edit ${titleLabel}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>
                          <DeleteServiceButton id={service.id} title={titleLabel} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="adm-card-pad">
            {error ? (
              <p className="py-4 text-center text-sm text-adm-muted">
                Fix the error above and click Retry to load services.
              </p>
            ) : (
              <AdminEmptyState
                icon={Briefcase}
                title="No services yet"
                description="Create your first service card to showcase your offerings."
                action={
                  <Button asChild size="sm">
                    <Link href="/admin/services/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Link>
                  </Button>
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
