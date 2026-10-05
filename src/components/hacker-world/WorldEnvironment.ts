import * as THREE from 'three';

/**
 * Creates an infinite-style perspective cyber grid texture for the floor
 */
function createGridFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#040507';
    ctx.fillRect(0, 0, 1024, 1024);

    // Major grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
    ctx.lineWidth = 2;

    const step = 64;
    for (let x = 0; x <= 1024; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Secondary sub-grid dots & telemetry crosses
    ctx.fillStyle = '#ff1f43';
    for (let x = step; x < 1024; x += step * 2) {
      for (let y = step; y < 1024; y += step * 2) {
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }

    // Binary annotations along axes
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let x = step * 2; x < 1024; x += step * 4) {
      ctx.fillText(`0x${(x / 4).toString(16).toUpperCase()}`, x + 6, 20);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}

interface PatrolDrone {
  group: THREE.Group;
  orbitRadius: number;
  orbitSpeed: number;
  baseHeight: number;
  phaseOffset: number;
  searchlightCone: THREE.Mesh;
}

interface DataPulse {
  mesh: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
  progress: number;
  speed: number;
}

export class WorldEnvironment {
  public group: THREE.Group;
  private floorMesh: THREE.Mesh;
  private binaryParticles: THREE.Points;
  private particlePositions: Float32Array;
  private particleCount: number = 280;
  private hackerPointLight: THREE.PointLight;
  private boundaryRingMesh: THREE.Mesh;

  // Drones & Data streams
  private patrolDrones: PatrolDrone[] = [];
  private dataPulses: DataPulse[] = [];
  private serverStrips: THREE.Mesh[] = [];
  private worldTime: number = 0;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.group.name = 'WorldEnvironment';

    // 1. Scene Fog (Deep Charcoal / Black)
    scene.fog = new THREE.FogExp2(0x040507, 0.022);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x0a101b, 1.4);
    this.group.add(ambientLight);

    // Cyan Directional Key Light
    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 1.4);
    cyanLight.position.set(-25, 35, -20);
    this.group.add(cyanLight);

    // Red Rim Accent Light
    const redLight = new THREE.DirectionalLight(0xff1f43, 1.2);
    redLight.position.set(25, 20, 25);
    this.group.add(redLight);

    // Follower Point Light for the Hacker
    this.hackerPointLight = new THREE.PointLight(0x00f0ff, 1.6, 10);
    this.hackerPointLight.position.set(0, 2, 0);
    this.group.add(this.hackerPointLight);

    // 3. Cyber Ground Floor Plane
    const floorTexture = createGridFloorTexture();
    const floorGeo = new THREE.PlaneGeometry(160, 160);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.8,
      metalness: 0.3,
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.y = 0;
    this.floorMesh.receiveShadow = true;
    this.group.add(this.floorMesh);

    // 4. Distant Server Monoliths / Cyber Scrapers
    this.buildDistantMonoliths();

    // 5. Binary 0 / 1 Particle Cloud
    const particleGeo = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(this.particleCount * 3);
    const particleColors = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 52;
      this.particlePositions[i * 3] = Math.cos(angle) * radius;
      this.particlePositions[i * 3 + 1] = Math.random() * 14 + 0.5;
      this.particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      const isCyan = Math.random() > 0.45;
      particleColors[i * 3] = isCyan ? 0.0 : 1.0;
      particleColors[i * 3 + 1] = isCyan ? 0.94 : 0.12;
      particleColors[i * 3 + 2] = isCyan ? 1.0 : 0.26;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    this.binaryParticles = new THREE.Points(particleGeo, particleMat);
    this.group.add(this.binaryParticles);

    // 6. Perimeter Circular Boundary Ring (Playable area edge)
    const ringGeo = new THREE.RingGeometry(57.8, 59, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff1f43,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    this.boundaryRingMesh = new THREE.Mesh(ringGeo, ringMat);
    this.boundaryRingMesh.rotation.x = -Math.PI / 2;
    this.boundaryRingMesh.position.y = 0.05;
    this.group.add(this.boundaryRingMesh);

    // 7. Overhead Autonomous Patrol Drones
    this.buildPatrolDrones();

    // 8. Cyber Data Streams
    this.buildDataStreams();

    scene.add(this.group);
  }

  /**
   * Builds overhead autonomous patrol drones with scanning searchlights
   */
  private buildPatrolDrones() {
    const droneConfigs = [
      { radius: 28, speed: 0.35, height: 11, phase: 0, color: 0x00f0ff },
      { radius: 36, speed: -0.28, height: 13, phase: Math.PI * 0.7, color: 0xff1f43 },
      { radius: 22, speed: 0.42, height: 9.5, phase: Math.PI * 1.4, color: 0x00f0ff },
    ];

    droneConfigs.forEach((cfg) => {
      const droneGroup = new THREE.Group();

      // Drone Chassis
      const chassisGeo = new THREE.BoxGeometry(1.2, 0.3, 0.8);
      const chassisMat = new THREE.MeshStandardMaterial({
        color: 0x0a0d14,
        roughness: 0.5,
        metalness: 0.7,
      });
      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      droneGroup.add(chassis);

      // Drone Eye / Sensor Node
      const eyeGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const eyeMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(0, -0.15, 0.25);
      droneGroup.add(eye);

      // Searchlight Conical Beam onto ground
      const coneGeo = new THREE.ConeGeometry(2.5, cfg.height, 16, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(0, -cfg.height / 2, 0);
      droneGroup.add(cone);

      this.group.add(droneGroup);
      this.patrolDrones.push({
        group: droneGroup,
        orbitRadius: cfg.radius,
        orbitSpeed: cfg.speed,
        baseHeight: cfg.height,
        phaseOffset: cfg.phase,
        searchlightCone: cone,
      });
    });
  }

  /**
   * Builds curved data streams connecting server towers
   */
  private buildDataStreams() {
    const streamConfigs = [
      { start: new THREE.Vector3(-35, 12, -35), end: new THREE.Vector3(0, 3, -15), color: 0x00f0ff },
      { start: new THREE.Vector3(35, 14, -30), end: new THREE.Vector3(12, 2.5, 0), color: 0xff1f43 },
      { start: new THREE.Vector3(-30, 10, 35), end: new THREE.Vector3(0, 2.5, 14), color: 0x00f0ff },
      { start: new THREE.Vector3(35, 12, 35), end: new THREE.Vector3(0, 3, 0), color: 0x0070f3 },
    ];

    streamConfigs.forEach((cfg) => {
      // Create spline curve
      const mid = new THREE.Vector3()
        .addVectors(cfg.start, cfg.end)
        .multiplyScalar(0.5);
      mid.y += 6; // Arc peak

      const curve = new THREE.CatmullRomCurve3([cfg.start, mid, cfg.end]);
      const points = curve.getPoints(40);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.35,
      });
      const line = new THREE.Line(geo, lineMat);
      this.group.add(line);

      // Data pulse node
      const pulseGeo = new THREE.SphereGeometry(0.24, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      this.group.add(pulseMesh);

      this.dataPulses.push({
        mesh: pulseMesh,
        curve,
        progress: Math.random(),
        speed: 0.2 + Math.random() * 0.15,
      });
    });
  }

  /**
   * Builds distant cyber monoliths and server stacks around the boundary
   */
  private buildDistantMonoliths() {
    const monolithMat = new THREE.MeshStandardMaterial({
      color: 0x07090f,
      roughness: 0.6,
      metalness: 0.7,
    });

    const windowCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const windowRedMat = new THREE.MeshBasicMaterial({ color: 0xff1f43 });

    const count = 30;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const radius = 55 + Math.random() * 25;
      const width = 4 + Math.random() * 5;
      const height = 15 + Math.random() * 35;
      const depth = 4 + Math.random() * 5;

      const geo = new THREE.BoxGeometry(width, height, depth);
      const mesh = new THREE.Mesh(geo, monolithMat);
      mesh.position.set(
        Math.cos(angle) * radius,
        height / 2,
        Math.sin(angle) * radius
      );
      this.group.add(mesh);

      // Server LED strip on tower
      const stripHeight = height * 0.7;
      const stripGeo = new THREE.BoxGeometry(0.2, stripHeight, 0.2);
      const isRed = i % 3 === 0;
      const strip = new THREE.Mesh(stripGeo, isRed ? windowRedMat : windowCyanMat);
      strip.position.set(
        mesh.position.x + (Math.random() - 0.5) * 2,
        mesh.position.y,
        mesh.position.z + depth / 2 + 0.1
      );
      this.group.add(strip);
      this.serverStrips.push(strip);
    }
  }

  /**
   * Smoothly highlights boundary perimeter when approaching the edge
   */
  public setBoundaryGlow(intensity: number) {
    const mat = this.boundaryRingMesh.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.35 + intensity * 0.5;
  }

  /**
   * Update patrol drones, data pulses, particle drift, and hacker light position
   */
  public update(delta: number, hackerPos: THREE.Vector3) {
    this.worldTime += delta;
    this.hackerPointLight.position.set(hackerPos.x, hackerPos.y + 1.8, hackerPos.z);

    // 1. Float binary particles upward
    const pos = this.particlePositions;
    for (let i = 0; i < this.particleCount; i++) {
      pos[i * 3 + 1] += delta * 0.45;
      if (pos[i * 3 + 1] > 14) {
        pos[i * 3 + 1] = 0.5;
      }
    }
    this.binaryParticles.geometry.attributes.position.needsUpdate = true;

    // 2. Patrol Drones surveillance movement
    for (const drone of this.patrolDrones) {
      const angle = this.worldTime * drone.orbitSpeed + drone.phaseOffset;
      const x = Math.cos(angle) * drone.orbitRadius;
      const z = Math.sin(angle) * drone.orbitRadius;
      const y = drone.baseHeight + Math.sin(this.worldTime * 1.5 + drone.phaseOffset) * 0.8;

      drone.group.position.set(x, y, z);
      drone.group.rotation.y = -angle + Math.PI / 2;
      // Slight bank tilt
      drone.group.rotation.z = Math.sin(this.worldTime * 2) * 0.08;
    }

    // 3. Cyber Data Pulses
    for (const pulse of this.dataPulses) {
      pulse.progress = (pulse.progress + delta * pulse.speed) % 1.0;
      const pt = pulse.curve.getPoint(pulse.progress);
      pulse.mesh.position.copy(pt);
    }

    // 4. Server LED racks gentle pulse
    for (let i = 0; i < this.serverStrips.length; i++) {
      if (i % 2 === 0) {
        const mat = this.serverStrips[i].material as THREE.MeshBasicMaterial;
        mat.color.setScalar(0.75 + Math.sin(this.worldTime * 4 + i) * 0.25);
      }
    }
  }

  public dispose(scene: THREE.Scene) {
    scene.remove(this.group);
  }
}
