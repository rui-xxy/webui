import { useState } from "react";
import { Card, CardHeader, CardBody, DateRangePicker, Button } from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Download } from "lucide-react";
import { today, getLocalTimeZone, startOfMonth, endOfMonth } from "@internationalized/date";

// Mock Data Generator
const generateData = (days: number) => {
  const data: any[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Simulate trend with some randomness but overall pattern
    const baseValue = 8000 + Math.sin(i * 0.2) * 1000;
    const randomFactor = Math.random() * 500 - 250;
    
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      actual: Math.round(baseValue + randomFactor),
      target: 8500,
      lastYear: Math.round(baseValue * 0.9 + randomFactor),
    });
  }
  return data;
};

export const ProductTrend = () => {
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(today(getLocalTimeZone())),
    end: endOfMonth(today(getLocalTimeZone()))
  });
  
  // Determine days difference for mock data
  const daysDiff = 30; // Simplified for mock demo
  const [data, setData] = useState(generateData(daysDiff));

  const handleDateChange = (range: any) => {
    if (range) {
      setDateRange(range);
      // Simulate data fetching based on range
      // In a real app, we would calculate days between range.start and range.end
      const newDays = Math.floor(Math.random() * 20) + 10; // Randomize for demo effect
      setData(generateData(newDays));
    }
  };

  return (
    <Card className="h-full w-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-default-100 bg-white dark:bg-default-50">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg text-primary">
            <TrendingUp size={20} />
          </div>
          <div>
            <h4 className="font-bold text-lg text-default-900">产品产量趋势</h4>
            <p className="text-xs text-default-500">每日生产数据分析</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <DateRangePicker 
             label="选择日期范围"
             aria-label="选择日期范围"
             size="sm"
             className="max-w-xs"
             variant="bordered"
             value={dateRange}
             onChange={handleDateChange}
             visibleMonths={2}
           />
           <Button isIconOnly size="sm" variant="flat" className="hidden sm:flex">
             <Download size={18} className="text-default-500" />
           </Button>
        </div>
      </CardHeader>

      <CardBody className="px-2 pb-4 overflow-hidden">
        <div className="h-full w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006FEE" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#006FEE" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#71717A', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#71717A', fontSize: 12}}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                labelStyle={{ color: '#3f3f46', fontWeight: 'bold', marginBottom: '8px' }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ top: -10, right: 0 }}
              />
              
              <Line 
                type="monotone" 
                dataKey="target" 
                name="目标产量" 
                stroke="#F5A524" // Warning color
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                name="实际产量" 
                stroke="#006FEE" // Primary color
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
};
