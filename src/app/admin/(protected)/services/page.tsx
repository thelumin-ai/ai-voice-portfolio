import { getServices } from './actions'
import Link from 'next/link'
import { Plus, Pencil, Briefcase } from 'lucide-react'

// We will use standard lists for now to keep it simple, or we can use dnd-kit if we implement a client component.
// To keep this pure server component and avoid complex dnd boilerplate right now, we will just list them.
import { Button } from '@/components/ui/button'

export default async function ServicesPage() {
  const { data: services, error } = await getServices()

  if (error) {
    return <div className="p-8 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">Error loading services. Please ensure your database is updated.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Services & Solutions</h1>
          <p className="text-sm text-zinc-400">Manage the core offerings displayed on your homepage.</p>
        </div>
        <Link href="/admin/services/new">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"><Plus className="w-4 h-4 mr-2" /> Add Service</Button>
        </Link>
      </div>

      <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/50 overflow-hidden backdrop-blur-sm">
        {services && services.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
                <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Service</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Description</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold shadow-inner">
                        {service.icon_name.charAt(0)}
                      </div>
                      <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors">{service.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-zinc-400">
                    <span className="line-clamp-1 max-w-xs">{service.description}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
                      service.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      service.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link href={`/admin/services/${service.id}`}>
                      <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all"><Pencil className="w-4 h-4" /></Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-200 mb-2">No Services Found</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">Create your first service to showcase your offerings to potential clients.</p>
          </div>
        )}
      </div>
    </div>
  )
}
