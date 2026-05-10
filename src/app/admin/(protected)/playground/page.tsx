import { getPlaygroundApps } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { SortableList } from './SortableList'

export default async function PlaygroundAdminPage() {
  const { data: apps } = await getPlaygroundApps()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1 font-mono">Playground_Console</h1>
          <p className="text-sm text-zinc-400">Manage interactive AI agent demos.</p>
        </div>
        <Link href="/admin/playground/new">
          <Button className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 font-mono"><PlusCircle className="w-4 h-4 mr-2" /> INIT_APP</Button>
        </Link>
      </div>

      <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/50 overflow-hidden backdrop-blur-sm p-6">
        <h3 className="text-lg font-medium text-zinc-200 mb-6 border-b border-zinc-800/50 pb-4 font-mono">Active Configurations</h3>
        <SortableList initialItems={apps || []} />
      </div>
    </div>
  )
}
