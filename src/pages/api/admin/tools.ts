import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/lib/requireAdmin'
import { getRawJson, commitFile } from '@/services/github'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const auth = requireAdmin(req, res)
  if(!auth.ok) return res.status(auth.status || 403).json({ error: auth.message })
  try{
    const data = await getRawJson('data/tools.json')
    const tools = data.tools || []
    if(req.method === 'GET') return res.status(200).json({ tools })
    if(req.method === 'POST'){
      const payload = req.body || {}
      if(!payload.slug) return res.status(400).json({ error: 'slug required' })
      const exists = tools.find((t:any)=> t.slug === payload.slug)
      if(exists) return res.status(400).json({ error: 'slug exists' })
      const now = new Date().toISOString()
      const meta = { ...payload, createdAt: now, updatedAt: now }
      tools.push(meta)
      await commitFile('data/tools.json', JSON.stringify({ tools }, null, 2), `chore: add tool ${payload.slug}`)
      return res.status(200).json({ ok: true, tool: meta })
    }
    if(req.method === 'PUT'){
      const payload = req.body || {}
      const slug = payload.slug
      const idx = tools.findIndex((t:any)=> t.slug === slug)
      if(idx === -1) return res.status(404).json({ error: 'not found' })
      tools[idx] = { ...tools[idx], ...payload, updatedAt: new Date().toISOString() }
      await commitFile('data/tools.json', JSON.stringify({ tools }, null, 2), `chore: update tool ${slug}`)
      return res.status(200).json({ ok: true, tool: tools[idx] })
    }
    if(req.method === 'DELETE'){
      const { slug } = req.body || {}
      const idx = tools.findIndex((t:any)=> t.slug === slug)
      if(idx === -1) return res.status(404).json({ error: 'not found' })
      tools.splice(idx,1)
      await commitFile('data/tools.json', JSON.stringify({ tools }, null, 2), `chore: delete tool ${slug}`)
      return res.status(200).json({ ok: true })
    }
    return res.status(405).end()
  }catch(e){
    return res.status(500).json({ error: String(e) })
  }
}
