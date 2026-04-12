import { MOVES, TRAINERS } from './data.js';
import { state, unlockCustomTeamMode } from './state.js';
import {
  clamp,
  stageMultiplier,
  randomChoice,
  buildLog,
  firstAliveIndex,
  aliveCount,
  copyTeam,
  statusLabel,
  enemyTeamForTrainer,
  makeTurnBlock,
  teamGainLevel,
} from './helpers.js';
import { effectiveness } from './types.js';

const TURN_STEP_DELAY = 220;
const ATTACK_DEBOUNCE = 110;

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function canAct(unit) {
  if (unit.fainted || unit.currentHp <= 0) return { ok: false, reason: 'K.O.' };
  if (unit.status === 'freeze' && Math.random() < 0.65) return { ok: false, reason: 'gel' };
  if (unit.status === 'paralyze' && Math.random() < 0.3) return { ok: false, reason: 'paralysie' };
  if (unit.status === 'confuse' && Math.random() < 0.35) return { ok: false, reason: 'confusion' };
  return { ok: true };
}

function pushFeedBlock(kind, title, lines = []) {
  state.turnFeed = [...state.turnFeed, makeTurnBlock(kind, title, lines)].slice(-6);
}

function rowForMove(moveId) {
  const move = MOVES[moveId];
  return `${move.name} • ${move.type}`;
}

function typeKey(type) {
  return (type || 'normal')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '');
}

function classifyMoveGroup(move) {
  if (!move) return 'offensive';
  if (move.power > 0) {
    if (move.effect?.drainOverTime) return 'terrain';
    return 'offensive';
  }
  if (move.effect?.buffAttack || move.effect?.buffDefense || move.effect?.buffSpeed || move.effect?.heal) return 'renforcement';
  if (move.effect?.status || move.effect?.debuffAttack || move.effect?.debuffDefense || move.effect?.debuffSpeed) return 'controle';
  if (move.effect?.dodgeNext) return 'renforcement';
  return 'terrain';
}

function spawnMoveFx({ attackerSide, defenderSide, move, group }) {
  const stage = document.querySelector('.battle-stage');
  const layer = stage?.querySelector('.battle-fx-layer');
  if (!stage || !layer) return null;

  const node = document.createElement('div');
  const fxType = typeKey(move.type);
  node.className = `move-fx move-fx-type-${fxType} move-fx-group-${group} move-fx-from-${attackerSide} move-fx-to-${defenderSide}`;
  node.setAttribute('data-fx-type', move.type);
  node.setAttribute('data-fx-group', group);
  node.style.setProperty('--move-fx-image', `url('./assets/fx/${fxType}_${group}.png')`);
  layer.appendChild(node);

  stage.classList.remove('stage-fx-impulse', 'stage-fx-terrain', 'stage-fx-renforcement', 'stage-fx-controle');
  stage.classList.add('stage-fx-impulse', `stage-fx-${group}`);
  return { stage, node };
}

function cleanupMoveFx(payload) {
  if (!payload) return;
  payload.node?.remove();
  payload.stage?.classList.remove('stage-fx-impulse', 'stage-fx-terrain', 'stage-fx-renforcement', 'stage-fx-controle');
}

async function animateAttack(attackerSide, defenderSide, moveId) {
  const attacker = document.querySelector(`[data-battle-side="${attackerSide}"]`);
  const defender = document.querySelector(`[data-battle-side="${defenderSide}"] .creature-stand`);
  const move = MOVES[moveId];
  const group = classifyMoveGroup(move);
  const fx = spawnMoveFx({ attackerSide, defenderSide, move, group });
  if (!attacker || !defender) {
    await wait(TURN_STEP_DELAY);
    cleanupMoveFx(fx);
    return;
  }

  if (group === 'offensive') {
    attacker.classList.add('attack-lunge');
    await wait(ATTACK_DEBOUNCE);
    defender.classList.add('attack-hit');
    await wait(130);
    attacker.classList.remove('attack-lunge');
    defender.classList.remove('attack-hit');
  } else if (group === 'renforcement') {
    attacker.classList.add('attack-buff');
    await wait(250);
    attacker.classList.remove('attack-buff');
  } else if (group === 'terrain') {
    attacker.classList.add('attack-cast');
    await wait(120);
    defender.classList.add('attack-hit-soft');
    await wait(210);
    attacker.classList.remove('attack-cast');
    defender.classList.remove('attack-hit-soft');
  } else {
    attacker.classList.add('attack-cast');
    await wait(90);
    defender.classList.add('attack-hit');
    await wait(160);
    attacker.classList.remove('attack-cast');
    defender.classList.remove('attack-hit');
  }

  cleanupMoveFx(fx);
  await wait(90);
}

function applyEndTurnStatus(unit, logs, sourceName) {
  if (unit.fainted || unit.currentHp <= 0) return unit;
  const next = { ...unit };

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
  if (healingMove && enemy.currentHp < enemy.maxHp * 0.45 && Math.random() < 0.7) return healingMove;
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
    if (typeBonus >= 1.35) note = " C'est très efficace.";
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
      const healAmount = Math.max(1, Math.round(nextAttacker.maxHp * 0.4));
      nextAttacker.currentHp = clamp(nextAttacker.currentHp + healAmount, 0, nextAttacker.maxHp);
      logs.push(buildLog(`${attackerName} récupère ${healAmount} PV (40% max).`));
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

export function beginBattle(index) {
  const trainer = TRAINERS[index];
  const freshEnemyTeam = enemyTeamForTrainer(index);
  state.battleTrainerIndex = index;
  state.enemyTeam = freshEnemyTeam;
  state.enemyActive = firstAliveIndex(freshEnemyTeam);
  state.playerActive = firstAliveIndex(state.playerTeam);
  state.turnNumber = 1;
  state.battleIntroDone = false;
  state.turnFeed = [
    makeTurnBlock('system', `${trainer.name} entre en scène`, [`« ${trainer.intro} »`]),
    makeTurnBlock('enemy', `${trainer.name} ouvre le bal`, [`${trainer.name} envoie ${freshEnemyTeam[0].name} niveau ${freshEnemyTeam[0].level}.`]),
    makeTurnBlock('player', 'Équipe de Eitan', [`Eitan envoie ${state.playerTeam[state.playerActive].name} niveau ${state.playerTeam[state.playerActive].level}.`]),
  ];
  state.logs = [
    buildLog(`${trainer.name} s'avance dans l'arène.`),
    buildLog(`« ${trainer.intro} »`),
    buildLog(`${trainer.name} envoie ${freshEnemyTeam[0].name} niveau ${freshEnemyTeam[0].level}.`),
  ];
  state.screen = 'battle';
}

export function healTeam(message) {
  state.playerTeam = state.playerTeam.map((c) => ({ ...c, currentHp: c.maxHp, fainted: false, status: null, seeded: false, dodgeNext: false }));
  state.worldMessage = message || "Le coeur rose diffuse une lumière pixelisée. Toute l'équipe est soignée.";
}

function rewardEnemyKnockout(enemyName, team, activeIndex) {
  state.totalEnemyDefeated += 1;
  const lines = [`${enemyName} est vaincu. Total K.O. adverses : ${state.totalEnemyDefeated}.`];
  let nextTeam = team;

  if (state.totalEnemyDefeated % 2 === 0) {
    nextTeam = teamGainLevel(team, 1);
    const levelLine = nextTeam.map((creature) => `${creature.name} passe niveau ${creature.level}`).join(' • ');
    lines.push("Toute l'équipe gagne 1 niveau après 2 Pokémon vaincus.");
    lines.push(levelLine);
  }

  pushFeedBlock('system', "Récompense d'équipe", lines);
  return {
    team: nextTeam,
    active: activeIndex >= 0 && nextTeam[activeIndex] ? { ...nextTeam[activeIndex] } : null,
  };
}

export function switchCreature(index) {
  if (state.screen !== 'battle' || state.isResolvingTurn) return;
  if (index === state.playerActive) return;
  const current = state.playerTeam[state.playerActive];
  const target = state.playerTeam[index];
  if (!target || target.fainted || target.currentHp <= 0) return;
  state.playerActive = index;
  state.turnFeed = [makeTurnBlock('player', 'Changement', [`Eitan rappelle ${current.name} et envoie ${target.name}.`])];
}
function markHubComplete() {
  try {
    window.localStorage.setItem('hallilaa.completed.kawaiimon', '1');
  } catch (error) {}
}
function finishTrainerBattle(index, newPlayerTeam) {
  const trainer = TRAINERS[index];
  state.playerTeam = newPlayerTeam;
  if (!state.defeatedTrainers.includes(trainer.id)) {
    state.defeatedTrainers.push(trainer.id);
  }

  if (trainer.boss) {
    const firstClearUnlock = !state.customTeamUnlocked;
    if (firstClearUnlock) {
      unlockCustomTeamMode();
      pushFeedBlock('system', 'Mode équipe perso débloqué', ['Nouvelle partie disponible : tu peux maintenant créer ton équipe de 3 Pokémon.']);
    }
    pushFeedBlock('system', 'Arène libérée', [`${trainer.name} tombe à genoux. Le Dôme Kawaii se fissure enfin.`]);
    markHubComplete();
    state.screen = 'victory';
    return;
  }
  
  state.worldMessage = `${trainer.name} est vaincu. Repasse la voir pour relancer un combat et booster ton équipe.`;
  state.screen = 'world';
}

export async function performTurn(playerMoveId, commit = () => {}) {
  if (state.battleTrainerIndex === null) return;

  const battleTrainer = TRAINERS[state.battleTrainerIndex];
  let pTeam = copyTeam(state.playerTeam);
  let eTeam = copyTeam(state.enemyTeam);
  let pIndex = state.playerActive;
  let eIndex = state.enemyActive;
  let p = { ...pTeam[pIndex] };
  let e = { ...eTeam[eIndex] };
  state.turnFeed = [];
  commit();

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
    state.playerTeam = copyTeam(pTeam);
    state.enemyTeam = copyTeam(eTeam);
    state.playerActive = pIndex;
    state.enemyActive = eIndex;
  }

  async function resolveAction({ attackerSide, defenderSide, moveId, attackerName, defenderName, fromPlayer }) {
    await animateAttack(attackerSide, defenderSide, moveId);
    const actionLogs = [];
    if (fromPlayer) {
      ({ attacker: p, defender: e } = applyMove({ attacker: p, defender: e, moveId, attackerName, defenderName, logs: actionLogs }));
    } else {
      ({ attacker: e, defender: p } = applyMove({ attacker: e, defender: p, moveId, attackerName, defenderName, logs: actionLogs }));
    }
    writeBack();
    pushFeedBlock(attackerSide, rowForMove(moveId), actionLogs.map((entry) => entry.text));
    commit();
    await wait(TURN_STEP_DELAY);
  }

  if (playerFirst) {
    await resolveAction({ attackerSide: 'player', defenderSide: 'enemy', moveId: playerMoveId, attackerName: p.name, defenderName: e.name, fromPlayer: true });
    if (!e.fainted) {
      await resolveAction({ attackerSide: 'enemy', defenderSide: 'player', moveId: enemyMoveId, attackerName: e.name, defenderName: p.name, fromPlayer: false });
    }
  } else {
    await resolveAction({ attackerSide: 'enemy', defenderSide: 'player', moveId: enemyMoveId, attackerName: e.name, defenderName: p.name, fromPlayer: false });
    if (!p.fainted) {
      await resolveAction({ attackerSide: 'player', defenderSide: 'enemy', moveId: playerMoveId, attackerName: p.name, defenderName: e.name, fromPlayer: true });
    }
  }

  const endTurnLogs = [];
  p = applyEndTurnStatus(p, endTurnLogs, p.name);
  e = applyEndTurnStatus(e, endTurnLogs, e.name);
  writeBack();

  if (endTurnLogs.length) {
    pushFeedBlock('system', 'Fin de tour', endTurnLogs.map((entry) => entry.text));
    commit();
    await wait(TURN_STEP_DELAY);
  }

  if (e.fainted || e.currentHp <= 0) {
    const reward = rewardEnemyKnockout(e.name, pTeam, pIndex);
    pTeam = reward.team;
    if (reward.active) {
      p = reward.active;
    }
    writeBack();
    commit();
    await wait(TURN_STEP_DELAY);

    const nextEnemy = firstAliveIndex(eTeam);
    if (nextEnemy !== -1) {
      eIndex = nextEnemy;
      e = { ...eTeam[eIndex] };
      writeBack();
      pushFeedBlock('enemy', 'Renfort adverse', [`${battleTrainer.name} envoie ${eTeam[eIndex].name} niveau ${eTeam[eIndex].level}.`]);
      commit();
      await wait(TURN_STEP_DELAY);
    }
  }

  if (p.fainted || p.currentHp <= 0) {
    const nextPlayer = firstAliveIndex(pTeam);
    if (nextPlayer !== -1) {
      pIndex = nextPlayer;
      p = { ...pTeam[pIndex] };
      writeBack();
      pushFeedBlock('player', 'Remplacement', [`Eitan envoie ${pTeam[pIndex].name} niveau ${pTeam[pIndex].level}.`]);
      commit();
      await wait(TURN_STEP_DELAY);
    }
  }

  if (aliveCount(pTeam) <= 0) {
    state.playerTeam = pTeam;
    state.enemyTeam = eTeam;
    state.turnFeed = [makeTurnBlock('system', 'Défaite', ['Toute ton équipe est K.O.'])];
    state.screen = 'defeat';
    return;
  }

  if (aliveCount(eTeam) <= 0) {
    finishTrainerBattle(state.battleTrainerIndex, pTeam);
    commit();
    return;
  }

  state.playerTeam = pTeam;
  state.enemyTeam = eTeam;
  state.playerActive = pIndex;
  state.enemyActive = eIndex;
  state.turnNumber += 1;
}
