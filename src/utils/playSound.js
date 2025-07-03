const soundFiles = {
  intro:               '/assets/sounds/intro.ogg',
  'end_screen_score>=7': '/assets/sounds/end_screen_score>=7.ogg',
  'end_screen_score<7':  '/assets/sounds/end_screen_score<7.ogg',
  good_answer:         '/assets/sounds/good_answer.ogg',
  wrong_answer:        '/assets/sounds/wrong_answer.ogg',
  timer_end:           '/assets/sounds/timer_end.ogg',
};

// tableau pour tracker tous les Audio en cours
let activeAudios = [];

export function playSound(key, { loop = false, volume = 1 } = {}) {
  if (localStorage.getItem('muted') === 'true') {
    return null;
  }
  const src = soundFiles[key];
  if (!src) return null;

  const audio = new Audio(src);
  audio.loop = loop;
  audio.volume = volume;
  audio.play();

  // on stocke pour pouvoir arrêter plus tard
  activeAudios.push(audio);
  // on nettoie quand la piste se termine (non-loop)
  audio.addEventListener('ended', () => {
    activeAudios = activeAudios.filter(a => a !== audio);
  });

  return audio;
}

export function stopAllSounds() {
  activeAudios.forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
  activeAudios = [];
}
