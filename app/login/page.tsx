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
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.24em] text-blue-600 font-semibold mb-2">Welkom terug</p>
          <h1 className="text-4xl font-extrabold text-blue-900">Recepten App</h1>
          <p className="mt-2 text-sm text-blue-700">Voer je wachtwoord in om verder te gaan.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white/95 border border-blue-100 shadow-2xl rounded-3xl p-8">
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-blue-800 mb-2">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              placeholder="Je wachtwoord"
              className="border border-blue-200 focus:border-blue-400 focus:ring-blue-200 focus:ring-2 rounded-2xl px-4 py-3 w-full text-gray-900 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition">
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
}