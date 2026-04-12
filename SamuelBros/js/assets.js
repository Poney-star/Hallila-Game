window.GameAssets = {
  assets: {
    bg: null,
    playerSheet: null,
    groundTile: null,
    platformTile: null,
    grassEdge: null,
    questionBlock: null,
    usedBlock: null,
    hiddenBlock: null,
    music: null,
    victoryMusic: null,
    victoryPhotoBW: null,
    victoryPhotoColor: null,
    victoryGallery: [],
  },
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },
  async load() {
    const baseImages = [
      'assets/bg_main.png',
      'assets/player_sheet.png',
      'assets/ground_tile.png',
      'assets/platform_tile.png',
      'assets/grass_edge.png',
      'assets/question_block.png',
      'assets/used_block.png',
      'assets/hidden_block.png',
      'assets/victory_photo_bw.jpg',
      'assets/victory_photo_color.jpg',
    ];

    const gallerySources = Array.from({ length: 24 }, (_, i) => `assets/victory_extra_${i + 1}.jpg`);

    const loaded = await Promise.all([
      ...baseImages.map((src) => this.loadImage(src)),
      ...gallerySources.map((src) => this.loadImage(src)),
    ]);

    const [
      bg,
      playerSheet,
      groundTile,
      platformTile,
      grassEdge,
      questionBlock,
      usedBlock,
      hiddenBlock,
      victoryPhotoBW,
      victoryPhotoColor,
      ...victoryExtras
    ] = loaded;

    this.assets.bg = bg;
    this.assets.playerSheet = playerSheet;
    this.assets.groundTile = groundTile;
    this.assets.platformTile = platformTile;
    this.assets.grassEdge = grassEdge;
    this.assets.questionBlock = questionBlock;
    this.assets.usedBlock = usedBlock;
    this.assets.hiddenBlock = hiddenBlock;
    this.assets.victoryPhotoBW = victoryPhotoBW;
    this.assets.victoryPhotoColor = victoryPhotoColor;
    this.assets.victoryGallery = [
      victoryPhotoBW,
      victoryPhotoColor,
      ...victoryExtras,
    ].filter(Boolean);

    const music = new Audio('assets/neuilly_fighter.ogg');
    music.loop = true;
    music.volume = 0.42;
    music.preload = 'auto';
    this.assets.music = music;

    const victoryMusic = new Audio('assets/victory_theme.mp3');
    victoryMusic.loop = true;
    victoryMusic.volume = 0.52;
    victoryMusic.preload = 'auto';
    this.assets.victoryMusic = victoryMusic;
  },
};
