import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
    targetHeadYaw: 0,
    targetHeadPitch: 0,
    targetMouthIntensity: 0.3,
    // Interpolated kinematics
    currentHeadYaw: 0,
    currentHeadPitch: 0,
    currentMouthIntensity: 0.3,
    // Roar & lightning discharge
    lightningTimer: 0,
    lightningTarget: null as THREE.Vector3 | null,
    // Animation trigger
    lastTriggeredMood: '' as string,
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
        stateRef.current.lightningTimer = 0.95;

        // Calculate aim angles from dragon position toward target checkpoint
        const dragonBasePos = screenTo3D(360, 140, 1.4);
        const dx = targetPos.x - dragonBasePos.x;
        const dy = targetPos.y - dragonBasePos.y;
        stateRef.current.targetHeadYaw = Math.atan2(dx, 5) * 0.45;
        stateRef.current.targetHeadPitch = -Math.atan2(dy, 5) * 0.35;
      }
      stateRef.current.targetMouthIntensity = 5.0;
    } else if (dragonMood === 'celebrating') {
      stateRef.current.targetHeadYaw = -0.15;
      stateRef.current.targetHeadPitch = -0.22; // Majestic bow
      stateRef.current.targetMouthIntensity = 2.8;
      stateRef.current.lightningTarget = null;
    } else if (hoveredCheckpointId) {
      const hCp = checkpoints.find((c) => c.id === hoveredCheckpointId);
      if (hCp) {
        const targetPos = screenTo3D(hCp.coords.x, hCp.coords.y, 0);
        const dragonBasePos = screenTo3D(360, 140, 1.4);
        const dx = targetPos.x - dragonBasePos.x;
        const dy = targetPos.y - dragonBasePos.y;
        stateRef.current.targetHeadYaw = Math.atan2(dx, 8) * 0.25;
        stateRef.current.targetHeadPitch = -Math.atan2(dy, 8) * 0.2;
      }
      stateRef.current.targetMouthIntensity = 0.6;
      stateRef.current.lightningTarget = null;
    } else {
      // Idle: commanding three-quarter side profile facing slightly toward viewer
      stateRef.current.targetHeadYaw = 0;
      stateRef.current.targetHeadPitch = 0;
      stateRef.current.targetMouthIntensity = 0.35;
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
    scene.fog = new THREE.FogExp2(0x010206, 0.024);

    const width = container.clientWidth || 1024;
    const height = container.clientHeight || 682;

    // Three-quarter side perspective camera
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(-0.8, 0.6, 17.5);
    camera.lookAt(0.4, -0.2, 0);

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

    // =========================================================================
    // 2. CINEMATIC LIGHTING ARCHITECTURE (CYAN KEY, CRIMSON RIM, MOUTH PLASMA)
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0x081329, 2.4);
    scene.add(ambientLight);

    // Neon cyan key light (upper-left foreground, lighting chest & scales)
    const keyCyanLight = new THREE.DirectionalLight(0x00f0ff, 4.0);
    keyCyanLight.position.set(-8, 8, 9);
    scene.add(keyCyanLight);

    // Crimson rim light (lower-right rear, creating metallic edge definition)
    const rimRedLight = new THREE.DirectionalLight(0xff1f43, 3.5);
    rimRedLight.position.set(9, -6, -4);
    scene.add(rimRedLight);

    // Overhead cool white fill light
    const overheadLight = new THREE.DirectionalLight(0xbad7ff, 1.2);
    overheadLight.position.set(0, 10, 2);
    scene.add(overheadLight);

    // Active Checkpoint 01 Signal Beacon
    const activeBeacon = new THREE.PointLight(0x00f0ff, 3.5, 9);
    const cp1Pos = screenTo3D(274, 194, 1.0);
    activeBeacon.position.copy(cp1Pos);
    scene.add(activeBeacon);

    // Dynamic mouth plasma point light
    const mouthLight = new THREE.PointLight(0xff1f43, 0.4, 7);
    mouthLight.position.set(cp1Pos.x + 0.8, cp1Pos.y + 0.5, cp1Pos.z + 1.2);
    scene.add(mouthLight);

    // =========================================================================
    // 3. BESPOKE CYBERPUNK PBR MATERIALS (OBSIDIAN SCALES, CRIMSON GLOW HORNS)
    // =========================================================================
    const obsidianArmorMat = new THREE.MeshStandardMaterial({
      color: 0x060912,
      metalness: 0.94,
      roughness: 0.2,
      emissive: 0x010816,
      emissiveIntensity: 0.35,
    });

    const ventralBellyMat = new THREE.MeshStandardMaterial({
      color: 0x0c1524,
      metalness: 0.84,
      roughness: 0.3,
      emissive: 0x00142b,
      emissiveIntensity: 0.45,
    });

    const crimsonHornsMat = new THREE.MeshStandardMaterial({
      color: 0xff1f43,
      metalness: 0.25,
      roughness: 0.2,
      emissive: 0xff1f43,
      emissiveIntensity: 2.8,
    });

    const dragonEyesMat = new THREE.MeshBasicMaterial({
      color: 0xff002b,
    });

    const wingsMembraneMat = new THREE.MeshStandardMaterial({
      color: 0x050811,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x22050b,
      emissiveIntensity: 0.7,
      side: THREE.DoubleSide,
    });

    const scaleGlowCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const scaleGlowRedMat = new THREE.MeshBasicMaterial({ color: 0xff1f43 });

    const spineConduitMat = new THREE.MeshBasicMaterial({
      color: 0xff1f43,
      transparent: true,
      opacity: 0.85,
    });

    const lightningMat = new THREE.LineBasicMaterial({
      color: 0xff1f43,
      linewidth: 3,
    });

    // Helper to map GLB material slot to cyberpunk PBR material
    const getCyberMaterial = (matName: string): THREE.Material => {
      const lower = (matName || '').toLowerCase();
      if (lower.includes('eye')) return dragonEyesMat;
      if (lower.includes('claw') || lower.includes('horn')) return crimsonHornsMat;
      if (lower.includes('wing')) return wingsMembraneMat;
      if (lower.includes('belly')) return ventralBellyMat;
      return obsidianArmorMat;
    };

    // =========================================================================
    // 4. LOAD & RIG THE 3D DRAGON CHARACTER MODEL (GLTFLoader)
    // =========================================================================
    let mixer: THREE.AnimationMixer | null = null;
    let idleAction: THREE.AnimationAction | null = null;
    let roarAction: THREE.AnimationAction | null = null;
    let dragonModelRoot: THREE.Group | null = null;

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/assets/dragon_model.glb',
      (gltf) => {
        const model = gltf.scene;
        dragonModelRoot = model;

        // Traverse mesh nodes and apply cinematic cyberpunk PBR materials
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (Array.isArray(mesh.material)) {
              mesh.material = mesh.material.map((m) => getCyberMaterial(m.name));
            } else if (mesh.material) {
              mesh.material = getCyberMaterial(mesh.material.name);
            }
          }
        });

        // Position dragon commanding the top-left area near Checkpoint 01
        // Facing in a dramatic three-quarter side angle toward the path and viewer
        const dragonBasePos = screenTo3D(360, 140, 1.4);
        model.position.copy(dragonBasePos);
        model.scale.set(1.75, 1.75, 1.75);
        model.rotation.set(0.12, Math.PI * 0.74, -0.06);

        // Connect Three.js AnimationMixer with built-in skeletal animations
        mixer = new THREE.AnimationMixer(model);

        const idleClip = gltf.animations.find((a) => a.name === 'Idle') || gltf.animations[0];
        const roarClip =
          gltf.animations.find((a) => a.name.includes('Attack2')) ||
          gltf.animations.find((a) => a.name.includes('Attack')) ||
          gltf.animations[1];

        if (idleClip) {
          idleAction = mixer.clipAction(idleClip);
          idleAction.setLoop(THREE.LoopRepeat, Infinity);
          idleAction.play();
        }

        if (roarClip) {
          roarAction = mixer.clipAction(roarClip);
          roarAction.setLoop(THREE.LoopOnce, 1);
          roarAction.clampWhenFinished = true;
        }

        scene.add(model);
      },
      undefined,
      (err) => {
        console.error('Failed to load dragon_model.glb:', err);
      }
    );

    // =========================================================================
    // 5. BACKGROUND SPATIAL DEPTH: CYBER MONOLITHS & GRID
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
      const h = 4.2 + (idx % 3) * 1.2;
      const radius = 1.1 + (idx % 2) * 0.3;
      const spireMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.6, radius, h, 6),
        obsidianArmorMat
      );
      spireMesh.position.set(pos.x, pos.y - h / 2, pos.z);
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
    // 6. THE CONTINUOUS SERPENTINE 3D PATH THROUGH ALL 8 CHECKPOINTS
    // =========================================================================
    const dragonPathPoints = [
      screenTo3D(350, 145, 1.2), // Behind dragon's chest/neck
      screenTo3D(305, 175, 1.0), // Curving around Checkpoint 01
      screenTo3D(274, 194, 0.8), // Checkpoint 01 (THE SIGNAL)
      screenTo3D(340, 205, 0.6),
      screenTo3D(440, 175, 0.3),
      screenTo3D(515, 130, 0.1),
      screenTo3D(562, 108, -0.1), // Checkpoint 02
      screenTo3D(655, 118, 0.0),
      screenTo3D(760, 148, 0.2),
      screenTo3D(835, 180, 0.3),
      screenTo3D(872, 202, 0.4), // Checkpoint 03
      screenTo3D(835, 240, 0.5),
      screenTo3D(730, 252, 0.65),
      screenTo3D(640, 254, 0.75),
      screenTo3D(586, 254, 0.8), // Checkpoint 04
      screenTo3D(490, 285, 0.65),
      screenTo3D(435, 325, 0.5),
      screenTo3D(394, 354, 0.4), // Checkpoint 05
      screenTo3D(465, 380, 0.2),
      screenTo3D(585, 385, 0.05),
      screenTo3D(710, 380, -0.1),
      screenTo3D(810, 378, -0.15),
      screenTo3D(855, 380, -0.2), // Checkpoint 06
      screenTo3D(865, 425, 0.1),
      screenTo3D(805, 465, 0.3),
      screenTo3D(695, 482, 0.5),
      screenTo3D(570, 485, 0.6),
      screenTo3D(463, 482, 0.65), // Checkpoint 07
      screenTo3D(545, 510, 0.4),
      screenTo3D(660, 532, 0.2),
      screenTo3D(770, 538, 0.0), // Checkpoint 08
      screenTo3D(860, 545, -0.25),
      screenTo3D(925, 515, -0.6),
      screenTo3D(955, 445, -1.0),
      screenTo3D(950, 370, -1.4), // Tail tip curling upward gracefully
    ];

    const baseSplineCurve = new THREE.CatmullRomCurve3(dragonPathPoints, false, 'catmullrom', 0.5);

    // =========================================================================
    // 7. SMOOTH CONTINUOUS TAPERING 3D SERPENTINE BODY
    // =========================================================================
    const tubularSegments = 56;
    const radialSegments = 14;

    // Body radius tapering function from neck -> chest -> serpentine torso -> sharp tail whip
    const getDragonRadius = (t: number): number => {
      if (t < 0.08) {
        return 0.72 + t * 3.5; // Expanding from behind dragon chest
      } else if (t < 0.2) {
        return 1.0 - (t - 0.08) * 0.8;
      } else if (t < 0.6) {
        return 0.9 - (t - 0.2) * 0.65;
      } else if (t < 0.85) {
        return 0.64 - (t - 0.6) * 1.1;
      } else {
        return Math.max(0.06, 0.36 - (t - 0.85) * 2.0); // Razor sharp whip tail
      }
    };

    const dragonBodyGeo = new THREE.TubeGeometry(baseSplineCurve, tubularSegments, 1.0, radialSegments, false);
    const bodyMesh = new THREE.Mesh(dragonBodyGeo, obsidianArmorMat);
    scene.add(bodyMesh);

    // Initial shape deformation: muscular teardrop cross-section
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

    // Continuous illuminated dorsal spine conduit
    const spineConduitGeo = new THREE.TubeGeometry(baseSplineCurve, 48, 0.06, 6, false);
    const spineConduitMesh = new THREE.Mesh(spineConduitGeo, spineConduitMat);
    scene.add(spineConduitMesh);

    // =========================================================================
    // 8. AERODYNAMIC ILLUMINATED DORSAL SPINE PLATES ALONG RIDGE
    // =========================================================================
    const scaleCount = 30;
    const dorsalScales: Array<{
      mesh: THREE.Mesh;
      baseT: number;
    }> = [];

    // Sleek fin-shaped dorsal plate geometry (aerodynamic, not crude boxes)
    const plateShape = new THREE.Shape();
    plateShape.moveTo(0, 0);
    plateShape.lineTo(0.12, 0.35);
    plateShape.lineTo(0.0, 0.7);
    plateShape.lineTo(-0.12, 0.35);
    plateShape.closePath();

    const plateGeo = new THREE.ExtrudeGeometry(plateShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    plateGeo.center();

    for (let s = 0; s < scaleCount; s++) {
      const t = 0.04 + (s / (scaleCount - 1)) * 0.92;
      const isChest = t < 0.25;
      const scaleMat = isChest ? scaleGlowCyanMat : scaleGlowRedMat;

      const scaleMesh = new THREE.Mesh(plateGeo, scaleMat);
      const radius = getDragonRadius(t);
      const scaleSize = Math.max(0.2, radius * 0.85);
      scaleMesh.scale.set(scaleSize, scaleSize * 1.25, scaleSize);
      scene.add(scaleMesh);

      dorsalScales.push({ mesh: scaleMesh, baseT: t });
    }

    // Tail Stinger Blade at final vertebra
    const tailStingerGeo = new THREE.ConeGeometry(0.12, 1.4, 4);
    const tailStinger = new THREE.Mesh(tailStingerGeo, scaleGlowRedMat);
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
    // 9. CONTINUOUS 60 FPS ANIMATION LOOP (SKELETAL DYNAMICS & TRAVELING WAVE)
    // =========================================================================
    const clock = new THREE.Clock();
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

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const state = stateRef.current;

      // --- 1. Skeletal Character Animation Update ---
      if (mixer) {
        // Handle mood transitions
        if (state.dragonMood !== state.lastTriggeredMood) {
          state.lastTriggeredMood = state.dragonMood;

          if (state.dragonMood === 'roaring' && roarAction && idleAction) {
            roarAction.reset();
            roarAction.fadeIn(0.2);
            roarAction.play();
            idleAction.fadeOut(0.2);
          } else if (state.dragonMood === 'idle' && idleAction && roarAction) {
            idleAction.reset();
            idleAction.fadeIn(0.3);
            idleAction.play();
            roarAction.fadeOut(0.3);
          }
        }

        mixer.update(delta);
      }

      // Smooth kinematic lerp for head/mouth intensity
      const lerpFactor = Math.min(delta * 6.0, 1.0);
      state.currentHeadYaw += (state.targetHeadYaw - state.currentHeadYaw) * lerpFactor;
      state.currentHeadPitch += (state.targetHeadPitch - state.currentHeadPitch) * lerpFactor;
      state.currentMouthIntensity += (state.targetMouthIntensity - state.currentMouthIntensity) * lerpFactor;

      // Adjust 3D dragon model orientation to look toward target/cursor
      if (dragonModelRoot) {
        const baseDragonPos = screenTo3D(360, 140, 1.4);
        const breathBob = Math.sin(elapsed * 1.6) * 0.08;
        dragonModelRoot.position.set(baseDragonPos.x, baseDragonPos.y + breathBob, baseDragonPos.z);

        // Three-quarter side angle + dynamic tracking
        dragonModelRoot.rotation.set(
          0.12 + state.currentHeadPitch,
          Math.PI * 0.74 + state.currentHeadYaw,
          -0.06
        );

        // Update mouth point light to follow dragon's head/snout
        mouthLight.position.set(
          dragonModelRoot.position.x + 0.6,
          dragonModelRoot.position.y + 0.35,
          dragonModelRoot.position.z + 0.9
        );
        mouthLight.intensity = state.currentMouthIntensity;
        mouthLight.color.set(state.dragonMood === 'roaring' ? 0xff1f43 : 0x00f0ff);
      }

      // --- 2. Continuous Traveling Wave Across Serpentine Path ---
      const waveSpeed = prefersReducedMotion ? 0.6 : 2.2;
      for (let p = 0; p < dragonPathPoints.length; p++) {
        const frac = p / (dragonPathPoints.length - 1);
        const basePt = dragonPathPoints[p];

        // Amplitude intensifies naturally toward the whip tail
        const amp = frac * 0.5;
        const phase = elapsed * waveSpeed - frac * 8.0;

        const waveX = Math.sin(phase) * amp * 0.65;
        const waveY = Math.cos(phase * 0.9) * amp * 0.42;
        const waveZ = Math.sin(phase * 1.1) * amp * 0.45;

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

      // --- 3. Update Dorsal Scale Plates (Dragon Back Armor) ---
      dorsalScales.forEach((scale) => {
        const t = scale.baseT;
        dynamicSplineCurve.getPointAt(t, posVec);
        dynamicSplineCurve.getTangentAt(t, tangentVec);

        // Compute local normal on top of body
        normalVec.crossVectors(tangentVec, upVec).normalize();
        normalVec.crossVectors(normalVec, tangentVec).normalize();

        const radius = getDragonRadius(t);
        scale.mesh.position.set(
          posVec.x + normalVec.x * (radius * 0.9),
          posVec.y + normalVec.y * (radius * 0.9),
          posVec.z + normalVec.z * (radius * 0.9)
        );

        quat.setFromUnitVectors(upVec, normalVec);
        scale.mesh.quaternion.copy(quat);

        // Energy pulse along dorsal scales
        const energyWave = Math.sin(elapsed * 4.0 - t * 15.0);
        if (state.dragonMood === 'roaring') {
          scale.mesh.material = scaleGlowRedMat;
        } else if (state.dragonMood === 'celebrating') {
          scale.mesh.material = scaleGlowCyanMat;
        } else {
          scale.mesh.material = t < 0.25 || energyWave > 0.4 ? scaleGlowCyanMat : scaleGlowRedMat;
        }
      });

      // --- 4. Update Tail Stinger Blade at t = 1.0 ---
      dynamicSplineCurve.getPointAt(1.0, posVec);
      dynamicSplineCurve.getTangentAt(1.0, tangentVec);
      tailStinger.position.set(posVec.x, posVec.y, posVec.z + 0.5);
      quat.setFromUnitVectors(forwardVec, tangentVec);
      tailStinger.quaternion.copy(quat);
      tailStinger.rotation.x += Math.PI / 2;

      // --- 5. Update Roar Lightning Discharge Arc ---
      if (state.lightningTimer > 0 && state.lightningTarget) {
        state.lightningTimer -= delta;
        lightningMesh.visible = true;

        const startPt = mouthLight.position;
        const endPt = state.lightningTarget;
        const linePosAttr = lightningGeo.getAttribute('position') as THREE.BufferAttribute;

        for (let j = 0; j <= lightningSegments; j++) {
          const frac = j / lightningSegments;
          const jitter = Math.sin(frac * Math.PI) * 0.45;
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

      // --- 6. Update Floating Cyber Embers ---
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
      plateGeo.dispose();
      tailStingerGeo.dispose();
      spineConduitGeo.dispose();
      emberGeo.dispose();
      lightningGeo.dispose();
      gridFloor.dispose();
      obsidianArmorMat.dispose();
      ventralBellyMat.dispose();
      crimsonHornsMat.dispose();
      dragonEyesMat.dispose();
      wingsMembraneMat.dispose();
      scaleGlowCyanMat.dispose();
      scaleGlowRedMat.dispose();
      spineConduitMat.dispose();
      emberMat.dispose();
      lightningMat.dispose();
      if (mixer) mixer.stopAllAction();
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
