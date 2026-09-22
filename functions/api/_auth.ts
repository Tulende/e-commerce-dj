export interface Env { DB: any; AUTH_SECRET: string; ADMIN_SETUP_CODE: string; }
export interface SessionUser { id: string; fullName: string; email: string; role: 'admin' | 'customer'; exp: number; }
const encoder = new TextEncoder();
const base64Url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromBase64Url = (value: string) => Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
const hash = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return base64Url(new Uint8Array(digest));
};
export const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
export const hashPassword = async (password: string, salt: string) => {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' }, key, 256);
  return base64Url(new Uint8Array(bits));
};
export const randomValue = () => base64Url(crypto.getRandomValues(new Uint8Array(24)));
export const issueToken = async (user: Omit<SessionUser, 'exp'>, secret: string) => {
  const payload = base64Url(encoder.encode(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 })));
  return `${payload}.${await hash(`${payload}.${secret}`)}`;
};
export const getUser = async (request: Request, secret: string): Promise<SessionUser | null> => {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || !secret) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || signature !== await hash(`${payload}.${secret}`)) return null;
  try { const user = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as SessionUser; return user.exp > Date.now() / 1000 ? user : null; } catch { return null; }
};
export const requireAdmin = async (request: Request, secret: string) => {
  const user = await getUser(request, secret); return user?.role === 'admin' ? user : null;
};
