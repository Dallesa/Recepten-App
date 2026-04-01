'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function NieuweCampingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fotos, setFotos] = useState<File[]>([]);
  const [form, setForm] = useState({
    naam: '', land: 'België', regio: '', datum_bezoek: '', website: '', notities: ''
  });
  const [scores, setScores] = useState<Record<string, number>>({
    sanitair: 0, ligging: 0, rust: 0, prijs_kwaliteit: 0,
    speeltuin: 0, zwembad: 0, activiteiten: 0, kindvriendelijk: 0
  });

  function handleFotos(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setFotos(Array.from(e.target.files));
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');
    
    try {
      const fotoUrls: string[] = [];
      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i];
        console.log(`Uploading foto ${i + 1}/${fotos.length}:`, foto.name);
        const fd = new FormData();
        fd.append('file', foto);
        
        try {
          const res = await fetch('/api/fotos/upload', { method: 'POST', body: fd });
          const data = await res.json();
          console.log(`Upload response:`, res.status, data);
          
          if (!res.ok) {
            throw new Error(data.error || `Upload mislukt (${res.status})`);
          }
          fotoUrls.push(data.url);
        } catch (uploadErr) {
          throw new Error(`Foto ${i + 1} (${foto.name}): ${uploadErr instanceof Error ? uploadErr.message : String(uploadErr)}`);
        }
      }

      const totaal = Math.round(
        Object.values(scores).reduce((a, b) => a + b, 0) / CATEGORIEEN.length * 10
      );

      const campingRes = await fetch('/api/campings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, scores, totaal_score: totaal, fotos: fotoUrls })
      });

      const campingData = await campingRes.json();
      
      if (!campingRes.ok) {
        throw new Error(campingData.error || 'Camping opslaan mislukt');
      }

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets fout gegaan');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white p-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-white">←</button>
        <h1 className="text-xl font-bold">Nieuwe Camping</h1>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-4">
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

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-bold text-green-800 mb-3">Foto's</h2>
          <input type="file" accept="image/*" multiple onChange={handleFotos}
            className="w-full text-sm text-gray-500" />
          {fotos.length > 0 && (
            <p className="text-green-600 text-sm mt-2">{fotos.length} foto('s) geselecteerd</p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading || !form.naam}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-2xl transition">
          {loading ? 'Opslaan...' : 'Camping opslaan'}
        </button>
      </main>
    </div>
  );
}