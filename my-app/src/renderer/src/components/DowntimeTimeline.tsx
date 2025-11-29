import { useState } from 'react'

// 停机事件类型
type DowntimeEventType = 'maintenance' | 'malfunction' | 'material' | 'other'

interface DowntimeEvent {
  id: string
  startTime: string // HH:mm
  endTime: string // HH:mm
  duration: number // 分钟
  type: DowntimeEventType
  reason: string
  description?: string
}

interface DowntimeTimelineProps {
  date?: string
  events?: DowntimeEvent[]
}

// 示例数据
const mockEvents: DowntimeEvent[] = [
  {
    id: '1',
    startTime: '08:30',
    endTime: '09:15',
    duration: 45,
    type: 'maintenance',
    reason: '计划维护',
    description: '定期保养,更换滤芯'
  },
  {
    id: '2',
    startTime: '11:20',
    endTime: '11:50',
    duration: 30,
    type: 'malfunction',
    reason: '设备故障',
    description: '传感器异常,已修复'
  },
  {
    id: '3',
    startTime: '14:10',
    endTime: '14:35',
    duration: 25,
    type: 'material',
    reason: '原料中断',
    description: '供料系统堵塞'
  },
  {
    id: '4',
    startTime: '16:45',
    endTime: '17:00',
    duration: 15,
    type: 'other',
    reason: '交接班',
    description: '班次交接检查'
  }
]

// 获取事件类型配置
const getEventTypeConfig = (type: DowntimeEventType) => {
  const configs = {
    maintenance: {
      label: '维护',
      color: '#3b82f6',
      bgColor: '#dbeafe',
      icon: '🔧'
    },
    malfunction: {
      label: '故障',
      color: '#ef4444',
      bgColor: '#fee2e2',
      icon: '⚠️'
    },
    material: {
      label: '原料',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      icon: '📦'
    },
    other: {
      label: '其他',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      icon: '📋'
    }
  }
  return configs[type]
}

// 时间转分钟(从0点开始)
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function DowntimeTimeline({ 
  date = new Date().toLocaleDateString('zh-CN'),
  events = mockEvents 
}: DowntimeTimelineProps): React.JSX.Element {
  const [selectedEvent, setSelectedEvent] = useState<DowntimeEvent | null>(null)
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null)

  // 工作时间范围 (8:00 - 18:00)
  const workStartMinutes = 8 * 60 // 480分钟
  const workEndMinutes = 18 * 60 // 1080分钟
  const workDurationMinutes = workEndMinutes - workStartMinutes // 600分钟

  // 计算总停机时间
  const totalDowntime = events.reduce((sum, event) => sum + event.duration, 0)
  const totalDowntimeHours = (totalDowntime / 60).toFixed(1)

  // 生成时间刻度标签 (每2小时一个)
  const timeMarks: string[] = []
  for (let i = 8; i <= 18; i += 2) {
    timeMarks.push(`${String(i).padStart(2, '0')}:00`)
  }

  // 计算事件在时间轴上的位置和宽度(百分比)
  const getEventPosition = (event: DowntimeEvent) => {
    const startMinutes = timeToMinutes(event.startTime)
    const endMinutes = timeToMinutes(event.endTime)
    
    const left = ((startMinutes - workStartMinutes) / workDurationMinutes) * 100
    const width = ((endMinutes - startMinutes) / workDurationMinutes) * 100
    
    return { left: `${left}%`, width: `${width}%` }
  }

  // 格式化时长
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}分钟`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  }

  return (
    <div className="chart-container">
      <div className="sa-chart-card">
        {/* 标题区域 */}
        <div className="sa-chart-header">
          <div>
            <h2 className="sa-chart-title">停机时间轴</h2>
            <p className="sa-chart-subtitle">{date} · 工作时段 08:00 - 18:00</p>
          </div>
          <div className="timeline-summary">
            <div className="timeline-summary-item">
              <span className="timeline-summary-label">停机次数</span>
              <span className="timeline-summary-value">{events.length}次</span>
            </div>
            <div className="timeline-summary-divider"></div>
            <div className="timeline-summary-item">
              <span className="timeline-summary-label">总停机时长</span>
              <span className="timeline-summary-value danger">{totalDowntimeHours}小时</span>
            </div>
          </div>
        </div>

        <div className="sa-chart-body timeline-body">
          {/* 图例 */}
          <div className="timeline-legend">
            {(['maintenance', 'malfunction', 'material', 'other'] as DowntimeEventType[]).map((type) => {
              const config = getEventTypeConfig(type)
              const count = events.filter(e => e.type === type).length
              return (
                <div key={type} className="timeline-legend-item">
                  <span className="timeline-legend-icon">{config.icon}</span>
                  <span className="timeline-legend-label">{config.label}</span>
                  <span className="timeline-legend-count">({count})</span>
                </div>
              )
            })}
          </div>

          {/* 时间轴容器 */}
          <div className="timeline-container">
            {/* 时间刻度 */}
            <div className="timeline-marks">
              {timeMarks.map((time) => (
                <div key={time} className="timeline-mark">
                  <div className="timeline-mark-line"></div>
                  <div className="timeline-mark-label">{time}</div>
                </div>
              ))}
            </div>

            {/* 时间轴主体 */}
            <div className="timeline-track">
              {/* 主时间轴细线 */}
              <div className="timeline-main-axis" />

              {/* 事件块 */}
              <div className="timeline-events">
                {events.map((event) => {
                  const position = getEventPosition(event)
                  const config = getEventTypeConfig(event.type)
                  const isSelected = selectedEvent?.id === event.id
                  const isHovered = hoveredEventId === event.id

                  return (
                    <div
                      key={event.id}
                      className={`timeline-event ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                      style={{
                        left: position.left,
                        width: position.width
                      }}
                      onClick={() => setSelectedEvent(isSelected ? null : event)}
                      onMouseEnter={() => setHoveredEventId(event.id)}
                      onMouseLeave={() => setHoveredEventId((prev) => (prev === event.id ? null : prev))}
                    >
                      {/* 悬浮提示 */}
                      <div className="timeline-event-tooltip">
                        <div className="timeline-event-tooltip-header">
                          <span className="timeline-event-tooltip-icon">{config.icon}</span>
                          <span className="timeline-event-tooltip-type" style={{ color: config.color }}>
                            {config.label}
                          </span>
                        </div>
                        <div className="timeline-event-tooltip-time">
                          {event.startTime} - {event.endTime} · {formatDuration(event.duration)}
                        </div>
                        <div className="timeline-event-tooltip-reason">{event.reason}</div>
                        {event.description && (
                          <div className="timeline-event-tooltip-desc">{event.description}</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 详细信息卡片 */}
          {selectedEvent && (
            <div className="timeline-detail-card">
              <div className="timeline-detail-header">
                <div className="timeline-detail-title">
                  <span className="timeline-detail-icon">
                    {getEventTypeConfig(selectedEvent.type).icon}
                  </span>
                  <span>{selectedEvent.reason}</span>
                </div>
                <button
                  className="timeline-detail-close"
                  onClick={() => setSelectedEvent(null)}
                >
                  ✕
                </button>
              </div>
              <div className="timeline-detail-body">
                <div className="timeline-detail-row">
                  <span className="timeline-detail-label">类型</span>
                  <span 
                    className="timeline-detail-value"
                    style={{ color: getEventTypeConfig(selectedEvent.type).color }}
                  >
                    {getEventTypeConfig(selectedEvent.type).label}
                  </span>
                </div>
                <div className="timeline-detail-row">
                  <span className="timeline-detail-label">时间段</span>
                  <span className="timeline-detail-value">
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </span>
                </div>
                <div className="timeline-detail-row">
                  <span className="timeline-detail-label">停机时长</span>
                  <span className="timeline-detail-value danger">
                    {formatDuration(selectedEvent.duration)}
                  </span>
                </div>
                {selectedEvent.description && (
                  <div className="timeline-detail-row">
                    <span className="timeline-detail-label">详细描述</span>
                    <span className="timeline-detail-value">
                      {selectedEvent.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DowntimeTimeline
