import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, DateRangePicker, Button, Spinner, Chip } from "@heroui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Download } from "lucide-react";
import { today, getLocalTimeZone, startOfMonth, endOfMonth } from "@internationalized/date";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

interface DailyProduction {
  date: string;
  acid98: number;
  reagentAcid: number;
  fumingAcid: number;
  total98Equivalent: number;
}

interface ProductionTrendResponse {
  data: DailyProduction[];
}

interface ChartPoint {
  date: string;
  actual: number;
  target: number;
  breakdown?: Pick<DailyProduction, "acid98" | "reagentAcid" | "fumingAcid">;
}

const formatDateLabel = (dateKey: string) => {
  const [, month, day] = dateKey.split("-").map(Number);
  if (!month || !day) return dateKey;
  return `${month}/${day}`;
};

export const ProductTrend = () => {
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(today(getLocalTimeZone())),
    end: endOfMonth(today(getLocalTimeZone()))
  });

  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (range: any) => {
    if (range) {
      setDateRange(range);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchTrend = async () => {
      try {
        if (!cancelled) {
          setLoading(true);
        }

        const start = dateRange.start?.toString?.();
        const end = dateRange.end?.toString?.();

        if (!start || !end) {
          if (!cancelled) {
            setData([]);
            setError(null);
          }
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/production/trend?start=${start}&end=${end}`
        );

        if (!response.ok) {
          throw new Error("无法获取产量趋势数据，请确认后端 API 正在运行");
        }

        const payload = (await response.json()) as ProductionTrendResponse;
        const chartData: ChartPoint[] = (payload.data ?? []).map((row) => ({
          date: formatDateLabel(row.date),
          actual: row.total98Equivalent,
          target: 8500,
          breakdown: {
            acid98: row.acid98,
            reagentAcid: row.reagentAcid,
            fumingAcid: row.fumingAcid
          }
        }));

        if (!cancelled) {
          setData(chartData);
          setError(null);
        }
      } catch (fetchError) {
        if (!cancelled) {
          const message =
            fetchError instanceof Error ? fetchError.message : "未知错误";
          setError(message);
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTrend();

    return () => {
      cancelled = true;
    };
  }, [dateRange]);

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

        {loading ? (
          <Chip size="sm" variant="flat" color="default" className="h-6 text-tiny">
            Loading...
          </Chip>
        ) : error ? (
          <Chip size="sm" variant="flat" color="danger" className="h-6 text-tiny">
            同步异常
          </Chip>
        ) : null}
      </CardHeader>

      <CardBody className="px-2 pb-4 overflow-hidden">
        <div className="h-full w-full min-h-[250px]">
          {loading && data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 h-full">
              <Spinner size="sm" color="primary" />
              <p className="text-tiny text-default-400">正在同步产量趋势...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 h-full text-danger-500 text-tiny">
              <span>{error}</span>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 h-full text-default-400 text-tiny">
              <span>暂无产量数据</span>
            </div>
          ) : (
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
                  formatter={(value: number, name: string, context: any) => {
                    if (name === "实际产量" && context?.payload?.breakdown) {
                      const { acid98, reagentAcid, fumingAcid } = context.payload.breakdown;
                      return [
                        `${value.toLocaleString()} 吨 (98折算)`,
                        `98酸:${acid98}  试剂酸:${reagentAcid}  发烟硫酸:${fumingAcid}`
                      ];
                    }
                    return [`${value.toLocaleString()} 吨`, name];
                  }}
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
          )}
        </div>
      </CardBody>
    </Card>
  );
};
