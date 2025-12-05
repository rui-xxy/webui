import { useState } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  useDisclosure,
  DateRangePicker,
  Chip
} from "@heroui/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Zap, TrendingUp, TrendingDown } from "lucide-react";
import { today, getLocalTimeZone, startOfMonth, endOfMonth } from "@internationalized/date";

// Mock Data Generator
const generateData = (days: number) => {
  const data: any[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Simulate electric consumption (kWh)
    const baseValue = 450 + Math.sin(i * 0.5) * 50;
    const randomFactor = Math.random() * 40 - 20;
    
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      value: Math.round(baseValue + randomFactor),
    });
  }
  return data;
};

export const ElectricConsumption = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(today(getLocalTimeZone())),
    end: endOfMonth(today(getLocalTimeZone()))
  });
  
  // Mock data
  const [data, setData] = useState(generateData(30));
  
  // Calculate summary metrics
  const currentValue = data[data.length - 1].value;
  const prevValue = data[data.length - 2].value;
  const change = ((currentValue - prevValue) / prevValue) * 100;
  const isPositive = change >= 0;

  const handleDateChange = (range: any) => {
    if (range) {
      setDateRange(range);
      // Simulate data update
      const newDays = Math.floor(Math.random() * 20) + 10;
      setData(generateData(newDays));
    }
  };

  return (
    <>
      <Card 
        className="h-full w-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-default-100 bg-white dark:bg-default-50 cursor-pointer"
        isPressable
        onPress={onOpen}
      >
        <CardHeader className="flex justify-between items-start pb-0 px-5 pt-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-warning-100 text-warning-600 rounded-lg">
                <Zap size={18} />
              </div>
              <h4 className="font-bold text-base text-default-900">电能消耗</h4>
            </div>
            <p className="text-xs text-default-500">实时能耗监控</p>
          </div>
          <Chip
            color={isPositive ? "danger" : "success"}
            variant="flat"
            size="sm"
            startContent={isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            className="gap-1"
          >
            {Math.abs(change).toFixed(1)}%
          </Chip>
        </CardHeader>

        <CardBody className="flex flex-col justify-end px-5 pb-5 pt-2 overflow-hidden">
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-default-900">{currentValue}</span>
            <span className="text-xs text-default-500 font-medium">kWh</span>
          </div>
          
          {/* Mini Chart */}
          <div className="h-[50px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorElectric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5A524" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F5A524" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#F5A524" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorElectric)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="4xl"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-white dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning-100 text-warning-600 rounded-lg">
                    <Zap size={24} />
                  </div>
                  <span>电能消耗趋势分析</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                       <div className="flex flex-col">
                          <span className="text-sm text-default-500">当前消耗</span>
                          <span className="text-2xl font-bold text-default-900">{currentValue} kWh</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-sm text-default-500">平均消耗</span>
                          <span className="text-2xl font-bold text-default-900">
                            {Math.round(data.reduce((acc, curr) => acc + curr.value, 0) / data.length)} kWh
                          </span>
                       </div>
                    </div>
                    <DateRangePicker 
                      label="选择日期范围"
                      className="max-w-xs"
                      variant="bordered"
                      value={dateRange}
                      onChange={handleDateChange}
                    />
                  </div>

                  <div className="h-[400px] w-full bg-default-50 rounded-xl p-4 border border-default-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorElectricModal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F5A524" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F5A524" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#71717a', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#71717a', fontSize: 12 }}
                        />
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E4E4E7" />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#F5A524" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorElectricModal)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
