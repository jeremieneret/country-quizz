// src/App.jsx

import React, { useState, useEffect } from 'react'
import Quiz from './components/Quiz/Quiz.jsx'
import ContinentSelector from './components/Quiz/ContinentSelector.jsx'
import { playSound } from './utils/playSound.js'
import SoundToggle from './components/Quiz/SoundToggle.jsx'
import './style/CSS/style.css'

export default function App() {
  const [started, setStarted] = useState(false)
  const [continents, setContinents] = useState(null)

  // Joue l’intro au démarrage si le son n’est pas coupé
  useEffect(() => {
    const timer = setTimeout(() => playSound('intro'), 300)
    return () => clearTimeout(timer)
  }, [])

  // Après le clic sur “Start”
  const handleStart = () => {
    setStarted(true)
  }

  // Callback depuis le sélecteur de continents
  const handleContinents = (selected) => {
    setContinents(selected)
  }

  // “Play again” : on revient au sélecteur, sans repasser par l’écran Start
  const handleRestart = () => {
    setContinents(null)
  }

  return (
    <>
      <SoundToggle />
      <div className={started ? 'quiz-mode' : 'start-mode'}>
        {/* 1) Écran de bienvenue */}
        {!started && (
          <div className="start-screen">
            <h1>Country Quiz</h1>
            <p>Test your geography knowledge!</p>
            <button onClick={handleStart} className="start-btn">
              Start
            </button>
          </div>
        )}

        {/* 2) Sélecteur de continent */}
        {started && continents === null && (
          <ContinentSelector onConfirm={handleContinents} />
        )}

        {/* 3) Quiz lui-même */}
        {started && continents !== null && (
          <Quiz continents={continents} onRestart={handleRestart} />
        )}
      </div>
    </>
  )
}
