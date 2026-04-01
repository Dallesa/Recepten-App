'use client';

import { useState, useEffect } from 'react';
import { addIngredientsToList, isRecipeInList } from '@/lib/shopping-list';

export default function AddToShoppingListButton({ ingredients }: { ingredients: string }) {
  const [inList, setInList] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setInList(isRecipeInList(ingredients));
    setMounted(true);
  }, [ingredients]);

  function handleAdd() {
    addIngredientsToList(ingredients);
    setInList(true);
  }

  if (!mounted) return null;

  return (
    <button
      onClick={handleAdd}
      disabled={inList}
      className={`w-full font-semibold py-4 rounded-2xl transition ${
        inList
          ? 'bg-blue-200 text-blue-700 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {inList ? '✓ Op boodschappenlijst' : '🛒 Aan boodschappenlijst toevoegen'}
    </button>
  );
}
