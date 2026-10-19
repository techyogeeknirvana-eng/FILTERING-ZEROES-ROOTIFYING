import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface Checkpoint3DData {
  id: number;
  label: string;
  name: string;
  isUnlocked: boolean;
  coords: { x: number; y: number };
}

interface CyberSerpentineDragonSceneProps {
  dragonMood: 'idle' | 'roaring' | 'celebrating';
  targetCheckpointId?: number | null;
  hoveredCheckpointId?: number | null;
  checkpoints: Checkpoint3DData[];
}

/**
 * Maps 2D 1024x682 canvas coordinate space to Three.js 3D world space.
 * 3D space is [-12, 12] on X and [-8, 8] on Y at Z=0.
 */
const screenTo3D = (x: number, y: number, z = 0): THREE.Vector3 => {
  const x3d = (x / 1024 - 0.5) * 24;
  const y3d = -(y / 682 - 0.5) * 16;
  return new THREE.Vector3(x3d, y3d, z);
};

export const CyberSerpentineDragonScene: React.FC<CyberSerpentineDragonSceneProps> = ({
  dragonMood,
  targetCheckpointId,
  hoveredCheckpointId,
  checkpoints,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Store mutable state for the animation loop
  const stateRef = useRef({
    dragonMood,
    targetCheckpointId,
    hoveredCheckpointId,
    // Head kinematics targets
    targetHeadYaw: 0,
    targetHeadPitch: 0,
    targetJawOpen: 0.05,
    targetWingSpread: 0,
    targetMouthIntensity: 0.3,
    // Current interpolated kinematics
    currentHeadYaw: 0,
    currentHeadPitch: 0,
    currentJawOpen: 0.05,
    currentWingSpread: 0,
    currentMouthIntensity: 0.3,
    // Eye blink tracking
    blinkTimer: 0,
    isBlinking: false,
    // Lightning strike duration
    lightningTimer: 0,
    lightningTarget: null as THREE.Vector3 | null,
  });

  // Keep stateRef in sync with props
  useEffect(() => {
    stateRef.current.dragonMood = dragonMood;
    stateRef.current.targetCheckpointId = targetCheckpointId;
    stateRef.current.hoveredCheckpointId = hoveredCheckpointId;

    if (dragonMood === 'roaring') {
      const cpId = targetCheckpointId || 4;
      const targetCp = checkpoints.find((c) => c.id === cpId);
      if (targetCp) {
        const targetPos = screenTo3D(targetCp.coords.x, targetCp.coords.y, 0);
        stateRef.current.lightningTarget = targetPos;
        stateRef.current.lightningTimer = 0.8; // 800ms of lightning strike

        // Calculate aim angles from head position toward target checkpoint
        const headBasePos = screenTo3D(350, 110, 1.8);
        const dx = targetPos.x - headBasePos.x;
        const dy = targetPos.y - headBasePos.y;
        stateRef.current.targetHeadYaw = Math.atan2(dx, 5) * 0.75;
        stateRef.current.targetHeadPitch = -Math.atan2(dy, 5) * 0.55;
      }
      stateRef.current.targetJawOpen = 0.85; // Wide open snarl / roar
      stateRef.current.targetWingSpread = 0.65; // Threat display
      stateRef.current.targetMouthIntensity = 3.5;
    } else if (dragonMood === 'celebrating') {
      stateRef.current.targetHeadYaw = 0.1;
      stateRef.current.targetHeadPitch = -0.25; // Friendly bow
      stateRef.current.targetJawOpen = 0.35;
      stateRef.current.targetWingSpread = 0.5;
      stateRef.current.targetMouthIntensity = 2.0;
      stateRef.current.lightningTarget = null;
    } else {
      // Idle
      stateRef.current.targetHeadYaw = 0;
      stateRef.current.targetHeadPitch = 0;
      stateRef.current.targetJawOpen = 0.06;
      stateRef.current.targetWingSpread = 0;
      stateRef.current.targetMouthIntensity = 0.4;
      stateRef.current.lightningTarget = null;
    }
  }, [dragonMood, targetCheckpointId, hoveredCheckpointId, checkpoints]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, & WebGL Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010204, 0.028);

    const width = container.clientWidth || 1024;
    const height = container.clientHeight || 682;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 19.3137); // Matches exact [-12, 12] x [-8, 8] viewport at Z=0
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting Architecture
    const ambientLight = new THREE.AmbientLight(0x081024, 1.8);
    scene.add(ambientLight);

    const keyCyanLight = new THREE.DirectionalLight(0x00f0ff, 3.2);
    keyCyanLight.position.set(-6, 8, 8);
    scene.add(keyCyanLight);

    const rimRedLight = new THREE.DirectionalLight(0xff1f43, 2.6);
    rimRedLight.position.set(8, -6, -3);
    scene.add(rimRedLight);

    const activeSignalBeacon = new THREE.PointLight(0x00f0ff, 3.0, 7);
    const cp1Pos = screenTo3D(274, 194, 1.0);
    activeSignalBeacon.position.copy(cp1Pos);
    scene.add(activeSignalBeacon);

    const mouthPointLight = new THREE.PointLight(0xff1f43, 0, 6);
    scene.add(mouthPointLight);

    // 3. Materials
    const obsidianArmorMat = new THREE.MeshStandardMaterial({
      color: 0x050811,
      metalness: 0.88,
      roughness: 0.22,
    });

    const metallicSilverMat = new THREE.MeshStandardMaterial({
      color: 0x8a9bb8,
      metalness: 0.94,
      roughness: 0.18,
    });

    const cyanGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    const redGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff1f43,
    });

    const eyeGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    const wingMembraneMat = new THREE.MeshStandardMaterial({
      color: 0x07152b,
      emissive: 0x003b6f,
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.35,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
    });

    const lightningMat = new THREE.LineBasicMaterial({
      color: 0xff1f43,
      linewidth: 3,
    });

    // 4. Background Atmospheric Elements: Floating Dark Cyber Monoliths
    const monolithGroup = new THREE.Group();
    scene.add(monolithGroup);

    // Create dark hexagonal spires anchoring key checkpoints in 3D space
    const monolithPositions = [
      screenTo3D(274, 194, -1.8),
      screenTo3D(562, 108, -2.5),
      screenTo3D(872, 202, -2.0),
      screenTo3D(586, 254, -1.5),
      screenTo3D(394, 354, -2.2),
      screenTo3D(855, 380, -2.8),
      screenTo3D(463, 482, -1.6),
      screenTo3D(770, 538, -2.2),
    ];

    monolithPositions.forEach((pos, idx) => {
      const height = 4.0 + (idx % 3) * 1.5;
      const radius = 1.2 + (idx % 2) * 0.4;
      const spireGeo = new THREE.CylinderGeometry(radius * 0.6, radius, height, 6);
      const spireMesh = new THREE.Mesh(spireGeo, obsidianArmorMat);
      spireMesh.position.set(pos.x, pos.y - height / 2, pos.z);
      spireMesh.rotation.y = (idx * Math.PI) / 3;
      monolithGroup.add(spireMesh);

      // Neon cyber edge rim ring on top of each monolith
      const rimGeo = new THREE.TorusGeometry(radius * 0.62, 0.03, 8, 6);
      const rimMesh = new THREE.Mesh(rimGeo, idx === 0 ? cyanGlowMat : redGlowMat);
      rimMesh.position.set(pos.x, pos.y, pos.z);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.rotation.z = (idx * Math.PI) / 3;
      monolithGroup.add(rimMesh);
    });

    // 5. Floating Digital Plasma Embers
    const emberCount = 80;
    const emberPositions = new Float32Array(emberCount * 3);
    const emberVelocities: Array<{ x: number; y: number; z: number }> = [];

    for (let i = 0; i < emberCount; i++) {
      emberPositions[i * 3] = (Math.random() - 0.5) * 24;
      emberPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      emberVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: Math.random() * 0.03 + 0.01,
        z: (Math.random() - 0.5) * 0.02,
      });
    }

    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const emberCloud = new THREE.Points(emberGeo, emberMat);
    scene.add(emberCloud);

    // 6. Build the Serpentine 3D Dragon Curve Passing Directly Through All Checkpoints
    const dragonControlPoints = [
      screenTo3D(365, 85, 2.0), // Head Snout tip
      screenTo3D(335, 125, 1.6), // Head / Cranium
      screenTo3D(300, 160, 1.2), // Upper Neck
      screenTo3D(274, 194, 0.8), // CHECKPOINT 01 (THE SIGNAL - OPEN NOW)
      screenTo3D(320, 205, 0.6), // Chest / Upper Ribcage
      screenTo3D(410, 185, 0.3),
      screenTo3D(490, 140, 0.0),
      screenTo3D(562, 108, -0.2), // CHECKPOINT 02
      screenTo3D(650, 115, -0.1),
      screenTo3D(750, 145, 0.1),
      screenTo3D(820, 175, 0.3),
      screenTo3D(872, 202, 0.4), // CHECKPOINT 03
      screenTo3D(840, 235, 0.5),
      screenTo3D(740, 248, 0.7),
      screenTo3D(660, 252, 0.8),
      screenTo3D(586, 254, 0.85), // CHECKPOINT 04
      screenTo3D(500, 280, 0.7),
      screenTo3D(440, 315, 0.5),
      screenTo3D(394, 354, 0.4), // CHECKPOINT 05
      screenTo3D(460, 375, 0.2),
      screenTo3D(580, 380, 0.0),
      screenTo3D(700, 375, -0.1),
      screenTo3D(800, 375, -0.15),
      screenTo3D(855, 380, -0.2), // CHECKPOINT 06
      screenTo3D(875, 420, 0.1),
      screenTo3D(820, 460, 0.3),
      screenTo3D(710, 480, 0.5),
      screenTo3D(580, 485, 0.6),
      screenTo3D(463, 482, 0.65), // CHECKPOINT 07
      screenTo3D(540, 505, 0.4),
      screenTo3D(650, 530, 0.2),
      screenTo3D(770, 538, 0.0), // CHECKPOINT 08
      screenTo3D(850, 545, -0.2),
      screenTo3D(915, 520, -0.5),
      screenTo3D(950, 455, -0.9),
      screenTo3D(955, 380, -1.3), // Tail Tip curl
    ];

    const spineCurve = new THREE.CatmullRomCurve3(dragonControlPoints, false, 'catmullrom', 0.5);

    // 7. Articulated Dragon Body: 46 Vertebrae Segments with Overlapping Cyber-Armor Plates
    const segmentCount = 46;
    const bodySegments: Array<{
      group: THREE.Group;
      coreMesh: THREE.Mesh;
      armorRing: THREE.Mesh;
      spikeMesh: THREE.Mesh;
      baseT: number;
      baseRadius: number;
    }> = [];

    const dragonBodyGroup = new THREE.Group();
    scene.add(dragonBodyGroup);

    // Geometry templates
    const baseCylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 8);
    const baseSpikeGeo = new THREE.ConeGeometry(0.2, 0.7, 4);
    const baseTorusGeo = new THREE.TorusGeometry(1.05, 0.12, 6, 12);

    for (let i = 0; i < segmentCount; i++) {
      const t = i / (segmentCount - 1);

      // Taper radius: thicker at chest/torso (t ~ 0.1 to 0.4), thinner at neck (t ~ 0) and tail (t ~ 1)
      let radius = 0.55;
      if (t < 0.1) {
        radius = 0.45 + t * 2.5; // Neck expands to chest
      } else if (t < 0.35) {
        radius = 0.7 - (t - 0.1) * 0.4; // Chest & upper torso
      } else if (t < 0.7) {
        radius = 0.6 - (t - 0.35) * 0.6; // Mid-body taper
      } else {
        radius = 0.39 - (t - 0.7) * 1.0; // Tail taper down to 0.09
      }
      radius = Math.max(0.09, radius);

      const segmentGroup = new THREE.Group();

      // Main obsidian armored vertebra hull
      const coreMesh = new THREE.Mesh(baseCylinderGeo, obsidianArmorMat);
      coreMesh.scale.set(radius, 0.42, radius * 0.9);
      coreMesh.rotation.x = Math.PI / 2;
      segmentGroup.add(coreMesh);

      // Emissive energy conduit ring around vertebra
      const isChestActive = i < 10;
      const conduitMat = isChestActive ? cyanGlowMat : redGlowMat;
      const armorRing = new THREE.Mesh(baseTorusGeo, conduitMat);
      armorRing.scale.set(radius, radius, 0.35);
      segmentGroup.add(armorRing);

      // Dorsal cyber-spike crest along the top of each vertebra
      const spikeMesh = new THREE.Mesh(baseSpikeGeo, conduitMat);
      const spikeHeight = radius * 1.6;
      spikeMesh.scale.set(radius * 0.6, spikeHeight, radius * 0.6);
      spikeMesh.position.set(0, radius + spikeHeight * 0.4, 0);
      spikeMesh.rotation.x = -Math.PI / 6;
      segmentGroup.add(spikeMesh);

      dragonBodyGroup.add(segmentGroup);
      bodySegments.push({
        group: segmentGroup,
        coreMesh,
        armorRing,
        spikeMesh,
        baseT: t,
        baseRadius: radius,
      });
    }

    // 8. Articulated Dragon Head, Jaw, Eyes, & Horns (Positioned at t = 0)
    const headGroup = new THREE.Group();
    scene.add(headGroup);

    // Cranium / Upper Skull
    const craniumGeo = new THREE.ConeGeometry(0.48, 1.1, 5);
    const craniumMesh = new THREE.Mesh(craniumGeo, obsidianArmorMat);
    craniumMesh.rotation.x = Math.PI / 1.7;
    craniumMesh.rotation.y = Math.PI / 5;
    craniumMesh.position.set(0, 0.1, 0.4);
    headGroup.add(craniumMesh);

    // Brow Armor Visor Shield
    const browGeo = new THREE.BoxGeometry(0.65, 0.15, 0.45);
    const browMesh = new THREE.Mesh(browGeo, metallicSilverMat);
    browMesh.position.set(0, 0.24, 0.3);
    headGroup.add(browMesh);

    // Swept-Back Cyber-Horns
    const hornCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.22, 0.28, 0.1),
      new THREE.Vector3(-0.55, 0.75, -0.25),
      new THREE.Vector3(-0.85, 1.15, -0.65),
    ]);
    const hornMeshL = new THREE.Mesh(
      new THREE.TubeGeometry(hornCurveL, 12, 0.08, 6, false),
      metallicSilverMat
    );
    headGroup.add(hornMeshL);

    const hornCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.22, 0.28, 0.1),
      new THREE.Vector3(0.55, 0.75, -0.25),
      new THREE.Vector3(0.85, 1.15, -0.65),
    ]);
    const hornMeshR = new THREE.Mesh(
      new THREE.TubeGeometry(hornCurveR, 12, 0.08, 6, false),
      metallicSilverMat
    );
    headGroup.add(hornMeshR);

    // Luminous Cyber Eyes (Left & Right Visors)
    const eyeGeo = new THREE.BoxGeometry(0.16, 0.05, 0.08);
    const eyeMeshL = new THREE.Mesh(eyeGeo, eyeGlowMat);
    eyeMeshL.position.set(-0.22, 0.2, 0.52);
    eyeMeshL.rotation.y = -Math.PI / 7;
    headGroup.add(eyeMeshL);

    const eyeMeshR = new THREE.Mesh(eyeGeo, eyeGlowMat);
    eyeMeshR.position.set(0.22, 0.2, 0.52);
    eyeMeshR.rotation.y = Math.PI / 7;
    headGroup.add(eyeMeshR);

    // Articulated Lower Jaw (Rotates around X axis during roars)
    const jawPivot = new THREE.Group();
    jawPivot.position.set(0, 0.02, 0.25);
    headGroup.add(jawPivot);

    const jawGeo = new THREE.ConeGeometry(0.32, 0.85, 4);
    const jawMesh = new THREE.Mesh(jawGeo, obsidianArmorMat);
    jawMesh.rotation.x = Math.PI / 1.8;
    jawMesh.position.set(0, -0.06, 0.35);
    jawPivot.add(jawMesh);

    // Razor Metallic Fangs
    const fangGeo = new THREE.ConeGeometry(0.04, 0.14, 4);
    const fangL = new THREE.Mesh(fangGeo, metallicSilverMat);
    fangL.position.set(-0.12, 0.04, 0.52);
    fangL.rotation.x = Math.PI;
    headGroup.add(fangL);

    const fangR = new THREE.Mesh(fangGeo, metallicSilverMat);
    fangR.position.set(0.12, 0.04, 0.52);
    fangR.rotation.x = Math.PI;
    headGroup.add(fangR);

    // 9. Articulated Dual Skeletal Cyber-Wings (Mounted at Upper Torso / Segment 4)
    const wingsGroup = new THREE.Group();
    scene.add(wingsGroup);

    // Left Wing
    const wingPivotL = new THREE.Group();
    wingPivotL.position.set(-0.5, 0.5, 0);
    wingsGroup.add(wingPivotL);

    const boneL1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.08, 1.4, 5),
      metallicSilverMat
    );
    boneL1.position.set(-0.6, 0.45, 0);
    boneL1.rotation.z = Math.PI / 3;
    wingPivotL.add(boneL1);

    const wingWristL = new THREE.Group();
    wingWristL.position.set(-1.2, 0.9, 0);
    wingPivotL.add(wingWristL);

    // Extended finger struts
    const strutGeo = new THREE.CylinderGeometry(0.03, 0.05, 1.8, 4);
    const strutL1 = new THREE.Mesh(strutGeo, metallicSilverMat);
    strutL1.position.set(-0.7, -0.6, 0.1);
    strutL1.rotation.z = -Math.PI / 5;
    wingWristL.add(strutL1);

    const strutL2 = new THREE.Mesh(strutGeo, metallicSilverMat);
    strutL2.position.set(-0.9, -0.3, -0.1);
    strutL2.rotation.z = -Math.PI / 3.5;
    wingWristL.add(strutL2);

    // Left Wing Membrane
    const wingGeoL = new THREE.BufferGeometry();
    const verticesL = new Float32Array([
      0, 0, 0,
      -1.2, 0.9, 0,
      -1.8, -0.6, 0,
      0, 0, 0,
      -1.8, -0.6, 0,
      -0.9, -1.2, 0,
    ]);
    wingGeoL.setAttribute('position', new THREE.BufferAttribute(verticesL, 3));
    wingGeoL.computeVertexNormals();
    const membraneL = new THREE.Mesh(wingGeoL, wingMembraneMat);
    wingPivotL.add(membraneL);

    // Right Wing
    const wingPivotR = new THREE.Group();
    wingPivotR.position.set(0.5, 0.5, 0);
    wingsGroup.add(wingPivotR);

    const boneR1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.08, 1.4, 5),
      metallicSilverMat
    );
    boneR1.position.set(0.6, 0.45, 0);
    boneR1.rotation.z = -Math.PI / 3;
    wingPivotR.add(boneR1);

    const wingWristR = new THREE.Group();
    wingWristR.position.set(1.2, 0.9, 0);
    wingPivotR.add(wingWristR);

    const strutR1 = new THREE.Mesh(strutGeo, metallicSilverMat);
    strutR1.position.set(0.7, -0.6, 0.1);
    strutR1.rotation.z = Math.PI / 5;
    wingWristR.add(strutR1);

    const strutR2 = new THREE.Mesh(strutGeo, metallicSilverMat);
    strutR2.position.set(0.9, -0.3, -0.1);
    strutR2.rotation.z = Math.PI / 3.5;
    wingWristR.add(strutR2);

    // Right Wing Membrane
    const wingGeoR = new THREE.BufferGeometry();
    const verticesR = new Float32Array([
      0, 0, 0,
      1.2, 0.9, 0,
      1.8, -0.6, 0,
      0, 0, 0,
      1.8, -0.6, 0,
      0.9, -1.2, 0,
    ]);
    wingGeoR.setAttribute('position', new THREE.BufferAttribute(verticesR, 3));
    wingGeoR.computeVertexNormals();
    const membraneR = new THREE.Mesh(wingGeoR, wingMembraneMat);
    wingPivotR.add(membraneR);

    // Background Cyber Grid Floor in distant depths
    const gridHelper = new THREE.GridHelper(50, 25, 0x00f0ff, 0x071b3b);
    gridHelper.position.set(0, -9, -4);
    gridHelper.rotation.x = Math.PI / 12;
    scene.add(gridHelper);

    // 9b. Articulated Cybernetic Limbs (Forelegs on segment 6, Hindlegs on segment 22)
    const legGeoUpper = new THREE.CylinderGeometry(0.08, 0.12, 0.75, 5);
    const legGeoLower = new THREE.CylinderGeometry(0.06, 0.08, 0.65, 5);
    const clawGeo = new THREE.ConeGeometry(0.03, 0.22, 4);

    const createCyberLimb = (isLeft: boolean) => {
      const limbRoot = new THREE.Group();
      const upperLeg = new THREE.Mesh(legGeoUpper, obsidianArmorMat);
      upperLeg.position.set(0, -0.35, 0);
      upperLeg.rotation.z = isLeft ? -Math.PI / 4 : Math.PI / 4;
      limbRoot.add(upperLeg);

      const kneeJoint = new THREE.Group();
      kneeJoint.position.set(isLeft ? -0.35 : 0.35, -0.65, 0);
      limbRoot.add(kneeJoint);

      const lowerLeg = new THREE.Mesh(legGeoLower, metallicSilverMat);
      lowerLeg.position.set(0, -0.3, 0);
      kneeJoint.add(lowerLeg);

      // 3 Claws
      for (let c = -1; c <= 1; c++) {
        const claw = new THREE.Mesh(clawGeo, cyanGlowMat);
        claw.position.set(c * 0.05, -0.6, 0.06);
        claw.rotation.x = Math.PI / 2.4;
        kneeJoint.add(claw);
      }

      return { root: limbRoot, knee: kneeJoint };
    };

    const forelimbL = createCyberLimb(true);
    const forelimbR = createCyberLimb(false);
    forelimbL.root.position.set(-0.4, -0.2, 0);
    forelimbR.root.position.set(0.4, -0.2, 0);
    bodySegments[6].group.add(forelimbL.root);
    bodySegments[6].group.add(forelimbR.root);

    const hindlimbL = createCyberLimb(true);
    const hindlimbR = createCyberLimb(false);
    hindlimbL.root.position.set(-0.35, -0.15, 0);
    hindlimbR.root.position.set(0.35, -0.15, 0);
    bodySegments[22].group.add(hindlimbL.root);
    bodySegments[22].group.add(hindlimbR.root);

    // 9c. Tail Whip Blades on the final segment
    const tailBladeGeo = new THREE.ConeGeometry(0.12, 1.3, 4);
    const tailBladeL = new THREE.Mesh(tailBladeGeo, metallicSilverMat);
    tailBladeL.position.set(-0.16, 0, 0.45);
    tailBladeL.rotation.x = Math.PI / 2;
    tailBladeL.rotation.z = Math.PI / 5;
    bodySegments[segmentCount - 1].group.add(tailBladeL);

    const tailBladeR = new THREE.Mesh(tailBladeGeo, metallicSilverMat);
    tailBladeR.position.set(0.16, 0, 0.45);
    tailBladeR.rotation.x = Math.PI / 2;
    tailBladeR.rotation.z = -Math.PI / 5;
    bodySegments[segmentCount - 1].group.add(tailBladeR);

    const tailStingerGeo = new THREE.ConeGeometry(0.08, 0.9, 4);
    const tailStinger = new THREE.Mesh(tailStingerGeo, cyanGlowMat);
    tailStinger.position.set(0, 0, 0.75);
    tailStinger.rotation.x = Math.PI / 2;
    bodySegments[segmentCount - 1].group.add(tailStinger);

    // 10. Procedural 3D Lightning Discharge Line (Fires when roaring at locked checkpoint)
    const lightningSegments = 16;
    const lightningPositions = new Float32Array((lightningSegments + 1) * 3);
    const lightningGeo = new THREE.BufferGeometry();
    lightningGeo.setAttribute('position', new THREE.BufferAttribute(lightningPositions, 3));
    const lightningMesh = new THREE.Line(lightningGeo, lightningMat);
    lightningMesh.visible = false;
    scene.add(lightningMesh);

    // 11. Animation Loop with Kinematic Traveling Waves
    const startTime = performance.now();
    let lastTime = startTime;

    const forwardVec = new THREE.Vector3(0, 0, 1);
    const tangentVec = new THREE.Vector3();
    const posVec = new THREE.Vector3();
    const quat = new THREE.Quaternion();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;
      const state = stateRef.current;

      // Smooth kinematic lerp
      const lerpFactor = Math.min(delta * 6.0, 1.0);
      state.currentHeadYaw += (state.targetHeadYaw - state.currentHeadYaw) * lerpFactor;
      state.currentHeadPitch += (state.targetHeadPitch - state.currentHeadPitch) * lerpFactor;
      state.currentJawOpen += (state.targetJawOpen - state.currentJawOpen) * lerpFactor;
      state.currentWingSpread += (state.targetWingSpread - state.currentWingSpread) * lerpFactor;
      state.currentMouthIntensity += (state.targetMouthIntensity - state.currentMouthIntensity) * lerpFactor;

      // Eye blinking timer
      state.blinkTimer += delta;
      if (state.blinkTimer > 3.5) {
        state.isBlinking = true;
        if (state.blinkTimer > 3.65) {
          state.blinkTimer = 0;
          state.isBlinking = false;
        }
      }

      // 1. Update Vertebrae Segments Along Continuous Traveling Wave
      bodySegments.forEach((seg, i) => {
        const s = seg.baseT;

        // Continuous traveling wave slither
        const waveSpeed = prefersReducedMotion ? 0.8 : 2.6;
        const waveFreq = 10.0;
        const wavePhase = elapsed * waveSpeed - s * waveFreq;

        // Amplitude grows toward the tail whip
        const ampLateral = 0.25 + s * 0.75;
        const ampVertical = 0.15 + s * 0.45;
        const waveX = Math.sin(wavePhase) * ampLateral;
        const waveY = Math.cos(wavePhase * 0.8) * ampVertical;
        const waveZ = Math.sin(wavePhase * 1.2) * (ampLateral * 0.4);

        // Sample base spline position
        spineCurve.getPointAt(s, posVec);
        spineCurve.getTangentAt(s, tangentVec);

        // Apply wave displacement
        seg.group.position.set(
          posVec.x + waveX,
          posVec.y + waveY,
          posVec.z + waveZ
        );

        // Align vertebra rotation to tangent vector
        quat.setFromUnitVectors(forwardVec, tangentVec);
        seg.group.quaternion.copy(quat);

        // Traveling pulse of high-speed energy along dorsal spikes
        const energySpeed = prefersReducedMotion ? 1.0 : 4.5;
        const energyWave = Math.sin(elapsed * energySpeed - s * 18.0);
        const isPulseHigh = energyWave > 0.3;

        // Dynamic scale color & emissive glow
        if (state.dragonMood === 'roaring') {
          (seg.spikeMesh.material as THREE.MeshBasicMaterial).color.set('#ff1f43');
          (seg.armorRing.material as THREE.MeshBasicMaterial).color.set('#ff1f43');
        } else if (state.dragonMood === 'celebrating') {
          (seg.spikeMesh.material as THREE.MeshBasicMaterial).color.set('#00f0ff');
          (seg.armorRing.material as THREE.MeshBasicMaterial).color.set('#00f0ff');
        } else {
          // Checkpoint 01 region (first 10 segments) pulses bright cyan
          if (i < 10) {
            (seg.spikeMesh.material as THREE.MeshBasicMaterial).color.set(
              isPulseHigh ? '#ffffff' : '#00f0ff'
            );
            (seg.armorRing.material as THREE.MeshBasicMaterial).color.set('#00f0ff');
          } else {
            (seg.spikeMesh.material as THREE.MeshBasicMaterial).color.set(
              isPulseHigh ? '#00f0ff' : '#ff1f43'
            );
            (seg.armorRing.material as THREE.MeshBasicMaterial).color.set(
              isPulseHigh ? '#ff1f43' : '#440a14'
            );
          }
        }
      });

      // 2. Update Dragon Head (Positioned at spline start near CP 01)
      spineCurve.getPointAt(0, posVec);
      spineCurve.getTangentAt(0, tangentVec);

      // Subtle breathing head bobbing
      const breathBob = Math.sin(elapsed * 1.6) * 0.08;
      headGroup.position.set(posVec.x, posVec.y + breathBob, posVec.z + 0.1);

      // Head orientation: base tangent + dynamic gaze yaw/pitch + ambient scanning
      quat.setFromUnitVectors(forwardVec, tangentVec);
      headGroup.quaternion.copy(quat);

      const idleScanYaw = state.dragonMood === 'idle' ? Math.sin(elapsed * 0.5) * 0.16 : 0;
      const idleScanPitch = state.dragonMood === 'idle' ? Math.sin(elapsed * 0.35) * 0.08 : 0;
      headGroup.rotateY(state.currentHeadYaw + idleScanYaw);
      headGroup.rotateX(state.currentHeadPitch + idleScanPitch);

      // Lower Jaw breathing / roaring rotation
      const idleBreathJaw = Math.sin(elapsed * 1.6) * 0.03;
      jawPivot.rotation.x = state.currentJawOpen + idleBreathJaw;

      // Visor Eye Glow & Blinking
      const eyeScaleY = state.isBlinking ? 0.05 : 1.0;
      eyeMeshL.scale.set(1, eyeScaleY, 1);
      eyeMeshR.scale.set(1, eyeScaleY, 1);

      if (state.dragonMood === 'roaring') {
        eyeGlowMat.color.set('#ff1f43');
      } else if (state.dragonMood === 'celebrating') {
        eyeGlowMat.color.set('#ffd700');
      } else {
        eyeGlowMat.color.set('#00f0ff');
      }

      // Mouth Light & Plasma Emitter
      mouthPointLight.position.set(
        headGroup.position.x,
        headGroup.position.y - 0.1,
        headGroup.position.z + 0.4
      );
      mouthPointLight.intensity = state.currentMouthIntensity;
      mouthPointLight.color.set(
        state.dragonMood === 'roaring' ? 0xff1f43 : 0x00f0ff
      );

      // 3. Update Articulated Cyber-Wings (Mounted at Vertebra 4)
      if (bodySegments[4]) {
        const chestPos = bodySegments[4].group.position;
        const chestQuat = bodySegments[4].group.quaternion;
        wingsGroup.position.copy(chestPos);
        wingsGroup.quaternion.copy(chestQuat);

        // Flapping kinematics: continuous majestic wave with aero-elastic phase lag
        const flapRate = prefersReducedMotion ? 0.8 : 2.2;
        const baseFlap = Math.sin(elapsed * flapRate) * 0.38 + state.currentWingSpread;
        const wristLag = Math.sin(elapsed * flapRate - 0.4) * 0.28 + state.currentWingSpread * 0.5;

        wingPivotL.rotation.z = -baseFlap;
        wingWristL.rotation.z = -wristLag;

        wingPivotR.rotation.z = baseFlap;
        wingWristR.rotation.z = wristLag;
      }

      // 3b. Update Cyber Limbs Flexion
      const limbWave = Math.sin(elapsed * 2.2) * 0.12;
      forelimbL.knee.rotation.z = limbWave;
      forelimbR.knee.rotation.z = -limbWave;
      hindlimbL.knee.rotation.z = -limbWave;
      hindlimbL.knee.rotation.z = limbWave;

      // 4. Update Roar Lightning Strike
      if (state.lightningTimer > 0 && state.lightningTarget) {
        state.lightningTimer -= delta;
        lightningMesh.visible = true;

        const startPt = mouthPointLight.position;
        const endPt = state.lightningTarget;
        const posAttr = lightningGeo.getAttribute('position') as THREE.BufferAttribute;

        for (let j = 0; j <= lightningSegments; j++) {
          const frac = j / lightningSegments;
          const jitterX = (Math.random() - 0.5) * 0.45 * Math.sin(frac * Math.PI);
          const jitterY = (Math.random() - 0.5) * 0.45 * Math.sin(frac * Math.PI);
          const jitterZ = (Math.random() - 0.5) * 0.45 * Math.sin(frac * Math.PI);

          posAttr.setXYZ(
            j,
            startPt.x + (endPt.x - startPt.x) * frac + jitterX,
            startPt.y + (endPt.y - startPt.y) * frac + jitterY,
            startPt.z + (endPt.z - startPt.z) * frac + jitterZ
          );
        }
        posAttr.needsUpdate = true;
      } else {
        lightningMesh.visible = false;
      }

      // 5. Update Floating Ambient Cyber-Embers
      const positions = emberGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let e = 0; e < emberCount; e++) {
        let ey = positions.getY(e) + emberVelocities[e].y;
        let ex = positions.getX(e) + emberVelocities[e].x;
        if (ey > 8) {
          ey = -8;
          ex = (Math.random() - 0.5) * 24;
        }
        positions.setY(e, ey);
        positions.setX(e, ex);
      }
      positions.needsUpdate = true;

      // 6. Active Checkpoint 01 Light Pulse
      activeSignalBeacon.intensity = 2.4 + Math.sin(elapsed * 4.0) * 0.8;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1024;
      const h = container.clientHeight || 682;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup resources
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
      baseCylinderGeo.dispose();
      baseSpikeGeo.dispose();
      baseTorusGeo.dispose();
      craniumGeo.dispose();
      browGeo.dispose();
      eyeGeo.dispose();
      jawGeo.dispose();
      fangGeo.dispose();
      strutGeo.dispose();
      wingGeoL.dispose();
      wingGeoR.dispose();
      legGeoUpper.dispose();
      legGeoLower.dispose();
      clawGeo.dispose();
      tailBladeGeo.dispose();
      tailStingerGeo.dispose();
      gridHelper.dispose();
      emberGeo.dispose();
      lightningGeo.dispose();
      obsidianArmorMat.dispose();
      metallicSilverMat.dispose();
      cyanGlowMat.dispose();
      redGlowMat.dispose();
      eyeGlowMat.dispose();
      wingMembraneMat.dispose();
      emberMat.dispose();
      lightningMat.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
};
