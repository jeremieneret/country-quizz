// src/hooks/useQuiz.js
import { useEffect, useState, useCallback } from 'react';
import { generateMixedQuestions } from '../utils/api.js';
import { playSound } from '../utils/playSound.js';

export default function useQuiz() {
  const [questions, setQuestions]       = useState([]);
  const [answers, setAnswers]           = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore]               = useState(0);
  const [finished, setFinished]         = useState(false);
  const [timeLeft, setTimeLeft]         = useState(10);

  const initQuiz = useCallback(async () => {
    const qs = await generateMixedQuestions();
    setQuestions(qs);
    setAnswers(Array(qs.length).fill(null));
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setTimeLeft(10);
  }, []);

  const next = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(10);
    } else {
      setFinished(true);
    }
  }, [currentIndex, questions.length]);

  useEffect(() => {
    initQuiz();
  }, [initQuiz]);

  useEffect(() => {
    if (finished || answers[currentIndex] !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t === 1) {
          clearInterval(timer);
          playSound('timer_end');
          next();
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, answers, finished, next]);

  const selectOption = (option) => {
    if (answers[currentIndex] !== null) return;

    setAnswers((a) => {
      const copy = [...a];
      copy[currentIndex] = option;
      return copy;
    });

    const isCorrect = option === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
      playSound('good_answer');
    } else {
      playSound('wrong_answer');
    }
  };

  return {
    questions,
    answers,
    currentIndex,
    score,
    finished,
    timeLeft,
    initQuiz,
    selectOption,
    next,
  };
}
