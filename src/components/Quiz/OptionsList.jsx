// src/components/Quiz/OptionsList.jsx
import React from 'react';
import CheckIcon from '/assets/images/Check_round_fill.svg';
import CloseIcon from '/assets/images/Close_round_fill.svg';

export default function OptionsList({ options, correct, selected, onSelect }) {
  return (
    <ul className="options-list">
      {options.map((opt) => {
        const isCorrect = selected !== null && opt === correct;
        const isWrong   = selected !== null && opt === selected && selected !== correct;

        return (
          <li
            key={opt}
            className={`option-item ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
          >
            <button
              className="option"
              onClick={() => onSelect(opt)}
              disabled={selected !== null}
            >
              {opt}
              {isCorrect && (
                <img src={CheckIcon} alt="correct" className="icon" />
              )}
              {isWrong && (
                <img src={CloseIcon} alt="wrong" className="icon" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
