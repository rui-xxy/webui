import type { JSX } from 'react'
import { useEffect, useState } from 'react'
import { ThemeProvider } from './providers/theme'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Responsive, WidthProvider, type Layout, type Layouts } from 'react-grid-layout'
import { ProductionRate } from './components/ProductionRate'
import { TaskOverview } from './components/TaskOverview'
import { ProductTrend } from './components/ProductTrend'
import { EquipmentMonitor } from './components/EquipmentMonitor'
import { TankInventory } from './components/TankInventory'
import { ElectricConsumption } from './components/ElectricConsumption'
import { WaterConsumption } from './components/WaterConsumption'
import { HydrogenPeroxideConsumption } from './components/HydrogenPeroxideConsumption'

// Import react-grid-layout styles
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive);
const LAYOUT_STORAGE_KEY = 'dashboard-layouts-v2';

const CARD_MIN_WIDTH = 1;
const CARD_MIN_HEIGHT = 1;
const CHART_MIN_WIDTH = 2;

const defaultLayouts: Layouts = {
  lg: [
    { i: 'production-rate', x: 0, y: 0, w: 4, h: 4, minW: CARD_MIN_WIDTH, minH: CARD_MIN_HEIGHT },
    { i: 'task-overview', x: 4, y: 0, w: 5, h: 4, minW: CARD_MIN_WIDTH, minH: CARD_MIN_HEIGHT },
    { i: 'equipment-monitor', x: 9, y: 0, w: 3, h: 4, minW: CARD_MIN_WIDTH, minH: CARD_MIN_HEIGHT },
    { i: 'electric-consumption', x: 0, y: 4, w: 4, h: 3, minW: CARD_MIN_WIDTH, minH: CARD_MIN_HEIGHT },
    { i: 'water-consumption', x: 4, y: 4, w: 4, h: 3, minW: CARD_MIN_WIDTH, minH: CARD_MIN_HEIGHT },
    { i: 'peroxide-consumption', x: 8, y: 4, w: 4, h: 3, minW: CARD_MIN_WIDTH, minH: CARD_MIN_HEIGHT },
    { i: 'product-trend', x: 0, y: 7, w: 9, h: 5, minW: CHART_MIN_WIDTH, minH: CARD_MIN_HEIGHT },
    { i: 'tank-inventory', x: 9, y: 7, w: 3, h: 5, minW: CARD_MIN_WIDTH, minH: CARD_MIN_HEIGHT }
  ]
};

const mergeLayoutsWithDefaults = (saved?: Layouts): Layouts => {
  const merged: Layouts = { ...saved };

  Object.entries(defaultLayouts).forEach(([breakpoint, defaultLayout]) => {
    const savedLayout = saved?.[breakpoint] ?? [];
    const savedMap = new Map(savedLayout.map((item) => [item.i, item] as const));

    merged[breakpoint] = defaultLayout.map((item) => {
      const savedItem = savedMap.get(item.i);
      if (!savedItem) return item;

      return {
        ...savedItem,
        minW: item.minW,
        minH: item.minH
      };
    });
  });

  return merged;
};

function App(): JSX.Element {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Define the initial layout for the dashboard
  const [layouts, setLayouts] = useState<Layouts>(() => {
    if (typeof window === 'undefined') {
      return mergeLayoutsWithDefaults();
    }

    try {
      const stored = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : undefined;
      return mergeLayoutsWithDefaults(parsed);
    } catch (error) {
      console.warn('Failed to parse saved layouts, falling back to defaults', error);
      return mergeLayoutsWithDefaults();
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layouts));
    } catch (error) {
      console.warn('Failed to persist layouts', error);
    }
  }, [layouts]);

  const handleLayoutChange = (_currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen w-full bg-default-50 overflow-hidden">
        {/* Sidebar - Fixed Left */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
        />

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300">
          {/* Header - Fixed Top */}
          <Header />

          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-6 scrollbar-hide relative">
            <div className="max-w-[1600px] mx-auto h-full">
               <ResponsiveGridLayout
                 className="layout"
                 layouts={layouts}
                 breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                 cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                 rowHeight={24}
                 draggableHandle=".drag-handle"
                 onLayoutChange={handleLayoutChange}
                 margin={[16, 16]}
               >
                 <div key="production-rate" className="relative group h-full">
                   {/* Drag Handle - Visible on Hover */}
                   <div className="drag-handle absolute top-2 right-2 z-20 p-1 bg-default-100 rounded-md cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-500"><path d="M5 9l0 .01"/><path d="M5 15l0 .01"/><path d="M12 9l0 .01"/><path d="M12 15l0 .01"/><path d="M19 9l0 .01"/><path d="M19 15l0 .01"/></svg>
                   </div>
                   <ProductionRate current={8500} target={10000} />
                 </div>

                 <div key="task-overview" className="relative group h-full">
                    {/* Drag Handle - Visible on Hover */}
                    <div className="drag-handle absolute top-2 right-2 z-20 p-1 bg-default-100 rounded-md cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-500"><path d="M5 9l0 .01"/><path d="M5 15l0 .01"/><path d="M12 9l0 .01"/><path d="M12 15l0 .01"/><path d="M19 9l0 .01"/><path d="M19 15l0 .01"/></svg>
                    </div>
                    <TaskOverview />
                  </div>

                  <div key="equipment-monitor" className="relative group h-full">
                    {/* Drag Handle - Visible on Hover */}
                    <div className="drag-handle absolute top-2 right-2 z-20 p-1 bg-default-100 rounded-md cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-500"><path d="M5 9l0 .01"/><path d="M5 15l0 .01"/><path d="M12 9l0 .01"/><path d="M12 15l0 .01"/><path d="M19 9l0 .01"/><path d="M19 15l0 .01"/></svg>
                    </div>
                    <EquipmentMonitor />
                  </div>

                  <div key="electric-consumption" className="relative group h-full">
                    <div className="drag-handle absolute top-2 right-2 z-20 p-1 bg-default-100 rounded-md cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-500"><path d="M5 9l0 .01"/><path d="M5 15l0 .01"/><path d="M12 9l0 .01"/><path d="M12 15l0 .01"/><path d="M19 9l0 .01"/><path d="M19 15l0 .01"/></svg>
                    </div>
                    <ElectricConsumption />
                  </div>

                  <div key="water-consumption" className="relative group h-full">
                    <div className="drag-handle absolute top-2 right-2 z-20 p-1 bg-default-100 rounded-md cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-500"><path d="M5 9l0 .01"/><path d="M5 15l0 .01"/><path d="M12 9l0 .01"/><path d="M12 15l0 .01"/><path d="M19 9l0 .01"/><path d="M19 15l0 .01"/></svg>
                    </div>
                    <WaterConsumption />
                  </div>

                  <div key="peroxide-consumption" className="relative group h-full">
                    <div className="drag-handle absolute top-2 right-2 z-20 p-1 bg-default-100 rounded-md cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-500"><path d="M5 9l0 .01"/><path d="M5 15l0 .01"/><path d="M12 9l0 .01"/><path d="M12 15l0 .01"/><path d="M19 9l0 .01"/><path d="M19 15l0 .01"/></svg>
                    </div>
                    <HydrogenPeroxideConsumption />
                  </div>

                  <div key="product-trend" className="relative group h-full">
                    {/* Drag Handle - Visible on Hover */}
                    <div className="drag-handle absolute top-2 right-2 z-20 p-1 bg-default-100 rounded-md cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-500"><path d="M5 9l0 .01"/><path d="M5 15l0 .01"/><path d="M12 9l0 .01"/><path d="M12 15l0 .01"/><path d="M19 9l0 .01"/><path d="M19 15l0 .01"/></svg>
                    </div>
                    <ProductTrend />
                  </div>

                  <div key="tank-inventory" className="relative group h-full">
                    {/* Drag Handle - Visible on Hover */}
                    <div className="drag-handle absolute top-2 right-2 z-20 p-1 bg-default-100 rounded-md cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-default-500"><path d="M5 9l0 .01"/><path d="M5 15l0 .01"/><path d="M12 9l0 .01"/><path d="M12 15l0 .01"/><path d="M19 9l0 .01"/><path d="M19 15l0 .01"/></svg>
                    </div>
                    <TankInventory />
                  </div>
                </ResponsiveGridLayout>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
