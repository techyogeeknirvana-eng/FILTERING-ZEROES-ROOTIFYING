import * as THREE from 'three';

/**
 * Creates the emissive Digital Brain / Circuit Symbol canvas texture
 * placed strictly on the back of the hoodie.
 */
function createCircuitBrainTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#080a10';
    ctx.fillRect(0, 0, 512, 512);

    ctx.save();
    ctx.translate(256, 256);

    // Subtle background circuit grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 1.5;
    for (let i = -180; i <= 180; i += 45) {
      ctx.beginPath();
      ctx.moveTo(i, -180);
      ctx.lineTo(i, 180);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-180, i);
      ctx.lineTo(180, i);
      ctx.stroke();
    }

    // Outer Hexagonal / Shield Cyber Ring
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    for (let a = 0; a < 6; a++) {
      const angle = (a * Math.PI) / 3;
      const r = 160;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Stylized Digital Brain / Neural Hemispheres
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#00f0ff';
    ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';

    // Left hemisphere lobes
    ctx.beginPath();
    ctx.moveTo(-12, -90);
    ctx.bezierCurveTo(-65, -95, -115, -60, -110, -10);
    ctx.bezierCurveTo(-125, 30, -90, 85, -45, 95);
    ctx.bezierCurveTo(-25, 100, -12, 80, -10, 60);
    ctx.stroke();

    // Right hemisphere lobes
    ctx.beginPath();
    ctx.moveTo(12, -90);
    ctx.bezierCurveTo(65, -95, 115, -60, 110, -10);
    ctx.bezierCurveTo(125, 30, 90, 85, 45, 95);
    ctx.bezierCurveTo(25, 100, 12, 80, 10, 60);
    ctx.stroke();

    // Central Digital Spine / Bus
    ctx.strokeStyle = '#ff1f43';
    ctx.shadowColor = '#ff1f43';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -110);
    ctx.lineTo(0, 110);
    ctx.stroke();

    // Neural Synapse Nodes (Circuit dots)
    const nodes = [
      { x: -50, y: -45, r: 6, c: '#00f0ff' },
      { x: 50, y: -45, r: 6, c: '#00f0ff' },
      { x: -70, y: 15, r: 5, c: '#00f0ff' },
      { x: 70, y: 15, r: 5, c: '#00f0ff' },
      { x: -35, y: 55, r: 5, c: '#ff1f43' },
      { x: 35, y: 55, r: 5, c: '#ff1f43' },
      { x: 0, y: -30, r: 7, c: '#ffffff' },
      { x: 0, y: 30, r: 7, c: '#ffffff' },
    ];

    nodes.forEach((n) => {
      ctx.fillStyle = n.c;
      ctx.shadowColor = n.c;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();

      // Trace line from center spine to node
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, n.y);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();
    });

    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export class HackerCharacter {
  public group: THREE.Group;
  private torsoGroup: THREE.Group;
  private leftLeg: THREE.Group;
  private rightLeg: THREE.Group;
  private leftArm: THREE.Group;
  private rightArm: THREE.Group;
  private coatTail: THREE.Mesh;
  private hoodMesh: THREE.Mesh;
  private visorGlow: THREE.Mesh;

  private walkTime: number = 0;
  private idleTime: number = 0;
  private lastFootstepSide: boolean = false;
  private footstepAccumulator: number = 0;

  // Digital particle spark pool for footsteps
  private footstepParticles: {
    mesh: THREE.Mesh;
    life: number;
    maxLife: number;
    velocity: THREE.Vector3;
    active: boolean;
  }[] = [];

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.group.name = 'HackerPlayer';

    // Materials
    const darkSuitMat = new THREE.MeshStandardMaterial({
      color: 0x0c0e14,
      roughness: 0.75,
      metalness: 0.25,
    });

    const cyberArmorMat = new THREE.MeshStandardMaterial({
      color: 0x161a24,
      roughness: 0.5,
      metalness: 0.6,
    });

    const glowCyanMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    const glowRedMat = new THREE.MeshBasicMaterial({
      color: 0xff1f43,
    });

    // 1. Torso & Upper Body
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.y = 1.35;

    // Main Chest Mesh (trapezoidal tapered shape)
    const chestGeo = new THREE.BoxGeometry(0.72, 0.82, 0.44);
    const chestMesh = new THREE.Mesh(chestGeo, darkSuitMat);
    chestMesh.castShadow = true;
    this.torsoGroup.add(chestMesh);

    // Collar / cyber neck plate
    const neckGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.25, 12);
    const neckMesh = new THREE.Mesh(neckGeo, cyberArmorMat);
    neckMesh.position.y = 0.45;
    this.torsoGroup.add(neckMesh);

    // 2. The Hood (No face revealed - dark interior with cyber visor slit)
    const hoodGroup = new THREE.Group();
    hoodGroup.position.set(0, 0.72, -0.04);

    const hoodGeo = new THREE.SphereGeometry(0.32, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.85);
    this.hoodMesh = new THREE.Mesh(hoodGeo, darkSuitMat);
    this.hoodMesh.scale.set(1.02, 1.15, 1.18);
    this.hoodMesh.rotation.x = 0.15;
    this.hoodMesh.castShadow = true;
    hoodGroup.add(this.hoodMesh);

    // Inner Face Void (Deep obsidian black shadow)
    const voidGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const voidMat = new THREE.MeshBasicMaterial({ color: 0x010204 });
    const voidMesh = new THREE.Mesh(voidGeo, voidMat);
    voidMesh.position.set(0, -0.02, 0.1);
    hoodGroup.add(voidMesh);

    // Cyber Visor Glint / Red-Cyan dual telemetry slit deep inside hood
    const visorGeo = new THREE.BoxGeometry(0.2, 0.022, 0.05);
    this.visorGlow = new THREE.Mesh(visorGeo, glowCyanMat);
    this.visorGlow.position.set(0, 0.02, 0.22);
    hoodGroup.add(this.visorGlow);

    this.torsoGroup.add(hoodGroup);

    // 3. Digital Brain / Circuit Glyph on the BACK of the Hoodie
    const brainTexture = createCircuitBrainTexture();
    const glyphGeo = new THREE.PlaneGeometry(0.44, 0.44);
    const glyphMat = new THREE.MeshBasicMaterial({
      map: brainTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const backGlyph = new THREE.Mesh(glyphGeo, glyphMat);
    backGlyph.position.set(0, 0.05, -0.225); // Placed flush on the back
    backGlyph.rotation.y = Math.PI; // Face outwards to the back camera
    this.torsoGroup.add(backGlyph);

    // 4. Cyber Coat Tail / Cloak hanging behind legs
    const coatTailGeo = new THREE.PlaneGeometry(0.64, 0.75);
    const coatMat = new THREE.MeshStandardMaterial({
      color: 0x08090e,
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
    this.coatTail = new THREE.Mesh(coatTailGeo, coatMat);
    this.coatTail.position.set(0, -0.55, -0.22);
    this.coatTail.rotation.x = -0.15;
    this.torsoGroup.add(this.coatTail);

    // 5. Arms
    // Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.45, 0.28, 0);
    const armGeo = new THREE.BoxGeometry(0.18, 0.75, 0.18);
    const leftArmMesh = new THREE.Mesh(armGeo, darkSuitMat);
    leftArmMesh.position.y = -0.32;
    leftArmMesh.castShadow = true;
    this.leftArm.add(leftArmMesh);
    // Cyan wrist telemetry band
    const wristBandGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 12);
    const leftWrist = new THREE.Mesh(wristBandGeo, glowCyanMat);
    leftWrist.position.y = -0.58;
    this.leftArm.add(leftWrist);
    this.torsoGroup.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.45, 0.28, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, darkSuitMat);
    rightArmMesh.position.y = -0.32;
    rightArmMesh.castShadow = true;
    this.rightArm.add(rightArmMesh);
    // Red wrist telemetry band
    const rightWrist = new THREE.Mesh(wristBandGeo, glowRedMat);
    rightWrist.position.y = -0.58;
    this.rightArm.add(rightWrist);
    this.torsoGroup.add(this.rightArm);

    this.group.add(this.torsoGroup);

    // 6. Legs
    // Left Leg
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.2, 0.85, 0);
    const legGeo = new THREE.BoxGeometry(0.22, 0.85, 0.22);
    const leftLegMesh = new THREE.Mesh(legGeo, cyberArmorMat);
    leftLegMesh.position.y = -0.42;
    leftLegMesh.castShadow = true;
    this.leftLeg.add(leftLegMesh);

    // Cyber Boot (left) with subtle neon sole strip
    const bootGeo = new THREE.BoxGeometry(0.24, 0.16, 0.34);
    const leftBoot = new THREE.Mesh(bootGeo, darkSuitMat);
    leftBoot.position.set(0, -0.84, 0.05);
    this.leftLeg.add(leftBoot);

    const soleGeo = new THREE.PlaneGeometry(0.2, 0.3);
    const leftSole = new THREE.Mesh(soleGeo, glowCyanMat);
    leftSole.position.set(0, -0.91, 0.05);
    leftSole.rotation.x = Math.PI / 2;
    this.leftLeg.add(leftSole);
    this.group.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.2, 0.85, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, cyberArmorMat);
    rightLegMesh.position.y = -0.42;
    rightLegMesh.castShadow = true;
    this.rightLeg.add(rightLegMesh);

    // Cyber Boot (right)
    const rightBoot = new THREE.Mesh(bootGeo, darkSuitMat);
    rightBoot.position.set(0, -0.84, 0.05);
    this.rightLeg.add(rightBoot);

    const rightSole = new THREE.Mesh(soleGeo, glowCyanMat);
    rightSole.position.set(0, -0.91, 0.05);
    rightSole.rotation.x = Math.PI / 2;
    this.rightLeg.add(rightSole);
    this.group.add(this.rightLeg);

    // 7. Footstep Particle Pool
    const particleGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    for (let i = 0; i < 30; i++) {
      const isCyan = i % 2 === 0;
      const mat = new THREE.MeshBasicMaterial({
        color: isCyan ? 0x00f0ff : 0xff1f43,
        transparent: true,
        opacity: 0,
      });
      const pMesh = new THREE.Mesh(particleGeo, mat);
      pMesh.visible = false;
      scene.add(pMesh);

      this.footstepParticles.push({
        mesh: pMesh,
        life: 0,
        maxLife: 0.6,
        velocity: new THREE.Vector3(),
        active: false,
      });
    }

    scene.add(this.group);
  }

  /**
   * Spawns a small cyber pixel footprint particle at the player's ground point
   */
  private spawnFootstepParticle(pos: THREE.Vector3) {
    const p = this.footstepParticles.find((item) => !item.active);
    if (!p) return;

    p.active = true;
    p.life = 0;
    p.mesh.visible = true;
    p.mesh.position.copy(pos);
    p.mesh.position.y = 0.04;
    p.velocity.set(
      (Math.random() - 0.5) * 0.6,
      Math.random() * 0.8 + 0.3,
      (Math.random() - 0.5) * 0.6
    );
  }

  /**
   * Update character posture, idle breathing, stride locomotion, and footstep particles
   */
  public update(
    delta: number,
    isMoving: boolean,
    _moveDirection: THREE.Vector3,
    targetRotationY: number
  ) {
    // 1. Smooth rotation toward moving/looking direction
    if (isMoving) {
      // Lerp rotation smoothly
      const currentRot = this.group.rotation.y;
      let diff = targetRotationY - currentRot;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.group.rotation.y += diff * Math.min(1, delta * 12);
    }

    // 2. Locomotion or Idle Animation
    if (isMoving) {
      this.walkTime += delta * 9.5;
      const stride = Math.sin(this.walkTime);
      const armStride = Math.cos(this.walkTime);

      // Leg swinging
      this.leftLeg.rotation.x = stride * 0.55;
      this.rightLeg.rotation.x = -stride * 0.55;

      // Arm swinging (inverse)
      this.leftArm.rotation.x = -armStride * 0.45;
      this.rightArm.rotation.x = armStride * 0.45;

      // Torso bobbing
      this.torsoGroup.position.y = 1.35 + Math.abs(Math.sin(this.walkTime * 2)) * 0.06;
      this.torsoGroup.rotation.z = Math.sin(this.walkTime) * 0.04;

      // Coat tail flapping in the wind
      this.coatTail.rotation.x = -0.35 + Math.sin(this.walkTime * 2) * 0.15;

      // Footstep particle emission
      this.footstepAccumulator += delta;
      if (this.footstepAccumulator > 0.22) {
        this.footstepAccumulator = 0;
        this.lastFootstepSide = !this.lastFootstepSide;
        const footOffset = this.lastFootstepSide ? -0.2 : 0.2;
        const footWorldPos = new THREE.Vector3(footOffset, 0, 0)
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.group.rotation.y)
          .add(this.group.position);
        this.spawnFootstepParticle(footWorldPos);
      }
    } else {
      // Idle state
      this.idleTime += delta;
      const breath = Math.sin(this.idleTime * 2.2);

      // Subtle breathing scale & posture
      this.torsoGroup.position.y = 1.35 + breath * 0.02;
      this.torsoGroup.scale.set(1 + breath * 0.012, 1 + breath * 0.015, 1 + breath * 0.012);

      // Reset limbs smoothly to resting position
      this.leftLeg.rotation.x *= 0.85;
      this.rightLeg.rotation.x *= 0.85;
      this.leftArm.rotation.x = breath * 0.03;
      this.rightArm.rotation.x = -breath * 0.03;
      this.coatTail.rotation.x = -0.15 + breath * 0.02;
    }

    // 3. Update active footstep particles
    for (const p of this.footstepParticles) {
      if (!p.active) continue;
      p.life += delta;
      if (p.life >= p.maxLife) {
        p.active = false;
        p.mesh.visible = false;
        continue;
      }

      p.mesh.position.addScaledVector(p.velocity, delta);
      p.velocity.y -= delta * 1.5; // gentle gravity
      const progress = p.life / p.maxLife;
      const mat = p.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - progress) * 0.8;
      p.mesh.scale.setScalar(1 - progress * 0.5);
    }
  }

  public getPosition(): THREE.Vector3 {
    return this.group.position;
  }

  public setPosition(x: number, y: number, z: number) {
    this.group.position.set(x, y, z);
  }

  public dispose(scene: THREE.Scene) {
    scene.remove(this.group);
    for (const p of this.footstepParticles) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    }
  }
}
