import { Avatar } from "@heroui/react";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  Factory,
  FileText,
  HelpCircle
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "生产概览" },
    { id: "reports", icon: FileText, label: "报表管理" },
    { id: "analysis", icon: BarChart3, label: "数据分析" },
    { id: "production", icon: Factory, label: "车间监控" },
    { id: "users", icon: Users, label: "人员管理" },
  ];

  const bottomItems = [
    { id: "settings", icon: Settings, label: "系统设置" },
    { id: "help", icon: HelpCircle, label: "帮助中心" },
  ];

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
      <div className="h-16 flex items-center justify-center border-b border-default-100">
        {isCollapsed ? (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="font-bold text-xl text-default-900">DataView</span>
          </div>
        )}
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
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
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className={`flex items-center p-3 rounded-xl transition-all duration-200 text-default-500 hover:bg-default-100 hover:text-default-900 group
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
