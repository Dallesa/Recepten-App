import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { isAuthenticated } from '@/lib/auth';
import { createTables } from '@/lib/db';

export async function GET(request: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  await createTables();
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    const receptId = parseInt(id, 10);
    if (isNaN(receptId)) {
      return NextResponse.json({ error: 'Invalid recept ID' }, { status: 400 });
    }
    const { rows } = await sql`SELECT * FROM recepten WHERE id = ${receptId}`;
    return NextResponse.json(rows[0] || null);
  }
  
  const { rows } = await sql`SELECT * FROM recepten ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  try {
    await createTables();
    
    const { naam, ingrediënten, bereidingstijd, categorie, type_keuken, afbeelding, notities } = await request.json();

    if (!naam || !ingrediënten) {
      return NextResponse.json({ error: 'Naam en ingrediënten zijn verplicht' }, { status: 400 });
    }

    const { rows } = await sql`
      INSERT INTO recepten (naam, ingrediënten, bereidingstijd, categorie, type_keuken, afbeelding, notities)
      VALUES (${naam}, ${ingrediënten}, ${bereidingstijd}, ${categorie}, ${type_keuken}, ${afbeelding}, ${notities})
      RETURNING id
    `;

    return NextResponse.json({ ok: true, id: rows[0].id });
  } catch (error) {
    console.error('Recept POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Recept opslaan mislukt' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  const { id, naam, ingrediënten, bereidingstijd, categorie, type_keuken, afbeelding, notities } = await request.json();
  const receptId = parseInt(id, 10);
  if (isNaN(receptId)) return NextResponse.json({ error: 'Invalid recept ID' }, { status: 400 });

  await sql`
    UPDATE recepten
    SET naam = ${naam}, ingrediënten = ${ingrediënten}, 
        bereidingstijd = ${bereidingstijd}, categorie = ${categorie}, 
        type_keuken = ${type_keuken}, afbeelding = ${afbeelding}, 
        notities = ${notities}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${receptId}
  `;

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID is vereist' }, { status: 400 });

  const receptId = parseInt(id, 10);
  if (isNaN(receptId)) return NextResponse.json({ error: 'Invalid recept ID' }, { status: 400 });

  await sql`DELETE FROM recepten WHERE id = ${receptId}`;

  return NextResponse.json({ ok: true });
}
