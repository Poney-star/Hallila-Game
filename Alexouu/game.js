(() => {
  const WIN_TARGET = 1000000;
  const FIXED_STEP = 1 / 60;
  const MAX_FRAME_DELTA = 0.25;
  const ASSETS = {
    lungs: 'assets/poumons.png',
    ventoline: 'assets/ventoline.png',
    baby: 'assets/baby.png',
    clone: 'assets/clone.png',
    cyber: 'assets/cyber.png',
    mega: 'assets/mega.png',
    god: 'assets/god.png',
    heart: 'assets/coeur.png',
    aheart: 'assets/coeur_artificiel.png',
    alex: 'assets/alex.png'
  };

  const shopDefs = [
    { id: 'battements', kind: 'clickLevel', name: 'Battements', img: ASSETS.heart, baseCost: 8, desc: 'Amélioration répétable du clic. Chaque niveau renforce les PV gagnés et les souffles par clic.' },
    { id: 'ventoline', kind: 'ventolineLevel', name: 'Ventoline', img: ASSETS.ventoline, baseCost: 15, desc: 'Améliore le bouton Ventoline : soin plus fort et temps de recharge plus court à chaque niveau.' },
    { id: 'aheart', kind: 'generator', name: 'Cœur artificiel', img: ASSETS.aheart, baseCost: 18, passive: 0.8, desc: 'Premier passif rapide à acheter. Génère des souffles en continu.' },
    { id: 'baby', kind: 'generator', name: 'Baby Alex', img: ASSETS.baby, passive: 2.8, baseCost: 55, desc: 'Petit Alex mignon mais rentable. Génération passive +.' },
    { id: 'clone', kind: 'generator', name: 'Clone d’Alex', img: ASSETS.clone, passive: 8.5, baseCost: 180, desc: 'Génération passive ++.' },
    { id: 'cyber', kind: 'generator', name: 'Cyber Alex', img: ASSETS.cyber, passive: 28, baseCost: 700, desc: 'Génération passive +++.' },
    { id: 'mega', kind: 'generator', name: 'Méga Alex', img: ASSETS.mega, passive: 95, baseCost: 2600, desc: 'Génération passive +++++.' },
    { id: 'god', kind: 'generator', name: 'God Alex', img: ASSETS.god, passive: 320, baseCost: 9000, desc: 'Génération passive ++++++++++.' }
  ];

  const upgradeCategories = [
    { id: 'click', name: 'Clic & Battements' },
    { id: 'ventoline', name: 'Ventoline' },
    { id: 'sources', name: 'Versions d’Alex' },
    { id: 'global', name: 'Boosts globaux' }
  ];

  const upgradeDefs = [
    { id: 'click_pv_1', category: 'click', name: 'Battements puissants', img: ASSETS.heart, cost: 30, desc: '+65% PV par clic.', apply: s => { s.clickPvMult *= 1.65; } },
    { id: 'click_souffle_1', category: 'click', name: 'Souffle focalisé', img: ASSETS.lungs, cost: 45, desc: '+80% souffle par clic.', apply: s => { s.clickSouffleMult *= 1.8; } },
    { id: 'click_combo_1', category: 'click', name: 'Pulse combo', img: ASSETS.heart, cost: 90, desc: 'Le combo monte plus vite.', apply: s => { s.comboGain += 0.55; } },

    { id: 'ventoline_power', category: 'ventoline', name: 'Chambre pressurisée', img: ASSETS.ventoline, cost: 80, desc: '+35% efficacité de ventoline.', apply: s => { s.ventolinePowerMult *= 1.35; } },
    { id: 'ventoline_burst', category: 'ventoline', name: 'Bouffée d’urgence', img: ASSETS.ventoline, cost: 120, desc: 'Après la ventoline, les clics sont boostés pendant 6s.', apply: s => { s.ventolineBurst = true; } },

    { id: 'double_aheart', category: 'sources', name: 'Double cœur artificiel', img: ASSETS.aheart, cost: 70, desc: 'x2 production des cœurs artificiels.', apply: s => { s.sourceMult.aheart *= 2; } },
    { id: 'double_baby', category: 'sources', name: 'Double Baby Alex', img: ASSETS.baby, cost: 120, desc: 'x2 production des Baby Alex.', apply: s => { s.sourceMult.baby *= 2; } },
    { id: 'double_clone', category: 'sources', name: 'Double Clone d’Alex', img: ASSETS.clone, cost: 320, desc: 'x2 production des clones.', apply: s => { s.sourceMult.clone *= 2; } },
    { id: 'double_cyber', category: 'sources', name: 'Double Cyber Alex', img: ASSETS.cyber, cost: 950, desc: 'x2 production des Cyber Alex.', apply: s => { s.sourceMult.cyber *= 2; } },
    { id: 'double_mega', category: 'sources', name: 'Double Méga Alex', img: ASSETS.mega, cost: 3400, desc: 'x2 production des Méga Alex.', apply: s => { s.sourceMult.mega *= 2; } },
    { id: 'double_god', category: 'sources', name: 'Double God Alex', img: ASSETS.god, cost: 12000, desc: 'x2 production des God Alex.', apply: s => { s.sourceMult.god *= 2; } },
    { id: 'clone_chain', category: 'sources', name: 'Chaîne de clones', img: ASSETS.clone, cost: 800, desc: 'x1.75 sur Clone et Cyber Alex.', apply: s => { s.sourceMult.clone *= 1.75; s.sourceMult.cyber *= 1.75; } },
    { id: 'pantheon', category: 'sources', name: 'Panthéon d’Alex', img: ASSETS.god, cost: 7200, desc: 'x1.75 sur Méga et God Alex.', apply: s => { s.sourceMult.mega *= 1.75; s.sourceMult.god *= 1.75; } },

    { id: 'global_pulse', category: 'global', name: 'Rythme absolu', img: ASSETS.heart, cost: 420, desc: 'x1.35 à tout le souffle passif.', apply: s => { s.globalPassiveMult *= 1.35; } },
    { id: 'global_click', category: 'global', name: 'Main d’Alex', img: ASSETS.alex, cost: 650, desc: 'x1.30 au clic complet.', apply: s => { s.clickPvMult *= 1.30; s.clickSouffleMult *= 1.30; } },
    { id: 'god_tap', category: 'global', name: 'Toucher divin', img: ASSETS.god, cost: 14000, desc: 'x2 à tous les clics et x1.5 à tout le passif.', apply: s => { s.clickPvMult *= 2; s.clickSouffleMult *= 2; s.globalPassiveMult *= 1.5; } }
  ];

  const achievements = [
    { id: 'first_click', name: 'Premier souffles', check: s => s.totalClicks >= 1 },
    { id: 'first_baby', name: 'Baby Alex arrive', check: s => s.owned.baby >= 1 },
    { id: 'first_clone', name: 'Armée de clones', check: s => s.owned.clone >= 1 },
    { id: 'first_cyber', name: 'Cyber Alex activé', check: s => s.owned.cyber >= 1 },
    { id: 'survive60', name: 'Tenir 60 secondes', check: s => s.timeAlive >= 60 },
    { id: 'souffle2k', name: '2000 souffles', check: s => s.lifetimeSouffle >= 2000 }
  ];

  const caps = { aheart: 32, baby: 22, clone: 18, cyber: 14, mega: 10, god: 8 };
  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];

  const E = {
    hpText: $('#hpText'), maxHpText: $('#maxHpText'), hpFill: $('#hpFill'), hpCard: $('#hpCard'), drainText: $('#drainText'),
    souffleText: $('#souffleText'), clickText: $('#clickText'), passiveText: $('#passiveText'), ventolineLevelText: $('#ventolineLevelText'),
    ventolineFill: $('#ventolineFill'), asthmaText: $('#asthmaText'), asthmaFill: $('#asthmaFill'), riskText: $('#riskText'), riskFill: $('#riskFill'),
    crisisText: $('#crisisText'), crisisFill: $('#crisisFill'), comboText: $('#comboText'), comboFill: $('#comboFill'), stageTopbar: $('#stageTopbar'), stageMessage: $('#stageMessage'),
    shopList: $('#shopList'), upgradeList: $('#upgradeList'), achievements: $('#achievements'), effects: $('#effects'), accumulation: $('#accumulation'), spawn: $('#spawn'), notifications: $('#notifications'), panicOverlay: $('#panicOverlay'), stage: $('.stage'), goalText: $('#goalText'), goalPctText: $('#goalPctText'),
    death: $('#death'), victory: $('#victory'), flashRed: $('#flashRed'), flashBlue: $('#flashBlue'), ventolineInfo: $('#ventolineInfo'), defibInfo: $('#defibInfo'),
    ventolineBtn: $('#ventolineBtn'), defibBtn: $('#defibBtn'), walkBtn: $('#walkBtn'), runBtn: $('#runBtn'), smokeBtn: $('#smokeBtn'),
    finalVideoOverlay: $('#finalVideoOverlay'), finalVideo: $('#finalVideo'), finalVideoText: $('#finalVideoText'),
    game: $('#game'), confirmRestart: $('#confirmRestart')
  };

  function createState() {
    return {
      hp: 28, maxHp: 120, souffle: 25, lifetimeSouffle: 0, totalClicks: 0, timeAlive: 0,
      clickPvBase: 3.8, clickSouffleBase: 1.6, clickPvMult: 1, clickSouffleMult: 1,
      combo: 0, comboGain: 1.1, baseDrain: 2.45, asthma: 0.8, asthmaGrowth: 0.05,
      ventolineLevel: 1, ventolineCooldown: 0, ventolinePowerMult: 1, ventolineBurst: false, burstTimer: 0,
      defibCharges: 1, smokeStacks: 0, ventolineStress: 0, crisisMeter: 6, majorCrisisCooldown: 0,
      globalPassiveMult: 1,
      sourceMult: { aheart: 1, baby: 1, clone: 1, cyber: 1, mega: 1, god: 1 },
      owned: { aheart: 0, baby: 0, clone: 0, cyber: 0, mega: 0, god: 0 },
      purchasedUpgrades: [], unlocked: [], activeEffects: [], hasWon: false
    };
  }

  let state = createState();
  let lastFrameTime = performance.now();
  let accumulator = 0;
  let nextEventIn = 9;
  let gameLoopStopped = false;

  function restart() {
    const oldUnlocked = [...state.unlocked];
    state = createState();
    state.unlocked = oldUnlocked;
    nextEventIn = 9;
    accumulator = 0;
    lastFrameTime = performance.now();
    gameLoopStopped = false;
    E.death.classList.remove('show');
    E.victory?.classList.remove('show');
    E.confirmRestart?.classList.remove('show');
    stopFinalVideo();
    tryStartMusic();
    renderAll();
  }

  function gameStopped() {
    return E.death.classList.contains('show') || state.hasWon || gameLoopStopped;
  }

  function stopBgMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (!bgMusic) return;
    try {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    } catch (_) {}
  }

  function playFinalVideo() {
    if (!E.finalVideoOverlay || !E.finalVideo) return;
    gameLoopStopped = true;
    if (E.game) E.game.style.display = 'none';
    if (E.finalVideoText) {
      E.finalVideoText.textContent = 'omg t tro bo';
      E.finalVideoText.style.display = 'block';
    }
    E.finalVideoOverlay.classList.add('show');
    E.finalVideoOverlay.setAttribute('aria-hidden', 'false');
    E.victory?.classList.remove('show');

    clearTimeout(playFinalVideo._textTimer);
    clearTimeout(playFinalVideo._retryTimer);

    const startPlayback = () => {
      const playPromise = E.finalVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          if (E.finalVideoText) {
            E.finalVideoText.textContent = 'Clique pour lancer la vidéo';
            E.finalVideoText.style.display = 'block';
          }
          const resume = () => {
            if (E.finalVideoText) {
              E.finalVideoText.textContent = 'omg t tro bo';
              E.finalVideoText.style.display = 'block';
            }
            E.finalVideo.play().catch(() => {});
          };
          E.finalVideoOverlay.addEventListener('click', resume, { once: true });
        });
      }
    };

    try {
      E.finalVideo.pause();
      E.finalVideo.currentTime = 0;
      E.finalVideo.muted = false;
      E.finalVideo.playsInline = true;
      E.finalVideo.setAttribute('playsinline', '');
      E.finalVideo.load();
    } catch (_) {}

    if (E.finalVideo.readyState >= 2) startPlayback();
    else {
      const onCanPlay = () => startPlayback();
      E.finalVideo.addEventListener('canplay', onCanPlay, { once: true });
      playFinalVideo._retryTimer = setTimeout(startPlayback, 800);
    }

    playFinalVideo._textTimer = setTimeout(() => {
      if (E.finalVideoText) E.finalVideoText.style.display = 'none';
    }, 2000);
  }

  function stopFinalVideo() {
    if (!E.finalVideoOverlay || !E.finalVideo) return;
    clearTimeout(playFinalVideo._textTimer);
    clearTimeout(playFinalVideo._retryTimer);
    E.finalVideo.pause();
    E.finalVideo.currentTime = 0;
    E.finalVideoOverlay.classList.remove('show');
    E.finalVideoOverlay.setAttribute('aria-hidden', 'true');
    if (E.finalVideoText) E.finalVideoText.style.display = 'block';
    if (E.game) E.game.style.display = '';
  }
  function markHubComplete() {
    try {
      localStorage.setItem('hallilaa.completed.alexouu', '1');
    } catch (e) {}
  }
  function triggerVictory() {
    if (state.hasWon) return;
    state.hasWon = true;
    markHubComplete();
    stopBgMusic();
    notice('Victoire', '1M de souffles atteints. Lecture de la vidéo finale.', 'good');
    renderDynamic();
    playFinalVideo();
  }

  function openRestartConfirm() {
    if (E.death.classList.contains('show') || state.hasWon) return;
    E.confirmRestart?.classList.add('show');
  }

  function closeRestartConfirm() {
    E.confirmRestart?.classList.remove('show');
  }

  function fmt(n) {
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2).replace(/\.00$/, '') + 'M';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return Number(n).toFixed(n < 10 ? 1 : 0).replace(/\.0$/, '');
  }

  function generatorCost(def) {
    const owned = getSourceLevel(def.id);
    return Math.floor(def.baseCost * Math.pow(1.18, owned));
  }

  function battementsCost() {
    return Math.floor(8 * Math.pow(1.32, Math.max(0, (state.clickPvBase - 3.8) / 0.7)));
  }

  function ventolineCost() {
    return Math.floor(15 * Math.pow(1.38, state.ventolineLevel - 1));
  }

  function getSourceLevel(id) {
    return id === 'battements' || id === 'ventoline' ? 0 : (state.owned[id] || 0);
  }

  function comboMult() {
    return 1 + Math.min(state.combo, 25) * 0.04;
  }

  function ventolineHeal() {
    return (12 + state.ventolineLevel * 6) * state.ventolinePowerMult;
  }

  function ventolineCdMax() {
    return Math.max(3.8, 10 - (state.ventolineLevel - 1) * 1.10);
  }

  function effectStrength(effect, now = performance.now()) {
    if (!effect.ramp) return 1;
    const total = Math.max(1, effect.duration * 1000);
    const elapsed = Math.max(0, total - (effect.endsAt - now));
    const progress = Math.min(1, elapsed / total);
    return Math.pow(progress, 1.65);
  }

  function panicIntensity(now = performance.now()) {
    return Math.min(1, state.activeEffects.reduce((sum, e) => sum + ((e.id === 'panic' || e.panic) ? effectStrength(e, now) : 0), 0));
  }

  function panicClickMultiplier(now = performance.now()) {
    return Math.max(0.62, 1 - panicIntensity(now) * 0.32);
  }

  function clickPv(now = performance.now()) {
    return state.clickPvBase * state.clickPvMult * comboMult() * (state.burstTimer > 0 ? 1.35 : 1) * panicClickMultiplier(now);
  }

  function clickSouffle(now = performance.now()) {
    return state.clickSouffleBase * state.clickSouffleMult * comboMult() * (state.burstTimer > 0 ? 1.20 : 1) * panicClickMultiplier(now);
  }

  function basePassiveSouffle() {
    let total = 0;
    const defs = Object.fromEntries(shopDefs.filter(d => d.kind === 'generator').map(d => [d.id, d]));
    for (const id in state.owned) {
      if (defs[id]) total += state.owned[id] * defs[id].passive * (state.sourceMult[id] || 1);
    }
    return total * state.globalPassiveMult;
  }

  function passiveHp() {
    return basePassiveSouffle() * 0.08;
  }

  function asthmaPenalty() {
    return Math.max(0, state.asthma - 1.2) * 1.1;
  }

  function currentDrain(now = performance.now()) {
    const smoke = state.smokeStacks * 0.55;
    const ventStress = state.ventolineStress * 0.38;
    const asthma = state.asthma * 1.45 + asthmaPenalty();
    const effects = state.activeEffects.reduce((sum, e) => sum + ((e.rampDrain || 0) * effectStrength(e, now)) + (e.ramp ? 0 : (e.drain || 0)), 0);
    return Math.max(0, state.baseDrain + smoke + ventStress + asthma + effects);
  }

  function riskValue() {
    return Math.min(100, Math.max(0, state.asthma * 10 + state.smokeStacks * 12 + state.ventolineStress * 10 + state.crisisMeter * 0.7 + Math.max(0, currentDrain() - passiveHp()) * 10));
  }

  function crisisCount() {
    return state.activeEffects.filter(e => e.bad).length;
  }

  function heal(v) {
    state.hp = Math.min(state.maxHp, state.hp + v);
  }

  function addSouffle(v) {
    if (!v) return;
    state.souffle += v;
    if (v > 0) state.lifetimeSouffle += v;
    if (!state.hasWon && state.souffle >= WIN_TARGET) triggerVictory();
  }

  function hurt(v) {
    state.hp -= v;
    if (state.hp <= 0) tryDefib();
  }

  function tryDefib() {
    if (state.defibCharges > 0) {
      state.defibCharges--;
      state.hp = Math.min(state.maxHp, state.maxHp * 0.38);
      addEffect({ id: 'defib', name: 'Récupération post-choc', duration: 8, drain: 1.4, bad: true });
      notice('Défibrillateur', 'Alex revient de justesse.', 'good');
      flash('blue');
      return;
    }
    state.hp = 0;
    E.death.classList.add('show');
    notice('Run terminée', 'Alex s’est effondré.', 'bad');
    flash('red');
  }

  function addEffect(effect) {
    const now = performance.now();
    const e = { ...effect, endsAt: now + effect.duration * 1000 };
    const idx = state.activeEffects.findIndex(x => x.id === e.id);
    if (idx >= 0) state.activeEffects[idx] = e;
    else state.activeEffects.push(e);
  }

  function purgeEffects(now) {
    state.activeEffects = state.activeEffects.filter(e => e.endsAt > now);
  }

  function maybeUnlock() {
    achievements.forEach(a => {
      if (!state.unlocked.includes(a.id) && a.check(state)) {
        state.unlocked.push(a.id);
        notice('Trophée débloqué', a.name, 'good');
      }
    });
  }

  function spawnFloat(x, y, text, cls = 'good') {
    const d = document.createElement('div');
    d.className = 'float ' + cls;
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    d.textContent = text;
    E.spawn.appendChild(d);
    setTimeout(() => d.remove(), 1200);
  }

  function notice(title, body, tone = 'neutral') {
    const e = document.createElement('div');
    e.className = 'notice ' + tone;
    e.innerHTML = `<div class="t">${title}</div><div class="b">${body}</div>`;
    E.notifications.prepend(e);
    while (E.notifications.children.length > 5) E.notifications.lastChild.remove();
    setTimeout(() => e.remove(), 4800);
  }

  function flash(c) {
    const el = c === 'red' ? E.flashRed : E.flashBlue;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  }

  function majorSmokeCrisis() {
    addEffect({ id: 'smokeMajor', name: 'Crise nicotinique', duration: 14, drain: 3.2, bad: true });
    hurt(16 + state.smokeStacks * 2);
    state.crisisMeter = Math.min(100, state.crisisMeter + 26);
    state.majorCrisisCooldown = 20;
    notice('Grande crise — cigarette', 'Les poumons d’Alex craquent après l’abus de cigarettes.', 'epic');
    flash('red');
  }

  function majorVentolineCrisis() {
    addEffect({ id: 'ventolineMajor', name: 'Rebond ventoline', duration: 15, drain: 2.6, bad: true });
    hurt(10 + state.ventolineStress * 2);
    state.crisisMeter = Math.min(100, state.crisisMeter + 22);
    state.majorCrisisCooldown = 18;
    notice('Grande crise — ventoline', 'Trop de ventoline provoque un rebond brutal.', 'epic');
    flash('red');
  }

  function genericCrisis() {
    addEffect({ id: 'asthmaPeak', name: 'Pic d’asthme', duration: 10, drain: 2.6, bad: true });
    hurt(12 + state.asthma * 0.8);
    state.crisisMeter = Math.min(100, state.crisisMeter + 18);
    state.majorCrisisCooldown = 14;
    notice('Grande crise', 'Alex perd le contrôle de sa respiration.', 'epic');
    flash('red');
  }

  function maybeMajorCrisis(source) {
    if (state.majorCrisisCooldown > 0) return;
    if (source === 'smoke' && state.smokeStacks >= 3 && Math.random() < Math.min(0.86, 0.24 + state.smokeStacks * 0.15 + state.crisisMeter / 220)) majorSmokeCrisis();
    if (source === 'ventoline' && state.ventolineStress >= 3 && Math.random() < Math.min(0.72, 0.18 + state.ventolineStress * 0.13 + state.crisisMeter / 260)) majorVentolineCrisis();
  }

  function randomEvent() {
    const events = [
      () => { addEffect({ id: 'panic', name: 'Panique', duration: 8.5, ramp: true, rampDrain: 1.65, panic: true, bad: true }); notice('Panique', 'La pression monte progressivement : la vue se resserre et les clics deviennent moins nets.', 'bad'); },
      () => { heal(16); addEffect({ id: 'fresh', name: 'Air pur', duration: 10, drain: -1.0 }); notice('Air pur', 'Alex respire un peu mieux.', 'good'); },
      () => { addSouffle(35); notice('Sursaut', 'Petit bonus de souffles.', 'neutral'); },
      () => { genericCrisis(); },
      () => { heal(24); notice('Aide médicale', 'Une aide extérieure sauve quelques secondes.', 'good'); flash('blue'); }
    ];
    events[Math.floor(Math.random() * events.length)]();
  }

  function onClickLung() {
    if (gameStopped()) return;
    const now = performance.now();
    const panic = panicIntensity(now);
    const hp = clickPv(now);
    const sf = clickSouffle(now);
    heal(hp);
    addSouffle(sf);
    state.totalClicks++;
    state.combo = Math.min(25, state.combo + state.comboGain * (1 - panic * 0.22));
    state.crisisMeter = Math.max(0, state.crisisMeter - (0.9 + panic * 0.2));
    const r = $('#lungButton').getBoundingClientRect();
    spawnFloat(r.left + r.width * 0.48, r.top + r.height * 0.43, '+' + fmt(hp) + ' PV', 'good');
    spawnFloat(r.left + r.width * 0.58, r.top + r.height * 0.62, '+' + fmt(sf) + ' souffles', 'blue');
    $('#lungButton').classList.add('clicked');
    setTimeout(() => $('#lungButton').classList.remove('clicked'), 90);
    flash('blue');
    maybeUnlock();
    renderAll();
  }

  function onVentoline() {
    if (state.ventolineCooldown > 0 || gameStopped()) return;
    const healAmount = ventolineHeal() * Math.max(0.48, 1 - state.ventolineStress * 0.09);
    heal(healAmount);
    addEffect({ id: 'ventoline', name: 'Ventoline', duration: 6, drain: -1.1 });
    if (state.ventolineBurst) state.burstTimer = 6;
    state.ventolineCooldown = ventolineCdMax();
    state.ventolineStress = Math.min(6, state.ventolineStress + 1);
    state.crisisMeter = Math.min(100, state.crisisMeter + 6);
    notice('Ventoline', 'Alex reprend de l’air.', 'good');
    spawnFloat(innerWidth * 0.56, innerHeight * 0.56, '+' + fmt(healAmount) + ' PV', 'good');
    maybeMajorCrisis('ventoline');
    renderAll();
  }

  function onDefibBuy() {
    const price = 120 + state.defibCharges * 90;
    if (state.souffle < price || gameStopped()) return;
    state.souffle -= price;
    state.defibCharges++;
    notice('Défibrillateur acheté', 'Une charge de secours est prête.', 'neutral');
    renderAll();
  }

  function onWalk() {
    if (gameStopped()) return;
    const gain = 22;
    addSouffle(gain);
    state.crisisMeter = Math.min(100, state.crisisMeter + 3);
    addEffect({ id: 'walk', name: 'Marche', duration: 8, drain: 0.55, bad: true });
    notice('Marche', '+' + gain + ' souffles, mais Alex fatigue.', 'neutral');
    renderAll();
  }

  function onRun() {
    if (gameStopped()) return;
    const gain = 80;
    addSouffle(gain);
    state.crisisMeter = Math.min(100, state.crisisMeter + 8);
    addEffect({ id: 'run', name: 'Course', duration: 8, drain: 2.2, bad: true });
    if (Math.random() < 0.3) {
      hurt(8);
      notice('Course', 'Gros gain, mais Alex craque presque.', 'bad');
      flash('red');
    } else {
      notice('Course', '+' + gain + ' souffles.', 'neutral');
    }
    renderAll();
  }

  function onSmoke() {
    if (gameStopped()) return;
    const gain = 42;
    addSouffle(gain);
    heal(2);
    state.smokeStacks = Math.min(6, state.smokeStacks + 1);
    state.crisisMeter = Math.min(100, state.crisisMeter + 10);
    addEffect({ id: 'smoke', name: 'Cigarette', duration: 18, drain: 1.0, bad: true });
    notice('Cigarette', 'Boost immédiat, mais tu joues avec une grande crise.', 'bad');
    flash('red');
    maybeMajorCrisis('smoke');
    renderAll();
  }

  function buyShop(def) {
    if (def.kind === 'clickLevel') {
      const price = battementsCost();
      if (state.souffle < price || state.hasWon) return;
      state.souffle -= price;
      state.clickPvBase += 0.7;
      state.clickSouffleBase += 0.25;
      notice('Battements', 'Le clic devient plus fort.', 'good');
      renderAll();
      return;
    }

    if (def.kind === 'ventolineLevel') {
      const price = ventolineCost();
      if (state.souffle < price || state.hasWon) return;
      state.souffle -= price;
      state.ventolineLevel++;
      notice('Ventoline', 'Niveau ' + state.ventolineLevel + ' débloqué.', 'good');
      renderAll();
      return;
    }

    const cost = generatorCost(def);
    if (state.souffle < cost || state.hasWon) return;
    state.souffle -= cost;
    state.owned[def.id]++;
    notice('Achat', def.name + ' rejoint la production.', 'neutral');
    renderAll();
  }

  function buyUpgrade(up) {
    if (state.hasWon || state.purchasedUpgrades.includes(up.id) || state.souffle < up.cost) return;
    state.souffle -= up.cost;
    state.purchasedUpgrades.push(up.id);
    up.apply(state);
    notice('Amélioration achetée', up.name + ' active immédiatement.', 'good');
    spawnFloat(innerWidth * 0.78, innerHeight * 0.40, '✓ ' + up.name, 'good');
    renderAll();
  }

  function renderShop() {
    E.shopList.innerHTML = '';
    shopDefs.forEach(def => {
      let cost, ownedText, meta;
      if (def.kind === 'clickLevel') {
        cost = battementsCost();
        ownedText = 'Niveau de clic : ' + fmt((state.clickPvBase - 3.2) / 0.7 + 1);
        meta = 'Prochain achat : +0.7 PV/clic · +0.25 souffles/clic';
      } else if (def.kind === 'ventolineLevel') {
        cost = ventolineCost();
        ownedText = 'Niveau actuel : ' + state.ventolineLevel;
        meta = 'Soin ' + fmt(ventolineHeal()) + ' PV · recharge ' + fmt(ventolineCdMax()) + 's';
      } else {
        cost = generatorCost(def);
        ownedText = 'Possédé : ' + state.owned[def.id];
        meta = '+' + fmt(def.passive * (state.sourceMult[def.id] || 1)) + ' souffles/s';
      }
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `
        <div class="top">
          <div class="info">
            <div class="thumb"><img src="${def.img}" alt="${def.name}"></div>
            <div>
              <div class="name">${def.name}</div>
              <div class="desc">${def.desc}</div>
              <div class="meta">${meta}</div>
              <div class="owned">${ownedText}</div>
            </div>
          </div>
          <button type="button" class="buy" data-shop-id="${def.id}" ${state.souffle < cost || E.death.classList.contains('show') || state.hasWon ? 'disabled' : ''}>${fmt(cost)} souffles</button>
        </div>`;
      E.shopList.appendChild(item);
    });
  }

  function renderUpgrades() {
    E.upgradeList.innerHTML = '';
    upgradeCategories.forEach(cat => {
      const wrap = document.createElement('div');
      wrap.className = 'cat';
      wrap.innerHTML = `<div class="cathead">${cat.name}</div><div class="catitems"></div>`;
      const inner = wrap.querySelector('.catitems');
      upgradeDefs.filter(u => u.category === cat.id).forEach(up => {
        const bought = state.purchasedUpgrades.includes(up.id);
        const item = document.createElement('div');
        item.className = 'item' + (bought ? ' bought' : '');
        item.innerHTML = `
          <div class="top">
            <div class="info">
              <div class="thumb"><img src="${up.img}" alt="${up.name}"></div>
              <div>
                <div class="name">${up.name}</div>
                <div class="desc">${up.desc}</div>
                <div class="meta">${bought ? 'Effet permanent actif' : fmt(up.cost) + ' souffles'}</div>
              </div>
            </div>
            <button type="button" class="buy" data-upgrade-id="${up.id}" ${bought || state.souffle < up.cost || E.death.classList.contains('show') || state.hasWon ? 'disabled' : ''}>${bought ? 'ACHETÉE' : 'Acheter'}</button>
          </div>`;
        inner.appendChild(item);
      });
      E.upgradeList.appendChild(wrap);
    });
  }

  function renderAchievements() {
    if (!E.achievements) return;
    E.achievements.innerHTML = '';
    achievements.forEach(a => {
      const ok = state.unlocked.includes(a.id);
      const d = document.createElement('div');
      d.className = 'ach' + (ok ? '' : ' locked');
      d.textContent = (ok ? '✓ ' : '✦ ') + a.name;
      E.achievements.appendChild(d);
    });
  }

  function renderEffects() {
    E.effects.innerHTML = '';
    if (state.activeEffects.length === 0) {
      const p = document.createElement('div');
      p.className = 'pill neutral';
      p.textContent = 'Aucun effet actif';
      E.effects.appendChild(p);
      return;
    }
    const now = performance.now();
    state.activeEffects.slice().sort((a, b) => a.endsAt - b.endsAt).forEach(e => {
      const p = document.createElement('div');
      p.className = 'pill ' + (e.bad ? 'bad' : 'good');
      const rampInfo = e.ramp ? ' · intensité ' + Math.round(effectStrength(e, now) * 100) + '%' : '';
      p.textContent = e.name + ' · ' + Math.max(0, Math.ceil((e.endsAt - now) / 1000)) + 's' + rampInfo;
      E.effects.appendChild(p);
    });
  }

  function spriteFor(kind) {
    return { aheart: ASSETS.aheart, baby: ASSETS.baby, clone: ASSETS.clone, cyber: ASSETS.cyber, mega: ASSETS.mega, god: ASSETS.god }[kind];
  }

  function renderAccumulation() {
    E.accumulation.innerHTML = '';
    const entries = [['aheart', 'heart'], ['baby', 'baby'], ['clone', 'clone'], ['cyber', 'cyber'], ['mega', 'mega'], ['god', 'god']];
    entries.forEach(([id, cls], tIndex) => {
      const count = Math.min(caps[id], state.owned[id] || 0);
      for (let i = 0; i < count; i++) {
        const img = document.createElement('img');
        img.src = spriteFor(id);
        img.className = 'alex-sprite ' + cls;
        img.style.transform = `scale(${1 + (tIndex * 0.06)})`;
        E.accumulation.appendChild(img);
      }
    });
  }

  function renderHud() {
    const now = performance.now();
    const hpPct = Math.max(0, Math.min(100, (state.hp / state.maxHp) * 100));
    const panic = panicIntensity(now);
    const passS = basePassiveSouffle();
    const passHp = passiveHp();
    const drain = currentDrain(now);
    const risk = riskValue();
    const cCount = crisisCount();
    E.hpText.textContent = fmt(state.hp) + ' PV';
    E.maxHpText.textContent = fmt(state.maxHp);
    E.hpFill.style.width = hpPct + '%';
    E.drainText.textContent = `perte / sec : -${fmt(drain)} · regen / sec : +${fmt(passHp)} · asthme : ${fmt(asthmaPenalty())}`;
    E.souffleText.textContent = fmt(state.souffle);
    if (E.goalText) E.goalText.textContent = `${fmt(state.souffle)} / ${fmt(WIN_TARGET)} souffles`;
    if (E.goalPctText) E.goalPctText.textContent = `${Math.min(100, Math.floor((state.souffle / WIN_TARGET) * 100))}%`;
    E.clickText.textContent = `+${fmt(clickPv(now))} PV / +${fmt(clickSouffle(now))} souffles`;
    E.passiveText.textContent = `${fmt(passS)} souffles/s · ${fmt(passHp)} PV/s`;
    E.ventolineLevelText.textContent = 'Niv.' + state.ventolineLevel;
    E.ventolineFill.style.width = `${Math.max(0, 100 - (state.ventolineCooldown / ventolineCdMax()) * 100)}%`;
    E.ventolineInfo.textContent = state.ventolineCooldown > 0 ? `recharge : ${fmt(state.ventolineCooldown)}s · stress ${fmt(state.ventolineStress)}` : `clic actif : ${fmt(ventolineHeal())} PV · stress ${fmt(state.ventolineStress)}`;
    E.defibInfo.textContent = `charges : ${state.defibCharges} · achat : ${fmt(120 + state.defibCharges * 90)} souffles`;
    E.asthmaText.textContent = fmt(state.asthma);
    E.asthmaFill.style.width = Math.min(100, state.asthma * 10) + '%';
    E.comboText.textContent = 'x' + comboMult().toFixed(2);
    E.comboFill.style.width = Math.min(100, ((comboMult() - 1) / 1.0) * 100) + '%';
    let riskLabel = 'Faible';
    if (risk >= 75) riskLabel = 'Extrême';
    else if (risk >= 50) riskLabel = 'Élevé';
    else if (risk >= 25) riskLabel = 'Moyen';
    E.riskText.textContent = `${riskLabel} · ${fmt(risk)}%`;
    E.riskText.className = 'value ' + (risk >= 60 ? 'alert' : risk < 25 ? 'safe' : '');
    E.riskFill.style.width = risk + '%';
    E.crisisText.textContent = cCount > 0 ? `Oui x${cCount}` : 'Non';
    E.crisisText.className = 'value ' + (cCount > 0 ? 'alert' : 'safe');
    E.crisisFill.style.width = Math.min(100, cCount * 25) + '%';
    E.hpCard.classList.toggle('critical', hpPct <= 20);
    E.stageTopbar.classList.toggle('critical', hpPct <= 20 || risk >= 75 || cCount > 0);

    if (state.hasWon) E.stageMessage.textContent = 'Objectif atteint : 1M de souffles. Alex peut aller voter.';
    else if (hpPct <= 20) E.stageMessage.textContent = 'Alex peut mourir dans les prochaines secondes.';
    else if (panic >= 0.72) E.stageMessage.textContent = 'La panique écrase le rythme : la vision se ferme et les clics répondent moins.';
    else if (panic >= 0.28) E.stageMessage.textContent = 'La panique monte doucement. Garde le tempo avant qu’elle ne prenne toute la place.';
    else if (cCount >= 2) E.stageMessage.textContent = 'Les crises se superposent. Le moindre abus peut tout casser.';
    else if (risk >= 75) E.stageMessage.textContent = 'Le risque explose. Une grande crise peut tomber maintenant.';
    else if (state.asthma >= 5) E.stageMessage.textContent = 'L’asthme bouffe vraiment les PV maintenant. Il faut stabiliser Alex vite.';
    else if (passHp < drain) E.stageMessage.textContent = 'Le passif ne suit pas encore : clique, booste les battements, achète des Alex.';
    else E.stageMessage.textContent = 'Le système commence enfin à se stabiliser.';

    E.panicOverlay.style.opacity = String(Math.min(0.82, panic * 0.85));
    E.stage.classList.toggle('panic-low', panic > 0.08);
    E.stage.classList.toggle('panic-mid', panic >= 0.34 && panic < 0.72);
    E.stage.classList.toggle('panic-high', panic >= 0.72);
    $('#lungButton').classList.toggle('panic', panic >= 0.24);
    E.ventolineBtn.disabled = state.ventolineCooldown > 0 || gameStopped();
    E.defibBtn.disabled = state.souffle < 120 + state.defibCharges * 90 || gameStopped();
    E.walkBtn.disabled = gameStopped();
    E.runBtn.disabled = gameStopped();
    E.smokeBtn.disabled = gameStopped();
  }

  function renderDynamic() {
    renderHud();
    renderEffects();
    renderAchievements();
    renderAccumulation();
  }

  function renderAll() {
    renderDynamic();
    renderShop();
    renderUpgrades();
  }

  function updateFixedStep(dt) {
    if (E.death.classList.contains('show') || state.hasWon || gameLoopStopped) return;

    state.timeAlive += dt;
    state.combo = Math.max(0, state.combo - dt * 0.1);
    state.ventolineCooldown = Math.max(0, state.ventolineCooldown - dt);
    state.burstTimer = Math.max(0, state.burstTimer - dt);
    state.majorCrisisCooldown = Math.max(0, state.majorCrisisCooldown - dt);
    state.smokeStacks = Math.max(0, state.smokeStacks - dt * 0.05);
    state.ventolineStress = Math.max(0, state.ventolineStress - dt * 0.04);
    state.crisisMeter = Math.max(0, state.crisisMeter - dt * 1.4);
    state.asthma = Math.min(10, state.asthma + state.asthmaGrowth * dt * (1 + state.smokeStacks * 0.10 + state.ventolineStress * 0.05 + Math.max(0, state.crisisMeter - 40) / 120));

    const now = performance.now();
    purgeEffects(now);

    const ps = basePassiveSouffle();
    const php = passiveHp();
    const dr = currentDrain(now);
    if (ps > 0) addSouffle(ps * dt);
    if (php > 0) heal(php * dt);
    if (dr > 0) hurt(dr * dt);

    if (state.asthma > 5 && Math.random() < dt * 0.12) {
      addEffect({ id: 'micro', name: 'Pic d’asthme', duration: 5, drain: 1.6, bad: true });
      hurt(dt * Math.max(0, state.asthma - 4) * 4.5);
    }

    if (state.majorCrisisCooldown <= 0 && riskValue() >= 78 && Math.random() < dt * 0.07) {
      if (state.smokeStacks >= Math.max(2, state.ventolineStress)) majorSmokeCrisis();
      else if (state.ventolineStress >= 2) majorVentolineCrisis();
      else genericCrisis();
    }

    nextEventIn -= dt;
    if (nextEventIn <= 0) {
      randomEvent();
      nextEventIn = Math.max(5, 13 + Math.random() * 7 - state.asthma * 0.7 - riskValue() * 0.045);
    }

    maybeUnlock();
  }

  function tick(now) {
    const frameDelta = Math.min(MAX_FRAME_DELTA, Math.max(0, (now - lastFrameTime) / 1000));
    lastFrameTime = now;
    accumulator += frameDelta;

    while (accumulator >= FIXED_STEP) {
      updateFixedStep(FIXED_STEP);
      accumulator -= FIXED_STEP;
    }

    if (!gameLoopStopped) renderDynamic();
    requestAnimationFrame(tick);
  }

  const bgMusic = document.getElementById('bgMusic');
  function tryStartMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0.32;
    bgMusic.play().catch(() => {});
  }

  ['pointerdown', 'click', 'keydown', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, tryStartMusic, { once: true, passive: true });
  });

  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.remove('active'));
    $$('.tabc').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    $('#' + t.dataset.tab).classList.add('active');
  }));

  $('#lungButton').addEventListener('click', onClickLung);
  E.ventolineBtn.addEventListener('click', onVentoline);
  E.defibBtn.addEventListener('click', onDefibBuy);
  E.walkBtn.addEventListener('click', onWalk);
  E.runBtn.addEventListener('click', onRun);
  E.smokeBtn.addEventListener('click', onSmoke);
  $('#restartBtn').addEventListener('click', openRestartConfirm);
  $('#cancelRestartBtn').addEventListener('click', closeRestartConfirm);
  $('#confirmRestartBtn').addEventListener('click', () => {
    closeRestartConfirm();
    restart();
    notice('Run relancée', 'Tu repars de zéro.', 'neutral');
  });
  $('#retryBtn').addEventListener('click', restart);
  $('#victoryRetryBtn')?.addEventListener('click', restart);

  E.confirmRestart?.addEventListener('click', event => {
    if (event.target.id === 'confirmRestart') closeRestartConfirm();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeRestartConfirm();
  });

  E.shopList.addEventListener('click', event => {
    const button = event.target.closest('button.buy[data-shop-id]');
    if (!button || button.disabled) return;
    const def = shopDefs.find(item => item.id === button.dataset.shopId);
    if (def) buyShop(def);
  });

  E.upgradeList.addEventListener('click', event => {
    const button = event.target.closest('button.buy[data-upgrade-id]');
    if (!button || button.disabled) return;
    const upgrade = upgradeDefs.find(item => item.id === button.dataset.upgradeId);
    if (upgrade) buyUpgrade(upgrade);
  });

  if (E.finalVideo) {
    E.finalVideo.addEventListener('ended', () => {
      if (E.finalVideoText) E.finalVideoText.style.display = 'none';
    });
  }

  tryStartMusic();
  renderAll();
  notice('Version modifiée', 'Multi-fichiers propre, sans sauvegarde, avec logique en temps fixe.', 'good');
  requestAnimationFrame(tick);
})();
