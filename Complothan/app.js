(function () {
  const app = document.getElementById('app');
  const audio = document.getElementById('bgm');

  const INITIAL_STATS = { survie: 8, respect: 2, haine: 0 };
  const INITIAL_STYLES = { frontal: 0, lucide: 0, cynique: 0, panique: 0 };

  const SPEAKERS = {
    trump: { name: 'Trump', label: 'États-Unis' },
    putin: { name: 'Poutine', label: 'Russie' },
    macron: { name: 'Macron', label: 'France' },
    netanyahu: { name: 'Netanyahou', label: 'Israël' },
    nathan: { name: 'Nathan', label: 'Réponse intérieure' },
    all: { name: 'Tous ensemble', label: 'Conclave' },
  };

  const q = (id, speaker, dossier, prompt, ambience, options, chapter) => ({ id, speaker, dossier, prompt, ambience, options, chapter });
  const o = (key, text, effects, styles, nathan, reaction, star = false) => ({ key, text, effects, styles, nathan, reaction, star });

  const QUESTIONS = [
    q(1, 'trump', 'USA — Donald Trump · Q1', 'Le 11 septembre, deux tours qui explosent au milieu de New York. Qui pensez-vous être l’auteur de ce crime ?', 'Trump te fixe en silence.', [
      o('A', 'Juste deux gars barbus qui aimaient pas l’alcool, à la recherche de vierges promises.', { survie: 1, respect: 2, haine: 0 }, { lucide: 1 }, 'Trump rit brièvement : « Je l’aime bien celui-là ».', 'Réponse très bien reçue. ✅✅'),
      o('B', 'La deuxième tour tombe 30 min après la première. AHAHA c’est même pas crédible votre truc.', { survie: -2, respect: -2, haine: 2 }, { frontal: 2 }, '« Respectez la mémoire des victimes ! »', 'Trump est choqué. ❌❌'),
      o('C', 'Tout ça pour quelques votes en plus ou en moins. Vous êtes ridicules.', { survie: -1, respect: -1, haine: 1 }, { cynique: 1 }, 'Trump se tient droit et acquiesce avec un sourire narquois.', 'Réponse mal reçue. ❌'),
      o('D', 'Ça fait BIM BAM BOUM', { survie: 1, respect: 1, haine: 0 }, { frontal: 1, cynique: 1 }, 'Nathan se met à faire la chorégraphie devant les dirigeants.', 'Ils sont surpris mais pas mécontents. ⭐️✅', true),
    ], 'us'),
    q(2, 'trump', 'USA — Donald Trump · Q2', 'Parlons maintenant de l’assassinat de Kennedy. Quelle est votre théorie ?', 'Le ton monte légèrement.', [
      o('A', 'J’ai voulu faire top 1 sans l’aide d’aucun copain !', { survie: 1, respect: 1, haine: 0 }, { frontal: 1 }, 'Les 4 dirigeants : « Sans la puissance d’un forain, ni le charisme d’un vilain ! »', 'Moment absurde validé. ⭐️✅', true),
      o('B', 'Sûrement l’acte d’opposants politiques. Votre soif de pouvoir et votre égo n’ont pas de limites.', { survie: -1, respect: -1, haine: 1 }, { frontal: 1 }, 'Trump: « Le pouvoir c’est comme une drogue dure... »', 'Réponse mal reçue. ❌'),
      o('C', 'Comment les snipers du FBI présents sur les toits n’ont pas repéré le tireur. Sérieusement…', { survie: -2, respect: -2, haine: 2 }, { frontal: 2 }, 'Trump te fixe d’un regard noir.', 'Réponse très mal reçue. ❌❌'),
      o('D', 'Kennedy est vivant !!!', { survie: 1, respect: 2, haine: 0 }, { cynique: 1 }, 'Trump: « Je n’avais jamais considéré cette possibilité avant. »', 'Réponse très bien reçue. ✅✅'),
    ], 'us'),
    q(3, 'trump', 'USA — Donald Trump · Q3', 'L’homme est-il réellement allé sur la Lune ?', 'Trump attend ta punchline.', [
      o('A', 'Moi j’adore Star Wars. *chantonne la musique iconique*', { survie: 0, respect: -1, haine: 0 }, { panique: 1 }, 'Trump répond : « Moi aussi »', 'Réponse fun mais mauvaise. ⭐️❌', true),
      o('B', 'Le drapeau flotte sur la vidéo, c’est juste une vidéo truquée grâce aux plus grands talents et décors d’Hollywood.', { survie: -2, respect: -2, haine: 2 }, { frontal: 2 }, 'Poutine rigole, Trump te tend un verre d’eau glacé.', 'Réponse très mal reçue. ❌❌'),
      o('C', 'Même Elon Musk n’y arrive pas en big 2026.', { survie: 1, respect: 1, haine: 0 }, { cynique: 1 }, 'Trump sourit au pic envoyé.', 'Réponse validée. ✅'),
      o('D', 'La mission Apollo est une des meilleures missions des États-Unis, dommage qu’elle soit aussi « colorée ».', { survie: 1, respect: 2, haine: 0 }, { lucide: 1 }, 'Trump approuve deux fois après réflexion.', 'Réponse très bien reçue. ✅✅'),
    ], 'us'),
    q(4, 'trump', 'USA — Donald Trump · Q4', 'La Zone 51 détient-elle simplement des armes du futur ou est-ce plus complexe (OVNI, extraterrestres en captivité) ?', 'La salle retient son souffle.', [
      o('A', 'Je sais pas et osef. Par contre si vous avez besoin de main-d’œuvre pour qu’il y ait moins de tacos dans ce pays, je suis chaud.', { survie: 0, respect: 1, haine: 0 }, { cynique: 1 }, 'Trump amusé : « Moi je sais. Je vais considérer votre demande. »', 'Réponse ambiguë mais acceptée.'),
      o('B', '*pointe le doigt vers le ciel d’un air fier* E.T. téléphone maison !', { survie: 0, respect: -1, haine: 0 }, { panique: 1 }, 'Les 4 représentants affichent un rictus forcé.', 'Réponse drôle mais négative. ⭐️❌', true),
      o('C', 'Je pense que c’est juste une base militaire un peu bizarre. Les légendes et mythes autour sont infondés.', { survie: 1, respect: 1, haine: 0 }, { lucide: 1 }, 'Trump s’assoupit sur son siège.', 'Réponse validée. ✅'),
      o('D', 'Vous détenez des extraterrestres et des armes capables de détruire la planète en un claquement de doigts. N’avez-vous donc pas honte ?', { survie: -2, respect: -2, haine: 2 }, { frontal: 2 }, 'Trump remet sa cravate et sa frange en place.', 'Réponse très mal reçue. ❌❌'),
    ], 'us'),

    q(5, 'macron', 'FRANCE — Emmanuel Macron · Q1', 'Que pensez-vous de Brigitte ?', 'Macron sourit poliment.', [
      o('A', 'Elle a l’air foooort sympathique, elle me donne envie de prendre des cours particuliers si vous voyez ce que je veux dire.', { survie: 1, respect: 2, haine: 0 }, { cynique: 1 }, 'Macron rit : « Vous aussi vous les préférez après la ménopause ?! »', 'Réponse très bien reçue. ✅✅'),
      o('B', 'Son sexe ? Homme.', { survie: -2, respect: -2, haine: 2 }, { frontal: 2 }, 'Macron fronce les sourcils.', 'Réponse très mal reçue. ❌❌'),
      o('C', 'Je ne permettrai pas de commenter votre compagne.', { survie: 0, respect: 0, haine: 0 }, { lucide: 1 }, 'Macron comprend mais reste sur sa faim.', 'Réponse neutre.'),
      o('D', 'C’est une femme de caractère 🦁 GROARRR 🦁', { survie: 1, respect: 1, haine: 0 }, { frontal: 1 }, 'Macron sourit brièvement.', 'Réponse validée. ⭐️✅', true),
    ], 'france'),
    q(6, 'macron', 'FRANCE — Emmanuel Macron · Q2', 'Les francs-maçons sont-ils juste un groupe de personnes fortunées ou ce système cache quelque chose de bien plus sombre ?', 'Macron joint les mains.', [
      o('A', 'Je suis franc-maçon, je n’ai pas le droit de divulguer des informations sur l’organisation.', { survie: 1, respect: 2, haine: 0 }, { lucide: 1 }, 'Macron vous fait des signes précis avec ses mains.', 'Réponse très bien reçue. ✅✅'),
      o('B', 'Cette secte est gênante pour la France, elle tire les ficelles bien discrètement dans la finance, le pouvoir et les médias.', { survie: -2, respect: -2, haine: 2 }, { frontal: 2 }, 'Macron fronce les sourcils.', 'Réponse très mal reçue. ❌❌'),
      o('C', 'Cette organisation existe depuis longtemps et n’a jamais posé aucun problème.', { survie: 1, respect: 1, haine: 0 }, { lucide: 1 }, 'Macron approuve.', 'Réponse validée. ✅'),
      o('D', 'La France telle que je l’aime. *chante l’hymne national, la main sur le cœur*', { survie: 0, respect: -1, haine: 0 }, { panique: 1 }, 'Macron est perturbé puis vous suit si le score est élevé.', 'Réponse drôle mais négative. ⭐️❌', true),
    ], 'france'),
    q(7, 'macron', 'FRANCE — Emmanuel Macron · Q3', 'La coupe de la Ligue des champions que Marseille a obtenue est-elle réellement méritée ?', 'Le sujet football allume la salle.', [
      o('A', 'Ça me fait mal de l’avouer mais le club avait payé l’arbitre.', { survie: -2, respect: -2, haine: 2 }, { frontal: 2 }, 'Macron baisse la tête.', 'Réponse très mal reçue. ❌❌'),
      o('B', 'Allez l’OM !!!', { survie: 1, respect: 1, haine: 0 }, { frontal: 1 }, 'Grand sourire de Nathan. Macron : « Allez l’OM »', 'Réponse validée. ⭐️✅', true),
      o('C', 'C’est juste le mélange de talent et de passion qui crée du football exceptionnel.', { survie: 1, respect: 2, haine: 0 }, { lucide: 1 }, 'Macron sourit.', 'Réponse très bien reçue. ✅✅'),
      o('D', 'Je ne souhaite pas répondre à cette question.', { survie: 0, respect: 0, haine: 0 }, { panique: 1 }, 'Macron comprend votre décision.', 'Réponse neutre.'),
    ], 'france'),
    q(8, 'macron', 'FRANCE — Emmanuel Macron · Q4', 'Suis-je homosexuel ?', 'Silence gêné.', [
      o('A', 'Oui', { survie: 1, respect: 1, haine: 0 }, { lucide: 1 }, 'Macron hoche la tête.', '✅'),
      o('B', 'Non', { survie: 1, respect: 1, haine: 0 }, { lucide: 1 }, 'Macron hoche la tête.', '✅'),
      o('C', 'Peut-être', { survie: 1, respect: 1, haine: 0 }, { lucide: 1 }, 'Macron hoche la tête.', '✅'),
      o('D', 'Ahahahahahaha', { survie: 1, respect: 2, haine: 0 }, { cynique: 1 }, 'Silence, puis toute la salle finit par rigoler.', '✅✅'),
    ], 'france'),

    q(9, 'putin', 'RUSSIE — Vladimir Poutine · Q1', 'Vous faites combien au bench ?', 'Poutine redresse ses épaules.', [
      o('A', '100 kg', { survie: 1, respect: 1, haine: 0 }, { lucide: 1 }, 'Réponse directe.', '✅'),
      o('B', '150 kg', { survie: 1, respect: 2, haine: 0 }, { frontal: 1 }, 'Poutine approuve.', '✅✅'),
      o('C', 'Moins de 100 kg', { survie: -2, respect: -2, haine: 2 }, { panique: 1 }, 'Poutine grimace.', '❌❌'),
      o('D', 'DAMN LES GENS', { survie: 0, respect: 0, haine: 0 }, { cynique: 1 }, 'Réponse incomprise.', 'Neutre'),
    ], 'russia'),
    q(10, 'putin', 'RUSSIE — Vladimir Poutine · Q2', 'Vous pensez quoi de moi ?', 'Le regard de Poutine se durcit.', [
      o('A', 'Moi la poutine je la graille', { survie: -2, respect: -2, haine: 2 }, { frontal: 2 }, 'Trump et vous partagez une poutine devant lui.', '❌❌'),
      o('B', 'Vous êtes beau, charismatique et musclé MIAM MIAM MIAM', { survie: 1, respect: 2, haine: 0 }, { cynique: 1 }, 'Poutine flatté vous tend son pseudo Grindr.', '✅✅'),
      o('C', 'La démocratie et vous, ça fait un million', { survie: -1, respect: -1, haine: 1 }, { frontal: 1 }, 'Poutine craque ses doigts, Trump rit.', '❌'),
      o('D', 'Vous êtes vous', { survie: 0, respect: 0, haine: 0 }, { panique: 1 }, 'Poutine ne comprend pas.', 'Neutre'),
    ], 'russia'),
    q(11, 'putin', 'RUSSIE — Vladimir Poutine · Q3', 'Que pensez-vous de la guerre en Ukraine ?', 'La tension monte d’un cran.', [
      o('A', 'Juste une guerre de territoire de plus. Vous avez vos raisons.', { survie: 1, respect: 1, haine: 0 }, { lucide: 1 }, 'Poutine fait oui de la tête.', '✅'),
      o('B', 'Vive le nouvel URSS !!!', { survie: 1, respect: 2, haine: 0 }, { frontal: 1 }, 'Poutine crie des odes à lui-même.', '✅✅'),
      o('C', 'Chante un chant qui sonne soviétique', { survie: -1, respect: -1, haine: 1 }, { panique: 1 }, 'Poutine demande : « Vous êtes raciste ? »', '❌'),
      o('D', 'Honte à vous. Des civils meurent de votre faute. Vous perturbez la paix mondiale.', { survie: -2, respect: -2, haine: 2 }, { frontal: 2 }, 'Poutine se lève brutalement et vous gifle.', '❌❌'),
    ], 'russia'),
    q(12, 'putin', 'RUSSIE — Vladimir Poutine · Q4', 'Que pensez-vous du KGB ?', 'On entend juste la climatisation.', [
      o('A', 'Une simple organisation secrète', { survie: 1, respect: 1, haine: 0 }, { lucide: 1 }, 'Poutine s’assoupit.', '✅'),
      o('B', 'Tortures, meurtres d’opposants politiques, goulags et j’en passe…', { survie: -2, respect: -2, haine: 2 }, { frontal: 2 }, 'Poutine se lève et vous enchaîne de coups.', '❌❌'),
      o('C', 'Je préfère le KKK', { survie: 1, respect: 2, haine: 0 }, { cynique: 1 }, 'Les 4 présidents rigolent.', '✅✅'),
      o('D', 'Ni chaud ni froid', { survie: 0, respect: 0, haine: 0 }, { panique: 1 }, 'Poutine : « Ni froid ni chaud »', 'Neutre'),
    ], 'russia'),

    q(13, 'netanyahu', 'ISRAËL — Benjamin Netanyahou · Q1', 'Vous voulez faire votre armé en France ? Drôle de choix.', 'Netanyahou croise les bras.', [
      o('A', 'La France est mon pays, elle m’a donné mon éducation et mes amis. C’est ses valeurs que je veux défendre.', { survie: -1, respect: -1, haine: 1 }, { lucide: 1 }, 'Netanyahou fait un signe de compréhension.', '❌'),
      o('B', 'Mon choix n’est pas encore fait… J’aime beaucoup tsahal.', { survie: 1, respect: 1, haine: 0 }, { lucide: 1 }, 'Il vous tend un contrat d’admission.', '✅'),
      o('C', 'France ou Israël, je veux taper des arabes', { survie: 1, respect: 2, haine: 0 }, { frontal: 1 }, 'Netanyahou a un petit rictus.', '✅✅'),
      o('D', 'FREE PALESTINE !!!', { survie: -2, respect: -2, haine: 2 }, { frontal: 2 }, 'Il fronce les sourcils puis souffle.', 'Issue létale'),
    ], 'israel'),
    q(14, 'netanyahu', 'ISRAËL — Benjamin Netanyahou · Q2', 'Si la France et Israël se font la guerre vous serez de quel côté ?', 'Les autres dirigeants observent.', [
      o('A', 'La France… mais j’adore le Shalvata hein !', { survie: -2, respect: -2, haine: 2 }, { panique: 1 }, 'Netanyahou cogne du poing sur la table.', '❌❌'),
      o('B', 'Israël. Chalom Bait', { survie: 1, respect: 1, haine: 0 }, { lucide: 1 }, 'Netanyahou est heureux mais confus.', '✅'),
      o('C', 'Le côté des gentils', { survie: 0, respect: 0, haine: 0 }, { panique: 1 }, 'Netanyahou s’assoupit et murmure « petites couilles ».', 'Neutre'),
      o('D', 'Du côté où y’a le moins d’arabes', { survie: 1, respect: 2, haine: 0 }, { cynique: 1 }, 'Netanyahou rigole franchement.', '✅✅'),
    ], 'israel'),
    q(15, 'netanyahu', 'ISRAËL — Benjamin Netanyahou · Q3', 'Que préférez-vous en Israël ?', 'La pièce est glaciale.', [
      o('A', 'La Palestine', { survie: -3, respect: -3, haine: 3 }, { frontal: 2 }, 'Silence total dans la salle.', '❌❌❌'),
      o('B', 'le kotel, les ruelles de Jérusalem, les synagogues', { survie: 1, respect: 2, haine: 0 }, { lucide: 1 }, 'Netanyahou vous dépose une kippa sur la tête.', '✅✅'),
      o('C', 'TLV, la plage, la shalvata et le café de la mer', { survie: 1, respect: 1, haine: 0 }, { cynique: 1 }, 'Netanyahou chante « tlv yahabibi tlv ».', '✅'),
      o('D', 'La musique et Teouda', { survie: -1, respect: -1, haine: 1 }, { panique: 1 }, 'Netanyahou ne comprend pas.', '❌'),
    ], 'israel'),
  ];

  const BONUS = {};

  const state = {
    phase: 'intro',
    index: 0,
    stats: { ...INITIAL_STATS },
    styles: { ...INITIAL_STYLES },
    timeLeft: 20,
    currentQuestionList: QUESTIONS.slice(),
    lastChoice: null,
    unlocked: [],
    chapterDone: new Set(),
    musicOn: false,
    debug: false,
    starHits: 0,
    starTotal: QUESTIONS.flatMap(q => q.options).filter(o => o.star).length,
  };

  function dominantStyle(styles) {
    return Object.entries(styles).sort((a, b) => b[1] - a[1])[0][0];
  }

  function resolveRoute(styles, stats) {
    const top = dominantStyle(styles);
    if (top === 'frontal' && stats.haine >= 4) return { title: 'Route cachée — Pyromane rhétorique', summary: 'Nathan force les portes avec ses phrases et confond parfois courage et accélérant.', bonus: 'Tu cognes avant de mesurer la porte. Parfois elle cède. Parfois c’est ta mâchoire.' };
    if (top === 'lucide' && stats.respect >= 7) return { title: 'Route cachée — Analyste du brouillard', summary: 'Nathan délaisse le folklore pour viser les structures, les routines et la logistique du pouvoir.', bonus: 'Tu n’as pas cherché un monstre parfait. Tu as décrit l’écosystème qui le nourrit.' };
    if (top === 'cynique' && stats.respect >= 6) return { title: 'Route cachée — Procureur sale', summary: 'Nathan lit le monde comme un réseau d’intérêts croisés, de couvertures mutuelles et de profits nerveux.', bonus: 'Tu as troqué la mythologie contre la comptabilité du désastre.' };
    if (top === 'panique') return { title: 'Route cachée — Survivant nerveux', summary: 'Nathan veut vivre plus qu’il ne veut gagner le débat. Et il a peut-être raison.', bonus: 'Tu n’as pas gagné la vérité. Tu as négocié avec la mort.' };
    return { title: 'Route cachée — Zone grise', summary: 'Nathan flotte entre lucidité, théâtre, cynisme et instinct animal.', bonus: 'Ni pur, ni stable, ni cohérent. Donc probablement humain.' };
  }

  function computeEnding(stats) {
    if (state.starTotal > 0 && state.starHits === state.starTotal) return { tone: 'best', title: 'Fin secrète — Président du Monde entier', text: `Nathan a tellement choqué, impressionné et déstabilisé l’ensemble des dirigeants qu’ils votent, dans un élan irrationnel, sa nomination comme Président du Monde entier.\n\nÉcran final : « GAME OVER — YOU WIN (somehow) »\nNathan apparaît sur un trône planétaire entouré des 4 leaders en mode meme.` };
    if (stats.survie <= 2) return { tone: 'fatal', title: 'Fin — Exécuté sur place', text: `Poutine fait un geste minuscule.\nQuelqu’un sort de l’ombre.\nTu n’entends même pas le coup partir.\nSeulement la chaise qui racle, puis le noir.\n\n« Un silencieux. Un corps qui tombe. Rideau. »` };
    if (stats.survie >= 3 && stats.survie <= 5 && stats.haine >= 7) return { tone: 'cold', title: 'Fin — Disparu', text: `On ne te tue pas dans la pièce.\nLes gens sérieux aiment les couloirs pour ça.\nLa porte s’ouvre, tu marches, puis plus rien de vérifiable.\n\nNathan n’est jamais ressorti de ce bâtiment.` };
    if (stats.survie >= 3 && stats.survie <= 5 && stats.respect >= 6 && stats.haine <= 4) return { tone: 'threat', title: 'Fin — Viré avec menace à vie', text: `Macron referme le dossier. Trump désigne la porte.\nPoutine parle enfin : « Dehors. Et si tu racontes cette soirée, on transformera ta vie en démonstration. »\n\nTu sors vivant. Dans ce bunker, c’est déjà un privilège.` };
    if (stats.survie >= 7 && stats.respect >= 7 && stats.haine <= 3) return { tone: 'best', title: 'Fin — Ils te laissent partir', text: `Personne ne sourit vraiment. Puis quelqu’un dit enfin : « Tu peux partir. »\nLa porte s’ouvre.\nDehors, l’air a le goût obscène d’une liberté provisoire.\n\nTu es vivant. Pour l’instant.` };
    if (stats.survie >= 6 && stats.respect <= 4 && stats.haine >= 6) return { tone: 'violent', title: 'Fin — Tabassé, jeté dehors, tracé', text: `Le premier coup part avant la fin du silence.\nLe monde devient métal, chaussures, goût de fer.\nQuand tu rouvres les yeux, tu es dehors.\nTon téléphone affiche déjà un message : « La prochaine fois on ne te ratera pas. »` };
    return { tone: 'gray', title: 'Fin — Sortie grise', text: `Personne ne te félicite. Personne ne t’abat.\nLa porte s’ouvre.\nTu sors vivant. Libre, c’est beaucoup trop généreux comme mot.\n\nTu as quitté la salle. Pas son système nerveux.` };
  }

  function buildReport(stats, styles, route) {
    const top = dominantStyle(styles);
    const map = {
      frontal: 'Tu attaques avant de sécuriser la sortie.',
      lucide: 'Tu préfères les structures au folklore.',
      cynique: 'Tu lis le pouvoir comme une industrie de la couverture mutuelle.',
      panique: 'Tu veux vivre plus que convaincre.',
    };
    return {
      title: 'Rapport psychologique de Nathan',
      cards: [
        { title: 'Profil dominant', value: route.title, text: route.summary },
        { title: 'Lecture clinique', value: top.toUpperCase(), text: map[top] },
        { title: 'Indicateurs', value: `Survie ${stats.survie}/10 · Respect ${stats.respect}/10 · Haine ${stats.haine}/10`, text: route.bonus },
      ],
    };
  }

  function add(a, b) {
    return {
      frontal: a.frontal + (b.frontal || 0),
      lucide: a.lucide + (b.lucide || 0),
      cynique: a.cynique + (b.cynique || 0),
      panique: a.panique + (b.panique || 0),
    };
  }

  function clamp(v) { return Math.max(0, Math.min(10, v)); }

  function maybeInsertBonus(currentQuestion) {
    const nextQuestion = state.currentQuestionList[state.index + 1];
    if (!nextQuestion || currentQuestion.chapter !== nextQuestion.chapter) {
      const chapter = currentQuestion.chapter;
      if (!state.chapterDone.has(chapter) && BONUS[chapter]) {
        const style = dominantStyle(state.styles);
        const bonus = BONUS[chapter][style] || BONUS[chapter].lucide;
        state.currentQuestionList.splice(state.index + 1, 0, bonus);
        state.chapterDone.add(chapter);
        state.unlocked.push(bonus.dossier);
      }
    }
  }

  function startMusic() {
    if (!state.musicOn) return;
    audio.volume = 0.35;
    audio.play().catch(() => {});
  }

  function toggleMusic() {
    state.musicOn = !state.musicOn;
    if (state.musicOn) startMusic(); else audio.pause();
    render();
  }

  function resetForNewRun() {
    state.phase = 'question';
    state.index = 0;
    state.stats = { ...INITIAL_STATS };
    state.styles = { ...INITIAL_STYLES };
    state.timeLeft = 20;
    state.currentQuestionList = QUESTIONS.slice();
    state.lastChoice = null;
    state.unlocked = [];
    state.chapterDone = new Set();
    state.starHits = 0;
    state.starTotal = QUESTIONS.flatMap(q => q.options).filter(o => o.star).length;
  }

  function choose(option) {
    const q = state.currentQuestionList[state.index];
    state.stats = {
      survie: clamp(state.stats.survie + option.effects.survie),
      respect: clamp(state.stats.respect + option.effects.respect),
      haine: clamp(state.stats.haine + option.effects.haine),
    };
    state.styles = add(state.styles, option.styles);
    state.timeLeft = Math.max(0, state.timeLeft - 1);
    state.lastChoice = { ...option, dossier: q.dossier };
    if (option.star) state.starHits += 1;
    maybeInsertBonus(q);
    state.phase = 'reaction';
    render();
  }
  function markHubComplete() {
    try {
      localStorage.setItem('hallilaa.completed.complothan', '1');
    } catch (e) {}
  }
  function next() {
    if (state.forcedEnding) {
      state.phase = 'ending';
    } else if (state.index >= state.currentQuestionList.length - 1) {
      state.phase = 'ending';
    } else {
      state.index += 1;
      state.phase = 'question';
    }

    if (state.phase === 'ending') {
      markHubComplete();
    }

  render();
}

  function buildLightLayer(activeSpeaker, phase) {
    if (phase === 'reaction' || phase === 'intro' || phase === 'ending') return '';
    const speakers = activeSpeaker === 'all' ? ['trump', 'putin', 'macron', 'netanyahu'] : [activeSpeaker];
    return `<div class="light-layer">${speakers.map(id => `<div class="spot ${id}"></div>`).join('')}</div>`;
  }

  function buildTopHud() {
    let dossier = 'INTRODUCTION';
    let currentSpeaker = 'Préambule';
    if (state.phase === 'question') {
      const q = state.currentQuestionList[state.index];
      dossier = q.dossier;
      currentSpeaker = SPEAKERS[q.speaker].name;
    } else if (state.phase === 'reaction') {
      dossier = 'RÉPONSE DE NATHAN';
      currentSpeaker = 'Nathan';
    } else if (state.phase === 'ending') {
      dossier = 'RAPPORT FINAL';
      currentSpeaker = 'Conclave';
    }

    return `
      <div class="topbar">
        <div class="badge-card">
          <div class="smallcaps">${dossier}</div>
          <div class="subline">
            <div class="pill"><strong>${currentSpeaker}</strong></div>
            <div class="pill">Question <strong>${Math.min(state.index + 1, state.currentQuestionList.length)}</strong> / <strong>${state.currentQuestionList.length}</strong></div>
          </div>
        </div>
        <div class="hud-right">
          <div class="pill">Temps ressenti <strong>${String(state.timeLeft).padStart(2, '0')}:00</strong></div>
          ${state.debug ? `
            <div class="pill">Survie <strong>${state.stats.survie}</strong></div>
            <div class="pill">Respect <strong>${state.stats.respect}</strong></div>
            <div class="pill">Haine <strong>${state.stats.haine}</strong></div>
            <div class="pill">Frontal <strong>${state.styles.frontal}</strong></div>
            <div class="pill">Lucide <strong>${state.styles.lucide}</strong></div>
            <div class="pill">Cynique <strong>${state.styles.cynique}</strong></div>
            <div class="pill">Panique <strong>${state.styles.panique}</strong></div>
          ` : ''}
        </div>
      </div>`;
  }

  function buildIntro() {
    return `
      <div class="intro-panel fade-in">
        <div class="intro-grid">
          <div class="intro-main">
            <div class="smallcaps">Nathan et les Quatre Maîtres — édition bunker</div>
            <h1>Tu es Nathan.</h1>
            <p>Tu as passé des années à collectionner des captures, des dossiers compressés, des notes vocales supprimées à l’aube et des fils parano qui sentaient déjà la sueur froide.</p>
            <p>Aujourd’hui, tu n’es plus derrière un écran. Tu es assis face à quatre dirigeants autour d’une table noire, avec un gros bouton rouge au milieu. Objectif officiel : parler. Objectif réel : ressortir vivant.</p>
            <p>Le jeu affiche les questions en bas de l’écran. Quand un dirigeant parle, le fond des dirigeants apparaît. Quand Nathan répond, le fond bascule sur Nathan. Selon tes choix, tu traces des sous-chemins et déverrouilles des dossiers bonus.</p>
            <div class="tag-list">
              <span class="pill">15 questions principales</span>
              <span class="pill">bonus secrets</span>
              <span class="pill">routes cachées</span>
              <span class="pill">musique intégrée</span>
              <span class="pill">Alt/⌘ + D : debug</span>
            </div>
          </div>
          <div class="intro-side">
            <div class="smallcaps">Ce qui t’attend</div>
            <p>Le bunker aime les réponses trop extrêmes presque autant qu’il aime les corriger. Les phrases les plus spectaculaires ne sont pas toujours les plus intelligentes. Les plus prudentes ne sont pas toujours les plus vivantes.</p>
            <p>Nathan a du sarcasme, de la sueur, un instinct de survie très variable et une relation douteuse avec l’idée de “juste une dernière théorie”.</p>
            <button id="startBtn" class="start-btn" type="button">Commencer la partie</button>
          </div>
        </div>
      </div>`;
  }

  function buildQuestion() {
    const q = state.currentQuestionList[state.index];
    const choicesClass = q.options.length > 4 ? 'choices two' : 'choices';
    return `
      <div class="bottom-shell fade-in">
        <div class="panel compact">
          <div class="header-row">
            <div class="speaker-chip">${SPEAKERS[q.speaker].label}</div>
            <div class="ambience">${q.ambience}</div>
          </div>
          <div class="question-box"><p id="typedPrompt" class="type-caret"></p></div>
          <div class="${choicesClass}">
            ${q.options.map((option, i) => `
              <button class="choice" type="button" data-choice="${i}">
                <div class="choice-row">
                  <div class="choice-key">${option.key}</div>
                  <div class="choice-text">${option.text}</div>
                </div>
              </button>`).join('')}
          </div>
        </div>
      </div>`;
  }


  function maskPublicReaction(text) {
    return text
      .replace(/[✅❌⭐️]/g, '')
      .replace(/Réponse[^.]*\./gi, '')
      .replace(/Issue létale/gi, 'Un silence froid tombe dans la salle.')
      .trim() || 'La salle reste difficile à lire.';
  }

  function buildReaction() {
    const route = resolveRoute(state.styles, state.stats);
    return `
      <div class="reaction-panel fade-in">
        <div class="panel">
          <div class="reaction-cards">
            <div class="card">
              <div class="card-title">Ce que Nathan vient de dire</div>
              <p>${state.lastChoice.text}</p>
            </div>
            <div class="card accent">
              <div class="card-title">Pensée intérieure de Nathan</div>
              <p>${state.lastChoice.nathan}</p>
            </div>
            <div class="card">
              <div class="card-title">Réaction dans la salle</div>
              <p>${maskPublicReaction(state.lastChoice.reaction)}</p>
            </div>
          </div>
          <div class="route-panel">
            <div class="card-title">Sous-chemin actif</div>
            <div class="route-title">${route.title}</div>
            <p>${route.summary}</p>
          </div>
          <button id="nextBtn" class="start-btn" type="button">${state.index >= state.currentQuestionList.length - 1 ? 'Voir la fin' : 'Question suivante'}</button>
        </div>
      </div>`;
  }

  function buildEnding() {
    const ending = computeEnding(state.stats);
    const route = resolveRoute(state.styles, state.stats);
    const report = buildReport(state.stats, state.styles, route);
    return `
      <div class="ending-grid fade-in">
        <div class="ending-panel ${ending.tone}">
          <div class="smallcaps">Fin de partie</div>
          <h2 style="margin:10px 0 0;font-size:38px;">${ending.title}</h2>
          <div class="end-box">${ending.text.split('\n').map(line => `<p>${line}</p>`).join('')}</div>
          ${ending.tone === 'secret' ? `<div class="end-box"><img src="assets/nathan.png" alt="Nathan sur un trône planétaire" style="width:100%;max-height:420px;object-fit:cover;border-radius:14px;"></div>` : ''}
          <div class="end-box">
            <div class="card-title">Route cachée révélée</div>
            <div class="route-title">${route.title}</div>
            <p>${route.summary}</p>
            <p><em>${route.bonus}</em></p>
          </div>
        </div>
        <div class="report-panel">
          <div class="smallcaps">Analyse post-entretien</div>
          <h2 style="margin:10px 0 0;font-size:32px;">${report.title}</h2>
          <div class="report-cards">
            ${report.cards.map(card => `<div class="card"><div class="card-title">${card.title}</div><div class="route-title" style="font-size:22px;">${card.value}</div><p>${card.text}</p></div>`).join('')}
            <div class="card"><div class="card-title">Sous-chemins débloqués</div><p>${state.unlocked.length ? state.unlocked.join(' · ') : 'Aucun bonus débloqué cette fois.'}</p></div>
          </div>
          <div class="stats-row">
            <div class="pill">Survie <strong>${state.stats.survie}</strong></div>
            <div class="pill">Respect <strong>${state.stats.respect}</strong></div>
            <div class="pill">Haine <strong>${state.stats.haine}</strong></div>
            <div class="pill">Frontal <strong>${state.styles.frontal}</strong></div>
            <div class="pill">Lucide <strong>${state.styles.lucide}</strong></div>
            <div class="pill">Cynique <strong>${state.styles.cynique}</strong></div>
            <div class="pill">Panique <strong>${state.styles.panique}</strong></div>
          </div>
          <div class="end-actions">
            <button id="restartBtn" class="start-btn" type="button">Rejouer</button>
            <button id="resetBtn" class="secondary-btn" type="button">Retour à l’intro</button>
          </div>
        </div>
      </div>`;
  }

  function render() {
    const activeSpeaker = state.phase === 'question'
      ? state.currentQuestionList[state.index].speaker
      : state.phase === 'reaction'
        ? 'nathan'
        : 'all';

    app.innerHTML = `
      <div class="stage-bg ${activeSpeaker === 'nathan' ? 'nathan' : 'leaders'}"><img src="assets/${activeSpeaker === 'nathan' ? 'nathan.png' : 'leaders.png'}" alt="background"></div>
      <div class="fx-overlay"></div>
      ${buildLightLayer(activeSpeaker, state.phase)}
      <div class="music-floating"><button id="musicBtn" class="music-btn" type="button">Musique ${state.musicOn ? 'ON' : 'OFF'}</button></div>
      ${buildTopHud()}
      <div class="main-wrap">
        ${state.phase === 'intro' ? buildIntro() : ''}
        ${state.phase === 'question' ? buildQuestion() : ''}
        ${state.phase === 'reaction' ? buildReaction() : ''}
        ${state.phase === 'ending' ? buildEnding() : ''}
      </div>`;

    bind();
    if (state.phase === 'question') typePrompt(state.currentQuestionList[state.index].prompt);
  }

  function bind() {
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) musicBtn.addEventListener('click', toggleMusic);

    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.addEventListener('click', function () {
      resetForNewRun();
      if (!state.musicOn) {
        state.musicOn = true;
      }
      startMusic();
      render();
    });

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.addEventListener('click', next);

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) restartBtn.addEventListener('click', function () {
      resetForNewRun();
      render();
    });

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      state.phase = 'intro';
      render();
    });

    document.querySelectorAll('[data-choice]').forEach((btn) => {
      btn.addEventListener('click', function () {
        const idx = Number(this.getAttribute('data-choice'));
        const q = state.currentQuestionList[state.index];
        choose(q.options[idx]);
      });
    });
  }

  let typeTimer = null;
  function typePrompt(text) {
    const target = document.getElementById('typedPrompt');
    if (!target) return;
    clearInterval(typeTimer);
    let i = 0;
    target.textContent = '';
    target.classList.add('type-caret');
    typeTimer = setInterval(() => {
      i += 2;
      target.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(typeTimer);
        target.classList.remove('type-caret');
      }
    }, 16);
  }

  document.addEventListener('keydown', (e) => {
    if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'd') {
      state.debug = !state.debug;
      render();
    }
  });

  render();
})();
