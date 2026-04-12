(function () {
  const CFG = window.GameConfig.CFG;
  const state = window.GameConfig.state;
  const setMessage = window.GameConfig.setMessage.bind(window.GameConfig);
  const { createPlayer, advanceDialogue, updateGame, respawnPlayer } = window.GameEntities;
  const UI = window.GameUI;

  const canvas = document.getElementById('game');
  canvas.width = CFG.WIDTH;
  canvas.height = CFG.HEIGHT;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const game = {
    player: createPlayer(),
    level: window.createMarioLevel(),
  };

  let lastMode = 'title';

  function stopAudio(audio) {
    if (!audio) return;
    audio.pause();
    try { audio.currentTime = 0; } catch (e) {}
  }

  function startVictoryCutscene() {
    const music = window.GameAssets?.assets?.music;
    const victoryMusic = window.GameAssets?.assets?.victoryMusic;
    if (music) music.pause();
    if (victoryMusic) {
      try { victoryMusic.currentTime = 0; } catch (e) {}
      victoryMusic.play().catch(() => {});
    }
    state.winFrame = 0;
    state.winCutsceneStarted = true;
  }

  function resetGame() {
    game.player = createPlayer();
    game.level = window.createMarioLevel();
    state.mode = 'title';
    state.tick = 0;
    state.cameraX = 0;
    state.msg = '';
    state.msgTimer = 0;
    state.flash = 0;
    state.playTimeFrames = 0;
    state.dialogue = null;
    state.dialogueIndex = 0;
    state.winFrame = 0;
    state.winCutsceneStarted = false;
    state.keys.left = false;
    state.keys.right = false;
    state.keys.jump = false;
    state.keys.jumpPressed = false;
    state.keys.downPressed = false;
    state.keys.down = false;
    state.keys.downPressed = false;
    stopAudio(window.GameAssets?.assets?.music);
    stopAudio(window.GameAssets?.assets?.victoryMusic);
    lastMode = state.mode;
  }

  function startGame() {
    state.mode = 'playing';
    state.winFrame = 0;
    state.winCutsceneStarted = false;
    const music = window.GameAssets?.assets?.music;
    const victoryMusic = window.GameAssets?.assets?.victoryMusic;
    stopAudio(victoryMusic);
    if (music && music.paused) {
      music.currentTime = 0;
      music.play().catch(() => {});
    }
    setMessage('Samuel Levy démarre. ↓ tape un bloc depuis dessus. R renvoie au dernier checkpoint et réinitialise blocs + monstres.', 180);
  }

  function keyDown(code) {
    if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(code)) state.keys.left = true;
    if (['ArrowRight', 'KeyD'].includes(code)) state.keys.right = true;
    if (['Space', 'ArrowUp', 'KeyW'].includes(code)) {
      if (!state.keys.jump) state.keys.jumpPressed = true;
      state.keys.jump = true;
    }
    if (['ArrowDown', 'KeyS'].includes(code)) {
      if (!state.keys.down) state.keys.downPressed = true;
      state.keys.down = true;
    }

    if (code === 'Enter') {
      if (state.mode === 'title') startGame();
      else if (state.mode === 'dialogue') advanceDialogue(game);
    }

    if (code === 'Space') {
      if (state.mode === 'title') startGame();
      else if (state.mode === 'dialogue') advanceDialogue(game);
    }

    if (code === 'KeyM') {
      const music = state.mode === 'win' ? window.GameAssets?.assets?.victoryMusic : window.GameAssets?.assets?.music;
      if (music) music.muted = !music.muted;
      setMessage(music && music.muted ? 'Musique coupée.' : 'Musique activée.', 70);
    }

    if (code === 'KeyR') {
      if (state.mode === 'title' || state.mode === 'win') {
        resetGame();
      } else if (game.player.checkpointActivated) {
        respawnPlayer(game, 'reset manuel', false);
      } else {
        resetGame();
      }
    }
  }

  function keyUp(code) {
    if (['ArrowLeft', 'KeyA', 'KeyQ'].includes(code)) state.keys.left = false;
    if (['ArrowRight', 'KeyD'].includes(code)) state.keys.right = false;
    if (['Space', 'ArrowUp', 'KeyW'].includes(code)) state.keys.jump = false;
    if (['ArrowDown', 'KeyS'].includes(code)) state.keys.down = false;
  }

  window.addEventListener('keydown', (e) => {
    keyDown(e.code);
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();
  });

  window.addEventListener('keyup', (e) => {
    keyUp(e.code);
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();
  });

  function updateModeTransitions() {
    if (state.mode !== lastMode) {
      if (state.mode === 'win') startVictoryCutscene();
      if (lastMode === 'win' && state.mode !== 'win') stopAudio(window.GameAssets?.assets?.victoryMusic);
      if (state.mode === 'gameover') stopAudio(window.GameAssets?.assets?.music);
      lastMode = state.mode;
    }
  }

  function update() {
    updateModeTransitions();
    if (state.mode === 'playing') {
      updateGame(game);
      state.playTimeFrames += 1;
    }
    if (state.mode === 'win' && state.winCutsceneStarted) {
      state.winFrame += 1;
    }
    if (state.mode === 'dialogue' && state.msgTimer > 0) state.msgTimer -= 1;
    state.tick += 1;
  }

  function render() {
    UI.drawBackground(ctx);
    UI.drawLevel(ctx, game.level);
    UI.drawGoal(ctx, game.level);
    UI.drawBoss(ctx, game.level);
    UI.drawPlayer(ctx, game.player);
    UI.drawHUD(ctx, game.player);

    if (state.mode === 'title') UI.drawTitle(ctx);
    if (state.mode === 'dialogue') UI.drawDialogue(ctx);
    if (state.mode === 'gameover') UI.drawEnd(ctx, 'gameover');
    if (state.mode === 'win') UI.drawEnd(ctx, 'win');

    if (state.flash > 0) {
      ctx.fillStyle = 'rgba(255,255,255,' + (state.flash / 20) + ')';
      ctx.fillRect(0, 0, CFG.WIDTH, CFG.HEIGHT);
    }
  }

  function frame() {
    update();
    render();
    state.keys.jumpPressed = false;
    state.keys.downPressed = false;
    requestAnimationFrame(frame);
  }

  window.GameAssets.load().then(() => {
    resetGame();
    requestAnimationFrame(frame);
  });
})();
