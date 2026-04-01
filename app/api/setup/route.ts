import { createTables } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await createTables();
    return NextResponse.json({ success: true, message: 'Database tables created successfully' });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    );
  }
}
