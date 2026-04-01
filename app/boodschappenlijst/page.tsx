'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getShoppingList, toggleItem, removeItem, clearList, ShoppingListItem } from '@/lib/shopping-list';

export default function ShoppingListPage() {
  const router = useRouter();
  const [list, setList] = useState<ShoppingListItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setList(getShoppingList());
    setMounted(true);
  }, []);

  function handleToggle(ingredient: string) {
    toggleItem(ingredient);
    setList(getShoppingList());
  }

  function handleRemove(ingredient: string) {
    removeItem(ingredient);
    setList(getShoppingList());
  }

  function handleClear() {
    if (!confirm('Weet je zeker dat je de boodschappenlijst wilt leegmaken?')) return;
    clearList();
    setList([]);
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  const checkedCount = list.filter(item => item.checked).length;
  const totalCount = list.length;

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-700 text-white p-4 flex items-center justify-between">
        <div>
          <Link href="/" className="text-white font-semibold">← Terug</Link>
        </div>
        <div className="text-center flex-1">
          <h1 className="text-xl font-bold">🛒 Boodschappenlijst</h1>
          <p className="text-blue-100 text-sm mt-1">{checkedCount}/{totalCount} items</p>
        </div>
        <div className="w-12"></div>
      </header>

      <main className="p-4 max-w-2xl mx-auto pb-20">
        {list.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-gray-500 mb-4">Je boodschappenlijst is leeg</p>
            <Link href="/" className="text-blue-600 font-semibold">
              Voeg recepten toe
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow p-4 flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggle(item.ingredient)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span
                  className={`flex-1 ${
                    item.checked
                      ? 'line-through text-gray-400'
                      : 'text-gray-800'
                  }`}
                >
                  {item.ingredient}
                </span>
                <button
                  onClick={() => handleRemove(item.ingredient)}
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {list.length > 0 && (
          <button
            onClick={handleClear}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl transition"
          >
            Boodschappenlijst leegmaken
          </button>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        <Link href="/" className="flex-1 py-4 text-center text-blue-700 font-semibold text-sm">📖 Recepten</Link>
        <Link href="/boodschappenlijst" className="flex-1 py-4 text-center text-blue-700 font-semibold text-sm">🛒 Boodschappen</Link>
      </nav>
    </div>
  );
}
