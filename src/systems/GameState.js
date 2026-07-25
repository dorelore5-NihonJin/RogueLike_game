export class GameState {
  constructor() {
    this.accountLevel = 1;
    this.accountXP = 0;
    this.selectedSkinId = 'samurai';
    this.selectedLevelNum = 1;
    this.gameMode = 'campaign'; // 'campaign' or 'endless'

    // Run State
    this.playerLevel = 1;
    this.currentXP = 0;
    this.targetXP = 10;
    this.hp = 100;
    this.maxHp = 100;
    this.speed = 8.0;
    this.kills = 0;
    this.runTimeSeconds = 0;

    this.weapons = []; // max 3
    this.abilities = []; // max 3
    this.rerollsLeft = 1;

    // Database definitions
    this.skinsCatalog = [
      { id: 'samurai', name: 'Самурай', weapon: 'Katana', reqLevel: 1, desc: '+10% к шансу крита', unlocked: true, icon: '⚔️' },
      { id: 'ninja', name: 'Ниндзя / Синоби', weapon: 'Shuriken', reqLevel: 1, desc: '+15% к скорости бега', unlocked: true, icon: '🥷' },
      { id: 'archer', name: 'Лучник', weapon: 'Yumi Bow', reqLevel: 1, desc: '+20% дальнобойного урона', unlocked: true, icon: '🏹' },
      { id: 'nodachi', name: 'Самурай Нодати', weapon: 'Nodachi', reqLevel: 5, desc: 'Широкий замах с knockback', unlocked: false, icon: '🗡️' },
      { id: 'miko', name: 'Жрица Мико', weapon: 'Ofuda Seals', reqLevel: 10, desc: 'Святой урон по площади', unlocked: false, icon: '⛩️' },
      { id: 'sohei', name: 'Монах Сохэй', weapon: 'Naginata', reqLevel: 15, desc: 'Периодический щит блока', unlocked: false, icon: '🛡️' }
    ];

    this.levelsCatalog = [
      { num: 1, title: 'Этап 1: Разрушенные Врата Камакуры', boss: 'Они-Военачальник', desc: 'Горящие пагоды, глиняные стены и волны Гаки.' },
      { num: 2, title: 'Этап 2: Бамбуковый Лес Затмения', boss: 'Владыка Тэнгу', desc: 'Густой бамбук, синий туман и Карасу-тэнгу.' },
      { num: 3, title: 'Этап 3: Оскверненная Деревня Киото', boss: 'Мать Пауков Дзёрогумо', desc: 'Деревянные мосты Киото и ядовитая паутина.' },
      { num: 4, title: 'Этап 4: Горный Храм Снега', boss: 'Ледяная Императрица', desc: 'Высокогорный заснеженный монастырь.' },
      { num: 5, title: 'Этап 5: Кладбище Древних Самураев', boss: 'Гашадокуро (Скелет)', desc: 'Мрачный некрополь и 15-метровый скелет.' },
      { num: 6, title: 'Этап 6: Топь Тёмных Духов', boss: 'Владыка Мэдзути', desc: 'Ядовитые болота и водяной змей.' },
      { num: 7, title: 'Этап 7: Затопленный Замок Синоби', boss: 'Глава Клана Ночных Теней', desc: 'Черепичные крыши замка под ночной луной.' },
      { num: 8, title: 'Этап 8: Вулканическое Ущелье Кагуцути', boss: 'Каша — Демоница Огня', desc: 'Реки кипящей лавы и горящая колесница.' },
      { num: 9, title: 'Этап 9: Пагода Тысячи Молитв', boss: 'Великий Дайтэнгу', desc: 'Залы древней пагоды и священные свитки.' },
      { num: 10, title: 'Этап 10: Озеро Багряной Луны', boss: 'Девятихвостая Кицунэ', desc: 'Зеркальное озеро с кровавой луной.' },
      { num: 11, title: 'Этап 11: Врата Расёмон — Порог Ёми', boss: 'Близнецы Райдзин и Фудзин', desc: 'Гигантский раскол мироздания.' },
      { num: 12, title: 'Этап 12: Сердце Царства Ёми', boss: 'Ямата-но Ороти', desc: 'Абсолютная тьма Бездны и 8-главый дракон.' }
    ];

    this.allCardsPool = [
      { id: 'w_katana', type: 'weapon', name: 'Катана', rarity: 'common', icon: '⚔️', desc: 'Быстрые дуговые взмахи клинка.' },
      { id: 'w_shuriken', type: 'weapon', name: 'Сюрикены', rarity: 'common', icon: '🥷', desc: 'Веерный бросок 3 сюрикенов.' },
      { id: 'w_bow', type: 'weapon', name: 'Лук Юми', rarity: 'common', icon: '🏹', desc: 'Прямой дальнобойный выстрел.' },
      { id: 'w_nodachi', type: 'weapon', name: 'Нодати', rarity: 'uncommon', icon: '🗡️', desc: 'Огромный размах мечом с отбросом.' },
      { id: 'w_ofuda', type: 'weapon', name: 'Печати Офуда', rarity: 'uncommon', icon: '📜', desc: 'Парящие талисманы святого урона.' },
      { id: 'a_fire', type: 'ability', name: 'Огненное Дыхание', rarity: 'common', icon: '🔥', desc: 'Периодический конус пламени.' },
      { id: 'a_frost', type: 'ability', name: 'Ледяная Аура', rarity: 'common', icon: '❄️', desc: 'Замедляющее кольцо мороза.' },
      { id: 'a_thunder', type: 'ability', name: 'Громовой Удар', rarity: 'rare', icon: '⚡', desc: 'Удары молний в ближайших ёкаев.' },
      { id: 'a_whirlwind', type: 'ability', name: 'Вихрь Клинков', rarity: 'rare', icon: '🌀', desc: 'Вращающиеся призрачные клинки.' },
      { id: 'a_divine', type: 'ability', name: 'Сердце Феникса', rarity: 'divine', icon: '💖', desc: 'Второе дыхание (Воскрешение).' }
    ];
  }

  startRun() {
    this.playerLevel = 1;
    this.currentXP = 0;
    this.targetXP = 10;
    this.hp = 100;
    this.maxHp = 100;
    this.kills = 0;
    this.runTimeSeconds = 0;
    this.rerollsLeft = 1;

    // Equip starting weapon from skin
    const skin = this.skinsCatalog.find(s => s.id === this.selectedSkinId);
    this.weapons = [{ id: skin.weapon.toLowerCase(), name: skin.weapon, level: 1 }];
    this.abilities = [];
  }

  addXP(amount) {
    this.currentXP += amount;
    if (this.currentXP >= this.targetXP) {
      this.currentXP -= this.targetXP;
      this.playerLevel += 1;
      this.targetXP = Math.floor(this.targetXP * 1.4);
      return true; // Trigger Level-Up modal!
    }
    return false;
  }
}
export const gameState = new GameState();
