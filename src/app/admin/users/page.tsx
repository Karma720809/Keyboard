import { createClient } from '@/utils/supabase/server'
import AdminUserList from '@/components/admin/AdminUserList'
import { Users } from 'lucide-react'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users, error } = await (supabase as any)
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">회원 관리</h1>
          <p className="text-white/40 text-[15px] font-medium max-w-lg leading-relaxed">
            전체 사용자 목록을 확인하고 권한을 관리할 수 있습니다. 각 회원의 상세 정보를 조회하여 인사이트를 확인하세요.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="text-white/30 text-[11px] font-bold uppercase tracking-[0.2em] bg-white/5 border border-white/5 px-4 py-1.5 rounded-full items-center flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Users Database Online
            </div>
            <p className="text-white/60 text-sm mr-2">총 <span className="text-white font-bold">{users?.length || 0}</span>명의 사용자</p>
        </div>
      </div>

      {users && users.length > 0 ? (
        <AdminUserList users={users} />
      ) : (
        <div className="bg-[#2a2932] border border-white/5 rounded-[32px] p-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">등록된 회원이 없습니다</h3>
            <p className="text-white/40 max-w-xs mx-auto text-sm">시스템에 등록된 사용자가 없습니다. 서비스가 활성화되면 이곳에 목록이 나타납니다.</p>
        </div>
      )}
    </div>
  )
}
