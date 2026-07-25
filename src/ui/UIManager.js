import { gameState } from '../systems/GameState.js';

export class UIManager {
  constructor(onStartRunCallback) {
    this.onStartRun = onStartRunCallback;
    this.activeScreen = 'screen-main-menu';

    this.bindEvents();
    this.renderSkinsGrid();
    this.renderLevelsGrid();
    this.startBackgroundSlideshow();
  }

  startBackgroundSlideshow() {
    const slides = document.querySelectorAll('.bg-slide');
    if (!slides || slides.length === 0) return;

    let currentIdx = 0;
    // Slow, calm 12-second slideshow interval as requested
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

  bindEvents() {
    // Main Menu Buttons
    document.getElementById('btn-start-run').addEventListener('click', () => {
      this.showScreen('screen-level-select');
    });

    document.getElementById('btn-select-skin').addEventListener('click', () => {
      this.showScreen('screen-skin-select');
    });

    document.getElementById('btn-select-level').addEventListener('click', () => {
      this.showScreen('screen-level-select');
    });

    document.getElementById('btn-open-settings').addEventListener('click', () => {
      this.showScreen('screen-settings');
    });

    const exitBtn = document.getElementById('btn-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        alert('Выход из игры.');
      });
    }

    // Back Buttons
    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => this.showScreen('screen-main-menu'));
    });

    // Launch Level Button
    document.getElementById('btn-launch-level').addEventListener('click', () => {
      this.triggerChapterIntroAndStart();
    });

    // Confirm Skin Button
    document.getElementById('btn-confirm-skin').addEventListener('click', () => {
      this.showScreen('screen-main-menu');
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

  renderSkinsGrid() {
    const grid = document.getElementById('skins-grid');
    grid.innerHTML = '';

    gameState.skinsCatalog.forEach(skin => {
      const card = document.createElement('div');
      card.className = `skin-card-item ${skin.id === gameState.selectedSkinId ? 'selected' : ''} ${!skin.unlocked ? 'locked' : ''}`;
      card.innerHTML = `
        <div class="skin-icon-preview">${skin.icon}</div>
        <strong style="font-size:0.9rem;">${skin.name}</strong>
        <span style="font-size:0.75rem; color:#aaa;">${skin.weapon}</span>
      `;

      card.addEventListener('click', () => {
        if (!skin.unlocked) return;
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
    document.getElementById('skin-detail-name').textContent = skin.name;
    document.getElementById('skin-detail-weapon').textContent = skin.weapon;
    document.getElementById('skin-detail-passive').textContent = skin.desc;
  }

  renderLevelsGrid() {
    const grid = document.getElementById('levels-grid');
    grid.innerHTML = '';

    gameState.levelsCatalog.forEach(lvl => {
      const card = document.createElement('div');
      card.className = `level-card ${lvl.num === gameState.selectedLevelNum ? 'selected' : ''}`;
      card.innerHTML = `
        <strong style="color:#b8860b;">${lvl.title}</strong>
        <p style="font-size:0.8rem; color:#ccc; margin-top:4px;">Босс: ${lvl.boss}</p>
      `;

      card.addEventListener('click', () => {
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

    const mins = Math.floor(gameState.runTimeSeconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(gameState.runTimeSeconds % 60).toString().padStart(2, '0');
    document.getElementById('hud-timer').textContent = `${mins}:${secs}`;
  }
}
