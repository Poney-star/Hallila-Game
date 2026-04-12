(function () {
  const PPB = window.PPB;
  const CONFIG = PPB.CONFIG;
  const AudioManager = PPB.AudioManager;
  const Projectile = PPB.Projectile;
  const GalleryTarget = PPB.GalleryTarget;
  const Particle = PPB.Particle;
  const FloatingText = PPB.FloatingText;

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const overlay = document.getElementById('overlay');
  const overlayCard = document.getElementById('overlayCard');
  const toast = document.getElementById('toast');
  const startBtn = document.getElementById('startBtn');

  const levelText = document.getElementById('levelText');
  const scoreText = document.getElementById('scoreText');
  const goalText = document.getElementById('goalText');
  const timeText = document.getElementById('timeText');
  const livesText = document.getElementById('livesText');
  const accuracyText = document.getElementById('accuracyText');
  const comboText = document.getElementById('comboText');
  const weaponText = document.getElementById('weaponText');

  const audio = new AudioManager();

  const targetSprite = new Image();
  targetSprite.src = 'assets/target.png';

  const finalePhoto = new Image();
  finalePhoto.src = 'assets/finale-photo.jpg';


  const game = {
    width: window.innerWidth,
    height: window.innerHeight,
    running: false,
    paused: false,
    gameOver: false,
    victory: false,
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight / 2,
    level: 1,
    levelScore: 0,
    lives: CONFIG.STARTING_MISSES_ALLOWED,
    shotsFired: 0,
    shotsHit: 0,
    comboMultiplier: 1,
    comboChain: 0,
    comboTimer: 0,
    hitStreak: 0,
    scoreMultiplierBonus: 1,
    timeLeft: CONFIG.LEVELS[0].timeLimit,
    lastShotAt: 0,
    stars: [],
    projectiles: [],
    targets: [],
    particles: [],
    messages: [],
    goldenUnlocked: localStorage.getItem(CONFIG.STORAGE_KEY) === 'true'
  };

  const player = {
    x: game.width / 2,
    y: game.height - 80,
    width: 102,
    height: 22,
    handleHeight: 52,
    angle: 0
  };

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function boothBounds() {
    const left = Math.max(320, game.width * 0.28);
    const right = game.width - 46;
    const top = 110;
    const bottom = game.height - 112;
    return { left, right, top, bottom, width: right - left, height: bottom - top };
  }

  function resize() {
    game.width = window.innerWidth;
    game.height = window.innerHeight;
    canvas.width = game.width;
    canvas.height = game.height;
    player.x = game.width / 2;
    player.y = game.height - 82;
  }

  function initStars() {
    game.stars = [];
    for (let i = 0; i < 90; i++) {
      game.stars.push({
        x: Math.random() * game.width,
        y: Math.random() * game.height,
        r: Math.random() * 1.8 + 0.45,
        speed: Math.random() * 0.2 + 0.02,
        alpha: Math.random() * 0.45 + 0.2
      });
    }
  }

  function levelConfig() {
    return CONFIG.LEVELS[game.level - 1];
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1500);
  }

  function setOverlay(html, buttonText, onClick) {
    overlay.style.display = 'flex';
    overlay.classList.remove('victory-overlay');
    overlayCard.className = 'card';
    overlayCard.innerHTML = html + (buttonText ? '<button id="overlayAction">' + buttonText + '</button>' : '');
    if (buttonText && onClick) {
      document.getElementById('overlayAction').onclick = onClick;
    }
  }

  function updateHUD() {
    const cfg = levelConfig();
    levelText.textContent = String(game.level);
    scoreText.textContent = String(game.levelScore);
    goalText.textContent = String(cfg.goal);
    timeText.textContent = game.timeLeft.toFixed(1) + 's';
    livesText.textContent = String(game.lives);
    accuracyText.textContent = game.shotsFired === 0 ? '0%' : Math.min(100, Math.round((game.shotsHit / game.shotsFired) * 100)) + '%';
    comboText.textContent = 'x' + game.comboMultiplier.toFixed(1);
    weaponText.textContent = 'x' + game.scoreMultiplierBonus;
  }

  function getLanes() {
    const cfg = levelConfig();
    const lanes = [];
    const bounds = boothBounds();
    const top = 150;
    const bottom = Math.min(game.height * 0.68, game.height - 215);
    const usable = bottom - top;
    for (let i = 0; i < cfg.lanes; i++) {
      const ratio = cfg.lanes === 1 ? 0.5 : i / (cfg.lanes - 1);
      lanes.push({
        y: top + usable * ratio,
        left: bounds.left + 12,
        right: bounds.right - 12,
        depth: 1 - ratio * 0.22
      });
    }
    return lanes;
  }

  function spawnHitParticles(x, y, strong, color) {
    const particleColor = color || (strong ? '#ffd86d' : '#ffffff');
    const count = strong ? 18 : 12;
    for (let i = 0; i < count; i++) {
      game.particles.push(new Particle(x, y, particleColor, strong ? 1.2 : 1));
    }
  }

  function addText(text, x, y, color) {
    game.messages.push(new FloatingText(text, x, y, color || '#fff'));
  }

  function createTarget(laneIndex) {
    const cfg = levelConfig();
    const lanes = getLanes();
    const lane = lanes[laneIndex % lanes.length];
    const size = cfg.size * lane.depth * rand(0.94, 1.07);
    const speed = cfg.speed * lane.depth * rand(0.92, 1.18);
    const armor = Math.random() < cfg.armorChance ? 2 : 1;
    const direction = Math.random() < 0.5 ? -1 : 1;
    const x = rand(lane.left + size * 0.6, lane.right - size * 0.6);
    return new GalleryTarget({
      x,
      laneY: lane.y,
      size,
      speed,
      direction,
      laneIndex,
      armor
    });
  }

  function populateLevelTargets() {
    game.targets = [];
    const cfg = levelConfig();
    for (let i = 0; i < cfg.targetCount; i++) {
      game.targets.push(createTarget(i % cfg.lanes));
    }
  }

  function resetTransient() {
    game.projectiles = [];
    game.targets = [];
    game.particles = [];
    game.messages = [];
    game.comboMultiplier = 1;
    game.comboChain = 0;
    game.comboTimer = 0;
    game.hitStreak = 0;
    game.scoreMultiplierBonus = 1;
    game.levelScore = 0;
    game.shotsFired = 0;
    game.shotsHit = 0;
    game.timeLeft = levelConfig().timeLimit;
  }

  function prepareLevel(level) {
    game.level = level;
    resetTransient();
    game.lives = levelConfig().missesAllowed;
    populateLevelTargets();
    updateHUD();
    showToast('Niveau ' + level + ' · ' + game.lives + ' ratés autorisés');
  }

  function startGame() {
    resize();
    initStars();
    game.running = true;
    game.paused = false;
    game.gameOver = false;
    game.victory = false;
    game.hitStreak = 0;
    game.scoreMultiplierBonus = 1;
    audio.stopFinale();
    game.lives = levelConfig().missesAllowed;
    prepareLevel(1);
    audio.startMusic();
    overlay.style.display = 'none';
  }
    function markHubComplete() {
      try {
        localStorage.setItem('hallilaa.completed.aduc', '1');
      } catch (e) {}
    }
  function finishVictory() {
    markHubComplete();
    game.running = false;
    game.paused = false;
    game.victory = true;
    updateHUD();
    audio.playFinale();
    overlay.style.display = 'flex';
    overlay.classList.add('victory-overlay');
    overlayCard.className = 'card finale-screen';
    overlayCard.innerHTML =
      '<img class="finale-photo-full" src="assets/finale-photo.jpg" alt="Photo de fin">' +
      '<div class="finale-burst">' +
        '<h2 class="finale-title">GG Tas battu adam prime</h2>' +
        '<button id="overlayAction">Rejouer</button>' +
      '</div>';
    document.getElementById('overlayAction').onclick = startGame;
  }

  function finishDefeat(reason) {
    game.running = false;
    audio.stopMusic();
    game.gameOver = true;
    setOverlay(
      '<h2>Fin de partie</h2><p>' + reason + '</p><p><strong>Niveau atteint :</strong> ' + game.level + '</p><p><strong>Précision :</strong> ' + (game.shotsFired === 0 ? 0 : Math.round((game.shotsHit / game.shotsFired) * 100)) + '%</p>',
      'Rejouer',
      startGame
    );
  }

  function nextLevel() {
    if (game.level >= 4 || game.level >= CONFIG.LEVELS.length) {
      finishVictory();
      return;
    }
    const next = game.level + 1;
    prepareLevel(next);
    audio.levelUp();
    game.running = false;
    setOverlay(
      '<h2>Niveau ' + next + '</h2><p>Les cibles vont plus vite et deviennent plus petites. Certaines demandent maintenant deux touches.</p><p><strong>Objectif :</strong> ' + levelConfig().goal + ' points en ' + levelConfig().timeLimit + ' secondes.</p><p><strong>Ratés autorisés :</strong> ' + levelConfig().missesAllowed + '</p>',
      'Continuer',
      function () {
        overlay.style.display = 'none';
        game.running = true;
      }
    );
  }

  function shotCooldownMs() {
    return CONFIG.SHOT_COOLDOWN_MS;
  }

  function registerCombo() {
    if (game.comboTimer > 0) {
      game.comboChain += 1;
    } else {
      game.comboChain = 1;
    }
    game.comboTimer = CONFIG.COMBO_WINDOW;
    game.comboMultiplier = Math.min(4, 1 + (game.comboChain - 1) * 0.22);
  }

  function decayCombo(dt) {
    if (game.comboTimer <= 0) return;
    game.comboTimer -= dt / 60;
    if (game.comboTimer <= 0) {
      game.comboMultiplier = 1;
      game.comboChain = 0;
    }
  }

  function addScore(base, x, y) {
    registerCombo();
    const scoreMultiplier = game.scoreMultiplierBonus;
    const amount = Math.max(1, Math.round(base * game.comboMultiplier * scoreMultiplier));
    game.levelScore += amount;
    addText('+' + amount + (scoreMultiplier > 1 ? ' (x' + scoreMultiplier + ')' : ''), x, y, scoreMultiplier >= 3 ? '#b596ff' : scoreMultiplier > 1 ? '#79f3ff' : '#ffd24a');
  }

  function updateScoreMultiplierFromStreak() {
    let nextMultiplier = 1;
    if (game.hitStreak >= 6) {
      nextMultiplier = 3;
    } else if (game.hitStreak >= 3) {
      nextMultiplier = 2;
    }

    if (nextMultiplier === game.scoreMultiplierBonus) return;

    game.scoreMultiplierBonus = nextMultiplier;
    if (nextMultiplier === 2) {
      addText('SCORE X2', player.x, player.y - 70, '#79f3ff');
      showToast('Score x2 débloqué');
    } else if (nextMultiplier === 3) {
      addText('SCORE X3', player.x, player.y - 70, '#b596ff');
      showToast('Score x3 débloqué');
    }
    updateHUD();
  }

  function resetScoreMultiplier(reasonX, reasonY) {
    const previous = game.scoreMultiplierBonus;
    game.hitStreak = 0;
    game.scoreMultiplierBonus = 1;
    if (previous > 1) {
      addText('MULTI PERDU', reasonX || player.x, reasonY || player.y - 50, '#ff8f8f');
      showToast('Raté: multiplicateur perdu');
    }
    updateHUD();
  }

  function loseLife(reasonX, reasonY) {
    resetScoreMultiplier(reasonX, reasonY);
    game.lives -= CONFIG.MISS_LIVES_LOST;
    addText('-1 raté', reasonX || player.x, reasonY || player.y - 30, '#ff8f8f');
    audio.miss();
    if (game.lives <= 0) {
      updateHUD();
      finishDefeat('Tu as dépassé le nombre de ratés autorisés pour ce niveau.');
    }
  }

  function spawnProjectile(originX, originY, angle, speed, options) {
    const targetX = originX + Math.cos(angle) * 1000;
    const targetY = originY + Math.sin(angle) * 1000;
    game.projectiles.push(new Projectile(originX, originY, targetX, targetY, speed, game.goldenUnlocked, options));
  }

  function shoot(targetX, targetY) {
    if (!game.running || game.paused) return;
    const now = performance.now();
    if (now - game.lastShotAt < shotCooldownMs()) return;
    game.lastShotAt = now;

    const originX = player.x;
    const originY = player.y - 28;
    const speed = game.goldenUnlocked ? CONFIG.GOLDEN_PROJECTILE_SPEED : CONFIG.PROJECTILE_SPEED;
    const baseAngle = Math.atan2(targetY - originY, targetX - originX);
    player.angle = baseAngle;

    spawnProjectile(originX, originY, baseAngle, speed, { variant: 'normal', glow: game.scoreMultiplierBonus >= 3 ? '#b596ff' : game.scoreMultiplierBonus >= 2 ? '#79f3ff' : '#dce9ff' });

    game.shotsFired += 1;
    audio.shoot();
    updateHUD();
  }

  function circleHit(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
  }

  function updateStars(dt) {
    game.stars.forEach(function (star) {
      star.y += star.speed * dt;
      if (star.y > game.height) {
        star.y = -5;
        star.x = Math.random() * game.width;
      }
    });
  }

  function updatePlayer() {
    player.x = game.width * 0.5;
    player.y = game.height - 82;
    player.angle = Math.atan2(game.mouseY - (player.y - 28), game.mouseX - player.x);
  }

  function updateProjectiles(dt) {
    const bounds = boothBounds();
    for (let i = game.projectiles.length - 1; i >= 0; i--) {
      const projectile = game.projectiles[i];
      projectile.update(dt, bounds);
      if (projectile.out(game.width, game.height)) {
        const px = projectile.x;
        const py = projectile.y;
        game.projectiles.splice(i, 1);
        if (game.running && !game.gameOver && projectile.countsForMiss) loseLife(px, py);
      }
    }
  }

  function updateTargets(dt) {
    const lanes = getLanes();
    for (let i = 0; i < game.targets.length; i++) {
      const target = game.targets[i];
      const lane = lanes[target.laneIndex % lanes.length];
      target.update(dt, lane.left, lane.right);
    }
  }

  function updateParticles(dt) {
    for (let i = game.particles.length - 1; i >= 0; i--) {
      game.particles[i].update(dt);
      if (game.particles[i].life <= 0) game.particles.splice(i, 1);
    }
    for (let j = game.messages.length - 1; j >= 0; j--) {
      game.messages[j].update(dt);
      if (game.messages[j].life <= 0) game.messages.splice(j, 1);
    }
  }

  function checkLevelProgress() {
    if (game.levelScore >= levelConfig().goal) {
      nextLevel();
    }
  }

  function handleCollisions() {
    for (let pi = game.projectiles.length - 1; pi >= 0; pi--) {
      const projectile = game.projectiles[pi];
      let removed = false;

      for (let ti = 0; ti < game.targets.length; ti++) {
        const target = game.targets[ti];
        if (!circleHit(projectile, target)) continue;

        game.projectiles.splice(pi, 1);
        removed = true;
        game.shotsHit += 1;
        game.hitStreak += 1;
        updateScoreMultiplierFromStreak();
        target.armor -= 1;

        if (target.armor <= 0) {
          addScore(target.maxArmor > 1 ? 3 : 2, target.x, target.y - 12);
          spawnHitParticles(target.x, target.y, game.goldenUnlocked, projectile.glow);
          audio.hit();
          const laneIndex = target.laneIndex;
          game.targets[ti] = createTarget((laneIndex + Math.floor(rand(1, levelConfig().lanes + 1))) % levelConfig().lanes);
        } else {
          addText('armure', target.x, target.y - 10, '#ff9d9d');
          spawnHitParticles(target.x, target.y, false, '#ff9d9d');
          audio.armorHit();
        }

        checkLevelProgress();
        break;
      }

      if (removed) continue;
    }
  }

  function updateTimer(dt) {
    game.timeLeft = Math.max(0, game.timeLeft - dt / 60);
    if (game.timeLeft <= 0) {
      if (game.levelScore >= levelConfig().goal) {
        nextLevel();
      } else {
        finishDefeat('Temps écoulé avant d’atteindre l’objectif.');
      }
    }
  }

  function update(dt) {
    updateStars(dt);
    updatePlayer();
    updateParticles(dt);

    if (!game.running || game.paused) return;

    decayCombo(dt);
    updateTimer(dt);
    if (!game.running) return;
    updateProjectiles(dt);
    updateTargets(dt);
    handleCollisions();
    updateHUD();
  }

  function drawSkySaltire() {
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = 'rgba(214,235,255,0.9)';
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(game.width * 0.32, game.height * 0.26);
    ctx.moveTo(game.width * 0.32, 0);
    ctx.lineTo(0, game.height * 0.26);
    ctx.stroke();
    ctx.restore();
  }

  function drawHighlands(bounds) {
    ctx.save();

    const mist = ctx.createLinearGradient(0, bounds.top - 20, 0, bounds.bottom);
    mist.addColorStop(0, 'rgba(162,225,255,0.04)');
    mist.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = mist;
    ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);

    const ridgeSets = [
      { base: bounds.top + bounds.height * 0.28, color: '#203852', amp: 24, step: 82, phase: 0.013 },
      { base: bounds.top + bounds.height * 0.38, color: '#182c42', amp: 28, step: 110, phase: 0.009 },
      { base: bounds.top + bounds.height * 0.5, color: '#122238', amp: 18, step: 92, phase: 0.016 }
    ];

    ridgeSets.forEach(function (ridge, ridgeIndex) {
      ctx.beginPath();
      ctx.moveTo(bounds.left, bounds.bottom);
      ctx.lineTo(bounds.left, ridge.base);
      for (let x = bounds.left; x <= bounds.right + ridge.step; x += ridge.step) {
        const waveA = Math.sin((x + ridgeIndex * 60) * ridge.phase) * ridge.amp;
        const waveB = Math.cos((x + ridgeIndex * 40) * ridge.phase * 0.56) * ridge.amp * 0.42;
        const peakY = ridge.base - waveA - waveB - ridge.amp * 0.35;
        const nextX = x + ridge.step * 0.5;
        const nextYOffset = Math.sin((nextX + ridgeIndex * 85) * ridge.phase * 0.82) * ridge.amp * 0.35;
        ctx.quadraticCurveTo(x + ridge.step * 0.2, peakY, nextX, ridge.base + nextYOffset);
      }
      ctx.lineTo(bounds.right, bounds.bottom);
      ctx.closePath();
      ctx.fillStyle = ridge.color;
      ctx.fill();
    });

    ctx.restore();
  }

  function drawTartanBands(bounds) {
    ctx.save();
    const bandW = 56;
    const leftX = bounds.left - bandW;
    const rightX = bounds.right;
    [leftX, rightX].forEach(function (x) {
      ctx.fillStyle = 'rgba(10, 36, 86, 0.85)';
      ctx.fillRect(x, bounds.top, bandW, bounds.height);
      ctx.fillStyle = 'rgba(11, 85, 44, 0.2)';
      for (let y = bounds.top; y < bounds.bottom; y += 34) {
        ctx.fillRect(x, y, bandW, 10);
      }
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      for (let y = bounds.top; y < bounds.bottom; y += 48) {
        ctx.fillRect(x + 12, y, 4, 48);
        ctx.fillRect(x + 32, y, 3, 48);
      }
      ctx.fillStyle = 'rgba(183, 219, 255, 0.09)';
      for (let y = bounds.top; y < bounds.bottom; y += 62) {
        ctx.fillRect(x, y + 14, bandW, 3);
      }
    });
    ctx.restore();
  }

  function drawBanners(bounds) {
    const bannerY = 54;
    const bannerW = 96;
    const bannerH = 52;

    function banner(x) {
      ctx.save();
      ctx.translate(x, bannerY);
      const grad = ctx.createLinearGradient(0, 0, 0, bannerH);
      grad.addColorStop(0, '#1b4f97');
      grad.addColorStop(1, '#123566');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(bannerW, 0);
      ctx.lineTo(bannerW, bannerH - 12);
      ctx.lineTo(bannerW / 2, bannerH);
      ctx.lineTo(0, bannerH - 12);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.stroke();
      ctx.strokeStyle = 'rgba(230,245,255,0.8)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.lineTo(bannerW - 10, bannerH - 20);
      ctx.moveTo(bannerW - 10, 10);
      ctx.lineTo(10, bannerH - 20);
      ctx.stroke();
      ctx.restore();
    }

    banner(bounds.left + 18);
    banner(bounds.right - bannerW - 18);
  }

  function drawThistles(bounds) {
    const plants = [bounds.left - 18, bounds.right + 18, bounds.left + 18, bounds.right - 18];
    plants.forEach(function (x, idx) {
      const y = bounds.bottom - 18 - idx * 16;
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = 'rgba(176,113,255,0.35)';
      ctx.strokeStyle = 'rgba(118, 215, 126, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 6 + (idx % 2) * 12, y - 32);
      ctx.stroke();
      ctx.fillStyle = 'rgba(167,110,255,0.65)';
      ctx.beginPath();
      ctx.arc(x, y - 38, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawBackground() {
    ctx.clearRect(0, 0, game.width, game.height);

    const sky = ctx.createLinearGradient(0, 0, 0, game.height);
    sky.addColorStop(0, '#081120');
    sky.addColorStop(0.36, '#15375f');
    sky.addColorStop(0.7, '#1a214f');
    sky.addColorStop(1, '#090d17');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, game.width, game.height);

    drawSkySaltire();

    const haze = ctx.createRadialGradient(game.width * 0.72, game.height * 0.22, 10, game.width * 0.72, game.height * 0.22, game.width * 0.42);
    haze.addColorStop(0, 'rgba(111,232,255,0.24)');
    haze.addColorStop(0.5, 'rgba(111,232,255,0.08)');
    haze.addColorStop(1, 'rgba(111,232,255,0)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, game.width, game.height);

    game.stars.forEach(function (star) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,' + star.alpha + ')';
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });

    const bounds = boothBounds();
    drawHighlands(bounds);

    const wall = ctx.createLinearGradient(0, bounds.top, 0, bounds.bottom);
    wall.addColorStop(0, '#2b4673');
    wall.addColorStop(0.45, '#1c3152');
    wall.addColorStop(0.75, '#182847');
    wall.addColorStop(1, '#121b31');
    ctx.fillStyle = wall;
    ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);

    const glow = ctx.createRadialGradient(bounds.left + bounds.width * 0.5, bounds.top + 80, 10, bounds.left + bounds.width * 0.5, bounds.top + 80, bounds.width * 0.7);
    glow.addColorStop(0, 'rgba(140,230,255,0.12)');
    glow.addColorStop(1, 'rgba(140,230,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);

    drawTartanBands(bounds);
    drawBanners(bounds);

    ctx.strokeStyle = 'rgba(111,232,255,0.14)';
    ctx.lineWidth = 1;
    for (let x = bounds.left; x <= bounds.right; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, bounds.top);
      ctx.lineTo(x, bounds.bottom);
      ctx.stroke();
    }

    const lanes = getLanes();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    lanes.forEach(function (lane) {
      ctx.beginPath();
      ctx.moveTo(lane.left, lane.y);
      ctx.lineTo(lane.right, lane.y);
      ctx.stroke();
    });

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(bounds.left, bounds.top, bounds.width, 20);
    ctx.fillRect(bounds.left, bounds.bottom - 24, bounds.width, 24);

    const floorGrad = ctx.createLinearGradient(0, game.height - 152, 0, game.height);
    floorGrad.addColorStop(0, '#30153b');
    floorGrad.addColorStop(0.45, '#163245');
    floorGrad.addColorStop(1, '#0a131d');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, game.height - 152, game.width, 152);

    ctx.strokeStyle = 'rgba(111,232,255,0.16)';
    for (let i = 0; i < 15; i++) {
      const x = i * (game.width / 15);
      ctx.beginPath();
      ctx.moveTo(x, game.height - 152);
      ctx.lineTo(game.width / 2 + (x - game.width / 2) * 1.42, game.height);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 7; i++) {
      const y = game.height - 152 + i * 22;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(game.width, y);
      ctx.stroke();
    }

    drawThistles(bounds);

    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = 'rgba(255,210,74,0.35)';
    ctx.fillStyle = 'rgba(255,240,200,0.94)';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('HIGHLAND ARCADE', game.width - 70, 54);
    ctx.restore();
  }

  function drawTargets() {
    game.targets.forEach(function (target) {
      target.draw(ctx, targetSprite);
    });
  }

  function drawProjectiles() {
    game.projectiles.forEach(function (projectile) {
      projectile.draw(ctx);
    });
  }

  function drawParticles() {
    game.particles.forEach(function (particle) {
      particle.draw(ctx);
    });
    game.messages.forEach(function (message) {
      message.draw(ctx);
    });
  }

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle + Math.PI / 2);

    ctx.shadowBlur = 22;
    ctx.shadowColor = game.goldenUnlocked ? 'rgba(255,210,74,0.38)' : 'rgba(255,95,136,0.35)';
    ctx.fillStyle = game.goldenUnlocked ? '#b88300' : '#8a4f22';
    ctx.fillRect(-7, 8, 14, player.handleHeight);

    const racketGrad = ctx.createLinearGradient(-player.width / 2, 0, player.width / 2, 0);
    racketGrad.addColorStop(0, game.goldenUnlocked ? '#ffeb98' : '#ff7aa2');
    racketGrad.addColorStop(0.5, game.goldenUnlocked ? '#ffd24a' : '#ff5f88');
    racketGrad.addColorStop(1, game.goldenUnlocked ? '#ffb700' : '#ff3d73');
    ctx.beginPath();
    ctx.ellipse(0, 0, player.width / 2, player.height, 0, 0, Math.PI * 2);
    ctx.fillStyle = racketGrad;
    ctx.fill();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = 'rgba(255,255,255,0.82)';
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(0, 0, player.width / 2 - 8, player.height - 4, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -2, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - 8);
    ctx.lineTo(game.mouseX, game.mouseY);
    ctx.stroke();
    ctx.restore();
  }

  function drawCrosshair() {
    const color = 'rgba(111,232,255,0.8)';
    ctx.save();
    ctx.strokeStyle = color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(game.mouseX, game.mouseY, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(game.mouseX, game.mouseY, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(game.mouseX - 20, game.mouseY);
    ctx.lineTo(game.mouseX + 20, game.mouseY);
    ctx.moveTo(game.mouseX, game.mouseY - 20);
    ctx.lineTo(game.mouseX, game.mouseY + 20);
    ctx.stroke();
    ctx.restore();
  }

  function drawPause() {
    if (!game.paused) return;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, 0, game.width, game.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Pause', game.width / 2, game.height / 2);
    ctx.restore();
  }

  function render() {
    drawBackground();
    drawTargets();
    drawParticles();
    drawProjectiles();
    drawPlayer();
    drawCrosshair();
    drawPause();
  }

  let lastTime = 0;
  function loop(ts) {
    const dt = Math.min(2.1, (ts - lastTime) / 16.6667 || 1);
    lastTime = ts;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', function (e) {
    game.mouseX = e.clientX;
    game.mouseY = e.clientY;
  });
  window.addEventListener('mousedown', function (e) {
    shoot(e.clientX, e.clientY);
  });
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
      e.preventDefault();
      shoot(game.mouseX, game.mouseY);
    }
    if (e.key.toLowerCase() === 'r') startGame();
    if (e.key.toLowerCase() === 'p' && overlay.style.display !== 'flex') {
      game.paused = !game.paused;
    }
    if (e.key.toLowerCase() === 'm') {
      audio.toggleMute();
      showToast(audio.enabled ? 'Son activé' : 'Son coupé');
    }
  });

  startBtn.addEventListener('click', startGame);

  resize();
  initStars();
  updateHUD();
  requestAnimationFrame(loop);
})();
