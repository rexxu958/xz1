import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type Category = { slug: string; name: string; description?: string }

export default function CategoriesPage(){
  const [cats, setCats] = useState<Category[]>([])
  useEffect(()=>{ fetch('/api/categories').then(r=>r.json()).then(d=>setCats(d.categories || [])) },[])
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold mb-6">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {cats.map(c=> (
          <Link key={c.slug} href={`/categories/${c.slug}`} className="p-4 bg-white/2 rounded">
            <div className="font-semibold">{c.name}</div>
            <div className="text-sm text-slate-300">{c.description}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
