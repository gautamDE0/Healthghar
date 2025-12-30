import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-20 items-center justify-between px-6 shadow-sm md:px-12">
        <div className="text-2xl font-bold text-blue-600">Healthghar</div>
        <nav className="hidden gap-6 md:flex">
          <Link href="#" className="font-medium text-gray-600 hover:text-gray-900">About</Link>
          <Link href="#" className="font-medium text-gray-600 hover:text-gray-900">Services</Link>
          <Link href="#" className="font-medium text-gray-600 hover:text-gray-900">Doctors</Link>
          <Link href="#" className="font-medium text-gray-600 hover:text-gray-900">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <h1 className="mb-6 max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Modern Healthcare <br />
          <span className="text-blue-600">Simplified for Everyone</span>
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-gray-600">
          Experience seamless doctor appointments, secure health records, and personalized care. Join Healthghar today.
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="#"
            className="rounded-lg bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow transition hover:bg-gray-100"
          >
            Learn More
          </Link>
        </div>
      </main>

      {/* Floating Admin Button */}
      <Link href="/admin/login" className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white shadow-xl transition hover:bg-gray-700 hover:scale-110" title="Admin Access">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
      </Link>
    </div>
  )
}
