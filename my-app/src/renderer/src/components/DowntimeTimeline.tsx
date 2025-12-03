import { useState } from 'react'
import { DashboardCard } from './DashboardCard'
import { Tooltip, Chip, Card, CardBody } from "@heroui/react";

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
      color: 'primary', // HeroUI color
      icon: '🔧'
    },
    malfunction: {
      label: '故障',
      color: 'danger',
      icon: '⚠️'
    },
    material: {
      label: '原料',
      color: 'warning',
      icon: '📦'
    },
    other: {
      label: '其他',
      color: 'secondary',
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
  events = mockEvents
}: DowntimeTimelineProps): React.JSX.Element {
  const [selectedEvent, setSelectedEvent] = useState<DowntimeEvent | null>(null)

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
    <DashboardCard
      title="停机时间轴"
      headerContent={
          <div className="flex gap-2 items-center">
             <Chip size="sm" variant="flat" color="default">总计: {events.length}次</Chip>
             <Chip size="sm" variant="flat" color="danger">时长: {totalDowntimeHours}h</Chip>
          </div>
      }
    >
       <div className="flex flex-col h-full">
          <div className="flex gap-2 mb-4 justify-end text-tiny">
            {(['maintenance', 'malfunction', 'material', 'other'] as DowntimeEventType[]).map(
              (type) => {
                const config = getEventTypeConfig(type)
                const count = events.filter((e) => e.type === type).length
                return (
                  <div key={type} className="flex items-center gap-1">
                    <span>{config.icon}</span>
                    <span className={`text-${config.color === 'secondary' ? 'secondary-500' : config.color === 'warning' ? 'warning-500' : config.color === 'danger' ? 'danger-500' : 'primary-500'}`}>
                        {config.label}
                    </span>
                    <span className="text-default-400">({count})</span>
                  </div>
                )
              }
            )}
          </div>

          <div className="relative w-full h-20 my-4 select-none">
             {/* Track Line */}
             <div className="absolute top-1/2 left-0 w-full h-1 bg-default-100 rounded-full -translate-y-1/2" />
             
             {/* Marks */}
             {timeMarks.map((time, index) => {
                 // Approximate position based on index
                 const position = (index / (timeMarks.length - 1)) * 100;
                 return (
                    <div key={time} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none" style={{ left: `${position}%` }}>
                        <div className="w-0.5 h-3 bg-default-300 mb-6"></div>
                        <span className="absolute top-4 text-[10px] text-default-500">{time}</span>
                    </div>
                 )
             })}

             {/* Events */}
             {events.map((event) => {
                  const position = getEventPosition(event)
                  const config = getEventTypeConfig(event.type)
                  // Map config.color to actual Tailwind class
                  const bgClass = 
                    config.color === 'primary' ? 'bg-primary' : 
                    config.color === 'danger' ? 'bg-danger' :
                    config.color === 'warning' ? 'bg-warning' : 'bg-secondary';
                  
                  const isSelected = selectedEvent?.id === event.id;

                  return (
                    <Tooltip
                        key={event.id}
                        content={
                            <div className="px-1 py-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <Chip size="sm" color={config.color as any} variant="flat">{config.label}</Chip>
                                    <span className="font-bold text-small">{event.reason}</span>
                                </div>
                                <div className="text-tiny text-default-500 mb-1">
                                    {event.startTime} - {event.endTime} ({formatDuration(event.duration)})
                                </div>
                                {event.description && (
                                    <div className="text-tiny text-default-400 max-w-xs">{event.description}</div>
                                )}
                            </div>
                        }
                    >
                        <div
                            className={`absolute h-6 top-1/2 -translate-y-1/2 rounded-sm cursor-pointer transition-all hover:scale-110 hover:z-10 shadow-sm border-2 border-background ${bgClass} ${isSelected ? 'ring-2 ring-foreground' : ''}`}
                            style={{
                                left: position.left,
                                width: `max(8px, ${position.width})` 
                            }}
                            onClick={() => setSelectedEvent(isSelected ? null : event)}
                        ></div>
                    </Tooltip>
                  )
             })}
          </div>

          {/* Selected Event Details */}
          {selectedEvent && (
            <Card className="mt-auto bg-content2 border-none shadow-sm">
                <CardBody className="flex flex-row items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${getEventTypeConfig(selectedEvent.type).color}/20 text-${getEventTypeConfig(selectedEvent.type).color}`}>
                            {getEventTypeConfig(selectedEvent.type).icon}
                        </div>
                        <div>
                            <p className="text-small font-bold">{selectedEvent.reason}</p>
                            <p className="text-tiny text-default-500">
                                {selectedEvent.startTime} - {selectedEvent.endTime} · {formatDuration(selectedEvent.duration)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-tiny text-default-500 max-w-[200px] truncate hidden sm:block">
                            {selectedEvent.description}
                        </p>
                        <button onClick={() => setSelectedEvent(null)} className="text-default-400 hover:text-foreground">✕</button>
                    </div>
                </CardBody>
            </Card>
          )}
       </div>
    </DashboardCard>
  )
}

export default DowntimeTimeline
