'use client'

import { adminLogin } from '@/app/actions/auth-admin'
import { useState } from 'react'

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        const res = await adminLogin(formData)
        if (res?.error) {
            setError(res.error)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-sm rounded-lg bg-gray-800 p-8 shadow-lg border border-gray-700">
                <h1 className="mb-6 text-center text-2xl font-bold">Admin Portal</h1>

                {error && (
                    <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 p-2 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 p-2 text-white focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 p-2 text-white focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                    >
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    )
}
