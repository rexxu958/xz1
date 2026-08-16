import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAdmin } from '@/lib/requireAdmin'
import { getRawJson, commitFile } from '@/services/github'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const auth = requireAdmin(req, res)
  if(!auth.ok) return res.status(auth.status || 403).json({ error: auth.message })
  try{
    const data = await getRawJson('data/categories.json')
    const categories = data.categories || []
    if(req.method === 'GET') return res.status(200).json({ categories })
    if(req.method === 'POST'){
      const { name, slug, description, color } = req.body || {}
      if(!name || !slug) return res.status(400).json({ error: 'name and slug required' })
      const exists = categories.find((c:any)=> c.slug === slug)
      if(exists) return res.status(400).json({ error: 'slug exists' })
      categories.push({ name, slug, description: description||'', color: color||'', createdAt: new Date().toISOString() })
      await commitFile('data/categories.json', JSON.stringify({ categories }, null, 2), `chore: add category ${slug}`)
      return res.status(200).json({ ok: true })
    }
    if(req.method === 'PUT'){
      const { slug, name, description, color } = req.body || {}
      const cat = categories.find((c:any)=> c.slug === slug)
      if(!cat) return res.status(404).json({ error: 'not found' })
      cat.name = name || cat.name
      cat.description = description || cat.description
      cat.color = color || cat.color
      await commitFile('data/categories.json', JSON.stringify({ categories }, null, 2), `chore: update category ${slug}`)
      return res.status(200).json({ ok: true })
    }
    if(req.method === 'DELETE'){
      const { slug } = req.body || {}
      const idx = categories.findIndex((c:any)=> c.slug === slug)
      if(idx === -1) return res.status(404).json({ error: 'not found' })
      categories.splice(idx,1)
      await commitFile('data/categories.json', JSON.stringify({ categories }, null, 2), `chore: delete category ${slug}`)
      return res.status(200).json({ ok: true })
    }
    return res.status(405).end()
  }catch(e){
    return res.status(500).json({ error: String(e) })
  }
}
