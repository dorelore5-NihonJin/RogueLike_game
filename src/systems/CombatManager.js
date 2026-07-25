import * as THREE from 'three';
import { gameState } from './GameState.js';
import { audio } from './AudioSynthesizer.js';
import { PixelMeshGenerator } from '../models/PixelMeshGenerator.js';

export class CombatManager {
  constructor(scene, camera, controls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.playerMesh = null;
    this.enemies = [];
    this.projectiles = [];
    this.expOrbs = [];

    this.spawnTimer = 0;
    this.attackTimer = 0;
  }

  clearRunEntities() {
    if (this.playerMesh) {
      this.scene.remove(this.playerMesh);
      this.playerMesh = null;
    }

    this.enemies.forEach(e => this.scene.remove(e.mesh));
    this.projectiles.forEach(p => this.scene.remove(p.mesh));
    this.expOrbs.forEach(o => this.scene.remove(o.mesh));

    this.enemies = [];
    this.projectiles = [];
    this.expOrbs = [];
  }

  initPlayer(skinId) {
    this.playerMesh = PixelMeshGenerator.createSamuraiModel(
      skinId === 'ninja' ? '#111827' : (skinId === 'archer' ? '#065f46' : '#1a365d')
    );
    this.playerMesh.position.set(0, 0, 0);
    this.scene.add(this.playerMesh);
  }

  update(delta, onLevelUp) {
    if (!this.playerMesh) return;

    // 1. Player WASD Movement
    const speed = 8.5 * delta;
    const moveDir = this.controls.getMovementDirection();
    this.playerMesh.position.x += moveDir.x * speed;
    this.playerMesh.position.z += moveDir.z * speed;

    // Player Rotation to Mouse Raycast Ground Target
    const mouseTarget = this.controls.getMouseGroundTarget();
    if (mouseTarget) {
      const dx = mouseTarget.x - this.playerMesh.position.x;
      const dz = mouseTarget.z - this.playerMesh.position.z;
      this.playerMesh.rotation.y = Math.atan2(dx, dz);
    }

    // Camera follow player smoothly
    this.camera.position.x = this.playerMesh.position.x;
    this.camera.position.z = this.playerMesh.position.z + 18;
    this.camera.lookAt(this.playerMesh.position.x, 1, this.playerMesh.position.z);

    // 2. Auto-Attacks
    this.attackTimer += delta;
    if (this.attackTimer >= 0.8) {
      this.attackTimer = 0;
      this.performPlayerAttack(mouseTarget);
    }

    // 3. Enemy Spawning Wave System
    this.spawnTimer += delta;
    if (this.spawnTimer >= 1.5 && this.enemies.length < 25) {
      this.spawnTimer = 0;
      this.spawnEnemyWave();
    }

    // 4. Update Enemies AI
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const ex = this.playerMesh.position.x - enemy.mesh.position.x;
      const ez = this.playerMesh.position.z - enemy.mesh.position.z;
      const dist = Math.hypot(ex, ez);

      if (dist > 0.5) {
        enemy.mesh.position.x += (ex / dist) * enemy.speed * delta;
        enemy.mesh.position.z += (ez / dist) * enemy.speed * delta;
        enemy.mesh.rotation.y = Math.atan2(ex, ez);
      } else {
        // Attack Player
        gameState.hp -= enemy.damage * delta;
        audio.playSwordSlash();
      }

      // Check Enemy Death
      if (enemy.hp <= 0) {
        this.spawnEXPOrb(enemy.mesh.position);
        this.scene.remove(enemy.mesh);
        this.enemies.splice(i, 1);

        gameState.kills += 1;
        gameState.stats.totalKills += 1;
        
        // Award Koban Gold Coins!
        const goldGain = Math.floor(Math.random() * 5) + 5;
        gameState.addGold(goldGain);
      }
    }

    // 5. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.mesh.position.x += proj.dir.x * proj.speed * delta;
      proj.mesh.position.z += proj.dir.z * proj.speed * delta;
      proj.life -= delta;

      // Check collision with enemies
      this.enemies.forEach(e => {
        const d = Math.hypot(e.mesh.position.x - proj.mesh.position.x, e.mesh.position.z - proj.mesh.position.z);
        if (d < 1.2 && proj.life > 0) {
          e.hp -= proj.damage;
          proj.life = 0;
          audio.playHit();
        }
      });

      if (proj.life <= 0) {
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // 6. Update EXP Soul Orbs Pickup
    for (let i = this.expOrbs.length - 1; i >= 0; i--) {
      const orb = this.expOrbs[i];
      const dist = Math.hypot(orb.mesh.position.x - this.playerMesh.position.x, orb.mesh.position.z - this.playerMesh.position.z);

      if (dist < 2.5) {
        this.scene.remove(orb.mesh);
        this.expOrbs.splice(i, 1);
        audio.playExpPick();

        gameState.currentXP += 25;
        gameState.addAccountXP(10);

        if (gameState.currentXP >= gameState.targetXP) {
          gameState.currentXP -= gameState.targetXP;
          gameState.playerLevel += 1;
          gameState.targetXP = Math.floor(gameState.targetXP * 1.3);
          audio.playLevelUp();
          if (onLevelUp) onLevelUp();
        }
      }
    }
  }

  performPlayerAttack(mouseTarget) {
    let dir = new THREE.Vector3(0, 0, 1);
    if (mouseTarget) {
      dir.subVectors(mouseTarget, this.playerMesh.position).normalize();
    }

    const skin = gameState.selectedSkinId;
    if (skin === 'ninja') {
      audio.playShurikenThrow();
      // Shoot 3 Shurikens
      for (let angle = -0.3; angle <= 0.3; angle += 0.3) {
        const sDir = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        const geo = new THREE.BoxGeometry(0.4, 0.1, 0.4);
        const mat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(this.playerMesh.position).add(new THREE.Vector3(0, 1, 0));
        this.scene.add(mesh);
        this.projectiles.push({ mesh, dir: sDir, speed: 20, damage: 20, life: 1.5 });
      }
    } else {
      audio.playSwordSlash();
      // Sword Slash Wave
      const geo = new THREE.BoxGeometry(1.2, 0.2, 0.6);
      const mat = new THREE.MeshBasicMaterial({ color: 0xf1c40f });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(this.playerMesh.position).add(dir.clone().multiplyScalar(1.5));
      mesh.position.y = 1;
      this.scene.add(mesh);
      this.projectiles.push({ mesh, dir, speed: 18, damage: 35, life: 0.6 });
    }
  }

  spawnEnemyWave() {
    const angle = Math.random() * Math.PI * 2;
    const spawnDist = 15;
    const sx = this.playerMesh.position.x + Math.cos(angle) * spawnDist;
    const sz = this.playerMesh.position.z + Math.sin(angle) * spawnDist;

    const isBigOni = Math.random() < 0.25;
    const enemyMesh = isBigOni ? PixelMeshGenerator.createAkaOniModel() : PixelMeshGenerator.createGakiModel();
    enemyMesh.position.set(sx, 0, sz);
    this.scene.add(enemyMesh);

    this.enemies.push({
      mesh: enemyMesh,
      hp: isBigOni ? 120 : 35,
      maxHp: isBigOni ? 120 : 35,
      damage: isBigOni ? 25 : 10,
      speed: isBigOni ? 3.5 : 5.2
    });
  }

  spawnEXPOrb(pos) {
    const geo = new THREE.SphereGeometry(0.3, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const orb = new THREE.Mesh(geo, mat);
    orb.position.copy(pos);
    orb.position.y = 0.5;
    this.scene.add(orb);
    this.expOrbs.push({ mesh: orb });
  }
}
