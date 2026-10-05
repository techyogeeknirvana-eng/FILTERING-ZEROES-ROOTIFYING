import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { HackerCharacter } from './HackerCharacter';
import { WorldEnvironment } from './WorldEnvironment';
import { NetworkNodesManager, type WorldNodeData } from './NetworkNodes';
import { HackerWorldHUD } from './HackerWorldHUD';
import { HackerWorldFallback } from './HackerWorldFallback';
import { sound } from '../../utils/audio';

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const HackerWorldCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL] = useState<boolean>(() => checkWebGLSupport());

  const [isBooting, setIsBooting] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('fz_intro_seen');
    }
    return true;
  });

  const [nearbyNode, setNearbyNode] = useState<WorldNodeData | null>(null);
  const [discoveredCount, setDiscoveredCount] = useState<number>(1);
  const [totalNodes, setTotalNodes] = useState<number>(12);
  const [boundaryAlert, setBoundaryAlert] = useState<boolean>(false);
  const isInteractingRef = useRef<boolean>(false);

  const [playerCoords, setPlayerCoords] = useState<{ x: number; z: number }>({
    x: 0,
    z: 0,
  });

  // Virtual mobile movement input
  const virtualMoveRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });

  // Camera Orbit state
  const cameraAzimuthRef = useRef<number>(0);
  const cameraPitchRef = useRef<number>(0.25);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Click-to-move target
  const targetWalkPosRef = useRef<THREE.Vector3 | null>(null);

  // Keyboard state
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const handleEnterWorld = useCallback(() => {
    setIsBooting(false);
    sessionStorage.setItem('fz_intro_seen', 'true');
    sound.playSystemActivation();
  }, []);

  const handleSkipToRegistration = useCallback(() => {
    setIsBooting(false);
    sessionStorage.setItem('fz_intro_seen', 'true');
    sound.playButtonConfirm();
    const el = document.getElementById('access');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleInteractNode = useCallback((_node: WorldNodeData) => {
    isInteractingRef.current = true;
    setTimeout(() => {
      isInteractingRef.current = false;
    }, 1800);
  }, []);

  useEffect(() => {
    if (!hasWebGL) return;
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040507);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200);
    camera.position.set(0, 1.8, 3.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 2. Instantiate Environment, Character & Nodes
    const environment = new WorldEnvironment(scene);
    const player = new HackerCharacter(scene);
    player.setPosition(0, 0, 0);

    const nodesManager = new NetworkNodesManager(scene, (node) => {
      setNearbyNode(node);
      if (node) {
        sound.playHoverClick();
      }
      setDiscoveredCount(nodesManager.getDiscoveredCount());
    });
    setTotalNodes(nodesManager.getTotalNodes());

    // 3. Command Center Card Bridge Listener
    const handleCommandCardSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ moduleId: string }>;
      const modId = customEvent.detail?.moduleId;
      if (!modId) return;

      const nodeMap: Record<string, string> = {
        reg: 'gate_rootify',
        communities: 'comm_ace',
        partners: 'comm_fortixai',
        mentors: 'exp_signal',
        speakers: 'exp_signal',
        challenges: 'exp_breach',
        colleges: 'core_rootify',
        venue: 'core_rootify',
        sponsors: 'domain_venture',
        guests: 'exp_signal',
      };

      const targetNodeId = nodeMap[modId] || 'core_rootify';
      const node = nodesManager.getNodeById(targetNodeId);
      if (node) {
        nodesManager.highlightNode(targetNodeId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Teleport hacker smoothly near the node
        playerPos.set(node.coords.x * 0.75, 0, node.coords.z * 0.75);
        player.setPosition(playerPos.x, 0, playerPos.z);
        setNearbyNode(node);
      }
    };
    window.addEventListener('fz:command-card-select', handleCommandCardSelect);

    // 4. Movement & Physics Simulation Variables
    const playerPos = new THREE.Vector3(0, 0, 0);
    const playerVelocity = new THREE.Vector3();
    const maxArenaRadius = 57.5; // Circular arena boundary

    const clock = new THREE.Clock();
    let animId = 0;
    let lastTime = performance.now();
    let introGlideProgress = 0;

    // Raycaster for Click-to-Move
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    // Event Listeners for Input
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      // Left click to set click-to-move target on ground
      if (e.button === 0 && !isBooting) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseNDC, camera);
        const intersectPoint = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(groundPlane, intersectPoint)) {
          if (intersectPoint.length() < maxArenaRadius) {
            targetWalkPosRef.current = intersectPoint;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - lastMousePosRef.current.x;
        const deltaY = e.clientY - lastMousePosRef.current.y;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };

        cameraAzimuthRef.current -= deltaX * 0.005;
        cameraPitchRef.current = Math.max(
          0.08,
          Math.min(0.75, cameraPitchRef.current + deltaY * 0.004)
        );
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 5. Main 60 FPS Render Loop
    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsedTime = clock.getElapsedTime();

      // Check player input (WASD + Arrows + Virtual joystick + Click target)
      const keys = keysRef.current;
      let inputX = 0;
      let inputZ = 0;

      if (!isBooting) {
        if (keys['w'] || keys['arrowup']) inputZ -= 1;
        if (keys['s'] || keys['arrowdown']) inputZ += 1;
        if (keys['a'] || keys['arrowleft']) inputX -= 1;
        if (keys['d'] || keys['arrowright']) inputX += 1;

        // Merge virtual joystick input
        if (virtualMoveRef.current.x !== 0 || virtualMoveRef.current.z !== 0) {
          inputX += virtualMoveRef.current.x;
          inputZ += virtualMoveRef.current.z;
          targetWalkPosRef.current = null;
        }

        // Click-to-move handling
        if (targetWalkPosRef.current) {
          const toTarget = new THREE.Vector3().subVectors(
            targetWalkPosRef.current,
            playerPos
          );
          toTarget.y = 0;
          const dist = toTarget.length();

          if (dist > 0.4) {
            toTarget.normalize();
            const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(
              new THREE.Vector3(0, 1, 0),
              cameraAzimuthRef.current
            );
            const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(
              new THREE.Vector3(0, 1, 0),
              cameraAzimuthRef.current
            );

            inputX = toTarget.dot(right);
            inputZ = -toTarget.dot(forward);
          } else {
            targetWalkPosRef.current = null;
          }
        }
      }

      // Convert input into camera-relative movement vector
      const moveDir = new THREE.Vector3();
      const isMoving = Math.abs(inputX) > 0.05 || Math.abs(inputZ) > 0.05;

      if (isMoving) {
        const inputVec = new THREE.Vector2(inputX, inputZ).normalize();
        const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          cameraAzimuthRef.current
        );
        const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          cameraAzimuthRef.current
        );

        moveDir.addScaledVector(forward, -inputVec.y);
        moveDir.addScaledVector(right, inputVec.x);
        moveDir.normalize();
      }

      // Check sprint / run state (Shift key)
      const isRunning = !!keys['shift'] && isMoving;
      const speed = isRunning ? 7.2 : 4.2;

      // Accelerate / decelerate velocity
      const targetVelocity = moveDir.clone().multiplyScalar(isMoving ? speed : 0);
      playerVelocity.lerp(targetVelocity, delta * 9);

      // Apply movement and clamp inside circular arena
      playerPos.addScaledVector(playerVelocity, delta);
      const distFromCenter = Math.hypot(playerPos.x, playerPos.z);

      // Boundary glow & alert detection (NO audio spam)
      if (distFromCenter > maxArenaRadius - 2.0) {
        const intensity = Math.min(1.0, (distFromCenter - (maxArenaRadius - 2.0)) / 2.0);
        environment.setBoundaryGlow(intensity);
        setBoundaryAlert(true);
      } else {
        environment.setBoundaryGlow(0);
        setBoundaryAlert(false);
      }

      if (distFromCenter > maxArenaRadius) {
        playerPos.x = (playerPos.x / distFromCenter) * maxArenaRadius;
        playerPos.z = (playerPos.z / distFromCenter) * maxArenaRadius;
      }
      player.setPosition(playerPos.x, 0, playerPos.z);

      // Character facing rotation
      let targetRotY = player.group.rotation.y;
      if (isMoving && moveDir.lengthSq() > 0.001) {
        targetRotY = Math.atan2(moveDir.x, moveDir.z);
      }

      // Update character locomotion / idle / interact with shift sprint support
      player.update(
        delta,
        isMoving,
        moveDir,
        targetRotY,
        isRunning,
        isInteractingRef.current
      );

      // Update world environment & patrol drones
      environment.update(delta, playerPos);

      // Update network nodes & live laser connections
      nodesManager.update(delta, playerPos);

      // Update HUD telemetry coordinates periodically
      setPlayerCoords({ x: playerPos.x, z: playerPos.z });

      // 6. Camera Follow Controller
      if (isBooting) {
        // Cinematic front camera panning slightly
        const bootCamX = Math.sin(elapsedTime * 0.4) * 1.5;
        const bootCamZ = 3.8 + Math.cos(elapsedTime * 0.4) * 0.5;
        camera.position.set(bootCamX, 1.8, bootCamZ);
        camera.lookAt(0, 1.4, 0);
      } else {
        // Smoothly transition camera behind the hacker
        if (introGlideProgress < 1) {
          introGlideProgress = Math.min(1, introGlideProgress + delta * 1.2);
        }

        const distance = 4.8;
        const camHeight = 1.9 + cameraPitchRef.current * 2.2;

        const desiredCamX =
          playerPos.x +
          Math.sin(cameraAzimuthRef.current) *
            distance *
            Math.cos(cameraPitchRef.current);
        const desiredCamZ =
          playerPos.z +
          Math.cos(cameraAzimuthRef.current) *
            distance *
            Math.cos(cameraPitchRef.current);
        const desiredCamY = playerPos.y + camHeight;

        // Smooth camera lerp
        camera.position.lerp(
          new THREE.Vector3(desiredCamX, desiredCamY, desiredCamZ),
          delta * 6
        );

        const lookTarget = new THREE.Vector3(
          playerPos.x,
          playerPos.y + 1.35,
          playerPos.z
        );
        camera.lookAt(lookTarget);
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('fz:command-card-select', handleCommandCardSelect);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      player.dispose(scene);
      environment.dispose(scene);
      nodesManager.dispose(scene);
      renderer.dispose();

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hasWebGL, isBooting]);

  if (!hasWebGL) {
    return <HackerWorldFallback />;
  }

  return (
    <div className="relative w-full h-screen min-h-[640px] max-h-[1080px] overflow-hidden bg-[#040507]">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      <HackerWorldHUD
        isBooting={isBooting}
        onEnterWorld={handleEnterWorld}
        onSkipToRegistration={handleSkipToRegistration}
        nearbyNode={nearbyNode}
        onInteractNode={handleInteractNode}
        discoveredCount={discoveredCount}
        totalNodes={totalNodes}
        playerCoords={playerCoords}
        boundaryAlert={boundaryAlert}
        onVirtualMove={(dir) => {
          virtualMoveRef.current = dir;
        }}
        onVirtualMoveEnd={() => {
          virtualMoveRef.current = { x: 0, z: 0 };
        }}
      />
    </div>
  );
};
