/**
 * Fait baisser progressivement le volume puis coupe l’audio.
 * @param {HTMLAudioElement} audio 
 * @param {number} duration en ms
 * @return {Promise}
 */
export function fadeOut(audio, duration = 500) {
  return new Promise((resolve) => {
    if (!audio) return resolve();
    const stepTime = 50;
    const steps = duration / stepTime;
    const volStep = audio.volume / steps;
    const fadeInterval = setInterval(() => {
      if (audio.volume - volStep > 0) {
        audio.volume = audio.volume - volStep;
      } else {
        audio.volume = 0;
        audio.pause();
        clearInterval(fadeInterval);
        resolve();
      }
    }, stepTime);
  });
}
