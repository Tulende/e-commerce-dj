import { Env, getUser, json } from '../_auth';

const DEFAULT_AUTH_SECRET = 'soundrent-auth-secret-2026-xK9mP3nQ7rL2vB8wY4tH6jE1';

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const secret = env.AUTH_SECRET || DEFAULT_AUTH_SECRET;
  const user = await getUser(request, secret);
  return user
    ? json({ user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role } })
    : json({ error: 'Sesi tidak valid.' }, 401);
};
