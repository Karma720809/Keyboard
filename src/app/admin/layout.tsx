import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: userData } = await (supabase as any)
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#1F1E24]">
      <AdminSidebar />
      <main className="pl-64 min-h-screen p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
