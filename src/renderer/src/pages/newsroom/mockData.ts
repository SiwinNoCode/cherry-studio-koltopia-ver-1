import dayjs from 'dayjs'

import type {
  DistributionPreset,
  MarketPlugin,
  NewsroomEvent,
  TrendInsight
} from './types'

const baseTime = dayjs()

export const MOCK_EVENTS: NewsroomEvent[] = [
  {
    id: 'event-1',
    title: 'Global Semiconductor Supply Chain Reconfiguration',
    summary:
      'Multiple policy announcements signal a coordinated move to diversify chip manufacturing beyond traditional hubs.',
    aiSummary:
      'Policy trackers flag synchronized incentives in the US, EU, and Southeast Asia. Analysts recommend preparing comparative briefings and targeted outreach for supply-side partners.',
    category: 'Technology',
    tags: ['Semiconductor', 'Geopolitics', 'Manufacturing'],
    regions: ['North America', 'Europe', 'Southeast Asia'],
    sentiment: 'neutral',
    riskLevel: 'medium',
    reliability: 88,
    impactScore: 92,
    coverageScore: 76,
    freshnessMinutes: 48,
    priority: 'high',
    articles: [
      {
        id: 'source-1',
        outlet: 'Reuters',
        headline: 'US and EU unveil aligned subsidies to attract chip fabs',
        url: 'https://example.com/reuters-chip-fabs',
        publishedAt: baseTime.subtract(2, 'hour').toISOString(),
        tone: 'neutral',
        viewpoint: 'Policy announcement overview'
      },
      {
        id: 'source-2',
        outlet: 'Nikkei Asia',
        headline: 'ASEAN nations pitch turnkey facilities for advanced nodes',
        url: 'https://example.com/nikkei-asean-fabs',
        publishedAt: baseTime.subtract(3, 'hour').toISOString(),
        tone: 'positive',
        viewpoint: 'Regional opportunity analysis'
      },
      {
        id: 'source-3',
        outlet: 'Perplexity Discover',
        headline: 'Satellite data reveals construction uptick around new fab sites',
        url: 'https://example.com/perplexity-fab-sites',
        publishedAt: baseTime.subtract(80, 'minute').toISOString(),
        tone: 'neutral',
        viewpoint: 'Geo-intelligence corroboration'
      }
    ],
    recommendedActions: [
      'Draft executive brief comparing incentive packages',
      'Schedule expert roundtable on resilient supply planning',
      'Update partner CRM segments with new subsidy eligibility'
    ],
    distributionNotes:
      'Focus LinkedIn thought leadership in neutral tone, highlight data-driven analysis on investor newsletter, and localize APAC outreach with actionable subsidy tables.'
  },
  {
    id: 'event-2',
    title: 'Breakthrough in Carbon Capture Storage Utilization',
    summary:
      'A consortium of climate-tech startups and public labs reports a 30% efficiency gain in modular carbon capture units.',
    aiSummary:
      'Perplexity Sonar synthesizes lab whitepapers, patent filings, and conference chatter to confirm replicable performance. Recommend preparing investor storyline and compliance FAQ.',
    category: 'Climate',
    tags: ['Carbon Capture', 'Sustainability', 'Energy'],
    regions: ['Global'],
    sentiment: 'positive',
    riskLevel: 'low',
    reliability: 93,
    impactScore: 84,
    coverageScore: 68,
    freshnessMinutes: 25,
    priority: 'medium',
    articles: [
      {
        id: 'source-4',
        outlet: 'Science Daily',
        headline: 'Open-sourced dataset reveals dramatic efficiency jump',
        url: 'https://example.com/sciencedaily-carbon-capture',
        publishedAt: baseTime.subtract(35, 'minute').toISOString(),
        tone: 'positive',
        viewpoint: 'Research validation'
      },
      {
        id: 'source-5',
        outlet: 'TechCrunch',
        headline: 'Climate consortium raises $120M to commercialize new CCS units',
        url: 'https://example.com/techcrunch-ccs-funding',
        publishedAt: baseTime.subtract(90, 'minute').toISOString(),
        tone: 'positive',
        viewpoint: 'Venture financing'
      }
    ],
    recommendedActions: [
      'Prepare ESG newsletter segment with FAQ on validation methods',
      'Generate social snippets tailored for sustainability influencers',
      'Queue demo script for investor webinar with voiceover'
    ],
    distributionNotes:
      'Deploy optimistic tone for social channels, craft executive-friendly slides for LinkedIn documents, and trigger podcast script generation using ElevenLabs narration.'
  },
  {
    id: 'event-3',
    title: 'Regulatory Scrutiny Intensifies on Generative AI Transparency',
    summary:
      'Concurrent hearings in the EU and US demand clearer disclosure around training data and safety guardrails.',
    aiSummary:
      'Synchronized legal briefings and stakeholder memos indicate heightened compliance urgency. Recommend immediate policy tracker update and proactive outreach to enterprise clients.',
    category: 'Policy',
    tags: ['AI Governance', 'Compliance', 'Safety'],
    regions: ['North America', 'Europe'],
    sentiment: 'negative',
    riskLevel: 'high',
    reliability: 81,
    impactScore: 88,
    coverageScore: 71,
    freshnessMinutes: 110,
    priority: 'high',
    articles: [
      {
        id: 'source-6',
        outlet: 'Financial Times',
        headline: 'Lawmakers push for algorithmic audit trail requirements',
        url: 'https://example.com/ft-ai-audit-trail',
        publishedAt: baseTime.subtract(4, 'hour').toISOString(),
        tone: 'negative',
        viewpoint: 'Legislative pressure'
      },
      {
        id: 'source-7',
        outlet: 'The Verge',
        headline: 'Developers brace for cross-border compliance obligations',
        url: 'https://example.com/verge-compliance',
        publishedAt: baseTime.subtract(3, 'hour').toISOString(),
        tone: 'neutral',
        viewpoint: 'Industry reaction'
      },
      {
        id: 'source-8',
        outlet: 'Perplexity Sonar',
        headline: 'Hearing transcripts highlight focus on training corpus disclosure',
        url: 'https://example.com/sonar-hearing-transcripts',
        publishedAt: baseTime.subtract(70, 'minute').toISOString(),
        tone: 'neutral',
        viewpoint: 'Evidence synthesis'
      }
    ],
    recommendedActions: [
      'Trigger client advisory email with compliance checklist',
      'Schedule legal team sync with MCP regulatory plugins',
      'Update newsroom briefing to include potential rollout timelines'
    ],
    distributionNotes:
      'Adopt cautionary tone across social channels, push detailed compliance article to knowledge base, and generate scripted briefing for executive spokesperson avatar.'
  }
]

export const MOCK_TRENDS: TrendInsight[] = [
  {
    id: 'trend-1',
    topic: 'AI Safety Frameworks',
    delta: 18,
    momentum: 'rising',
    volume: 87,
    coverage: 72,
    highlight: 'Policy hearings accelerated 18% week-over-week with regulator quotes gaining traction.'
  },
  {
    id: 'trend-2',
    topic: 'Sustainable Manufacturing',
    delta: 9,
    momentum: 'stable',
    volume: 64,
    coverage: 58,
    highlight: 'Lifecycle analysis whitepapers shared widely across climate analyst newsletters.'
  },
  {
    id: 'trend-3',
    topic: 'Generative Video Tooling',
    delta: -6,
    momentum: 'falling',
    volume: 41,
    coverage: 39,
    highlight: 'Buzz cooled after major vendors delayed feature rollouts pending compliance checks.'
  }
]

export const MOCK_PRESETS: DistributionPreset[] = [
  {
    id: 'preset-1',
    channel: 'LinkedIn',
    format: 'Thought leadership carousel',
    cadence: 'Publish within 2 hours of briefing',
    tone: 'Analytical and neutral',
    automation: 'Auto-generate slides + schedule via StoryChief API'
  },
  {
    id: 'preset-2',
    channel: 'Newsletter',
    format: 'Executive digest email',
    cadence: 'Daily 7:30 AM UTC',
    tone: 'Concise and actionable',
    automation: 'Draft via MCP summarizer, push to Mailchimp connector'
  },
  {
    id: 'preset-3',
    channel: 'Podcast',
    format: '2-minute briefing script',
    cadence: 'Triggered on high priority events',
    tone: 'Authoritative with calm reassurance',
    automation: 'Generate script + ElevenLabs narration + avatar render pipeline'
  }
]

export const MOCK_PLUGINS: MarketPlugin[] = [
  {
    id: 'plugin-1',
    name: 'Policy Radar Pro',
    vendor: 'CivicSight Labs',
    category: 'analysis',
    apiEndpoint: 'https://api.civicsight.ai/radar',
    capabilities: ['Regulatory diffing', 'Hearing transcript summarization', 'Geo-tag filtering'],
    status: 'certified'
  },
  {
    id: 'plugin-2',
    name: 'Signal Deduplicator',
    vendor: 'Veracity MCP',
    category: 'connector',
    apiEndpoint: 'https://mcp.veracity.ai/deduplicate',
    capabilities: ['Content fingerprinting', 'Event clustering', 'Anomaly scoring'],
    status: 'certified'
  },
  {
    id: 'plugin-3',
    name: 'VoiceCaster Studio',
    vendor: 'Nova Voices',
    category: 'content',
    apiEndpoint: 'https://api.novavoices.ai/render',
    capabilities: ['ElevenLabs bridge', 'Avatar staging', 'Tone guardrails'],
    status: 'beta'
  }
]
