'use client'

import { useState } from 'react'
import { MoreVertical, MessageSquare, Clock, User as UserIcon, Trash2, Edit3, ExternalLink, X, Save } from 'lucide-react'
import Link from 'next/link'
import { deletePostAction, updatePostAction } from '@/app/admin/actions'
import { cn } from '@/lib/utils'

interface Post {
  id: string
  title: string
  author: string
  content: string
  createdAt: string
}

export default function AdminPostList({ posts }: { posts: Post[] }) {
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', content: '' })

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`'${title}' 게시글을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return
    
    try {
      await deletePostAction(id)
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleEditStart = (post: Post) => {
    setEditingPost(post)
    setEditForm({ title: post.title, content: post.content })
  }

  const handleUpdate = async () => {
    if (!editingPost) return
    if (!editForm.title.trim() || !editForm.content.trim()) {
      alert('제목과 내용을 입력해 주세요.')
      return
    }

    setIsUpdating(true)
    try {
      await updatePostAction(editingPost.id, editForm)
      setEditingPost(null)
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.')
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
              <th className="px-6 py-5 text-[12px] font-semibold text-white/50 uppercase tracking-wider">제목 및 요약</th>
              <th className="px-6 py-5 text-[12px] font-semibold text-white/50 uppercase tracking-wider">작성자</th>
              <th className="px-6 py-5 text-[12px] font-semibold text-white/50 uppercase tracking-wider">작성일</th>
              <th className="px-6 py-5 text-[12px] font-semibold text-white/50 uppercase tracking-wider text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-6">
                  <div className="max-w-md">
                    <div className="flex items-center gap-2 mb-1">
                        <Link href={`/community/${post.id}`} target="_blank" className="text-white font-semibold text-[15px] hover:text-[#7b61ff] transition-colors flex items-center gap-1.5">
                          {post.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40" />
                        </Link>
                    </div>
                    <p className="text-white/30 text-[12px] line-clamp-1 leading-relaxed">{post.content}</p>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2 text-white/70">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                        <UserIcon className="w-3 h-3 text-white/30" />
                    </div>
                    <span className="text-[14px] font-medium">{post.author}</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2 text-white/40">
                    <Clock className="w-3.5 h-3.5 opacity-40" />
                    <span className="text-[13px]">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => handleEditStart(post)}
                        className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-white/20 hover:text-white"
                        title="수정"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all text-white/20 hover:text-red-400"
                        title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => !isUpdating && setEditingPost(null)} />
          <div className="bg-[#1F1E24] border border-white/10 w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#7b61ff]/10 flex items-center justify-center">
                        <Edit3 className="w-5 h-5 text-[#7b61ff]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">게시글 수정</h2>
                        <p className="text-white/40 text-[12px]">포스트의 내용을 편집하고 저장하세요.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setEditingPost(null)}
                    className="p-2 rounded-full hover:bg-white/5 text-white/30 hover:text-white transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="p-10 space-y-6">
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-white/30 uppercase tracking-widest ml-1">제목</label>
                    <input 
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#7b61ff]/50 focus:ring-4 ring-[#7b61ff]/10 transition-all font-medium"
                        placeholder="제목을 입력하세요"
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-[11px] font-bold text-white/30 uppercase tracking-widest ml-1">내용</label>
                    <textarea 
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        rows={8}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#7b61ff]/50 focus:ring-4 ring-[#7b61ff]/10 transition-all font-medium resize-none leading-relaxed"
                        placeholder="내용을 입력하세요"
                    />
                </div>
            </div>

            <div className="p-8 border-t border-white/5 flex justify-end gap-3 bg-black/5">
                <button 
                    disabled={isUpdating}
                    onClick={() => setEditingPost(null)}
                    className="px-6 py-3 rounded-2xl text-sm font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                    취소
                </button>
                <button 
                    disabled={isUpdating}
                    onClick={handleUpdate}
                    className="px-8 py-3 rounded-2xl bg-[#7b61ff] text-white text-sm font-bold shadow-lg shadow-[#7b61ff]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group disabled:opacity-50 disabled:scale-100"
                >
                    {isUpdating ? '저장 중...' : (
                        <>
                            저장하기
                            <Save className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                        </>
                    )}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
