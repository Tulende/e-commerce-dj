import { Env, hashPassword, issueToken, json } from '../_auth';
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try { const body = await request.json() as any; const email = String(body.email || '').trim().toLowerCase(); const password = String(body.password || '');
    if (!env.AUTH_SECRET) return json({ error: 'Server authentication is not configured.' }, 503);
    const row: any = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    if (!row || await hashPassword(password, row.password_salt) !== row.password_hash) return json({ error: 'Email atau kata sandi salah.' }, 401);
    const user = { id: row.id, fullName: row.full_name, email: row.email, role: row.role }; return json({ user, token: await issueToken(user, env.AUTH_SECRET) });
  } catch { return json({ error: 'Login gagal.' }, 500); }
};
