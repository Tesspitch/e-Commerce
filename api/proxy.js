// api/proxy.js
export default async function handler(req, res) {
  try {
    // Base URL ของ backend จริง (ตั้งใน Vercel ENV ชื่อ API_BASE_URL)
    const target = process.env.API_BASE_URL; // เช่น http://54.169.154.143:3452

    // ตัด prefix /api/proxy ออก แล้วต่อท้ายไปที่ backend
    const upstreamURL = target + req.url.replace(/^\/api\/proxy/, '');

    // ก๊อป headers แต่ลบ host ออก
    const headers = { ...req.headers };
    delete headers.host;

    // รองรับ preflight (ถ้ามี)
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(200).end();
    }

    const init = { method: req.method, headers };
    // ใส่ body สำหรับเมธอดที่มี body
    if (!['GET', 'HEAD'].includes(req.method)) init.body = req;

    const r = await fetch(upstreamURL, init);

    // ส่ง headers/สถานะกลับ
    r.headers.forEach((v, k) => res.setHeader(k, v));
    res.status(r.status);

    const buf = Buffer.from(await r.arrayBuffer());
    res.send(buf);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', detail: String(err) });
  }
}
