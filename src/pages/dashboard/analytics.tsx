import React, { useEffect, useState } from 'react'
import DashboardSidebar from '@/components/DashboardSidebar'
import useRequireAuth from '@/lib/useRequireAuth'
import ChartSparkline from '@/components/ChartSparkline'

export default function Analytics(){
  const { loading } = useRequireAuth()
  const [tools, setTools] = useState<any[]>([])
  const [activity, setActivity] = useState<any[]>([])

  useEffect(()=>{ fetch('/api/tools').then(r=>r.json()).then(d=>setTools(d.tools||[])) },[])
  useEffect(()=>{ fetch('/api/admin/activity').then(r=>r.json()).then(d=>setActivity(d.activity||[])) },[])

  if(loading) return <div className="max-w-7xl mx-auto px-6 py-12">Checking session...</div>

  const totalDownloads = tools.reduce((s,t)=> s + (t.downloads||0), 0)
  const totalTools = tools.length
  const downloadsSeries = tools.map(t=> t.downloads || 0)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
      <DashboardSidebar />
      <div className="md:col-span-3 space-y-6">
        <h2 className="text-2xl font-semibold">Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white/3 rounded">
            <div className="text-sm text-slate-300">Total Tools</div>
            <div className="text-2xl font-bold">{totalTools}</div>
          </div>
          <div className="p-4 bg-white/3 rounded">
            <div className="text-sm text-slate-300">Total Downloads</div>
            <div className="text-2xl font-bold">{totalDownloads}</div>
          </div>
          <div className="p-4 bg-white/3 rounded">
            <div className="text-sm text-slate-300">Top Downloads</div>
            <div className="text-2xl font-bold">{Math.max(...downloadsSeries,0)}</div>
          </div>
        </div>

        <div className="p-4 bg-white/3 rounded">
          <h3 className="font-semibold mb-2">Downloads Sparkline</h3>
          <ChartSparkline series={downloadsSeries} />
        </div>

        <div className="p-4 bg-white/3 rounded">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <div className="space-y-2">
            {activity.slice(0,10).map((a:any,i:number)=> (
              <div key={i} className="p-2 bg-white/5 rounded flex items-center justify-between">
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
    </div>
  )
}
