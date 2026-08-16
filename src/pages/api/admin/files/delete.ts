import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/lib/requireAdmin'
import { deleteFile, getRawJson, commitFile } from '@/services/github'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const auth = requireAdmin(req, res)
  if(!auth.ok) return res.status(auth.status || 403).json({ error: auth.message })
  if(req.method !== 'POST') return res.status(405).end()
  const { path } = req.body || {}
  if(!path) return res.status(400).json({ error: 'path required' })
  try{
    await deleteFile(path, `chore: deleted by ${(auth.user as any)?.username || 'owner'}`)
    // log activity (best-effort)
    try{
      const actData = await getRawJson('data/activity.json').catch(()=> ({ activity: [] }))
      const activity = actData.activity || []
      const entry = { action: 'DeleteFile', target: path, status: 'ok', ts: new Date().toISOString(), by: (auth.user as any)?.username || 'owner' }
      activity.push(entry)
      await commitFile('data/activity.json', JSON.stringify({ activity }, null, 2), `chore: log activity delete ${path}`)
    }catch(e){}
    return res.status(200).json({ ok: true })
  }catch(e){
    return res.status(500).json({ error: String(e) })
  }
}
