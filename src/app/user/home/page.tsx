import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User } from 'lucide-react'

export default async function UserHome() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-black">User Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/user/profile"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition border border-gray-400"
                                title="Edit Profile"
                            >
                                <User className="h-6 w-6 text-gray-700" />
                            </Link>
                            <form action={async () => {
                                'use server'
                                const sb = await createClient()
                                await sb.auth.signOut()
                                redirect('/')
                            }}>
                                <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 shadow-sm">
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="rounded-lg border-4 border-dashed border-gray-400 p-4">
                        <h2 className="text-xl font-bold text-black mb-4">Welcome, {profile?.full_name}</h2>
                        {/* Profile section removed, only bookings remain or other dashboard items */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Expanded Bookings Section to fill space */}
                            <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
                                <h3 className="font-bold text-lg text-black mb-2">My Bookings</h3>
                                <p className="text-gray-900 font-medium">No bookings yet.</p>
                                {/* Fetch bookings here */}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
