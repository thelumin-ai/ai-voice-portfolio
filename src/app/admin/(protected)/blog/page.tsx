import { getBlogPosts } from './actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PenSquare } from 'lucide-react'
import { BlogList } from './BlogList'

export default async function BlogAdminPage() {
  const { data: posts } = await getBlogPosts()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Blog & Insights</h1>
          <p className="text-sm text-zinc-400">Manage your published articles and drafts.</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"><PenSquare className="w-4 h-4 mr-2" /> Write Post</Button>
        </Link>
      </div>

      <BlogList initialPosts={posts || []} />
    </div>
  )
}
