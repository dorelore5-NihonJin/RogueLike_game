export class GameState {
  constructor() {
    this.SAVE_KEY = 'KAGE_NO_YOKAI_SAVE_DATA_V1';

    // Account Persistent Progression
    this.accountLevel = 24;
    this.accountXP = 9800;
    this.accountTargetXP = 15000;
    this.gold = 34500; // Koban gold (matching Screenshot 2: 34,500)
    this.unlockedLevels = 12; // Unlock all 12 stages so user can freely play & preview any stage
    this.completedStageNums = [1, 2]; // Truly completed stages (Stage 1 & 2)
    this.unlockedSkins = ['samurai', 'ninja', 'archer'];
    
    this.stats = {
      totalKills: 1420,
      totalRuns: 32,
      victories: 8,
      highestStage: 5,
      endlessBestKills: 890,
      endlessBestTimeSeconds: 480
    };

    // Current Run State
    this.selectedSkinId = 'samurai';
    this.selectedLevelNum = 3; // Stage 3 selected matching Screenshot 2
    this.selectedEndlessModeId = 'blood_moon';
    this.selectedEndlessMapId = 'arena_kama';
    this.gameMode = 'campaign'; // 'campaign' or 'endless'
    this.hp = 240;
    this.maxHp = 240;
    this.playerLevel = 1;
    this.currentXP = 0;
    this.targetXP = 50;
    this.kills = 0;
    this.runTimeSeconds = 0;
    this.rerollsLeft = 1;
    this.runGoldEarned = 0;

    this.equippedWeapons = [];
    this.equippedAbilities = [];

    // Catalog Databases
    this.initSkinsCatalog();
    this.initLevelsCatalog();
    this.initEndlessCatalog();
    this.initItemCardsPool();
    this.initCodexDatabase();

    // Load Save Data
    this.loadFromDisk();
  }

  initSkinsCatalog() {
    this.skinsCatalog = [
      {
        id: 'samurai',
        name: 'SAMURAI',
        title: 'BLUE SAMURAI',
        weapon: 'KATANA',
        svgType: 'samurai',
        rarity: 'Редкий Воин',
        price: 0,
        hp: 240,
        speed: 35,
        critRate: 15,
        weaponDesc: 'Быстрый смертоносный клинок. Скоростные атаки и повышенный шанс блока.',
        passiveName: 'HONORABLE SPIRIT',
        passiveDesc: '+10% к шансу критического урона в ближнем бою.',
        unlockReq: 'Доступен сразу'
      },
      {
        id: 'ninja',
        name: 'SHINOBI NINJA',
        title: 'SHADOW NINJA',
        weapon: 'SHURIKENS',
        svgType: 'ninja',
        rarity: 'Обычный Воин',
        price: 0,
        hp: 180,
        speed: 50,
        critRate: 25,
        weaponDesc: 'Запуск веера сюрикенов. Высокая скорость метания во все стороны.',
        passiveName: 'SHADOW VEIL',
        passiveDesc: '+15% к скорости бега и 10% к шансу уклонения от атак.',
        unlockReq: 'Доступен сразу'
      },
      {
        id: 'archer',
        name: 'YUMI ARCHER',
        title: 'GREEN ARCHER',
        weapon: 'YUMI BOW',
        svgType: 'archer',
        rarity: 'Необычный Воин',
        price: 0,
        hp: 200,
        speed: 40,
        critRate: 20,
        weaponDesc: 'Тяжелый асимметричный лук Юми. Пробивает до 3 врагов насквозь.',
        passiveName: 'EAGLE EYE',
        passiveDesc: '+20% к дальности стрел и пробиванию брони.',
        unlockReq: 'Доступен сразу'
      },
      {
        id: 'nodachi',
        name: 'HEAVY NODACHI',
        title: 'IRON SAMURAI',
        weapon: 'GREAT NODACHI',
        svgType: 'nodachi',
        rarity: 'Редкий Воин',
        price: 600,
        hp: 320,
        speed: 28,
        critRate: 10,
        weaponDesc: 'Огромный двуручный меч Нодати. Массивные круговые взмахи.',
        passiveName: 'IRON WILL',
        passiveDesc: '-20% к получаемому урону и иммунитет к отбрасыванию.',
        unlockReq: '600 Koban Gold'
      },
      {
        id: 'miko',
        name: 'SHRINE MIKO',
        title: 'SACRED MAIDEN',
        weapon: 'OFUDA TALISMANS',
        svgType: 'miko',
        rarity: 'Эпический Воин',
        price: 1200,
        hp: 220,
        speed: 38,
        critRate: 18,
        weaponDesc: 'Священные свитки Офуда. Автоматически наводятся на ближайших демонов.',
        passiveName: 'PURIFYING SHIELD',
        passiveDesc: 'Создает святую ауру, исцеляющую 5 HP каждые 5 секунд.',
        unlockReq: '1200 Koban Gold'
      },
      {
        id: 'sohei',
        name: 'WARRIOR SOHEI',
        title: 'MONK GUARDIAN',
        weapon: 'NAGINATA',
        svgType: 'sohei',
        rarity: 'Эпический Воин',
        price: 1800,
        hp: 280,
        speed: 32,
        critRate: 12,
        weaponDesc: 'Японская алебарда Нагината. Широкие размашистые атаки со станом.',
        passiveName: 'BENKEI STANCE',
        passiveDesc: 'Шанс 25% заблокировать урон и контратаковать.',
        unlockReq: '1800 Koban Gold'
      },
      {
        id: 'onmyoji',
        name: 'ONMYOJI MAGE',
        title: 'ELEMENTAL MAGE',
        weapon: 'SEIMEI FAN',
        svgType: 'onmyoji',
        rarity: 'Легендарный Воин',
        price: 3000,
        hp: 190,
        speed: 42,
        critRate: 30,
        weaponDesc: 'Магический веер Онмёдзи. Запускает спирали огня и льда.',
        passiveName: 'ELEMENTAL SHIFT',
        passiveDesc: 'Каждая 4-я атака кастует стихийный шторм.',
        unlockReq: '3000 Koban Gold'
      },
      {
        id: 'demon_ronin',
        name: 'DEMON RONIN',
        title: 'CURSED RONIN',
        weapon: 'MURAMASA BLADE',
        svgType: 'demon_ronin',
        rarity: 'Божественный Демон',
        price: 5000,
        hp: 260,
        speed: 45,
        critRate: 35,
        weaponDesc: 'Проклятый демонический клинок. Огромный урон с высасыванием душ.',
        passiveName: 'BLOODLUST CURSE',
        passiveDesc: '+50% к урону при HP ниже 30% и 5% вампиризма.',
        unlockReq: '5000 Koban Gold'
      }
    ];
  }

  // 12 Chapters Campaign matching Screenshot 2
  initLevelsCatalog() {
    this.levelsCatalog = [
      { num: 1, title: 'Kamakura Ruins', boss: 'Aka-Oni', danger: '★☆☆☆☆', desc: 'Infiltrate the ancient ruins, defeat the demonic guardians!', xpReward: 100, goldReward: 150, enemies: ['Ninja', 'Samurai', 'Archer', 'Oni Brute'] },
      { num: 2, title: 'Bamboo Grove', boss: 'Dairogu Spider', danger: '★☆☆☆☆', desc: 'Navigate dense bamboo trails infested with giant venomous spiders.', xpReward: 200, goldReward: 250, enemies: ['Ninja', 'Spider', 'Archer', 'Spirit'] },
      { num: 3, title: 'Shinobi Village', boss: 'Karasu-Tengu', danger: '★★☆☆☆', desc: 'Infiltrate the village, defeat the guards and purge the yokai shadow!', xpReward: 300, goldReward: 350, enemies: ['Ninja', 'Samurai', 'Archer', 'Oni Brute'] },
      { num: 4, title: 'Mountain Pass', boss: 'Yuki-Onna', danger: '★★☆☆☆', desc: 'Freezing blizzards and icy blades on treacherous mountain ledges.', xpReward: 450, goldReward: 500, enemies: ['Ice Spirit', 'Samurai', 'Archer', 'Yuki-Onna'] },
      { num: 5, title: 'Imperial Gardens', boss: 'Gashadokuro', danger: '★★★☆☆', desc: 'Bloomed cherry blossoms hides colossal skeletal demons.', xpReward: 600, goldReward: 700, enemies: ['Skeleton', 'Samurai', 'Monk', 'Giant Skeleton'] },
      { num: 6, title: 'Floating Fortress', boss: 'Nure-Onna', danger: '★★★☆☆', desc: 'Floating pagodas above stormy seas infested with serpent yokai.', xpReward: 800, goldReward: 900, enemies: ['Serpent', 'Ninja', 'Samurai', 'Nure-Onna'] },
      { num: 7, title: 'Volcanic Crater', boss: 'Oni-Kanabo', danger: '★★★★☆', desc: 'Rivers of boiling lava and heavy armored club-wielding ogres.', xpReward: 1000, goldReward: 1200, enemies: ['Ogre', 'Fire Demon', 'Archer', 'Oni Boss'] },
      { num: 8, title: 'Cursed Woods', boss: 'Mahaguki', danger: '★★★★☆', desc: 'Ancient haunted trees where howling spirits ambush travelers.', xpReward: 1300, goldReward: 1500, enemies: ['Spirit', 'Wraith', 'Ninja', 'Cursed Tree'] },
      { num: 9, title: 'Castle Gate', boss: 'Raijin & Fujin', danger: '★★★★★', desc: 'The lightning and wind god shrine guarding the main gate.', xpReward: 1600, goldReward: 1800, enemies: ['Guard', 'Samurai', 'Monk', 'God Boss'] },
      { num: 10, title: 'Snowy Peaks', boss: 'Yamata-no-Orochi', danger: '★★★★★', desc: 'Crystal rifts of the underworld and the eight-headed serpent.', xpReward: 2000, goldReward: 2500, enemies: ['Hydra', 'Dragon', 'Ice Demon', 'Orochi'] },
      { num: 11, title: 'Dragon\'s Lair', boss: 'Tengu Overlord', danger: '★★★★★', desc: 'Lair of ancient dragons engulfed in dark primordial flames.', xpReward: 2500, goldReward: 3000, enemies: ['Dragon', 'Fire Spirit', 'Overlord', 'Tengu'] },
      { num: 12, title: 'Shogun\'s Palace', boss: 'Akuma Izanami', danger: '🔥 FINAL BOSS 🔥', desc: 'The ultimate climax battle to save feudal Japan 1200 AD.', xpReward: 5000, goldReward: 5000, enemies: ['Akuma', 'Izanami', 'Shadow Ronin', 'Shogun'] }
    ];
  }

  initEndlessCatalog() {
    this.endlessModesCatalog = [
      {
        id: 'blood_moon',
        title: 'Blood Moon Night',
        subtitle: 'Endless Waves',
        desc: 'Difficulty rises every 60s. Demons deal +20% damage, but rewards +50% more Koban Gold!',
        modifier: 'Koban x1.5 | Wave Swarm',
        svgType: 'moon'
      },
      {
        id: 'rush_1000',
        title: '1000 Yokai Sprint',
        subtitle: 'Speed Run',
        desc: 'Time attack mode! Vanquish 1000 demons as fast as possible. Attack speed +30%.',
        modifier: 'Speed Attack | Attack +30%',
        svgType: 'timer'
      },
      {
        id: 'boss_gauntlet',
        title: 'Boss Gauntlet',
        subtitle: 'Giant Duels',
        desc: 'Every 3 waves a Legendary Boss spawns (Gashadokuro, Orochi, Nure-Onna). Legendary loot only.',
        modifier: 'Boss Rush | Epic Loot',
        svgType: 'boss'
      },
      {
        id: 'one_hit_bushido',
        title: 'Bushido One-Hit (1 HP)',
        subtitle: 'Hardcore Master',
        desc: 'Hardcore Master Mode! 1 HP, any hit is lethal. Critical Rate 100% and 5x Gold!',
        modifier: 'Hardcore 1 HP | Crit 100%',
        svgType: 'skull'
      }
    ];

    this.endlessMapsCatalog = [
      { id: 'arena_kama', name: 'Arena I: Burning Pagoda Gate', desc: 'Ruined temple plaza surrounded by night lanterns.' },
      { id: 'arena_bamboo', name: 'Arena II: Bamboo Moon Grove', desc: 'Dense dark bamboo forest with purple spirits.' },
      { id: 'arena_yomi', name: 'Arena III: Yomi Underworld Rift', desc: 'Underground crystal abyss with fiery lava rifts.' }
    ];
  }

  initItemCardsPool() {
    this.allCardsPool = [
      { id: 'katana_up', name: 'Katana Slash', icon: '⚔️', rarity: 'common', type: 'damage', desc: 'Урон ближнего боя +20%' },
      { id: 'speed_up', name: 'Geta Speed', icon: '👟', rarity: 'common', type: 'speed', desc: 'Скорость перемещения +15%' },
      { id: 'hp_up', name: 'Samurai Armor', icon: '🛡️', rarity: 'common', type: 'hp', desc: 'Максимальное HP +40' },
      { id: 'shuriken_up', name: 'Shadow Shuriken', icon: '🌀', rarity: 'uncommon', type: 'damage', desc: '+1 дополнительный сюрикен к вееру' },
      { id: 'crit_up', name: 'Bushido Focus', icon: '🎯', rarity: 'uncommon', type: 'crit', desc: 'Шанс критического удара +10%' },
      { id: 'lifesteal_up', name: 'Vampiric Blade', icon: '🩸', rarity: 'rare', type: 'heal', desc: 'Восстановление 3% HP при убийстве' },
      { id: 'ofuda_up', name: 'Sacred Ofuda', icon: '📜', rarity: 'epic', type: 'defense', desc: 'Парящий свиток, карающий демонов' },
      { id: 'dragon_slash', name: 'Dragon Breath', icon: '🐉', rarity: 'legendary', type: 'damage', desc: 'Круговая огненная волна при каждом 5-м ударе' }
    ];
  }

  initCodexDatabase() {
    this.codexDatabase = {
      weapons: [
        { name: 'Katana (Катана)', tier: 'Оружие Ближнего Боя', rarityClass: 'rare', damage: '45 HP', speed: '0.4s', desc: 'Традиционный самурайский меч. Высокая скорость и способность блокировать урон.' },
        { name: 'Yumi Bow (Лук Юми)', tier: 'Дальнобойное Оружие', rarityClass: 'uncommon', damage: '65 HP', speed: '0.8s', desc: 'Тяжелый японистый лук. Стрелы пробивают до 3 ёкаев насквозь.' },
        { name: 'Shuriken Fan (Сюрикены)', tier: 'Метательное Оружие', rarityClass: 'common', damage: '25 HP', speed: '0.25s', desc: 'Веер быстрыми сюрикенами во все стороны.' },
        { name: 'Naginata (Нагината)', tier: 'Тяжелое Копье', rarityClass: 'epic', damage: '85 HP', speed: '0.7s', desc: 'Длинное копье с изогнутым лезвием. Оглушает врагов.' }
      ],
      abilities: [
        { name: 'Shadow Step (Шаг Тени)', rarity: 'Редкая', rarityClass: 'rare', effect: 'Рывок сквозь врагов с уроном 50 HP.' },
        { name: 'Sakura Storm (Буря Сакуры)', rarity: 'Эпическая', rarityClass: 'epic', effect: 'Лепестки сакуры кружат вокруг персонажа.' }
      ],
      yokai: [
        { name: 'Aka-Oni (Красный Они)', tier: 'Элитный Демон', rarityClass: 'epic', hp: 450, attack: 35, lore: 'Гигантский рогатый демон с массивной палицей Канабо.' },
        { name: 'Gaki (Вопящий Голодный Дух)', tier: 'Рядовой Ёкай', rarityClass: 'common', hp: 60, attack: 12, lore: 'Проклятые души, вечно испытывающие нечеловеческий голод.' }
      ],
      lore: [
        { title: 'Глава I: Падение Камакуры (1200 AD)', content: 'В 1200 году нашей эры врата загробного мира Yomi отворились. Тьма охватила священные пагоды...' }
      ]
    };
  }

  buySkin(skinId) {
    const skin = this.skinsCatalog.find(s => s.id === skinId);
    if (!skin) return { success: false, message: 'Скин не найден' };

    if (this.unlockedSkins.includes(skinId)) {
      return { success: false, message: 'Скин уже куплен' };
    }

    if (this.gold < skin.price) {
      return { success: false, message: `Недостаточно Кобанов! Требуется ${skin.price} G` };
    }

    this.gold -= skin.price;
    this.unlockedSkins.push(skinId);
    this.saveToDisk();
    return { success: true, message: `Скин "${skin.name}" успешно разблокирован!` };
  }

  saveToDisk() {
    try {
      const data = {
        accountLevel: this.accountLevel,
        accountXP: this.accountXP,
        accountTargetXP: this.accountTargetXP,
        gold: this.gold,
        unlockedLevels: this.unlockedLevels,
        completedStageNums: this.completedStageNums,
        unlockedSkins: this.unlockedSkins,
        stats: this.stats,
        selectedSkinId: this.selectedSkinId,
        selectedLevelNum: this.selectedLevelNum
      };
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Unable to save GameState to localStorage', e);
    }
  }

  loadFromDisk() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.accountLevel) this.accountLevel = parsed.accountLevel;
        if (parsed.accountXP) this.accountXP = parsed.accountXP;
        if (parsed.accountTargetXP) this.accountTargetXP = parsed.accountTargetXP;
        if (parsed.gold) this.gold = parsed.gold;
        if (parsed.unlockedLevels) this.unlockedLevels = Math.max(12, parsed.unlockedLevels);
        if (parsed.completedStageNums) this.completedStageNums = parsed.completedStageNums;
        if (parsed.unlockedSkins) this.unlockedSkins = parsed.unlockedSkins;
        if (parsed.stats) this.stats = parsed.stats;
        if (parsed.selectedSkinId) this.selectedSkinId = parsed.selectedSkinId;
        if (parsed.selectedLevelNum) this.selectedLevelNum = parsed.selectedLevelNum;
      }
    } catch (e) {
      console.warn('Unable to load GameState from localStorage', e);
    }
  }
}

export const gameState = new GameState();
