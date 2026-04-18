import { getPosts } from '@/lib/store'
import AdminPostList from '@/components/admin/AdminPostList'
import { MessageSquare, LayoutGrid } from 'lucide-react'

export default async function AdminPostsPage({ searchParams }: { searchParams: { page?: string } }) {
  const p = await searchParams;
  const page = parseInt(p.page || '1');
  const { items: posts, total, totalPages } = await getPosts(page, 50);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">게시물 관리</h1>
          <p className="text-white/40 text-[15px] font-medium max-w-lg leading-relaxed">
            커뮤니티의 모든 게시글을 모니터링하고 관리할 수 있습니다. 부적절한 콘텐츠를 수정하거나 삭제하여 쾌적한 커뮤니티 환경을 유지하세요.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="text-white/30 text-[11px] font-bold uppercase tracking-[0.2em] bg-white/5 border border-white/5 px-4 py-1.5 rounded-full items-center flex gap-2">
              <LayoutGrid className="w-3.5 h-3.5" />
              Content Moderation System
            </div>
            <p className="text-white/60 text-sm mr-2">총 <span className="text-white font-bold">{total}</span>개의 게시물</p>
        </div>
      </div>

      {posts && posts.length > 0 ? (
        <AdminPostList posts={posts} />
      ) : (
        <div className="bg-[#2a2932] border border-white/5 rounded-[32px] p-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">게시글이 없습니다</h3>
            <p className="text-white/40 max-w-xs mx-auto text-sm">현재 커뮤니티에 등록된 게시글이 없습니다. 사용자들이 글을 작성하면 이곳에 목록이 나타납니다.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
            {/* Pagination can be expanded here if needed */}
            <div className="text-white/20 text-xs font-bold uppercase tracking-widest">Page {page} of {totalPages}</div>
        </div>
      )}
    </div>
  )
}
