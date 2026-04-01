import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import Link from 'next/link';
import CampingActions from './camping-actions';

const CATEGORIEEN = [
  { key: 'score_sanitair', label: 'Sanitair' },
  { key: 'score_ligging', label: 'Ligging/omgeving' },
  { key: 'score_rust', label: 'Rust/sfeer' },
  { key: 'score_prijs_kwaliteit', label: 'Prijs-kwaliteit' },
  { key: 'score_speeltuin', label: 'Speeltuin/animatie' },
  { key: 'score_zwembad', label: 'Zwembad' },
  { key: 'score_activiteiten', label: 'Activiteiten in de buurt' },
  { key: 'score_kindvriendelijk', label: 'Kindvriendelijkheid' },
];

export default async function CampingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');

  const { id } = await params;

  let camping;
  try {
    const campingId = parseInt(id, 10);
    if (isNaN(campingId)) {
      throw new Error('Invalid camping ID');
    }
    const { rows: campings } = await sql`SELECT * FROM campings WHERE id = ${campingId}`;
    camping = campings[0];
  } catch (error) {
    console.error('Error fetching camping:', error);
  }
  
  if (!camping) {
    return (
      <div className="min-h-screen bg-green-50">
        <header className="bg-green-700 text-white p-4">
          <Link href="/" className="text-white">← Terug</Link>
        </header>
        <main className="p-4 max-w-2xl mx-auto mt-4">
          <div className="bg-red-50 border border-red-300 rounded-2xl p-6">
            <h2 className="text-red-800 font-bold mb-2">⚠️ Camping niet gevonden</h2>
            <p className="text-red-700 mb-4">ID: {id}</p>
            <Link href="/" className="text-green-600 font-semibold">← Terug naar lijst</Link>
          </div>
        </main>
      </div>
    );
  }

  const { rows: fotos } = await sql`SELECT * FROM camping_fotos WHERE camping_id = ${id}`;

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center gap-3">
        <Link href="/" className="text-white">←</Link>
        <h1 className="text-xl font-bold flex-1">{camping.naam}</h1>
        <CampingActions campingId={camping.id} />
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-4 pb-20">
        {fotos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {fotos.map((foto: any) => (
              <img key={foto.id} src={foto.url} alt={camping.naam}
                className="w-48 h-48 object-cover rounded-2xl flex-shrink-0" />
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-4 space-y-2">
          <h2 className="font-bold text-green-800">Gegevens</h2>
          <p className="text-gray-600">🌍 {camping.land} — {camping.regio}</p>
          {camping.datum_bezoek && (
            <p className="text-gray-600">📅 {new Date(camping.datum_bezoek).toLocaleDateString('nl-BE')}</p>
          )}
          {camping.website && (
            <a href={camping.website} target="_blank" className="text-green-600 underline block">🌐 Website</a>
          )}
          {camping.notities && (
            <p className="text-gray-600 mt-2">📝 {camping.notities}</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-green-800">Beoordelingen</h2>
            <span className="text-2xl font-bold text-green-700">{camping.totaal_score}/100</span>
          </div>
          <div className="space-y-3">
            {CATEGORIEEN.map(cat => (
              <div key={cat.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{cat.label}</span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => (
                      <span key={i} className={`text-lg ${i <= camping[cat.key] ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-6">{camping[cat.key]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex gap-2 p-2">
        <Link href={`/camping/edit/${camping.id}`}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-2xl text-center transition">
          ✏️ Bewerken
        </Link>
      </nav>
    </div>
  );
}