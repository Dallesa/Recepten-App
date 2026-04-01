'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const LANDEN = ['België', 'Nederland', 'Frankrijk', 'Duitsland', 'Oostenrijk', 'Zwitserland', 'Italië', 'Spanje', 'Portugal', 'Kroatië', 'Slovenië', 'Griekenland', 'Denemarken', 'Noorwegen', 'Zweden'];

const CATEGORIEEN = [
  { key: 'sanitair', label: 'Sanitair' },
  { key: 'ligging', label: 'Ligging/omgeving' },
  { key: 'rust', label: 'Rust/sfeer' },
  { key: 'prijs_kwaliteit', label: 'Prijs-kwaliteit' },
  { key: 'speeltuin', label: 'Speeltuin/animatie' },
  { key: 'zwembad', label: 'Zwembad' },
  { key: 'activiteiten', label: 'Activiteiten in de buurt' },
  { key: 'kindvriendelijk', label: 'Kindvriendelijkheid' },
];

function StarRating({ value, onChange }: { value: number, onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5,6,7,8,9,10].map(i => (
        <button key={i} onClick={() => onChange(i)} className={`text-2xl ${i <= value ? 'text-yellow-400' : 'text-gray-200'}`}>★</button>
      ))}
    </div>
  );
}

export default function EditCampingPage() {
  const router = useRouter();
  const params = useParams();
  const campingId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [form, setForm] = useState({
    naam: '', land: 'België', regio: '', datum_bezoek: '', website: '', notities: ''
  });
  const [scores, setScores] = useState<Record<string, number>>({
    sanitair: 0, ligging: 0, rust: 0, prijs_kwaliteit: 0,
    speeltuin: 0, zwembad: 0, activiteiten: 0, kindvriendelijk: 0
  });

  useEffect(() => {
    if (!campingId) return;
    
    fetch(`/api/campings?id=${campingId}`)
      .then(r => r.json())
      .then(camping => {
        setForm({
          naam: camping.naam,
          land: camping.land,
          regio: camping.regio,
          datum_bezoek: camping.datum_bezoek?.split('T')[0] || '',
          website: camping.website || '',
          notities: camping.notities || ''
        });
        setScores({
          sanitair: camping.score_sanitair,
          ligging: camping.score_ligging,
          rust: camping.score_rust,
          prijs_kwaliteit: camping.score_prijs_kwaliteit,
          speeltuin: camping.score_speeltuin,
          zwembad: camping.score_zwembad,
          activiteiten: camping.score_activiteiten,
          kindvriendelijk: camping.score_kindvriendelijk
        });
        setInitialLoading(false);
      });
  }, [campingId]);

  async function handleSubmit() {
    setLoading(true);
    
    const totaal = Math.round(
      Object.values(scores).reduce((a, b) => a + b, 0) / CATEGORIEEN.length * 10
    );

    await fetch('/api/campings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: campingId, ...form, scores, totaal_score: totaal })
    });

    router.push(`/camping/${campingId}`);
  }

  if (initialLoading) return <div className="min-h-screen bg-green-50 flex items-center justify-center">Laden...</div>;

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-white">←</button>
        <h1 className="text-xl font-bold">Camping bewerken</h1>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-4 pb-20">
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-bold text-green-800">Gegevens</h2>
          <input placeholder="Naam camping" value={form.naam} onChange={e => setForm({...form, naam: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900" />
          <select value={form.land} onChange={e => setForm({...form, land: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900">
            {LANDEN.map(l => <option key={l}>{l}</option>)}
          </select>
          <input placeholder="Regio/stad" value={form.regio} onChange={e => setForm({...form, regio: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900" />
          <input type="date" value={form.datum_bezoek} onChange={e => setForm({...form, datum_bezoek: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900" />
          <input placeholder="Website URL" value={form.website} onChange={e => setForm({...form, website: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900" />
          <textarea placeholder="Notities" value={form.notities} onChange={e => setForm({...form, notities: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900" rows={3} />
        </div>

        <div className="bg-white rounded-2xl shadow p-4 space-y-4">
          <h2 className="font-bold text-green-800">Beoordelingen</h2>
          {CATEGORIEEN.map(cat => (
            <div key={cat.key}>
              <p className="text-sm text-gray-600 mb-1">{cat.label}</p>
              <StarRating value={scores[cat.key]} onChange={v => setScores({...scores, [cat.key]: v})} />
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={loading || !form.naam}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-2xl transition">
          {loading ? 'Opslaan...' : 'Wijzigingen opslaan'}
        </button>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        <button onClick={() => router.back()} className="flex-1 py-4 text-center text-gray-500 font-semibold text-sm">Annuleren</button>
      </nav>
    </div>
  );
}
