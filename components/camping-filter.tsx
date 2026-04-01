'use client';

import { useState, useMemo } from 'react';
import CampingListItem from '@/components/camping-list-item';

interface CampingFilterProps {
  campings: any[];
}

export default function CampingFilter({ campings }: CampingFilterProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Get unique countries from campings
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(campings.map(c => c.land))];
    return uniqueCountries.sort();
  }, [campings]);

  // Filter campings based on selected country
  const filteredCampings = useMemo(() => {
    if (!selectedCountry) return campings;
    return campings.filter(c => c.land === selectedCountry);
  }, [campings, selectedCountry]);

  return (
    <>
      {/* Filter buttons */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-4">
        <button
          onClick={() => setSelectedCountry(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
            selectedCountry === null
              ? 'bg-green-600 text-white'
              : 'bg-white text-green-700 border border-green-200'
          }`}
        >
          Alle
        </button>
        {countries.map(country => (
          <button
            key={country}
            onClick={() => setSelectedCountry(country)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
              selectedCountry === country
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-700 border border-green-200'
            }`}
          >
            {country}
          </button>
        ))}
      </div>

      {/* Camping list */}
      <div className="space-y-4 mt-4">
        {filteredCampings.map((camping: any) => (
          <CampingListItem key={camping.id} camping={camping} />
        ))}
      </div>
    </>
  );
}
