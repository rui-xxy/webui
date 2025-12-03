import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts'
import { Tabs, Tab, Button } from '@heroui/react';
import { DashboardCard } from './DashboardCard';
import { GlassModal } from './GlassModal';

type ConsumptionType = 'water' | 'electricity' | 'hydrogen-peroxide' | 'pyrite'

// Icon components
const Icons = {
  water: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.74 9.94c.95 1.66.95 3.71 0 5.37a6.5 6.5 0 1 1-11.48 0c-.95-1.66-.95-3.71 0-5.37L12 2.69z" />
    </svg>
  ),
  electricity: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  'hydrogen-peroxide': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.31" />
      <path d="M14 2v7.31" />
      <path d="M8.5 2h7" />
      <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
    </svg>
  ),
  pyrite: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

type ConsumptionItem = {
  id: ConsumptionType
  name: string
  unit: string
  today: number
  standard: number // 标准值
  weekData: { date: string; value: number }[]
  monthData: { date: string; value: number }[]
}

interface ConsumptionMonitorProps {}

// 示例数据
const consumptionData: ConsumptionItem[] = [
  {
    id: 'water',
    name: '水',
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
  if (ratio <= 0.8) return { color: '#10b981', semantic: 'success' as const, text: '优秀', bg: 'bg-success/10', textClass: 'text-success' }
  if (ratio <= 1.0) return { color: '#3b82f6', semantic: 'primary' as const, text: '正常', bg: 'bg-primary/10', textClass: 'text-primary' }
  if (ratio <= 1.1) return { color: '#f59e0b', semantic: 'warning' as const, text: '预警', bg: 'bg-warning/10', textClass: 'text-warning' }
  return { color: '#ef4444', semantic: 'danger' as const, text: '超标', bg: 'bg-danger/10', textClass: 'text-danger' }
}

// 单个消耗卡片
function ConsumptionCard({
  item,
  onClick
}: {
  item: ConsumptionItem
  onClick: () => void
}): React.JSX.Element {
  const statusConfig = getStatusConfig(item.today, item.standard)
  const percentage = ((item.today / item.standard) * 100).toFixed(1)

  return (
    <div
        onClick={onClick}
        className="group relative w-full overflow-hidden rounded-2xl bg-default-50 border border-default-200 hover:border-default-300 transition-all duration-300 cursor-pointer"
    >
      {/* Hover Effect */}
      <div className={`absolute inset-0 ${statusConfig.bg} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />

      <div className="relative p-4 flex items-center justify-start">
          <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${statusConfig.bg} ${statusConfig.textClass} group-hover:scale-110 transition-transform duration-300`}>
                  {Icons[item.id]}
              </div>
              <div className="flex flex-col gap-1">
                  <p className="text-small font-medium text-default-500">{item.name}</p>
                  <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-bold text-foreground`}>
                          {item.today.toLocaleString('zh-CN')}
                      </span>
                      <span className="text-tiny text-default-400">{item.unit}</span>
                  </div>
              </div>
          </div>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-default-200">
          <div 
              className={`h-full ${statusConfig.bg.replace('/10', '')} transition-all duration-500`} 
              style={{ width: `${Math.min(Number(percentage), 100)}%`, backgroundColor: statusConfig.color }}
          />
      </div>
    </div>
  )
}

function BaseConsumptionMonitor({
  title,
  items,
}: {
  title: string
  items: ConsumptionItem[]
}): React.JSX.Element {
  const [selectedItem, setSelectedItem] = useState<ConsumptionItem | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const handleCardClick = (item: ConsumptionItem) => {
    setSelectedItem(item);
    setViewMode('week');
  };

  const handleClose = () => {
    setSelectedItem(null);
    setViewMode('week');
  };

  const selectedStatusConfig = selectedItem ? getStatusConfig(selectedItem.today, selectedItem.standard) : null;

  return (
    <>
        <DashboardCard title={title}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full content-start p-1">
            {items.map((item) => (
                <ConsumptionCard
                key={item.id}
                item={item}
                onClick={() => handleCardClick(item)}
                />
            ))}
            </div>
        </DashboardCard>

        <GlassModal isOpen={!!selectedItem} onClose={handleClose} className="w-[min(900px,92vw)] max-h-[78vh]">
          {selectedItem && selectedStatusConfig && (
            <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto px-2 sm:px-6 py-6">
              <div className="flex items-center gap-3 border-b border-default-200/60 pb-4">
                <div className={`p-2 rounded-lg ${selectedStatusConfig?.bg} ${selectedStatusConfig?.textClass}`}>
                  {Icons[selectedItem.id]}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold">{selectedItem.name}消耗详情</span>
                  <span className="text-tiny text-default-500">
                    当前: {selectedItem.today} {selectedItem.unit} / 标准: {selectedItem.standard} {selectedItem.unit}
                  </span>
                </div>
                <Button color="danger" variant="light" className="ml-auto" onPress={handleClose}>
                  关闭
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col p-3 rounded-xl bg-content1/40 border border-default-200/50">
                    <span className="text-tiny text-default-500">今日消耗</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-bold ${selectedStatusConfig.textClass}`}>{selectedItem.today}</span>
                      <span className="text-tiny text-default-400">{selectedItem.unit}</span>
                    </div>
                  </div>
                  <div className="flex flex-col p-3 rounded-xl bg-content1/40 border border-default-200/50">
                    <span className="text-tiny text-default-500">标准限额</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-default-700">{selectedItem.standard}</span>
                      <span className="text-tiny text-default-400">{selectedItem.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Tabs
                    size="sm"
                    aria-label="View Mode"
                    selectedKey={viewMode}
                    onSelectionChange={(key) => setViewMode(key as 'week' | 'month')}
                    color={selectedStatusConfig.semantic}
                    variant="bordered"
                  >
                    <Tab key="week" title="本周趋势" />
                    <Tab key="month" title="本月对比" />
                  </Tabs>
                </div>
              </div>

              <div className="h-[260px] w-full bg-content1/40 rounded-2xl p-4 border border-default-200/50">
                <ResponsiveContainer width="100%" height="100%">
                  {viewMode === 'week' ? (
                    <LineChart data={selectedItem.weekData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--heroui-default-200))" opacity={0.5} vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                      <YAxis tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--heroui-background))',
                          border: '1px solid hsl(var(--heroui-default-200))',
                          borderRadius: 12,
                          fontSize: 12,
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        cursor={{ stroke: selectedStatusConfig.color, strokeWidth: 1, strokeDasharray: '5 5' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={selectedStatusConfig.color}
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--heroui-background))', stroke: selectedStatusConfig.color, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: selectedStatusConfig.color }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={selectedItem.monthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--heroui-default-200))" opacity={0.5} vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                      <YAxis tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
                      <RechartsTooltip
                        cursor={{ fill: 'hsl(var(--heroui-default-100))', opacity: 0.5 }}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--heroui-background))',
                          border: '1px solid hsl(var(--heroui-default-200))',
                          borderRadius: 12,
                          fontSize: 12,
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Bar dataKey="value" fill={selectedStatusConfig.color} radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </GlassModal>
    </>
  )
}

export function EnergyConsumptionMonitor({}: ConsumptionMonitorProps): React.JSX.Element {
  return (
    <BaseConsumptionMonitor
      title="能耗"
      items={energyConsumptionItems}
    />
  )
}

export function RawMaterialConsumptionMonitor({}: ConsumptionMonitorProps): React.JSX.Element {
  return (
    <BaseConsumptionMonitor
      title="原辅料消耗"
      items={rawMaterialConsumptionItems}
    />
  )
}
