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

  // Mutable animation state
  const stateRef = useRef({
    dragonMood,
    targetCheckpointId,
    hoveredCheckpointId,
    // Head kinematics targets
    targetHeadYaw: 0.35, // Default ~20 deg three-quarter perspective facing viewer
    targetHeadPitch: -0.15,
    targetJawOpen: 0.05,
    targetWingSpread: 0,
    targetMouthIntensity: 0.4,
    // Interpolated kinematics
    currentHeadYaw: 0.35,
    currentHeadPitch: -0.15,
    currentJawOpen: 0.05,
    currentWingSpread: 0,
    currentMouthIntensity: 0.4,
    // Blinking
    blinkTimer: 0,
    isBlinking: false,
    // Lightning strike duration
    lightningTimer: 0,
    lightningTarget: null as THREE.Vector3 | null,
  });

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
        stateRef.current.lightningTimer = 0.85;

        // Calculate aim angles from head position toward target checkpoint
        const headBasePos = screenTo3D(340, 140, 2.2);
        const dx = targetPos.x - headBasePos.x;
        const dy = targetPos.y - headBasePos.y;
        stateRef.current.targetHeadYaw = Math.atan2(dx, 6) * 0.8;
        stateRef.current.targetHeadPitch = -Math.atan2(dy, 6) * 0.6;
      }
      stateRef.current.targetJawOpen = 0.75; // Roar snarl open jaw
      stateRef.current.targetWingSpread = 0.55; // Spread wings in threat posture
      stateRef.current.targetMouthIntensity = 4.0;
    } else if (dragonMood === 'celebrating') {
      stateRef.current.targetHeadYaw = 0.2;
      stateRef.current.targetHeadPitch = -0.3; // Majestic bow
      stateRef.current.targetJawOpen = 0.25;
      stateRef.current.targetWingSpread = 0.45;
      stateRef.current.targetMouthIntensity = 2.5;
      stateRef.current.lightningTarget = null;
    } else {
      // Idle: commanding three-quarter side profile facing slightly left toward viewer
      stateRef.current.targetHeadYaw = 0.35;
      stateRef.current.targetHeadPitch = -0.15;
      stateRef.current.targetJawOpen = 0.05;
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

    // =========================================================================
    // 1. SCENE, CAMERA (THREE-QUARTER SIDE PERSPECTIVE), & WEBGL RENDERER
    // =========================================================================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010206, 0.026);

    const width = container.clientWidth || 1024;
    const height = container.clientHeight || 682;

    // Three-quarter side perspective camera: positioned slightly to the left & elevated
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(-1.2, 0.7, 17.5);
    camera.lookAt(0.5, -0.3, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // =========================================================================
    // 2. CINEMATIC LIGHTING ARCHITECTURE (CYAN KEY, CRIMSON RIM, MOUTH PLASMA)
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0x081329, 2.2);
    scene.add(ambientLight);

    // Neon cyan key light (upper-left foreground)
    const keyCyanLight = new THREE.DirectionalLight(0x00f0ff, 3.8);
    keyCyanLight.position.set(-7, 8, 9);
    scene.add(keyCyanLight);

    // Crimson rim light (lower-right rear, creating metallic edge definition)
    const rimRedLight = new THREE.DirectionalLight(0xff1f43, 3.0);
    rimRedLight.position.set(9, -6, -4);
    scene.add(rimRedLight);

    // Overhead cool white fill light
    const overheadLight = new THREE.DirectionalLight(0xbad7ff, 1.2);
    overheadLight.position.set(0, 10, 2);
    scene.add(overheadLight);

    // Active Checkpoint 01 Signal Beacon
    const activeBeacon = new THREE.PointLight(0x00f0ff, 3.2, 8);
    const cp1Pos = screenTo3D(274, 194, 1.0);
    activeBeacon.position.copy(cp1Pos);
    scene.add(activeBeacon);

    // Dynamic mouth plasma point light
    const mouthLight = new THREE.PointLight(0xff1f43, 0, 7);
    scene.add(mouthLight);

    // =========================================================================
    // 3. PBR MATERIALS FOR A SOLID, RECOGNIZABLE CYBER-DRAGON
    // =========================================================================
    const obsidianArmorMat = new THREE.MeshStandardMaterial({
      color: 0x070c18,
      metalness: 0.88,
      roughness: 0.22,
      emissive: 0x00142b,
      emissiveIntensity: 0.35,
    });

    const chromeSilverMat = new THREE.MeshStandardMaterial({
      color: 0x9cb0cc,
      metalness: 0.95,
      roughness: 0.16,
    });

    const ventralBellyMat = new THREE.MeshStandardMaterial({
      color: 0x162238,
      metalness: 0.72,
      roughness: 0.32,
    });

    const eyeCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const eyeRedMat = new THREE.MeshBasicMaterial({ color: 0xff1f43 });
    const eyeGoldMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });

    const scaleGlowCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const scaleGlowRedMat = new THREE.MeshBasicMaterial({ color: 0xff1f43 });

    const wingMembraneMat = new THREE.MeshStandardMaterial({
      color: 0x051329,
      emissive: 0x002c5c,
      emissiveIntensity: 0.55,
      metalness: 0.35,
      roughness: 0.38,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
    });

    const lightningMat = new THREE.LineBasicMaterial({
      color: 0xff1f43,
      linewidth: 3,
    });

    // =========================================================================
    // 4. BACKGROUND SPATIAL DEPTH: CYBER MONOLITHS & GRID
    // =========================================================================
    const backgroundGroup = new THREE.Group();
    scene.add(backgroundGroup);

    // Distant cyber grid floor
    const gridFloor = new THREE.GridHelper(56, 28, 0x00f0ff, 0x061530);
    gridFloor.position.set(0, -9.5, -4);
    gridFloor.rotation.x = Math.PI / 14;
    backgroundGroup.add(gridFloor);

    // Hexagonal dark obsidian monoliths under checkpoints
    const monolithCoords = [
      screenTo3D(274, 194, -2.0),
      screenTo3D(562, 108, -2.4),
      screenTo3D(872, 202, -2.1),
      screenTo3D(586, 254, -1.8),
      screenTo3D(394, 354, -2.0),
      screenTo3D(855, 380, -2.5),
      screenTo3D(463, 482, -1.9),
      screenTo3D(770, 538, -2.2),
    ];

    monolithCoords.forEach((pos, idx) => {
      const height = 4.2 + (idx % 3) * 1.2;
      const radius = 1.1 + (idx % 2) * 0.3;
      const spireMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.6, radius, height, 6),
        obsidianArmorMat
      );
      spireMesh.position.set(pos.x, pos.y - height / 2, pos.z);
      spireMesh.rotation.y = (idx * Math.PI) / 3;
      backgroundGroup.add(spireMesh);

      // Top neon ring
      const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.62, 0.035, 8, 6),
        idx === 0 ? scaleGlowCyanMat : scaleGlowRedMat
      );
      ringMesh.position.set(pos.x, pos.y, pos.z);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.rotation.z = (idx * Math.PI) / 3;
      backgroundGroup.add(ringMesh);
    });

    // Drifting cyber embers
    const emberCount = 80;
    const emberPositions = new Float32Array(emberCount * 3);
    const emberVelocities: Array<{ x: number; y: number; z: number }> = [];

    for (let i = 0; i < emberCount; i++) {
      emberPositions[i * 3] = (Math.random() - 0.5) * 26;
      emberPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 7;
      emberVelocities.push({
        x: (Math.random() - 0.5) * 0.018,
        y: Math.random() * 0.025 + 0.01,
        z: (Math.random() - 0.5) * 0.018,
      });
    }

    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const emberPoints = new THREE.Points(emberGeo, emberMat);
    scene.add(emberPoints);

    // =========================================================================
    // 5. THE CONTINUOUS SERPENTINE 3D PATH THROUGH ALL 8 CHECKPOINTS
    // =========================================================================
    const dragonPathPoints = [
      screenTo3D(340, 140, 2.2), // 0. Head attachment at Neck base
      screenTo3D(305, 170, 1.6), // 1. Upper Neck
      screenTo3D(274, 194, 1.0), // 2. CP 01 (THE SIGNAL - OPEN NOW - Shoulders & Wings)
      screenTo3D(340, 205, 0.7), // 3. Chest
      screenTo3D(440, 175, 0.3), // 4. Rising curve
      screenTo3D(515, 130, 0.0), // 5. Upper ascent
      screenTo3D(562, 108, -0.2), // 6. CP 02
      screenTo3D(655, 118, -0.1), // 7.
      screenTo3D(760, 148, 0.1), // 8.
      screenTo3D(835, 180, 0.3), // 9.
      screenTo3D(872, 202, 0.4), // 10. CP 03
      screenTo3D(835, 240, 0.55), // 11. Loop back
      screenTo3D(730, 252, 0.75), // 12.
      screenTo3D(640, 254, 0.85), // 13.
      screenTo3D(586, 254, 0.9), // 14. CP 04 (Center Spire)
      screenTo3D(490, 285, 0.75), // 15.
      screenTo3D(435, 325, 0.55), // 16.
      screenTo3D(394, 354, 0.45), // 17. CP 05
      screenTo3D(465, 380, 0.25), // 18.
      screenTo3D(585, 385, 0.05), // 19.
      screenTo3D(710, 380, -0.1), // 20.
      screenTo3D(810, 378, -0.15), // 21.
      screenTo3D(855, 380, -0.2), // 22. CP 06
      screenTo3D(865, 425, 0.1), // 23.
      screenTo3D(805, 465, 0.35), // 24.
      screenTo3D(695, 482, 0.55), // 25.
      screenTo3D(570, 485, 0.65), // 26.
      screenTo3D(463, 482, 0.7), // 27. CP 07
      screenTo3D(545, 510, 0.45), // 28.
      screenTo3D(660, 532, 0.2), // 29.
      screenTo3D(770, 538, 0.0), // 30. CP 08
      screenTo3D(860, 545, -0.25), // 31.
      screenTo3D(925, 515, -0.6), // 32.
      screenTo3D(955, 445, -1.0), // 33.
      screenTo3D(950, 370, -1.4), // 34. Tail Tip curling upward gracefully
    ];

    const baseSplineCurve = new THREE.CatmullRomCurve3(dragonPathPoints, false, 'catmullrom', 0.5);

    // =========================================================================
    // 6. ONE CONTINUOUS, SEAMLESS, TAPERING 3D DRAGON BODY MESH
    // =========================================================================
    const tubularSegments = 56;
    const radialSegments = 14;

    // Body radius tapering function from neck -> broad chest -> torso -> sharp tail whip
    const getDragonRadius = (t: number): number => {
      if (t < 0.06) {
        return 0.7 + t * 4.0; // 0.7 -> 0.94 (Muscular neck expanding to shoulders)
      } else if (t < 0.18) {
        return 1.15 - (t - 0.06) * 1.2; // 1.15 -> 1.0 (Broad chest & ribcage)
      } else if (t < 0.55) {
        return 1.0 - (t - 0.18) * 0.8; // 1.0 -> 0.7 (Muscular winding serpent body)
      } else if (t < 0.85) {
        return 0.7 - (t - 0.55) * 1.1; // 0.7 -> 0.37 (Smooth mid-body taper)
      } else {
        return Math.max(0.06, 0.37 - (t - 0.85) * 2.0); // 0.37 -> 0.07 (Razor sharp whip tail)
      }
    };

    // Build the continuous TubeGeometry
    const dragonBodyGeo = new THREE.TubeGeometry(baseSplineCurve, tubularSegments, 1.0, radialSegments, false);
    const bodyMesh = new THREE.Mesh(dragonBodyGeo, obsidianArmorMat);
    scene.add(bodyMesh);

    // Initial shape deformation: scale each cross-section by its tapering radius & oval muscular profile
    const basePositions = dragonBodyGeo.attributes.position.clone();
    const posAttr = dragonBodyGeo.attributes.position;

    const deformTaperedTube = (curve: THREE.CatmullRomCurve3) => {
      const center = new THREE.Vector3();
      for (let i = 0; i <= tubularSegments; i++) {
        const t = i / tubularSegments;
        const radius = getDragonRadius(t);
        curve.getPointAt(t, center);

        for (let j = 0; j <= radialSegments; j++) {
          const idx = i * (radialSegments + 1) + j;
          const bx = basePositions.getX(idx);
          const by = basePositions.getY(idx);
          const bz = basePositions.getZ(idx);

          // Apply radius + slight lateral compression for muscular dragon teardrop cross-section
          posAttr.setXYZ(
            idx,
            center.x + (bx - center.x) * radius * 0.88,
            center.y + (by - center.y) * radius * 1.12,
            center.z + (bz - center.z) * radius
          );
        }
      }
      posAttr.needsUpdate = true;
      dragonBodyGeo.computeVertexNormals();
    };

    deformTaperedTube(baseSplineCurve);

    // =========================================================================
    // 7. ARMORED DORSAL SPINE PLATES (CONTINUOUS DRAGON BACK SCALES)
    // =========================================================================
    const scaleCount = 34;
    const dorsalScales: Array<{
      mesh: THREE.Mesh;
      baseT: number;
    }> = [];

    const scaleBaseGeo = new THREE.ConeGeometry(0.18, 0.85, 4);
    scaleBaseGeo.rotateX(-Math.PI / 5);

    for (let s = 0; s < scaleCount; s++) {
      const t = s / (scaleCount - 1);
      const isChest = t < 0.25;
      const scaleMat = isChest ? scaleGlowCyanMat : scaleGlowRedMat;

      const scaleMesh = new THREE.Mesh(scaleBaseGeo, scaleMat);
      const radius = getDragonRadius(t);
      const scaleSize = Math.max(0.2, radius * 0.95);
      scaleMesh.scale.set(scaleSize, scaleSize * 1.2, scaleSize);
      scene.add(scaleMesh);

      dorsalScales.push({ mesh: scaleMesh, baseT: t });
    }

    // =========================================================================
    // 8. FULLY SCULPTED, LARGE, PROMINENT 3D CYBER-DRAGON HEAD
    // =========================================================================
    const dragonHeadRoot = new THREE.Group();
    scene.add(dragonHeadRoot);

    // Scale the head prominently so it is immediately commanding and recognizable
    dragonHeadRoot.scale.set(1.9, 1.9, 1.9);

    // --- Upper Cranium & Snout ---
    const craniumGroup = new THREE.Group();
    dragonHeadRoot.add(craniumGroup);

    // Tapered Muzzle / Snout Box
    const muzzleGeo = new THREE.BoxGeometry(0.55, 0.35, 1.2);
    const muzzleMesh = new THREE.Mesh(muzzleGeo, obsidianArmorMat);
    muzzleMesh.position.set(0, 0.08, 0.55);
    craniumGroup.add(muzzleMesh);

    // Snout Nose Tip Plate
    const noseTipGeo = new THREE.ConeGeometry(0.3, 0.4, 4);
    const noseTip = new THREE.Mesh(noseTipGeo, obsidianArmorMat);
    noseTip.rotation.x = Math.PI / 2;
    noseTip.position.set(0, 0.06, 1.2);
    craniumGroup.add(noseTip);

    // Brow Armor Visor Shield
    const browGeo = new THREE.BoxGeometry(0.72, 0.16, 0.45);
    const browMesh = new THREE.Mesh(browGeo, chromeSilverMat);
    browMesh.position.set(0, 0.24, 0.35);
    craniumGroup.add(browMesh);

    // Crown Plate (Back of skull)
    const crownGeo = new THREE.BoxGeometry(0.68, 0.4, 0.6);
    const crownMesh = new THREE.Mesh(crownGeo, obsidianArmorMat);
    crownMesh.position.set(0, 0.18, 0.0);
    craniumGroup.add(crownMesh);

    // --- Swept-Back Primary Cyber Horns ---
    const hornCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.25, 0.3, 0.1),
      new THREE.Vector3(-0.6, 0.85, -0.3),
      new THREE.Vector3(-0.95, 1.35, -0.85),
    ]);
    const hornMeshL = new THREE.Mesh(
      new THREE.TubeGeometry(hornCurveL, 14, 0.08, 6, false),
      chromeSilverMat
    );
    craniumGroup.add(hornMeshL);

    const hornCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.25, 0.3, 0.1),
      new THREE.Vector3(0.6, 0.85, -0.3),
      new THREE.Vector3(0.95, 1.35, -0.85),
    ]);
    const hornMeshR = new THREE.Mesh(
      new THREE.TubeGeometry(hornCurveR, 14, 0.08, 6, false),
      chromeSilverMat
    );
    craniumGroup.add(hornMeshR);

    // Secondary Cheek Horns
    const cheekHornGeo = new THREE.ConeGeometry(0.06, 0.6, 4);
    const cheekHornL = new THREE.Mesh(cheekHornGeo, chromeSilverMat);
    cheekHornL.position.set(-0.38, -0.05, 0.2);
    cheekHornL.rotation.z = Math.PI / 2.8;
    cheekHornL.rotation.x = -Math.PI / 6;
    craniumGroup.add(cheekHornL);

    const cheekHornR = new THREE.Mesh(cheekHornGeo, chromeSilverMat);
    cheekHornR.position.set(0.38, -0.05, 0.2);
    cheekHornR.rotation.z = -Math.PI / 2.8;
    cheekHornR.rotation.x = -Math.PI / 6;
    craniumGroup.add(cheekHornR);

    // --- Deep-Set Glowing Cyber Eyes ---
    const eyeGeo = new THREE.BoxGeometry(0.18, 0.06, 0.09);
    const eyeMeshL = new THREE.Mesh(eyeGeo, eyeCyanMat);
    eyeMeshL.position.set(-0.26, 0.2, 0.5);
    eyeMeshL.rotation.y = -Math.PI / 6.5;
    craniumGroup.add(eyeMeshL);

    const eyeMeshR = new THREE.Mesh(eyeGeo, eyeCyanMat);
    eyeMeshR.position.set(0.26, 0.2, 0.5);
    eyeMeshR.rotation.y = Math.PI / 6.5;
    craniumGroup.add(eyeMeshR);

    // --- Articulated Lower Jaw & Fangs ---
    const jawPivot = new THREE.Group();
    jawPivot.position.set(0, -0.04, 0.15);
    craniumGroup.add(jawPivot);

    const jawGeo = new THREE.BoxGeometry(0.48, 0.16, 1.1);
    const jawMesh = new THREE.Mesh(jawGeo, obsidianArmorMat);
    jawMesh.position.set(0, -0.06, 0.5);
    jawPivot.add(jawMesh);

    // Upper and Lower Razor Fangs
    const fangGeo = new THREE.ConeGeometry(0.035, 0.16, 4);
    for (let f = -1; f <= 1; f += 2) {
      // Upper fangs
      const uFang = new THREE.Mesh(fangGeo, chromeSilverMat);
      uFang.position.set(f * 0.22, -0.08, 0.75);
      uFang.rotation.x = Math.PI;
      craniumGroup.add(uFang);

      // Lower fangs
      const lFang = new THREE.Mesh(fangGeo, chromeSilverMat);
      lFang.position.set(f * 0.18, 0.06, 0.85);
      jawPivot.add(lFang);
    }

    // Throat Plasma Reactor Core
    const throatCore = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), scaleGlowRedMat);
    throatCore.position.set(0, 0.02, 0.2);
    jawPivot.add(throatCore);

    // =========================================================================
    // 9. DUAL ARTICULATED CYBER-WINGS (MOUNTED AT CHEST/SHOULDERS)
    // =========================================================================
    const wingsGroup = new THREE.Group();
    scene.add(wingsGroup);

    // Left Wing
    const wingPivotL = new THREE.Group();
    wingPivotL.position.set(-0.6, 0.4, 0);
    wingsGroup.add(wingPivotL);

    const boneL1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.09, 1.6, 5),
      chromeSilverMat
    );
    boneL1.position.set(-0.7, 0.55, 0);
    boneL1.rotation.z = Math.PI / 3;
    wingPivotL.add(boneL1);

    const wingWristL = new THREE.Group();
    wingWristL.position.set(-1.4, 1.1, 0);
    wingPivotL.add(wingWristL);

    const strutGeo = new THREE.CylinderGeometry(0.03, 0.05, 2.1, 4);
    const strutL1 = new THREE.Mesh(strutGeo, chromeSilverMat);
    strutL1.position.set(-0.8, -0.7, 0.1);
    strutL1.rotation.z = -Math.PI / 5;
    wingWristL.add(strutL1);

    const strutL2 = new THREE.Mesh(strutGeo, chromeSilverMat);
    strutL2.position.set(-1.1, -0.4, -0.1);
    strutL2.rotation.z = -Math.PI / 3.4;
    wingWristL.add(strutL2);

    const wingGeoL = new THREE.BufferGeometry();
    const verticesL = new Float32Array([
      0, 0, 0,
      -1.4, 1.1, 0,
      -2.1, -0.7, 0,
      0, 0, 0,
      -2.1, -0.7, 0,
      -1.1, -1.4, 0,
    ]);
    wingGeoL.setAttribute('position', new THREE.BufferAttribute(verticesL, 3));
    wingGeoL.computeVertexNormals();
    const membraneL = new THREE.Mesh(wingGeoL, wingMembraneMat);
    wingPivotL.add(membraneL);

    // Right Wing
    const wingPivotR = new THREE.Group();
    wingPivotR.position.set(0.6, 0.4, 0);
    wingsGroup.add(wingPivotR);

    const boneR1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.09, 1.6, 5),
      chromeSilverMat
    );
    boneR1.position.set(0.7, 0.55, 0);
    boneR1.rotation.z = -Math.PI / 3;
    wingPivotR.add(boneR1);

    const wingWristR = new THREE.Group();
    wingWristR.position.set(1.4, 1.1, 0);
    wingPivotR.add(wingWristR);

    const strutR1 = new THREE.Mesh(strutGeo, chromeSilverMat);
    strutR1.position.set(0.8, -0.7, 0.1);
    strutR1.rotation.z = Math.PI / 5;
    wingWristR.add(strutR1);

    const strutR2 = new THREE.Mesh(strutGeo, chromeSilverMat);
    strutR2.position.set(1.1, -0.4, -0.1);
    strutR2.rotation.z = Math.PI / 3.4;
    wingWristR.add(strutR2);

    const wingGeoR = new THREE.BufferGeometry();
    const verticesR = new Float32Array([
      0, 0, 0,
      1.4, 1.1, 0,
      2.1, -0.7, 0,
      0, 0, 0,
      2.1, -0.7, 0,
      1.1, -1.4, 0,
    ]);
    wingGeoR.setAttribute('position', new THREE.BufferAttribute(verticesR, 3));
    wingGeoR.computeVertexNormals();
    const membraneR = new THREE.Mesh(wingGeoR, wingMembraneMat);
    wingPivotR.add(membraneR);

    // =========================================================================
    // 10. CYBER TALONS & TAIL BLADE STINGER
    // =========================================================================
    // Forelimb Talons (under the chest)
    const legGeo = new THREE.CylinderGeometry(0.09, 0.14, 0.9, 5);
    const clawGeo = new THREE.ConeGeometry(0.04, 0.26, 4);

    const createLimb = (isLeft: boolean) => {
      const group = new THREE.Group();
      const arm = new THREE.Mesh(legGeo, obsidianArmorMat);
      arm.position.set(0, -0.4, 0);
      arm.rotation.z = isLeft ? -Math.PI / 4 : Math.PI / 4;
      group.add(arm);

      for (let c = -1; c <= 1; c++) {
        const claw = new THREE.Mesh(clawGeo, chromeSilverMat);
        claw.position.set(c * 0.08 + (isLeft ? -0.35 : 0.35), -0.75, 0.1);
        claw.rotation.x = Math.PI / 2.3;
        group.add(claw);
      }
      return group;
    };

    const forelimbL = createLimb(true);
    const forelimbR = createLimb(false);
    forelimbL.position.set(-0.8, -0.2, 0.2);
    forelimbR.position.set(0.8, -0.2, 0.2);
    wingsGroup.add(forelimbL);
    wingsGroup.add(forelimbR);

    // Tail Rudder Blades on the final vertebrae
    const tailBladeGeo = new THREE.ConeGeometry(0.16, 1.6, 4);
    const tailBladeL = new THREE.Mesh(tailBladeGeo, chromeSilverMat);
    tailBladeL.position.set(-0.2, 0, 0.5);
    tailBladeL.rotation.x = Math.PI / 2;
    tailBladeL.rotation.z = Math.PI / 5;
    scene.add(tailBladeL);

    const tailBladeR = new THREE.Mesh(tailBladeGeo, chromeSilverMat);
    tailBladeR.position.set(0.2, 0, 0.5);
    tailBladeR.rotation.x = Math.PI / 2;
    tailBladeR.rotation.z = -Math.PI / 5;
    scene.add(tailBladeR);

    // Tail Stinger
    const tailStinger = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 1.1, 4),
      scaleGlowCyanMat
    );
    tailStinger.position.set(0, 0, 0.9);
    tailStinger.rotation.x = Math.PI / 2;
    scene.add(tailStinger);

    // Procedural Lightning Strike Mesh
    const lightningSegments = 16;
    const lightningPositions = new Float32Array((lightningSegments + 1) * 3);
    const lightningGeo = new THREE.BufferGeometry();
    lightningGeo.setAttribute('position', new THREE.BufferAttribute(lightningPositions, 3));
    const lightningMesh = new THREE.Line(lightningGeo, lightningMat);
    lightningMesh.visible = false;
    scene.add(lightningMesh);

    // =========================================================================
    // 11. CONTINUOUS 60 FPS ANIMATION LOOP (COHERENT WAVES & HEAD DYNAMICS)
    // =========================================================================
    const startTime = performance.now();
    let lastTime = startTime;

    const forwardVec = new THREE.Vector3(0, 0, 1);
    const upVec = new THREE.Vector3(0, 1, 0);
    const tangentVec = new THREE.Vector3();
    const posVec = new THREE.Vector3();
    const normalVec = new THREE.Vector3();
    const quat = new THREE.Quaternion();

    // Reusable dynamic curve points for wave deformation
    const animatedPathPoints = dragonPathPoints.map((p) => p.clone());
    const dynamicSplineCurve = new THREE.CatmullRomCurve3(animatedPathPoints, false, 'catmullrom', 0.5);

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;
      const state = stateRef.current;

      // Smooth kinematic lerp for head and jaw
      const lerpFactor = Math.min(delta * 6.5, 1.0);
      state.currentHeadYaw += (state.targetHeadYaw - state.currentHeadYaw) * lerpFactor;
      state.currentHeadPitch += (state.targetHeadPitch - state.currentHeadPitch) * lerpFactor;
      state.currentJawOpen += (state.targetJawOpen - state.currentJawOpen) * lerpFactor;
      state.currentWingSpread += (state.targetWingSpread - state.currentWingSpread) * lerpFactor;
      state.currentMouthIntensity += (state.targetMouthIntensity - state.currentMouthIntensity) * lerpFactor;

      // Eye blinking
      state.blinkTimer += delta;
      if (state.blinkTimer > 3.4) {
        state.isBlinking = true;
        if (state.blinkTimer > 3.55) {
          state.blinkTimer = 0;
          state.isBlinking = false;
        }
      }

      // --- 1. Continuous Traveling Wave Across Spine Points ---
      const waveSpeed = prefersReducedMotion ? 0.7 : 2.4;
      for (let p = 0; p < dragonPathPoints.length; p++) {
        const frac = p / (dragonPathPoints.length - 1);
        const basePt = dragonPathPoints[p];

        // Amplitude intensifies naturally toward the whip tail
        const amp = frac * 0.55;
        const phase = elapsed * waveSpeed - frac * 8.5;

        const waveX = Math.sin(phase) * amp * 0.7;
        const waveY = Math.cos(phase * 0.9) * amp * 0.45;
        const waveZ = Math.sin(phase * 1.1) * amp * 0.5;

        animatedPathPoints[p].set(
          basePt.x + waveX,
          basePt.y + waveY,
          basePt.z + waveZ
        );
      }
      dynamicSplineCurve.points = animatedPathPoints;

      // Update continuous body mesh vertices along the flexing curve
      const center = new THREE.Vector3();
      for (let i = 0; i <= tubularSegments; i++) {
        const t = i / tubularSegments;
        const radius = getDragonRadius(t);
        dynamicSplineCurve.getPointAt(t, center);

        for (let j = 0; j <= radialSegments; j++) {
          const idx = i * (radialSegments + 1) + j;
          const bx = basePositions.getX(idx);
          const by = basePositions.getY(idx);
          const bz = basePositions.getZ(idx);

          posAttr.setXYZ(
            idx,
            center.x + (bx - center.x) * radius * 0.88,
            center.y + (by - center.y) * radius * 1.12,
            center.z + (bz - center.z) * radius
          );
        }
      }
      posAttr.needsUpdate = true;
      dragonBodyGeo.computeVertexNormals();

      // --- 2. Update Dorsal Scale Plates (Dragon Back Armor) ---
      dorsalScales.forEach((scale) => {
        const t = scale.baseT;
        dynamicSplineCurve.getPointAt(t, posVec);
        dynamicSplineCurve.getTangentAt(t, tangentVec);

        // Compute local normal on top of body
        normalVec.crossVectors(tangentVec, upVec).normalize();
        normalVec.crossVectors(normalVec, tangentVec).normalize();

        const radius = getDragonRadius(t);
        scale.mesh.position.set(
          posVec.x + normalVec.x * (radius * 0.85),
          posVec.y + normalVec.y * (radius * 0.85),
          posVec.z + normalVec.z * (radius * 0.85)
        );

        quat.setFromUnitVectors(upVec, normalVec);
        scale.mesh.quaternion.copy(quat);

        // High-speed energy pulse along dorsal scales
        const energyWave = Math.sin(elapsed * 4.0 - t * 16.0);
        if (state.dragonMood === 'roaring') {
          scale.mesh.material = scaleGlowRedMat;
        } else if (state.dragonMood === 'celebrating') {
          scale.mesh.material = scaleGlowCyanMat;
        } else {
          scale.mesh.material = t < 0.25 || energyWave > 0.4 ? scaleGlowCyanMat : scaleGlowRedMat;
        }
      });

      // --- 3. Update Sculpted Dragon Head (at t = 0) ---
      dynamicSplineCurve.getPointAt(0, posVec);
      dynamicSplineCurve.getTangentAt(0, tangentVec);

      // Subtle breathing bob
      const breathBob = Math.sin(elapsed * 1.5) * 0.06;
      dragonHeadRoot.position.set(posVec.x, posVec.y + breathBob, posVec.z + 0.15);

      // Base orientation along tangent + dynamic three-quarter gaze + ambient glances
      quat.setFromUnitVectors(forwardVec, tangentVec);
      dragonHeadRoot.quaternion.copy(quat);

      const idleScanYaw = state.dragonMood === 'idle' ? Math.sin(elapsed * 0.45) * 0.14 : 0;
      const idleScanPitch = state.dragonMood === 'idle' ? Math.sin(elapsed * 0.3) * 0.08 : 0;
      dragonHeadRoot.rotateY(state.currentHeadYaw + idleScanYaw);
      dragonHeadRoot.rotateX(state.currentHeadPitch + idleScanPitch);

      // Lower Jaw Breathing / Roaring
      const breathJaw = Math.sin(elapsed * 1.5) * 0.025;
      jawPivot.rotation.x = state.currentJawOpen + breathJaw;

      // Eyelid Blinking & Eye Color
      const eyeScaleY = state.isBlinking ? 0.06 : 1.0;
      eyeMeshL.scale.set(1, eyeScaleY, 1);
      eyeMeshR.scale.set(1, eyeScaleY, 1);

      if (state.dragonMood === 'roaring') {
        eyeMeshL.material = eyeRedMat;
        eyeMeshR.material = eyeRedMat;
      } else if (state.dragonMood === 'celebrating') {
        eyeMeshL.material = eyeGoldMat;
        eyeMeshR.material = eyeGoldMat;
      } else {
        eyeMeshL.material = eyeCyanMat;
        eyeMeshR.material = eyeCyanMat;
      }

      // Mouth plasma point light
      mouthLight.position.set(
        dragonHeadRoot.position.x,
        dragonHeadRoot.position.y - 0.15,
        dragonHeadRoot.position.z + 0.6
      );
      mouthLight.intensity = state.currentMouthIntensity;
      mouthLight.color.set(state.dragonMood === 'roaring' ? 0xff1f43 : 0x00f0ff);

      // --- 4. Update Cyber Wings (Mounted at Chest / t = 0.08) ---
      dynamicSplineCurve.getPointAt(0.08, posVec);
      dynamicSplineCurve.getTangentAt(0.08, tangentVec);
      wingsGroup.position.copy(posVec);
      quat.setFromUnitVectors(forwardVec, tangentVec);
      wingsGroup.quaternion.copy(quat);

      const flapSpeed = prefersReducedMotion ? 0.7 : 2.2;
      const baseFlap = Math.sin(elapsed * flapSpeed) * 0.36 + state.currentWingSpread;
      const wristLag = Math.sin(elapsed * flapSpeed - 0.38) * 0.26 + state.currentWingSpread * 0.5;

      wingPivotL.rotation.z = -baseFlap;
      wingWristL.rotation.z = -wristLag;

      wingPivotR.rotation.z = baseFlap;
      wingWristR.rotation.z = wristLag;

      // Forelimb subtle flexing
      const limbFlex = Math.sin(elapsed * 2.0) * 0.1;
      forelimbL.rotation.z = limbFlex;
      forelimbR.rotation.z = -limbFlex;

      // --- 5. Update Tail Blades & Stinger (at t = 1.0) ---
      dynamicSplineCurve.getPointAt(1.0, posVec);
      dynamicSplineCurve.getTangentAt(1.0, tangentVec);

      tailBladeL.position.set(posVec.x - 0.18, posVec.y, posVec.z + 0.35);
      tailBladeR.position.set(posVec.x + 0.18, posVec.y, posVec.z + 0.35);
      tailStinger.position.set(posVec.x, posVec.y, posVec.z + 0.7);

      quat.setFromUnitVectors(forwardVec, tangentVec);
      tailBladeL.quaternion.copy(quat);
      tailBladeR.quaternion.copy(quat);
      tailStinger.quaternion.copy(quat);

      // --- 6. Update Roar Lightning Discharge Arc ---
      if (state.lightningTimer > 0 && state.lightningTarget) {
        state.lightningTimer -= delta;
        lightningMesh.visible = true;

        const startPt = mouthLight.position;
        const endPt = state.lightningTarget;
        const linePosAttr = lightningGeo.getAttribute('position') as THREE.BufferAttribute;

        for (let j = 0; j <= lightningSegments; j++) {
          const frac = j / lightningSegments;
          const jitter = Math.sin(frac * Math.PI) * 0.4;
          const jx = (Math.random() - 0.5) * jitter;
          const jy = (Math.random() - 0.5) * jitter;
          const jz = (Math.random() - 0.5) * jitter;

          linePosAttr.setXYZ(
            j,
            startPt.x + (endPt.x - startPt.x) * frac + jx,
            startPt.y + (endPt.y - startPt.y) * frac + jy,
            startPt.z + (endPt.z - startPt.z) * frac + jz
          );
        }
        linePosAttr.needsUpdate = true;
      } else {
        lightningMesh.visible = false;
      }

      // --- 7. Update Floating Cyber Embers ---
      const emberPosAttr = emberGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let e = 0; e < emberCount; e++) {
        let ey = emberPosAttr.getY(e) + emberVelocities[e].y;
        let ex = emberPosAttr.getX(e) + emberVelocities[e].x;
        if (ey > 9) {
          ey = -9;
          ex = (Math.random() - 0.5) * 26;
        }
        emberPosAttr.setY(e, ey);
        emberPosAttr.setX(e, ex);
      }
      emberPosAttr.needsUpdate = true;

      // Active Checkpoint Pulse
      activeBeacon.intensity = 2.4 + Math.sin(elapsed * 4.0) * 0.8;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Resize Observer
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
      dragonBodyGeo.dispose();
      basePositions.dispose();
      scaleBaseGeo.dispose();
      muzzleGeo.dispose();
      noseTipGeo.dispose();
      browGeo.dispose();
      crownGeo.dispose();
      cheekHornGeo.dispose();
      eyeGeo.dispose();
      jawGeo.dispose();
      fangGeo.dispose();
      strutGeo.dispose();
      legGeo.dispose();
      clawGeo.dispose();
      tailBladeGeo.dispose();
      wingGeoL.dispose();
      wingGeoR.dispose();
      emberGeo.dispose();
      lightningGeo.dispose();
      gridFloor.dispose();
      obsidianArmorMat.dispose();
      chromeSilverMat.dispose();
      ventralBellyMat.dispose();
      eyeCyanMat.dispose();
      eyeRedMat.dispose();
      eyeGoldMat.dispose();
      scaleGlowCyanMat.dispose();
      scaleGlowRedMat.dispose();
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
