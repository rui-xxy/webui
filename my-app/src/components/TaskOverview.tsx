import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Tab,
  useDisclosure,
} from "@heroui/react";
import { AlertCircle, CheckCircle2, Clock, ListTodo, PauseCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

type WorkTaskStatus = "进行中" | "已完成" | "延期" | "搁置" | (string & {});

type WorkTask = {
  id: number;
  taskName: string;
  completionDescription: string | null;
  department: string | null;
  responsiblePerson: string | null;
  status: WorkTaskStatus;
  startTime: string | null;
  completionTime: string | null;
  remainingDays: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
};

type WorkTasksResponse = { data: WorkTask[] };
type DepartmentsResponse = { data: string[] };
type SummaryResponse = { data: { total: number; byStatus: Record<string, number> } };

const STATUS_ORDER: WorkTaskStatus[] = ["进行中", "延期", "搁置", "已完成"];

const getStatusChip = (status: WorkTaskStatus) => {
  switch (status) {
    case "已完成":
      return { color: "success" as const, label: "已完成" };
    case "延期":
      return { color: "warning" as const, label: "延期" };
    case "搁置":
      return { color: "default" as const, label: "搁置" };
    case "进行中":
      return { color: "primary" as const, label: "进行中" };
    default:
      return { color: "default" as const, label: status };
  }
};

const formatYmd = (iso: string | null | undefined) => {
  if (!iso) return "--";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const TaskOverview = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  const [summary, setSummary] = useState<{ total: number; byStatus: Record<string, number> } | null>(
    null
  );
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/work-tasks/departments`);
      if (!response.ok) throw new Error(await response.text());
      const payload = (await response.json()) as DepartmentsResponse;
      setDepartments(payload.data ?? []);
    } catch {
      setDepartments([]);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      setSummaryLoading(true);
      const params = new URLSearchParams();
      if (selectedDepartment !== "all") params.set("department", selectedDepartment);
      const response = await fetch(`${API_BASE_URL}/api/work-tasks/summary?${params.toString()}`);
      if (!response.ok) throw new Error(await response.text());
      const payload = (await response.json()) as SummaryResponse;
      setSummary(payload.data);
      setSummaryError(null);
    } catch (error) {
      setSummary(null);
      setSummaryError(error instanceof Error ? error.message : "无法获取事项统计");
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const params = new URLSearchParams();
      params.set("limit", "800");
      params.set("offset", "0");
      if (selectedDepartment !== "all") params.set("department", selectedDepartment);
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      const response = await fetch(`${API_BASE_URL}/api/work-tasks?${params.toString()}`);
      if (!response.ok) throw new Error(await response.text());
      const payload = (await response.json()) as WorkTasksResponse;
      setTasks(payload.data ?? []);
      setTasksError(null);
    } catch (error) {
      setTasks([]);
      setTasksError(error instanceof Error ? error.message : "无法获取事项列表");
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchSummary();
    const intervalId = setInterval(fetchSummary, 60_000);
    return () => clearInterval(intervalId);
  }, [selectedDepartment]);

  useEffect(() => {
    if (!isOpen) return;
    fetchTasks();
  }, [isOpen, selectedDepartment, selectedStatus]);

  const counts = useMemo(() => {
    const byStatus = summary?.byStatus ?? {};
    return {
      total: summary?.total ?? 0,
      inProgress: byStatus["进行中"] ?? 0,
      completed: byStatus["已完成"] ?? 0,
      overdue: byStatus["延期"] ?? 0,
      onHold: byStatus["搁置"] ?? 0,
    };
  }, [summary]);

  const statusTiles = [
    {
      key: "进行中",
      label: "进行中",
      count: counts.inProgress,
      icon: <Clock className="text-primary" size={20} />,
      tone: "bg-primary-50 border-primary-100 hover:bg-primary-100",
    },
    {
      key: "已完成",
      label: "已完成",
      count: counts.completed,
      icon: <CheckCircle2 className="text-success" size={20} />,
      tone: "bg-success-50 border-success-100 hover:bg-success-100",
    },
    {
      key: "延期",
      label: "延期",
      count: counts.overdue,
      icon: <AlertCircle className="text-warning" size={20} />,
      tone: "bg-warning-50 border-warning-100 hover:bg-warning-100",
    },
    {
      key: "搁置",
      label: "搁置",
      count: counts.onHold,
      icon: <PauseCircle className="text-default-600" size={20} />,
      tone: "bg-default-50 border-default-200 hover:bg-default-100",
    },
  ] as const;

  const statusTabs = useMemo(() => {
    const byStatus = summary?.byStatus ?? {};
    const tabs: { key: string; label: string; count: number }[] = [
      { key: "all", label: "全部", count: counts.total },
    ];

    STATUS_ORDER.forEach((status) => {
      tabs.push({
        key: status,
        label: status,
        count: byStatus[status] ?? 0,
      });
    });

    return tabs;
  }, [counts.total, summary?.byStatus]);

  const departmentSelectKeys = useMemo(() => new Set([selectedDepartment]), [selectedDepartment]);

  return (
    <>
      <Card className="h-full w-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-default-100 bg-white dark:bg-default-50">
        <CardHeader className="flex justify-between items-start gap-3 px-5 pt-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 rounded-lg text-primary">
              <ListTodo size={20} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-default-900">事项管理</h4>
              <p className="text-xs text-default-500">来自 work_tasks 数据库表</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              aria-label="按部门筛选"
              size="sm"
              variant="bordered"
              selectedKeys={departmentSelectKeys}
              isLoading={departmentsLoading}
              className="w-[180px]"
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                setSelectedDepartment(typeof value === "string" ? value : "all");
              }}
            >
              <SelectItem key="all">全部部门</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept}>{dept}</SelectItem>
              ))}
            </Select>

            <Button size="sm" variant="light" color="primary" onPress={onOpen} isIconOnly>
              <ListTodo size={18} />
            </Button>
          </div>
        </CardHeader>

        <CardBody className="px-5 pb-5 flex flex-col justify-center gap-4 overflow-hidden">
          {summaryLoading ? (
            <div className="flex items-center justify-center py-6">
              <Spinner size="sm" color="primary" />
            </div>
          ) : summaryError ? (
            <div className="px-3 py-2 text-[12px] text-danger-500 bg-danger-50 border border-danger-200 rounded-md">
              {summaryError}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {statusTiles.map((tile) => (
                <button
                  key={tile.key}
                  type="button"
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${tile.tone}`}
                  onClick={() => {
                    setSelectedStatus(tile.key);
                    onOpen();
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-white rounded-full shadow-sm">{tile.icon}</div>
                    <div className="min-w-0">
                      <div className="text-xs text-default-500 font-medium">{tile.label}</div>
                      <div className="text-[10px] text-default-400 truncate">
                        {selectedDepartment === "all" ? "全部部门" : selectedDepartment}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-default-900 tabular-nums">
                    {tile.count}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3 w-full">
                  <div>
                    <div className="text-base font-bold text-default-900">事项明细</div>
                    <div className="text-xs text-default-500">
                      {selectedDepartment === "all" ? "全部部门" : selectedDepartment} ·{" "}
                      {selectedStatus === "all" ? "全部状态" : selectedStatus}
                    </div>
                  </div>
                  <Chip size="sm" variant="flat" className="h-6 text-tiny">
                    当前显示 {tasks.length} 条
                  </Chip>
                </div>
              </ModalHeader>

              <ModalBody className="pt-0">
                <div className="flex items-center justify-between gap-3">
                  <Tabs
                    aria-label="任务状态"
                    color="primary"
                    variant="underlined"
                    selectedKey={selectedStatus}
                    onSelectionChange={(key) => setSelectedStatus(String(key))}
                    classNames={{
                      tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                      cursor: "w-full bg-primary",
                      tab: "max-w-fit px-0 h-12",
                      tabContent: "group-data-[selected=true]:text-primary",
                    }}
                  >
                    {statusTabs.map((tab) => (
                      <Tab
                        key={tab.key}
                        title={
                          <div className="flex items-center space-x-2">
                            <span>{tab.label}</span>
                            <Chip size="sm" variant="flat" color="default">
                              {tab.count}
                            </Chip>
                          </div>
                        }
                      />
                    ))}
                  </Tabs>
                </div>

                {tasksLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Spinner size="sm" color="primary" />
                  </div>
                ) : tasksError ? (
                  <div className="px-3 py-2 text-[12px] text-danger-500 bg-danger-50 border border-danger-200 rounded-md">
                    {tasksError}
                  </div>
                ) : (
                  <Table
                    aria-label="Work tasks table"
                    shadow="none"
                    isHeaderSticky
                    classNames={{
                      wrapper: "p-0 shadow-none max-h-[520px] border border-default-200 rounded-xl",
                      th: "bg-default-50 text-default-500 text-xs border-b border-default-200",
                      td: "py-2 px-3 border-b border-default-100",
                    }}
                  >
                    <TableHeader>
                      <TableColumn className="min-w-[320px]">事项</TableColumn>
                      <TableColumn className="min-w-[140px]">部门</TableColumn>
                      <TableColumn className="min-w-[110px]">负责人</TableColumn>
                      <TableColumn className="w-[90px]">状态</TableColumn>
                      <TableColumn className="w-[110px]">开始</TableColumn>
                      <TableColumn className="w-[110px]">完成</TableColumn>
                      <TableColumn className="min-w-[110px]">剩余</TableColumn>
                      <TableColumn className="min-w-[120px]">来源</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"无相关事项"}>
                      {tasks.map((task) => {
                        const statusChip = getStatusChip(task.status);
                        return (
                          <TableRow key={task.id} className="odd:bg-default-50/30">
                            <TableCell>
                              <div className="font-semibold text-default-900 leading-5">
                                {task.taskName}
                              </div>
                              <div className="text-[10px] text-default-400 mt-1 flex gap-2">
                                <span className="font-mono">#{String(task.id).padStart(4, "0")}</span>
                                {task.completionDescription ? (
                                  <span className="truncate">
                                    {task.completionDescription}
                                  </span>
                                ) : null}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-default-700">
                                {task.department ?? "--"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-default-700">
                                {task.responsiblePerson ?? "--"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Chip size="sm" variant="flat" color={statusChip.color}>
                                {statusChip.label}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-xs text-default-700">
                                {formatYmd(task.startTime)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-xs text-default-700">
                                {formatYmd(task.completionTime)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-default-700">
                                {task.remainingDays ?? "--"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-default-700">
                                {task.source || "--"}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </ModalBody>

              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  关闭
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

