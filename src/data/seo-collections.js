// SEO landing page configs. One entry per route slug. Keep titles ≤60 chars,
// descriptions ≤155. Adding a new entry here surfaces it in /events 'browse by
// category' grid and lights up a route once registered in App.jsx.

import {
  Tag, Trophy, Code, Bot, Coins, Calendar as CalIcon,
} from 'lucide-react';

export function isFree(e) { return /\bfree\b/i.test(e.cost || ''); }
export function matchesAi(e) {
  const blob = `${e.name || ''} ${(e.tags || []).join(' ')} ${e.description || ''}`;
  return /\b(AI|GenAI|gen ai|LLM|GPT|machine learning|ML|deep learning|agentic|agent|RAG)\b/i.test(blob);
}
export function matchesWeb3(e) {
  if (e.category === 'web3') return true;
  const blob = `${e.name || ''} ${(e.tags || []).join(' ')}`;
  return /\b(web3|blockchain|crypto|nft|defi|ethereum|solana|polygon|chainlink|dao)\b/i.test(blob);
}

export const COLLECTIONS = {
  'free-tech-events-bangalore': {
    h1: ['Free Tech Events in', 'Bengaluru — 2026'],
    eyebrow: 'Curated · No ticket cost',
    icon: Tag,
    accent: 'emerald',
    intro:
      'Every free-to-attend tech event in Bengaluru — hackathons, conferences, AI workshops, dev meetups. No tickets. No paywalls.',
    title: 'Free Tech Events in Bengaluru 2026 — Hackathons, AI, Dev Meetups',
    description:
      'Free-to-attend tech events in Bengaluru: hackathons, conferences, AI workshops, dev meetups. Curated. Verified links. April + May 2026.',
    keywords: ['free tech events bangalore', 'free hackathons bangalore', 'free ai events bengaluru', 'free dev meetups bangalore'],
    filter: isFree,
    faqs: [
      { q: 'Are there really free tech events in Bengaluru?', a: 'Yes — over half the events on this site are free, including OpenAI Codex Hackathon, AWS Summit, YC Startup School, GDG Build For Bengaluru, and dozens of meetups.' },
      { q: 'How do I attend a free hackathon in Bangalore?', a: 'Click any hackathon on this page. Most use Luma or HasGeek for free RSVP. Bring your laptop, charger, and a project idea.' },
      { q: 'Do free tech events in Bengaluru have prizes?', a: 'Many do. OpenAI Codex Hackathon has $100K, Meta PyTorch has $30K, Aya AI Hackathon has $20K+ — all with free entry.' },
    ],
  },

  'ai-events-bangalore-2026': {
    h1: ['AI Events in', 'Bengaluru — 2026'],
    eyebrow: 'AI · GenAI · LLMs · Agents',
    icon: Bot,
    accent: 'violet',
    intro:
      'India\'s densest AI calendar. From OpenAI hackathons to agentic-AI meetups, GitHub Copilot Dev Days to Apache Kafka × ML — every Bengaluru AI event in one place.',
    title: 'AI Events in Bengaluru 2026 — Hackathons, Meetups, Workshops',
    description:
      'AI events in Bengaluru 2026: OpenAI Codex Hackathon, ElevenLabs Buildathon, agentic-AI workshops, GitHub Copilot Dev Days, Meta PyTorch finale and more.',
    keywords: ['ai events bangalore', 'genai meetups bengaluru', 'llm hackathons bangalore', 'agentic ai bangalore', 'ai workshops bengaluru'],
    filter: matchesAi,
    faqs: [
      { q: 'What AI events are happening in Bengaluru in 2026?', a: 'OpenAI\'s first Codex Hackathon (Apr 16, $100K), ElevenLabs Buildathon, Meta PyTorch finale, Aya AI Hackathon, JioHotstar ScaleUp, GitHub Copilot Dev Days, plus 30+ agentic-AI workshops in May.' },
      { q: 'Are AI events in Bangalore free?', a: 'Most are. OpenAI Codex Hackathon, ElevenLabs Buildathon, Meta PyTorch finale, AWS Summit, and most agentic-AI meetups are free.' },
      { q: 'How do I find AI hackathons in Bengaluru?', a: 'Use the Hackathons page or filter "Hackathons" on any month page. We track every public AI hackathon happening in Bengaluru.' },
    ],
  },

  'conferences-bangalore-2026': {
    h1: ['Tech Conferences in', 'Bengaluru — 2026'],
    eyebrow: 'Polyglot · Enterprise · Multi-day',
    icon: Code,
    accent: 'primary',
    intro:
      'Multi-day developer and enterprise conferences in Bengaluru — GIDS, AWS Summit, Rust India, W3Summit, Tech & Innovation Summit, plus HasGeek Mini Confs through May.',
    title: 'Tech Conferences in Bengaluru 2026 — GIDS, AWS Summit, Rust India',
    description:
      'Major tech conferences in Bengaluru 2026: GIDS (Asia-Pacific\'s largest dev conf), AWS Summit, Rust India, W3Summit. Dates, venues, registration links.',
    keywords: ['conferences in bangalore 2026', 'tech conferences bengaluru', 'developer conferences india', 'gids 2026', 'aws summit bengaluru'],
    filter: (e) => e.category === 'conference',
    faqs: [
      { q: 'What is the biggest tech conference in Bengaluru in 2026?', a: 'GIDS 2026 (Asia-Pacific\'s largest polyglot developer conference, 4 days at IISc) and AWS Summit Bengaluru (2 days, free, KTPO Whitefield) are the largest.' },
      { q: 'When is AWS Summit Bengaluru 2026?', a: 'April 22–23, 2026 at KTPO Exhibition Center, Whitefield. Registration is free.' },
      { q: 'Are tech conferences in Bangalore worth attending?', a: 'GIDS, AWS Summit, and Rust India consistently rank among India\'s most valuable tech conferences. Most have student discounts; AWS Summit is fully free.' },
    ],
  },

  'hackathons-bangalore-2026': {
    h1: ['Hackathons in', 'Bengaluru — 2026'],
    eyebrow: 'Build · Win · Network',
    icon: Trophy,
    accent: 'violet',
    intro:
      'Every public hackathon happening in Bengaluru this season — OpenAI Codex ($100K), Meta PyTorch ($30K), VibeCon, ElevenLabs Buildathon, HackBLR, and more.',
    title: 'Hackathons in Bengaluru 2026 — $145K+ in Prizes',
    description:
      'Every Bengaluru hackathon for 2026: OpenAI Codex ($100K), Meta PyTorch ($30K), VibeCon (YC interview), ElevenLabs Buildathon, HackBLR, HackBricks. Free entry.',
    keywords: ['hackathons bangalore 2026', 'openai hackathon india', 'free hackathons bengaluru', 'ai hackathons bangalore', 'hackathons with prizes india'],
    filter: (e) => e.category === 'hackathon',
    faqs: [
      { q: 'How many hackathons are in Bengaluru in 2026?', a: '10+ verified public hackathons with $145K+ in total prizes. OpenAI Codex ($100K), Meta PyTorch ($30K), Aya AI Hackathon ($20K+), VibeCon (YC interview prize), and more.' },
      { q: 'What is the biggest hackathon in Bangalore?', a: 'OpenAI Codex Hackathon — $100,000 in prizes, hosted with GrowthX. April 16, 2026.' },
      { q: 'Are Bangalore hackathons free?', a: 'Yes. All 10 listed hackathons are free to enter. You only pay for travel and food.' },
    ],
  },

  'web3-events-bangalore-2026': {
    h1: ['Web3 & Crypto Events in', 'Bengaluru — 2026'],
    eyebrow: 'Blockchain · DeFi · NFT · DAO',
    icon: Coins,
    accent: 'amber',
    intro:
      'Web3, blockchain, DeFi, and crypto events happening across Bengaluru — W3Summit, Aya AI × DeFi Hackathon, Chainlink builder meetup, and more.',
    title: 'Web3 & Crypto Events in Bengaluru 2026 — W3Summit, DeFi, NFT',
    description:
      'Web3 events in Bengaluru 2026: W3Summit (India\'s biggest Web3 fest), Aya AI × DeFi Hackathon, Chainlink meetup, blockchain builder events.',
    keywords: ['web3 events bangalore', 'crypto events bengaluru', 'blockchain meetups bangalore', 'defi events india', 'w3summit 2026'],
    filter: matchesWeb3,
    faqs: [
      { q: 'Are there Web3 events in Bengaluru?', a: 'Yes. W3Summit 2026 (2,000+ attendees, 50+ speakers) is India\'s biggest Web3 festival. Plus Aya AI × DeFi Hackathon and Chainlink builder meetups.' },
      { q: 'When is W3Summit 2026?', a: 'April 16–17, 2026 at Sheraton Grand Bangalore, Brigade Gateway.' },
    ],
  },
};
