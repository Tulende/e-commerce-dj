import { Env, getUser, json } from '../_auth';
export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => { const user = await getUser(request, env.AUTH_SECRET); return user ? json({ user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } }) : json({ error: 'Sesi tidak valid.' }, 401); };
