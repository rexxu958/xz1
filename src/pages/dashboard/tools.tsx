import { useEffect, useState } from 'react'
import DashboardSidebar from '@/components/DashboardSidebar'
import useRequireAuth from '@/lib/useRequireAuth'
import Modal from '@/components/Modal'
import { useToast } from '@/components/ToastProvider'

export default function ToolsAdmin(){
  const { loading } = useRequireAuth()
  const [tools, setTools] = useState<any[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const toast = useToast()

  useEffect(()=>{ fetch('/api/admin/tools').then(r=>r.json()).then(d=>setTools(d.tools||[])) },[])
  if(loading) return <div className="max-w-7xl mx-auto px-6 py-12">Checking session...</div>

  function openEdit(t:any){ setSelected(t); setEditOpen(true) }

  async function save(){
    if(!selected) return
    const res = await fetch('/api/admin/tools', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(selected) })
    if(res.ok){ toast?.push({ title: 'Saved', type: 'success' }); setEditOpen(false); const j = await res.json(); setTools(prev=> prev.map(p=> p.slug===j.tool.slug? j.tool: p)) }
    else{ const j = await res.json().catch(()=>null); toast?.push({ title: 'Error', type: 'error', description: j?.error || 'Failed to save' }) }
  }

  async function remove(slug:string){
    if(!confirm('Delete tool?')) return
    const res = await fetch('/api/admin/tools', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ slug }) })
    if(res.ok){ setTools(prev=> prev.filter(t=> t.slug !== slug)); toast?.push({ title: 'Deleted', type: 'success' }) }
    else toast?.push({ title: 'Error', type: 'error', description: 'Failed to delete' })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
      <DashboardSidebar />
      <div className="md:col-span-3">
        <h2 className="text-2xl font-semibold mb-4">Tools Management</h2>
        <div className="space-y-3">
          {tools.map(t=> (
            <div key={t.slug} className="p-3 bg-white/5 rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{t.name} <span className="text-xs text-slate-400">{t.slug}</span></div>
                <div className="text-sm text-slate-300">{t.description}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>openEdit(t)} className="px-3 py-1 bg-white/6 rounded">Edit</button>
                <button onClick={()=>remove(t.slug)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={editOpen} onClose={()=>setEditOpen(false)} title={selected? 'Edit Tool' : ''}>
        {selected && (
          <div>
            <label className="text-sm text-slate-300">Name</label>
            <input value={selected.name} onChange={e=> setSelected({...selected, name: e.target.value})} className="w-full p-2 rounded bg-white/5 mb-2" />
            <label className="text-sm text-slate-300">Description</label>
            <textarea value={selected.description} onChange={e=> setSelected({...selected, description: e.target.value})} className="w-full p-2 rounded bg-white/5 mb-2" />
            <div className="flex gap-2 justify-end">
              <button onClick={()=>setEditOpen(false)} className="px-3 py-1">Cancel</button>
              <button onClick={save} className="px-3 py-1 bg-primary text-black rounded">Save</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
