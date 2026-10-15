import * as authLogin    from '../functions/api/auth/login';
import * as authMe       from '../functions/api/auth/me';
import * as authRegister from '../functions/api/auth/register';
import * as orders       from '../functions/api/orders/index';
import * as product      from '../functions/api/products/[id]';
import * as products     from '../functions/api/products/index';
import * as promotions   from '../functions/api/promotions/index';
import * as paymentToken        from '../functions/api/payment/token';
import * as paymentNotification from '../functions/api/payment/notification';
import * as paymentStatus       from '../functions/api/payment/status';

// Type Fetcher didefinisikan manual agar tidak butuh @cloudflare/workers-types
interface Fetcher { fetch(input: RequestInfo, init?: RequestInit): Promise<Response>; }
interface Env {
  ASSETS: Fetcher;
  DB: any;
  AUTH_SECRET: string;
  ADMIN_SETUP_CODE: string;
  MIDTRANS_SERVER_KEY: string;
}

const notFound = () => new Response(
  JSON.stringify({ error: 'API route not found.' }),
  { status: 404, headers: { 'Content-Type': 'application/json' } }
);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    // Semua request non-API → sajikan dari static assets (React SPA)
    if (!pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

    // CORS preflight
    if (request.method === 'OPTIONS') return new Response(null, { status: 204 });

    // ── Auth routes ──────────────────────────────────────────────────────────
    if (pathname === '/api/auth/register' && request.method === 'POST')
      return authRegister.onRequestPost({ request, env });
    if (pathname === '/api/auth/login' && request.method === 'POST')
      return authLogin.onRequestPost({ request, env });
    if (pathname === '/api/auth/me' && request.method === 'GET')
      return authMe.onRequestGet({ request, env });

    // ── Payment routes ───────────────────────────────────────────────────────
    if (pathname === '/api/payment/token') {
      if (request.method === 'OPTIONS') return paymentToken.onRequestOptions();
      if (request.method === 'POST')    return paymentToken.onRequestPost({ request, env });
    }
    if (pathname === '/api/payment/notification') {
      if (request.method === 'OPTIONS') return paymentNotification.onRequestOptions();
      if (request.method === 'POST')    return paymentNotification.onRequestPost({ request, env });
    }
    if (pathname === '/api/payment/status') {
      if (request.method === 'OPTIONS') return paymentStatus.onRequestOptions();
      if (request.method === 'GET')     return paymentStatus.onRequestGet({ request, env });
    }

    // ── Orders ───────────────────────────────────────────────────────────────
    if (pathname === '/api/orders') {
      if (request.method === 'GET')  return orders.onRequestGet({ request, env });
      if (request.method === 'POST') return orders.onRequestPost({ request, env });
    }

    // ── Promotions ───────────────────────────────────────────────────────────
    if (pathname === '/api/promotions' && request.method === 'GET')
      return promotions.onRequestGet({ env });

    // ── Products ─────────────────────────────────────────────────────────────
    if (pathname === '/api/products') {
      if (request.method === 'GET')  return products.onRequestGet({ env });
      if (request.method === 'POST') return products.onRequestPost({ request, env });
    }
    const productMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
    if (productMatch) {
      const params = { id: decodeURIComponent(productMatch[1]) };
      if (request.method === 'GET')    return product.onRequestGet({ params, env });
      if (request.method === 'PUT')    return product.onRequestPut({ params, request, env });
      if (request.method === 'DELETE') return product.onRequestDelete({ params, request, env });
    }

    return notFound();
  },
};
