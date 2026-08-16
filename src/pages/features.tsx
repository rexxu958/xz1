import Link from 'next/link'

const features = [
  {
    title: 'Secure owner workspace',
    description: 'Protect owner access with authenticated sessions, clear authorization, GitHub-first data flows, and maintenance controls.',
    accent: 'from-red-500/20 to-orange-500/5'
  },
  {
    title: 'GitHub-powered publishing',
    description: 'Databases and public assets are served from a structured GitHub repository, with raw URLs ready for download and source access.',
    accent: 'from-orange-500/20 to-red-500/5'
  },
  {
    title: 'Live analytics',
    description: 'Track downloads, feature status, tool growth, and activity with clear visibility into platform performance.',
    accent: 'from-red-500/20 to-rose-500/5'
  },
  {
    title: 'Upload & manage files',
    description: 'Publish single files, folders, archives, or multi-file projects with category assignment and version tracking.',
    accent: 'from-red-500/15 to-slate-500/5'
  },
  {
    title: 'Modern search & browse',
    description: 'Search tools by name, category, tag, author, format, and description to surface the right asset fast.',
    accent: 'from-red-500/15 to-red-500/5'
  },
  {
    title: 'Responsive system design',
    description: 'The experience scales cleanly across desktop, tablet, and mobile without losing polish or clarity.',
    accent: 'from-orange-500/15 to-slate-500/5'
  }
]

export default function FeaturesPage(){
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <p className="text-xs font-medium tracking-[0.24em] text-red-300 uppercase">Platform features</p>
        <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-[-0.05em] text-white">Built for serious tools distribution</h1>
        <p className="mt-4 mx-auto max-w-2xl text-slate-300">XYPHORIA combines premium design, secure owner tools, GitHub storage, analytics, and real publishing workflows in one crisp platform.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className={`x-panel rounded-2xl p-6 bg-gradient-to-br ${feature.accent}`}>
            <div className="mb-4 h-10 w-10 rounded-xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-lg">✦</div>
            <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 x-panel rounded-[2rem] p-6 sm:p-8 text-center">
        <p className="text-xs font-medium tracking-[0.24em] text-red-300 uppercase">Ready to publish</p>
        <h2 className="mt-3 text-2xl sm:text-4xl font-black text-white">Launch your tool catalog with XYPHORIA</h2>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Link href="/tools" className="inline-flex items-center rounded-full bg-gradient-to-r from-red-500 via-red-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white">Browse tools</Link>
          <Link href="/dashboard" className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white">Owner login</Link>
        </div>
      </div>
    </div>
  )
}
