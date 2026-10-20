import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Video,
  X,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../utils/audio';

export type RoleCategory = 'all' | 'speakers' | 'organisers' | 'mentors' | 'judges' | 'partners';

export interface NetworkProfile {
  id: string;
  name: string;
  roleCategories: ('speakers' | 'organisers' | 'mentors' | 'judges' | 'partners')[];
  eventRole: string;
  organization: string;
  domain: string;
  domainColor: string;
  image: string;
  imagePosition?: string;
  bio: string;
  topics?: string[];
  videoUrl?: string; // Optional direct mp4/webm video of creator
  videoEmbed?: string; // Optional youtube/vimeo embed URL
  videoTitle?: string;
  externalLink?: string;
  externalLinkLabel?: string;
  hash: string;
  // Normalized base coordinates on a 1000 x 660 virtual space
  x: number;
  y: number;
  radius: number;
  // Dynamic floating physics
  driftPhase: number;
  driftSpeed: number;
  driftRadius: number;
  ringColor: string;
}

interface ConnectionLine {
  fromId: string;
  toId: string;
  color: string;
  width: number;
  speed: number;
}

export const RootifyNetworkSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<RoleCategory>('all');
  const [selectedProfile, setSelectedProfile] = useState<NetworkProfile | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'canvas' | 'cards'>('canvas');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Profiles Database (Confirmed Participants & Verified Organisers)
  const profiles: NetworkProfile[] = useMemo(
    () => [
      {
        id: 'node-yatin',
        name: 'Yatin Batra',
        roleCategories: ['speakers', 'mentors'],
        eventRole: 'Keynote Architect & Tech Mentor',
        organization: 'Valeo Health ME • Scalable Systems & Agentic AI',
        domain: 'Artificial Intelligence & Scalability',
        domainColor: '#00f0ff',
        ringColor: '#00f0ff',
        image: '/assets/speakers/yatin-batra.jpg',
        bio: 'Software Engineer II specializing in Scalable Systems, Mobile Architecture & Agentic AI Development (ADK, A2A, LLM Workflows). Deep production expertise across Kotlin, Flutter, and Java for mission-critical platforms.',
        topics: [
          'Agentic AI Development (ADK, A2A, LLM Workflows)',
          'Scalable Systems & Distributed Architectures',
          'High-Performance Mobile Client Architecture',
        ],
        externalLink: 'https://www.commudle.com/fill-form/5141',
        externalLinkLabel: 'Register to Attend Session',
        hash: '0x9B2A...E47C',
        x: 320,
        y: 200,
        radius: 38,
        driftPhase: 0,
        driftSpeed: 0.0015,
        driftRadius: 8,
      },
      {
        id: 'node-monica',
        name: 'Monica Sodhi',
        roleCategories: ['speakers', 'mentors'],
        eventRole: 'Executive Communication Trainer',
        organization: 'GL Bajaj Institute of Technology & Management',
        domain: 'Leadership & Articulation',
        domainColor: '#ec4899',
        ringColor: '#ec4899',
        image: '/assets/speakers/monica-sodhi.jpg',
        imagePosition: 'center top',
        bio: 'Communication and Soft Skills Specialist at GL Bajaj Institute of Technology and Management. Expert in executive articulation, high-impact technical storytelling, interview mastery, and professional leadership for emerging engineering talent.',
        topics: [
          'Executive Communication & Technical Articulation',
          'Soft Skills Mastery & Leadership Presence',
          'Industry Readiness & High-Stakes Pitching',
        ],
        externalLink: 'https://www.commudle.com/fill-form/5141',
        externalLinkLabel: 'Connect at GL Bajaj Workshop',
        hash: '0x7C1D...8E42',
        x: 680,
        y: 200,
        radius: 38,
        driftPhase: 1.6,
        driftSpeed: 0.0013,
        driftRadius: 7,
      },
      {
        id: 'node-azim',
        name: 'Azim Siddiqui',
        roleCategories: ['speakers', 'mentors'],
        eventRole: 'Senior Android Engineer & Founder',
        organization: 'Building Thecodingshef • Ex-Blinkit · ShareChat · Nagarro',
        domain: 'Mobile Engineering & Entrepreneurship',
        domainColor: '#00e676',
        ringColor: '#00e676',
        image: '/assets/speakers/azim-siddiqui.jpg',
        bio: 'Senior Android Engineer and Tech Speaker building Thecodingshef. Ex-Blinkit, ShareChat, and Nagarro with extensive experience architecting hyperscale mobile applications, low-latency client performance, and mentoring developer communities.',
        topics: [
          'Android Engineering & Low-Latency Rendering',
          'Bootstrapping Thecodingshef & Tech Speaking',
          'Hyperscale Systems: Ex-Blinkit · ShareChat · Nagarro',
        ],
        externalLink: 'https://thecodingshef.in',
        externalLinkLabel: 'Visit Thecodingshef',
        hash: '0x5D3E...91AF',
        x: 180,
        y: 350,
        radius: 36,
        driftPhase: 3.1,
        driftSpeed: 0.0016,
        driftRadius: 9,
      },
      {
        id: 'node-yash',
        name: 'Yash Pratap Singh',
        roleCategories: ['speakers'],
        eventRole: 'Full-Stack Engineer & AI Builder',
        organization: 'ML Researcher • Node.js · Java · SQL',
        domain: 'Applied ML & Automation',
        domainColor: '#00f0ff',
        ringColor: '#00f0ff',
        image: '/assets/speakers/yash-pratap-singh.png',
        imagePosition: 'center top',
        bio: 'Full-Stack Engineer, AI & Automation Builder, and Machine Learning Researcher. Dedicated to engineering high-performance automated systems, resilient backend microservices with Node.js, Java, and SQL, and applied ML problem solving.',
        topics: [
          'AI & Intelligent Workflow Automation',
          'Full-Stack Scalability: Node.js · Java · SQL',
          'Applied ML Research & Product Engineering',
        ],
        externalLink: 'https://www.commudle.com/fill-form/5141',
        externalLinkLabel: 'Register for Keynote',
        hash: '0x8A2C...F930',
        x: 820,
        y: 350,
        radius: 36,
        driftPhase: 4.2,
        driftSpeed: 0.0014,
        driftRadius: 8,
      },
      {
        id: 'node-adarsh',
        name: 'Adarsh Chauhan',
        roleCategories: ['speakers', 'organisers', 'judges'],
        eventRole: 'Gen AI Expert & Co-Organiser',
        organization: 'Founder @Events INFO • IBM Ambassador',
        domain: 'Generative AI & Hackathon Ecosystems',
        domainColor: '#38bdf8',
        ringColor: '#38bdf8',
        image: '/assets/speakers/adarsh-chauhan.jpg',
        imagePosition: 'center top',
        bio: 'Generative AI Expert, Founder at Events INFO, and official IBM Ambassador. Championing AI-native development, enterprise foundation models, and scaling technical community hackathons across premier engineering institutions.',
        topics: [
          'Generative AI Architectures & Foundation Models',
          'AI-Native Coding & Enterprise Systems',
          'Scaling Developer Ecosystems & Hackathons',
        ],
        externalLink: 'https://www.commudle.com/fill-form/5141',
        externalLinkLabel: 'Connect via Events INFO',
        hash: '0x6C4F...B129',
        x: 320,
        y: 500,
        radius: 38,
        driftPhase: 2.4,
        driftSpeed: 0.0017,
        driftRadius: 8,
      },
      {
        id: 'node-aditya',
        name: 'Aditya Singh',
        roleCategories: ['speakers', 'mentors'],
        eventRole: 'Cybersecurity Specialist & Mentor',
        organization: 'Infrastructure Specialist @Kyndryl • Top 5% TryHackMe',
        domain: 'Cybersecurity & Threat Defense',
        domainColor: '#ff1f43',
        ringColor: '#ff1f43',
        image: '/assets/speakers/aditya-singh.jpg',
        imagePosition: 'center top',
        bio: 'Infrastructure Specialist at Kyndryl and Cybersecurity Researcher ranked in the Top 5% globally on TryHackMe. Specializing in enterprise infrastructure defense, attack-surface hardening, and mission-critical hybrid cloud security.',
        topics: [
          'Enterprise Infrastructure & Hybrid Cloud Security',
          'Offensive Exploitation & Threat Surface Hardening',
          'Global CTF & Defensive Operations',
        ],
        externalLink: 'https://www.commudle.com/fill-form/5141',
        externalLinkLabel: 'Register for Cyber Track',
        hash: '0x3F81...A92D',
        x: 680,
        y: 500,
        radius: 38,
        driftPhase: 5.1,
        driftSpeed: 0.0015,
        driftRadius: 7,
      },
      {
        id: 'node-tygn',
        name: 'TYGN Council',
        roleCategories: ['organisers'],
        eventRole: 'Host & Organising Community',
        organization: 'TYGN B.Tech Student Community',
        domain: 'Student Leadership & Engineering',
        domainColor: '#ff9800',
        ringColor: '#ff9800',
        image: '/assets/logos/tygn-logo.png',
        bio: 'The student developer and engineering community organizing FILTERING ZEROES: ROOTIFYING. Dedicated to first-principles thinking, competitive programming, and technical problem-solving.',
        topics: ['Community Governance', 'Phase 01–06 Roadmap Management', 'Student Mentorship'],
        externalLink: 'https://filtering-zeroes-rootifying.vercel.app/',
        externalLinkLabel: 'Official Community Portal',
        hash: '0xTYGN...0001',
        x: 500,
        y: 130,
        radius: 35,
        driftPhase: 0.8,
        driftSpeed: 0.0012,
        driftRadius: 6,
      },
      {
        id: 'node-eventsinfo',
        name: 'Events INFO',
        roleCategories: ['organisers', 'partners'],
        eventRole: 'Co-Organiser & Management Patron',
        organization: 'Global Event Management & Tech Ecosystems',
        domain: 'Hackathon & Ecosystem Direction',
        domainColor: '#00e676',
        ringColor: '#00e676',
        image: '/assets/logos/eventsinfo-logo.png',
        bio: 'Premier technology event management organisation powering student hackathons, developer roundtables, and nationwide innovation summits.',
        topics: ['National Hackathon Operations', 'Industry Sponsorships', 'Ecosystem Growth'],
        externalLink: 'https://www.commudle.com/fill-form/5141',
        externalLinkLabel: 'Explore Partner Hub',
        hash: '0xEVNT...7788',
        x: 500,
        y: 570,
        radius: 35,
        driftPhase: 3.8,
        driftSpeed: 0.0013,
        driftRadius: 6,
      },
      {
        id: 'node-ace',
        name: 'ACE Club',
        roleCategories: ['partners'],
        eventRole: 'Venue & Collaborative Partner',
        organization: 'GL Bajaj Institute of Technology & Management',
        domain: 'Campus Articulation & Logistics',
        domainColor: '#22d3ee',
        ringColor: '#22d3ee',
        image: '/assets/logos/tygn-logo.png',
        bio: 'Official student organization partner at GL Bajaj Institute of Technology & Management, supporting campus facilitation, participant articulation, and on-ground logistics.',
        topics: ['On-Ground Campus Operations', 'Student Engagement', 'Session Moderation'],
        externalLink: 'https://www.commudle.com/fill-form/5141',
        externalLinkLabel: 'Opening Workshop Venue',
        hash: '0xACEG...1102',
        x: 130,
        y: 200,
        radius: 32,
        driftPhase: 2.1,
        driftSpeed: 0.0016,
        driftRadius: 7,
      },
      {
        id: 'node-asione',
        name: 'ASI:ONE Ghaziabad',
        roleCategories: ['partners'],
        eventRole: 'Verified Networking Partner',
        organization: 'AI Innovation Hub & Sponsor',
        domain: 'Sponsorship & Ecosystem Support',
        domainColor: '#eab308',
        ringColor: '#eab308',
        image: '/assets/collaborators/asi-one-ghaziabad.png',
        bio: 'Official Networking Partner and sponsor backing artificial intelligence innovation, developer community empowerment, and cross-campus engineering talent.',
        topics: ['AI Community Grants', 'Ecosystem Networking', 'Mentorship Support'],
        externalLink: 'https://www.commudle.com/fill-form/5141',
        externalLinkLabel: 'Partner Showcase',
        hash: '0xASIO...9941',
        x: 870,
        y: 200,
        radius: 32,
        driftPhase: 4.9,
        driftSpeed: 0.0015,
        driftRadius: 7,
      },
    ],
    []
  );

  // Central ROOTIFY Core Hub Definition
  const rootifyCore = useMemo(
    () => ({
      id: 'root-core',
      name: 'ROOTIFY',
      title: 'CENTRAL INTELLIGENCE HUB',
      sub: 'Born in the 0. Resurrected in the 1.',
      x: 500,
      y: 350,
      radius: 48,
    }),
    []
  );

  // Interconnected Network Mesh Lines with Animated Travelling Packets
  const connections: ConnectionLine[] = useMemo(
    () => [
      // Core hub radials
      { fromId: 'root-core', toId: 'node-tygn', color: '#ff9800', width: 2.0, speed: 0.0022 },
      { fromId: 'root-core', toId: 'node-eventsinfo', color: '#00e676', width: 2.0, speed: 0.0022 },
      { fromId: 'root-core', toId: 'node-yatin', color: '#00f0ff', width: 2.2, speed: 0.0026 },
      { fromId: 'root-core', toId: 'node-monica', color: '#ec4899', width: 2.2, speed: 0.0024 },
      { fromId: 'root-core', toId: 'node-azim', color: '#00e676', width: 2.0, speed: 0.0022 },
      { fromId: 'root-core', toId: 'node-yash', color: '#00f0ff', width: 2.0, speed: 0.0025 },
      { fromId: 'root-core', toId: 'node-adarsh', color: '#38bdf8', width: 2.0, speed: 0.0023 },
      { fromId: 'root-core', toId: 'node-aditya', color: '#ff1f43', width: 2.2, speed: 0.0024 },

      // Peer interconnections
      { fromId: 'node-yatin', toId: 'node-yash', color: '#00f0ff', width: 1.3, speed: 0.0016 },
      { fromId: 'node-yatin', toId: 'node-adarsh', color: '#38bdf8', width: 1.3, speed: 0.0019 },
      { fromId: 'node-monica', toId: 'node-tygn', color: '#ec4899', width: 1.3, speed: 0.0015 },
      { fromId: 'node-aditya', toId: 'node-yatin', color: '#ff1f43', width: 1.4, speed: 0.0021 },
      { fromId: 'node-azim', toId: 'node-yatin', color: '#00e676', width: 1.3, speed: 0.0018 },
      { fromId: 'node-azim', toId: 'node-ace', color: '#22d3ee', width: 1.1, speed: 0.0014 },
      { fromId: 'node-yash', toId: 'node-asione', color: '#eab308', width: 1.2, speed: 0.0017 },
      { fromId: 'node-adarsh', toId: 'node-eventsinfo', color: '#00e676', width: 1.4, speed: 0.0021 },
      { fromId: 'node-aditya', toId: 'node-eventsinfo', color: '#ff1f43', width: 1.2, speed: 0.0016 },
      { fromId: 'node-tygn', toId: 'node-ace', color: '#ff9800', width: 1.1, speed: 0.0013 },
    ],
    []
  );

  // Preload profile photos for smooth canvas rendering
  useEffect(() => {
    profiles.forEach((p) => {
      if (!loadedImagesRef.current.has(p.image)) {
        const img = new Image();
        img.src = p.image;
        img.onload = () => {
          loadedImagesRef.current.set(p.image, img);
        };
      }
    });
  }, [profiles]);

  // Close profile modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProfile) {
        sound.playHoverClick();
        setSelectedProfile(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProfile]);

  // Main Canvas Rendering & Continuous Moving Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = Math.max(580, Math.min(760, rect.width * 0.65)) * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${canvas.height / dpr}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Scale virtual coords (1000 x 660) to actual canvas dimensions
      const scaleX = width / 1000;
      const scaleY = height / 660;

      if (!prefersReducedMotion) {
        time += 1;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Starry / Cosmic Cyber Background Grids
      ctx.fillStyle = '#06080E';
      ctx.fillRect(0, 0, width, height);

      // Subtle Cyber Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Compute dynamic floating node positions with smooth sinusoidal drift
      const dynamicNodes = new Map<string, { x: number; y: number; r: number; profile: NetworkProfile }>();

      profiles.forEach((p) => {
        const drift = prefersReducedMotion
          ? { x: 0, y: 0 }
          : {
              x: Math.cos(time * p.driftSpeed + p.driftPhase) * p.driftRadius,
              y: Math.sin(time * p.driftSpeed * 1.2 + p.driftPhase) * p.driftRadius,
            };

        const screenX = (p.x + drift.x) * scaleX;
        const screenY = (p.y + drift.y) * scaleY;
        const screenR = p.radius * Math.min(scaleX, scaleY);

        dynamicNodes.set(p.id, {
          x: screenX,
          y: screenY,
          r: screenR,
          profile: p,
        });
      });

      // Central ROOTIFY Core coordinates
      const coreX = rootifyCore.x * scaleX;
      const coreY = rootifyCore.y * scaleY;
      const coreR = rootifyCore.radius * Math.min(scaleX, scaleY);

      // 2. Draw Connection Lines and Traveling Laser Data Packets
      connections.forEach((conn) => {
        let p1 = { x: coreX, y: coreY };
        let p2 = { x: coreX, y: coreY };

        if (conn.fromId === 'root-core') {
          p1 = { x: coreX, y: coreY };
        } else if (dynamicNodes.has(conn.fromId)) {
          const n = dynamicNodes.get(conn.fromId)!;
          p1 = { x: n.x, y: n.y };
        }

        if (conn.toId === 'root-core') {
          p2 = { x: coreX, y: coreY };
        } else if (dynamicNodes.has(conn.toId)) {
          const n = dynamicNodes.get(conn.toId)!;
          p2 = { x: n.x, y: n.y };
        }

        // Determine if connection is active based on filter
        const fromProfile = profiles.find((p) => p.id === conn.fromId);
        const toProfile = profiles.find((p) => p.id === conn.toId);

        const fromMatches =
          activeFilter === 'all' ||
          conn.fromId === 'root-core' ||
          (fromProfile && fromProfile.roleCategories.includes(activeFilter as any));

        const toMatches =
          activeFilter === 'all' ||
          conn.toId === 'root-core' ||
          (toProfile && toProfile.roleCategories.includes(activeFilter as any));

        const isHighlighted =
          hoveredNodeId === conn.fromId ||
          hoveredNodeId === conn.toId ||
          (hoveredNodeId === 'root-core' && (conn.fromId === 'root-core' || conn.toId === 'root-core'));

        const isFilteredOut = !fromMatches && !toMatches;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (isHighlighted) {
          ctx.strokeStyle = conn.color;
          ctx.lineWidth = conn.width * 2.2;
          ctx.shadowColor = conn.color;
          ctx.shadowBlur = 14;
        } else if (isFilteredOut) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 1;
        } else {
          ctx.strokeStyle = `${conn.color}45`; // 28% opacity
          ctx.lineWidth = conn.width;
        }
        ctx.stroke();
        ctx.restore();

        // Traveling Animated Data Packet moving along line
        if (!prefersReducedMotion && (!isFilteredOut || isHighlighted)) {
          const progress = (time * conn.speed) % 1;
          const packetX = p1.x + (p2.x - p1.x) * progress;
          const packetY = p1.y + (p2.y - p1.y) * progress;

          ctx.save();
          ctx.beginPath();
          ctx.arc(packetX, packetY, isHighlighted ? 3.5 : 2.4, 0, Math.PI * 2);
          ctx.fillStyle = isHighlighted ? '#ffffff' : conn.color;
          ctx.shadowColor = conn.color;
          ctx.shadowBlur = isHighlighted ? 15 : 8;
          ctx.fill();
          ctx.restore();
        }
      });

      // 3. Draw Central ROOTIFY Hub Node with Multi-ring Pulsing Shields
      ctx.save();
      const pulse1 = Math.sin(time * 0.035) * 6;
      const pulse2 = Math.cos(time * 0.025) * 10;

      // Outer dashed shield rings
      ctx.beginPath();
      ctx.arc(coreX, coreY, coreR + 18 + pulse1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(coreX, coreY, coreR + 32 + pulse2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 31, 67, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Central Orb Gradient Fill
      const coreGrad = ctx.createRadialGradient(coreX, coreY, 5, coreX, coreY, coreR);
      coreGrad.addColorStop(0, '#121722');
      coreGrad.addColorStop(0.7, '#07090D');
      coreGrad.addColorStop(1, '#00f0ff');

      ctx.beginPath();
      ctx.arc(coreX, coreY, coreR, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Core Branding Text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${Math.max(12, Math.round(15 * scaleX))}px "Orbitron", sans-serif`;
      ctx.fillText('ROOTIFY', coreX, coreY - 4);

      ctx.fillStyle = '#22d3ee';
      ctx.font = `700 ${Math.max(8, Math.round(9 * scaleX))}px "JetBrains Mono", monospace`;
      ctx.fillText('CORE HUB', coreX, coreY + 12);
      ctx.restore();

      // 4. Draw Individual Profile Nodes with 3D Tilted Orbital Rings
      dynamicNodes.forEach((node, id) => {
        const { x, y, r, profile } = node;
        const matchesFilter =
          activeFilter === 'all' || profile.roleCategories.includes(activeFilter as any);
        const isHovered = hoveredNodeId === id;
        const isSelected = selectedProfile?.id === id;

        const opacity = matchesFilter ? (isHovered || isSelected ? 1 : 0.95) : 0.22;

        ctx.save();
        ctx.globalAlpha = opacity;

        // Tilted Elliptical Orbital Ring (Directly inspired by reference screenshot)
        const ringAngle = time * 0.016 + profile.driftPhase;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ringAngle);
        ctx.beginPath();
        ctx.ellipse(0, 0, r + 15, (r + 15) * 0.44, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered || isSelected ? profile.ringColor : `${profile.ringColor}75`;
        ctx.lineWidth = isHovered || isSelected ? 2.5 : 1.5;
        if (isHovered || isSelected) {
          ctx.shadowColor = profile.ringColor;
          ctx.shadowBlur = 18;
        }
        ctx.stroke();
        ctx.restore();

        // Outer Glow Halo
        ctx.beginPath();
        ctx.arc(x, y, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = `${profile.ringColor}18`;
        ctx.fill();

        // Node Circular Clipping for Profile Image
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.clip();

        const img = loadedImagesRef.current.get(profile.image);
        if (img && img.complete) {
          ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
        } else {
          // Initials Fallback
          ctx.fillStyle = '#161c2b';
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
          ctx.fillStyle = profile.domainColor;
          ctx.font = `bold ${Math.round(r * 0.65)}px "Orbitron", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const initials = profile.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2);
          ctx.fillText(initials, x, y);
        }
        ctx.restore();

        // Outer Ring Border
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered || isSelected ? '#ffffff' : profile.ringColor;
        ctx.lineWidth = isHovered || isSelected ? 3 : 2;
        if (isHovered || isSelected) {
          ctx.shadowColor = profile.ringColor;
          ctx.shadowBlur = 22;
        }
        ctx.stroke();

        // Node Label Pill below portrait
        const labelY = y + r + 14;
        ctx.font = `700 ${Math.max(10, Math.round(11 * scaleX))}px "Space Grotesk", sans-serif`;
        const textWidth = ctx.measureText(profile.name).width;

        // Background tag for high readability
        ctx.fillStyle = 'rgba(6, 8, 14, 0.9)';
        ctx.strokeStyle = isHovered ? profile.ringColor : 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 1;
        const padX = 8;
        const padY = 4;
        ctx.beginPath();
        ctx.roundRect(
          x - textWidth / 2 - padX,
          labelY - padY - 7,
          textWidth + padX * 2,
          16 + padY,
          4
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#F5F7FA';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(profile.name, x, labelY);

        ctx.restore();
      });

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [profiles, connections, rootifyCore, activeFilter, hoveredNodeId, selectedProfile]);

  // Handle Canvas Cursor Interaction & Click Detection
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const scaleX = rect.width / 1000;
      const scaleY = rect.height / 660;

      let foundId: string | null = null;

      for (const p of profiles) {
        const nx = p.x * scaleX;
        const ny = p.y * scaleY;
        const nr = p.radius * Math.min(scaleX, scaleY);

        const dist = Math.hypot(mouseX - nx, mouseY - ny);
        if (dist <= nr + 8) {
          foundId = p.id;
          break;
        }
      }

      if (!foundId) {
        const coreX = rootifyCore.x * scaleX;
        const coreY = rootifyCore.y * scaleY;
        const coreR = rootifyCore.radius * Math.min(scaleX, scaleY);
        if (Math.hypot(mouseX - coreX, mouseY - coreY) <= coreR) {
          foundId = 'root-core';
        }
      }

      setHoveredNodeId(foundId);
      canvas.style.cursor = foundId ? 'pointer' : 'default';
    },
    [profiles, rootifyCore]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const scaleX = rect.width / 1000;
      const scaleY = rect.height / 660;

      for (const p of profiles) {
        const nx = p.x * scaleX;
        const ny = p.y * scaleY;
        const nr = p.radius * Math.min(scaleX, scaleY);

        const dist = Math.hypot(mouseX - nx, mouseY - ny);
        if (dist <= nr + 12) {
          sound.playAccessGranted();
          setSelectedProfile(p);
          return;
        }
      }
    },
    [profiles]
  );

  // Filtered list for cards mode / mobile view
  const filteredProfiles = useMemo(() => {
    if (activeFilter === 'all') return profiles;
    return profiles.filter((p) => p.roleCategories.includes(activeFilter));
  }, [profiles, activeFilter]);

  const categories: { key: RoleCategory; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: profiles.length },
    { key: 'speakers', label: 'Speakers', count: profiles.filter((p) => p.roleCategories.includes('speakers')).length },
    { key: 'organisers', label: 'Organisers', count: profiles.filter((p) => p.roleCategories.includes('organisers')).length },
    { key: 'mentors', label: 'Mentors', count: profiles.filter((p) => p.roleCategories.includes('mentors')).length },
    { key: 'judges', label: 'Judges', count: profiles.filter((p) => p.roleCategories.includes('judges')).length },
    { key: 'partners', label: 'Partners', count: profiles.filter((p) => p.roleCategories.includes('partners')).length },
  ];

  return (
    <section
      id="network"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#040507] border-t border-cyber-border/60 overflow-hidden"
      aria-labelledby="network-heading"
    >
      {/* Target anchor for existing '#speakers' navigation */}
      <div id="speakers" className="sr-only" />

      {/* Subtle Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyber-cyan/8 blur-[160px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan font-mono text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            <span>PEOPLE. EXPERTISE. CONNECTIONS.</span>
          </div>

          <h2
            id="network-heading"
            className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase"
          >
            THE ROOTIFY <span className="text-cyber-cyan text-glow-cyan">NETWORK</span>
          </h2>

          <p className="mt-2 text-xl sm:text-2xl font-serif italic text-white/90">
            One Network. Many Possibilities.
          </p>

          <p className="mt-4 text-xs sm:text-sm text-white/70 font-mono tracking-wide leading-relaxed max-w-2xl">
            Meet the people and communities behind FILTERING ZEROES: ROOTIFYING. Explore the
            organisers, speakers, mentors and judges who contribute to our growing technology ecosystem.
          </p>

          <div className="w-16 h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-red mt-6" />
        </div>

        {/* Top Control Bar: Category Filter & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          {/* Category Tabs */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center"
            role="tablist"
            aria-label="Filter network nodes by category"
          >
            {categories.map((cat) => {
              const isActive = activeFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    sound.playHoverClick();
                    setActiveFilter(cat.key);
                  }}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl font-mono text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-cyber-cyan text-black font-extrabold shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                      : 'bg-[#0D1118] text-white/70 border border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Canvas / Card View Toggle */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-white/40 hidden md:inline">VIEW:</span>
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                viewMode === 'canvas'
                  ? 'border-cyber-cyan/50 bg-cyber-cyan/15 text-cyber-cyan'
                  : 'border-white/10 text-white/50 hover:text-white'
              }`}
            >
              HOLOGRAPHIC MESH
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'border-cyber-cyan/50 bg-cyber-cyan/15 text-cyber-cyan'
                  : 'border-white/10 text-white/50 hover:text-white'
              }`}
            >
              GRID DOSSIER
            </button>
          </div>
        </div>

        {/* Main Network Interactive Stage */}
        {viewMode === 'canvas' ? (
          <div
            ref={containerRef}
            className="relative w-full rounded-3xl border border-white/15 bg-[#05070A] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Top Telemetry HUD */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-3 pointer-events-none">
              <div className="px-3 py-1 rounded bg-black/85 border border-cyber-cyan/40 text-cyber-cyan font-mono text-[11px] flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
                <span>ROOTIFY TOPOLOGY // ONLINE</span>
              </div>
              <span className="text-[10px] font-mono text-white/40 hidden sm:inline">
                QUANTUM DATA STREAMS ACTIVE
              </span>
            </div>

            {/* Bottom Telemetry HUD */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-[11px] font-mono text-white/50">
              <div className="flex items-center gap-2 bg-black/70 px-3 py-1 rounded border border-white/10">
                <span className="text-brand-green font-bold">[ 10 VERIFIED NODES ]</span>
                <span className="hidden sm:inline">• TAP / CLICK ANY PROFILE TO DECLASSIFY</span>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-black/70 px-3 py-1 rounded border border-white/10 text-cyber-cyan">
                <span>PRESS [ESC] TO CLOSE DOSSIER</span>
              </div>
            </div>

            {/* Interactive HTML5 Moving Animated Canvas */}
            <canvas
              ref={canvasRef}
              onMouseMove={handleCanvasMouseMove}
              onClick={handleCanvasClick}
              className="w-full block select-none"
              style={{ touchAction: 'manipulation' }}
            />
          </div>
        ) : (
          /* Cards Grid Fallback / Mobile View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  sound.playAccessGranted();
                  setSelectedProfile(p);
                }}
                className="group p-6 rounded-2xl bg-[#0D1118]/90 border border-white/10 hover:border-cyber-cyan/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyber-cyan/60 p-0.5 group-hover:scale-105 transition-transform shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white group-hover:text-cyber-cyan transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xs font-mono text-cyber-cyan/80">{p.eventRole}</p>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-white/50 mb-2">{p.organization}</p>
                  <p className="text-xs text-[#AAB2C0] line-clamp-3 leading-relaxed mb-4">
                    {p.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/60">
                  <span className="text-[11px] text-cyber-cyan">{p.domain}</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Profile Cards Carousel Below Canvas on Mobile */}
        <div className="mt-8 md:hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-white/50 uppercase">
              TAP QUICK PROFILE DOSSIER:
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {filteredProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  sound.playAccessGranted();
                  setSelectedProfile(p);
                }}
                className="snap-start shrink-0 w-64 p-4 rounded-xl bg-[#0D1118] border border-white/10 text-left hover:border-cyber-cyan cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover border border-cyber-cyan/50"
                  />
                  <div>
                    <div className="font-display font-bold text-sm text-white">{p.name}</div>
                    <div className="text-[10px] font-mono text-cyber-cyan">{p.eventRole}</div>
                  </div>
                </div>
                <div className="text-[11px] text-[#AAB2C0] line-clamp-2 leading-relaxed">
                  {p.organization}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accessible Profile Detail Modal Dialog with Video Preview Option */}
      {selectedProfile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-profile-name"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => {
            sound.playHoverClick();
            setSelectedProfile(null);
          }}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-[#0A0D14] border-2 border-cyber-cyan/50 p-6 sm:p-8 shadow-[0_0_60px_rgba(34,211,238,0.25)] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                sound.playHoverClick();
                setSelectedProfile(null);
              }}
              aria-label="Close Profile Dossier"
              className="absolute top-6 right-6 z-10 p-2 rounded-xl bg-white/5 border border-white/15 text-white/70 hover:text-white hover:border-cyber-red hover:bg-cyber-red/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* VIDEO PLAYER OPTION (Directly inspired by media_1792494722989.png) */}
            {selectedProfile.videoUrl ? (
              <div className="relative w-full rounded-2xl overflow-hidden border border-cyber-cyan/40 bg-black aspect-video mb-6 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
                <video
                  src={selectedProfile.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            ) : selectedProfile.videoEmbed ? (
              <div className="relative w-full rounded-2xl overflow-hidden border border-cyber-cyan/40 bg-black aspect-video mb-6 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
                <iframe
                  src={selectedProfile.videoEmbed}
                  title={`${selectedProfile.name} Keynote Teaser`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              /* Creator Video Teaser / Upload Status Bar */
              <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      CREATOR INTRO REEL
                    </div>
                    <div className="text-[11px] font-mono text-white/50">
                      Live session recorded video & keynote stream pending upload
                    </div>
                  </div>
                </div>

                <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-black/60 border border-white/15 font-mono text-[10px] text-brand-green font-bold tracking-wider">
                  [ IN PRODUCTION ]
                </span>
              </div>
            )}

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 pb-6 border-b border-white/10">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cyber-cyan p-1 bg-black/60 shadow-[0_0_25px_rgba(34,211,238,0.3)] shrink-0">
                <img
                  src={selectedProfile.image}
                  alt={selectedProfile.name}
                  className="w-full h-full object-cover rounded-xl"
                  style={{ objectPosition: selectedProfile.imagePosition || 'center' }}
                />
              </div>

              <div className="text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
                  <CheckCircle2 className="w-3 h-3 text-cyber-cyan" />
                  <span>{selectedProfile.eventRole}</span>
                </div>

                <h3
                  id="modal-profile-name"
                  className="text-2xl sm:text-3xl font-display font-black text-white tracking-wide"
                >
                  {selectedProfile.name}
                </h3>

                <p className="text-xs sm:text-sm font-mono text-white/80 mt-1">
                  {selectedProfile.organization}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyber-cyan">
                    Domain: {selectedProfile.domain}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-white/40">
                    HASH: {selectedProfile.hash}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Biography */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/50 mb-2">
                VERIFIED BIOGRAPHY // PROFILE SUMMARY
              </h4>
              <p className="text-sm sm:text-base text-[#AAB2C0] leading-relaxed">
                {selectedProfile.bio}
              </p>
            </div>

            {/* Keynote Topics / Highlights (if available) */}
            {selectedProfile.topics && selectedProfile.topics.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-cyan mb-3">
                  KEYNOTE ARSENAL & CORE TOPICS
                </h4>
                <div className="space-y-2">
                  {selectedProfile.topics.map((t) => (
                    <div
                      key={t}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs sm:text-sm text-white/90"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
              <button
                onClick={() => setSelectedProfile(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white/70 font-mono text-xs uppercase hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                Close Dossier
              </button>

              {selectedProfile.externalLink && (
                <a
                  href={selectedProfile.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyber-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyber-red/90 transition-all shadow-[0_0_20px_rgba(255,48,79,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{selectedProfile.externalLinkLabel || 'View External Link'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RootifyNetworkSection;
