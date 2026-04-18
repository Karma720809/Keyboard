import Link from 'next/link';
import { Command } from 'lucide-react';
import { submitPost } from '../actions';

export default function WritePage() {
  return (
    <main className="min-h-screen bg-background text-foreground relative selection:bg-accent selection:text-white">
      <header className="fixed top-0 w-full z-50 apple-nav py-3 px-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors cursor-pointer">
            <Command className="w-5 h-5" />
            <span className="font-semibold text-lg tracking-tight">Aura Pro</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/community" className="hidden sm:block text-[13px] font-medium text-white hover:text-white transition-colors">
              Community
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-32 pb-16 px-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tighter mb-2">Write Post</h1>
          <p className="text-muted text-sm">자유롭게 의견을 작성해 주세요. 작성자 이름을 직접 입력할 수 있습니다.</p>
        </div>

        <div className="apple-panel p-8 md:p-10 rounded-[32px] border border-white/10">
          <form action={submitPost} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">작성자 명칭 (이름)</label>
              <input 
                type="text" 
                name="author" 
                placeholder="홍길동 (미입력 시 '익명')"
                className="w-full bg-black/50 border border-white/10 rounded-[14px] px-5 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300"
                maxLength={50}
              />
              <p className="text-xs text-white/40 mt-3 font-medium">이름을 입력하지 않으면 자동으로 '익명' 처리됩니다.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">제목</label>
              <input 
                type="text" 
                name="title" 
                required
                placeholder="제목을 입력하세요"
                className="w-full bg-black/50 border border-white/10 rounded-[14px] px-5 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">내용</label>
              <textarea 
                name="content" 
                required
                rows={12}
                placeholder="다양한 의견을 존중하는 커뮤니티입니다. 자유롭게 적어주세요!"
                className="w-full bg-black/50 border border-white/10 rounded-[16px] px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 resize-none leading-relaxed"
              ></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
              <Link href="/community" className="px-6 py-2.5 rounded-full border border-white/10 text-white/80 hover:bg-white/10 transition-colors text-[15px] font-medium">취소</Link>
              <button type="submit" className="apple-btn text-[15px] px-8 py-2.5 shadow-lg shadow-accent/20">
                게시글 등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
