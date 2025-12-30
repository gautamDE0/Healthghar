'use client'

import { completeProfile } from '@/app/actions/user'
import { useState } from 'react'

export default function OnboardingPage() {
    const [loading, setLoading] = useState(false)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Complete Your Profile</h2>
                <p className="mb-8 text-gray-600">Please provide a few details to get started.</p>

                <form action={completeProfile} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input
                            name="age"
                            type="number"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            name="phone"
                            type="tel"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                            name="address"
                            required
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700"
                    >
                        Save & Continue
                    </button>
                </form>
            </div>
        </div>
    )
}
