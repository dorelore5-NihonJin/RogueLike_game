import { gameState } from '../systems/GameState.js';
import { PixelCharacterRenderer } from '../models/PixelCharacterRenderer.js';

export class UIManager {
  constructor(onStartRunCallback) {
    this.onStartRun = onStartRunCallback;
    this.activeScreen = 'screen-main-menu';
    this.activeSettingsTab = 'audio';

    this.bindEvents();
    this.renderSkinsCarousel();
    this.renderLevelsGrid();
    this.updateProfileBadge();
    this.startBackgroundSlideshow();

    // Init 2D Animated Pixel Character Showcase Viewport
    setTimeout(() => {
      this.initHeroPedestalScene();
    }, 100);
  }

  startBackgroundSlideshow() {
    const slides = document.querySelectorAll('.bg-slide');
    if (!slides || slides.length === 0) return;

    let currentIdx = Math.floor(Math.random() * slides.length);
    slides.forEach(s => s.classList.remove('active'));

    setTimeout(() => {
      slides[currentIdx].classList.add('active');
    }, 50);

    setInterval(() => {
      if (this.activeScreen === 'screen-main-menu') {
        let nextIdx = currentIdx;
        while (nextIdx === currentIdx) {
          nextIdx = Math.floor(Math.random() * slides.length);
        }

        slides[currentIdx].classList.remove('active');
        slides[nextIdx].classList.add('active');
        currentIdx = nextIdx;
      }
    }, 14000);
  }

  initHeroPedestalScene() {
    const container = document.getElementById('hero-pedestal-viewport');
    const canvas = document.getElementById('hero-pedestal-canvas');
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
      const width = container.clientWidth || 550;
      const height = container.clientHeight || 335;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = (time) => {
      requestAnimationFrame(animate);
      if (this.activeScreen === 'screen-skin-select' && ctx) {
        PixelCharacterRenderer.drawCharacter(ctx, gameState.selectedSkinId, canvas.width, canvas.height, time);
      }
    };
    requestAnimationFrame(animate);
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

    if (screenId === 'screen-skin-select') {
      const currentSkin = gameState.skinsCatalog.find(s => s.id === gameState.selectedSkinId) || gameState.skinsCatalog[0];
      this.updateSkinDetailCard(currentSkin);
      this.updateProfileBadge();
    }

    if (screenId === 'screen-level-select') {
      this.renderLevelsGrid();
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
    const lvlVal = document.getElementById('account-level-val');
    if (lvlVal) lvlVal.textContent = gameState.accountLevel;

    const goldVal = document.getElementById('account-gold-val');
    if (goldVal) goldVal.textContent = gameState.gold.toLocaleString();

    const pct = Math.min(100, (gameState.accountXP / gameState.accountTargetXP) * 100);
    const xpFill = document.getElementById('account-xp-fill');
    if (xpFill) xpFill.style.width = `${pct}%`;

    const skinLvlVal = document.getElementById('skin-user-level-val');
    if (skinLvlVal) skinLvlVal.textContent = `Lv. ${gameState.accountLevel}`;

    const skinGoldVal = document.getElementById('skin-user-gold-val');
    if (skinGoldVal) skinGoldVal.textContent = `${gameState.gold.toLocaleString()} G`;

    const skinXpFill = document.getElementById('skin-user-xp-fill');
    if (skinXpFill) skinXpFill.style.width = `${pct}%`;

    const skinXpText = document.getElementById('skin-user-xp-text');
    if (skinXpText) skinXpText.textContent = `${gameState.accountXP.toLocaleString()} / ${gameState.accountTargetXP.toLocaleString()} XP`;
  }

  bindEvents() {
    document.getElementById('btn-start-run').addEventListener('click', () => {
      gameState.gameMode = 'campaign';
      const tabCampaign = document.getElementById('tab-mode-campaign');
      const tabEndless = document.getElementById('tab-mode-endless');
      if (tabCampaign) tabCampaign.classList.add('active');
      if (tabEndless) tabEndless.classList.remove('active');
      this.showScreen('screen-level-select');
    });

    document.getElementById('btn-select-skin').addEventListener('click', () => {
      this.renderSkinsCarousel();
      this.showScreen('screen-skin-select');
    });

    const btnQuickChangeHero = document.getElementById('btn-quick-change-hero');
    if (btnQuickChangeHero) {
      btnQuickChangeHero.addEventListener('click', () => {
        this.renderSkinsCarousel();
        this.showScreen('screen-skin-select');
      });
    }

    document.getElementById('btn-open-endless').addEventListener('click', () => {
      gameState.gameMode = 'endless';
      const tabCampaign = document.getElementById('tab-mode-campaign');
      const tabEndless = document.getElementById('tab-mode-endless');
      if (tabEndless) tabEndless.classList.add('active');
      if (tabCampaign) tabCampaign.classList.remove('active');
      this.showScreen('screen-level-select');
    });

    const tabCampaign = document.getElementById('tab-mode-campaign');
    const tabEndless = document.getElementById('tab-mode-endless');

    if (tabCampaign) {
      tabCampaign.addEventListener('click', () => {
        gameState.gameMode = 'campaign';
        tabCampaign.classList.add('active');
        if (tabEndless) tabEndless.classList.remove('active');
        this.renderLevelsGrid();
      });
    }

    if (tabEndless) {
      tabEndless.addEventListener('click', () => {
        gameState.gameMode = 'endless';
        tabEndless.classList.add('active');
        if (tabCampaign) tabCampaign.classList.remove('active');
        this.renderLevelsGrid();
      });
    }

    document.getElementById('btn-open-codex').addEventListener('click', () => {
      this.renderCodexContent('weapons');
      this.showScreen('screen-codex');
    });

    document.getElementById('btn-open-settings').addEventListener('click', () => {
      this.showScreen('screen-settings');
      this.switchSettingsTab('audio', document.getElementById('settings-tab-audio'));
    });

    const exitBtn = document.getElementById('btn-exit');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => alert('Выход из игры.'));
    }

    document.getElementById('settings-tab-audio').addEventListener('click', (e) => this.switchSettingsTab('audio', e.currentTarget));
    document.getElementById('settings-tab-graphics').addEventListener('click', (e) => this.switchSettingsTab('graphics', e.currentTarget));
    document.getElementById('settings-tab-controls').addEventListener('click', (e) => this.switchSettingsTab('controls', e.currentTarget));
    document.getElementById('settings-tab-gameplay').addEventListener('click', (e) => this.switchSettingsTab('gameplay', e.currentTarget));

    const applyBtn = document.getElementById('btn-apply-settings');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => alert('Настройки успешно сохранены!'));
    }

    document.getElementById('account-badge').addEventListener('click', () => {
      this.renderProfileScrollStats();
      this.showModal('modal-profile-stats');
    });

    document.getElementById('btn-close-stats').addEventListener('click', () => {
      this.hideModal('modal-profile-stats');
    });

    document.getElementById('codex-tab-weapons').addEventListener('click', (e) => this.switchCodexTab('weapons', e.currentTarget));
    document.getElementById('codex-tab-abilities').addEventListener('click', (e) => this.switchCodexTab('abilities', e.currentTarget));
    document.getElementById('codex-tab-yokai').addEventListener('click', (e) => this.switchCodexTab('yokai', e.currentTarget));
    document.getElementById('codex-tab-lore').addEventListener('click', (e) => this.switchCodexTab('lore', e.currentTarget));

    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => this.showScreen('screen-main-menu'));
    });

    const btnLaunchRun = document.getElementById('btn-launch-run');
    if (btnLaunchRun) {
      btnLaunchRun.addEventListener('click', () => {
        this.triggerChapterIntroAndStart();
      });
    }

    document.getElementById('btn-confirm-skin').addEventListener('click', () => {
      this.showScreen('screen-main-menu');
    });

    document.getElementById('btn-buy-skin').addEventListener('click', () => {
      const selectedSkin = gameState.skinsCatalog.find(s => s.id === gameState.selectedSkinId);
      if (selectedSkin) {
        const res = gameState.buySkin(selectedSkin.id);
        alert(res.message);
        if (res.success) {
          this.renderSkinsCarousel();
          this.updateProfileBadge();
          this.updateSkinDetailCard(selectedSkin);
        }
      }
    });

    const strip = document.getElementById('skin-carousel-strip');
    const leftArrow = document.getElementById('carousel-btn-left');
    const rightArrow = document.getElementById('carousel-btn-right');

    if (leftArrow && strip) {
      leftArrow.addEventListener('click', () => strip.scrollBy({ left: -240, behavior: 'smooth' }));
    }
    if (rightArrow && strip) {
      rightArrow.addEventListener('click', () => strip.scrollBy({ left: 240, behavior: 'smooth' }));
    }

    if (strip) {
      strip.addEventListener('wheel', (e) => {
        e.preventDefault();
        strip.scrollLeft += e.deltaY * 1.2;
      }, { passive: false });
    }

    document.getElementById('btn-restart-run').addEventListener('click', () => {
      this.hideModal('modal-gameover');
      this.showScreen('screen-main-menu');
    });

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

  getSkinSVGIcon(svgType) {
    if (svgType === 'samurai') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
        <path d="M4 4 h3 v2 h-3 z M17 4 h3 v2 h-3 z M6 6 h3 v2 h-3 z M15 6 h3 v2 h-3 z M8 8 h8 v2 h-8 z" fill="#ffd700"/>
        <path d="M7 10 h10 v6 h-10 z" fill="#8b0000"/>
        <path d="M9 12 h6 v3 h-6 z" fill="#d4af37"/>
      </svg>`;
    } else if (svgType === 'ninja') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
        <path d="M4 8 h16 v10 h-16 z" fill="#1f1f2e"/>
        <rect x="7" y="11" width="10" height="3" fill="#ffd700"/>
        <rect x="8" y="12" width="2" height="1" fill="#000000"/>
        <rect x="14" y="12" width="2" height="1" fill="#000000"/>
      </svg>`;
    } else if (svgType === 'archer') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
        <path d="M6 3 c4 6 4 12 0 18" fill="none" stroke="#b8860b" stroke-width="2.5"/>
        <line x1="6" y1="3" x2="6" y2="21" stroke="#ffffff" stroke-width="1"/>
        <line x1="2" y1="12" x2="16" y2="12" stroke="#d4af37" stroke-width="2"/>
        <path d="M16 12 l-4 -3 v6 z" fill="#ff3333"/>
      </svg>`;
    } else if (svgType === 'nodachi') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
        <path d="M3 21 l16 -16 h3 v3 l-16 16 z" fill="#e2e8f0" stroke="#8b0000" stroke-width="1"/>
        <rect x="3" y="19" width="4" height="4" fill="#ffd700"/>
      </svg>`;
    } else if (svgType === 'miko') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
        <path d="M4 4 h16 v2 h-16 z M6 6 h2 v14 h-2 z M16 6 h2 v14 h-2 z M4 10 h16 v2 h-16 z" fill="#ff3333"/>
      </svg>`;
    } else if (svgType === 'sohei') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
        <circle cx="12" cy="12" r="8" fill="none" stroke="#ffd700" stroke-width="2" stroke-dasharray="3,3"/>
        <path d="M4 20 l14 -14 l3 1 l-1 3 l-14 14 z" fill="#c0c0c0"/>
      </svg>`;
    } else if (svgType === 'onmyoji') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
        <circle cx="12" cy="12" r="9" fill="#111" stroke="#ffd700" stroke-width="1.5"/>
        <path d="M12 3 a4.5 4.5 0 0 0 0 9 a4.5 4.5 0 0 1 0 9 a9 9 0 0 1 0 -18" fill="#ffffff"/>
        <circle cx="12" cy="7.5" r="1.5" fill="#111"/>
        <circle cx="12" cy="16.5" r="1.5" fill="#ffffff"/>
      </svg>`;
    } else if (svgType === 'demon_ronin') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
        <path d="M5 4 l3 4 h8 l3 -4 l-2 7 h-10 z" fill="#ff2222"/>
        <rect x="7" y="13" width="10" height="7" fill="#110505" stroke="#ff3333" stroke-width="1"/>
        <circle cx="9.5" cy="15.5" r="1" fill="#ffd700"/>
        <circle cx="14.5" cy="15.5" r="1" fill="#ffd700"/>
      </svg>`;
    }
    return '';
  }

  getEndlessSVGIcon(modeId) {
    if (modeId === 'blood_moon') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="26" height="26">
        <path d="M12 3 a9 9 0 1 0 9 9 a7 7 0 1 1 -9 -9 z" fill="#ff2222"/>
        <circle cx="15" cy="8" r="1.5" fill="#ffd700"/>
      </svg>`;
    } else if (modeId === 'rush_1000') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="26" height="26">
        <path d="M6 3 h12 v3 l-4 4 l4 4 v3 h-12 v-3 l4 -4 l-4 -4 z" fill="none" stroke="#ffd700" stroke-width="2"/>
        <path d="M8 5 h8 v1 h-8 z M9 18 h6 v1 h-6 z" fill="#ffd700"/>
      </svg>`;
    } else if (modeId === 'boss_gauntlet') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="26" height="26">
        <path d="M5 4 l3 4 h8 l3 -4 l-2 7 h-10 z" fill="#ff2222"/>
        <rect x="7" y="13" width="10" height="7" fill="#110505" stroke="#ff3333" stroke-width="1"/>
        <circle cx="9.5" cy="15.5" r="1.5" fill="#ffd700"/>
        <circle cx="14.5" cy="15.5" r="1.5" fill="#ffd700"/>
      </svg>`;
    } else if (modeId === 'one_hit') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="26" height="26">
        <path d="M3 21 l16 -16 h3 v3 l-16 16 z" fill="#e2e8f0" stroke="#ff2222" stroke-width="1.5"/>
        <circle cx="6" cy="18" r="2" fill="#ffd700"/>
      </svg>`;
    }
    return '';
  }

  getEnemySVGIcon(enemyName) {
    const name = enemyName.toLowerCase();
    if (name.includes('ninja')) {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20">
        <rect x="5" y="5" width="14" height="14" fill="#1f1f2e" rx="3"/>
        <rect x="8" y="10" width="8" height="3" fill="#ff3333"/>
        <rect x="10" y="11" width="1" height="1" fill="#ffffff"/>
        <rect x="13" y="11" width="1" height="1" fill="#ffffff"/>
      </svg>`;
    } else if (name.includes('samurai')) {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20">
        <path d="M4 4 h16 v4 h-16 z" fill="#ffd700"/>
        <path d="M6 8 h12 v10 h-12 z" fill="#8b0000"/>
      </svg>`;
    } else if (name.includes('archer')) {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20">
        <path d="M4 6 c4 4 4 8 0 12" fill="none" stroke="#b8860b" stroke-width="2"/>
        <line x1="1" y1="12" x2="15" y2="12" stroke="#ff3333" stroke-width="2"/>
      </svg>`;
    } else if (name.includes('oni') || name.includes('ogre') || name.includes('brute')) {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20">
        <path d="M6 4 l3 4 h6 l3 -4 l-2 7 h-10 z" fill="#ff2222"/>
        <rect x="7" y="12" width="10" height="8" fill="#110505"/>
        <circle cx="9" cy="15" r="1.5" fill="#ffd700"/>
        <circle cx="15" cy="15" r="1.5" fill="#ffd700"/>
      </svg>`;
    }
    return `<svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20">
      <circle cx="12" cy="12" r="8" fill="#8b0000"/>
    </svg>`;
  }

  getCardSVGIcon(type) {
    if (type === 'damage') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="40" height="40">
        <path d="M3 21 l16 -16 h3 v3 l-16 16 z" fill="#e2e8f0" stroke="#ff3333" stroke-width="1.5"/>
      </svg>`;
    } else if (type === 'speed') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="40" height="40">
        <path d="M13 2 L3 14 h8 l-2 8 l10 -12 h-8 z" fill="#ffd700"/>
      </svg>`;
    } else if (type === 'hp' || type === 'heal') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="40" height="40">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#2ecc71"/>
      </svg>`;
    } else if (type === 'defense') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="40" height="40">
        <path d="M12 2 l9 4 v6 c0 5.5 -3.8 10.7 -9 12 c-5.2 -1.3 -9 -6.5 -9 -12 v-6 z" fill="#3498db"/>
      </svg>`;
    } else if (type === 'crit') {
      return `<svg class="pixel-icon" viewBox="0 0 24 24" width="40" height="40">
        <circle cx="12" cy="12" r="9" fill="none" stroke="#e74c3c" stroke-width="2"/>
        <line x1="12" y1="3" x2="12" y2="21" stroke="#e74c3c" stroke-width="2"/>
        <line x1="3" y1="12" x2="21" y2="12" stroke="#e74c3c" stroke-width="2"/>
      </svg>`;
    }
    return `<svg class="pixel-icon" viewBox="0 0 24 24" width="40" height="40">
      <path d="M12 2 l3 6 l6 1 l-4.5 4.5 l1 6.5 l-5.5 -3 l-5.5 3 l1 -6.5 l-4.5 -4.5 l6 -1 z" fill="#ffd700"/>
    </svg>`;
  }

  renderSkinsCarousel() {
    const strip = document.getElementById('skin-carousel-strip');
    if (!strip) return;
    strip.innerHTML = '';

    gameState.skinsCatalog.forEach(skin => {
      const isUnlocked = gameState.unlockedSkins.includes(skin.id);
      const isSelected = skin.id === gameState.selectedSkinId;

      const card = document.createElement('div');
      card.className = `strip-card-item ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;
      
      let badgeHtml = '';
      if (isSelected) {
        badgeHtml = '<span class="strip-card-badge badge-selected">(Selected)</span>';
      } else if (isUnlocked) {
        badgeHtml = '<span class="strip-card-badge badge-unlocked">(Unlocked)</span>';
      } else {
        badgeHtml = `<span class="strip-card-badge badge-locked">🔒 ${skin.price} G</span>`;
      }

      card.innerHTML = `
        <div class="strip-avatar-wrap">${this.getSkinSVGIcon(skin.svgType)}</div>
        <div class="strip-card-title">${skin.name.split(' ')[0]}</div>
        ${badgeHtml}
      `;

      card.addEventListener('click', () => {
        gameState.selectedSkinId = skin.id;
        document.querySelectorAll('.strip-card-item').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.updateSkinDetailCard(skin);
      });

      strip.appendChild(card);
    });

    const currentSkin = gameState.skinsCatalog.find(s => s.id === gameState.selectedSkinId) || gameState.skinsCatalog[0];
    this.updateSkinDetailCard(currentSkin);
  }

  updateSkinDetailCard(skin) {
    const isUnlocked = gameState.unlockedSkins.includes(skin.id);

    document.getElementById('showcase-skin-name').textContent = skin.title || skin.name;
    document.getElementById('showcase-skin-rarity').textContent = `(${skin.rarity})`;

    const confirmBtn = document.getElementById('btn-confirm-skin');
    const buyBtn = document.getElementById('btn-buy-skin');

    if (isUnlocked) {
      confirmBtn.style.display = 'block';
      buyBtn.style.display = 'none';
    } else {
      confirmBtn.style.display = 'none';
      buyBtn.style.display = 'block';
      buyBtn.querySelector('.btn-text').textContent = `КУПИТЬ СКИН (${skin.price} KOBAN)`;
    }

    document.getElementById('stats-hero-title').textContent = skin.name.toUpperCase();

    document.getElementById('val-attr-hp').textContent = `${skin.hp}/${skin.hp}`;
    document.getElementById('bar-hp-fill').style.width = `${Math.min(100, (skin.hp / 320) * 100)}%`;

    document.getElementById('val-attr-speed').textContent = skin.speed;
    document.getElementById('bar-speed-fill').style.width = `${Math.min(100, (skin.speed / 50) * 100)}%`;

    document.getElementById('val-attr-crit').textContent = `${skin.critRate}%`;
    document.getElementById('bar-crit-fill').style.width = `${Math.min(100, (skin.critRate / 35) * 100)}%`;

    document.getElementById('stats-weapon-icon').innerHTML = this.getSkinSVGIcon(skin.svgType);
    document.getElementById('stats-weapon-name').textContent = skin.weapon;
    document.getElementById('stats-weapon-desc').textContent = skin.weaponDesc || 'Особое самурайское оружие.';

    document.getElementById('stats-passive-name').textContent = skin.passiveName || 'HONORABLE SPIRIT';
    document.getElementById('stats-passive-desc').textContent = skin.passiveDesc || skin.desc;
  }

  renderLevelsGrid() {
    const grid = document.getElementById('stage-cards-container');
    if (!grid) return;
    grid.innerHTML = '';

    if (gameState.gameMode === 'endless') {
      grid.className = 'stage-cards-grid endless-grid-layout';
      this.renderEndlessModeCards(grid);
    } else {
      grid.className = 'stage-cards-grid';
      this.renderCampaignStageCards(grid);
    }

    this.updateSelectedLevelPanelInfo();
  }

  renderCampaignStageCards(grid) {
    gameState.levelsCatalog.forEach(lvl => {
      const isSelected = lvl.num === gameState.selectedLevelNum;
      const isCompleted = gameState.completedStageNums && gameState.completedStageNums.includes(lvl.num);
      const isLocked = lvl.num > gameState.unlockedLevels;

      const card = document.createElement('div');
      let statusClass = isSelected ? 'selected' : (isCompleted ? 'completed' : (isLocked ? 'locked' : ''));
      card.className = `stage-card-item ${statusClass}`;

      let statusPill = '';
      if (isSelected) {
        statusPill = `<span class="stage-card-status status-selected">
          <svg class="pixel-icon" viewBox="0 0 24 24" width="12" height="12"><path d="M12 2l3 6l6 1l-4.5 4.5l1 6.5l-5.5-3l-5.5 3l1-6.5l-4.5-4.5l6-1z" fill="#ffd700"/></svg> Selected
        </span>`;
      } else if (isCompleted) {
        statusPill = `<span class="stage-card-status status-completed">
          <svg class="pixel-icon" viewBox="0 0 24 24" width="12" height="12"><path d="M20 6L9 17l-5-5" fill="none" stroke="#10b981" stroke-width="3"/></svg> Completed
        </span>`;
      } else if (isLocked) {
        statusPill = `<span class="stage-card-status status-locked">
          <svg class="pixel-icon" viewBox="0 0 24 24" width="12" height="12"><rect x="5" y="11" width="14" height="10" rx="2" fill="#ef4444"/><path d="M8 11 V7 a4 4 0 0 1 8 0 v4" fill="none" stroke="#ef4444" stroke-width="2"/></svg> Locked
        </span>`;
      } else {
        statusPill = `<span class="stage-card-status status-completed" style="color:#b89b7d;">
          Available
        </span>`;
      }

      const bgStyle = this.getStageThumbnailStyle(lvl.num);

      card.innerHTML = `
        <div class="stage-thumb-bg" style="${bgStyle}"></div>
        <div class="stage-card-content">
          <div class="stage-card-title">Stage ${lvl.num}: ${lvl.title}</div>
          ${statusPill}
        </div>
      `;

      card.addEventListener('click', () => {
        if (isLocked) return;
        gameState.selectedLevelNum = lvl.num;
        gameState.saveToDisk();
        this.renderLevelsGrid(); // Re-render grid so selection updates reliably!
      });

      grid.appendChild(card);
    });
  }

  renderEndlessModeCards(grid) {
    gameState.endlessModesCatalog.forEach(em => {
      const isSelected = em.id === gameState.selectedEndlessModeId;
      const card = document.createElement('div');
      card.className = `stage-card-item endless-scroll-card ${isSelected ? 'selected' : ''}`;

      card.innerHTML = `
        <div class="endless-card-head">
          <div class="endless-card-icon-frame">${this.getEndlessSVGIcon(em.id)}</div>
          <div class="endless-card-titles">
            <h3>${em.title}</h3>
            <span>MODE: ${em.subtitle.toUpperCase()}</span>
          </div>
        </div>
        <div class="endless-card-desc">${em.desc}</div>
        <div class="endless-card-modifier">MODIFIER: ${em.modifier}</div>
      `;

      card.addEventListener('click', () => {
        gameState.selectedEndlessModeId = em.id;
        gameState.saveToDisk();
        this.renderLevelsGrid(); // Re-render grid so selection updates reliably!
      });

      grid.appendChild(card);
    });
  }

  getStageThumbnailStyle(num) {
    const thumbMap = {
      1: './assets/menu_wallpapers/stage_thumb_1.jpg',
      2: './assets/menu_wallpapers/stage_thumb_2.jpg',
      3: './assets/menu_wallpapers/stage_thumb_3.jpg',
      4: './assets/menu_wallpapers/stage_thumb_4.jpg',
      5: './assets/menu_wallpapers/stage_thumb_5.jpg',
      6: './assets/menu_wallpapers/stage_thumb_6.jpg',
      7: './assets/menu_wallpapers/stage_thumb_7.jpg',
      8: './assets/menu_wallpapers/menu_bg_8.jpg',
      9: './assets/menu_wallpapers/menu_bg_4.jpg',
      10: './assets/menu_wallpapers/menu_bg_6.jpg',
      11: './assets/menu_wallpapers/menu_bg_7.jpg',
      12: './assets/menu_wallpapers/menu_bg_1.jpg'
    };
    const imgPath = thumbMap[num] || './assets/menu_wallpapers/stage_thumb_1.jpg';
    return `background-image: url('${imgPath}'); background-size: cover; background-position: center;`;
  }

  updateSelectedLevelPanelInfo() {
    if (gameState.gameMode === 'endless') {
      const em = gameState.endlessModesCatalog.find(m => m.id === gameState.selectedEndlessModeId) || gameState.endlessModesCatalog[0];
      document.getElementById('panel-boss-name').textContent = 'ENDLESS ARENA';
      document.getElementById('panel-stage-title').textContent = em.title.toUpperCase();
      document.getElementById('panel-stage-desc').textContent = em.desc;
      document.getElementById('panel-stage-rewards').textContent = `MODIFIER: ${em.modifier}`;
      document.getElementById('panel-diff-badge').textContent = `MODE: ${em.subtitle.toUpperCase()}`;

      const enemyRow = document.getElementById('enemy-badges-row');
      if (enemyRow) {
        enemyRow.innerHTML = '';
        const enemies = ['Ninja', 'Samurai', 'Archer', 'Oni Brute'];
        enemies.forEach(eName => {
          const badge = document.createElement('div');
          badge.className = 'enemy-badge-item';
          badge.innerHTML = `
            <div class="enemy-icon-frame">${this.getEnemySVGIcon(eName)}</div>
            <span>${eName}</span>
          `;
          enemyRow.appendChild(badge);
        });
      }

      document.getElementById('boss-avatar-frame').innerHTML = this.getEndlessSVGIcon(em.id);
    } else {
      const level = gameState.levelsCatalog.find(l => l.num === gameState.selectedLevelNum) || gameState.levelsCatalog[0];
      document.getElementById('panel-boss-name').textContent = level.boss.toUpperCase();
      document.getElementById('panel-stage-title').textContent = `STAGE ${level.num}: ${level.title.toUpperCase()}`;
      document.getElementById('panel-stage-desc').textContent = level.desc;
      document.getElementById('panel-stage-rewards').textContent = `REWARD: 💰 ${level.goldReward} KOBAN | +${level.xpReward} XP`;
      document.getElementById('panel-diff-badge').textContent = `DIFFICULTY: ${level.danger}`;

      const enemyRow = document.getElementById('enemy-badges-row');
      if (enemyRow) {
        enemyRow.innerHTML = '';
        const enemies = level.enemies || ['Ninja', 'Samurai', 'Archer', 'Oni Brute'];
        enemies.forEach(eName => {
          const badge = document.createElement('div');
          badge.className = 'enemy-badge-item';
          badge.innerHTML = `
            <div class="enemy-icon-frame">${this.getEnemySVGIcon(eName)}</div>
            <span>${eName}</span>
          `;
          enemyRow.appendChild(badge);
        });
      }

      document.getElementById('boss-avatar-frame').innerHTML = `
        <svg class="pixel-icon" viewBox="0 0 24 24" width="34" height="34">
          <path d="M5 4 l3 4 h8 l3 -4 l-2 7 h-10 z" fill="#ff2222"/>
          <rect x="7" y="13" width="10" height="7" fill="#110505" stroke="#ff3333" stroke-width="1"/>
          <circle cx="9.5" cy="15.5" r="1.5" fill="#ffd700"/>
          <circle cx="14.5" cy="15.5" r="1.5" fill="#ffd700"/>
        </svg>
      `;
    }

    const selectedSkin = gameState.skinsCatalog.find(s => s.id === gameState.selectedSkinId) || gameState.skinsCatalog[0];
    const avatarEl = document.getElementById('bottom-player-avatar-icon');
    if (avatarEl) avatarEl.innerHTML = this.getSkinSVGIcon(selectedSkin.svgType);

    const skinName = document.getElementById('bottom-player-skin-name');
    if (skinName && selectedSkin) skinName.textContent = selectedSkin.name.split(' ')[0].toUpperCase();
  }

  switchSettingsTab(tabKey, clickedBtn) {
    document.querySelectorAll('.pixel-tab-item').forEach(b => b.classList.remove('active'));
    if (clickedBtn) clickedBtn.classList.add('active');
    this.activeSettingsTab = tabKey;
    this.renderSettingsCategoryRows(tabKey);
  }

  renderSettingsCategoryRows(tabKey) {
    const container = document.getElementById('settings-rows-container');
    container.innerHTML = '';

    if (tabKey === 'audio') {
      container.innerHTML = `
        <div class="pixel-setting-card">
          <div class="card-left">
            <svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M3 9 h4 l5 -5 v16 l-5 -5 h-4 z M16 8 a5 5 0 0 1 0 8 M19 5 a9 9 0 0 1 0 14" fill="none" stroke="#ffd700" stroke-width="2"/></svg>
            <span class="pixel-label">Master Volume (Общий Звук)</span>
          </div>
          <div class="card-right">
            <input type="range" id="setting-sfx" min="0" max="100" value="80" class="pixel-range">
            <span id="val-sfx" class="pixel-val-text">80%</span>
          </div>
        </div>

        <div class="pixel-setting-card">
          <div class="card-left">
            <svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M9 18 a3 3 0 1 1 -3 -3 h3 v-10 l10 -2 v10 a3 3 0 1 1 -3 -3 h3 v-7" fill="none" stroke="#ffd700" stroke-width="2"/></svg>
            <span class="pixel-label">Music Volume (Музыка)</span>
          </div>
          <div class="card-right">
            <input type="range" id="setting-music" min="0" max="100" value="60" class="pixel-range">
            <span id="val-music" class="pixel-val-text">60%</span>
          </div>
        </div>

        <div class="pixel-setting-card">
          <div class="card-left">
            <svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2 a10 10 0 1 0 0 20 a10 10 0 1 0 0 -20 z" fill="none" stroke="#ffd700" stroke-width="2"/></svg>
            <span class="pixel-label">UI Sound Effects (Звуки Кнопок)</span>
          </div>
          <div class="card-right">
            <label class="pixel-switch">
              <input type="checkbox" id="setting-sfx-toggle" checked>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      `;
    } else if (tabKey === 'graphics') {
      container.innerHTML = `
        <div class="pixel-setting-card">
          <div class="card-left">
            <svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M3 3 h6 v6 h-6 z M15 3 h6 v6 h-6 z M3 15 h6 v6 h-6 z M15 15 h6 v6 h-6 z" fill="#ffd700"/></svg>
            <span class="pixel-label">Pixelation Shader (Пикселизация)</span>
          </div>
          <div class="card-right">
            <input type="range" id="setting-pixel" min="1" max="5" value="2" class="pixel-range">
            <span id="val-pixel" class="pixel-val-text">2x Retro</span>
          </div>
        </div>

        <div class="pixel-setting-card">
          <div class="card-left">
            <svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="8" fill="none" stroke="#ffd700" stroke-width="2"/></svg>
            <span class="pixel-label">Lantern Glow (Свечение Фонарей)</span>
          </div>
          <div class="card-right">
            <label class="pixel-switch">
              <input type="checkbox" id="setting-bloom" checked>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>

        <div class="pixel-setting-card">
          <div class="card-left">
            <svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2 l3 6 l6 1 l-4.5 4.5 l1 6.5 l-5.5 -3 l-5.5 3 l1 -6.5 l-4.5 -4.5 l6 -1 z" fill="#ffd700"/></svg>
            <span class="pixel-label">Sakura Petals Particles (Пепел и Лепестки)</span>
          </div>
          <div class="card-right">
            <label class="pixel-switch">
              <input type="checkbox" id="setting-particles" checked>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      `;
    } else if (tabKey === 'controls') {
      container.innerHTML = `
        <div class="pixel-setting-card">
          <div class="card-left">
            <svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2 a6 10 0 0 0 -6 10 v4 a6 6 0 0 0 12 0 v-4 a6 10 0 0 0 -6 -10 z M12 4 v6" fill="none" stroke="#ffd700" stroke-width="2"/></svg>
            <span class="pixel-label">Mouse Aim Sensitivity (Чувствительность)</span>
          </div>
          <div class="card-right">
            <input type="range" id="setting-sensitivity" min="1" max="10" value="5" class="pixel-range">
            <span id="val-sensitivity" class="pixel-val-text">50%</span>
          </div>
        </div>

        <div class="pixel-setting-card">
          <div class="card-left">
            <svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M4 12 h16 M12 4 v16" fill="none" stroke="#ffd700" stroke-width="2"/></svg>
            <span class="pixel-label">Auto-Attack on Mouse Aim (Авто-Атака)</span>
          </div>
          <div class="card-right">
            <label class="pixel-switch">
              <input type="checkbox" id="setting-autoaim" checked>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      `;
    } else if (tabKey === 'gameplay') {
      container.innerHTML = `
        <div class="pixel-setting-card">
          <div class="card-left">
            <svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2 l3 6 l6 1 l-4.5 4.5 l1 6.5 l-5.5 -3 l-5.5 3 l1 -6.5 l-4.5 -4.5 l6 -1 z" fill="#ffd700"/></svg>
            <span class="pixel-label">Damage Numbers Overlay (Цифры Урона)</span>
          </div>
          <div class="card-right">
            <label class="pixel-switch">
              <input type="checkbox" id="setting-damage-nums" checked>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>

        <div class="pixel-setting-card">
          <div class="card-left">
            <svg class="pixel-icon" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2 a10 10 0 1 0 0 20 a10 10 0 1 0 0 -20 z M12 6 v6 l4 4" fill="none" stroke="#ffd700" stroke-width="2"/></svg>
            <span class="pixel-label">Screen Shake Intensity (Тряска Камеры)</span>
          </div>
          <div class="card-right">
            <input type="range" id="setting-shake" min="0" max="100" value="80" class="pixel-range">
            <span id="val-shake" class="pixel-val-text">80%</span>
          </div>
        </div>
      `;
    }

    this.bindSliderEvents();
  }

  bindSliderEvents() {
    const sfx = document.getElementById('setting-sfx');
    if (sfx) {
      sfx.addEventListener('input', (e) => {
        const valEl = document.getElementById('val-sfx');
        if (valEl) valEl.textContent = `${e.target.value}%`;
      });
    }

    const music = document.getElementById('setting-music');
    if (music) {
      music.addEventListener('input', (e) => {
        const valEl = document.getElementById('val-music');
        if (valEl) valEl.textContent = `${e.target.value}%`;
      });
    }

    const pixel = document.getElementById('setting-pixel');
    if (pixel) {
      pixel.addEventListener('input', (e) => {
        const valEl = document.getElementById('val-pixel');
        if (valEl) valEl.textContent = `${e.target.value}x Retro`;
      });
    }

    const sensitivity = document.getElementById('setting-sensitivity');
    if (sensitivity) {
      sensitivity.addEventListener('input', (e) => {
        const valEl = document.getElementById('val-sensitivity');
        if (valEl) valEl.textContent = `${e.target.value * 10}%`;
      });
    }

    const shake = document.getElementById('setting-shake');
    if (shake) {
      shake.addEventListener('input', (e) => {
        const valEl = document.getElementById('val-shake');
        if (valEl) valEl.textContent = `${e.target.value}%`;
      });
    }
  }

  renderProfileScrollStats() {
    const container = document.getElementById('stats-grid-container');
    container.innerHTML = `
      <div class="stat-card-item">
        <div class="stat-icon-wrap">
          <svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
            <ellipse cx="12" cy="12" rx="7" ry="10" fill="#ffd700" stroke="#b8860b" stroke-width="1.5"/>
            <line x1="8" y1="6" x2="16" y2="6" stroke="#b8860b" stroke-width="1"/>
            <line x1="8" y1="18" x2="16" y2="18" stroke="#b8860b" stroke-width="1"/>
            <path d="M10 9 h4 v2 h-4 z M11 11 h2 v4 h-2 z M9 15 h6 v1 h-6 z" fill="#8b6514"/>
          </svg>
        </div>
        <div class="stat-info">
          <label>Всего Кобанов</label>
          <strong>${gameState.gold.toLocaleString()} Koban</strong>
        </div>
      </div>

      <div class="stat-card-item">
        <div class="stat-icon-wrap">
          <svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
            <path d="M6 5 h12 v2 h2 v6 h-2 v3 h-3 v3 h-6 v-3 h-3 v-3 h-2 v-6 h2 z" fill="#f0e6d2"/>
            <rect x="8" y="9" width="3" height="4" fill="#100505"/>
            <rect x="13" y="9" width="3" height="4" fill="#100505"/>
          </svg>
        </div>
        <div class="stat-info">
          <label>Изгнано Ёкаев</label>
          <strong>${gameState.stats.totalKills.toLocaleString()} демонов</strong>
        </div>
      </div>

      <div class="stat-card-item">
        <div class="stat-icon-wrap">
          <svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
            <path d="M4 4 h3 v2 h-3 z M17 4 h3 v2 h-3 z M6 6 h3 v2 h-3 z M15 6 h3 v2 h-3 z M8 8 h8 v2 h-8 z" fill="#ffd700"/>
            <path d="M7 10 h10 v6 h-10 z" fill="#8b0000"/>
          </svg>
        </div>
        <div class="stat-info">
          <label>Разблокировано Воинов</label>
          <strong>${gameState.unlockedSkins.length} из ${gameState.skinsCatalog.length} скинов</strong>
        </div>
      </div>

      <div class="stat-card-item">
        <div class="stat-icon-wrap">
          <svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
            <rect x="3" y="7" width="18" height="10" rx="3" fill="#3b82f6"/>
            <rect x="6" y="11" width="4" height="2" fill="#ffffff"/>
            <rect x="7" y="10" width="2" height="4" fill="#ffffff"/>
            <circle cx="16" cy="11" r="1.2" fill="#ef4444"/>
            <circle cx="18" cy="13" r="1.2" fill="#f59e0b"/>
          </svg>
        </div>
        <div class="stat-info">
          <label>Сыграно Забегов</label>
          <strong>${gameState.stats.totalRuns} походов</strong>
        </div>
      </div>

      <div class="stat-card-item">
        <div class="stat-icon-wrap">
          <svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
            <path d="M4 6 h14 v12 h-14 z" fill="#d4af37"/>
            <rect x="6" y="8" width="10" height="2" fill="#24160f"/>
            <rect x="6" y="12" width="8" height="2" fill="#24160f"/>
          </svg>
        </div>
        <div class="stat-info">
          <label>Уровень Профиля</label>
          <strong>Уровень ${gameState.accountLevel} (${gameState.accountXP}/${gameState.accountTargetXP} XP)</strong>
        </div>
      </div>

      <div class="stat-card-item">
        <div class="stat-icon-wrap">
          <svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
            <path d="M11 2 h2 v3 h-2 z"/>
            <path d="M4 6 h16 v2 h-16 z" fill="#8b0000"/>
            <path d="M7 8 h10 v4 h-10 z" fill="#d4af37"/>
          </svg>
        </div>
        <div class="stat-info">
          <label>Открыто Глав Кампании</label>
          <strong>Глава ${gameState.unlockedLevels} из 12</strong>
        </div>
      </div>

      <div class="stat-card-item">
        <div class="stat-icon-wrap">
          <svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
            <path d="M3 21 l15 -15 h3 v3 l-15 15 z" fill="#e2e8f0"/>
            <path d="M21 21 l-15 -15 h-3 v3 l15 15 z" fill="#e2e8f0"/>
            <rect x="4" y="18" width="3" height="3" fill="#d4af37"/>
          </svg>
        </div>
        <div class="stat-info">
          <label>Любимый Воин</label>
          <strong>${gameState.skinsCatalog.find(s => s.id === gameState.selectedSkinId)?.name || 'Самурай'}</strong>
        </div>
      </div>

      <div class="stat-card-item">
        <div class="stat-icon-wrap">
          <svg class="pixel-icon" viewBox="0 0 24 24" width="22" height="22">
            <path d="M5 4 h14 v6 c0 4 -3 7 -7 7 s-7 -3 -7 -7 z" fill="#ffd700"/>
            <path d="M10 17 h4 v3 h-4 z" fill="#b8860b"/>
            <path d="M7 20 h10 v2 h-10 z" fill="#ffd700"/>
          </svg>
        </div>
        <div class="stat-info">
          <label>Победы над Боссами</label>
          <strong>${gameState.stats.victories} Боссов пало</strong>
        </div>
      </div>
    `;
  }

  switchCodexTab(tabName, clickedBtn) {
    document.querySelectorAll('.codex-tab-btn').forEach(b => b.classList.remove('active'));
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
            <h4>${w.name}</h4>
            <span class="codex-rarity-badge rarity-${w.rarityClass}">${w.tier}</span>
            <div class="stat-row-detail">Урон: <strong>${w.damage}</strong> | Перезарядка: <strong>${w.speed}</strong></div>
            <div class="codex-desc-text">${w.desc}</div>
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
            <h4>${a.name}</h4>
            <span class="codex-rarity-badge rarity-${a.rarityClass}">${a.rarity}</span>
            <div class="codex-desc-text">${a.effect}</div>
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
            <h4 style="color:#ff7777;">${y.name}</h4>
            <span class="codex-rarity-badge rarity-${y.rarityClass}">${y.tier}</span>
            <div class="stat-row-detail">Здоровье: <strong>${y.hp} HP</strong> | Атака: <strong>${y.attack}</strong></div>
            <div class="codex-desc-text">${y.lore}</div>
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
            <h3 style="color:#ffd700; font-family:'Cinzel',serif; font-size:1.4rem; margin-bottom:10px;">${l.title}</h3>
            <p style="line-height:1.6; color:#e0d0b0; font-size:0.95rem;">${l.content}</p>
          </div>
        `;
      });
      area.appendChild(loreBox);
    }
  }

  triggerChapterIntroAndStart() {
    document.querySelectorAll('.ui-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('menu-bg-slideshow').style.display = 'none';

    const introScreen = document.getElementById('screen-chapter-intro');
    introScreen.classList.add('active');

    if (gameState.gameMode === 'campaign') {
      const level = gameState.levelsCatalog.find(l => l.num === gameState.selectedLevelNum) || gameState.levelsCatalog[0];
      document.getElementById('chapter-subtitle').textContent = `STAGE ${level.num}`;
      document.getElementById('chapter-title').textContent = level.title.toUpperCase();
      document.getElementById('chapter-lore').textContent = level.desc;
    } else {
      const em = gameState.endlessModesCatalog.find(m => m.id === gameState.selectedEndlessModeId);
      document.getElementById('chapter-subtitle').textContent = `ENDLESS MODE`;
      document.getElementById('chapter-title').textContent = em.title.toUpperCase();
      document.getElementById('chapter-lore').textContent = em.desc;
    }

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
        <div class="card-icon">${this.getCardSVGIcon(card.type)}</div>
        <div class="card-title">${card.name}</div>
        <div style="font-size:0.65rem; font-family:'Press Start 2P',monospace; text-transform:uppercase; color:#b8860b;">${card.rarity}</div>
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
