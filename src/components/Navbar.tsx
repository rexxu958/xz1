import Link from 'next/link'

export default function Navbar(){
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07090d]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="group">
            <span className="flex items-center gap-3">
              <img src="/logo.svg" alt="XYPHORIA" className="h-9 w-9 rounded-lg bg-white/5 p-1 ring-1 ring-red-500/40 group-hover:scale-105 transition" />
              <span className="text-lg font-semibold tracking-[0.22em] text-white">XYPHORIA</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-5 text-sm text-slate-300 ml-4">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/tools" className="hover:text-white transition">Tools</Link>
            <Link href="/categories" className="hover:text-white transition">Categories</Link>
            <Link href="/features" className="hover:text-white transition">Features</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/search" className="hidden sm:inline-flex text-sm px-3 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition">Search</Link>
          <Link href="/dashboard" className="inline-flex text-sm px-4 py-2 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white font-semibold shadow-[0_0_30px_rgba(239,68,68,0.45)] hover:scale-[1.02] transition">Owner Login</Link>
        </div>
      </div>
    </nav>
  )
}
