import Link from 'next/link';
import { getPosts, Post } from '@/lib/store';
import { Command, Plus } from 'lucide-react';

export const revalidate = 60;

export default async function CommunityPage({ searchParams }: { searchParams: { page?: string } }) {
  // searchParams in Next.js 15+ can be a promise, but for local simple use we can cast it if we need to
  const pageParam = await searchParams;
  const page = parseInt(pageParam?.page || '1');
  const { items, totalPages } = await getPosts(page, 20);

  const currentGroup = Math.ceil(page / 10);
  const startPage = (currentGroup - 1) * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);
  
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  const hasNextGroup = endPage < totalPages;
  const hasPrevGroup = startPage > 1;

  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-accent selection:text-white">


      <div className="pt-32 pb-16 px-6 max-w-5xl mx-auto min-h-[80vh] flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tighter mb-2">Free Board</h1>
            <p className="text-muted text-sm">자유게시판입니다. 누구나 자유롭게 의견을 나누어 보세요.</p>
          </div>
          <Link href="/community/write" className="apple-btn text-sm px-5 py-2 flex items-center gap-1">
            <Plus className="w-4 h-4" /> 게시글 작성
          </Link>
        </div>

        <div className="apple-panel rounded-2xl overflow-hidden border border-white/10 mb-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-black/40 border-b border-white/10 text-muted">
                <tr>
                  <th className="px-6 py-4 font-medium w-16 text-center tracking-wide">NO</th>
                  <th className="px-6 py-4 font-medium tracking-wide">TITLE</th>
                  <th className="px-6 py-4 font-medium w-32 text-center tracking-wide">AUTHOR</th>
                  <th className="px-6 py-4 font-medium w-32 text-center tracking-wide">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((post: Post, idx: number) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-center text-white/40 font-mono group-hover:text-white/70">{post.id}</td>
                    <td className="px-6 py-4 text-foreground font-medium">
                      <Link href={`/community/${post.id}`} className="hover:text-accent hover:underline underline-offset-4 block truncate max-w-[400px]">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center text-muted truncate">{post.author}</td>
                    <td className="px-6 py-4 text-center text-white/40 text-xs font-mono">{new Date(post.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-muted text-base">등록된 게시글이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {hasPrevGroup && (
              <Link href={`/community?page=${startPage - 1}`} className="w-9 h-9 flex items-center justify-center rounded-full text-muted hover:bg-white/10 transition-colors">
                &lt;
              </Link>
            )}
            
            {pages.map(p => (
              <Link key={p} href={`/community?page=${p}`} 
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${page === p ? 'bg-[#f5f5f7] text-black' : 'text-muted hover:bg-white/10'}`}>
                {p}
              </Link>
            ))}

            {hasNextGroup && (
              <Link href={`/community?page=${endPage + 1}`} className="w-9 h-9 flex items-center justify-center rounded-full text-muted hover:bg-white/10 transition-colors">
                &gt;
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
