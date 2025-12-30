import { createClient } from '@supabase/supabase-js' // Service client directly usually for server components if we want to bypass RLS, OR use an API route. 
// Actually, here we are in a Server Component. We can use the service client.
import { addDoctor, removeDoctor } from '@/app/admin/actions'
import { adminLogout } from '@/app/actions/auth-admin'

// We need a helper to get service client in Server Component
const getService = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminDashboard() {
    const supabase = getService()

    // Fetch Doctors
    const { data: doctors } = await supabase.from('doctors').select('*').order('created_at', { ascending: false })

    // Fetch Users Count
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user')

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-gray-800 text-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold">Healthghar Admin</span>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs">{usersCount || 0} Users</span>
                    </div>
                    <form action={adminLogout}>
                        <button className="text-sm text-gray-400 hover:text-white">Logout</button>
                    </form>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Add Doctor Column */}
                    <div className="bg-white p-6 shadow rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Doctor</h2>
                        <form action={addDoctor} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input name="fullName" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Google Email</label>
                                <input name="email" type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="doctor@gmail.com" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Doctor</button>
                        </form>
                    </div>

                    {/* List Doctors Column */}
                    <div className="lg:col-span-2 bg-white p-6 shadow rounded-lg">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Authorized Doctors</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {doctors?.map((doc) => (
                                        <tr key={doc.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.full_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <form action={async () => {
                                                    'use server'
                                                    await removeDoctor(doc.id)
                                                }}>
                                                    <button className="text-red-600 hover:text-red-900">Remove</button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!doctors || doctors.length === 0) && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No doctors added yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
