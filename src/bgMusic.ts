const audio = new Audio("/sprites/musikk.mp3");
audio.loop = true;
audio.volume = 0.5;
audio.currentTime = 12;

export const bgMusic = audio;

export function dimMusic() {
  audio.volume = 0.1;
}

export function muteMusic() {
  audio.pause();
}

export function restoreMusic() {
  audio.volume = 0.5;
  audio.play().catch(() => {});
}
