'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function completeProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Not authenticated')
    }

    const age = formData.get('age')
    const phone = formData.get('phone')
    const address = formData.get('address')

    const { error } = await supabase
        .from('profiles')
        .update({
            age: Number(age),
            phone: String(phone),
            address: String(address)
        })
        .eq('id', user.id)

    if (error) {
        console.error('Profile update failed:', error)
        throw new Error('Failed to update profile')
    }

    redirect('/user/home')
}
