import { Env, hashPassword, issueToken, json, randomValue } from '../_auth';

const DEFAULT_AUTH_SECRET = 'soundrent-auth-secret-2026-xK9mP3nQ7rL2vB8wY4tH6jE1';
const DEFAULT_ADMIN_SETUP_CODE = 'SOUNDRENT-ADMIN-SETUP-2026';

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const authSecret = env.AUTH_SECRET || DEFAULT_AUTH_SECRET;
    const adminSetupCode = env.ADMIN_SETUP_CODE || DEFAULT_ADMIN_SETUP_CODE;

    const body = await request.json() as any;
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const role = body.role === 'admin' ? 'admin' : 'customer';

    if (fullName.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      return json({ error: 'Nama, email valid, dan kata sandi minimal 8 karakter wajib diisi.' }, 400);
    }

    if (role === 'admin' && body.adminCode !== adminSetupCode) {
      return json({ error: 'Kode undangan admin tidak valid.' }, 403);
    }

    if (env.DB) {
      // Pastikan tabel users sudah terbuat di Cloudflare D1
      try {
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            password_salt TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin', 'customer')),
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `).run();
      } catch (_) {}

      const exists = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
      if (exists) return json({ error: 'Email sudah terdaftar.' }, 409);

      const id = crypto.randomUUID();
      const salt = randomValue();
      const passwordHash = await hashPassword(password, salt);

      await env.DB.prepare(
        'INSERT INTO users (id, full_name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(id, fullName, email, passwordHash, salt, role).run();

      const user = { id, fullName, email, role: role as 'admin' | 'customer' };
      return json({ user, token: await issueToken(user, authSecret) }, 201);
    }

    // Fallback jika DB D1 belum terikat
    const id = crypto.randomUUID();
    const user = { id, fullName, email, role: role as 'admin' | 'customer' };
    return json({ user, token: await issueToken(user, authSecret) }, 201);
  } catch (err: any) {
    return json({ error: err.message || 'Pendaftaran gagal.' }, 500);
  }
};
