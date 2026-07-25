import * as THREE from 'three';

export class PixelMeshGenerator {
  // Helper to generate a crisp pixel art canvas texture
  static createPixelTexture(palette, width = 16, height = 16, pattern = 'grid') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, width, height);

    if (pattern === 'armor') {
      // Draw Japanese armor plate stitching (Lacing / Odoshi)
      for (let y = 0; y < height; y += 4) {
        ctx.fillStyle = palette[1] || '#000000';
        ctx.fillRect(0, y, width, 1);
        ctx.fillStyle = palette[2] || '#ffd700';
        for (let x = 1; x < width; x += 3) {
          ctx.fillRect(x, y + 1, 1, 2);
        }
      }
    } else if (pattern === 'face') {
      // Skin tone face with eyes
      ctx.fillStyle = palette[1] || '#111';
      ctx.fillRect(3, 6, 3, 2); // Left Eye
      ctx.fillRect(10, 6, 3, 2); // Right Eye
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(4, 6, 1, 1);
      ctx.fillRect(11, 6, 1, 1);
    } else if (pattern === 'fabric') {
      // Kimono weave pattern
      ctx.fillStyle = palette[1] || 'rgba(0,0,0,0.15)';
      for (let x = 0; x < width; x += 2) {
        for (let y = (x % 4); y < height; y += 4) {
          ctx.fillRect(x, y, 1, 2);
        }
      }
    } else if (pattern === 'wood') {
      // Wood grain
      ctx.fillStyle = palette[1] || '#4e342e';
      for (let y = 0; y < height; y += 2) {
        ctx.fillRect(0, y, width, 1);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  // Floating 3D Stone Pedestal Dais with Emissive Runic Glow & Sakura Embers
  static createHeroPedestal() {
    const group = new THREE.Group();

    const stoneMat = new THREE.MeshStandardMaterial({ 
      color: 0x1f1924, 
      roughness: 0.7,
      metalness: 0.2 
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({ 
      color: 0xd4af37, 
      metalness: 0.9, 
      roughness: 0.1 
    });
    const glowRingMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff });

    // Lower Tier Base Step (Octagonal Stone)
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.85, 0.35, 8), stoneMat);
    base.position.y = -0.18;
    base.receiveShadow = true;
    group.add(base);

    // Gold Trim Ring
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.62, 0.08, 16), goldTrimMat);
    rim.position.y = 0.02;
    group.add(rim);

    // Upper Pedestal Step
    const upperStep = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.42, 0.3, 16), stoneMat);
    upperStep.position.y = 0.2;
    upperStep.receiveShadow = true;
    group.add(upperStep);

    // Glowing Neon Light Ring
    const glowRing = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.04, 8, 32), glowRingMat);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = 0.36;
    group.add(glowRing);

    // Corner Ornate Carved Pillars
    for (let i = 0; i < 4; i++) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 0.18), goldTrimMat);
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      pillar.position.set(Math.cos(angle) * 1.5, 0.05, Math.sin(angle) * 1.5);
      group.add(pillar);
    }

    return group;
  }

  // Master method to get 3D Warrior Model by Skin ID
  static createWarriorModel(skinId) {
    switch (skinId) {
      case 'samurai': return this.createSamuraiModel();
      case 'ninja': return this.createNinjaModel();
      case 'archer': return this.createArcherModel();
      case 'nodachi': return this.createNodachiModel();
      case 'miko': return this.createMikoModel();
      case 'sohei': return this.createSoheiModel();
      case 'onmyoji': return this.createOnmyojiModel();
      case 'demon_ronin': return this.createDemonRoninModel();
      default: return this.createSamuraiModel();
    }
  }

  // Helper method for standard warrior legs & boots
  static createLegsAndBoots(pantsMat, bootMat, skirtColor = null) {
    const group = new THREE.Group();

    // Left Leg & Boot
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.45, 0.22), pantsMat);
    legL.position.set(-0.18, 0.225, 0);
    group.add(legL);

    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.15, 0.32), bootMat);
    bootL.position.set(-0.18, 0.075, 0.04);
    group.add(bootL);

    // Right Leg & Boot
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.45, 0.22), pantsMat);
    legR.position.set(0.18, 0.225, 0);
    group.add(legR);

    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.15, 0.32), bootMat);
    bootR.position.set(0.18, 0.075, 0.04);
    group.add(bootR);

    // Optional Kusazuri Skirt Plates around hips
    if (skirtColor) {
      const skirtMat = new THREE.MeshStandardMaterial({ color: skirtColor, roughness: 0.4 });
      const skirtF = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.28, 0.08), skirtMat);
      skirtF.position.set(0, 0.42, 0.18);
      group.add(skirtF);

      const skirtB = skirtF.clone();
      skirtB.position.set(0, 0.42, -0.18);
      group.add(skirtB);

      const skirtL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.42), skirtMat);
      skirtL.position.set(-0.3, 0.42, 0);
      group.add(skirtL);

      const skirtR = skirtL.clone();
      skirtR.position.set(0.3, 0.42, 0);
      group.add(skirtR);
    }

    return group;
  }

  // 1. Blue Samurai Player 3D Model (Kabuto Helmet + Golden Crescent + Katana)
  static createSamuraiModel() {
    const group = new THREE.Group();

    const blueArmorMat = new THREE.MeshStandardMaterial({
      color: 0x1f3a60,
      roughness: 0.4,
      map: this.createPixelTexture(['#1f3a60', '#12223a', '#ffd700'], 16, 16, 'armor')
    });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xf0f4f8, metalness: 0.95, roughness: 0.05 });
    const redScabbardMat = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111118 });

    // Legs anchored at y = 0 with Kusazuri Skirt
    group.add(this.createLegsAndBoots(darkMat, darkMat, 0x1f3a60));

    // Cuirass Torso Armor
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.65, 0.42), blueArmorMat);
    torso.position.y = 0.825;
    torso.castShadow = true;
    group.add(torso);

    // Gold Waist Belt & Buckle
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 0.46), goldMat);
    belt.position.y = 0.54;
    group.add(belt);

    // Shoulder Armor Pads (Sode)
    const sodeL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.42, 0.38), goldMat);
    sodeL.position.set(-0.46, 0.92, 0);
    group.add(sodeL);

    const sodeR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.42, 0.38), goldMat);
    sodeR.position.set(0.46, 0.92, 0);
    group.add(sodeR);

    // Head with Face Texture
    const faceTex = this.createPixelTexture(['#ffdbac', '#111'], 16, 16, 'face');
    const headMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.7 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.36), headMat);
    head.position.y = 1.32;
    group.add(head);

    // Kabuto Helmet Dome
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.48), blueArmorMat);
    helmet.position.y = 1.54;
    group.add(helmet);

    // Helmet Neck Guard (Shikoro)
    const shikoro = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.18, 0.22), goldMat);
    shikoro.position.set(0, 1.42, -0.16);
    group.add(shikoro);

    // Golden Crescent Moon Helmet Crest (Date Masamune Style)
    const crescent = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 6, 16, Math.PI), goldMat);
    crescent.position.set(0, 1.76, 0.22);
    crescent.rotation.x = Math.PI / 8;
    group.add(crescent);

    // Curved Katana Blade in Hand
    const katanaBlade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.15, 0.02), steelMat);
    katanaBlade.position.set(0.46, 0.95, 0.35);
    katanaBlade.rotation.x = Math.PI / 3.5;
    group.add(katanaBlade);

    // Tsuba Guard & Hilt
    const tsuba = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.12), goldMat);
    tsuba.position.set(0.46, 0.52, 0.08);
    group.add(tsuba);

    // Red Katana Scabbard on Hip
    const scabbard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.95, 0.06), redScabbardMat);
    scabbard.position.set(-0.4, 0.65, -0.08);
    scabbard.rotation.z = -Math.PI / 4;
    group.add(scabbard);

    return group;
  }

  // 2. Ninja Shinobi 3D Model (Scarf + Dual Kunai + Visor Eyes)
  static createNinjaModel() {
    const group = new THREE.Group();
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x14141e, roughness: 0.9 });
    const maskMat = new THREE.MeshStandardMaterial({ color: 0x222233 });
    const cyanEyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const redScarfMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 });

    group.add(this.createLegsAndBoots(darkMat, darkMat));

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.38), darkMat);
    torso.position.y = 0.81;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.36), maskMat);
    head.position.y = 1.3;
    group.add(head);

    // Glowing Visor/Eyes
    const eyes = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.07, 0.04), cyanEyeMat);
    eyes.position.set(0, 1.33, 0.19);
    group.add(eyes);

    // Flowing Red Ninja Scarf Tails
    const scarfNeck = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.42), redScarfMat);
    scarfNeck.position.y = 1.12;
    group.add(scarfNeck);

    const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.65, 0.04), redScarfMat);
    scarfTail.position.set(-0.18, 0.85, -0.24);
    scarfTail.rotation.x = -Math.PI / 6;
    scarfTail.rotation.z = Math.PI / 12;
    group.add(scarfTail);

    // Ninjato Sword Sheathed on Back
    const backSword = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.1, 0.06), steelMat);
    backSword.position.set(0.12, 1.0, -0.22);
    backSword.rotation.z = -Math.PI / 4;
    group.add(backSword);

    // Kunai Daggers Held Forward
    const kunaiL = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.45, 4), steelMat);
    kunaiL.position.set(-0.42, 0.72, 0.22);
    kunaiL.rotation.x = Math.PI / 2;
    group.add(kunaiL);

    const kunaiR = kunaiL.clone();
    kunaiR.position.set(0.42, 0.72, 0.22);
    group.add(kunaiR);

    return group;
  }

  // 3. Archer Yumi 3D Model (Straw Hat + Asymmetrical Yumi Bow + Quiver)
  static createArcherModel() {
    const group = new THREE.Group();
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.7 });
    const strawHatMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.9 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41 });
    const featherMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });

    group.add(this.createLegsAndBoots(greenMat, bootMat));

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.38), greenMat);
    torso.position.y = 0.81;
    group.add(torso);

    const faceTex = this.createPixelTexture(['#ffdbac', '#111'], 16, 16, 'face');
    const headMat = new THREE.MeshStandardMaterial({ map: faceTex });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.36), headMat);
    head.position.y = 1.3;
    group.add(head);

    // Conical Straw Hat (Sugegasa)
    const hat = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.22, 12), strawHatMat);
    hat.position.y = 1.54;
    group.add(hat);

    // Arrow Quiver on Back with Fletching Arrows
    const quiver = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 6), woodMat);
    quiver.position.set(-0.18, 0.9, -0.22);
    quiver.rotation.z = -Math.PI / 8;
    group.add(quiver);

    for (let i = 0; i < 3; i++) {
      const arrowFeather = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.04), featherMat);
      arrowFeather.position.set(-0.18 + i * 0.03, 1.25, -0.22);
      group.add(arrowFeather);
    }

    // Large Asymmetrical Yumi Bow in Hand
    const bowCurve = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.45, 6), woodMat);
    bowCurve.position.set(0.42, 0.9, 0.18);
    bowCurve.rotation.z = Math.PI / 14;
    group.add(bowCurve);

    return group;
  }

  // 4. Heavy Nodachi Samurai 3D Model (Massive 2H Sword + Menpo Mask)
  static createNodachiModel() {
    const group = new THREE.Group();
    const darkArmorMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.3 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95 });
    const redMaskMat = new THREE.MeshStandardMaterial({ color: 0x8b0000 });

    group.add(this.createLegsAndBoots(darkArmorMat, darkArmorMat, 0x111115));

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.72, 0.48), darkArmorMat);
    torso.position.y = 0.86;
    group.add(torso);

    // Menpo Demon Mask Face
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), darkArmorMat);
    head.position.y = 1.4;
    group.add(head);

    const menpoMask = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.15), redMaskMat);
    menpoMask.position.set(0, 1.34, 0.15);
    group.add(menpoMask);

    // Large Horned Crest
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.45, 4), goldMat);
    hornL.position.set(-0.16, 1.75, 0.1);
    hornL.rotation.z = -Math.PI / 5;
    group.add(hornL);

    const hornR = hornL.clone();
    hornR.position.set(0.16, 1.75, 0.1);
    hornR.rotation.z = Math.PI / 5;
    group.add(hornR);

    // Massive 2-Handed Greatsword (Nodachi)
    const nodachiBlade = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.75, 0.03), bladeMat);
    nodachiBlade.position.set(0.52, 1.05, 0.3);
    nodachiBlade.rotation.x = Math.PI / 5;
    group.add(nodachiBlade);

    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.12), goldMat);
    guard.position.set(0.52, 0.3, 0.1);
    group.add(guard);

    return group;
  }

  // 5. Shrine Maiden Miko 3D Model (Red Pleated Hakama + Gohei Wand + Floating Ofuda)
  static createMikoModel() {
    const group = new THREE.Group();
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const redHakamaMat = new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.6 });
    const paperMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x0a0505 });

    group.add(this.createLegsAndBoots(redHakamaMat, redHakamaMat));

    // Pleated Hakama Skirt Base
    const hakama = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.52, 0.55, 12), redHakamaMat);
    hakama.position.y = 0.48;
    group.add(hakama);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.6, 0.36), whiteMat);
    torso.position.y = 0.82;
    group.add(torso);

    const faceTex = this.createPixelTexture(['#ffdbac', '#111'], 16, 16, 'face');
    const headMat = new THREE.MeshStandardMaterial({ map: faceTex });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), headMat);
    head.position.y = 1.3;
    group.add(head);

    // Long Black Hair Tied Behind
    const hairTail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.12), hairMat);
    hairTail.position.set(0, 1.0, -0.22);
    group.add(hairTail);

    // Sacred Ritual Gohei Wand in Hand
    const wand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 6), new THREE.MeshStandardMaterial({ color: 0x8d6e63 }));
    wand.position.set(0.42, 0.9, 0.25);
    group.add(wand);

    const paperStreamer = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.35, 0.02), whiteMat);
    paperStreamer.position.set(0.42, 1.35, 0.25);
    paperStreamer.rotation.z = Math.PI / 6;
    group.add(paperStreamer);

    // Floating Glowing Sacred Ofuda Talismans Orbiting Body
    for (let i = 0; i < 3; i++) {
      const ofuda = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 0.02), paperMat);
      const angle = (i / 3) * Math.PI * 2;
      ofuda.position.set(Math.cos(angle) * 0.6, 0.95 + Math.sin(i) * 0.15, Math.sin(angle) * 0.6);
      group.add(ofuda);
    }

    return group;
  }

  // 6. Warrior Monk Sohei 3D Model (Cowl Hood + Naginata Polearm)
  static createSoheiModel() {
    const group = new THREE.Group();
    const cowlMat = new THREE.MeshStandardMaterial({ color: 0xedeae6, roughness: 0.9 });
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.95 });

    group.add(this.createLegsAndBoots(armorMat, armorMat, 0x3e2723));

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.65, 0.42), armorMat);
    torso.position.y = 0.82;
    group.add(torso);

    // Monk White Cowl Hood (Kesa)
    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), cowlMat);
    hood.position.y = 1.35;
    group.add(hood);

    // Naginata Polearm
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.85, 6), woodMat);
    pole.position.set(0.45, 0.92, 0.2);
    group.add(pole);

    const naginataBlade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.65, 0.02), bladeMat);
    naginataBlade.position.set(0.45, 1.78, 0.2);
    group.add(naginataBlade);

    return group;
  }

  // 7. Onmyoji Mage 3D Model (Tall Eboshi Hat + Magic Sensu Fan)
  static createOnmyojiModel() {
    const group = new THREE.Group();
    const purpleMat = new THREE.MeshStandardMaterial({ color: 0x4a148c, roughness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9 });
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

    group.add(this.createLegsAndBoots(purpleMat, hatMat));

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.65, 0.38), purpleMat);
    torso.position.y = 0.82;
    group.add(torso);

    // Flowing Wide Sleeves
    const sleeveL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.52, 0.35), purpleMat);
    sleeveL.position.set(-0.42, 0.82, 0);
    group.add(sleeveL);

    const sleeveR = sleeveL.clone();
    sleeveR.position.set(0.42, 0.82, 0);
    group.add(sleeveR);

    // Tall Eboshi Magistrate Hat
    const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.2, 0.62, 8), hatMat);
    hat.position.y = 1.62;
    group.add(hat);

    // Gold Folding Fan (Sensu) in Hand
    const fan = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.04), goldMat);
    fan.position.set(0.42, 0.9, 0.22);
    fan.rotation.y = Math.PI / 4;
    group.add(fan);

    return group;
  }

  // 8. Demon Ronin 3D Model (Glowing Red Horns + Flame Katana Blade)
  static createDemonRoninModel() {
    const group = new THREE.Group();
    const demonArmorMat = new THREE.MeshStandardMaterial({ color: 0x6a001a, roughness: 0.3 });
    const hornMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    const fireBladeMat = new THREE.MeshBasicMaterial({ color: 0xff3d00 });

    group.add(this.createLegsAndBoots(demonArmorMat, demonArmorMat, 0x6a001a));

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.7, 0.44), demonArmorMat);
    torso.position.y = 0.84;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.38), demonArmorMat);
    head.position.y = 1.38;
    group.add(head);

    // Glowing Demon Horns
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.38, 4), hornMat);
    hornL.position.set(-0.15, 1.72, 0.1);
    hornL.rotation.z = -Math.PI / 5;
    group.add(hornL);

    const hornR = hornL.clone();
    hornR.position.set(0.15, 1.72, 0.1);
    hornR.rotation.z = Math.PI / 5;
    group.add(hornR);

    // Glowing Fiery Katana Blade
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.25, 0.02), fireBladeMat);
    blade.position.set(0.48, 0.92, 0.3);
    blade.rotation.x = Math.PI / 3.8;
    group.add(blade);

    return group;
  }

  // Yokai models
  static createAkaOniModel() {
    const group = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.6 });
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
    const clubMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.8 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 0.9), skinMat);
    torso.position.y = 1.6;
    torso.castShadow = true;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), skinMat);
    head.position.y = 2.75;
    group.add(head);

    const horn1 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 4), hornMat);
    horn1.position.set(-0.2, 3.2, 0);
    group.add(horn1);

    const horn2 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 4), hornMat);
    horn2.position.set(0.2, 3.2, 0);
    group.add(horn2);

    const club = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.15, 2.0, 6), clubMat);
    club.position.set(1.0, 1.5, 0.5);
    club.rotation.x = Math.PI / 6;
    group.add(club);

    return group;
  }

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

  static createToriiGate() {
    const group = new THREE.Group();
    const redMat = new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.4 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 6, 8), redMat);
    p1.position.set(-3, 3, 0);
    p1.castShadow = true;
    group.add(p1);

    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 6, 8), redMat);
    p2.position.set(3, 3, 0);
    p2.castShadow = true;
    group.add(p2);

    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(8, 0.6, 0.8), redMat);
    topBeam.position.set(0, 6.2, 0);
    topBeam.castShadow = true;
    group.add(topBeam);

    const roofBeam = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.3, 1.0), blackMat);
    roofBeam.position.set(0, 6.6, 0);
    group.add(roofBeam);

    return group;
  }

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
