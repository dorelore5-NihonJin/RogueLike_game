import * as THREE from 'three';

export class PixelMeshGenerator {
  static createPixelTexture(hexColors, width = 8, height = 8) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const color = hexColors[(y * width + x) % hexColors.length];
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  // 1. Samurai Player 3D Model
  static createSamuraiModel(armorHex = '#1a365d') {
    const group = new THREE.Group();

    // Materials
    const armorMat = new THREE.MeshStandardMaterial({ color: armorHex, roughness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xb8860b, metalness: 0.8, roughness: 0.2 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });

    // Torso (Armor)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.5), armorMat);
    torso.position.y = 1.0;
    torso.castShadow = true;
    group.add(torso);

    // Head & Kabuto Helmet
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), skinMat);
    head.position.y = 1.7;
    group.add(head);

    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), armorMat);
    helmet.position.y = 1.85;
    group.add(helmet);

    // Helmet Crest (Kuwagata Horns)
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.05), goldMat);
    crest.position.set(0, 2.0, 0.25);
    group.add(crest);

    // Katana Sword in Hand
    const katanaBlade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.2, 0.02), steelMat);
    katanaBlade.position.set(0.6, 1.0, 0.4);
    katanaBlade.rotation.x = Math.PI / 4;
    group.add(katanaBlade);

    return group;
  }

  // 2. Ninja 3D Model
  static createNinjaModel() {
    const group = new THREE.Group();
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.9 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.4), darkMat);
    torso.position.y = 0.95;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), darkMat);
    head.position.y = 1.6;
    group.add(head);

    // Glowing Eyes
    const eyes = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.05), eyeMat);
    eyes.position.set(0, 1.62, 0.21);
    group.add(eyes);

    return group;
  }

  // 3. Archer 3D Model
  static createArcherModel() {
    const group = new THREE.Group();
    const clothMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.4), clothMat);
    torso.position.y = 0.95;
    group.add(torso);

    // Yumi Bow
    const bow = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.08), woodMat);
    bow.position.set(0.5, 1.0, 0.3);
    group.add(bow);

    return group;
  }

  // 4. Yokai: Aka-Oni (Red Ogre)
  static createAkaOniModel() {
    const group = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.6 });
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
    const clubMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 });

    // Large Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.9), skinMat);
    torso.position.y = 1.6;
    torso.castShadow = true;
    group.add(torso);

    // Head with Horns
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), skinMat);
    head.position.y = 2.75;
    group.add(head);

    const horn1 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 4), hornMat);
    horn1.position.set(-0.2, 3.2, 0);
    group.add(horn1);

    const horn2 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 4), hornMat);
    horn2.position.set(0.2, 3.2, 0);
    group.add(horn2);

    // Kanabo Spiked Club
    const club = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.15, 2.0, 6), clubMat);
    club.position.set(1.0, 1.5, 0.5);
    club.rotation.x = Math.PI / 6;
    group.add(club);

    return group;
  }

  // 5. Yokai: Gaki Imp
  static createGakiModel() {
    const group = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x558b2f });
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.4), skinMat);
    torso.position.y = 0.5;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 6), skinMat);
    head.position.y = 0.9;
    group.add(head);

    return group;
  }

  // 6. Environment Props: Torii Gate
  static createToriiGate() {
    const group = new THREE.Group();
    const redMat = new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.4 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

    // Pillars
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 6, 8), redMat);
    p1.position.set(-3, 3, 0);
    p1.castShadow = true;
    group.add(p1);

    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 6, 8), redMat);
    p2.position.set(3, 3, 0);
    p2.castShadow = true;
    group.add(p2);

    // Top Beam
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(8, 0.6, 0.8), redMat);
    topBeam.position.set(0, 6.2, 0);
    topBeam.castShadow = true;
    group.add(topBeam);

    const roofBeam = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.3, 1.0), blackMat);
    roofBeam.position.set(0, 6.6, 0);
    group.add(roofBeam);

    return group;
  }

  // 7. Sakura Cherry Blossom Tree
  static createSakuraTree() {
    const group = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.9 });
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0xf8bbd0, roughness: 0.6 });

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 4, 6), trunkMat);
    trunk.position.y = 2;
    trunk.castShadow = true;
    group.add(trunk);

    const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2), leavesMat);
    foliage.position.y = 4.5;
    foliage.castShadow = true;
    group.add(foliage);

    return group;
  }
}
