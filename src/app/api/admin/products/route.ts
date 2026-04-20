import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createProduct } from '@/lib/products'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: userData } = await (supabase as any)
    .from('users').select('is_admin').eq('id', user.id).single()
  if (!userData?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const product = await createProduct(body)
    revalidatePath('/shop')
    return NextResponse.json(product)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
