import React from 'react'
import { Tooltip, Divider, Chip } from "@heroui/react";
import { DashboardCard } from './DashboardCard';

type TankType = '98酸' | '发烟硫酸' | '精品酸'

type TankData = {
  id: string
  name: string
  type: TankType
  level: number // 液位百分比 0-100
  volume: number // 储存量（吨）
  capacity: number // 容量（吨）
}

// 示例数据：12个储罐
const tanksData: TankData[] = [
  // 98酸（4个）
  { id: '98-1', name: '2#', type: '98酸', level: 75, volume: 45.0, capacity: 60.0 },
  { id: '98-2', name: '3#', type: '98酸', level: 60, volume: 36.0, capacity: 60.0 },
  { id: '98-3', name: '4#', type: '98酸', level: 85, volume: 51.0, capacity: 60.0 },
  { id: '98-4', name: '拨酸槽', type: '98酸', level: 40, volume: 24.0, capacity: 60.0 },

  // 发烟硫酸（4个）
  { id: 'fy-1', name: '1#', type: '发烟硫酸', level: 90, volume: 54.0, capacity: 60.0 },
  { id: 'fy-2', name: '5#', type: '发烟硫酸', level: 70, volume: 42.0, capacity: 60.0 },
  { id: 'fy-3', name: '烟酸拨酸槽', type: '发烟硫酸', level: 55, volume: 33.0, capacity: 60.0 },
  { id: 'fy-4', name: '氨基磺酸转运槽', type: '发烟硫酸', level: 80, volume: 48.0, capacity: 60.0 },

  // 精品酸（4个）
  { id: 'jp-1', name: '1#', type: '精品酸', level: 65, volume: 39.0, capacity: 60.0 },
  { id: 'jp-2', name: '2#', type: '精品酸', level: 50, volume: 30.0, capacity: 60.0 },
  { id: 'jp-3', name: '3#', type: '精品酸', level: 35, volume: 21.0, capacity: 60.0 },
  { id: 'jp-4', name: '4#', type: '精品酸', level: 88, volume: 52.8, capacity: 60.0 }
]

// 根据液位高度获取颜色配置
const getLevelConfig = (level: number) => {
  if (level >= 70) {
    return { color: 'success', hex: '#10b981', bgClass: 'bg-success', textClass: 'text-success' }
  } else if (level >= 40) {
    return { color: 'primary', hex: '#3b82f6', bgClass: 'bg-primary', textClass: 'text-primary' }
  } else {
    return { color: 'warning', hex: '#f59e0b', bgClass: 'bg-warning', textClass: 'text-warning' }
  }
}

// 单个储罐组件
const Tank: React.FC<{ data: TankData }> = ({ data }) => {
  const config = getLevelConfig(data.level)

  return (
    <Tooltip 
        content={
            <div className="px-2 py-2">
                <div className="font-bold mb-1 text-foreground">{data.type} - {data.name}</div>
                <div className="text-tiny text-default-600">液位: {data.level}%</div>
                <div className="text-tiny text-default-600">储量: {data.volume} / {data.capacity} 吨</div>
            </div>
        }
        className="bg-background/80 backdrop-blur-md border border-default-200 shadow-lg"
    >
        <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <span className="text-tiny font-medium text-default-500">{data.name}</span>
            
            {/* Tank Visual */}
            <div className="relative w-14 h-20 border border-default-300 rounded-xl overflow-hidden bg-default-50 shadow-inner group-hover:border-default-400 transition-colors">
                {/* Liquid */}
                <div 
                    className={`absolute bottom-0 left-0 w-full transition-all duration-700 ease-in-out ${config.bgClass}`}
                    style={{ height: `${data.level}%` }}
                >
                    {/* Simple CSS Wave effect overlay */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCI+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjIiIGQ9Ik0wLDk2TzQ4LDExMi45Qzk2LDEyOCwxOTIsMTYwLDI4OCwxNjBDMzg0LDE2MCw0ODAsMTI4LDU3NiwxMTJDNjcyLDk2LDc2OCw5Niw4NjQsMTEyQzk2MCwxMjgsMTA1NiwxNjAsMTE1MiwxNjBDMTI0OCwxNjAsMTM0NCwxMjgsMTM5MiwxMTJMMTQ0MCw5NkwxNDQwLDMyMEwxMzkyLDMyMEMxMzQ0LDMyMCwxMjQ4LDMyMCwxMTUyLDMyMEMxMDU2LDMyMCw5NjAsMzIwLDg2NCwzMjBDNzY4LDMyMCw2NzIsMzIwLDU3NiwzMjBDNDgwLDMyMCwzODQsMzIwLDI4OCwzMjBDMTkyLDMyMCw5NiwzMjAsNDgsMzIwTDAsMzIwWiI+PC9wYXRoPjwvc3ZnPg==')] bg-cover bg-bottom animate-pulse"></div>
                </div>
                
                {/* Measurement Lines */}
                <div className="absolute top-1/4 w-full h-[1px] bg-default-400/30"></div>
                <div className="absolute top-2/4 w-full h-[1px] bg-default-400/30"></div>
                <div className="absolute top-3/4 w-full h-[1px] bg-default-400/30"></div>
            </div>

            <div className="flex flex-col items-center gap-0">
                <span className={`text-small font-bold ${config.textClass}`}>{data.level}%</span>
                <span className="text-[10px] text-default-400">{data.volume.toFixed(1)}t</span>
            </div>
        </div>
    </Tooltip>
  )
}

function StorageTanks(): React.JSX.Element {
  // 分组数据
  const tank98 = tanksData.filter((t) => t.type === '98酸')
  const tankFY = tanksData.filter((t) => t.type === '发烟硫酸')
  const tankJP = tanksData.filter((t) => t.type === '精品酸')

  return (
    <DashboardCard
      title="储罐监控"
      headerContent={
        <Chip size="sm" variant="flat" color="secondary">Total: 12</Chip>
      }
    >
      <div className="flex flex-col gap-4 h-full overflow-y-auto p-2 scrollbar-hide">
        {/* 98酸 */}
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="h-3 w-1 bg-primary rounded-full"></div>
                <span className="text-small font-bold text-default-600">98酸</span>
                <Divider className="flex-1" />
            </div>
            <div className="grid grid-cols-4 gap-2">
                {tank98.map(tank => <Tank key={tank.id} data={tank} />)}
            </div>
        </div>

        {/* 发烟硫酸 */}
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="h-3 w-1 bg-warning rounded-full"></div>
                <span className="text-small font-bold text-default-600">发烟硫酸</span>
                <Divider className="flex-1" />
            </div>
            <div className="grid grid-cols-4 gap-2">
                {tankFY.map(tank => <Tank key={tank.id} data={tank} />)}
            </div>
        </div>

        {/* 精品酸 */}
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="h-3 w-1 bg-success rounded-full"></div>
                <span className="text-small font-bold text-default-600">精品酸</span>
                <Divider className="flex-1" />
            </div>
            <div className="grid grid-cols-4 gap-2">
                {tankJP.map(tank => <Tank key={tank.id} data={tank} />)}
            </div>
        </div>
      </div>
    </DashboardCard>
  )
}

export default StorageTanks
