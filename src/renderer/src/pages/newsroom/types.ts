export type SentimentLabel = 'positive' | 'neutral' | 'negative'

export type TrendMomentum = 'rising' | 'stable' | 'falling'

export type RiskLevel = 'high' | 'medium' | 'low'

export type NewsroomTimeframe = '1h' | '6h' | '24h' | '7d'

export type PluginCategory = 'analysis' | 'content' | 'ai-assistant' | 'connector'

export type FactCheckVerdict = 'verified' | 'needs_review' | 'debunked'

export type FactCheckReferenceStance = 'supporting' | 'disputing' | 'neutral'

export type NewsroomFilterState = {
  timeframe: NewsroomTimeframe
  categories: string[]
  regions: string[]
  sentiment: 'all' | SentimentLabel
  risk: 'all' | RiskLevel
  sources: string[]
  query: string
  onlyPriority: boolean
}

export type SourceArticle = {
  id: string
  outlet: string
  headline: string
  url: string
  publishedAt: string
  tone: SentimentLabel
  viewpoint: string
}

export type NewsroomEvent = {
  id: string
  title: string
  summary: string
  aiSummary: string
  category: string
  tags: string[]
  regions: string[]
  sentiment: SentimentLabel
  riskLevel: RiskLevel
  reliability: number
  impactScore: number
  coverageScore: number
  freshnessMinutes: number
  priority: RiskLevel
  articles: SourceArticle[]
  recommendedActions: string[]
  distributionNotes: string
}

export type TrendInsight = {
  id: string
  topic: string
  delta: number
  momentum: TrendMomentum
  volume: number
  coverage: number
  highlight: string
}

export type DistributionPreset = {
  id: string
  channel: string
  format: string
  cadence: string
  tone: string
  automation: string
}

export type MarketPlugin = {
  id: string
  name: string
  vendor: string
  category: PluginCategory
  apiEndpoint: string
  capabilities: string[]
  status: 'certified' | 'beta'
}

export type FactCheckReference = {
  title: string
  url: string
  stance: FactCheckReferenceStance
}

export type FactCheckInsight = {
  verdict: FactCheckVerdict
  summary: string
  references: FactCheckReference[]
  riskNotes: string[]
  aiConfidence: number
  latencyMs: number
}
