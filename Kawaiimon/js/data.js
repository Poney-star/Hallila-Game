export const APP_TITLE = "Kawaiimon";

export const DEFAULT_PLAYER_STARTER = "millie";
export const FIXED_PLAYER_TEAM = ["millie", "nala", "snoopy"];
export const PLAYER_START_LEVEL = 5;
export const LEVEL_STEP = 3;

export const PLAYER_SPRITE = {
  image: "./assets/player/eitan_walk.png",
  frameWidth: 40,
  frameHeight: 64,
  columns: 4,
  rows: 3,
  animations: {
    down: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0, mirror: true },
      { x: 1, y: 0, mirror: true },
    ],
    up: [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 0, mirror: true },
      { x: 2, y: 0, mirror: true },
      { x: 3, y: 0, mirror: true },
      { x: 3, y: 0 },
    ],
    left: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    right: [
      { x: 0, y: 1, mirror: true },
      { x: 1, y: 1, mirror: true },
      { x: 2, y: 1, mirror: true },
      { x: 3, y: 1, mirror: true },
    ],
    idle: [
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 0, y: 2 },
      { x: 1, y: 2, mirror: true },
      { x: 1, y: 2, mirror: true },
      { x: 1, y: 2, mirror: true },
      { x: 1, y: 2, mirror: true },
      { x: 1, y: 2, mirror: true },
      { x: 1, y: 2, mirror: true },
      { x: 1, y: 2, mirror: true },
      { x: 1, y: 2, mirror: true },
      { x: 1, y: 2, mirror: true },
      { x: 1, y: 2, mirror: true },
      { x: 1, y: 2, mirror: true },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
      { x: 2, y: 2 },
    ],
  },
};

export function playerAnimationFrames(player) {
  if (!player.walking) return PLAYER_SPRITE.animations.idle;
  return PLAYER_SPRITE.animations[player.direction] ?? PLAYER_SPRITE.animations.down;
}

export function playerSpritePose(player) {
  const frames = playerAnimationFrames(player);
  const index = player.spriteFrame % frames.length;
  return frames[index];
}


export const TRAINER_ART = {
  ari: { code: "H1", tint: "#ff5fae", image: "./assets/trainers/hari.png" },
  seraphine: { code: "H2", tint: "#c85bff", image: "./assets/trainers/seraphine.png" },
  vi: { code: "H3", tint: "#ff7a8f", image: "./assets/trainers/tristina.png" },
  magnus: { code: "B0", tint: "#7d2a91" },
};

export const WORLD = {
  width: 1280,
  height: 620,
  bounds: { minX: 110, minY: 160, maxX: 1170, maxY: 560 },
  spawn: { x: 640, y: 535 },
  healSpot: { x: 640, y: 355, radius: 42 },
  startSpot: { x: 640, y: 535, radius: 34 },
  trainers: [
    { id: "ari", x: 265, y: 345, radius: 58 },
    { id: "seraphine", x: 1015, y: 345, radius: 58 },
    { id: "vi", x: 1045, y: 515, radius: 58 },
    { id: "magnus", x: 640, y: 175, radius: 66, boss: true },
  ],
};

export const MOVES = {
  //Nala
  feuroce: { name: "Feuroce", type: "Feu", power: 20, accuracy: 0.95, effect: { debuffAttack: 1, chance: 0.35 }, text: "Une onde brûlante qui intimide la cible." },
  magmattack: { name: "Magmattack", type: "Feu", power: 26, accuracy: 0.9, text: "Nala fonce dans un panache de braises." },
  tempeteAntonienne: { name: "Tempête Antonienne", type: "Feu", power: 42, accuracy: 0.80, effect: { recoil: 6 }, text: "Une énorme explosion dramatique." },
  sterilRez: { name: "Sterilrez", type: "Feu", power: 0, effect: { heal: 24, buffDefense: 1 }, text: "Nala se renforce et regagne des PV." },
  //Snoopy
  galichage: { name: "Galichage", type: "Eau", power: 24, accuracy: 0.92, effect: { buffSpeed: 1 }, text: "Snoopy embrasse goulument son adversaire" },
  ronflement: { name: "Ronflement", type: "Normal", power: 0, effect: { heal: 35 }, text: "Une sieste éclair qui rend des PV." },
  exciterre: { name: "Exciterre", type: "Sol", power: 30, accuracy: 0.88, text: "Le sol tremble sous l'excès de jouissance." },
  attackaboul: { name: "Attack'a'boul", type: "Ténèbres", power: 16, accuracy: 0.95, text: "Snoopy fourre son unique boule dans la bouche de l'adversaire." },
  //Abdelkrim
  Squattage: { name: "Squattage", type: "Vol", power: 5, effect: { dodgeNext: true, buffSpeed: 1 }, text: "L'utilisateur esquive la prochaine attaque." },
  Biflette: { name: "Biflette", type: "Combat", power: 25, accuracy: 0.95, effect: { debuffSpeed: 1, chance: 0.25 }, text: "Une saisie pénible qui casse le rythme." },
  BritMila: { name: "BritMila", type: "Normal", power: 0, effect: { buffAttack: 2, buffDefense: 2 }, text: "La queue repousse, plus solide que jamais." },
  albineau: { name: "Albineau", type: "Eau", power: 25, accuracy: 0.96, effect: { priority: 1, buffSpeed: 2 }, text: "Un jet d'eau ultra rapide." },
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

export const CREATURES = {
  nala: { id: "nala", name: "Nala", title: "La Chienasse", type: "Feu", hp: 110, attack: 30, defense: 18, speed: 20, moves: ["feuroce", "magmattack", "tempeteAntonienne", "sterilRez"], image: "./assets/creatures/nala_feu.png", glyph: "NA" },
  snoopy: { id: "snoopy", name: "Snoopy", title: "Le Chien Soleil", type: "Sol", hp: 96, attack: 26, defense: 26, speed: 26, moves: ["galichage", "ronflement", "exciterre", "attackaboul"], image: "./assets/creatures/Snoopy_sol.png", glyph: "SN" },
  abdelkrim: { id: "abdelkrim", name: "Abdelkrim", title: "Le Gay KO", type: "Eau", hp: 86, attack: 23, defense: 16, speed: 27, moves: ["Squattage", "Biflette", "BritMila", "albineau"], image: "./assets/creatures/ABDELKRIMMM-export.png", glyph: "AB" },
  millie: { id: "millie", name: "Millie", title: "La chauve capée", type: "Acier", hp: 104, attack: 24, defense: 24, speed: 23, moves: ["caressemoi", "alopek", "morsure", "coussinacier"], image: "./assets/creatures/Mili_mili_nananana.png", glyph: "MI" },
  lapiteub: { id: "lapiteub", name: "Lapiteub", title: "Top Dildo Samantha", type: "Acier", hp: 120, attack: 18, defense: 26, speed: 10, moves: ["queueDeFer", "croutesDeNathan", "coupDeQueue", "biflEclair"], image: "./assets/creatures/Lapiteub-export.png", glyph: "LP" },
  arketron: { id: "arketron", name: "Arketron", title: "Le délice d'Isaac", type: "Vol", hp: 98, attack: 25, defense: 15, speed: 30, moves: ["chiasseSupersonique", "typhonDeChiasse", "merdoku", "cacaOcurry"], image: "./assets/creatures/Arketron.png", glyph: "AR" },
  pipalabita: { id: "pipalabita", name: "Pipalabita", title: "Fille chaude de ta région", type: "Poison", hp: 100, attack: 22, defense: 24, speed: 15, moves: ["tempeteBisous", "galichage", "gorgeAbyssale", "petDeFouf"], image: "./assets/creatures/Pipalabita-export-export.png", glyph: "PI" },
  chorizobs: { id: "chorizobs", name: "Chorizobs", title: "La spéciale Dave", type: "Feu", hp: 108, attack: 25, defense: 19, speed: 20, moves: ["etouffeTete", "moussalait", "pedodance", "tresSale"], image: "./assets/creatures/Los_Chorizobes.png", glyph: "CH" },
  bousillaflor: { id: "bousillaflor", name: "Bousillaflor", title: "La maman la plus bousillée", type: "Plante", hp: 118, attack: 24, defense: 24, speed: 8, moves: ["graineDeSemence", "sadomaxo", "lancemerde", "fouetLiane"], image: "./assets/creatures/Bousillaflore.png", glyph: "BO" },
  tentafluide: { id: "tentafluide", name: "Tentafluide", title: "Sérieux ?", type: "Eau", hp: 113, attack: 28, defense: 20, speed: 17, moves: ["calinadeInfernale", "fontaineDeSemence", "dixMilleAnsDeSouffrance", "sauceRevigorante"], image: "./assets/creatures/tentafluide.png", glyph: "TE" },
  reichix: { id:"reichix", name: "Reichix", title:"Nazi Prime '40", type: "Feu", hp: 139, attack: 15, defense: 39, speed: 5, moves: ["alliance", "crematorium", "gazattack", "milisse"], image: "./assets/creatures/Reichix-export.png", glyph: "RE" }
};

export const PLAYABLE_CREATURE_IDS = Object.freeze(Object.keys(CREATURES));

export const TEAM_PRESETS = [
  { id: "teamA", name: "Équipe d'Eitan", vibe: "Roster libre.", members: ["millie", "nala", "snoopy"] },
];

export const TRAINERS = [
  { id: "ari", name: "Ari", intro: "Bienvenue dans l'arène. Avec laquelle de mes neuf queues je vais pouvoir t'enculer ?", team: ["lapiteub", "arketron"], levels: [6, 8], title: "Dresseuse H1", palette: "#ff76bd" },
  { id: "seraphine", name: "Séraphine", intro: "La musique est bonne mais je le suis plus.", team: ["bousillaflor", "pipalabita"], levels: [8, 10], title: "Dresseuse H2", palette: "#d95aff" },
  { id: "vi", name: "Vi", intro: "Bas les pattes, je suis lesbienne et fière de l'être.", team: ["chorizobs", "lapiteub", "arketron"], levels: [10, 10, 12], title: "Dresseuse H3", palette: "#ff5c84" },
  { id: "magnus", name: "Magnus", intro: "Je suis la dernière erreur de cette arène. Et tu vas la subir.", team: ["tentafluide", "reichix", "bousillaflor", "pipalabita"], levels: [14, 14, 14, 16], title: "Boss du Velours", palette: "#8d2fff", boss: true },
];
