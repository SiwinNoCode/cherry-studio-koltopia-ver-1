import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Empty,
  Flex,
  Input,
  List,
  Modal,
  Progress,
  Segmented,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip
} from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Layers3,
  Link2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Workflow
} from 'lucide-react'
import { FC } from 'react'
import styled from 'styled-components'

import { MOCK_EVENTS, MOCK_PLUGINS, MOCK_PRESETS, MOCK_TRENDS } from './mockData'
import type {
  FactCheckInsight,
  FactCheckVerdict,
  MarketPlugin,
  NewsroomEvent,
  NewsroomFilterState,
  TrendInsight
} from './types'

dayjs.extend(relativeTime)

type FactCheckState = {
  visible: boolean
  loading: boolean
  event?: NewsroomEvent
  result?: FactCheckInsight
}

const TIMEFRAME_LIMITS: Record<NewsroomFilterState['timeframe'], number> = {
  '1h': 60,
  '6h': 360,
  '24h': 1440,
  '7d': 10080
}

const sentimentOptions = [
  { label: 'All sentiments', value: 'all' },
  { label: 'Positive', value: 'positive' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Negative', value: 'negative' }
]

const riskOptions = [
  { label: 'All priorities', value: 'all' },
  { label: 'High priority', value: 'high' },
  { label: 'Medium priority', value: 'medium' },
  { label: 'Low priority', value: 'low' }
]

/**
 * 创建事实核查结果的模拟数据
 */
const createMockFactCheck = (event: NewsroomEvent): FactCheckInsight => {
  const verdict: FactCheckVerdict = event.reliability >= 90 ? 'verified' : event.reliability >= 75 ? 'needs_review' : 'debunked'

  return {
    verdict,
    summary: `Perplexity Sonar cross-referenced ${event.articles.length} independent sources and MCP fact-check plugins to validate the latest signals for “${event.title}”.`,
    references: event.articles.slice(0, 3).map((article, index) => ({
      title: article.headline,
      url: article.url,
      stance: index === 0 ? 'supporting' : index === 1 ? 'neutral' : 'supporting'
    })),
    riskNotes: [
      verdict === 'debunked'
        ? 'Confidence flagged due to conflicting eyewitness accounts.'
        : 'No direct contradictions detected across structured feeds and MCP archives.',
      'Recommend rerunning verification when new primary sources arrive.'
    ],
    aiConfidence: Math.min(99, Math.round(event.reliability + 6)),
    latencyMs: 2300 + event.articles.length * 180
  }
}

/**
 * 新闻聚合首页
 */
const NewsroomPage: FC = () => {
  const [filters, setFilters] = useState<NewsroomFilterState>({
    timeframe: '6h',
    categories: [],
    regions: [],
    sentiment: 'all',
    risk: 'all',
    sources: [],
    query: '',
    onlyPriority: false
  })
  const [selectedEventId, setSelectedEventId] = useState<string | null>(MOCK_EVENTS[0]?.id ?? null)
  const [factCheckState, setFactCheckState] = useState<FactCheckState>({ visible: false, loading: false })

  const categories = useMemo(() => Array.from(new Set(MOCK_EVENTS.map((event) => event.category))), [])
  const regions = useMemo(
    () => Array.from(new Set(MOCK_EVENTS.flatMap((event) => event.regions))).filter(Boolean),
    []
  )
  const sources = useMemo(
    () => Array.from(new Set(MOCK_EVENTS.flatMap((event) => event.articles.map((article) => article.outlet)))),
    []
  )

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((event) => {
      if (filters.onlyPriority && event.priority !== 'high') {
        return false
      }

      const timeframeLimit = TIMEFRAME_LIMITS[filters.timeframe]
      if (event.freshnessMinutes > timeframeLimit) {
        return false
      }

      if (filters.categories.length > 0 && !filters.categories.includes(event.category)) {
        return false
      }

      if (filters.regions.length > 0 && !event.regions.some((region) => filters.regions.includes(region))) {
        return false
      }

      if (filters.sources.length > 0 && !event.articles.some((article) => filters.sources.includes(article.outlet))) {
        return false
      }

      if (filters.sentiment !== 'all' && event.sentiment !== filters.sentiment) {
        return false
      }

      if (filters.risk !== 'all' && event.riskLevel !== filters.risk) {
        return false
      }

      if (filters.query.trim()) {
        const keyword = filters.query.trim().toLowerCase()
        const haystack = [event.title, event.summary, ...event.tags].join(' ').toLowerCase()
        return haystack.includes(keyword)
      }

      return true
    })
  }, [filters])

  const selectedEvent = useMemo(
    () => filteredEvents.find((event) => event.id === selectedEventId) ?? filteredEvents[0],
    [filteredEvents, selectedEventId]
  )

  useEffect(() => {
    if (filteredEvents.length === 0) {
      setSelectedEventId(null)
      return
    }
    if (!filteredEvents.some((event) => event.id === selectedEventId)) {
      setSelectedEventId(filteredEvents[0].id)
    }
  }, [filteredEvents, selectedEventId])

  /**
   * 更新筛选条件
   */
  const handleFiltersChange = useCallback((partial: Partial<NewsroomFilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }))
  }, [])

  /**
   * 触发事实核查流程
   */
  const handleFactCheck = useCallback((event: NewsroomEvent) => {
    setFactCheckState({ visible: true, loading: true, event })
    window.setTimeout(() => {
      setFactCheckState({ visible: true, loading: false, event, result: createMockFactCheck(event) })
    }, 1200)
  }, [])

  /**
   * 关闭事实核查窗口
   */
  const closeFactCheckModal = useCallback(() => {
    setFactCheckState({ visible: false, loading: false })
  }, [])

  return (
    <PageContainer>
      <FiltersColumn>
        <FilterPanel
          categories={categories}
          regions={regions}
          sources={sources}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </FiltersColumn>
      <FeedColumn>
        <EventBoard
          events={filteredEvents}
          selectedEventId={selectedEvent?.id ?? null}
          onSelectEvent={setSelectedEventId}
          onFactCheck={handleFactCheck}
        />
        <EventDetail event={selectedEvent ?? null} />
      </FeedColumn>
      <TrendColumn>
        <TrendSidebar trends={MOCK_TRENDS} presets={MOCK_PRESETS} plugins={MOCK_PLUGINS} />
      </TrendColumn>
      <FactCheckModal state={factCheckState} onClose={closeFactCheckModal} />
    </PageContainer>
  )
}

type FilterPanelProps = {
  categories: string[]
  regions: string[]
  sources: string[]
  filters: NewsroomFilterState
  onFiltersChange: (filters: Partial<NewsroomFilterState>) => void
}

/**
 * 筛选器面板
 */
const FilterPanel: FC<FilterPanelProps> = ({ categories, regions, sources, filters, onFiltersChange }) => {
  return (
    <Card title="Signal Controls" bordered={false} styles={{ body: { display: 'flex', flexDirection: 'column', gap: 12 } }}>
      <Input.Search
        allowClear
        placeholder="Search topics, tags, or sources"
        value={filters.query}
        onChange={(event) => onFiltersChange({ query: event.target.value })}
      />
      <div>
        <Label>Time horizon</Label>
        <Segmented
          block
          value={filters.timeframe}
          onChange={(value) => onFiltersChange({ timeframe: value as NewsroomFilterState['timeframe'] })}
          options={[
            { label: '1h', value: '1h' },
            { label: '6h', value: '6h' },
            { label: '24h', value: '24h' },
            { label: '7d', value: '7d' }
          ]}
        />
      </div>
      <Select
        mode="multiple"
        allowClear
        placeholder="Focus categories"
        value={filters.categories}
        options={categories.map((category) => ({ label: category, value: category }))}
        onChange={(value) => onFiltersChange({ categories: value })}
      />
      <Select
        mode="multiple"
        allowClear
        placeholder="Regions"
        value={filters.regions}
        options={regions.map((region) => ({ label: region, value: region }))}
        onChange={(value) => onFiltersChange({ regions: value })}
      />
      <Select
        mode="multiple"
        allowClear
        placeholder="Preferred sources"
        value={filters.sources}
        options={sources.map((source) => ({ label: source, value: source }))}
        onChange={(value) => onFiltersChange({ sources: value })}
      />
      <Select
        value={filters.sentiment}
        options={sentimentOptions}
        onChange={(value) => onFiltersChange({ sentiment: value as NewsroomFilterState['sentiment'] })}
      />
      <Select
        value={filters.risk}
        options={riskOptions}
        onChange={(value) => onFiltersChange({ risk: value as NewsroomFilterState['risk'] })}
      />
      <Checkbox checked={filters.onlyPriority} onChange={(event) => onFiltersChange({ onlyPriority: event.target.checked })}>
        Only show urgent clusters
      </Checkbox>
      <Divider style={{ margin: '8px 0' }} />
      <Space direction="vertical" size={8}>
        <Flex align="center" gap={8}>
          <ShieldCheck size={16} />
          <span>De-duplication by MCP plugins is active.</span>
        </Flex>
        <Flex align="center" gap={8}>
          <Sparkles size={16} />
          <span>Personalized scoring adapts to newsroom interests.</span>
        </Flex>
      </Space>
    </Card>
  )
}

type EventBoardProps = {
  events: NewsroomEvent[]
  selectedEventId: string | null
  onSelectEvent: (eventId: string | null) => void
  onFactCheck: (event: NewsroomEvent) => void
}

/**
 * 事件列表
 */
const EventBoard: FC<EventBoardProps> = ({ events, selectedEventId, onSelectEvent, onFactCheck }) => {
  if (events.length === 0) {
    return (
      <Card bordered={false} style={{ flex: 1 }}>
        <Empty description="No matching signals in this window." />
      </Card>
    )
  }

  return (
    <Card bordered={false} title="Event intelligence" extra={<Badge count={events.length} color="blue" />}>
      <EventList>
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            active={event.id === selectedEventId}
            onSelect={() => onSelectEvent(event.id)}
            onFactCheck={() => onFactCheck(event)}
          />
        ))}
      </EventList>
    </Card>
  )
}

type EventCardProps = {
  event: NewsroomEvent
  active: boolean
  onSelect: () => void
  onFactCheck: () => void
}

/**
 * 事件卡片
 */
const EventCard: FC<EventCardProps> = ({ event, active, onSelect, onFactCheck }) => {
  const priorityColor = event.priority === 'high' ? 'volcano' : event.priority === 'medium' ? 'gold' : 'green'
  const momentumLabel = `${event.articles.length} sources`

  return (
    <EventCardContainer $active={active} onClick={onSelect}>
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={8}>
          <Badge color={priorityColor} text={event.priority.toUpperCase()} />
          <span className="event-title">{event.title}</span>
        </Flex>
        <Flex gap={8} align="center">
          <Tooltip title="Confidence score from Sonar + MCP">
            <Tag color="blue">Reliability {event.reliability}%</Tag>
          </Tooltip>
          <Tooltip title="Minutes since latest update">
            <Tag icon={<Clock size={14} />}>{event.freshnessMinutes}m</Tag>
          </Tooltip>
        </Flex>
      </Flex>
      <Summary>{event.summary}</Summary>
      <Flex wrap gap={6}>
        {event.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
        {event.regions.map((region) => (
          <Tag key={region} color="cyan">
            {region}
          </Tag>
        ))}
      </Flex>
      <Flex justify="space-between" align="center">
        <Metrics>
          <span>
            <BarChart3 size={14} /> Impact {event.impactScore}%
          </span>
          <span>
            <Layers3 size={14} /> Coverage {event.coverageScore}%
          </span>
          <span>{momentumLabel}</span>
        </Metrics>
        <Space>
          <Button
            size="small"
            icon={<ShieldCheck size={14} />}
            onClick={(eventInstance) => {
              eventInstance.stopPropagation()
              onFactCheck()
            }}>
            Fact Check
          </Button>
          <Button
            size="small"
            icon={<Sparkles size={14} />}
            type="primary"
            onClick={(eventInstance) => {
              eventInstance.stopPropagation()
              onSelect()
            }}>
            Open Brief
          </Button>
        </Space>
      </Flex>
    </EventCardContainer>
  )
}

type EventDetailProps = {
  event: NewsroomEvent | null
}

/**
 * 事件详细信息
 */
const EventDetail: FC<EventDetailProps> = ({ event }) => {
  if (!event) {
    return (
      <Card bordered={false} title="AI briefing">
        <Empty description="Select an event to see cross-source insights." />
      </Card>
    )
  }

  return (
    <Card bordered={false} title="AI briefing" styles={{ body: { display: 'flex', flexDirection: 'column', gap: 16 } }}>
      <Flex gap={12} wrap>
        <Tag color="blue">{event.category}</Tag>
        <Tag color={event.sentiment === 'positive' ? 'green' : event.sentiment === 'negative' ? 'red' : 'default'}>
          Sentiment: {event.sentiment}
        </Tag>
        <Tag color="purple">Fresh update {dayjs().subtract(event.freshnessMinutes, 'minute').fromNow()}</Tag>
      </Flex>
      <Card size="small" title="AI synthesis" bordered>
        <p>{event.aiSummary}</p>
      </Card>
      <div>
        <SectionTitle>Recommended actions</SectionTitle>
        <List
          dataSource={event.recommendedActions}
          renderItem={(item) => (
            <List.Item key={item}>
              <Flex align="center" gap={8}>
                <CheckCircle2 size={16} />
                <span>{item}</span>
              </Flex>
            </List.Item>
          )}
        />
      </div>
      <div>
        <SectionTitle>Source timeline</SectionTitle>
        <List
          itemLayout="vertical"
          dataSource={event.articles}
          renderItem={(article) => (
            <List.Item key={article.id}>
              <Flex justify="space-between" align="center">
                <div>
                  <Flex align="center" gap={6}>
                    <strong>{article.outlet}</strong>
                    <Tag color={article.tone === 'positive' ? 'green' : article.tone === 'negative' ? 'red' : 'default'}>
                      {article.tone}
                    </Tag>
                  </Flex>
                  <Headline>{article.headline}</Headline>
                  <small>{article.viewpoint}</small>
                </div>
                <Space direction="vertical" align="end">
                  <span>{dayjs(article.publishedAt).fromNow()}</span>
                  <Button
                    size="small"
                    type="link"
                    icon={<Link2 size={14} />}
                    href={article.url}
                    target="_blank"
                    rel="noreferrer">
                    Open
                  </Button>
                </Space>
              </Flex>
            </List.Item>
          )}
        />
      </div>
      <Card size="small" title="Distribution intelligence" bordered>
        <Flex vertical gap={8}>
          <Flex gap={8} align="center">
            <Workflow size={16} />
            <span>{event.distributionNotes}</span>
          </Flex>
          <Space>
            <Button icon={<Sparkles size={14} />}>Generate omni-channel draft</Button>
            <Button icon={<PlayCircle size={14} />} type="primary">
              Launch avatar briefing
            </Button>
          </Space>
        </Flex>
      </Card>
    </Card>
  )
}

type TrendSidebarProps = {
  trends: TrendInsight[]
  presets: typeof MOCK_PRESETS
  plugins: MarketPlugin[]
}

/**
 * 趋势与插件侧栏
 */
const TrendSidebar: FC<TrendSidebarProps> = ({ trends, presets, plugins }) => {
  return (
    <SidebarStack>
      <Card bordered={false} title="Trend pulse" styles={{ body: { display: 'flex', flexDirection: 'column', gap: 12 } }}>
        {trends.map((trend) => (
          <TrendItem key={trend.id}>
            <Flex justify="space-between" align="center">
              <strong>{trend.topic}</strong>
              <Tag color={trend.momentum === 'rising' ? 'green' : trend.momentum === 'falling' ? 'red' : 'gold'}>
                {trend.momentum}
              </Tag>
            </Flex>
            <Progress percent={trend.volume} showInfo={false} />
            <small>{trend.highlight}</small>
          </TrendItem>
        ))}
      </Card>

      <Card bordered={false} title="Distribution playbooks">
        <List
          dataSource={presets}
          renderItem={(preset) => (
            <List.Item key={preset.id}>
              <Flex vertical gap={4}>
                <strong>{preset.channel}</strong>
                <span>{preset.format}</span>
                <small>{preset.cadence}</small>
                <Tag>{preset.tone}</Tag>
                <Tooltip title={preset.automation}>
                  <Button size="small" icon={<Sparkles size={14} />}>Auto-build package</Button>
                </Tooltip>
              </Flex>
            </List.Item>
          )}
        />
      </Card>

      <Card bordered={false} title="MCP marketplace">
        <List
          dataSource={plugins}
          renderItem={(plugin) => (
            <List.Item key={plugin.id}>
              <Flex justify="space-between" align="center">
                <div>
                  <strong>{plugin.name}</strong>
                  <div>{plugin.vendor}</div>
                  <Space size={4} wrap>
                    {plugin.capabilities.map((capability) => (
                      <Tag key={capability} color="blue">
                        {capability}
                      </Tag>
                    ))}
                  </Space>
                </div>
                <Space direction="vertical" align="end">
                  <Tag color="purple">{plugin.category}</Tag>
                  <Tag color={plugin.status === 'certified' ? 'green' : 'orange'}>{plugin.status}</Tag>
                  <Button size="small" icon={<Layers3 size={14} />}>Install</Button>
                </Space>
              </Flex>
            </List.Item>
          )}
        />
      </Card>

      <Card bordered={false} title="Operational guardrails" styles={{ body: { display: 'flex', flexDirection: 'column', gap: 12 } }}>
        <Flex align="center" justify="space-between">
          <span>Fact-check SLA</span>
          <Tag color="green">&lt; 5s</Tag>
        </Flex>
        <Flex align="center" justify="space-between">
          <span>Deduplication accuracy</span>
          <Tag color="blue">97%</Tag>
        </Flex>
        <Flex align="center" justify="space-between">
          <span>Daily throughput</span>
          <Tag color="cyan">10k+ stories</Tag>
        </Flex>
        <Flex align="center" gap={8}>
          <AlertTriangle size={16} color="var(--color-warning)" />
          <span>Connect ElevenLabs + digital avatar endpoints to enable voice briefings.</span>
        </Flex>
      </Card>

      <Card bordered={false} title="Smart notes workspace">
        <Flex vertical gap={12}>
          <span>Auto-sync verified insights into the collaborative note hub.</span>
          <Switch checked disabled />
          <Button type="primary" icon={<Sparkles size={14} />}>Open knowledge notebook</Button>
        </Flex>
      </Card>
    </SidebarStack>
  )
}

type FactCheckModalProps = {
  state: FactCheckState
  onClose: () => void
}

/**
 * 事实核查弹窗
 */
const FactCheckModal: FC<FactCheckModalProps> = ({ state, onClose }) => {
  const { visible, loading, event, result } = state

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={onClose}
      okText="Close"
      title={event ? `Fact Check · ${event.title}` : 'Fact Check'}
      confirmLoading={loading}
      width={640}>
      {loading && <p>Running Perplexity Sonar + MCP verification…</p>}
      {!loading && result && (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Flex align="center" gap={8}>
            <ShieldCheck size={18} />
            <Tag color={result.verdict === 'verified' ? 'green' : result.verdict === 'needs_review' ? 'gold' : 'red'}>
              {result.verdict.replace('_', ' ')}
            </Tag>
            <span>AI confidence {result.aiConfidence}% · {result.latencyMs}ms</span>
          </Flex>
          <p>{result.summary}</p>
          <Divider style={{ margin: '8px 0' }} />
          <SectionTitle>Reference set</SectionTitle>
          <List
            dataSource={result.references}
            renderItem={(reference) => (
              <List.Item key={reference.url}>
                <Flex justify="space-between" align="center">
                  <span>{reference.title}</span>
                  <Space>
                    <Tag color={reference.stance === 'supporting' ? 'green' : reference.stance === 'disputing' ? 'red' : 'blue'}>
                      {reference.stance}
                    </Tag>
                    <Button size="small" type="link" href={reference.url} target="_blank" rel="noreferrer">
                      View source
                    </Button>
                  </Space>
                </Flex>
              </List.Item>
            )}
          />
          <SectionTitle>Risk notes</SectionTitle>
          <List dataSource={result.riskNotes} renderItem={(note) => <List.Item key={note}>{note}</List.Item>} />
        </Space>
      )}
    </Modal>
  )
}

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 16px;
  height: 100%;
  padding: 16px 20px 20px;
  background: var(--color-background);
  color: var(--color-text);
  overflow: hidden;
`

const FiltersColumn = styled.div`
  width: 280px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding-right: 4px;
`

const FeedColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
`

const TrendColumn = styled.div`
  width: 320px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 16px;
  padding-right: 4px;
`

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
`

const EventCardContainer = styled.div<{ $active: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary)' : 'var(--border-color)')};
  border-radius: 12px;
  padding: 14px 16px;
  background: ${({ $active }) => ($active ? 'var(--color-primary-bg)' : 'var(--color-background-soft)')};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
  }

  .event-title {
    font-weight: 600;
  }
`

const Summary = styled.p`
  margin: 0;
  color: var(--color-text-2);
`

const Metrics = styled.div`
  display: flex;
  gap: 16px;
  color: var(--color-text-2);

  span {
    display: inline-flex;
    gap: 4px;
    align-items: center;
  }
`

const SectionTitle = styled.h4`
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
`

const Headline = styled.p`
  margin: 4px 0 0;
  font-weight: 500;
`

const SidebarStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const TrendItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.div`
  margin-bottom: 4px;
  font-weight: 500;
`

export default NewsroomPage
