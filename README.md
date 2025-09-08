# BlueWhite Shop — Vue 3 + Pinia + Vue Router + Bootstrap 5

ฟีเจอร์: KPI Dashboard, Filter (Category > Brand + ช่วงราคา), Sort by Price, รายการสินค้าเป็นการ์ด, หน้า Detail + Related, ตะกร้า (Modal), Checkout + Payment + คำนวณราคา, Order Tracking

## Run
```bash
npm i
npm run dev
# build & preview
npm run build
npm run preview
```

## Env
- `.env.development` → `VITE_API_BASE=/api` (dev proxy)
- `.env.production` → `VITE_API_BASE=http://54.169.154.143:3452`

## Deploy
- GitHub Pages: ใช้ workflow ที่ให้มาใน `.github/workflows/deploy.yml`
- Vercel: Framework = Vite, Build = `npm run build`, Output = `dist`  
  ถ้าเจอ CORS ให้ตั้ง `VITE_API_BASE=/api` และใช้ไฟล์ `api/proxy.js`
