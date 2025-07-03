// src/components/Quiz/QuestionRenderer.jsx
import React from 'react';

export default function QuestionRenderer({ question }) {
  // 1. Pas de question → loading
  if (!question) {
    return <p>Chargement de la question…</p>;
  }

  const { type = '', image } = question;
  const lowerType = type.toLowerCase();

  // 2. Traitement « flag » plus générique
  const isFlag = lowerType.includes('flag');
  if (isFlag) {
    // si on avait un placeholder dans text, on l’ignore
    if (!image) {
      return <p>Chargement de la question…</p>;
    }
    return (
      <div className="question-wrapper">
        <div className="flag-question">
          <div className="question-text">
            <p>Which country</p>
            <p>does this flag</p>
            <p>belong to?</p>
          </div>
          <img
            src={image}
            alt="Country flag"
            className="flag-image"
          />
        </div>
      </div>
    );
  }

  // 3. Tous les autres types : on récupère le texte
  const raw =
    question.question ||
    question.text ||
    question.questionText ||
    '';

  // 4. Filtrage des placeholders « _ _ _ has this flag »
  //    On considère qu’un texte commençant par 2+ underscores est un reste de placeholder
  if (/^_{2,}/.test(raw.trim())) {
    console.warn('Placeholder filtré dans QuestionRenderer:', raw);
    return <p>Chargement de la question…</p>;
  }

  const text = raw.trim();

  // 5. Si pas de texte valide → loading
  if (!text) {
    return <p>Chargement de la question…</p>;
  }

  // 6. Rendu final pour les autres cas
  return (
    <div className="question-wrapper">
      <p className="question-text">{text}</p>
    </div>
  );
}
