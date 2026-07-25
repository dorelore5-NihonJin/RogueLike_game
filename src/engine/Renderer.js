import * as THREE from 'three';
import { PixelMeshGenerator } from '../models/PixelMeshGenerator.js';

export class GameRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x08040d);
    this.scene.fog = new THREE.FogExp2(0x08040d, 0.02);

    // Camera: Isometric perspective
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 16, 20);
    this.camera.lookAt(0, 2, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    this.setupLighting();

    // Build Live 3D Menu Scene
    this.setupMenuEnvironment();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x776688, 0.6);
    this.scene.add(ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffbbaa, 1.4);
    this.dirLight.position.set(15, 35, 15);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.scene.add(this.dirLight);

    // Red Lantern Light
    this.lanternLight = new THREE.PointLight(0xff3300, 3, 25);
    this.lanternLight.position.set(0, 4, 0);
    this.scene.add(this.lanternLight);
  }

  setupMenuEnvironment() {
    this.menuSceneGroup = new THREE.Group();

    // 1. Ground
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x120a18, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.menuSceneGroup.add(ground);

    // 2. Torii Gate
    const torii = PixelMeshGenerator.createToriiGate();
    torii.position.set(-6, 0, -8);
    this.menuSceneGroup.add(torii);

    // 3. Sakura Trees
    const tree1 = PixelMeshGenerator.createSakuraTree();
    tree1.position.set(-14, 0, -5);
    this.menuSceneGroup.add(tree1);

    const tree2 = PixelMeshGenerator.createSakuraTree();
    tree2.position.set(12, 0, -12);
    this.menuSceneGroup.add(tree2);

    // 4. Samurai Hero Statue
    const hero = PixelMeshGenerator.createSamuraiModel('#1a365d');
    hero.position.set(-4, 0, -2);
    hero.rotation.y = Math.PI / 4;
    this.menuSceneGroup.add(hero);

    // 5. Aka-Oni Boss Statue in Shadow
    const oni = PixelMeshGenerator.createAkaOniModel();
    oni.position.set(8, 0, -14);
    oni.rotation.y = -Math.PI / 6;
    this.menuSceneGroup.add(oni);

    // 6. Falling Sakura Petals Particles
    const petalCount = 80;
    const petalGeo = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);
    for (let i = 0; i < petalCount * 3; i += 3) {
      petalPositions[i] = (Math.random() - 0.5) * 40;
      petalPositions[i + 1] = Math.random() * 20;
      petalPositions[i + 2] = (Math.random() - 0.5) * 40;
    }
    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));
    const petalMat = new THREE.PointsMaterial({ color: 0xf8bbd0, size: 0.35, transparent: true, opacity: 0.8 });
    this.petals = new THREE.Points(petalGeo, petalMat);
    this.menuSceneGroup.add(this.petals);

    this.scene.add(this.menuSceneGroup);
  }

  animateMenuEnvironment(time) {
    if (!this.petals) return;

    // Slowly rotate camera around menu scene
    this.camera.position.x = Math.sin(time * 0.15) * 6;
    this.camera.position.z = 20 + Math.cos(time * 0.15) * 4;
    this.camera.lookAt(0, 2, 0);

    // Animate falling sakura petals
    const positions = this.petals.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= 0.04;
      if (positions[i] < 0) positions[i] = 20;
    }
    this.petals.geometry.attributes.position.needsUpdate = true;

    // Flicker lantern light
    this.lanternLight.intensity = 2.5 + Math.sin(time * 8.0) * 0.5;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
