import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type Tool = {
  slug: string
  name: string
  description?: string
  icon?: string
  category?: string
  downloads?: number
}

export default function ToolsPage(){
  const [tools, setTools] = useState<Tool[]>([])

  useEffect(()=>{
    fetch('/api/tools')
      .then(r=>r.json())
      .then(data=>setTools(data.tools || []))
  },[])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold mb-6">All Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(t=> (
          <div key={t.slug} className="p-4 bg-white/2 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center">{t.icon? <img src={t.icon} alt={t.name} className="w-10 h-10"/>: '🔧'}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-slate-300">{t.description}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/tools/${t.slug}`} className="px-3 py-1 bg-white/5 rounded text-sm">View</Link>
                  <a href={`/api/download/${t.slug}`} className="px-3 py-1 bg-primary rounded text-black text-sm">Download</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
