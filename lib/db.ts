import { sql } from '@vercel/postgres';

export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS campings (
      id SERIAL PRIMARY KEY,
      naam VARCHAR(255) NOT NULL,
      land VARCHAR(100) NOT NULL,
      regio VARCHAR(255),
      datum_bezoek DATE,
      website VARCHAR(255),
      notities TEXT,
      score_sanitair INTEGER DEFAULT 0,
      score_ligging INTEGER DEFAULT 0,
      score_rust INTEGER DEFAULT 0,
      score_prijs_kwaliteit INTEGER DEFAULT 0,
      score_speeltuin INTEGER DEFAULT 0,
      score_zwembad INTEGER DEFAULT 0,
      score_activiteiten INTEGER DEFAULT 0,
      score_kindvriendelijk INTEGER DEFAULT 0,
      totaal_score DECIMAL(5,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS camping_fotos (
      id SERIAL PRIMARY KEY,
      camping_id INTEGER REFERENCES campings(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS recepten (
      id SERIAL PRIMARY KEY,
      naam VARCHAR(255) NOT NULL,
      beschrijving TEXT,
      ingrediënten TEXT NOT NULL,
      bereidingswijze TEXT NOT NULL,
      bereidingstijd INTEGER,
      aantal_personen INTEGER,
      moeilijkheidsgraad VARCHAR(50),
      afbeelding VARCHAR(255),
      notities TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}