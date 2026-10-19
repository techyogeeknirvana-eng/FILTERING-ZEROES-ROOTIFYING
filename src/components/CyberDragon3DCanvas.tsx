import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface Dragon3DController {
  setMood: (mood: 'idle' | 'celebrating' | 'roaring', targetCheckpointId?: number) => void;
}

interface CyberDragon3DCanvasProps {
  mood: 'idle' | 'celebrating' | 'roaring';
  targetCheckpointId?: number | null;
  onControllerReady?: (controller: Dragon3DController) => void;
}

export const CyberDragon3DCanvas: React.FC<CyberDragon3DCanvasProps> = ({
  mood,
  targetCheckpointId,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Target poses for smooth kinematic interpolation
  const targetsRef = useRef({
    headYaw: 0,
    headPitch: 0,
    headRoll: 0,
    jawOpen: 0,
    wingSpread: 0,
    eyeColor: new THREE.Color('#00f0ff'),
    mouthLightIntensity: 0,
    mouthLightColor: new THREE.Color('#ff1f43'),
    roarShockwaveScale: 0,
    roarShockwaveOpacity: 0,
    celebrateIntensity: 0,
  });

  // Current interpolated values
  const currentRef = useRef({
    headYaw: 0,
    headPitch: 0,
    headRoll: 0,
    jawOpen: 0,
    wingSpread: 0,
    eyeColor: new THREE.Color('#00f0ff'),
    mouthLightIntensity: 0,
    roarShockwaveScale: 0,
    roarShockwaveOpacity: 0,
    celebrateIntensity: 0,
  });

  // Update target poses when mood or targetCheckpointId changes
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (mood === 'celebrating') {
      // Friendly forward head bow, widened glowing eyes, spreading wings
      targetsRef.current.headYaw = 0;
      targetsRef.current.headPitch = -0.15;
      targetsRef.current.headRoll = 0;
      targetsRef.current.jawOpen = prefersReducedMotion ? 0 : 0.25;
      targetsRef.current.wingSpread = prefersReducedMotion ? 0 : 0.45;
      targetsRef.current.eyeColor.set('#00f0ff');
      targetsRef.current.mouthLightIntensity = 1.8;
      targetsRef.current.mouthLightColor.set('#00f0ff');
      targetsRef.current.celebrateIntensity = 1.0;
    } else if (mood === 'roaring') {
      // Calculate directional turn toward target checkpoint (1 to 8)
      // Checkpoints 02-04 are left/top, 05-08 are right/bottom
      const cpId = targetCheckpointId || 4;
      // Map id (2..8) to an angle between -0.45 and +0.45 rad
      const angle = (cpId - 5) * 0.14;

      targetsRef.current.headYaw = angle;
      targetsRef.current.headPitch = 0.2;
      targetsRef.current.headRoll = angle * 0.3;
      targetsRef.current.jawOpen = prefersReducedMotion ? 0.3 : 0.85; // Snarl / open roar
      targetsRef.current.wingSpread = prefersReducedMotion ? 0 : 0.65;
      targetsRef.current.eyeColor.set('#ff1f43');
      targetsRef.current.mouthLightIntensity = 3.5;
      targetsRef.current.mouthLightColor.set('#ff1f43');
      targetsRef.current.roarShockwaveScale = 2.4;
      targetsRef.current.roarShockwaveOpacity = 0.9;
      targetsRef.current.celebrateIntensity = 0;
    } else {
      // Idle
      targetsRef.current.headYaw = 0;
      targetsRef.current.headPitch = 0;
      targetsRef.current.headRoll = 0;
      targetsRef.current.jawOpen = 0.05;
      targetsRef.current.wingSpread = 0;
      targetsRef.current.eyeColor.set('#00f0ff');
      targetsRef.current.mouthLightIntensity = 0.4;
      targetsRef.current.mouthLightColor.set('#00f0ff');
      targetsRef.current.roarShockwaveScale = 0;
      targetsRef.current.roarShockwaveOpacity = 0;
      targetsRef.current.celebrateIntensity = 0;
    }
  }, [mood, targetCheckpointId]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 240;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020307, 0.04);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    camera.lookAt(0, 0.4, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 3. Lighting Architecture
    const ambientLight = new THREE.AmbientLight(0x0a1024, 1.4);
    scene.add(ambientLight);

    const cyanKeyLight = new THREE.DirectionalLight(0x00f0ff, 2.8);
    cyanKeyLight.position.set(-4, 6, 4);
    scene.add(cyanKeyLight);

    const redRimLight = new THREE.DirectionalLight(0xff1f43, 2.4);
    redRimLight.position.set(4, -2, -3);
    scene.add(redRimLight);

    const overheadLight = new THREE.SpotLight(0xffffff, 2.0, 15, Math.PI / 4, 0.4);
    overheadLight.position.set(0, 6, 2);
    overheadLight.target.position.set(0, 0, 0);
    scene.add(overheadLight);
    scene.add(overheadLight.target);

    // Dynamic mouth plasma emitter light
    const mouthLight = new THREE.PointLight(0xff1f43, 0, 4);
    mouthLight.position.set(0, 0.6, 0.8);
    scene.add(mouthLight);

    // 4. Materials
    const obsidianArmorMat = new THREE.MeshStandardMaterial({
      color: 0x070b14,
      metalness: 0.85,
      roughness: 0.25,
    });

    const metallicSilverMat = new THREE.MeshStandardMaterial({
      color: 0x8a9bb8,
      metalness: 0.95,
      roughness: 0.2,
    });

    const eyeGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    const spineLedMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });

    const wingMembraneMat = new THREE.MeshStandardMaterial({
      color: 0x091428,
      emissive: 0x003366,
      emissiveIntensity: 0.4,
      metalness: 0.5,
      roughness: 0.4,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });

    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xff1f43,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });

    // 5. Build 3D Articulated Cyber-Dragon Structure
    const dragonRoot = new THREE.Group();
    dragonRoot.position.set(0, -0.2, 0);
    scene.add(dragonRoot);

    // --- Torso & Ribcage ---
    const chestGroup = new THREE.Group();
    dragonRoot.add(chestGroup);

    const torsoGeo = new THREE.ConeGeometry(0.55, 1.2, 7);
    const torsoMesh = new THREE.Mesh(torsoGeo, obsidianArmorMat);
    torsoMesh.rotation.x = Math.PI / 2.2;
    torsoMesh.position.set(0, 0.3, -0.4);
    chestGroup.add(torsoMesh);

    // Chest Reactor Core (Glows inside the ribcage)
    const reactorGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const reactorMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const reactorMesh = new THREE.Mesh(reactorGeo, reactorMat);
    reactorMesh.position.set(0, 0.35, -0.15);
    chestGroup.add(reactorMesh);

    // --- Articulated Neck & Head ---
    const neckBase = new THREE.Group();
    neckBase.position.set(0, 0.55, 0.1);
    chestGroup.add(neckBase);

    // Neck joint 1
    const neck1Geo = new THREE.CylinderGeometry(0.24, 0.32, 0.4, 6);
    const neck1 = new THREE.Mesh(neck1Geo, obsidianArmorMat);
    neck1.rotation.x = -Math.PI / 5;
    neck1.position.set(0, 0.18, 0.1);
    neckBase.add(neck1);

    // Neck joint 2 (Pivots forward)
    const neckMid = new THREE.Group();
    neckMid.position.set(0, 0.35, 0.2);
    neckBase.add(neckMid);

    // Head Pivot Group (Responds to gaze & roars)
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0.2, 0.15);
    neckMid.add(headPivot);

    // Dragon Cranium / Upper Skull
    const skullGeo = new THREE.ConeGeometry(0.38, 0.9, 5);
    const skullMesh = new THREE.Mesh(skullGeo, obsidianArmorMat);
    skullMesh.rotation.x = Math.PI / 1.7;
    skullMesh.rotation.y = Math.PI / 5;
    skullMesh.position.set(0, 0.1, 0.32);
    headPivot.add(skullMesh);

    // Brow Armor Plates
    const browGeo = new THREE.BoxGeometry(0.52, 0.12, 0.35);
    const browMesh = new THREE.Mesh(browGeo, metallicSilverMat);
    browMesh.position.set(0, 0.22, 0.25);
    headPivot.add(browMesh);

    // Swept-back Horns (Left & Right)
    const hornCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.18, 0.25, 0.1),
      new THREE.Vector3(-0.45, 0.65, -0.2),
      new THREE.Vector3(-0.7, 0.95, -0.55),
    ]);
    const hornGeoL = new THREE.TubeGeometry(hornCurveL, 12, 0.07, 6, false);
    const hornMeshL = new THREE.Mesh(hornGeoL, metallicSilverMat);
    headPivot.add(hornMeshL);

    const hornCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.18, 0.25, 0.1),
      new THREE.Vector3(0.45, 0.65, -0.2),
      new THREE.Vector3(0.7, 0.95, -0.55),
    ]);
    const hornGeoR = new THREE.TubeGeometry(hornCurveR, 12, 0.07, 6, false);
    const hornMeshR = new THREE.Mesh(hornGeoR, metallicSilverMat);
    headPivot.add(hornMeshR);

    // Emissive Visor Eyes
    const eyeGeo = new THREE.BoxGeometry(0.14, 0.04, 0.06);
    const eyeMeshL = new THREE.Mesh(eyeGeo, eyeGlowMat);
    eyeMeshL.position.set(-0.19, 0.18, 0.42);
    eyeMeshL.rotation.y = -Math.PI / 7;
    headPivot.add(eyeMeshL);

    const eyeMeshR = new THREE.Mesh(eyeGeo, eyeGlowMat);
    eyeMeshR.position.set(0.19, 0.18, 0.42);
    eyeMeshR.rotation.y = Math.PI / 7;
    headPivot.add(eyeMeshR);

    // Lower Jaw (Articulates open/close during roar)
    const jawPivot = new THREE.Group();
    jawPivot.position.set(0, 0.02, 0.22);
    headPivot.add(jawPivot);

    const jawGeo = new THREE.ConeGeometry(0.24, 0.65, 4);
    const jawMesh = new THREE.Mesh(jawGeo, obsidianArmorMat);
    jawMesh.rotation.x = Math.PI / 1.8;
    jawMesh.position.set(0, -0.05, 0.25);
    jawPivot.add(jawMesh);

    // Teeth / Fangs
    const fangGeo = new THREE.ConeGeometry(0.03, 0.1, 4);
    const fangL = new THREE.Mesh(fangGeo, metallicSilverMat);
    fangL.position.set(-0.1, 0.02, 0.38);
    fangL.rotation.x = Math.PI;
    headPivot.add(fangL);

    const fangR = new THREE.Mesh(fangGeo, metallicSilverMat);
    fangR.position.set(0.1, 0.02, 0.38);
    fangR.rotation.x = Math.PI;
    headPivot.add(fangR);

    // Roar Shockwave Ring Mesh (Expands from mouth)
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.25, 24);
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwaveMesh.position.set(0, 0.05, 0.8);
    headPivot.add(shockwaveMesh);

    // Spine Crest Nodes (Along neck and back)
    const spineNodes: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const spikeGeo = new THREE.ConeGeometry(0.05, 0.2, 4);
      const spike = new THREE.Mesh(spikeGeo, spineLedMat);
      spike.position.set(0, 0.35 + i * 0.08, -i * 0.18);
      spike.rotation.x = -Math.PI / 4;
      chestGroup.add(spike);
      spineNodes.push(spike);
    }

    // --- Wings (Articulated Left & Right Armature) ---
    // Left Wing
    const wingPivotL = new THREE.Group();
    wingPivotL.position.set(-0.35, 0.5, -0.2);
    chestGroup.add(wingPivotL);

    const wingBoneL1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.06, 0.9, 5),
      metallicSilverMat
    );
    wingBoneL1.position.set(-0.4, 0.3, 0);
    wingBoneL1.rotation.z = Math.PI / 3;
    wingPivotL.add(wingBoneL1);

    const wingJointL = new THREE.Group();
    wingJointL.position.set(-0.8, 0.6, 0);
    wingPivotL.add(wingJointL);

    // Wing struts / fingers
    const wingStrutGeo = new THREE.CylinderGeometry(0.02, 0.04, 1.2, 4);
    const strutL1 = new THREE.Mesh(wingStrutGeo, metallicSilverMat);
    strutL1.position.set(-0.45, -0.4, 0.1);
    strutL1.rotation.z = -Math.PI / 5;
    wingJointL.add(strutL1);

    const strutL2 = new THREE.Mesh(wingStrutGeo, metallicSilverMat);
    strutL2.position.set(-0.6, -0.2, -0.1);
    strutL2.rotation.z = -Math.PI / 3.5;
    wingJointL.add(strutL2);

    // Left Wing Membrane Mesh
    const wingShapeL = new THREE.BufferGeometry();
    const verticesL = new Float32Array([
      0, 0, 0,
      -0.8, 0.6, 0,
      -1.2, -0.4, 0,
      0, 0, 0,
      -1.2, -0.4, 0,
      -0.6, -0.8, 0,
    ]);
    wingShapeL.setAttribute('position', new THREE.BufferAttribute(verticesL, 3));
    wingShapeL.computeVertexNormals();
    const membraneMeshL = new THREE.Mesh(wingShapeL, wingMembraneMat);
    wingPivotL.add(membraneMeshL);

    // Right Wing
    const wingPivotR = new THREE.Group();
    wingPivotR.position.set(0.35, 0.5, -0.2);
    chestGroup.add(wingPivotR);

    const wingBoneR1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.06, 0.9, 5),
      metallicSilverMat
    );
    wingBoneR1.position.set(0.4, 0.3, 0);
    wingBoneR1.rotation.z = -Math.PI / 3;
    wingPivotR.add(wingBoneR1);

    const wingJointR = new THREE.Group();
    wingJointR.position.set(0.8, 0.6, 0);
    wingPivotR.add(wingJointR);

    const strutR1 = new THREE.Mesh(wingStrutGeo, metallicSilverMat);
    strutR1.position.set(0.45, -0.4, 0.1);
    strutR1.rotation.z = Math.PI / 5;
    wingJointR.add(strutR1);

    const strutR2 = new THREE.Mesh(wingStrutGeo, metallicSilverMat);
    strutR2.position.set(0.6, -0.2, -0.1);
    strutR2.rotation.z = Math.PI / 3.5;
    wingJointR.add(strutR2);

    // Right Wing Membrane Mesh
    const wingShapeR = new THREE.BufferGeometry();
    const verticesR = new Float32Array([
      0, 0, 0,
      0.8, 0.6, 0,
      1.2, -0.4, 0,
      0, 0, 0,
      1.2, -0.4, 0,
      0.6, -0.8, 0,
    ]);
    wingShapeR.setAttribute('position', new THREE.BufferAttribute(verticesR, 3));
    wingShapeR.computeVertexNormals();
    const membraneMeshR = new THREE.Mesh(wingShapeR, wingMembraneMat);
    wingPivotR.add(membraneMeshR);

    // --- Undulating Serpentine Tail ---
    const tailVertebrae: THREE.Group[] = [];
    let prevTailJoint = chestGroup;
    for (let t = 0; t < 5; t++) {
      const tailJoint = new THREE.Group();
      tailJoint.position.set(0, -0.05, -0.25);
      prevTailJoint.add(tailJoint);

      const radius = 0.22 - t * 0.035;
      const tMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.8, radius, 0.35, 5),
        obsidianArmorMat
      );
      tMesh.rotation.x = -Math.PI / 2.3;
      tailJoint.add(tMesh);

      tailVertebrae.push(tailJoint);
      prevTailJoint = tailJoint;
    }

    // --- Floating Digital Mist Particle System ---
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 4;
      particlePositions[p * 3 + 1] = Math.random() * 2 - 0.5;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // 6. Animation Loop (60 FPS Kinematics)
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth interpolation factor (lerp)
      const lerpFactor = Math.min(1, delta * 7.5);

      const cur = currentRef.current;
      const tgt = targetsRef.current;

      cur.headYaw += (tgt.headYaw - cur.headYaw) * lerpFactor;
      cur.headPitch += (tgt.headPitch - cur.headPitch) * lerpFactor;
      cur.headRoll += (tgt.headRoll - cur.headRoll) * lerpFactor;
      cur.jawOpen += (tgt.jawOpen - cur.jawOpen) * lerpFactor;
      cur.wingSpread += (tgt.wingSpread - cur.wingSpread) * lerpFactor;
      cur.mouthLightIntensity += (tgt.mouthLightIntensity - cur.mouthLightIntensity) * lerpFactor;
      cur.roarShockwaveScale += (tgt.roarShockwaveScale - cur.roarShockwaveScale) * (delta * 4);
      cur.roarShockwaveOpacity += (tgt.roarShockwaveOpacity - cur.roarShockwaveOpacity) * (delta * 6);
      cur.celebrateIntensity += (tgt.celebrateIntensity - cur.celebrateIntensity) * lerpFactor;

      cur.eyeColor.lerp(tgt.eyeColor, lerpFactor);
      eyeGlowMat.color.copy(cur.eyeColor);
      mouthLight.color.copy(tgt.mouthLightColor);
      mouthLight.intensity = cur.mouthLightIntensity;

      // Natural Idle Breathing
      const breathCycle = Math.sin(elapsed * 2.2);
      chestGroup.scale.set(
        1 + breathCycle * 0.02,
        1 + breathCycle * 0.03,
        1 + breathCycle * 0.02
      );

      // Natural Wing Flapping / Motion
      const wingFlap = Math.sin(elapsed * 2.8) * 0.18 + cur.wingSpread;
      wingPivotL.rotation.y = wingFlap;
      wingPivotL.rotation.z = Math.sin(elapsed * 2.8) * 0.12;
      wingPivotR.rotation.y = -wingFlap;
      wingPivotR.rotation.z = -Math.sin(elapsed * 2.8) * 0.12;

      // Articulate Neck & Head Orientation
      headPivot.rotation.y = cur.headYaw + Math.sin(elapsed * 1.2) * 0.06;
      headPivot.rotation.x = cur.headPitch + breathCycle * 0.04;
      headPivot.rotation.z = cur.headRoll;

      // Articulate Jaw (Roar / Mouth Aperture)
      jawPivot.rotation.x = cur.jawOpen;

      // Roar Shockwave Ring Animation
      if (cur.roarShockwaveOpacity > 0.05) {
        shockwaveMesh.scale.setScalar(cur.roarShockwaveScale);
        shockwaveMat.opacity = cur.roarShockwaveOpacity;
      } else {
        shockwaveMat.opacity = 0;
      }

      // Tail Serpentine Undulation
      tailVertebrae.forEach((vert, idx) => {
        const wave = Math.sin(elapsed * 3.2 - idx * 0.7) * 0.18;
        vert.rotation.y = wave;
        vert.rotation.x = Math.cos(elapsed * 2.4 - idx * 0.5) * 0.06;
      });

      // Spine LED Pulse
      const ledGlow = (Math.sin(elapsed * 4) * 0.5 + 0.5) * 0.6 + 0.4;
      if (tgt.celebrateIntensity > 0.5) {
        spineLedMat.color.setHex(0x00f0ff);
      } else if (tgt.mouthLightColor.getHex() === 0xff1f43 && cur.jawOpen > 0.3) {
        spineLedMat.color.setHex(0xff1f43);
      } else {
        spineLedMat.color.setHex(0x00f0ff);
      }
      reactorMesh.scale.setScalar(1 + ledGlow * 0.15);

      // Drifting particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let p = 0; p < particleCount; p++) {
        positions[p * 3 + 1] += delta * 0.3;
        if (positions[p * 3 + 1] > 2) {
          positions[p * 3 + 1] = -0.5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Subtle Dragon Body Sway
      dragonRoot.position.y = -0.2 + Math.sin(elapsed * 1.8) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 380;
      const newH = container.clientHeight || 240;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 8. Cleanup on unmount
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js Geometries & Materials to prevent leaks
      [
        torsoGeo,
        reactorGeo,
        neck1Geo,
        skullGeo,
        browGeo,
        hornGeoL,
        hornGeoR,
        eyeGeo,
        jawGeo,
        fangGeo,
        shockwaveGeo,
        wingStrutGeo,
        wingShapeL,
        wingShapeR,
        particleGeo,
      ].forEach((g) => g.dispose());

      [
        obsidianArmorMat,
        metallicSilverMat,
        eyeGlowMat,
        spineLedMat,
        wingMembraneMat,
        shockwaveMat,
        reactorMat,
        particleMat,
      ].forEach((m) => m.dispose());

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-52 sm:h-64 md:h-72 select-none pointer-events-none"
    />
  );
};
