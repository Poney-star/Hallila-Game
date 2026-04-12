(function () {
  const CFG = window.GameConfig.CFG;
  const state = window.GameConfig.state;

  function screenX(x) {
    return x - state.cameraX;
  }

  function drawRounded(ctx, x, y, w, h, r) {
    const rr = r || 12;
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawTiledImage(ctx, img, x, y, w, h, tileW, tileH) {
    for (let yy = 0; yy < h; yy += tileH) {
      for (let xx = 0; xx < w; xx += tileW) {
        const dw = Math.min(tileW, w - xx);
        const dh = Math.min(tileH, h - yy);
        ctx.drawImage(img, 0, 0, img.width, img.height, x + xx, y + yy, dw, dh);
      }
    }
  }

  function drawBackground(ctx) {
    const img = window.GameAssets.assets.bg;
    ctx.fillStyle = '#78c8ff';
    ctx.fillRect(0, 0, CFG.WIDTH, CFG.HEIGHT);

    const maxCam = Math.max(1, CFG.LEVEL_WIDTH - CFG.WIDTH);
    const maxBg = Math.max(0, img.width - CFG.WIDTH);
    const sx = Math.round((state.cameraX / maxCam) * maxBg * 0.9);
    ctx.drawImage(img, sx, 0, Math.min(CFG.WIDTH, img.width - sx), img.height, 0, 0, CFG.WIDTH, CFG.HEIGHT);

    const topGlow = ctx.createLinearGradient(0, 0, 0, CFG.HEIGHT);
    topGlow.addColorStop(0, 'rgba(255,255,255,0.10)');
    topGlow.addColorStop(0.45, 'rgba(255,255,255,0.03)');
    topGlow.addColorStop(1, 'rgba(0,0,0,0.16)');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, CFG.WIDTH, CFG.HEIGHT);
  }

  function drawGroundFront(ctx, x, y, w, h) {
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.fillRect(x + 4, y + 10, w, h);
    drawTiledImage(ctx, window.GameAssets.assets.groundTile, x, y, w, h, 48, 48);
    drawTiledImage(ctx, window.GameAssets.assets.grassEdge, x, y - 12, w, 16, 48, 16);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x, y - 1, w, 2);
  }

  function drawPlatformFront(ctx, x, y, w, h) {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(x + 4, y + 8, w, h);
    drawTiledImage(ctx, window.GameAssets.assets.platformTile, x, y, w, h, 48, 24);
    drawTiledImage(ctx, window.GameAssets.assets.grassEdge, x, y - 8, w, 12, 48, 16);
  }

  function drawStoneFront(ctx, x, y, w, h) {
    ctx.fillStyle = '#9c8a78';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#cbb8a1';
    ctx.fillRect(x, y, w, 4);
    ctx.fillStyle = '#73624f';
    ctx.fillRect(x, y + h - 5, w, 5);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    for (let xx = x + 18; xx < x + w - 18; xx += 36) {
      ctx.beginPath();
      ctx.moveTo(xx, y + 3);
      ctx.lineTo(xx, y + h - 3);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    for (let yy = y + 12; yy < y + h - 8; yy += 14) {
      ctx.beginPath();
      ctx.moveTo(x + 3, yy);
      ctx.lineTo(x + w - 3, yy);
      ctx.stroke();
    }
  }

  function drawHillFront(ctx, x, y, w, h) {
    const grd = ctx.createLinearGradient(x, y, x, y + h);
    grd.addColorStop(0, '#c08249');
    grd.addColorStop(1, '#8d562c');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + 16, y + 6);
    ctx.lineTo(x + w - 16, y + 6);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
    drawTiledImage(ctx, window.GameAssets.assets.grassEdge, x + 4, y - 10, w - 8, 14, 48, 16);
  }

  function drawMountainFront(ctx, x, y, w, h) {
    ctx.fillStyle = '#8f6a4a';
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w * 0.18, y + 48);
    ctx.lineTo(x + w * 0.4, y + 6);
    ctx.lineTo(x + w * 0.63, y + 52);
    ctx.lineTo(x + w * 0.82, y + 28);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#af8357';
    ctx.beginPath();
    ctx.moveTo(x + 16, y + h);
    ctx.lineTo(x + w * 0.28, y + 76);
    ctx.lineTo(x + w * 0.46, y + 34);
    ctx.lineTo(x + w * 0.6, y + 72);
    ctx.lineTo(x + w - 16, y + h);
    ctx.closePath();
    ctx.fill();
    drawTiledImage(ctx, window.GameAssets.assets.grassEdge, x + 12, y - 10, w - 24, 14, 48, 16);
  }

  function drawBridgeFront(ctx, x, y, w, h) {
    ctx.fillStyle = '#7d5a3a';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#b18352';
    for (let xx = x + 4; xx < x + w - 6; xx += 18) {
      ctx.fillRect(xx, y + 3, 14, h - 6);
    }
    ctx.fillStyle = '#5f4127';
    ctx.fillRect(x, y + h - 4, w, 4);
  }

  function drawPipe(ctx, x, y, w, h) {
    const body = ctx.createLinearGradient(x, y, x + w, y);
    body.addColorStop(0, '#0b7a31');
    body.addColorStop(0.45, '#2fc763');
    body.addColorStop(0.8, '#148e45');
    body.addColorStop(1, '#085f26');
    ctx.fillStyle = body;
    ctx.fillRect(x + 10, y + 18, w - 20, h - 18);
    ctx.fillStyle = '#1caf4a';
    ctx.fillRect(x, y, w, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(x + 8, y + 3, w - 16, 4);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(x + 10, y + h - 6, w - 20, 6);
  }

  function drawPiranha(ctx, p) {
    const x = screenX(p.x);
    if (x + p.w < -70 || x > CFG.WIDTH + 70) return;
    const y = p.y;
    ctx.fillStyle = '#2da54a';
    ctx.fillRect(x + 17, y + 34, 6, p.pipeY - y - 6);
    ctx.fillRect(x + 11, y + 42, 8, 4);
    ctx.fillRect(x + 21, y + 50, 8, 4);
    ctx.fillStyle = '#ef3b42';
    ctx.beginPath();
    ctx.arc(x + 20, y + 22, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 8, y + 14, 6, 6);
    ctx.fillRect(x + 18, y + 8, 6, 6);
    ctx.fillRect(x + 26, y + 14, 6, 6);
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.moveTo(x + 6 + i * 8, y + 26);
      ctx.lineTo(x + 10 + i * 8, y + 34);
      ctx.lineTo(x + 14 + i * 8, y + 26);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = '#1f1f1f';
    ctx.fillRect(x + 10, y + 18, 4, 4);
    ctx.fillRect(x + 26, y + 18, 4, 4);
  }

  function drawSpike(ctx, h) {
    const x = screenX(h.x);
    if (x + h.w < -60 || x > CFG.WIDTH + 60) return;
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(x + 2, h.y + h.h - 2, h.w - 4, 4);
    if (h.move && h.move.axis === 'y') {
      ctx.strokeStyle = '#8e8e8e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + h.w / 2, h.y - 20);
      ctx.lineTo(x + h.w / 2, h.y);
      ctx.stroke();
    }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x, h.y + h.h);
    ctx.lineTo(x + h.w / 2, h.y);
    ctx.lineTo(x + h.w, h.y + h.h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#dbe4ef';
    ctx.beginPath();
    ctx.moveTo(x + 5, h.y + h.h);
    ctx.lineTo(x + h.w / 2, h.y + 7);
    ctx.lineTo(x + h.w - 5, h.y + h.h);
    ctx.closePath();
    ctx.fill();
  }

  function drawBeer(ctx, x, y) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 6, y + 4, 14, 6);
    ctx.fillRect(x + 10, y + 0, 8, 6);
    ctx.fillStyle = '#e0a52f';
    ctx.fillRect(x + 6, y + 10, 14, 15);
    ctx.fillStyle = '#ffe08a';
    ctx.fillRect(x + 8, y + 12, 4, 11);
    ctx.fillStyle = '#7c4f12';
    ctx.fillRect(x + 20, y + 13, 4, 8);
    ctx.fillRect(x + 22, y + 15, 2, 4);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(x + 6, y + 25, 14, 2);
  }

  function drawLondonFlag(ctx, x, y) {
    ctx.fillStyle = '#214fbd';
    ctx.fillRect(x + 2, y + 6, 24, 16);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 6);
    ctx.lineTo(x + 26, y + 22);
    ctx.moveTo(x + 26, y + 6);
    ctx.lineTo(x + 2, y + 22);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c71f25';
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 6);
    ctx.lineTo(x + 26, y + 22);
    ctx.moveTo(x + 26, y + 6);
    ctx.lineTo(x + 2, y + 22);
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 11, y + 6, 6, 16);
    ctx.fillRect(x + 2, y + 11, 24, 6);
    ctx.fillStyle = '#c71f25';
    ctx.fillRect(x + 12, y + 6, 4, 16);
    ctx.fillRect(x + 2, y + 12, 24, 4);
  }

  function drawCheckpoint(ctx, cp) {
    if (!cp) return;
    const x = Math.round(screenX(cp.x));
    if (x + cp.w < -80 || x > CFG.WIDTH + 80) return;
    const poleTop = cp.y;
    const poleBottom = (cp.baseY != null ? cp.baseY : CFG.GROUND_Y) + 8;
    ctx.fillStyle = '#d7dadf';
    ctx.fillRect(x + 16, poleTop, 6, poleBottom - poleTop);
    ctx.fillStyle = cp.activated ? '#3fe071' : '#ffcc35';
    ctx.beginPath();
    ctx.moveTo(x + 22, poleTop + 10);
    ctx.lineTo(x + 62, poleTop + 24);
    ctx.lineTo(x + 22, poleTop + 38);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(x + 10, poleBottom - 8, 18, 8);
  }

  function drawBossSpikeWall(ctx, x, side) {
    const sx = screenX(x);
    const wallW = 54;
    if (sx + wallW < -80 || sx > CFG.WIDTH + 80) return;
    ctx.fillStyle = '#71513a';
    ctx.fillRect(sx, 0, wallW, CFG.HEIGHT);
    ctx.fillStyle = '#563c2b';
    ctx.fillRect(sx + (side === 'left' ? wallW - 8 : 0), 0, 8, CFG.HEIGHT);
    ctx.fillStyle = '#eef3ff';
    for (let yy = 0; yy < CFG.HEIGHT; yy += 34) {
      ctx.beginPath();
      if (side === 'left') {
        ctx.moveTo(sx + wallW, yy + 2);
        ctx.lineTo(sx + wallW - 26, yy + 17);
        ctx.lineTo(sx + wallW, yy + 32);
      } else {
        ctx.moveTo(sx, yy + 2);
        ctx.lineTo(sx + 26, yy + 17);
        ctx.lineTo(sx, yy + 32);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawLevel(ctx, level) {
    const qBlock = window.GameAssets.assets.questionBlock;
    const usedBlock = window.GameAssets.assets.usedBlock;
    const hiddenBlock = window.GameAssets.assets.hiddenBlock;

    for (const s of level.solids) {
      const x = Math.round(screenX(s.x));
      if (x + s.w < -120 || x > CFG.WIDTH + 120) continue;
      if (s.kind === 'ground') drawGroundFront(ctx, x, s.y, s.w, s.h);
      else if (s.kind === 'platform') drawPlatformFront(ctx, x, s.y, s.w, s.h);
      else if (s.kind === 'stone') drawStoneFront(ctx, x, s.y, s.w, s.h);
      else if (s.kind === 'hill') drawHillFront(ctx, x, s.y, s.w, s.h + 12);
      else if (s.kind === 'mountain') drawMountainFront(ctx, x, s.y, s.w, s.h + 26);
      else if (s.kind === 'bridge') drawBridgeFront(ctx, x, s.y, s.w, s.h);
      else if (s.kind === 'pipe') drawPipe(ctx, x, s.y, s.w, s.h);
      else drawPlatformFront(ctx, x, s.y, s.w, s.h);
    }

    drawCheckpoint(ctx, level.checkpoint);
    drawCheckpoint(ctx, level.checkpoint2);
    drawCheckpoint(ctx, level.bossCheckpoint);

    for (const b of level.blocks) {
      const x = Math.round(screenX(b.x));
      if (x + b.w < -80 || x > CFG.WIDTH + 80) continue;
      const y = b.y - (b.bump > 0 ? 10 - b.bump : 0);
      ctx.drawImage(b.used ? usedBlock : qBlock, x, y, b.w, b.h);
    }

    for (const b of level.hiddenBlocks || []) {
      if (!b.revealed) continue;
      const x = Math.round(screenX(b.x));
      if (x + b.w < -80 || x > CFG.WIDTH + 80) continue;
      const y = b.y - (b.bump > 0 ? 10 - b.bump : 0);
      ctx.drawImage(hiddenBlock, x, y, b.w, b.h);
    }

    for (const h of level.hazards) drawSpike(ctx, h);

    for (const e of level.enemies) {
      const x = screenX(e.x);
      if (x + e.w < -70 || x > CFG.WIDTH + 70) continue;
      ctx.fillStyle = '#603813';
      ctx.beginPath();
      ctx.roundRect(x + 2, e.y + (e.dead ? 18 : 0), e.w - 4, e.dead ? 12 : e.h, 8);
      ctx.fill();
      if (!e.dead) {
        ctx.fillStyle = '#f0ddb7';
        ctx.fillRect(x + 8, e.y + 13, e.w - 16, 12);
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 10, e.y + 10, 7, 7);
        ctx.fillRect(x + 25, e.y + 10, 7, 7);
        ctx.fillStyle = '#2c1b12';
        ctx.fillRect(x + 12, e.y + 12, 2, 2);
        ctx.fillRect(x + 27, e.y + 12, 2, 2);
        ctx.fillStyle = '#4d2b11';
        ctx.fillRect(x + 6, e.y + 4, e.w - 12, 8);
        ctx.fillStyle = '#fff7cf';
        ctx.fillRect(x + 11, e.y + 24, 5, 4);
        ctx.fillRect(x + 25, e.y + 24, 5, 4);
      }
    }

    for (const p of level.piranhas || []) drawPiranha(ctx, p);

    for (const p of level.powerups) {
      const x = screenX(p.x);
      if (x + p.w < -60 || x > CFG.WIDTH + 60) continue;
      if (p.kind === 'beer') drawBeer(ctx, x, p.y);
      else if (p.kind === 'flag') drawLondonFlag(ctx, x, p.y + 1);
    }
  }

  function drawPlayer(ctx, player) {
    const x = Math.round(screenX(player.x));
    const y = Math.round(player.y);
    if (player.inv > 0 && Math.floor(player.inv / 4) % 2 === 0) return;

    const sheet = window.GameAssets.assets.playerSheet;
    let frame = 0;
    if (!player.onGround) frame = 2;
    else if (Math.abs(player.vx) > 0.7) frame = (Math.floor(state.tick / 8) % 2) ? 1 : 3;
    const scale = player.form === 'big' ? 1.18 : 1.02;

    ctx.save();
    ctx.translate(x + player.w / 2, y + player.h / 2);
    ctx.scale(player.faceDir, 1);
    ctx.translate(-(player.w / 2), -(player.h / 2));
    if (player.star > 0) {
      ctx.shadowColor = '#ffd64a';
      ctx.shadowBlur = 18;
    }
    const sw = sheet.width / 4;
    const sh = sheet.height;
    const dw = sw * 0.5 * scale;
    const dh = sh * 0.5 * scale;
    ctx.drawImage(sheet, frame * sw, 0, sw, sh, player.w / 2 - dw / 2, player.h - dh, dw, dh);
    ctx.restore();
  }

  function drawBoss(ctx, level) {
    const boss = level.boss;
    if (!boss) return;

    if (boss.introDone || boss.active || boss.defeated) {
      drawBossSpikeWall(ctx, boss.leftWall, 'left');
      drawBossSpikeWall(ctx, boss.rightWall - boss.wallW, 'right');
    }

    const x = screenX(boss.x);
    if (x + boss.w < -100 || x > CFG.WIDTH + 100) return;

    const eyeShift = boss.dir > 0 ? 3 : -3;

    ctx.save();
    if (boss.hurt > 0 && Math.floor(boss.hurt / 4) % 2 === 0) ctx.globalAlpha = 0.55;
    if (boss.windup > 0) {
      const pulse = 0.35 + Math.abs(Math.sin((state.tick || 0) * 0.35)) * 0.28;
      ctx.fillStyle = `rgba(255,220,70,${pulse})`;
      ctx.fillRect(x - 12, boss.y - 10, boss.w + 24, boss.h + 20);
      ctx.fillStyle = '#fff06a';
      ctx.font = '900 44px Impact, Arial, sans-serif';
      ctx.fillText('!', x + 82, boss.y + 4);
      ctx.fillStyle = 'rgba(255,70,70,0.26)';
      const tele = Math.min(150, 60 + boss.windup * 3);
      ctx.fillRect(x + boss.w / 2, boss.y + 34, boss.dir * tele, 12);
    }
    if (boss.dashTimer > 0) {
      ctx.fillStyle = 'rgba(255,90,90,0.22)';
      for (let i = 0; i < 4; i += 1) {
        ctx.fillRect(x - boss.dir * (28 + i * 14), boss.y + 24 + i * 6, 20, 4);
      }
    }
    ctx.fillStyle = '#f1d2ac';
    ctx.fillRect(x + 18, boss.y + 14, 48, 46);
    ctx.fillStyle = '#f5d24f';
    ctx.beginPath();
    ctx.arc(x + 42, boss.y + 18, 28, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(x + 12, boss.y + 18, 60, 15);
    ctx.fillStyle = '#8f3fd4';
    ctx.fillRect(x + 12, boss.y + 60, 60, 30);
    ctx.fillStyle = '#1f1f1f';
    ctx.fillRect(x + 18, boss.y + 90, 14, 10);
    ctx.fillRect(x + 52, boss.y + 90, 14, 10);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 28 + eyeShift, boss.y + 30, 6, 6);
    ctx.fillRect(x + 50 + eyeShift, boss.y + 30, 6, 6);
    ctx.fillStyle = '#2a1d16';
    ctx.fillRect(x + 30 + eyeShift, boss.y + 32, 2, 2);
    ctx.fillRect(x + 52 + eyeShift, boss.y + 32, 2, 2);
    ctx.fillStyle = '#5a1325';
    ctx.fillRect(x + 26, boss.y + 26, 14, 2);
    ctx.fillRect(x + 48, boss.y + 26, 14, 2);
    ctx.fillStyle = '#b1232d';
    ctx.fillRect(x + 30, boss.y + 44, 22, 3);
    ctx.restore();

    if (!boss.defeated) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(x - 10, boss.y - 28, 120, 12);
      ctx.fillStyle = '#ff4a4a';
      ctx.fillRect(x - 10, boss.y - 28, (boss.hp / (boss.maxHp || 6)) * 120, 12);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(CFG.BOSS_NAME, x - 2, boss.y - 34);
    }
  }

  function drawGoal(ctx, level) {
    const gx = screenX(level.goalX);
    if (gx < -120 || gx > CFG.WIDTH + 120) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(gx + 24, CFG.GROUND_Y - 190, 8, 190);
    drawLondonFlag(ctx, gx + 28, CFG.GROUND_Y - 188);
  }

  function drawHUD(ctx, player) {
    const totalSeconds = Math.floor((state.playTimeFrames || 0) / 60);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    drawRounded(ctx, 16, 16, 420, 82, 16);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 26px Arial';
    ctx.fillText(CFG.HERO_NAME, 32, 42);
    ctx.font = 'bold 23px Arial';
    ctx.fillText(`Vies ${player.lives}`, 32, 70);
    ctx.fillText(`Pièces ${player.coins}`, 152, 70);
    ctx.fillText(player.form === 'big' ? 'Mode bière' : 'Mode normal', 286, 70);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    drawRounded(ctx, 1340, 16, 220, 60, 16);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('Timer', 1370, 40);
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`${minutes}:${seconds}`, 1455, 58);

    if (state.msgTimer > 0 && state.msg) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      drawRounded(ctx, 454, 16, 860, 60, 16);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(state.msg, 884, 53);
      ctx.textAlign = 'left';
    }
  }

  function drawTitle(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.62)';
    ctx.fillRect(0, 0, CFG.WIDTH, CFG.HEIGHT);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 62px Arial';
    ctx.fillText('Samuel Levy Bros', CFG.WIDTH / 2, 190);
    ctx.font = '28px Arial';
    ctx.fillText('3 checkpoints • R = respawn au dernier checkpoint avec reset des blocs et monstres', CFG.WIDTH / 2, 242);
    ctx.font = '24px Arial';
    ctx.fillText('Espace ou Entrée pour lancer', CFG.WIDTH / 2, 322);
    ctx.fillText('Petit appui = petit saut • appui maintenu = saut un peu plus haut, mais plus sec qu’avant', CFG.WIDTH / 2, 362);
    ctx.fillText('Bière à la place du champignon • drapeau londonien à la place de l’étoile', CFG.WIDTH / 2, 402);
    ctx.textAlign = 'left';
  }

  function wrapText(ctx, text, maxWidth) {
    const words = String(text || '').split(/\s+/);
    const lines = [];
    let current = '';
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width <= maxWidth || !current) current = test;
      else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function drawDialogue(ctx) {
    if (!state.dialogue) return;
    const line = state.dialogue[state.dialogueIndex];
    ctx.fillStyle = 'rgba(0,0,0,0.62)';
    drawRounded(ctx, 90, 600, 1420, 190, 18);
    ctx.fill();
    ctx.fillStyle = line.who === 'boss' ? '#ffe269' : '#d8f3ff';
    ctx.font = 'bold 26px Arial';
    ctx.fillText(line.who === 'boss' ? CFG.BOSS_NAME : CFG.HERO_NAME, 130, 648);
    ctx.fillStyle = '#fff';
    ctx.font = '29px Arial';
    const lines = wrapText(ctx, line.text, 1280);
    lines.slice(0, 3).forEach((txt, idx) => ctx.fillText(txt, 130, 700 + idx * 34));
    ctx.font = '20px Arial';
    ctx.fillStyle = '#d8d8d8';
    ctx.fillText('Appuie sur Entrée ou Espace pour continuer', 130, 766);
  }


  function drawVictoryPhoto(ctx, img, frame, zoomBase, tint) {
    const oldSmooth = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = true;
    const t = frame / 60;
    const scale = zoomBase + Math.min(0.18, t * 0.012);
    const sw = img.width / scale;
    const sh = img.height / scale;
    const driftX = Math.sin(t * 0.72) * Math.min(90, img.width * 0.045);
    const driftY = Math.cos(t * 0.48) * Math.min(68, img.height * 0.035);
    const sx = Math.max(0, Math.min(img.width - sw, (img.width - sw) / 2 + driftX));
    const sy = Math.max(0, Math.min(img.height - sh, (img.height - sh) / 2 + driftY));
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, CFG.WIDTH, CFG.HEIGHT);
    const grad = ctx.createLinearGradient(0, 0, 0, CFG.HEIGHT);
    grad.addColorStop(0, tint || 'rgba(0,0,0,0.08)');
    grad.addColorStop(0.65, 'rgba(0,0,0,0.18)');
    grad.addColorStop(1, 'rgba(0,0,0,0.56)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CFG.WIDTH, CFG.HEIGHT);
    ctx.imageSmoothingEnabled = oldSmooth;
  }

  function drawCoverImageInRect(ctx, img, x, y, w, h, frameOffset) {
    const oldSmooth = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = true;
    const t = frameOffset / 60;
    const scale = 1.08 + Math.sin(t * 0.8) * 0.03;
    const sw = img.width / scale;
    const sh = img.height / scale;
    const driftX = Math.sin(t * 0.6) * Math.min(26, img.width * 0.03);
    const driftY = Math.cos(t * 0.45) * Math.min(20, img.height * 0.025);
    const sx = Math.max(0, Math.min(img.width - sw, (img.width - sw) / 2 + driftX));
    const sy = Math.max(0, Math.min(img.height - sh, (img.height - sh) / 2 + driftY));
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    ctx.imageSmoothingEnabled = oldSmooth;
  }

  function drawVictoryCard(ctx, img, x, y, w, h, rotationDeg, alpha, frameOffset) {
    if (!img) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(rotationDeg * Math.PI / 180);
    ctx.translate(-(w / 2), -(h / 2));
    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    drawRounded(ctx, 12, 16, w, h, 20);
    ctx.fill();
    ctx.fillStyle = '#f4f4f4';
    drawRounded(ctx, 0, 0, w, h, 20);
    ctx.fill();
    ctx.save();
    drawRounded(ctx, 10, 10, w - 20, h - 20, 14);
    ctx.clip();
    drawCoverImageInRect(ctx, img, 10, 10, w - 20, h - 20, frameOffset);
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(18, 16, w - 36, 24);
    ctx.restore();
  }

  function drawMarvelBanner(ctx, frame) {
    const pulse = 1 + Math.sin(frame * 0.12) * 0.02;
    const boxW = 1180;
    const boxH = 94;
    const x = (CFG.WIDTH - boxW) / 2;
    const y = 560;

    ctx.save();
    ctx.translate(CFG.WIDTH / 2, y + boxH / 2);
    ctx.scale(pulse, pulse);
    ctx.translate(-CFG.WIDTH / 2, -(y + boxH / 2));

    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    drawRounded(ctx, x + 10, y + 12, boxW, boxH, 18);
    ctx.fill();
    ctx.fillStyle = '#b2121b';
    drawRounded(ctx, x, y, boxW, boxH, 18);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    drawRounded(ctx, x, y, boxW, boxH, 18);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '900 54px Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
    ctx.fillText('SAMUEL A VAINCU MADAME GILLARD', CFG.WIDTH / 2, y + 62);

    const box2W = 760;
    const box2H = 78;
    const x2 = (CFG.WIDTH - box2W) / 2;
    const y2 = 670;
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    drawRounded(ctx, x2 + 8, y2 + 10, box2W, box2H, 18);
    ctx.fill();
    ctx.fillStyle = '#d01822';
    drawRounded(ctx, x2, y2, box2W, box2H, 18);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    drawRounded(ctx, x2, y2, box2W, box2H, 18);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
    ctx.fillText('BRAVO CHAMPION', CFG.WIDTH / 2, y2 + 52);
    ctx.restore();
    ctx.textAlign = 'left';
  }

  function drawEnd(ctx, kind) {
    if (kind !== 'win') {
      ctx.fillStyle = 'rgba(0,0,0,0.68)';
      ctx.fillRect(0, 0, CFG.WIDTH, CFG.HEIGHT);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 62px Arial';
      ctx.fillText('Game Over', CFG.WIDTH / 2, 300);
      ctx.font = '28px Arial';
      ctx.fillText('Le trottoir a encore gagné cette manche.', CFG.WIDTH / 2, 360);
      ctx.fillText('Appuie sur R pour recommencer', CFG.WIDTH / 2, 430);
      ctx.textAlign = 'left';
      return;
    }

    const frame = state.winFrame || 0;
    const gallery = (window.GameAssets.assets.victoryGallery || []).filter(Boolean);
    if (!gallery.length) return;

    const slideDuration = 118;
    const galleryFrame = frame % (gallery.length * slideDuration);
    const currentIndex = Math.floor(galleryFrame / slideDuration) % gallery.length;
    const localFrame = galleryFrame % slideDuration;
    const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    const nextIndex = (currentIndex + 1) % gallery.length;
    const farIndex = (currentIndex + 2) % gallery.length;

    const current = gallery[currentIndex];
    const prev = gallery[prevIndex];
    const next = gallery[nextIndex];
    const far = gallery[farIndex];

    drawVictoryPhoto(ctx, current, localFrame, 1.08, currentIndex === 0 ? 'rgba(12,12,12,0.1)' : 'rgba(70,50,20,0.08)');

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let y = 0; y < CFG.HEIGHT; y += 5) ctx.fillRect(0, y, CFG.WIDTH, 1);

    const switchFlash = 1 - Math.min(1, Math.abs(localFrame - 8) / 8);
    if (switchFlash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${switchFlash * 0.12})`;
      ctx.fillRect(0, 0, CFG.WIDTH, CFG.HEIGHT);
    }

    drawVictoryCard(ctx, prev, 90, 96, 250, 360, -9, 0.84, frame + 17);
    drawVictoryCard(ctx, next, CFG.WIDTH - 340, 108, 250, 360, 8, 0.84, frame + 29);
    drawVictoryCard(ctx, far, CFG.WIDTH - 302, 516, 220, 148, -6, 0.78, frame + 41);

    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    drawRounded(ctx, 84, 786, 1432, 82, 18);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 25px Arial';
    ctx.fillText('CLIP GIGA CHAD EN BOUCLE • R pour relancer une run', CFG.WIDTH / 2, 837);
    ctx.textAlign = 'left';

    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, CFG.WIDTH, 110);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '900 42px Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
    ctx.fillText('GIGA CHAD VICTORY LOOP', CFG.WIDTH / 2, 72);
    ctx.textAlign = 'left';

    drawMarvelBanner(ctx, frame);
  }


  window.GameUI = {
    drawBackground,
    drawLevel,
    drawPlayer,
    drawBoss,
    drawGoal,
    drawHUD,
    drawTitle,
    drawDialogue,
    drawEnd,
  };
})();
