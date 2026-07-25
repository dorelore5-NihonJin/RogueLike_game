import { GameRenderer } from './engine/Renderer.js';
import { GameControls } from './engine/Controls.js';
import { CombatManager } from './systems/CombatManager.js';
import { gameState } from './systems/GameState.js';
import { UIManager } from './ui/UIManager.js';

class GameApp {
  constructor() {
    this.renderer = new GameRenderer('canvas-container');
    this.controls = new GameControls(this.renderer.camera, this.renderer.renderer.domElement);
    this.combat = new CombatManager(this.renderer.scene, this.renderer.camera, this.controls);
    
    this.ui = new UIManager(() => this.startNewRun());

    this.isRunning = false;
    this.isPaused = false;
    this.clock = new THREE.Clock();

    window.resumeGameLoop = () => {
      this.isPaused = false;
    };

    this.initLoop();
  }

  startNewRun() {
    gameState.startRun();
    this.combat.clearRunEntities();
    this.combat.initPlayer(gameState.selectedSkinId);
    
    this.isRunning = true;
    this.isPaused = false;
    this.clock.start();
  }

  initLoop() {
    const loop = () => {
      requestAnimationFrame(loop);

      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      if (!this.isRunning) {
        // Animate live 3D menu background when in Main Menu!
        this.renderer.animateMenuEnvironment(time);
      }

      if (this.isRunning && !this.isPaused) {
        gameState.runTimeSeconds += delta;

        // Combat Update
        this.combat.update(delta, () => {
          // Level-up triggered!
          this.isPaused = true;
          this.ui.showLevelUpModal((chosenCard) => {
            console.log('Chosen card:', chosenCard);
          });
        });

        // Check Player Death
        if (gameState.hp <= 0) {
          this.isRunning = false;
          document.getElementById('hud-overlay').classList.remove('active');
          document.getElementById('result-title').textContent = 'ПОРАЖЕНИЕ';
          document.getElementById('result-desc').textContent = 'Ваш воин пал от рук оскверненных ёкаев...';
          document.getElementById('res-kills').textContent = gameState.kills;
          document.getElementById('res-waves').textContent = gameState.selectedLevelNum;
          document.getElementById('res-xp').textContent = `+${gameState.kills * 10} XP`;

          // Award account XP
          gameState.accountXP += gameState.kills * 10;
          this.ui.showModal('modal-gameover');
        }

        // Update HUD
        this.ui.updateHUD();
      }

      this.renderer.render();
    };

    loop();
  }
}

// Bootstrap Game Application
window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new GameApp();
});
