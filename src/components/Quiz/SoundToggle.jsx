import React, { useState, useEffect } from 'react';
import { stopAllSounds } from '../../utils/playSound.js';

export default function SoundToggle() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('muted');
    setMuted(stored === 'true');
  }, []);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    localStorage.setItem('muted', next);

    if (next) {
      stopAllSounds();
    }
  }

  return (
    <button className="sound-toggle" onClick={toggleMute}>
      {muted ? '🔇 Sound Off' : '🔊 Sound On'}
    </button>
  );
}
