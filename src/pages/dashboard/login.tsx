import React, { useState } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const r = useRouter()

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setMessage('')
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }), credentials: 'include' })
    if(res.ok){
      setMessage('Login successful')
      r.replace('/dashboard')
    }else{
      const j = await res.json().catch(()=>null)
      setMessage(j?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white/3 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Owner Login — XYPHORIA</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm text-slate-300">Username</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full p-2 rounded bg-white/5" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 rounded bg-white/5" />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 bg-primary text-black rounded">Login</button>
            <a href="/" className="text-sm text-slate-300">Back to home</a>
          </div>
          {message && <div className="text-sm mt-2">{message}</div>}
        </form>
      </div>
    </div>
  )
}
