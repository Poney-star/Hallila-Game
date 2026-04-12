const TYPEWRITER_DURATION = 2.0;
const FIXED_DT = 1 / 120;
const MAX_FRAME = 0.1;
const BGM_VOLUME = 0.1125;
const ENDING_BGM_VOLUME = 0.059375;
const GLOBAL_DIFFICULTY = 1.15;

const forms = [
  {
    id: "prof",
    name: "Prof de physique Zerbib",
    sprite: "assets/prof.png",
    enemyMaxHp: 100,
    intro: ["* Zerbib ajuste ses lunettes.\n* Il a déjà décidé que tu allais apprendre."],
    actHint: "* Pour le calmer: fais-lui sentir qu'il est brillant, mais sans forcer.",
    actOptions: [
      { name: "Répondre", desc: "Réponds dans sa logique absurde et professorale." },
      { name: "Acquiescer", desc: "Valide doucement son génie de tableau noir." },
      { name: "Prendre des notes", desc: "Montre que ses élucubrations méritent d'être conservées." },
      { name: "Contredire", desc: "Le piquer sur la théorie. Mauvaise ambiance garantie." }
    ],
    threshold: 5,
    onAct(i, s) {
      if (i === 0) {
        const q = [
          "Tu confirmes très sérieusement que le café accélère la lumière.",
          "Tu admets que la merguez possède une masse morale non négligeable.",
          "Tu notes que le vide est, au fond, un frigo sans porte."
        ];
        s.score += 2;
        return q[rand(0, q.length - 1)];
      }
      if (i === 1) {
        s.score += 1;
        return "Tu hoches la tête avec respect. Il se redresse, fier comme un Nobel du PMU.";
      }
      if (i === 2) {
        s.score += 2;
        return "Tu prends des notes avec gravité. Son âme de prof fond un peu.";
      }
      return "Tu le contredis avec prudence. Il serre déjà la craie comme une arme.";
    },
    spareText: "* Il te considère enfin comme un élève fréquentable.",
    fightText: "* Le tableau se fissure dans un grand soupir scientifique.",
    attacks: ["rain", "laser", "orbit", "quiz"]
  },
  {
    id: "anniv",
    name: "Zerbib Anniversaire",
    sprite: "assets/anniv.png",
    enemyMaxHp: 110,
    intro: ["* Zerbib surgit dans les confettis.\n* Ce soir, le monde entier est invité à le célébrer."],
    actHint: "* Pour le good path: deviens son meilleur public, sincère et un peu excessif.",
    actOptions: [
      { name: "Applaudir", desc: "Lui offrir une vraie scène, pas juste des claquements mous." },
      { name: "Rire", desc: "Rire franchement à ses blagues, même les plus nulles." },
      { name: "Chanter", desc: "Entrer à fond dans la fête et porter le refrain." },
      { name: "Ignorer", desc: "Casser le moment et laisser l'ego retomber sur le gâteau." }
    ],
    threshold: 6,
    onAct(i, s) {
      if (i === 0) {
        s.score += 2;
        return "Tu applaudis à fond. Il prend la pose comme si la salle entière le demandait.";
      }
      if (i === 1) {
        s.score += 2;
        return "Tu ris pour de vrai. Son sourire devient presque touchant.";
      }
      if (i === 2) {
        s.score += 2;
        return "Tu chantes avec lui. Pendant une seconde, la fête a quelque chose de pur.";
      }
      return "Tu l'ignores. Il vacille, mais il essaie encore de sauver l'ambiance.";
    },
    spareText: "* Zerbib se sent enfin fêté comme il l'espérait.",
    fightText: "* Les confettis retombent. La salle se vide dans le silence.",
    attacks: ["confetti", "balloons", "fireworks", "candles"]
  },
  {
    id: "conde",
    name: "Zerbib Condé Mode",
    sprite: "assets/conde.png",
    enemyMaxHp: 125,
    intro: ["* Zerbib ajuste sa posture.\n* Contrôle de style, contrôle de toi, contrôle de tout."],
    actHint: "* Pour le good path: coopère calmement, respecte le théâtre, apaise l'uniforme.",
    actOptions: [
      { name: "Coopérer", desc: "Rester calme, propre, presque admirable." },
      { name: "Flatter", desc: "Nourrir son cinéma avec tact et un peu de panache." },
      { name: "Se justifier", desc: "Répondre net, sans le piquer ni t'écraser." },
      { name: "Fuir du regard", desc: "Passer pour louche avant même d'avoir parlé." }
    ],
    threshold: 5,
    onAct(i, s) {
      if (i === 0) {
        s.score += 2;
        return "Tu coopères sans trembler. Son autorité se transforme presque en courtoisie.";
      }
      if (i === 1) {
        s.score += 2;
        return "Tu flattes son style avec doigté. Il savoure beaucoup trop la remarque.";
      }
      if (i === 2) {
        s.score += 1;
        return "Tu te justifies proprement. Il baisse un peu la garde, sans perdre la pose.";
      }
      return "Tu détournes les yeux. Pour lui, ça sent déjà la course-poursuite.";
    },
    spareText: "* Ta coopération est si parfaite qu'il te salue presque.",
    fightText: "* La sirène s'éteint. Le style quitte la scène.",
    attacks: ["siren", "tickets", "alarm", "barrage"]
  },
  {
    id: "dave_kai",
    name: "Dave & Kai",
    sprite: "assets/dave_kai.png",
    enemyMaxHp: 140,
    intro: ["* Dave & Kai te regardent en silence.\n* Le dernier round se pose là, bien habillé."],
    actHint: "* Pour le good path: écoute, valide, et suis leur délire final sans ironie.",
    actOptions: [
      { name: "Écouter", desc: "Laisser parler la vérité cosmique jusqu'au buffet final." },
      { name: "Valider", desc: "Accueillir le délire comme un fait évident." },
      { name: "Prendre la poudre", desc: "Suivre la poudre célesto-merguez jusqu'au bout." },
      { name: "Résister", desc: "Rester fermé à la vision finale." }
    ],
    threshold: 6,
    onAct(i, s) {
      if (i === 0) { s.score += 1; return "Tu écoutes jusqu'au fond. Leur buffet intérieur commence à s'ouvrir."; }
      if (i === 1) { s.score += 2; return "Tu valides leur cosmologie. L'air se détend un peu."; }
      if (i === 2) { s.score += 2; return "Tu prends la poudre célesto-merguez. Le destin applaudit en silence."; }
      return "Tu résistes encore. Le banquet reste fermé.";
    },
    spareText: "* Dave & Kai t'ouvrent enfin leur vrai buffet intérieur.",
    fightText: "* Le bruit retombe d'un coup. Même l'air semble hésiter.",
    attacks: ["mix", "star", "blur", "rain"]
  }
];

const ATTACK_PROFILES = {
  rain:       { duration: 8.4, spawnBase: 0.06, spawnRamp: 0.05, label: 'Pluie d’équations' },
  laser:      { duration: 7.8, spawnBase: 0.04, spawnRamp: 0.03, label: 'Laser du tableau' },
  orbit:      { duration: 8.5, spawnBase: 0.035, spawnRamp: 0.03, label: 'Craie orbitale' },
  quiz:       { duration: 7.4, spawnBase: 0.05, spawnRamp: 0.04, label: 'Interro surprise' },
  confetti:   { duration: 8.0, spawnBase: 0.08, spawnRamp: 0.04, label: 'Pluie de confettis' },
  balloons:   { duration: 9.6, spawnBase: 0.05, spawnRamp: 0.03, label: 'Ballons envahissants' },
  fireworks:  { duration: 6.8, spawnBase: 0.035, spawnRamp: 0.025, label: 'Feux d’artifice' },
  candles:    { duration: 8.0, spawnBase: 0.05, spawnRamp: 0.03, label: 'Bougies explosives' },
  sugar:      { duration: 8.2, spawnBase: 0.08, spawnRamp: 0.04, label: 'Pluie de sucre' },
  mirage:     { duration: 9.5, spawnBase: 0.04, spawnRamp: 0.03, label: 'Dattes mirages' },
  spiral:     { duration: 8.8, spawnBase: 0.04, spawnRamp: 0.03, label: 'Spirale au miel' },
  proverb:    { duration: 7.4, spawnBase: 0.05, spawnRamp: 0.03, label: 'Proverbe lourd' },
  siren:      { duration: 8.8, spawnBase: 0.018, spawnRamp: 0.009, label: 'Sirènes tournantes' },
  dash:       { duration: 8.8, spawnBase: 0.018, spawnRamp: 0.008, label: 'Charge contrôlée' },
  tickets:    { duration: 9.8, spawnBase: 0.018, spawnRamp: 0.008, label: 'Voitures de police' },
  barrage:    { duration: 4.8, spawnBase: 0.018, spawnRamp: 0.008, label: 'Barrages filtrants' },
  alarm:      { duration: 8.8, spawnBase: 0.028, spawnRamp: 0.014, label: 'Flashs d’alarme' },
  mix:        { duration: 9.0, spawnBase: 0.07, spawnRamp: 0.05, label: 'Synthèse totale' },
  star:       { duration: 6.8, spawnBase: 0.04, spawnRamp: 0.03, label: 'Auto-célébration finale' },
  grid:       { duration: 8.8, spawnBase: 0.035, spawnRamp: 0.03, label: 'Tableau cosmique' },
  blur:       { duration: 8.9, spawnBase: 0.04, spawnRamp: 0.03, label: 'Poudre astrale' }
};

const victorySlides = [
  'assets/slideshow/1176947C-7C3A-4F72-AF58-EB34B61EC8DF.jpeg',
  'assets/slideshow/2495F390-D3E6-41D3-B168-30326C7F4F18.jpeg',
  'assets/slideshow/28CC3186-B0A6-4448-BB07-1A17D5920F20.jpeg',
  'assets/slideshow/343E553B-2FF9-4C41-9E95-57680A380D3A.jpeg',
  'assets/slideshow/3EB332B1-169C-43E7-A281-741EC00F5808.jpeg',
  'assets/slideshow/4764B299-C238-4E02-B34E-B9DD0337A560.jpeg',
  'assets/slideshow/50CBA2B7-3947-429A-B00F-52A14E059FD7.jpeg',
  'assets/slideshow/5839C405-A00D-4208-B2A8-11D4AB63FCA6.jpeg',
  'assets/slideshow/6957ED30-9A3C-4982-8C08-BAD4C27B6956.jpeg',
  'assets/slideshow/6F3EAF1B-68E0-4B19-AF2D-EB4AC37CCD1A.jpeg',
  'assets/slideshow/75F8885C-669F-40D8-B229-B52C9446CAF9.jpeg',
  'assets/slideshow/8B59A884-E04B-4F4B-A55F-13E16CE8D198.jpeg',
  'assets/slideshow/8BBF83B6-05E4-4E30-BDA8-60B1B3505ED3.jpeg',
  'assets/slideshow/9BCACBA9-B086-4373-A34B-B77F17DCFB9A.jpeg',
  'assets/slideshow/A1660023-8EB1-4F85-90F7-2A5C6C423E2C.jpeg',
  'assets/slideshow/A6364BA0-DDCB-4A90-9E75-27690E30CE2D.jpeg',
  'assets/slideshow/A7C4B6D9-E202-45E2-8206-F149502149E0.jpeg',
  'assets/slideshow/B630D9CD-88BC-434A-9108-EFEF27761BAD.jpeg',
  'assets/slideshow/BB36C202-A6D0-4267-8F42-F6B54C590406.jpeg',
  'assets/slideshow/BCD86023-0315-4BD6-80EA-6D1CB760CFA5.jpeg',
  'assets/slideshow/C0FCC728-1FFD-45F9-8074-B3B47E7EEFAD.jpeg',
  'assets/slideshow/C9EEE7EC-A23A-4210-A9C1-13FCC64C5544.jpeg',
  'assets/slideshow/CD1647F8-62B5-41E7-A716-BE447066E2EF.jpeg',
  'assets/slideshow/D3039894-34C7-41AE-B0AB-35565A2BF34E.jpeg',
  'assets/slideshow/D38E0CF3-0F07-4F6A-B64D-6648660AF4EF.jpeg',
  'assets/slideshow/D5B4A1B4-88D5-42D3-BD60-B754CFCC6FDC.jpeg',
  'assets/slideshow/D6E6EC86-5E92-44FD-BF30-6929A9E0E1ED.jpeg',
  'assets/slideshow/DEDF3458-EE7E-4243-B8F0-1FE9D617B96A.jpeg',
  'assets/slideshow/E2608C1D-2B55-4DAE-81C9-AB63977B0C00.jpeg',
  'assets/slideshow/F5BAE52C-3BC2-4DA1-9041-66E7BAF20C09.jpeg',
];

const state = {
  formIndex: 0,
  playerMaxHp: 100,
  playerHp: 100,
  coffees: 5,
  kills: 0,
  spares: 0,
  menu: 'main',
  selected: 0,
  turnText: [],
  enemyHp: 0,
  enemyMaxHp: 0,
  score: 0,
  spareReady: false,
  fightRouteChosen: false,
  attackTimer: 0,
  attackTotal: 0,
  attackName: '',
  attackProfile: null,
  attackSpawnCarry: 0,
  bullets: [],
  scheduledSpawns: [],
  soul: { x: 260, y: 120, r: 10, speed: 170 },
  invuln: 0,
  fightMini: null,
  ended: false,
  winMode: false,
  pendingAfterText: null,
  pendingDelay: 0,
  clock: 0,
};

const textFx = {
  full: '',
  shown: '',
  elapsed: 0,
  duration: TYPEWRITER_DURATION,
  active: false,
};

const arena = document.getElementById('arena');
const ctx = arena.getContext('2d');
const enemySprite = document.getElementById('enemySprite');
const formNameEl = document.getElementById('formName');
const playerHpBar = document.getElementById('playerHpBar');
const enemyHpBar = document.getElementById('enemyHpBar');
const playerHpText = document.getElementById('playerHpText');
const enemyHpText = document.getElementById('enemyHpText');
const coffeeText = document.getElementById('coffeeText');
const routeText = document.getElementById('routeText');
const textBox = document.getElementById('textBox');
const menuBox = document.getElementById('menuBox');
const endingSlideshow = document.getElementById('endingSlideshow');
const endingPhotos = document.getElementById('endingPhotos');
const endingBgPhoto = document.getElementById('endingBgPhoto');
const endingTitle = document.getElementById('endingTitle');
const endingHint = document.getElementById('endingHint');
const endingTitleCard = document.getElementById('endingTitleCard');
const endingMessages = Array.from(document.querySelectorAll('.ending-message'));
const endingFlash = document.getElementById('endingFlash');

const bgm = document.getElementById('bgm');
const victoryBgm = document.getElementById('victoryBgm');
const musicToggle = document.getElementById('musicToggle');
let musicStarted = false;
let userWantedMusic = true;
let slideshowOrder = [];
let slideshowIndex = 0;
let slideshowTimer = null;
let endingMessageTimer = null;
let endingExplosionTimer = null;
let endingConfettiTimer = null;
let endingPhotoJuggleTimer = null;
const endingTimeouts = new Set();
let lastTime = 0;
let accumulator = 0;
const keys = {};

const spriteAssets = {
  alarm: Array.from({ length: 10 }, (_, i) => Object.assign(new Image(), { src: `assets/alarm_${i}.png` })),
  police: Array.from({ length: 12 }, (_, i) => Object.assign(new Image(), { src: `assets/police_${i}.png` })),
};

function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function currentForm() { return forms[state.formIndex]; }
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function updateMusicButton() {
  if (!musicToggle) return;
  const playing = bgm && !bgm.paused;
  musicToggle.textContent = `Musique: ${playing ? 'ON' : 'OFF'}`;
  musicToggle.classList.toggle('playing', playing);
}

async function startMusic() {
  if (!bgm) return;
  try {
    bgm.volume = BGM_VOLUME;
    await bgm.play();
    musicStarted = true;
  } catch (e) {}
  updateMusicButton();
}

function stopBattleMusic() {
  if (!bgm) return;
  bgm.pause();
  bgm.currentTime = 0;
  updateMusicButton();
}

function toggleMusic() {
  if (!bgm) return;
  if (bgm.paused) {
    userWantedMusic = true;
    startMusic();
  } else {
    userWantedMusic = false;
    bgm.pause();
    updateMusicButton();
  }
}


function clearEndingTimeouts() {
  for (const t of endingTimeouts) clearTimeout(t);
  endingTimeouts.clear();
}

function later(ms, fn) {
  const t = setTimeout(() => {
    endingTimeouts.delete(t);
    fn();
  }, ms);
  endingTimeouts.add(t);
  return t;
}

function nextVictorySlide() {
  if (!slideshowOrder.length) return '';
  const src = slideshowOrder[slideshowIndex % slideshowOrder.length];
  slideshowIndex += 1;
  return src;
}

function randomPercent(min, max) {
  return Math.random() * (max - min) + min;
}

function positionEndingPhoto(el, immediate = false) {
  if (!el) return;
  const width = rand(22, 38);
  const left = randomPercent(0, 72);
  const top = randomPercent(0, 58);
  const rot = rand(-22, 22);
  const scale = (94 + rand(0, 36)) / 100;
  const hue = rand(-18, 18);
  const sat = 105 + rand(0, 35);
  const bright = 96 + rand(0, 18);
  const shadow = rand(22, 38);
  const delay = (Math.random() * 1.2).toFixed(2);
  if (immediate) el.style.transition = 'none';
  el.style.width = `clamp(240px, ${width}vw, 520px)`;
  el.style.left = `${left}%`;
  el.style.top = `${top}%`;
  el.style.zIndex = String(rand(7, 15));
  el.style.transform = `rotate(${rot}deg) scale(${scale})`;
  el.style.filter = `saturate(${sat}%) contrast(1.07) brightness(${bright}%) hue-rotate(${hue}deg)`;
  el.style.boxShadow = `0 0 0 4px #000, 0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.55), 0 0 26px rgba(255,255,255,0.14)`;
  el.style.animationDelay = `${delay}s, ${delay}s`;
  if (immediate) requestAnimationFrame(() => { el.style.transition = ''; });
}

function seedEndingPhotos() {
  if (!endingPhotos) return;
  endingPhotos.innerHTML = '';
  if (endingBgPhoto) {
    endingBgPhoto.src = nextVictorySlide();
    endingBgPhoto.style.opacity = '0.34';
  }
  const count = Math.min(6, slideshowOrder.length);
  for (let i = 0; i < count; i++) {
    const img = document.createElement('img');
    img.className = 'ending-photo';
    img.alt = 'Souvenir de victoire';
    img.src = nextVictorySlide();
    endingPhotos.appendChild(img);
    positionEndingPhoto(img, true);
  }
}

function juggleEndingPhoto() {
  if (!endingPhotos) return;
  const photos = Array.from(endingPhotos.querySelectorAll('.ending-photo'));
  if (!photos.length) return;
  const el = photos[rand(0, photos.length - 1)];
  el.classList.add('swap-out');
  later(180, () => {
    el.src = nextVictorySlide();
    positionEndingPhoto(el);
    el.classList.remove('swap-out');
    el.classList.add('burst-in');
    later(480, () => el.classList.remove('burst-in'));
  });
  if (photos.length > 1) {
    const el2 = photos[rand(0, photos.length - 1)];
    if (el2 !== el) positionEndingPhoto(el2);
  }
}

function randomizeEndingMessage(initial = false) {
  if (!endingMessages || !endingMessages.length) return;
  endingMessages.forEach((msg, idx) => {
    const left = randomPercent(2, 66);
    const top = randomPercent(4, 74);
    const rot = rand(-18, 18);
    const scale = (92 + rand(0, 35)) / 100;
    const hue = rand(-24, 24);
    if (initial) msg.style.transition = 'none';
    msg.style.left = `${left}%`;
    msg.style.top = `${top}%`;
    msg.style.transform = `rotate(${rot}deg) scale(${scale})`;
    msg.style.filter = `hue-rotate(${hue}deg)`;
    msg.style.zIndex = String(18 + idx);
    if (initial) requestAnimationFrame(() => { msg.style.transition = ''; });
  });
}

function pulseEndingFlash() {
  if (!endingFlash) return;
  endingFlash.classList.remove('active');
  void endingFlash.offsetWidth;
  endingFlash.classList.add('active');
}

function spawnEndingExplosion() {
  if (!endingSlideshow) return;
  const boom = document.createElement('div');
  boom.className = 'ending-explosion';
  const size = rand(90, 240);
  boom.style.width = `${size}px`;
  boom.style.height = `${size}px`;
  boom.style.left = `${randomPercent(12, 88)}%`;
  boom.style.top = `${randomPercent(10, 78)}%`;
  endingSlideshow.appendChild(boom);
  pulseEndingFlash();
  later(900, () => boom.remove());
}

function spawnConfettiBurst(count = 18) {
  if (!endingSlideshow) return;
  const colors = ['#ff4d6d', '#ffd54a', '#72f1ff', '#ffffff', '#7dff7a', '#c497ff', '#ff8a00'];
  const origin = randomPercent(8, 92);
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${origin + randomPercent(-18, 18)}%`;
    piece.style.background = colors[rand(0, colors.length - 1)];
    piece.style.opacity = `${0.8 + Math.random() * 0.2}`;
    piece.style.animationDuration = `${1.3 + Math.random() * 1.8}s`;
    piece.style.animationDelay = `${Math.random() * 0.18}s`;
    piece.style.setProperty('--drift', `${rand(-220, 220)}px`);
    piece.style.setProperty('--spin', `${rand(360, 960)}deg`);
    endingSlideshow.appendChild(piece);
    later(3200, () => piece.remove());
  }
}

function stopVictorySequence() {
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }
  if (endingMessageTimer) {
    clearInterval(endingMessageTimer);
    endingMessageTimer = null;
  }
  if (endingExplosionTimer) {
    clearInterval(endingExplosionTimer);
    endingExplosionTimer = null;
  }
  if (endingConfettiTimer) {
    clearInterval(endingConfettiTimer);
    endingConfettiTimer = null;
  }
  if (endingPhotoJuggleTimer) {
    clearInterval(endingPhotoJuggleTimer);
    endingPhotoJuggleTimer = null;
  }
  clearEndingTimeouts();
  if (victoryBgm) {
    victoryBgm.pause();
    victoryBgm.currentTime = 0;
  }
  if (endingPhotos) endingPhotos.innerHTML = '';
  if (endingBgPhoto) endingBgPhoto.removeAttribute('src');
  if (endingTitleCard) endingTitleCard.classList.add('hidden');
  if (endingSlideshow) {
    endingSlideshow.querySelectorAll('.ending-explosion, .confetti-piece').forEach(el => el.remove());
    endingSlideshow.classList.add('hidden');
    endingSlideshow.setAttribute('aria-hidden', 'true');
  }
}

function startVictorySequence(title, line) {
  stopBattleMusic();
  state.winMode = true;
  slideshowOrder = shuffle(victorySlides);
  slideshowIndex = 0;
  if (endingTitle) endingTitle.textContent = title.replace('* ', '');
  if (endingHint) endingHint.textContent = `${line.replace(/^\*\s*/, '')} • Z pour recommencer`;
  if (endingMessages) {
    endingMessages.forEach(msg => msg.textContent = 'GG SALE PUCEAU');
    randomizeEndingMessage(true);
  }
  seedEndingPhotos();
  if (endingSlideshow) {
    endingSlideshow.classList.remove('hidden');
    endingSlideshow.setAttribute('aria-hidden', 'false');
  }
  const isGood = /Good ending/i.test(title);
  if (endingTitleCard) {
    if (isGood) endingTitleCard.classList.remove('hidden');
    else endingTitleCard.classList.add('hidden');
  }
  if (isGood) {
    later(2300, () => {
      if (endingTitleCard) endingTitleCard.classList.add('hidden');
    });
  }
  spawnConfettiBurst(28);
  spawnEndingExplosion();
  later(280, () => spawnConfettiBurst(18));
  slideshowTimer = setInterval(() => {
    if (endingBgPhoto) endingBgPhoto.src = nextVictorySlide();
  }, 3000);
  endingPhotoJuggleTimer = setInterval(() => {
    juggleEndingPhoto();
    if (Math.random() < 0.65) juggleEndingPhoto();
  }, 760);
  endingMessageTimer = setInterval(() => randomizeEndingMessage(), 720);
  endingExplosionTimer = setInterval(() => {
    spawnEndingExplosion();
    if (Math.random() < 0.55) spawnConfettiBurst(rand(12, 20));
  }, 1500);
  endingConfettiTimer = setInterval(() => spawnConfettiBurst(rand(12, 18)), 700);
  if (victoryBgm) {
    victoryBgm.volume = ENDING_BGM_VOLUME;
    victoryBgm.currentTime = 0;
    victoryBgm.play().catch(() => {});
  }
}

function setDialogue(lines, options = {}) {

  const message = Array.isArray(lines) ? lines.join('\n') : String(lines ?? '');
  state.turnText = [message];
  textFx.full = message;
  textFx.shown = '';
  textFx.elapsed = 0;
  textFx.duration = options.duration ?? TYPEWRITER_DURATION;
  textFx.active = true;
  state.pendingAfterText = options.after || null;
  state.pendingDelay = options.afterDelay ?? 0.1;
  renderText();
}

function renderText() {
  textBox.textContent = textFx.active ? textFx.shown : (textFx.full || state.turnText[0] || '');
}

function finishText(triggerAfter = false) {
  textFx.shown = textFx.full;
  textFx.elapsed = textFx.duration;
  textFx.active = false;
  renderText();
  if (triggerAfter && state.pendingAfterText) {
    const action = state.pendingAfterText;
    state.pendingAfterText = null;
    runPendingAction(action);
  }
}

function updateTypewriter(dt) {
  if (textFx.active) {
    textFx.elapsed += dt;
    const progress = clamp(textFx.elapsed / textFx.duration, 0, 1);
    const chars = Math.floor(textFx.full.length * progress);
    textFx.shown = textFx.full.slice(0, chars);
    renderText();
    if (progress >= 1) {
      textFx.active = false;
      renderText();
      if (state.pendingAfterText) {
        const action = state.pendingAfterText;
        const delay = state.pendingDelay || 0;
        state.pendingAfterText = null;
        if (delay > 0) {
          setTimeout(() => runPendingAction(action), delay * 1000);
        } else {
          runPendingAction(action);
        }
      }
    }
  }
}

function runPendingAction(action) {
  if (!action) return;
  if (typeof action === 'function') {
    action();
    return;
  }
  switch (action) {
    case 'startAttack':
      startAttack();
      break;
    case 'nextForm':
      nextForm();
      break;
    case 'startVictorySequence':
      beginEndingSequence();
      break;
  }
}

function setupForm() {
  const f = currentForm();
  state.enemyMaxHp = f.enemyMaxHp;
  state.enemyHp = f.enemyMaxHp;
  state.score = 0;
  state.spareReady = false;
  state.fightRouteChosen = false;
  state.menu = 'main';
  state.selected = 0;
  state.bullets = [];
  state.attackTimer = 0;
  state.attackTotal = 0;
  state.attackProfile = null;
  state.attackName = '';
  state.attackSpawnCarry = 0;
  state.scheduledSpawns = [];
  state.fightMini = null;
  enemySprite.src = f.sprite;
  formNameEl.textContent = f.name;
  updateHud();
  renderMenu();
  setDialogue(f.intro);
}

function updateHud() {
  playerHpText.textContent = `${Math.ceil(state.playerHp)}/${state.playerMaxHp}`;
  enemyHpText.textContent = `${Math.ceil(state.enemyHp)}/${state.enemyMaxHp}`;
  playerHpBar.style.width = `${(state.playerHp / state.playerMaxHp) * 100}%`;
  enemyHpBar.style.width = `${(state.enemyHp / state.enemyMaxHp) * 100}%`;
  coffeeText.textContent = `${state.coffees} restant(s)`;
  let route = 'Indécis';
  if (state.kills > 0 && state.spares === 0) route = 'Fight';
  else if (state.spares > 0 && state.kills === 0) route = 'Good';
  else if (state.kills > 0 || state.spares > 0) route = 'Mixte';
  routeText.textContent = route;
}

function renderActMenu() {
  const form = currentForm();
  const progress = Math.min(state.score, form.threshold);
  menuBox.innerHTML = `
    <div class="act-panel">
      <div class="act-header">
        <div class="act-help">${form.actHint.replace(/^\*\s*/, '')}</div>
        <div class="act-progress">Pacification ${progress}/${form.threshold}</div>
      </div>
      <div class="act-grid detailed">
        ${form.actOptions.map((o, i) => `
          <div class="act-card ${i===state.selected?'selected':''}">
            <div class="act-name">${o.name}</div>
            <div class="act-desc">${o.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function renderFightMiniNote() {
  const mini = state.fightMini;
  if (!mini) return '<div class="center-note">Prépare ta frappe.</div>';
  if (mini.type === 'slider') return '<div class="center-note">Frappe glissante • Z au centre</div>';
  if (mini.type === 'charge') return '<div class="center-note">Charge critique • Z dans la zone dorée</div>';
  return '<div class="center-note">Impact carré • Z quand le carré devient minuscule</div>';
}

function renderMenu() {
  if (state.ended) {
    const msg = state.winMode ? 'Victoire. Z pour revoir le cauchemar.' : 'Appuie sur Z pour recommencer.';
    menuBox.innerHTML = `<div class="center-note">${msg}</div>`;
    return;
  }
  if (state.attackTimer > 0) {
    const label = state.attackProfile?.label || 'Esquive';
    menuBox.innerHTML = `<div class="center-note">${label} • Esquive !</div>`;
    return;
  }
  if (state.fightMini) {
    menuBox.innerHTML = renderFightMiniNote();
    return;
  }
  if (state.menu === 'main') {
    const opts = ['FIGHT', 'ACT', 'ITEM', 'SPARE'];
    menuBox.innerHTML = `<div class="menu-grid">${opts.map((o, i) => `<div class="menu-item ${i===state.selected?'selected':''} ${i===3&&state.spareReady?'spare-ready':''}">${o}</div>`).join('')}</div>`;
  } else if (state.menu === 'act') {
    renderActMenu();
  } else if (state.menu === 'item') {
    const items = state.coffees > 0 ? [`Café froid x${state.coffees}`] : ['Plus de café froid'];
    menuBox.innerHTML = `<div class="act-grid"><div class="act-item selected">${items[0]}</div><div class="act-item">X pour retour</div></div>`;
  }
}

function attackSpawnRate(profile, progress) {
  return (profile.spawnBase + Math.min(profile.spawnRamp, progress * profile.spawnRamp * 1.15)) * 60 * GLOBAL_DIFFICULTY;
}

function startAttack() {
  const f = currentForm();
  state.attackName = f.attacks[rand(0, f.attacks.length - 1)];
  state.attackProfile = ATTACK_PROFILES[state.attackName] || { duration: 11.6, spawnBase: 0.1, spawnRamp: 0.1, label: 'Esquive' };
  state.attackTimer = state.attackProfile.duration;
  state.attackTotal = state.attackProfile.duration;
  state.attackSpawnCarry = 0;
  state.scheduledSpawns = [];
  state.bullets = [];
  state.soul.x = arena.width / 2;
  state.soul.y = arena.height / 2;
  renderMenu();
}

function startFightMini() {
  const type = ['slider', 'charge', 'target'][rand(0, 2)];
  if (type === 'slider') {
    state.fightMini = { type, pos: 0, dir: 1, speed: 180 * GLOBAL_DIFFICULTY };
    setDialogue('* Tu cales ta frappe sur une barre mouvante.');
  } else if (type === 'charge') {
    state.fightMini = { type, pos: 0, dir: 1, speed: 145 * GLOBAL_DIFFICULTY, targetA: 67, targetB: 84 };
    setDialogue('* Tu charges ton coup. Il faut lâcher ça au bon moment.');
  } else {
    state.fightMini = { type, progress: 0, dir: 1, speed: 1.2 * GLOBAL_DIFFICULTY };
    setDialogue('* Un carré d’impact se resserre. Tu n’as qu’un instant propre.');
  }
}

function handleActionMain(index) {
  if (index === 0) {
    startFightMini();
  } else if (index === 1) {
    state.menu = 'act';
    state.selected = 0;
    setDialogue(currentForm().actHint);
  } else if (index === 2) {
    state.menu = 'item';
    state.selected = 0;
  } else if (index === 3) {
    if (state.spareReady) {
      state.spares += 1;
      updateHud();
      setDialogue(currentForm().spareText, { after: 'nextForm' });
      return;
    } else {
      setDialogue("* Zerbib n'est pas encore prêt à te laisser partir.", { after: "startAttack" });
    }
  }
  renderMenu();
}

function handleAct(index) {
  const msg = currentForm().onAct(index, state);
  if (state.score >= currentForm().threshold && !state.spareReady) {
    state.spareReady = true;
    setDialogue(`* ${msg}
* Il se calme vraiment. Tu pourrais bientôt l'épargner.`, { after: 'startAttack' });
  } else {
    setDialogue(`* ${msg}`, { after: 'startAttack' });
  }
  state.menu = 'main';
  state.selected = 0;
  renderMenu();
}

function handleItem() {
  if (state.coffees > 0) {
    state.coffees -= 1;
    state.playerHp = clamp(state.playerHp + state.playerMaxHp * 0.75, 0, state.playerMaxHp);
    setDialogue('* Tu bois un café froid. Ta vie remonte et ton âme se recoiffe.', { after: 'startAttack' });
  } else {
    setDialogue('* Plus de café froid. Il ne reste que la dignité.', { after: 'startAttack' });
  }
  state.menu = 'main';
  state.selected = 0;
  updateHud();
  renderMenu();
}

function calculateFightDamage(mini) {
  if (!mini) return 10;
  if (mini.type === 'slider') {
    const dist = Math.abs(mini.pos - 50);
    return Math.max(8, Math.round(29 - dist / 2));
  }
  if (mini.type === 'charge') {
    const center = (mini.targetA + mini.targetB) / 2;
    const dist = Math.abs(mini.pos - center);
    if (mini.pos >= mini.targetA && mini.pos <= mini.targetB) return 30;
    return Math.max(8, Math.round(24 - dist / 3.2));
  }
  return Math.max(8, Math.round(10 + mini.progress * 22));
}

function confirmFight() {
  const dmg = calculateFightDamage(state.fightMini);
  state.enemyHp = clamp(state.enemyHp - dmg, 0, state.enemyMaxHp);
  state.fightRouteChosen = true;
  state.fightMini = null;
  updateHud();
  if (state.enemyHp <= 0) {
    state.kills += 1;
    updateHud();
    setDialogue(currentForm().fightText, { after: 'nextForm' });
  } else {
    setDialogue(`* Tu infliges ${dmg} dégâts. Zerbib encaisse, vexé mais vivant.`, { after: 'startAttack' });
  }
  renderMenu();
}

function nextForm() {
  state.formIndex += 1;
  if (state.formIndex >= forms.length) {
    endGame();
    return;
  }
  setupForm();
}

function endGame() {
  state.ended = true;
  try {
    localStorage.setItem('hallilaa.completed.zerbiboss', '1');
  } catch (e) {}
  let title = '* Fin mixte.';
  let line = '* Le Zerbib te regarde, perplexe, comme un buffet mal refermé.';
  if (state.spares === forms.length) {
    title = '* Good ending.';
    line = "* T'as capté l'ambiance. Viens manger.";
  } else if (state.kills === forms.length) {
    title = '* Fight ending.';
    line = "* Tu voulais du calme. Tu l'as eu, et c'est presque trop.";
  }
  state.endingTitle = title;
  state.endingLine = line;
  renderMenu();
  setDialogue(`${title}
${line}`, { after: 'startVictorySequence' });
}

function beginEndingSequence() {
  startVictorySequence(state.endingTitle || '* Fin.', state.endingLine || '* Le Zerbib gagne encore.');
}

function restartGame() {
  stopVictorySequence();
  state.formIndex = 0;
  state.playerHp = 100;
  state.coffees = 5;
  state.kills = 0;
  state.spares = 0;
  state.ended = false;
  state.winMode = false;
  state.invuln = 0;
  state.pendingAfterText = null;
  setupForm();
  if (userWantedMusic && musicStarted) startMusic();
  else updateMusicButton();
}

function circleBullet(x, y, vx, vy, r, extra = {}) {
  state.bullets.push({ shape: 'circle', x, y, vx, vy, r, ...extra });
}
function rectBullet(x, y, w, h, vx, vy, extra = {}) {
  state.bullets.push({ shape: 'rect', x, y, w, h, vx, vy, ...extra });
}
function spriteRectBullet(x, y, w, h, vx, vy, spriteType, extra = {}) {
  state.bullets.push({ shape: 'rect', x, y, w, h, vx, vy, spriteType, ...extra });
}
function diamondBullet(x, y, vx, vy, size, extra = {}) {
  state.bullets.push({ shape: 'diamond', x, y, vx, vy, size, ...extra });
}
function ringBullet(x, y, vr, outer, width, extra = {}) {
  state.bullets.push({ shape: 'ring', x, y, vx: 0, vy: 0, vr, outer, inner: Math.max(0, outer - width), width, ...extra });
}
function mineBullet(x, y, fuse = 0.75) {
  state.bullets.push({ shape: 'mine', x, y, vx: 0, vy: 0, r: 9, fuse });
}
function textBullet(x, y, w, h, vx, vy, label, extra = {}) {
  state.bullets.push({ shape: 'text', x, y, w, h, vx, vy, label, ...extra });
}

function scheduleSpawn(delay, fn) {
  state.scheduledSpawns.push({ delay, fn });
}

function updateScheduledSpawns(dt) {
  for (const event of state.scheduledSpawns) event.delay -= dt;
  const ready = state.scheduledSpawns.filter(event => event.delay <= 0);
  state.scheduledSpawns = state.scheduledSpawns.filter(event => event.delay > 0);
  for (const event of ready) event.fn();
}

function spawnCrossExplosion(x, y) {
  ringBullet(x, y, 65, 6, 8, { ttl: 0.55 });
  rectBullet(x - 8, y - 70, 16, 140, 0, 0, { ttl: 0.25 });
  rectBullet(x - 70, y - 8, 140, 16, 0, 0, { ttl: 0.25 });
}

function spawnFireworkBurst(x, y) {
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI * 2 * i) / 10;
    const speed = 105 + (i % 2) * 30;
    if (i % 2 === 0) diamondBullet(x, y, Math.cos(a) * speed, Math.sin(a) * speed, 7);
    else rectBullet(x - 4, y - 4, 8, 8, Math.cos(a) * speed, Math.sin(a) * speed);
  }
}

function warningRingBurst(x, y, delay = 0.42, expandSpeed = 70, startOuter = 6, width = 8, extra = {}) {
  ringBullet(x, y, 0, startOuter, 1, { ttl: delay, fake: true, ghost: true, warning: true });
  scheduleSpawn(delay, () => ringBullet(x, y, expandSpeed, startOuter, width, extra));
}

function warningRectSpawn(x, y, w, h, delay, vx, vy, extra = {}) {
  rectBullet(x, y, w, h, 0, 0, { ttl: delay, fake: true, ghost: true, warning: true });
  scheduleSpawn(delay, () => rectBullet(x, y, w, h, vx, vy, extra));
}

function warningTextSpawn(x, y, w, h, delay, vx, vy, label, extra = {}) {
  textBullet(x, y, w, h, 0, 0, label, { ttl: delay, fake: true, ghost: true, warning: true });
  scheduleSpawn(delay, () => textBullet(x, y, w, h, vx, vy, label, extra));
}

function spawnGapWalls(vertical = true, speed = 140, gapMin = 85, gapMax = 110, thickness = 24) {
  const W = arena.width, H = arena.height;
  if (vertical) {
    const gapH = rand(gapMin, gapMax);
    const gapY = rand(28, H - gapH - 28);
    rectBullet(-thickness - 8, 0, thickness, gapY, speed, 0);
    rectBullet(-thickness - 8, gapY + gapH, thickness, H - (gapY + gapH), speed, 0);
  } else {
    const gapW = rand(gapMin, gapMax + 15);
    const gapX = rand(28, W - gapW - 28);
    rectBullet(0, -thickness - 8, gapX, thickness, 0, speed);
    rectBullet(gapX + gapW, -thickness - 8, W - (gapX + gapW), thickness, 0, speed);
  }
}

function warningGapWalls(vertical = true, delay = 0.38, speed = 140, gapMin = 85, gapMax = 110, thickness = 24) {
  const W = arena.width, H = arena.height;
  if (vertical) {
    const gapH = rand(gapMin, gapMax);
    const gapY = rand(28, H - gapH - 28);
    rectBullet(-thickness - 8, 0, thickness, gapY, 0, 0, { ttl: delay, fake: true, ghost: true, warning: true });
    rectBullet(-thickness - 8, gapY + gapH, thickness, H - (gapY + gapH), 0, 0, { ttl: delay, fake: true, ghost: true, warning: true });
    scheduleSpawn(delay, () => {
      rectBullet(-thickness - 8, 0, thickness, gapY, speed, 0);
      rectBullet(-thickness - 8, gapY + gapH, thickness, H - (gapY + gapH), speed, 0);
    });
  } else {
    const gapW = rand(gapMin, gapMax + 15);
    const gapX = rand(28, W - gapW - 28);
    rectBullet(0, -thickness - 8, gapX, thickness, 0, 0, { ttl: delay, fake: true, ghost: true, warning: true });
    rectBullet(gapX + gapW, -thickness - 8, W - (gapX + gapW), thickness, 0, 0, { ttl: delay, fake: true, ghost: true, warning: true });
    scheduleSpawn(delay, () => {
      rectBullet(0, -thickness - 8, gapX, thickness, 0, speed);
      rectBullet(gapX + gapW, -thickness - 8, W - (gapX + gapW), thickness, 0, speed);
    });
  }
}

function spawnBullet(type) {
  const W = arena.width, H = arena.height;
  switch (type) {
    case 'rain': {
      const count = Math.random() < 0.45 ? 2 : 1;
      for (let n = 0; n < count; n++) {
        const x = rand(18, W - 18);
        const vx = rand(-18, 18);
        const vy = rand(100, 150);
        if (Math.random() < 0.6) textBullet(x - 10, -26 - n * 12, 22, 12, vx, vy, ['π', '∑', 'Δ', 'Ω', '∫'][rand(0, 4)]);
        else circleBullet(x, -10 - n * 8, vx, vy, rand(4, 5));
      }
      break;
    }
    case 'laser': {
      const y = rand(22, H - 30);
      warningRectSpawn(-58, y, 54, 8, 0.36, rand(205, 240), 0);
      break;
    }
    case 'orbit':
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5 + state.clock * 0.35;
        diamondBullet(W / 2, H / 2, Math.cos(a) * 82, Math.sin(a) * 82, 7);
      }
      break;
    case 'quiz': {
      const lanes = [55, 110, 165, 220];
      const y = lanes[rand(0, lanes.length - 1)] - 14;
      warningTextSpawn(-34, y, 28, 28, 0.34, rand(85, 125), 0, '?', { bounceX: true });
      break;
    }
    case 'confetti':
      if (Math.random() < 0.5) diamondBullet(rand(16, W - 16), -10, rand(-40, 40), rand(90, 130), rand(5, 8));
      else rectBullet(rand(16, W - 16), -10, rand(6, 9), rand(6, 9), rand(-35, 35), rand(95, 135));
      break;
    case 'balloons': {
      const x = rand(28, W - 28);
      circleBullet(x, H + 14, rand(-10, 10), -rand(60, 85), rand(10, 14));
      break;
    }
    case 'fireworks': {
      const x = rand(70, W - 70);
      const y = rand(50, H - 65);
      ringBullet(x, y, 0, 18, 1, { ttl: 0.42, fake: true, ghost: true, warning: true });
      scheduleSpawn(0.42, () => spawnFireworkBurst(x, y));
      break;
    }
    case 'candles': {
      const x = rand(65, W - 65), y = rand(48, H - 48);
      ringBullet(x, y, 0, 12, 1, { ttl: 0.30, fake: true, ghost: true, warning: true });
      scheduleSpawn(0.30, () => mineBullet(x, y, rand(60, 90) / 100));
      break;
    }
    case 'sugar':
      circleBullet(rand(12, W - 12), -8, rand(-15, 15), rand(62, 98), rand(5, 7), { wiggle: rand(0, 1) ? 1 : -1, age: 0 });
      break;
    case 'mirage':
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI * 2 * i) / 4 + state.clock;
        diamondBullet(W / 2, H / 2, Math.cos(a) * 90, Math.sin(a) * 90, 8);
        circleBullet(W / 2, H / 2, Math.cos(a + 0.45) * 78, Math.sin(a + 0.45) * 78, 8, { fake: true, ghost: true });
      }
      break;
    case 'spiral':
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8 + state.clock * 1.45;
        diamondBullet(W / 2, H / 2, Math.cos(a) * 82, Math.sin(a) * 82, 6);
      }
      if (Math.random() < 0.4) warningRingBurst(rand(75, W - 75), rand(60, H - 60), 0.35, 62, 8, 7, { ttl: 0.55 });
      break;
    case 'proverb': {
      const words = ['SIROP', 'SEMOULE', 'MOELLEUX', 'GLAÇAGE'];
      const fromLeft = Math.random() < 0.5;
      textBullet(fromLeft ? -90 : W + 10, rand(25, H - 35), 78, 20, fromLeft ? 95 : -95, 0, words[rand(0, words.length - 1)]);
      break;
    }
    case 'siren': {
      const alarmX = W / 2 - 28;
      const alarmY = 4;
      spriteRectBullet(alarmX, alarmY, 56, 34, 0, 0, 'alarm', {
        ttl: 0.42,
        fake: true,
        ghost: true,
        warning: true,
        frameBase: 0,
        frameCount: 10,
        animRate: 0.055,
        anchor: 'single-siren'
      });
      const laneCount = 4;
      const laneWidth = Math.floor(W / laneCount);
      const safeLane = rand(0, laneCount - 1);
      for (let lane = 0; lane < laneCount; lane++) {
        if (lane === safeLane) continue;
        const beamX = lane * laneWidth + 10;
        const beamW = laneWidth - 20;
        warningRectSpawn(beamX, 42, beamW, H - 54, 2.0, 0, 0, { ttl: 0.18, glow: true });
      }
      break;
    }
    case 'dash': {
      const laneYs = [28, 82, 136, 190];
      const y = laneYs[rand(0, laneYs.length - 1)];
      const fromLeft = Math.random() < 0.5;
      const startX = fromLeft ? -64 : W + 10;
      const speed = fromLeft ? 185 : -185;
      warningRectSpawn(startX, y, 60, 24, 0.55, speed, 0);
      break;
    }
    case 'tickets': {
      const lanes = [48, 104, 160, 216];
      const y = lanes[rand(0, lanes.length - 1)];
      const fromLeft = Math.random() < 0.5;
      const frameBase = fromLeft ? 6 : 0;
      const startX = fromLeft ? -140 : W + 46;
      const speed = fromLeft ? rand(110, 145) : -rand(110, 145);
      const telegraphX = fromLeft ? 0 : W - 96;
      rectBullet(telegraphX, y + 2, 96, 30, 0, 0, { ttl: 1.60, fake: true, ghost: true, warning: true, glow: true });
      scheduleSpawn(1.60, () => spriteRectBullet(startX, y, 94, 34, speed, 0, 'police', {
        frameBase,
        frameCount: 6,
        animRate: 0.08
      }));
      break;
    }
    case 'barrage':
      warningGapWalls(false, 0.62, 84, 170, 195, 14);
      break;
    case 'alarm': {
      const fromLeft = Math.random() < 0.5;
      const x = fromLeft ? 8 : W - 64;
      const y = rand(34, H - 70);
      spriteRectBullet(x, y, 56, 34, 0, 0, 'alarm', {
        ttl: 0.40,
        fake: true,
        ghost: true,
        warning: true,
        frameBase: 0,
        frameCount: 10,
        animRate: 0.055,
        anchor: 'side-siren'
      });
      const rowCount = 4;
      const rowHeight = Math.floor(H / rowCount);
      const safeRow = rand(0, rowCount - 1);
      for (let row = 0; row < rowCount; row++) {
        if (row === safeRow) continue;
        const beamY = row * rowHeight + 10;
        warningRectSpawn(fromLeft ? 62 : 0, beamY, W - 62, rowHeight - 20, 2.0, 0, 0, { ttl: 0.18, glow: true });
      }
      break;
    }
    case 'mix':
      spawnBullet(['rain', 'star', 'tickets', 'fireworks', 'siren'][rand(0, 4)]);
      break;
    case 'star':
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        const speed = i % 2 === 0 ? 108 : 72;
        if (i % 2 === 0) diamondBullet(W / 2, H / 2, Math.cos(a) * speed, Math.sin(a) * speed, 6);
        else circleBullet(W / 2, H / 2, Math.cos(a) * speed, Math.sin(a) * speed, 6);
      }
      break;
    case 'grid': {
      if (Math.random() < 0.5) {
        const x = rand(0, 4) * 100 + 50;
        rectBullet(x, -15, 16, H + 30, 0, 0, { ttl: 0.30, fake: true, ghost: true, warning: true });
        scheduleSpawn(0.30, () => rectBullet(x, -15, 12, H + 30, 0, 0, { ttl: 0.30 }));
      } else {
        const y = rand(0, 3) * 60 + 50;
        rectBullet(-15, y, W + 30, 16, 0, 0, { ttl: 0.30, fake: true, ghost: true, warning: true });
        scheduleSpawn(0.30, () => rectBullet(-15, y, W + 30, 12, 0, 0, { ttl: 0.30 }));
      }
      break;
    }
    case 'blur': {
      if (Math.random() < 0.5) circleBullet(rand(14, W - 14), rand(18, H - 18), rand(-75, 75), rand(-75, 75), rand(5, 7), { fake: true, ghost: true });
      else warningRingBurst(rand(70, W - 70), rand(55, H - 55), 0.36, 58, 6, 7, { ttl: 0.70 });
      break;
    }
    default:
      circleBullet(rand(10, W - 10), rand(10, H - 10), rand(-120, 120), rand(-120, 120), rand(5, 8));
      break;
  }
}

function updateFightMini(dt) {
  const mini = state.fightMini;
  if (!mini) return;
  if (mini.type === 'slider' || mini.type === 'charge') {
    mini.pos += mini.dir * mini.speed * dt;
    if (mini.pos >= 100) { mini.pos = 100; mini.dir = -1; }
    if (mini.pos <= 0) { mini.pos = 0; mini.dir = 1; }
  } else if (mini.type === 'target') {
    mini.progress += mini.dir * mini.speed * dt;
    if (mini.progress >= 1) { mini.progress = 1; mini.dir = -1; }
    if (mini.progress <= 0) { mini.progress = 0; mini.dir = 1; }
  }
}

function updateBullet(b, dt) {
  if (b.age == null) b.age = 0;
  if (b.frameClock == null) b.frameClock = 0;
  b.age += dt;
  b.frameClock += dt;
  if (b.shape === 'mine') {
    b.fuse -= dt;
    if (b.fuse <= 0) {
      b.dead = true;
      spawnCrossExplosion(b.x, b.y);
    }
    return;
  }
  if (b.shape === 'ring') {
    b.outer += b.vr * dt;
    b.inner = Math.max(0, b.outer - b.width);
    if (b.ttl != null) {
      b.ttl -= dt;
      if (b.ttl <= 0) b.dead = true;
    }
    return;
  }
  b.x += (b.vx || 0) * dt;
  b.y += (b.vy || 0) * dt;
  if (b.wiggle) b.x += Math.sin(b.age * 8) * 22 * dt * b.wiggle;
  if (b.bounceX) {
    const hw = b.w ? b.w / 2 : (b.r || b.size || 8);
    if (b.x - hw < 0 || b.x + hw > arena.width) b.vx *= -1;
  }
  if (b.bounceY) {
    const hh = b.h ? b.h / 2 : (b.r || b.size || 8);
    if (b.y - hh < 0 || b.y + hh > arena.height) b.vy *= -1;
  }
  if (b.ttl != null) {
    b.ttl -= dt;
    if (b.ttl <= 0) b.dead = true;
  }
}

function bulletOffscreen(b) {
  if (b.dead) return true;
  if (b.shape === 'ring') return b.outer > Math.max(arena.width, arena.height) + 80;
  const pad = 60;
  const w = b.w || (b.r || b.size || 10) * 2;
  const h = b.h || (b.r || b.size || 10) * 2;
  return b.x < -pad - w || b.x > arena.width + pad + w || b.y < -pad - h || b.y > arena.height + pad + h;
}

function circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
  const testX = clamp(cx, rx, rx + rw);
  const testY = clamp(cy, ry, ry + rh);
  const dx = cx - testX;
  const dy = cy - testY;
  return dx * dx + dy * dy <= cr * cr;
}

function bulletHitsSoul(b) {
  if (b.fake) return false;
  const sx = state.soul.x;
  const sy = state.soul.y;
  const sr = state.soul.r;
  if (b.shape === 'circle' || b.shape === 'mine') return Math.hypot(b.x - sx, b.y - sy) < b.r + sr;
  if (b.shape === 'diamond') return Math.abs(b.x - sx) + Math.abs(b.y - sy) < b.size + sr;
  if (b.shape === 'ring') {
    const d = Math.hypot(b.x - sx, b.y - sy);
    return d <= b.outer + sr && d >= Math.max(0, b.inner - sr);
  }
  if (b.shape === 'rect' || b.shape === 'text') return circleRectCollision(sx, sy, sr, b.x, b.y, b.w, b.h);
  return false;
}

function updateAttack(dt) {
  state.attackTimer -= dt;
  const profile = state.attackProfile || ATTACK_PROFILES[state.attackName];
  const progress = state.attackTotal > 0 ? 1 - (state.attackTimer / state.attackTotal) : 0;
  const ratePerSecond = attackSpawnRate(profile, progress);
  const interval = 1 / Math.max(1, ratePerSecond);
  state.attackSpawnCarry += dt;
  updateScheduledSpawns(dt);
  while (state.attackSpawnCarry >= interval) {
    spawnBullet(state.attackName);
    state.attackSpawnCarry -= interval;
  }

  const sp = state.soul.speed * dt;
  if (keys['ArrowLeft']) state.soul.x -= sp;
  if (keys['ArrowRight']) state.soul.x += sp;
  if (keys['ArrowUp']) state.soul.y -= sp;
  if (keys['ArrowDown']) state.soul.y += sp;
  state.soul.x = clamp(state.soul.x, state.soul.r, arena.width - state.soul.r);
  state.soul.y = clamp(state.soul.y, state.soul.r, arena.height - state.soul.r);

  for (const b of state.bullets) updateBullet(b, dt);
  state.bullets = state.bullets.filter(b => !bulletOffscreen(b));
  if (state.invuln > 0) state.invuln = Math.max(0, state.invuln - dt);
  for (const b of state.bullets) {
    if (state.invuln > 0) break;
    if (bulletHitsSoul(b)) {
      state.playerHp = clamp(state.playerHp - 8, 0, state.playerMaxHp);
      state.invuln = 0.75;
      updateHud();
      if (state.playerHp <= 0) {
        state.ended = true;
        renderMenu();
        setDialogue("* Tu t'effondres sous la pression du Zerbib.", { duration: TYPEWRITER_DURATION });
      }
      break;
    }
  }
  if (state.attackTimer <= 0 && !state.ended) {
    state.attackTimer = 0;
    state.menu = 'main';
    state.selected = 0;
    renderMenu();
    setDialogue('* À toi de jouer.');
  }
}

function drawSoul(x, y, fillStyle) {
  ctx.fillStyle = fillStyle;
  const px = x, py = y;
  ctx.beginPath();
  ctx.moveTo(px, py + 10);
  ctx.lineTo(px - 13, py - 2);
  ctx.lineTo(px - 10, py - 10);
  ctx.lineTo(px - 4, py - 10);
  ctx.lineTo(px, py - 4);
  ctx.lineTo(px + 4, py - 10);
  ctx.lineTo(px + 10, py - 10);
  ctx.lineTo(px + 13, py - 2);
  ctx.closePath();
  ctx.fill();
}

function drawDiamond(x, y, size, fill = true) {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  if (fill) ctx.fill(); else ctx.stroke();
}

function drawBullet(b) {
  if (b.glow) {
    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#d9f8ff';
  }
  if (b.ghost) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = '#fff';
  } else {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#fff';
  }
  switch (b.shape) {
    case 'circle':
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); b.ghost ? ctx.stroke() : ctx.fill();
      break;
    case 'diamond':
      drawDiamond(b.x, b.y, b.size, !b.ghost);
      break;
    case 'rect':
      if (b.spriteType === 'alarm') {
        const frames = spriteAssets.alarm;
        const frameCount = b.frameCount || frames.length;
        const frameIndex = (b.frameBase || 0) + (Math.floor((b.frameClock || 0) / (b.animRate || 0.09)) % frameCount);
        const img = frames[frameIndex];
        if (img && img.complete) ctx.drawImage(img, b.x - 10, b.y - 10, b.w + 20, b.h + 20);
        else b.ghost ? ctx.strokeRect(b.x, b.y, b.w, b.h) : ctx.fillRect(b.x, b.y, b.w, b.h);
      } else if (b.spriteType === 'police') {
        const frames = spriteAssets.police;
        const frameCount = b.frameCount || frames.length;
        const frameIndex = (b.frameBase || 0) + (Math.floor((b.frameClock || 0) / (b.animRate || 0.12)) % frameCount);
        const img = frames[frameIndex];
        if (img && img.complete) ctx.drawImage(img, b.x - 18, b.y - 14, b.w + 36, b.h + 28);
        else b.ghost ? ctx.strokeRect(b.x, b.y, b.w, b.h) : ctx.fillRect(b.x, b.y, b.w, b.h);
      } else {
        b.ghost ? ctx.strokeRect(b.x, b.y, b.w, b.h) : ctx.fillRect(b.x, b.y, b.w, b.h);
      }
      break;
    case 'ring':
      ctx.lineWidth = b.warning ? 1 : Math.max(2, b.width);
      ctx.beginPath(); ctx.arc(b.x, b.y, b.outer, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1;
      break;
    case 'mine':
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(b.x - 2, b.y - b.r - 6, 4, 6);
      break;
    case 'text':
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px Courier New';
      ctx.fillText(b.label || '!', b.x + 6, b.y + 14);
      ctx.fillStyle = '#fff';
      break;
  }
  if (b.ghost) ctx.restore();
  if (b.glow) ctx.restore();
}

function drawFightMini() {
  const mini = state.fightMini;
  ctx.strokeStyle = '#fff';
  ctx.strokeRect(80, 80, 360, 90);
  if (mini.type === 'slider') {
    ctx.fillStyle = '#222';
    ctx.fillRect(80, 110, 360, 30);
    ctx.fillStyle = '#ffb000';
    ctx.fillRect(240, 110, 40, 30);
    ctx.fillStyle = '#fff';
    ctx.fillRect(80 + mini.pos * 3.6, 100, 8, 50);
  } else if (mini.type === 'charge') {
    ctx.fillStyle = '#222';
    ctx.fillRect(110, 108, 300, 34);
    ctx.fillStyle = '#6a5320';
    ctx.fillRect(110 + mini.targetA * 3, 108, (mini.targetB - mini.targetA) * 3, 34);
    ctx.fillStyle = '#fff';
    ctx.fillRect(110 + mini.pos * 3, 98, 10, 54);
  } else {
    const size = 16 + (1 - mini.progress) * 86;
    ctx.strokeStyle = '#777';
    ctx.strokeRect(170, 95, 180, 60);
    ctx.strokeStyle = '#ffb000';
    ctx.strokeRect(260 - size / 2, 125 - size / 2, size, size);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(245, 110, 30, 30);
  }
}

function draw() {
  ctx.clearRect(0, 0, arena.width, arena.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, arena.width, arena.height);
  if (state.attackTimer > 0) {
    ctx.strokeStyle = '#777';
    for (let i = 0; i < 5; i++) ctx.strokeRect(20 + i*8, 20 + i*4, arena.width - 40 - i*16, arena.height - 40 - i*8);
    if (state.attackName === 'fireworks' || state.attackName === 'blur') {
      const alpha = state.attackName === 'blur' ? 0.08 : (Math.floor(state.clock / 0.14) % 2 === 0 ? 0.10 : 0.02);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(0, 0, arena.width, arena.height);
    }
    for (const b of state.bullets) drawBullet(b);
    const flicker = state.invuln > 0;
    const visible = !flicker || Math.floor(state.clock / 0.07) % 2 === 0;
    if (visible) {
      if (flicker) {
        ctx.save();
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#fff';
        drawSoul(state.soul.x, state.soul.y, Math.floor(state.clock / 0.12) % 2 === 0 ? '#fff' : '#ff2b5b');
        ctx.restore();
      } else {
        drawSoul(state.soul.x, state.soul.y, '#ff2b5b');
      }
    }
  } else if (state.fightMini) {
    drawFightMini();
  } else {
    ctx.strokeStyle = '#555';
    ctx.strokeRect(40, 30, arena.width - 80, arena.height - 60);
    ctx.fillStyle = '#ddd';
    ctx.font = '24px Courier New';
    ctx.fillText('Zone de combat', 170, 125);
    ctx.font = '14px Courier New';
    ctx.fillText('Nouveaux patterns: carrés, murs, anneaux, bombes, mots.', 72, 155);
  }
}

function update(dt) {
  state.clock += dt;
  updateTypewriter(dt);
  if (state.attackTimer > 0 && !state.ended) updateAttack(dt);
  if (state.fightMini && !state.ended) updateFightMini(dt);
}

function gameLoop(ts) {
  if (!lastTime) lastTime = ts;
  let frame = Math.min(MAX_FRAME, (ts - lastTime) / 1000 || 0);
  lastTime = ts;
  accumulator += frame;
  while (accumulator >= FIXED_DT) {
    update(FIXED_DT);
    accumulator -= FIXED_DT;
  }
  draw();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
  if (!musicStarted && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','z','Z','x','X'].includes(e.key) && userWantedMusic) startMusic();
  keys[e.key] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','z','Z','x','X'].includes(e.key)) e.preventDefault();
  if (state.ended && (e.key === 'z' || e.key === 'Z')) { restartGame(); return; }
  if (state.ended) return;
  if (textFx.active) {
    if (e.key === 'z' || e.key === 'Z') finishText(true);
    return;
  }
  if (state.attackTimer > 0) return;
  if (state.fightMini) {
    if (e.key === 'z' || e.key === 'Z') confirmFight();
    return;
  }
  if (state.menu === 'main') {
    if (e.key === 'ArrowLeft') state.selected = (state.selected + 3) % 4;
    if (e.key === 'ArrowRight') state.selected = (state.selected + 1) % 4;
    if (e.key === 'z' || e.key === 'Z') handleActionMain(state.selected);
  } else if (state.menu === 'act') {
    if (e.key === 'ArrowLeft' && state.selected % 2 === 1) state.selected -= 1;
    if (e.key === 'ArrowRight' && state.selected % 2 === 0) state.selected += 1;
    if (e.key === 'ArrowUp' && state.selected > 1) state.selected -= 2;
    if (e.key === 'ArrowDown' && state.selected < 2) state.selected += 2;
    if (e.key === 'z' || e.key === 'Z') handleAct(state.selected);
    if (e.key === 'x' || e.key === 'X') {
      state.menu = 'main';
      state.selected = 0;
      renderMenu();
      setDialogue('* À toi de jouer.');
      return;
    }
  } else if (state.menu === 'item') {
    if (e.key === 'z' || e.key === 'Z') handleItem();
    if (e.key === 'x' || e.key === 'X') {
      state.menu = 'main';
      state.selected = 0;
      renderMenu();
      setDialogue('* À toi de jouer.');
      return;
    }
  }
  renderMenu();
});
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

if (musicToggle) musicToggle.addEventListener('click', toggleMusic);
setupForm();
updateMusicButton();
requestAnimationFrame(gameLoop);
