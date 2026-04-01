import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const success = await login(password);
  
  if (success) {
    return NextResponse.json({ ok: true });
  }
  
  return NextResponse.json({ error: 'Verkeerd wachtwoord' }, { status: 401 });
}