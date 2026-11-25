import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdminUser } from '@/lib/auth/admin'
import { AdminShell } from './AdminShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAdminUser(user)) {
    redirect('/admin/login')
  }

  return (
    <AdminShell userEmail={user?.email || ''}>
      {children}
    </AdminShell>
  )
}
