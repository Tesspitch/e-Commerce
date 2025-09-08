export default async function handler(req, res) {
  const upstream = 'http://54.169.154.143:3452'
  const url = upstream + req.url.replace(/^\/api/, '')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    return res.status(200).end()
  }

  const headers = { ...req.headers }; delete headers.host
  const resp = await fetch(url, {
    method: req.method,
    headers,
    body: ['GET','HEAD'].includes(req.method) ? undefined : req
  })

  res.status(resp.status)
  resp.headers.forEach((v, k) => {
    if (k.toLowerCase() === 'content-encoding') return
    res.setHeader(k, v)
  })
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')

  const buf = Buffer.from(await resp.arrayBuffer())
  res.end(buf)
}
