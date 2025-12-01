import { useCallback, useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

type ConsumptionType = 'water' | 'electricity' | 'hydrogen-peroxide' | 'pyrite'

type ConsumptionItem = {
  id: ConsumptionType
  name: string
  icon: string
  unit: string
  today: number
  standard: number // 标准值
  weekData: { date: string; value: number }[]
  monthData: { date: string; value: number }[]
}

interface ConsumptionMonitorProps {
  onExpandChange?: (expanded: boolean) => void
}

// 示例数据
const consumptionData: ConsumptionItem[] = [
  {
    id: 'water',
    name: '水',
    icon: '💧',
    unit: '吨',
    today: 245.8,
    standard: 250,
    weekData: [
      { date: '周一', value: 238 },
      { date: '周二', value: 242 },
      { date: '周三', value: 251 },
      { date: '周四', value: 239 },
      { date: '周五', value: 247 },
      { date: '周六', value: 244 },
      { date: '周日', value: 245.8 }
    ],
    monthData: [
      { date: '第1周', value: 1680 },
      { date: '第2周', value: 1720 },
      { date: '第3周', value: 1698 },
      { date: '第4周', value: 1715 }
    ]
  },
  {
    id: 'electricity',
    name: '电',
    icon: '⚡',
    unit: 'kWh',
    today: 3850,
    standard: 4000,
    weekData: [
      { date: '周一', value: 3780 },
      { date: '周二', value: 3820 },
      { date: '周三', value: 3950 },
      { date: '周四', value: 3760 },
      { date: '周五', value: 3890 },
      { date: '周六', value: 3810 },
      { date: '周日', value: 3850 }
    ],
    monthData: [
      { date: '第1周', value: 26500 },
      { date: '第2周', value: 27100 },
      { date: '第3周', value: 26800 },
      { date: '第4周', value: 26860 }
    ]
  },
  {
    id: 'hydrogen-peroxide',
    name: '双氧水',
    icon: '🧪',
    unit: 'kg',
    today: 185.5,
    standard: 200,
    weekData: [
      { date: '周一', value: 178 },
      { date: '周二', value: 182 },
      { date: '周三', value: 195 },
      { date: '周四', value: 175 },
      { date: '周五', value: 188 },
      { date: '周六', value: 181 },
      { date: '周日', value: 185.5 }
    ],
    monthData: [
      { date: '第1周', value: 1280 },
      { date: '第2周', value: 1320 },
      { date: '第3周', value: 1295 },
      { date: '第4周', value: 1284.5 }
    ]
  },
  {
    id: 'pyrite',
    name: '硫铁矿',
    icon: '⛏️',
    unit: '吨',
    today: 42.3,
    standard: 45,
    weekData: [
      { date: '周一', value: 41.2 },
      { date: '周二', value: 42.8 },
      { date: '周三', value: 43.5 },
      { date: '周四', value: 41.8 },
      { date: '周五', value: 42.9 },
      { date: '周六', value: 42.1 },
      { date: '周日', value: 42.3 }
    ],
    monthData: [
      { date: '第1周', value: 295 },
      { date: '第2周', value: 302 },
      { date: '第3周', value: 298 },
      { date: '第4周', value: 296.6 }
    ]
  }
]

const ENERGY_CONSUMPTION_TYPES: ConsumptionType[] = ['water', 'electricity']
const RAW_MATERIAL_CONSUMPTION_TYPES: ConsumptionType[] = ['hydrogen-peroxide', 'pyrite']
const energyConsumptionItems = consumptionData.filter((item) => ENERGY_CONSUMPTION_TYPES.includes(item.id))
const rawMaterialConsumptionItems = consumptionData.filter((item) =>
  RAW_MATERIAL_CONSUMPTION_TYPES.includes(item.id)
)

// 获取状态颜色
const getStatusColor = (current: number, standard: number): string => {
  const ratio = current / standard
  if (ratio <= 0.8) return '#10b981' // 优秀 - 绿色
  if (ratio <= 1.0) return '#3b82f6' // 正常 - 蓝色
  if (ratio <= 1.1) return '#f59e0b' // 预警 - 橙色
  return '#ef4444' // 超标 - 红色
}

const getStatusText = (current: number, standard: number): string => {
  const ratio = current / standard
  if (ratio <= 0.8) return '优秀'
  if (ratio <= 1.0) return '正常'
  if (ratio <= 1.1) return '预警'
  return '超标'
}

// 单个消耗卡片
function ConsumptionCard({
  item,
  onExpandChange
}: {
  item: ConsumptionItem
  onExpandChange?: (expanded: boolean) => void
}): React.JSX.Element {
  const [expanded, setExpanded] = useState(false)
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')

  const statusColor = getStatusColor(item.today, item.standard)
  const statusText = getStatusText(item.today, item.standard)
  const percentage = ((item.today / item.standard) * 100).toFixed(1)

  const handleCardClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
    const newExpanded = !expanded
    setExpanded(newExpanded)
    onExpandChange?.(newExpanded)
  }

  const handleToggleClick = (e: React.MouseEvent, mode: 'week' | 'month'): void => {
    e.stopPropagation()
    setViewMode(mode)
  }

  return (
    <div className={`consumption-card ${expanded ? 'expanded' : ''}`}>
      {/* 主卡片 */}
      <div className="consumption-card-main" onClick={handleCardClick}>
        <div className="consumption-icon">{item.icon}</div>
        <div className="consumption-info">
          <div className="consumption-name">{item.name}</div>
          <div className="consumption-value" style={{ color: statusColor }}>
            {item.today.toLocaleString('zh-CN')}
            <span className="consumption-unit">{item.unit}</span>
          </div>
          <div className="consumption-meta">
            <span className="consumption-status" style={{ color: statusColor }}>
              {statusText}
            </span>
            <span className="consumption-percentage">
              {percentage}% 标准值
            </span>
          </div>
        </div>
        <div className={`consumption-expand-icon ${expanded ? 'rotated' : ''}`}>
          ▼
        </div>
      </div>

      {/* 展开区域 */}
      {expanded && (
        <div className="consumption-detail">
          {/* 切换按钮 */}
          <div className="consumption-toggle">
            <button
              className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={(e) => handleToggleClick(e, 'week')}
            >
              本周趋势
            </button>
            <button
              className={`toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={(e) => handleToggleClick(e, 'month')}
            >
              本月对比
            </button>
          </div>

          {/* 图表区域 */}
          <div className="consumption-chart">
            <ResponsiveContainer width="100%" height={200}>
              {viewMode === 'week' ? (
                <LineChart data={item.weekData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    stroke="#d1d5db"
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    stroke="#d1d5db"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      fontSize: 12
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={statusColor}
                    strokeWidth={2}
                    dot={{ fill: statusColor, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={item.monthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    stroke="#d1d5db"
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    stroke="#d1d5db"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      fontSize: 12
                    }}
                  />
                  <Bar dataKey="value" fill={statusColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* 统计信息 */}
          <div className="consumption-stats">
            <div className="stat-item">
              <span className="stat-label">平均值</span>
              <span className="stat-value">
                {(
                  (viewMode === 'week' ? item.weekData : item.monthData).reduce(
                    (sum, d) => sum + d.value,
                    0
                  ) / (viewMode === 'week' ? 7 : 4)
                ).toFixed(1)}{' '}
                {item.unit}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">标准值</span>
              <span className="stat-value">
                {item.standard} {item.unit}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const useConsumptionExpansion = (
  onExpandChange?: (expanded: boolean) => void
): ((id: ConsumptionType, expanded: boolean) => void) => {
  const [expandedCards, setExpandedCards] = useState<Set<ConsumptionType>>(new Set())

  useEffect(() => {
    const hasExpanded = expandedCards.size > 0
    onExpandChange?.(hasExpanded)
  }, [expandedCards, onExpandChange])

  return useCallback((id: ConsumptionType, expanded: boolean) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev)
      if (expanded) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }, [])
}

interface ConsumptionSectionProps {
  title: string
  items: ConsumptionItem[]
  onCardExpandChange: (id: ConsumptionType, expanded: boolean) => void
}

function ConsumptionSection({
  title,
  items,
  onCardExpandChange
}: ConsumptionSectionProps): React.JSX.Element {
  return (
    <div className="sa-chart-card">
      <div className="sa-chart-header">
        <div>
          <h2 className="sa-chart-title">{title}</h2>
        </div>
      </div>

      <div className="sa-chart-body consumption-body">
        <div className="consumption-grid">
          {items.map((item) => (
            <ConsumptionCard
              key={item.id}
              item={item}
              onExpandChange={(expanded) => onCardExpandChange(item.id, expanded)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function BaseConsumptionMonitor({
  title,
  items,
  onExpandChange
}: {
  title: string
  items: ConsumptionItem[]
  onExpandChange?: (expanded: boolean) => void
}): React.JSX.Element {
  const handleCardExpandChange = useConsumptionExpansion(onExpandChange)

  return (
    <div className="chart-container">
      <ConsumptionSection title={title} items={items} onCardExpandChange={handleCardExpandChange} />
    </div>
  )
}

export function EnergyConsumptionMonitor({ onExpandChange }: ConsumptionMonitorProps): React.JSX.Element {
  return (
    <BaseConsumptionMonitor
      title="能耗"
      items={energyConsumptionItems}
      onExpandChange={onExpandChange}
    />
  )
}

export function RawMaterialConsumptionMonitor({
  onExpandChange
}: ConsumptionMonitorProps): React.JSX.Element {
  return (
    <BaseConsumptionMonitor
      title="原辅料消耗"
      items={rawMaterialConsumptionItems}
      onExpandChange={onExpandChange}
    />
  )
}
