import Link from 'next/link'
import dynamic from 'next/dynamic'

const Hero3D = dynamic(() => import('@/components/Hero3D'), { ssr: false })

const featureCards = [
  { title: 'GitHub-first storage', text: 'All tool metadata and public files are mirrored through GitHub-backed storage for resilient publishing.', accent: 'from-red-500/30 to-orange-500/10' },
  { title: 'Owner dashboard', text: 'Secure management for uploads, categories, maintenance, analytics, and system health.', accent: 'from-red-500/30 to-rose-500/10' },
  { title: 'Download tracking', text: 'Every download is counted, verified, and linked to the right tool record.', accent: 'from-orange-500/30 to-red-500/10' },
  { title: 'Premium UX', text: 'Dark, sharp, cinematic product design with motion, soft glow, and responsive layout.', accent: 'from-red-500/20 to-slate-500/10' }
]

export default function Home(){
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <section className="relative overflow-hidden rounded-[2rem] border border-red-500/20 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.18),_transparent_35%),linear-gradient(180deg,rgba(17,24,39,0.82),rgba(7,9,13,0.96))] px-5 py-8 sm:px-8 lg:px-10 lg:py-12 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] sm:text-xs font-medium tracking-[0.22em] text-red-200 uppercase">XYPHORIA CORE</div>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-7xl font-black tracking-[-0.06em] text-white text-balance">
              Tools.<br />Code.<br />Innovation.
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
              A premium public platform for discovering, storing, managing, downloading, and publishing tools, source code, projects, and digital assets with GitHub-backed infrastructure.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/tools" className="inline-flex items-center rounded-full bg-gradient-to-r from-red-500 via-red-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(239,68,68,0.35)] hover:scale-[1.02] transition">Explore Tools</Link>
              <Link href="/features" className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition">View Features</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">GitHub storage</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Owner tools</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Secure downloads</span>
            </div>
          </div>

          <div className="relative h-[340px] sm:h-[420px] w-full overflow-hidden rounded-[2rem] border border-red-500/20 bg-[#0a0b10]/80 x-glow">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(239,68,68,0.22),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(249,115,22,0.18),transparent_30%)]" />
            <Hero3D />
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-red-300 uppercase">Platform power</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Built for modern tools publishing</h2>
          </div>
          <Link href="/features" className="hidden sm:inline-flex text-sm text-red-200 hover:text-white">See all features →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((card) => (
            <div key={card.title} className={`x-panel rounded-2xl p-5 bg-gradient-to-br ${card.accent}`}>
              <div className="h-10 w-10 rounded-xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-lg">✦</div>
              <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{card.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
