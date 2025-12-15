import { Search, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export const Header = () => {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
      setDateStr(formatter.format(now));
    };
    
    updateDate();
    // Update periodically in case the day changes while open
    const timer = setInterval(updateDate, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-default-50 border-b border-default-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left Side - Title/Breadcrumbs */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-default-900">每日生产报表</h2>
        <span className="text-xs text-default-500">可视化看板 / 生产概览</span>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar Placeholder */}
        <div className="hidden md:flex items-center bg-default-100 rounded-full px-4 py-1.5 border border-transparent focus-within:border-primary focus-within:bg-white transition-all w-64">
          <Search size={16} className="text-default-400" />
          <input 
            type="text" 
            placeholder="搜索报表、指标..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-default-700 placeholder:text-default-400"
          />
        </div>

        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 text-default-700 bg-default-100/60 px-4 py-1.5 rounded-full border border-default-200/60 backdrop-blur-sm">
          <Calendar size={16} className="text-primary" />
          <span className="text-sm font-medium">{dateStr}</span>
        </div>
      </div>
    </header>
  );
};