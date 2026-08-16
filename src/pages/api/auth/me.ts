import type { NextApiRequest, NextApiResponse } from 'next'
import { getTokenFromReq, verifySession } from '@/lib/auth'

export default function handler(req: NextApiRequest, res: NextApiResponse){
  const token = getTokenFromReq(req)
  if(!token) return res.status(401).json({ error: 'not_authenticated' })
  const payload = verifySession(token)
  if(!payload) return res.status(401).json({ error: 'invalid' })
  return res.status(200).json({ user: payload })
}
