import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tabs,
  Tab
} from "@heroui/react";
import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react";

// Mock Data
interface Task {
  id: number;
  title: string;
  assignee: string;
  date: string;
  status: "in_progress" | "completed" | "overdue";
  priority: "high" | "medium" | "low";
}

const tasks: Task[] = [
  { id: 1, title: "完成一车间设备检修", assignee: "张三", date: "2025-12-05", status: "in_progress", priority: "high" },
  { id: 2, title: "提交11月生产报表", assignee: "李四", date: "2025-12-01", status: "completed", priority: "medium" },
  { id: 3, title: "原料库存盘点", assignee: "王五", date: "2025-11-30", status: "overdue", priority: "high" },
  { id: 4, title: "安全生产培训", assignee: "赵六", date: "2025-12-10", status: "in_progress", priority: "low" },
  { id: 5, title: "污水处理系统维护", assignee: "孙七", date: "2025-12-04", status: "completed", priority: "high" },
  { id: 6, title: "采购申请审批", assignee: "周八", date: "2025-12-02", status: "overdue", priority: "medium" },
  { id: 7, title: "年度预算编制", assignee: "财务部", date: "2025-12-20", status: "in_progress", priority: "high" },
  { id: 8, title: "新员工入职办理", assignee: "人事部", date: "2025-12-06", status: "completed", priority: "low" },
];

type ChipColor = "success" | "danger" | "primary" | "default" | "warning" | "secondary";

export const TaskOverview = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState<string>("all");

  // Calculate counts
  const counts = {
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
    overdue: tasks.filter(t => t.status === "overdue").length,
  };

  const filteredTasks = selectedTab === "all"
    ? tasks
    : tasks.filter(t => t.status === selectedTab);

  const getStatusColor = (status: string): ChipColor => {
    switch (status) {
      case "completed": return "success";
      case "overdue": return "danger";
      case "in_progress": return "primary";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "已完成";
      case "overdue": return "已延期";
      case "in_progress": return "进行中";
      default: return "未知";
    }
  };

  return (
    <>
      <Card className="h-full w-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-default-100 bg-white dark:bg-default-50">
        <CardHeader className="flex justify-between items-center px-5 pt-5">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-primary-100 rounded-lg text-primary">
               <ListTodo size={20} />
             </div>
             <div>
               <h4 className="font-bold text-lg text-default-900">事项管理</h4>
               <p className="text-xs text-default-500">任务进度概览</p>
             </div>
          </div>
          <Button size="sm" variant="light" color="primary" onPress={onOpen} isIconOnly>
             <ListTodo size={18} />
          </Button>
        </CardHeader>
        
        <CardBody className="px-5 pb-5 flex flex-col justify-center gap-4 overflow-hidden">
          <div className="grid grid-cols-3 gap-3 h-full">
            {/* In Progress */}
            <div 
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-primary-50 border border-primary-100 cursor-pointer hover:bg-primary-100 transition-colors group"
              onClick={() => { setSelectedTab("in_progress"); onOpen(); }}
            >
              <div className="p-2 bg-white rounded-full mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <Clock className="text-primary" size={20} />
              </div>
              <span className="text-2xl font-bold text-default-900">{counts.in_progress}</span>
              <span className="text-xs text-default-500 font-medium">进行中</span>
            </div>

            {/* Completed */}
            <div 
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-success-50 border border-success-100 cursor-pointer hover:bg-success-100 transition-colors group"
              onClick={() => { setSelectedTab("completed"); onOpen(); }}
            >
              <div className="p-2 bg-white rounded-full mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-success" size={20} />
              </div>
              <span className="text-2xl font-bold text-default-900">{counts.completed}</span>
              <span className="text-xs text-default-500 font-medium">已完成</span>
            </div>

            {/* Overdue */}
            <div 
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-danger-50 border border-danger-100 cursor-pointer hover:bg-danger-100 transition-colors group"
              onClick={() => { setSelectedTab("overdue"); onOpen(); }}
            >
              <div className="p-2 bg-white rounded-full mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <AlertCircle className="text-danger" size={20} />
              </div>
              <span className="text-2xl font-bold text-default-900">{counts.overdue}</span>
              <span className="text-xs text-default-500 font-medium">已延期</span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="4xl"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                事项详细列表
                <p className="text-sm font-normal text-default-500">查看和管理所有生产相关任务事项</p>
              </ModalHeader>
              <ModalBody>
                <Tabs 
                  aria-label="Task Status" 
                  color="primary" 
                  variant="underlined"
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                  classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-primary",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-primary"
                  }}
                >
                  <Tab key="all" title={<div className="flex items-center space-x-2"><span>全部事项</span><Chip size="sm" variant="flat">{tasks.length}</Chip></div>} />
                  <Tab key="in_progress" title={<div className="flex items-center space-x-2"><span>进行中</span><Chip size="sm" variant="flat" color="primary">{counts.in_progress}</Chip></div>} />
                  <Tab key="completed" title={<div className="flex items-center space-x-2"><span>已完成</span><Chip size="sm" variant="flat" color="success">{counts.completed}</Chip></div>} />
                  <Tab key="overdue" title={<div className="flex items-center space-x-2"><span>已延期</span><Chip size="sm" variant="flat" color="danger">{counts.overdue}</Chip></div>} />
                </Tabs>
                
                <Table 
                  aria-label="Task details table" 
                  shadow="none" 
                  selectionMode="single" 
                  classNames={{
                    wrapper: "p-0 shadow-none",
                    th: "bg-default-50 text-default-500",
                    td: "py-3"
                  }}
                >
                  <TableHeader>
                    <TableColumn>任务名称</TableColumn>
                    <TableColumn>负责人</TableColumn>
                    <TableColumn>截止日期</TableColumn>
                    <TableColumn>优先级</TableColumn>
                    <TableColumn>状态</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"无相关事项"}>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id} className="cursor-pointer hover:bg-default-50 transition-colors">
                        <TableCell>
                          <div className="font-semibold text-default-900">{task.title}</div>
                          <div className="text-xs text-default-400">ID: #{task.id.toString().padStart(4, '0')}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary-100 text-primary flex items-center justify-center text-xs font-bold">
                              {task.assignee.charAt(0)}
                            </div>
                            <span className="text-default-700">{task.assignee}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-default-600 font-mono">{task.date}</span>
                        </TableCell>
                        <TableCell>
                           <Chip size="sm" variant="dot" color={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}>
                             {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                           </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip size="sm" color={getStatusColor(task.status)} variant="flat" className="capitalize">
                            {getStatusLabel(task.status)}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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
