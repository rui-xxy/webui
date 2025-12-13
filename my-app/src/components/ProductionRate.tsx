import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Chip, Spinner } from "@heroui/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  today,
  getLocalTimeZone,
  startOfMonth,
} from "@internationalized/date";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const DAILY_TARGET = 850;

interface DailyProduction {
  date: string;
  total98Equivalent: number;
}

interface ProductionTrendResponse {
  data: DailyProduction[];
}

interface ProductionRateProps {
  dailyTarget?: number;
}

export const ProductionRate = ({ dailyTarget = DAILY_TARGET }: ProductionRateProps) => {
  const [current, setCurrent] = useState(0);
  const [target, setTarget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const displayCurrent = Math.round(current).toLocaleString();
  const displayTarget = Math.round(target).toLocaleString();
  const displayGap = Math.round(Math.max(0, target - current)).toLocaleString();

  useEffect(() => {
    let cancelled = false;

    const fetchMonthToDate = async () => {
      try {
        if (!cancelled) {
          setLoading(true);
        }

        const timeZone = getLocalTimeZone();
        const now = today(timeZone);
        const start = startOfMonth(now);
        const yesterday = now.subtract({ days: 1 });
        const end =
          yesterday.toString() < start.toString() ? start : yesterday;

        const response = await fetch(
          `${API_BASE_URL}/api/production/trend?start=${start.toString()}&end=${end.toString()}`
        );

        if (!response.ok) {
          throw new Error("无法获取本月产量数据");
        }

        const payload = (await response.json()) as ProductionTrendResponse;
        const total = (payload.data ?? []).reduce(
          (sum, row) => sum + Number(row.total98Equivalent ?? 0),
          0
        );

        const daysInMonth = new Date(now.year, now.month, 0).getDate();
        const monthTarget = daysInMonth * dailyTarget;

        if (!cancelled) {
          setCurrent(total);
          setTarget(monthTarget);
          setError(null);
        }
      } catch (fetchError) {
        if (!cancelled) {
          const message =
            fetchError instanceof Error ? fetchError.message : "未知错误";
          setError(message);
          setCurrent(0);

          const timeZone = getLocalTimeZone();
          const now = today(timeZone);
          const daysInMonth = new Date(now.year, now.month, 0).getDate();
          setTarget(daysInMonth * dailyTarget);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMonthToDate();
    const intervalId = setInterval(fetchMonthToDate, 60_000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [dailyTarget]);

  const { percentage, gap, gapPercentage, chartData } = useMemo(() => {
    const safeTarget = target > 0 ? target : 0;
    const safeCurrent = current > 0 ? current : 0;
    const computedPercentage =
      safeTarget > 0 ? (safeCurrent / safeTarget) * 100 : 0;
    const clampedPercentage = Math.min(100, Math.max(0, computedPercentage));
    const computedGap = safeTarget - safeCurrent;

    return {
      percentage: clampedPercentage,
      gap: computedGap,
      gapPercentage: (100 - clampedPercentage).toFixed(1),
      chartData: [
        { name: "已达成", value: safeCurrent },
        { name: "未达成", value: Math.max(0, computedGap) },
      ],
    };
  }, [current, target]);

  const COLORS = ["#006FEE", "#E4E4E7"];

  return (
    <Card className="h-full w-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-default-100 bg-white dark:bg-default-50">
      <CardHeader className="flex justify-between items-start pb-0 px-5 pt-5">
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-lg text-default-900">本月产量达成率</h4>
          <p className="text-xs text-default-500">实时生产数据监控</p>
        </div>
        {loading ? (
          <Chip size="sm" variant="flat" color="default" className="font-medium">
            Loading...
          </Chip>
        ) : error ? (
          <Chip size="sm" variant="flat" color="danger" className="font-medium">
            同步异常
          </Chip>
        ) : (
          <Chip
            color={
              percentage >= 100 ? "success" : percentage >= 80 ? "primary" : "warning"
            }
            variant="flat"
            size="sm"
            className="font-medium"
          >
            {percentage >= 100 ? "已达标" : "进行中"}
          </Chip>
        )}
      </CardHeader>

      <CardBody className="flex flex-col gap-4 px-5 pb-5 overflow-hidden">
        <div className="flex-1 min-h-[120px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
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
                {chartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  padding: "8px 12px",
                }}
                itemStyle={{ color: "#3f3f46", fontSize: "12px", fontWeight: 600 }}
                formatter={(value: any) => [`${Number(value).toFixed(0)} 吨`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {loading ? (
              <Spinner size="sm" color="primary" />
            ) : (
              <>
                <span className="text-3xl font-bold text-primary tracking-tight">
                  {percentage.toFixed(1)}
                  <span className="text-lg">%</span>
                </span>
                <span className="text-xs text-default-400 font-medium mt-1">
                  达成率
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-2 bg-default-50 rounded-xl border border-default-100">
            <span className="text-[10px] text-default-500 mb-1 uppercase tracking-wider">
              当前产量
            </span>
            <span className="text-sm font-bold text-default-900">
              {displayCurrent}
            </span>
            <span className="text-[10px] text-default-400">吨</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-default-50 rounded-xl border border-default-100">
            <span className="text-[10px] text-default-500 mb-1 uppercase tracking-wider">
              目标产量
            </span>
            <span className="text-sm font-bold text-default-900">
              {displayTarget}
            </span>
            <span className="text-[10px] text-default-400">吨</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-danger-50/50 rounded-xl border border-danger-100">
            <span className="text-[10px] text-danger-500 mb-1 uppercase tracking-wider">
              当前差距
            </span>
            <span className="text-sm font-bold text-danger-600">
              {gap > 0 ? displayGap : "0"}
            </span>
            <span className="text-[10px] text-danger-400">
              {gapPercentage}%
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
