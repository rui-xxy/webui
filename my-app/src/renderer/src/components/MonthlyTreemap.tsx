import { useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts'

type MonthData = {
  month: string
  value: number
  isCurrentMonth: boolean
}

// 示例数据：2025年1-12月产量（单位：吨）
const monthlyData: MonthData[] = [
  { month: '1月', value: 9850, isCurrentMonth: false },
  { month: '2月', value: 8920, isCurrentMonth: false },
  { month: '3月', value: 10240, isCurrentMonth: false },
  { month: '4月', value: 9680, isCurrentMonth: false },
  { month: '5月', value: 10580, isCurrentMonth: false },
  { month: '6月', value: 10120, isCurrentMonth: false },
  { month: '7月', value: 11200, isCurrentMonth: false },
  { month: '8月', value: 10890, isCurrentMonth: false },
  { month: '9月', value: 10350, isCurrentMonth: false },
  { month: '10月', value: 11450, isCurrentMonth: false },
  { month: '11月', value: 12180, isCurrentMonth: true }, // 当前月
  { month: '12月', value: 0, isCurrentMonth: false } // 未来月份
]

function MonthlyTreemap(): React.JSX.Element {
  const totalYearOutput = useMemo(
    () => monthlyData.reduce((sum, month) => sum + month.value, 0),
    []
  )

  const currentMonth = useMemo(
    () => monthlyData.find((month) => month.isCurrentMonth)?.month || '',
    []
  )

  return (
    <div className="chart-container">
      <div className="sa-chart-card">
        {/* 标题区域 */}
        <div className="sa-chart-header">
          <div>
            <h2 className="sa-chart-title">月度产量分布</h2>
          </div>
          <div className="sa-dashboard-summary">
            <span className="sa-dashboard-summary-value">
              {totalYearOutput.toLocaleString('zh-CN')} 吨
            </span>
          </div>
        </div>

        <div className="sa-chart-body">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              layout="vertical"
              margin={{
                top: 8,
                right: 24,
                bottom: 16,
                left: 0
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                stroke="#9ca3af"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickMargin={8}
                axisLine={{ stroke: '#d1d5db' }}
              />
              <YAxis
                type="category"
                dataKey="month"
                stroke="#9ca3af"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickMargin={8}
                axisLine={{ stroke: '#d1d5db' }}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 6,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  padding: '8px 12px'
                }}
                labelStyle={{ color: '#374151', fontWeight: 500, fontSize: 12, marginBottom: 4 }}
                itemStyle={{ fontSize: 11 }}
                formatter={(value: number) => [`${value} 吨`, '产量']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isCurrentMonth ? '#3b82f6' : '#60a5fa'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* 图例 */}
          <div className="bar-chart-legend">
            <div className="bar-chart-legend-item">
              <span className="bar-chart-legend-dot current-month"></span>
              <span className="bar-chart-legend-text">当前月份：{currentMonth}</span>
            </div>
            <div className="bar-chart-legend-item">
              <span className="bar-chart-legend-dot other-month"></span>
              <span className="bar-chart-legend-text">其他月份</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonthlyTreemap
