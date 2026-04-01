'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { addIngredientsToList } from '@/lib/shopping-list';

interface ReceptFilterProps {
  recepten: any[];
}

export default function ReceptFilter({ recepten }: ReceptFilterProps) {
  const [selectedCategorie, setSelectedCategorie] = useState<string | null>(null);
  const [selectedTypeKeuken, setSelectedTypeKeuken] = useState<string | null>(null);
  const [addedRecipes, setAddedRecipes] = useState<Set<number>>(new Set());

  // Get unique categories and types
  const categories = useMemo(() => {
    const unique = [...new Set(recepten.map(r => r.categorie).filter(Boolean))];
    return unique.sort();
  }, [recepten]);

  const typesKeuken = useMemo(() => {
    const unique = [...new Set(recepten.map(r => r.type_keuken).filter(Boolean))];
    return unique.sort();
  }, [recepten]);

  // Filter recepten based on selected filters
  const filteredRecepten = useMemo(() => {
    let result = recepten;
    if (selectedCategorie) {
      result = result.filter(r => r.categorie === selectedCategorie);
    }
    if (selectedTypeKeuken) {
      result = result.filter(r => r.type_keuken === selectedTypeKeuken);
    }
    return result;
  }, [recepten, selectedCategorie, selectedTypeKeuken]);

  function handleAddToList(e: React.MouseEvent, receptId: number, ingredients: string) {
    e.preventDefault();
    addIngredientsToList(ingredients);
    setAddedRecipes(new Set([...addedRecipes, receptId]));
  }

  return (
    <>
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-4">
          <div className="flex overflow-x-auto gap-2 pb-2">
            <button
              onClick={() => setSelectedCategorie(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedCategorie === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-700 border border-blue-200'
              }`}
            >
              Alle
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategorie(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCategorie === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-700 border border-blue-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Kitchen Type Filter */}
      {typesKeuken.length > 0 && (
        <div className="mb-4">
          <div className="flex overflow-x-auto gap-2 pb-4">
            <button
              onClick={() => setSelectedTypeKeuken(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedTypeKeuken === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-700 border border-blue-200'
              }`}
            >
              Alle
            </button>
            {typesKeuken.map(type => (
              <button
                key={type}
                onClick={() => setSelectedTypeKeuken(type)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedTypeKeuken === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-700 border border-blue-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recept list */}
      <div className="space-y-4 mt-4">
        {filteredRecepten.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>Geen recepten gevonden met deze filters</p>
          </div>
        ) : (
          filteredRecepten.map((recept: any) => (
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
                <button
                  onClick={(e) => handleAddToList(e, recept.id, recept.ingrediënten)}
                  className={`p-2 rounded-lg font-semibold transition ${
                    addedRecipes.has(recept.id)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                  }`}
                >
                  {addedRecipes.has(recept.id) ? '✓' : '🛒'}
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
