import type { JSX } from 'react'
import { useState } from 'react'
import { ThemeProvider } from './providers/theme'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { ProductionRate } from './components/ProductionRate'
import { TaskOverview } from './components/TaskOverview'

// Import react-grid-layout styles
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

function App(): JSX.Element {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Define the initial layout for the dashboard
  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'production-rate', x: 0, y: 0, w: 4, h: 5, minW: 3, minH: 3 },
      { i: 'task-overview', x: 4, y: 0, w: 5, h: 5, minW: 4, minH: 3 }
    ]
  });

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
                 rowHeight={60}
                 draggableHandle=".drag-handle"
                 onLayoutChange={(currentLayout, allLayouts) => setLayouts(allLayouts)}
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
               </ResponsiveGridLayout>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
