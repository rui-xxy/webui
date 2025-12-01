import React from 'react'

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

// 根据液位高度获取颜色
const getLevelColor = (level: number): string => {
  if (level >= 70) {
    return '#10b981' // 绿色 - 高液位
  } else if (level >= 40) {
    return '#3b82f6' // 蓝色 - 中液位
  } else {
    return '#f59e0b' // 橙色 - 低液位（警告）
  }
}

// 单个储罐组件
const Tank: React.FC<{ data: TankData }> = ({ data }) => {
  const color = getLevelColor(data.level)
  const levelHeight = data.level

  return (
    <div className="tank-item">
      {/* 罐子名称 */}
      <div className="tank-name">{data.name}</div>

      {/* 罐子容器 */}
      <div className="tank-container">
        {/* 液位显示 */}
        <div className="tank-body">
          <div
            className="tank-liquid"
            style={{
              height: `${levelHeight}%`,
              backgroundColor: color
            }}
          >
            <div className="tank-wave"></div>
          </div>
        </div>

        {/* 罐顶 */}
        <div className="tank-top" style={{ borderBottomColor: color }}></div>
      </div>

      {/* 数据显示 */}
      <div className="tank-data">
        <div className="tank-level" style={{ color: color }}>
          {data.level}%
        </div>
        <div className="tank-volume">
          {data.volume.toFixed(1)} / {data.capacity.toFixed(0)} 吨
        </div>
      </div>
    </div>
  )
}

function StorageTanks(): React.JSX.Element {
  // 分组数据
  const tank98 = tanksData.filter((t) => t.type === '98酸')
  const tankFY = tanksData.filter((t) => t.type === '发烟硫酸')
  const tankJP = tanksData.filter((t) => t.type === '精品酸')

  return (
    <div className="chart-container">
      <div className="sa-chart-card">
        {/* 标题区域 */}
        <div className="sa-chart-header">
          <div>
            <h2 className="sa-chart-title">储罐监控</h2>
          </div>
          <div className="sa-dashboard-summary">
            <span className="sa-dashboard-summary-value">12</span>
          </div>
        </div>

        <div className="sa-chart-body tanks-body">
          {/* 98酸 - 第一排 */}
          <div className="tank-section">
            <div className="tank-section-title">98酸</div>
            <div className="tank-row">
              {tank98.map((tank) => (
                <Tank key={tank.id} data={tank} />
              ))}
            </div>
          </div>

          {/* 发烟硫酸 - 第二排 */}
          <div className="tank-section">
            <div className="tank-section-title">发烟硫酸</div>
            <div className="tank-row">
              {tankFY.map((tank) => (
                <Tank key={tank.id} data={tank} />
              ))}
            </div>
          </div>

          {/* 精品酸 - 第三排 */}
          <div className="tank-section">
            <div className="tank-section-title">精品酸</div>
            <div className="tank-row">
              {tankJP.map((tank) => (
                <Tank key={tank.id} data={tank} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StorageTanks
