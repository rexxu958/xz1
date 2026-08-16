import axios from 'axios'
import fs from 'fs'
import pathLib from 'path'

const OWNER = process.env.GITHUB_OWNER || ''
const REPO = process.env.GITHUB_REPOSITORY || ''
const BRANCH = process.env.GITHUB_BRANCH || 'main'
const TOKEN = process.env.GITHUB_TOKEN || ''

export const RAW_BASE = OWNER && REPO ? `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/` : (process.env.GITHUB_RAW_BASE || '')

export async function getRawJson(p: string){
  // prefer GitHub raw if configured
  if(RAW_BASE){
    const url = `${RAW_BASE}${p}`
    const r = await axios.get(url)
    return r.data
  }
  // fallback to local data folder
  const localPath = pathLib.join(process.cwd(), p)
  if(!fs.existsSync(localPath)) throw new Error(`file not found: ${localPath}`)
  const content = fs.readFileSync(localPath, 'utf8')
  return JSON.parse(content)
}

async function githubRequest(method: string, apiPath: string, data?: any){
  if(!TOKEN) throw new Error('GITHUB_TOKEN not configured')
  const url = `https://api.github.com${apiPath}`
  const headers = { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github.v3+json' }
  const r = await axios({ method, url, data, headers })
  return r.data
}

export async function incrementDownloadAndCommit(slug: string){
  const toolsPath = 'data/tools.json'
  const statsPath = 'data/statistics.json'
  if(TOKEN){
    // GitHub commit flow: update tools.json
    const toolsUrl = `${RAW_BASE}${toolsPath}`
    const tools = (await axios.get(toolsUrl)).data
    const idx = (tools.tools||[]).findIndex((t: any)=> t.slug === slug)
    if(idx === -1) throw new Error('tool not found')
    tools.tools[idx].downloads = (tools.tools[idx].downloads || 0) + 1
    // update tools.json
    const apiGet = `/repos/${OWNER}/${REPO}/contents/${toolsPath}?ref=${BRANCH}`
    const fileData: any = await githubRequest('get', apiGet)
    const sha = fileData.sha
    const content = Buffer.from(JSON.stringify(tools, null, 2)).toString('base64')
    const apiPut = `/repos/${OWNER}/${REPO}/contents/${toolsPath}`
    const message = `chore: increment download for ${slug}`
    await githubRequest('put', apiPut, { message, content, sha, branch: BRANCH })
    // append to statistics.json
    try{
      const statsUrl = `${RAW_BASE}${statsPath}`
      const stats = (await axios.get(statsUrl)).data
      const rec = { slug, ts: new Date().toISOString() }
      stats.statistics = stats.statistics || []
      stats.statistics.push(rec)
      const apiGetStats = `/repos/${OWNER}/${REPO}/contents/${statsPath}?ref=${BRANCH}`
      const statsData: any = await githubRequest('get', apiGetStats)
      const shaStats = statsData.sha
      const contentStats = Buffer.from(JSON.stringify(stats, null, 2)).toString('base64')
      await githubRequest('put', `/repos/${OWNER}/${REPO}/contents/${statsPath}`, { message: `chore: stats add ${slug}`, content: contentStats, sha: shaStats, branch: BRANCH })
    }catch(e){
      // ignore stats errors
    }
    return { ok: true }
  }
  // local fallback (for testing without token)
  const localPath = pathLib.join(process.cwd(), toolsPath)
  if(!fs.existsSync(localPath)) throw new Error('local tools.json not found')
  const raw = fs.readFileSync(localPath, 'utf8')
  const tools = JSON.parse(raw)
  const idx = (tools.tools||[]).findIndex((t: any)=> t.slug === slug)
  if(idx === -1) throw new Error('tool not found')
  tools.tools[idx].downloads = (tools.tools[idx].downloads || 0) + 1
  fs.writeFileSync(localPath, JSON.stringify(tools, null, 2), 'utf8')
  // append to local statistics.json
  const localStatsPath = pathLib.join(process.cwd(), statsPath)
  let stats = { statistics: [] as any[] }
  if(fs.existsSync(localStatsPath)){
    try{ stats = JSON.parse(fs.readFileSync(localStatsPath, 'utf8')) }catch(e){}
  }
  stats.statistics = stats.statistics || []
  stats.statistics.push({ slug, ts: new Date().toISOString() })
  fs.writeFileSync(localStatsPath, JSON.stringify(stats, null, 2), 'utf8')
  return { ok: true }
}

export async function commitFile(p: string, contentRaw: string | Buffer, message: string){
  // If token available, write via GitHub API
  if(TOKEN){
    const apiGet = `/repos/${OWNER}/${REPO}/contents/${p}?ref=${BRANCH}`
    const encode = (input: string | Buffer) => {
      if(Buffer.isBuffer(input)) return input.toString('base64')
      return Buffer.from(input).toString('base64')
    }
    try{
      const fileData: any = await githubRequest('get', apiGet)
      const sha = fileData.sha
      const content = encode(contentRaw)
      const apiPut = `/repos/${OWNER}/${REPO}/contents/${p}`
      return githubRequest('put', apiPut, { message, content, sha, branch: BRANCH })
    }catch(e){
      const content = Buffer.isBuffer(contentRaw) ? contentRaw.toString('base64') : Buffer.from(String(contentRaw)).toString('base64')
      const apiPut = `/repos/${OWNER}/${REPO}/contents/${p}`
      return githubRequest('put', apiPut, { message, content, branch: BRANCH })
    }
  }
  // local fallback: write to workspace data folder
  const localFullPath = pathLib.join(process.cwd(), p)
  const dir = pathLib.dirname(localFullPath)
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const toWrite = Buffer.isBuffer(contentRaw) ? contentRaw : Buffer.from(String(contentRaw))
  // If p points to a JSON data file under data/, decode base64 if needed
  if(p.endsWith('.json')){
    let contentStr = toWrite.toString('utf8')
    try{
      // if contentRaw is base64, try decode
      const maybe = Buffer.from(contentStr, 'base64').toString('utf8')
      JSON.parse(maybe)
      contentStr = maybe
    }catch(e){
      // keep original
    }
    fs.writeFileSync(localFullPath, contentStr, 'utf8')
  }else{
    fs.writeFileSync(localFullPath, toWrite)
  }
  return { ok: true, path: localFullPath }
}

export async function deleteFile(p: string, message = 'chore: delete file'){
  if(TOKEN){
    const apiGet = `/repos/${OWNER}/${REPO}/contents/${p}?ref=${BRANCH}`
    const fileData: any = await githubRequest('get', apiGet)
    const sha = fileData.sha
    const apiDel = `/repos/${OWNER}/${REPO}/contents/${p}`
    return githubRequest('delete', apiDel, { message, sha, branch: BRANCH })
  }
  const localFullPath = pathLib.join(process.cwd(), p)
  if(fs.existsSync(localFullPath)){
    fs.unlinkSync(localFullPath)
    return { ok: true }
  }
  throw new Error('file not found')
}
