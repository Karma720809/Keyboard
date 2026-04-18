'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Delete a post from the database
 */
export async function deletePostAction(postId: string) {
  const supabase = await createClient()

  const { error } = await (supabase as any)
    .from('posts')
    .delete()
    .eq('id', parseInt(postId))

  if (error) {
    throw new Error('Failed to delete post: ' + error.message)
  }

  revalidatePath('/admin/posts')
  revalidatePath('/community')
}

/**
 * Update a post's content
 */
export async function updatePostAction(postId: string, data: { title: string, content: string }) {
  const supabase = await createClient()

  const { error } = await (supabase as any)
    .from('posts')
    .update({
      title: data.title,
      content: data.content,
      updated_at: new Date().toISOString()
    })
    .eq('id', parseInt(postId))

  if (error) {
    throw new Error('Failed to update post: ' + error.message)
  }

  revalidatePath('/admin/posts')
  revalidatePath(`/community/${postId}`)
}

/**
 * Change user admin status
 */
export async function toggleAdminStatusAction(userId: string, currentStatus: boolean) {
  const supabase = await createClient()

  const { error } = await (supabase as any)
    .from('users')
    .update({ is_admin: !currentStatus })
    .eq('id', userId)

  if (error) {
    throw new Error('Failed to update user status: ' + error.message)
  }

  revalidatePath('/admin/users')
}
