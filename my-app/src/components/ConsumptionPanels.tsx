import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Chip,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Droplet, FlaskConical, Zap } from "lucide-react";
import { getLocalTimeZone, startOfMonth, today } from "@internationalized/date";

type MetricId = "electric" | "water" | "peroxide";

type MetricDefinition = {
  id: MetricId;
  title: string;
  unit: string;
  color: string;
  Icon: typeof Zap;
  series: { date: string; value: number }[];
};

const buildSeries = (days: number, generator: (dayIndex: number) => number) => {
  const now = new Date();
  const points: { date: string; value: number }[] = [];

  for (let i = Math.max(0, days - 1); i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    points.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      value: generator(i),
    });
  }

  return points;
};

type PeroxideTrendPoint = {
  date: string;
  value: number;
};

type PeroxideTrendResponse = {
  data: PeroxideTrendPoint[];
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const formatDateLabel = (dateKey: string) => {
  const [, month, day] = dateKey.split("-").map(Number);
  if (!month || !day) return dateKey;
  return `${month}/${day}`;
};

const formatDelta = (delta: number) => {
  const abs = Math.abs(delta);
  const formatted = abs >= 10 ? abs.toFixed(0) : abs.toFixed(1);
  return `${delta >= 0 ? "+" : "-"}${formatted}%`;
};

const MetricRow = ({
  definition,
  onOpenTrend,
}: {
  definition: MetricDefinition;
  onOpenTrend: (id: MetricId) => void;
}) => {
  const latest = definition.series[definition.series.length - 1]?.value ?? 0;
  const prev = definition.series[definition.series.length - 2]?.value ?? latest;
  const delta = prev === 0 ? 0 : ((latest - prev) / prev) * 100;
  const deltaText = formatDelta(delta);
  const deltaTone =
    delta >= 0 ? "text-danger-600 bg-danger-50" : "text-success-600 bg-success-50";
  const displayValue = latest.toLocaleString(undefined, { maximumFractionDigits: 1 });

  return (
    <button
      type="button"
      onClick={() => onOpenTrend(definition.id)}
      className="w-full flex items-center justify-between gap-3 py-2.5 px-2 rounded-xl hover:bg-default-50 transition-colors cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
    >
      <div className="flex items-center gap-2 min-w-0">
        <definition.Icon size={16} className="text-default-500 shrink-0" />
        <div className="min-w-0">
          <div className="text-xs font-semibold text-default-800 truncate">
            {definition.title}
          </div>
          <div className="text-[10px] text-default-400 leading-4 truncate">
            今日 / 昨日变化
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-8 px-2 flex items-center font-mono font-bold text-default-900">
          {displayValue}
          <span className="ml-1 text-[10px] font-medium text-default-500">
            {definition.unit}
          </span>
        </div>
        <span
          className={`text-[10px] px-2 py-1 rounded-full font-semibold ${deltaTone}`}
        >
          {deltaText}
        </span>
      </div>
    </button>
  );
};

const TrendModal = ({
  isOpen,
  onOpenChange,
  definition,
}: {
  isOpen: boolean;
  onOpenChange: (...args: any[]) => void;
  definition: MetricDefinition | undefined;
}) => {
  if (!definition) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <definition.Icon size={18} className="text-default-600" />
                <span className="text-default-900 font-semibold">
                  {definition.title}趋势
                </span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="h-[380px] w-full bg-default-50 rounded-xl p-4 border border-default-100">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={definition.series} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E4E4E7" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#71717a", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        padding: "8px 12px",
                      }}
                      formatter={(value: any) => [
                        `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 })} ${definition.unit}`,
                        "",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={definition.color}
                      strokeWidth={3}
                      dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export const RawMaterialsPanel = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState<MetricId>("peroxide");
  const [peroxideSeries, setPeroxideSeries] = useState<
    { date: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPeroxide = async () => {
      try {
        if (!cancelled) setLoading(true);
        const timeZone = getLocalTimeZone();
        const now = today(timeZone);
        const start = startOfMonth(now);
        const yesterday = now.subtract({ days: 1 });
        const end = yesterday.toString() < start.toString() ? start : yesterday;

        const response = await fetch(
          `${API_BASE_URL}/api/consumption/peroxide/trend?start=${start.toString()}&end=${end.toString()}`
        );

        if (!response.ok) {
          throw new Error("无法获取双氧水消耗数据，请确认后端 API 正在运行");
        }

        const payload = (await response.json()) as PeroxideTrendResponse;
        const points = (payload.data ?? []).map((row) => ({
          date: formatDateLabel(row.date),
          value: Number(row.value ?? 0),
        }));

        if (!cancelled) {
          setPeroxideSeries(points);
          setError(null);
        }
      } catch (fetchError) {
        if (!cancelled) {
          const message =
            fetchError instanceof Error ? fetchError.message : "未知错误";
          setError(message);
          setPeroxideSeries([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPeroxide();
    const intervalId = setInterval(fetchPeroxide, 60_000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const definitions = useMemo<MetricDefinition[]>(
    () => [
      {
        id: "peroxide",
        title: "双氧水",
        unit: "t",
        color: "#7828C8",
        Icon: FlaskConical,
        series: peroxideSeries,
      },
    ],
    [peroxideSeries]
  );

  const selectedDefinition = definitions.find((d) => d.id === selected);

  const openTrend = (id: MetricId) => {
    setSelected(id);
    onOpen();
  };

  return (
    <>
      <Card className="h-full w-full shadow-sm border border-default-100 bg-white dark:bg-default-50">
        <CardHeader className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex flex-col">
            <h4 className="font-bold text-base text-default-900">原辅料</h4>
            <p className="text-xs text-default-500">点击行查看趋势</p>
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
        <CardBody className="px-3 pb-4 pt-0">
          {loading && peroxideSeries.length === 0 ? (
            <div className="flex items-center justify-center py-6">
              <Spinner size="sm" color="primary" />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
            {definitions.map((definition) => (
              <MetricRow
                key={definition.id}
                definition={definition}
                onOpenTrend={openTrend}
              />
            ))}
            </div>
          )}
        </CardBody>
      </Card>

      <TrendModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        definition={selectedDefinition}
      />
    </>
  );
};

export const EnergyConsumptionPanel = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState<MetricId>("electric");

  const electricSeries = useMemo(
    () =>
      buildSeries(30, (i) => {
        const baseValue = 450 + Math.sin(i * 0.5) * 50;
        const randomFactor = Math.random() * 40 - 20;
        return Math.round(baseValue + randomFactor);
      }),
    []
  );

  const waterSeries = useMemo(
    () =>
      buildSeries(30, (i) => {
        const baseValue = 120 + Math.cos(i * 0.3) * 20;
        const randomFactor = Math.random() * 10 - 5;
        return Math.round((baseValue + randomFactor) * 10) / 10;
      }),
    []
  );

  const definitions = useMemo<MetricDefinition[]>(
    () => [
      {
        id: "electric",
        title: "电耗",
        unit: "kWh",
        color: "#F5A524",
        Icon: Zap,
        series: electricSeries,
      },
      {
        id: "water",
        title: "水耗",
        unit: "m³",
        color: "#006FEE",
        Icon: Droplet,
        series: waterSeries,
      },
    ],
    [electricSeries, waterSeries]
  );

  const selectedDefinition = definitions.find((d) => d.id === selected);

  const openTrend = (id: MetricId) => {
    setSelected(id);
    onOpen();
  };

  return (
    <>
      <Card className="h-full w-full shadow-sm border border-default-100 bg-white dark:bg-default-50">
        <CardHeader className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex flex-col">
            <h4 className="font-bold text-base text-default-900">能源消耗</h4>
            <p className="text-xs text-default-500">点击数字查看趋势</p>
          </div>
        </CardHeader>
        <CardBody className="px-3 pb-4 pt-0">
          <div className="flex flex-col gap-1">
            {definitions.map((definition) => (
              <MetricRow
                key={definition.id}
                definition={definition}
                onOpenTrend={openTrend}
              />
            ))}
          </div>
        </CardBody>
      </Card>

      <TrendModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        definition={selectedDefinition}
      />
    </>
  );
};
