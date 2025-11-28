import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

type ProductionPoint = {
  date: string
  output: number
}

// 示例数据：硫酸车间每日总产量（单位：吨）
// 后续可以替换成真实接口数据
const productionData: ProductionPoint[] = [
  { date: '2025-03-01', output: 320 },
  { date: '2025-03-02', output: 305 },
  { date: '2025-03-03', output: 318 },
  { date: '2025-03-04', output: 330 },
  { date: '2025-03-05', output: 342 },
  { date: '2025-03-06', output: 337 },
  { date: '2025-03-07', output: 350 },
  { date: '2025-03-08', output: 360 },
  { date: '2025-03-09', output: 355 },
  { date: '2025-03-10', output: 362 },
  { date: '2025-03-11', output: 370 },
  { date: '2025-03-12', output: 365 },
  { date: '2025-03-13', output: 372 },
  { date: '2025-03-14', output: 380 },
  { date: '2025-03-15', output: 388 },
  { date: '2025-03-16', output: 392 },
  { date: '2025-03-17', output: 386 },
  { date: '2025-03-18', output: 395 },
  { date: '2025-03-19', output: 402 },
  { date: '2025-03-20', output: 410 },
  { date: '2025-03-21', output: 405 },
  { date: '2025-03-22', output: 412 },
  { date: '2025-03-23', output: 418 },
  { date: '2025-03-24', output: 425 },
  { date: '2025-03-25', output: 430 },
  { date: '2025-03-26', output: 428 },
  { date: '2025-03-27', output: 435 },
  { date: '2025-03-28', output: 440 },
  { date: '2025-03-29', output: 445 },
  { date: '2025-03-30', output: 452 }
]

function ProductionLineChart(): React.JSX.Element {
  const [startDate, setStartDate] = useState<string>(productionData[0].date)
  const [endDate, setEndDate] = useState<string>(productionData[productionData.length - 1].date)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })

  const filteredData = useMemo(
    () =>
      productionData.filter((point) => point.date >= startDate && point.date <= endDate),
    [startDate, endDate]
  )

  const totalOutput = useMemo(
    () => filteredData.reduce((sum, point) => sum + point.output, 0),
    [filteredData]
  )

  const handleResetRange = (): void => {
    setStartDate(productionData[0].date)
    setEndDate(productionData[productionData.length - 1].date)
    setShowContextMenu(false)
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    
    // 获取点击位置（相对于视口）
    const clickX = e.clientX
    const clickY = e.clientY
    
    // 获取视口尺寸
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // 右键菜单的实际尺寸
    const menuWidth = 250
    const menuHeight = 280
    
    // 计算菜单位置，确保不超出视口
    let x = clickX + 5 // 稍微偏移一点，不要直接在鼠标位置
    let y = clickY + 5
    
    // 如果右侧空间不足，向左显示
    if (x + menuWidth > viewportWidth - 10) {
      x = clickX - menuWidth - 5
    }
    
    // 如果底部空间不足，向上显示
    if (y + menuHeight > viewportHeight - 10) {
      y = clickY - menuHeight - 5
    }
    
    // 确保不超出左侧和顶部
    x = Math.max(10, x)
    y = Math.max(10, y)
    
    console.log('Context menu debug:', {
      clickX,
      clickY,
      finalX: x,
      finalY: y,
      viewportWidth,
      viewportHeight
    })
    
    setContextMenuPosition({ x, y })
    setShowContextMenu(true)
  }

  const handleCloseMenu = (): void => {
    setShowContextMenu(false)
  }

  return (
    <>
      <div className="chart-container">
        <div className="sa-chart-card" onContextMenu={handleContextMenu}>
          {/* 标题区域 */}
          <div className="sa-chart-header">
            <div>
              <h2 className="sa-chart-title">产量趋势</h2>
              <p className="sa-chart-subtitle">
                {startDate} ~ {endDate}
              </p>
            </div>
            <div className="sa-dashboard-summary">
              <span className="sa-dashboard-summary-value">
                {totalOutput.toLocaleString('zh-CN')} 吨
              </span>
              <span className="sa-dashboard-summary-label">当前区间总产量</span>
            </div>
          </div>

          <div className="sa-chart-body">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredData}
                margin={{
                  top: 16,
                  right: 24,
                  bottom: 24,
                  left: 0
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickMargin={12}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickMargin={12}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#374151', fontWeight: 500, marginBottom: 4 }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 500 }}
                  formatter={(value: number) => [`${value} 吨`, '产量']}
                />
                <Line
                  type="monotone"
                  dataKey="output"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, stroke: '#3b82f6', fill: '#ffffff' }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 右键菜单 - 使用遮罩层 */}
      {showContextMenu && (
        <>
          {/* 遮罩层 - 点击关闭菜单 */}
          <div 
            className="context-menu-overlay"
            onClick={handleCloseMenu}
          />
          <div
            className="context-menu"
            style={{
              top: contextMenuPosition.y,
              left: contextMenuPosition.x
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="context-menu-content">
              <div className="context-menu-header">时间范围设置</div>
              
              <div className="sa-field">
                <label className="sa-label" htmlFor="start-date">
                  开始日期
                </label>
                <input
                  id="start-date"
                  className="sa-input"
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="sa-field">
                <label className="sa-label" htmlFor="end-date">
                  结束日期
                </label>
                <input
                  id="end-date"
                  className="sa-input"
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="context-menu-actions">
                <button className="sa-button" type="button" onClick={handleResetRange}>
                  重置区间
                </button>
                <button className="sa-button-secondary" type="button" onClick={handleCloseMenu}>
                  关闭
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ProductionLineChart
