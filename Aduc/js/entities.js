window.PPB = window.PPB || {};

window.PPB.Projectile = class Projectile {
  constructor(x, y, targetX, targetY, speed, golden = false, options = {}) {
    const dx = targetX - x;
    const dy = targetY - y;
    const len = Math.hypot(dx, dy) || 1;
    this.x = x;
    this.y = y;
    this.vx = (dx / len) * speed;
    this.vy = (dy / len) * speed;
    this.r = options.radius || (golden ? 8 : 6.5);
    this.golden = golden;
    this.trail = [];
    this.bounceRemaining = options.bounceRemaining || 0;
    this.variant = options.variant || 'normal';
    this.glow = options.glow || (golden ? '#ffd24a' : '#dce9ff');
    this.countsForMiss = options.countsForMiss !== false;
  }

  update(dt, bounds) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) this.trail.shift();
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (!bounds || this.bounceRemaining <= 0) return;

    if (this.x - this.r < bounds.left) {
      this.x = bounds.left + this.r;
      this.vx = Math.abs(this.vx);
      this.bounceRemaining -= 1;
    } else if (this.x + this.r > bounds.right) {
      this.x = bounds.right - this.r;
      this.vx = -Math.abs(this.vx);
      this.bounceRemaining -= 1;
    }

    if (this.y - this.r < bounds.top) {
      this.y = bounds.top + this.r;
      this.vy = Math.abs(this.vy);
      this.bounceRemaining -= 1;
    }
  }

  draw(ctx) {
    ctx.save();
    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      ctx.globalAlpha = (i + 1) / (this.trail.length + 2) * 0.4;
      ctx.beginPath();
      ctx.fillStyle = this.golden ? '#ffd86d' : this.glow;
      ctx.arc(p.x, p.y, this.r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = this.bounceRemaining > 0 ? 20 : (this.golden ? 18 : 12);
    ctx.shadowColor = this.bounceRemaining > 0 ? '#79f3ff' : (this.golden ? '#ffd24a' : this.glow);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.golden ? '#ffe28a' : '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x - 1.8, this.y - 1.8, this.r * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.58)';
    ctx.fill();

    if (this.variant !== 'normal') {
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = this.glow;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r + 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  out(width, height) {
    return this.x < -30 || this.x > width + 30 || this.y < -40 || this.y > height + 40;
  }
};

window.PPB.GalleryTarget = class GalleryTarget {
  constructor({ x, laneY, size, speed, direction, laneIndex, armor = 1 }) {
    this.x = x;
    this.baseY = laneY;
    this.y = laneY;
    this.size = size;
    this.speed = speed;
    this.direction = direction;
    this.laneIndex = laneIndex;
    this.armor = armor;
    this.maxArmor = armor;
    this.r = size * 0.33;
    this.phase = Math.random() * Math.PI * 2;
  }

  update(dt, leftBound, rightBound) {
    this.x += this.speed * this.direction * dt;
    this.phase += 0.035 * dt;
    this.y = this.baseY + Math.sin(this.phase) * 6;

    if (this.x < leftBound + this.size * 0.45) {
      this.x = leftBound + this.size * 0.45;
      this.direction *= -1;
    }
    if (this.x > rightBound - this.size * 0.45) {
      this.x = rightBound - this.size * 0.45;
      this.direction *= -1;
    }
  }

  draw(ctx, sprite) {
    const size = this.size;
    const drawX = this.x - size / 2;
    const drawY = this.y - size / 2;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.sin(this.phase) * 0.03);
    ctx.shadowBlur = 18;
    ctx.shadowColor = this.armor > 1 ? 'rgba(255,120,120,0.45)' : 'rgba(255,255,255,0.15)';

    if (sprite && sprite.complete) {
      ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
    } else {
      ctx.fillStyle = '#f2c295';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.r + 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,60,60,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-this.r * 0.65, 0);
    ctx.lineTo(this.r * 0.65, 0);
    ctx.moveTo(0, -this.r * 0.65);
    ctx.lineTo(0, this.r * 0.65);
    ctx.stroke();

    if (this.maxArmor > 1) {
      const barW = size * 0.65;
      const ratio = this.armor / this.maxArmor;
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(-barW / 2, size * 0.38, barW, 6);
      ctx.fillStyle = '#ff7f7f';
      ctx.fillRect(-barW / 2, size * 0.38, barW * ratio, 6);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.strokeRect(-barW / 2, size * 0.38, barW, 6);
    }

    ctx.restore();
  }
};

window.PPB.BonusPickup = class BonusPickup {
  constructor({ x, y, type, label, color, laneIndex }) {
    this.x = x;
    this.baseY = y;
    this.y = y;
    this.type = type;
    this.label = label;
    this.color = color;
    this.r = 20;
    this.life = 16 * 60;
    this.phase = Math.random() * Math.PI * 2;
    this.laneIndex = laneIndex || 0;
    this.vx = (Math.random() < 0.5 ? -1 : 1) * (0.75 + Math.random() * 0.65);
  }

  update(dt, bounds) {
    this.phase += 0.04 * dt;
    this.x += this.vx * dt;
    this.y = this.baseY + Math.sin(this.phase) * 10;
    this.life -= dt;

    if (bounds) {
      if (this.x - this.r < bounds.left) {
        this.x = bounds.left + this.r;
        this.vx = Math.abs(this.vx);
      }
      if (this.x + this.r > bounds.right) {
        this.x = bounds.right - this.r;
        this.vx = -Math.abs(this.vx);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.shadowBlur = 24;
    ctx.shadowColor = this.color;

    const halo = ctx.createRadialGradient(0, 0, 4, 0, 0, this.r * 1.6);
    halo.addColorStop(0, 'rgba(255,255,255,0.4)');
    halo.addColorStop(0.35, this.color + 'cc');
    halo.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, this.r * 1.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    const orb = ctx.createLinearGradient(-this.r, -this.r, this.r, this.r);
    orb.addColorStop(0, '#ffffff');
    orb.addColorStop(0.45, this.color);
    orb.addColorStop(1, 'rgba(8,12,24,0.9)');
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.82)';
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#081120';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.label, 0, 1);
    ctx.restore();
  }
};

window.PPB.Particle = class Particle {
  constructor(x, y, color, power = 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 2.7 + 0.8) * power;
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 26 + Math.random() * 18;
    this.color = color;
    this.size = Math.random() * 4 + 2;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 0.025 * dt;
    this.life -= dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / 40);
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

window.PPB.FloatingText = class FloatingText {
  constructor(text, x, y, color = '#fff') {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = 42;
  }

  update(dt) {
    this.y -= 0.7 * dt;
    this.life -= dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / 42);
    ctx.fillStyle = this.color;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
};
