import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Tooltip, Chip, Spinner } from "@heroui/react";
import { motion } from "framer-motion";

interface TankData {
  id: string;
  name: string;
  percentage: number;
  current: number;
  total: number;
}

interface CategoryData {
  title: string;
  tanks: TankData[];
}

interface TankApiResponse {
  data: CategoryData[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const formatTonnage = (value: number) =>
  value.toLocaleString(undefined, { maximumFractionDigits: 1 });

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

      </div>
    </Tooltip>
  );
};

export function TankInventory() {
  const [inventoryData, setInventoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchInventory = async () => {
      try {
        if (!cancelled) {
          setLoading(true);
        }

        const response = await fetch(`${API_BASE_URL}/api/tanks`);
        if (!response.ok) {
          throw new Error("无法获取储罐数据，请稍后再试");
        }

        const payload = (await response.json()) as TankApiResponse;

        if (!cancelled) {
          setInventoryData(payload.data ?? []);
          setError(null);
        }
      } catch (fetchError) {
        if (!cancelled) {
          const message =
            fetchError instanceof Error ? fetchError.message : "未知错误，请联系管理员";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchInventory();
    const intervalId = setInterval(fetchInventory, 60_000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const renderStatusChip = () => {
    if (loading && inventoryData.length === 0) {
      return (
        <Chip size="sm" variant="flat" color="default" className="h-6 text-tiny">
          Loading...
        </Chip>
      );
    }

    if (error) {
      return (
        <Chip size="sm" variant="flat" color="danger" className="h-6 text-tiny">
          同步异常
        </Chip>
      );
    }

    return (
      <Chip size="sm" variant="flat" color="primary" className="h-6 text-tiny">
        All Normal
      </Chip>
    );
  };

  return (
    <Card className="h-full w-full p-4 shadow-sm border border-default-100 bg-gradient-to-b from-white to-default-50/50">
      <CardHeader className="flex flex-row justify-between items-center px-2 pb-4 pt-1">
        <div className="flex flex-col gap-1">
          <h2 className="text-medium font-bold text-default-900 tracking-tight">储罐库存</h2>
          <p className="text-[10px] text-default-400 font-medium uppercase tracking-wider">Real-time Monitoring</p>
        </div>
        {renderStatusChip()}
      </CardHeader>
      
      <CardBody className="gap-5 overflow-y-auto px-1 py-0 scrollbar-hide">
        {error && (
          <div className="px-3 py-2 text-[12px] text-danger-500 bg-danger-50 border border-danger-200 rounded-md mb-2">
            {error}
          </div>
        )}

        {loading && inventoryData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Spinner size="sm" color="primary" />
            <p className="text-tiny text-default-400">正在同步储罐数据...</p>
          </div>
        ) : inventoryData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-default-400 text-tiny">
            <span>暂无储罐信息</span>
            <span>请确认后端 API 是否运行</span>
          </div>
        ) : (
          inventoryData.map((category, index) => (
            <div key={category.title + index} className="flex flex-col gap-3">
              {/* Category Header */}
              <div className="flex items-center gap-2 px-1">
                <div className="h-1.5 w-1.5 rounded-full bg-default-400" />
                <h3 className="text-small font-semibold text-default-600 uppercase tracking-wide">
                  {category.title}
                </h3>
                <div className="h-[1px] flex-1 bg-default-100" />
                <div className="flex items-baseline gap-1 rounded-lg bg-default-50 px-2 py-1 ring-1 ring-default-200">
                  <span className="font-mono text-xs font-bold text-default-900">
                    {formatTonnage(
                      category.tanks.reduce(
                        (sum, tank) => sum + Number(tank.current ?? 0),
                        0
                      )
                    )}
                  </span>
                  <span className="text-[10px] font-medium text-default-500">
                    吨库存
                  </span>
                </div>
              </div>
              
              {/* Tank Grid */}
              <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                {category.tanks.map((tank) => (
                  <div key={tank.id} className="flex justify-center">
                    <Tank data={tank} />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}
