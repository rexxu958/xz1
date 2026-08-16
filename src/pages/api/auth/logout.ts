import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  res.setHeader('Set-Cookie', `xyporia_token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict`)
  return res.status(200).json({ ok: true })
}
