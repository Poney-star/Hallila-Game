const TRACKS = {
  world: {
    src: './pokeitan final.wav',
    loop: true,
  },
  battle: {
    src: './pokeitan fight.wav',
    loop: true,
  },
};

const players = new Map();
let currentTrack = null;
let unlocked = false;
let visibilityBound = false;

function ensureAudio(trackName) {
  if (players.has(trackName)) return players.get(trackName);
  const config = TRACKS[trackName];
  const audio = new Audio(config.src);
  audio.loop = Boolean(config.loop);
  audio.preload = 'auto';
  audio.playsInline = true;
  audio.dataset.track = trackName;
  audio.addEventListener('error', () => {
    if (trackName === 'battle' && currentTrack === 'battle') {
      playTrack('world');
    }
  });
  players.set(trackName, audio);
  return audio;
}

function stopOthers(trackName) {
  players.forEach((audio, key) => {
    if (key === trackName) return;
    audio.pause();
    if (key === 'battle') {
      audio.currentTime = 0;
    }
  });
}

function unlockAudio() {
  unlocked = true;
  const track = currentTrack || 'world';
  playTrack(track, { restart: false, allowMutedFallback: true });
  ['click', 'keydown', 'touchstart', 'pointerdown'].forEach((eventName) => {
    document.removeEventListener(eventName, unlockAudio, true);
  });
}

function bindUnlock() {
  ['click', 'keydown', 'touchstart', 'pointerdown'].forEach((eventName) => {
    document.addEventListener(eventName, unlockAudio, { capture: true, once: true });
  });
}

export function initAudio() {
  ensureAudio('world');
  ensureAudio('battle');

  if (!visibilityBound) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) return;
      const track = currentTrack || 'world';
      const audio = ensureAudio(track);
      if (audio.paused) {
        playTrack(track, { restart: false, allowMutedFallback: false });
      }
    });
    visibilityBound = true;
  }

  bindUnlock();
  playTrack('world', { restart: false, allowMutedFallback: true });
}

export async function playTrack(trackName, options = {}) {
  const { restart = false, allowMutedFallback = false } = options;
  const audio = ensureAudio(trackName);
  stopOthers(trackName);

  if (restart) {
    audio.currentTime = 0;
  }

  currentTrack = trackName;

  try {
    audio.muted = false;
    await audio.play();
    unlocked = true;
  } catch (error) {
    if (allowMutedFallback) {
      try {
        audio.muted = true;
        await audio.play();
      } catch (_) {
        // Autoplay still blocked, we will retry after user interaction.
      }
    }
  }
}

export function syncAudioForScreen(screen, previousScreen = null) {
  const enteringBattle = screen === 'battle' && previousScreen !== 'battle';
  const nextTrack = screen === 'battle' ? 'battle' : 'world';
  const shouldRestart = enteringBattle || (!currentTrack && nextTrack === 'world');
  playTrack(nextTrack, { restart: shouldRestart, allowMutedFallback: !unlocked });
}
