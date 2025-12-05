import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ProductionRateProps {
  current: number;
  target: number;
}

export const ProductionRate = ({ current = 8500, target = 10000 }: ProductionRateProps) => {
  const gap = target - current;
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));
  const gapPercentage = (100 - percentage).toFixed(1);

  const data = [
    { name: '已达成', value: current },
    { name: '未达成', value: Math.max(0, gap) },
  ];

  const COLORS = ['#006FEE', '#E4E4E7']; // HeroUI Primary & Zinc-200

  return (
    <Card className="h-full w-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-default-100 bg-white dark:bg-default-50">
      <CardHeader className="flex justify-between items-start pb-0 px-5 pt-5">
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-lg text-default-900">本月产量达成率</h4>
          <p className="text-xs text-default-500">实时生产数据监控</p>
        </div>
        <Chip 
          color={percentage >= 100 ? "success" : percentage >= 80 ? "primary" : "warning"} 
          variant="flat" 
          size="sm"
          className="font-medium"
        >
          {percentage >= 100 ? "已达标" : "进行中"}
        </Chip>
      </CardHeader>

      <CardBody className="flex flex-col gap-4 px-5 pb-5 overflow-hidden">
        {/* Chart Section */}
        <div className="flex-1 min-h-[120px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="90%"
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
                animationDuration={1500}
                animationBegin={0}
                animationEasing="ease-out"
              >
                {data.map((_entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '8px 12px'
                }}
                itemStyle={{ color: '#3f3f46', fontSize: '12px', fontWeight: 600 }}
                formatter={(value: number) => [`${value} 吨`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-primary tracking-tight">
              {percentage.toFixed(1)}<span className="text-lg">%</span>
            </span>
            <span className="text-xs text-default-400 font-medium mt-1">达成率</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-2 bg-default-50 rounded-xl border border-default-100">
            <span className="text-[10px] text-default-500 mb-1 uppercase tracking-wider">当前产量</span>
            <span className="text-sm font-bold text-default-900">{current.toLocaleString()}</span>
            <span className="text-[10px] text-default-400">吨</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-default-50 rounded-xl border border-default-100">
            <span className="text-[10px] text-default-500 mb-1 uppercase tracking-wider">目标产量</span>
            <span className="text-sm font-bold text-default-900">{target.toLocaleString()}</span>
            <span className="text-[10px] text-default-400">吨</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-danger-50/50 rounded-xl border border-danger-100">
            <span className="text-[10px] text-danger-500 mb-1 uppercase tracking-wider">当前差距</span>
            <span className="text-sm font-bold text-danger-600">{gap > 0 ? gap.toLocaleString() : 0}</span>
            <span className="text-[10px] text-danger-400">{gapPercentage}%</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
