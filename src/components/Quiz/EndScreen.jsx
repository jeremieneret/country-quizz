// src/components/Quiz/EndScreen.jsx
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { playSound } from '../../utils/playSound.js';
import { fadeOut } from '../../utils/audioFade.js';
import Congrats from '/assets/images/congrats.png';

export default function EndScreen({ score, total, onRestart }) {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // joue la bonne musique et la stocke
    const key = score >= 7
      ? 'end_screen_score>=7'
      : 'end_screen_score<7';
    const a = playSound(key, { loop: true, volume: 1 });
    setAudio(a);

    if (score >= 7) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    }

    // cleanup si on quitte l’écran sans cliquer
    return () => {
      if (a) a.pause();
    };
  }, [score]);

  // wrapper onRestart pour ajouter le fade out
  const handleRestart = async () => {
    await fadeOut(audio, 800);  // fondu sur 800ms
    onRestart();
  };

  return (
    <div className="quiz-end">
      {score >= 7 && <img src={Congrats} alt="Congrats" />}
      <h2>{score >= 7 ? 'You rocked it!' : 'Nice try!'}</h2>
      <p>You answered {score} / {total} correctly</p>
      <button className="restart-btn" onClick={handleRestart}>
        Play again
      </button>
    </div>
  );
}
