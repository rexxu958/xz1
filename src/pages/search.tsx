import React, { useEffect, useState } from 'react'

export default function SearchPage(){
  const [q, setQ] = useState('')
  const [results, setResults] = useState<any[]>([])
  useEffect(()=>{
    if(!q) return setResults([])
    const t = setTimeout(()=>{
      fetch(`/api/search?q=${encodeURIComponent(q)}`).then(r=>r.json()).then(d=>setResults(d.results||[]))
    },250)
    return ()=>clearTimeout(t)
  },[q])
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold mb-6">Search Tools</h2>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, description, tags, author" className="w-full p-3 rounded bg-white/5 mb-6" />
      <div className="grid grid-cols-1 gap-4">
        {results.map(r=> (
          <div key={r.slug} className="p-4 bg-white/2 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-slate-300">{r.description}</div>
              </div>
              <a href={`/tools/${r.slug}`} className="text-sm px-3 py-1 bg-white/5 rounded">View</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
