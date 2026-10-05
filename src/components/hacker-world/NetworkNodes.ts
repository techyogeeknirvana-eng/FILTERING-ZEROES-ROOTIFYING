import * as THREE from 'three';

export interface WorldNodeData {
  id: string;
  title: string;
  code: string;
  category: 'domain' | 'experience' | 'community' | 'gate';
  color: string;
  coords: THREE.Vector3;
  description: string;
  details?: string;
  status: 'CONNECTED' | 'CLASSIFIED' | 'GATEWAY' | 'ACTIVE';
  partnerImage?: string;
  subLabel?: string;
  targetAnchor?: string;
  discovered: boolean;
}

export class NetworkNodesManager {
  public group: THREE.Group;
  public nodes: WorldNodeData[];
  private nodeMeshes: {
    data: WorldNodeData;
    container: THREE.Group;
    core: THREE.Mesh;
    ring: THREE.Mesh;
    pillar: THREE.Mesh;
    labelSprite: THREE.Sprite;
  }[] = [];

  // Dynamic laser line between hacker and closest active node
  private hackerLine: THREE.Line;
  private hackerLineGeo: THREE.BufferGeometry;

  // Inter-node network mesh lines
  private networkLineSegments: THREE.LineSegments;
  private networkLineGeo: THREE.BufferGeometry;

  private activeNodeId: string | null = null;
  private onNodeProximityChange?: (node: WorldNodeData | null) => void;

  constructor(
    scene: THREE.Scene,
    onNodeProximityChange?: (node: WorldNodeData | null) => void
  ) {
    this.group = new THREE.Group();
    this.group.name = 'NetworkNodesGroup';
    this.onNodeProximityChange = onNodeProximityChange;

    this.nodes = [
      // 1. ROOTIFY GATE (North / Major Monumental Gateway)
      {
        id: 'gate_rootify',
        title: 'ROOTIFY GATE',
        code: 'GATE://0x01_ROOT',
        category: 'gate',
        color: '#ff1f43',
        coords: new THREE.Vector3(0, 2.2, -26),
        description: 'The monumental threshold where 0 and 1 converge. Direct access to passes and registration.',
        details: 'Passes, access passes, and tournament registration terminal.',
        status: 'GATEWAY',
        targetAnchor: '#access',
        discovered: true,
      },

      // 2. Core Domains (Inner Circle, radius ~12-16)
      {
        id: 'domain_ai',
        title: 'AI // NEURAL HUB',
        code: 'NODE://AI_TENSOR',
        category: 'domain',
        color: '#00f0ff',
        coords: new THREE.Vector3(-12, 1.8, -12),
        description: 'Autonomous neural architectures, deep model training, and neuro-symbolic reasoning.',
        details: 'Explore how AI transforms raw entropy into autonomous systems.',
        status: 'ACTIVE',
        targetAnchor: '#domains',
        discovered: false,
      },
      {
        id: 'domain_cyber',
        title: 'CYBERSECURITY // MATRIX',
        code: 'NODE://RING_0_SHIELD',
        category: 'domain',
        color: '#ff1f43',
        coords: new THREE.Vector3(12, 1.8, -12),
        description: 'Offensive CTF, kernel-level exploit prevention, reverse engineering, and zero-trust matrices.',
        details: 'Adversarial simulation and privilege escalation defense.',
        status: 'ACTIVE',
        targetAnchor: '#domains',
        discovered: false,
      },
      {
        id: 'domain_cloud',
        title: 'CLOUD // HYPERSCALE',
        code: 'NODE://ANYCAST_MESH',
        category: 'domain',
        color: '#0070f3',
        coords: new THREE.Vector3(-14, 1.8, 4),
        description: 'Multi-region distributed infrastructure, serverless clustering, and planetary scale systems.',
        details: 'Resilient architectures handling cascading multi-region failovers.',
        status: 'ACTIVE',
        targetAnchor: '#domains',
        discovered: false,
      },
      {
        id: 'domain_web3',
        title: 'WEB3 // PROTOCOLS',
        code: 'NODE://ZERO_KNOWLEDGE',
        category: 'domain',
        color: '#a855f7',
        coords: new THREE.Vector3(14, 1.8, 4),
        description: 'Decentralized state machines, cryptographic verification, and tokenized governance.',
        details: 'Sovereign distributed consensus and cryptographic proofs.',
        status: 'ACTIVE',
        targetAnchor: '#domains',
        discovered: false,
      },
      {
        id: 'domain_venture',
        title: 'ENTREPRENEURSHIP // FORGE',
        code: 'NODE://FOUNDER_CRAFT',
        category: 'domain',
        color: '#00e676',
        coords: new THREE.Vector3(0, 1.8, 14),
        description: 'Venture economics, deep-tech product market fit, and compounding generational velocity.',
        details: 'Translating breakthrough research into sovereign enterprises.',
        status: 'ACTIVE',
        targetAnchor: '#domains',
        discovered: false,
      },

      // 3. Event Experiences & Arenas (Radius ~20-25)
      {
        id: 'exp_arena',
        title: 'THE ARENA // HACKATHON',
        code: 'EXP://TOP_5_BUILD',
        category: 'experience',
        color: '#00f0ff',
        coords: new THREE.Vector3(-22, 2.0, -8),
        description: 'Top 5 Hackathon builders battle to engineer full-stack systems under intense live pressure.',
        details: '48-hour build crucible pushing architectural limits.',
        status: 'ACTIVE',
        targetAnchor: '#rootify',
        discovered: false,
      },
      {
        id: 'exp_breach',
        title: 'THE BREACH // CTF',
        code: 'EXP://TOP_5_HACK',
        category: 'experience',
        color: '#ff1f43',
        coords: new THREE.Vector3(22, 2.0, -8),
        description: 'Top 5 CTF teams infiltrate sovereign targets in live red/blue team combat.',
        details: 'Offensive weaponization and live kernel hardening.',
        status: 'ACTIVE',
        targetAnchor: '#rootify',
        discovered: false,
      },
      {
        id: 'exp_signal',
        title: 'THE SIGNAL // SESSIONS',
        code: 'EXP://DEEP_DOSSIER',
        category: 'experience',
        color: '#ff9800',
        coords: new THREE.Vector3(-20, 2.0, 16),
        description: 'Classified keynotes and closed-door masterclasses from industry architects.',
        details: 'Declassified research briefings and fireside dialogues.',
        status: 'ACTIVE',
        targetAnchor: '#journey',
        discovered: false,
      },
      {
        id: 'exp_forge',
        title: 'THE FORGE // WORKSHOPS',
        code: 'EXP://HANDS_ON',
        category: 'experience',
        color: '#00e676',
        coords: new THREE.Vector3(20, 2.0, 16),
        description: 'Live coding clinics, CTF walkthroughs, and autonomous agent orchestration labs.',
        details: 'Immediate practical immersion led by domain masters.',
        status: 'ACTIVE',
        targetAnchor: '#journey',
        discovered: false,
      },

      // 4. The Network / Strategic Collaborators (East Cluster)
      {
        id: 'comm_ace',
        title: 'ACE CLUB',
        code: 'NODE://ACE_01_VERIFIED',
        category: 'community',
        color: '#00f0ff',
        coords: new THREE.Vector3(-8, 1.8, 22),
        description: 'Articulation • Confidence • Expression. Premier student communication and executive leadership guild.',
        details: 'Official verified collaborator node in the ROOTIFYING network.',
        status: 'CONNECTED',
        subLabel: 'ARTICULATION • CONFIDENCE • EXPRESSION',
        partnerImage: '/assets/collaborators/ace_club.jpg',
        targetAnchor: '#partner',
        discovered: false,
      },
      {
        id: 'comm_fortixai',
        title: 'FORTIXAI SECURITY',
        code: 'NODE://FORTIXAI_02_VERIFIED',
        category: 'community',
        color: '#0070f3',
        coords: new THREE.Vector3(8, 1.8, 22),
        description: 'Offensive Cybersecurity and Threat Intelligence network safeguarding next-gen digital infrastructure.',
        details: 'Official verified collaborator node in the ROOTIFYING network.',
        status: 'CONNECTED',
        subLabel: 'OFFENSIVE CYBERSECURITY & THREAT INTEL',
        partnerImage: '/assets/collaborators/fortixai-security.png',
        targetAnchor: '#partner',
        discovered: false,
      },
      {
        id: 'comm_mystery_1',
        title: 'NODE 03 // CLASSIFIED',
        code: 'ENC://SIGNAL_PENDING_03',
        category: 'community',
        color: '#ffffff',
        coords: new THREE.Vector3(0, 1.8, 27),
        description: 'Encrypted partner signal detected on frequency 0x03. Identity reveal coming soon.',
        details: 'Verification in progress across campus network nodes.',
        status: 'CLASSIFIED',
        targetAnchor: '#partner',
        discovered: false,
      },
    ];

    // Build 3D visuals for each node
    this.buildNodes();

    // Line from hacker to active node
    this.hackerLineGeo = new THREE.BufferGeometry();
    this.hackerLineGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(6), 3)
    );
    const hackerLineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      linewidth: 2,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.hackerLine = new THREE.Line(this.hackerLineGeo, hackerLineMat);
    this.group.add(this.hackerLine);

    // Network line segments between discovered nodes
    this.networkLineGeo = new THREE.BufferGeometry();
    const maxSegments = this.nodes.length * this.nodes.length;
    this.networkLineGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(maxSegments * 6), 3)
    );
    const networkLineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    this.networkLineSegments = new THREE.LineSegments(
      this.networkLineGeo,
      networkLineMat
    );
    this.group.add(this.networkLineSegments);

    scene.add(this.group);
  }

  /**
   * Helper to create billboard sprite text for nodes
   */
  private createLabelSprite(text: string, color: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(4, 5, 8, 0.85)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.roundRect(8, 8, 368, 80, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 192, 48);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.2, 0.8, 1);
    return sprite;
  }

  /**
   * Build the 3D representation for each node
   */
  private buildNodes() {
    this.nodes.forEach((node) => {
      const container = new THREE.Group();
      container.position.copy(node.coords);

      const colorVal = new THREE.Color(node.color);

      // 1. Glowing Core (Octahedron or Icosahedron)
      const coreGeo =
        node.category === 'gate'
          ? new THREE.TorusGeometry(3.5, 0.25, 16, 40)
          : new THREE.OctahedronGeometry(0.55, 0);

      const coreMat = new THREE.MeshStandardMaterial({
        color: colorVal,
        emissive: colorVal,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.8,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      container.add(core);

      // 2. Outer Rotating Cyber Ring
      const ringGeo = new THREE.TorusGeometry(
        node.category === 'gate' ? 4.8 : 1.1,
        0.04,
        8,
        28
      );
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorVal,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      container.add(ring);

      // 3. Vertical Beacon Laser Pillar
      const pillarHeight = node.category === 'gate' ? 18 : 9;
      const pillarGeo = new THREE.CylinderGeometry(0.04, 0.04, pillarHeight, 8);
      const pillarMat = new THREE.MeshBasicMaterial({
        color: colorVal,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.y = pillarHeight / 2;
      container.add(pillar);

      // 4. Ground Telemetry Hex Marker
      const hexGeo = new THREE.CircleGeometry(
        node.category === 'gate' ? 4.5 : 1.4,
        6
      );
      const hexMat = new THREE.MeshBasicMaterial({
        color: colorVal,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const hex = new THREE.Mesh(hexGeo, hexMat);
      hex.rotation.x = -Math.PI / 2;
      hex.position.y = -node.coords.y + 0.05;
      container.add(hex);

      // 5. Billboard Label
      const labelSprite = this.createLabelSprite(node.title, node.color);
      labelSprite.position.y = node.category === 'gate' ? 4.2 : 1.8;
      container.add(labelSprite);

      this.group.add(container);

      this.nodeMeshes.push({
        data: node,
        container,
        core,
        ring,
        pillar,
        labelSprite,
      });
    });
  }

  /**
   * Update rotation, proximity detection with player, and network connecting lines
   */
  public update(delta: number, hackerPos: THREE.Vector3) {
    let closestNode: WorldNodeData | null = null;
    let minDistance = 5.5; // Trigger proximity threshold

    // 1. Rotate nodes and check distance
    this.nodeMeshes.forEach((meshObj) => {
      const node = meshObj.data;
      meshObj.core.rotation.y += delta * 1.2;
      meshObj.core.rotation.x += delta * 0.6;
      meshObj.ring.rotation.z += delta * 1.5;

      // Distance to hacker
      const dist = hackerPos.distanceTo(node.coords);
      if (dist < minDistance) {
        minDistance = dist;
        closestNode = node;
        node.discovered = true;
      }
    });

    // 2. Handle active proximity trigger
    if (closestNode !== this.activeNodeId) {
      this.activeNodeId = closestNode ? (closestNode as WorldNodeData).id : null;
      if (this.onNodeProximityChange) {
        this.onNodeProximityChange(closestNode);
      }
    }

    // 3. Update Laser Line between Hacker & Closest Active Node
    if (closestNode) {
      const linePos = (this.hackerLineGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
      linePos[0] = hackerPos.x;
      linePos[1] = hackerPos.y + 1.2;
      linePos[2] = hackerPos.z;

      linePos[3] = (closestNode as WorldNodeData).coords.x;
      linePos[4] = (closestNode as WorldNodeData).coords.y;
      linePos[5] = (closestNode as WorldNodeData).coords.z;

      this.hackerLineGeo.attributes.position.needsUpdate = true;
      (this.hackerLine.material as THREE.LineBasicMaterial).opacity = 0.85;
      (this.hackerLine.material as THREE.LineBasicMaterial).color.set(
        (closestNode as WorldNodeData).color
      );
    } else {
      (this.hackerLine.material as THREE.LineBasicMaterial).opacity = 0;
    }

    // 4. Rebuild Inter-Node Network Lines among Discovered Nodes
    this.updateNetworkLines();
  }

  /**
   * Connects lines between discovered nodes to reveal the growing ecosystem
   */
  private updateNetworkLines() {
    const discovered = this.nodes.filter((n) => n.discovered);
    const lineArray = (this.networkLineGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
    let ptr = 0;

    for (let i = 0; i < discovered.length; i++) {
      for (let j = i + 1; j < discovered.length; j++) {
        const n1 = discovered[i];
        const n2 = discovered[j];
        const dist = n1.coords.distanceTo(n2.coords);

        // Connect if reasonable distance
        if (dist < 26) {
          lineArray[ptr++] = n1.coords.x;
          lineArray[ptr++] = n1.coords.y;
          lineArray[ptr++] = n1.coords.z;

          lineArray[ptr++] = n2.coords.x;
          lineArray[ptr++] = n2.coords.y;
          lineArray[ptr++] = n2.coords.z;
        }
      }
    }

    // Clear remainder
    for (let k = ptr; k < lineArray.length; k++) {
      lineArray[k] = 0;
    }

    this.networkLineGeo.attributes.position.needsUpdate = true;
    this.networkLineGeo.setDrawRange(0, ptr / 3);
  }

  public getDiscoveredCount(): number {
    return this.nodes.filter((n) => n.discovered).length;
  }

  public getTotalNodes(): number {
    return this.nodes.length;
  }

  public dispose(scene: THREE.Scene) {
    scene.remove(this.group);
  }
}
