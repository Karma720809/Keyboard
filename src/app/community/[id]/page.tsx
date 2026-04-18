import Link from 'next/link';
import { Command, ChevronLeft } from 'lucide-react';
import { getPost } from '@/lib/store';
import { notFound } from 'next/navigation';

export default async function DetailPage({ params }: { params: { id: string } }) {
  // params in Next 15+ can be semantic Promise, so await params
  const p = await params;
  const post = await getPost(p.id);
  
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-accent selection:text-white">


      <div className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/community" className="inline-flex items-center gap-1.5 text-[15px] text-accent hover:underline underline-offset-4 transition-colors font-medium">
            <ChevronLeft className="w-5 h-5" /> 목록으로 돌아가기
          </Link>
        </div>

        <div className="apple-panel p-10 md:p-14 rounded-[32px] border border-white/10 shadow-2xl">
          <div className="border-b border-white/10 pb-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 leading-snug">{post.title}</h1>
            <div className="flex items-center gap-6 text-[15px] text-muted">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/70">
                  {post.author.charAt(0)}
                </span>
                <strong className="text-white/90 font-medium">{post.author}</strong>
              </span>
              <span className="text-white/40">·</span>
              <span className="font-mono text-sm">{new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="text-white/80 leading-loose text-lg whitespace-pre-wrap min-h-[300px]">
            {post.content}
          </div>
        </div>
      </div>
    </main>
  );
}
