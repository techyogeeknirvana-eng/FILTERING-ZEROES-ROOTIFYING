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

export class WorldEnvironment {
  public group: THREE.Group;
  private floorMesh: THREE.Mesh;
  private binaryParticles: THREE.Points;
  private particlePositions: Float32Array;
  private particleCount: number = 240;
  private hackerPointLight: THREE.PointLight;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.group.name = 'WorldEnvironment';

    // 1. Scene Fog (Deep Charcoal / Black)
    scene.fog = new THREE.FogExp2(0x040507, 0.024);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x0b101a, 1.2);
    this.group.add(ambientLight);

    // Cyan Directional Key Light
    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 1.4);
    cyanLight.position.set(-25, 35, -20);
    this.group.add(cyanLight);

    // Red Rim Accent Light
    const redLight = new THREE.DirectionalLight(0xff1f43, 1.1);
    redLight.position.set(25, 20, 25);
    this.group.add(redLight);

    // Subtle Follower Point Light for the Hacker
    this.hackerPointLight = new THREE.PointLight(0x00f0ff, 1.5, 9);
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
      const radius = 6 + Math.random() * 55;
      this.particlePositions[i * 3] = Math.cos(angle) * radius;
      this.particlePositions[i * 3 + 1] = Math.random() * 12 + 0.5;
      this.particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      const isCyan = Math.random() > 0.45;
      particleColors[i * 3] = isCyan ? 0.0 : 1.0;
      particleColors[i * 3 + 1] = isCyan ? 0.94 : 0.12;
      particleColors[i * 3 + 2] = isCyan ? 1.0 : 0.26;
    }

    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3)
    );
    particleGeo.setAttribute(
      'color',
      new THREE.BufferAttribute(particleColors, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    this.binaryParticles = new THREE.Points(particleGeo, particleMat);
    this.group.add(this.binaryParticles);

    // 6. Perimeter Circular Boundary Ring (Playable area edge)
    const ringGeo = new THREE.RingGeometry(58, 59, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff1f43,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.05;
    this.group.add(ringMesh);

    scene.add(this.group);
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

    const count = 28;
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
    }
  }

  /**
   * Update particle drift and hacker light position
   */
  public update(delta: number, hackerPos: THREE.Vector3) {
    this.hackerPointLight.position.set(hackerPos.x, hackerPos.y + 1.8, hackerPos.z);

    // Gently float binary particles upward
    const pos = this.particlePositions;
    for (let i = 0; i < this.particleCount; i++) {
      pos[i * 3 + 1] += delta * 0.45;
      if (pos[i * 3 + 1] > 14) {
        pos[i * 3 + 1] = 0.5;
      }
    }
    this.binaryParticles.geometry.attributes.position.needsUpdate = true;
  }

  public dispose(scene: THREE.Scene) {
    scene.remove(this.group);
  }
}
