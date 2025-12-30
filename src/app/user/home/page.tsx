import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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
                        <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
                        <form action={async () => {
                            'use server'
                            const sb = await createClient()
                            await sb.auth.signOut()
                            redirect('/')
                        }}>
                            <button className="text-sm text-red-600 hover:text-red-800">Sign Out</button>
                        </form>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="rounded-lg border-4 border-dashed border-gray-200 p-4">
                        <h2 className="text-xl font-semibold mb-4">Welcome, {profile?.full_name}</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="bg-white p-6 shadow rounded-lg">
                                <h3 className="font-bold text-gray-700">My Profile</h3>
                                <p>Age: {profile?.age}</p>
                                <p>Phone: {profile?.phone}</p>
                                <p>Address: {profile?.address}</p>
                            </div>
                            <div className="bg-white p-6 shadow rounded-lg">
                                <h3 className="font-bold text-gray-700">My Bookings</h3>
                                <p className="text-gray-500">No bookings yet.</p>
                                {/* Fetch bookings here */}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
