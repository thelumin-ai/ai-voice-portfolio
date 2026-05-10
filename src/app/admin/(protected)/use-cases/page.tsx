import { getUseCases } from './actions'
import Link from 'next/link'
import { Plus, Pencil, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function UseCasesPage() {
  const { data: usecases, error } = await getUseCases()

  if (error) {
    return <div className="p-8 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">Error loading use cases. Please ensure your database is updated.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Use Cases</h1>
          <p className="text-sm text-zinc-400">Manage the industry-specific deployment landing pages.</p>
        </div>
        <Link href="/admin/use-cases/new">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"><Plus className="w-4 h-4 mr-2" /> Add Use Case</Button>
        </Link>
      </div>

      <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/50 overflow-hidden backdrop-blur-sm">
        {usecases && usecases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {usecases.map((usecase) => (
              <div key={usecase.id} className="group relative bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                {/* Abstract Glow Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-500" />
                
                <div className="p-6 relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-blue-900/30 group-hover:border-blue-700/50 transition-all duration-300">
                      <Layers className="w-6 h-6 text-zinc-400 group-hover:text-blue-400" />
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md border backdrop-blur-md ${
                      usecase.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      usecase.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      'bg-zinc-800/80 text-zinc-400 border-zinc-700'
                    }`}>
                      {usecase.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{usecase.name}</h3>
                    <p className="text-sm font-mono text-zinc-500 mb-6 truncate" title={`/use-cases/${usecase.industry_slug}`}>/use-cases/{usecase.industry_slug}</p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/50 flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase">Manage Configurations</span>
                    <Link href={`/admin/use-cases/${usecase.id}`}>
                      <Button variant="ghost" size="sm" className="bg-zinc-800 text-zinc-300 hover:text-white hover:bg-blue-600 border border-zinc-700 hover:border-transparent transition-all rounded-lg">
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <Layers className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-200 mb-2">No Use Cases Found</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">Create an industry-specific use case page to capture leads.</p>
          </div>
        )}
      </div>
    </div>
  )
}
