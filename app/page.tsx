import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/login');
  }

  let recepten: any[] = [];
  let error: string | null = null;

  try {
    const { rows } = await sql`
      SELECT id, naam, ingrediënten, bereidingstijd, categorie, type_keuken, afbeelding, notities, created_at
      FROM recepten
      ORDER BY created_at DESC
    `;
    recepten = rows;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Database error';
    console.error('Database error:', err);
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-700 text-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">📖 Onze Recepten</h1>
          <p className="text-blue-100 text-sm mt-1">{recepten.length} recepten</p>
        </div>
        <Link href="/recept/nieuw" className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-xl text-sm">
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
        ) : recepten.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <div className="text-5xl mb-4">📖</div>
            <p>Nog geen recepten toegevoegd</p>
            <Link href="/recept/nieuw" className="text-blue-600 font-semibold mt-2 inline-block">
              Voeg je eerste recept toe
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {recepten.map((recept: any) => (
              <Link key={recept.id} href={`/recept/${recept.id}`} className="block">
                <div className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center group hover:shadow-lg transition">
                  {recept.afbeelding ? (
                    <img src={recept.afbeelding} alt={recept.naam} className="w-20 h-20 object-cover rounded-xl" />
                  ) : (
                    <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center text-3xl">📖</div>
                  )}
                  <div className="flex-1">
                    <h2 className="font-bold text-gray-800">{recept.naam}</h2>
                    <p className="text-gray-500 text-sm">{recept.categorie || 'Geen categorie'} • {recept.type_keuken || 'Onbekend'}</p>
                    {recept.bereidingstijd && (
                      <p className="text-gray-600 text-sm mt-1">⏱️ {recept.bereidingstijd} minuten</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        <Link href="/" className="flex-1 py-4 text-center text-blue-700 font-semibold text-sm">📖 Recepten</Link>
      </nav>

    </div>
  );
}