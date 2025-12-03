import { useMemo, useState } from 'react';
import { Button, Progress, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@heroui/react';
import { DashboardCard } from './DashboardCard';
import { motion } from 'framer-motion';
import { GlassModal } from './GlassModal';

// Define types
type StatusType = 'progress' | 'completed' | 'delayed';

interface ProjectItem {
  id: string;
  name: string;
  manager: string;
  deadline: string;
  status: StatusType;
  budget: string;
  progress: number;
}

// Mock data
const mockData: ProjectItem[] = [
  { id: '1', name: 'ERP系统升级', manager: '张三', deadline: '2023-12-31', status: 'progress', budget: '¥500,000', progress: 65 },
  { id: '2', name: '新官网开发', manager: '李四', deadline: '2023-11-15', status: 'completed', budget: '¥200,000', progress: 100 },
  { id: '3', name: '数据中心迁移', manager: '王五', deadline: '2023-10-30', status: 'delayed', budget: '¥1,200,000', progress: 80 },
  { id: '4', name: '移动端APP重构', manager: '赵六', deadline: '2024-01-20', status: 'progress', budget: '¥350,000', progress: 40 },
  { id: '5', name: '内部OA系统', manager: '孙七', deadline: '2023-09-01', status: 'completed', budget: '¥150,000', progress: 100 },
  { id: '6', name: 'AI客服集成', manager: '周八', deadline: '2023-11-10', status: 'delayed', budget: '¥400,000', progress: 30 },
  { id: '7', name: '供应链优化', manager: '吴九', deadline: '2024-02-15', status: 'progress', budget: '¥800,000', progress: 25 },
  { id: '8', name: '财务系统维护', manager: '郑十', deadline: '2024-03-10', status: 'progress', budget: '¥100,000', progress: 10 },
];

// SVG Icons
const Icons = {
  progress: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  completed: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  delayed: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
};

const statusConfig = {
  progress: { label: '进行中', color: 'primary', icon: Icons.progress },
  completed: { label: '已完成', color: 'success', icon: Icons.completed },
  delayed: { label: '已延期', color: 'danger', icon: Icons.delayed },
} as const;

export default function ProjectStatus() {
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);

  const handleStatusClick = (status: StatusType) => {
    setSelectedStatus(status);
  };

  const filteredData = useMemo(
    () => (selectedStatus ? mockData.filter((item) => item.status === selectedStatus) : []),
    [selectedStatus]
  );

  const handleClose = (): void => {
    setSelectedStatus(null);
  };

  return (
    <DashboardCard title="项目状态监控" className="relative overflow-hidden">
        <div className="flex flex-row items-center h-full w-full divide-x divide-default-200/50">
            {(Object.keys(statusConfig) as StatusType[]).map((status) => {
                const config = statusConfig[status];
                const count = mockData.filter(item => item.status === status).length;
                return (
                    <div
                        key={status}
                        className="flex-1 h-full flex flex-col items-center justify-center cursor-pointer hover:bg-default-100/50 transition-colors group relative overflow-hidden"
                        onClick={() => handleStatusClick(status)}
                    >
                        {/* Hover Glow Effect */}
                        <div className={`absolute inset-0 bg-${config.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        <div className="flex flex-col items-center gap-1 z-10">
                            <div className="flex items-center gap-1.5">
                                <div className={`text-${config.color} transition-transform duration-300 group-hover:scale-110`}>
                                    {config.icon}
                                </div>
                                <span className="text-small font-medium text-default-600">{config.label}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`text-3xl font-bold text-${config.color} font-mono`}
                                >
                                    {count}
                                </motion.span>
                                <span className="text-tiny text-default-400">项</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>

        <GlassModal isOpen={!!selectedStatus} onClose={handleClose} className="w-[min(1100px,92vw)] max-h-[80vh]">
          {selectedStatus && (
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-default-100/60">
                <div className={`p-2 rounded-lg bg-${statusConfig[selectedStatus].color}/15 text-${statusConfig[selectedStatus].color}`}>
                  {statusConfig[selectedStatus].icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-foreground">
                    {statusConfig[selectedStatus].label}项目清单
                  </span>
                  <span className="text-tiny text-default-500">共 {filteredData.length} 项 · 点击表格行可在后续集成跳转</span>
                </div>
                <Button size="sm" variant="light" className="ml-auto" onPress={handleClose}>
                  关闭
                </Button>
              </div>
              <div className="flex-1 overflow-auto px-2 sm:px-6 py-4">
                <Table
                  aria-label="项目状态明细"
                  removeWrapper
                  className="w-full max-w-4xl mx-auto border border-default-100/50 rounded-2xl bg-content1/40 shadow-lg shadow-black/5"
                  classNames={{
                    base: 'max-h-[480px]',
                    wrapper: 'rounded-2xl overflow-hidden',
                    table: 'min-w-[720px]',
                    thead: 'bg-default-50/20 backdrop-blur',
                    th: 'px-4 py-3 text-left text-tiny tracking-wide text-default-500 font-semibold',
                    tr: 'hover:bg-default-50/30 transition-colors',
                    td: 'px-4 py-3 text-small text-default-600 align-middle'
                  }}
                >
                  <TableHeader>
                    <TableColumn key="project">项目</TableColumn>
                    <TableColumn key="owner">负责人</TableColumn>
                    <TableColumn key="progress">进度</TableColumn>
                    <TableColumn key="deadline">截止日期</TableColumn>
                    <TableColumn key="budget">预算</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="暂无数据" items={filteredData}>
                    {(item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-small font-semibold text-default-900">{item.name}</p>
                            <p className="text-tiny text-default-500">编号: {item.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Chip size="sm" variant="flat" color={statusConfig[item.status].color as any} className="font-medium">
                              {item.manager}
                            </Chip>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 w-48">
                            <Progress aria-label={`${item.name} progress`} size="sm" value={item.progress} color={statusConfig[item.status].color as any} className="flex-1" />
                            <span className="font-mono text-tiny text-default-500 w-10 text-right">{item.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-tiny text-default-600">{item.deadline}</TableCell>
                        <TableCell className="font-mono text-small text-default-900">{item.budget}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </GlassModal>
    </DashboardCard>
  );
};
