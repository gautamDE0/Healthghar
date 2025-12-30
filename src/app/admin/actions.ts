'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// Helper for service client
const getService = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkAuth() {
    const cookieStore = await cookies()
    if (!cookieStore.get('admin_session')) {
        throw new Error('Unauthorized')
    }
}

export async function addDoctor(formData: FormData) {
    await checkAuth()
    const email = formData.get('email') as string
    const fullName = formData.get('fullName') as string

    const supabase = getService()

    const { error } = await supabase
        .from('doctors')
        .insert({ email, full_name: fullName })

    if (error) {
        console.error('Error adding doctor', error)
        return { error: error.message }
    }

    revalidatePath('/admin/dashboard')
    return { success: true }
}

export async function removeDoctor(doctorId: string) {
    await checkAuth()
    const supabase = getService()
    const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', doctorId)

    if (error) {
        return { error: error.message }
    }
    revalidatePath('/admin/dashboard')
    return { success: true }
}
