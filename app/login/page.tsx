'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      window.location.href = '/';
    } else {
      setError('Verkeerd wachtwoord');
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-xl w-80">
        <h1 className="text-xl font-bold mb-4 text-center">Inloggen</h1>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <input
          type="password"
          placeholder="Wachtwoord"
          className="border p-2 w-full rounded mb-4 text-gray-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-green-600 text-white py-2 rounded font-semibold">
          Inloggen
        </button>
      </form>
    </div>
  );
}