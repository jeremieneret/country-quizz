import React, { useEffect } from 'react';
import useQuiz from '../../hooks/useQuiz.js';
import Pagination from './Pagination.jsx';
import QuestionRenderer from './QuestionRenderer.jsx';
import OptionsList from './OptionsList.jsx';
import EndScreen from './EndScreen.jsx';
import TimerBar from './TimerBar.jsx';

export default function Quiz({ continents, onRestart }) {
  const {
    questions,
    answers,
    currentIndex,
    score,
    finished,
    timeLeft,
    selectOption,
    next,
  } = useQuiz(continents);

  useEffect(() => {
    function onKeyDown(e) {
      if (finished) {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
          onRestart();
        }
        return;
      }
      if (
        (e.key === 'ArrowRight' || e.key === 'Enter') &&
        answers[currentIndex] !== null
      ) {
        next();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [finished, currentIndex, answers, next, onRestart]);

  if (questions === null) {
    return <p>Loading questions…</p>;
  }

  if (questions.length === 0) {
    return (
      <div className="no-questions">
        <p>No questions for selected continent(s).</p>
        <button onClick={onRestart}>Choose other continent(s)</button>
      </div>
    );
  }

  if (finished) {
    return (
      <EndScreen
        score={score}
        total={questions.length}
        onRestart={onRestart}
      />
    );
  }

  const current = questions[currentIndex];
  const userAns = answers[currentIndex];

  if (!current || !current.options?.length) {
    return <p>Chargement de la question…</p>;
  }

  return (
    <div className="quiz-container">
      <header>
        <h1>Country Quiz</h1>
        <p>
          <span>🏆</span> {score} / {questions.length} points
        </p>
      </header>

      <div className="quiz">
        <Pagination pages={questions.length} current={currentIndex} />
        <TimerBar timeLeft={timeLeft} />

        <QuestionRenderer
          question={current}
          index={currentIndex}
          total={questions.length}
        />

        <OptionsList
          options={current.options}
          correct={current.correctAnswer}
          selected={userAns}
          onSelect={selectOption}
        />
      </div>
    </div>
  );
}
