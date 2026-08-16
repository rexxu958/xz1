import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextApiRequest } from 'next'

const SECRET = process.env.SESSION_SECRET || 'change_this'

export function hashPassword(password: string){
  return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hash: string){
  return bcrypt.compareSync(password, hash)
}

export function signSession(payload: any){
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifySession(token: string){
  try{ return jwt.verify(token, SECRET) }catch(e){ return null }
}

export function getTokenFromReq(req: NextApiRequest){
  const cookie = req.headers.cookie || ''
  const match = cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith('xyporia_token='))
  if(!match) return null
  return match.split('=')[1]
}
