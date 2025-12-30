import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Get User Role and Profile Status to determine redirect
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role, age, phone')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    if (profile.role === 'doctor') {
                        return NextResponse.redirect(`${origin}/doctor/dashboard`)
                    }
                    if (profile.role === 'user') {
                        // Check if onboarded
                        if (!profile.age || !profile.phone) {
                            return NextResponse.redirect(`${origin}/onboarding`)
                        }
                        return NextResponse.redirect(`${origin}/user/home`)
                    }
                    // Admin role via Google? Prompt says Admin is manual login. 
                    // But if an admin role exists in profiles (maybe for future), handle it.
                    if (profile.role === 'admin') {
                        return NextResponse.redirect(`${origin}/admin/dashboard`)
                    }
                }
            }
        }
    }

    // Login failed or other error
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
