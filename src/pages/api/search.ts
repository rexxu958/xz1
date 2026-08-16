import type { NextApiRequest, NextApiResponse } from 'next'
import { getRawJson } from '@/services/github'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const q = (req.query.q || '').toString().toLowerCase()
  try{
    const data = await getRawJson('data/tools.json')
    const tools = data.tools || []
    if(!q) return res.status(200).json({ results: tools })
    const results = tools.filter((t: any)=> {
      return [t.name, t.description, t.category, (t.tags||[]).join(' '), t.author].join(' ').toLowerCase().includes(q)
    })
    return res.status(200).json({ results })
  }catch(e){
    return res.status(500).json({ error: String(e) })
  }
}
