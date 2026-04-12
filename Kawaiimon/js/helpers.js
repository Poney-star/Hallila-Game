import { CREATURES, FIXED_PLAYER_TEAM, PLAYABLE_CREATURE_IDS, TRAINERS, PLAYER_START_LEVEL, LEVEL_STEP } from './data.js';

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function stageMultiplier(stage) {
  if (stage >= 0) return 1 + stage * 0.25;
  return 1 / (1 + Math.abs(stage) * 0.25);
}

export function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildLog(text) {
  return { id: Math.random().toString(36).slice(2), text };
}

export function makeTurnBlock(kind, title, lines = []) {
  return {
    id: Math.random().toString(36).slice(2),
    kind,
    title,
    lines,
  };
}

export function healthPct(creature) {
  return Math.max(0, Math.round((creature.currentHp / creature.maxHp) * 100));
}

export function firstAliveIndex(team) {
  return team.findIndex((c) => !c.fainted && c.currentHp > 0);
}

export function aliveCount(team) {
  return team.filter((c) => !c.fainted && c.currentHp > 0).length;
}

export function copyTeam(team) {
  return team.map((c) => ({ ...c }));
}

export function statusLabel(status) {
  switch (status) {
    case 'poison': return 'Poison';
    case 'burn': return 'Brûlure';
    case 'paralyze': return 'Paralysie';
    case 'confuse': return 'Confusion';
    case 'freeze': return 'Gel';
    default: return null;
  }
}

export function statForLevel(baseStat, level) {
  return baseStat + Math.max(0, level - 1) * LEVEL_STEP;
}

export function makeCreature(id, level = PLAYER_START_LEVEL) {
  const base = CREATURES[id];
  return {
    ...base,
    level,
    maxHp: statForLevel(base.hp, level),
    currentHp: statForLevel(base.hp, level),
    attack: statForLevel(base.attack, level),
    defense: statForLevel(base.defense, level),
    speed: statForLevel(base.speed, level),
    attackStage: 0,
    defenseStage: 0,
    speedStage: 0,
    status: null,
    seeded: false,
    dodgeNext: false,
    fainted: false,
  };
}

export function levelUpCreature(creature, amount = 1) {
  const nextLevel = creature.level + amount;
  const nextMaxHp = creature.maxHp + LEVEL_STEP * amount;
  const shouldStayDown = creature.fainted || creature.currentHp <= 0;
  return {
    ...creature,
    level: nextLevel,
    maxHp: nextMaxHp,
    currentHp: shouldStayDown ? 0 : clamp(creature.currentHp + LEVEL_STEP * amount, 0, nextMaxHp),
    attack: creature.attack + LEVEL_STEP * amount,
    defense: creature.defense + LEVEL_STEP * amount,
    speed: creature.speed + LEVEL_STEP * amount,
  };
}

export function teamGainLevel(team, amount = 1) {
  return team.map((creature) => levelUpCreature(creature, amount));
}

export function teamFromPreset(level = PLAYER_START_LEVEL) {
  return FIXED_PLAYER_TEAM.map((id) => makeCreature(id, level));
}

export function teamFromSelection(selection = FIXED_PLAYER_TEAM, level = PLAYER_START_LEVEL) {
  const picked = [];
  for (const id of selection) {
    if (PLAYABLE_CREATURE_IDS.includes(id) && !picked.includes(id)) picked.push(id);
  }
  for (const id of FIXED_PLAYER_TEAM) {
    if (!picked.includes(id)) picked.push(id);
  }
  for (const id of PLAYABLE_CREATURE_IDS) {
    if (!picked.includes(id)) picked.push(id);
  }
  return picked.slice(0, 3).map((id) => makeCreature(id, level));
}

export function enemyTeamForTrainer(index) {
  const trainer = TRAINERS[index];
  return trainer.team.map((id, teamIndex) => makeCreature(id, trainer.levels?.[teamIndex] ?? trainer.levels?.[0] ?? PLAYER_START_LEVEL));
}
