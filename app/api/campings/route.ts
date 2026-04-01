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
    const campingId = parseInt(id, 10);
    if (isNaN(campingId)) {
      return NextResponse.json({ error: 'Invalid camping ID' }, { status: 400 });
    }
    const { rows } = await sql`SELECT * FROM campings WHERE id = ${campingId}`;
    return NextResponse.json(rows[0] || null);
  }
  
  const { rows } = await sql`SELECT * FROM campings ORDER BY totaal_score DESC`;
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  try {
    await createTables();
    
    const { naam, land, regio, datum_bezoek, website, notities, scores, totaal_score, fotos } = await request.json();

    if (!naam) {
      return NextResponse.json({ error: 'Camping naam is verplicht' }, { status: 400 });
    }

    const { rows } = await sql`
      INSERT INTO campings (naam, land, regio, datum_bezoek, website, notities,
        score_sanitair, score_ligging, score_rust, score_prijs_kwaliteit,
        score_speeltuin, score_zwembad, score_activiteiten, score_kindvriendelijk, totaal_score)
      VALUES (
        ${naam}, ${land}, ${regio}, ${datum_bezoek}, ${website}, ${notities},
        ${scores.sanitair}, ${scores.ligging}, ${scores.rust}, ${scores.prijs_kwaliteit},
        ${scores.speeltuin}, ${scores.zwembad}, ${scores.activiteiten}, ${scores.kindvriendelijk},
        ${totaal_score}
      )
      RETURNING id
    `;

    const campingId = rows[0].id;

    for (const url of fotos) {
      await sql`INSERT INTO camping_fotos (camping_id, url) VALUES (${campingId}, ${url})`;
    }

    return NextResponse.json({ ok: true, id: campingId });
  } catch (error) {
    console.error('Camping POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Camping opslaan mislukt' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  const { id, naam, land, regio, datum_bezoek, website, notities, scores, totaal_score } = await request.json();
  const campingId = parseInt(id, 10);
  if (isNaN(campingId)) return NextResponse.json({ error: 'Invalid camping ID' }, { status: 400 });

  await sql`
    UPDATE campings
    SET naam = ${naam}, land = ${land}, regio = ${regio}, datum_bezoek = ${datum_bezoek},
        website = ${website}, notities = ${notities},
        score_sanitair = ${scores.sanitair}, score_ligging = ${scores.ligging},
        score_rust = ${scores.rust}, score_prijs_kwaliteit = ${scores.prijs_kwaliteit},
        score_speeltuin = ${scores.speeltuin}, score_zwembad = ${scores.zwembad},
        score_activiteiten = ${scores.activiteiten}, score_kindvriendelijk = ${scores.kindvriendelijk},
        totaal_score = ${totaal_score}
    WHERE id = ${campingId}
  `;

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID is vereist' }, { status: 400 });
  const campingId = parseInt(id, 10);
  if (isNaN(campingId)) return NextResponse.json({ error: 'Invalid camping ID' }, { status: 400 });

  await sql`DELETE FROM camping_fotos WHERE camping_id = ${campingId}`;
  await sql`DELETE FROM campings WHERE id = ${campingId}`;

  return NextResponse.json({ ok: true });
}