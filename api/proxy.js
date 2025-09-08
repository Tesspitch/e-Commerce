export default async function handler(req, res) {
  const target = 'http://54.169.154.143:3452'
  const url = target + req.url.replace(/^\/api/, '')
  const options = { method: req.method, headers: { ...req.headers } }
  if(['POST','PUT','PATCH'].includes(req.method)){
    options.body = req
  }
  const r = await fetch(url, options)
  const body = await r.text()
  res.status(r.status)
  r.headers.forEach((v,k)=> res.setHeader(k, v))
  res.send(body)
}
