import type { NextApiRequest, NextApiResponse } from 'next'
import { getRawJson } from '@/services/github'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  try{
    const data = await getRawJson('data/categories.json')
    return res.status(200).json(data)
  }catch(e){
    return res.status(500).json({ error: 'failed', details: String(e) })
  }
}
