import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type Tool = {
  slug: string
  name: string
  description?: string
  icon?: string
  category?: string
  downloads?: number
  rawUrl?: string
}

export default function ToolDetail(){
  const r = useRouter()
  const { slug } = r.query
  const [tool, setTool] = useState<Tool | null>(null)

  useEffect(()=>{
    if(!slug) return
    fetch('/api/tools')
      .then(r=>r.json())
      .then(data=>{
        const t = (data.tools||[]).find((x: Tool)=> x.slug === slug)
        setTool(t || null)
      })
  },[slug])

  if(!tool) return <div className="max-w-4xl mx-auto px-6 py-12">Tool not found</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-white/5 rounded flex items-center justify-center">{tool.icon? <img src={tool.icon} alt={tool.name} className="w-16 h-16"/>: '🔧'}</div>
        <div>
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <p className="text-sm text-slate-300">{tool.category} • v{(tool as any).version || '1.0'}</p>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-slate-300">{tool.description}</p>
        <div className="mt-6 flex gap-3">
          <a href={`/api/download/${tool.slug}`} className="px-4 py-2 bg-primary rounded text-black">Download</a>
          {tool.rawUrl && <a href={tool.rawUrl} target="_blank" rel="noreferrer" className="px-4 py-2 border rounded">Raw</a>}
        </div>
      </div>
    </div>
  )
}
