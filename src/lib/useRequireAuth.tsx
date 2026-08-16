import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function useRequireAuth(){
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const r = useRouter()

  useEffect(()=>{
    let mounted = true
    fetch('/api/auth/me', { credentials: 'include' }).then(async res=>{
      if(!mounted) return
      if(res.status === 200){ const j = await res.json(); setUser(j.user); setLoading(false); return }
      // redirect to login
      r.replace('/dashboard/login')
    }).catch(()=> r.replace('/dashboard/login'))
    return ()=>{ mounted = false }
  },[])

  return { loading, user }
}
