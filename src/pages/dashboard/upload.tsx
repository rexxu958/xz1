import React, { useState, useRef, useEffect } from 'react'
import useRequireAuth from '@/lib/useRequireAuth'
import { useToast } from '@/components/ToastProvider'

export default function UploadPage(){
  const { loading } = useRequireAuth()
  const toast = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('other')
  const [description, setDescription] = useState('')
  const [version, setVersion] = useState('1.0')
  const [tags, setTags] = useState('')
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(()=>{ fetch('/api/categories').then(r=>r.json()).then(d=>setCategories(d.categories||[])) },[])

  function onFiles(e: React.ChangeEvent<HTMLInputElement>){
    const list = e.target.files
    if(!list) return
    setFiles(Array.from(list))
  }

  function onDrop(e: React.DragEvent){
    e.preventDefault()
    const list = e.dataTransfer.files
    setFiles(Array.from(list))
  }

  function upload(){
    if(files.length === 0) return setMessage('No files')
    const fd = new FormData()
    fd.append('name', name || files[0].name)
    fd.append('slug', slug || (name || files[0].name).toLowerCase().replace(/[^a-z0-9-]/g,'-'))
    fd.append('category', category)
    fd.append('description', description)
    fd.append('version', version)
    fd.append('tags', tags)
    files.forEach(f=> fd.append('file', f))

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/admin/upload')
    xhr.withCredentials = true
    xhr.upload.onprogress = (ev)=>{
      if(ev.lengthComputable) setProgress(Math.round((ev.loaded/ev.total)*100))
    }
    xhr.onload = ()=>{
      if(xhr.status === 200){
        setMessage('Upload successful')
        toast?.push({ title: 'Upload', type: 'success', description: 'Upload completed' })
      }
      else{
        setMessage(`Upload failed: ${xhr.responseText}`)
        toast?.push({ title: 'Upload failed', type: 'error' })
      }
    }
    xhr.onerror = ()=>{ setMessage('Upload failed'); toast?.push({ title: 'Upload failed', type: 'error' }) }
    xhr.send(fd)
  }

  if(loading) return <div className="max-w-4xl mx-auto px-6 py-12">Checking session...</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold mb-6">Upload Tool / Files</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div onDrop={onDrop} onDragOver={(e)=>e.preventDefault()} className="border-2 border-dashed border-white/10 rounded p-6 text-center">
            <p className="text-slate-300">Drag & drop files here, or</p>
            <button onClick={()=>fileRef.current?.click()} className="mt-3 px-4 py-2 bg-white/5 rounded">Choose files</button>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={onFiles} />
            <div className="mt-4 text-sm text-slate-300">{files.map(f=> f.name).join(', ')}</div>
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-300">Tool Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 rounded bg-white/5 mb-3" />
          <label className="block text-sm text-slate-300">Slug</label>
          <input value={slug} onChange={e=>setSlug(e.target.value)} className="w-full p-2 rounded bg-white/5 mb-3" />
          <label className="block text-sm text-slate-300">Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full p-2 rounded bg-white/5 mb-3">
            <option value="other">Other</option>
            {categories.map(c=> <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <label className="block text-sm text-slate-300">Version</label>
          <input value={version} onChange={e=>setVersion(e.target.value)} className="w-full p-2 rounded bg-white/5 mb-3" />
          <label className="block text-sm text-slate-300">Tags (comma)</label>
          <input value={tags} onChange={e=>setTags(e.target.value)} className="w-full p-2 rounded bg-white/5 mb-3" />
          <label className="block text-sm text-slate-300">Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full p-2 rounded bg-white/5 mb-3" />
          <div className="flex items-center gap-3">
            <button onClick={upload} className="px-4 py-2 bg-primary text-black rounded">Upload</button>
            <div className="text-sm text-slate-400">{progress}%</div>
          </div>
          {message && <div className="mt-3 text-sm">{message}</div>}
        </div>
      </div>
    </div>
  )
}
