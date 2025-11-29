import type React from 'react'
import { useMemo, useState, useCallback, useRef } from 'react'
import { Responsive, WidthProvider, type Layout } from 'react-grid-layout'
import Header from './Header'
import ProductionLineChart from './ProductionLineChart'
import MonthlyTreemap from './MonthlyTreemap'
import StorageTanks from './StorageTanks'
import ConsumptionMonitor from './ConsumptionMonitor'
import ProductionRingChart from './ProductionRingChart'
import YearlyDowntimeTimeline from './YearlyDowntimeTimeline'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
const ResponsiveGridLayout = WidthProvider(Responsive)

const breakpoints = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0
}

const cols = {
  lg: 12,
  md: 12,
  sm: 12,
  xs: 6,
  xxs: 4
}

const defaultDailyLayout: Layout[] = [
  { i: 'production-line-chart', x: 0, y: 0, w: 6, h: 10 },
  { i: 'storage-tanks', x: 6, y: 0, w: 6, h: 10 },
  { i: 'consumption-monitor', x: 0, y: 10, w: 6, h: 6, minH: 5 },
  { i: 'production-ring-chart', x: 6, y: 10, w: 6, h: 10, minH: 8 },
  { i: 'yearly-downtime-timeline', x: 0, y: 20, w: 12, h: 7, minH: 6 }
]

const defaultYearlyLayout: Layout[] = [
  { i: 'monthly-treemap', x: 0, y: 0, w: 12, h: 10 }
]

type ReportType = 'daily' | 'yearly'

const STORAGE_KEY_DAILY = 'dashboard-layout-daily'
const STORAGE_KEY_YEARLY = 'dashboard-layout-yearly'

const cloneLayout = (layout: Layout[]): Layout[] => layout.map((item) => ({ ...item }))

const buildLayouts = (layout: Layout[]): Record<string, Layout[]> => ({
  lg: cloneLayout(layout),
  md: cloneLayout(layout),
  sm: cloneLayout(layout),
  xs: cloneLayout(layout),
  xxs: cloneLayout(layout)
})

// 从 localStorage 加载布局
const loadLayoutFromStorage = (key: string, defaultLayout: Layout[]): Record<string, Layout[]> => {
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load layout from storage:', error)
  }
  return buildLayouts(defaultLayout)
}

// 保存布局到 localStorage
const saveLayoutToStorage = (key: string, layouts: Record<string, Layout[]>): void => {
  try {
    localStorage.setItem(key, JSON.stringify(layouts))
  } catch (error) {
    console.error('Failed to save layout to storage:', error)
  }
}

function DailyReportGrid(): React.JSX.Element {
  const [consumptionExpanded, setConsumptionExpanded] = useState(false)
  const isExpandingRef = useRef(false)
  // 记住用户调整后的收起状态高度(每个 breakpoint 独立记录)
  const collapsedHeightRef = useRef<Record<string, number>>({})
  
  // 使用 useMemo 确保初始化只执行一次,避免重新渲染
  const initialLayouts = useMemo(
    () => loadLayoutFromStorage(STORAGE_KEY_DAILY, defaultDailyLayout),
    []
  )
  
  const [currentLayouts, setCurrentLayouts] = useState<Record<string, Layout[]>>(initialLayouts)

  // 当展开状态变化时,只调整高度,保留用户的位置和宽度设置
  // 使用 useCallback 稳定函数引用,避免触发 ConsumptionMonitor 的 useEffect 无限循环
  const handleExpandChange = useCallback((expanded: boolean): void => {
    setConsumptionExpanded(expanded)
    isExpandingRef.current = true // 标记正在展开/收起

    setCurrentLayouts((prevLayouts) => {
      const newLayouts = { ...prevLayouts }
      Object.keys(newLayouts).forEach((breakpoint) => {
        newLayouts[breakpoint] = newLayouts[breakpoint].map((item) => {
          if (item.i === 'consumption-monitor') {
            // 关键: 明确保留 x, y, w, 只改变 h
            const currentX = item.x
            const currentY = item.y
            const currentW = item.w
            const currentH = item.h
            
            // 如果是收起状态,记住当前高度作为用户自定义的收起高度
            if (!expanded && currentH < 15) {
              collapsedHeightRef.current[breakpoint] = currentH
            }
            
            // 计算目标高度
            let targetHeight: number
            if (expanded) {
              // 展开时使用固定高度 15
              targetHeight = 15
            } else {
              // 收起时使用用户之前调整的高度,如果没有则使用当前高度(最小6)
              targetHeight = collapsedHeightRef.current[breakpoint] || Math.max(currentH, 6)
            }
            
            return {
              ...item,
              x: currentX, // 明确保留 x 坐标
              y: currentY, // 明确保留 y 坐标
              w: currentW, // 明确保留宽度
              h: targetHeight,
              minH: 5,
              static: false // 允许被推开其他组件
            }
          }
          return item
        })
      })
      // 立即保存,防止被后续的 onLayoutChange 覆盖
      saveLayoutToStorage(STORAGE_KEY_DAILY, newLayouts)
      return newLayouts
    })
    
    // 延迟重置标志,等待 react-grid-layout 完成布局更新
    setTimeout(() => {
      isExpandingRef.current = false
    }, 200)
  }, [])

  // 当用户手动调整布局时,保存新的布局
  const handleLayoutChange = useCallback((layout: Layout[], allLayouts: Record<string, Layout[]>): void => {
    // 如果是展开/收起触发的布局变化,忽略以防止位置被重置
    if (isExpandingRef.current) {
      return
    }
    
    // 更新收起状态的高度记录
    if (!consumptionExpanded) {
      Object.keys(allLayouts).forEach((breakpoint) => {
        const item = allLayouts[breakpoint].find((i) => i.i === 'consumption-monitor')
        if (item && item.h < 15) {
          collapsedHeightRef.current[breakpoint] = item.h
        }
      })
    }
    
    setCurrentLayouts(allLayouts)
    // 保存到 localStorage
    saveLayoutToStorage(STORAGE_KEY_DAILY, allLayouts)
  }, [consumptionExpanded])

  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={breakpoints}
      cols={cols}
      layouts={currentLayouts}
      rowHeight={40}
      margin={[16, 16]}
      draggableHandle=".sa-chart-header"
      onLayoutChange={handleLayoutChange}
      isDraggable={true}
      isResizable={true}
      useCSSTransforms={true}
      compactType={null}
      preventCollision={false}
      allowOverlap={true}
    >
      <div key="production-line-chart" style={{ display: 'flex', flexDirection: 'column' }}>
        <ProductionLineChart />
      </div>
      <div key="storage-tanks" style={{ display: 'flex', flexDirection: 'column' }}>
        <StorageTanks />
      </div>
      <div key="consumption-monitor" style={{ display: 'flex', flexDirection: 'column' }}>
        <ConsumptionMonitor onExpandChange={handleExpandChange} />
      </div>
      <div key="production-ring-chart" style={{ display: 'flex', flexDirection: 'column' }}>
        <ProductionRingChart />
      </div>
      <div key="yearly-downtime-timeline" style={{ display: 'flex', flexDirection: 'column' }}>
        <YearlyDowntimeTimeline />
      </div>
    </ResponsiveGridLayout>
  )
}

function YearlyReportGrid(): React.JSX.Element {
  // 使用 useMemo 确保初始化只执行一次
  const initialLayouts = useMemo(
    () => loadLayoutFromStorage(STORAGE_KEY_YEARLY, defaultYearlyLayout),
    []
  )
  
  const [currentLayouts, setCurrentLayouts] = useState<Record<string, Layout[]>>(initialLayouts)

  // 当用户手动调整布局时，保存新的布局
  const handleLayoutChange = (layout: Layout[], allLayouts: Record<string, Layout[]>): void => {
    setCurrentLayouts(allLayouts)
    // 保存到 localStorage
    saveLayoutToStorage(STORAGE_KEY_YEARLY, allLayouts)
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={breakpoints}
      cols={cols}
      layouts={currentLayouts}
      rowHeight={40}
      margin={[16, 16]}
      draggableHandle=".sa-chart-header"
      onLayoutChange={handleLayoutChange}
      isDraggable={true}
      isResizable={true}
      useCSSTransforms={true}
      compactType={null}
      preventCollision={false}
      allowOverlap={true}
    >
      <div key="monthly-treemap" style={{ display: 'flex', flexDirection: 'column' }}>
        <MonthlyTreemap />
      </div>
    </ResponsiveGridLayout>
  )
}

function DashboardLayout(): React.JSX.Element {
  const [currentReport, setCurrentReport] = useState<ReportType>('daily')

  const handleReportChange = (type: ReportType): void => {
    setCurrentReport(type)
  }

  return (
    <div className="dashboard-content">
      <Header currentReport={currentReport} onReportChange={handleReportChange} />

      <div className="dashboard-main">
        {currentReport === 'daily' ? <DailyReportGrid /> : <YearlyReportGrid />}
      </div>
    </div>
  )
}

export default DashboardLayout
