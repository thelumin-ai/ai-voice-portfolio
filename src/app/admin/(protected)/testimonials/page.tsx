import { getTestimonials } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { SortableList } from './SortableList'

export default async function TestimonialsAdminPage() {
  const { data: testimonials } = await getTestimonials()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Testimonials</h1>
          <p className="text-sm text-zinc-400">Manage client reviews and social proof.</p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"><PlusCircle className="w-4 h-4 mr-2" /> Add Testimonial</Button>
        </Link>
      </div>

      <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/50 overflow-hidden backdrop-blur-sm p-6">
        <h3 className="text-lg font-medium text-zinc-200 mb-6 border-b border-zinc-800/50 pb-4">Manage Testimonials</h3>
        <SortableList initialItems={testimonials || []} />
      </div>
    </div>
  )
}
