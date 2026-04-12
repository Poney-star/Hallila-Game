window.PPB = window.PPB || {};

window.PPB.CONFIG = {
  STORAGE_KEY: 'pp-range-golden-racket',
  PROJECTILE_SPEED: 16,
  GOLDEN_PROJECTILE_SPEED: 18.5,
  SHOT_COOLDOWN_MS: 105,
  MISS_LIVES_LOST: 1,
  STARTING_MISSES_ALLOWED: 7,
  MUSIC_SRC: 'assets/audio/aDoom.ogg',
  MUSIC_VOLUME: 0.32,
  FINALE_AUDIO_SRC: 'assets/audio/finale.m4a',
  COMBO_WINDOW: 1.15,
  LEVELS: [
    { goal: 18, timeLimit: 35, lanes: 2, targetCount: 4, speed: 1.45, size: 62, armorChance: 0, missesAllowed: 7 },
    { goal: 38, timeLimit: 40, lanes: 3, targetCount: 5, speed: 1.9, size: 58, armorChance: 0.15, missesAllowed: 8 },
    { goal: 66, timeLimit: 60, lanes: 3, targetCount: 6, speed: 2.4, size: 54, armorChance: 0.28, missesAllowed: 8 },
    { goal: 76, timeLimit: 65, lanes: 4, targetCount: 7, speed: 3.0, size: 50, armorChance: 0.38, missesAllowed: 9 }
  ]
};
