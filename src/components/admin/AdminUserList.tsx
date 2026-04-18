'use client'

import { useState } from 'react'
import { MoreVertical, Mail, Calendar, ShieldCheck, X, User as UserIcon, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toggleAdminStatusAction } from '@/app/admin/actions'

interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  is_admin: boolean
  created_at: string
}

export default function AdminUserList({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggleAdmin = async (user: User) => {
    if (!confirm(`정말 ${user.email}의 관리자 권한을 ${user.is_admin ? '취소' : '부여'}하시겠습니까?`)) return
    
    setIsUpdating(true)
    try {
      await toggleAdminStatusAction(user.id, user.is_admin)
      // Since it's a server action with revalidatePath, we don't need to manually update state if the page refreshes
      // But for a better UX, we might want to update local state or just wait for revalidation
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...user, is_admin: !user.is_admin })
      }
    } catch (error) {
      alert('권한 변경 중 오류가 발생했습니다.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-[#2a2932] border border-white/5 rounded-[24px] overflow-hidden shadow-lg shadow-black/20 relative">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-black/20">
              <th className="px-6 py-5 text-[12px] font-semibold text-white/50 uppercase tracking-wider">회원</th>
              <th className="px-6 py-5 text-[12px] font-semibold text-white/50 uppercase tracking-wider">이메일</th>
              <th className="px-6 py-5 text-[12px] font-semibold text-white/50 uppercase tracking-wider">권한</th>
              <th className="px-6 py-5 text-[12px] font-semibold text-white/50 uppercase tracking-wider">가입일</th>
              <th className="px-6 py-5 text-[12px] font-semibold text-white/50 uppercase tracking-wider text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7b61ff] to-[#6a50e5] flex items-center justify-center font-bold text-white text-xs shadow-inner">
                      {user.first_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium text-[14px]">
                        {user.first_name || '이름 없음'} {user.last_name || ''}
                      </p>
                      <p className="text-white/30 text-[11px] font-mono tracking-tighter uppercase">{user.id.slice(0, 12)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-white/70 text-[13px]">
                   {user.email}
                </td>
                <td className="px-6 py-5">
                  {user.is_admin ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#7b61ff]/10 text-[#7b61ff] text-[11px] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-[11px] font-bold uppercase tracking-wider border border-white/5">
                      Member
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 text-white/50 text-[13px]">
                   {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-[12px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                  >
                    자세히 보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedUser(null)} />
          <div className="bg-[#1F1E24] border border-white/10 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="h-32 bg-gradient-to-r from-[#7b61ff] to-[#6a50e5]" />
            <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10"
            >
                <X className="w-5 h-5" />
            </button>
            
            <div className="px-10 pb-10 relative -mt-12">
               <div className="w-24 h-24 rounded-3xl bg-[#2a2932] border-4 border-[#1F1E24] flex items-center justify-center shadow-xl mb-6">
                  <UserIcon className="w-10 h-10 text-[#7b61ff]" />
               </div>
               
               <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedUser.first_name || '이름 없음'} {selectedUser.last_name || ''}
                  </h2>
                  <p className="text-white/40 text-sm">{selectedUser.email}</p>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                     <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">ID (UID)</p>
                     <p className="text-[13px] text-white/80 font-mono break-all leading-relaxed">
                        {selectedUser.id}
                     </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                     <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">가입일시</p>
                     <p className="text-[13px] text-white/80">
                        {new Date(selectedUser.created_at).toLocaleString()}
                     </p>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                     <div className="flex items-center gap-3">
                        <ShieldCheck className={cn("w-5 h-5", selectedUser.is_admin ? "text-[#7b61ff]" : "text-white/20")} />
                        <span className="text-white text-sm font-medium">관리자 권한</span>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={selectedUser.is_admin} 
                            onChange={() => handleToggleAdmin(selectedUser)}
                            disabled={isUpdating}
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7b61ff]"></div>
                     </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                     <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-white/20" />
                        <span className="text-white text-sm font-medium">이메일 인증 여부</span>
                     </div>
                     <span className="text-emerald-400 text-[11px] font-bold uppercase tracking-wider bg-emerald-400/10 px-2 py-1 rounded">Verified</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
