import { useCallback, useEffect, useState, useRef } from 'react'
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
import { Card, CardBody, Tabs, Tab, Chip, Divider } from "@heroui/react";
import { DashboardCard } from './DashboardCard';

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
const energyConsumptionItems = consumptionData.filter((item) =>
  ENERGY_CONSUMPTION_TYPES.includes(item.id)
)
const rawMaterialConsumptionItems = consumptionData.filter((item) =>
  RAW_MATERIAL_CONSUMPTION_TYPES.includes(item.id)
)

// 获取状态配置
const getStatusConfig = (current: number, standard: number) => {
  const ratio = current / standard
  if (ratio <= 0.8) return { color: '#10b981', semantic: 'success' as const, text: '优秀' }
  if (ratio <= 1.0) return { color: '#3b82f6', semantic: 'primary' as const, text: '正常' }
  if (ratio <= 1.1) return { color: '#f59e0b', semantic: 'warning' as const, text: '预警' }
  return { color: '#ef4444', semantic: 'danger' as const, text: '超标' }
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

  const statusConfig = getStatusConfig(item.today, item.standard)
  const percentage = ((item.today / item.standard) * 100).toFixed(1)

  const handleCardClick = (): void => {
    const newExpanded = !expanded
    setExpanded(newExpanded)
    onExpandChange?.(newExpanded)
  }

  return (
    <Card 
        isPressable 
        onPress={handleCardClick}
        className={`w-full transition-all duration-300 border-none bg-content2/50 hover:bg-content2/80`}
        shadow="none"
    >
      <CardBody className="p-3 overflow-hidden">
        {/* Main Info Row */}
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
                <div className="text-2xl">{item.icon}</div>
                <div>
                    <p className="text-small font-medium text-default-500">{item.name}</p>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-lg font-bold text-${statusConfig.semantic}`}>{item.today.toLocaleString('zh-CN')}</span>
                        <span className="text-tiny text-default-400">{item.unit}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                <Chip size="sm" color={statusConfig.semantic} variant="flat">{statusConfig.text}</Chip>
                <span className="text-tiny text-default-400">{percentage}% 标准</span>
            </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
            <div className="mt-4 w-full animate-appearance-in cursor-default" onClick={(e) => e.stopPropagation()}>
                <Divider className="my-2" />
                <div className="flex justify-between items-center mb-2">
                    <Tabs 
                        size="sm" 
                        variant="light" 
                        aria-label="View Mode" 
                        selectedKey={viewMode} 
                        onSelectionChange={(k) => setViewMode(k as any)}
                        color="primary"
                    >
                        <Tab key="week" title="本周趋势" />
                        <Tab key="month" title="本月对比" />
                    </Tabs>
                </div>
                
                <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {viewMode === 'week' ? (
                    <LineChart data={item.weekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--heroui-default-200))" opacity={0.5} />
                        <XAxis dataKey="date" tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--heroui-background))',
                                border: '1px solid hsl(var(--heroui-default-200))',
                                borderRadius: 8,
                                fontSize: 12
                            }}
                        />
                        <Line
                        type="monotone"
                        dataKey="value"
                        stroke={statusConfig.color}
                        strokeWidth={2}
                        dot={{ fill: statusConfig.color, r: 4 }}
                        activeDot={{ r: 6 }}
                        />
                    </LineChart>
                    ) : (
                    <BarChart data={item.monthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--heroui-default-200))" opacity={0.5} />
                        <XAxis dataKey="date" tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--heroui-background))',
                                border: '1px solid hsl(var(--heroui-default-200))',
                                borderRadius: 8,
                                fontSize: 12
                            }}
                        />
                        <Bar dataKey="value" fill={statusConfig.color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                    )}
                </ResponsiveContainer>
                </div>

                {/* Stats */}
                <div className="flex justify-between mt-2 bg-default-50 p-2 rounded-lg">
                    <div className="flex flex-col">
                        <span className="text-tiny text-default-500">平均值</span>
                        <span className="text-small font-medium">
                            {(
                                (viewMode === 'week' ? item.weekData : item.monthData).reduce(
                                (sum, d) => sum + d.value,
                                0
                                ) / (viewMode === 'week' ? 7 : 4)
                            ).toFixed(1)}{' '}
                            {item.unit}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-tiny text-default-500">标准值</span>
                        <span className="text-small font-medium">
                            {item.standard} {item.unit}
                        </span>
                    </div>
                </div>
            </div>
        )}
      </CardBody>
    </Card>
  )
}

const useConsumptionExpansion = (
  onExpandChange?: (expanded: boolean) => void
): ((id: ConsumptionType, expanded: boolean) => void) => {
  const [expandedCards, setExpandedCards] = useState<Set<ConsumptionType>>(new Set())
  const prevHasExpandedRef = useRef(expandedCards.size > 0)

  useEffect(() => {
    const hasExpanded = expandedCards.size > 0
    if (prevHasExpandedRef.current === hasExpanded) {
      return
    }
    prevHasExpandedRef.current = hasExpanded
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
    <DashboardCard title={title}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full content-start">
          {items.map((item) => (
            <ConsumptionCard
              key={item.id}
              item={item}
              onExpandChange={(expanded) => handleCardExpandChange(item.id, expanded)}
            />
          ))}
        </div>
    </DashboardCard>
  )
}

export function EnergyConsumptionMonitor({
  onExpandChange
}: ConsumptionMonitorProps): React.JSX.Element {
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
