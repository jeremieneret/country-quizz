// src/App.jsx
import React, { useState, useEffect } from 'react';
import Quiz from './components/Quiz/Quiz.jsx';
import { playSound } from './utils/playSound.js';
import SoundToggle from './components/Quiz/SoundToggle.jsx';
import './style/CSS/style.css'

export default function App() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      playSound('intro');
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SoundToggle />
      <div className={`${started ? 'quiz-mode' : 'start-mode'}`}>
        {started ? (
          <Quiz />
        ) : (
          <div className="start-screen">
            <h1>Country Quiz</h1>
            <p>Test your geography knowledge!</p>
            <button
              onClick={() => setStarted(true)}
              className="start-btn"
            >
              Start
            </button>
          </div>
        )}
      </div>
    </>
  );
}
