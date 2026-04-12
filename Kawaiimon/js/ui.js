import { APP_TITLE, FIXED_PLAYER_TEAM, PLAYABLE_CREATURE_IDS, TRAINERS, TRAINER_ART, CREATURES, MOVES, WORLD, PLAYER_SPRITE, playerSpritePose, PLAYER_START_LEVEL } from './data.js';
import { badge } from './types.js';
import { state, startAdventure, resetState, bossUnlocked, setActiveTeamSlot, setCustomTeamCreature, closeModal, setRematchDeclinedTrainer } from './state.js';
import { healthPct, statusLabel } from './helpers.js';
import { performTurn, switchCreature, healTeam, beginBattle } from './battle.js';

function sprite(creature, small = false) {
  const cls = `sprite-block${small ? ' small' : ''}`;
  if (creature.image) {
    return `<div class="${cls}"><img src="${creature.image}" alt="${creature.name}" /></div>`;
  }
  return `<div class="${cls}"><div class="sprite-fallback">${creature.glyph || creature.name.slice(0, 2).toUpperCase()}</div></div>`;
}

function typeKey(type) {
  return (type || 'normal')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '');
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
function trainerLevelSummary(trainer) {
  if (!trainer?.levels?.length) return 'Niveaux variables';
  return trainer.levels.map((level, index) => index === trainer.levels.length - 1 ? `Lv ${level} final` : `Lv ${level}`).join(' • ');
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
              <div class="trainer-preview-role">${trainer.title}</div><div class="trainer-preview-role">${trainerLevelSummary(trainer)}</div>
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
          const flag = defeated ? 'Rejouable' : locked ? 'Bloqué' : trainer.boss ? 'Boss' : 'Actif';
          return `<div class="pixel-box progress-item"><div class="progress-top"><div><div style="font-weight:900;text-transform:uppercase;">${trainer.name}</div><div style="color:#6a3f74;">${trainer.title}</div><div style="color:#8d4a8f;font-size:0.72rem;margin-top:4px;">${trainerLevelSummary(trainer)}</div></div><div style="font-weight:900;text-transform:uppercase;">${flag}</div></div></div>`;
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
          const disabled = creature.fainted || creature.currentHp <= 0 || state.isResolvingTurn;
          return `<button class="pixel-panel member-card ${state.playerActive === index ? 'active' : ''} ${disabled ? 'disabled' : ''}" ${interactive ? `data-switch="${index}"` : ''} ${interactive && disabled ? 'disabled' : ''}>
            <div class="member-row">
              <div style="display:flex;gap:10px;align-items:start;">${sprite(creature, true)}<div><div class="member-title">${creature.name} <span style="font-size:0.8rem;opacity:0.8;">Lv ${creature.level}</span></div><div class="member-sub">${creature.title}</div></div></div>
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
  if (!state.customTeamUnlocked) {
    return `
      <div class="screen-grid two-col">
        <div class="pixel-panel panel-pad">
          <div class="tag">Mode histoire</div>
          <h2 class="section-title" style="margin-top:18px;">Première aventure verrouillée</h2>
          <p class="big-copy">Au premier lancement, tu dois obligatoirement finir le jeu avec <strong>Millie</strong>, <strong>Nala</strong> et <strong>Snoopy</strong>. Ton équipe démarre <strong>niveau ${PLAYER_START_LEVEL}</strong>. Une fois Magnus battu, le mode équipe perso se débloque au redémarrage.</p>
          <div class="stat-grid three" style="margin-top:14px;">
            <div class="pixel-box stat-box"><div class="micro-title" style="color:#a12166;">Run 1</div><div style="margin-top:6px;font-weight:900;">Millie / Nala / Snoopy</div><div style="margin-top:6px;color:#6a3f74;">Tous niveau ${PLAYER_START_LEVEL}</div></div>
            <div class="pixel-box stat-box"><div class="micro-title" style="color:#a12166;">Déblocage</div><div style="margin-top:6px;font-weight:900;">Bats Magnus</div><div style="margin-top:6px;color:#6a3f74;">Team boss jusqu'à Lv 16</div></div>
            <div class="pixel-box stat-box"><div class="micro-title" style="color:#a12166;">Run 2</div><div style="margin-top:6px;font-weight:900;">Équipe perso</div></div>
          </div>
          <div style="margin-top:18px;"><button class="pixel-button" data-action="start">Lancer le mode histoire</button></div>
        </div>
        <div class="pixel-dark panel-pad">
          <div class="micro-title" style="color:#ffc9e5;">Équipe imposée</div>
          <div class="pixel-box" style="margin-top:14px;padding:14px;background:#692b84;color:white;">
            <div class="stack">
              ${FIXED_PLAYER_TEAM.map((id, index) => `<div class="pixel-box" style="padding:8px;background:${index === 0 ? '#ff7fc7' : '#7a2d95'};color:white;display:flex;align-items:center;gap:10px;">${sprite(CREATURES[id], true)}<span>${index === 0 ? 'Lead' : 'Partenaire'} • ${CREATURES[id].name} • ${CREATURES[id].type} • Lv ${PLAYER_START_LEVEL}</span></div>`).join('')}
            </div>
            <p class="big-copy" style="color:#ffe4f5;margin-top:14px;">Les dresseuses sont scalées: H1 niveau 6 puis 8, H2 niveau 8 puis 10, H3 niveau 10 puis 12, et le boss monte jusqu'au niveau 16. Tous les 2 Pokémon vaincus, toute ton équipe gagne +1 niveau.</p>
          </div>
        </div>
      </div>
    `;
  }

  const slotCreatures = state.customTeamSelection.map((id) => CREATURES[id]);
  const activeCreature = slotCreatures[state.activeTeamSlot] || slotCreatures[0];

  return `
    <div class="screen-grid two-col">
      <div class="pixel-panel panel-pad">
        <div class="tag">Mode équipe perso débloqué</div>
        <h2 class="section-title" style="margin-top:18px;">Crée ton équipe de 3</h2>
        <p class="big-copy">Magnus est déjà tombé une fois. Maintenant tu peux composer librement ton équipe avec tous les Pokémon disponibles dans le jeu, puis relancer l'aventure avec ton trio. Toute nouvelle équipe démarre niveau ${PLAYER_START_LEVEL}.</p>
        <div class="team-slot-grid" style="margin-top:16px;">
          ${state.customTeamSelection.map((id, index) => {
            const creature = CREATURES[id];
            const active = index === state.activeTeamSlot;
            return `<button class="pixel-panel team-slot-card ${active ? 'active' : ''}" data-team-slot="${index}">
              <div class="team-slot-head">Slot ${index + 1} • Lv ${PLAYER_START_LEVEL}</div>
              <div style="display:flex;gap:10px;align-items:center;">${sprite(creature, true)}<div><div class="choice-card-title">${creature.name}</div><div class="choice-card-desc">${creature.title} • Lv ${PLAYER_START_LEVEL}</div></div></div>
              <div style="margin-top:10px;">${badge(creature.type)}</div>
            </button>`;
          }).join('')}
        </div>
        <div class="starter-roster" style="margin-top:16px;">
          ${PLAYABLE_CREATURE_IDS.map((id) => {
            const creature = CREATURES[id];
            const picked = state.customTeamSelection.includes(id);
            const active = activeCreature?.id === id;
            return `<button class="pixel-panel starter-card ${active ? 'active' : ''} ${picked ? 'picked' : ''}" data-roster-pick="${id}">
              <div style="display:flex;gap:12px;align-items:center;">${sprite(creature, true)}<div style="text-align:left;"><div class="choice-card-title">${creature.name}</div><div class="choice-card-desc">${creature.title}</div></div></div>
              <div style="margin-top:10px;display:flex;justify-content:space-between;gap:8px;align-items:center;">${badge(creature.type)}<span class="starter-mini-stats">${picked ? 'Dans équipe' : 'Disponible'} • Lv ${PLAYER_START_LEVEL}</span></div>
            </button>`;
          }).join('')}
        </div>
        <div style="margin-top:18px;"><button class="pixel-button" data-action="start">Relancer avec cette équipe</button></div>
      </div>
      <div class="pixel-dark panel-pad">
        <div class="micro-title" style="color:#ffc9e5;">Aperçu du slot actif</div>
        <div class="pixel-box starter-preview-card" style="margin-top:14px;padding:14px;background:#692b84;color:white;">
          <div style="display:flex;gap:14px;align-items:center;">${sprite(activeCreature)}<div><div style="font-size:1.4rem;font-weight:900;text-transform:uppercase;">${activeCreature.name}</div><div style="margin-top:6px;color:#ffe4f5;">${activeCreature.title}</div><div style="margin-top:6px;color:#ffd7f2;">Niveau de départ ${PLAYER_START_LEVEL}</div><div style="margin-top:8px;">${badge(activeCreature.type)}</div></div></div>
          <div class="starter-stat-list" style="margin-top:14px;">
            <div class="pixel-box" style="padding:8px;background:#7a2d95;color:white;">PV ${activeCreature.hp}</div>
            <div class="pixel-box" style="padding:8px;background:#7a2d95;color:white;">ATK ${activeCreature.attack}</div>
            <div class="pixel-box" style="padding:8px;background:#7a2d95;color:white;">DEF ${activeCreature.defense}</div>
            <div class="pixel-box" style="padding:8px;background:#7a2d95;color:white;">VIT ${activeCreature.speed}</div>
          </div>
          <div class="micro-title" style="color:#ffc9e5;margin-top:14px;">Attaques</div>
          <div class="stack" style="margin-top:10px;">
            ${activeCreature.moves.map((moveId) => {
              const move = MOVES[moveId];
              return `<div class="pixel-box" style="padding:8px;background:#7a2d95;color:white;display:grid;gap:4px;"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;"><strong>${move.name}</strong>${badge(move.type)}</div><div style="color:#ffe4f5;font-size:0.72rem;">${move.text}</div></div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function battleIntroCinematic(trainer, player) {
  return `
    <div class="battle-intro-overlay">
      <div class="battle-intro-card enemy">
        ${hiddenPortrait(trainer, true)}
        <div class="battle-intro-copy">${trainer.name} te défie ! ${trainerLevelSummary(trainer)}</div>
      </div>
      <div class="battle-intro-flash">VS</div>
      <div class="battle-intro-card player">
        <div class="battle-intro-player-art">${sprite(player)}</div>
        <div class="battle-intro-copy">Eitan envoie ${player.name} niveau ${player.level} !</div>
      </div>
    </div>
  `;
}

function worldScreen() {
  const pose = playerSpritePose(state.player);
  const frameX = pose.x * PLAYER_SPRITE.frameWidth;
  const frameY = pose.y * PLAYER_SPRITE.frameHeight;
  const scale = 2;
  const bgWidth = PLAYER_SPRITE.frameWidth * PLAYER_SPRITE.columns * scale;
  const bgHeight = PLAYER_SPRITE.frameHeight * PLAYER_SPRITE.rows * scale;
  const flip = pose.mirror ? 'scaleX(-1)' : 'scaleX(1)';
  
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
            <div class="world-player ${state.player.walking ? 'walking' : ''}" id="playerAvatar">
              <div class="world-player-label">Eitan</div>
              <div class="world-player-sprite" style="background-image:url('${PLAYER_SPRITE.image}');background-position:-${frameX * scale}px -${frameY * scale}px;background-size:${bgWidth}px ${bgHeight}px;transform:${flip};"></div>
            </div>
          </div>
          <div class="dialog-box">${state.worldMessage}</div><div class="world-quick-hint">Caméra centrée sur Eitan • ZQSD / WASD / flèches • <strong>H</strong> pour soigner.</div>
          <div class="footer-note">Sprite animé en 4 temps, déplacements fluides et fond kawaii pour l'exploration.</div>
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

function battleFeed() {
  return `
    <div class="battle-feed-wrap pixel-panel panel-pad">
      <div class="battle-feed-head">
        <div>
          <div class="micro-title" style="color:#5a1e6d;">Tour ${state.turnNumber}</div>
          <div class="battle-feed-sub">Séquence d'attaques en cours</div>
        </div>
        <div class="battle-feed-pulse ${state.isResolvingTurn ? 'live' : ''}">${state.isResolvingTurn ? 'Résolution...' : 'Prêt'}</div>
      </div>
      <div class="battle-feed-list">
        ${state.turnFeed.map((block) => `
          <div class="turn-block ${block.kind}">
            <div class="turn-block-title">${block.title}</div>
            <div class="turn-block-lines">${block.lines.map((line) => `<div class="turn-line">${line}</div>`).join('')}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function battleScreen() {
  const trainer = TRAINERS[state.battleTrainerIndex];
  const player = state.playerTeam[state.playerActive];
  const enemy = state.enemyTeam[state.enemyActive];
  const introLocked = !state.battleIntroDone;
  return `
    <div class="screen-grid battle">
      <div class="panel-dark panel-pad battle-main">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;">
          <div><div class="micro-title" style="color:#ffd4f3;">Combat</div><div style="margin-top:6px;font-size:1.8rem;font-weight:900;text-transform:uppercase;">Eitan vs ${trainer.name}</div></div>
          ${badge(trainer.boss ? 'Ténèbres' : 'Psy')}
        </div>
        <div class="battle-stage" style="margin-top:14px;">
          <div class="battle-fx-layer" aria-hidden="true"></div>
          <div class="battle-bg">
            ${introLocked ? battleIntroCinematic(trainer, player) : ''}
            <div class="battle-stage-inner"><div class="battle-vs ${state.battleIntroDone ? 'done' : ''}">VS</div>
              <div class="battle-actor player" data-battle-side="player">
                <div class="status-card">
                  <div class="status-name"><div><h3>${player.name} <span style="font-size:0.9rem;opacity:0.8;">Lv ${player.level}</span></h3><div class="status-sub">${player.title}</div></div>${badge(player.type)}</div>
                  <div class="meter"><div style="width:${healthPct(player)}%"></div></div>
                  <div class="hp-text">PV ${player.currentHp} / ${player.maxHp}</div>
                  ${player.status ? `<div class="status-text">État : ${statusLabel(player.status)}</div>` : ''}
                </div>
                <div class="creature-stand type-aura-${typeKey(player.type)}" data-creature-type="${player.type}">${player.image ? `<img src="${player.image}" alt="${player.name}" />` : `<div class="creature-fallback">${player.glyph}</div>`}</div>
              </div>
              <div class="battle-actor enemy" data-battle-side="enemy">
                <div class="creature-stand type-aura-${typeKey(enemy.type)}" data-creature-type="${enemy.type}">${enemy.image ? `<img src="${enemy.image}" alt="${enemy.name}" />` : `<div class="creature-fallback">${enemy.glyph}</div>`}</div>
                <div class="status-card">
                  <div class="status-name"><div><h3>${enemy.name} <span style="font-size:0.9rem;opacity:0.8;">Lv ${enemy.level}</span></h3><div class="status-sub">${enemy.title}</div></div>${badge(enemy.type)}</div>
                  <div class="meter"><div style="width:${healthPct(enemy)}%"></div></div>
                  <div class="hp-text">PV ${enemy.currentHp} / ${enemy.maxHp}</div>
                  ${enemy.status ? `<div class="status-text">État : ${statusLabel(enemy.status)}</div>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
        ${battleFeed()}
        <div class="pixel-panel panel-pad battle-command-card" style="margin-top:16px;background:#5f2575;color:white;">
          <div class="micro-title" style="color:#ffe1f3;margin-bottom:10px;">${introLocked ? 'Cinématique de pré-combat...' : 'Choisir une attaque'}</div>
          <div class="move-grid">
            ${player.moves.map((moveId) => {
              const move = MOVES[moveId];
              return `<button class="move-btn ${state.isResolvingTurn || introLocked ? 'busy' : ''}" data-move="${moveId}" ${state.isResolvingTurn || introLocked ? 'disabled' : ''}><div class="move-name"><span>${move.name}</span>${badge(move.type)}</div><div class="move-desc">${move.text}</div></button>`;
            }).join('')}
          </div>
        </div>
      </div>
      <div class="sidebar battle-sidebar">
        <div class="pixel-panel panel-pad"><div class="micro-title" style="color:#5a1e6d;margin-bottom:10px;">Aperçu adverse</div>${hiddenPortrait(trainer)}<div class="pixel-box" style="margin-top:10px;padding:10px;"><div style="font-weight:900;text-transform:uppercase;">${trainer.name}</div><div style="color:#6a3f74;">${trainer.intro}</div><div style="color:#8d4a8f;font-size:0.72rem;margin-top:6px;">${trainerLevelSummary(trainer)}</div></div></div>
        ${playerTeamPanel(true)}
      </div>
    </div>
  `;
}

function victoryScreen() {
  const unlockedText = state.justUnlockedCustomTeam
    ? "Le boss est tombé. Le mode équipe perso est maintenant débloqué pour la prochaine partie."
    : "Magnus est vaincu. Le Dôme Kawaii se fissure et l'arène est enfin libre.";
  const buttonText = state.justUnlockedCustomTeam ? 'Créer mon équipe perso' : 'Rejouer';
  return `
    <div class="overlay"><div class="pixel-panel modal center"><div style="font-size:3rem;">★</div><div class="section-title" style="margin-top:10px;">Victoire</div><p class="big-copy">${unlockedText}</p><div class="modal-actions" style="justify-content:center;"><button class="pixel-button alt" data-nav="title">Retour menu</button><button class="pixel-button" data-action="restart">${buttonText}</button></div></div></div>
  `;
}

function defeatScreen() {
  return `
    <div class="overlay"><div class="pixel-panel modal center"><div style="font-size:3rem;">×</div><div class="section-title" style="margin-top:10px;">Défaite</div><p class="big-copy">L'arène t'a puni. Repars du menu ou relance une partie pour retenter ta chance contre les dresseurs.</p><div class="modal-actions" style="justify-content:center;"><button class="pixel-button alt" data-nav="title">Retour menu</button><button class="pixel-button" data-action="restart">Retour menu</button></div></div></div>
  `;
}

export function modalOverlay() {
  if (!state.modal) return '';
  if (state.modal.kind === 'rematch') {
    const trainer = TRAINERS.find((entry) => entry.id === state.modal.trainerId);
    if (!trainer) return '';
    return `
      <div class="overlay">
        <div class="pixel-panel modal center">
          <div style="font-size:2.4rem;">?</div>
          <div class="section-title" style="margin-top:10px;">${trainer.name}</div>
          <p class="big-copy">Voulez vous refaire le combat afin de booster ton equipe petit coquin ?</p>
          <div class="modal-actions" style="justify-content:center;">
            <button class="pixel-button alt" data-modal-action="rematch-no">Non</button>
            <button class="pixel-button" data-modal-action="rematch-yes" data-trainer-id="${trainer.id}">Oui</button>
          </div>
        </div>
      </div>
    `;
  }
  return '';
}

export function renderApp(root) {
  root.innerHTML = `
    <div class="shell">
      <div class="pixel-dark header">
        <div><div class="title">${APP_TITLE}</div><div class="subtitle">Pokémon-like pixel • rouge / rose / violet</div></div>
        <div class="tag-row"><span class="tag">Campagne + New Game+</span><span class="tag">Arène libre</span><span class="tag">Dresseuses filtrées</span><span class="tag">Duel visible</span></div>
      </div>
      ${state.screen === 'title' ? titleScreen() : ''}
      ${state.screen === 'world' ? worldScreen() : ''}
      ${state.screen === 'battle' ? battleScreen() : ''}
      ${state.screen === 'victory' ? victoryScreen() : ''}
      ${state.screen === 'defeat' ? defeatScreen() : ''}
      ${modalOverlay()}
    </div>
  `;

  if (state.screen === 'battle' && !state.battleIntroDone) {
    window.setTimeout(() => {
      if (state.screen !== 'battle' || state.battleIntroDone) return;
      state.battleIntroDone = true;
      renderApp(root);
    }, 1800);
  }

  root.querySelectorAll('[data-nav]').forEach((btn) => btn.addEventListener('click', () => {
    state.screen = btn.dataset.nav;
    renderApp(root);
  }));


  root.querySelectorAll('[data-team-slot]').forEach((btn) => btn.addEventListener('click', () => {
    setActiveTeamSlot(Number(btn.dataset.teamSlot));
    renderApp(root);
  }));

  root.querySelectorAll('[data-roster-pick]').forEach((btn) => btn.addEventListener('click', () => {
    setCustomTeamCreature(btn.dataset.rosterPick);
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

  root.querySelectorAll('[data-move]').forEach((btn) => btn.addEventListener('click', async () => {
    if (state.isResolvingTurn || !state.battleIntroDone) return;
    state.isResolvingTurn = true;
    renderApp(root);
    try {
      await performTurn(btn.dataset.move, () => renderApp(root));
    } finally {
      state.isResolvingTurn = false;
      renderApp(root);
    }
  }));

  root.querySelectorAll('[data-switch]').forEach((btn) => btn.addEventListener('click', () => {
    if (state.isResolvingTurn || !state.battleIntroDone) return;
    switchCreature(Number(btn.dataset.switch));
    renderApp(root);
  }));

  root.querySelectorAll('[data-modal-action]').forEach((btn) => btn.addEventListener('click', () => {
    const action = btn.dataset.modalAction;
    if (action === 'rematch-no') {
      setRematchDeclinedTrainer(state.modal?.trainerId ?? null);
      closeModal();
      renderApp(root);
      return;
    }
    if (action === 'rematch-yes') {
      const trainerId = btn.dataset.trainerId;
      const index = TRAINERS.findIndex((trainer) => trainer.id === trainerId);
      closeModal();
      setRematchDeclinedTrainer(null);
      if (index !== -1) {
        beginBattle(index);
      }
      renderApp(root);
    }
  }));
}
