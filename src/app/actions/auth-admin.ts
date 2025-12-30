'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function adminLogin(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    // Use Service Role to query admin_users (RLS blocks anon)
    const supabase = createClient() // This is standard client, but we need SERVICE ROLE?
    // Actually, createClient uses anon key.
    // To query `admin_users` which has RLS blocking everyone, we need Service Role Key.
    // BUT the prompt said "Secure admin login". Storing Service Role in client env is bad.
    // It should be in `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`.
    // I will assume the user will additionall provide `SUPABASE_SERVICE_ROLE_KEY`.
    // I will update `.env.example` later or just usage here.

    // WAIT. I don't have the service key yet. 
    // Maybe I can just use a specific RPC? 
    // Or I can make `admin_users` readable by anon (bad).
    // I will assume `SUPABASE_SERVICE_ROLE_KEY` is available on server.

    // Correction: `utils/supabase/server.ts` uses CreateServerClient which uses cookie auth.
    // To use Service Role, I should create a separate client utility or just instantiate here.
    // `createClient(url, service_key)`

    const serviceClient = (await import('@supabase/supabase-js')).createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: admin } = await serviceClient
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single()

    if (!admin) {
        return { error: 'Invalid credentials' }
    }

    const isValid = await bcrypt.compare(password, admin.password_hash)

    if (!isValid) {
        return { error: 'Invalid credentials' }
    }

    // Set Admin Session Cookie
    const cookieStore = await cookies()
    // Secure, HttpOnly
    cookieStore.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    })

    redirect('/admin/dashboard')
}

export async function adminLogout() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    redirect('/admin/login')
}
