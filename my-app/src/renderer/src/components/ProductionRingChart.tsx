import { CircularProgress, Progress } from "@heroui/react";
import { DashboardCard } from './DashboardCard';
import React from "react";

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

  // 根据达成率设置颜色
  let color: "success" | "primary" | "warning" | "danger" = "danger";
  let statusText = "需努力";

  if (achievementRate >= 100) {
      color = "success";
      statusText = "已达成";
  } else if (achievementRate >= 80) {
      color = "primary";
      statusText = "良好";
  } else if (achievementRate >= 60) {
      color = "warning";
      statusText = "加油";
  }

  return (
    <DashboardCard title="本月产量达成率">
      <div className="flex flex-col items-center justify-between h-full py-2">
         {/* Ring Chart with Center Text */}
         <div className="relative flex items-center justify-center">
            <CircularProgress
                classNames={{
                    svg: "w-40 h-40 drop-shadow-md",
                    indicator: "stroke-current",
                    track: "stroke-default-100/50",
                }}
                value={achievementRate}
                color={color}
                strokeWidth={4}
                showValueLabel={false}
                aria-label="Production Progress"
            />
            <div className="absolute flex flex-col items-center justify-center inset-0">
                <span className={`text-3xl font-bold text-${color} tracking-tighter`}>{percentage}%</span>
                <span className={`text-small font-medium text-${color} uppercase tracking-widest`}>{statusText}</span>
            </div>
         </div>
         
         {/* Details Grid */}
         <div className="grid grid-cols-3 gap-4 w-full text-center">
             <div className="flex flex-col gap-1">
                <div className="flex items-center justify-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full bg-${color}`}></span>
                    <span className="text-[10px] text-default-500 uppercase tracking-wider">当前</span>
                </div>
                <p className={`text-lg font-bold text-${color}`}>{currentProduction.toLocaleString()}</p>
             </div>
             <div className="flex flex-col gap-1 border-l border-r border-default-100/50 px-2">
                <div className="flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-default-400"></span>
                    <span className="text-[10px] text-default-500 uppercase tracking-wider">目标</span>
                </div>
                <p className="text-lg font-bold text-foreground">{targetProduction.toLocaleString()}</p>
             </div>
             <div className="flex flex-col gap-1">
                <div className="flex items-center justify-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full bg-${currentProduction >= targetProduction ? 'success' : 'default-300'}`}></span>
                    <span className="text-[10px] text-default-500 uppercase tracking-wider">差距</span>
                </div>
                <p className={`text-lg font-bold text-${currentProduction >= targetProduction ? 'success' : 'default-500'}`}>
                    {currentProduction >= targetProduction ? "+" : ""}{(currentProduction - targetProduction).toLocaleString()}
                </p>
             </div>
         </div>

         {/* Linear Progress */}
         <div className="w-full px-2">
            <div className="flex justify-between mb-1">
                <span className="text-tiny text-default-500 font-medium uppercase tracking-wider">完成进度</span>
                <span className="text-tiny text-default-500 font-mono">{percentage}%</span>
            </div>
            <Progress 
                size="sm" 
                radius="full" 
                value={achievementRate} 
                color={color}
                aria-label="Progress Bar"
                classNames={{
                    track: "bg-default-100/50",
                    indicator: "bg-gradient-to-r from-primary to-secondary",
                }}
            />
         </div>
      </div>
    </DashboardCard>
  )
}

export default ProductionRingChart
