(function () {
  const CFG = window.GameConfig.CFG;
  const state = window.GameConfig.state;
  const setMessage = window.GameConfig.setMessage.bind(window.GameConfig);

  function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function createPlayer() {
    return {
      x: 100,
      y: CFG.GROUND_Y - 64,
      w: 50,
      h: 64,
      vx: 0,
      vy: 0,
      speed: 4.8,
      jumpSpeed: 13.72,
      onGround: false,
      coyote: 0,
      jumpHold: 0,
      maxJumpHold: 3,
      jumpBuffer: 0,
      faceDir: 1,
      lives: 4,
      coins: 0,
      form: 'small',
      inv: 0,
      star: 0,
      checkpointX: 100,
      checkpointY: CFG.GROUND_Y - 64,
      checkpointActivated: false,
      checkpointTag: 'start',
      maxLives: 4,
      prevX: 100,
      prevY: CFG.GROUND_Y - 64,
    };
  }

  function applyForm(player) {
    const oldH = player.h;
    if (player.form === 'small') {
      player.w = 50;
      player.h = 64;
    } else {
      player.w = 58;
      player.h = 84;
    }
    player.y -= (player.h - oldH);
  }

  function visibleHiddenBlocks(level) {
    return (level.hiddenBlocks || []).filter((b) => b.revealed);
  }

  function allSolids(level) {
    return level.solids.concat(level.blocks, visibleHiddenBlocks(level));
  }

  function collideHiddenFromBelow(body, hiddenBlocks, onHitBlock) {
    if (body.vy >= 0) return false;
    let hit = false;
    for (const s of hiddenBlocks || []) {
      if (s.revealed) continue;
      if (!overlap(body, s)) continue;
      const prevTop = body.prevY;
      if (prevTop >= s.y + s.h - 16) {
        revealHidden(s);
        body.y = s.y + s.h;
        body.vy = 0;
        if (onHitBlock && s.contains && !s.used) onHitBlock(s);
        hit = true;
      }
    }
    return hit;
  }

  function revealHidden(block) {
    if (block && block.hidden && !block.revealed) {
      block.revealed = true;
      block.bump = 8;
      setMessage('Bloc invisible. Troll activé.', 60);
    }
  }

  function collideX(body, solids) {
    for (const s of solids) {
      if (!overlap(body, s)) continue;
      revealHidden(s);
      if (body.vx > 0) body.x = s.x - body.w;
      if (body.vx < 0) body.x = s.x + s.w;
      body.vx = 0;
    }
  }

  function collideY(body, solids, onHitBlock) {
    let landed = false;
    for (const s of solids) {
      if (!overlap(body, s)) continue;
      const prevBottom = body.prevY + body.h;
      const prevTop = body.prevY;
      revealHidden(s);
      if (body.vy > 0 && prevBottom <= s.y + 16) {
        body.y = s.y - body.h;
        body.vy = 0;
        landed = true;
      } else if (body.vy < 0 && prevTop >= s.y + s.h - 16) {
        body.y = s.y + s.h;
        body.vy = 0;
        if (onHitBlock && s.contains && !s.used) onHitBlock(s);
      }
    }
    return landed;
  }

  function resetBossEncounter(level) {
    const boss = level && level.boss;
    if (!boss) return;
    boss.active = false;
    boss.introDone = false;
    boss.defeated = false;
    boss.x = boss.startX != null ? boss.startX : boss.x;
    boss.y = boss.startY != null ? boss.startY : boss.y;
    boss.vx = 0;
    boss.hp = boss.maxHp || 6;
    boss.hurt = 0;
    boss.stun = 0;
    boss.dir = -1;
    boss.dashCooldown = 70;
    boss.dashTimer = 0;
    boss.windup = 0;
    boss.leftWall = boss.startLeftWall != null ? boss.startLeftWall : boss.leftWall;
    boss.rightWall = boss.startRightWall != null ? boss.startRightWall : boss.rightWall;
    boss.arenaLeft = boss.leftWall + boss.wallW + 56;
    boss.arenaRight = boss.rightWall - boss.wallW - 56;
  }

  function restoreCheckpointFlags(level, player) {
    if (!level || !player || !player.checkpointActivated) return;
    const rank = { start: 0, mid: 1, late: 2, boss: 3 };
    const playerRank = rank[player.checkpointTag] || 0;
    if (level.checkpoint) level.checkpoint.activated = playerRank >= 1;
    if (level.checkpoint2) level.checkpoint2.activated = playerRank >= 2;
    if (level.bossCheckpoint) level.bossCheckpoint.activated = playerRank >= 3;
  }

  function resetDynamicWorld(game) {
    const p = game.player;
    const saved = {
      checkpointActivated: p.checkpointActivated,
      checkpointTag: p.checkpointTag,
      checkpointX: p.checkpointX,
      checkpointY: p.checkpointY,
    };
    game.level = window.createMarioLevel();
    p.checkpointActivated = saved.checkpointActivated;
    p.checkpointTag = saved.checkpointTag;
    p.checkpointX = saved.checkpointX;
    p.checkpointY = saved.checkpointY;
    restoreCheckpointFlags(game.level, p);
  }

  function respawnPlayer(game, reason, exhaustedLives) {
    const p = game.player;
    resetDynamicWorld(game);

    if (exhaustedLives) {
      p.lives = p.maxLives || 4;
      setMessage('Plus de vies. Samuel repart du checkpoint. Monstres et blocs repartent aussi.', 140);
    } else {
      setMessage(`Respawn après ${reason || 'un troll urbain'}. Le niveau se réinitialise depuis le checkpoint.`, 130);
    }

    p.form = 'small';
    applyForm(p);
    p.x = p.checkpointX;
    p.y = p.checkpointY;
    p.vx = 0;
    p.vy = 0;
    p.onGround = false;
    p.coyote = 0;
    p.jumpHold = 0;
    p.jumpBuffer = 0;
    p.inv = 120;
    p.star = 0;
    state.flash = 16;
    state.mode = 'playing';
    state.dialogue = null;
    state.dialogueIndex = 0;
  }

  function hitPlayer(game, reason) {
    const p = game.player;
    if (p.inv > 0 || p.star > 0 || state.mode === 'dialogue') return;

    if (p.form === 'big') {
      p.form = 'small';
      applyForm(p);
      p.inv = 120;
      setMessage('Samuel perd sa bière, mais il repart.', 100);
      return;
    }

    p.lives -= 1;
    state.flash = 20;
    if (p.lives <= 0) {
      if (p.checkpointActivated) {
        respawnPlayer(game, reason, true);
      } else {
        state.mode = 'gameover';
      }
      return;
    }

    respawnPlayer(game, reason, false);
  }

  function spawnItem(level, block) {
    const kind = block.contains;
    if (kind === 'coin') return 'coin';
    level.powerups.push({
      kind,
      x: block.x + 10,
      y: block.y - 36,
      w: 30,
      h: 30,
      vx: kind === 'flag' ? 1.35 : 0.9,
      vy: kind === 'flag' ? -6.4 : 0,
      rise: 16,
      collected: false,
      prevY: block.y - 36,
    });
    return kind;
  }

  function rewardMessage(player, reward) {
    if (reward === 'coin') {
      player.coins += 1;
      setMessage('Pièce récupérée.', 50);
    } else if (reward === 'beer') {
      setMessage('Bière en vue.', 70);
    } else if (reward === 'flag') {
      setMessage('Drapeau londonien en vue.', 70);
    }
  }

  function activateBlock(game, block, fromAbove) {
    if (!block || block.used || !block.contains) return false;
    block.used = true;
    block.bump = 10;
    const reward = spawnItem(game.level, block);
    rewardMessage(game.player, reward);
    if (fromAbove) {
      game.player.vy = Math.min(game.player.vy, -4.8);
      game.player.onGround = false;
      setMessage('Bloc tapé vers le bas.', 45);
    }
    return true;
  }

  function blockUnderPlayer(player, level) {
    const candidates = level.blocks.concat(visibleHiddenBlocks(level));
    const footY = player.y + player.h;
    for (const b of candidates) {
      const horizontal = player.x + player.w - 10 > b.x && player.x + 10 < b.x + b.w;
      const standing = Math.abs(footY - b.y) <= 10;
      if (horizontal && standing) return b;
    }
    return null;
  }

  function startDialogue(lines) {
    state.mode = 'dialogue';
    state.dialogue = lines;
    state.dialogueIndex = 0;
  }

  function triggerBossIntro(game) {
    const p = game.player;
    const boss = game.level.boss;
    if (!boss || boss.introDone) return;

    boss.introDone = true;
    const behindDir = p.faceDir === 0 ? 1 : p.faceDir;
    const rawSpawnX = behindDir > 0 ? p.x - 220 : p.x + 220;
    boss.x = clamp(rawSpawnX, boss.leftWall + boss.wallW + 16, boss.rightWall - boss.wallW - boss.w - 16);
    boss.y = CFG.GROUND_Y - boss.h;
    boss.vx = 0;
    boss.dir = Math.sign((p.x + p.w * 0.5) - (boss.x + boss.w * 0.5)) || -behindDir;
    p.vx = 0;

    startDialogue([
      { who: 'hero', text: "Putain elle nous met un contrôle le vendredi, si je la vois je vais lui dire qu'elle aille se faire foutre." },
      { who: 'boss', text: "Bah alors Monsieur Samuel Levy, je ne tolère pas ça. Si c'est comme ça je vous renvoie de mon cours sl fdp." },
    ]);
  }

  function advanceDialogue(game) {
    if (!state.dialogue) return;
    state.dialogueIndex += 1;
    if (state.dialogueIndex >= state.dialogue.length) {
      state.dialogue = null;
      state.dialogueIndex = 0;
      if (game.level.boss && !game.level.boss.defeated) {
        state.mode = 'playing';
        const boss = game.level.boss;
        boss.active = true;
        game.player.x = clamp(game.player.x, boss.leftWall + boss.wallW + 34, boss.rightWall - boss.wallW - game.player.w - 34);
        boss.x = clamp(boss.x, boss.leftWall + boss.wallW + 18, boss.rightWall - boss.wallW - boss.w - 18);
        setMessage('Madame Gillard te focus. Les murs de pics avancent et vous enferment tous les deux.', 160);
      } else {
        state.mode = 'win';
      }
    }
  }

  function updatePlayer(game) {
    const p = game.player;
    const level = game.level;
    p.prevX = p.x;
    p.prevY = p.y;

    const move = (state.keys.left ? -1 : 0) + (state.keys.right ? 1 : 0);
    const target = move * p.speed;
    if (move !== 0) p.faceDir = move;
    p.vx = lerp(p.vx, target, p.onGround ? 0.34 : 0.18);

    if (state.keys.jumpPressed) p.jumpBuffer = 7;
    else p.jumpBuffer = Math.max(0, p.jumpBuffer - 1);

    if (p.jumpBuffer > 0 && (p.onGround || p.coyote > 0)) {
      p.vy = -p.jumpSpeed;
      p.onGround = false;
      p.coyote = 0;
      p.jumpHold = p.maxJumpHold;
      p.jumpBuffer = 0;
    }

    if (state.keys.jump && p.jumpHold > 0 && p.vy < 0) {
      p.vy -= 0.18;
      p.jumpHold -= 1;
    } else {
      p.jumpHold = 0;
    }

    p.vy += CFG.GRAVITY;
    p.vy = clamp(p.vy, -18, CFG.MAX_FALL);

    const solids = allSolids(level);
    p.x += p.vx;
    collideX(p, solids);
    p.y += p.vy;
    collideHiddenFromBelow(p, level.hiddenBlocks || [], (block) => {
      activateBlock(game, block, false);
    });
    p.onGround = collideY(p, solids, (block) => {
      activateBlock(game, block, false);
    });

    if (p.onGround) p.coyote = 7;
    else p.coyote = Math.max(0, p.coyote - 1);

    p.inv = Math.max(0, p.inv - 1);
    p.star = Math.max(0, p.star - 1);

    if (p.y > CFG.HEIGHT + 170) hitPlayer(game, 'chute');
    p.x = clamp(p.x, 0, level.width - p.w);

    if (state.keys.downPressed && p.onGround) {
      const topBlock = blockUnderPlayer(p, level);
      if (topBlock) activateBlock(game, topBlock, true);
    }
    if (level.checkpoint && !level.checkpoint.activated && p.x + p.w >= level.checkpoint.x + 12) {
      level.checkpoint.activated = true;
      p.checkpointActivated = true;
      p.checkpointTag = level.checkpoint.tag || 'mid';
      p.checkpointX = level.checkpoint.spawnX != null ? level.checkpoint.spawnX : level.checkpoint.x - 42;
      const checkpoint1BaseY = level.checkpoint.spawnY != null ? level.checkpoint.spawnY : CFG.GROUND_Y;
      p.checkpointY = checkpoint1BaseY - p.h;
      setMessage("Checkpoint 1 activé. Samuel repartira d'ici.", 120);
    }

    if (level.checkpoint2 && !level.checkpoint2.activated && p.x + p.w >= level.checkpoint2.x + 12) {
      level.checkpoint2.activated = true;
      p.checkpointActivated = true;
      p.checkpointTag = level.checkpoint2.tag || 'late';
      p.checkpointX = level.checkpoint2.spawnX != null ? level.checkpoint2.spawnX : level.checkpoint2.x - 42;
      const checkpoint2BaseY = level.checkpoint2.spawnY != null ? level.checkpoint2.spawnY : CFG.GROUND_Y;
      p.checkpointY = checkpoint2BaseY - p.h;
      setMessage("Checkpoint 2 activé. Samuel ne repart plus du milieu, mais d'ici.", 130);
    }

    if (level.bossCheckpoint && !level.bossCheckpoint.activated && p.x + p.w >= level.bossCheckpoint.x + 12) {
      level.bossCheckpoint.activated = true;
      p.checkpointActivated = true;
      p.checkpointTag = level.bossCheckpoint.tag || 'boss';
      p.checkpointX = level.bossCheckpoint.spawnX != null ? level.bossCheckpoint.spawnX : level.bossCheckpoint.x - 42;
      const bossCheckpointBaseY = level.bossCheckpoint.spawnY != null ? level.bossCheckpoint.spawnY : CFG.GROUND_Y;
      p.checkpointY = bossCheckpointBaseY - p.h;
      resetBossEncounter(level);
      setMessage('Checkpoint boss activé. R et les vies vides te renvoient juste avant Madame Gillard.', 140);
    }

    if (level.boss && p.x > level.bossTriggerX && !level.boss.introDone) {
      triggerBossIntro(game);
    }
  }

  function updateBlocks(level) {
    for (const block of level.blocks) block.bump = Math.max(0, block.bump - 1);
    for (const block of level.hiddenBlocks || []) block.bump = Math.max(0, block.bump - 1);
  }

  function updatePowerups(game) {
    const level = game.level;
    const player = game.player;
    const solids = level.solids.concat(level.blocks, visibleHiddenBlocks(level));
    level.powerups = level.powerups.filter((item) => !item.collected);

    for (const item of level.powerups) {
      item.prevY = item.y;
      if (item.rise > 0) {
        item.y -= 2;
        item.rise -= 1;
        continue;
      }

      item.vy = (item.vy || 0) + CFG.GRAVITY * 0.6;
      item.vy = Math.min(item.vy, 11);
      item.x += item.vx;
      item.y += item.vy;

      const landed = collideY(item, solids);
      if (landed) item.vy = item.kind === 'flag' ? -6.0 : 0;

      for (const s of solids) {
        if (!overlap(item, s)) continue;
        if (item.x + item.w / 2 < s.x + s.w / 2) item.x = s.x - item.w;
        else item.x = s.x + s.w;
        item.vx *= -1;
      }

      if (overlap(item, player)) {
        item.collected = true;
        if (item.kind === 'beer') {
          player.form = 'big';
          applyForm(player);
          setMessage('Bière: Samuel passe en mode grand.', 100);
        }
        if (item.kind === 'flag') {
          player.star = 300;
          player.inv = 300;
          setMessage('Drapeau londonien: mode turbo-chaos.', 100);
        }
      }
    }
  }

  function updateEnemies(game) {
    const level = game.level;
    const player = game.player;
    for (const e of level.enemies) {
      if (e.dead) {
        e.squish -= 1;
        continue;
      }

      e.x += e.vx;
      if (e.x < e.left || e.x + e.w > e.right) e.vx *= -1;

      if (overlap(player, e)) {
        const stomp = player.vy > 0 && player.prevY + player.h <= e.y + 20;
        if (stomp || player.star > 0) {
          e.dead = true;
          e.squish = 24;
          player.vy = -6.7;
          player.coins += 1;
        } else {
          hitPlayer(game, 'ennemi');
        }
      }
    }
    level.enemies = level.enemies.filter((e) => !e.dead || e.squish > 0);
  }

  function updatePiranhas(game) {
    const level = game.level;
    const player = game.player;
    for (const p of level.piranhas || []) {
      const cycle = (state.tick + p.phase) % 220;
      const shown = cycle < 110 ? cycle / 110 : (220 - cycle) / 110;
      const rise = Math.max(0, shown) * p.rise;
      p.currentRise = rise;
      p.y = p.pipeY - p.h + 8 - rise;
      if (rise > 16 && overlap(player, p)) {
        hitPlayer(game, 'plante carnivore');
      }
    }
  }

  function updateHazards(game) {
    const level = game.level;
    const player = game.player;
    for (const h of level.hazards) {
      if (h.move) {
        if (h.baseX == null) h.baseX = h.x;
        if (h.baseY == null) h.baseY = h.y;
        const phase = (state.tick * (h.move.speed || 0.03)) + (h.move.phase || 0);
        const wave = Math.sin(phase) * (h.move.amp || 0);
        if (h.move.axis === 'x') h.x = h.baseX + wave;
        else h.y = h.baseY + wave;
      }
      if (overlap(player, h)) hitPlayer(game, h.move ? 'pic mobile' : 'piège');
    }
  }

  function updateBoss(game) {
    const level = game.level;
    const player = game.player;
    const boss = level.boss;
    if (!boss || boss.defeated) return;

    boss.hurt = Math.max(0, boss.hurt - 1);
    boss.stun = Math.max(0, boss.stun - 1);
    boss.dashCooldown = Math.max(0, (boss.dashCooldown || 0) - 1);

    if (boss.active) {
      const gap = boss.rightWall - boss.leftWall;
      if (gap > boss.minGap) {
        boss.leftWall += boss.wallCloseSpeed;
        boss.rightWall -= boss.wallCloseSpeed;
      }
      boss.arenaLeft = boss.leftWall + boss.wallW + 56;
      boss.arenaRight = boss.rightWall - boss.wallW - 56;

      const playerCenter = player.x + player.w / 2;
      const bossCenter = boss.x + boss.w / 2;
      const diff = playerCenter - bossCenter;
      const focusDir = diff === 0 ? boss.dir : Math.sign(diff);
      if (focusDir !== 0) boss.dir = focusDir;

      if (boss.stun > 0) {
        boss.vx = 0;
        boss.dashTimer = 0;
        boss.windup = 0;
      } else if (boss.windup > 0) {
        boss.windup -= 1;
        boss.vx = lerp(boss.vx, -boss.dir * 0.42, 0.18);
        if (boss.windup === 18) setMessage('! Madame Gillard verrouille sa cible... dash imminent.', 46);
        if (boss.windup === 0) {
          boss.dashTimer = 24;
          setMessage('Madame Gillard fonce sur Samuel Levy.', 52);
        }
      } else if (boss.dashTimer > 0) {
        boss.dashTimer -= 1;
        boss.vx = boss.dir * boss.dashSpeed;
      } else {
        const chaseSpeed = Math.abs(diff) > 170 ? boss.chaseSpeed + 0.45 : boss.chaseSpeed;
        const target = Math.abs(diff) < 18 ? 0 : boss.dir * chaseSpeed;
        boss.vx = lerp(boss.vx, target, 0.18);

        if (boss.hurt === 0 && boss.stun === 0 && boss.dashCooldown === 0 && Math.abs(diff) > 160) {
          boss.windup = 32;
          boss.dashCooldown = 116;
          setMessage('! Madame Gillard prépare son dash...', 64);
        }
      }

      boss.x += boss.vx;
      if (boss.x < boss.arenaLeft) {
        boss.x = boss.arenaLeft;
        boss.vx = Math.max(0, boss.vx * -0.2);
      }
      if (boss.x + boss.w > boss.arenaRight) {
        boss.x = boss.arenaRight - boss.w;
        boss.vx = Math.min(0, boss.vx * -0.2);
      }

      const leftWallRect = { x: boss.leftWall, y: 0, w: boss.wallW, h: CFG.HEIGHT };
      const rightWallRect = { x: boss.rightWall - boss.wallW, y: 0, w: boss.wallW, h: CFG.HEIGHT };
      if (overlap(player, leftWallRect) || overlap(player, rightWallRect)) {
        hitPlayer(game, 'mur de pics');
      }

      if (overlap(player, boss)) {
        const stomp = player.vy > 0 && player.prevY + player.h <= boss.y + 26;
        if (stomp && boss.hurt === 0) {
          boss.hp -= 1;
          boss.hurt = 120;
          boss.stun = 120;
          boss.vx = 0;
          boss.dashTimer = 0;
          boss.windup = 0;
          boss.dashCooldown = 92;
          const away = diff >= 0 ? 1 : -1;
          player.vy = -8.9;
          player.vx = away * 6.8;
          player.inv = Math.max(player.inv, 120);
          state.flash = 10;
          setMessage(`Madame Gillard touchée: ${boss.hp} PV restants. 2s d'ouverture pour respirer.`, 92);
          if (boss.hp <= 0) {
            boss.defeated = true;
            boss.active = false;
            startDialogue([
              { who: 'boss', text: 'bon... ok... tu gagnes. cours annulé.' },
              { who: 'hero', text: 'Samuel Levy triomphe.' },
            ]);
          }
        } else if (boss.hurt === 0) {
          hitPlayer(game, 'boss');
        }
      }
    }
  }

  function updateGame(game) {
    if (state.mode !== 'playing') return;
    updatePlayer(game);
    updateBlocks(game.level);
    updatePowerups(game);
    updateEnemies(game);
    updatePiranhas(game);
    updateHazards(game);
    updateBoss(game);

    const boss = game.level.boss;
    if (boss && boss.active && !boss.defeated) {
      game.player.x = clamp(game.player.x, boss.leftWall + boss.wallW + 8, boss.rightWall - boss.wallW - game.player.w - 8);
    }

    const targetCam = clamp(game.player.x - CFG.WIDTH * 0.42, 0, game.level.width - CFG.WIDTH);
    state.cameraX = lerp(state.cameraX, targetCam, CFG.CAMERA_LERP);

    if (state.msgTimer > 0) state.msgTimer -= 1;
    if (state.flash > 0) state.flash -= 1;
  }

  window.GameEntities = {
    overlap,
    clamp,
    lerp,
    createPlayer,
    applyForm,
    startDialogue,
    advanceDialogue,
    updateGame,
    respawnPlayer,
    resetBossEncounter,
  };
})();
