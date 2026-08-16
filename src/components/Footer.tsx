import Link from 'next/link'

export default function Footer(){
  return (
    <footer className="mt-12 border-t border-white/6">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img src="/logo.svg" alt="XYPHORIA" className="h-8 mb-4" />
          <p className="text-sm text-slate-400">Tools, code and innovation.</p>
        </div>
        <div className="text-sm text-slate-300">
          <h4 className="font-semibold mb-2">Products</h4>
          <ul className="space-y-1">
            <li><Link href="/tools">Tools</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>
        <div className="text-sm text-slate-300">
          <h4 className="font-semibold mb-2">Resources</h4>
          <ul className="space-y-1">
            <li><a href="#">GitHub</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/6 mt-4 py-4 text-center text-sm text-slate-500">© {new Date().getFullYear()} XYPHORIA</div>
    </footer>
  )
}
