import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/lib/requireAdmin'
import { getRawJson } from '@/services/github'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const auth = requireAdmin(req, res)
  if(!auth.ok) return res.status(auth.status || 403).json({ error: auth.message })
  try{
    const stats = await getRawJson('data/statistics.json').catch(()=> ({ statistics: [] }))
    return res.status(200).json(stats)
  }catch(e){
    return res.status(500).json({ error: String(e) })
  }
}
