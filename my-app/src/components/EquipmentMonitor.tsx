import { useState, useEffect } from "react";
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
  Tooltip,
  Chip
} from "@heroui/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Activity, AlertTriangle, Clock, CalendarClock, ChevronRight, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data for Gantt Chart (One Month View)
const DOWNTIME_RECORDS = [
  { id: 1, start: "2024-12-02T08:00:00", end: "2024-12-02T12:00:00", reason: "1# 电机故障", type: "fault" },
  { id: 2, start: "2024-12-05T14:00:00", end: "2024-12-05T16:30:00", reason: "定期维护保养", type: "maintenance" },
  { id: 3, start: "2024-12-12T09:00:00", end: "2024-12-12T11:00:00", reason: "紧急停机检查", type: "fault" },
  { id: 4, start: "2024-12-18T00:00:00", end: "2024-12-18T23:59:00", reason: "全厂大修", type: "maintenance" },
  { id: 5, start: "2024-12-25T10:00:00", end: "2024-12-25T10:45:00", reason: "传感器校准", type: "maintenance" },
  { id: 6, start: "2024-12-28T15:00:00", end: "2024-12-28T19:00:00", reason: "冷却系统异常", type: "fault" },
];

// Pie Chart Data (Annual)
const ANNUAL_DATA = [
  { name: '运行时间', value: 8200 },
  { name: '停车时间', value: 560 },
];
const COLORS = ['#006FEE', '#F31260']; // Primary, Danger

export const EquipmentMonitor = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // 0: Chart, 1: Metrics, 2: Recent
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-switch view every 5 seconds
  useEffect(() => {
    if (isHovered || isOpen) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered, isOpen]);

  // Gantt Chart Helper Functions
  const getGanttStyles = (start: string, end: string) => {
    const totalSeconds = 31 * 24 * 60 * 60;
    const monthStart = new Date("2024-12-01T00:00:00").getTime();
    
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    
    const leftPercent = Math.max(0, ((startTime - monthStart) / 1000 / totalSeconds) * 100);
    const widthPercent = Math.min(100 - leftPercent, ((endTime - startTime) / 1000 / totalSeconds) * 100);
    
    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const renderContent = () => {
    switch (currentIndex) {
      case 0: // Chart View
        return (
          <motion.div 
            key="chart"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col h-full"
          >
             <div className="flex-1 relative min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={ANNUAL_DATA}
                     cx="50%"
                     cy="50%"
                     innerRadius="60%"
                     outerRadius="85%"
                     paddingAngle={3}
                     dataKey="value"
                     stroke="none"
                   >
                     {ANNUAL_DATA.map((_entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <RechartsTooltip 
                     formatter={(value: number) => [`${value} 小时`, '']}
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-bold text-primary tracking-tighter">93.6%</span>
                 <span className="text-[10px] text-default-400 font-medium uppercase tracking-wider">运行率</span>
               </div>
             </div>
             <div className="flex justify-center gap-4 pb-2">
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-primary" />
                 <span className="text-xs font-medium text-default-600">运行 8.2k</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-danger" />
                 <span className="text-xs font-medium text-default-600">停车 560h</span>
               </div>
             </div>
          </motion.div>
        );
      case 1: // Metrics View
        return (
          <motion.div 
            key="metrics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col justify-center h-full gap-3 px-2"
          >
             <div className="bg-gradient-to-br from-danger-50 to-danger-100/50 rounded-2xl p-4 border border-danger-100 shadow-sm">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-bold text-danger-600 uppercase tracking-wider">全年停车次数</span>
                 <AlertTriangle size={16} className="text-danger-500" />
               </div>
               <div className="flex items-baseline gap-1">
                 <span className="text-3xl font-bold text-danger-700">15</span>
                 <span className="text-xs text-danger-500 font-medium">次</span>
               </div>
             </div>

             <div className="bg-gradient-to-br from-default-100 to-default-200/50 rounded-2xl p-4 border border-default-200 shadow-sm">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-bold text-default-600 uppercase tracking-wider">总停车时长</span>
                 <Timer size={16} className="text-default-500" />
               </div>
               <div className="flex items-baseline gap-1">
                 <span className="text-3xl font-bold text-default-800">560</span>
                 <span className="text-xs text-default-600 font-medium">小时</span>
               </div>
             </div>
          </motion.div>
        );
      case 2: // Recent View
        return (
          <motion.div 
            key="recent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col justify-center h-full px-2"
          >
             <div className="bg-white dark:bg-default-50 rounded-2xl border border-default-200 p-0 overflow-hidden shadow-sm h-full flex flex-col">
               <div className="bg-default-100 px-4 py-2 border-b border-default-200 flex items-center gap-2">
                 <CalendarClock size={14} className="text-secondary" />
                 <span className="text-xs font-bold text-default-700">最近一次停车记录</span>
               </div>
               <div className="p-4 flex flex-col gap-3 flex-1 justify-center">
                 <div>
                   <span className="text-[10px] text-default-400 uppercase tracking-wider font-bold">停车原因</span>
                   <p className="text-base font-bold text-default-900 leading-tight mt-0.5">冷却系统异常</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2">
                   <div>
                     <span className="text-[10px] text-default-400 uppercase tracking-wider font-bold">发生时间</span>
                     <p className="text-xs font-medium text-default-700 mt-0.5">12-28 15:00</p>
                   </div>
                   <div>
                     <span className="text-[10px] text-default-400 uppercase tracking-wider font-bold">持续时长</span>
                     <div className="flex items-center gap-1 mt-0.5">
                       <Clock size={12} className="text-warning-500" />
                       <p className="text-xs font-bold text-default-700">4h 0m</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card 
        className="h-full w-full shadow-sm hover:shadow-md transition-all duration-300 border border-default-100 bg-white dark:bg-default-50 overflow-hidden"
        isPressable
        onPress={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="flex justify-between items-start px-4 pt-4 pb-0 z-10 h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-secondary-50 rounded-lg text-secondary border border-secondary-100">
              <Activity size={18} />
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold text-base text-default-900 leading-tight">运行监控</h4>
              <p className="text-[10px] text-default-400 font-medium">实时状态面板</p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-0 relative flex-1 overflow-hidden">
          <div className="absolute inset-0 px-3 pb-8 pt-1">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
          
          {/* Pagination Indicators */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
            {[0, 1, 2].map((idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-4 bg-secondary' : 'w-1.5 bg-default-200'
                }`}
              />
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Detail Modal - Same as before but refined */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="5xl"
        backdrop="blur"
        classNames={{
          header: "border-b border-default-100",
          footer: "border-t border-default-100",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Activity className="text-secondary" />
                  <span className="text-xl">设备运行全景图</span>
                </div>
                <p className="text-sm font-normal text-default-500">2024年12月 故障与维保记录甘特图</p>
              </ModalHeader>
              <ModalBody className="py-6 bg-default-50/50">
                {/* Timeline Visualization */}
                <div className="bg-white p-6 rounded-2xl border border-default-100 shadow-sm mb-6">
                  <div className="flex justify-between items-end mb-4">
                    <h5 className="font-bold text-default-700">时间轴视图</h5>
                    <div className="flex gap-4 text-xs">
                       <div className="flex items-center gap-1.5">
                         <span className="w-2 h-2 rounded-full bg-danger"></span>
                         <span>故障停机</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                         <span className="w-2 h-2 rounded-full bg-warning"></span>
                         <span>计划维保</span>
                       </div>
                    </div>
                  </div>

                  {/* Month Labels */}
                  <div className="flex justify-between text-xs font-medium text-default-400 mb-2 px-1">
                    <span>12月1日</span>
                    <span>12月10日</span>
                    <span>12月20日</span>
                    <span>12月31日</span>
                  </div>

                  {/* The Gantt Track */}
                  <div className="relative h-16 bg-default-100 rounded-xl w-full overflow-hidden border border-default-200 shadow-inner flex items-center group">
                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75].map(pos => (
                      <div key={pos} className="absolute top-0 bottom-0 w-px bg-default-300/20 border-r border-dashed border-default-300/50" style={{ left: `${pos * 100}%` }} />
                    ))}

                    {/* Capsules */}
                    {DOWNTIME_RECORDS.map((record) => {
                      const style = getGanttStyles(record.start, record.end);
                      return (
                        <Tooltip 
                          key={record.id}
                          content={
                            <div className="px-2 py-1">
                              <div className="text-xs font-bold mb-1">{record.reason}</div>
                              <div className="text-[10px] text-default-500">{getDuration(record.start, record.end)}</div>
                            </div>
                          }
                          placement="top"
                          offset={-5}
                        >
                          <motion.div 
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`absolute h-8 rounded-md shadow-sm cursor-pointer z-10 border border-white/20
                              ${record.type === 'fault' 
                                ? 'bg-gradient-to-b from-danger-400 to-danger-600 shadow-danger/30' 
                                : 'bg-gradient-to-b from-warning-400 to-warning-600 shadow-warning/30'}
                            `}
                            style={{ 
                              left: style.left, 
                              width: `max(6px, ${style.width})`
                            }} 
                            whileHover={{ scale: 1.1, zIndex: 20 }}
                          />
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>

                {/* List View */}
                <div className="bg-white rounded-2xl border border-default-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-default-100 flex items-center justify-between">
                    <h5 className="font-bold text-default-700 flex items-center gap-2">
                      <ChevronRight size={16} className="text-primary" /> 详细记录列表
                    </h5>
                    <Chip size="sm" variant="flat">{DOWNTIME_RECORDS.length} 条记录</Chip>
                  </div>
                  <div className="divide-y divide-default-100">
                    {DOWNTIME_RECORDS.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 hover:bg-default-50 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.type === 'fault' ? 'bg-danger-50 text-danger' : 'bg-warning-50 text-warning'}`}>
                              {record.type === 'fault' ? <AlertTriangle size={18} /> : <Clock size={18} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-default-900">{record.reason}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-default-500 bg-default-100 px-1.5 py-0.5 rounded">{formatDate(record.start)}</span>
                                <span className="text-xs text-default-400">至</span>
                                <span className="text-xs text-default-500 bg-default-100 px-1.5 py-0.5 rounded">{formatDate(record.end)}</span>
                              </div>
                            </div>
                         </div>
                         <div className="flex flex-col items-end gap-1">
                           <span className="text-sm font-bold text-default-700">{getDuration(record.start, record.end)}</span>
                           <Chip 
                             color={record.type === 'fault' ? "danger" : "warning"} 
                             variant="dot" 
                             size="sm"
                             className="border-none"
                           >
                             {record.type === 'fault' ? "故障停机" : "计划维保"}
                           </Chip>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  确认
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
