import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // 관리자 권한 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: userData } = await (supabase as any)
    .from('users').select('is_admin').eq('id', user.id).single()
  if (!userData?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const productId = formData.get('productId') as string | null

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `thumbnails/${productId || 'new'}/${Date.now()}.${ext}`

  const { data, error } = await (supabase as any).storage
    .from('product-images')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = (supabase as any).storage
    .from('product-images')
    .getPublicUrl(path)

  return NextResponse.json({ url: publicUrl })
}
