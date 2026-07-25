import * as THREE from 'three';
import { PixelMeshGenerator } from '../models/PixelMeshGenerator.js';
import { gameState } from './GameState.js';
import { audio } from './AudioSynthesizer.js';

export class CombatManager {
  constructor(scene, camera, controls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.playerGroup = null;
    this.enemies = [];
    this.projectiles = [];
    this.expOrbs = [];

    this.attackCooldown = 0;
    this.spawnTimer = 0;

    this.setupGroundPlane();
  }

  setupGroundPlane() {
    // 3D Arena Ground Plane
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0x191428, 
      roughness: 0.8,
      metalness: 0.1
    });
    this.ground = new THREE.Mesh(groundGeo, groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    // Decorative Torii Gates
    const t1 = PixelMeshGenerator.createToriiGate();
    t1.position.set(0, 0, -20);
    this.scene.add(t1);

    // Sakura Trees
    const tree1 = PixelMeshGenerator.createSakuraTree();
    tree1.position.set(-15, 0, -10);
    this.scene.add(tree1);

    const tree2 = PixelMeshGenerator.createSakuraTree();
    tree2.position.set(15, 0, -10);
    this.scene.add(tree2);
  }

  initPlayer(skinId) {
    if (this.playerGroup) {
      this.scene.remove(this.playerGroup);
    }

    if (skinId === 'ninja') {
      this.playerGroup = PixelMeshGenerator.createNinjaModel();
    } else if (skinId === 'archer') {
      this.playerGroup = PixelMeshGenerator.createArcherModel();
    } else {
      this.playerGroup = PixelMeshGenerator.createSamuraiModel('#1a365d');
    }

    this.playerGroup.position.set(0, 0, 0);
    this.scene.add(this.playerGroup);
  }

  clearRunEntities() {
    this.enemies.forEach(e => this.scene.remove(e.mesh));
    this.projectiles.forEach(p => this.scene.remove(p.mesh));
    this.expOrbs.forEach(o => this.scene.remove(o.mesh));
    this.enemies = [];
    this.projectiles = [];
    this.expOrbs = [];
  }

  spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 22 + Math.random() * 8;
    const posX = this.playerGroup.position.x + Math.cos(angle) * radius;
    const posZ = this.playerGroup.position.z + Math.sin(angle) * radius;

    const isBoss = (gameState.kills > 0 && gameState.kills % 50 === 0);
    let mesh;
    let hp = 30;
    let speed = 4.0;
    let enemyType = 'gaki';

    if (isBoss) {
      mesh = PixelMeshGenerator.createAkaOniModel();
      hp = 400;
      speed = 2.5;
      enemyType = 'boss_oni';
    } else {
      mesh = PixelMeshGenerator.createGakiModel();
    }

    mesh.position.set(posX, 0, posZ);
    this.scene.add(mesh);

    this.enemies.push({ mesh, hp, maxHp: hp, speed, enemyType });
  }

  playerAttack() {
    const aimTarget = this.controls.mouseWorldPos;
    const pPos = this.playerGroup.position;
    const dir = new THREE.Vector3().subVectors(aimTarget, pPos).setY(0).normalize();

    // Create Slash / Arrow Projectile
    const projGeo = new THREE.BoxGeometry(0.6, 0.2, 1.2);
    const projMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const projMesh = new THREE.Mesh(projGeo, projMat);

    projMesh.position.copy(pPos).add(new THREE.Vector3(0, 1.0, 0));
    projMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    this.scene.add(projMesh);

    this.projectiles.push({
      mesh: projMesh,
      dir: dir,
      speed: 25.0,
      life: 1.0,
      damage: 25
    });

    audio.playSwordSlash();
  }

  spawnExpOrb(position) {
    const geo = new THREE.DodecahedronGeometry(0.25);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position).setY(0.4);
    this.scene.add(mesh);
    this.expOrbs.push({ mesh, value: 5 });
  }

  update(delta, onLevelUp) {
    if (!this.playerGroup) return;

    // 1. Player WASD Movement & Aim Rotation
    const moveVec = this.controls.getMovementVector();
    this.playerGroup.position.x += moveVec.x * gameState.speed * delta;
    this.playerGroup.position.z += moveVec.z * gameState.speed * delta;

    // Keep camera following player
    this.camera.position.x = this.playerGroup.position.x;
    this.camera.position.z = this.playerGroup.position.z + 18;

    // Look at mouse
    const aimTarget = this.controls.mouseWorldPos;
    const dx = aimTarget.x - this.playerGroup.position.x;
    const dz = aimTarget.z - this.playerGroup.position.z;
    this.playerGroup.rotation.y = Math.atan2(dx, dz);

    // 2. Attack cooldown
    this.attackCooldown -= delta;
    if (this.attackCooldown <= 0) {
      this.playerAttack();
      this.attackCooldown = 0.45; // ~2.2 attacks/sec
    }

    // 3. Enemy Spawning
    this.spawnTimer += delta;
    if (this.spawnTimer > 1.2) {
      this.spawnEnemy();
      this.spawnTimer = 0;
    }

    // 4. Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.mesh.position.addScaledVector(p.dir, p.speed * delta);
      p.life -= delta;

      // Check hit against enemies
      let hit = false;
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const e = this.enemies[j];
        const dist = p.mesh.position.distanceTo(e.mesh.position);
        if (dist < 1.4) {
          e.hp -= p.damage;
          audio.playHit();
          hit = true;

          if (e.hp <= 0) {
            this.spawnExpOrb(e.mesh.position);
            this.scene.remove(e.mesh);
            this.enemies.splice(j, 1);
            gameState.kills += 1;
          }
          break;
        }
      }

      if (hit || p.life <= 0) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // 5. Update Enemies
    for (let e of this.enemies) {
      const eDir = new THREE.Vector3().subVectors(this.playerGroup.position, e.mesh.position).setY(0).normalize();
      e.mesh.position.addScaledVector(eDir, e.speed * delta);
      e.mesh.rotation.y = Math.atan2(eDir.x, eDir.z);

      // Check damage to player
      if (e.mesh.position.distanceTo(this.playerGroup.position) < 1.2) {
        gameState.hp -= 10 * delta;
        if (gameState.hp < 0) gameState.hp = 0;
      }
    }

    // 6. Update Exp Orbs
    for (let i = this.expOrbs.length - 1; i >= 0; i--) {
      const orb = this.expOrbs[i];
      const dist = orb.mesh.position.distanceTo(this.playerGroup.position);
      if (dist < 3.5) {
        // Magnet pull
        orb.mesh.position.lerp(this.playerGroup.position, delta * 8.0);
      }
      if (dist < 1.0) {
        audio.playExpPick();
        const levelUp = gameState.addXP(orb.value);
        this.scene.remove(orb.mesh);
        this.expOrbs.splice(i, 1);
        if (levelUp && onLevelUp) {
          audio.playLevelUp();
          onLevelUp();
        }
      }
    }
  }
}
