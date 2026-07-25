// Dedicated 2D Pixel Art Character Showcase Renderer
export class PixelCharacterRenderer {
  static drawCharacter(ctx, skinId, width, height, time) {
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const breath = Math.sin(time * 0.003) * 3;
    const sway = Math.sin(time * 0.002) * 2;

    // 1. Draw Pedestal Shadow & Glowing Magic Circle
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 85, 90, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Pedestal Ring
    const ringGrad = ctx.createRadialGradient(centerX, centerY + 85, 20, centerX, centerY + 85, 95);
    ringGrad.addColorStop(0, 'rgba(0, 210, 255, 0.35)');
    ringGrad.addColorStop(0.7, 'rgba(0, 210, 255, 0.15)');
    ringGrad.addColorStop(1, 'rgba(0, 210, 255, 0)');
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 85, 95, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#00d2ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 85, 75, 18, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 2. Draw Floating Background Sakura Embers
    ctx.save();
    for (let i = 0; i < 12; i++) {
      const px = (centerX - 180 + ((i * 37 + time * 0.03) % 360));
      const py = (height - ((i * 29 + time * 0.04) % height));
      const size = 2 + (i % 3);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 182, 193, 0.7)' : 'rgba(255, 215, 0, 0.6)';
      ctx.fillRect(px, py, size, size);
    }
    ctx.restore();

    // 3. Draw 2D Pixel Art Warrior Sprites (Scale factor 3.2x)
    ctx.save();
    ctx.translate(centerX, centerY + breath);

    switch (skinId) {
      case 'samurai':
        this.drawSamurai2D(ctx, sway, time);
        break;
      case 'ninja':
        this.drawNinja2D(ctx, sway, time);
        break;
      case 'archer':
        this.drawArcher2D(ctx, sway, time);
        break;
      case 'nodachi':
        this.drawNodachi2D(ctx, sway, time);
        break;
      case 'miko':
        this.drawMiko2D(ctx, sway, time);
        break;
      case 'sohei':
        this.drawSohei2D(ctx, sway, time);
        break;
      case 'onmyoji':
        this.drawOnmyoji2D(ctx, sway, time);
        break;
      case 'demon_ronin':
        this.drawDemonRonin2D(ctx, sway, time);
        break;
      default:
        this.drawSamurai2D(ctx, sway, time);
        break;
    }

    ctx.restore();
  }

  // 1. Blue Samurai Pixel Art Sprite
  static drawSamurai2D(ctx, sway, time) {
    // Katana Scabbard on Hip
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(-28, 12, 8, 38);

    // Legs & Boots
    ctx.fillStyle = '#111118';
    ctx.fillRect(-16, 45, 12, 32);
    ctx.fillRect(4, 45, 12, 32);
    ctx.fillStyle = '#24160f';
    ctx.fillRect(-18, 70, 14, 10);
    ctx.fillRect(4, 70, 14, 10);

    // Kusazuri Armor Skirt
    ctx.fillStyle = '#1f3a60';
    ctx.fillRect(-22, 25, 44, 22);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(-22, 25, 44, 4);
    ctx.fillRect(-22, 43, 44, 4);

    // Blue Cuirass Torso
    ctx.fillStyle = '#1f3a60';
    ctx.fillRect(-20, -15, 40, 40);
    // Gold Lamellar Lacing Lines
    ctx.fillStyle = '#ffd700';
    for (let y = -10; y <= 15; y += 8) {
      ctx.fillRect(-16, y, 32, 2);
    }

    // Gold Sode Shoulder Pads
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(-32, -15, 14, 25);
    ctx.fillRect(18, -15, 14, 25);

    // Head & Skin
    ctx.fillStyle = '#ffdbac';
    ctx.fillRect(-14, -38, 28, 24);
    // Eyes
    ctx.fillStyle = '#111';
    ctx.fillRect(-8, -28, 4, 4);
    ctx.fillRect(4, -28, 4, 4);

    // Blue Kabuto Helmet
    ctx.fillStyle = '#1f3a60';
    ctx.fillRect(-18, -48, 36, 14);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(-20, -42, 40, 4);

    // Crescent Moon Helmet Crest (Date Masamune)
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(0, -56, 16, Math.PI * 0.2, Math.PI * 0.8, true);
    ctx.fill();

    // Katana Drawn in Hand with Gleam Effect
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(20 + sway, -35, 4, 55);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(16 + sway, 18, 12, 4); // Tsuba guard

    // Blade Gleam Animation
    const gleamY = -35 + ((time * 0.05) % 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(19 + sway, gleamY, 6, 8);
  }

  // 2. Shinobi Ninja Pixel Art Sprite
  static drawNinja2D(ctx, sway, time) {
    // Flowing Red Scarf Tails
    const scarfSway = Math.sin(time * 0.004) * 8;
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.lineTo(-38 + scarfSway, 5);
    ctx.lineTo(-32 + scarfSway, 35);
    ctx.lineTo(-6, 0);
    ctx.fill();

    // Legs & Ninja Boots
    ctx.fillStyle = '#14141e';
    ctx.fillRect(-14, 42, 10, 35);
    ctx.fillRect(4, 42, 10, 35);

    // Dark Ninja Outfit Torso
    ctx.fillStyle = '#1f1f2e';
    ctx.fillRect(-18, -12, 36, 54);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(-18, 22, 36, 5); // Belt

    // Masked Hood Head
    ctx.fillStyle = '#2d2d44';
    ctx.fillRect(-14, -38, 28, 26);

    // Glowing Cyan Visor Eyes
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.fillRect(-10, -28, 20, 5);
    ctx.shadowBlur = 0;

    // Dual Silver Kunai Daggers in Hands
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(-28 + sway, 5, 8, 24);
    ctx.fillRect(20 - sway, 5, 8, 24);
  }

  // 3. Archer Yumi Pixel Art Sprite
  static drawArcher2D(ctx, sway, time) {
    // Legs & Boots
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(-14, 42, 10, 35);
    ctx.fillRect(4, 42, 10, 35);

    // Green Tunic
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(-18, -12, 36, 54);

    // Quiver on Back
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(-26, -20, 10, 42);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-25, -28, 3, 10);
    ctx.fillRect(-20, -28, 3, 10);

    // Face & Conical Straw Hat
    ctx.fillStyle = '#ffdbac';
    ctx.fillRect(-12, -35, 24, 24);
    ctx.fillStyle = '#111';
    ctx.fillRect(-6, -26, 3, 3);
    ctx.fillRect(3, -26, 3, 3);

    // Straw Hat (Sugegasa)
    ctx.fillStyle = '#d7ccc8';
    ctx.beginPath();
    ctx.moveTo(0, -58);
    ctx.lineTo(-32, -32);
    ctx.lineTo(32, -32);
    ctx.closePath();
    ctx.fill();

    // Large Yumi Bow
    ctx.strokeStyle = '#6d4c41';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(24, -5, 48, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, -45);
    ctx.lineTo(24, 35);
    ctx.stroke();
  }

  // 4. Heavy Nodachi Pixel Art Sprite
  static drawNodachi2D(ctx, sway, time) {
    // Heavy Dark Armor
    ctx.fillStyle = '#111115';
    ctx.fillRect(-24, -15, 48, 65);

    // Red Menpo Mask
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(-14, -30, 28, 14);

    // Helmet with Golden Horns
    ctx.fillStyle = '#111115';
    ctx.fillRect(-18, -48, 36, 18);

    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(-16, -46);
    ctx.lineTo(-34, -72);
    ctx.lineTo(-10, -46);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(16, -46);
    ctx.lineTo(34, -72);
    ctx.lineTo(10, -46);
    ctx.fill();

    // Massive 2H Nodachi Sword
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(24, -65, 6, 95);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(18, 30, 18, 6);
  }

  // 5. Shrine Maiden Miko Pixel Art Sprite
  static drawMiko2D(ctx, sway, time) {
    // Pleated Red Hakama Skirt
    ctx.fillStyle = '#c62828';
    ctx.beginPath();
    ctx.moveTo(-16, 10);
    ctx.lineTo(-32, 75);
    ctx.lineTo(32, 75);
    ctx.lineTo(16, 10);
    ctx.closePath();
    ctx.fill();

    // White Kimono Top
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-18, -14, 36, 28);

    // Face & Long Tied Black Hair
    ctx.fillStyle = '#ffdbac';
    ctx.fillRect(-12, -36, 24, 22);
    ctx.fillStyle = '#0a0505';
    ctx.fillRect(-14, -38, 28, 6);
    ctx.fillRect(-8, 5, 16, 45); // Hair tail

    // Gohei Wand in Hand
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(20 + sway, -35, 4, 55);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(14 + sway, -35, 16, 16);

    // 3 Orbiting Sacred Ofuda Talismans
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + time * 0.002;
      const ox = Math.cos(angle) * 45;
      const oy = Math.sin(angle) * 15 - 10;
      ctx.fillStyle = '#ffea00';
      ctx.fillRect(ox - 6, oy - 12, 12, 22);
      ctx.fillStyle = '#8b0000';
      ctx.fillRect(ox - 2, oy - 8, 4, 14);
    }
  }

  // 6. Warrior Monk Sohei Pixel Art Sprite
  static drawSohei2D(ctx, sway, time) {
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(-18, -12, 36, 62);

    // White Cowl Hood
    ctx.fillStyle = '#edeae6';
    ctx.beginPath();
    ctx.arc(0, -28, 18, 0, Math.PI * 2);
    ctx.fill();

    // Mala Rosary Beads
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -6, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Naginata Polearm
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(22, -55, 4, 110);
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(24, -55);
    ctx.quadraticCurveTo(36, -80, 24, -95);
    ctx.lineTo(20, -55);
    ctx.fill();
  }

  // 7. Onmyoji Mage Pixel Art Sprite
  static drawOnmyoji2D(ctx, sway, time) {
    ctx.fillStyle = '#4a148c';
    ctx.fillRect(-22, -14, 44, 65);

    // Wide Flowing Sleeves
    ctx.fillRect(-38, -5, 16, 40);
    ctx.fillRect(22, -5, 16, 40);

    // Tall Eboshi Hat
    ctx.fillStyle = '#111111';
    ctx.fillRect(-12, -72, 24, 42);

    // Open Gold Sensu Fan
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(22, 0, 22, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.lineTo(22, 0);
    ctx.fill();
  }

  // 8. Demon Ronin Pixel Art Sprite
  static drawDemonRonin2D(ctx, sway, time) {
    ctx.fillStyle = '#6a001a';
    ctx.fillRect(-20, -14, 40, 62);

    // Crimson Face & Glowing Horns
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(-14, -36, 28, 22);

    ctx.fillStyle = '#ff0033';
    ctx.shadowColor = '#ff0033';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(-10, -36);
    ctx.lineTo(-24, -58);
    ctx.lineTo(-4, -36);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10, -36);
    ctx.lineTo(24, -58);
    ctx.lineTo(4, -36);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Fiery Katana Blade
    ctx.fillStyle = '#ff3d00';
    ctx.shadowColor = '#ff3d00';
    ctx.shadowBlur = 15;
    ctx.fillRect(20 + sway, -45, 5, 75);
    ctx.shadowBlur = 0;
  }
}
