import { renderApp } from './ui.js';
import { state } from './state.js';
import { updateWorld, bindWorldKeys } from './world.js';
import { WORLD, PLAYER_SPRITE, playerSpritePose } from './data.js';
import { initAudio, syncAudioForScreen } from './audio.js';

const root = document.getElementById('app');
let previousScreen = state.screen;
let previousMessage = state.worldMessage;
let previousDefeated = state.defeatedTrainers.join(',');
let previousSpriteFrame = state.player.spriteFrame;
let previousDirection = state.player.direction;
let previousWalking = state.player.walking;
let previousModalKey = state.modal ? JSON.stringify(state.modal) : '';

function syncWorldDom() {
  const arena = document.getElementById('worldArena');
  const player = document.getElementById('playerAvatar');
  if (arena && player) {
    const width = arena.clientWidth || WORLD.width;
    const height = arena.clientHeight || WORLD.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scaleX = width / WORLD.width;
    const scaleY = height / WORLD.height;
    player.style.left = `${centerX}px`;
    player.style.top = `${centerY}px`;

    const sprite = player.querySelector('.world-player-sprite');
    if (sprite) {
      const pose = playerSpritePose(state.player);
      const scale = 2;
      const frameX = pose.x * PLAYER_SPRITE.frameWidth;
      const frameY = pose.y * PLAYER_SPRITE.frameHeight;
      sprite.style.backgroundPosition = `-${frameX * scale}px -${frameY * scale}px`;
      sprite.style.transform = pose.mirror ? 'scaleX(-1)' : 'scaleX(1)';
      player.classList.toggle('walking', state.player.walking);
    }

    const ratioX = Math.max(0, Math.min(1, (state.player.x - WORLD.bounds.minX) / (WORLD.bounds.maxX - WORLD.bounds.minX)));
    const ratioY = Math.max(0, Math.min(1, (state.player.y - WORLD.bounds.minY) / (WORLD.bounds.maxY - WORLD.bounds.minY)));
    arena.style.backgroundPosition = `${(ratioX * 100).toFixed(2)}% ${(ratioY * 100).toFixed(2)}%`;

    arena.querySelectorAll('[data-world-x]').forEach((el) => {
      const wx = Number(el.dataset.worldX);
      const wy = Number(el.dataset.worldY);
      const screenX = centerX + (wx - state.player.x) * scaleX;
      const screenY = centerY + (wy - state.player.y) * scaleY;
      el.style.left = `${screenX}px`;
      el.style.top = `${screenY}px`;
      const margin = 140;
      const visible = screenX > -margin && screenX < width + margin && screenY > -margin && screenY < height + margin;
      el.style.opacity = visible ? '1' : '0';
    });
  }
  const dialog = document.querySelector('.dialog-box');
  if (dialog) dialog.textContent = state.worldMessage;
}

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - (state.lastFrame || timestamp)) / 1000, 0.05);
  state.lastFrame = timestamp;

  if (state.screen === 'world') {
    updateWorld(dt);
  }

  const defeatedNow = state.defeatedTrainers.join(',');
  const spriteChanged = previousSpriteFrame !== state.player.spriteFrame || previousDirection !== state.player.direction || previousWalking !== state.player.walking;
  const modalKey = state.modal ? JSON.stringify(state.modal) : '';

  if (state.screen !== previousScreen || defeatedNow !== previousDefeated || modalKey !== previousModalKey) {
    const before = previousScreen;
    previousScreen = state.screen;
    previousDefeated = defeatedNow;
    previousMessage = state.worldMessage;
    previousSpriteFrame = state.player.spriteFrame;
    previousDirection = state.player.direction;
    previousWalking = state.player.walking;
    previousModalKey = modalKey;
    renderApp(root);
    syncAudioForScreen(state.screen, before);
  } else if (state.screen === 'world') {
    if (spriteChanged) {
      previousSpriteFrame = state.player.spriteFrame;
      previousDirection = state.player.direction;
      previousWalking = state.player.walking;
    }
    syncWorldDom();
    if (state.worldMessage !== previousMessage) {
      previousMessage = state.worldMessage;
      syncWorldDom();
    }
  }

  requestAnimationFrame(gameLoop);
}

bindWorldKeys();
renderApp(root);
initAudio();
syncAudioForScreen(state.screen, null);
requestAnimationFrame(gameLoop);
