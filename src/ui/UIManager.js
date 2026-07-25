import { gameState } from '../systems/GameState.js';

export class UIManager {
  constructor(onStartRunCallback) {
    this.onStartRun = onStartRunCallback;
    this.activeScreen = 'screen-main-menu';
    this.activeCodexTab = 'weapons';

    this.bindEvents();
    this.renderSkinsGrid();
    this.renderLevelsGrid();
    this.updateProfileBadge();
    this.startBackgroundSlideshow();
  }

  startBackgroundSlideshow() {
    const slides = document.querySelectorAll('.bg-slide');
    if (!slides || slides.length === 0) return;

    let currentIdx = 0;
    setInterval(() => {
      if (this.activeScreen === 'screen-main-menu') {
        slides[currentIdx].classList.remove('active');
        currentIdx = (currentIdx + 1) % slides.length;
        slides[currentIdx].classList.add('active');
      }
    }, 12000);
  }

  showScreen(screenId) {
    document.querySelectorAll('.ui-screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    this.activeScreen = screenId;

    const slideshow = document.getElementById('menu-bg-slideshow');
    if (screenId === 'screen-main-menu') {
      slideshow.style.display = 'block';
      this.updateProfileBadge();
    } else {
      slideshow.style.display = 'none';
    }
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  updateProfileBadge() {
    document.getElementById('account-level-val').textContent = gameState.accountLevel;
    document.getElementById('account-gold-val').textContent = gameState.gold.toLocaleString();
    const pct = Math.min(100, (gameState.accountXP / gameState.accountTargetXP) * 100);
    document.getElementById('account-xp-fill').style.width = `${pct}%`;
  }

  bindEvents() {
    // Main Menu Buttons
    document.getElementById('btn-start-run').addEventListener('click', () => {
      this.showScreen('screen-level-select');
    });

    document.getElementById('btn-select-skin').addEventListener('click', () => {
      this.renderSkinsGrid();
      this.showScreen('screen-skin-select');
    });

    document.getElementById('btn-select-level').addEventListener('click', () => {
      this.renderLevelsGrid();
      this.showScreen('screen-level-select');
    });

    document.getElementById('btn-open-codex').addEventListener('click', () => {
      this.renderCodexContent('weapons');
      this.showScreen('screen-codex');
    });

    document.getElementById('btn-open-settings').addEventListener('click', () => {
      this.showScreen('screen-settings');
    });

    const exitBtn = document.getElementById('btn-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => alert('Выход из игры.'));
    }

    // Profile Badge Click -> Stats Modal
    document.getElementById('account-badge').addEventListener('click', () => {
      document.getElementById('stat-level').textContent = gameState.accountLevel;
      document.getElementById('stat-gold').textContent = gameState.gold.toLocaleString();
      document.getElementById('stat-kills').textContent = gameState.stats.totalKills.toLocaleString();
      document.getElementById('stat-runs').textContent = gameState.stats.totalRuns;
      document.getElementById('stat-skins').textContent = `${gameState.unlockedSkins.length}/${gameState.skinsCatalog.length}`;
      this.showModal('modal-profile-stats');
    });

    document.getElementById('btn-close-stats').addEventListener('click', () => {
      this.hideModal('modal-profile-stats');
    });

    // Codex Tab Switches
    document.getElementById('codex-tab-weapons').addEventListener('click', (e) => this.switchCodexTab('weapons', e.target));
    document.getElementById('codex-tab-abilities').addEventListener('click', (e) => this.switchCodexTab('abilities', e.target));
    document.getElementById('codex-tab-yokai').addEventListener('click', (e) => this.switchCodexTab('yokai', e.target));
    document.getElementById('codex-tab-lore').addEventListener('click', (e) => this.switchCodexTab('lore', e.target));

    // Back Buttons
    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => this.showScreen('screen-main-menu'));
    });

    // Launch Level Button
    document.getElementById('btn-launch-level').addEventListener('click', () => {
      this.triggerChapterIntroAndStart();
    });

    // Confirm Skin & Buy Skin Buttons
    document.getElementById('btn-confirm-skin').addEventListener('click', () => {
      this.showScreen('screen-main-menu');
    });

    document.getElementById('btn-buy-skin').addEventListener('click', () => {
      const selectedSkin = gameState.skinsCatalog.find(s => s.id === gameState.selectedSkinId);
      if (selectedSkin) {
        const res = gameState.buySkin(selectedSkin.id);
        alert(res.message);
        if (res.success) {
          this.renderSkinsGrid();
          this.updateProfileBadge();
        }
      }
    });

    // Restart Button
    document.getElementById('btn-restart-run').addEventListener('click', () => {
      this.hideModal('modal-gameover');
      this.showScreen('screen-main-menu');
    });

    // Reroll & Skip Buttons
    document.getElementById('btn-reroll-cards').addEventListener('click', () => {
      if (gameState.rerollsLeft > 0) {
        gameState.rerollsLeft -= 1;
        document.getElementById('reroll-count').textContent = gameState.rerollsLeft;
        this.renderLevelUpCards();
      }
    });

    document.getElementById('btn-skip-cards').addEventListener('click', () => {
      this.hideModal('modal-levelup');
      if (window.resumeGameLoop) window.resumeGameLoop();
    });
  }

  switchCodexTab(tabName, clickedBtn) {
    document.querySelectorAll('#screen-codex .tab-btn').forEach(b => b.classList.remove('active'));
    clickedBtn.classList.add('active');
    this.renderCodexContent(tabName);
  }

  renderCodexContent(tabName) {
    const area = document.getElementById('codex-content-area');
    area.innerHTML = '';

    if (tabName === 'weapons') {
      const grid = document.createElement('div');
      grid.className = 'codex-grid';
      gameState.codexDatabase.weapons.forEach(w => {
        grid.innerHTML += `
          <div class="codex-card">
            <h4 style="color:#ffd700;">${w.name}</h4>
            <span class="badge" style="background:#553311; margin:6px 0; display:inline-block;">${w.tier}</span>
            <p>Урон: <strong>${w.damage}</strong> | Перезарядка: <strong>${w.speed}</strong></p>
            <p style="font-size:0.85rem; color:#bbb; margin-top:6px;">${w.desc}</p>
          </div>
        `;
      });
      area.appendChild(grid);
    } else if (tabName === 'abilities') {
      const grid = document.createElement('div');
      grid.className = 'codex-grid';
      gameState.codexDatabase.abilities.forEach(a => {
        grid.innerHTML += `
          <div class="codex-card">
            <h4 style="color:#66ccff;">${a.name}</h4>
            <span class="badge" style="background:#113355; margin:6px 0; display:inline-block;">${a.rarity}</span>
            <p style="font-size:0.9rem; color:#ddd; margin-top:6px;">Эффект: <strong>${a.effect}</strong></p>
          </div>
        `;
      });
      area.appendChild(grid);
    } else if (tabName === 'yokai') {
      const grid = document.createElement('div');
      grid.className = 'codex-grid';
      gameState.codexDatabase.yokai.forEach(y => {
        grid.innerHTML += `
          <div class="codex-card">
            <h4 style="color:#ff5555;">${y.name}</h4>
            <span class="badge" style="background:#441111; margin:6px 0; display:inline-block;">${y.tier}</span>
            <p>Здоровье: <strong>${y.hp} HP</strong> | Атака: <strong>${y.attack}</strong></p>
            <p style="font-size:0.85rem; color:#bbb; margin-top:6px;">${y.lore}</p>
          </div>
        `;
      });
      area.appendChild(grid);
    } else if (tabName === 'lore') {
      const loreBox = document.createElement('div');
      loreBox.className = 'codex-lore-box';
      gameState.codexDatabase.lore.forEach(l => {
        loreBox.innerHTML += `
          <div class="lore-chapter">
            <h3 style="color:#ffd700; margin-bottom:8px;">${l.title}</h3>
            <p style="line-height:1.6; color:#ddd;">${l.content}</p>
          </div>
        `;
      });
      area.appendChild(loreBox);
    }
  }

  renderSkinsGrid() {
    const grid = document.getElementById('skins-grid');
    grid.innerHTML = '';

    gameState.skinsCatalog.forEach(skin => {
      const isUnlocked = gameState.unlockedSkins.includes(skin.id);
      const card = document.createElement('div');
      card.className = `skin-card-item ${skin.id === gameState.selectedSkinId ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;
      card.innerHTML = `
        <div class="skin-icon-preview">${skin.icon}</div>
        <strong style="font-size:0.9rem;">${skin.name}</strong>
        <span style="font-size:0.75rem; color:#aaa;">${skin.weapon}</span>
        ${!isUnlocked ? `<span style="font-size:0.75rem; color:#ffd700; margin-top:4px;">💰 ${skin.price} Koban</span>` : ''}
      `;

      card.addEventListener('click', () => {
        gameState.selectedSkinId = skin.id;
        document.querySelectorAll('.skin-card-item').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.updateSkinDetailCard(skin);
      });

      grid.appendChild(card);
    });

    const currentSkin = gameState.skinsCatalog.find(s => s.id === gameState.selectedSkinId);
    this.updateSkinDetailCard(currentSkin);
  }

  updateSkinDetailCard(skin) {
    const isUnlocked = gameState.unlockedSkins.includes(skin.id);
    document.getElementById('skin-detail-name').textContent = skin.name;
    document.getElementById('skin-detail-weapon').textContent = skin.weapon;
    document.getElementById('skin-detail-passive').textContent = skin.desc;

    const priceTag = document.getElementById('skin-detail-price');
    const confirmBtn = document.getElementById('btn-confirm-skin');
    const buyBtn = document.getElementById('btn-buy-skin');

    if (isUnlocked) {
      priceTag.textContent = 'Разблокирован';
      priceTag.style.color = '#2ecc71';
      confirmBtn.style.display = 'block';
      buyBtn.style.display = 'none';
    } else {
      priceTag.textContent = `Цена: 💰 ${skin.price} Koban Gold`;
      priceTag.style.color = '#ffd700';
      confirmBtn.style.display = 'none';
      buyBtn.style.display = 'block';
      buyBtn.textContent = `💰 КУПИТЬ СКИН (${skin.price} KOBAN)`;
    }
  }

  renderLevelsGrid() {
    const grid = document.getElementById('levels-grid');
    grid.innerHTML = '';

    gameState.levelsCatalog.forEach(lvl => {
      const isLocked = lvl.num > gameState.unlockedLevels;
      const card = document.createElement('div');
      card.className = `level-card ${lvl.num === gameState.selectedLevelNum ? 'selected' : ''} ${isLocked ? 'locked' : ''}`;
      card.innerHTML = `
        <strong style="color:#b8860b;">${lvl.title}</strong>
        <p style="font-size:0.8rem; color:#ccc; margin-top:4px;">Босс: ${lvl.boss}</p>
        ${isLocked ? '<span style="font-size:0.75rem; color:#ff5555;">🔒 Заблокировано</span>' : ''}
      `;

      card.addEventListener('click', () => {
        if (isLocked) return;
        gameState.selectedLevelNum = lvl.num;
        document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        document.getElementById('selected-level-title').textContent = lvl.title;
        document.getElementById('selected-level-desc').textContent = lvl.desc;
      });

      grid.appendChild(card);
    });
  }

  triggerChapterIntroAndStart() {
    document.querySelectorAll('.ui-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('menu-bg-slideshow').style.display = 'none';

    const introScreen = document.getElementById('screen-chapter-intro');
    introScreen.classList.add('active');

    const level = gameState.levelsCatalog.find(l => l.num === gameState.selectedLevelNum);
    document.getElementById('chapter-subtitle').textContent = `ГЛАВА ${level.num}`;
    document.getElementById('chapter-title').textContent = level.title.toUpperCase();
    document.getElementById('chapter-lore').textContent = level.desc;

    setTimeout(() => {
      introScreen.classList.remove('active');
      document.getElementById('hud-overlay').classList.add('active');
      if (this.onStartRun) this.onStartRun();
    }, 2000);
  }

  showLevelUpModal(onChoiceMade) {
    this.renderLevelUpCards(onChoiceMade);
    document.getElementById('reroll-count').textContent = gameState.rerollsLeft;
    this.showModal('modal-levelup');
  }

  renderLevelUpCards(onChoiceMade) {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';

    const shuffled = [...gameState.allCardsPool].sort(() => Math.random() - 0.5);
    const chosen3 = shuffled.slice(0, 3);

    chosen3.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = `upgrade-card rarity-${card.rarity}`;
      cardEl.innerHTML = `
        <div class="card-icon">${card.icon}</div>
        <div class="card-title">${card.name}</div>
        <div style="font-size:0.75rem; text-transform:uppercase; color:#b8860b;">${card.rarity}</div>
        <div class="card-desc">${card.desc}</div>
      `;

      cardEl.addEventListener('click', () => {
        this.hideModal('modal-levelup');
        if (onChoiceMade) onChoiceMade(card);
        if (window.resumeGameLoop) window.resumeGameLoop();
      });

      container.appendChild(cardEl);
    });
  }

  updateHUD() {
    document.getElementById('hud-hp-fill').style.width = `${Math.max(0, (gameState.hp / gameState.maxHp) * 100)}%`;
    document.getElementById('hud-hp-text').textContent = `${Math.ceil(gameState.hp)}/${gameState.maxHp}`;

    document.getElementById('hud-level-num').textContent = gameState.playerLevel;
    document.getElementById('hud-xp-fill').style.width = `${(gameState.currentXP / gameState.targetXP) * 100}%`;
    document.getElementById('hud-kills').textContent = gameState.kills;
    document.getElementById('hud-gold-earned').textContent = gameState.runGoldEarned;

    const mins = Math.floor(gameState.runTimeSeconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(gameState.runTimeSeconds % 60).toString().padStart(2, '0');
    document.getElementById('hud-timer').textContent = `${mins}:${secs}`;
  }
}
