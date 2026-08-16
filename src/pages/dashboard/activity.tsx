import React, { useEffect, useState } from 'react'
import DashboardSidebar from '@/components/DashboardSidebar'
import useRequireAuth from '@/lib/useRequireAuth'

export default function Activity(){
  const { loading } = useRequireAuth()
  const [activity, setActivity] = useState<any[]>([])

  useEffect(()=>{ fetch('/api/admin/activity').then(r=>r.json()).then(d=>setActivity(d.activity||[])) },[])
  if(loading) return <div className="max-w-7xl mx-auto px-6 py-12">Checking session...</div>
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
      <DashboardSidebar />
      <div className="md:col-span-3">
        <h2 className="text-2xl font-semibold mb-4">Activity Log</h2>
        <div className="space-y-2">
          {activity.map((a:any,i:number)=> (
            <div key={i} className="p-3 bg-white/5 rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{a.action}</div>
                <div className="text-xs text-slate-300">{a.target} • {new Date(a.ts).toLocaleString()}</div>
              </div>
              <div className="text-sm text-slate-300">{a.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
