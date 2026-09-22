import { Env, hashPassword, issueToken, json, randomValue } from '../_auth';
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    const body = await request.json() as any; const fullName = String(body.fullName || '').trim(); const email = String(body.email || '').trim().toLowerCase(); const password = String(body.password || ''); const role = body.role === 'admin' ? 'admin' : 'customer';
    if (!env.AUTH_SECRET || !env.ADMIN_SETUP_CODE) return json({ error: 'Server authentication is not configured.' }, 503);
    if (fullName.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return json({ error: 'Nama, email valid, dan kata sandi minimal 8 karakter wajib diisi.' }, 400);
    if (role === 'admin' && body.adminCode !== env.ADMIN_SETUP_CODE) return json({ error: 'Kode undangan admin tidak valid.' }, 403);
    const exists = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first(); if (exists) return json({ error: 'Email sudah terdaftar.' }, 409);
    const id = crypto.randomUUID(); const salt = randomValue(); const passwordHash = await hashPassword(password, salt);
    await env.DB.prepare('INSERT INTO users (id, full_name, email, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?, ?)').bind(id, fullName, email, passwordHash, salt, role).run();
    const user = { id, fullName, email, role }; return json({ user, token: await issueToken(user, env.AUTH_SECRET) }, 201);
  } catch { return json({ error: 'Pendaftaran gagal.' }, 500); }
};
