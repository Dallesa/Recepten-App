import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';
import Link from 'next/link';

export default async function ReceptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await isAuthenticated();
  if (!auth) redirect('/login');

  const { id } = await params;

  let recept;
  try {
    const receptId = parseInt(id, 10);
    if (isNaN(receptId)) {
      throw new Error('Invalid recept ID');
    }
    const { rows: recepten } = await sql`SELECT * FROM recepten WHERE id = ${receptId}`;
    recept = recepten[0];
  } catch (error) {
    console.error('Error fetching recept:', error);
  }
  
  if (!recept) {
    return (
      <div className="min-h-screen bg-blue-50">
        <header className="bg-blue-700 text-white p-4">
          <Link href="/" className="text-white">← Terug</Link>
        </header>
        <main className="p-4 max-w-2xl mx-auto mt-4">
          <div className="bg-red-50 border border-red-300 rounded-2xl p-6">
            <h2 className="text-red-800 font-bold mb-2">⚠️ Recept niet gevonden</h2>
            <p className="text-red-700 mb-4">ID: {id}</p>
            <Link href="/" className="text-blue-600 font-semibold">← Terug naar lijst</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-700 text-white p-4 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold">← Terug</Link>
        <div className="flex gap-2">
          <Link href={`/recept/edit/${recept.id}`} className="bg-blue-600 hover:bg-blue-800 px-3 py-2 rounded-lg text-sm">
            ✏️ Bewerken
          </Link>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto pb-20">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <div className="flex gap-4 items-start">
            {recept.afbeelding && (
              <img src={recept.afbeelding} alt={recept.naam} className="w-24 h-24 object-cover rounded-xl" />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{recept.naam}</h1>
              <div className="flex gap-4 mt-3 text-sm text-gray-600">
                {recept.bereidingstijd && <span>⏱️ {recept.bereidingstijd} min</span>}
                {recept.categorie && <span>📂 {recept.categorie}</span>}
                {recept.type_keuken && <span>🍽️ {recept.type_keuken}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Ingrediënten */}
        <div className="bg-white rounded-2xl shadow p-4 mb-4">
          <h2 className="font-bold text-lg text-gray-900 mb-3">📝 Ingrediënten</h2>
          <ul className="space-y-2">
            {recept.ingrediënten.split('\n').map((ingredient: string, i: number) => 
              ingredient.trim() && (
                <li key={i} className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{ingredient.trim()}</span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Notities */}
        {recept.notities && (
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4 mb-4">
            <h2 className="font-bold text-lg text-gray-900 mb-2">💡 Notities</h2>
            <p className="text-gray-700">{recept.notities}</p>
          </div>
        )}
      </main>
    </div>
  );
}
