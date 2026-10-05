import * as THREE from 'three';
import { sound } from '../../utils/audio';

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

    // Background circuit grid
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

    // Outer Hexagonal Shield Cyber Ring
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

export type HackerAnimationState = 'idle' | 'walk' | 'run' | 'interact' | 'terminal';

export class HackerCharacter {
  public group: THREE.Group;
  private torsoGroup: THREE.Group;
  private hoodGroup: THREE.Group;
  private leftLeg: THREE.Group;
  private rightLeg: THREE.Group;
  private leftArm: THREE.Group;
  private rightArm: THREE.Group;
  private rightForearm: THREE.Group;
  private holoCone: THREE.Mesh;
  private coatTailCenter: THREE.Mesh;
  private coatTailLeft: THREE.Mesh;
  private coatTailRight: THREE.Mesh;
  private visorGlowCyan: THREE.Mesh;
  private visorGlowRed: THREE.Mesh;
  private backpackBeacon: THREE.Mesh;

  private currentAnimationState: HackerAnimationState = 'idle';
  private walkTime: number = 0;
  private idleTime: number = 0;
  private interactProgress: number = 0;
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

    // Premium Stylized Materials
    const techFabricMat = new THREE.MeshStandardMaterial({
      color: 0x090b10,
      roughness: 0.8,
      metalness: 0.2,
    });

    const cyberArmorMat = new THREE.MeshStandardMaterial({
      color: 0x141822,
      roughness: 0.45,
      metalness: 0.65,
    });

    const carbonFiberMat = new THREE.MeshStandardMaterial({
      color: 0x050608,
      roughness: 0.3,
      metalness: 0.8,
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

    // Sculpted Athletic Chest Jacket
    const chestGeo = new THREE.BoxGeometry(0.72, 0.82, 0.42);
    const chestMesh = new THREE.Mesh(chestGeo, techFabricMat);
    chestMesh.castShadow = true;
    this.torsoGroup.add(chestMesh);

    // Front Chest Armor Plate
    const armorPlateGeo = new THREE.BoxGeometry(0.55, 0.5, 0.08);
    const armorPlate = new THREE.Mesh(armorPlateGeo, cyberArmorMat);
    armorPlate.position.set(0, 0.08, 0.22);
    this.torsoGroup.add(armorPlate);

    // Tactical Chest Harness Straps (Cyan LED indicator)
    const strapGeo = new THREE.BoxGeometry(0.06, 0.75, 0.05);
    const leftStrap = new THREE.Mesh(strapGeo, carbonFiberMat);
    leftStrap.position.set(-0.2, 0.02, 0.23);
    this.torsoGroup.add(leftStrap);

    const rightStrap = new THREE.Mesh(strapGeo, carbonFiberMat);
    rightStrap.position.set(0.2, 0.02, 0.23);
    this.torsoGroup.add(rightStrap);

    const buckleGeo = new THREE.BoxGeometry(0.08, 0.08, 0.04);
    const leftBuckle = new THREE.Mesh(buckleGeo, glowCyanMat);
    leftBuckle.position.set(-0.2, 0.12, 0.26);
    this.torsoGroup.add(leftBuckle);

    const rightBuckle = new THREE.Mesh(buckleGeo, glowRedMat);
    rightBuckle.position.set(0.2, 0.12, 0.26);
    this.torsoGroup.add(rightBuckle);

    // Rebreather Collar & Tech Neck Mask
    const collarGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.22, 14);
    const collarMesh = new THREE.Mesh(collarGeo, cyberArmorMat);
    collarMesh.position.y = 0.46;
    this.torsoGroup.add(collarMesh);

    // 2. The Hood & Concealed Visor (Sculpted Stylized Cowl)
    this.hoodGroup = new THREE.Group();
    this.hoodGroup.position.set(0, 0.74, -0.02);

    // Outer Hood Shell (Curved dome)
    const hoodGeo = new THREE.SphereGeometry(0.33, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.88);
    const hoodMesh = new THREE.Mesh(hoodGeo, techFabricMat);
    hoodMesh.scale.set(1.02, 1.18, 1.22);
    hoodMesh.rotation.x = 0.12;
    hoodMesh.castShadow = true;
    this.hoodGroup.add(hoodMesh);

    // Hood Peak / Brow Ridge
    const browGeo = new THREE.CylinderGeometry(0.34, 0.35, 0.08, 12, 1, false, -Math.PI * 0.4, Math.PI * 0.8);
    const browMesh = new THREE.Mesh(browGeo, cyberArmorMat);
    browMesh.position.set(0, 0.14, 0.16);
    browMesh.rotation.x = 0.35;
    this.hoodGroup.add(browMesh);

    // Inner Face Void (Deep Obsidian Black Shadow)
    const voidGeo = new THREE.SphereGeometry(0.25, 12, 12);
    const voidMat = new THREE.MeshBasicMaterial({ color: 0x010204 });
    const voidMesh = new THREE.Mesh(voidGeo, voidMat);
    voidMesh.position.set(0, -0.02, 0.1);
    this.hoodGroup.add(voidMesh);

    // Dual Sensor/Eye Slits deep inside cowl (Left Cyan, Right Red)
    const eyeSlitGeo = new THREE.BoxGeometry(0.08, 0.016, 0.04);
    this.visorGlowCyan = new THREE.Mesh(eyeSlitGeo, glowCyanMat);
    this.visorGlowCyan.position.set(-0.065, 0.02, 0.23);
    this.hoodGroup.add(this.visorGlowCyan);

    this.visorGlowRed = new THREE.Mesh(eyeSlitGeo, glowRedMat);
    this.visorGlowRed.position.set(0.065, 0.02, 0.23);
    this.hoodGroup.add(this.visorGlowRed);

    this.torsoGroup.add(this.hoodGroup);

    // 3. Technical Backpack Rig on the Back
    const rigGeo = new THREE.BoxGeometry(0.48, 0.52, 0.18);
    const rigMesh = new THREE.Mesh(rigGeo, cyberArmorMat);
    rigMesh.position.set(0, 0.08, -0.28);
    this.torsoGroup.add(rigMesh);

    // Antenna & Telemetry Beacon on Backpack
    const beaconGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    this.backpackBeacon = new THREE.Mesh(beaconGeo, glowCyanMat);
    this.backpackBeacon.position.set(0.18, 0.38, -0.28);
    this.torsoGroup.add(this.backpackBeacon);

    // Digital Brain / Circuit Glyph on the BACK of the Hoodie
    const brainTexture = createCircuitBrainTexture();
    const glyphGeo = new THREE.PlaneGeometry(0.42, 0.42);
    const glyphMat = new THREE.MeshBasicMaterial({
      map: brainTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const backGlyph = new THREE.Mesh(glyphGeo, glyphMat);
    backGlyph.position.set(0, 0.06, -0.375); // On back of backpack module
    backGlyph.rotation.y = Math.PI;
    this.torsoGroup.add(backGlyph);

    // 4. Tactical Flared Coat Tails (Center, Left, Right)
    const coatMat = new THREE.MeshStandardMaterial({
      color: 0x08090e,
      roughness: 0.88,
      side: THREE.DoubleSide,
    });

    const tailGeo = new THREE.PlaneGeometry(0.28, 0.72);
    this.coatTailCenter = new THREE.Mesh(tailGeo, coatMat);
    this.coatTailCenter.position.set(0, -0.52, -0.22);
    this.coatTailCenter.rotation.x = -0.15;
    this.torsoGroup.add(this.coatTailCenter);

    this.coatTailLeft = new THREE.Mesh(tailGeo, coatMat);
    this.coatTailLeft.position.set(-0.25, -0.52, -0.18);
    this.coatTailLeft.rotation.set(-0.12, 0.2, 0.1);
    this.torsoGroup.add(this.coatTailLeft);

    this.coatTailRight = new THREE.Mesh(tailGeo, coatMat);
    this.coatTailRight.position.set(0.25, -0.52, -0.18);
    this.coatTailRight.rotation.set(-0.12, -0.2, -0.1);
    this.torsoGroup.add(this.coatTailRight);

    // 5. Articulated Arms
    // Shoulder Pauldrons
    const pauldronGeo = new THREE.BoxGeometry(0.24, 0.14, 0.24);
    const leftPauldron = new THREE.Mesh(pauldronGeo, cyberArmorMat);
    leftPauldron.position.set(-0.46, 0.35, 0);
    this.torsoGroup.add(leftPauldron);

    const rightPauldron = new THREE.Mesh(pauldronGeo, cyberArmorMat);
    rightPauldron.position.set(0.46, 0.35, 0);
    this.torsoGroup.add(rightPauldron);

    // Left Arm (Bicep + Forearm)
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.46, 0.28, 0);
    const bicepGeo = new THREE.BoxGeometry(0.18, 0.42, 0.18);
    const leftBicep = new THREE.Mesh(bicepGeo, techFabricMat);
    leftBicep.position.y = -0.18;
    this.leftArm.add(leftBicep);

    const leftForearm = new THREE.Group();
    leftForearm.position.y = -0.38;
    const forearmGeo = new THREE.BoxGeometry(0.19, 0.42, 0.19);
    const leftBracer = new THREE.Mesh(forearmGeo, cyberArmorMat);
    leftBracer.position.y = -0.16;
    leftForearm.add(leftBracer);

    // Glove + Cyan fingertip
    const handGeo = new THREE.BoxGeometry(0.16, 0.16, 0.12);
    const leftHand = new THREE.Mesh(handGeo, carbonFiberMat);
    leftHand.position.y = -0.4;
    leftForearm.add(leftHand);

    this.leftArm.add(leftForearm);
    this.torsoGroup.add(this.leftArm);

    // Right Arm (Equipped with Holographic Projector)
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.46, 0.28, 0);
    const rightBicep = new THREE.Mesh(bicepGeo, techFabricMat);
    rightBicep.position.y = -0.18;
    this.rightArm.add(rightBicep);

    this.rightForearm = new THREE.Group();
    this.rightForearm.position.y = -0.38;
    const rightBracer = new THREE.Mesh(forearmGeo, cyberArmorMat);
    rightBracer.position.y = -0.16;
    this.rightForearm.add(rightBracer);

    // Forearm Hologram Projector Node
    const holoEmitterGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.04, 10);
    const holoEmitter = new THREE.Mesh(holoEmitterGeo, glowCyanMat);
    holoEmitter.position.set(0, -0.22, 0.12);
    holoEmitter.rotation.x = Math.PI / 2;
    this.rightForearm.add(holoEmitter);

    // Holographic Conical Beam (Active during interaction)
    const coneGeo = new THREE.ConeGeometry(0.65, 2.2, 16, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    this.holoCone = new THREE.Mesh(coneGeo, coneMat);
    this.holoCone.position.set(0, -0.22, 1.25);
    this.holoCone.rotation.x = -Math.PI / 2;
    this.rightForearm.add(this.holoCone);

    const rightHand = new THREE.Mesh(handGeo, carbonFiberMat);
    rightHand.position.y = -0.4;
    this.rightForearm.add(rightHand);

    this.rightArm.add(this.rightForearm);
    this.torsoGroup.add(this.rightArm);

    this.group.add(this.torsoGroup);

    // 6. Tactical Articulated Legs & Combat Boots
    // Left Leg
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.2, 0.85, 0);
    const thighGeo = new THREE.BoxGeometry(0.24, 0.52, 0.24);
    const leftThigh = new THREE.Mesh(thighGeo, techFabricMat);
    leftThigh.position.y = -0.25;
    leftThigh.castShadow = true;
    this.leftLeg.add(leftThigh);

    // Knee Armor
    const kneeGeo = new THREE.BoxGeometry(0.26, 0.16, 0.1);
    const leftKnee = new THREE.Mesh(kneeGeo, cyberArmorMat);
    leftKnee.position.set(0, -0.5, 0.12);
    this.leftLeg.add(leftKnee);

    // Shin & Heavy Cyber Boot
    const bootGeo = new THREE.BoxGeometry(0.25, 0.38, 0.36);
    const leftBoot = new THREE.Mesh(bootGeo, carbonFiberMat);
    leftBoot.position.set(0, -0.72, 0.05);
    this.leftLeg.add(leftBoot);

    // Glowing Neon Tread Strips (Cyan)
    const soleGeo = new THREE.PlaneGeometry(0.2, 0.32);
    const leftSole = new THREE.Mesh(soleGeo, glowCyanMat);
    leftSole.position.set(0, -0.91, 0.05);
    leftSole.rotation.x = Math.PI / 2;
    this.leftLeg.add(leftSole);

    this.group.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.2, 0.85, 0);
    const rightThigh = new THREE.Mesh(thighGeo, techFabricMat);
    rightThigh.position.y = -0.25;
    rightThigh.castShadow = true;
    this.rightLeg.add(rightThigh);

    const rightKnee = new THREE.Mesh(kneeGeo, cyberArmorMat);
    rightKnee.position.set(0, -0.5, 0.12);
    this.rightLeg.add(rightKnee);

    const rightBoot = new THREE.Mesh(bootGeo, carbonFiberMat);
    rightBoot.position.set(0, -0.72, 0.05);
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

  public setAnimationState(state: HackerAnimationState) {
    this.currentAnimationState = state;
  }

  public getAnimationState(): HackerAnimationState {
    return this.currentAnimationState;
  }

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
   * Update character posture, animations, and footstep audio
   */
  public update(
    delta: number,
    isMoving: boolean,
    _moveDirection: THREE.Vector3,
    targetRotationY: number,
    isRunning: boolean = false,
    isInteracting: boolean = false
  ) {
    // 1. Rotation handling
    if (isMoving) {
      const currentRot = this.group.rotation.y;
      let diff = targetRotationY - currentRot;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.group.rotation.y += diff * Math.min(1, delta * 12);
    }

    // Determine target animation state
    let state: HackerAnimationState = 'idle';
    if (isInteracting) {
      state = 'interact';
    } else if (isMoving) {
      state = isRunning ? 'run' : 'walk';
    }
    this.currentAnimationState = state;

    // 2. State-Based Skeletal Animation
    if (state === 'run' || state === 'walk') {
      const speedMultiplier = state === 'run' ? 14 : 9.5;
      this.walkTime += delta * speedMultiplier;
      const stride = Math.sin(this.walkTime);
      const armStride = Math.cos(this.walkTime);

      const legRange = state === 'run' ? 0.85 : 0.55;
      const armRange = state === 'run' ? 0.75 : 0.45;

      // Leg swinging
      this.leftLeg.rotation.x = stride * legRange;
      this.rightLeg.rotation.x = -stride * legRange;

      // Arm swinging
      this.leftArm.rotation.x = -armStride * armRange;
      this.rightArm.rotation.x = armStride * armRange;

      // Forward lean during run vs walk
      const forwardTilt = state === 'run' ? 0.28 : 0.06;
      this.torsoGroup.rotation.x = THREE.MathUtils.lerp(
        this.torsoGroup.rotation.x,
        forwardTilt,
        delta * 8
      );

      // Torso bobbing
      const bobAmount = state === 'run' ? 0.1 : 0.06;
      this.torsoGroup.position.y = 1.35 + Math.abs(Math.sin(this.walkTime * 2)) * bobAmount;
      this.torsoGroup.rotation.z = Math.sin(this.walkTime) * 0.04;

      // Coat tails flapping dynamically
      const tailLift = state === 'run' ? -0.65 : -0.35;
      const tailFlutter = Math.sin(this.walkTime * 2) * (state === 'run' ? 0.3 : 0.15);
      this.coatTailCenter.rotation.x = tailLift + tailFlutter;
      this.coatTailLeft.rotation.x = tailLift * 0.9 + tailFlutter;
      this.coatTailRight.rotation.x = tailLift * 0.9 + tailFlutter;

      // Footstep particle emission + Cyber Footstep Audio
      const footstepInterval = state === 'run' ? 0.18 : 0.26;
      this.footstepAccumulator += delta;
      if (this.footstepAccumulator > footstepInterval) {
        this.footstepAccumulator = 0;
        this.lastFootstepSide = !this.lastFootstepSide;
        const footOffset = this.lastFootstepSide ? -0.2 : 0.2;
        const footWorldPos = new THREE.Vector3(footOffset, 0, 0)
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.group.rotation.y)
          .add(this.group.position);
        this.spawnFootstepParticle(footWorldPos);
        sound.playFootstep();
      }

      // Hide hologram during locomotion
      const coneMat = this.holoCone.material as THREE.MeshBasicMaterial;
      coneMat.opacity = Math.max(0, coneMat.opacity - delta * 6);
    } else if (state === 'interact') {
      // INTERACT ANIMATION: Raise arm, point holographic scanner beam
      this.interactProgress = THREE.MathUtils.lerp(this.interactProgress, 1.0, delta * 7);

      // Raise right arm forward
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, -Math.PI / 2.2, delta * 8);
      this.rightArm.rotation.z = THREE.MathUtils.lerp(this.rightArm.rotation.z, -0.15, delta * 8);
      this.rightForearm.rotation.x = THREE.MathUtils.lerp(this.rightForearm.rotation.x, 0.3, delta * 8);

      // Idle left arm at side
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0.1, delta * 8);

      // Reset legs
      this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, delta * 8);
      this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, delta * 8);
      this.torsoGroup.rotation.x = THREE.MathUtils.lerp(this.torsoGroup.rotation.x, 0, delta * 8);

      // Reveal holographic cone
      const coneMat = this.holoCone.material as THREE.MeshBasicMaterial;
      coneMat.opacity = Math.min(0.55, coneMat.opacity + delta * 4);
      this.holoCone.scale.set(
        1 + Math.sin(this.idleTime * 8) * 0.05,
        1,
        1 + Math.sin(this.idleTime * 8) * 0.05
      );
    } else {
      // IDLE ANIMATION: Breathing & subtle head/visor scan
      this.idleTime += delta;
      const breath = Math.sin(this.idleTime * 2.2);

      // Torso breathing expansion
      this.torsoGroup.position.y = 1.35 + breath * 0.02;
      this.torsoGroup.scale.set(1 + breath * 0.012, 1 + breath * 0.015, 1 + breath * 0.012);
      this.torsoGroup.rotation.x = THREE.MathUtils.lerp(this.torsoGroup.rotation.x, 0, delta * 6);
      this.torsoGroup.rotation.z = THREE.MathUtils.lerp(this.torsoGroup.rotation.z, 0, delta * 6);

      // Subtly turn head/hood
      this.hoodGroup.rotation.y = Math.sin(this.idleTime * 0.8) * 0.12;

      // Reset limbs smoothly to resting position
      this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, delta * 8);
      this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, delta * 8);
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, breath * 0.04, delta * 8);
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, -breath * 0.04, delta * 8);
      this.rightArm.rotation.z = THREE.MathUtils.lerp(this.rightArm.rotation.z, 0, delta * 8);
      this.rightForearm.rotation.x = THREE.MathUtils.lerp(this.rightForearm.rotation.x, 0, delta * 8);
      this.coatTailCenter.rotation.x = -0.15 + breath * 0.02;

      // Hide hologram during idle
      const coneMat = this.holoCone.material as THREE.MeshBasicMaterial;
      coneMat.opacity = Math.max(0, coneMat.opacity - delta * 6);
    }

    // Backpack beacon pulse
    const beaconMat = this.backpackBeacon.material as THREE.MeshBasicMaterial;
    beaconMat.color.setRGB(
      0,
      0.94 + Math.sin(this.idleTime * 5) * 0.06,
      1
    );

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
      p.velocity.y -= delta * 1.5;
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
