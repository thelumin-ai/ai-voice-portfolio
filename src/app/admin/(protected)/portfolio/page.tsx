import { getPortfolioProjects } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { SortableList } from './SortableList'

export default async function PortfolioAdminPage() {
  const projects = await getPortfolioProjects()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Projects</h1>
        <Button asChild>
          <Link href="/admin/portfolio/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableList initialItems={projects} />
        </CardContent>
      </Card>
    </div>
  )
}
