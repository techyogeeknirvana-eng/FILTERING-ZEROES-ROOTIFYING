import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import {
  Lock,
  X,
  Sparkles,
  Bot,
  Layers,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Mic,
  Users,
  Target,
  Rocket,
  Zap,
  Code,
} from 'lucide-react';

export interface KeynoteTopicDetail {
  title: string;
  description: string;
  iconName?: 'bot' | 'mobile' | 'layers' | 'mic' | 'users' | 'target' | 'sparkles' | 'rocket' | 'zap' | 'code';
}

export interface SpeakerSlot {
  id: string;
  domain: string;
  role: string;
  name?: string;
  organization?: string;
  image?: string;
  imagePosition?: string;
  topics?: string[];
  detailedTopics?: KeynoteTopicDetail[];
  bio?: string;
  color: string;
  hash: string;
  status: string;
  isUnlocked?: boolean;
}

export const SpeakersSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerSlot | null>(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedSpeaker) {
        sound.playHoverClick();
        setSelectedSpeaker(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSpeaker]);

  const speakerSlots: SpeakerSlot[] = [
    {
      id: 'sp-1',
      domain: 'AI',
      name: 'YATIN BATRA',
      role: 'Software Engineer II',
      organization: 'Valeo Health ME • Scalable Systems & Agentic AI',
      image: '/assets/speakers/yatin-batra.jpg',
      bio: 'Software Engineer II specializing in Scalable Systems, Mobile Architecture & Agentic AI Development (ADK, A2A, LLM Workflows). Deep production expertise across Kotlin, Flutter, and Java for mission-critical, intelligent digital health platforms.',
      topics: [
        'Agentic AI Development (ADK, A2A, LLM Workflows)',
        'Scalable Systems & Distributed Architectures',
        'Mobile Architecture (Kotlin · Flutter · Java)',
      ],
      detailedTopics: [
        {
          title: 'Agentic AI Development (ADK, A2A, LLM Workflows)',
          description:
            'Production multi-agent coordination, agent-to-agent (A2A) protocols, Agent Development Kits (ADK), and autonomous LLM reasoning workflows.',
          iconName: 'bot',
        },
        {
          title: 'Scalable Systems & Distributed Architectures',
          description:
            'Architecting distributed zero-downtime microservices, event-driven streaming pipelines, and fault-tolerant data integrity at scale.',
          iconName: 'layers',
        },
        {
          title: 'Mobile Architecture (Kotlin · Flutter · Java)',
          description:
            'High-performance native and cross-platform mobile architecture, reactive state management, and modern client-side design patterns.',
          iconName: 'mobile',
        },
      ],
      color: '#00f0ff',
      hash: '0x9B2A...E47C',
      status: 'DECLASSIFIED // CONFIRMED',
      isUnlocked: true,
    },
    {
      id: 'sp-2',
      domain: 'LEADERSHIP & SKILLS',
      name: 'MONICA SODHI',
      role: 'Communication & Soft Skills Trainer',
      organization: 'GL Bajaj Institute of Technology & Management',
      image: '/assets/speakers/monica-sodhi.jpg',
      imagePosition: 'center top',
      bio: 'Specialist in executive communication, high-impact technical storytelling, interview mastery, and professional articulation for top-tier engineering talent and emerging industry leaders.',
      topics: [
        'Executive Communication & Technical Articulation',
        'Soft Skills Mastery & Leadership Presence',
        'Industry Readiness & High-Stakes Pitching',
      ],
      detailedTopics: [
        {
          title: 'Executive Communication & Technical Articulation',
          description:
            'Translating complex algorithms, system architectures, and deep-tech into compelling narratives for stakeholders, executives, and cross-functional teams.',
          iconName: 'mic',
        },
        {
          title: 'Soft Skills Mastery & Leadership Presence',
          description:
            'Mastering high-stakes team dynamics, emotional intelligence, empathetic leadership, and cultivating commanding professional presence in engineering cultures.',
          iconName: 'users',
        },
        {
          title: 'Industry Readiness & High-Stakes Pitching',
          description:
            'Equipping builders for Tier-1 technical interviews, investor pitch decks, venture presentations, and real-time defense of complex technical proposals.',
          iconName: 'target',
        },
      ],
      color: '#ec4899',
      hash: '0x7C1D...8E42',
      status: 'DECLASSIFIED // CONFIRMED',
      isUnlocked: true,
    },
    {
      id: 'sp-3',
      domain: 'ENTREPRENEURSHIP',
      name: 'AZIM SIDDIQUI',
      role: 'Android Engineer & Tech Speaker',
      organization: 'Building Thecodingshef • Ex-Blinkit · ShareChat · Nagarro',
      image: '/assets/speakers/azim-siddiqui.jpg',
      bio: 'Android Engineer and Tech Speaker building Thecodingshef. Ex-Blinkit, ShareChat, and Nagarro with a track record of architecting hyper-scale consumer mobile systems, low-latency client performance, and mentoring developer communities.',
      topics: [
        'Android Engineering & Mobile Architecture',
        'Building Thecodingshef & Tech Speaking',
        'Hyperscale Systems: Ex-Blinkit · ShareChat · Nagarro',
      ],
      detailedTopics: [
        {
          title: 'Android Engineering & Mobile Architecture',
          description:
            'Architecting zero-latency rendering, minimal memory footprints, offline-first sync pipelines, and high-frame-rate mobile UX for millions of users.',
          iconName: 'mobile',
        },
        {
          title: 'Building Thecodingshef & Tech Speaking',
          description:
            'From first line of code to nationwide developer impact: bootstrapping Thecodingshef, technical keynote delivery, and community mentorship.',
          iconName: 'rocket',
        },
        {
          title: 'Hyperscale Systems: Ex-Blinkit · ShareChat · Nagarro',
          description:
            'Battle-hardened operational insights across instant commerce (Blinkit), viral social feeds (ShareChat), and enterprise systems (Nagarro).',
          iconName: 'zap',
        },
      ],
      color: '#00e676',
      hash: '0x5D3E...91AF',
      status: 'DECLASSIFIED // CONFIRMED',
      isUnlocked: true,
    },
    {
      id: 'sp-4',
      domain: 'AI',
      name: 'YASH PRATAP SINGH',
      role: 'Full-Stack Engineer & AI Builder',
      organization: 'ML Researcher • Node.js · Java · SQL',
      image: '/assets/speakers/yash-pratap-singh.png',
      imagePosition: 'center top',
      bio: 'Full-Stack Engineer, AI & Automation Builder, and Machine Learning Researcher. Dedicated to engineering high-performance automated systems, full-stack architectures with Node.js, Java, and SQL, and applied ML problem solving.',
      topics: [
        'AI & Intelligent Workflow Automation',
        'Full-Stack Scalability: Node.js · Java · SQL',
        'Applied ML Research & Product Engineering',
      ],
      detailedTopics: [
        {
          title: 'AI & Intelligent Workflow Automation',
          description:
            'Deploying automated agentic reasoning chains, intelligent workflows, and neural inference pipelines that solve mission-critical operational bottlenecks.',
          iconName: 'bot',
        },
        {
          title: 'Full-Stack Scalability: Node.js · Java · SQL',
          description:
            'High-throughput backend design, resilient microservices, optimized SQL relational schema indexing, and concurrency management.',
          iconName: 'code',
        },
        {
          title: 'Applied ML Research & Product Engineering',
          description:
            'Translating cutting-edge machine learning research into robust, production-ready software features and real-world product value.',
          iconName: 'layers',
        },
      ],
      color: '#00f0ff',
      hash: '0x8A2C...F930',
      status: 'DECLASSIFIED // CONFIRMED',
      isUnlocked: true,
    },
    {
      id: 'sp-5',
      domain: 'AI',
      name: 'ADARSH CHAUHAN',
      role: 'Gen AI Expert & IBM Ambassador',
      organization: 'Founder @Events INFO • IBM Ambassador',
      image: '/assets/speakers/adarsh-chauhan.jpg',
      imagePosition: 'center top',
      bio: 'Generative AI Expert, Founder at Events INFO, and official IBM Ambassador. Championing AI-native development, enterprise foundation models, and scaling technical community hackathons across premier engineering institutions.',
      topics: [
        'Generative AI Architectures & Foundation Models',
        'AI-Native Coding & Enterprise Systems (IBM Ambassador)',
        'Scaling Developer Ecosystems: Founder @Events INFO',
      ],
      detailedTopics: [
        {
          title: 'Generative AI Architectures & Foundation Models',
          description:
            'Deep dive into modern transformer pipelines, multi-modal reasoning, prompt orchestration, and building production-grade GenAI systems.',
          iconName: 'bot',
        },
        {
          title: 'AI-Native Coding & Enterprise Systems (IBM Ambassador)',
          description:
            'Enterprise AI adoption strategies, AI-assisted developer workflows, and the future of intelligent software engineering.',
          iconName: 'code',
        },
        {
          title: 'Scaling Developer Ecosystems: Founder @Events INFO',
          description:
            'Empowering builders nationwide through high-impact hackathons, developer roundtables, and nationwide tech initiatives.',
          iconName: 'rocket',
        },
      ],
      color: '#00f0ff',
      hash: '0x6C4F...B129',
      status: 'DECLASSIFIED // CONFIRMED',
      isUnlocked: true,
    },
    {
      id: 'sp-6',
      domain: 'CYBER',
      name: 'ADITYA SINGH',
      role: 'Infrastructure Specialist & Cyber Security',
      organization: 'Kyndryl • Top 5% TryHackMe',
      image: '/assets/speakers/aditya-singh.jpg',
      imagePosition: 'center top',
      bio: 'Infrastructure Specialist at Kyndryl and Cybersecurity Researcher ranked in the Top 5% globally on TryHackMe. Specializing in enterprise infrastructure defense, attack-surface hardening, and mission-critical hybrid cloud security.',
      topics: [
        'Enterprise Infrastructure & Hybrid Cloud Security',
        'Offensive Exploitation & Threat Surface Hardening',
        'Global CTF & Defensive Operations (Top 5% TryHackMe)',
      ],
      detailedTopics: [
        {
          title: 'Enterprise Infrastructure & Hybrid Cloud Security',
          description:
            'Hardening enterprise IT environments, incident containment, network zoning, and managing fault-tolerant infrastructure at Kyndryl.',
          iconName: 'target',
        },
        {
          title: 'Offensive Exploitation & Threat Surface Hardening',
          description:
            'Red-team attack vectors, vulnerability scanning, privilege escalation mitigation, and zero-trust security postures.',
          iconName: 'zap',
        },
        {
          title: 'Global CTF & Defensive Operations (Top 5% TryHackMe)',
          description:
            'Hands-on penetration testing methodologies, rapid vulnerability identification, and practical cyber warfare defense.',
          iconName: 'code',
        },
      ],
      color: '#ff1f43',
      hash: '0x3F81...A92D',
      status: 'DECLASSIFIED // CONFIRMED',
      isUnlocked: true,
    },
    {
      id: 'sp-7',
      domain: 'CLOUD',
      role: 'GLOBAL INFRASTRUCTURE PRINCIPAL',
      color: '#0070f3',
      hash: '0x88CC...F110',
      status: 'REVEALING SOON',
    },
    {
      id: 'sp-8',
      domain: 'CLOUD',
      role: 'SERVERLESS MESH PIONEER',
      color: '#0070f3',
      hash: '0x22B0...65EF',
      status: 'COMING SOON',
    },
  ];

  const filteredSlots =
    activeFilter === 'ALL'
      ? speakerSlots
      : speakerSlots.filter((s) => s.domain === activeFilter);

  const filters = ['ALL', 'AI', 'ENTREPRENEURSHIP', 'LEADERSHIP & SKILLS', 'CYBER', 'CLOUD'];

  const handleSpeakerClick = (sp: SpeakerSlot) => {
    if (sp.isUnlocked) {
      sound.playAccessGranted();
      setSelectedSpeaker(sp);
    } else {
      sound.playDenied();
    }
  };

  const renderTopicIcon = (iconName?: string, accentColor?: string) => {
    switch (iconName) {
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />;
      case 'bot':
        return <Bot className="w-5 h-5 text-cyber-red shrink-0 mt-0.5" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />;
      case 'mic':
        return <Mic className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accentColor || '#ec4899' }} />;
      case 'users':
        return <Users className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />;
      case 'target':
        return <Target className="w-5 h-5 text-cyber-red shrink-0 mt-0.5" />;
      case 'rocket':
        return <Rocket className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-cyber-yellow shrink-0 mt-0.5" />;
      case 'code':
        return <Code className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyber-cyan shrink-0 mt-0.5" />;
    }
  };

  return (
    <section
      id="speakers"
      className="relative py-28 px-4 sm:px-6 bg-[#040507] overflow-hidden border-t border-cyber-border/50"
    >
      <div className="absolute inset-0 scanline-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan font-mono text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            <span>KEYNOTE ARCHITECTS // LINEUP DECLASSIFIED</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase">
            THE <span className="text-cyber-cyan text-glow-cyan">MINDS</span>
          </h2>
          <p className="mt-4 font-serif italic text-xl sm:text-2xl text-white/90 tracking-wide max-w-2xl">
            “Four worlds. One stage. Questions that don't have easy answers.”
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-red my-6" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f);
                sound.playBeep(800, 0.02, 0.03);
              }}
              className={`px-4 py-1.5 rounded font-mono text-xs tracking-wider transition-all border ${
                activeFilter === f
                  ? 'border-white text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : 'border-cyber-border bg-cyber-surface/40 text-white/60 hover:text-white hover:border-white/30'
              }`}
              data-cursor="access"
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSlots.map((sp) => {
            if (sp.isUnlocked) {
              return (
                <div
                  key={sp.id}
                  className="group relative p-6 rounded-xl border-2 transition-all duration-300 backdrop-blur-md overflow-hidden flex flex-col justify-between min-h-[380px] hover:-translate-y-1 cursor-pointer"
                  style={{
                    borderColor: `${sp.color}80`,
                    boxShadow: `0 0 30px ${sp.color}25`,
                    background:
                      'linear-gradient(180deg, rgba(6,16,33,0.95) 0%, rgba(3,7,19,0.95) 60%, rgba(2,3,8,0.98) 100%)',
                  }}
                  data-cursor="access"
                  onClick={() => handleSpeakerClick(sp)}
                  title="Click to view keynote dossier"
                >
                  {/* Holographic sweep effect */}
                  <div
                    className="absolute inset-0 -translate-y-full group-hover:translate-y-full transition-transform duration-1000 pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, transparent, ${sp.color}15, transparent)`,
                    }}
                  />

                  {/* Header: Domain & Declassified Tag */}
                  <div className="flex items-center justify-between z-10">
                    <span
                      className="font-mono text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider"
                      style={{
                        backgroundColor: `${sp.color}20`,
                        color: sp.color,
                        border: `1px solid ${sp.color}60`,
                      }}
                    >
                      {sp.domain}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black text-brand-green bg-brand-green/15 border border-brand-green/40 px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(0,255,136,0.3)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
                      DECLASSIFIED
                    </span>
                  </div>

                  {/* Center: Photo & Profile */}
                  <div className="my-4 flex flex-col items-center text-center z-10">
                    {/* Futuristic Photo Container */}
                    <div
                      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 p-1 bg-black/80 group-hover:scale-105 transition-transform duration-300"
                      style={{
                        borderColor: sp.color,
                        boxShadow: `0 0 25px ${sp.color}50`,
                      }}
                    >
                      <img
                        src={sp.image}
                        alt={sp.name}
                        className="w-full h-full object-cover rounded-xl filter contrast-110 brightness-100"
                        style={{ objectPosition: sp.imagePosition || 'center' }}
                      />
                      {/* Tech Corner Reticles */}
                      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white pointer-events-none" />
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white pointer-events-none" />
                      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white pointer-events-none" />
                      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white pointer-events-none" />
                    </div>

                    {/* Name */}
                    <h3
                      className="mt-3.5 font-display font-black text-xl sm:text-2xl text-white tracking-wide uppercase"
                      style={{ textShadow: `0 0 20px ${sp.color}80` }}
                    >
                      {sp.name}
                    </h3>

                    {/* Designation & Organization */}
                    <div
                      className="mt-1 font-mono text-[11px] sm:text-xs font-bold tracking-wider uppercase"
                      style={{ color: sp.color }}
                    >
                      {sp.role}
                    </div>
                    <div className="font-mono text-[10px] text-white/70 font-semibold tracking-widest uppercase">
                      {sp.organization}
                    </div>

                    {/* Topics Highlights */}
                    <div className="mt-3 w-full space-y-1.5 text-left">
                      {sp.topics?.map((topic, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-1.5 font-mono text-[9px] sm:text-[10px] text-white/85 bg-white/5 border border-white/10 rounded-md px-2 py-1 leading-snug transition-colors"
                          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <span style={{ color: sp.color }} className="font-bold">
                            ›
                          </span>
                          <span className="line-clamp-1">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer telemetry & Dossier prompt */}
                  <div
                    className="pt-3 border-t flex items-center justify-between font-mono text-[10px] z-10"
                    style={{ borderColor: `${sp.color}30` }}
                  >
                    <span className="text-white/40">{sp.hash}</span>
                    <span
                      className="font-bold tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      style={{ color: sp.color }}
                    >
                      VIEW DOSSIER <ArrowRight className="w-3 h-3" style={{ color: sp.color }} />
                    </span>
                  </div>
                </div>
              );
            }

            // Locked Slots
            return (
              <div
                key={sp.id}
                className="group relative p-6 rounded-lg border border-cyber-border bg-cyber-surface/40 hover:bg-cyber-surface/80 transition-all duration-300 backdrop-blur-sm overflow-hidden flex flex-col justify-between min-h-[320px]"
                data-cursor="locked"
                onClick={() => handleSpeakerClick(sp)}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 pointer-events-none" />

                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[11px] font-bold px-2 py-0.5 rounded uppercase"
                    style={{
                      backgroundColor: `${sp.color}15`,
                      color: sp.color,
                      border: `1px solid ${sp.color}40`,
                    }}
                  >
                    {sp.domain}
                  </span>
                  <span className="font-mono text-[10px] text-white/30">{sp.hash}</span>
                </div>

                <div className="my-6 flex flex-col items-center justify-center py-4">
                  <div className="w-24 h-24 rounded-full border border-dashed border-white/20 flex items-center justify-center bg-cyber-panel/60 group-hover:border-cyber-red/50 transition-colors relative">
                    <Lock className="w-8 h-8 text-white/40 group-hover:text-cyber-red transition-colors" />
                    <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20" />
                  </div>
                  <div className="mt-4 font-display font-bold text-lg text-white tracking-widest uppercase">
                    COMING SOON
                  </div>
                  <div className="font-mono text-[10px] text-white/50 tracking-widest uppercase mt-1">
                    {sp.role}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-white/40">[ ENCRYPTION: SHA-256 ]</span>
                  <span
                    className="font-bold tracking-wider"
                    style={{ color: sp.color }}
                  >
                    [{sp.status}]
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================================================================
          KEYNOTE SPEAKER DOSSIER MODAL (DECLASSIFIED)
          =================================================================== */}
      {selectedSpeaker && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => {
            sound.playHoverClick();
            setSelectedSpeaker(null);
          }}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border-2 bg-[#030612]/98 p-6 sm:p-8 text-white overflow-hidden animate-in zoom-in-95 duration-200"
            style={{
              borderColor: selectedSpeaker.color,
              boxShadow: `0 0 60px ${selectedSpeaker.color}40`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={() => {
                sound.playHoverClick();
                setSelectedSpeaker(null);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/10 hover:bg-cyber-red/20 border border-white/20 hover:border-cyber-red text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer group"
              title="Close Dossier [ESC]"
            >
              <X className="w-5 h-5 text-white/80 group-hover:text-cyber-red group-hover:rotate-90 transition-transform" />
            </button>

            {/* Dossier Header Telemetry */}
            <div
              className="flex items-center gap-2 pb-3 mb-6 border-b text-[10px] font-mono"
              style={{ borderColor: `${selectedSpeaker.color}30` }}
            >
              <span
                className="px-2 py-0.5 rounded text-black font-black uppercase tracking-wider"
                style={{ backgroundColor: selectedSpeaker.color }}
              >
                DOSSIER DECLASSIFIED
              </span>
              <span className="text-white/50 tracking-widest uppercase">
                // NODE: {selectedSpeaker.hash}
              </span>
              <span className="ml-auto mr-10 inline-flex items-center gap-1 text-brand-green font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                VERIFIED KEYNOTE
              </span>
            </div>

            {/* Speaker Bio Grid */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Left: Speaker Portrait */}
              <div
                className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 p-1 bg-black/90 shrink-0"
                style={{
                  borderColor: selectedSpeaker.color,
                  boxShadow: `0 0 35px ${selectedSpeaker.color}50`,
                }}
              >
                <img
                  src={selectedSpeaker.image}
                  alt={selectedSpeaker.name}
                  className="w-full h-full object-cover rounded-xl filter contrast-110"
                  style={{ objectPosition: selectedSpeaker.imagePosition || 'center' }}
                />
                <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-white pointer-events-none" />
                <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-white pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-white pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-white pointer-events-none" />
              </div>

              {/* Right: Speaker Credentials */}
              <div className="flex-1 text-center sm:text-left">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border font-mono text-[10px] font-black uppercase tracking-widest mb-1.5"
                  style={{
                    borderColor: `${selectedSpeaker.color}60`,
                    backgroundColor: `${selectedSpeaker.color}20`,
                    color: selectedSpeaker.color,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: selectedSpeaker.color }} />
                  <span>{selectedSpeaker.domain} ARCHITECT</span>
                </div>

                <h3
                  className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight"
                  style={{ textShadow: `0 0 20px ${selectedSpeaker.color}80` }}
                >
                  {selectedSpeaker.name}
                </h3>

                <div
                  className="mt-1 font-mono text-sm sm:text-base font-bold tracking-wider uppercase"
                  style={{ color: selectedSpeaker.color }}
                >
                  {selectedSpeaker.role}
                </div>
                <div className="font-mono text-xs sm:text-sm text-white/70 font-semibold tracking-widest uppercase">
                  {selectedSpeaker.organization}
                </div>

                <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white/80 leading-relaxed">
                  {selectedSpeaker.bio}
                </div>
              </div>
            </div>

            {/* Keynote Focus & Session Breakdown */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" style={{ color: selectedSpeaker.color }} />
                <h4
                  className="font-mono text-xs font-black tracking-widest uppercase"
                  style={{ color: selectedSpeaker.color }}
                >
                  SESSION KEYNOTE TOPICS // DEEP DIVES
                </h4>
              </div>

              <div className="space-y-2.5">
                {selectedSpeaker.detailedTopics && selectedSpeaker.detailedTopics.length > 0 ? (
                  selectedSpeaker.detailedTopics.map((dt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-cyber-surface/60 border border-cyber-border/70 flex items-start gap-3"
                    >
                      {renderTopicIcon(dt.iconName, selectedSpeaker.color)}
                      <div>
                        <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                          {dt.title}
                        </div>
                        <div className="font-mono text-[11px] text-white/60 mt-0.5">
                          {dt.description}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  selectedSpeaker.topics?.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-cyber-surface/60 border border-cyber-border/70 flex items-start gap-3"
                    >
                      <Sparkles className="w-5 h-5 shrink-0 mt-0.5" style={{ color: selectedSpeaker.color }} />
                      <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                        {topic}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="font-mono text-[10px] text-white/40">
                [ STATUS: SESSION ACTIVE • KEYNOTE CONFIRMED ]
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href="#access"
                  onClick={() => {
                    sound.playButtonConfirm();
                    setSelectedSpeaker(null);
                    const el = document.getElementById('access');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono font-black text-xs uppercase tracking-widest text-black hover:scale-105 transition-all flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(90deg, ${selectedSpeaker.color}, #ffffff, ${selectedSpeaker.color})`,
                    boxShadow: `0 0 25px ${selectedSpeaker.color}80`,
                  }}
                >
                  <span>CLAIM PASS TO ATTEND</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
