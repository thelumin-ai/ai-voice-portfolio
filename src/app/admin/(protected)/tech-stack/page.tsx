import { getTechStack } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { SortableList } from './SortableList'

export default async function TechStackAdminPage() {
  const { data: techStack } = await getTechStack()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tech Stack</h1>
        <Button asChild>
          <Link href="/admin/tech-stack/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Tech Item
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableList initialItems={techStack || []} />
        </CardContent>
      </Card>
    </div>
  )
}
