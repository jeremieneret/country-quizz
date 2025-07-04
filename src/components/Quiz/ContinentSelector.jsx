// src/components/Quiz/ContinentSelector.jsx
import React, { useState, useEffect } from 'react';

const CONTINENTS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export default function ContinentSelector({ onConfirm }) {
  const [selected, setSelected] = useState([]);

  // Recharge la sélection depuis le localStorage si elle existe
  useEffect(() => {
    const stored = localStorage.getItem('continents');
    if (stored) setSelected(JSON.parse(stored));
  }, []);

  // Toggle : si présent on enlève, sinon on ajoute
  const toggle = (continent) => {
    setSelected(prev =>
      prev.includes(continent)
        ? prev.filter(c => c !== continent)
        : [...prev, continent]
    );
  };

  // Confirme la sélection, enregistre en localStorage et passe au quiz
  const handleConfirm = () => {
    if (!selected.length) return;
    localStorage.setItem('continents', JSON.stringify(selected));
    onConfirm(selected);
  };

  return (
    <div className="continent-selector">
      <h2>Pick your continents – your quiz will only include these!</h2>
      <ul className="continent-list">
        {CONTINENTS.map(c => {
          const isSelected = selected.includes(c);
          return (
            <li
              key={c}
              className={`continent-item ${isSelected ? 'selected' : ''}`}
            >
              <button
                type="button"
                className="continent-btn"
                onClick={() => toggle(c)}
              >
                {c}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        className="confirm-btn"
        onClick={handleConfirm}
        disabled={selected.length === 0}
      >
        Let’s go!
      </button>
    </div>
  );
}
