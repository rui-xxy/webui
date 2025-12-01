import { useState } from 'react'

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
  const [hoveredEvent, setHoveredEvent] = useState<DowntimeEvent | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const todayDayOfYear = getDayOfYear(new Date().toISOString().split('T')[0])
  const todayPosition = (todayDayOfYear / 365) * 100

  // 计算总停车天数
  const totalDowntimeDays = events.reduce((sum, event) => {
    return sum + getDaysBetween(event.startDate, event.endDate)
  }, 0)

  // 分类统计
  const plannedCount = events.filter(e => e.type === 'planned').length
  const unplannedCount = events.filter(e => e.type === 'unplanned').length

  // 月份标签
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  // 计算事件在时间轴上的位置
  const getEventPosition = (event: DowntimeEvent) => {
    const startDay = getDayOfYear(event.startDate)
    const days = getDaysBetween(event.startDate, event.endDate)
    
    // 一年按365天计算
    const left = (startDay / 365) * 100
    const width = (days / 365) * 100
    
    return { left: `${left}%`, width: `${width}%` }
  }

  // 处理鼠标悬停
  const handleMouseEnter = (event: DowntimeEvent, e: React.MouseEvent) => {
    setHoveredEvent(event)
    
    // 获取鼠标位置
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    })
  }

  const handleMouseLeave = () => {
    setHoveredEvent(null)
  }

  return (
    <div className="chart-container">
      <div className="sa-chart-card">
        {/* 标题区域 */}
        <div className="sa-chart-header">
          <div>
            <h2 className="sa-chart-title">{year}年停车记录</h2>
          </div>
          <div className="yearly-timeline-summary">
            <div className="yearly-timeline-stat">
              <span className="yearly-timeline-stat-value">{events.length}</span>
            </div>
            <div className="yearly-timeline-stat">
              <span className="yearly-timeline-stat-value danger">{totalDowntimeDays}</span>
            </div>
            <div className="yearly-timeline-stat">
              <span className="yearly-timeline-stat-value planned">{plannedCount}</span>
            </div>
            <div className="yearly-timeline-stat">
              <span className="yearly-timeline-stat-value unplanned">{unplannedCount}</span>
            </div>
          </div>
        </div>

        <div className="sa-chart-body yearly-timeline-body">
          {/* 时间轴主体 */}
          <div className="yearly-timeline-main">
            <div className="yearly-timeline-track">
              <div className="yearly-timeline-axis-line"></div>

              {/* 月份刻度 */}
              {months.map((month, index) => {
                const monthPosition = (index / (months.length - 1)) * 100

                return (
                <div
                  key={month}
                  className="yearly-timeline-month-marker"
                  style={{ left: `${monthPosition}%` }}
                >
                  <span className="yearly-timeline-month-tick"></span>
                  <span className="yearly-timeline-month-label">{month}</span>
                </div>
                )
              })}

              {/* 停车事件段 */}
              <div className="yearly-timeline-events">
                {events.map((event) => {
                  const position = getEventPosition(event)
                  const isHovered = hoveredEvent?.id === event.id
                  const colorClass = event.type === 'planned' ? 'planned' : 'unplanned'

                  return (
                    <div
                      key={event.id}
                      className={`yearly-timeline-event ${colorClass} ${isHovered ? 'hovered' : ''}`}
                      style={{
                        left: position.left,
                        width: position.width
                      }}
                      onMouseEnter={(e) => handleMouseEnter(event, e)}
                      onMouseLeave={handleMouseLeave}
                    ></div>
                  )
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 悬浮提示框 */}
      {hoveredEvent && (
        <div
          className="yearly-timeline-tooltip"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 10}px`
          }}
        >
          <div className="yearly-timeline-tooltip-header">
            <span className={`yearly-timeline-tooltip-badge ${hoveredEvent.type}`}>
              {hoveredEvent.type === 'planned' ? '计划停车' : '非计划停车'}
            </span>
          </div>
          <div className="yearly-timeline-tooltip-title">{hoveredEvent.reason}</div>
          <div className="yearly-timeline-tooltip-date">
            {formatDateRange(hoveredEvent.startDate, hoveredEvent.endDate)}
          </div>
          <div className="yearly-timeline-tooltip-duration">
            停车时长: {getDaysBetween(hoveredEvent.startDate, hoveredEvent.endDate)} 天
          </div>
          {hoveredEvent.description && (
            <div className="yearly-timeline-tooltip-desc">{hoveredEvent.description}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default YearlyDowntimeTimeline
