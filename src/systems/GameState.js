export class GameState {
  constructor() {
    this.SAVE_KEY = 'KAGE_NO_YOKAI_SAVE_DATA_V1';

    // Account Persistent Progression
    this.accountLevel = 1;
    this.accountXP = 0;
    this.accountTargetXP = 100;
    this.gold = 500; // Starting gold
    this.unlockedLevels = 1;
    this.unlockedSkins = ['samurai', 'ninja', 'archer'];
    
    this.stats = {
      totalKills: 0,
      totalRuns: 0,
      victories: 0,
      highestStage: 1
    };

    // Current Run State
    this.selectedSkinId = 'samurai';
    this.selectedLevelNum = 1;
    this.gameMode = 'campaign'; // 'campaign' or 'endless'
    this.hp = 100;
    this.maxHp = 100;
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
    this.initItemCardsPool();
    this.initCodexDatabase();

    // Load Save Data
    this.loadFromDisk();
  }

  initSkinsCatalog() {
    this.skinsCatalog = [
      { id: 'samurai', name: 'Самурай', weapon: 'Катана', desc: '+10% к критическому урону в ближнем бою.', icon: '⚔️', price: 0 },
      { id: 'ninja', name: 'Ниндзя Синоби', weapon: 'Сюрикены', desc: '+15% к скорости передвижения и скрытности.', icon: '🥷', price: 0 },
      { id: 'archer', name: 'Стрелок Юми', weapon: 'Лук Юми', desc: '+20% к дальности атаки и пробиванию.', icon: '🏹', price: 0 },
      { id: 'nodachi', name: 'Нодати Дзен', weapon: 'Двуручный Дзен', desc: '+35% к области поражения, размашистые убойные удары.', icon: '🗡️', price: 600 },
      { id: 'miko', name: 'Жрица Мико', weapon: 'Печати Офуда', desc: '+25% к урону святыми чарами и очищающей ауре.', icon: '⛩️', price: 1200 },
      { id: 'sohei', name: 'Монах Сохэй', weapon: 'Нагината', desc: '+30% к максимальному HP и броне.', icon: '📿', price: 1800 },
      { id: 'onmyoji', name: 'Онмёдзи Маг', weapon: 'Веер Сэймэя', desc: 'Призывает стихийных духов (Огонь, Молния, Лед).', icon: '☯️', price: 3000 },
      { id: 'demon_ronin', name: 'Демон Ронин', weapon: 'Проклятый Клинок', desc: '+50% к урону при HP ниже 30% (Вампиризм 5%).', icon: '👹', price: 5000 }
    ];
  }

  initLevelsCatalog() {
    this.levelsCatalog = [
      { num: 1, title: 'Этап 1: Разрушенные Врата Камакуры', boss: 'Гаки-Гигант', desc: 'Горящие пагоды, разрушенные стены и первая волна оскверненных ёкаев.' },
      { num: 2, title: 'Этап 2: Затмение в Бамбуковой Роще', boss: 'Дзёрогумо (Паучиха)', desc: 'Густой затуманенный лес, ядовитые паутины и синие огоньки.' },
      { num: 3, title: 'Этап 3: Затопленный Замок Синоби', boss: 'Карасу-Тенгу (Ворон)', desc: 'Затопленные крыши, скользкая черепица и ассасины небес.' },
      { num: 4, title: 'Этап 4: Заснеженный Храм горы Хиэй', boss: 'Юки-Онна (Ледяная)', desc: 'Горная вьюга, замерзшие водопады и ледяные клинки.' },
      { num: 5, title: 'Этап 5: Кладбище Древних Самураев', boss: 'Гашадокуро (Скелет)', desc: 'Заросшие мхом могилы, гигантские кости и вопящие духи.' },
      { num: 6, title: 'Этап 6: Топь Тёмных Духов', boss: 'Нуре-Онна (Змея)', desc: 'Отравленные болота, фиолетовые лотосы и тонущие души.' },
      { num: 7, title: 'Этап 7: Подземелья Клана Минэ', boss: 'Они-Канабо (Огр)', desc: 'Тёмные катакомбы, ловушки с шипами и тяжеловооруженные демоны.' },
      { num: 8, title: 'Этап 8: Вулканическое Ущелье Кагуцути', boss: 'Макацухи (Огненный)', desc: 'Реки кипящей лавы, базальтовые скалы и огненный пепел.' },
      { num: 9, title: 'Этап 9: Святилище Сусаноо', boss: 'Райдзин & Фудзин', desc: 'Священный храм молний и ураганов над облаками.' },
      { num: 10, title: 'Этап 10: Кровавая Бездна Yomi', boss: 'Ямата-но Орочи (8 Голов)', desc: 'Кристальный раскол подземного мира и 8-главый змей.' },
      { num: 11, title: 'Этап 11: Оскверненный Дворец Императора', boss: 'Тэнгу-Владыка', desc: 'Тронный зал, охваченный темной магией.' },
      { num: 12, title: 'Этап 12: Финальный Раскол Судьбы', boss: 'Акума-но Идзанами', desc: 'Финальная битва за спасение Японии 1200 года.' }
    ];
  }

  initItemCardsPool() {
    this.allCardsPool = [
      { id: 'w1', name: 'Катана Самурая', type: 'weapon', rarity: 'common', icon: '⚔️', desc: 'Быстрый рассекающий удар перед воином.' },
      { id: 'w2', name: 'Сюрикены Синоби', type: 'weapon', rarity: 'common', icon: '🥷', desc: 'Запуск 3 веерных сюрикенов во все стороны.' },
      { id: 'w3', name: 'Лук Юми', type: 'weapon', rarity: 'uncommon', icon: '🏹', desc: 'Дальнобойная стрела, пробивающая до 3 врагов.' },
      { id: 'w4', name: 'Огненный Офуда', type: 'weapon', rarity: 'rare', icon: '📜', desc: 'Взрывной магический свиток с огненным всплеском.' },
      { id: 'w5', name: 'Нагината Сохэя', type: 'weapon', rarity: 'rare', icon: '📿', desc: 'Круговая вращательная атака вокруг игрока.' },
      { id: 'a1', name: 'Самурайская Броня', type: 'ability', rarity: 'common', icon: '🛡️', desc: 'Снижает весь получаемый урон на 15%.' },
      { id: 'a2', name: 'Благословение Аматэрасу', type: 'ability', rarity: 'uncommon', icon: '☀️', desc: 'Повышает урона всех атак на 20%.' },
      { id: 'a3', name: 'След Тэна', type: 'ability', rarity: 'rare', icon: '⚡', desc: '+25% к скорости передвижения и рывка.' },
      { id: 'a4', name: 'Сердце Дракона', type: 'ability', rarity: 'epic', icon: '❤️', desc: '+50 к Макс HP и постепенная регенерация.' },
      { id: 'a5', name: 'Дух Райдзина', type: 'ability', rarity: 'legendary', icon: '🌩️', desc: 'Периодический удар молнии в ближайшего демона.' }
    ];
  }

  initCodexDatabase() {
    this.codexDatabase = {
      lore: [
        {
          title: 'Эпоха Камакура (1200 год)',
          content: 'В 1200 году нашей эры над древней Японией взошло кроваво-красное затмение. Священные печати, сдерживавшие Подземное Царство Yomi, были разрушены. Орды демонов-ёкаев хлынули на земли самураев. Лишь избранные воины способны остановить тьму.'
        },
        {
          title: 'Раскол Yomi и Кровавое Затмение',
          content: 'Древние легенды гласят, что раз в тысячелетие грани между миром живых и царством духов истончаются. Демон Идзанами пробудился в глубинах Бездны и направил 35 видов оскверненных ёкаев на 12 регионов Японии.'
        }
      ],
      weapons: [
        { name: 'Катана Самурая', tier: 'Базовое', damage: 25, speed: '1.2 сек', desc: 'Классическое оружие воинов Камакуры. Наносит быстрый дугообразный слэш.' },
        { name: 'Сюрикены Синоби', tier: 'Редкое', damage: 15, speed: '0.8 сек', desc: 'Метательные звездочки, летящие веером.' },
        { name: 'Лук Юми', tier: 'Редкое', damage: 45, speed: '1.5 сек', desc: 'Тяжелый японский лук с мощным пробивающим эффектом.' },
        { name: 'Печати Офуда', tier: 'Эпическое', damage: 35, speed: '1.0 сек', desc: 'Священные бумажные свитки, взрывающиеся при контакте с Ёкаями.' },
        { name: 'Двуручный Нодати', tier: 'Легендарное', damage: 70, speed: '2.0 сек', desc: 'Огромный самурайский меч, разрубающий группы врагов.' }
      ],
      abilities: [
        { name: 'Самурайская Броня', rarity: 'Обычная', effect: 'Снижение урона на 15%' },
        { name: 'Благословение Аматэрасу', rarity: 'Необычная', effect: '+20% к урону' },
        { name: 'Сердце Дракона', rarity: 'Эпическая', effect: '+50 HP & Регенерация' },
        { name: 'Гнев Райдзина', rarity: 'Легендарная', effect: 'Удары молний раз в 3 сек' }
      ],
      yokai: [
        { name: 'Гаки (Голодный Демон)', tier: '1 Вид (Слабый)', hp: 40, attack: 8, lore: 'Маленькие юркие бесы, нападающие стаями.' },
        { name: 'Ака-Они (Красный Огр)', tier: '2 Вид (Средний)', hp: 200, attack: 25, lore: 'Свирепые гиганты с шипованными дубинами Канабо.' },
        { name: 'Карасу-Тенгу', tier: '3 Вид (Опасный)', hp: 150, attack: 20, lore: 'Крылатые демоны-вороны, атакующие с воздуха.' },
        { name: 'Дзёрогумо', tier: '4 Вид (Элитный)', hp: 350, attack: 30, lore: 'Паучиха-демон, плетущая замедляющую паутину.' },
        { name: 'Гашадокуро', tier: '5 Вид (Босс)', hp: 1200, attack: 55, lore: 'Гигантский скелет из костей павших воинов.' },
        { name: 'Ямата-но Орочи', tier: '6 Вид (Божественный)', hp: 3000, attack: 80, lore: 'Легендарный 8-главый змей из глубин Yomi.' }
      ]
    };
  }

  buySkin(skinId) {
    const skin = this.skinsCatalog.find(s => s.id === skinId);
    if (!skin) return { success: false, message: 'Скин не найден' };

    if (this.unlockedSkins.includes(skinId)) {
      return { success: false, message: 'Скин уже куплен!' };
    }

    if (this.gold < skin.price) {
      return { success: false, message: `Недостаточно кобанов! Нужно 💰${skin.price}` };
    }

    this.gold -= skin.price;
    this.unlockedSkins.push(skinId);
    this.saveToDisk();
    return { success: true, message: `Скин "${skin.name}" успешно разблокирован!` };
  }

  addGold(amount) {
    this.gold += amount;
    this.runGoldEarned += amount;
    this.saveToDisk();
  }

  addAccountXP(amount) {
    this.accountXP += amount;
    while (this.accountXP >= this.accountTargetXP) {
      this.accountXP -= this.accountTargetXP;
      this.accountLevel += 1;
      this.accountTargetXP = Math.floor(this.accountTargetXP * 1.4);
    }
    this.saveToDisk();
  }

  startRun() {
    this.hp = 100;
    this.maxHp = 100;
    this.playerLevel = 1;
    this.currentXP = 0;
    this.targetXP = 50;
    this.kills = 0;
    this.runTimeSeconds = 0;
    this.rerollsLeft = 1;
    this.runGoldEarned = 0;

    this.stats.totalRuns += 1;
    this.saveToDisk();
  }

  saveToDisk() {
    try {
      const saveData = {
        accountLevel: this.accountLevel,
        accountXP: this.accountXP,
        accountTargetXP: this.accountTargetXP,
        gold: this.gold,
        unlockedLevels: this.unlockedLevels,
        unlockedSkins: this.unlockedSkins,
        stats: this.stats
      };
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  loadFromDisk() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.accountLevel) this.accountLevel = data.accountLevel;
        if (data.accountXP) this.accountXP = data.accountXP;
        if (data.accountTargetXP) this.accountTargetXP = data.accountTargetXP;
        if (typeof data.gold === 'number') this.gold = data.gold;
        if (data.unlockedLevels) this.unlockedLevels = data.unlockedLevels;
        if (Array.isArray(data.unlockedSkins)) this.unlockedSkins = data.unlockedSkins;
        if (data.stats) this.stats = { ...this.stats, ...data.stats };
      }
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }
  }
}

export const gameState = new GameState();
