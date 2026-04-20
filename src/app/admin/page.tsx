import { createClient } from '@/utils/supabase/server'
import { Users, FileText, Activity, TrendingUp, UserPlus, ShoppingBag } from 'lucide-react'
import { getPosts } from '@/lib/store'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. Fetch Total Users
  const { count: userCount } = await (supabase as any)
    .from('users')
    .select('*', { count: 'exact', head: true })

  // 2. Fetch Daily Signups (Last 24 hours)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count: dailySignups } = await (supabase as any)
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', twentyFourHoursAgo)

  // 3. Fetch Total Posts
  const { count: totalPosts } = await (supabase as any)
    .from('posts')
    .select('*', { count: 'exact', head: true })

  // 4. Fetch Total Products
  const { count: totalProducts } = await (supabase as any)
    .from('products')
    .select('*', { count: 'exact', head: true })

  const stats = [
    { 
      name: 'Total Users', 
      value: userCount?.toLocaleString() || '0', 
      icon: Users, 
      change: '+100%', 
      label: 'Database Live',
      color: 'text-blue-400'
    },
    { 
      name: 'Daily Signups', 
      value: dailySignups?.toLocaleString() || '0', 
      icon: UserPlus, 
      change: 'New', 
      label: 'Last 24 hours',
      color: 'text-emerald-400'
    },
    { 
      name: 'Total Posts', 
      value: totalPosts?.toLocaleString() || '0', 
      icon: FileText, 
      change: 'Migrated', 
      label: 'from JSON + DB',
      color: 'text-amber-400'
    },
    {
      name: 'Products',
      value: totalProducts?.toLocaleString() || '0',
      icon: ShoppingBag,
      change: 'Shop',
      label: 'E-Commerce',
      color: 'text-violet-400'
    },
  ]

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/50 text-[14px]">Comprehensive monitoring of community growth and content.</p>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
            <span className="text-[12px] text-white/30 uppercase tracking-widest font-bold">System Status: </span>
            <span className="text-[12px] text-emerald-400 font-bold uppercase tracking-widest animate-pulse">Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-[#2a2932] border border-white/5 p-8 rounded-[24px] shadow-lg hover:border-[#7b61ff]/30 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                    <span className={`text-[13px] font-bold ${stat.color} bg-white/5 px-2.5 py-1 rounded-lg`}>
                      {stat.change}
                    </span>
                    <p className="text-[10px] text-white/20 mt-1.5 uppercase tracking-widest font-bold">{stat.label}</p>
                </div>
              </div>
              <h3 className="text-white/40 text-[13px] font-medium mb-1 uppercase tracking-wider">{stat.name}</h3>
              <p className="text-white text-4xl font-bold tracking-tight">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#2a2932] border border-white/5 rounded-[24px] overflow-hidden shadow-lg">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/10">
                <div>
                    <h2 className="text-xl font-semibold text-white">Engagement Activity</h2>
                    <p className="text-white/40 text-sm mt-1">Daily trends across the platform.</p>
                </div>
                <TrendingUp className="text-[#7b61ff] w-6 h-6" />
            </div>
            <div className="p-12 flex flex-col items-center justify-center text-center">
               <Activity className="w-12 h-12 mb-4 text-[#7b61ff] opacity-20" />
               <p className="text-white/40 text-sm font-medium">Analytics data is synchronizing...</p>
               <div className="w-full max-w-xs bg-white/5 h-1.5 rounded-full mt-6 overflow-hidden">
                    <div className="bg-[#7b61ff] h-full w-2/3 rounded-full animate-progress-slow"></div>
               </div>
            </div>
        </div>

        <div className="bg-[#2a2932] border border-white/5 rounded-[24px] p-8 shadow-lg flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-white mb-2">Fast Management</h2>
            <p className="text-white/40 text-sm mb-8">Quick actions for administrators.</p>
            
            <div className="space-y-4">
                <a href="/admin/users" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-[#7b61ff]/10 hover:border-[#7b61ff]/30 border border-transparent transition-all">
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-white text-sm font-medium">Manage Users</span>
                    </div>
                    <span className="text-white/20 text-xs">Explore &rarr;</span>
                </a>
                <a href="/admin/products" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-[#7b61ff]/10 hover:border-[#7b61ff]/30 border border-transparent transition-all">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-violet-400" />
                        <span className="text-white text-sm font-medium">상품 관리</span>
                    </div>
                    <span className="text-white/20 text-xs">Explore &rarr;</span>
                </a>
                <a href="/admin/posts" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-[#7b61ff]/10 hover:border-[#7b61ff]/30 border border-transparent transition-all">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <span className="text-white text-sm font-medium">Curation Center</span>
                    </div>
                    <span className="text-white/20 text-xs">Explore &rarr;</span>
                </a>
            </div>
        </div>
      </div>
    </div>
  )
}
