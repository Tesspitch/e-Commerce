// api/proxy.js
export default async function handler(req, res) {
  try {
    const target = process.env.API_BASE_URL; // เช่น http://54.169.154.143:3452
    const upstream = target + req.url.replace(/^\/api\/proxy/, '');

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(200).end();
    }

    const headers = { ...req.headers }; delete headers.host;
    const init = { method: req.method, headers };
    if (!['GET','HEAD'].includes(req.method)) init.body = req;

    const r = await fetch(upstream, init);
    r.headers.forEach((v, k) => res.setHeader(k, v));
    res.status(r.status).send(Buffer.from(await r.arrayBuffer()));
  } catch (e) {
    res.status(500).json({ error: 'Proxy error', detail: String(e) });
  }
}
