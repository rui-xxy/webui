import { Avatar } from "@heroui/react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  activeItem: "reports";
  onSelectItem: (id: "reports") => void;
}

export const Sidebar = ({
  isCollapsed,
  toggleSidebar,
  activeItem,
  onSelectItem,
}: SidebarProps) => {
  const menuItems = [{ id: "reports" as const, icon: FileText, label: "报表管理" }];

  return (
    <div 
      className={`h-screen bg-white dark:bg-default-50 border-r border-default-200 flex flex-col transition-all duration-300 ease-in-out relative
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 bg-white dark:bg-default-100 border border-default-200 rounded-full p-1 shadow-md hover:bg-default-100 z-50"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-default-100 overflow-hidden relative bg-white/50 backdrop-blur-sm">
        {isCollapsed ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"
          >
            <span className="text-primary font-bold text-lg">恒</span>
          </motion.div>
        ) : (
          <div className="flex flex-col justify-center w-full px-5">
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-lg font-bold tracking-tight text-default-900"
            >
              恒光化工运维系统
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-[10px] text-default-400 font-medium tracking-wider flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
              生产技术部出品
            </motion.div>
          </div>
        )}
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(item.id)}
            className={`flex items-center p-3 rounded-xl transition-all duration-200 group
              ${activeItem === item.id 
                ? "bg-primary text-white shadow-md shadow-primary/30" 
                : "text-default-500 hover:bg-default-100 hover:text-default-900"
              }
              ${isCollapsed ? "justify-center" : "justify-start"}
            `}
            title={isCollapsed ? item.label : ""}
          >
            <item.icon size={20} strokeWidth={2} />
            {!isCollapsed && (
              <span className="ml-3 font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Menu */}
      <div className="py-4 px-3 border-t border-default-100 flex flex-col gap-2">
        {/* User Profile */}
        <div className={`mt-2 flex items-center p-2 rounded-xl bg-default-50 border border-default-100
          ${isCollapsed ? "justify-center" : "justify-start gap-3"}
        `}>
          <Avatar 
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
            size="sm"
            isBordered
            color="primary"
          />
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-default-900 truncate">汪耿锐</span>
              <span className="text-xs text-default-500 truncate">管理员</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
