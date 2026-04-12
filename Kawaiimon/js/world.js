import { WORLD, TRAINERS, playerAnimationFrames } from './data.js';
import { state, bossUnlocked, openRematchPrompt, setRematchDeclinedTrainer, closeModal } from './state.js';
import { clamp } from './helpers.js';
import { beginBattle, healTeam } from './battle.js';

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function updatePlayerSprite(dx, dy, dt) {
  const player = state.player;
  const moving = dx !== 0 || dy !== 0;
  player.walking = moving;

  if (moving) {
    if (Math.abs(dx) > Math.abs(dy)) {
      player.direction = dx > 0 ? 'right' : 'left';
    } else {
      player.direction = dy > 0 ? 'down' : 'up';
    }
  }

  const frames = playerAnimationFrames(player);
  const stepDuration = moving ? 0.12 : 0.2;

  player.spriteTimer += dt;
  if (player.spriteTimer >= stepDuration) {
    player.spriteTimer = 0;
    player.spriteFrame = (player.spriteFrame + 1) % frames.length;
  }
}

export function updateWorld(dt) {
  if (state.screen !== 'world') return;
  if (state.modal) return;
  const speed = state.player.speed * dt;
  let dx = 0;
  let dy = 0;

  if (state.keys.has('arrowup') || state.keys.has('w') || state.keys.has('z')) dy -= 1;
  if (state.keys.has('arrowdown') || state.keys.has('s')) dy += 1;
  if (state.keys.has('arrowleft') || state.keys.has('a') || state.keys.has('q')) dx -= 1;
  if (state.keys.has('arrowright') || state.keys.has('d')) dx += 1;

  updatePlayerSprite(dx, dy, dt);

  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy) || 1;
    state.player.x = clamp(state.player.x + (dx / len) * speed, WORLD.bounds.minX, WORLD.bounds.maxX);
    state.player.y = clamp(state.player.y + (dy / len) * speed, WORLD.bounds.minY, WORLD.bounds.maxY);
  }

  const playerPoint = { x: state.player.x, y: state.player.y };
  let nearbyTrainerId = null;

  if (distance(playerPoint, WORLD.healSpot) < WORLD.healSpot.radius + 6) {
    state.worldMessage = 'Le coeur central soigne ton équipe. Le bouton Soin rapide fait la même chose.';
  }

  if (distance(playerPoint, WORLD.startSpot) < WORLD.startSpot.radius + 4) {
    state.worldMessage = 'Point de départ. Eitan peut repartir au centre du ring.';
  }

  for (const marker of WORLD.trainers) {
    const trainer = TRAINERS.find((t) => t.id === marker.id);
    if (!trainer) continue;
    if (distance(playerPoint, marker) >= marker.radius) continue;

    nearbyTrainerId = trainer.id;

    if (trainer.boss) {
      if (!bossUnlocked()) {
        state.worldMessage = 'Le boss refuse de se montrer. Il faut vaincre les trois dresseurs d\'abord.';
        return;
      }
      if (state.defeatedTrainers.includes('magnus')) {
        state.worldMessage = 'Le trône du boss est vide. L\'arène est à toi.';
        return;
      }
      state.worldMessage = 'Magnus t\'attend sur l\'estrade violette. Le combat final commence.';
      beginBattle(3);
      return;
    }

    if (state.defeatedTrainers.includes(trainer.id)) {
      state.worldMessage = `${trainer.name} est déjà battue. Tu peux lui reparler pour farmer des niveaux.`;
      if (state.rematchDeclinedTrainerId !== trainer.id) {
        openRematchPrompt(trainer.id);
      }
      return;
    }

    state.worldMessage = `${trainer.name} te repère. Le combat commence.`;
    beginBattle(TRAINERS.findIndex((t) => t.id === trainer.id));
    return;
  }

  if (!nearbyTrainerId && state.rematchDeclinedTrainerId) {
    setRematchDeclinedTrainer(null);
  }

  if (dx !== 0 || dy !== 0) {
    state.worldMessage = "Tu avances dans l'arène kawaii. Les dresseuses t'observent depuis les côtés.";
  }
}

export function bindWorldKeys() {
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (state.screen === 'world' && key === 'h') {
      healTeam("Soin rapide activé. Toute l'équipe est remise à neuf.");
      return;
    }
    state.keys.add(key);
  });
  window.addEventListener('keyup', (event) => {
    state.keys.delete(event.key.toLowerCase());
  });
  window.addEventListener('blur', () => state.keys.clear());
}
