import type { NextApiRequest, NextApiResponse } from 'next'
import { getRawJson, incrementDownloadAndCommit } from '@/services/github'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { slug } = req.query
  if(!slug || Array.isArray(slug)) return res.status(400).json({ error: 'invalid' })
  try{
    const tools = (await getRawJson('data/tools.json')).tools || []
    const t = tools.find((x: any)=> x.slug === slug)
    if(!t) return res.status(404).json({ error: 'not found' })
    const rawUrl = t.rawUrl || t.raw_url || t.downloadUrl
    if(!rawUrl) return res.status(404).json({ error: 'no raw url' })
    try{
      await incrementDownloadAndCommit(String(slug))
    }catch(err){
    }
    return res.redirect(rawUrl)
  }catch(e){
    return res.status(500).json({ error: 'failed', details: String(e) })
  }
}
