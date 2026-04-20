import { createClient, createSimpleClient } from '@/utils/supabase/server';

export interface Post {
  id: string; // Map from DB serial id (number) to string for UI consistency
  title: string;
  author: string; // Map from author_name
  content: string;
  createdAt: string; // Map from created_at
}

export async function getPosts(page: number = 1, limit: number = 20, providedClient?: any) {
  const supabase = providedClient || await createClient();
  
  const { data, count, error } = await (supabase as any)
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.error('Error fetching posts:', error);
    return { items: [], total: 0, page, totalPages: 0 };
  }

  const items: Post[] = (data || []).map((p: any) => ({
    id: p.id.toString(),
    title: p.title,
    author: p.author_name || '익명',
    content: p.content,
    createdAt: p.created_at
  }));

  return {
    items,
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  };
}

export async function getPost(id: string): Promise<Post | undefined> {
  const supabase = await createClient();
  
  const { data, error } = await (supabase as any)
    .from('posts')
    .select('*')
    .eq('id', parseInt(id))
    .single();

  if (error || !data) return undefined;

  return {
    id: data.id.toString(),
    title: data.title,
    author: data.author_name || '익명',
    content: data.content,
    createdAt: data.created_at
  };
}

export async function createPost(data: Omit<Post, 'id' | 'createdAt'>) {
  const supabase = await createClient();
  
  // Try to get current user if logged in
  const { data: { user } } = await supabase.auth.getUser();

  const { data: newPost, error } = await (supabase as any)
    .from('posts')
    .insert({
      title: data.title,
      content: data.content,
      author_name: data.author,
      user_id: user?.id || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw new Error(error.message);
  }

  return {
    id: newPost.id.toString(),
    title: newPost.title,
    author: newPost.author_name,
    content: newPost.content,
    createdAt: newPost.created_at
  };
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('posts')
    .delete()
    .eq('id', parseInt(id));
    
  if (error) throw new Error(error.message);
}

export async function updatePost(id: string, data: Partial<Omit<Post, 'id' | 'createdAt'>>) {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('posts')
    .update({
      title: data.title,
      content: data.content,
      author_name: data.author,
      updated_at: new Date().toISOString()
    })
    .eq('id', parseInt(id));
    
  if (error) throw new Error(error.message);
}
