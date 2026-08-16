import React, { useEffect, useState } from 'react'
import useRequireAuth from '@/lib/useRequireAuth'
import { useToast } from '@/components/ToastProvider'

export default function FilesPage(){
  const { loading } = useRequireAuth()
  const toast = useToast()
  const [tools, setTools] = useState<any[]>([])
  const [message, setMessage] = useState('')

  useEffect(()=>{ fetch('/api/tools').then(r=>r.json()).then(d=>setTools(d.tools||[])) },[])

  async function deleteFile(path: string){
    if(!confirm('Delete file? This action is permanent.')) return
    const res = await fetch('/api/admin/files/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ path }) })
    if(res.ok){ setMessage('Deleted'); setTools(prev=> prev.map(t=> ({...t, files: (t.files||[]).filter((f:any)=> `tools/${t.category}/${t.slug}/${f.name}` !== path)}))); toast?.push({ title: 'Deleted', type: 'success' }) }
    else{ setMessage('Failed'); toast?.push({ title: 'Delete failed', type: 'error' }) }
  }

  if(loading) return <div className="max-w-7xl mx-auto px-6 py-12">Checking session...</div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold mb-6">File Manager</h2>
      {message && <div className="mb-4">{message}</div>}
      <div className="space-y-4">
        {tools.map(t=> (
          <div key={t.slug} className="p-4 bg-white/2 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.name} <span className="text-sm text-slate-400">({t.slug})</span></div>
                <div className="text-sm text-slate-300">{t.description}</div>
              </div>
              <div className="text-sm text-slate-300">{t.downloads || 0} downloads</div>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(t.files||[]).map((f:any)=> (
                <div key={f.name} className="p-3 bg-white/5 rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{f.name}</div>
                    <div className="text-xs text-slate-400">{(f.size/1024).toFixed(1)} KB • {f.mime}</div>
                  </div>
                  <div className="flex gap-2">
                    <a href={(process.env.NEXT_PUBLIC_SITE_URL || '') + `/api/download/${t.slug}`} className="px-3 py-1 bg-primary text-black rounded text-sm">Download</a>
                    <button onClick={()=>deleteFile(`tools/${t.category}/${t.slug}/${f.name}`)} className="px-3 py-1 bg-red-600 rounded text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
