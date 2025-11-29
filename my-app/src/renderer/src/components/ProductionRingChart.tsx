import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface ProductionRingChartProps {
  currentProduction?: number // 当前产量
  targetProduction?: number // 目标产量
}

function ProductionRingChart({
  currentProduction = 8650,
  targetProduction = 10000
}: ProductionRingChartProps): React.JSX.Element {
  // 计算达成率
  const achievementRate = Math.min((currentProduction / targetProduction) * 100, 100)
  const percentage = achievementRate.toFixed(1)

  // 圆环数据
  const data = [
    { name: '已完成', value: achievementRate },
    { name: '未完成', value: 100 - achievementRate }
  ]

  // 根据达成率设置颜色
  const getColor = (rate: number): string => {
    if (rate >= 100) return '#10b981' // 绿色 - 完成
    if (rate >= 80) return '#3b82f6' // 蓝色 - 良好
    if (rate >= 60) return '#f59e0b' // 橙色 - 预警
    return '#ef4444' // 红色 - 不足
  }

  const mainColor = getColor(achievementRate)
  const COLORS = [mainColor, '#e5e7eb']

  // 获取状态文本
  const getStatusText = (rate: number): string => {
    if (rate >= 100) return '已达成'
    if (rate >= 80) return '良好'
    if (rate >= 60) return '加油'
    return '需努力'
  }

  const statusText = getStatusText(achievementRate)

  return (
    <div className="chart-container">
      <div className="sa-chart-card">
        {/* 标题区域 */}
        <div className="sa-chart-header">
          <div>
            <h2 className="sa-chart-title">本月产量达成率</h2>
            <p className="sa-chart-subtitle">
              {new Date().getMonth() + 1}月目标追踪
            </p>
          </div>
        </div>

        <div className="sa-chart-body production-ring-body">
          {/* 圆环图 */}
          <div className="ring-chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* 中心文本 */}
            <div className="ring-center-text">
              <div className="ring-percentage" style={{ color: mainColor }}>
                {percentage}%
              </div>
              <div className="ring-status" style={{ color: mainColor }}>
                {statusText}
              </div>
            </div>
          </div>

          {/* 数据详情 */}
          <div className="ring-details">
            <div className="ring-detail-item">
              <div className="ring-detail-label">
                <span className="ring-detail-icon" style={{ backgroundColor: mainColor }}></span>
                当前产量
              </div>
              <div className="ring-detail-value" style={{ color: mainColor }}>
                {currentProduction.toLocaleString('zh-CN')}
                <span className="ring-detail-unit">吨</span>
              </div>
            </div>

            <div className="ring-detail-divider"></div>

            <div className="ring-detail-item">
              <div className="ring-detail-label">
                <span className="ring-detail-icon" style={{ backgroundColor: '#94a3b8' }}></span>
                目标产量
              </div>
              <div className="ring-detail-value">
                {targetProduction.toLocaleString('zh-CN')}
                <span className="ring-detail-unit">吨</span>
              </div>
            </div>

            <div className="ring-detail-divider"></div>

            <div className="ring-detail-item">
              <div className="ring-detail-label">
                <span className="ring-detail-icon" style={{ backgroundColor: '#cbd5e1' }}></span>
                差距
              </div>
              <div className="ring-detail-value" style={{ 
                color: currentProduction >= targetProduction ? '#10b981' : '#6b7280' 
              }}>
                {currentProduction >= targetProduction 
                  ? `+${(currentProduction - targetProduction).toLocaleString('zh-CN')}`
                  : (currentProduction - targetProduction).toLocaleString('zh-CN')
                }
                <span className="ring-detail-unit">吨</span>
              </div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="ring-progress-section">
            <div className="ring-progress-header">
              <span className="ring-progress-label">完成进度</span>
              <span className="ring-progress-percentage">{percentage}%</span>
            </div>
            <div className="ring-progress-bar">
              <div 
                className="ring-progress-fill" 
                style={{ 
                  width: `${achievementRate}%`,
                  backgroundColor: mainColor 
                }}
              >
                <div className="ring-progress-glow"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductionRingChart
