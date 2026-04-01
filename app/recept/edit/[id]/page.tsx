'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const CATEGORIEËN = ['Snel', 'Comfort', 'Vegetarisch', 'Dagelijkse kost'];
const TYPES_KEUKEN = ['Mexicaans', 'Vlaams', 'Aziatisch', 'Frans', 'Italiaans'];

export default function EditReceptPage() {
  const router = useRouter();
  const params = useParams();
  const receptId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState({
    naam: '',
    ingrediënten: '',
    bereidingstijd: '',
    categorie: 'Snel',
    type_keuken: 'Vlaams',
    afbeelding: '',
    notities: ''
  });

  useEffect(() => {
    if (!receptId) return;
    
    fetch(`/api/recepten?id=${receptId}`)
      .then(r => r.json())
      .then(recept => {
        setForm({
          naam: recept.naam || '',
          ingrediënten: recept.ingrediënten || '',
          bereidingstijd: recept.bereidingstijd ? recept.bereidingstijd.toString() : '',
          categorie: recept.categorie || 'Snel',
          type_keuken: recept.type_keuken || 'Vlaams',
          afbeelding: recept.afbeelding || '',
          notities: recept.notities || ''
        });
        setInitialLoading(false);
      })
      .catch(err => {
        setError('Recept kon niet worden geladen');
        setInitialLoading(false);
      });
  }, [receptId]);

  async function handleSubmit() {
    setLoading(true);
    setError('');
    
    try {
      if (!form.naam || !form.ingrediënten) {
        throw new Error('Naam en ingrediënten zijn verplicht');
      }

      const receptRes = await fetch('/api/recepten', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: receptId,
          ...form,
          bereidingstijd: form.bereidingstijd ? parseInt(form.bereidingstijd) : null,
          afbeelding: form.afbeelding || null
        })
      });

      if (!receptRes.ok) {
        const data = await receptRes.json();
        throw new Error(data.error || 'Recept bijwerken mislukt');
      }

      router.push(`/recept/${receptId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets fout gegaan');
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Weet je zeker dat je dit recept wilt verwijderen?')) return;
    
    try {
      const receptRes = await fetch(`/api/recepten?id=${receptId}`, {
        method: 'DELETE'
      });

      if (!receptRes.ok) {
        throw new Error('Recept verwijderen mislukt');
      }

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verwijderen mislukt');
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-700 text-white p-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-white text-xl">←</button>
        <h1 className="text-xl font-bold">Recept bewerken</h1>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-4 pb-20">
        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-bold text-blue-800">Basisgegevens</h2>
          <input 
            placeholder="Receptnaam *" 
            value={form.naam} 
            onChange={e => setForm({...form, naam: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900" 
          />
          <input 
            placeholder="Afbeelding URL" 
            value={form.afbeelding} 
            onChange={e => setForm({...form, afbeelding: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900" 
          />
        </div>

        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-bold text-blue-800">Ingrediënten</h2>
          <textarea 
            placeholder="Ingrediënten (één per regel) *" 
            value={form.ingrediënten} 
            onChange={e => setForm({...form, ingrediënten: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900" 
            rows={4}
          />
        </div>

        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-bold text-blue-800">Details</h2>
          <input 
            type="number" 
            placeholder="Bereidingstijd (min)" 
            value={form.bereidingstijd} 
            onChange={e => setForm({...form, bereidingstijd: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900" 
          />
          <select 
            value={form.categorie} 
            onChange={e => setForm({...form, categorie: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          >
            {CATEGORIEËN.map(c => <option key={c}>{c}</option>)}
          </select>
          <select 
            value={form.type_keuken} 
            onChange={e => setForm({...form, type_keuken: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          >
            {TYPES_KEUKEN.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="font-bold text-blue-800 mb-3">Notities</h2>
          <textarea 
            placeholder="Extra opmerkingen" 
            value={form.notities} 
            onChange={e => setForm({...form, notities: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900" 
            rows={3}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button 
            onClick={handleSubmit} 
            disabled={loading || !form.naam}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-2xl transition"
          >
            {loading ? 'Opslaan...' : 'Wijzigingen opslaan'}
          </button>
          <button 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-4 rounded-2xl transition"
          >
            🗑️
          </button>
        </div>
      </main>
    </div>
  );
}
