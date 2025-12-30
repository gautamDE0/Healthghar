import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DoctorDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Double check role? Middleware handles it, but good to be safe.
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (profile?.role !== 'doctor') {
        redirect('/')
    }

    // Fetch bookings strictly for this doctor
    // We need to join bookings with profile to get user names? Or just bookings.
    // Note: RLS policies protect `bookings`. A doctor can only see their own.
    // So `supabase.from('bookings').select('*, profiles(full_name)')` is valid if we have FK set up correctly.

    // For now, simple fetch
    const { data: bookings } = await supabase.from('bookings').select('*, profiles(full_name)')

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-blue-900">Doctor Dashboard</h1>
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
                    <h2 className="text-xl font-semibold mb-4">Appointments</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {bookings && bookings.length > 0 ? bookings.map((booking: any) => (
                                <li key={booking.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-blue-600 truncate">{booking.profiles?.full_name || 'Patient'}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {booking.appointment_date ? new Date(booking.appointment_date).toLocaleString() : 'No Date'}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            )) : (
                                <li className="px-4 py-8 text-center text-gray-500">No bookings found.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    )
}
