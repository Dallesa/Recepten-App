import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import Link from 'next/link';
import CampingFilter from '@/components/camping-filter';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/login');
  }

  let campings: any[] = [];
  let error: string | null = null;

  try {
    const { rows } = await sql`
      SELECT c.id, c.naam, c.land, c.regio, c.datum_bezoek, c.website, c.notities, 
      c.score_sanitair, c.score_ligging, c.score_rust, c.score_prijs_kwaliteit,
      c.score_speeltuin, c.score_zwembad, c.score_activiteiten, c.score_kindvriendelijk,
      c.totaal_score,
      (SELECT url FROM camping_fotos WHERE camping_id = c.id LIMIT 1) as foto
      FROM campings c
      ORDER BY totaal_score DESC
    `;
    campings = rows;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Database error';
    console.error('Database error:', err);
  }

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">🏕️ Onze Campings</h1>
          <p className="text-green-100 text-sm mt-1">{campings.length} bezochte campings</p>
        </div>
        <Link href="/camping/nieuw" className="bg-white text-green-700 font-semibold px-4 py-2 rounded-xl text-sm">
          + Toevoegen
        </Link>
      </header>

      <main className="p-4 max-w-2xl mx-auto pb-20">
        {error ? (
          <div className="bg-red-50 border border-red-300 rounded-2xl p-6 mt-4">
            <h2 className="text-red-800 font-bold mb-2">⚠️ Database Fout</h2>
            <p className="text-red-700 text-sm mb-4">Er kan geen verbinding worden gemaakt met de database.</p>
            <p className="text-red-600 text-xs font-mono bg-red-100 p-2 rounded">{error}</p>
          </div>
        ) : campings.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <div className="text-5xl mb-4">🏕️</div>
            <p>Nog geen campings toegevoegd</p>
            <Link href="/camping/nieuw" className="text-green-600 font-semibold mt-2 inline-block">
              Voeg je eerste camping toe
            </Link>
          </div>
        ) : (
          <CampingFilter campings={campings} />
        )}
      </main>

      
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        <Link href="/" className="flex-1 py-4 text-center text-green-700 font-semibold text-sm">🏕️ Lijst</Link>
      </nav>

    </div>
  );
}