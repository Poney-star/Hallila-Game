(function () {
  const CFG = window.GameConfig.CFG;
  const G = CFG.GROUND_Y;
  const PLAYER_SMALL_H = 64;
  const PLAYER_BIG_H = 84;
  const BLOCK_SIZE = 50;
  const BASE_BLOCK_LIFT = PLAYER_BIG_H + BLOCK_SIZE + 46;
  const KIND_LIFT = { ground: 0, hill: 4, stone: 6, mountain: 8, platform: 8, bridge: 10, pipe: 2 };

  function solid(x, y, w, h, kind) {
    return { x, y, w, h: h || 22, kind: kind || 'platform' };
  }

  function block(x, y, contains) {
    return { x, y, w: 50, h: 50, contains: contains || 'coin', used: false, bump: 0 };
  }

  function hiddenBlock(x, y, contains) {
    return { x, y, w: 50, h: 50, contains: contains || null, used: false, bump: 0, hidden: true, revealed: false };
  }

  function spikesAt(x, y, count, move) {
    return Array.from({ length: count }, (_, i) => ({
      x: x + i * 34,
      y: y - 28,
      w: 30,
      h: 28,
      kind: 'spike',
      move: move ? { ...move, phase: (move.phase || 0) + i * 0.8 } : null,
    }));
  }

  function walker(x, y, left, right, speed) {
    return { x, y, w: 42, h: 40, left, right, vx: speed || 1.0, dead: false, squish: 0 };
  }


function supportAt(solids, xCenter) {
  const supports = solids.filter((s) => xCenter >= s.x - 8 && xCenter <= s.x + s.w + 8);
  if (!supports.length) return { y: G, kind: 'ground' };
  supports.sort((a, b) => a.y - b.y);
  return supports[0];
}

function blockOver(solids, x, contains, offset) {
  const support = supportAt(solids, x + 25);
  const lift = Math.max(172, Math.min(190, BASE_BLOCK_LIFT + (KIND_LIFT[support.kind] || 0) + (offset || 0)));
  return block(x, support.y - lift, contains);
}

function hiddenOver(solids, x, contains, offset) {
  const support = supportAt(solids, x + 25);
  const lift = Math.max(206, Math.min(228, BASE_BLOCK_LIFT + 30 + (KIND_LIFT[support.kind] || 0) + (offset || 0)));
  return hiddenBlock(x, support.y - lift, contains);
}


  window.createMarioLevel = function createMarioLevel() {
    const solids = [
      solid(0, G, 3120, 110, 'ground'),
      solid(3260, G, 2940, 110, 'ground'),
      solid(6360, G, 6040, 110, 'ground'),

      solid(360, G - 76, 170, 76, 'hill'),
      solid(650, G - 146, 140, 22, 'platform'),
      solid(960, G - 108, 180, 28, 'stone'),
      solid(1260, G - 160, 220, 86, 'mountain'),
      solid(1550, G - 232, 130, 20, 'bridge'),
      solid(1800, G - 150, 170, 26, 'stone'),
      solid(2060, G - 236, 140, 22, 'platform'),
      solid(2280, G - 96, 180, 96, 'hill'),
      solid(2550, G - 166, 150, 24, 'stone'),
      solid(2820, G - 236, 140, 20, 'bridge'),

      solid(3380, G - 118, 200, 28, 'stone'),
      solid(3660, G - 196, 150, 20, 'bridge'),
      solid(3920, G - 100, 180, 100, 'hill'),
      solid(4200, G - 258, 150, 24, 'platform'),
      solid(4470, G - 152, 180, 28, 'stone'),
      solid(4750, G - 214, 140, 20, 'bridge'),
      solid(5010, G - 292, 150, 22, 'platform'),
      solid(5280, G - 116, 200, 28, 'stone'),
      solid(5560, G - 176, 160, 22, 'platform'),
      solid(5820, G - 88, 200, 88, 'hill'),

      solid(6460, G - 88, 170, 88, 'hill'),
      solid(6710, G - 164, 150, 20, 'bridge'),
      solid(6970, G - 234, 170, 26, 'stone'),
      solid(7240, G - 150, 160, 22, 'platform'),
      solid(7480, G - 104, 220, 104, 'mountain'),
      solid(7780, G - 220, 150, 20, 'bridge'),
      solid(8040, G - 150, 180, 28, 'stone'),
      solid(8320, G - 286, 150, 24, 'platform'),
      solid(8600, G - 96, 180, 96, 'hill'),
      solid(8880, G - 178, 170, 24, 'stone'),

      solid(510, G - 88, 84, 88, 'pipe'),
      solid(1730, G - 120, 84, 120, 'pipe'),
      solid(3030, G - 88, 84, 88, 'pipe'),
      solid(4340, G - 120, 84, 120, 'pipe'),
      solid(6120, G - 88, 84, 88, 'pipe'),
      solid(7420, G - 120, 84, 120, 'pipe'),
      solid(8840, G - 88, 84, 88, 'pipe'),
    ];

    const blocks = [
      blockOver(solids, 260, 'coin', -8),
      blockOver(solids, 470, 'beer', 2),
      blockOver(solids, 760, 'coin', 0),
      blockOver(solids, 1030, 'flag', 4),
      blockOver(solids, 1360, 'coin', -6),
      blockOver(solids, 1620, 'beer', 0),
      blockOver(solids, 2130, 'coin', -2),
      blockOver(solids, 2510, 'flag', 6),

      blockOver(solids, 3460, 'coin', 2),
      blockOver(solids, 3740, 'beer', -6),
      blockOver(solids, 4240, 'coin', -2),
      blockOver(solids, 4590, 'flag', 2),
      blockOver(solids, 5060, 'beer', -4),
      blockOver(solids, 5640, 'coin', -2),
      blockOver(solids, 5950, 'flag', 4),

      blockOver(solids, 6550, 'coin', 4),
      blockOver(solids, 7030, 'beer', -4),
      blockOver(solids, 7290, 'coin', 2),
      blockOver(solids, 7810, 'flag', -6),
      blockOver(solids, 8090, 'beer', 2),
      blockOver(solids, 8380, 'coin', -8),
      blockOver(solids, 8930, 'flag', 0),
    ];

    const hiddenBlocks = [
      hiddenOver(solids, 1218, 'coin', 154),
      hiddenOver(solids, 1970, 'coin', 150),
      hiddenOver(solids, 2298, 'coin', 160),
      hiddenOver(solids, 2860, 'beer', 154),
      hiddenOver(solids, 3543, 'coin', 162),
      hiddenOver(solids, 4520, 'flag', 158),
      hiddenOver(solids, 5240, 'coin', 156),
      hiddenOver(solids, 5680, 'flag', 162),
      hiddenOver(solids, 6660, 'coin', 160),
      hiddenOver(solids, 7070, 'flag', 162),
      hiddenOver(solids, 7400, 'coin', 166),
      hiddenOver(solids, 7850, 'beer', 160),
      hiddenOver(solids, 8220, 'coin', 164),
      hiddenOver(solids, 8720, 'flag', 154),
      hiddenOver(solids, 9058, 'coin', 154),
    ];

    const hazards = [
      ...spikesAt(900, G, 3),
      ...spikesAt(1480, G, 2, { axis: 'y', amp: 18, speed: 0.06, phase: 0.2 }),
      ...spikesAt(2360, G, 3),
      ...spikesAt(2960, G, 2, { axis: 'x', amp: 28, speed: 0.055, phase: 1.4 }),
      ...spikesAt(3880, G, 3),
      ...spikesAt(4540, G, 2, { axis: 'y', amp: 18, speed: 0.06, phase: 2.2 }),
      ...spikesAt(5480, G, 4),
      ...spikesAt(6020, G, 2, { axis: 'x', amp: 24, speed: 0.07, phase: 0.8 }),
      ...spikesAt(6900, G, 3),
      ...spikesAt(7580, G, 2, { axis: 'y', amp: 22, speed: 0.07, phase: 1.1 }),
      ...spikesAt(8480, G, 3),

      ...spikesAt(1280, G - 160, 2),
      ...spikesAt(2055, G - 236, 2, { axis: 'x', amp: 16, speed: 0.08, phase: 0.6 }),
      ...spikesAt(4205, G - 258, 2),
      ...spikesAt(5015, G - 292, 2, { axis: 'y', amp: 12, speed: 0.08, phase: 0.3 }),
      ...spikesAt(6975, G - 234, 2),
      ...spikesAt(8325, G - 286, 2, { axis: 'x', amp: 14, speed: 0.09, phase: 1.8 }),
    ];

    const enemies = [];
    [
      [700, G - 40, 620, 1120, 1.05], [1170, G - 40, 1080, 1500, 1.08],
      [1870, G - 190, 1800, 1960, 1.0], [2310, G - 136, 2280, 2460, 1.05],
      [2620, G - 206, 2550, 2700, 1.12], [3750, G - 40, 3680, 3900, 1.08],
      [3970, G - 140, 3920, 4100, 1.1], [4230, G - 298, 4200, 4350, 1.16],
      [4510, G - 192, 4470, 4650, 1.12], [5040, G - 332, 5010, 5160, 1.2],
      [5320, G - 156, 5280, 5480, 1.12], [5590, G - 216, 5560, 5720, 1.15],
      [6470, G - 128, 6460, 6630, 1.1], [6730, G - 204, 6710, 6860, 1.15],
      [7000, G - 274, 6970, 7140, 1.16], [7270, G - 190, 7240, 7400, 1.12],
      [7510, G - 144, 7480, 7700, 1.15], [7810, G - 260, 7780, 7930, 1.18],
      [8070, G - 190, 8040, 8220, 1.16], [8610, G - 136, 8600, 8780, 1.1],
      [8900, G - 218, 8880, 9050, 1.14],
      [1400, G - 40, 1300, 1600, 1.18], [3630, G - 236, 3660, 3810, 1.08],
      [4780, G - 254, 4750, 4890, 1.2], [5860, G - 128, 5820, 6020, 1.1],
      [8350, G - 326, 8320, 8470, 1.22],
    ].forEach((d) => enemies.push(walker(...d)));

    const piranhas = [
      { x: 1730 + 22, pipeX: 1730, pipeY: G - 120, pipeW: 84, pipeH: 120, w: 40, h: 54, rise: 42, phase: 80 },
      { x: 4340 + 22, pipeX: 4340, pipeY: G - 120, pipeW: 84, pipeH: 120, w: 40, h: 54, rise: 44, phase: 220 },
      { x: 7420 + 22, pipeX: 7420, pipeY: G - 120, pipeW: 84, pipeH: 120, w: 40, h: 54, rise: 44, phase: 380 },
      { x: 8840 + 22, pipeX: 8840, pipeY: G - 88, pipeW: 84, pipeH: 88, w: 40, h: 54, rise: 36, phase: 460 },
    ];

    return {
      width: CFG.LEVEL_WIDTH,
      solids,
      blocks,
      hiddenBlocks,
      hazards,
      enemies,
      piranhas,
      powerups: [],
      checkpoint: {
        x: 3320,
        y: G - 172,
        w: 36,
        h: 140,
        activated: false,
        tag: 'mid',
      },
      checkpoint2: {
        x: 6130,
        y: G - 208,
        baseY: G - 88,
        spawnX: 6137,
        spawnY: G - 88,
        w: 36,
        h: 120,
        activated: false,
        tag: 'late',
      },
      bossCheckpoint: {
        x: 10025,
        y: G - 172,
        w: 36,
        h: 140,
        activated: false,
        tag: 'boss',
      },
      corridorStart: 9200,
      boss: {
        active: false,
        introDone: false,
        defeated: false,
        x: 10960,
        y: G - 96,
        w: 86,
        h: 100,
        vx: 0,
        hp: 6,
        maxHp: 6,
        hurt: 0,
        stun: 0,
        dir: -1,
        chaseSpeed: 2.15,
        dashSpeed: 6.0,
        dashCooldown: 70,
        dashTimer: 0,
        windup: 0,
        leftWall: 9900,
        rightWall: 11620,
        wallW: 54,
        wallCloseSpeed: 0.18,
        minGap: 600,
        arenaLeft: 10010,
        arenaRight: 11510,
        startX: 10960,
        startY: G - 96,
        startLeftWall: 9900,
        startRightWall: 11620,
      },
      bossTriggerX: 10360,
      goalX: 11900,
    };
  };
})();
