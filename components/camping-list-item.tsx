'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CampingListItem({ camping }: { camping: any }) {
  const router = useRouter();

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm('Weet je zeker dat je deze camping wilt verwijderen?')) return;
    
    await fetch(`/api/campings?id=${camping.id}`, { method: 'DELETE' });
    router.refresh();
  }

  if (!camping.id) {
    console.error('camping.id is missing:', camping);
    return <div className="text-red-500">Camping ID ontbreekt</div>;
  }

  return (
    <Link href={`/camping/${camping.id}`} className="block">
      <div className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center group hover:shadow-lg transition">
        {camping.foto ? (
          <img src={camping.foto} alt={camping.naam} className="w-20 h-20 object-cover rounded-xl" />
        ) : (
          <div className="w-20 h-20 bg-green-100 rounded-xl flex items-center justify-center text-3xl">🏕️</div>
        )}
        <div className="flex-1">
          <h2 className="font-bold text-gray-800">{camping.naam}</h2>
          <p className="text-gray-500 text-sm">{camping.regio}, {camping.land}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold text-gray-700">{camping.totaal_score}/100</span>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <Link href={`/camping/edit/${camping.id}`} onClick={(e) => e.stopPropagation()}
            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
            ✏️
          </Link>
          <button onClick={handleDelete}
            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
            🗑️
          </button>
        </div>
      </div>
    </Link>
  );
}
