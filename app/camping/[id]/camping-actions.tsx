'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CampingActions({ campingId }: { campingId: string }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    if (!confirm('Weet je zeker dat je deze camping wilt verwijderen?')) return;
    
    await fetch(`/api/campings?id=${campingId}`, { method: 'DELETE' });
    router.push('/');
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-300 hover:text-red-100 font-semibold text-sm"
    >
      🗑️
    </button>
  );
}
