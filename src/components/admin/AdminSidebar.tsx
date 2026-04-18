'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Settings, LogOut, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils' // Assuming utils exist, I'll check or use template

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: '대시보드', href: '/admin', icon: LayoutDashboard },
    { name: '회원 관리', href: '/admin/users', icon: Users },
    { name: '게시물 관리', href: '/admin/posts', icon: FileText },
  ]

  return (
    <aside className="w-64 h-screen bg-[#1F1E24] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2 mb-10 group">
          <div className="w-8 h-8 rounded-lg bg-[#7b61ff] flex items-center justify-center group-hover:scale-110 transition-transform">
             <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wider">AURA</span>
        </Link>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-[#7b61ff] text-white shadow-lg shadow-[#7b61ff]/20" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-white/40")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all w-full text-left"
        >
          <ChevronLeft className="w-5 h-5 text-white/40" />
          Back to Site
        </Link>
      </div>
    </aside>
  )
}
