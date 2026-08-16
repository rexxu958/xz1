import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyPassword, signSession } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const { username, password } = req.body || {}
  const OWNER = process.env.OWNER_USERNAME || ''
  const OWNER_HASH = process.env.OWNER_PASSWORD_HASH || ''
  if(!OWNER || !OWNER_HASH) return res.status(500).json({ error: 'owner not configured' })
  if(username !== OWNER) return res.status(401).json({ error: 'invalid' })
  const ok = verifyPassword(password, OWNER_HASH)
  if(!ok) return res.status(401).json({ error: 'invalid' })
  const token = signSession({ username })
  res.setHeader('Set-Cookie', `xyporia_token=${token}; HttpOnly; Path=/; Max-Age=${7*24*3600}; Secure; SameSite=Strict`)
  return res.status(200).json({ ok: true })
}
