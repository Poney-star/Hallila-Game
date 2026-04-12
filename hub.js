const GAMES = [
  {
    id: 'aduc',
    title: 'Aduc',
    href: './Aduc/index.html',
    icon: './Aduc.jpeg',
    top: '14%',
    left: '6%'
  },
  {
    id: 'alexouu',
    title: 'Alexouu',
    href: './Alexouu/index.html',
    icon: './Alexouu.jpeg',
    top: '35%',
    left: '10%'
  },
  {
    id: 'complothan',
    title: 'Complothan',
    href: './Complothan/index.html',
    icon: './Complothan.jpeg',
    top: '58%',
    left: '7%'
  },
  {
    id: 'kawaiimon',
    title: 'Kawaiimon',
    href: './Kawaiimon/index.html',
    icon: './Kawaiimon.jpeg',
    top: '19%',
    left: '74%'
  },
  {
    id: 'samuelbros',
    title: 'SamuelBros',
    href: './SamuelBros/index.html',
    icon: './SamuelBros.jpeg',
    top: '56%',
    left: '77%'
  },
  {
    id: 'huboboss',
    title: 'HUBO BOSSE',
    href: './Hubo Boss/index.html',
    icon: './Hubo Boss.jpeg',
    top: '37%',
    left: '45%',
    boss: true,
    requiresAll: true
  }
];

const REQUIRED = GAMES.filter(g => g.id !== 'huboboss').map(g => g.id);
const keyFor = id => `hallilaa.completed.${id}`;
const isDone = id => localStorage.getItem(keyFor(id)) === '1';
const allUnlocked = () => REQUIRED.every(isDone);

function makeIcon(game) {
  const a = document.createElement('a');
  const done = isDone(game.id);
  const locked = !!game.requiresAll && !allUnlocked();

  a.className =
    `desktop-icon${done ? ' done' : ''}${locked ? ' locked' : ''}${game.boss ? ' boss' : ''}`;
  a.style.top = game.top;
  a.style.left = game.left;
  a.href = locked ? '#' : game.href;

  a.innerHTML = `
    <div class="icon-frame">
      <img src="${game.icon}" alt="${game.title}">
    </div>
    <div class="icon-label">${game.title}</div>
  `;

  if (locked) {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      alert("Pour débloquer HUBO BOSSE, il faut d'abord gagner tous les autres jeux.");
    });
  }

  return a;
}

function render() {
  const desktop = document.getElementById('desktop');
  const progress = document.getElementById('progressText');

  desktop.querySelectorAll('.desktop-icon').forEach(el => el.remove());
  GAMES.forEach(game => desktop.appendChild(makeIcon(game)));

  const doneCount = REQUIRED.filter(isDone).length;
  progress.textContent = `${doneCount}/${REQUIRED.length} jeux terminés`;

  document.getElementById('lockNote').textContent = allUnlocked()
    ? 'HUBO BOSSE est débloqué.'
    : 'HUBO BOSSE se débloque après une victoire dans tous les autres jeux.';
}

window.addEventListener('storage', render);
window.addEventListener('DOMContentLoaded', render);