import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/lib/requireAdmin'
import { getRawJson, commitFile } from '@/services/github'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const auth = requireAdmin(req, res)
  if(!auth.ok) return res.status(auth.status || 403).json({ error: auth.message })
  try{
    const data = await getRawJson('data/activity.json').catch(()=> ({ activity: [] }))
    const activity = data.activity || []
    if(req.method === 'GET') return res.status(200).json({ activity: activity.slice().reverse() })
    if(req.method === 'POST'){
      const { action, target, status } = req.body || {}
      if(!action) return res.status(400).json({ error: 'action required' })
      const entry = { action, target: target||'', status: status||'ok', ts: new Date().toISOString(), by: (auth.user as any)?.username || 'owner' }
      activity.push(entry)
      await commitFile('data/activity.json', JSON.stringify({ activity }, null, 2), `chore: add activity ${action}`)
      return res.status(200).json({ ok: true })
    }
    return res.status(405).end()
  }catch(e){
    return res.status(500).json({ error: String(e) })
  }
}
