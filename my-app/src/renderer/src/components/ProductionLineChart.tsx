import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart
} from 'recharts'
import { DashboardCard } from './DashboardCard'
import { Button, Popover, PopoverTrigger, PopoverContent, Input } from "@heroui/react";
import { motion } from "framer-motion";

type ProductionPoint = {
  date: string
  output: number
}

// 示例数据：硫酸车间每日总产量（单位：吨）
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const filteredData = useMemo(
    () => productionData.filter((point) => point.date >= startDate && point.date <= endDate),
    [startDate, endDate]
  )

  const totalOutput = useMemo(
    () => filteredData.reduce((sum, point) => sum + point.output, 0),
    [filteredData]
  )

  const handleResetRange = (): void => {
    setStartDate(productionData[0].date)
    setEndDate(productionData[productionData.length - 1].date)
    setIsPopoverOpen(false)
  }

  return (
    <DashboardCard
      title="产量趋势"
      headerContent={
          <div className="flex items-center gap-4">
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-right hidden sm:block"
             >
                <span className="text-2xl font-bold text-primary font-mono">
                    {totalOutput.toLocaleString('zh-CN')}
                </span>
                <span className="text-small text-default-500 ml-1">吨</span>
             </motion.div>
             <Popover 
                placement="bottom-end" 
                showArrow 
                offset={10}
                isOpen={isPopoverOpen}
                onOpenChange={setIsPopoverOpen}
             >
                <PopoverTrigger>
                    <Button isIconOnly size="sm" variant="light" aria-label="Settings">
                        <SettingsIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="px-1 py-2 w-64">
                        <p className="text-small font-bold text-foreground mb-2">时间范围设置</p>
                        <div className="flex flex-col gap-3 w-full">
                            <Input 
                                type="date" 
                                label="开始日期" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)} 
                                size="sm"
                                max={endDate}
                            />
                            <Input 
                                type="date" 
                                label="结束日期" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)} 
                                size="sm"
                                min={startDate}
                            />
                            <div className="flex gap-2 justify-end mt-1">
                                <Button size="sm" color="primary" onPress={handleResetRange}>重置</Button>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
             </Popover>
          </div>
      }
    >
       <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--heroui-default-200))" vertical={false} opacity={0.3} />
            <XAxis 
                dataKey="date" 
                stroke="hsl(var(--heroui-default-500))" 
                tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                dy={10}
                minTickGap={30}
            />
            <YAxis 
                stroke="hsl(var(--heroui-default-500))" 
                tick={{ fill: 'hsl(var(--heroui-default-500))', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
            />
            <Tooltip
                cursor={{ stroke: 'hsl(var(--heroui-default-300))', strokeWidth: 1, strokeDasharray: '3 3' }}
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
            <Area
                type="monotone"
                dataKey="output"
                stroke="hsl(var(--heroui-primary))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorOutput)"
                animationDuration={1500}
            />
          </AreaChart>
       </ResponsiveContainer>
    </DashboardCard>
  )
}

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15C20.0627 14.2031 20.4029 13.1731 20.4029 12.1317C20.4029 11.0903 20.0627 10.0603 19.4 9.26316L20.5547 7.26316C20.8403 6.76842 20.6737 6.13474 20.179 5.84916C19.6843 5.56358 19.0506 5.73016 18.765 6.2249L17.6103 8.2249C16.9307 7.83266 16.1748 7.56842 15.384 7.44211L15.384 5.13158C15.384 4.56 14.9207 4.09684 14.3491 4.09684L11.6509 4.09684C11.0793 4.09684 10.616 4.56 10.616 5.13158L10.616 7.44211C9.82517 7.56842 9.06929 7.83266 8.38971 8.2249L7.235 6.2249C6.94942 5.73016 6.31574 5.56358 5.821 5.84916C5.32626 6.13474 5.15968 6.76842 5.44526 7.26316L6.6 9.26316C5.93729 10.0603 5.59706 11.0903 5.59706 12.1317C5.59706 13.1731 5.93729 14.2031 6.6 15L5.44526 17C5.15968 17.4947 5.32626 18.1284 5.821 18.414C6.31574 18.6996 6.94942 18.533 7.235 18.0383L8.38971 16.0383C9.06929 16.4305 9.82517 16.6947 10.616 16.8211L10.616 19.1316C10.616 19.7032 11.0793 20.1663 11.6509 20.1663L14.3491 20.1663C14.9207 20.1663 15.384 19.7032 15.384 19.1316L15.384 16.8211C16.1748 16.6947 16.9307 16.4305 17.6103 16.0383L18.765 18.0383C19.0506 18.533 19.6843 18.6996 20.179 18.414C20.6737 18.1284 20.8403 17.4947 20.5547 17L19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default ProductionLineChart
