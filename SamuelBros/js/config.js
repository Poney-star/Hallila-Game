window.GameConfig = {
  CFG: {
    WIDTH: 1600,
    HEIGHT: 900,
    GROUND_Y: 770,
    GRAVITY: 0.68,
    MAX_FALL: 16.5,
    CAMERA_LERP: 0.12,
    LEVEL_WIDTH: 12400,
    TILE: 48,
    HERO_NAME: 'Samuel Levy',
    BOSS_NAME: 'Madame Gillard',
  },
  state: {
    mode: 'title',
    tick: 0,
    cameraX: 0,
    msg: '',
    msgTimer: 0,
    flash: 0,
    playTimeFrames: 0,
    keys: {
      left: false,
      right: false,
      jump: false,
      jumpPressed: false,
      down: false,
      downPressed: false,
    },
    dialogue: null,
    dialogueIndex: 0,
    winFrame: 0,
    winCutsceneStarted: false,
  },
  setMessage(text, frames) {
    this.state.msg = text;
    this.state.msgTimer = frames || 140;
  },
};
