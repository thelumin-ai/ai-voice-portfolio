export default function BlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog & Insights</h1>
          <p className="text-muted-foreground mt-2">Manage articles and case studies.</p>
        </div>
      </div>
      <div className="p-12 text-center border rounded-lg border-dashed dark:border-zinc-800">
        <h3 className="text-lg font-medium">Coming Soon</h3>
        <p className="text-muted-foreground">The blog management module is being built in Phase 3.</p>
      </div>
    </div>
  )
}
