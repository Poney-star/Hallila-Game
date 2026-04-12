import { APP_TITLE, FIXED_PLAYER_TEAM, PLAYABLE_CREATURE_IDS, TRAINERS, WORLD } from './data.js';
import { buildLog, teamFromPreset, teamFromSelection, makeTurnBlock } from './helpers.js';

const CUSTOM_TEAM_UNLOCK_KEY = 'kawaiimon_custom_team_unlocked';

function readCustomTeamUnlock() {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    return window.localStorage.getItem(CUSTOM_TEAM_UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

function writeCustomTeamUnlock(value) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (value) {
      window.localStorage.setItem(CUSTOM_TEAM_UNLOCK_KEY, '1');
    } else {
      window.localStorage.removeItem(CUSTOM_TEAM_UNLOCK_KEY);
    }
  } catch {
    // ignore storage issues
  }
}

function defaultCustomTeamSelection() {
  return FIXED_PLAYER_TEAM.slice(0, 3);
}

function makePlayerState() {
  return {
    x: WORLD.spawn.x,
    y: WORLD.spawn.y,
    size: { w: 80, h: 128 },
    speed: 220,
    direction: 'down',
    walking: false,
    spriteFrame: 0,
    spriteTimer: 0,
  };
}

export const state = {
  appTitle: APP_TITLE,
  screen: 'title',
  playerTeam: [],
  enemyTeam: [],
  battleTrainerIndex: null,
  playerActive: 0,
  enemyActive: 0,
  logs: [buildLog('Bienvenue dans le Dôme Kawaii.')],
  turnFeed: [makeTurnBlock('system', 'Bienvenue', ['Entre dans l\'arène et déclenche le premier duel.'])],
  turnNumber: 1,
  isResolvingTurn: false,
  battleIntroDone: true,
  customTeamUnlocked: readCustomTeamUnlock(),
  customTeamSelection: defaultCustomTeamSelection(),
  activeTeamSlot: 0,
  justUnlockedCustomTeam: false,
  worldMessage: "Déplace-toi dans l'arène, affronte les dresseurs et utilise le bouton Soin rapide quand tu veux.",
  player: makePlayerState(),
  keys: new Set(),
  lastFrame: 0,
  defeatedTrainers: [],
  totalEnemyDefeated: 0,
  rematchDeclinedTrainerId: null,
  modal: null,
  tickHandle: null,
};

export function resetState() {
  state.screen = 'title';
  state.playerTeam = [];
  state.enemyTeam = [];
  state.battleTrainerIndex = null;
  state.playerActive = 0;
  state.enemyActive = 0;
  state.logs = [buildLog('Bienvenue dans le Dôme Kawaii.')];
  state.turnFeed = [makeTurnBlock('system', 'Bienvenue', ['Entre dans l\'arène et déclenche le premier duel.'])];
  state.turnNumber = 1;
  state.isResolvingTurn = false;
  state.battleIntroDone = true;
  state.customTeamUnlocked = readCustomTeamUnlock();
  state.customTeamSelection = defaultCustomTeamSelection();
  state.activeTeamSlot = 0;
  state.justUnlockedCustomTeam = false;
  state.worldMessage = "Déplace-toi dans l'arène, affronte les dresseurs et utilise le bouton Soin rapide quand tu veux.";
  state.player = makePlayerState();
  state.defeatedTrainers = [];
  state.totalEnemyDefeated = 0;
  state.rematchDeclinedTrainerId = null;
  state.modal = null;
}

export function setActiveTeamSlot(slot) {
  state.activeTeamSlot = Math.max(0, Math.min(2, slot));
}

export function setCustomTeamCreature(creatureId) {
  if (!state.customTeamUnlocked) return;
  if (!PLAYABLE_CREATURE_IDS.includes(creatureId)) return;

  const next = [...state.customTeamSelection];
  const targetIndex = state.activeTeamSlot;
  const existingIndex = next.indexOf(creatureId);

  if (existingIndex !== -1 && existingIndex !== targetIndex) {
    [next[targetIndex], next[existingIndex]] = [next[existingIndex], next[targetIndex]];
  } else {
    next[targetIndex] = creatureId;
  }

  state.customTeamSelection = next;
}

export function unlockCustomTeamMode() {
  state.customTeamUnlocked = true;
  state.justUnlockedCustomTeam = true;
  writeCustomTeamUnlock(true);
}

export function startAdventure() {
  state.playerTeam = state.customTeamUnlocked
    ? teamFromSelection(state.customTeamSelection)
    : teamFromPreset();
  state.enemyTeam = [];
  state.battleTrainerIndex = null;
  state.playerActive = 0;
  state.enemyActive = 0;
  const teamLabel = state.playerTeam.map((creature) => creature.name).join(', ');
  const leader = state.playerTeam[0]?.name ?? 'Millie';
  state.logs = [buildLog(`Eitan entre dans le Dôme Kawaii avec ${teamLabel}.`)];
  state.turnFeed = [makeTurnBlock('system', 'Ouverture', [`Eitan entre dans le Dôme Kawaii avec ${teamLabel}.`])];
  state.turnNumber = 1;
  state.isResolvingTurn = false;
  state.battleIntroDone = true;
  state.player = makePlayerState();
  state.defeatedTrainers = [];
  state.totalEnemyDefeated = 0;
  state.rematchDeclinedTrainerId = null;
  state.modal = null;
  state.worldMessage = state.customTeamUnlocked
    ? `Équipe perso active. ${leader} mène l'aventure.`
    : `Mode histoire verrouillé. ${leader}, Nala et Snoopy doivent finir le jeu une première fois.`;
  state.screen = 'world';
}

export function openRematchPrompt(trainerId) {
  state.modal = { kind: 'rematch', trainerId };
}

export function closeModal() {
  state.modal = null;
}

export function setRematchDeclinedTrainer(trainerId = null) {
  state.rematchDeclinedTrainerId = trainerId;
}

export function currentTrainer() {
  return state.battleTrainerIndex === null ? null : TRAINERS[state.battleTrainerIndex];
}

export function bossUnlocked() {
  return state.defeatedTrainers.filter((id) => id !== 'magnus').length >= 3;
}
