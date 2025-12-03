import { DashboardCard } from './DashboardCard'
import { Tooltip, Chip } from "@heroui/react";

// 停车事件
interface DowntimeEvent {
  id: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  reason: string
  description?: string
  type: 'planned' | 'unplanned' // 计划停车 / 非计划停车
}

interface YearlyDowntimeTimelineProps {
  year?: number
  events?: DowntimeEvent[]
}

// 示例数据
const mockEvents: DowntimeEvent[] = [
  {
    id: '1',
    startDate: '2025-01-15',
    endDate: '2025-01-18',
    reason: '年度大修',
    description: '设备全面检修维护,更换老化部件',
    type: 'planned'
  },
  {
    id: '2',
    startDate: '2025-03-10',
    endDate: '2025-03-12',
    reason: '设备故障',
    description: '主机轴承损坏,紧急维修',
    type: 'unplanned'
  },
  {
    id: '3',
    startDate: '2025-05-01',
    endDate: '2025-05-03',
    reason: '五一维护',
    description: '节假日计划维护',
    type: 'planned'
  },
  {
    id: '4',
    startDate: '2025-07-22',
    endDate: '2025-07-23',
    reason: '电力故障',
    description: '区域供电中断',
    type: 'unplanned'
  },
  {
    id: '5',
    startDate: '2025-09-08',
    endDate: '2025-09-10',
    reason: '设备升级',
    description: '控制系统软件升级',
    type: 'planned'
  },
  {
    id: '6',
    startDate: '2025-11-28',
    endDate: '2025-11-29',
    reason: '安全检查',
    description: '年度安全检查停车',
    type: 'planned'
  }
]

// 计算日期在一年中的天数位置
const getDayOfYear = (dateStr: string): number => {
  const date = new Date(dateStr)
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const diff = date.getTime() - startOfYear.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}

// 计算两个日期之间的天数
const getDaysBetween = (start: string, end: string): number => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = endDate.getTime() - startDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}

// 格式化日期范围
const formatDateRange = (start: string, end: string): string => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}月${day}日`
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

function YearlyDowntimeTimeline({
  year = 2025,
  events = mockEvents
}: YearlyDowntimeTimelineProps): React.JSX.Element {
  // 计算总停车天数
  const totalDowntimeDays = events.reduce((sum, event) => {
    return sum + getDaysBetween(event.startDate, event.endDate)
  }, 0)

  // 分类统计
  const plannedCount = events.filter((e) => e.type === 'planned').length
  const unplannedCount = events.filter((e) => e.type === 'unplanned').length

  // 月份标签
  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  // 计算事件在时间轴上的位置
  const getEventPosition = (event: DowntimeEvent) => {
    const startDay = getDayOfYear(event.startDate)
    const days = getDaysBetween(event.startDate, event.endDate)

    // 一年按365天计算
    const left = (startDay / 365) * 100
    const width = (days / 365) * 100

    return { left: `${left}%`, width: `${width}%` }
  }

  return (
    <DashboardCard
      title={`${year}年停车记录`}
      headerContent={
          <div className="flex flex-wrap gap-2 justify-end">
             <Chip size="sm" variant="flat" color="default">总数: {events.length}</Chip>
             <Chip size="sm" variant="flat" color="danger">停机: {totalDowntimeDays}天</Chip>
             <Chip size="sm" variant="dot" color="primary">计划: {plannedCount}</Chip>
             <Chip size="sm" variant="dot" color="warning">非计划: {unplannedCount}</Chip>
          </div>
      }
    >
       <div className="flex items-center h-full w-full px-4 py-8 relative select-none">
          {/* Track */}
          <div className="w-full h-1.5 bg-default-100 rounded-full relative">
              {/* Month Markers */}
              {months.map((month, index) => {
                const monthPosition = (index / (months.length - 1)) * 100
                return (
                  <div
                    key={month}
                    className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                    style={{ left: `${monthPosition}%` }}
                  >
                    <div className="w-0.5 h-3 bg-default-300 mb-6"></div>
                    <span className="text-[10px] text-default-500 absolute top-4 whitespace-nowrap">{month}</span>
                  </div>
                )
              })}

              {/* Events */}
              {events.map((event) => {
                  const position = getEventPosition(event)
                  const color = event.type === 'planned' ? 'primary' : 'warning';
                  const bgClass = event.type === 'planned' ? 'bg-primary' : 'bg-warning';
                  
                  return (
                    <Tooltip
                        key={event.id}
                        content={
                            <div className="px-1 py-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <Chip size="sm" color={color} variant="flat">{event.type === 'planned' ? '计划停车' : '非计划停车'}</Chip>
                                    <span className="font-bold text-small">{event.reason}</span>
                                </div>
                                <div className="text-tiny text-default-500 mb-1">
                                    {formatDateRange(event.startDate, event.endDate)} ({getDaysBetween(event.startDate, event.endDate)}天)
                                </div>
                                {event.description && (
                                    <div className="text-tiny text-default-400 max-w-xs">{event.description}</div>
                                )}
                            </div>
                        }
                    >
                        <div
                            className={`absolute h-4 top-1/2 -translate-y-1/2 rounded-sm cursor-pointer transition-all hover:h-6 hover:z-10 shadow-sm ${bgClass}`}
                            style={{
                                left: position.left,
                                width: `max(6px, ${position.width})` // Ensure at least visible
                            }}
                        ></div>
                    </Tooltip>
                  )
              })}
          </div>
       </div>
    </DashboardCard>
  )
}

export default YearlyDowntimeTimeline
