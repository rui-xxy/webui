import { useMemo, useState } from 'react'
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
  }

  return (
    <div className="sa-dashboard">
      <header className="sa-dashboard-header">
        <div>
          <h1 className="sa-dashboard-title">硫酸车间产量趋势</h1>
          <p className="sa-dashboard-subtitle">
            按时间段查看硫酸车间总产量趋势，为后续水电气、原辅料消耗和产品结构分析打基础。
          </p>
        </div>
        <div className="sa-dashboard-summary">
          <span className="sa-dashboard-summary-label">当前区间总产量</span>
          <span className="sa-dashboard-summary-value">
            {totalOutput.toLocaleString('zh-CN')} 吨
          </span>
        </div>
      </header>

      <section className="sa-dashboard-filters">
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

        <button className="sa-button" type="button" onClick={handleResetRange}>
          重置为全区间
        </button>
      </section>

      <section className="sa-chart-card">
        <div className="sa-chart-header">
          <div>
            <h2 className="sa-chart-title">产量折线图</h2>
            <p className="sa-chart-subtitle">
              {startDate} ~ {endDate}（单位：吨）
            </p>
          </div>
        </div>

        <div className="sa-chart-body">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={filteredData}
              margin={{
                top: 16,
                right: 24,
                bottom: 24,
                left: 0
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickMargin={8}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickMargin={8}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid #1f2937',
                  borderRadius: 8
                }}
                labelStyle={{ color: '#e5e7eb' }}
                itemStyle={{ color: '#e5e7eb' }}
                formatter={(value: number) => [`${value} 吨`, '产量']}
              />
              <Line
                type="monotone"
                dataKey="output"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1, stroke: '#38bdf8', fill: '#020617' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

export default ProductionLineChart

