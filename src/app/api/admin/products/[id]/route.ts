import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { deleteProduct, updateProduct } from '@/lib/products'
import { revalidatePath } from 'next/cache'

async function getAdminUser(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: userData } = await supabase
    .from('users').select('is_admin').eq('id', user.id).single()
  return userData?.is_admin ? user : null
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const user = await getAdminUser(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const body = await req.json()
    const product = await updateProduct(id, body)
    revalidatePath('/shop')
    revalidatePath(`/shop/${product.slug}`)
    return NextResponse.json(product)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const user = await getAdminUser(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    await deleteProduct(id)
    revalidatePath('/shop')
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

