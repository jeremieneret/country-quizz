// src/utils/api.js

const API_URL =
  'https://restcountries.com/v3.1/all?fields=name,capital,flags,region';

/**
 * Mélange un tableau de façon aléatoire.
 */
function shuffle(arr) {
  return [...arr]
    .map((v) => [Math.random(), v])
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

/**
 * Crée une question d’un type donné pour un pays de base.
 */
function createQuestion(country, countries, type) {
  const name    = country.name.common;
  const flag    = country.flags?.svg || country.flags?.png;
  const capital = country.capital?.[0] || null;
  const region  = country.region;
  const others  = shuffle(countries.filter((c) => c.name.common !== name));

  switch (type) {
    case 'flag-to-country':
      return {
        type,
        question: 'Which country does this flag belong to?',
        image: flag,
        options: shuffle([
          name,
          ...others.slice(0, 3).map((c) => c.name.common),
        ]),
        correctAnswer: name,
      };

    case 'capital-to-country':
      if (!capital) return null;
      return {
        type,
        question: `Which country has ${capital} as its capital?`,
        options: shuffle([
          name,
          ...others.slice(0, 3).map((c) => c.name.common),
        ]),
        correctAnswer: name,
      };

    case 'country-to-capital':
      if (!capital) return null;
      return {
        type,
        question: `What is the capital of ${name}?`,
        options: shuffle([
          capital,
          ...others
            .filter((c) => c.capital?.[0])
            .slice(0, 3)
            .map((c) => c.capital[0]),
        ]),
        correctAnswer: capital,
      };

    case 'country-to-region':
      return {
        type,
        question: `On which continent is ${name} located?`,
        options: shuffle([
          region,
          ...others
            .map((c) => c.region)
            .filter((r) => r && r !== region)
            .filter((r, i, a) => a.indexOf(r) === i)
            .slice(0, 3),
        ]),
        correctAnswer: region,
      };

    case 'fill-the-blank-flag':
      return {
        type,
        question: `______ has this flag`,
        image: flag,
        options: shuffle([
          name,
          ...others.slice(0, 3).map((c) => c.name.common),
        ]),
        correctAnswer: name,
      };

    default:
      return null;
  }
}

/**
 * Génère 10 questions (2 de chaque type),
 * en excluant la question "country-to-region" si un seul continent est choisi.
 *
 * @param {string[]} continents
 * @returns {Promise<Object[]>}
 */
export async function generateMixedQuestions(continents = []) {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to load countries');
  let countries = await res.json();

  // 1) Filtrer les pays par continent(s) sélectionnés
  if (Array.isArray(continents) && continents.length > 0) {
    const lower = continents.map((c) => c.toLowerCase());
    countries = countries.filter((c) =>
      lower.includes((c.region || '').toLowerCase())
    );
  }

  // 2) Définir les types de questions de base
  const baseTypes = [
    'flag-to-country',
    'capital-to-country',
    'country-to-capital',
    'fill-the-blank-flag',
  ];

  // Si plusieurs continents, on ajoute aussi la question région
  const types =
    continents.length > 1
      ? [...baseTypes, 'country-to-region']
      : [...baseTypes];

  const questions = [];

  // 3) Générer 2 questions par type
  for (const type of types) {
    let count = 0;
    let attempts = 0;
    while (count < 2 && attempts < 50) {
      const base = countries[Math.floor(Math.random() * countries.length)];
      const q = createQuestion(base, countries, type);
      if (
        q &&
        !questions.some((existing) => existing.correctAnswer === q.correctAnswer)
      ) {
        questions.push(q);
        count++;
      }
      attempts++;
    }
  }

  // 4) Combler pour atteindre 10 questions si besoin
  let fillAttempts = 0;
  while (questions.length < 10 && fillAttempts < 100) {
    const randomType =
      types[Math.floor(Math.random() * types.length)];
    const base = countries[Math.floor(Math.random() * countries.length)];
    const q = createQuestion(base, countries, randomType);
    if (
      q &&
      !questions.some((existing) => existing.correctAnswer === q.correctAnswer)
    ) {
      questions.push(q);
    }
    fillAttempts++;
  }

  // 5) Mélange final et retour
  return shuffle(questions);
}
