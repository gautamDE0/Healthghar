'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true)
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
        setLoading(false)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Healthghar Login</h1>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Redirecting...' : 'Sign in with Google'}
                </button>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <a href="/admin/login" className="hover:underline">Admin Login</a>
                </div>
            </div>
        </div>
    )
}
