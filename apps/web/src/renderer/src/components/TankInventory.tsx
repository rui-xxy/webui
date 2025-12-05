import { Card, CardHeader, CardBody, Tooltip, Chip } from "@heroui/react";
import { motion } from "framer-motion";

interface TankData {
  name: string;
  percentage: number;
  current: number;
  total: number;
}

interface CategoryData {
  title: string;
  tanks: TankData[];
}

const inventoryData: CategoryData[] = [
  {
    title: "98酸",
    tanks: [
      { name: "2#", percentage: 75, current: 4332.8, total: 5777 },
      { name: "3#", percentage: 60, current: 3466.2, total: 5777 },
      { name: "4#", percentage: 85, current: 4910.5, total: 5777 },
      { name: "攻酸槽", percentage: 40, current: 20.4, total: 51 },
    ],
  },
  {
    title: "发烟硫酸",
    tanks: [
      { name: "1#", percentage: 90, current: 5535.0, total: 6150 },
      { name: "5#", percentage: 70, current: 4305.0, total: 6150 },
      { name: "烟酸攻酸槽", percentage: 55, current: 33.6, total: 61 },
      { name: "氨基磺酸转运槽", percentage: 80, current: 153.6, total: 192 },
    ],
  },
  {
    title: "精品酸",
    tanks: [
      { name: "1#", percentage: 65, current: 271.7, total: 418 },
      { name: "2#", percentage: 50, current: 240.0, total: 480 },
      { name: "3#", percentage: 35, current: 192.5, total: 550 },
      { name: "4#", percentage: 88, current: 484.0, total: 550 },
    ],
  },
];

const getStatusColor = (percentage: number) => {
  if (percentage >= 90) return { bg: "bg-danger-500", text: "text-danger-600" };
  if (percentage >= 75) return { bg: "bg-warning-500", text: "text-warning-600" };
  if (percentage <= 20) return { bg: "bg-danger-500", text: "text-danger-600" };
  return { bg: "bg-primary-500", text: "text-primary-600" };
};

const Tank = ({ data }: { data: TankData }) => {
  const colors = getStatusColor(data.percentage);
  
  return (
    <Tooltip 
      content={
        <div className="px-2 py-1.5 min-w-[140px]">
          <div className="text-small font-bold text-default-900 border-b border-default-200 pb-1 mb-1 flex justify-between items-center">
            {data.name}
            <span className={`text-tiny ${colors.text} bg-default-100 px-1.5 rounded`}>{data.percentage}%</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between text-tiny">
              <span className="text-default-500">当前库存:</span>
              <span className="text-default-700 font-mono font-medium">{data.current} t</span>
            </div>
            <div className="flex justify-between text-tiny">
              <span className="text-default-500">总容量:</span>
              <span className="text-default-700 font-mono font-medium">{data.total} t</span>
            </div>
          </div>
        </div>
      }
      delay={0}
      closeDelay={0}
      classNames={{
        content: "p-0 bg-background/80 backdrop-blur-md border border-default-200 shadow-lg"
      }}
    >
      <div className="flex flex-col items-center gap-2 group cursor-pointer">
        {/* Tank Name (Top) */}
        <span className="text-[10px] font-bold text-default-500 uppercase tracking-wider transition-colors group-hover:text-default-900">
          {data.name}
        </span>

        {/* Tank Visual (Rectangular, Modern) */}
        <div className="relative h-20 w-12 rounded-lg bg-default-100/50 ring-1 ring-default-200 overflow-hidden group-hover:ring-default-400 transition-all shadow-sm">
          {/* Background Grid (Subtle) */}
          <div className="absolute inset-0 opacity-[0.03]" 
            style={{ 
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
              backgroundSize: '10px 10px' 
            }} 
          />
          
          {/* Liquid Fill */}
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${data.percentage}%` }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className={`absolute bottom-0 w-full ${colors.bg} opacity-90`}
          >
            {/* Subtle Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
          </motion.div>

          {/* Percentage Text (Inside Tank, overlaid) */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <span className={`text-[10px] font-bold drop-shadow-sm ${data.percentage > 50 ? 'text-white/90' : 'text-default-900/70'}`}>
              {data.percentage}%
            </span>
          </div>
        </div>

        {/* Inventory Info (Bottom) */}
        <div className="text-center">
          <span className="text-[10px] font-semibold text-default-600 group-hover:text-default-900 transition-colors font-mono">
            {data.current.toLocaleString()}
          </span>
        </div>
      </div>
    </Tooltip>
  );
};

export function TankInventory() {
  return (
    <Card className="h-full w-full p-4 shadow-sm border border-default-100 bg-gradient-to-b from-white to-default-50/50">
      <CardHeader className="flex flex-row justify-between items-center px-2 pb-4 pt-1">
        <div className="flex flex-col gap-1">
          <h2 className="text-medium font-bold text-default-900 tracking-tight">储罐库存</h2>
          <p className="text-[10px] text-default-400 font-medium uppercase tracking-wider">Real-time Monitoring</p>
        </div>
        <Chip size="sm" variant="flat" color="primary" className="h-6 text-tiny">All Normal</Chip>
      </CardHeader>
      
      <CardBody className="gap-5 overflow-y-auto px-1 py-0 scrollbar-hide">
        {inventoryData.map((category, index) => (
          <div key={index} className="flex flex-col gap-3">
            {/* Category Header */}
            <div className="flex items-center gap-2 px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-default-400" />
              <h3 className="text-small font-semibold text-default-600 uppercase tracking-wide">{category.title}</h3>
              <div className="h-[1px] flex-1 bg-default-100" />
            </div>
            
            {/* Tank Grid */}
            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
              {category.tanks.map((tank, tankIndex) => (
                <div key={tankIndex} className="flex justify-center">
                  <Tank data={tank} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
