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
import { DashboardCard } from './DashboardCard'

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
    <DashboardCard
      title="月度产量分布"
      headerContent={
          <div className="text-right hidden sm:block">
             <span className="text-2xl font-bold text-primary font-mono">
                 {totalYearOutput.toLocaleString('zh-CN')}
             </span>
             <span className="text-small text-default-500 ml-1">吨</span>
          </div>
      }
    >
       <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={monthlyData}
                    layout="vertical"
                    margin={{ top: 8, right: 24, bottom: 16, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--heroui-default-200))" opacity={0.5} horizontal={false} />
                    <XAxis
                        type="number"
                        stroke="hsl(var(--heroui-default-500))"
                        tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="month"
                        stroke="hsl(var(--heroui-default-500))"
                        tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={35}
                    />
                    <Tooltip
                         cursor={{ fill: 'hsl(var(--heroui-default-100))', opacity: 0.5 }}
                         content={({ active, payload, label }) => {
                             if (active && payload && payload.length) {
                             return (
                                 <div className="bg-background/80 backdrop-blur-md border border-default-200 rounded-lg shadow-lg p-3">
                                     <p className="text-small font-bold mb-1 text-foreground">{label}</p>
                                     <p className="text-primary text-small font-mono">
                                         产量: {payload[0].value} 吨
                                     </p>
                                 </div>
                             );
                             }
                             return null;
                         }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                        {monthlyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isCurrentMonth ? 'hsl(var(--heroui-primary))' : 'hsl(var(--heroui-primary) / 0.5)'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex gap-4 justify-end items-center mt-2">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-tiny text-default-500">当前月份：{currentMonth}</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                <span className="text-tiny text-default-500">其他月份</span>
             </div>
          </div>
       </div>
    </DashboardCard>
  )
}

export default MonthlyTreemap
