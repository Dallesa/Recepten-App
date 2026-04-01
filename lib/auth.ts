import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const PASSWORD = process.env.APP_PASSWORD || 'camping123';
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'camping-secret-key');

export async function login(password: string): Promise<boolean> {
  if (password !== PASSWORD) return false;
  
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });

  return true;
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return false;
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}