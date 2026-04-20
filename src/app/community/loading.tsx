import { TableSkeleton } from '@/components/Skeletons';
import { Plus } from 'lucide-react';

export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground relative py-32 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tighter mb-2">Free Board</h1>
          <p className="text-muted text-sm">자유게시판입니다. 누구나 자유롭게 의견을 나누어 보세요.</p>
        </div>
        <div className="apple-btn text-sm px-5 py-2 flex items-center gap-1 opacity-50 cursor-not-allowed">
          <Plus className="w-4 h-4" /> 게시글 작성
        </div>
      </div>
      <TableSkeleton />
    </main>
  );
}
