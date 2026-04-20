import { createClient } from '@/utils/supabase/server';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  thumbnail_url: string | null;
  images: string[];
  category: string | null;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductFormData = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

// ─────────────────────────────────────────────
// Public (Server) — 출시된 상품만
// ─────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('products')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) return null;
  return data;
}

// ─────────────────────────────────────────────
// Admin (Server) — 전체 상품 (미출시 포함)
// ─────────────────────────────────────────────

export async function adminGetAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
  return data || [];
}

export async function adminGetProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

// ─────────────────────────────────────────────
// Server Actions
// ─────────────────────────────────────────────

export async function createProduct(formData: ProductFormData): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('products')
    .insert(formData)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(
  id: string,
  formData: Partial<ProductFormData>
): Promise<Product> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('products')
    .update(formData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
