import useRequireAuth from '@/lib/useRequireAuth'

export default function Dashboard(){
  const { loading, user } = useRequireAuth()
  if(loading) return <div className="max-w-7xl mx-auto px-6 py-12">Checking session...</div>
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold">Owner Dashboard</h2>
      <div className="mt-6 text-slate-300">Welcome back, {user?.username || 'owner'}. Use the sidebar to manage tools, files, and settings.</div>
    </div>
  )
}
