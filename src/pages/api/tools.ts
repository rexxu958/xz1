import type { NextApiRequest, NextApiResponse } from 'next'
import { getRawJson } from '@/services/github'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    const url = process.env.GITHUB_RAW_BASE || ''
    if(!url) return res.status(500).json({ error: 'GITHUB_RAW_BASE not configured in .env' })
    const data = await getRawJson('data/tools.json')
    return res.status(200).json(data)
  }catch(e){
    return res.status(500).json({ error: 'failed', details: String(e) })
  }
}
