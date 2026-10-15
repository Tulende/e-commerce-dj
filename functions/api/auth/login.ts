import { Env, hashPassword, issueToken, json } from '../_auth';

const DEFAULT_AUTH_SECRET = 'soundrent-auth-secret-2026-xK9mP3nQ7rL2vB8wY4tH6jE1';

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const authSecret = env.AUTH_SECRET || DEFAULT_AUTH_SECRET;
    const body = await request.json() as any;
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!env.DB) {
      return json({ error: 'Database belum terhubung.' }, 500);
    }

    const row: any = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    if (!row || await hashPassword(password, row.password_salt) !== row.password_hash) {
      return json({ error: 'Email atau kata sandi salah.' }, 401);
    }

    const user = { id: row.id, fullName: row.full_name, email: row.email, role: row.role };
    return json({ user, token: await issueToken(user, authSecret) });
  } catch {
    return json({ error: 'Login gagal.' }, 500);
  }
};
