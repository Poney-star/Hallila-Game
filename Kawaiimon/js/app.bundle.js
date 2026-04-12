/* data.js */
const APP_TITLE = "Kawaiimon";

const FIXED_PLAYER_TEAM = ["millie", "nala", "snoopy"];

const TRAINER_ART = {
  hari: { code: "H1", tint: "#ff5fae", image: "./assets/trainers/hari.png" },
  seraphine: { code: "H2", tint: "#c85bff", image: "./assets/trainers/seraphine.png" },
  tristina: { code: "H3", tint: "#ff7a8f", image: "./assets/trainers/tristina.png" },
  magnus: { code: "B0", tint: "#7d2a91" },
};

const WORLD = {
  width: 1280,
  height: 620,
  bounds: { minX: 110, minY: 160, maxX: 1170, maxY: 560 },
  spawn: { x: 640, y: 535 },
  healSpot: { x: 640, y: 355, radius: 42 },
  startSpot: { x: 640, y: 535, radius: 34 },
  trainers: [
    { id: "hari", x: 265, y: 345, radius: 58 },
    { id: "seraphine", x: 1015, y: 345, radius: 58 },
    { id: "tristina", x: 1045, y: 515, radius: 58 },
    { id: "magnus", x: 640, y: 175, radius: 66, boss: true },
  ],
};

const MOVES = {
  //Nala
  feuroce: { name: "Feuroce", type: "Feu", power: 18, accuracy: 0.95, effect: { debuffAttack: 1, chance: 0.35 }, text: "Une onde brûlante qui intimide la cible." },
  magmattack: { name: "Magmattack", type: "Feu", power: 26, accuracy: 0.9, text: "Nala fonce dans un panache de braises." },
  tempeteAntonienne: { name: "Tempête Antonienne", type: "Feu", power: 34, accuracy: 0.82, effect: { recoil: 6 }, text: "Une énorme explosion dramatique." },
  sterilRez: { name: "Sterilrez", type: "Feu", power: 0, effect: { heal: 24, buffDefense: 1 }, text: "Nala se renforce et regagne des PV." },
  //Snoopy
  galichage: { name: "Galichage", type: "Eau", power: 24, accuracy: 0.92, effect: { buffSpeed: 1 }, text: "Snoopy embrasse goulument son adversaire" },
  ronflement: { name: "Ronflement", type: "Normal", power: 0, effect: { heal: 35 }, text: "Une sieste éclair qui rend des PV." },
  exciterre: { name: "Exciterre", type: "Sol", power: 30, accuracy: 0.88, text: "Le sol tremble sous l'excès de jouissance." },
  attackaboul: { name: "Attack'a'boul", type: "Sol", power: 16, accuracy: 0.95, text: "Snoopy fourre son unique boule dans la bouche de l'adversaire." },
  //Abdelkrim
  camouflage: { name: "Camouflage", type: "Eau", power: 0, effect: { dodgeNext: true, buffSpeed: 1 }, text: "L'utilisateur esquive la prochaine attaque." },
  agripage: { name: "Agripage", type: "Combat", power: 20, accuracy: 0.95, effect: { debuffSpeed: 1, chance: 0.25 }, text: "Une saisie pénible qui casse le rythme." },
  renforcementCaudal: { name: "Renforcement Caudal", type: "Normal", power: 0, effect: { buffAttack: 1, buffDefense: 1 }, text: "La queue repousse, plus solide que jamais." },
  albineau: { name: "Albineau", type: "Eau", power: 20, accuracy: 0.96, effect: { priority: 1, buffSpeed: 1 }, text: "Un jet d'eau ultra rapide." },
  //Millie
  caressemoi: { name: "Caresse-moi", type: "Normal", power: 0, accuracy: 0.96, effect: { status: "paralyze", chance: 0.3 }, text: "L'adversaire est absorbé par le poil soyeux de cette chienne." },
  alopek: { name: "Alopek", type: "Acier", power: 0, effect: { buffAttack: 1, buffSpeed: 1, debuffDefenseSelf: 1 }, text: "Perd ses poils pour plus de vivacité." },
  morsure: { name: "Morsure", type: "Ténèbres", power: 24, accuracy: 0.92, text: "Une morsure alléchante." },
  coussinacier: { name: "Coussinacier", type: "Acier", power: 35, accuracy: 1, text: "Waf waf." },
  
  chantMarin: { name: "Chant Marin", type: "Psy", power: 16, accuracy: 0.96, effect: { status: "confuse", chance: 0.35 }, text: "Une mélodie hypnotique venue des profondeurs." },
  eauQuiMouille: { name: "Eau qui mouille", type: "Eau", power: 22, accuracy: 1, text: "Basique, mais efficace." },
  coupFoudre: { name: "Coup de Foudre", type: "Psy", power: 24, accuracy: 0.9, effect: { status: "paralyze", chance: 0.25 }, text: "Un regard intense qui fige la cible." },
  totalementCrazy: { name: "Totalement Crazy", type: "Psy", power: 20, accuracy: 0.93, effect: { status: "confuse", chance: 0.45 }, text: "L'adversaire ne comprend plus rien." },

  //Lapiteub
  queueDeFer: { name: "Queue de fer", type: "Acier", power: 24, accuracy: 0.92, text: "Une bifle d'acier ultra raide." },
  croutesDeNathan: { name: "Croûtes de Nathan", type: "Poison", power: 16, accuracy: 0.95, effect: { status: "poison", chance: 0.55 }, text: "L'adversaire regrette immédiatement d'avoir touché Lapiteub." },
  coupDeQueue: { name: "Coup de queue", type: "Combat", power: 22, accuracy: 0.95, text: "Simple, direct, gênant." },
  biflEclair: { name: "Bifl'Eclair", type: "Normal", power: 30, accuracy: 0.86, effect: { buffSpeed: 1 }, text: "Un choc brutal qui arrache les yeux." },

  //Arketron
  chiasseSupersonique: { name: "Chiasse Supersonique", type: "Vol", power: 22, accuracy: 0.96, text: "L'attaque préférée de Isaac." },
  typhonDeChiasse: { name: "Typhon De Chiasse", type: "Vol", power: 0, accuracy: 0.9, effect: { status: "confuse", chance: 0.45 }, text: "Ça tourne, ça colle, ça dégoûte." },
  merdoku: { name: "Merdoku", type: "Poison", power: 12, accuracy: 0.95, effect: { status: "poison", chance: 0.45 }, text: "Attaque toxique et déprimante." },
  cacaOcurry: { name: "CacaOcurry", type: "Sol", power: 26, accuracy: 0.88, text: "Une catastrophe de proximité." },
  
  //Pipalabita
  tempeteBisous: { name: "Tempête de bisous", type: "Psy", power: 18, accuracy: 0.95, effect: { status: "confuse", chance: 0.35 }, text: "Une attaque mignonne en apparence seulement." },
  gorgeAbyssale: { name: "Gorge Abyssale", type: "Poison", power: 18, accuracy: 0.95, effect: { drain: 0.5 }, text: "L'utilisateur draine les PV adverses." },
  petDeFouf: { name: "Pet toxique", type: "Poison", power: 14, accuracy: 1, effect: { status: "poison", chance: 0.5 }, text: "Ça sent la défaite." },
  
  //Chorizobs
  etouffeTete: { name: "Étouffe-Tété", type: "Normal", power: 18, accuracy: 0.92, effect: { status: "confuse", chance: 0.3 }, text: "On n'est déjà plus très bien." },
  moussalait: { name: "Moussalait", type: "Eau", power: 24, accuracy: 0.92, text: "Une giclée absurde et très efficace." },
  pedodance: { name: "Pedo Dance", type: "Normal", power: 0, effect: { buffAttack: 1, buffSpeed: 2 }, text: "Une chorégraphie catastrophique mais redoutable." },
  tresSale: { name: "Très Salé Jonathan", type: "Feu", power: 22, accuracy: 0.95, effect: { status: "burn", chance: 0.3 }, text: "Une flamme lourde qui brûle parfois." },

  //Bousillaflor
  graineDeSemence: { name: "Graine de Semence", type: "Plante", power: 16, accuracy: 0.95, effect: { drainOverTime: true }, text: "La petite graine que papa met dans maman." },
  sadomaxo: { name: "Sado-maxo", type: "Plante", power: 0, effect: { recoilSelf: 10, buffAttack: 1, buffDefense: 1, buffSpeed: 1 }, text: "Se fait mal pour devenir encore plus dangereux." },
  lancemerde: { name: "Lance-Merde", type: "Sol", power: 18, accuracy: 0.95, effect: { debuffSpeed: 1, chance: 0.5 }, text: "La cible est ralentie par la crasse." },
  fouetLiane: { name: "Fouet liane", type: "Plante", power: 24, accuracy: 0.96, text: "Le classique, mais bien énervé." },

  //Tentafluide
  calinadeInfernale: { name: "Câlinade Infernale", type: "Ténèbres", power: 24, accuracy: 0.95, text: "Trop proche, trop intense, trop tard." },
  fontaineDeSemence: { name: "Fontaine Collante", type: "Eau", power: 28, accuracy: 0.92, text: "Une salve liquide immonde mais puissante." },
  dixMilleAnsDeSouffrance: { name: "10 000 ans de souffrance", type: "Eau", power: 36, accuracy: 0.78, text: "Une punition légendaire qui prend tout l'écran." },
  sauceRevigorante: { name: "Sauce revigorante", type: "Eau", power: 0, effect: { heal: 30 }, text: "Le boss se régénère avec classe et mépris." },

  //Reichix
  alliance: { name: "Alliance", type: "Ténèbres", power: 16, accuracy: 0.95, effect: { status: "confuse", chance: 0.35 }, text: "Une promesse louche qui finit mal." },
  crematorium: { name: "Crématorium", type: "Feu", power: 34, accuracy: 0.84, effect: { status: "burn", chance: 0.35 }, text: "Une énorme montée de flammes." },
  gazattack: { name: "Gaza'ttack", type: "Poison", power: 20, accuracy: 1, effect: { status: "poison", chance: 0.25 }, text: "Oui, celle-là." },
  milisse: { name: "MiliSSe", type: "Normal", power: 0, effect: { heal: 20, buffAttack: 1 }, text: "Reichix ramène la milisse supplément SS et regagne des PV." },
};

const CREATURES = {
  nala: { id: "nala", name: "Nala", title: "La Chienasse", type: "Feu", hp: 110, attack: 26, defense: 18, speed: 22, moves: ["feuroce", "magmattack", "tempeteAntonienne", "sterilRez"], image: "./assets/creatures/nala_feu.png", glyph: "NA" },
  snoopy: { id: "snoopy", name: "Snoopy", title: "Le Chien Soleil", type: "Sol", hp: 126, attack: 26, defense: 26, speed: 26, moves: ["galichage", "ronflement", "exciterre", "attackaboul"], image: "./assets/creatures/Snoopy_sol.png", glyph: "SN" },
  abdelkrim: { id: "abdelkrim", name: "Abdelkrim", title: "Le Gay KO", type: "Eau", hp: 98, attack: 21, defense: 16, speed: 27, moves: ["camouflage", "agripage", "renforcementCaudal", "albineau"], glyph: "AB" },
  millie: { id: "millie", name: "Millie", title: "La chauve capée", type: "Acier", hp: 100, attack: 24, defense: 20, speed: 23, moves: ["caressemoi", "alopek", "morsure", "coussinacier"], image: "./assets/creatures/Mili_mili_nananana.png", glyph: "MI" },
  lapiteub: { id: "lapiteub", name: "Lapiteub", title: "Top Dildo Samantha", type: "Acier", hp: 102, attack: 23, defense: 21, speed: 16, moves: ["queueDeFer", "croutesDeNathan", "coupDeQueue", "biflEclair"], image: "./assets/creatures/Lapiteub-export.png", glyph: "LP" },
  arketron: { id: "arketron", name: "Arketron", title: "Le délice d'Isaac", type: "Vol", hp: 98, attack: 22, defense: 15, speed: 24, moves: ["chiasseSupersonique", "typhonDeChiasse", "merdoku", "cacaOcurry"], image: "./assets/creatures/Arketron.png", glyph: "AR" },
  pipalabita: { id: "pipalabita", name: "Pipalabita", title: "Fille chaude de ta région", type: "Poison", hp: 92, attack: 20, defense: 15, speed: 26, moves: ["tempeteBisous", "galichage", "gorgeAbyssale", "petDeFouf"], image: "./assets/creatures/Pipalabita-export-export.png", glyph: "PI" },
  chorizobs: { id: "chorizobs", name: "Chorizobs", title: "La spéciale Dave", type: "Feu", hp: 104, attack: 25, defense: 17, speed: 20, moves: ["etouffeTete", "moussalait", "pedodance", "tresSale"], image: "./assets/creatures/Los_Chorizobes.png", glyph: "CH" },
  bousillaflor: { id: "bousillaflor", name: "Bousillaflor", title: "La maman la plus bousillée", type: "Plante", hp: 108, attack: 24, defense: 18, speed: 18, moves: ["graineDeSemence", "sadomaxo", "lancemerde", "fouetLiane"], image: "./assets/creatures/Bousillaflore.png", glyph: "BO" },
  tentafluide: { id: "tentafluide", name: "Tentafluide", title: "Sérieux ?", type: "Eau", hp: 70, attack: 30, defense: 20, speed: 17, moves: ["calinadeInfernale", "fontaineDeSemence", "dixMilleAnsDeSouffrance", "sauceRevigorante"], image: "./assets/creatures/tentafluide.png", glyph: "TE" },
  reichix: { id:"reichix", name: "Reichix", title:"Nazi Prime 40", type: "Feu", hp: 130, attack: 12, defense: 30, speed: 5, moves: ["alliance", "crematorium", "gazattack", "milisse"], image: "./assets/creatures/Reichix-export.png", glyph: "RE" }
};

const TEAM_PRESETS = [
  { id: "teamA", name: "Équipe d'Eitan", vibe: "Millie, Nala et Snoopy.", members: ["millie", "nala", "snoopy"] },
];

const TRAINERS = [
  { id: "ari", name: "Ari", intro: "Bienvenue dans l'arène. Avec laquelle de mes neuf queues je vais pouvoir t'enculer ?", team: ["lapiteub", "arketron"], title: "Dresseur Pixel Pop", palette: "#ff76bd" },
  { id: "seraphine", name: "Séraphine", intro: "La musique est bonne mais je le suis plus.", team: ["bousillaflor", "pipalabita"], title: "Dresseuse Velours", palette: "#d95aff" },
  { id: "vi", name: "Vi", intro: "Bas les pattes, je suis lesbienne et fier de l'être FUCK ISRAEL", team: ["chorizobs", "lapiteub", "arketron"], title: "Diva du Ring", palette: "#ff5c84" },
  { id: "magnus", name: "Magnus", intro: "Je suis la dernière erreur de cette arène. Et tu vas la subir.", team: ["tentafluide", "reichix", "bousillaflor", "pipalabita"], title: "Boss du Velours", palette: "#8d2fff", boss: true },
];


/* types.js */
const TYPE_COLORS = {
  Feu: "type-Feu",
  Eau: "type-Eau",
  Plante: "type-Plante",
  Acier: "type-Acier",
  Vol: "type-Vol",
  Poison: "type-Poison",
  Sol: "type-Sol",
  Glace: "type-Glace",
  Psy: "type-Psy",
  Ténèbres: "type-Ténèbres",
  Combat: "type-Combat",
  Normal: "type-Normal",
};

const TYPE_EFFECTIVENESS = {
  Feu: { Plante: 1.5, Glace: 1.4, Eau: 0.7, Sol: 0.8 },
  Eau: { Feu: 1.5, Sol: 1.3, Plante: 0.7 },
  Plante: { Eau: 1.5, Sol: 1.3, Feu: 0.7, Vol: 0.8 },
  Acier: { Glace: 1.5, Feu: 0.8, Combat: 0.8 },
  Vol: { Plante: 1.5, Combat: 1.3, Glace: 0.8 },
  Poison: { Plante: 1.5, Acier: 0.7 },
  Sol: { Feu: 1.5, Acier: 1.5, Vol: 0.6, Plante: 0.8 },
  Glace: { Vol: 1.4, Plante: 1.4, Eau: 0.9, Feu: 0.8 },
  Psy: { Poison: 1.5, Ténèbres: 0.8 },
  Ténèbres: { Psy: 1.5, Combat: 0.85 },
  Combat: { Acier: 1.5, Ténèbres: 1.3, Vol: 0.8 },
  Normal: {},
};

function effectiveness(moveType, targetType) {
  return TYPE_EFFECTIVENESS[moveType]?.[targetType] ?? 1;
}

function effectivenessLabel(multiplier) {
  if (multiplier >= 1.35) return "BONUS ++";
  if (multiplier <= 0.8) return "MALUS --";
  return "NEUTRE";
}

function badge(type) {
  return `<span class="badge ${TYPE_COLORS[type] || TYPE_COLORS.Normal}">${type}</span>`;
}


/* helpers.js */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function stageMultiplier(stage) {
  if (stage >= 0) return 1 + stage * 0.25;
  return 1 / (1 + Math.abs(stage) * 0.25);
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildLog(text) {
  return { id: Math.random().toString(36).slice(2), text };
}

function healthPct(creature) {
  return Math.max(0, Math.round((creature.currentHp / creature.maxHp) * 100));
}

function firstAliveIndex(team) {
  return team.findIndex((c) => !c.fainted && c.currentHp > 0);
}

function aliveCount(team) {
  return team.filter((c) => !c.fainted && c.currentHp > 0).length;
}

function copyTeam(team) {
  return team.map((c) => ({ ...c }));
}

function statusLabel(status) {
  switch (status) {
    case 'poison': return 'Poison';
    case 'burn': return 'Brûlure';
    case 'paralyze': return 'Paralysie';
    case 'confuse': return 'Confusion';
    case 'freeze': return 'Gel';
    default: return null;
  }
}

function makeCreature(id, levelBoost = 0) {
  const base = CREATURES[id];
  return {
    ...base,
    maxHp: base.hp + levelBoost * 8,
    currentHp: base.hp + levelBoost * 8,
    attackStage: 0,
    defenseStage: 0,
    speedStage: 0,
    status: null,
    seeded: false,
    dodgeNext: false,
    fainted: false,
  };
}

function teamFromPreset(presetId) {
  const members = FIXED_PLAYER_TEAM && FIXED_PLAYER_TEAM.length ? FIXED_PLAYER_TEAM : ((TEAM_PRESETS.find((t) => t.id === presetId) ?? TEAM_PRESETS[0]).members);
  return members.map((id) => makeCreature(id, 0));
}

function enemyTeamForTrainer(index) {
  const trainer = TRAINERS[index];
  return trainer.team.map((id) => makeCreature(id, trainer.boss ? 2 : index + 1));
}


/* state.js */
const state = {
  appTitle: APP_TITLE,
  screen: 'title',
  selectedPreset: TEAM_PRESETS[0].id,
  playerTeam: [],
  enemyTeam: [],
  battleTrainerIndex: null,
  playerActive: 0,
  enemyActive: 0,
  logs: [buildLog('Bienvenue dans le Dôme Kawaii.')],
  worldMessage: "Déplace-toi dans l'arène, affronte les dresseurs et utilise le bouton Soin rapide quand tu veux.",
  player: {
    x: WORLD.spawn.x,
    y: WORLD.spawn.y,
    size: { w: 34, h: 44 },
    speed: 220,
  },
  keys: new Set(),
  lastFrame: 0,
  defeatedTrainers: [],
  modal: null,
  tickHandle: null,
};

function resetState() {
  state.screen = 'title';
  state.selectedPreset = TEAM_PRESETS[0].id;
  state.playerTeam = [];
  state.enemyTeam = [];
  state.battleTrainerIndex = null;
  state.playerActive = 0;
  state.enemyActive = 0;
  state.logs = [buildLog('Bienvenue dans le Dôme Kawaii.')];
  state.worldMessage = "Déplace-toi dans l'arène, affronte les dresseurs et utilise le bouton Soin rapide quand tu veux.";
  state.player.x = WORLD.spawn.x;
  state.player.y = WORLD.spawn.y;
  state.defeatedTrainers = [];
  state.modal = null;
}

function startAdventure() {
  state.playerTeam = teamFromPreset(state.selectedPreset);
  state.enemyTeam = [];
  state.battleTrainerIndex = null;
  state.playerActive = 0;
  state.enemyActive = 0;
  state.logs = [buildLog('Eitan entre dans le Dôme Kawaii avec Millie, Nala et Snoopy.')];
  state.player.x = WORLD.spawn.x;
  state.player.y = WORLD.spawn.y;
  state.defeatedTrainers = [];
  state.worldMessage = "Explore l'arène librement avec l'équipe fixe de Eitan : Millie, Nala et Snoopy. Le boss se débloque après les trois dresseurs.";
  state.screen = 'world';
}

function currentTrainer() {
  return state.battleTrainerIndex === null ? null : TRAINERS[state.battleTrainerIndex];
}

function bossUnlocked() {
  return state.defeatedTrainers.filter((id) => id !== 'magnus').length >= 3;
}


/* battle.js */
function canAct(unit) {
  if (unit.fainted || unit.currentHp <= 0) return { ok: false, reason: 'K.O.' };
  if (unit.status === 'freeze' && Math.random() < 0.65) return { ok: false, reason: 'gel' };
  if (unit.status === 'paralyze' && Math.random() < 0.3) return { ok: false, reason: 'paralysie' };
  if (unit.status === 'confuse' && Math.random() < 0.35) return { ok: false, reason: 'confusion' };
  return { ok: true };
}

function applyEndTurnStatus(unit, logs, sourceName) {
  if (unit.fainted || unit.currentHp <= 0) return unit;
  let next = { ...unit };

  if (next.seeded) {
    const amount = Math.max(6, Math.floor(next.maxHp * 0.08));
    next.currentHp = clamp(next.currentHp - amount, 0, next.maxHp);
    logs.push(buildLog(`${sourceName} est aspiré par une graine vampirique (-${amount} PV).`));
  }
  if (next.status === 'poison') {
    const amount = Math.max(7, Math.floor(next.maxHp * 0.1));
    next.currentHp = clamp(next.currentHp - amount, 0, next.maxHp);
    logs.push(buildLog(`${sourceName} souffre du poison (-${amount} PV).`));
  }
  if (next.status === 'burn') {
    const amount = Math.max(5, Math.floor(next.maxHp * 0.07));
    next.currentHp = clamp(next.currentHp - amount, 0, next.maxHp);
    logs.push(buildLog(`${sourceName} brûle encore (-${amount} PV).`));
  }
  if (next.currentHp <= 0) {
    next.currentHp = 0;
    next.fainted = true;
    logs.push(buildLog(`${sourceName} est K.O.`));
  }
  return next;
}

function chooseEnemyMove(enemy) {
  const moveIds = enemy.moves;
  const healingMove = moveIds.find((id) => MOVES[id].effect?.heal);
  if (healingMove && enemy.currentHp < enemy.maxHp * 0.35 && Math.random() < 0.65) return healingMove;
  return randomChoice(moveIds);
}

function applyMove({ attacker, defender, moveId, attackerName, defenderName, logs }) {
  const move = MOVES[moveId];
  let nextAttacker = { ...attacker };
  let nextDefender = { ...defender };

  const actCheck = canAct(nextAttacker);
  if (!actCheck.ok) {
    logs.push(buildLog(`${attackerName} perd son tour (${actCheck.reason}).`));
    if (actCheck.reason === 'confusion') {
      const selfDamage = 8;
      nextAttacker.currentHp = clamp(nextAttacker.currentHp - selfDamage, 0, nextAttacker.maxHp);
      logs.push(buildLog(`${attackerName} se blesse dans sa confusion (-${selfDamage} PV).`));
      if (nextAttacker.currentHp <= 0) {
        nextAttacker.currentHp = 0;
        nextAttacker.fainted = true;
        logs.push(buildLog(`${attackerName} est K.O.`));
      }
    }
    return { attacker: nextAttacker, defender: nextDefender };
  }

  logs.push(buildLog(`${attackerName} utilise ${move.name}.`));

  if (nextDefender.dodgeNext) {
    nextDefender.dodgeNext = false;
    logs.push(buildLog(`${defenderName} esquive complètement l'attaque.`));
    return { attacker: nextAttacker, defender: nextDefender };
  }

  if (move.accuracy && Math.random() > move.accuracy) {
    logs.push(buildLog("L'attaque rate sa cible."));
    return { attacker: nextAttacker, defender: nextDefender };
  }

  if (move.power > 0) {
    const attackValue = attacker.attack * stageMultiplier(attacker.attackStage) * (attacker.status === 'burn' ? 0.9 : 1);
    const defenseValue = defender.defense * stageMultiplier(defender.defenseStage);
    const typeBonus = effectiveness(move.type, defender.type);
    const raw = move.power + attackValue * 1.2 - defenseValue * 0.8;
    const damage = Math.max(8, Math.round(raw * typeBonus * (0.9 + Math.random() * 0.18)));
    nextDefender.currentHp = clamp(nextDefender.currentHp - damage, 0, nextDefender.maxHp);

    let note = '';
    if (typeBonus >= 1.35) note = " C'est super efficace.";
    if (typeBonus <= 0.8) note = " Ce n'est pas très efficace.";
    logs.push(buildLog(`${defenderName} subit ${damage} PV de dégâts.${note}`));

    if (move.effect?.drain) {
      const heal = Math.max(6, Math.round(damage * move.effect.drain));
      nextAttacker.currentHp = clamp(nextAttacker.currentHp + heal, 0, nextAttacker.maxHp);
      logs.push(buildLog(`${attackerName} absorbe ${heal} PV.`));
    }
  }

  const effect = move.effect;
  if (effect) {
    const chance = effect.chance ?? 1;
    const applies = Math.random() <= chance;
    if (effect.heal) {
      nextAttacker.currentHp = clamp(nextAttacker.currentHp + effect.heal, 0, nextAttacker.maxHp);
      logs.push(buildLog(`${attackerName} récupère ${effect.heal} PV.`));
    }
    if (effect.buffAttack) {
      nextAttacker.attackStage = clamp(nextAttacker.attackStage + effect.buffAttack, -3, 3);
      logs.push(buildLog(`${attackerName} augmente son attaque.`));
    }
    if (effect.buffDefense) {
      nextAttacker.defenseStage = clamp(nextAttacker.defenseStage + effect.buffDefense, -3, 3);
      logs.push(buildLog(`${attackerName} augmente sa défense.`));
    }
    if (effect.buffSpeed) {
      nextAttacker.speedStage = clamp(nextAttacker.speedStage + effect.buffSpeed, -3, 3);
      logs.push(buildLog(`${attackerName} augmente sa vitesse.`));
    }
    if (effect.debuffAttack && applies) {
      nextDefender.attackStage = clamp(nextDefender.attackStage - effect.debuffAttack, -3, 3);
      logs.push(buildLog(`${defenderName} perd de l'attaque.`));
    }
    if (effect.debuffDefense && applies) {
      nextDefender.defenseStage = clamp(nextDefender.defenseStage - effect.debuffDefense, -3, 3);
      logs.push(buildLog(`${defenderName} perd de la défense.`));
    }
    if (effect.debuffSpeed && applies) {
      nextDefender.speedStage = clamp(nextDefender.speedStage - effect.debuffSpeed, -3, 3);
      logs.push(buildLog(`${defenderName} perd de la vitesse.`));
    }
    if (effect.debuffDefenseSelf) {
      nextAttacker.defenseStage = clamp(nextAttacker.defenseStage - effect.debuffDefenseSelf, -3, 3);
      logs.push(buildLog(`${attackerName} devient plus fragile.`));
    }
    if (effect.recoil) {
      nextAttacker.currentHp = clamp(nextAttacker.currentHp - effect.recoil, 0, nextAttacker.maxHp);
      logs.push(buildLog(`${attackerName} subit ${effect.recoil} PV de recul.`));
    }
    if (effect.recoilSelf) {
      nextAttacker.currentHp = clamp(nextAttacker.currentHp - effect.recoilSelf, 0, nextAttacker.maxHp);
      logs.push(buildLog(`${attackerName} se blesse volontairement (-${effect.recoilSelf} PV).`));
    }
    if (effect.status && applies && !nextDefender.status) {
      nextDefender.status = effect.status;
      logs.push(buildLog(`${defenderName} subit l'état ${statusLabel(effect.status)?.toLowerCase()}.`));
    }
    if (effect.dodgeNext) {
      nextAttacker.dodgeNext = true;
      logs.push(buildLog(`${attackerName} se prépare à esquiver la prochaine attaque.`));
    }
    if (effect.drainOverTime) {
      nextDefender.seeded = true;
      logs.push(buildLog(`${defenderName} est infesté par une graine vampirique.`));
    }
  }

  if (nextDefender.currentHp <= 0) {
    nextDefender.currentHp = 0;
    nextDefender.fainted = true;
    logs.push(buildLog(`${defenderName} est K.O.`));
  }
  if (nextAttacker.currentHp <= 0) {
    nextAttacker.currentHp = 0;
    nextAttacker.fainted = true;
    logs.push(buildLog(`${attackerName} est K.O.`));
  }

  return { attacker: nextAttacker, defender: nextDefender };
}

function beginBattle(index) {
  const trainer = TRAINERS[index];
  const freshEnemyTeam = enemyTeamForTrainer(index);
  state.battleTrainerIndex = index;
  state.enemyTeam = freshEnemyTeam;
  state.enemyActive = firstAliveIndex(freshEnemyTeam);
  state.playerActive = firstAliveIndex(state.playerTeam);
  state.logs = [
    buildLog(`${trainer.name} s'avance dans l'arène.`),
    buildLog(`« ${trainer.intro} »`),
    buildLog(`${trainer.name} envoie ${freshEnemyTeam[0].name}.`),
  ];
  state.screen = 'battle';
}

function healTeam(message) {
  state.playerTeam = state.playerTeam.map((c) => ({ ...c, currentHp: c.maxHp, fainted: false, status: null, seeded: false, dodgeNext: false }));
  state.worldMessage = message || "Le coeur rose diffuse une lumière pixelisée. Toute l'équipe est soignée.";
}

function switchCreature(index) {
  if (state.screen !== 'battle') return;
  if (index === state.playerActive) return;
  const target = state.playerTeam[index];
  if (!target || target.fainted || target.currentHp <= 0) return;
  state.playerActive = index;
  state.logs = [buildLog(`Eitan rappelle ${state.playerTeam[state.playerActive].name} et envoie ${target.name}.`), ...state.logs].slice(0, 16);
}

function finishTrainerBattle(index, newPlayerTeam, freshLogs) {
  const trainer = TRAINERS[index];
  state.playerTeam = newPlayerTeam;
  if (trainer.boss) {
    state.defeatedTrainers.push(trainer.id);
    state.logs = [buildLog(`${trainer.name} tombe à genoux. Le Dôme Kawaii se fissure enfin.`), ...freshLogs].slice(0, 18);
    state.screen = 'victory';
    return;
  }
  state.defeatedTrainers.push(trainer.id);
  state.worldMessage = `${trainer.name} est vaincu. L'arène te laisse poursuivre ta route.`;
  state.logs = [buildLog(`${trainer.name} est vaincu.`), ...freshLogs].slice(0, 18);
  state.screen = 'world';
}

function performTurn(playerMoveId) {
  if (state.battleTrainerIndex === null) return;
  const battleTrainer = TRAINERS[state.battleTrainerIndex];
  let pTeam = copyTeam(state.playerTeam);
  let eTeam = copyTeam(state.enemyTeam);
  let pIndex = state.playerActive;
  let eIndex = state.enemyActive;
  let p = { ...pTeam[pIndex] };
  let e = { ...eTeam[eIndex] };
  const turnLogs = [];

  const playerMove = MOVES[playerMoveId];
  const enemyMoveId = chooseEnemyMove(e);
  const enemyMove = MOVES[enemyMoveId];
  const playerPriority = playerMove.effect?.priority ?? 0;
  const enemyPriority = enemyMove.effect?.priority ?? 0;
  const playerSpeed = p.speed * stageMultiplier(p.speedStage) * (p.status === 'paralyze' ? 0.8 : 1);
  const enemySpeed = e.speed * stageMultiplier(e.speedStage) * (e.status === 'paralyze' ? 0.8 : 1);
  const playerFirst = playerPriority === enemyPriority ? playerSpeed >= enemySpeed : playerPriority > enemyPriority;

  function writeBack() {
    pTeam[pIndex] = { ...p };
    eTeam[eIndex] = { ...e };
  }

  if (playerFirst) {
    ({ attacker: p, defender: e } = applyMove({ attacker: p, defender: e, moveId: playerMoveId, attackerName: p.name, defenderName: e.name, logs: turnLogs }));
    writeBack();
    if (!e.fainted) {
      ({ attacker: e, defender: p } = applyMove({ attacker: e, defender: p, moveId: enemyMoveId, attackerName: e.name, defenderName: p.name, logs: turnLogs }));
      writeBack();
    }
  } else {
    ({ attacker: e, defender: p } = applyMove({ attacker: e, defender: p, moveId: enemyMoveId, attackerName: e.name, defenderName: p.name, logs: turnLogs }));
    writeBack();
    if (!p.fainted) {
      ({ attacker: p, defender: e } = applyMove({ attacker: p, defender: e, moveId: playerMoveId, attackerName: p.name, defenderName: e.name, logs: turnLogs }));
      writeBack();
    }
  }

  p = applyEndTurnStatus(p, turnLogs, p.name);
  e = applyEndTurnStatus(e, turnLogs, e.name);
  writeBack();

  if (e.fainted || e.currentHp <= 0) {
    const nextEnemy = firstAliveIndex(eTeam);
    if (nextEnemy !== -1) {
      eIndex = nextEnemy;
      turnLogs.push(buildLog(`${battleTrainer.name} envoie ${eTeam[eIndex].name}.`));
    }
  }
  if (p.fainted || p.currentHp <= 0) {
    const nextPlayer = firstAliveIndex(pTeam);
    if (nextPlayer !== -1) {
      pIndex = nextPlayer;
      turnLogs.push(buildLog(`Eitan envoie ${pTeam[pIndex].name}.`));
    }
  }

  const freshLogs = [...turnLogs.reverse(), ...state.logs].slice(0, 18);
  if (aliveCount(pTeam) <= 0) {
    state.playerTeam = pTeam;
    state.enemyTeam = eTeam;
    state.logs = freshLogs;
    state.screen = 'defeat';
    return;
  }
  if (aliveCount(eTeam) <= 0) {
    finishTrainerBattle(state.battleTrainerIndex, pTeam, freshLogs);
    return;
  }

  state.playerTeam = pTeam;
  state.enemyTeam = eTeam;
  state.playerActive = pIndex;
  state.enemyActive = eIndex;
  state.logs = freshLogs;
}


/* world.js */
function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function updateWorld(dt) {
  if (state.screen !== 'world') return;
  const speed = state.player.speed * dt;
  let dx = 0;
  let dy = 0;

  if (state.keys.has('arrowup') || state.keys.has('w') || state.keys.has('z')) dy -= 1;
  if (state.keys.has('arrowdown') || state.keys.has('s')) dy += 1;
  if (state.keys.has('arrowleft') || state.keys.has('a') || state.keys.has('q')) dx -= 1;
  if (state.keys.has('arrowright') || state.keys.has('d')) dx += 1;

  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy) || 1;
    state.player.x = clamp(state.player.x + (dx / len) * speed, WORLD.bounds.minX, WORLD.bounds.maxX);
    state.player.y = clamp(state.player.y + (dy / len) * speed, WORLD.bounds.minY, WORLD.bounds.maxY);
  }

  const playerPoint = { x: state.player.x, y: state.player.y };

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
      state.worldMessage = `${trainer.name} a déjà été battu.`;
      return;
    }

    state.worldMessage = `${trainer.name} te repère. Le combat commence.`;
    beginBattle(TRAINERS.findIndex((t) => t.id === trainer.id));
    return;
  }

  if (dx !== 0 || dy !== 0) {
    state.worldMessage = "Tu avances dans l'arène kawaii. Les dresseuses t'observent depuis les côtés.";
  }
}

function bindWorldKeys() {
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


/* ui.js */
function sprite(creature, small = false) {
  const cls = `sprite-block${small ? ' small' : ''}`;
  if (creature.image) {
    return `<div class="${cls}"><img src="${creature.image}" alt="${creature.name}" /></div>`;
  }
  return `<div class="${cls}"><div class="sprite-fallback">${creature.glyph || creature.name.slice(0, 2).toUpperCase()}</div></div>`;
}


function hiddenPortrait(trainer, compact = false) {
  const art = TRAINER_ART[trainer.id] || { code: '??', tint: '#b154df' };
  const cls = compact ? 'hidden-portrait compact' : 'hidden-portrait';
  const media = art.image
    ? `<div class="photo" style="background-image:url('${art.image}')"></div>`
    : `<div class="wash" style="background: linear-gradient(180deg, ${art.tint}, #2a1035)"></div>`;
  return `
    <div class="${cls}">
      ${media}
      <div class="silhouette"><div class="pixel-silhouette"></div></div>
      <div class="blur-layer"></div>
      <div class="scan"></div>
      <div class="stamp">aperçu filtré</div>
      <div class="code">${art.code}</div>
    </div>
  `;
}

function trainerPreviewPanel() {
  return `
    <div class="pixel-panel panel-pad">
      <div class="micro-title" style="color:#5a1e6d;margin-bottom:10px;">Aperçus des dresseuses</div>
      <div class="trainer-preview-grid">
        ${TRAINERS.filter((trainer) => !trainer.boss).map((trainer) => `
          <div class="trainer-preview-card">
            ${hiddenPortrait(trainer, true)}
            <div class="pixel-box trainer-preview-meta">
              <div class="trainer-preview-name">${trainer.name}</div>
              <div class="trainer-preview-role">${trainer.title}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}


function trainerProgress() {
  return `
    <div class="pixel-panel panel-pad">
      <div class="micro-title" style="color:#5a1e6d;margin-bottom:10px;">Progression</div>
      <div class="progress-list">
        ${TRAINERS.map((trainer) => {
          const defeated = state.defeatedTrainers.includes(trainer.id);
          const locked = trainer.boss && !bossUnlocked();
          const flag = defeated ? 'Vaincu' : locked ? 'Bloqué' : trainer.boss ? 'Boss' : 'Actif';
          return `<div class="pixel-box progress-item"><div class="progress-top"><div><div style="font-weight:900;text-transform:uppercase;">${trainer.name}</div><div style="color:#6a3f74;">${trainer.title}</div></div><div style="font-weight:900;text-transform:uppercase;">${flag}</div></div></div>`;
        }).join('')}
      </div>
    </div>
  `;
}

function playerTeamPanel(interactive = false) {
  return `
    <div class="pixel-panel panel-pad">
      <div class="micro-title" style="color:#5a1e6d;margin-bottom:10px;">${interactive ? 'Changer de Kawaiimon' : "Équipe d'Eitan"}</div>
      <div class="team-list">
        ${state.playerTeam.map((creature, index) => {
          const disabled = creature.fainted || creature.currentHp <= 0;
          return `<button class="pixel-panel member-card ${state.playerActive === index ? 'active' : ''} ${disabled ? 'disabled' : ''}" ${interactive ? `data-switch="${index}"` : ''} ${interactive && disabled ? 'disabled' : ''}>
            <div class="member-row">
              <div style="display:flex;gap:10px;align-items:start;">${sprite(creature, true)}<div><div class="member-title">${creature.name}</div><div class="member-sub">${creature.title}</div></div></div>
              ${badge(creature.type)}
            </div>
            <div class="meter"><div style="width:${healthPct(creature)}%"></div></div>
            <div class="hp-text">PV ${creature.currentHp} / ${creature.maxHp}</div>
            ${creature.status ? `<div class="status-text">État : ${statusLabel(creature.status)}</div>` : ''}
          </button>`;
        }).join('')}
      </div>
    </div>
  `;
}

function titleScreen() {
  const nala = CREATURES.nala;
  return `
    <div class="screen-grid two-col">
      <div class="pixel-panel panel-pad">
        <div class="tag">Ancien style Pokémon</div>
        <h2 class="section-title" style="margin-top:18px;">Arène libre et vraie progression</h2>
        <p class="big-copy">Cette version multi-fichiers de Kawaiimon te donne une vraie structure de jeu navigateur : arène libre, combats contre les dresseurs, boss final, nouveau fond d’arène kawaii, aperçus filtrés des dresseuses et fond de combat intégré. Le tout est rangé en fichiers HTML / CSS / JS pour un meilleur rendu et un code plus propre.</p>
        <div class="stat-grid three" style="margin-top:14px;">
          <div class="pixel-box stat-box"><div class="micro-title" style="color:#a12166;">Exploration</div><div style="margin-top:6px;font-weight:900;">Fluide</div></div>
          <div class="pixel-box stat-box"><div class="micro-title" style="color:#a12166;">Palette</div><div style="margin-top:6px;font-weight:900;">Rouge / rose / violet</div></div>
          <div class="pixel-box stat-box"><div class="micro-title" style="color:#a12166;">Objectif</div><div style="margin-top:6px;font-weight:900;">3 dresseurs + boss</div></div>
        </div>
        <div style="margin-top:18px;"><button class="pixel-button" data-action="start">Commencer l'aventure</button></div>
      </div>
      <div class="pixel-dark panel-pad">
        <div class="micro-title" style="color:#ffc9e5;">Vedette du jeu</div>
        <div class="pixel-box" style="margin-top:14px;padding:14px;background:#692b84;color:white;">
          <div style="display:flex;gap:14px;align-items:center;">${sprite(nala)}<div><div style="font-size:1.4rem;font-weight:900;text-transform:uppercase;">Nala</div><div style="margin-top:8px;">${badge(nala.type)}</div></div></div>
          <p class="big-copy" style="color:#ffe4f5;margin-top:14px;">L'équipe de Eitan est maintenant fixe : Millie, Nala et Snoopy. Il n'y a plus d'écran de sélection d'équipe.</p>
          <div class="stack" style="margin-top:12px;">
            ${FIXED_PLAYER_TEAM.map((id) => `<div class="pixel-box" style="padding:8px;background:#7a2d95;color:white;display:flex;align-items:center;gap:10px;">${sprite(CREATURES[id], true)}<span>${CREATURES[id].name} • ${CREATURES[id].type}</span></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function teamScreen() {
  return ``;
}

function worldScreen() {
  return `
    <div class="screen-grid world">
      <div class="panel-dark panel-pad">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;">
          <div><div class="micro-title" style="color:#ffd4f3;">Exploration</div><div style="margin-top:6px;font-size:1.8rem;font-weight:900;text-transform:uppercase;">Arène Pokémon-like</div></div>
          <div class="controls-row"><button class="pixel-button alt" data-nav="title">Menu</button><button class="pixel-button" data-action="heal">Soin rapide</button></div>
        </div>
        <div class="world-wrap" style="margin-top:14px;">
          <div class="world-arena" id="worldArena">
            <div class="world-lane"></div>
            ${TRAINERS.map((trainer) => {
              const marker = WORLD.trainers.find((m) => m.id === trainer.id);
              const defeated = state.defeatedTrainers.includes(trainer.id);
              const art = TRAINER_ART[trainer.id] || { code: '??' };
              const avatarStyle = art.image ? ` style="background-image:url('${art.image}');background-size:cover;background-position:center top;"` : '';
              return `<div class="marker world-entity ${defeated ? 'defeated' : ''} ${trainer.boss ? 'boss' : ''}" data-world-x="${marker.x}" data-world-y="${marker.y}" style="left:0px;top:0px;">
                <div class="avatar" data-code="${art.code}"${avatarStyle}><div class="blur"></div></div>
                <div class="name">${trainer.name}</div>
              </div>`;
            }).join('')}
            <div class="marker heal world-entity" data-world-x="${WORLD.healSpot.x}" data-world-y="${WORLD.healSpot.y}" style="left:0px;top:0px;"><div class="avatar"></div><div class="name">Heal</div></div>
            <div class="marker start world-entity" data-world-x="${WORLD.startSpot.x}" data-world-y="${WORLD.startSpot.y}" style="left:0px;top:0px;"><div class="avatar"></div><div class="name">Départ</div></div>
            <div class="player" id="playerAvatar"><div class="player-label">Eitan</div><div class="player-hair"></div><div class="player-head"></div><div class="player-body"></div><div class="player-leg left"></div><div class="player-leg right"></div></div>
          </div>
          <div class="dialog-box">${state.worldMessage}</div><div class="world-quick-hint">Caméra centrée sur Eitan • ZQSD / WASD / flèches • <strong>H</strong> pour soigner.</div>
          <div class="footer-note">Fond kawaii pour l'exploration, terrain vert dédié pour les combats.</div>
        </div>
      </div>
      <div class="sidebar">
        <div class="pixel-panel panel-pad"><div class="micro-title" style="color:#5a1e6d;margin-bottom:10px;">Portraits des dresseuses</div><div class="team-list">${TRAINERS.map((trainer) => `<div class="portrait-card">${hiddenPortrait(trainer)}<div class="pixel-box" style="padding:8px;"><div style="font-weight:900;text-transform:uppercase;">${trainer.name}</div><div style="color:#6a3f74;">${trainer.title}</div></div></div>`).join('')}</div></div>
        ${trainerPreviewPanel()}
        ${trainerProgress()}
        ${playerTeamPanel(false)}
      </div>
    </div>
  `;
}

function battleScreen() {
  const trainer = TRAINERS[state.battleTrainerIndex];
  const player = state.playerTeam[state.playerActive];
  const enemy = state.enemyTeam[state.enemyActive];
  return `
    <div class="screen-grid battle">
      <div class="panel-dark panel-pad">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;">
          <div><div class="micro-title" style="color:#ffd4f3;">Combat</div><div style="margin-top:6px;font-size:1.8rem;font-weight:900;text-transform:uppercase;">Eitan vs ${trainer.name}</div></div>
          ${badge(trainer.boss ? 'Ténèbres' : 'Psy')}
        </div>
        <div class="battle-stage" style="margin-top:14px;">
          <div class="battle-bg">
            <div class="battle-stage-inner"><div class="battle-vs">VS</div>
              <div class="battle-actor player">
                <div class="creature-stand">${player.image ? `<img src="${player.image}" alt="${player.name}" />` : `<div class="creature-fallback">${player.glyph}</div>`}</div>
                <div class="status-card">
                  <div class="status-name"><div><h3>${player.name}</h3><div class="status-sub">${player.title}</div></div>${badge(player.type)}</div>
                  <div class="meter"><div style="width:${healthPct(player)}%"></div></div>
                  <div class="hp-text">PV ${player.currentHp} / ${player.maxHp}</div>
                  ${player.status ? `<div class="status-text">État : ${statusLabel(player.status)}</div>` : ''}
                </div>
              </div>
              <div class="battle-actor enemy">
                <div class="creature-stand">${enemy.image ? `<img src="${enemy.image}" alt="${enemy.name}" />` : `<div class="creature-fallback">${enemy.glyph}</div>`}</div>
                <div class="status-card">
                  <div class="status-name"><div><h3>${enemy.name}</h3><div class="status-sub">${enemy.title}</div></div>${badge(enemy.type)}</div>
                  <div class="meter"><div style="width:${healthPct(enemy)}%"></div></div>
                  <div class="hp-text">PV ${enemy.currentHp} / ${enemy.maxHp}</div>
                  ${enemy.status ? `<div class="status-text">État : ${statusLabel(enemy.status)}</div>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pixel-panel panel-pad" style="margin-top:16px;background:#5f2575;color:white;">
          <div class="micro-title" style="color:#ffe1f3;margin-bottom:10px;">Choisir une attaque</div>
          <div class="move-grid">
            ${player.moves.map((moveId) => {
              const move = MOVES[moveId];
              return `<button class="move-btn" data-move="${moveId}"><div class="move-name"><span>${move.name}</span>${badge(move.type)}</div><div class="move-desc">${move.text}</div></button>`;
            }).join('')}
          </div>
        </div>
      </div>
      <div class="sidebar">
        <div class="pixel-panel panel-pad"><div class="micro-title" style="color:#5a1e6d;margin-bottom:10px;">Aperçu adverse</div>${hiddenPortrait(trainer)}<div class="pixel-box" style="margin-top:10px;padding:10px;"><div style="font-weight:900;text-transform:uppercase;">${trainer.name}</div><div style="color:#6a3f74;">${trainer.intro}</div></div></div>
        <div class="pixel-panel panel-pad"><div class="micro-title" style="color:#5a1e6d;margin-bottom:10px;">Journal du combat</div><div class="log-list">${state.logs.map((entry) => `<div class="pixel-box log-item">${entry.text}</div>`).join('')}</div></div>
        ${playerTeamPanel(true)}
      </div>
    </div>
  `;
}

function victoryScreen() {
  return `
    <div class="overlay"><div class="pixel-panel modal center"><div style="font-size:3rem;">★</div><div class="section-title" style="margin-top:10px;">Victoire</div><p class="big-copy">Magnus est vaincu. Le Dôme Kawaii se fissure, la statue maudite perd son aura et Nala rugit comme une reine. Tu as maintenant une vraie version multi-fichiers de Kawaiimon.</p><div class="modal-actions" style="justify-content:center;"><button class="pixel-button alt" data-nav="world">Retour à l'arène</button><button class="pixel-button" data-action="restart">Rejouer</button></div></div></div>
  `;
}

function defeatScreen() {
  return `
    <div class="overlay"><div class="pixel-panel modal center"><div style="font-size:3rem;">×</div><div class="section-title" style="margin-top:10px;">Défaite</div><p class="big-copy">L'arène t'a puni. Repars du menu ou change d'équipe pour retenter ta chance contre les dresseurs.</p><div class="modal-actions" style="justify-content:center;"><button class="pixel-button alt" data-nav="title">Retour menu</button><button class="pixel-button" data-action="restart">Retour menu</button></div></div></div>
  `;
}

function renderApp(root) {
  root.innerHTML = `
    <div class="shell">
      <div class="pixel-dark header">
        <div><div class="title">${APP_TITLE}</div><div class="subtitle">Pokémon-like pixel • rouge / rose / violet</div></div>
        <div class="tag-row"><span class="tag">Équipe fixe</span><span class="tag">Arène libre</span><span class="tag">Dresseuses filtrées</span><span class="tag">Duel visible</span></div>
      </div>
      ${state.screen === 'title' ? titleScreen() : ''}
      ${state.screen === 'world' ? worldScreen() : ''}
      ${state.screen === 'battle' ? battleScreen() : ''}
      ${state.screen === 'victory' ? victoryScreen() : ''}
      ${state.screen === 'defeat' ? defeatScreen() : ''}
    </div>
  `;

  root.querySelectorAll('[data-nav]').forEach((btn) => btn.addEventListener('click', () => {
    state.screen = btn.dataset.nav;
    renderApp(root);
  }));

  root.querySelectorAll('[data-action="start"]').forEach((btn) => btn.addEventListener('click', () => {
    startAdventure();
    renderApp(root);
  }));

  root.querySelectorAll('[data-action="restart"]').forEach((btn) => btn.addEventListener('click', () => {
    resetState();
    renderApp(root);
  }));

  root.querySelectorAll('[data-action="heal"]').forEach((btn) => btn.addEventListener('click', () => {
    healTeam("Soin rapide activé. Toute l'équipe est soignée.");
    renderApp(root);
  }));

  root.querySelectorAll('[data-move]').forEach((btn) => btn.addEventListener('click', () => {
    performTurn(btn.dataset.move);
    renderApp(root);
  }));

  root.querySelectorAll('[data-switch]').forEach((btn) => btn.addEventListener('click', () => {
    switchCreature(Number(btn.dataset.switch));
    renderApp(root);
  }));
}


/* main.js */
const root = document.getElementById('app');
let previousScreen = state.screen;
let previousMessage = state.worldMessage;
let previousDefeated = state.defeatedTrainers.join(',');

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
  if (state.screen !== previousScreen || defeatedNow !== previousDefeated) {
    previousScreen = state.screen;
    previousDefeated = defeatedNow;
    previousMessage = state.worldMessage;
    renderApp(root);
  } else if (state.screen === 'world') {
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
requestAnimationFrame(gameLoop);
