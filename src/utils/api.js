// src/utils/api.js

const API_URL =
  'https://restcountries.com/v3.1/all?fields=name,capital,flags,region';

function shuffle(arr) {
  return [...arr]
    .map((v) => [Math.random(), v])
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

/**
 * Génère une seule question d'un certain type à partir d'un pays
 */
function createQuestion(country, countries, type) {
  const name = country.name.common;
  const flag = country.flags?.svg || country.flags?.png;
  const capital = country.capital?.[0] || null;
  const region = country.region;

  const others = shuffle(countries.filter((c) => c.name.common !== name));

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
            .filter((r, i, a) => a.indexOf(r) === i) // uniques
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

    case 'random': {
      const types = [
        'flag-to-country',
        'capital-to-country',
        'country-to-capital',
        'country-to-region',
        'fill-the-blank-flag',
      ];
      const picked = types[Math.floor(Math.random() * types.length)];
      return createQuestion(country, countries, picked);
    }

    default:
      return null;
  }
}

export async function generateMixedQuestions() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to load countries');
  const countries = await res.json();

  const types = [
    'flag-to-country',
    'capital-to-country',
    'country-to-capital',
    'country-to-region',
    'random', // on laisse "random" comme joker pour le cinquième type si tu veux
  ];

  const questions = [];

  for (const type of types) {
    let count = 0;
    let attempts = 0;

    while (count < 2 && attempts < 30) {
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

  return shuffle(questions);
}
