import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect Admin Routes (Custom Auth - check elsewhere or here?)
    // Requirement: "Admin login ... Not connected to Google OAuth ... Stored manually"
    // If we implement admin as a separate session (e.g. cookie 'admin_session'), we check that here.
    const path = request.nextUrl.pathname

    if (path.startsWith('/admin')) {
        // Exclude login page
        if (path === '/admin/login') {
            return response
        }

        // Check for admin session cookie (we will define this later in server action)
        const adminSession = request.cookies.get('admin_session')
        if (!adminSession) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // Protect Doctor Routes
    if (path.startsWith('/doctor') && !path.startsWith('/auth')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        // Check Role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'doctor') {
            // Redirect unauthorized user
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Protect User Routes
    if (path.startsWith('/user') && !path.startsWith('/auth')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        // Check Role (optional, if we successfully redirected doctors away they wont see this, but strictly speaking 'user' role)
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'user') {
            // Redirect unauthorized user (maybe doctor trying to access user dashboard?)
            // For now let's strict check
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Public Routes (/) and /login are open.

    return response
}
