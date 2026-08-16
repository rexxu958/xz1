import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { requireAdmin } from '@/lib/requireAdmin'
import { commitFile, getRawJson } from '@/services/github'

export const config = { api: { bodyParser: false } }

const MAX_FILE_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 200 * 1024 * 1024) // 200MB
const ALLOWED_MIME = [
  'application/zip','application/x-zip-compressed','application/octet-stream',
  'image/png','image/jpeg','image/webp','image/svg+xml','text/plain','text/markdown',
  'application/javascript','application/json','text/html','text/css','video/mp4','application/vnd.android.package-archive','application/x-msdownload'
]

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const auth = requireAdmin(req, res)
  if(!auth.ok) return res.status(auth.status || 403).json({ error: auth.message })
  if(req.method !== 'POST') return res.status(405).end()

  const form = new formidable.IncomingForm({ multiples: true, maxFileSize: MAX_FILE_BYTES })
  form.parse(req, async (err, fields, files) => {
    if(err) return res.status(400).json({ error: 'invalid_form', details: String(err) })
    try{
      const name = String(fields.name || fields.title || '')
      const slug = String(fields.slug || '').replace(/[^a-z0-9-_]/gi, '-').toLowerCase() || name.toLowerCase().replace(/[^a-z0-9-_]/gi,'-')
      const category = String(fields.category || 'other')
      const description = String(fields.description || '')
      const version = String(fields.version || '1.0')
      const tags = String(fields.tags || '')
      const featured = String(fields.featured || '').toLowerCase() === 'true'

      const uploadedFiles: any[] = []
      const fileEntries = Array.isArray(files.file) ? files.file : (files.file ? [files.file] : [])
      for(const f of fileEntries){
        const filepath = (f as any).path || (f as any).filepath || ''
        const originalName = (f as any).name || (f as any).originalFilename || 'file'
        const mime = (f as any).type || (f as any).mimetype || 'application/octet-stream'
        const size = (f as any).size || 0
        if(size > MAX_FILE_BYTES) return res.status(400).json({ error: 'file_too_large' })
        if(!ALLOWED_MIME.includes(mime) && !originalName.toLowerCase().endsWith('.zip')) return res.status(400).json({ error: 'mime_not_allowed', mime })
        const buffer = fs.readFileSync(filepath)
        const targetPath = `tools/${category}/${slug}/${originalName}`
        try{
          await commitFile(targetPath, buffer, `chore: upload ${originalName} for ${slug}`)
        }catch(e){
          return res.status(500).json({ error: 'commit_failed', details: String(e) })
        }
        uploadedFiles.push({ name: originalName, path: targetPath, size, mime })
      }

      // update tools.json metadata
      try{
        const toolsData = await getRawJson('data/tools.json')
        const tools = toolsData.tools || []
        const existing = tools.find((t: any)=> t.slug === slug)
        const fileUrl = process.env.GITHUB_RAW_BASE ? `${process.env.GITHUB_RAW_BASE}tools/${category}/${slug}/${uploadedFiles[0].name}` : ''
        const now = new Date().toISOString()
        const meta = {
          name,
          slug,
          description,
          category,
          version,
          tags: tags.split(',').map((s:string)=>s.trim()).filter(Boolean),
          author: (auth.user as any)?.username || process.env.OWNER_USERNAME || 'owner',
          createdAt: existing ? existing.createdAt : now,
          updatedAt: now,
          size: uploadedFiles.reduce((a,b)=>a+b.size,0),
          files: uploadedFiles,
          rawUrl: fileUrl,
          downloads: existing ? existing.downloads || 0 : 0,
          status: fields.status || 'PUBLIC',
          featured
        }
        if(existing){
          Object.assign(existing, meta)
        }else{
          tools.push(meta)
        }
        const updated = { tools }
        await commitFile('data/tools.json', JSON.stringify(updated, null, 2), `chore: add/update tool ${slug}`)

      // log activity (best-effort)
      try{
        const actData = await getRawJson('data/activity.json').catch(()=> ({ activity: [] }))
        const activity = actData.activity || []
        const entry = { action: 'Upload', target: slug, status: 'ok', ts: new Date().toISOString(), by: (auth.user as any)?.username || 'owner' }
        activity.push(entry)
        await commitFile('data/activity.json', JSON.stringify({ activity }, null, 2), `chore: log activity upload ${slug}`)
      }catch(e){
        // ignore logging errors
      }
      }catch(e){
      return res.status(500).json({ error: 'update_tools_failed', details: String(e) })
      }

      return res.status(200).json({ ok: true, uploaded: uploadedFiles })
    }catch(e){
      return res.status(500).json({ error: String(e) })
    }
  })
}
