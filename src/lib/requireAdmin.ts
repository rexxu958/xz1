import { NextApiRequest, NextApiResponse } from 'next'
import { getTokenFromReq, verifySession } from './auth'

export function requireAdmin(req: NextApiRequest, res: NextApiResponse){
  const token = getTokenFromReq(req)
  if(!token) return { ok: false, status: 401, message: 'not_authenticated' }
  const payload = verifySession(token as string)
  if(!payload) return { ok: false, status: 401, message: 'invalid_token' }
  return { ok: true, user: payload }
}
